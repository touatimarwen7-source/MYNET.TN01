-- DATABASE CONSTRAINTS FOR DATA INTEGRITY

-- 1. UNIQUE CONSTRAINTS
ALTER TABLE users ADD CONSTRAINT unique_email UNIQUE (email) ON CONFLICT DO NOTHING;
ALTER TABLE users ADD CONSTRAINT unique_username UNIQUE (username) ON CONFLICT DO NOTHING;

-- 2. CHECK CONSTRAINTS
ALTER TABLE purchase_requests ADD CONSTRAINT check_budget_positive CHECK (budget > 0) NOT DEFERRABLE INITIALLY IMMEDIATE;
ALTER TABLE purchase_requests ADD CONSTRAINT check_quantity_positive CHECK (quantity > 0) NOT DEFERRABLE INITIALLY IMMEDIATE;
ALTER TABLE purchase_orders ADD CONSTRAINT check_po_amount_positive CHECK (total_amount > 0) NOT DEFERRABLE INITIALLY IMMEDIATE;
ALTER TABLE invoices ADD CONSTRAINT check_invoice_amount_positive CHECK (amount > 0) NOT DEFERRABLE INITIALLY IMMEDIATE;
ALTER TABLE tenders ADD CONSTRAINT check_budget_min_max CHECK (budget_min <= budget_max) NOT DEFERRABLE INITIALLY IMMEDIATE;

-- 3. NOT NULL CONSTRAINTS (via ALTER)
ALTER TABLE purchase_requests ALTER COLUMN title SET NOT NULL;
ALTER TABLE purchase_requests ALTER COLUMN budget SET NOT NULL;
ALTER TABLE invoices ALTER COLUMN total_amount SET NOT NULL;
ALTER TABLE reviews ALTER COLUMN rating SET NOT NULL;

-- 4. FOREIGN KEY CONSTRAINTS WITH CASCADE
ALTER TABLE offers ADD CONSTRAINT fk_offers_tender FOREIGN KEY (tender_id) REFERENCES tenders(id) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE purchase_orders ADD CONSTRAINT fk_po_offer FOREIGN KEY (offer_id) REFERENCES offers(id) ON DELETE SET NULL ON UPDATE CASCADE;

-- 5. INDEXES FOR SOFT DELETE QUERIES
CREATE INDEX IF NOT EXISTS idx_messages_not_deleted ON messages(is_deleted) WHERE is_deleted = false;
CREATE INDEX IF NOT EXISTS idx_reviews_not_deleted ON reviews(is_deleted) WHERE is_deleted = false;
CREATE INDEX IF NOT EXISTS idx_users_active ON users(is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_tenders_not_deleted ON tenders(is_deleted) WHERE is_deleted = false;

-- 6. PERFORMANCE INDEXES
CREATE INDEX IF NOT EXISTS idx_user_id ON messages(sender_id, receiver_id);
CREATE INDEX IF NOT EXISTS idx_tender_id ON tenders(buyer_id);
CREATE INDEX IF NOT EXISTS idx_supplier_id ON offers(supplier_id);
