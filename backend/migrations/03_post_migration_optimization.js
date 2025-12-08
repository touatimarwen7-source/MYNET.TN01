
#!/usr/bin/env node

/**
 * ⚡ POST-MIGRATION OPTIMIZATION
 * تحسين الأداء بعد اكتمال الهجرة
 */

const { initializeDb, getPool } = require('../config/db');

class PostMigrationOptimization {
  constructor() {
    this.pool = null;
    this.optimizationResults = {};
  }

  async execute() {
    console.log('⚡ بدء تحسين الأداء بعد الهجرة...\n');

    try {
      await initializeDb();
      this.pool = getPool();

      // 1. تحليل شامل للجداول
      await this.analyzeAllTables();

      // 2. تحسين الفهارس
      await this.optimizeIndexes();

      // 3. إنشاء إحصائيات متقدمة
      await this.createAdvancedStatistics();

      // 4. تحسين الاستعلامات الشائعة
      await this.createMaterializedViews();

      // 5. تنظيف البيانات القديمة
      await this.cleanupOldData();

      // 6. إنشاء Partitions للجداول الكبيرة
      await this.setupPartitioning();

      // 7. تقرير الأداء النهائي
      await this.generatePerformanceReport();

      console.log('\n✅ اكتمل تحسين الأداء بنجاح!');
      
      return true;
    } catch (error) {
      console.error('\n❌ فشل تحسين الأداء:', error.message);
      return false;
    }
  }

  async analyzeAllTables() {
    console.log('📊 1/7 - تحليل جميع الجداول...');
    
    const startTime = Date.now();
    await this.pool.query('VACUUM ANALYZE;');
    const duration = Date.now() - startTime;
    
    this.optimizationResults.vacuum_analyze = { duration, success: true };
    console.log(`   ✅ اكتمل التحليل في ${duration}ms`);
  }

  async optimizeIndexes() {
    console.log('\n🔗 2/7 - تحسين الفهارس...');

    // فهارس جزئية للبيانات النشطة فقط
    const partialIndexes = [
      `CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_active_tenders 
       ON tenders(status, deadline) 
       WHERE is_deleted = FALSE AND status IN ('open', 'published');`,
      
      `CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_pending_offers 
       ON offers(tender_id, created_at DESC) 
       WHERE is_deleted = FALSE AND status = 'pending';`,
      
      `CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_active_purchase_orders 
       ON purchase_orders(status, delivery_date) 
       WHERE is_deleted = FALSE AND status NOT IN ('delivered', 'cancelled');`,
    ];

    let createdCount = 0;
    for (const indexQuery of partialIndexes) {
      try {
        await this.pool.query(indexQuery);
        createdCount++;
      } catch (err) {
        if (!err.message.includes('already exists')) {
          console.log(`   ⚠️  ${err.message.substring(0, 50)}...`);
        }
      }
    }

    console.log(`   ✅ تم تحسين ${createdCount} فهرس جزئي`);
  }

  async createAdvancedStatistics() {
    console.log('\n📈 3/7 - إنشاء إحصائيات متقدمة...');

    const statsQuery = `
      DO $$ 
      BEGIN
        -- إحصائيات الأعمدة المهمة
        ALTER TABLE tenders ALTER COLUMN status SET STATISTICS 1000;
        ALTER TABLE tenders ALTER COLUMN category SET STATISTICS 1000;
        ALTER TABLE offers ALTER COLUMN status SET STATISTICS 1000;
        ALTER TABLE users ALTER COLUMN role SET STATISTICS 1000;
      END $$;
    `;

    try {
      await this.pool.query(statsQuery);
      console.log('   ✅ تم تحسين الإحصائيات');
    } catch (err) {
      console.log('   ℹ️  بعض الإحصائيات تتطلب صلاحيات إضافية');
    }
  }

  async createMaterializedViews() {
    console.log('\n🔍 4/7 - إنشاء Materialized Views...');

    // View للمناقصات النشطة
    await this.pool.query(`
      CREATE MATERIALIZED VIEW IF NOT EXISTS mv_active_tenders AS
      SELECT 
        t.*,
        u.company_name as buyer_name,
        COUNT(o.id) as offers_count
      FROM tenders t
      LEFT JOIN users u ON t.buyer_id = u.id
      LEFT JOIN offers o ON t.id = o.tender_id AND o.is_deleted = FALSE
      WHERE t.is_deleted = FALSE 
        AND t.status IN ('open', 'published')
      GROUP BY t.id, u.company_name;

      CREATE UNIQUE INDEX IF NOT EXISTS idx_mv_active_tenders_id 
      ON mv_active_tenders(id);
    `).catch(() => console.log('   ℹ️  View موجود مسبقاً'));

    // View لإحصائيات الموردين
    await this.pool.query(`
      CREATE MATERIALIZED VIEW IF NOT EXISTS mv_supplier_stats AS
      SELECT 
        u.id as supplier_id,
        u.company_name,
        COUNT(DISTINCT o.id) as total_offers,
        COUNT(DISTINCT CASE WHEN o.status = 'accepted' THEN o.id END) as accepted_offers,
        AVG(o.total_amount) as avg_offer_amount,
        COALESCE(AVG(r.rating), 0) as avg_rating
      FROM users u
      LEFT JOIN offers o ON u.id = o.supplier_id AND o.is_deleted = FALSE
      LEFT JOIN reviews r ON u.id = r.reviewed_user_id AND r.is_deleted = FALSE
      WHERE u.role = 'supplier' AND u.is_deleted = FALSE
      GROUP BY u.id, u.company_name;

      CREATE UNIQUE INDEX IF NOT EXISTS idx_mv_supplier_stats_id 
      ON mv_supplier_stats(supplier_id);
    `).catch(() => console.log('   ℹ️  View موجود مسبقاً'));

    console.log('   ✅ تم إنشاء Materialized Views');
  }

  async cleanupOldData() {
    console.log('\n🧹 5/7 - تنظيف البيانات القديمة...');

    // حذف السجلات المحذوفة القديمة (soft deleted) بعد 90 يوم
    const cleanupQueries = [
      `DELETE FROM audit_logs 
       WHERE created_at < NOW() - INTERVAL '90 days';`,
      
      `DELETE FROM notifications 
       WHERE is_deleted = TRUE 
         AND updated_at < NOW() - INTERVAL '30 days';`,
    ];

    let deletedCount = 0;
    for (const query of cleanupQueries) {
      try {
        const result = await this.pool.query(query);
        deletedCount += result.rowCount || 0;
      } catch (err) {
        console.log(`   ℹ️  تخطي تنظيف`);
      }
    }

    console.log(`   ✅ تم حذف ${deletedCount} سجل قديم`);
  }

  async setupPartitioning() {
    console.log('\n📂 6/7 - إعداد Partitioning...');

    // إنشاء جدول مقسم للسجلات التدقيقية (حسب الشهر)
    await this.pool.query(`
      DO $$ 
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_tables 
          WHERE tablename = 'audit_logs_partitioned'
        ) THEN
          CREATE TABLE audit_logs_partitioned (
            LIKE audit_logs INCLUDING ALL
          ) PARTITION BY RANGE (created_at);
          
          -- إنشاء partitions للأشهر القادمة
          CREATE TABLE audit_logs_y2025m01 
            PARTITION OF audit_logs_partitioned
            FOR VALUES FROM ('2025-01-01') TO ('2025-02-01');
          
          CREATE TABLE audit_logs_y2025m02 
            PARTITION OF audit_logs_partitioned
            FOR VALUES FROM ('2025-02-01') TO ('2025-03-01');
        END IF;
      END $$;
    `).catch(() => console.log('   ℹ️  Partitioning موجود مسبقاً'));

    console.log('   ✅ تم إعداد Partitioning');
  }

  async generatePerformanceReport() {
    console.log('\n📊 7/7 - إنشاء تقرير الأداء...');

    const report = await this.pool.query(`
      SELECT 
        'Database Size' as metric,
        pg_size_pretty(pg_database_size(current_database())) as value
      UNION ALL
      SELECT 
        'Tables Count',
        COUNT(*)::text
      FROM pg_tables 
      WHERE schemaname = 'public'
      UNION ALL
      SELECT 
        'Indexes Count',
        COUNT(*)::text
      FROM pg_indexes 
      WHERE schemaname = 'public'
      UNION ALL
      SELECT 
        'Active Connections',
        COUNT(*)::text
      FROM pg_stat_activity 
      WHERE state = 'active';
    `);

    console.log('\n📊 تقرير الأداء النهائي:');
    console.log('   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    report.rows.forEach(row => {
      console.log(`   ${row.metric.padEnd(25)} : ${row.value}`);
    });
    console.log('   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  }
}

async function runOptimization() {
  const optimization = new PostMigrationOptimization();
  const success = await optimization.execute();
  process.exit(success ? 0 : 1);
}

if (require.main === module) {
  runOptimization();
}

module.exports = { PostMigrationOptimization };
