
const { getPool } = require('../config/db');
const AuditLogService = require('./AuditLogService');

class SupplierVerificationService {
    /**
     * Submit supplier verification request with documents
     * Creates new or updates existing verification request
     * @async
     * @param {string} userId - ID of supplier submitting verification
     * @param {Object} verificationData - Verification documents and details
     * @param {string} verificationData.company_registration - Company registration number
     * @param {string} [verificationData.tax_id] - Tax ID number
     * @param {Array} [verificationData.documents] - Array of verification documents
     * @returns {Promise<Object>} Created/updated verification record
     * @throws {Error} When submission fails
     */
    async submitVerificationRequest(userId, verificationData) {
        const pool = getPool();

        try {
            const result = await pool.query(
                `INSERT INTO supplier_verifications 
                 (user_id, company_registration, tax_id, verification_document, verification_status)
                 VALUES ($1, $2, $3, $4, 'pending')
                 ON CONFLICT (user_id) 
                 DO UPDATE SET 
                    company_registration = $2,
                    tax_id = $3,
                    verification_document = $4,
                    verification_status = 'pending',
                    updated_at = CURRENT_TIMESTAMP
                 RETURNING *`,
                [
                    userId,
                    verificationData.company_registration,
                    verificationData.tax_id || null,
                    JSON.stringify(verificationData.documents || {})
                ]
            );

            await AuditLogService.log(
                userId,
                'supplier_verification',
                result.rows[0].id,
                'submit',
                'Supplier verification request submitted'
            );

            return result.rows[0];
        } catch (error) {
            throw new Error(`Failed to submit verification request: ${error.message}`);
        }
    }

    /**
     * Verify supplier (Admin only) - Approve or reject verification
     * @async
     * @param {string} verificationId - ID of verification request
     * @param {string} adminId - ID of admin performing verification
     * @param {boolean} approved - Whether to approve (true) or reject (false)
     * @param {string} [notes=''] - Admin notes about decision
     * @returns {Promise<Object>} Updated verification record
     * @throws {Error} When verification not found or update fails
     */
    async verifySupplier(verificationId, adminId, approved, notes = '') {
        const pool = getPool();

        try {
            const status = approved ? 'approved' : 'rejected';

            const result = await pool.query(
                `UPDATE supplier_verifications 
                 SET verification_status = $1, 
                     verified_at = CURRENT_TIMESTAMP,
                     verified_by = $2,
                     notes = $3,
                     updated_at = CURRENT_TIMESTAMP
                 WHERE id = $4
                 RETURNING *`,
                [status, adminId, notes, verificationId]
            );

            if (result.rows.length === 0) {
                throw new Error('Verification request not found');
            }

            // Update user verification status if approved
            if (approved) {
                await pool.query(
                    'UPDATE users SET is_verified = TRUE WHERE id = $1',
                    [result.rows[0].user_id]
                );
            }

            await AuditLogService.log(
                adminId,
                'supplier_verification',
                verificationId,
                status,
                `Supplier verification ${status} by admin`
            );

            return result.rows[0];
        } catch (error) {
            throw new Error(`Failed to verify supplier: ${error.message}`);
        }
    }

    /**
     * Get verification status for a supplier
     * @async
     * @param {string} userId - ID of supplier
     * @returns {Promise<Object|null>} Verification record with user and admin details or null
     * @throws {Error} When database query fails
     */
    async getVerificationStatus(userId) {
        const pool = getPool();

        try {
            const result = await pool.query(
                `SELECT sv.*, u.username, u.company_name,
                 admin.full_name as verified_by_name
                 FROM supplier_verifications sv
                 JOIN users u ON sv.user_id = u.id
                 LEFT JOIN users admin ON sv.verified_by = admin.id
                 WHERE sv.user_id = $1`,
                [userId]
            );

            return result.rows[0] || null;
        } catch (error) {
            throw new Error(`Failed to get verification status: ${error.message}`);
        }
    }

    /**
     * Get all pending verification requests (Admin only)
     * @async
     * @returns {Promise<Array>} Array of pending verification records with user contact info
     * @throws {Error} When database query fails
     */
    async getPendingVerifications() {
        const pool = getPool();

        try {
            const result = await pool.query(
                `SELECT sv.*, u.username, u.email, u.company_name, u.phone
                 FROM supplier_verifications sv
                 JOIN users u ON sv.user_id = u.id
                 WHERE sv.verification_status = 'pending'
                 ORDER BY sv.created_at ASC`
            );

            return result.rows;
        } catch (error) {
            throw new Error(`Failed to get pending verifications: ${error.message}`);
        }
    }
}

module.exports = new SupplierVerificationService();
