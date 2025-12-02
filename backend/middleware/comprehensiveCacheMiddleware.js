/**
 * 🚀 COMPREHENSIVE CACHE MIDDLEWARE
 * 100% Endpoint Coverage with Smart Invalidation
 */

const queryCacheManager = require('../utils/queryCacheManager');
const { CACHE_STRATEGY } = require('../COMPREHENSIVE-CACHING-STRATEGY');

/**
 * Get TTL for a specific route
 */
function getTTLForRoute(path, method) {
  // Check if it's a write operation
  if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(method)) {
    return 0; // No cache for writes
  }

  // Match route pattern
  for (const [type, config] of Object.entries(CACHE_STRATEGY)) {
    if (config.Routes && Array.isArray(config.Routes)) {
      for (const route of config.Routes) {
        // Simple pattern matching
        const pattern = route.replace(/:\w+/g, '[^/]+').replace(/\//g, '\\/').replace(/\*/g, '.*');

        if (new RegExp(`^${pattern}$`).test(path)) {
          return config.TTL;
        }
      }
    }
  }

  // Default: cache GET requests for 5 minutes
  return method === 'GET' ? 300 : 0;
}

/**
 * Comprehensive cache middleware
 */
const comprehensiveCacheMiddleware = (req, res, next) => {
  // Only cache GET requests
  if (req.method !== 'GET') {
    // Invalidate related cache on write operations
    if (['POST', 'PUT', 'DELETE'].includes(req.method)) {
      invalidateCacheForRoute(req.path);
    }
    return next();
  }

  const ttl = getTTLForRoute(req.path, req.method);

  // Skip if TTL is 0
  if (ttl === 0) {
    return next();
  }

  // Generate cache key
  const cacheKey = `http:${req.method}:${req.path}:${JSON.stringify(req.query)}`;

  // Check cache
  const cached = queryCacheManager.get(cacheKey);
  if (cached) {
    res.set('X-Cache', 'HIT');
    res.set('X-Cache-TTL', ttl.toString());
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
  res.set('X-Cache-TTL', ttl.toString());

  next();
};

/**
 * Invalidate cache for related route
 */
function invalidateCacheForRoute(path) {
  // Invalidate common patterns
  if (path.includes('/users')) {
    queryCacheManager.invalidatePattern('users:*');
  }
  if (path.includes('/tenders')) {
    queryCacheManager.invalidatePattern('tenders:*');
    queryCacheManager.invalidatePattern('search:*');
  }
  if (path.includes('/offers')) {
    queryCacheManager.invalidatePattern('offers:*');
  }
  if (path.includes('/purchase-orders') || path.includes('/po')) {
    queryCacheManager.invalidatePattern('purchase-orders:*');
  }
  if (path.includes('/invoices')) {
    queryCacheManager.invalidatePattern('invoices:*');
  }
  if (path.includes('/messages')) {
    queryCacheManager.invalidatePattern('messages:*');
  }
  if (path.includes('/reviews')) {
    queryCacheManager.invalidatePattern('reviews:*');
  }
}

module.exports = comprehensiveCacheMiddleware;
module.exports.getTTLForRoute = getTTLForRoute;
module.exports.invalidateCacheForRoute = invalidateCacheForRoute;
