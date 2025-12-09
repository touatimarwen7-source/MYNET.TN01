const express = require('express');
const router = express.Router();
const { authMiddleware, roleMiddleware, requireOwnership } = require('../middleware/authMiddleware');
const TenderController = require('../controllers/procurement/TenderController');
const OfferController = require('../controllers/procurement/OfferController');
const { validateTenderCreation } = require('../middleware/criticalOperationsValidator');

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

module.exports = router;