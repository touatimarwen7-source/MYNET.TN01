const TenderService = require('../../services/TenderService');
const NotificationService = require('../../services/NotificationService');
const logger = require('../../utils/logger');

/**
 * Tender Controller
 * Handles all tender-related HTTP requests including CRUD operations,
 * publishing, closing, awarding, and statistics
 * @class TenderController
 */
class TenderController {
  /**
   * Create a new tender
   * @async
   * @param {Object} req - Express request object
   * @param {Object} req.body - Tender data
   * @param {string} req.body.title - Tender title (min 5 chars)
   * @param {string} req.body.description - Tender description (min 20 chars)
   * @param {string} req.body.category - Tender category (required)
   * @param {Object} req.user - Authenticated user (must be buyer)
   * @param {Object} res - Express response object
   * @returns {void} Returns created tender with 201 status
   * @throws {403} If user is not a buyer
   * @throws {400} If validation fails
   * @example
   * POST /procurement/tenders
   * {
   *   "title": "IT Equipment Procurement",
   *   "description": "Procurement of laptops and servers",
   *   "category": "Technology",
   *   "budget_min": 50000,
   *   "budget_max": 100000
   * }
   */
  async createTender(req, res) {
    try {
      // التحقق من أن المستخدم هو مشتري فقط
      if (req.user.role !== 'buyer') {
        return res.status(403).json({
          success: false,
          message: 'فقط المشترون يمكنهم إنشاء المناقصات',
        });
      }

      const tenderData = req.body;
      
      // Additional validation
      if (!tenderData.title || tenderData.title.trim().length < 5) {
        return res.status(400).json({
          success: false,
          error: 'Le titre doit contenir au moins 5 caractères',
        });
      }
      
      if (!tenderData.description || tenderData.description.trim().length < 20) {
        return res.status(400).json({
          success: false,
          error: 'La description doit contenir au moins 20 caractères',
        });
      }
      
      if (!tenderData.category) {
        return res.status(400).json({
          success: false,
          error: 'La catégorie est obligatoire',
        });
      }

      const tender = await TenderService.createTender(tenderData, req.user.id);

      res.status(201).json({
        success: true,
        message: 'Tender created successfully',
        tender,
      });
    } catch (error) {
      logger.error('Error creating tender:', error);
      const { errorResponse } = require('../../middleware/errorResponseFormatter');
      
      // Handle validation errors specifically
      if (error.statusCode === 400 || error.details) {
        return res.status(400).json({
          success: false,
          error: error.message || 'Validation failed',
          details: error.details,
        });
      }
      
      errorResponse(res, error, 'Error creating tender');
    }
  }

  /**
   * Get tender details by ID
   * @async
   * @param {Object} req - Express request object
   * @param {Object} req.params - Request parameters
   * @param {string} req.params.id - Tender ID
   * @param {Object} req.user - Authenticated user (optional)
   * @param {Object} res - Express response object
   * @returns {void} Returns tender details with offers if authorized
   * @throws {404} If tender not found
   * @throws {403} If user not authorized to view private tender
   * @example
   * GET /procurement/tenders/:id
   * Response: { success: true, tender: {...} }
   */
  async getTender(req, res) {
    try {
      const { id } = req.params;
      const tender = await TenderService.getTenderById(id);

      if (!tender) {
        return res.status(404).json({
          success: false,
          message: 'Tender not found',
        });
      }

      // Check if user is buyer and owns this tender
      if (req.user?.role === 'buyer' && tender.buyer_id !== req.user.id && !tender.is_public) {
        return res.status(403).json({
          success: false,
          message: 'Access denied to private tender',
        });
      }

      res.status(200).json({
        success: true,
        tender,
      });
    } catch (error) {
      logger.error('Error fetching tender:', error);
      const { errorResponse } = require('../../middleware/errorResponseFormatter');
      errorResponse(res, error, 'Error fetching tender');
    }
  }

  /**
   * Get all tenders with optional filters
   * @async
   * @param {Object} req - Express request object
   * @param {Object} req.query - Query parameters for filtering
   * @param {string} req.query.status - Filter by status (draft, published, closed)
   * @param {string} req.query.category - Filter by category
   * @param {boolean} req.query.is_public - Filter by public/private
   * @param {number} req.query.limit - Results per page (default: 50, max: 100)
   * @param {number} req.query.page - Page number (default: 1)
   * @param {Object} res - Express response object
   * @returns {void} Returns array of tenders
   * @example
   * GET /procurement/tenders?status=published&category=Technology&limit=20
   * Response: { success: true, count: 20, tenders: [...] }
   */
  async getAllTenders(req, res) {
    try {
      // Parse et valider les paramètres de pagination avec gestion d'erreurs
      let page = 1;
      let limit = 50;

      // Validation stricte de page
      if (req.query.page !== undefined) {
        const parsedPage = parseInt(String(req.query.page), 10);
        if (isNaN(parsedPage) || parsedPage < 1) {
          return res.status(400).json({
            success: false,
            error: 'Page invalide. Doit être un nombre positif.',
            code: 'INVALID_PAGE'
          });
        }
        page = parsedPage;
      }

      // Validation stricte de limit
      if (req.query.limit !== undefined) {
        const parsedLimit = parseInt(String(req.query.limit), 10);
        if (isNaN(parsedLimit) || parsedLimit < 1) {
          return res.status(400).json({
            success: false,
            error: 'Limite invalide. Doit être un nombre positif.',
            code: 'INVALID_LIMIT'
          });
        }
        limit = Math.min(parsedLimit, 100); // Max 100
      }

      // Validation de is_public
      let isPublic = undefined;
      if (req.query.is_public !== undefined) {
        if (req.query.is_public === 'true' || req.query.is_public === true) {
          isPublic = true;
        } else if (req.query.is_public === 'false' || req.query.is_public === false) {
          isPublic = false;
        }
      }

      const filters = {
        status: req.query.status,
        category: req.query.category,
        is_public: isPublic,
        limit,
        page,
      };

      const tenders = await TenderService.getAllTenders(filters, req.user?.id);

      res.status(200).json({
        success: true,
        count: tenders.length,
        page,
        limit,
        tenders,
      });
    } catch (error) {
      logger.error('Error fetching tenders:', error);
      
      // Gestion d'erreur spécifique
      if (error.message?.includes('validation')) {
        return res.status(400).json({
          success: false,
          error: error.message,
          code: 'VALIDATION_ERROR'
        });
      }
      
      const { errorResponse } = require('../../middleware/errorResponseFormatter');
      errorResponse(res, error, 'Error fetching tenders');
    }
  }

  async getMyTenders(req, res) {
    try {
      const filters = {
        status: req.query.status,
        category: req.query.category,
        limit: req.query.limit ? parseInt(req.query.limit) : 50,
        page: req.query.page ? parseInt(req.query.page) : 1, // Added for pagination validation
      };

      const tenders = await TenderService.getMyTenders(req.user.id, filters);

      res.status(200).json({
        success: true,
        count: tenders.length,
        tenders,
      });
    } catch (error) {
      logger.error('Error fetching user tenders:', error);
      const { errorResponse } = require('../../middleware/errorResponseFormatter');
      errorResponse(res, error, 'Error fetching user tenders');
    }
  }

  async updateTender(req, res) {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const tender = await TenderService.updateTender(id, updateData, req.user.id);

      res.status(200).json({
        success: true,
        message: 'Tender updated successfully',
        tender,
      });
    } catch (error) {
      logger.error('Error updating tender:', error);
      const { errorResponse } = require('../../middleware/errorResponseFormatter');
      errorResponse(res, error, 'Error updating tender');
    }
  }

  async deleteTender(req, res) {
    try {
      const { id } = req.params;

      await TenderService.deleteTender(id, req.user.id);

      res.status(200).json({
        success: true,
        message: 'Tender deleted successfully',
      });
    } catch (error) {
      logger.error('Error deleting tender:', error);
      const { errorResponse } = require('../../middleware/errorResponseFormatter');
      errorResponse(res, error, 'Error deleting tender');
    }
  }

  async publishTender(req, res) {
    try {
      const { id } = req.params;

      const tender = await TenderService.publishTender(id, req.user.id);

      const tenderData = {
        category: tender.category,
        service_location: tender.service_location,
        budget_min: tender.budget_min,
      };

      await NotificationService.notifyTenderPublished(
        tender.id,
        tender.title,
        req.user.id,
        tenderData
      );

      res.status(200).json({
        success: true,
        message: 'Tender published successfully',
        tender,
      });
    } catch (error) {
      logger.error('Error publishing tender:', error);
      const { errorResponse } = require('../../middleware/errorResponseFormatter');
      errorResponse(res, error, 'Error publishing tender');
    }
  }

  async closeTender(req, res) {
    try {
      const { id } = req.params;

      const tender = await TenderService.closeTender(id, req.user.id);

      res.status(200).json({
        success: true,
        message: 'Tender closed successfully',
        tender,
      });
    } catch (error) {
      logger.error('Error closing tender:', error);
      const { errorResponse } = require('../../middleware/errorResponseFormatter');
      errorResponse(res, error, 'Error closing tender');
    }
  }

  async getTenderWithOffers(req, res) {
    try {
      const { id } = req.params;

      const tender = await TenderService.getTenderWithOffers(id, req.user.id);

      res.status(200).json({
        success: true,
        tender,
      });
    } catch (error) {
      logger.error('Error fetching tender with offers:', error);
      const { errorResponse } = require('../../middleware/errorResponseFormatter');
      errorResponse(res, error, 'Error fetching tender with offers');
    }
  }

  /**
   * Get tender statistics including offers, evaluations, and awards
   * @async
   * @param {Object} req - Express request object
   * @param {Object} req.params - Request parameters
   * @param {string} req.params.id - Tender ID
   * @param {Object} res - Express response object
   * @returns {void} Returns tender statistics
   * @example
   * GET /procurement/tenders/:id/statistics
   * Response: {
   *   success: true,
   *   statistics: {
   *     totalOffers: 5,
   *     avgScore: 75.5,
   *     awarded: true
   *   }
   * }
   */
  async getTenderStatistics(req, res) {
    try {
      const { id } = req.params;

      const statistics = await TenderService.getTenderStatistics(id);

      res.status(200).json({
        success: true,
        statistics,
      });
    } catch (error) {
      logger.error('Error fetching tender statistics:', error);
      const { errorResponse } = require('../../middleware/errorResponseFormatter');
      errorResponse(res, error, 'Error fetching tender statistics');
    }
  }

  /**
   * Award tender to selected suppliers
   * @async
   * @param {Object} req - Express request object
   * @param {Object} req.params - Request parameters
   * @param {string} req.params.id - Tender ID
   * @param {Object} req.body - Award data
   * @param {Array<Object>} req.body.awards - Array of award decisions
   * @param {string} req.body.awards[].offer_id - Offer ID to award
   * @param {number} req.body.awards[].amount - Award amount
   * @param {Object} req.user - Authenticated buyer
   * @param {Object} res - Express response object
   * @returns {void} Returns award result with notifications sent
   * @throws {403} If user not authorized
   * @throws {400} If awards data invalid
   * @example
   * POST /procurement/tenders/:id/award
   * {
   *   "awards": [
   *     { "offer_id": "123", "amount": 50000 }
   *   ]
   * }
   */
  async awardTender(req, res) {
    try {
      const { id } = req.params;
      const { awards } = req.body;

      const result = await TenderService.awardTender(id, awards, req.user.id);

      res.status(200).json({
        success: true,
        message: 'Tender awarded successfully',
        result,
      });
    } catch (error) {
      logger.error('Error awarding tender:', error);
      const { errorResponse } = require('../../middleware/errorResponseFormatter');
      errorResponse(res, error, 'Error awarding tender');
    }
  }
}

module.exports = new TenderController();