// Performance monitoring middleware
const performanceMiddleware = (req, res, next) => {
  const startTime = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    
    // Log slow requests (optional)
    if (duration > 1000) {
    }
    
    // Track response time
    req.responseTime = duration;
  });
  
  next();
};

module.exports = performanceMiddleware;
