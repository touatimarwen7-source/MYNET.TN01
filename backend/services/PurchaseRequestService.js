const { getPool } = require('../config/db');
const PurchaseRequest = require('../models/PurchaseRequest');

class PurchaseRequestService {
  /**
   * Create a direct purchase request from buyer to supplier
   * @async
   * @param {Object} requestData - Purchase request data
   * @param {string} requestData.buyer_id - ID of buyer
   * @param {string} requestData.supplier_id - ID of supplier
   * @param {string} requestData.title - Request title
   * @param {string} requestData.description - Detailed description
   * @param {string} requestData.category - Product/service category
   * @param {number} requestData.quantity - Quantity requested
   * @param {string} requestData.unit - Unit of measurement
   * @param {number} requestData.budget - Budget allocation
   * @param {string} [requestData.notes] - Additional notes
   * @returns {Promise<Object>} Created purchase request record
   * @throws {Error} When creation fails
   */
  async createDirectPurchaseRequest(requestData) {
    const pool = getPool();
    const purchaseRequest = new PurchaseRequest(requestData);

    const result = await pool.query(
      `INSERT INTO purchase_requests 
      (id, buyer_id, supplier_id, title, description, category, quantity, unit, budget, status, notes) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) 
      RETURNING *`,
      [
        purchaseRequest.id,
        purchaseRequest.buyer_id,
        purchaseRequest.supplier_id,
        purchaseRequest.title,
        purchaseRequest.description,
        purchaseRequest.category,
        purchaseRequest.quantity,
        purchaseRequest.unit,
        purchaseRequest.budget,
        purchaseRequest.status,
        purchaseRequest.notes,
      ]
    );

    return result.rows[0];
  }

  /**
   * Get all purchase requests for a buyer
   * @async
   * @param {string} buyerId - ID of buyer
   * @returns {Promise<Array>} Array of purchase requests with supplier details
   * @throws {Error} When query fails
   */
  async getRequestsByBuyer(buyerId) {
    const pool = getPool();
    const result = await pool.query(
      `SELECT pr.*, u.full_name as supplier_name, u.company_name 
       FROM purchase_requests pr 
       LEFT JOIN users u ON pr.supplier_id = u.id 
       WHERE pr.buyer_id = $1 
       ORDER BY pr.created_at DESC`,
      [buyerId]
    );
    return result.rows;
  }

  /**
   * Update status of a purchase request
   * Can be updated by buyer or supplier
   * @async
   * @param {string} requestId - ID of request to update
   * @param {string} status - New status (pending, accepted, rejected, completed, etc)
   * @param {string} userId - ID of user updating (buyer or supplier)
   * @returns {Promise<Object>} Updated purchase request record
   * @throws {Error} When update fails or user unauthorized
   */
  async updateRequestStatus(requestId, status, userId) {
    const pool = getPool();
    const result = await pool.query(
      `UPDATE purchase_requests 
       SET status = $1, updated_at = CURRENT_TIMESTAMP 
       WHERE id = $2 AND (buyer_id = $3 OR supplier_id = $3) 
       RETURNING *`,
      [status, requestId, userId]
    );
    return result.rows[0];
  }
}

module.exports = new PurchaseRequestService();
