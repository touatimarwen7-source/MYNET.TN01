
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

module.exports = router;
