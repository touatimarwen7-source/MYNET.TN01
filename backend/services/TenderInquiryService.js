/**
 * Tender Inquiry Service
 * Handles tender inquiries, responses, and supplier Q&A
 */

const { getPool } = require('../config/db');
const AuditLogService = require('./AuditLogService');
const DataMapper = require('../helpers/DataMapper');

class TenderInquiryService {
  /**
   * Submit a tender inquiry from supplier
   * @async
   * @param {string} tenderId - ID of tender
   * @param {string} supplierId - ID of supplier submitting inquiry
   * @param {string} subject - Inquiry subject/title
   * @param {string} inquiryText - Inquiry question/text
   * @param {Array} [attachments=[]] - Optional attachment files
   * @returns {Promise<Object>} Created inquiry record
   * @throws {Error} When submission fails
   */
  static async submitInquiry(tenderId, supplierId, subject, inquiryText, attachments = []) {
    const pool = getPool();

    try {
      const result = await pool.query(
        `INSERT INTO tender_inquiries (tender_id, supplier_id, subject, inquiry_text, attachments, status)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING *`,
        [tenderId, supplierId, subject, inquiryText, JSON.stringify(attachments), 'pending']
      );

      await AuditLogService.log(
        supplierId,
        'inquiry',
        result.rows[0].id,
        'submit',
        `Inquiry submitted for tender ${tenderId}`
      );
      return result.rows[0];
    } catch (error) {
      throw new Error(`Failed to submit inquiry: ${error.message}`);
    }
  }

  /**
   * Get all inquiries for a tender with pagination
   * @async
   * @param {string} tenderId - ID of tender
   * @param {number} [page=1] - Page number for pagination
   * @param {number} [limit=10] - Items per page
   * @returns {Promise<Array>} Array of inquiry records with supplier details
   * @throws {Error} When query fails
   */
  static async getInquiriesByTender(tenderId, page = 1, limit = 10) {
    const pool = getPool();
    const offset = (page - 1) * limit;

    try {
      const result = await pool.query(
        `SELECT ti.*, u.username, u.email, u.company_name
         FROM tender_inquiries ti
         LEFT JOIN users u ON ti.supplier_id = u.id
         WHERE ti.tender_id = $1 AND ti.is_deleted = FALSE
         ORDER BY ti.submitted_at DESC
         LIMIT $2 OFFSET $3`,
        [tenderId, limit, offset]
      );

      return result.rows;
    } catch (error) {
      throw new Error(`Failed to fetch inquiries: ${error.message}`);
    }
  }

  /**
   * Respond to an inquiry (Buyer/Admin only)
   * Updates inquiry status to answered
   * @async
   * @param {string} inquiryId - ID of inquiry to respond to
   * @param {string} responseText - Response text
   * @param {Array} [attachments=[]] - Optional response attachments
   * @param {string} userId - ID of user responding (buyer)
   * @returns {Promise<Object>} Created response record
   * @throws {Error} When inquiry not found or response fails
   */
  static async respondToInquiry(inquiryId, responseText, attachments = [], userId) {
    const pool = getPool();

    try {
      // Get the inquiry first
      const inquiry = await pool.query('SELECT tender_id FROM tender_inquiries WHERE id = $1', [
        inquiryId,
      ]);

      if (inquiry.rows.length === 0) {
        throw new Error('Inquiry not found');
      }

      const tenderId = inquiry.rows[0].tender_id;

      // Insert response
      const result = await pool.query(
        `INSERT INTO inquiry_responses (inquiry_id, tender_id, response_text, attachments, answered_by)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING *`,
        [inquiryId, tenderId, responseText, JSON.stringify(attachments), userId]
      );

      // Update inquiry status
      await pool.query('UPDATE tender_inquiries SET status = $1 WHERE id = $2', [
        'answered',
        inquiryId,
      ]);

      await AuditLogService.log(
        userId,
        'inquiry_response',
        result.rows[0].id,
        'create',
        `Response provided for inquiry`
      );
      return result.rows[0];
    } catch (error) {
      throw new Error(`Failed to respond to inquiry: ${error.message}`);
    }
  }

  /**
   * Get all responses for an inquiry
   * @async
   * @param {string} inquiryId - ID of inquiry
   * @returns {Promise<Array>} Array of response records with responder details
   * @throws {Error} When query fails
   */
  static async getInquiryResponses(inquiryId) {
    const pool = getPool();

    try {
      const result = await pool.query(
        `SELECT ir.*, u.username, u.email
         FROM inquiry_responses ir
         LEFT JOIN users u ON ir.answered_by = u.id
         WHERE ir.inquiry_id = $1 AND ir.is_deleted = FALSE
         ORDER BY ir.answered_at DESC`,
        [inquiryId]
      );

      return result.rows;
    } catch (error) {
      throw new Error(`Failed to fetch responses: ${error.message}`);
    }
  }

  /**
   * Get all inquiries submitted by a supplier
   * @async
   * @param {string} supplierId - ID of supplier
   * @param {number} [page=1] - Page number for pagination
   * @param {number} [limit=10] - Items per page
   * @returns {Promise<Array>} Array of inquiries with tender details
   * @throws {Error} When query fails
   */
  static async getMyInquiries(supplierId, page = 1, limit = 10) {
    const pool = getPool();
    const offset = (page - 1) * limit;

    try {
      const result = await pool.query(
        `SELECT ti.*, t.title, t.tender_number, t.deadline
         FROM tender_inquiries ti
         LEFT JOIN tenders t ON ti.tender_id = t.id
         WHERE ti.supplier_id = $1 AND ti.is_deleted = FALSE
         ORDER BY ti.submitted_at DESC
         LIMIT $2 OFFSET $3`,
        [supplierId, limit, offset]
      );

      return result.rows;
    } catch (error) {
      throw new Error(`Failed to fetch inquiries: ${error.message}`);
    }
  }
}

module.exports = TenderInquiryService;
