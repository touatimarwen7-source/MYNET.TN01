// ✅ DATABASE INDEXES FOR PERFORMANCE OPTIMIZATION
// Run with: node backend/migrations/create_indexes.js

const { initializeDb, getPool } = require('../config/db');

async function createIndexes() {
    try {
        await initializeDb();
        const pool = getPool();
        
        console.log('📊 Creating database indexes for performance optimization...');
        
        // Index on users.email for login queries (CRITICAL)
        try {
            await pool.query(`
                CREATE INDEX IF NOT EXISTS idx_users_email 
                ON users(email) 
                WHERE is_deleted = FALSE AND is_active = TRUE;
            `);
            console.log('✅ Index created: idx_users_email');
        } catch (err) {
            if (!err.message.includes('already exists')) {
                console.warn('⚠️  idx_users_email:', err.message);
            }
        }
        
        // Index on users.role for filtering
        try {
            await pool.query(`
                CREATE INDEX IF NOT EXISTS idx_users_role 
                ON users(role) 
                WHERE is_deleted = FALSE;
            `);
            console.log('✅ Index created: idx_users_role');
        } catch (err) {
            if (!err.message.includes('already exists')) {
                console.warn('⚠️  idx_users_role:', err.message);
            }
        }
        
        // Index on tenders.status for fast filtering
        try {
            await pool.query(`
                CREATE INDEX IF NOT EXISTS idx_tenders_status 
                ON tenders(status);
            `);
            console.log('✅ Index created: idx_tenders_status');
        } catch (err) {
            if (!err.message.includes('already exists')) {
                console.warn('⚠️  idx_tenders_status:', err.message);
            }
        }
        
        // Index on offers.tender_id for quick lookups
        try {
            await pool.query(`
                CREATE INDEX IF NOT EXISTS idx_offers_tender_id 
                ON offers(tender_id);
            `);
            console.log('✅ Index created: idx_offers_tender_id');
        } catch (err) {
            if (!err.message.includes('already exists')) {
                console.warn('⚠️  idx_offers_tender_id:', err.message);
            }
        }
        
        // Index on offers.status for filtering
        try {
            await pool.query(`
                CREATE INDEX IF NOT EXISTS idx_offers_status 
                ON offers(status);
            `);
            console.log('✅ Index created: idx_offers_status');
        } catch (err) {
            if (!err.message.includes('already exists')) {
                console.warn('⚠️  idx_offers_status:', err.message);
            }
        }
        
        console.log('✅ All database indexes created successfully!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error creating indexes:', error.message);
        process.exit(1);
    }
}

createIndexes();
