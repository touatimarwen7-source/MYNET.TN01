/**
 * CORS Security Headers Middleware
 * Comprehensive security headers for production
 */

const cors = require('cors');

/**
 * CORS configuration with security options
 */
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests from frontend
    const allowedOrigins = [
      process.env.FRONTEND_URL || 'http://localhost:5000',
      'http://localhost:5000',
      'http://localhost:3000',
      process.env.REPLIT_ORIGIN || 'http://127.0.0.1:5000',
    ];

    // Add Replit domain if available
    if (process.env.REPLIT_DOMAINS) {
      const replitDomains = process.env.REPLIT_DOMAINS.split(',');
      replitDomains.forEach((domain) => {
        allowedOrigins.push(`https://${domain.trim()}`);
        allowedOrigins.push(`http://${domain.trim()}`);
      });
    }

    // Allow requests without origin (mobile apps, curl, etc)
    if (!origin) {
      callback(null, true);
    } else if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else if (origin && origin.includes('.riker.replit.dev')) {
      // Allow any Replit domain as fallback
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'X-CSRF-Token',
    'Accept',
    'Accept-Language',
    'Content-Language',
  ],
  exposedHeaders: [
    'X-Total-Count',
    'X-Page-Count',
    'X-Request-ID',
    'Content-Range',
    'X-RateLimit-Limit',
    'X-RateLimit-Remaining',
    'X-RateLimit-Reset',
  ],
  maxAge: 3600, // 1 hour
  preflightContinue: false,
};

/**
 * Security headers middleware
 */
function securityHeadersMiddleware(req, res, next) {
  // Prevent clickjacking
  res.setHeader('X-Frame-Options', 'DENY');

  // Prevent MIME type sniffing
  res.setHeader('X-Content-Type-Options', 'nosniff');

  // Enable XSS protection
  res.setHeader('X-XSS-Protection', '1; mode=block');

  // Referrer policy
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');

  // Permissions policy
  res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=(), payment=()');

  // Content Security Policy (strict)
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self'; frame-ancestors 'none';"
  );

  // Strict Transport Security (HSTS)
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');

  // Cache control for sensitive resources
  if (req.path.includes('/api/')) {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
  }

  // Add request ID header for tracking
  res.setHeader('X-Request-ID', res.locals?.requestId || 'N/A');

  next();
}

/**
 * Rate limiting headers
 */
function rateLimitHeadersMiddleware(limit, window) {
  return (req, res, next) => {
    res.setHeader('X-RateLimit-Limit', limit);
    res.setHeader('X-RateLimit-Remaining', limit - 1);
    res.setHeader('X-RateLimit-Reset', Math.ceil((Date.now() + window) / 1000));
    next();
  };
}

module.exports = {
  corsOptions,
  corsMiddleware: cors(corsOptions),
  securityHeadersMiddleware,
  rateLimitHeadersMiddleware,
};
