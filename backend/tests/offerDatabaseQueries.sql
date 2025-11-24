-- Offer Upload & Security Testing Database Queries

-- 1. Check offer table structure
\d+ offers;

-- 2. View recent offers with all details
SELECT 
  id,
  offer_number,
  tender_id,
  supplier_id,
  total_amount,
  status,
  encrypted_data,
  encryption_iv,
  decryption_key_id,
  submitted_at,
  created_at
FROM offers
ORDER BY submitted_at DESC
LIMIT 10;

-- 3. Check lock status (prevent modification)
SELECT 
  offer_number,
  status,
  is_locked,
  updated_at,
  submitted_at
FROM offers
WHERE status = 'submitted'
ORDER BY submitted_at DESC
LIMIT 10;

-- 4. Verify deadline enforcement (no late offers)
SELECT 
  o.offer_number,
  o.submitted_at,
  t.deadline,
  CASE 
    WHEN o.submitted_at > t.deadline THEN 'AFTER DEADLINE'
    WHEN o.submitted_at <= t.deadline THEN 'ON TIME'
  END as deadline_status
FROM offers o
LEFT JOIN tenders t ON o.tender_id = t.id
ORDER BY o.submitted_at DESC
LIMIT 20;

-- 5. Check receipt generation
SELECT 
  offer_number,
  receipt_number,
  receipt_issued_at,
  receipt_digital_signature,
  receipt_file_url,
  EXTRACT(EPOCH FROM (receipt_issued_at - submitted_at)) as seconds_to_receipt
FROM offers
WHERE receipt_number IS NOT NULL
ORDER BY receipt_issued_at DESC
LIMIT 10;

-- 6. Verify encryption
SELECT 
  offer_number,
  encrypted_data IS NOT NULL as is_encrypted,
  encryption_iv IS NOT NULL as has_iv,
  decryption_key_id,
  CASE 
    WHEN encrypted_data IS NOT NULL THEN 'ENCRYPTED'
    ELSE 'NOT ENCRYPTED'
  END as encryption_status
FROM offers
ORDER BY submitted_at DESC
LIMIT 15;

-- 7. Check offer attachments
SELECT 
  offer_number,
  technical_proposal,
  financial_proposal,
  attachments,
  JSON_ARRAY_LENGTH(attachments) as attachment_count
FROM offers
WHERE attachments IS NOT NULL
ORDER BY submitted_at DESC
LIMIT 10;

-- 8. Verify data integrity - check for duplicate offers
SELECT 
  tender_id,
  supplier_id,
  COUNT(*) as offer_count
FROM offers
WHERE is_deleted = FALSE
GROUP BY tender_id, supplier_id
HAVING COUNT(*) > 1
ORDER BY offer_count DESC;

-- 9. Check soft deletes (active offers only)
SELECT 
  COUNT(*) as total_offers,
  SUM(CASE WHEN is_deleted = FALSE THEN 1 ELSE 0 END) as active_offers,
  SUM(CASE WHEN is_deleted = TRUE THEN 1 ELSE 0 END) as deleted_offers
FROM offers;

-- 10. Performance: Offers per tender
SELECT 
  t.tender_number,
  COUNT(o.id) as offer_count,
  COUNT(CASE WHEN o.status = 'submitted' THEN 1 END) as submitted_count,
  COUNT(CASE WHEN o.status = 'withdrawn' THEN 1 END) as withdrawn_count
FROM tenders t
LEFT JOIN offers o ON t.id = o.tender_id AND o.is_deleted = FALSE
GROUP BY t.id, t.tender_number
ORDER BY offer_count DESC
LIMIT 20;

-- 11. Check receipt certificate exists
SELECT 
  COUNT(*) as total_offers,
  SUM(CASE WHEN receipt_number IS NOT NULL THEN 1 ELSE 0 END) as with_receipt,
  SUM(CASE WHEN receipt_number IS NULL THEN 1 ELSE 0 END) as without_receipt
FROM offers
WHERE status = 'submitted' AND is_deleted = FALSE;

-- 12. Verify audit trail (created_by and updated_by)
SELECT 
  offer_number,
  created_by,
  updated_by,
  created_at,
  updated_at,
  EXTRACT(EPOCH FROM (updated_at - created_at)) as update_delay_seconds
FROM offers
WHERE is_deleted = FALSE
ORDER BY updated_at DESC
LIMIT 10;

-- 13. Check late submissions (after deadline)
SELECT 
  o.offer_number,
  t.tender_number,
  t.deadline,
  o.submitted_at,
  EXTRACT(EPOCH FROM (o.submitted_at - t.deadline)) as seconds_after_deadline
FROM offers o
LEFT JOIN tenders t ON o.tender_id = t.id
WHERE o.submitted_at > t.deadline
ORDER BY seconds_after_deadline DESC;

-- 14. Payment terms and financial details
SELECT 
  offer_number,
  total_amount,
  currency,
  payment_terms,
  delivery_time,
  technical_proposal,
  financial_proposal
FROM offers
WHERE status = 'submitted'
ORDER BY total_amount DESC
LIMIT 10;

-- 15. Index usage verification
SELECT 
  schemaname,
  tablename,
  indexname,
  indexdef
FROM pg_indexes
WHERE tablename = 'offers'
ORDER BY indexname;

