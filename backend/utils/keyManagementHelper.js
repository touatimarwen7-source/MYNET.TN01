/**
 * Secure Key Management Helper
 * Best practices for handling secrets and API keys
 */

class KeyManagementHelper {
  static getRequiredEnv(key) {
    const value = process.env[key];
    if (!value) {
      throw new Error(`Missing required environment variable: ${key}`);
    }
    return value;
  }

  static getOptionalEnv(key, defaultValue) {
    return process.env[key] || defaultValue;
  }

  static maskKey(key) {
    if (!key || key.length < 8) return '****';
    return key.substring(0, 4) + '****' + key.substring(key.length - 4);
  }

  static validateKeyFormat(key, pattern) {
    if (!pattern.test(key)) {
      throw new Error('Invalid key format');
    }
    return true;
  }

  static rotateKey(oldKey, newKey) {
    if (!newKey) {
      throw new Error('New key required for rotation');
    }
    // Log rotation event
    // Use new key going forward
    return true;
  }
}

// Secure configuration loading
const loadSecureConfig = () => {
  const config = {
    database: {
      url: KeyManagementHelper.getRequiredEnv('DATABASE_URL'),
    },
    jwt: {
      secret: KeyManagementHelper.getRequiredEnv('JWT_SECRET'),
      expiresIn: KeyManagementHelper.getOptionalEnv('JWT_EXPIRY', '24h'),
    },
    mfa: {
      secret: KeyManagementHelper.getOptionalEnv('MFA_SECRET', ''),
    },
    email: {
      provider: KeyManagementHelper.getOptionalEnv('EMAIL_PROVIDER', 'gmail'),
      apiKey: KeyManagementHelper.getOptionalEnv('EMAIL_API_KEY', ''),
    },
  };

  // Validate required keys on startup
  if (!config.database.url) {
    throw new Error('Database configuration missing');
  }
  if (!config.jwt.secret) {
    throw new Error('JWT secret missing');
  }

  return config;
};

module.exports = {
  KeyManagementHelper,
  loadSecureConfig,
};
