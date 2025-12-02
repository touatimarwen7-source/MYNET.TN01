const crypto = require('crypto');
const { getPool } = require('../config/db');

class MFAService {
  /**
   * Generate a time-based one-time password (TOTP)
   */
  generateTOTP(userId) {
    const code = crypto.randomInt(100000, 999999).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    return { code, expiresAt };
  }

  /**
   * Store MFA code for verification
   */
  async storeMFACode(userId, code, expiresAt, purpose = 'offer_opening') {
    const pool = getPool();

    try {
      await pool.query(
        `INSERT INTO mfa_codes (user_id, code, purpose, expires_at, is_used)
                 VALUES ($1, $2, $3, $4, FALSE)
                 ON CONFLICT (user_id, purpose) WHERE is_used = FALSE
                 DO UPDATE SET code = $2, expires_at = $4, created_at = CURRENT_TIMESTAMP`,
        [userId, code, purpose, expiresAt]
      );

      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Verify MFA code
   */
  async verifyMFACode(userId, code, purpose = 'offer_opening') {
    const pool = getPool();

    try {
      const result = await pool.query(
        `SELECT * FROM mfa_codes 
                 WHERE user_id = $1 AND code = $2 AND purpose = $3 
                 AND is_used = FALSE AND expires_at > CURRENT_TIMESTAMP`,
        [userId, code, purpose]
      );

      if (result.rows.length === 0) {
        return { valid: false, message: 'Invalid or expired MFA code' };
      }

      // Mark as used
      await pool.query('UPDATE mfa_codes SET is_used = TRUE WHERE id = $1', [result.rows[0].id]);

      return { valid: true, message: 'MFA verification successful' };
    } catch (error) {
      return { valid: false, message: 'MFA verification failed' };
    }
  }

  /**
   * Request MFA for sensitive operation
   */
  async requestMFA(userId, purpose, channel = 'email') {
    const { code, expiresAt } = this.generateTOTP(userId);

    await this.storeMFACode(userId, code, expiresAt, purpose);

    // Send code via email or SMS
    try {
      if (channel === 'email') {
        const pool = getPool();
        const userResult = await pool.query('SELECT email FROM users WHERE id = $1', [userId]);

        if (userResult.rows.length > 0) {
          const userEmail = userResult.rows[0].email;
          await this.sendMFACodeByEmail(userEmail, code, purpose);
        }
      } else if (channel === 'sms') {
        await this.sendMFACodeBySMS(userId, code);
      }
    } catch (error) {
      // Log error but don't fail the request - code is still stored in DB
    }

    return {
      success: true,
      message: `MFA code sent via ${channel}`,
      expiresIn: '5 minutes',
    };
  }

  /**
   * Send MFA code via email
   */
  async sendMFACodeByEmail(email, code, purpose) {
    try {
      const emailService = require('../config/emailService');
      const subject = 'Code de Vérification MyNet.tn';
      const html = `
                <h2>Vérification de Sécurité</h2>
                <p>Votre code de vérification pour ${purpose} est:</p>
                <h1 style="color: #0056B3; letter-spacing: 2px;">${code}</h1>
                <p>Ce code expire dans 5 minutes.</p>
                <p>Ne partagez jamais ce code avec quiconque.</p>
                <hr>
                <p>© MyNet.tn - Plateforme B2B</p>
            `;

      await emailService.sendEmail(email, subject, html);
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Send MFA code via SMS (placeholder for future implementation)
   */
  async sendMFACodeBySMS(userId, code) {
    // TODO: Implement SMS sending via Twilio or similar
    return false;
  }
}

module.exports = new MFAService();
