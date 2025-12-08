
-- Performance indexes for admin dashboard queries
-- Run this migration to improve query performance

-- Users table indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_users_deleted_role 
ON users(is_deleted, role) WHERE is_deleted = FALSE;

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_users_created_at 
ON users(created_at DESC) WHERE is_deleted = FALSE;

-- Tenders table indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_tenders_deleted 
ON tenders(is_deleted) WHERE is_deleted = FALSE;

-- Offers table indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_offers_deleted 
ON offers(is_deleted) WHERE is_deleted = FALSE;

-- Purchase orders indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_purchase_orders_deleted 
ON purchase_orders(is_deleted) WHERE is_deleted = FALSE;

-- Audit logs indexes for recent activities
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_audit_logs_created_at 
ON audit_logs(created_at DESC);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_audit_logs_user_action 
ON audit_logs(user_id, action, created_at DESC);

-- Analyze tables after index creation
ANALYZE users;
ANALYZE tenders;
ANALYZE offers;
ANALYZE purchase_orders;
ANALYZE audit_logs;
