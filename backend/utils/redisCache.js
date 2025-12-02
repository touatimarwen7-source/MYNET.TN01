/**
 * 🚀 Distributed Redis Cache Manager
 *
 * Implements distributed caching with Redis
 * - Falls back to in-memory cache if Redis unavailable
 * - Automatic connection management
 * - Pattern-based invalidation
 * - Statistics tracking
 */

const redis = require('redis');

// In-memory fallback cache
class MemoryCache {
  constructor() {
    this.cache = new Map();
    this.timers = new Map();
    this.stats = { hits: 0, misses: 0, evictions: 0 };
  }

  get(key) {
    if (this.cache.has(key)) {
      this.stats.hits++;
      return this.cache.get(key);
    }
    this.stats.misses++;
    return null;
  }

  set(key, value, ttl = 300) {
    if (this.timers.has(key)) clearTimeout(this.timers.get(key));
    this.cache.set(key, value);
    if (ttl > 0) {
      const timer = setTimeout(() => {
        this.cache.delete(key);
        this.timers.delete(key);
        this.stats.evictions++;
      }, ttl * 1000);
      this.timers.set(key, timer);
    }
  }

  delete(key) {
    this.cache.delete(key);
  }

  invalidatePattern(pattern) {
    const regex = new RegExp(pattern.replace(/\*/g, '.*'));
    for (const key of this.cache.keys()) {
      if (regex.test(key)) this.cache.delete(key);
    }
  }

  clear() {
    this.cache.clear();
    for (const timer of this.timers.values()) clearTimeout(timer);
    this.timers.clear();
  }
}

class DistributedCacheManager {
  constructor(options = {}) {
    this.options = {
      host: process.env.REDIS_HOST || 'localhost',
      port: process.env.REDIS_PORT || 6379,
      password: process.env.REDIS_PASSWORD || null,
      db: process.env.REDIS_DB || 0,
      socket: {
        reconnectStrategy: (retries) => {
          if (retries > 10) return new Error('Max retries reached');
          return Math.min(retries * 50, 500);
        },
      },
    };

    if (!this.options.password) delete this.options.password;

    this.client = null;
    this.connected = false;
    this.stats = {
      hits: 0,
      misses: 0,
      errors: 0,
      evictions: 0,
      connectionFailures: 0,
    };

    this.memoryCache = new MemoryCache();
    this.initialize();
  }

  async initialize() {
    try {
      this.client = redis.createClient(this.options);

      this.client.on('connect', () => {
        this.connected = true;
      });

      this.client.on('error', (err) => {
        this.stats.errors++;
      });

      this.client.on('reconnecting', () => {});

      await this.client.connect();
    } catch (error) {
      this.stats.connectionFailures++;
      this.connected = false;
    }
  }

  async get(key) {
    try {
      if (this.connected && this.client) {
        const value = await this.client.get(key);
        if (value) {
          this.stats.hits++;
          return JSON.parse(value);
        }
      }
    } catch (error) {
      this.stats.errors++;
    }

    const memValue = this.memoryCache.get(key);
    if (memValue) {
      this.stats.hits++;
      return memValue;
    }

    this.stats.misses++;
    return null;
  }

  async set(key, value, ttl = 300) {
    try {
      if (this.connected && this.client) {
        await this.client.setEx(key, ttl, JSON.stringify(value));
      }
    } catch (error) {
      this.stats.errors++;
    }

    this.memoryCache.set(key, value, ttl);
  }

  async delete(key) {
    try {
      if (this.connected && this.client) {
        await this.client.del(key);
      }
    } catch (error) {
      this.stats.errors++;
    }

    this.memoryCache.delete(key);
  }

  async invalidatePattern(pattern) {
    try {
      if (this.connected && this.client) {
        const keys = await this.client.keys(pattern);
        if (keys.length > 0) {
          await this.client.del(keys);
        }
      }
    } catch (error) {
      this.stats.errors++;
    }

    this.memoryCache.invalidatePattern(pattern);
  }

  async clear() {
    try {
      if (this.connected && this.client) {
        await this.client.flushDb();
      }
    } catch (error) {
      this.stats.errors++;
    }

    this.memoryCache.clear();
  }

  getStats() {
    const hitRate =
      this.stats.hits + this.stats.misses > 0
        ? ((this.stats.hits / (this.stats.hits + this.stats.misses)) * 100).toFixed(2)
        : 0;

    return {
      ...this.stats,
      hitRate: `${hitRate}%`,
      connected: this.connected,
      cacheType: this.connected ? 'redis + memory' : 'memory-only',
    };
  }

  async close() {
    if (this.client) {
      await this.client.quit();
      this.connected = false;
    }
  }
}

let instance = null;

module.exports = {
  getCacheManager() {
    if (!instance) {
      instance = new DistributedCacheManager();
    }
    return instance;
  },
  DistributedCacheManager,
};
