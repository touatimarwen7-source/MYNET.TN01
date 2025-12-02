/**
 * ⚡ QUERY OPTIMIZER
 * Reduces API calls and optimizes queries
 */

export const QueryOptimizer = {
  /**
   * Batch queries to reduce API calls
   */
  batchQueries: async (queries, delay = 100) => {
    return new Promise((resolve) => {
      setTimeout(async () => {
        const results = await Promise.all(queries);
        resolve(results);
      }, delay);
    });
  },

  /**
   * Cache query results with TTL
   */
  queryCache: new Map(),

  getCachedQuery: function (key, ttl = 5 * 60 * 1000) {
    const cached = this.queryCache.get(key);
    if (!cached) return null;

    if (Date.now() - cached.timestamp > ttl) {
      this.queryCache.delete(key);
      return null;
    }

    return cached.data;
  },

  setCachedQuery: function (key, data) {
    this.queryCache.set(key, {
      data,
      timestamp: Date.now(),
    });
  },

  clearCache: function () {
    this.queryCache.clear();
  },

  /**
   * Paginate results efficiently
   */
  paginate: (items, page = 1, limit = 20) => {
    const start = (page - 1) * limit;
    const end = start + limit;
    return {
      data: items.slice(start, end),
      pagination: {
        page,
        limit,
        total: items.length,
        pages: Math.ceil(items.length / limit),
      },
    };
  },

  /**
   * Filter with early exit
   */
  filterEarly: (items, predicate, maxResults = Infinity) => {
    const results = [];
    for (const item of items) {
      if (predicate(item)) {
        results.push(item);
        if (results.length >= maxResults) break;
      }
    }
    return results;
  },
};

export default QueryOptimizer;
