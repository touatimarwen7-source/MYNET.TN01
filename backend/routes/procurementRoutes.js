// ============================================================================
// PROCUREMENT ROUTES
// ============================================================================

/**
 * @swagger
 * tags:
 *   name: Procurement
 *   description: Gestion des appels d'offres et des offres
 * 
 * /api/procurement/tenders:
 *   post:
 *     summary: Créer un nouvel appel d'offres
 *     tags: [Procurement]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Tender'
 *           example:
 *             title: "Fourniture de matériel informatique"
 *             description: "Achat de 50 ordinateurs portables"
 *             category: "Informatique"
 *             budget_min: 50000
 *             budget_max: 100000
 *             deadline: "2025-02-15T23:59:59Z"
 *             opening_date: "2025-02-16T10:00:00Z"
 *     responses:
 *       201:
 *         description: Tender créé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Tender'
 *       400:
 *         description: Données invalides
 *       401:
 *         description: Non authentifié
 *   get:
 *     summary: Obtenir la liste des tenders
 *     tags: [Procurement]
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [draft, published, closed, awarded]
 *         description: Filtrer par statut
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filtrer par catégorie
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: Liste des tenders
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Tender'
 * 
 * /api/procurement/tenders/{id}:
 *   get:
 *     summary: Obtenir un tender par ID
 *     tags: [Procurement]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Détails du tender
 *       404:
 *         description: Tender introuvable
 * 
 * /api/procurement/offers:
 *   post:
 *     summary: Soumettre une offre
 *     tags: [Procurement]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Offer'
 *     responses:
 *       201:
 *         description: Offre créée
 *       400:
 *         description: Données invalides
 *       401:
 *         description: Non authentifié
 */

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
    // Set query timeout to 10 seconds
    await pool.query('SET LOCAL statement_timeout = 10000');

    // Optimized query with materialized subquery
    const statsQuery = `
      WITH tender_stats AS (
        SELECT 
          COUNT(*) FILTER (WHERE status = 'published') as active_tenders,
          COUNT(*) FILTER (WHERE status = 'draft') as draft_tenders,
          COUNT(*) FILTER (WHERE status = 'awarded') as awarded_tenders
        FROM tenders 
        WHERE buyer_id = $1 AND is_deleted = false
      ),
      offer_stats AS (
        SELECT COUNT(*) as total_offers
        FROM offers o
        INNER JOIN tenders t ON o.tender_id = t.id
        WHERE t.buyer_id = $1 AND t.is_deleted = false AND o.is_deleted = false
      )
      SELECT 
        COALESCE(ts.active_tenders, 0) as active_tenders,
        COALESCE(ts.draft_tenders, 0) as draft_tenders,
        COALESCE(ts.awarded_tenders, 0) as awarded_tenders,
        COALESCE(os.total_offers, 0) as total_offers
      FROM tender_stats ts, offer_stats os
    `;

    const result = await pool.query(statsQuery, [userId]);

    res.json({
      success: true,
      data: {
        activeTenders: parseInt(result.rows[0]?.active_tenders || 0),
        draftTenders: parseInt(result.rows[0]?.draft_tenders || 0),
        totalOffers: parseInt(result.rows[0]?.total_offers || 0),
        completedTenders: parseInt(result.rows[0]?.awarded_tenders || 0),
        pendingEvaluations: 0
      }
    });
  } catch (error) {
    logger.error('Error fetching buyer dashboard stats:', error);
    
    // Return cached data or defaults on timeout
    if (error.code === '57014') {
      return res.status(200).json({
        success: true,
        cached: true,
        data: {
          activeTenders: 0,
          draftTenders: 0,
          totalOffers: 0,
          completedTenders: 0,
          pendingEvaluations: 0
        }
      });
    }

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
    // Set query timeout to 10 seconds
    await pool.query('SET LOCAL statement_timeout = 10000');

    // Optimized analytics query with index hint
    const analyticsQuery = `
      SELECT 
        DATE_TRUNC('month', created_at) as month,
        COUNT(*) as tender_count,
        COUNT(*) FILTER (WHERE status = 'awarded') as awarded_count
      FROM tenders
      WHERE buyer_id = $1 
      AND is_deleted = false
      AND created_at >= CURRENT_DATE - INTERVAL '6 months'
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
    
    // Return empty array on timeout
    if (error.code === '57014') {
      return res.status(200).json({
        success: true,
        cached: true,
        data: { analytics: [] }
      });
    }

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