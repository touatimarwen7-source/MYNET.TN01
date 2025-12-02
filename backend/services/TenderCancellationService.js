const { getPool } = require('../config/db');
const { sendEmail } = require('../config/emailService');
const AuditLogService = require('./AuditLogService');
const { logger } = require('../utils/logger');

class TenderCancellationService {
  /**
   * Cancel tender and notify all participants
   * Status transitions validated, emails sent to all offer participants
   * @async
   * @param {string} tenderId - ID of tender to cancel
   * @param {string} buyerId - ID of buyer performing cancellation
   * @param {string} cancellationReason - Human-readable reason for cancellation
   * @returns {Promise<Object>} Result with tender number and notification count
   * @throws {Error} When tender not found, invalid status, or operation fails
   */
  static async cancelTender(tenderId, buyerId, cancellationReason) {
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

      if (!['open', 'draft', 'published', 'in_progress'].includes(tender.status)) {
        throw new Error(`Cannot cancel tender with status: ${tender.status}`);
      }

      // Cancel tender with reason
      await pool.query(
        `UPDATE tenders 
         SET status = $1, cancellation_reason = $2, cancelled_at = NOW()
         WHERE id = $3`,
        ['cancelled', cancellationReason, tenderId]
      );

      // Get participants
      const participantsResult = await pool.query(
        `SELECT DISTINCT u.email, u.company_name 
         FROM offers o LEFT JOIN users u ON o.supplier_id = u.id
         WHERE o.tender_id = $1 AND o.is_deleted = FALSE`,
        [tenderId]
      );

      // Send notifications
      for (const participant of participantsResult.rows) {
        if (participant.email) {
          sendEmail(
            participant.email,
            `إخطار بإلغاء المناقصة - ${tender.tender_number}`,
            `تم إلغاء المناقصة.\n\nالسبب: ${cancellationReason}`
          ).catch((e) =>
            logger.error('Email notification failed', {
              email: participant.email,
              error: e.message,
            })
          );
        }
      }

      // Mark offers as cancelled
      await pool.query(`UPDATE offers SET status = $1, is_deleted = TRUE WHERE tender_id = $2`, [
        'cancelled',
        tenderId,
      ]);

      await AuditLogService.log(
        buyerId,
        'tender_cancelled',
        tenderId,
        'cancel',
        `Tender cancelled. Reason: ${cancellationReason}`
      );

      return {
        success: true,
        tenderNumber: tender.tender_number,
        participantsNotified: participantsResult.rows.length,
        cancellationReason,
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get cancellation status and reason for a tender
   * @async
   * @param {string} tenderId - ID of tender
   * @returns {Promise<Object>} Tender record with cancellation details
   * @throws {Error} When tender not found
   */
  static async getCancellationStatus(tenderId) {
    const pool = getPool();
    const result = await pool.query(
      'SELECT id, tender_number, status, cancellation_reason, cancelled_at FROM tenders WHERE id = $1',
      [tenderId]
    );
    if (result.rows.length === 0) throw new Error('Tender not found');
    return result.rows[0];
  }
}

module.exports = TenderCancellationService;
