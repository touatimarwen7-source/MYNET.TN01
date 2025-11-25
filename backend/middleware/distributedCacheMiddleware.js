/**
 * 🚀 Distributed Cache Middleware
 * 
 * Uses Redis for distributed caching with in-memory fallback
 */

const { getCacheManager } = require('../utils/redisCache');
const { CACHE_STRATEGY } = require('../COMPREHENSIVE-CACHING-STRATEGY');

const cacheManager = getCacheManager();

/**
 * Get TTL for a specific route
 */
function getTTLForRoute(path, method) {
  if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(method)) {
    return 0;
  }

  for (const [type, config] of Object.entries(CACHE_STRATEGY)) {
    if (config.Routes && Array.isArray(config.Routes)) {
      for (const route of config.Routes) {
        const pattern = route
          .replace(/:\w+/g, '[^/]+')
          .replace(/\//g, '\\/')
          .replace(/\*/g, '.*');
        
        if (new RegExp(`^${pattern}$`).test(path)) {
          return config.TTL;
        }
      }
    }
  }

  return method === 'GET' ? 300 : 0;
}

/**
 * Invalidate cache for route
 */
async function invalidateCacheForRoute(path) {
  if (path.includes('/users')) {
    await cacheManager.invalidatePattern('users:*');
  }
  if (path.includes('/tenders')) {
    await cacheManager.invalidatePattern('tenders:*');
    await cacheManager.invalidatePattern('search:*');
  }
  if (path.includes('/offers')) {
    await cacheManager.invalidatePattern('offers:*');
  }
  if (path.includes('/purchase-orders') || path.includes('/po')) {
    await cacheManager.invalidatePattern('purchase-orders:*');
  }
  if (path.includes('/invoices')) {
    await cacheManager.invalidatePattern('invoices:*');
  }
  if (path.includes('/messages')) {
    await cacheManager.invalidatePattern('messages:*');
  }
  if (path.includes('/reviews')) {
    await cacheManager.invalidatePattern('reviews:*');
  }
}

/**
 * Distributed cache middleware
 */
const distributedCacheMiddleware = (req, res, next) => {
  // Handle write operations - invalidate cache
  if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(req.method)) {
    invalidateCacheForRoute(req.path);
    return next();
  }

  // Cache GET requests only
  if (req.method !== 'GET') {
    return next();
  }

  const ttl = getTTLForRoute(req.path, req.method);
  if (ttl === 0) {
    return next();
  }

  const cacheKey = `http:${req.method}:${req.path}:${JSON.stringify(req.query)}`;

  // Check cache
  (async () => {
    try {
      const cached = await cacheManager.get(cacheKey);
      if (cached) {
        res.set('X-Cache', 'HIT');
        res.set('X-Cache-TTL', ttl.toString());
        res.set('X-Cache-Engine', 'Redis');
        return res.json(cached);
      }

      // Cache miss - wrap response
      const originalJson = res.json.bind(res);
      res.json = function(data) {
        if (res.statusCode === 200) {
          cacheManager.set(cacheKey, data, ttl);
          res.set('X-Cache', 'MISS');
        }
        return originalJson(data);
      };

      res.set('Cache-Control', `public, max-age=${ttl}`);
      res.set('X-Cache-TTL', ttl.toString());
      res.set('X-Cache-Engine', 'Redis');

      next();
    } catch (error) {
      next();
    }
  })();
};

module.exports = distributedCacheMiddleware;
module.exports.getTTLForRoute = getTTLForRoute;
module.exports.invalidateCacheForRoute = invalidateCacheForRoute;
module.exports.getCacheManager = () => cacheManager;
