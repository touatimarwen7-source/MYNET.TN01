/**
 * Offer Opening Service
 * Handles envelope opening and decryption of offers at scheduled opening time
 */

const { getPool } = require('../config/db');
const KeyManagementService = require('../security/KeyManagementService');
const AuditLogService = require('./AuditLogService');

class OfferOpeningService {
  /**
   * Validate that opening time has arrived before decryption
   * @private
   * @param {Date} tenderDeadline - Tender submission deadline
   * @param {Date} openingDate - Scheduled offer opening date/time
   * @returns {boolean} True if time has arrived
   * @throws {Error} When opening time not yet reached
   */
  static canOpenOffers(tenderDeadline, openingDate) {
    const now = new Date();
    const opening = new Date(openingDate);

    if (now < opening) {
      const timeLeft = Math.ceil((opening - now) / 1000);
      throw new Error(`Opening time not yet reached. Time until opening: ${timeLeft} seconds`);
    }

    return true;
  }

  /**
   * Get all submitted offers for a tender with decryption
   * Decrypts financial data using KeyManagementService
   * @async
   * @param {string} tenderId - ID of tender
   * @param {string} buyerId - ID of buyer (for authorization)
   * @returns {Promise<Array>} Array of offers with decrypted data
   * @throws {Error} When tender not found, access denied, or opening time not reached
   */
  static async getOffersForOpening(tenderId, buyerId) {
    const pool = getPool();

    try {
      // Verify buyer owns this tender
      const tenderResult = await pool.query(
        'SELECT id, opening_date FROM tenders WHERE id = $1 AND buyer_id = $2',
        [tenderId, buyerId]
      );

      if (tenderResult.rows.length === 0) {
        throw new Error('Tender not found or access denied');
      }

      const tender = tenderResult.rows[0];

      // Check if opening time has arrived
      this.canOpenOffers(null, tender.opening_date);

      // Get all offers
      const offersResult = await pool.query(
        `SELECT o.*, u.company_name, u.username
         FROM offers o
         LEFT JOIN users u ON o.supplier_id = u.id
         WHERE o.tender_id = $1 AND o.status = 'submitted' AND o.is_deleted = FALSE
         ORDER BY o.submitted_at ASC`,
        [tenderId]
      );

      // Decrypt offers if encrypted
      const decryptedOffers = offersResult.rows.map((offer) => {
        if (offer.encrypted_data) {
          try {
            const decryptedData = KeyManagementService.decryptData(
              offer.encrypted_data,
              offer.encryption_iv,
              offer.decryption_key_id
            );

            const sensitive = JSON.parse(decryptedData);
            return {
              ...offer,
              total_amount: sensitive.total_amount,
              financial_proposal: sensitive.financial_proposal,
              payment_terms: sensitive.payment_terms,
              was_encrypted: true,
            };
          } catch (err) {
            return { ...offer, decryption_failed: true };
          }
        }
        return offer;
      });

      // Log the opening
      await AuditLogService.log(
        buyerId,
        'offer_opening',
        tenderId,
        'open',
        `Opened ${decryptedOffers.length} offers for tender`
      );

      return decryptedOffers;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Generate opening report (محضر الفتح) with offer summaries
   * @async
   * @param {string} tenderId - ID of tender
   * @param {string} buyerId - ID of buyer
   * @param {Array} offers - Array of decrypted offer objects
   * @returns {Promise<Object>} Created opening report record
   * @throws {Error} When report creation fails
   */
  static async generateOpeningReport(tenderId, buyerId, offers) {
    const pool = getPool();

    try {
      const reportNumber = `RPT-${new Date().toISOString().split('T')[0].replace(/-/g, '')}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

      const summary = {
        total_offers: offers.length,
        valid_offers: offers.filter((o) => !o.decryption_failed).length,
        invalid_offers: offers.filter((o) => o.decryption_failed).length,
        offers_list: offers.map((o) => ({
          offer_number: o.offer_number,
          supplier_name: o.company_name || o.username,
          amount: o.total_amount,
          submitted_at: o.submitted_at,
          status: o.decryption_failed ? 'DECRYPTION_FAILED' : 'OK',
        })),
      };

      const reportResult = await pool.query(
        `INSERT INTO opening_reports (tender_id, opened_by, total_offers_received, total_valid_offers, total_invalid_offers, offers_data, status)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         RETURNING *`,
        [
          tenderId,
          buyerId,
          summary.total_offers,
          summary.valid_offers,
          summary.invalid_offers,
          JSON.stringify(summary),
          'open',
        ]
      );

      return reportResult.rows[0];
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get opening report by ID
   * @async
   * @param {string} reportId - ID of opening report
   * @returns {Promise<Object|null>} Opening report record or null
   * @throws {Error} When database query fails
   */
  static async getOpeningReport(reportId) {
    const pool = getPool();

    try {
      const result = await pool.query('SELECT * FROM opening_reports WHERE id = $1', [reportId]);

      return result.rows[0] || null;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = OfferOpeningService;
