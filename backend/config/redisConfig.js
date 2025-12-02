/**
 * Redis Configuration
 * Manages Redis connection with environment variables
 */

const redis = require('redis');

const config = {
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD || undefined,
  db: parseInt(process.env.REDIS_DB || '0'),
  socket: {
    reconnectStrategy: (retries) => {
      if (retries > 10) {
        return new Error('Max retries reached');
      }
      return Math.min(retries * 50, 500);
    },
  },
};

// Remove undefined password
if (!config.password) {
  delete config.password;
}

module.exports = {
  config,
  createClient() {
    return redis.createClient(config);
  },
};
