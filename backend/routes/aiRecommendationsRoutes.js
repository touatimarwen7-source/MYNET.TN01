
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { validateIdMiddleware } = require('../middleware/validateIdMiddleware');
const cacheMiddleware = require('../middleware/cacheMiddleware');
const AIRecommendationService = require('../services/AIRecommendationService');
const AdvancedAnalyticsService = require('../services/AdvancedAnalyticsService');

// Get supplier recommendations for a tender
router.get(
  '/suppliers/:tenderId',
  authMiddleware,
  validateIdMiddleware('tenderId'),
  cacheMiddleware(300), // 5 minutes cache
  async (req, res) => {
    try {
      const { tenderId } = req.params;
      const db = req.app.get('db');

      const recommendations = await AIRecommendationService.recommendSuppliersForTender(
        db,
        tenderId
      );

      res.json(recommendations);
    } catch (error) {
      console.error('Supplier Recommendations Error:', error);
      res.status(500).json({ 
        error: 'Échec de la génération des recommandations',
        message: error.message 
      });
    }
  }
);

// Get tender recommendations for a supplier
router.get(
  '/tenders',
  authMiddleware,
  cacheMiddleware(600), // 10 minutes cache
  async (req, res) => {
    try {
      const supplierId = req.user.id;
      const db = req.app.get('db');

      const recommendations = await AIRecommendationService.recommendTendersForSupplier(
        db,
        supplierId
      );

      res.json(recommendations);
    } catch (error) {
      console.error('Tender Recommendations Error:', error);
      res.status(500).json({ 
        error: 'Échec de la génération des recommandations',
        message: error.message 
      });
    }
  }
);

// Get market trends
router.get(
  '/market/trends',
  authMiddleware,
  cacheMiddleware(1800), // 30 minutes cache
  async (req, res) => {
    try {
      const { period = '30 days' } = req.query;
      const db = req.app.get('db');

      const trends = await AdvancedAnalyticsService.getMarketTrends(db, period);

      res.json(trends);
    } catch (error) {
      console.error('Market Trends Error:', error);
      res.status(500).json({ 
        error: 'Échec de l\'analyse des tendances',
        message: error.message 
      });
    }
  }
);

// Get optimal bid prediction
router.get(
  '/predict/bid/:tenderId',
  authMiddleware,
  validateIdMiddleware('tenderId'),
  cacheMiddleware(300),
  async (req, res) => {
    try {
      const { tenderId } = req.params;
      const supplierId = req.user.id;
      const db = req.app.get('db');

      const prediction = await AdvancedAnalyticsService.predictOptimalBid(
        db,
        tenderId,
        supplierId
      );

      res.json(prediction);
    } catch (error) {
      console.error('Bid Prediction Error:', error);
      res.status(500).json({ 
        error: 'Échec de la prédiction',
        message: error.message 
      });
    }
  }
);

// Get similar tenders
router.get(
  '/similar/:tenderId',
  authMiddleware,
  validateIdMiddleware('tenderId'),
  cacheMiddleware(600),
  async (req, res) => {
    try {
      const { tenderId } = req.params;
      const { limit = 5 } = req.query;
      const db = req.app.get('db');

      const similar = await AIRecommendationService.getSimilarTenders(
        db,
        tenderId,
        parseInt(limit)
      );

      res.json(similar);
    } catch (error) {
      console.error('Similar Tenders Error:', error);
      res.status(500).json({ 
        error: 'Échec de la récupération des appels d\'offres similaires',
        message: error.message 
      });
    }
  }
);

// Get top suppliers
router.get(
  '/top-suppliers',
  authMiddleware,
  cacheMiddleware(1800),
  async (req, res) => {
    try {
      const { category, limit = 10 } = req.query;
      const db = req.app.get('db');

      const suppliers = await AIRecommendationService.getTopSuppliers(
        db,
        category,
        parseInt(limit)
      );

      res.json(suppliers);
    } catch (error) {
      console.error('Top Suppliers Error:', error);
      res.status(500).json({ 
        error: 'Échec de la récupération des meilleurs fournisseurs',
        message: error.message 
      });
    }
  }
);

// Get supplier performance
router.get(
  '/supplier-performance/:supplierId',
  authMiddleware,
  validateIdMiddleware('supplierId'),
  cacheMiddleware(900),
  async (req, res) => {
    try {
      const { supplierId } = req.params;
      const { period = '6 months' } = req.query;
      const db = req.app.get('db');

      const performance = await AdvancedAnalyticsService.getSupplierPerformance(
        db,
        supplierId,
        period
      );

      res.json(performance);
    } catch (error) {
      console.error('Supplier Performance Error:', error);
      res.status(500).json({ 
        error: 'Échec de l\'analyse de performance',
        message: error.message 
      });
    }
  }
);

// Get category statistics
router.get(
  '/category-stats',
  authMiddleware,
  cacheMiddleware(3600),
  async (req, res) => {
    try {
      const db = req.app.get('db');

      const stats = await AdvancedAnalyticsService.getCategoryStats(db);

      res.json(stats);
    } catch (error) {
      console.error('Category Stats Error:', error);
      res.status(500).json({ 
        error: 'Échec de l\'analyse des catégories',
        message: error.message 
      });
    }
  }
);

module.exports = router;
