// MFA Endpoints للإضافة في authController.js:

const MFAValidator = require('../security/MFAValidator');
const { getPool } = require('../config/db');

class MFAEndpoints {
  async setupMFA(req, res) {
    try {
      const userId = req.user.id;
      const email = req.user.email;

      const secret = MFAValidator.generateSecret(email);
      const backupCodes = MFAValidator.generateBackupCodes();

      res.status(200).json({
        success: true,
        secret: secret.base32,
        qrCode: secret.otpauth_url,
        backupCodes: backupCodes,
        message: 'Scan the QR code with your authenticator app',
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async verifyMFASetup(req, res) {
    try {
      const { token, secret, backupCodes } = req.body;
      const userId = req.user.id;
      const pool = getPool();

      const isValid = MFAValidator.verifyToken(token, secret);
      if (!isValid) {
        return res.status(400).json({ error: 'Invalid MFA token' });
      }

      await pool.query(
        `UPDATE users SET mfa_enabled = TRUE, mfa_secret = $1, mfa_backup_codes = $2 
                 WHERE id = $3`,
        [secret, JSON.stringify(backupCodes), userId]
      );

      res.status(200).json({
        success: true,
        message: 'MFA enabled successfully',
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async verifyMFALogin(req, res) {
    try {
      const { email, token, backupCode } = req.body;
      const pool = getPool();

      const userResult = await pool.query(
        'SELECT * FROM users WHERE email = $1 AND mfa_enabled = TRUE',
        [email]
      );

      if (!userResult.rows[0]) {
        return res.status(400).json({ error: 'MFA not enabled for this user' });
      }

      const user = userResult.rows[0];
      let isValid = false;

      if (token) {
        isValid = MFAValidator.verifyToken(token, user.mfa_secret);
      } else if (backupCode) {
        const remainingCodes = MFAValidator.verifyBackupCode(backupCode, user.mfa_backup_codes);
        if (remainingCodes) {
          isValid = true;
          await pool.query('UPDATE users SET mfa_backup_codes = $1 WHERE id = $2', [
            JSON.stringify(remainingCodes),
            user.id,
          ]);
        }
      }

      if (!isValid) {
        return res.status(400).json({ error: 'Invalid MFA token or backup code' });
      }

      res.status(200).json({
        success: true,
        message: 'MFA verification successful',
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new MFAEndpoints();
