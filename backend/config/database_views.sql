
-- 📊 ADVANCED DATABASE VIEWS
-- Simplifies complex queries

-- ============ ACTIVE TENDERS VIEW ============
CREATE OR REPLACE VIEW v_active_tenders AS
SELECT 
  t.*,
  u.company_name AS buyer_company,
  u.email AS buyer_email,
  COUNT(DISTINCT o.id) AS offer_count,
  AVG(o.total_amount) AS avg_offer_amount,
  MIN(o.total_amount) AS min_offer_amount,
  MAX(o.total_amount) AS max_offer_amount
FROM tenders t
LEFT JOIN users u ON t.buyer_id = u.id
LEFT JOIN offers o ON t.id = o.tender_id AND o.is_deleted = FALSE
WHERE t.is_deleted = FALSE 
  AND t.status IN ('published', 'open')
  AND t.deadline > CURRENT_TIMESTAMP
GROUP BY t.id, u.company_name, u.email;

-- ============ SUPPLIER PERFORMANCE VIEW ============
CREATE OR REPLACE VIEW v_supplier_performance AS
SELECT 
  u.id AS supplier_id,
  u.company_name,
  u.email,
  COUNT(DISTINCT o.id) AS total_offers,
  COUNT(DISTINCT CASE WHEN o.is_winner = TRUE THEN o.id END) AS won_offers,
  ROUND(
    COUNT(DISTINCT CASE WHEN o.is_winner = TRUE THEN o.id END)::NUMERIC / 
    NULLIF(COUNT(DISTINCT o.id), 0) * 100, 
    2
  ) AS win_rate,
  AVG(o.evaluation_score) AS avg_evaluation_score,
  u.average_rating,
  COUNT(DISTINCT r.id) AS total_reviews
FROM users u
LEFT JOIN offers o ON u.id = o.supplier_id AND o.is_deleted = FALSE
LEFT JOIN reviews r ON u.id = r.reviewed_user_id AND r.is_deleted = FALSE
WHERE u.role = 'supplier' AND u.is_deleted = FALSE
GROUP BY u.id, u.company_name, u.email, u.average_rating;

-- ============ BUYER STATISTICS VIEW ============
CREATE OR REPLACE VIEW v_buyer_statistics AS
SELECT 
  u.id AS buyer_id,
  u.company_name,
  u.email,
  COUNT(DISTINCT t.id) AS total_tenders,
  COUNT(DISTINCT CASE WHEN t.status = 'published' THEN t.id END) AS active_tenders,
  COUNT(DISTINCT CASE WHEN t.status = 'awarded' THEN t.id END) AS awarded_tenders,
  SUM(t.budget_max) AS total_budget,
  COUNT(DISTINCT po.id) AS total_purchase_orders,
  SUM(po.total_amount) AS total_po_value
FROM users u
LEFT JOIN tenders t ON u.id = t.buyer_id AND t.is_deleted = FALSE
LEFT JOIN purchase_orders po ON u.id = po.buyer_id AND po.is_deleted = FALSE
WHERE u.role = 'buyer' AND u.is_deleted = FALSE
GROUP BY u.id, u.company_name, u.email;

-- ============ TENDER EVALUATION SUMMARY ============
CREATE OR REPLACE VIEW v_tender_evaluation_summary AS
SELECT 
  t.id AS tender_id,
  t.tender_number,
  t.title,
  t.status,
  COUNT(o.id) AS total_offers,
  COUNT(CASE WHEN o.evaluation_score IS NOT NULL THEN 1 END) AS evaluated_offers,
  AVG(o.evaluation_score) AS avg_evaluation_score,
  MAX(o.evaluation_score) AS highest_score,
  MIN(o.total_amount) AS lowest_bid,
  MAX(o.total_amount) AS highest_bid
FROM tenders t
LEFT JOIN offers o ON t.id = o.tender_id AND o.is_deleted = FALSE
WHERE t.is_deleted = FALSE
GROUP BY t.id, t.tender_number, t.title, t.status;

-- ============ FINANCIAL OVERVIEW ============
CREATE OR REPLACE VIEW v_financial_overview AS
SELECT 
  DATE_TRUNC('month', created_at) AS month,
  SUM(CASE WHEN status = 'paid' THEN total_amount ELSE 0 END) AS paid_amount,
  SUM(CASE WHEN status = 'pending' THEN total_amount ELSE 0 END) AS pending_amount,
  SUM(CASE WHEN status = 'overdue' THEN total_amount ELSE 0 END) AS overdue_amount,
  COUNT(*) AS total_invoices
FROM invoices
WHERE is_deleted = FALSE
GROUP BY DATE_TRUNC('month', created_at)
ORDER BY month DESC;

-- ============ SYSTEM HEALTH VIEW ============
CREATE OR REPLACE VIEW v_system_health AS
SELECT 
  'users' AS table_name,
  COUNT(*) AS total_records,
  COUNT(CASE WHEN is_deleted = FALSE THEN 1 END) AS active_records,
  pg_size_pretty(pg_total_relation_size('users')) AS table_size
FROM users
UNION ALL
SELECT 
  'tenders',
  COUNT(*),
  COUNT(CASE WHEN is_deleted = FALSE THEN 1 END),
  pg_size_pretty(pg_total_relation_size('tenders'))
FROM tenders
UNION ALL
SELECT 
  'offers',
  COUNT(*),
  COUNT(CASE WHEN is_deleted = FALSE THEN 1 END),
  pg_size_pretty(pg_total_relation_size('offers'))
FROM offers;
