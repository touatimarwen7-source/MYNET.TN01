// ============================================================================
// PROCUREMENT ROUTES
// ============================================================================

const express = require('express');
const router = express.Router();
const { authMiddleware, verifyToken, roleMiddleware, requireOwnership } = require('../middleware/authMiddleware');
const TenderController = require('../controllers/procurement/TenderController');
const OfferController = require('../controllers/procurement/OfferController');
const { validateTenderCreation } = require('../middleware/criticalOperationsValidator');
const { getPool } = require('../config/db');
const { logger } = require('../utils/logger');

// AsyncHandler wrapper
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Tender routes
router.post('/tenders', verifyToken, validateTenderCreation, TenderController.createTender.bind(TenderController));
router.get('/tenders', (req, res, next) => {
  // Normaliser et valider les paramètres de pagination
  try {
    // Convertir en string pour parsing sécurisé
    if (req.query.page !== undefined) {
      req.query.page = String(req.query.page).trim();
    }
    if (req.query.limit !== undefined) {
      req.query.limit = String(req.query.limit).trim();
    }
    // Normaliser is_public
    if (req.query.is_public !== undefined) {
      const val = String(req.query.is_public).toLowerCase().trim();
      if (val === 'true' || val === '1') {
        req.query.is_public = 'true';
      } else if (val === 'false' || val === '0') {
        req.query.is_public = 'false';
      }
    }
    next();
  } catch (err) {
    return res.status(400).json({
      success: false,
      error: 'Paramètres de requête invalides',
      code: 'INVALID_QUERY_PARAMS'
    });
  }
}, TenderController.getAllTenders.bind(TenderController));
router.get('/tenders/:id', TenderController.getTender.bind(TenderController));
router.put('/tenders/:id', verifyToken, requireOwnership, TenderController.updateTender.bind(TenderController));
router.delete('/tenders/:id', verifyToken, requireOwnership, TenderController.deleteTender.bind(TenderController));
router.post('/tenders/:id/publish', verifyToken, TenderController.publishTender.bind(TenderController));
router.post('/tenders/:id/close', verifyToken, TenderController.closeTender.bind(TenderController));
router.post('/tenders/:id/award', verifyToken, TenderController.awardTender.bind(TenderController));
router.get('/tenders/:id/statistics', TenderController.getTenderStatistics.bind(TenderController));
router.get('/my-tenders', verifyToken, TenderController.getMyTenders.bind(TenderController));

// Offer routes
router.post('/offers', verifyToken, OfferController.createOffer.bind(OfferController));
router.get('/offers/:id', verifyToken, OfferController.getOffer.bind(OfferController));

// ============================================================================
// BUYER DASHBOARD ENDPOINTS
// ============================================================================

/**
 * @route   GET /api/procurement/buyer/dashboard-stats
 * @desc    Get buyer dashboard statistics
 * @access  Private (Buyer)
 */
router.get('/buyer/dashboard-stats', authMiddleware, asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const pool = getPool();

  try {
    // Optimized single query with indexes
    const statsQuery = `
      SELECT 
        COUNT(*) FILTER (WHERE status = 'published') as active_tenders,
        COUNT(*) FILTER (WHERE status = 'draft') as draft_tenders,
        COUNT(*) FILTER (WHERE status = 'awarded') as awarded_tenders,
        COALESCE((
          SELECT COUNT(*) 
          FROM offers o 
          WHERE o.tender_id IN (
            SELECT id FROM tenders WHERE buyer_id = $1 AND is_deleted = false
          )
        ), 0) as total_offers
      FROM tenders 
      WHERE buyer_id = $1 AND is_deleted = false
    `;

    const result = await pool.query(statsQuery, [userId]);

    res.json({
      success: true,
      data: {
        activeTenders: parseInt(result.rows[0]?.active_tenders || 0),
        draftTenders: parseInt(result.rows[0]?.draft_tenders || 0),
        totalOffers: parseInt(result.rows[0]?.total_offers || 0),
        completedTenders: parseInt(result.rows[0]?.awarded_tenders || 0),
        pendingEvaluations: 0 // Placeholder for now
      }
    });
  } catch (error) {
    logger.error('Error fetching buyer dashboard stats:', error);
    res.status(500).json({
      success: false,
      message: 'خطأ في تحميل الإحصائيات'
    });
  }
}));

/**
 * @route   GET /api/procurement/buyer/analytics
 * @desc    Get buyer analytics data
 * @access  Private (Buyer)
 */
router.get('/buyer/analytics', authMiddleware, asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const pool = getPool();

  try {
    // Optimized analytics query with proper date handling
    const analyticsQuery = `
      SELECT 
        DATE_TRUNC('month', created_at) as month,
        COUNT(*) as tender_count,
        COUNT(*) FILTER (WHERE status = 'awarded') as awarded_count
      FROM tenders
      WHERE buyer_id = $1 
      AND is_deleted = false
      AND created_at >= NOW() - INTERVAL '6 months'
      GROUP BY DATE_TRUNC('month', created_at)
      ORDER BY month DESC
      LIMIT 6
    `;

    const result = await pool.query(analyticsQuery, [userId]);

    res.json({
      success: true,
      data: {
        analytics: result.rows || []
      }
    });
  } catch (error) {
    logger.error('Error fetching buyer analytics:', error);
    res.status(500).json({
      success: false,
      message: 'خطأ في تحميل التحليلات'
    });
  }
}));

// ============================================================================
// SUPPLIER DASHBOARD ENDPOINTS
// ============================================================================

/**
 * @route   GET /api/procurement/supplier/dashboard-stats
 * @desc    Get supplier dashboard statistics
 * @access  Private (Supplier)
 */
router.get('/supplier/dashboard-stats', authMiddleware, asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const pool = getPool();

  try {
    const statsQuery = `
      SELECT 
        COUNT(*) FILTER (WHERE status = 'submitted') as active_offers,
        COUNT(*) FILTER (WHERE status = 'draft') as draft_offers,
        COUNT(*) FILTER (WHERE status = 'accepted') as won_offers,
        COUNT(DISTINCT tender_id) as participated_tenders
      FROM offers 
      WHERE supplier_id = $1 AND is_deleted = false
    `;

    const result = await pool.query(statsQuery, [userId]);

    res.json({
      success: true,
      data: {
        activeOffers: parseInt(result.rows[0]?.active_offers || 0),
        draftOffers: parseInt(result.rows[0]?.draft_offers || 0),
        wonOffers: parseInt(result.rows[0]?.won_offers || 0),
        participatedTenders: parseInt(result.rows[0]?.participated_tenders || 0)
      }
    });
  } catch (error) {
    logger.error('Error fetching supplier dashboard stats:', error);
    res.status(500).json({
      success: false,
      message: 'خطأ في تحميل الإحصائيات'
    });
  }
}));

/**
 * @route   GET /api/procurement/supplier/analytics
 * @desc    Get supplier analytics data
 * @access  Private (Supplier)
 */
router.get('/supplier/analytics', authMiddleware, asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const pool = getPool();

  try {
    const analyticsQuery = `
      SELECT 
        DATE_TRUNC('month', created_at) as month,
        COUNT(*) as offer_count,
        COUNT(*) FILTER (WHERE status = 'accepted') as won_count
      FROM offers
      WHERE supplier_id = $1 
      AND is_deleted = false
      AND created_at >= NOW() - INTERVAL '6 months'
      GROUP BY DATE_TRUNC('month', created_at)
      ORDER BY month DESC
      LIMIT 6
    `;

    const result = await pool.query(analyticsQuery, [userId]);

    res.json({
      success: true,
      data: {
        analytics: result.rows || []
      }
    });
  } catch (error) {
    logger.error('Error fetching supplier analytics:', error);
    res.status(500).json({
      success: false,
      message: 'خطأ في تحميل التحليلات'
    });
  }
}));

// ============================================================================
// OFFER ROUTES
// ============================================================================

module.exports = router;