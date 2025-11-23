/**
 * 🚀 CACHING MIDDLEWARE
 * Intelligent response caching to reduce database queries
 * Caches: GET requests for tenders, offers, company profiles
 * TTL: Configurable per route (default 5 minutes)
 */

class CacheManager {
  constructor() {
    this.cache = new Map();
    this.ttls = new Map();
  }

  /**
   * Set cache value with TTL
   * @param {string} key - Cache key
   * @param {any} value - Value to cache
   * @param {number} ttl - Time to live in seconds (default: 300)
   */
  set(key, value, ttl = 300) {
    this.cache.set(key, value);
    
    if (this.ttls.has(key)) {
      clearTimeout(this.ttls.get(key));
    }
    
    const timeout = setTimeout(() => {
      this.cache.delete(key);
      this.ttls.delete(key);
    }, ttl * 1000);
    
    this.ttls.set(key, timeout);
  }

  /**
   * Get cached value
   */
  get(key) {
    return this.cache.get(key);
  }

  /**
   * Clear specific cache
   */
  clear(key) {
    if (this.ttls.has(key)) {
      clearTimeout(this.ttls.get(key));
    }
    this.cache.delete(key);
    this.ttls.delete(key);
  }

  /**
   * Clear all caches matching pattern
   */
  clearPattern(pattern) {
    const regex = new RegExp(pattern);
    for (const [key] of this.cache) {
      if (regex.test(key)) {
        this.clear(key);
      }
    }
  }

  /**
   * Get cache stats
   */
  getStats() {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys())
    };
  }
}

const cacheManager = new CacheManager();

/**
 * Cache middleware for GET requests
 * @param {number} ttl - Time to live in seconds
 */
const cacheMiddleware = (ttl = 300) => {
  return (req, res, next) => {
    if (req.method !== 'GET') {
      return next();
    }

    const cacheKey = `${req.user?.id || 'anon'}:${req.originalUrl}`;
    const cachedData = cacheManager.get(cacheKey);

    if (cachedData) {
      res.set('X-Cache', 'HIT');
      return res.json(cachedData);
    }

    const originalJson = res.json.bind(res);

    res.json = function(data) {
      if (res.statusCode === 200) {
        cacheManager.set(cacheKey, data, ttl);
      }
      res.set('X-Cache', 'MISS');
      return originalJson(data);
    };

    next();
  };
};

/**
 * Add cache control headers
 */
const cacheControlHeaders = (maxAge = 300) => {
  return (req, res, next) => {
    if (req.method === 'GET') {
      res.set('Cache-Control', `public, max-age=${maxAge}`);
      res.set('ETag', `"${Math.random().toString(36).substr(2, 9)}"`);
    } else {
      res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    }
    next();
  };
};

module.exports = {
  cacheManager,
  cacheMiddleware,
  cacheControlHeaders
};
