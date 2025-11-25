/**
 * Evaluation Service
 * Handles technical and financial evaluation of offers
 */

const { getPool } = require('../config/db');
const AuditLogService = require('./AuditLogService');

class EvaluationService {
  /**
   * Record technical evaluation for an offer
   */
  static async recordTechnicalEvaluation(offerId, technicalScore, comments, evaluatorId) {
    const pool = getPool();

    try {
      // Validate score (0-100)
      if (technicalScore < 0 || technicalScore > 100) {
        throw new Error('Technical score must be between 0 and 100');
      }

      const result = await pool.query(
        `UPDATE offers 
         SET technical_score = $1, technical_comments = $2, technical_evaluated_at = NOW(), technical_evaluated_by = $3
         WHERE id = $4
         RETURNING *`,
        [technicalScore, comments, evaluatorId, offerId]
      );

      if (result.rows.length === 0) {
        throw new Error('Offer not found');
      }

      await AuditLogService.log(
        evaluatorId,
        'technical_evaluation',
        offerId,
        'create',
        `Technical evaluation recorded: ${technicalScore}/100`
      );

      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  /**
   * Record financial evaluation
   */
  static async recordFinancialEvaluation(offerId, financialScore, comments, evaluatorId) {
    const pool = getPool();

    try {
      if (financialScore < 0 || financialScore > 100) {
        throw new Error('Financial score must be between 0 and 100');
      }

      const result = await pool.query(
        `UPDATE offers 
         SET financial_score = $1, financial_comments = $2, financial_evaluated_at = NOW(), financial_evaluated_by = $3
         WHERE id = $4
         RETURNING *`,
        [financialScore, comments, evaluatorId, offerId]
      );

      await AuditLogService.log(
        evaluatorId,
        'financial_evaluation',
        offerId,
        'create',
        `Financial evaluation recorded: ${financialScore}/100`
      );

      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  /**
   * Calculate final score using formula: (technical + financial) / 2
   * Note: This is advisory only, buyer decision is final
   */
  static async calculateFinalScores(tenderId, buyerId) {
    const pool = getPool();

    try {
      const offersResult = await pool.query(
        `SELECT id, offer_number, supplier_id, technical_score, financial_score
         FROM offers
         WHERE tender_id = $1 AND status = 'submitted' AND technical_score IS NOT NULL AND financial_score IS NOT NULL
         AND is_deleted = FALSE
         ORDER BY id`,
        [tenderId]
      );

      // Calculate final scores
      const scoredOffers = offersResult.rows.map(offer => {
        const finalScore = (offer.technical_score + offer.financial_score) / 2;
        return {
          id: offer.id,
          offer_number: offer.offer_number,
          technical_score: offer.technical_score,
          financial_score: offer.financial_score,
          final_score: parseFloat(finalScore.toFixed(2)),
        };
      });

      // Sort by final score (highest first)
      scoredOffers.sort((a, b) => b.final_score - a.final_score);

      // Add ranking
      const rankedOffers = scoredOffers.map((offer, index) => ({
        ...offer,
        rank: index + 1,
      }));

      // Update database with final scores and ranks
      for (let i = 0; i < rankedOffers.length; i++) {
        await pool.query(
          `UPDATE offers 
           SET final_score = $1, ranking = $2, evaluation_completed_at = NOW()
           WHERE id = $3`,
          [rankedOffers[i].final_score, rankedOffers[i].rank, rankedOffers[i].id]
        );
      }

      await AuditLogService.log(
        buyerId,
        'evaluation_complete',
        tenderId,
        'complete',
        `Final evaluation completed for ${rankedOffers.length} offers`
      );

      return rankedOffers;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get evaluation summary for tender
   */
  static async getEvaluationSummary(tenderId) {
    const pool = getPool();

    try {
      const result = await pool.query(
        `SELECT 
          id,
          offer_number,
          company_name,
          technical_score,
          financial_score,
          final_score,
          ranking,
          technical_comments,
          financial_comments,
          evaluation_completed_at
         FROM offers
         WHERE tender_id = $1 AND evaluation_completed_at IS NOT NULL AND is_deleted = FALSE
         ORDER BY ranking ASC`,
        [tenderId]
      );

      return result.rows;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = EvaluationService;
