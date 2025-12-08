
#!/usr/bin/env node

/**
 * 🔐 PRE-MIGRATION BACKUP SCRIPT
 * نسخ احتياطي كامل قبل بدء عملية الهجرة
 */

const { initializeDb, getPool } = require('../config/db');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);

async function createPreMigrationBackup() {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupDir = path.join(__dirname, '../backups/pre-migration');
  
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
  }

  try {
    await initializeDb();
    const pool = getPool();

    console.log('📊 1/4 - جمع معلومات قاعدة البيانات...');
    
    // احصائيات الجداول
    const tablesInfo = await pool.query(`
      SELECT 
        schemaname,
        tablename,
        pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size,
        n_live_tup as row_count
      FROM pg_stat_user_tables
      ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
    `);

    console.log('📦 2/4 - نسخ بنية الجداول...');
    
    // نسخ Schema
    const schemaBackup = await pool.query(`
      SELECT 
        'CREATE TABLE ' || tablename || ' (' ||
        array_to_string(
          array_agg(
            column_name || ' ' || data_type ||
            CASE WHEN character_maximum_length IS NOT NULL 
              THEN '(' || character_maximum_length || ')' 
              ELSE '' 
            END
          ), ', '
        ) || ');' as create_statement
      FROM information_schema.columns
      WHERE table_schema = 'public'
      GROUP BY tablename;
    `);

    console.log('🔗 3/4 - نسخ الفهارس والقيود...');
    
    // نسخ Indexes
    const indexesBackup = await pool.query(`
      SELECT indexdef 
      FROM pg_indexes 
      WHERE schemaname = 'public';
    `);

    console.log('💾 4/4 - حفظ النسخة الاحتياطية...');

    // حفظ المعلومات
    const backupData = {
      timestamp,
      database_info: {
        total_tables: tablesInfo.rows.length,
        tables: tablesInfo.rows
      },
      schema: schemaBackup.rows.map(r => r.create_statement),
      indexes: indexesBackup.rows.map(r => r.indexdef)
    };

    const backupFile = path.join(backupDir, `backup_${timestamp}.json`);
    fs.writeFileSync(backupFile, JSON.stringify(backupData, null, 2));

    console.log(`✅ النسخة الاحتياطية محفوظة: ${backupFile}`);
    console.log(`📊 عدد الجداول: ${tablesInfo.rows.length}`);
    
    return backupFile;
  } catch (error) {
    console.error('❌ فشل النسخ الاحتياطي:', error.message);
    throw error;
  }
}

if (require.main === module) {
  createPreMigrationBackup()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}

module.exports = { createPreMigrationBackup };
