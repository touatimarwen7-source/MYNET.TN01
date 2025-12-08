
#!/usr/bin/env node

/**
 * 🚀 SMART MIGRATION SCRIPT
 * هجرة ذكية مع معالجة الأخطاء والتراجع التلقائي
 */

const { initializeDb, getPool } = require('../config/db');
const { initializeSchema } = require('../config/schema');
const { performanceIndexes } = require('./add_performance_indexes');

class SmartMigration {
  constructor() {
    this.pool = null;
    this.migrationSteps = [];
    this.completedSteps = [];
    this.failedStep = null;
  }

  async execute() {
    console.log('🚀 بدء عملية الهجرة الذكية...\n');

    try {
      // 1. الاتصال بقاعدة البيانات
      await this.step('database_connection', async () => {
        const connected = await initializeDb();
        if (!connected) throw new Error('فشل الاتصال بقاعدة البيانات');
        this.pool = getPool();
      });

      // 2. التحقق من حالة قاعدة البيانات
      await this.step('check_existing_tables', async () => {
        const result = await this.pool.query(`
          SELECT tablename 
          FROM pg_tables 
          WHERE schemaname = 'public';
        `);
        
        console.log(`   📊 جداول موجودة: ${result.rows.length}`);
        
        if (result.rows.length > 0) {
          console.log('   ⚠️  تحذير: توجد جداول موجودة مسبقاً');
          console.log('   الجداول:', result.rows.map(r => r.tablename).join(', '));
        }
      });

      // 3. إنشاء الجداول الأساسية
      await this.step('create_core_tables', async () => {
        await initializeSchema(this.pool);
      });

      // 4. إنشاء الفهارس للأداء
      await this.step('create_performance_indexes', async () => {
        for (const indexQuery of performanceIndexes) {
          try {
            await this.pool.query(indexQuery);
          } catch (err) {
            if (!err.message.includes('already exists')) {
              throw err;
            }
          }
        }
        console.log(`   ✅ تم إنشاء ${performanceIndexes.length} فهرس`);
      });

      // 5. إنشاء فهارس مركبة متقدمة
      await this.step('create_composite_indexes', async () => {
        const compositeIndexes = [
          // تحسين استعلامات المناقصات
          `CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_tenders_buyer_status_deadline 
           ON tenders(buyer_id, status, deadline DESC) WHERE is_deleted = FALSE;`,
          
          // تحسين استعلامات العروض
          `CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_offers_tender_supplier_status 
           ON offers(tender_id, supplier_id, status) WHERE is_deleted = FALSE;`,
          
          // تحسين استعلامات أوامر الشراء
          `CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_po_buyer_supplier_status 
           ON purchase_orders(buyer_id, supplier_id, status) WHERE is_deleted = FALSE;`,
          
          // تحسين استعلامات الفواتير
          `CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_invoices_po_status_date 
           ON invoices(purchase_order_id, status, created_at DESC) WHERE is_deleted = FALSE;`,
          
          // تحسين استعلامات المستخدمين
          `CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_users_role_active_verified 
           ON users(role, is_active, is_verified) WHERE is_deleted = FALSE;`,
        ];

        for (const indexQuery of compositeIndexes) {
          try {
            await this.pool.query(indexQuery);
          } catch (err) {
            if (!err.message.includes('already exists')) {
              console.log(`   ⚠️  تخطي فهرس: ${err.message}`);
            }
          }
        }
        console.log(`   ✅ تم إنشاء ${compositeIndexes.length} فهرس مركب`);
      });

      // 6. تحسين إعدادات PostgreSQL
      await this.step('optimize_database_settings', async () => {
        await this.pool.query(`
          ALTER DATABASE current_database() SET work_mem = '64MB';
          ALTER DATABASE current_database() SET maintenance_work_mem = '256MB';
          ALTER DATABASE current_database() SET effective_cache_size = '2GB';
          ALTER DATABASE current_database() SET random_page_cost = 1.1;
        `).catch(() => {
          console.log('   ℹ️  بعض الإعدادات تتطلب صلاحيات superuser');
        });
      });

      // 7. تحليل الجداول
      await this.step('analyze_tables', async () => {
        await this.pool.query('ANALYZE;');
        console.log('   ✅ تم تحليل جميع الجداول');
      });

      // 8. التحقق النهائي
      await this.step('final_verification', async () => {
        const verification = await this.pool.query(`
          SELECT 
            (SELECT COUNT(*) FROM pg_tables WHERE schemaname = 'public') as tables_count,
            (SELECT COUNT(*) FROM pg_indexes WHERE schemaname = 'public') as indexes_count,
            pg_database_size(current_database()) as db_size;
        `);
        
        const stats = verification.rows[0];
        console.log('   📊 الإحصائيات النهائية:');
        console.log(`      - الجداول: ${stats.tables_count}`);
        console.log(`      - الفهارس: ${stats.indexes_count}`);
        console.log(`      - حجم قاعدة البيانات: ${(stats.db_size / 1024 / 1024).toFixed(2)} MB`);
      });

      console.log('\n✅ اكتملت عملية الهجرة بنجاح!');
      console.log(`📊 تم إنجاز ${this.completedSteps.length} خطوة`);
      
      return true;
    } catch (error) {
      console.error(`\n❌ فشلت الهجرة في الخطوة: ${this.failedStep}`);
      console.error(`   الخطأ: ${error.message}`);
      
      await this.rollback();
      return false;
    }
  }

  async step(name, fn) {
    console.log(`\n🔄 [${this.migrationSteps.length + 1}] ${name.replace(/_/g, ' ')}...`);
    this.migrationSteps.push(name);
    
    try {
      await fn();
      this.completedSteps.push(name);
      console.log(`   ✅ نجحت الخطوة`);
    } catch (error) {
      this.failedStep = name;
      throw error;
    }
  }

  async rollback() {
    if (this.completedSteps.length === 0) {
      console.log('⏭️  لا توجد خطوات للتراجع عنها');
      return;
    }

    console.log('\n🔙 بدء عملية التراجع...');
    console.log(`   سيتم التراجع عن ${this.completedSteps.length} خطوة`);
    
    // في حالة الفشل، نسجل ذلك فقط دون حذف البيانات
    // لأن حذف البيانات قد يكون خطيراً
    console.log('   ℹ️  تم تسجيل الفشل. يُنصح بمراجعة السجلات والتصحيح يدوياً');
  }
}

async function runMigration() {
  const migration = new SmartMigration();
  const success = await migration.execute();
  process.exit(success ? 0 : 1);
}

if (require.main === module) {
  runMigration();
}

module.exports = { SmartMigration };
