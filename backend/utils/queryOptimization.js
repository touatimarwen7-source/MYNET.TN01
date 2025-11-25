/**
 * Query Optimization Utilities
 * Prevents N+1 problem and optimizes database queries
 */

const logger = require('./logger');

/**
 * Batch loader for preventing N+1 problem
 */
class BatchLoader {
  constructor(loadFn, options = {}) {
    this.loadFn = loadFn;
    this.cache = new Map();
    this.queue = [];
    this.delay = options.delay || 0;
    this.batchSize = options.batchSize || 100;
    this.timeout = null;
  }

  /**
   * Load single item with batching
   */
  async load(key) {
    if (this.cache.has(key)) {
      return this.cache.get(key);
    }

    return new Promise((resolve, reject) => {
      this.queue.push({ key, resolve, reject });
      this.schedule();
    });
  }

  /**
   * Schedule batch execution
   */
  schedule() {
    if (this.timeout) clearTimeout(this.timeout);

    this.timeout = setTimeout(() => {
      this.executeBatch();
    }, this.delay);
  }

  /**
   * Execute batch of queries
   */
  async executeBatch() {
    if (this.queue.length === 0) return;

    const batch = this.queue.splice(0, this.batchSize);
    const keys = batch.map(b => b.key);
    const startTime = Date.now();

    try {
      const results = await this.loadFn(keys);
      const resultMap = new Map(results);

      batch.forEach(({ key, resolve, reject }) => {
        if (resultMap.has(key)) {
          const value = resultMap.get(key);
          this.cache.set(key, value);
          resolve(value);
        } else {
          reject(new Error(`No result for key: ${key}`));
        }
      });

      logger.debug('BATCH_LOADER_EXECUTED', {
        batchSize: batch.length,
        duration: `${Date.now() - startTime}ms`,
        uniqueKeys: new Set(keys).size
      });

      // Continue with next batch if exists
      if (this.queue.length > 0) {
        this.schedule();
      }
    } catch (error) {
      batch.forEach(({ reject }) => {
        reject(error);
      });
      logger.error('BATCH_LOADER_ERROR', error);
    }
  }

  /**
   * Clear cache
   */
  clear() {
    this.cache.clear();
  }

  /**
   * Prime cache with values
   */
  prime(key, value) {
    this.cache.set(key, value);
    return this;
  }
}

/**
 * Select specific columns to reduce data transfer
 */
function selectColumns(columns) {
  return {
    select: columns.reduce((acc, col) => {
      acc[col] = true;
      return acc;
    }, {})
  };
}

/**
 * Optimize queries with relationship loading
 */
async function withRelations(query, relations = []) {
  const optimized = query;
  
  relations.forEach(relation => {
    optimized.include = optimized.include || {};
    optimized.include[relation] = true;
  });

  return optimized;
}

/**
 * Pagination helper
 */
function paginate(page = 1, limit = 10) {
  const skip = (page - 1) * limit;
  return { skip, take: limit };
}

/**
 * Query result caching with TTL
 */
class QueryCache {
  constructor(ttl = 60000) {
    this.cache = new Map();
    this.ttl = ttl;
  }

  /**
   * Generate cache key
   */
  generateKey(query, params = {}) {
    return `${query}:${JSON.stringify(params)}`;
  }

  /**
   * Get cached result
   */
  get(key) {
    const cached = this.cache.get(key);
    if (!cached) return null;

    if (Date.now() - cached.timestamp > this.ttl) {
      this.cache.delete(key);
      return null;
    }

    return cached.value;
  }

  /**
   * Set cache
   */
  set(key, value) {
    this.cache.set(key, {
      value,
      timestamp: Date.now()
    });
  }

  /**
   * Clear cache
   */
  clear() {
    this.cache.clear();
  }

  /**
   * Clear expired entries
   */
  clearExpired() {
    const now = Date.now();
    for (const [key, cached] of this.cache.entries()) {
      if (now - cached.timestamp > this.ttl) {
        this.cache.delete(key);
      }
    }
  }
}

/**
 * Detect N+1 problem in queries
 */
function detectN1Queries(queries) {
  const grouped = new Map();

  queries.forEach(q => {
    const key = q.sql;
    if (!grouped.has(key)) {
      grouped.set(key, []);
    }
    grouped.get(key).push(q);
  });

  const n1Issues = [];
  for (const [sql, executions] of grouped.entries()) {
    if (executions.length > 10) {
      n1Issues.push({
        query: sql,
        count: executions.length,
        duration: executions.reduce((sum, q) => sum + q.duration, 0)
      });
    }
  }

  return n1Issues;
}

module.exports = {
  BatchLoader,
  selectColumns,
  withRelations,
  paginate,
  QueryCache,
  detectN1Queries
};
