
/**
 * General Logging Middleware
 * Production-ready request/response logging
 */

const { logger } = require('../utils/logger');

const loggingMiddleware = (req, res, next) => {
  const startTime = Date.now();
  const { method, path, ip } = req;

  // Log request start
  logger.info(`→ ${method} ${path}`, {
    ip,
    userAgent: req.get('user-agent'),
    userId: req.user?.id
  });

  // Override res.json to capture response
  const originalJson = res.json.bind(res);
  res.json = function(data) {
    const duration = Date.now() - startTime;
    
    logger.info(`← ${method} ${path} - ${res.statusCode}`, {
      duration: `${duration}ms`,
      status: res.statusCode,
      userId: req.user?.id
    });

    return originalJson(data);
  };

  next();
};

module.exports = loggingMiddleware;
