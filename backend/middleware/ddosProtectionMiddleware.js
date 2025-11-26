/**
 * DDoS Protection & Advanced Rate Limiting Middleware
 * Prevents distributed denial of service attacks
 */

const rateLimit = require('express-rate-limit');
const { REQUEST_SIZE_LIMIT } = require('../config/appConstants');
const { logger } = require('../utils/logger');

/**
 * Strict rate limiter for sensitive endpoints
 */
const sensitiveEndpointLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 requests per window
  message: 'Too many attempts, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => req.user?.isAdmin === true // Skip for admins
});

/**
 * Moderate rate limiter for API endpoints
 */
const apiEndpointLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 30, // 30 requests per minute
  message: 'Rate limit exceeded',
  standardHeaders: true,
  legacyHeaders: false
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
  skipSuccessfulRequests: false
});

/**
 * Slow down limiter for upload endpoints
 */
const uploadLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 3, // 3 uploads per minute
  message: 'Too many uploads, please wait',
  standardHeaders: true,
  legacyHeaders: false
});

/**
 * Global DDoS protection middleware
 */
function ddosProtectionMiddleware(req, res, next) {
  // Track request rate by IP
  const ip = req.ip || req.connection.remoteAddress;
  const path = req.path;
  
  // Store request timestamp
  if (!req.app.locals.requestTimestamps) {
    req.app.locals.requestTimestamps = new Map();
  }

  const key = `${ip}:${path}`;
  const timestamps = req.app.locals.requestTimestamps.get(key) || [];
  
  const now = Date.now();
  const recentRequests = timestamps.filter(t => now - t < 60000); // Last 60 seconds
  
  // DDoS detection: More than 100 requests from same IP in 60s
  if (recentRequests.length > 100) {
    logger.warn('DDOS_ATTACK_DETECTED', { ip, path, requestCount: recentRequests.length });
    return res.status(429).json({
      success: false,
      error: {
        message: 'Too many requests. Access temporarily blocked.',
        code: 'DDOS_PROTECTION_ACTIVE'
      }
    });
  }

  recentRequests.push(now);
  req.app.locals.requestTimestamps.set(key, recentRequests);

  next();
}

/**
 * Exponential backoff rate limiter
 * Increases wait time with each failed attempt
 */
function exponentialBackoffLimiter(options = {}) {
  const {
    windowMs = 60000,
    baseDelay = 100,
    maxDelay = 3600000, // 1 hour
    maxAttempts = 10
  } = options;

  const attempts = new Map();

  return (req, res, next) => {
    const key = req.ip;
    const now = Date.now();

    let attemptData = attempts.get(key);
    if (!attemptData || now - attemptData.resetTime > windowMs) {
      attemptData = { count: 0, resetTime: now };
    }

    attemptData.count++;

    if (attemptData.count > maxAttempts) {
      const delay = Math.min(
        baseDelay * Math.pow(2, attemptData.count - maxAttempts),
        maxDelay
      );
      
      res.set('Retry-After', Math.ceil(delay / 1000));
      
      return res.status(429).json({
        success: false,
        error: {
          message: `Too many attempts. Please wait ${Math.ceil(delay / 1000)} seconds`,
          code: 'RATE_LIMIT_EXCEEDED',
          retryAfter: Math.ceil(delay / 1000)
        }
      });
    }

    attempts.set(key, attemptData);
    next();
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
          code: 'PAYLOAD_TOO_LARGE'
        }
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
  requestSizeValidation
};
