/**
 * Request/Response Logging Middleware
 * Comprehensive logging for debugging and monitoring
 */

const { logger } = require('../utils/logger');

/**
 * Logging middleware for all requests and responses
 */
function requestLoggingMiddleware(req, res, next) {
  // Store original response methods
  const originalJson = res.json.bind(res);
  const originalSend = res.send.bind(res);

  // Capture request info
  const requestId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  const startTime = Date.now();
  const requestInfo = {
    id: requestId,
    method: req.method,
    path: req.path,
    query: Object.keys(req.query).length > 0 ? req.query : undefined,
    params: Object.keys(req.params).length > 0 ? req.params : undefined,
    ip: req.ip || req.connection.remoteAddress,
    userAgent: req.get('user-agent'),
    userId: req.user?.id || req.user?.userId || undefined,
    timestamp: new Date().toISOString()
  };

  // Attach requestId to response locals
  res.locals.requestId = requestId;

  // Log incoming request
  logger.info('REQUEST_RECEIVED', {
    ...requestInfo,
    body: req.method !== 'GET' ? (req.body ? Object.keys(req.body) : undefined) : undefined
  });

  // Override response.json()
  res.json = function(data) {
    const responseTime = Date.now() - startTime;
    const isError = res.statusCode >= 400;
    
    logger.info('RESPONSE_SENT', {
      requestId,
      method: req.method,
      path: req.path,
      statusCode: res.statusCode,
      responseTime: `${responseTime}ms`,
      dataKeys: data && typeof data === 'object' ? Object.keys(data).slice(0, 5) : 'N/A',
      isError
    });

    return originalJson.call(this, data);
  };

  // Override response.send()
  res.send = function(data) {
    const responseTime = Date.now() - startTime;
    const isError = res.statusCode >= 400;
    
    logger.info('RESPONSE_SENT', {
      requestId,
      method: req.method,
      path: req.path,
      statusCode: res.statusCode,
      responseTime: `${responseTime}ms`,
      isError
    });

    return originalSend.call(this, data);
  };

  next();
}

/**
 * Error logging middleware
 */
function errorLoggingMiddleware(err, req, res, next) {
  const requestId = res.locals?.requestId || 'UNKNOWN';
  
  const errorInfo = {
    requestId,
    method: req.method,
    path: req.path,
    statusCode: err.statusCode || res.statusCode || 500,
    message: err.message,
    code: err.code || 'INTERNAL_ERROR',
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    timestamp: new Date().toISOString()
  };

  // Log based on status code
  if (err.statusCode >= 500) {
    logger.error('SERVER_ERROR', errorInfo);
  } else if (err.statusCode >= 400) {
    logger.warn('CLIENT_ERROR', errorInfo);
  } else {
    logger.info('ERROR', errorInfo);
  }

  next(err);
}

module.exports = {
  requestLoggingMiddleware,
  errorLoggingMiddleware
};
