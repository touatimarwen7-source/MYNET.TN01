/**
 * Redis Cache Helper
 * Centralized caching layer for database query optimization
 * Reduces N+1 queries and improves API response times
 */

const redis = require('redis');

class CacheHelper {
  constructor() {
    this.client = null;
    this.defaultTTL = 3600; // 1 hour default
    this.isConnected = false;
  }

  /**
   * Initialize Redis connection
   * @async
   * @returns {Promise<void>}
   */
  async initialize() {
    try {
      this.client = redis.createClient({
        host: process.env.REDIS_HOST || 'localhost',
        port: process.env.REDIS_PORT || 6379,
        db: process.env.REDIS_DB || 0,
        retry_strategy: (options) => {
          if (options.error && options.error.code === 'ECONNREFUSED') {
            return new Error('Redis connection refused');
          }
          if (options.total_retry_time > 1000 * 60 * 60) {
            return new Error('Redis retry time exhausted');
          }
          if (options.attempt > 10) {
            return undefined;
          }
          return Math.min(options.attempt * 100, 3000);
        }
      });

      this.client.on('connect', () => {
        this.isConnected = true;
      });

      this.client.on('error', (err) => {
        this.isConnected = false;
      });

      this.client.on('reconnecting', () => {
        this.isConnected = false;
      });
    } catch (error) {
    }
  }

  /**
   * Set cache value with optional TTL
   * @async
   * @param {string} key - Cache key
   * @param {*} value - Value to cache (converted to JSON)
   * @param {number} [ttl] - Time-to-live in seconds
   * @returns {Promise<boolean>} Success status
   */
  async set(key, value, ttl = this.defaultTTL) {
    if (!this.isConnected || !this.client) return false;

    try {
      const serialized = JSON.stringify(value);
      if (ttl) {
        this.client.setex(key, ttl, serialized);
      } else {
        this.client.set(key, serialized);
      }
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Get cached value by key
   * @async
   * @param {string} key - Cache key
   * @returns {Promise<*|null>} Cached value or null
   */
  async get(key) {
    if (!this.isConnected || !this.client) return null;

    try {
      return new Promise((resolve) => {
        this.client.get(key, (err, data) => {
          if (err || !data) {
            resolve(null);
          } else {
            try {
              resolve(JSON.parse(data));
            } catch {
              resolve(null);
            }
          }
        });
      });
    } catch (error) {
      return null;
    }
  }

  /**
   * Delete cache key
   * @async
   * @param {string} key - Cache key to delete
   * @returns {Promise<boolean>} Success status
   */
  async delete(key) {
    if (!this.isConnected || !this.client) return false;

    try {
      this.client.del(key);
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Clear all cache keys matching pattern
   * @async
   * @param {string} pattern - Key pattern (e.g., 'tender:*')
   * @returns {Promise<number>} Number of keys deleted
   */
  async deletePattern(pattern) {
    if (!this.isConnected || !this.client) return 0;

    try {
      return new Promise((resolve) => {
        this.client.keys(pattern, (err, keys) => {
          if (err || !keys.length) {
            resolve(0);
          } else {
            this.client.del(...keys, (err) => {
              resolve(keys.length);
            });
          }
        });
      });
    } catch (error) {
      return 0;
    }
  }

  /**
   * Cache-aside pattern: get from cache or fetch from database
   * @async
   * @param {string} key - Cache key
   * @param {Function} fetchFn - Async function to fetch data if not cached
   * @param {number} [ttl] - Time-to-live in seconds
   * @returns {Promise<*>} Cached or fetched value
   */
  async getOrSet(key, fetchFn, ttl = this.defaultTTL) {
    // Try cache first
    const cached = await this.get(key);
    if (cached !== null) {
      return cached;
    }

    // Fetch from database
    const fresh = await fetchFn();

    // Cache the result
    await this.set(key, fresh, ttl);

    return fresh;
  }

  /**
   * Close Redis connection
   * @async
   * @returns {Promise<void>}
   */
  async close() {
    if (this.client) {
      this.client.quit();
      this.isConnected = false;
    }
  }
}

module.exports = new CacheHelper();
