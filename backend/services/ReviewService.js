const { getPool } = require('../config/db');
const AuditLogService = require('./AuditLogService');
const DataMapper = require('../helpers/DataMapper');

class ReviewService {
  /**
   * Create supplier review after purchase order completion
   * @async
   * @param {Object} reviewData - Review content and metadata
   * @param {string} reviewData.offer_id - ID of related offer
   * @param {string} reviewData.supplier_id - ID of supplier being reviewed
   * @param {number} reviewData.rating - Rating score (1-5)
   * @param {string} reviewData.comment - Review comment
   * @param {string} reviewData.po_id - ID of completed purchase order
   * @param {string} buyerId - ID of reviewer (buyer)
   * @param {string} ipAddress - IP address of reviewer
   * @returns {Promise<Object>} Created review record
   * @throws {Error} When invalid rating, PO not found, or review fails
   */
  async createReview(reviewData, buyerId, ipAddress) {
    const pool = getPool();

    // Map frontend data to database schema
    const mappedData = DataMapper.mapReview(reviewData);
    const { offer_id, supplier_id, rating, comment, po_id } = mappedData;

    if (rating < 1 || rating > 5) {
      throw new Error('Rating must be between 1 and 5');
    }

    try {
      // Verify PO has completed
      const poResult = await pool.query(
        'SELECT status FROM purchase_orders WHERE id = $1 AND supplier_id = $2',
        [po_id, supplier_id]
      );

      if (!poResult.rows[0]) {
        throw new Error('Purchase order not found');
      }

      if (!['completed', 'paid'].includes(poResult.rows[0].status)) {
        throw new Error('Can only review after PO is completed or paid');
      }

      const result = await pool.query(
        `INSERT INTO reviews (offer_id, reviewer_id, reviewee_id, rating, comment, 
                 po_id, is_verified, created_at)
                 VALUES ($1, $2, $3, $4, $5, $6, TRUE, CURRENT_TIMESTAMP)
                 RETURNING *`,
        [offer_id, buyerId, supplier_id, rating, comment, po_id]
      );

      await AuditLogService.log(
        buyerId,
        'review',
        result.rows[0].id,
        'create',
        `Supplier rated: ${rating}/5`,
        { ip_address: ipAddress }
      );

      return result.rows[0];
    } catch (error) {
      throw new Error(`Failed to create review: ${error.message}`);
    }
  }

  /**
   * Get all verified reviews for a supplier with average rating
   * @async
   * @param {string} supplierId - ID of supplier
   * @returns {Promise<Object>} Object with average_rating, total_reviews, and reviews array
   * @throws {Error} When database query fails
   */
  async getSupplierReviews(supplierId) {
    const pool = getPool();

    try {
      const result = await pool.query(
        `SELECT r.*, u.username as reviewer_name 
                 FROM reviews r 
                 JOIN users u ON r.reviewer_id = u.id 
                 WHERE r.reviewee_id = $1 AND r.is_verified = TRUE
                 ORDER BY r.created_at DESC`,
        [supplierId]
      );

      if (result.rows.length === 0) {
        return { average_rating: 0, total_reviews: 0, reviews: [] };
      }

      const avgRating = (
        result.rows.reduce((sum, r) => sum + r.rating, 0) / result.rows.length
      ).toFixed(2);

      return {
        average_rating: parseFloat(avgRating),
        total_reviews: result.rows.length,
        reviews: result.rows,
      };
    } catch (error) {
      throw new Error(`Failed to get supplier reviews: ${error.message}`);
    }
  }

  /**
   * Update average rating for supplier in users table
   * Recalculates from all verified reviews
   * @async
   * @param {string} supplierId - ID of supplier to update
   * @returns {Promise<number>} New average rating
   * @throws {Error} When database query fails
   */
  async updateSupplierAverageRating(supplierId) {
    const pool = getPool();

    try {
      const result = await pool.query(
        `SELECT AVG(rating)::DECIMAL(3,2) as avg_rating 
                 FROM reviews WHERE reviewee_id = $1 AND is_verified = TRUE`,
        [supplierId]
      );

      const avgRating = result.rows[0]?.avg_rating || 0;

      await pool.query(
        'UPDATE users SET average_rating = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
        [avgRating, supplierId]
      );

      return avgRating;
    } catch (error) {
      throw new Error(`Failed to update supplier rating: ${error.message}`);
    }
  }
}

module.exports = new ReviewService();
