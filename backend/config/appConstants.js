/**
 * 🔧 APPLICATION CONSTANTS
 * Centralized configuration for hardcoded values
 */

module.exports = {
  // File Upload & Request Limits
  REQUEST_SIZE_LIMIT: {
    MAX_BYTES: 1048576, // 1MB in bytes
    MAX_SIZE_MB: 1,
    FORMAT: '1mb'
  },

  // Rate Limiting
  RATE_LIMIT: {
    WINDOW_MS: 15 * 60 * 1000, // 15 minutes
    MAX_REQUESTS: 100
  },

  // Pagination
  PAGINATION: {
    DEFAULT_PAGE: 1,
    DEFAULT_LIMIT: 20,
    MAX_LIMIT: 100
  },

  // Cache
  CACHE: {
    DEFAULT_TTL: 30 * 60, // 30 minutes in seconds
    SHORT_TTL: 5 * 60, // 5 minutes
    LONG_TTL: 24 * 60 * 60 // 24 hours
  },

  // API Response
  API: {
    DEFAULT_TIMEOUT: 30000, // 30 seconds
    RETRY_ATTEMPTS: 3
  },

  // Database
  DATABASE: {
    POOL_SIZE: 20,
    QUERY_TIMEOUT: 30000
  },

  // Security
  SECURITY: {
    BCRYPT_ROUNDS: 10,
    TOKEN_EXPIRY: '24h',
    REFRESH_TOKEN_EXPIRY: '7d'
  }
};
