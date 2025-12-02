/**
 * HTTP Response Caching Middleware
 * Caches GET request responses with Cache-Control headers
 *
 * @module cacheMiddleware
 * @example
 * app.use(cacheMiddleware({ ttl: 300 }));
 */

const queryCacheManager = require('../utils/queryCacheManager');

/**
 * Cache middleware for GET requests
 * @param {Object} options - Configuration
 * @param {number} options.ttl - Default TTL in seconds
 * @param {Array} options.excludePaths - Paths to exclude from caching
 */
const cacheMiddleware = (options = {}) => {
  const { ttl = 300, excludePaths = [] } = options;

  return (req, res, next) => {
    // Only cache GET requests
    if (req.method !== 'GET') {
      return next();
    }

    // Skip excluded paths
    if (excludePaths.some((path) => req.path.includes(path))) {
      return next();
    }

    // Generate cache key
    const cacheKey = `http:${req.method}:${req.path}:${JSON.stringify(req.query)}`;

    // Check cache
    const cached = queryCacheManager.get(cacheKey);
    if (cached) {
      res.set('X-Cache', 'HIT');
      return res.json(cached);
    }

    // Wrap res.json to cache response
    const originalJson = res.json.bind(res);
    res.json = function (data) {
      // Only cache successful responses
      if (res.statusCode === 200) {
        queryCacheManager.set(cacheKey, data, ttl);
        res.set('X-Cache', 'MISS');
      }
      return originalJson(data);
    };

    // Add Cache-Control headers
    res.set('Cache-Control', `public, max-age=${ttl}`);

    next();
  };
};

module.exports = cacheMiddleware;
module.exports.cacheMiddleware = cacheMiddleware;
