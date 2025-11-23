require('dotenv').config();
const http = require('http');
const app = require('./app');
const { initializeDb } = require('./config/db');
const { initializeSchema } = require('./config/schema');
const { getPool } = require('./config/db');
const BackupScheduler = require('./services/backup/BackupScheduler');
const { initializeWebSocket } = require('./config/websocket');
const { errorTracker } = require('./services/ErrorTrackingService');

const PORT = process.env.PORT || 3000;

async function startServer() {
    try {
        console.log('========================================');
        console.log('MyNet.tn Backend Server Starting...');
        console.log('========================================');

        const dbConnected = await initializeDb();
        
        if (dbConnected) {
            const pool = getPool();
            await initializeSchema(pool);
            console.log('✅ Database initialized successfully');

            // 🔄 Initialize backup scheduler
            BackupScheduler.start();
        } else {
            console.warn('⚠️  Server starting without database connection');
        }

        // ✨ Create HTTP server for WebSocket support
        const server = http.createServer(app);
        
        // 🔌 Initialize WebSocket
        const io = initializeWebSocket(server);
        console.log('✅ WebSocket initialized');

        server.listen(PORT, '0.0.0.0', () => {
            console.log('========================================');
            console.log(`🚀 Server running on port ${PORT}`);
            console.log(`📍 Access API at: http://localhost:${PORT}`);
            console.log(`🔌 WebSocket available at: ws://localhost:${PORT}`);
            console.log('========================================');
            console.log('Available endpoints:');
            console.log('  - POST /api/auth/register');
            console.log('  - POST /api/auth/login');
            console.log('  - GET  /api/procurement/tenders');
            console.log('  - POST /api/procurement/tenders');
            console.log('  - POST /api/procurement/offers');
            console.log('  - GET  /api/admin/statistics');
            console.log('  - GET  /api/search/tenders');
            console.log('========================================');
        });

    } catch (error) {
        console.error('❌ Failed to start server:', error.message);
        errorTracker.trackError(error, {
            severity: 'critical',
            context: 'server_startup'
        });
        process.exit(1);
    }
}

// 🔍 Global error handlers for uncaught exceptions
process.on('uncaughtException', (error) => {
    console.error('💥 Uncaught Exception:', error);
    errorTracker.trackError(error, {
        severity: 'critical',
        context: 'uncaught_exception'
    });
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('💥 Unhandled Rejection:', reason);
    errorTracker.trackError(new Error(String(reason)), {
        severity: 'critical',
        context: 'unhandled_rejection'
    });
});

startServer();
