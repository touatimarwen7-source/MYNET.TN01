
/**
 * Request Logging Middleware
 * Logs all incoming requests and responses
 */

const { logger } = require('../utils/logger');

/**
 * Middleware pour logger les requêtes
 */
const requestLoggingMiddleware = (req, res, next) => {
  const start = Date.now();
  
  // Log request
  logger.info('Incoming Request', {
    method: req.method,
    path: req.path,
    query: req.query,
    ip: req.ip,
    userId: req.user?.id
  });

  // Capture response
  const originalSend = res.send;
  res.send = function(data) {
    const duration = Date.now() - start;
    
    logger.info('Request Completed', {
      method: req.method,
      path: req.path,
      status: res.statusCode,
      duration: `${duration}ms`,
      userId: req.user?.id
    });
    
    return originalSend.call(this, data);
  };

  next();
};

/**
 * Middleware pour logger les erreurs
 */
const errorLoggingMiddleware = (err, req, res, next) => {
  logger.error('Request Error', {
    method: req.method,
    path: req.path,
    error: err.message,
    stack: err.stack,
    userId: req.user?.id
  });

  next(err);
};

module.exports = {
  requestLoggingMiddleware,
  errorLoggingMiddleware
};
