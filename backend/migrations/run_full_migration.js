
#!/usr/bin/env node

/**
 * 🎯 FULL MIGRATION ORCHESTRATOR
 * تنسيق عملية الهجرة الكاملة
 */

const { createPreMigrationBackup } = require('./00_pre_migration_backup');
const { SmartMigration } = require('./01_smart_migration');
const { PostMigrationOptimization } = require('./03_post_migration_optimization');
const { RollbackRecovery } = require('./02_rollback_recovery');

async function runFullMigration() {
  console.log('═══════════════════════════════════════════════════════');
  console.log('🎯 MYNET.TN - FULL DATABASE MIGRATION');
  console.log('═══════════════════════════════════════════════════════\n');

  const startTime = Date.now();
  let backupFile = null;

  try {
    // المرحلة 1: النسخ الاحتياطي
    console.log('📦 المرحلة 1/4: النسخ الاحتياطي');
    console.log('─────────────────────────────────────────────────────\n');
    try {
      backupFile = await createPreMigrationBackup();
    } catch (err) {
      console.log('⚠️  تخطي النسخ الاحتياطي (قاعدة بيانات جديدة)\n');
    }

    // المرحلة 2: الهجرة الذكية
    console.log('\n📦 المرحلة 2/4: الهجرة الذكية');
    console.log('─────────────────────────────────────────────────────\n');
    const migration = new SmartMigration();
    const migrationSuccess = await migration.execute();

    if (!migrationSuccess) {
      throw new Error('فشلت عملية الهجرة');
    }

    // المرحلة 3: تحسين الأداء
    console.log('\n📦 المرحلة 3/4: تحسين الأداء');
    console.log('─────────────────────────────────────────────────────\n');
    const optimization = new PostMigrationOptimization();
    await optimization.execute();

    // المرحلة 4: التحقق النهائي
    console.log('\n📦 المرحلة 4/4: التحقق النهائي');
    console.log('─────────────────────────────────────────────────────\n');
    await runFinalVerification();

    const duration = ((Date.now() - startTime) / 1000).toFixed(2);

    console.log('\n═══════════════════════════════════════════════════════');
    console.log('✅ اكتملت عملية الهجرة بنجاح!');
    console.log(`⏱️  المدة الإجمالية: ${duration} ثانية`);
    console.log('═══════════════════════════════════════════════════════\n');

    process.exit(0);
  } catch (error) {
    console.error('\n═══════════════════════════════════════════════════════');
    console.error('❌ فشلت عملية الهجرة!');
    console.error(`   الخطأ: ${error.message}`);
    console.error('═══════════════════════════════════════════════════════\n');

    // محاولة التراجع إذا كان هناك نسخة احتياطية
    if (backupFile) {
      console.log('🔙 محاولة التراجع...\n');
      const recovery = new RollbackRecovery(backupFile);
      await recovery.execute();
    }

    process.exit(1);
  }
}

async function runFinalVerification() {
  const { getPool } = require('../config/db');
  const pool = getPool();

  const checks = [
    {
      name: 'وجود الجداول الأساسية',
      query: `
        SELECT COUNT(*) as count 
        FROM pg_tables 
        WHERE schemaname = 'public' 
          AND tablename IN ('users', 'tenders', 'offers', 'purchase_orders', 'invoices');
      `,
      expected: 5
    },
    {
      name: 'وجود الفهارس',
      query: `SELECT COUNT(*) as count FROM pg_indexes WHERE schemaname = 'public';`,
      minExpected: 20
    },
    {
      name: 'صلاحية الاتصال',
      query: `SELECT NOW() as current_time;`,
      validation: (result) => result.rows.length > 0
    }
  ];

  console.log('🔍 إجراء الفحوصات النهائية...\n');

  for (const check of checks) {
    try {
      const result = await pool.query(check.query);
      
      let passed = false;
      if (check.expected !== undefined) {
        passed = parseInt(result.rows[0].count) >= check.expected;
      } else if (check.minExpected !== undefined) {
        passed = parseInt(result.rows[0].count) >= check.minExpected;
      } else if (check.validation) {
        passed = check.validation(result);
      }

      console.log(`   ${passed ? '✅' : '❌'} ${check.name}`);
      
      if (!passed) {
        throw new Error(`فشل الفحص: ${check.name}`);
      }
    } catch (err) {
      console.log(`   ❌ ${check.name}: ${err.message}`);
      throw err;
    }
  }

  console.log('\n✅ جميع الفحوصات نجحت');
}

if (require.main === module) {
  runFullMigration();
}

module.exports = { runFullMigration };
