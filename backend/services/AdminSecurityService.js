
const { getPool } = require('../config/db');
const logger = require('../utils/logger');
const crypto = require('crypto');

/**
 * Admin Security Service - خدمة الأمان الإداري
 * توفر وظائف أمان متقدمة للمسؤولين
 */
class AdminSecurityService {
  /**
   * تسجيل محاولة وصول مشبوهة
   */
  async logSuspiciousActivity(userId, action, details) {
    const pool = getPool();
    try {
      await pool.query(
        `INSERT INTO suspicious_activities 
         (user_id, action, details, ip_address, user_agent, created_at) 
         VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP)`,
        [userId, action, JSON.stringify(details), details.ip, details.userAgent]
      );

      logger.warn('Suspicious activity logged', { userId, action });
    } catch (error) {
      logger.error('Error logging suspicious activity:', error);
    }
  }

  /**
   * التحقق من نشاط المستخدم
   */
  async checkUserActivity(userId) {
    const pool = getPool();
    try {
      const result = await pool.query(
        `SELECT COUNT(*) as count 
         FROM audit_logs 
         WHERE user_id = $1 
         AND created_at >= NOW() - INTERVAL '1 hour'`,
        [userId]
      );

      const activityCount = parseInt(result.rows[0].count);
      
      // إذا تجاوز 100 إجراء في الساعة
      if (activityCount > 100) {
        await this.logSuspiciousActivity(userId, 'HIGH_ACTIVITY_RATE', {
          count: activityCount,
          timeWindow: '1 hour'
        });
        return { suspicious: true, activityCount };
      }

      return { suspicious: false, activityCount };
    } catch (error) {
      logger.error('Error checking user activity:', error);
      return { suspicious: false, activityCount: 0 };
    }
  }

  /**
   * إنشاء توقيع آمن للعمليات الحساسة
   */
  generateSecureSignature(data, secret) {
    return crypto
      .createHmac('sha256', secret)
      .update(JSON.stringify(data))
      .digest('hex');
  }

  /**
   * التحقق من التوقيع
   */
  verifySignature(data, signature, secret) {
    const expectedSignature = this.generateSecureSignature(data, secret);
    return crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedSignature)
    );
  }

  /**
   * الحصول على تقرير الأمان
   */
  async getSecurityReport(days = 7) {
    const pool = getPool();
    try {
      const [suspiciousActivities, failedLogins, adminActions] = await Promise.all([
        pool.query(
          `SELECT COUNT(*) as count, action 
           FROM suspicious_activities 
           WHERE created_at >= CURRENT_DATE - INTERVAL '${days} days'
           GROUP BY action`
        ),
        pool.query(
          `SELECT COUNT(*) as count 
           FROM audit_logs 
           WHERE action = 'LOGIN_FAILED' 
           AND created_at >= CURRENT_DATE - INTERVAL '${days} days'`
        ),
        pool.query(
          `SELECT COUNT(*) as count, u.role 
           FROM audit_logs al
           JOIN users u ON al.user_id = u.id
           WHERE u.role IN ('admin', 'super_admin')
           AND al.created_at >= CURRENT_DATE - INTERVAL '${days} days'
           GROUP BY u.role`
        )
      ]);

      return {
        period: `${days} days`,
        suspiciousActivities: suspiciousActivities.rows,
        failedLogins: parseInt(failedLogins.rows[0]?.count || 0),
        adminActions: adminActions.rows,
        generatedAt: new Date().toISOString()
      };
    } catch (error) {
      logger.error('Error generating security report:', error);
      throw error;
    }
  }
}

module.exports = new AdminSecurityService();
