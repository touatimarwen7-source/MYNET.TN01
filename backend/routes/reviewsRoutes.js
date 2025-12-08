const express = require('express');
const { verifyToken } = require('../middleware/authMiddleware');
const { validateIdMiddleware } = require('../middleware/validateIdMiddleware');
const { asyncHandler } = require('../middleware/errorHandlingMiddleware');
const ResponseFormatter = require('../utils/responseFormatter');

const router = express.Router();

/**
 * @route   POST /api/reviews
 * @desc    Créer une nouvelle évaluation pour un fournisseur
 * @access  Privé (Acheteurs uniquement)
 */
router.post(
  '/',
  verifyToken,
  asyncHandler(async (req, res) => {
    const { supplier_id, rating, comment, tender_id } = req.body;
    const buyer_id = req.user.id;

    // Validation
    if (!supplier_id) {
      return res.status(400).json(
        ResponseFormatter.error('L\'identifiant du fournisseur est requis', 'VALIDATION_ERROR', 400)
      );
    }

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json(
        ResponseFormatter.error('La note doit être entre 1 et 5', 'VALIDATION_ERROR', 400)
      );
    }

    const db = req.app.get('db');

    // Vérifier si le fournisseur existe
    const supplierCheck = await db.query(
      'SELECT id FROM users WHERE id = $1 AND role = $2',
      [supplier_id, 'supplier']
    );

    if (supplierCheck.rows.length === 0) {
      return res.status(404).json(
        ResponseFormatter.error('Fournisseur introuvable', 'NOT_FOUND', 404)
      );
    }

    // Créer l'évaluation
    const result = await db.query(
      `INSERT INTO reviews (buyer_id, supplier_id, rating, comment, tender_id, created_at)
       VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP)
       RETURNING *`,
      [buyer_id, supplier_id, rating, comment || null, tender_id || null]
    );

    // Mettre à jour la note moyenne du fournisseur
    await db.query(
      `UPDATE users 
       SET average_rating = (
         SELECT AVG(rating) FROM reviews WHERE supplier_id = $1
       )
       WHERE id = $1`,
      [supplier_id]
    );

    return res.status(201).json(
      ResponseFormatter.success(result.rows[0], 'Évaluation créée avec succès')
    );
  })
);

/**
 * @route   GET /api/reviews/supplier/:supplierId
 * @desc    Récupérer les évaluations d'un fournisseur
 * @access  Public
 */
router.get(
  '/supplier/:supplierId',
  validateIdMiddleware('supplierId'),
  asyncHandler(async (req, res) => {
    const { supplierId } = req.params;
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const db = req.app.get('db');

    const result = await db.query(
      `SELECT 
        r.*,
        u.full_name as buyer_name,
        u.company_name as buyer_company
      FROM reviews r
      LEFT JOIN users u ON r.buyer_id = u.id
      WHERE r.supplier_id = $1
      ORDER BY r.created_at DESC
      LIMIT $2 OFFSET $3`,
      [supplierId, limit, offset]
    );

    const countResult = await db.query(
      'SELECT COUNT(*) FROM reviews WHERE supplier_id = $1',
      [supplierId]
    );

    return res.json(
      ResponseFormatter.paginated(
        result.rows,
        page,
        limit,
        parseInt(countResult.rows[0].count)
      )
    );
  })
);

/**
 * @route   GET /api/reviews/my-reviews
 * @desc    Récupérer mes évaluations (acheteur)
 * @access  Privé (Acheteurs)
 */
router.get(
  '/my-reviews',
  verifyToken,
  asyncHandler(async (req, res) => {
    const db = req.app.get('db');

    const result = await db.query(
      `SELECT 
        r.*,
        u.company_name as supplier_name,
        u.average_rating as supplier_rating
      FROM reviews r
      LEFT JOIN users u ON r.supplier_id = u.id
      WHERE r.buyer_id = $1
      ORDER BY r.created_at DESC`,
      [req.user.id]
    );

    return res.json(
      ResponseFormatter.success(result.rows, 'Évaluations récupérées avec succès')
    );
  })
);

/**
 * @route   DELETE /api/reviews/:reviewId
 * @desc    Supprimer une évaluation (propriétaire uniquement)
 * @access  Privé
 */
router.delete(
  '/:reviewId',
  validateIdMiddleware('reviewId'),
  verifyToken,
  asyncHandler(async (req, res) => {
    const { reviewId } = req.params;
    const db = req.app.get('db');

    // Vérifier la propriété
    const checkResult = await db.query(
      'SELECT * FROM reviews WHERE id = $1',
      [reviewId]
    );

    if (checkResult.rows.length === 0) {
      return res.status(404).json(
        ResponseFormatter.error('Évaluation introuvable', 'NOT_FOUND', 404)
      );
    }

    if (checkResult.rows[0].buyer_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json(
        ResponseFormatter.error('Non autorisé', 'FORBIDDEN', 403)
      );
    }

    await db.query('DELETE FROM reviews WHERE id = $1', [reviewId]);

    return res.json(
      ResponseFormatter.success(null, 'Évaluation supprimée avec succès')
    );
  })
);

module.exports = router;