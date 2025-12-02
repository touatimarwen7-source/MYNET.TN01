const express = require('express');
const PDFController = require('../controllers/admin/PDFController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Generate tender PDF document
router.get('/tender/:tender_id', authMiddleware.verifyToken, (req, res) =>
  PDFController.generateTenderPDF(req, res)
);

// Generate offer evaluation report
router.get(
  '/offer/:offer_id',
  authMiddleware.verifyToken,
  authMiddleware.checkPermission('view_reports'),
  (req, res) => PDFController.generateOfferReport(req, res)
);

// Generate award certificate
router.get(
  '/award-certificate/:tender_id/:supplier_id',
  authMiddleware.verifyToken,
  authMiddleware.checkPermission('award_tenders'),
  (req, res) => PDFController.generateAwardCertificate(req, res)
);

// Generate transaction report for supplier
router.get('/transactions/:supplier_id', authMiddleware.verifyToken, (req, res) =>
  PDFController.generateTransactionReport(req, res)
);

module.exports = router;
