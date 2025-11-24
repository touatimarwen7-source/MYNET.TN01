const express = require('express');
const router = express.Router();
const OfferOpeningService = require('../services/OfferOpeningService');
const EvaluationService = require('../services/EvaluationService');

router.get('/opening/:tenderId', async (req, res) => {
  try {
    const { tenderId } = req.params;
    const buyerId = req.user?.userId;
    if (!buyerId) return res.status(401).json({ success: false, error: 'Authentication required' });
    
    const offers = await OfferOpeningService.getOffersForOpening(parseInt(tenderId), buyerId);
    res.status(200).json({ success: true, count: offers.length, offers });
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
    const report = await OfferOpeningService.generateOpeningReport(parseInt(tenderId), buyerId, offers);
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
    if (!evaluatorId) return res.status(401).json({ success: false, error: 'Authentication required' });
    if (technical_score === undefined) return res.status(400).json({ success: false, error: 'Technical score required' });
    
    const evaluation = await EvaluationService.recordTechnicalEvaluation(
      parseInt(offerId), technical_score, comments || '', evaluatorId
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
    if (!evaluatorId) return res.status(401).json({ success: false, error: 'Authentication required' });
    if (financial_score === undefined) return res.status(400).json({ success: false, error: 'Financial score required' });
    
    const evaluation = await EvaluationService.recordFinancialEvaluation(
      parseInt(offerId), financial_score, comments || '', evaluatorId
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
    const summary = await EvaluationService.getEvaluationSummary(parseInt(tenderId));
    res.status(200).json({ success: true, count: summary.length, summary });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

module.exports = router;
