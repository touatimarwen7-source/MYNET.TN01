const { getPool } = require('../config/db');

class FeatureFlagService {
    constructor() {
        this.cache = new Map();
        this.cacheExpiry = 5 * 60 * 1000; // 5 minutes
    }

    async initializeFlags() {
        const pool = getPool();
        const defaultFlags = [
            { name: 'ERP Integration', key: 'erp_integration', category: 'advanced' },
            { name: 'Payment Processing', key: 'payment_processing', category: 'payment' },
            { name: 'WebSocket Notifications', key: 'websocket_notifications', category: 'realtime' },
            { name: 'AI Bid Analysis', key: 'ai_bid_analysis', category: 'advanced' },
            { name: 'Smart Notifications', key: 'smart_notifications', category: 'notifications' },
            { name: 'Partial Awards', key: 'partial_awards', category: 'tenders' },
            { name: 'Advanced Analytics', key: 'advanced_analytics', category: 'analytics' },
            { name: 'Custom Reports', key: 'custom_reports', category: 'reporting' },
            { name: 'API Webhooks', key: 'webhooks', category: 'integration' }
        ];

        try {
            for (const flag of defaultFlags) {
                await pool.query(
                    `INSERT INTO feature_flags (feature_name, feature_key, category, is_enabled)
                     VALUES ($1, $2, $3, FALSE)
                     ON CONFLICT (feature_key) DO NOTHING`,
                    [flag.name, flag.key, flag.category]
                );
            }
        } catch (error) {
        }
    }

    async isFeatureEnabled(featureKey) {
        const pool = getPool();
        
        // Check cache first
        const cacheKey = `feature_${featureKey}`;
        const cached = this.cache.get(cacheKey);
        if (cached && cached.expiry > Date.now()) {
            return cached.value;
        }

        try {
            const result = await pool.query(
                'SELECT is_enabled FROM feature_flags WHERE feature_key = $1',
                [featureKey]
            );

            const isEnabled = result.rows.length > 0 ? result.rows[0].is_enabled : false;
            
            // Cache the result
            this.cache.set(cacheKey, {
                value: isEnabled,
                expiry: Date.now() + this.cacheExpiry
            });

            return isEnabled;
        } catch (error) {
            return false;
        }
    }

    async enableFeature(featureKey, adminId) {
        const pool = getPool();

        try {
            const result = await pool.query(
                `UPDATE feature_flags 
                 SET is_enabled = TRUE, enabled_at = CURRENT_TIMESTAMP, updated_by = $1, updated_at = CURRENT_TIMESTAMP
                 WHERE feature_key = $2
                 RETURNING *`,
                [adminId, featureKey]
            );

            if (result.rows.length > 0) {
                await this.logAudit(result.rows[0].id, adminId, 'enable', false, true);
                this.invalidateCache(featureKey);
                return result.rows[0];
            }
            throw new Error('Feature not found');
        } catch (error) {
            throw new Error(`Failed to enable feature: ${error.message}`);
        }
    }

    async disableFeature(featureKey, adminId, reason = null) {
        const pool = getPool();

        try {
            const result = await pool.query(
                `UPDATE feature_flags 
                 SET is_enabled = FALSE, disabled_at = CURRENT_TIMESTAMP, updated_by = $1, updated_at = CURRENT_TIMESTAMP
                 WHERE feature_key = $2
                 RETURNING *`,
                [adminId, featureKey]
            );

            if (result.rows.length > 0) {
                await this.logAudit(result.rows[0].id, adminId, 'disable', true, false, reason);
                this.invalidateCache(featureKey);
                return result.rows[0];
            }
            throw new Error('Feature not found');
        } catch (error) {
            throw new Error(`Failed to disable feature: ${error.message}`);
        }
    }

    async getFeatureStatus(featureKey) {
        const pool = getPool();

        try {
            const result = await pool.query(
                'SELECT * FROM feature_flags WHERE feature_key = $1',
                [featureKey]
            );

            return result.rows.length > 0 ? result.rows[0] : null;
        } catch (error) {
            throw new Error(`Failed to get feature status: ${error.message}`);
        }
    }

    async getAllFeatures() {
        const pool = getPool();

        try {
            const result = await pool.query(
                'SELECT * FROM feature_flags ORDER BY category, feature_name'
            );
            return result.rows;
        } catch (error) {
            throw new Error(`Failed to get features: ${error.message}`);
        }
    }

    async getFeaturesByCategory(category) {
        const pool = getPool();

        try {
            const result = await pool.query(
                'SELECT * FROM feature_flags WHERE category = $1 ORDER BY feature_name',
                [category]
            );
            return result.rows;
        } catch (error) {
            throw new Error(`Failed to get features by category: ${error.message}`);
        }
    }

    async logAudit(featureId, adminId, action, previousStatus, newStatus, reason = null) {
        const pool = getPool();

        try {
            await pool.query(
                `INSERT INTO feature_flag_audits 
                 (feature_id, admin_id, action, previous_status, new_status, reason)
                 VALUES ($1, $2, $3, $4, $5, $6)`,
                [featureId, adminId, action, previousStatus, newStatus, reason]
            );
        } catch (error) {
        }
    }

    invalidateCache(featureKey) {
        const cacheKey = `feature_${featureKey}`;
        this.cache.delete(cacheKey);
    }

    clearCache() {
        this.cache.clear();
    }
}

module.exports = new FeatureFlagService();
