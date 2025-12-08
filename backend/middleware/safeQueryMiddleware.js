
/**
 * 🛡️ SAFE QUERY MIDDLEWARE
 * Prevents connection leaks by wrapping pool queries
 * Ensures proper error handling and connection release
 */

const { getPool } = require('../config/db');
const { logger } = require('../utils/logger');

/**
 * Wrapper for pool.query() that ensures safe connection handling
 * @param {string} query - SQL query string
 * @param {Array} params - Query parameters
 * @returns {Promise} Query result
 */
async function safeQuery(query, params = []) {
  const pool = getPool();
  let client;

  try {
    client = await pool.connect();
    const result = await client.query(query, params);
    return result;
  } catch (error) {
    logger.error('SAFE_QUERY_ERROR', { 
      error: error.message, 
      query: query.substring(0, 100) 
    });
    throw error;
  } finally {
    if (client) {
      try {
        if (typeof client.release === 'function') {
          client.release();
        }
      } catch (releaseErr) {
        logger.error('CLIENT_RELEASE_ERROR', { error: releaseErr.message });
      }
    }
  }
}

/**
 * Augment pool object with safe methods
 * @param {Pool} pool - PostgreSQL pool instance
 */
function augmentPoolWithSafeMethods(pool) {
  const originalQuery = pool.query.bind(pool);

  pool.query = async function (query, params) {
    try {
      return await originalQuery(query, params);
    } catch (error) {
      logger.error('POOL_QUERY_ERROR', { 
        error: error.message,
        query: query?.substring?.(0, 100) || 'N/A'
      });
      throw error;
    }
  };

  return pool;
}

/**
 * Middleware to attach safe query helper to request
 * Usage: app.use(safeQueryMiddleware)
 * Then: const result = await req.safeQuery(sql, params);
 */
function safeQueryMiddleware(req, res, next) {
  const pool = getPool();

  req.safeQuery = async (query, params = []) => {
    let client;

    try {
      client = await pool.connect();
      const result = await client.query(query, params);
      return result;
    } catch (error) {
      logger.error('REQ_SAFE_QUERY_ERROR', { 
        error: error.message,
        path: req.path,
        method: req.method
      });
      throw error;
    } finally {
      if (client) {
        try {
          if (typeof client.release === 'function') {
            client.release();
          }
        } catch (releaseErr) {
          logger.error('REQ_CLIENT_RELEASE_ERROR', { error: releaseErr.message });
        }
      }
    }
  };

  next();
}

/**
 * Transaction wrapper with automatic retry
 * @param {Function} callback - Transaction callback
 * @param {number} maxRetries - Maximum retry attempts
 */
async function safeTransaction(callback, maxRetries = 2) {
  const pool = getPool();
  let lastError;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    let client;
    let isReleased = false;

    try {
      client = await pool.connect();
      
      await client.query('BEGIN ISOLATION LEVEL READ COMMITTED');
      const result = await callback(client);
      await client.query('COMMIT');
      
      return result;
    } catch (error) {
      lastError = error;
      
      if (client) {
        try {
          await client.query('ROLLBACK');
        } catch (rollbackErr) {
          logger.error('TRANSACTION_ROLLBACK_ERROR', { error: rollbackErr.message });
        }
      }

      // Retry on deadlock or serialization failure
      if (
        attempt < maxRetries &&
        (error.code === '40P01' || error.code === '40001')
      ) {
        await new Promise((resolve) => setTimeout(resolve, 100 * (attempt + 1)));
        continue;
      }

      throw error;
    } finally {
      if (client && !isReleased) {
        try {
          isReleased = true;
          client.release();
        } catch (releaseErr) {
          logger.error('TRANSACTION_CLIENT_RELEASE_ERROR', { error: releaseErr.message });
        }
      }
    }
  }

  throw lastError;
}

module.exports = {
  safeQuery,
  augmentPoolWithSafeMethods,
  safeQueryMiddleware,
  safeTransaction,
};
