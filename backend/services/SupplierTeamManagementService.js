
const { getPool } = require('../config/db');
const { logger } = require('../utils/logger');

class SupplierTeamManagementService {
  /**
   * Get all team members for a supplier
   */
  async getTeamMembers(supplierId) {
    const pool = getPool();
    
    try {
      const result = await pool.query(
        `SELECT 
          id, email, full_name, role, 
          permissions, is_active, created_at,
          last_login, department, position
         FROM supplier_team_members 
         WHERE supplier_id = $1 
         ORDER BY created_at DESC`,
        [supplierId]
      );
      
      return { success: true, members: result.rows };
    } catch (error) {
      logger.error('Error fetching supplier team members', { error: error.message });
      throw error;
    }
  }

  /**
   * Add new team member
   */
  async addTeamMember(supplierId, memberData) {
    const pool = getPool();
    const { email, full_name, role, permissions, department, position } = memberData;

    try {
      // Check if email already exists
      const existingMember = await pool.query(
        'SELECT id FROM supplier_team_members WHERE email = $1 AND supplier_id = $2',
        [email, supplierId]
      );

      if (existingMember.rows.length > 0) {
        return { success: false, error: 'Email already exists in team' };
      }

      // Set default permissions based on role
      const defaultPermissions = role === 'manager' 
        ? {
            view_dashboard: true,
            view_tender: true,
            submit_offer: true,
            view_offer: true,
            view_purchase_order: true,
            view_reports: true,
            export_data: true,
            manage_team: true,
            approve_offer: true
          }
        : {
            view_dashboard: true,
            view_tender: true,
            view_offer: true,
            view_purchase_order: true
          };

      const finalPermissions = permissions || defaultPermissions;

      const result = await pool.query(
        `INSERT INTO supplier_team_members 
         (supplier_id, email, full_name, role, permissions, department, position, is_active)
         VALUES ($1, $2, $3, $4, $5, $6, $7, true)
         RETURNING *`,
        [supplierId, email, full_name, role, JSON.stringify(finalPermissions), department, position]
      );

      logger.info('Supplier team member added', { supplierId, email });
      return { success: true, member: result.rows[0] };
    } catch (error) {
      logger.error('Error adding supplier team member', { error: error.message });
      throw error;
    }
  }

  /**
   * Update team member
   */
  async updateTeamMember(memberId, supplierId, updates) {
    const pool = getPool();
    
    try {
      const { full_name, role, permissions, department, position, is_active } = updates;
      
      const result = await pool.query(
        `UPDATE supplier_team_members 
         SET full_name = COALESCE($1, full_name),
             role = COALESCE($2, role),
             permissions = COALESCE($3, permissions),
             department = COALESCE($4, department),
             position = COALESCE($5, position),
             is_active = COALESCE($6, is_active),
             updated_at = CURRENT_TIMESTAMP
         WHERE id = $7 AND supplier_id = $8
         RETURNING *`,
        [full_name, role, permissions ? JSON.stringify(permissions) : null, 
         department, position, is_active, memberId, supplierId]
      );

      if (result.rows.length === 0) {
        return { success: false, error: 'Team member not found' };
      }

      logger.info('Supplier team member updated', { memberId, supplierId });
      return { success: true, member: result.rows[0] };
    } catch (error) {
      logger.error('Error updating supplier team member', { error: error.message });
      throw error;
    }
  }

  /**
   * Remove team member
   */
  async removeTeamMember(memberId, supplierId) {
    const pool = getPool();
    
    try {
      const result = await pool.query(
        'DELETE FROM supplier_team_members WHERE id = $1 AND supplier_id = $2 RETURNING *',
        [memberId, supplierId]
      );

      if (result.rows.length === 0) {
        return { success: false, error: 'Team member not found' };
      }

      logger.info('Supplier team member removed', { memberId, supplierId });
      return { success: true };
    } catch (error) {
      logger.error('Error removing supplier team member', { error: error.message });
      throw error;
    }
  }

  /**
   * Get team statistics
   */
  async getTeamStats(supplierId) {
    const pool = getPool();
    
    try {
      const stats = await pool.query(
        `SELECT 
          COUNT(*) as total_members,
          COUNT(*) FILTER (WHERE is_active = true) as active_members,
          COUNT(*) FILTER (WHERE role = 'manager') as managers,
          COUNT(*) FILTER (WHERE role = 'member') as members
         FROM supplier_team_members 
         WHERE supplier_id = $1`,
        [supplierId]
      );

      return { success: true, stats: stats.rows[0] };
    } catch (error) {
      logger.error('Error fetching supplier team stats', { error: error.message });
      throw error;
    }
  }
}

module.exports = new SupplierTeamManagementService();
