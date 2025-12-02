const ReviewService = require('../services/ReviewService');

class ReviewController {
  async createReview(req, res) {
    try {
      const { offer_id, supplier_id, rating, comment, po_id } = req.body;
      const buyerId = req.user.id;

      if (!offer_id || !supplier_id || !rating || !po_id) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      const review = await ReviewService.createReview(
        { offer_id, supplier_id, rating, comment, po_id },
        buyerId,
        req.clientIP
      );

      await ReviewService.updateSupplierAverageRating(supplier_id);

      res.status(201).json({ success: true, review });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async getSupplierReviews(req, res) {
    try {
      const { supplierId } = req.params;
      const reviews = await ReviewService.getSupplierReviews(supplierId);
      res.status(200).json({ success: true, data: reviews });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new ReviewController();
