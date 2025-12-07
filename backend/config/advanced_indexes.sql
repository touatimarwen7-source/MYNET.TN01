
-- 🚀 ADVANCED DATABASE INDEXES
-- Optimizes query performance for complex operations

-- ============ PARTIAL INDEXES (فهارس جزئية) ============
-- Only index active records to save space

CREATE INDEX IF NOT EXISTS idx_users_active_verified 
  ON users(email, role) 
  WHERE is_deleted = FALSE AND is_active = TRUE;

CREATE INDEX IF NOT EXISTS idx_tenders_published_active 
  ON tenders(publish_date DESC, deadline) 
  WHERE status = 'published' AND is_deleted = FALSE;

CREATE INDEX IF NOT EXISTS idx_offers_submitted_pending 
  ON offers(submitted_at DESC) 
  WHERE status = 'submitted' AND is_deleted = FALSE;

-- ============ COMPOSITE INDEXES (فهارس مركبة) ============
-- Optimizes multi-column queries

CREATE INDEX IF NOT EXISTS idx_offers_tender_supplier_status 
  ON offers(tender_id, supplier_id, status) 
  WHERE is_deleted = FALSE;

CREATE INDEX IF NOT EXISTS idx_tenders_buyer_status_deadline 
  ON tenders(buyer_id, status, deadline DESC) 
  WHERE is_deleted = FALSE;

CREATE INDEX IF NOT EXISTS idx_po_buyer_supplier_status 
  ON purchase_orders(buyer_id, supplier_id, status);

CREATE INDEX IF NOT EXISTS idx_invoices_po_supplier_status 
  ON invoices(po_id, supplier_id, status);

-- ============ COVERING INDEXES (فهارس تغطية) ============
-- Includes extra columns to avoid table lookups

CREATE INDEX IF NOT EXISTS idx_tenders_list_covering 
  ON tenders(status, deadline DESC) 
  INCLUDE (title, budget_min, budget_max, buyer_id);

CREATE INDEX IF NOT EXISTS idx_offers_evaluation_covering 
  ON offers(tender_id, status) 
  INCLUDE (total_amount, evaluation_score, submitted_at);

-- ============ EXPRESSION INDEXES (فهارس تعبيرية) ============
-- Optimizes computed column queries

CREATE INDEX IF NOT EXISTS idx_users_email_lower 
  ON users(LOWER(email)) 
  WHERE is_deleted = FALSE;

CREATE INDEX IF NOT EXISTS idx_users_company_name_lower 
  ON users(LOWER(company_name)) 
  WHERE is_deleted = FALSE;

CREATE INDEX IF NOT EXISTS idx_tenders_title_lower 
  ON tenders(LOWER(title)) 
  WHERE is_deleted = FALSE;

-- ============ GIN INDEXES FOR JSONB ============
-- Optimizes JSONB queries

CREATE INDEX IF NOT EXISTS idx_tenders_requirements_gin 
  ON tenders USING GIN(requirements);

CREATE INDEX IF NOT EXISTS idx_tenders_attachments_gin 
  ON tenders USING GIN(attachments);

CREATE INDEX IF NOT EXISTS idx_offers_attachments_gin 
  ON offers USING GIN(attachments);

CREATE INDEX IF NOT EXISTS idx_users_preferred_categories_gin 
  ON users USING GIN(preferred_categories);

CREATE INDEX IF NOT EXISTS idx_users_service_locations_gin 
  ON users USING GIN(service_locations);

-- ============ FULL TEXT SEARCH INDEXES ============
-- Optimizes search queries

CREATE INDEX IF NOT EXISTS idx_tenders_fulltext 
  ON tenders USING GIN(
    to_tsvector('french', COALESCE(title, '') || ' ' || COALESCE(description, ''))
  );

CREATE INDEX IF NOT EXISTS idx_users_fulltext 
  ON users USING GIN(
    to_tsvector('french', COALESCE(company_name, '') || ' ' || COALESCE(full_name, ''))
  );

-- ============ BRIN INDEXES (للجداول الكبيرة) ============
-- Space-efficient for large sequential data

CREATE INDEX IF NOT EXISTS idx_audit_logs_created_brin 
  ON audit_logs USING BRIN(created_at);

CREATE INDEX IF NOT EXISTS idx_notifications_created_brin 
  ON notifications USING BRIN(created_at);

CREATE INDEX IF NOT EXISTS idx_tender_history_created_brin 
  ON tender_history USING BRIN(created_at);

-- ============ HASH INDEXES ============
-- Optimizes equality checks

CREATE INDEX IF NOT EXISTS idx_users_email_hash 
  ON users USING HASH(email) 
  WHERE is_deleted = FALSE;

CREATE INDEX IF NOT EXISTS idx_encryption_keys_key_id_hash 
  ON encryption_keys USING HASH(key_id);

-- ============ INDEX STATISTICS ============
-- View index usage
CREATE OR REPLACE VIEW v_index_usage AS
SELECT 
  schemaname,
  tablename,
  indexname,
  idx_scan,
  idx_tup_read,
  idx_tup_fetch,
  pg_size_pretty(pg_relation_size(indexrelid)) AS index_size
FROM pg_stat_user_indexes
WHERE schemaname = 'public'
ORDER BY idx_scan DESC;

-- ============ UNUSED INDEX DETECTION ============
CREATE OR REPLACE VIEW v_unused_indexes AS
SELECT 
  schemaname,
  tablename,
  indexname,
  pg_size_pretty(pg_relation_size(indexrelid)) AS index_size
FROM pg_stat_user_indexes
WHERE schemaname = 'public'
  AND idx_scan = 0
  AND indexrelname NOT LIKE 'pg_%'
ORDER BY pg_relation_size(indexrelid) DESC;

-- ============ ANALYZE TABLES ============
ANALYZE users;
ANALYZE tenders;
ANALYZE offers;
ANALYZE purchase_orders;
ANALYZE invoices;
ANALYZE notifications;
ANALYZE audit_logs;
