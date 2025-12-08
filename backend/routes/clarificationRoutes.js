
const express = require('express');
const ClarificationController = require('../controllers/ClarificationController');
const { authMiddleware, roleMiddleware } = require('../middleware/authMiddleware');
const { validateSchema } = require('../middleware/adminMiddleware');

const router = express.Router();

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
