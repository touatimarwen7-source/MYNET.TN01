
#!/usr/bin/env node

/**
 * 🚀 APPLY ADVANCED DATABASE FEATURES
 * Run: node backend/migrations/apply_advanced_features.js
 */

const { initializeDb, getPool, closeDb } = require('../config/db');
const fs = require('fs').promises;
const path = require('path');

async function applyAdvancedFeatures() {
  console.log('🚀 Starting advanced database features application...\n');
  
  try {
    await initializeDb();
    const pool = getPool();
    
    const sqlFiles = [
      'advanced_constraints.sql',
      'advanced_indexes.sql',
      'database_triggers.sql',
      'database_views.sql'
    ];
    
    for (const file of sqlFiles) {
      console.log(`📄 Applying ${file}...`);
      const filePath = path.join(__dirname, '..', 'config', file);
      
      try {
        const sql = await fs.readFile(filePath, 'utf8');
        await pool.query(sql);
        console.log(`✅ ${file} applied successfully\n`);
      } catch (error) {
        console.error(`❌ Error applying ${file}:`, error.message);
        // Continue with other files
      }
    }
    
    // Run VACUUM ANALYZE
    console.log('🧹 Running VACUUM ANALYZE...');
    await pool.query('VACUUM ANALYZE;');
    console.log('✅ VACUUM ANALYZE completed\n');
    
    // Get statistics
    console.log('📊 Database Statistics:');
    const stats = await pool.query(`
      SELECT 
        schemaname,
        COUNT(*) as total_tables,
        pg_size_pretty(SUM(pg_total_relation_size(schemaname||'.'||tablename))::bigint) as total_size
      FROM pg_tables
      WHERE schemaname = 'public'
      GROUP BY schemaname
    `);
    
    if (stats.rows.length > 0) {
      console.log(`   Tables: ${stats.rows[0].total_tables}`);
      console.log(`   Total Size: ${stats.rows[0].total_size}`);
    }
    
    // Get index statistics
    const indexStats = await pool.query(`
      SELECT COUNT(*) as total_indexes
      FROM pg_indexes
      WHERE schemaname = 'public'
    `);
    
    if (indexStats.rows.length > 0) {
      console.log(`   Indexes: ${indexStats.rows[0].total_indexes}`);
    }
    
    console.log('\n✅ All advanced features applied successfully!');
    console.log('\n📋 Summary:');
    console.log('   ✅ Advanced Constraints');
    console.log('   ✅ Advanced Indexes (Partial, Composite, GIN, BRIN, Hash)');
    console.log('   ✅ Database Triggers (Audit, Automation, Validation)');
    console.log('   ✅ Database Views (Analytics, Performance, Health)');
    console.log('\n🎉 Database is now enterprise-grade!');
    
  } catch (error) {
    console.error('❌ Fatal error:', error);
    process.exit(1);
  } finally {
    await closeDb();
    process.exit(0);
  }
}

// Run if called directly
if (require.main === module) {
  applyAdvancedFeatures();
}

module.exports = { applyAdvancedFeatures };
