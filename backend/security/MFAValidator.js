const speakeasy = require('speakeasy');

class MFAValidator {
  generateSecret(email) {
    return speakeasy.generateSecret({
      name: `MyNet.tn (${email})`,
      issuer: 'MyNet.tn',
      length: 32,
    });
  }

  verifyToken(token, secret) {
    return speakeasy.totp.verify({
      secret: secret,
      encoding: 'base32',
      token: token,
      window: 2,
    });
  }

  generateBackupCodes(count = 10) {
    const codes = [];
    for (let i = 0; i < count; i++) {
      codes.push(Math.random().toString(36).substring(2, 10).toUpperCase());
    }
    return codes;
  }

  verifyBackupCode(code, backupCodes) {
    const codesArray = typeof backupCodes === 'string' ? JSON.parse(backupCodes) : backupCodes;
    const index = codesArray.indexOf(code);
    if (index === -1) return false;
    codesArray.splice(index, 1);
    return codesArray;
  }
}

module.exports = new MFAValidator();
