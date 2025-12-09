
-- ============================================================================
-- DASHBOARD PERFORMANCE INDEXES
-- ============================================================================
-- These indexes significantly improve dashboard query performance

-- Indexes for buyer dashboard stats
CREATE INDEX IF NOT EXISTS idx_tenders_buyer_status 
ON tenders(buyer_id, status) 
WHERE is_deleted = false;

CREATE INDEX IF NOT EXISTS idx_tenders_buyer_created 
ON tenders(buyer_id, created_at DESC) 
WHERE is_deleted = false;

-- Indexes for supplier dashboard stats  
CREATE INDEX IF NOT EXISTS idx_offers_supplier_status 
ON offers(supplier_id, status) 
WHERE is_deleted = false;

CREATE INDEX IF NOT EXISTS idx_offers_supplier_created 
ON offers(supplier_id, created_at DESC) 
WHERE is_deleted = false;

CREATE INDEX IF NOT EXISTS idx_offers_tender_id 
ON offers(tender_id) 
WHERE is_deleted = false;

-- Composite index for analytics queries
CREATE INDEX IF NOT EXISTS idx_tenders_buyer_created_month 
ON tenders(buyer_id, DATE_TRUNC('month', created_at)) 
WHERE is_deleted = false;

CREATE INDEX IF NOT EXISTS idx_offers_supplier_created_month 
ON offers(supplier_id, DATE_TRUNC('month', created_at)) 
WHERE is_deleted = false;

-- Analyze tables to update statistics
ANALYZE tenders;
ANALYZE offers;
