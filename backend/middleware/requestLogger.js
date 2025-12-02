/**
 * 📝 REQUEST LOGGER
 * Improved request logging with structured format
 */

const requestLogger = (req, res, next) => {
  const start = Date.now();
  const requestId = req.id || 'unknown';

  // Log request with proper body handling
  const logData = {
    id: requestId,
    method: req.method,
    path: req.path,
    query: Object.keys(req.query).length > 0 ? req.query : undefined,
    params: Object.keys(req.params).length > 0 ? req.params : undefined,
    ip: req.ip || req.connection.remoteAddress,
    userAgent: req.get('user-agent'),
    userId: req.user?.id || req.user?.userId || undefined,
    timestamp: new Date().toISOString(),
    body: req.body && Object.keys(req.body).length > 0 ? Object.keys(req.body) : undefined,
  };

  // Track response
  const originalSend = res.send;
  res.send = function (data) {
    const duration = Date.now() - start;

    logData.statusCode = res.statusCode;
    logData.responseTime = duration + 'ms';
    logData.cached = res.getHeader('X-Cache') || 'N/A';
    logData.isError = res.statusCode >= 400;

    // Log formatted request
    if (process.env.LOG_LEVEL !== 'silent') {
      const eventType = logData.isError ? 'ERROR' : 'REQUEST';
      console.log(
        `[${eventType}] ${logData.method} ${logData.path} - ${logData.statusCode} (${logData.responseTime})`,
        {
          requestId: logData.id,
          userId: logData.userId,
          endpoint: logData.path,
        }
      );
    }

    return originalSend.call(this, data);
  };

  next();
};

module.exports = requestLogger;
