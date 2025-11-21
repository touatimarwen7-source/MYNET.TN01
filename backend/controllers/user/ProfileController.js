const { getPool } = require('../../config/db');

class ProfileController {
    async updateSupplierPreferences(req, res) {
        try {
            const userId = req.user.userId;
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
                    userId
                ]
            );

            if (result.rows.length === 0) {
                return res.status(403).json({ error: 'Only suppliers can update preferences' });
            }

            res.status(200).json({
                success: true,
                message: 'Supplier preferences updated successfully',
                preferences: {
                    preferred_categories: JSON.parse(result.rows[0].preferred_categories),
                    service_locations: JSON.parse(result.rows[0].service_locations),
                    minimum_budget: result.rows[0].minimum_budget
                }
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async getSupplierPreferences(req, res) {
        try {
            const userId = req.user.userId;
            const pool = getPool();

            const result = await pool.query(
                `SELECT preferred_categories, service_locations, minimum_budget 
                 FROM users WHERE id = $1 AND role = 'supplier'`,
                [userId]
            );

            if (result.rows.length === 0) {
                return res.status(403).json({ error: 'Only suppliers can view preferences' });
            }

            res.status(200).json({
                success: true,
                preferences: {
                    preferred_categories: JSON.parse(result.rows[0].preferred_categories || '[]'),
                    service_locations: JSON.parse(result.rows[0].service_locations || '[]'),
                    minimum_budget: result.rows[0].minimum_budget || 0
                }
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = new ProfileController();
