const ReviewService = require('../../services/ReviewService');

/**
 * Review Controller
 * Handles review creation and retrieval for users/suppliers
 *
 * @class ReviewController
 * @example
 * const controller = new ReviewController();
 * await controller.createReview(req, res, next);
 */
class ReviewController {
  /**
   * Create a new review for a user
   * @async
   * @param {Object} req - Express request object
   * @param {Object} req.body - Review data
   * @param {number} req.body.reviewed_user_id - User being reviewed (required)
   * @param {number} req.body.rating - Rating 1-5 (required)
   * @param {string} req.body.comment - Review comment (required)
   * @param {number} req.body.tender_id - Associated tender (optional)
   * @param {Object} req.user - Authenticated reviewer
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware
   * @returns {void} Returns created review
   * @throws {400} If validation fails
   * @example
   * POST /reviews
   * {
   *   "reviewed_user_id": 5,
   *   "rating": 4,
   *   "comment": "Excellent service"
   * }
   */
  async createReview(req, res, next) {
    try {
      const userId = req.user.id;
      const reviewData = {
        ...req.body,
        reviewer_id: userId,
      };

      const review = await ReviewService.createReview(reviewData);

      res.status(201).json({
        success: true,
        message: 'Review submitted successfully',
        data: review,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get all reviews for a user
   * @async
   * @param {Object} req - Express request object
   * @param {Object} req.params - Request parameters
   * @param {number} req.params.userId - User ID to get reviews for (required)
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware
   * @returns {void} Returns array of reviews and average rating
   * @throws {500} If database error occurs
   * @example
   * GET /reviews/user/:userId
   * Response: { success: true, data: { reviews: [...], rating: 4.5 } }
   */
  async getUserReviews(req, res, next) {
    try {
      const { userId } = req.params;
      const reviews = await ReviewService.getUserReviews(userId);
      const rating = await ReviewService.getUserRating(userId);

      res.json({
        success: true,
        data: {
          reviews,
          rating,
        },
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ReviewController();
