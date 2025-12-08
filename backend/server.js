
require('dotenv').config();
const http = require('http');

const PORT = process.env.PORT || 3000;
const HOST = '0.0.0.0';

async function killExistingProcesses() {
  try {
    const { execSync } = require('child_process');
    
    console.log('🧹 Cleaning up existing processes...');
    
    // Multiple cleanup strategies
    try {
      // Strategy 1: Kill by port (most reliable)
      execSync(`lsof -ti:${PORT} | xargs kill -9 2>/dev/null || true`, { stdio: 'pipe' });
      console.log('✓ Killed processes on port', PORT);
    } catch (e) {}
    
    try {
      // Strategy 2: fuser (alternative)
      execSync(`fuser -k ${PORT}/tcp 2>/dev/null || true`, { stdio: 'pipe' });
    } catch (e) {}
    
    try {
      // Strategy 3: Kill all node server.js processes
      execSync(`pkill -9 -f "node.*server.js" 2>/dev/null || true`, { stdio: 'pipe' });
    } catch (e) {}
    
    // Wait for port to be fully released
    await new Promise(resolve => setTimeout(resolve, 2000));
    console.log('✅ Cleanup completed');
  } catch (e) {
    console.log('⚠️ Cleanup completed with warnings');
  }
}

async function startServer() {
  try {
    // Kill existing processes ONCE
    await killExistingProcesses();

    console.log('========================================');
    console.log('🚀 MyNet.tn Backend Starting...');
    console.log('========================================');

    // Check if node_modules exists
    const fs = require('fs');
    const path = require('path');
    const nodeModulesPath = path.join(__dirname, 'node_modules');
    
    if (!fs.existsSync(nodeModulesPath)) {
      console.log('⚠️ Installing dependencies...');
      const { execSync } = require('child_process');
      execSync('npm install', { stdio: 'inherit', cwd: __dirname });
      console.log('✅ Dependencies installed');
    }

    // Bootstrap DI Container
    const { bootstrap } = require('./core/bootstrap');
    await bootstrap();
    console.log('✅ DI Container initialized');

    // Initialize database
    const { initializeDb } = require('./config/db');
    const dbInitialized = await initializeDb();

    if (!dbInitialized) {
      console.warn('⚠️ Database connection failed - running in limited mode');
    } else {
      console.log('✅ Database connected');
      
      try {
        const { checkDatabaseHealth } = require('./utils/databaseHealthCheck');
        const health = await checkDatabaseHealth();
        console.log(`✅ Database health: ${health.status}`);
      } catch (healthError) {
        console.warn('⚠️ Health check skipped');
      }
    }

    // Import app
    const app = require('./app');

    // Create HTTP server
    const httpServer = http.createServer(app);

    // Handle server errors - EXIT instead of retry to prevent loops
    httpServer.on('error', (error) => {
      if (error.code === 'EADDRINUSE') {
        console.error(`\n❌ FATAL: Port ${PORT} is still in use after cleanup`);
        console.error('Please manually stop the process and restart.\n');
        process.exit(1); // Exit instead of retry
      } else {
        console.error('❌ Server error:', error.message);
        process.exit(1);
      }
    });

    // Start listening
    httpServer.listen(PORT, HOST, () => {
      console.log('========================================');
      console.log(`✅ Backend running on http://${HOST}:${PORT}`);
      console.log(`✅ Network: http://172.31.68.98:${PORT}`);
      console.log('========================================');
      console.log('📋 Available Endpoints:');
      console.log('  • Health: GET /health');
      console.log('  • Auth: POST /api/auth/login');
      console.log('  • Tenders: GET /api/procurement/tenders');
      console.log('  • API Docs: GET /api-docs');
      console.log('========================================');
      console.log('👥 Test Accounts:');
      console.log('  • Buyer: buyer@mynet.tn / buyer123');
      console.log('  • Supplier: supplier@mynet.tn / supplier123');
      console.log('========================================');
    });

    // Graceful shutdown
    process.on('SIGTERM', () => {
      console.log('⚠️ SIGTERM received, shutting down...');
      httpServer.close(() => {
        console.log('✅ Server closed');
        process.exit(0);
      });
    });

  } catch (error) {
    console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.error('❌ CRITICAL: Failed to start server');
    console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.error('Error:', error.message);
    
    if (error.stack) {
      console.error('Stack:', error.stack.split('\n').slice(0, 5).join('\n'));
    }
    
    console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    process.exit(1);
  }
}

// Global error handlers
process.on('uncaughtException', (error) => {
  console.error('💥 Uncaught Exception:', error.message);
  process.exit(1);
});

process.on('unhandledRejection', (reason) => {
  console.error('💥 Unhandled Rejection:', String(reason));
  process.exit(1);
});

// Start
startServer();
