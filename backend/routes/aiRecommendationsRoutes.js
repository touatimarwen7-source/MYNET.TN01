const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/authMiddleware'); // Changed middleware
const { validateIdMiddleware } = require('../middleware/validateIdMiddleware');
const cacheMiddleware = require('../middleware/cacheMiddleware');
const AIRecommendationService = require('../services/AIRecommendationService');
const AdvancedAnalyticsService = require('../services/AdvancedAnalyticsService');
const { getPool } = require('../config/db'); // Added import for connection pooling

// Get supplier recommendations for a tender
router.get(
  '/suppliers/:tenderId',
  verifyToken, // Changed middleware to verifyToken
  validateIdMiddleware('tenderId'),
  cacheMiddleware(300), // 5 minutes cache
  async (req, res) => {
    const pool = getPool(); // Get the connection pool
    let client; // Declare client variable
    try {
      client = await pool.connect(); // Acquire a client from the pool
      const { tenderId } = req.params;

      // Assuming AIRecommendationService.recommendSuppliersForTender can accept a client
      // and that it will internally use pool.query() or similar, which the client handles.
      const recommendations = await AIRecommendationService.recommendSuppliersForTender(
        client, // Pass the client to the service
        tenderId
      );

      res.json(recommendations);
    } catch (error) {
      console.error('Supplier Recommendations Error:', error);
      res.status(500).json({
        error: 'Échec de la génération des recommandations',
        message: error.message
      });
    } finally {
      if (client) {
        try {
          client.release(); // Ensure the client is always released
        } catch (releaseErr) {
          // Silently handle release errors to avoid masking original error
          console.error('Error releasing client:', releaseErr);
        }
      }
    }
  }
);

// Get tender recommendations for a supplier
router.get(
  '/tenders',
  verifyToken, // Changed middleware to verifyToken for consistency
  cacheMiddleware(600), // 10 minutes cache
  async (req, res) => {
    const pool = getPool(); // Get the connection pool
    let client; // Declare client variable
    try {
      client = await pool.connect(); // Acquire a client from the pool
      const supplierId = req.user.id;

      // Assuming AIRecommendationService.recommendTendersForSupplier can accept a client
      const recommendations = await AIRecommendationService.recommendTendersForSupplier(
        client, // Pass the client
        supplierId
      );

      res.json(recommendations);
    } catch (error) {
      console.error('Tender Recommendations Error:', error);
      res.status(500).json({
        error: 'Échec de la génération des recommandations',
        message: error.message
      });
    } finally {
      if (client) {
        try {
          client.release(); // Ensure the client is always released
        } catch (releaseErr) {
          // Silently handle release errors
          console.error('Error releasing client:', releaseErr);
        }
      }
    }
  }
);

// Get market trends
router.get(
  '/market/trends',
  verifyToken, // Changed middleware to verifyToken
  cacheMiddleware(1800), // 30 minutes cache
  async (req, res) => {
    const pool = getPool(); // Get the connection pool
    let client; // Declare client variable
    try {
      client = await pool.connect(); // Acquire a client from the pool
      const { period = '30 days' } = req.query;

      const trends = await AdvancedAnalyticsService.getMarketTrends(client, period); // Pass the client

      res.json(trends);
    } catch (error) {
      console.error('Market Trends Error:', error);
      res.status(500).json({
        error: 'Échec de l\'analyse des tendances',
        message: error.message
      });
    } finally {
      if (client) {
        try {
          client.release(); // Ensure the client is always released
        } catch (releaseErr) {
          // Silently handle release errors
          console.error('Error releasing client:', releaseErr);
        }
      }
    }
  }
);

// Get optimal bid prediction
router.get(
  '/predict/bid/:tenderId',
  verifyToken, // Changed middleware to verifyToken
  validateIdMiddleware('tenderId'),
  cacheMiddleware(300),
  async (req, res) => {
    const pool = getPool(); // Get the connection pool
    let client; // Declare client variable
    try {
      client = await pool.connect(); // Acquire a client from the pool
      const { tenderId } = req.params;
      const supplierId = req.user.id;

      const prediction = await AdvancedAnalyticsService.predictOptimalBid(
        client, // Pass the client
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
    } finally {
      if (client) {
        try {
          client.release(); // Ensure the client is always released
        } catch (releaseErr) {
          // Silently handle release errors
          console.error('Error releasing client:', releaseErr);
        }
      }
    }
  }
);

// Get similar tenders
router.get(
  '/similar/:tenderId',
  verifyToken, // Changed middleware to verifyToken
  validateIdMiddleware('tenderId'),
  cacheMiddleware(600),
  async (req, res) => {
    const pool = getPool(); // Get the connection pool
    let client; // Declare client variable
    try {
      client = await pool.connect(); // Acquire a client from the pool
      const { tenderId } = req.params;
      const { limit = 5 } = req.query;

      const similar = await AIRecommendationService.getSimilarTenders(
        client, // Pass the client
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
    } finally {
      if (client) {
        try {
          client.release(); // Ensure the client is always released
        } catch (releaseErr) {
          // Silently handle release errors
          console.error('Error releasing client:', releaseErr);
        }
      }
    }
  }
);

// Get top suppliers
router.get(
  '/top-suppliers',
  verifyToken, // Changed middleware to verifyToken
  cacheMiddleware(1800),
  async (req, res) => {
    const pool = getPool(); // Get the connection pool
    let client; // Declare client variable
    try {
      client = await pool.connect(); // Acquire a client from the pool
      const { category, limit = 10 } = req.query;

      const suppliers = await AIRecommendationService.getTopSuppliers(
        client, // Pass the client
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
    } finally {
      if (client) {
        try {
          client.release(); // Ensure the client is always released
        } catch (releaseErr) {
          // Silently handle release errors
          console.error('Error releasing client:', releaseErr);
        }
      }
    }
  }
);

// Get supplier performance
router.get(
  '/supplier-performance/:supplierId',
  verifyToken, // Changed middleware to verifyToken
  validateIdMiddleware('supplierId'),
  cacheMiddleware(900),
  async (req, res) => {
    const pool = getPool(); // Get the connection pool
    let client; // Declare client variable
    try {
      client = await pool.connect(); // Acquire a client from the pool
      const { supplierId } = req.params;
      const { period = '6 months' } = req.query;

      const performance = await AdvancedAnalyticsService.getSupplierPerformance(
        client, // Pass the client
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
    } finally {
      if (client) {
        try {
          client.release(); // Ensure the client is always released
        } catch (releaseErr) {
          // Silently handle release errors
          console.error('Error releasing client:', releaseErr);
        }
      }
    }
  }
);

// Get category statistics
router.get(
  '/category-stats',
  verifyToken, // Changed middleware to verifyToken
  cacheMiddleware(3600),
  async (req, res) => {
    const pool = getPool(); // Get the connection pool
    let client; // Declare client variable
    try {
      client = await pool.connect(); // Acquire a client from the pool

      const stats = await AdvancedAnalyticsService.getCategoryStats(client); // Pass the client

      res.json(stats);
    } catch (error) {
      console.error('Category Stats Error:', error);
      res.status(500).json({
        error: 'Échec de l\'analyse des catégories',
        message: error.message
      });
    } finally {
      if (client) {
        try {
          client.release(); // Ensure the client is always released
        } catch (releaseErr) {
          // Silently handle release errors
          console.error('Error releasing client:', releaseErr);
        }
      }
    }
  }
);

module.exports = router;