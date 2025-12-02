/**
 * Password Reset Service
 * Secure password reset with token verification and transaction safety
 */

const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const { withTransaction } = require('../../utils/databaseTransactions');
const { getPool } = require('../../config/db');

class PasswordResetService {
  /**
   * Generate secure reset token with 1-hour expiration
   * @private
   * @returns {Object} Token object with hex string and expiration time
   * @returns {string} .token - Random 32-byte hex string
   * @returns {Date} .expiresAt - Token expiration timestamp (1 hour from now)
   */
  generateResetToken() {
    return {
      token: crypto.randomBytes(32).toString('hex'),
      expiresAt: new Date(Date.now() + 1 * 60 * 60 * 1000),
    };
  }

  /**
   * Request password reset for an email address
   * Uses security best practice: doesn't reveal whether email exists
   * Invalidates previous tokens and creates new reset token
   * @async
   * @param {string} email - User email address to reset password for
   * @returns {Promise<Object>} Reset request result
   * @returns {Promise<Object>} .success - Always true for security
   * @returns {Promise<Object>} .message - Generic success message
   * @throws {Error} Wrapped in transaction, rolled back on failure
   */
  async requestReset(email) {
    return withTransaction(async (client) => {
      const userResult = await client.query(`SELECT id, name FROM users WHERE email = $1`, [email]);

      if (userResult.rows.length === 0) {
        return { success: true, message: 'If email exists, reset link sent' };
      }

      const { id: userId } = userResult.rows[0];

      // Invalidate previous reset tokens
      await client.query(
        `UPDATE password_reset_tokens SET used = true WHERE user_id = $1 AND used = false`,
        [userId]
      );

      // Create new reset token
      const { token, expiresAt } = this.generateResetToken();
      await client.query(
        `INSERT INTO password_reset_tokens (user_id, token, expires_at) VALUES ($1, $2, $3)`,
        [userId, token, expiresAt]
      );

      return { success: true, message: 'If email exists, reset link sent' };
    });
  }

  /**
   * Verify password reset token validity and expiration
   * @async
   * @param {string} token - Reset token to verify
   * @returns {Promise<Object>} Verification result
   * @returns {Promise<Object>} .valid - Whether token is valid and not expired
   * @returns {Promise<Object>} .userId - ID of user if valid
   * @returns {Promise<Object>} .error - Error message if invalid/expired
   * @throws {Error} When database query fails
   */
  async verifyResetToken(token) {
    const pool = getPool();
    const result = await pool.query(
      `SELECT user_id, expires_at FROM password_reset_tokens WHERE token = $1 AND used = false`,
      [token]
    );

    if (result.rows.length === 0) {
      return { valid: false, error: 'Invalid reset token' };
    }

    const { user_id, expires_at } = result.rows[0];
    if (new Date(expires_at) < new Date()) {
      return { valid: false, error: 'Reset token expired' };
    }

    return { valid: true, userId: user_id };
  }

  /**
   * Reset user password with token verification and session invalidation
   * Validates token, hashes new password with bcrypt, invalidates all sessions
   * @async
   * @param {string} token - Valid reset token
   * @param {string} newPassword - New password (minimum 8 characters)
   * @returns {Promise<Object>} Reset operation result
   * @returns {Promise<Object>} .success - Whether password was reset
   * @returns {Promise<Object>} .message - Operation status message
   * @throws {Error} When token invalid, expired, password invalid, or query fails
   */
  async resetPassword(token, newPassword) {
    return withTransaction(async (client) => {
      // Verify token
      const tokenResult = await client.query(
        `SELECT user_id, expires_at FROM password_reset_tokens WHERE token = $1 AND used = false`,
        [token]
      );

      if (tokenResult.rows.length === 0) {
        throw new Error('Invalid or expired reset token');
      }

      const { user_id, expires_at } = tokenResult.rows[0];
      if (new Date(expires_at) < new Date()) {
        throw new Error('Reset token expired');
      }

      // Validate password strength
      if (newPassword.length < 8) {
        throw new Error('Password must be at least 8 characters');
      }

      // Hash new password
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      // Update user password
      await client.query(`UPDATE users SET password = $1, updated_at = NOW() WHERE id = $2`, [
        hashedPassword,
        user_id,
      ]);

      // Mark reset token as used
      await client.query(
        `UPDATE password_reset_tokens SET used = true, used_at = NOW() WHERE token = $1`,
        [token]
      );

      // Invalidate all existing sessions for user (force re-login)
      await client.query(`UPDATE user_sessions SET invalidated = true WHERE user_id = $1`, [
        user_id,
      ]);

      return { success: true, message: 'Password reset successfully' };
    });
  }
}

module.exports = new PasswordResetService();
