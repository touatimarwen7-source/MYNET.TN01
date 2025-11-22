const { Pool } = require('pg');

let pool;

async function initializeDb() {
    try {
        if (!pool) {
            pool = new Pool({
                connectionString: process.env.DATABASE_URL,
                ssl: {
                    rejectUnauthorized: false
                },
                // 🚀 STABLE CONNECTION POOL - Optimized for Neon/Replit
                max: 20,                    // Reduced from 30 (Neon limits)
                min: 5,                     // Reduced from 10
                idleTimeoutMillis: 60000,   // 60s (increased from 30s to prevent idle disconnects)
                connectionTimeoutMillis: 10000,
                application_name: 'mynet-backend',
                maxUses: 7500,              // Recycle connections to prevent memory leaks
                statement_timeout: 30000,   // 30s query timeout
                query_timeout: 30000,       // Query timeout
                idle_in_transaction_session_timeout: 30000
            });

            // Add error handlers to prevent unhandled errors
            pool.on('error', (err) => {
                console.error('❌ POOL ERROR:', err.message);
                // Don't crash the app on pool errors
            });

            pool.on('connect', () => {
                console.log('✅ New connection added to pool');
            });

            pool.on('remove', () => {
                console.log('⚠️ Connection removed from pool');
            });

            // Test connection
            const client = await pool.connect();
            try {
                const result = await client.query('SELECT NOW()');
                console.log('✅ DATABASE: Connection Pool created and connected successfully to Neon PostgreSQL.');
                console.log(`   Max connections: 20 | Min connections: 5`);
                console.log(`   Idle timeout: 60s | Connection timeout: 10s`);
            } finally {
                client.release();
            }
        }
        return true;
    } catch (error) {
        console.error('❌ DATABASE ERROR: Failed to connect to Neon PostgreSQL.');
        console.error('Error Details:', error.message);
        console.error('Connection String:', process.env.DATABASE_URL ? '✓ Present' : '✗ Missing');
        return false;
    }
}

function getPool() {
    if (!pool) {
        throw new Error("Database Pool not initialized. Call initializeDb() first.");
    }
    return pool;
}

// Graceful shutdown
async function closeDb() {
    if (pool) {
        console.log('🛑 Closing database connections...');
        await pool.end();
        console.log('✅ Database connections closed');
        pool = null;
    }
}

// Handle process termination
process.on('SIGTERM', closeDb);
process.on('SIGINT', closeDb);

module.exports = {
    initializeDb,
    getPool,
    closeDb
};
