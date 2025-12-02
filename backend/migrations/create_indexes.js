// ✅ DATABASE INDEXES FOR PERFORMANCE OPTIMIZATION
// Run with: node backend/migrations/create_indexes.js

const { initializeDb, getPool } = require('../config/db');

async function createIndexes() {
  try {
    await initializeDb();
    const pool = getPool();

    // Index on users.email for login queries (CRITICAL)
    try {
      await pool.query(`
                CREATE INDEX IF NOT EXISTS idx_users_email 
                ON users(email) 
                WHERE is_deleted = FALSE AND is_active = TRUE;
            `);
    } catch (err) {
      if (!err.message.includes('already exists')) {
      }
    }

    // Index on users.role for filtering
    try {
      await pool.query(`
                CREATE INDEX IF NOT EXISTS idx_users_role 
                ON users(role) 
                WHERE is_deleted = FALSE;
            `);
    } catch (err) {
      if (!err.message.includes('already exists')) {
      }
    }

    // Index on tenders.status for fast filtering
    try {
      await pool.query(`
                CREATE INDEX IF NOT EXISTS idx_tenders_status 
                ON tenders(status);
            `);
    } catch (err) {
      if (!err.message.includes('already exists')) {
      }
    }

    // Index on offers.tender_id for quick lookups
    try {
      await pool.query(`
                CREATE INDEX IF NOT EXISTS idx_offers_tender_id 
                ON offers(tender_id);
            `);
    } catch (err) {
      if (!err.message.includes('already exists')) {
      }
    }

    // Index on offers.status for filtering
    try {
      await pool.query(`
                CREATE INDEX IF NOT EXISTS idx_offers_status 
                ON offers(status);
            `);
    } catch (err) {
      if (!err.message.includes('already exists')) {
      }
    }

    process.exit(0);
  } catch (error) {
    process.exit(1);
  }
}

createIndexes();
