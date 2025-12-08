
/**
 * DDoS Protection & Advanced Rate Limiting Middleware
 * Uses Redis for distributed state management
 */

const rateLimit = require('express-rate-limit');
const { REQUEST_SIZE_LIMIT } = require('../config/appConstants');
const { logger } = require('../utils/logger');
const { getCacheManager } = require('../utils/redisCache');

/**
 * Strict rate limiter for sensitive endpoints
 */
const sensitiveEndpointLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 requests per window
  message: 'Too many attempts, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => req.user?.isAdmin === true,
});

/**
 * Moderate rate limiter for API endpoints
 */
const apiEndpointLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 30, // 30 requests per minute
  message: 'Rate limit exceeded',
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Strict rate limiter for auth endpoints
 */
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts
  message: 'Too many login attempts',
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: false,
});

/**
 * Slow down limiter for upload endpoints
 */
const uploadLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 3, // 3 uploads per minute
  message: 'Too many uploads, please wait',
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Global DDoS protection middleware using Redis
 */
async function ddosProtectionMiddleware(req, res, next) {
  const ip = req.ip || req.connection.remoteAddress;
  const path = req.path;
  const cacheManager = getCacheManager();

  try {
    const key = `ddos:${ip}:${path}`;
    const now = Date.now();
    
    // Get request timestamps from Redis
    let timestamps = await cacheManager.get(key) || [];
    
    // Filter recent requests (last 60 seconds)
    const recentRequests = timestamps.filter((t) => now - t < 60000);

    // DDoS detection: More than 100 requests from same IP in 60s
    if (recentRequests.length > 100) {
      logger.warn('DDOS_ATTACK_DETECTED', { ip, path, requestCount: recentRequests.length });
      return res.status(429).json({
        success: false,
        error: {
          message: 'Too many requests. Access temporarily blocked.',
          code: 'DDOS_PROTECTION_ACTIVE',
        },
      });
    }

    // Add current timestamp and save to Redis with 60s TTL
    recentRequests.push(now);
    await cacheManager.set(key, recentRequests, 60);

    next();
  } catch (error) {
    // On Redis failure, fallback to allowing request but log error
    logger.error('DDOS_PROTECTION_ERROR', { error: error.message, ip, path });
    next();
  }
}

/**
 * Exponential backoff rate limiter using Redis
 */
function exponentialBackoffLimiter(options = {}) {
  const {
    windowMs = 60000,
    baseDelay = 100,
    maxDelay = 3600000, // 1 hour
    maxAttempts = 10,
  } = options;

  return async (req, res, next) => {
    const key = `backoff:${req.ip}`;
    const now = Date.now();
    const cacheManager = getCacheManager();

    try {
      let attemptData = await cacheManager.get(key);
      
      if (!attemptData || now - attemptData.resetTime > windowMs) {
        attemptData = { count: 0, resetTime: now };
      }

      attemptData.count++;

      if (attemptData.count > maxAttempts) {
        const delay = Math.min(baseDelay * Math.pow(2, attemptData.count - maxAttempts), maxDelay);

        res.set('Retry-After', Math.ceil(delay / 1000));

        return res.status(429).json({
          success: false,
          error: {
            message: `Too many attempts. Please wait ${Math.ceil(delay / 1000)} seconds`,
            code: 'RATE_LIMIT_EXCEEDED',
            retryAfter: Math.ceil(delay / 1000),
          },
        });
      }

      await cacheManager.set(key, attemptData, Math.ceil(windowMs / 1000));
      next();
    } catch (error) {
      logger.error('BACKOFF_LIMITER_ERROR', { error: error.message });
      next();
    }
  };
}

/**
 * Request size validation to prevent buffer attacks
 */
function requestSizeValidation(maxSize = REQUEST_SIZE_LIMIT.FORMAT) {
  return (req, res, next) => {
    const contentLength = req.get('content-length');

    if (contentLength && contentLength > REQUEST_SIZE_LIMIT.MAX_BYTES) {
      logger.warn('OVERSIZED_REQUEST', { ip: req.ip, size: contentLength });
      return res.status(413).json({
        success: false,
        error: {
          message: 'Request payload too large',
          code: 'PAYLOAD_TOO_LARGE',
        },
      });
    }

    next();
  };
}

module.exports = {
  sensitiveEndpointLimiter,
  apiEndpointLimiter,
  authLimiter,
  uploadLimiter,
  ddosProtectionMiddleware,
  exponentialBackoffLimiter,
  requestSizeValidation,
};
