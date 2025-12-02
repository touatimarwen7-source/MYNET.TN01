const { getPool } = require('../config/db');
const PurchaseOrder = require('../models/PurchaseOrder');
const crypto = require('crypto');
const DataMapper = require('../helpers/DataMapper');

class PurchaseOrderService {
  /**
   * Generate unique purchase order number using timestamp and random hex
   * @private
   * @returns {string} Generated PO number (format: PO-YYYYMMDD-RANDOMHEX)
   */
  generatePONumber() {
    const timestamp = new Date().toISOString().split('T')[0].replace(/-/g, '');
    const randomPart = crypto.randomBytes(4).toString('hex').toUpperCase();
    return `PO-${timestamp}-${randomPart}`;
  }

  /**
   * Create purchase order from a winning offer
   * @async
   * @param {string} offerId - ID of winning offer
   * @param {string} userId - ID of user creating PO (buyer)
   * @returns {Promise<Object>} Created purchase order record
   * @throws {Error} When offer not found or not winner
   */
  async createPurchaseOrder(offerId, userId) {
    const pool = getPool();

    try {
      // Get offer and tender data
      const offerResult = await pool.query(
        `SELECT o.*, t.buyer_id, t.title as tender_title 
                 FROM offers o 
                 JOIN tenders t ON o.tender_id = t.id 
                 WHERE o.id = $1 AND o.is_winner = TRUE`,
        [offerId]
      );

      if (offerResult.rows.length === 0) {
        throw new Error('Winning offer not found');
      }

      const offer = offerResult.rows[0];
      const poNumber = this.generatePONumber();

      const result = await pool.query(
        `INSERT INTO purchase_orders 
                 (po_number, tender_id, offer_id, supplier_id, buyer_id, total_amount, 
                  currency, payment_terms, status, created_by)
                 VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
                 RETURNING *`,
        [
          poNumber,
          offer.tender_id,
          offerId,
          offer.supplier_id,
          offer.buyer_id,
          offer.total_amount,
          offer.currency,
          offer.payment_terms,
          'pending',
          userId,
        ]
      );

      return result.rows[0];
    } catch (error) {
      throw new Error(`Failed to create purchase order: ${error.message}`);
    }
  }

  /**
   * Get purchase order by ID with related details
   * @async
   * @param {string} poId - ID of purchase order
   * @returns {Promise<Object|null>} Purchase order record with tender and supplier info or null
   * @throws {Error} When database query fails
   */
  async getPurchaseOrderById(poId) {
    const pool = getPool();

    try {
      const result = await pool.query(
        `SELECT po.*, t.title as tender_title, 
                 u.company_name as supplier_name
                 FROM purchase_orders po
                 JOIN tenders t ON po.tender_id = t.id
                 JOIN users u ON po.supplier_id = u.id
                 WHERE po.id = $1 AND po.is_deleted = FALSE`,
        [poId]
      );

      return result.rows[0] || null;
    } catch (error) {
      throw new Error(`Failed to get purchase order: ${error.message}`);
    }
  }

  /**
   * Update purchase order status to one of valid states
   * @async
   * @param {string} poId - ID of purchase order to update
   * @param {string} status - New status (pending, approved, in_progress, completed, cancelled)
   * @param {string} userId - ID of user performing update
   * @returns {Promise<Object>} Updated purchase order record
   * @throws {Error} When invalid status or update fails
   */
  async updatePOStatus(poId, status, userId) {
    const pool = getPool();

    const validStatuses = ['pending', 'approved', 'in_progress', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      throw new Error('Invalid status');
    }

    try {
      const result = await pool.query(
        `UPDATE purchase_orders 
                 SET status = $1, updated_by = $2, updated_at = CURRENT_TIMESTAMP 
                 WHERE id = $3 RETURNING *`,
        [status, userId, poId]
      );

      return result.rows[0];
    } catch (error) {
      throw new Error(`Failed to update purchase order: ${error.message}`);
    }
  }

  /**
   * Get all purchase orders for a buyer
   * @async
   * @param {string} buyerId - ID of buyer
   * @returns {Promise<Array>} Array of purchase orders with tender and supplier details
   * @throws {Error} When database query fails
   */
  async getPurchaseOrdersByBuyer(buyerId) {
    const pool = getPool();

    try {
      const result = await pool.query(
        `SELECT po.*, t.title as tender_title, 
                 u.company_name as supplier_name
                 FROM purchase_orders po
                 JOIN tenders t ON po.tender_id = t.id
                 JOIN users u ON po.supplier_id = u.id
                 WHERE po.buyer_id = $1 AND po.is_deleted = FALSE
                 ORDER BY po.created_at DESC`,
        [buyerId]
      );

      return result.rows;
    } catch (error) {
      throw new Error(`Failed to get purchase orders: ${error.message}`);
    }
  }

  /**
   * Get all purchase orders for a supplier
   * @async
   * @param {string} supplierId - ID of supplier
   * @returns {Promise<Array>} Array of purchase orders with tender details
   * @throws {Error} When database query fails
   */
  async getPurchaseOrdersBySupplier(supplierId) {
    const pool = getPool();

    try {
      const result = await pool.query(
        `SELECT po.*, t.title as tender_title
                 FROM purchase_orders po
                 JOIN tenders t ON po.tender_id = t.id
                 WHERE po.supplier_id = $1 AND po.is_deleted = FALSE
                 ORDER BY po.created_at DESC`,
        [supplierId]
      );

      return result.rows;
    } catch (error) {
      throw new Error(`Failed to get purchase orders: ${error.message}`);
    }
  }
}

module.exports = new PurchaseOrderService();
