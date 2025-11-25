const { getPool } = require('../config/db');
const { sendEmail } = require('../config/emailService');
const AuditLogService = require('./AuditLogService');
const { logger } = require('../utils/logger');

class AwardNotificationService {
  /**
   * Select winners for tender and send notifications to all participants
   * Validates partial award constraints before updating
   * @async
   * @param {string} tenderId - ID of tender to award
   * @param {Array} winnersIds - Array of winning offer IDs
   * @param {string} buyerId - ID of buyer (for authorization)
   * @returns {Promise<Object>} Result with counts of winners and notifications
   * @throws {Error} When tender not found, constraints violated, or operation fails
   */
  static async selectWinnersAndNotify(tenderId, winnersIds, buyerId) {
    const pool = getPool();
    try {
      const tenderResult = await pool.query(
        'SELECT * FROM tenders WHERE id = $1 AND buyer_id = $2',
        [tenderId, buyerId]
      );

      if (tenderResult.rows.length === 0) {
        throw new Error('Tender not found or access denied');
      }

      const tender = tenderResult.rows[0];

      // Validate partial award constraints
      if (!tender.allow_partial_award && winnersIds.length > 1) {
        throw new Error(`This tender allows only 1 winner (partial award disabled). You selected ${winnersIds.length} winners.`);
      }

      if (tender.max_winners && winnersIds.length > tender.max_winners) {
        throw new Error(`Maximum ${tender.max_winners} winner(s) allowed. You selected ${winnersIds.length}.`);
      }

      // Mark winners with exact timestamp
      for (const winnerId of winnersIds) {
        await pool.query(
          'UPDATE offers SET award_status = $1, awarded_at = NOW() WHERE id = $2',
          ['awarded', winnerId]
        );
      }

      // Get all participants for notification
      const participantsResult = await pool.query(
        `SELECT DISTINCT u.id, u.email, u.company_name, o.offer_number, o.id as offer_id
         FROM offers o LEFT JOIN users u ON o.supplier_id = u.id
         WHERE o.tender_id = $1 AND o.status = 'submitted'`,
        [tenderId]
      );

      const participants = participantsResult.rows;

      // Send notifications
      for (const participant of participants) {
        if (participant.email) {
          if (winnersIds.includes(participant.offer_id)) {
            sendEmail(participant.email, `إخطار بالترسية - ${tender.tender_number}`, 
              `تم اختيارك كفائز في المناقصة برقم عرض ${participant.offer_number}`)
              .catch(e => logger.error('Winner notification failed', { email: participant.email, error: e.message }));
          } else {
            sendEmail(participant.email, `نتيجة المناقصة - ${tender.tender_number}`, 
              `للأسف لم يتم قبول عرضك في هذه المناقصة`)
              .catch(e => logger.error('Rejection notification failed', { email: participant.email, error: e.message }));
          }
        }
      }

      await AuditLogService.log(buyerId, 'award_selection', tenderId, 'create', 
        `${winnersIds.length} winner(s) selected. Notifications sent to ${participants.length} participants`);

      return { 
        success: true, 
        winnersCount: winnersIds.length, 
        notificationsCount: participants.length,
        message: `${winnersIds.length} فائز(ين) اختيار وإشعارات أرسلت`
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get award status and ranking for all offers in a tender
   * @async
   * @param {string} tenderId - ID of tender to get award status for
   * @returns {Promise<Array>} Array of offers with status, ranking, and company names
   * @throws {Error} When database query fails
   */
  static async getAwardStatus(tenderId) {
    const pool = getPool();
    const result = await pool.query(
      `SELECT o.id, o.offer_number, u.company_name, o.final_score, o.award_status, o.awarded_at, o.ranking
       FROM offers o LEFT JOIN users u ON o.supplier_id = u.id
       WHERE o.tender_id = $1 AND o.status = 'submitted' ORDER BY o.ranking ASC`,
      [tenderId]
    );
    return result.rows;
  }
}

module.exports = AwardNotificationService;
