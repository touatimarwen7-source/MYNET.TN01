
const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/authMiddleware');
const TenderController = require('../controllers/procurement/TenderController');
const OfferController = require('../controllers/procurement/OfferController');

// Tender routes
router.post('/tenders', verifyToken, TenderController.createTender.bind(TenderController));
router.get('/tenders', (req, res, next) => {
  // Normaliser les paramètres de pagination
  if (req.query.page) req.query.page = String(req.query.page);
  if (req.query.limit) req.query.limit = String(req.query.limit);
  next();
}, TenderController.getAllTenders.bind(TenderController));
router.get('/tenders/:id', TenderController.getTender.bind(TenderController));
router.put('/tenders/:id', verifyToken, TenderController.updateTender.bind(TenderController));
router.delete('/tenders/:id', verifyToken, TenderController.deleteTender.bind(TenderController));
router.post('/tenders/:id/publish', verifyToken, TenderController.publishTender.bind(TenderController));
router.post('/tenders/:id/close', verifyToken, TenderController.closeTender.bind(TenderController));
router.post('/tenders/:id/award', verifyToken, TenderController.awardTender.bind(TenderController));
router.get('/tenders/:id/statistics', TenderController.getTenderStatistics.bind(TenderController));
router.get('/my-tenders', verifyToken, TenderController.getMyTenders.bind(TenderController));

// Offer routes
router.post('/offers', verifyToken, OfferController.createOffer.bind(OfferController));
router.get('/offers/:id', verifyToken, OfferController.getOffer.bind(OfferController));

module.exports = router;
