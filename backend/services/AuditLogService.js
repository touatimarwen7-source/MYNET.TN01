const { getPool } = require('../config/db');

class AuditLogService {
  /**
   * Log an action to audit trail (wrapper for logAction)
   * @async
   * @param {string} userId - ID of user performing action
   * @param {string} entityType - Type of entity (tender, offer, user, etc)
   * @param {string} entityId - ID of entity affected
   * @param {string} action - Action performed (create, update, delete, etc)
   * @param {string} message - Human-readable description of action
   * @param {Object} [details={}] - Additional context details
   * @returns {Promise<void>}
   */
  async log(userId, entityType, entityId, action, message, details = {}) {
    return this.logAction(userId, action, entityType, entityId, { ...details, message });
  }

  /**
   * Log action to audit table with full context
   * @async
   * @param {string} userId - ID of user performing action (can be null for system actions)
   * @param {string} action - Action type (create, update, delete, approve, etc)
   * @param {string} entityType - Type of entity affected
   * @param {string} entityId - ID of entity affected (can be null for bulk actions)
   * @param {Object} [details={}] - Additional context including IP and user agent
   * @param {string} [details.message] - Action message
   * @param {string} [details.ip_address] - Client IP address
   * @param {string} [details.user_agent] - Client user agent
   * @returns {Promise<void>}
   */
  async logAction(userId, action, entityType, entityId, details = {}) {
    const pool = getPool();

    try {
      // Ensure all values are properly typed
      const finalUserId = userId || null;
      const finalEntityId = entityId || null;

      await pool.query(
        `INSERT INTO audit_logs 
                 (user_id, action, entity_type, entity_id, details, ip_address, user_agent, created_at)
                 VALUES ($1, $2, $3, $4, $5, $6, $7, CURRENT_TIMESTAMP)`,
        [
          finalUserId,
          action,
          entityType,
          finalEntityId,
          JSON.stringify(details),
          details.ip_address || null,
          details.user_agent || null,
        ]
      );
    } catch (error) {
      // Audit logging error - continue without failing main operation
    }
  }

  /**
   * Retrieve audit logs with flexible filtering
   * Returns up to 100 most recent records
   * @async
   * @param {Object} [filters={}] - Filter options
   * @param {string} [filters.user_id] - Filter by user ID
   * @param {string} [filters.entity_type] - Filter by entity type (tender, offer, user, etc)
   * @param {string} [filters.entity_id] - Filter by specific entity ID
   * @param {string} [filters.action] - Filter by action type
   * @returns {Promise<Array>} Array of audit log records with user details
   * @throws {Error} When database query fails
   */
  async getAuditLogs(filters = {}) {
    const pool = getPool();
    let query = `SELECT al.*, u.username, u.full_name 
                     FROM audit_logs al 
                     JOIN users u ON al.user_id = u.id 
                     WHERE 1=1`;
    const params = [];
    let paramIndex = 1;

    if (filters.user_id) {
      query += ` AND al.user_id = $${paramIndex}`;
      params.push(filters.user_id);
      paramIndex++;
    }

    if (filters.entity_type) {
      query += ` AND al.entity_type = $${paramIndex}`;
      params.push(filters.entity_type);
      paramIndex++;
    }

    if (filters.entity_id) {
      query += ` AND al.entity_id = $${paramIndex}`;
      params.push(filters.entity_id);
      paramIndex++;
    }

    if (filters.action) {
      query += ` AND al.action = $${paramIndex}`;
      params.push(filters.action);
      paramIndex++;
    }

    query += ` ORDER BY al.created_at DESC LIMIT 100`;

    try {
      const result = await pool.query(query, params);
      return result.rows;
    } catch (error) {
      throw new Error(`Failed to get audit logs: ${error.message}`);
    }
  }
}

module.exports = new AuditLogService();
