// Logging middleware for error tracking
const loggingMiddleware = (req, res, next) => {
  const startTime = Date.now();
  
  // Capture original res.json
  const originalJson = res.json;
  
  res.json = function(data) {
    const duration = Date.now() - startTime;
    const logEntry = {
      timestamp: new Date().toISOString(),
      method: req.method,
      path: req.path,
      status: res.statusCode,
      duration: `${duration}ms`,
      userId: req.user?.id || 'anonymous',
      ip: req.ip
    };
    
    // Log errors
    if (res.statusCode >= 400) {
      console.error(`[${logEntry.status}] ${logEntry.method} ${logEntry.path}`, logEntry);
    }
    
    // Call original json
    return originalJson.call(this, data);
  };
  
  next();
};

module.exports = loggingMiddleware;
