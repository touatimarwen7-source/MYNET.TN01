
-- 🔒 ADVANCED DATABASE CONSTRAINTS
-- Ensures data integrity at database level

-- ============ USERS TABLE CONSTRAINTS ============
ALTER TABLE users 
  ADD CONSTRAINT chk_users_email_format 
  CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$');

ALTER TABLE users 
  ADD CONSTRAINT chk_users_phone_format 
  CHECK (phone IS NULL OR phone ~* '^\+?[0-9]{8,15}$');

ALTER TABLE users 
  ADD CONSTRAINT chk_users_rating_range 
  CHECK (average_rating >= 0 AND average_rating <= 5);

ALTER TABLE users 
  ADD CONSTRAINT chk_users_role_valid 
  CHECK (role IN ('admin', 'buyer', 'supplier', 'viewer', 'super_admin'));

-- ============ TENDERS TABLE CONSTRAINTS ============
ALTER TABLE tenders 
  ADD CONSTRAINT chk_tenders_budget_valid 
  CHECK (budget_min >= 0 AND budget_max >= budget_min);

ALTER TABLE tenders 
  ADD CONSTRAINT chk_tenders_deadline_future 
  CHECK (deadline IS NULL OR deadline > publish_date);

ALTER TABLE tenders 
  ADD CONSTRAINT chk_tenders_opening_after_publish 
  CHECK (opening_date IS NULL OR opening_date >= publish_date);

ALTER TABLE tenders 
  ADD CONSTRAINT chk_tenders_status_valid 
  CHECK (status IN ('draft', 'published', 'open', 'closed', 'awarded', 'cancelled', 'archived'));

ALTER TABLE tenders 
  ADD CONSTRAINT chk_tenders_currency_valid 
  CHECK (currency IN ('TND', 'USD', 'EUR'));

-- ============ OFFERS TABLE CONSTRAINTS ============
ALTER TABLE offers 
  ADD CONSTRAINT chk_offers_amount_positive 
  CHECK (total_amount > 0);

ALTER TABLE offers 
  ADD CONSTRAINT chk_offers_status_valid 
  CHECK (status IN ('draft', 'submitted', 'opened', 'evaluated', 'awarded', 'rejected', 'withdrawn', 'cancelled'));

ALTER TABLE offers 
  ADD CONSTRAINT chk_offers_evaluation_score_range 
  CHECK (evaluation_score IS NULL OR (evaluation_score >= 0 AND evaluation_score <= 100));

ALTER TABLE offers 
  ADD CONSTRAINT chk_offers_scores_valid 
  CHECK (
    (technical_score IS NULL OR (technical_score >= 0 AND technical_score <= 100)) AND
    (financial_score IS NULL OR (financial_score >= 0 AND financial_score <= 100)) AND
    (final_score IS NULL OR (final_score >= 0 AND final_score <= 100))
  );

-- ============ PURCHASE ORDERS CONSTRAINTS ============
ALTER TABLE purchase_orders 
  ADD CONSTRAINT chk_po_amount_positive 
  CHECK (total_amount > 0);

ALTER TABLE purchase_orders 
  ADD CONSTRAINT chk_po_delivery_after_issue 
  CHECK (delivery_date IS NULL OR delivery_date >= issue_date);

ALTER TABLE purchase_orders 
  ADD CONSTRAINT chk_po_status_valid 
  CHECK (status IN ('pending', 'approved', 'rejected', 'delivered', 'cancelled'));

-- ============ INVOICES CONSTRAINTS ============
ALTER TABLE invoices 
  ADD CONSTRAINT chk_invoice_amounts_valid 
  CHECK (
    amount >= 0 AND 
    tax_amount >= 0 AND 
    total_amount >= amount
  );

ALTER TABLE invoices 
  ADD CONSTRAINT chk_invoice_due_after_issue 
  CHECK (due_date IS NULL OR due_date >= issue_date);

ALTER TABLE invoices 
  ADD CONSTRAINT chk_invoice_status_valid 
  CHECK (status IN ('pending', 'paid', 'overdue', 'cancelled'));

-- ============ REVIEWS CONSTRAINTS ============
ALTER TABLE reviews 
  ADD CONSTRAINT chk_reviews_rating_range 
  CHECK (rating >= 1 AND rating <= 5);

ALTER TABLE reviews 
  ADD CONSTRAINT chk_reviews_not_self 
  CHECK (reviewer_id != reviewed_user_id);

-- ============ UNIQUE CONSTRAINTS ============
ALTER TABLE offers 
  ADD CONSTRAINT uq_offers_tender_supplier 
  UNIQUE (tender_id, supplier_id) 
  WHERE is_deleted = FALSE;

ALTER TABLE reviews 
  ADD CONSTRAINT uq_reviews_tender_reviewer 
  UNIQUE (tender_id, reviewer_id) 
  WHERE is_deleted = FALSE;

-- ============ EXCLUSION CONSTRAINTS ============
CREATE EXTENSION IF NOT EXISTS btree_gist;

-- Prevent overlapping active subscriptions
ALTER TABLE user_subscriptions 
  ADD CONSTRAINT excl_user_subscriptions_overlap 
  EXCLUDE USING gist (
    user_id WITH =, 
    tsrange(start_date, end_date) WITH &&
  ) WHERE (status = 'active');

-- ============ VERIFICATION QUERIES ============
-- Check all constraints
SELECT 
  conname AS constraint_name,
  contype AS constraint_type,
  conrelid::regclass AS table_name
FROM pg_constraint
WHERE connamespace = 'public'::regnamespace
ORDER BY conrelid::regclass::text, conname;
