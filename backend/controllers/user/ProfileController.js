
const { getPool } = require('../../config/db');
const { sendOk, sendValidationError, sendNotFound, sendForbidden, sendInternalError } = require('../../utils/responseHelper');
const { logger } = require('../../utils/logger');

/**
 * 👤 PROFILE CONTROLLER
 * Manages user profile operations and supplier preferences
 */
class ProfileController {
  /**
   * Get user profile
   * @route GET /api/profile
   */
  async getProfile(req, res) {
    try {
      const userId = req.user.id;
      const pool = getPool();

      const result = await pool.query(
        `SELECT 
          id, 
          email, 
          role, 
          company_name,
          tax_id,
          phone,
          address,
          city,
          postal_code,
          country,
          preferred_categories,
          service_locations,
          minimum_budget,
          created_at,
          updated_at
        FROM users 
        WHERE id = $1`,
        [userId]
      );

      if (result.rows.length === 0) {
        return sendNotFound(res, 'User');
      }

      const user = result.rows[0];
      
      // Parse JSON fields
      if (user.preferred_categories) {
        user.preferred_categories = JSON.parse(user.preferred_categories);
      }
      if (user.service_locations) {
        user.service_locations = JSON.parse(user.service_locations);
      }

      return sendOk(res, user, 'Profile retrieved successfully');
    } catch (error) {
      logger.error('Error getting profile:', { error: error.message, userId: req.user.id });
      return sendInternalError(res, 'Failed to retrieve profile');
    }
  }

  /**
   * Update user profile
   * @route PUT /api/profile
   */
  async updateProfile(req, res) {
    try {
      const userId = req.user.id;
      const {
        company_name,
        tax_id,
        phone,
        address,
        city,
        postal_code,
        country
      } = req.body;

      const pool = getPool();

      // Build dynamic update query
      const updates = [];
      const values = [];
      let paramCount = 1;

      if (company_name !== undefined) {
        updates.push(`company_name = $${paramCount++}`);
        values.push(company_name);
      }
      if (tax_id !== undefined) {
        updates.push(`tax_id = $${paramCount++}`);
        values.push(tax_id);
      }
      if (phone !== undefined) {
        updates.push(`phone = $${paramCount++}`);
        values.push(phone);
      }
      if (address !== undefined) {
        updates.push(`address = $${paramCount++}`);
        values.push(address);
      }
      if (city !== undefined) {
        updates.push(`city = $${paramCount++}`);
        values.push(city);
      }
      if (postal_code !== undefined) {
        updates.push(`postal_code = $${paramCount++}`);
        values.push(postal_code);
      }
      if (country !== undefined) {
        updates.push(`country = $${paramCount++}`);
        values.push(country);
      }

      if (updates.length === 0) {
        return sendValidationError(res, [], 'No fields to update');
      }

      updates.push(`updated_at = CURRENT_TIMESTAMP`);
      values.push(userId);

      const query = `
        UPDATE users 
        SET ${updates.join(', ')}
        WHERE id = $${paramCount}
        RETURNING id, email, role, company_name, tax_id, phone, address, city, postal_code, country
      `;

      const result = await pool.query(query, values);

      if (result.rows.length === 0) {
        return sendNotFound(res, 'User');
      }

      return sendOk(res, result.rows[0], 'Profile updated successfully');
    } catch (error) {
      logger.error('Error updating profile:', { error: error.message, userId: req.user.id });
      return sendInternalError(res, 'Failed to update profile');
    }
  }

  /**
   * Update supplier preferences
   * @route PUT /api/profile/supplier/preferences
   */
  async updateSupplierPreferences(req, res) {
    try {
      const userId = req.user.id;
      const userRole = req.user.role;

      // Check if user is a supplier
      if (userRole !== 'supplier') {
        return sendForbidden(res, 'Only suppliers can update preferences');
      }

      const { preferred_categories, service_locations, minimum_budget } = req.body;

      const pool = getPool();

      const result = await pool.query(
        `UPDATE users 
         SET preferred_categories = $1, 
             service_locations = $2, 
             minimum_budget = $3,
             updated_at = CURRENT_TIMESTAMP
         WHERE id = $4 AND role = 'supplier'
         RETURNING id, preferred_categories, service_locations, minimum_budget`,
        [
          JSON.stringify(preferred_categories || []),
          JSON.stringify(service_locations || []),
          minimum_budget || 0,
          userId,
        ]
      );

      if (result.rows.length === 0) {
        return sendNotFound(res, 'Supplier');
      }

      return sendOk(res, {
        preferred_categories: JSON.parse(result.rows[0].preferred_categories),
        service_locations: JSON.parse(result.rows[0].service_locations),
        minimum_budget: result.rows[0].minimum_budget,
      }, 'Supplier preferences updated successfully');
    } catch (error) {
      logger.error('Error updating supplier preferences:', { 
        error: error.message, 
        userId: req.user.id 
      });
      return sendInternalError(res, 'Failed to update supplier preferences');
    }
  }

  /**
   * Get supplier preferences
   * @route GET /api/profile/supplier/preferences
   */
  async getSupplierPreferences(req, res) {
    try {
      const userId = req.user.id;
      const userRole = req.user.role;

      // Check if user is a supplier
      if (userRole !== 'supplier') {
        return sendForbidden(res, 'Only suppliers can view preferences');
      }

      const pool = getPool();

      const result = await pool.query(
        `SELECT preferred_categories, service_locations, minimum_budget 
         FROM users WHERE id = $1 AND role = 'supplier'`,
        [userId]
      );

      if (result.rows.length === 0) {
        return sendNotFound(res, 'Supplier');
      }

      return sendOk(res, {
        preferred_categories: JSON.parse(result.rows[0].preferred_categories || '[]'),
        service_locations: JSON.parse(result.rows[0].service_locations || '[]'),
        minimum_budget: result.rows[0].minimum_budget || 0,
      }, 'Supplier preferences retrieved successfully');
    } catch (error) {
      logger.error('Error getting supplier preferences:', { 
        error: error.message, 
        userId: req.user.id 
      });
      return sendInternalError(res, 'Failed to retrieve supplier preferences');
    }
  }
}

module.exports = ProfileController;
