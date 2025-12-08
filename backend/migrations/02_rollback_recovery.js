
#!/usr/bin/env node

/**
 * 🔙 ROLLBACK & RECOVERY SCRIPT
 * التراجع والتعافي من أخطاء الهجرة
 */

const { initializeDb, getPool } = require('../config/db');
const fs = require('fs');
const path = require('path');

class RollbackRecovery {
  constructor(backupFile = null) {
    this.backupFile = backupFile;
    this.pool = null;
  }

  async execute() {
    console.log('🔙 بدء عملية التراجع والتعافي...\n');

    try {
      await initializeDb();
      this.pool = getPool();

      // 1. إيجاد أحدث نسخة احتياطية
      if (!this.backupFile) {
        this.backupFile = this.findLatestBackup();
      }

      if (!this.backupFile) {
        throw new Error('لم يتم العثور على نسخة احتياطية');
      }

      console.log(`📂 استخدام النسخة الاحتياطية: ${this.backupFile}`);

      // 2. قراءة النسخة الاحتياطية
      const backupData = JSON.parse(fs.readFileSync(this.backupFile, 'utf-8'));
      console.log(`📊 معلومات النسخة:`);
      console.log(`   - التاريخ: ${backupData.timestamp}`);
      console.log(`   - عدد الجداول: ${backupData.database_info.total_tables}`);

      // 3. إنشاء نقطة حفظ
      await this.pool.query('BEGIN;');
      await this.pool.query('SAVEPOINT recovery_point;');

      // 4. حذف الجداول المعطوبة (إذا لزم الأمر)
      console.log('\n🗑️  حذف الجداول المعطوبة...');
      await this.dropCorruptedTables();

      // 5. استعادة البنية من النسخة الاحتياطية
      console.log('\n📦 استعادة بنية الجداول...');
      for (const createStmt of backupData.schema) {
        try {
          await this.pool.query(createStmt);
        } catch (err) {
          console.log(`   ℹ️  تخطي جدول موجود: ${err.message.substring(0, 50)}...`);
        }
      }

      // 6. استعادة الفهارس
      console.log('\n🔗 استعادة الفهارس...');
      for (const indexDef of backupData.indexes) {
        try {
          await this.pool.query(indexDef);
        } catch (err) {
          console.log(`   ℹ️  تخطي فهرس موجود`);
        }
      }

      // 7. التحقق من الاستعادة
      const verification = await this.pool.query(`
        SELECT COUNT(*) as tables_count 
        FROM pg_tables 
        WHERE schemaname = 'public';
      `);

      console.log(`\n✅ تمت الاستعادة بنجاح`);
      console.log(`   - الجداول المستعادة: ${verification.rows[0].tables_count}`);

      await this.pool.query('COMMIT;');
      
      return true;
    } catch (error) {
      console.error('\n❌ فشلت عملية الاستعادة:', error.message);
      
      if (this.pool) {
        await this.pool.query('ROLLBACK TO SAVEPOINT recovery_point;');
        await this.pool.query('ROLLBACK;');
      }
      
      return false;
    }
  }

  findLatestBackup() {
    const backupDir = path.join(__dirname, '../backups/pre-migration');
    
    if (!fs.existsSync(backupDir)) {
      return null;
    }

    const files = fs.readdirSync(backupDir)
      .filter(f => f.startsWith('backup_') && f.endsWith('.json'))
      .sort()
      .reverse();

    return files.length > 0 ? path.join(backupDir, files[0]) : null;
  }

  async dropCorruptedTables() {
    const tables = await this.pool.query(`
      SELECT tablename 
      FROM pg_tables 
      WHERE schemaname = 'public';
    `);

    for (const row of tables.rows) {
      try {
        await this.pool.query(`DROP TABLE IF EXISTS ${row.tablename} CASCADE;`);
        console.log(`   🗑️  حذف جدول: ${row.tablename}`);
      } catch (err) {
        console.log(`   ⚠️  فشل حذف: ${row.tablename}`);
      }
    }
  }
}

async function runRecovery() {
  const recovery = new RollbackRecovery();
  const success = await recovery.execute();
  process.exit(success ? 0 : 1);
}

if (require.main === module) {
  runRecovery();
}

module.exports = { RollbackRecovery };
