/**
 * Performance Tracking Middleware
 * Automatically tracks all requests through the performance monitor
 *
 * @module performanceTrackingMiddleware
 * @example
 * app.use(performanceTrackingMiddleware);
 */

const performanceMonitor = require('../utils/performanceMonitor');

/**
 * Middleware to track request performance
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 * @param {Function} next - Express next function
 */
const performanceTrackingMiddleware = (req, res, next) => {
  const endpoint = `${req.method} ${req.path}`;
  const endTracking = performanceMonitor.trackRequest(endpoint);

  // Wrap response.end to capture completion
  const originalEnd = res.end;
  res.end = function (...args) {
    endTracking({
      statusCode: res.statusCode,
      method: req.method,
    });
    return originalEnd.apply(this, args);
  };

  next();
};

module.exports = performanceTrackingMiddleware;
