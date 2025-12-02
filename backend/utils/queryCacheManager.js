/**
 * Query Cache Manager
 * Implements intelligent caching with TTL and pattern-based invalidation
 *
 * @module queryCacheManager
 * @example
 * const cacheManager = require('./queryCacheManager');
 * const cached = await cacheManager.withCache('users:list', 300, () => db.query('SELECT * FROM users'));
 */

class QueryCacheManager {
  constructor() {
    this.cache = new Map();
    this.timers = new Map();
    this.stats = {
      hits: 0,
      misses: 0,
      evictions: 0,
    };
  }

  /**
   * Generate cache key from query and parameters
   * @param {string} query - Query identifier
   * @param {*} params - Query parameters
   * @returns {string} Cache key
   */
  generateKey(query, params = null) {
    if (!params) return query;
    const paramStr = JSON.stringify(params);
    return `${query}:${Buffer.from(paramStr).toString('base64')}`;
  }

  /**
   * Get value from cache with TTL support
   * @param {string} key - Cache key
   * @returns {*} Cached value or null
   */
  get(key) {
    if (this.cache.has(key)) {
      this.stats.hits++;
      return this.cache.get(key);
    }
    this.stats.misses++;
    return null;
  }

  /**
   * Set value in cache with TTL (seconds)
   * @param {string} key - Cache key
   * @param {*} value - Value to cache
   * @param {number} ttl - Time to live in seconds
   */
  set(key, value, ttl = 300) {
    // Clear existing timer if any
    if (this.timers.has(key)) {
      clearTimeout(this.timers.get(key));
    }

    // Store value
    this.cache.set(key, value);

    // Set expiration
    if (ttl > 0) {
      const timer = setTimeout(() => {
        this.cache.delete(key);
        this.timers.delete(key);
        this.stats.evictions++;
      }, ttl * 1000);

      this.timers.set(key, timer);
    }
  }

  /**
   * Execute function with caching
   * @async
   * @param {string} key - Cache key
   * @param {number} ttl - TTL in seconds
   * @param {Function} fn - Function to execute
   * @returns {*} Cached or fresh value
   */
  async withCache(key, ttl, fn) {
    // Try cache first
    const cached = this.get(key);
    if (cached) return cached;

    // Execute function
    const result = await fn();

    // Store in cache
    this.set(key, result, ttl);

    return result;
  }

  /**
   * Invalidate cache by pattern (supports wildcards)
   * @param {string} pattern - Pattern to match (e.g., "users:*")
   */
  invalidatePattern(pattern) {
    let invalidated = 0;

    // Convert pattern to regex
    const regex = new RegExp(`^${pattern.replace(/\*/g, '.*')}$`);

    for (const key of this.cache.keys()) {
      if (regex.test(key)) {
        this.cache.delete(key);
        if (this.timers.has(key)) {
          clearTimeout(this.timers.get(key));
          this.timers.delete(key);
        }
        invalidated++;
      }
    }

    return invalidated;
  }

  /**
   * Clear all cache
   */
  clear() {
    this.cache.forEach((_, key) => {
      if (this.timers.has(key)) {
        clearTimeout(this.timers.get(key));
      }
    });
    this.cache.clear();
    this.timers.clear();
  }

  /**
   * Get cache statistics
   * @returns {Object} Cache stats
   */
  getStats() {
    const total = this.stats.hits + this.stats.misses;
    const hitRate = total > 0 ? ((this.stats.hits / total) * 100).toFixed(2) : 0;

    return {
      hits: this.stats.hits,
      misses: this.stats.misses,
      evictions: this.stats.evictions,
      total,
      hitRate: `${hitRate}%`,
      cachedItems: this.cache.size,
    };
  }

  /**
   * Reset statistics
   */
  resetStats() {
    this.stats = { hits: 0, misses: 0, evictions: 0 };
  }
}

module.exports = new QueryCacheManager();
