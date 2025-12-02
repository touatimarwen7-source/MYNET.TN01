const express = require('express');
const router = express.Router();
const OfferOpeningService = require('../services/OfferOpeningService');
const EvaluationService = require('../services/EvaluationService');
const DataFetchingOptimizer = require('../utils/dataFetchingOptimizer');
const { getPool } = require('../config/db');

const getPaginationParams = (req) => {
  const page = parseInt(req.query.page) || 1;
  const limit = Math.min(parseInt(req.query.limit) || 20, 100);
  return { page, limit };
};

router.get('/opening/:tenderId', async (req, res) => {
  try {
    const { tenderId } = req.params;
    const { page, limit } = getPaginationParams(req);
    const buyerId = req.user?.userId;
    if (!buyerId) return res.status(401).json({ success: false, error: 'Authentication required' });

    const pool = getPool();
    const totalResult = await pool.query(
      `SELECT COUNT(*) FROM offers WHERE tender_id = $1 AND is_deleted = FALSE`,
      [tenderId]
    );
    const total = parseInt(totalResult.rows[0].count);

    const offset = (page - 1) * limit;
    const result = await pool.query(
      `SELECT ${DataFetchingOptimizer.COLUMN_SELECTS.offer_list}
       FROM offers WHERE tender_id = $1 AND is_deleted = FALSE
       ORDER BY submitted_at ASC LIMIT $2 OFFSET $3`,
      [tenderId, limit, offset]
    );

    res.status(200).json({
      success: true,
      count: result.rows.length,
      offers: result.rows,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

router.post('/opening-report/:tenderId', async (req, res) => {
  try {
    const { tenderId } = req.params;
    const buyerId = req.user?.userId;
    if (!buyerId) return res.status(401).json({ success: false, error: 'Authentication required' });

    const offers = await OfferOpeningService.getOffersForOpening(parseInt(tenderId), buyerId);
    const report = await OfferOpeningService.generateOpeningReport(
      parseInt(tenderId),
      buyerId,
      offers
    );
    res.status(201).json({ success: true, report });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

router.post('/technical/:offerId', async (req, res) => {
  try {
    const { offerId } = req.params;
    const { technical_score, comments } = req.body;
    const evaluatorId = req.user?.userId;
    if (!evaluatorId)
      return res.status(401).json({ success: false, error: 'Authentication required' });
    if (technical_score === undefined)
      return res.status(400).json({ success: false, error: 'Technical score required' });

    const evaluation = await EvaluationService.recordTechnicalEvaluation(
      parseInt(offerId),
      technical_score,
      comments || '',
      evaluatorId
    );
    res.status(201).json({ success: true, evaluation });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

router.post('/financial/:offerId', async (req, res) => {
  try {
    const { offerId } = req.params;
    const { financial_score, comments } = req.body;
    const evaluatorId = req.user?.userId;
    if (!evaluatorId)
      return res.status(401).json({ success: false, error: 'Authentication required' });
    if (financial_score === undefined)
      return res.status(400).json({ success: false, error: 'Financial score required' });

    const evaluation = await EvaluationService.recordFinancialEvaluation(
      parseInt(offerId),
      financial_score,
      comments || '',
      evaluatorId
    );
    res.status(201).json({ success: true, evaluation });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

router.post('/calculate/:tenderId', async (req, res) => {
  try {
    const { tenderId } = req.params;
    const buyerId = req.user?.userId;
    if (!buyerId) return res.status(401).json({ success: false, error: 'Authentication required' });

    const results = await EvaluationService.calculateFinalScores(parseInt(tenderId), buyerId);
    res.status(200).json({ success: true, results });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

router.get('/summary/:tenderId', async (req, res) => {
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

    // Get paginated summary with selective columns
    const offset = (page - 1) * limit;
    const result = await pool.query(
      `SELECT id, offer_number, supplier_id, total_amount, technical_score, 
              financial_score, final_score, ranking
       FROM offers 
       WHERE tender_id = $1 AND status = 'submitted'
       ORDER BY ranking ASC NULLS LAST
       LIMIT $2 OFFSET $3`,
      [tenderId, limit, offset]
    );

    res.status(200).json({
      success: true,
      count: result.rows.length,
      summary: result.rows,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

module.exports = router;
