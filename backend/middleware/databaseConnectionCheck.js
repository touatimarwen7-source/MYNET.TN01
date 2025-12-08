
/**
 * Middleware to verify database connection before processing requests
 */

const { getPool } = require('../config/db');

/**
 * Verify that the database is connected and responsive
 */
async function ensureDatabaseConnection(req, res, next) {
  try {
    const pool = getPool();
    
    // Quick connection check
    if (pool.totalCount === 0) {
      // No connections - attempt to create one
      const client = await pool.connect();
      client.release();
    }
    
    next();
  } catch (error) {
    console.error('Database connection check failed:', error.message);
    
    res.status(503).json({
      success: false,
      error: 'Database temporarily unavailable',
      code: 'DB_CONNECTION_FAILED',
      message: 'Veuillez réessayer dans quelques instants',
      timestamp: new Date().toISOString(),
    });
  }
}

/**
 * Lightweight middleware to verify Pool health only
 */
function checkPoolHealth(req, res, next) {
  try {
    const pool = getPool();
    
    // Verify that Pool exists and is not full
    if (pool.waitingCount > pool.options.max) {
      return res.status(503).json({
        success: false,
        error: 'Database connection pool exhausted',
        code: 'POOL_EXHAUSTED',
        message: 'النظام مشغول حاليًا، يرجى المحاولة لاحقًا',
      });
    }
    
    next();
  } catch (error) {
    next(error);
  }
}

module.exports = {
  ensureDatabaseConnection,
  checkPoolHealth,
};
