#!/usr/bin/env node

const { initializeDb, getPool } = require('../config/db');
const { initializeSchema } = require('../config/schema');

async function initDatabase() {
  try {
    
    // Initialize connection pool
    const connected = await initializeDb();
    if (!connected) {
      process.exit(1);
    }
    
    const pool = getPool();
    
    // Create all tables
    await initializeSchema(pool);
    
    process.exit(0);
  } catch (error) {
    process.exit(1);
  }
}

if (require.main === module) {
  initDatabase();
}

module.exports = { initDatabase };
