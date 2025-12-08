
/**
 * Middleware للتحقق من اتصال قاعدة البيانات قبل معالجة الطلبات
 */

const { getPool } = require('../config/db');

/**
 * التحقق من أن قاعدة البيانات متصلة ومستجيبة
 */
async function ensureDatabaseConnection(req, res, next) {
  try {
    const pool = getPool();
    
    // فحص سريع للاتصال
    if (pool.totalCount === 0) {
      // لا توجد اتصالات - محاولة إنشاء واحد
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
      message: 'يرجى المحاولة مرة أخرى بعد قليل',
      timestamp: new Date().toISOString(),
    });
  }
}

/**
 * Middleware خفيف للتحقق من صحة Pool فقط
 */
function checkPoolHealth(req, res, next) {
  try {
    const pool = getPool();
    
    // التحقق من أن Pool موجود وليس ممتلئًا
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
