const express = require('express');
const router = express.Router();
const AwardNotificationService = require('../services/AwardNotificationService');
const ArchiveService = require('../services/ArchiveService');
const TenderCancellationService = require('../services/TenderCancellationService');
const DataFetchingOptimizer = require('../utils/dataFetchingOptimizer');
const { getPool } = require('../config/db');

const getPaginationParams = (req) => {
  const page = parseInt(req.query.page) || 1;
  const limit = Math.min(parseInt(req.query.limit) || 20, 100);
  return { page, limit };
};

router.post('/award-winners/:tenderId', async (req, res) => {
  try {
    const { tenderId } = req.params;
    const { winnersIds } = req.body;
    const buyerId = req.user?.userId;
    if (!buyerId) return res.status(401).json({ success: false, error: 'Authentication required' });
    if (!winnersIds || !Array.isArray(winnersIds) || winnersIds.length === 0) {
      return res.status(400).json({ success: false, error: 'Winners IDs required' });
    }
    const result = await AwardNotificationService.selectWinnersAndNotify(
      parseInt(tenderId),
      winnersIds,
      buyerId
    );
    res.status(200).json({ success: true, result });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

router.get('/award-status/:tenderId', async (req, res) => {
  try {
    const { tenderId } = req.params;
    const { page, limit } = getPaginationParams(req);
    const pool = getPool();

    // Get total count
    const totalResult = await pool.query(
      `SELECT COUNT(*) FROM offers WHERE tender_id = $1 AND status = 'submitted'`,
      [tenderId]
    );
    const total = parseInt(totalResult.rows[0].count);

    // Get paginated status with selective columns
    const offset = (page - 1) * limit;
    const result = await pool.query(
      `SELECT id, offer_number, supplier_id, final_score, award_status, awarded_at, ranking
       FROM offers 
       WHERE tender_id = $1 AND status = 'submitted'
       ORDER BY ranking ASC NULLS LAST
       LIMIT $2 OFFSET $3`,
      [tenderId, limit, offset]
    );

    res.status(200).json({
      success: true,
      status: result.rows,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

router.post('/archive/:tenderId', async (req, res) => {
  try {
    const { tenderId } = req.params;
    const { docType, docData, retention_years } = req.body;
    if (!docType || !docData)
      return res.status(400).json({ success: false, error: 'Document type and data required' });
    const archive = await ArchiveService.archiveDocument(
      docType,
      parseInt(tenderId),
      docData,
      retention_years || 7
    );
    res.status(201).json({ success: true, archive });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

router.get('/archive/:archiveId', async (req, res) => {
  try {
    const { archiveId } = req.params;
    const archive = await ArchiveService.retrieveArchiveDocument(archiveId);
    res.status(200).json({ success: true, archive });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

router.get('/archives/:tenderId', async (req, res) => {
  try {
    const { tenderId } = req.params;
    const { page, limit } = getPaginationParams(req);
    const pool = getPool();

    // Get total count
    const totalResult = await pool.query(
      `SELECT COUNT(*) FROM document_archives WHERE document_ref_id = $1 AND status = 'active'`,
      [tenderId]
    );
    const total = parseInt(totalResult.rows[0].count);

    // Get paginated archives with selective columns
    const offset = (page - 1) * limit;
    const result = await pool.query(
      `SELECT archive_id, document_type, archived_at, retention_years, expiration_date, status
       FROM document_archives 
       WHERE document_ref_id = $1 AND status = 'active'
       ORDER BY archived_at DESC
       LIMIT $2 OFFSET $3`,
      [tenderId, limit, offset]
    );

    res.status(200).json({
      success: true,
      archives: result.rows,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

router.post('/cancel/:tenderId', async (req, res) => {
  try {
    const { tenderId } = req.params;
    const { cancellationReason } = req.body;
    const buyerId = req.user?.userId;
    if (!buyerId) return res.status(401).json({ success: false, error: 'Authentication required' });
    if (!cancellationReason)
      return res.status(400).json({ success: false, error: 'Cancellation reason required' });
    const result = await TenderCancellationService.cancelTender(
      parseInt(tenderId),
      buyerId,
      cancellationReason
    );
    res.status(200).json({ success: true, result });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

router.get('/cancellation-status/:tenderId', async (req, res) => {
  try {
    const { tenderId } = req.params;
    const status = await TenderCancellationService.getCancellationStatus(parseInt(tenderId));
    res.status(200).json({ success: true, status });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

module.exports = router;
