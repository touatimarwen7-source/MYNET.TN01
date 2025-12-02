const { getPool } = require('../config/db');

class QueueService {
  /**
   * Log tender history entry for audit trail
   * Records state changes and user actions on tenders
   * @async
   * @param {Object} tenderHistoryData - History entry data
   * @param {string} tenderHistoryData.tender_id - ID of tender
   * @param {string} tenderHistoryData.user_id - ID of user making change
   * @param {string} tenderHistoryData.action - Action performed (create, update, publish, etc)
   * @param {Object} tenderHistoryData.previous_state - Previous tender state
   * @param {Object} tenderHistoryData.new_state - New tender state
   * @param {Object} [tenderHistoryData.metadata] - Additional context metadata
   * @param {string} [tenderHistoryData.ip_address] - Client IP address
   * @param {string} [tenderHistoryData.user_agent] - Client user agent
   * @returns {Promise<void>}
   * @throws {Error} When database insert fails
   */
  async logTenderHistory(tenderHistoryData) {
    const pool = getPool();
    await pool.query(
      `INSERT INTO tender_history 
      (id, tender_id, user_id, action, previous_state, new_state, metadata, ip_address, user_agent) 
      VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7, $8)`,
      [
        tenderHistoryData.tender_id,
        tenderHistoryData.user_id,
        tenderHistoryData.action,
        tenderHistoryData.previous_state,
        tenderHistoryData.new_state,
        JSON.stringify(tenderHistoryData.metadata || {}),
        tenderHistoryData.ip_address,
        tenderHistoryData.user_agent,
      ]
    );
  }

  /**
   * Get complete history for a tender
   * Returns all state changes and actions in reverse chronological order
   * @async
   * @param {string} tenderId - ID of tender
   * @returns {Promise<Array>} Array of history entries with user details
   * @throws {Error} When query fails
   */
  async getTenderHistory(tenderId) {
    const pool = getPool();
    const result = await pool.query(
      `SELECT th.*, u.full_name as user_name 
       FROM tender_history th 
       LEFT JOIN users u ON th.user_id = u.id 
       WHERE th.tender_id = $1 
       ORDER BY th.created_at DESC`,
      [tenderId]
    );
    return result.rows;
  }
}

module.exports = new QueueService();
