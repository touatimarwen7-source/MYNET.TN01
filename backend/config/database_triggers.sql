
-- 🔄 ADVANCED DATABASE TRIGGERS
-- Automates business logic at database level

-- ============ AUDIT TRIGGERS ============
-- Automatically track all changes

CREATE OR REPLACE FUNCTION audit_trigger_function()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    NEW.created_at = CURRENT_TIMESTAMP;
    NEW.updated_at = CURRENT_TIMESTAMP;
  ELSIF TG_OP = 'UPDATE' THEN
    NEW.updated_at = CURRENT_TIMESTAMP;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to all main tables
CREATE TRIGGER audit_users BEFORE INSERT OR UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

CREATE TRIGGER audit_tenders BEFORE INSERT OR UPDATE ON tenders
  FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

CREATE TRIGGER audit_offers BEFORE INSERT OR UPDATE ON offers
  FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

-- ============ TENDER STATUS AUTOMATION ============
CREATE OR REPLACE FUNCTION auto_close_expired_tenders()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.deadline < CURRENT_TIMESTAMP AND NEW.status = 'published' THEN
    NEW.status = 'closed';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_auto_close_tenders 
  BEFORE UPDATE ON tenders
  FOR EACH ROW 
  EXECUTE FUNCTION auto_close_expired_tenders();

-- ============ OFFER VALIDATION ============
CREATE OR REPLACE FUNCTION validate_offer_before_insert()
RETURNS TRIGGER AS $$
DECLARE
  tender_deadline TIMESTAMP;
  tender_status VARCHAR;
BEGIN
  -- Get tender info
  SELECT deadline, status INTO tender_deadline, tender_status
  FROM tenders WHERE id = NEW.tender_id;
  
  -- Validate deadline
  IF tender_deadline < CURRENT_TIMESTAMP THEN
    RAISE EXCEPTION 'Cannot submit offer after tender deadline';
  END IF;
  
  -- Validate tender status
  IF tender_status NOT IN ('published', 'open') THEN
    RAISE EXCEPTION 'Tender is not open for submissions';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_validate_offer 
  BEFORE INSERT ON offers
  FOR EACH ROW 
  EXECUTE FUNCTION validate_offer_before_insert();

-- ============ RATING UPDATE TRIGGER ============
CREATE OR REPLACE FUNCTION update_user_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE users
  SET average_rating = (
    SELECT AVG(rating)::DECIMAL(3,2)
    FROM reviews
    WHERE reviewed_user_id = NEW.reviewed_user_id
      AND is_deleted = FALSE
  ),
  total_reviews = (
    SELECT COUNT(*)
    FROM reviews
    WHERE reviewed_user_id = NEW.reviewed_user_id
      AND is_deleted = FALSE
  )
  WHERE id = NEW.reviewed_user_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_rating 
  AFTER INSERT OR UPDATE ON reviews
  FOR EACH ROW 
  EXECUTE FUNCTION update_user_rating();

-- ============ TENDER NUMBER GENERATION ============
CREATE OR REPLACE FUNCTION generate_tender_number()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.tender_number IS NULL THEN
    NEW.tender_number = 'T-' || TO_CHAR(CURRENT_TIMESTAMP, 'YYYYMMDD') || '-' || LPAD(nextval('tender_number_seq')::TEXT, 6, '0');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE SEQUENCE IF NOT EXISTS tender_number_seq;

CREATE TRIGGER trigger_generate_tender_number 
  BEFORE INSERT ON tenders
  FOR EACH ROW 
  EXECUTE FUNCTION generate_tender_number();

-- ============ OFFER NUMBER GENERATION ============
CREATE OR REPLACE FUNCTION generate_offer_number()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.offer_number IS NULL THEN
    NEW.offer_number = 'O-' || TO_CHAR(CURRENT_TIMESTAMP, 'YYYYMMDD') || '-' || LPAD(nextval('offer_number_seq')::TEXT, 6, '0');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE SEQUENCE IF NOT EXISTS offer_number_seq;

CREATE TRIGGER trigger_generate_offer_number 
  BEFORE INSERT ON offers
  FOR EACH ROW 
  EXECUTE FUNCTION generate_offer_number();

-- ============ SOFT DELETE TRIGGER ============
CREATE OR REPLACE FUNCTION soft_delete_cascade()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.is_deleted = TRUE AND OLD.is_deleted = FALSE THEN
    -- Cascade soft delete to related records
    IF TG_TABLE_NAME = 'tenders' THEN
      UPDATE offers SET is_deleted = TRUE WHERE tender_id = NEW.id;
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_soft_delete_tender 
  AFTER UPDATE ON tenders
  FOR EACH ROW 
  EXECUTE FUNCTION soft_delete_cascade();

-- ============ NOTIFICATION TRIGGER ============
CREATE OR REPLACE FUNCTION create_notification_on_offer()
RETURNS TRIGGER AS $$
DECLARE
  buyer_id INTEGER;
BEGIN
  SELECT buyer_id INTO buyer_id FROM tenders WHERE id = NEW.tender_id;
  
  INSERT INTO notifications (user_id, type, title, message, related_entity_type, related_entity_id)
  VALUES (
    buyer_id,
    'new_offer',
    'Nouvelle Offre Reçue',
    'Vous avez reçu une nouvelle offre pour votre appel d''offres',
    'offer',
    NEW.id
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_notify_new_offer 
  AFTER INSERT ON offers
  FOR EACH ROW 
  EXECUTE FUNCTION create_notification_on_offer();
