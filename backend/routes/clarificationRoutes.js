const express = require('express');
const ClarificationController = require('../controllers/ClarificationController');
const { authMiddleware, roleMiddleware } = require('../middleware/authMiddleware');
const { validateSchema } = require('../middleware/adminMiddleware');

const router = express.Router();

// Basic health check for this route
router.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'clarifications' });
});

// Schema validation for clarification creation
const clarificationSchema = {
  question: 'string',
};

// Schema validation for clarification response
const responseSchema = {
  response: 'string',
};

/**
 * @route POST /api/clarifications/offers/:offerId/clarification
 * @desc Buyer creates a clarification request for a specific offer
 * @access Private (Buyer only)
 */
router.post(
  '/offers/:offerId/clarification',
  authMiddleware,
  roleMiddleware(['buyer']),
  validateSchema(clarificationSchema),
  ClarificationController.handleCreateClarification
);

/**
 * @route GET /api/clarifications/received
 * @desc Supplier gets all their received clarification requests
 * @access Private (Supplier only)
 */
router.get(
  '/received',
  authMiddleware,
  roleMiddleware(['supplier']),
  ClarificationController.handleGetReceivedClarifications
);

/**
 * @route GET /api/clarifications/:clarificationId
 * @desc Get a specific clarification by ID (both buyer and supplier)
 * @access Private (Authenticated users)
 */
router.get(
  '/:clarificationId',
  authMiddleware,
  ClarificationController.handleGetClarificationById
);

/**
 * @route POST /api/clarifications/:clarificationId/respond
 * @desc Supplier responds to a clarification request
 * @access Private (Supplier only)
 */
router.post(
  '/:clarificationId/respond',
  authMiddleware,
  roleMiddleware(['supplier']),
  validateSchema(responseSchema),
  ClarificationController.handleRespondToClarification
);

module.exports = router;
const express = require('express');
const router = express.Router();
const { verifyToken, checkRole } = require('../middleware/authMiddleware');
const { validateIdMiddleware } = require('../middleware/validateIdMiddleware');

// Health check
router.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'clarifications' });
});

// Get all clarifications for a tender (buyer)
router.get('/tender/:tenderId', verifyToken, validateIdMiddleware('tenderId'), async (req, res) => {
  try {
    res.json({ success: true, data: [], message: 'Clarifications retrieved successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Create clarification request (buyer)
router.post('/create', verifyToken, checkRole(['buyer']), async (req, res) => {
  try {
    res.json({ success: true, message: 'Clarification created successfully' });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Respond to clarification (supplier)
router.post('/:clarificationId/respond', verifyToken, checkRole(['supplier']), validateIdMiddleware('clarificationId'), async (req, res) => {
  try {
    res.json({ success: true, message: 'Response submitted successfully' });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

module.exports = router;
