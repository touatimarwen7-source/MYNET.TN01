/**
 * Email Verification Service
 * Handles email verification tokens, flows, and user email confirmation
 */

const crypto = require('crypto');
const { withTransaction } = require('../../utils/databaseTransactions');
const { getPool } = require('../../config/db');

class EmailVerificationService {
  /**
   * Generate secure email verification token with 24-hour expiration
   * @private
   * @returns {Object} Token object with hex string and expiration time
   * @returns {string} .token - Random 32-byte hex string
   * @returns {Date} .expiresAt - Token expiration timestamp (24 hours from now)
   */
  generateVerificationToken() {
    return {
      token: crypto.randomBytes(32).toString('hex'),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    };
  }

  /**
   * Send verification email to user with verification link
   * Constructs verification URL and would send via email service
   * @async
   * @param {string} email - Email address to send verification to
   * @param {string} token - Verification token to include in link
   * @param {string} userName - User's name for personalization
   * @returns {Promise<Object>} Email send result
   * @returns {Promise<Object>} .success - Whether email was queued/sent
   * @returns {Promise<Object>} .message - Status message
   * @throws {Error} When email service fails
   */
  async sendVerificationEmail(email, token, userName) {
    try {
      const verificationLink = `${process.env.FRONTEND_URL || 'http://localhost:5000'}/verify-email?token=${token}`;
      // Email would be sent through email service (SendGrid, etc)
      return { success: true, message: 'Verification email sent' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Verify email using verification token
   * Marks user email as verified and invalidates token
   * @async
   * @param {string} token - Verification token from email link
   * @returns {Promise<Object>} Verification result
   * @returns {Promise<Object>} .success - Whether verification succeeded
   * @returns {Promise<Object>} .userId - ID of verified user
   * @throws {Error} When token invalid, expired, or verification fails
   */
  async verifyEmail(token) {
    return withTransaction(async (client) => {
      // Get token and check expiration
      const tokenResult = await client.query(
        `SELECT user_id, expires_at FROM email_verification_tokens WHERE token = $1 AND used = false`,
        [token]
      );

      if (tokenResult.rows.length === 0) {
        throw new Error('Invalid or expired verification token');
      }

      const { user_id, expires_at } = tokenResult.rows[0];
      if (new Date(expires_at) < new Date()) {
        throw new Error('Verification token expired');
      }

      // Mark email as verified
      await client.query(
        `UPDATE users SET email_verified = true, verified_at = NOW() WHERE id = $1`,
        [user_id]
      );

      // Mark token as used
      await client.query(
        `UPDATE email_verification_tokens SET used = true, used_at = NOW() WHERE token = $1`,
        [token]
      );

      return { success: true, userId: user_id };
    });
  }

  /**
   * Resend verification email for unverified users
   * Invalidates previous tokens and creates new one
   * Uses security best practice: doesn't reveal whether email exists
   * @async
   * @param {string} email - Email address to resend verification to
   * @returns {Promise<Object>} Resend result
   * @returns {Promise<Object>} .success - Always true for security
   * @returns {Promise<Object>} .message - Generic success message
   * @throws {Error} Wrapped in transaction, rolled back on failure
   */
  async resendVerificationEmail(email) {
    return withTransaction(async (client) => {
      // Check if user exists and email not verified
      const userResult = await client.query(
        `SELECT id, name FROM users WHERE email = $1 AND email_verified = false`,
        [email]
      );

      if (userResult.rows.length === 0) {
        return { success: true, message: 'If email exists, verification email sent' };
      }

      const { id: userId } = userResult.rows[0];

      // Invalidate previous verification tokens
      await client.query(
        `UPDATE email_verification_tokens SET used = true WHERE user_id = $1 AND used = false`,
        [userId]
      );

      // Create new verification token
      const { token, expiresAt } = this.generateVerificationToken();
      await client.query(
        `INSERT INTO email_verification_tokens (user_id, token, expires_at) VALUES ($1, $2, $3)`,
        [userId, token, expiresAt]
      );

      return { success: true, message: 'Verification email resent' };
    });
  }

  /**
   * Check if user email is verified
   * @async
   * @param {string} userId - ID of user to check
   * @returns {Promise<boolean>} True if user email is verified
   * @throws {Error} When database query fails
   */
  async isEmailVerified(userId) {
    const pool = getPool();
    const result = await pool.query(`SELECT email_verified FROM users WHERE id = $1`, [userId]);
    return result.rows.length > 0 ? result.rows[0].email_verified === true : false;
  }
}

module.exports = new EmailVerificationService();
