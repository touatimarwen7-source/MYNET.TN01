
/**
 * Advanced Analytics Service
 * Provides deep insights and predictive analytics
 */

class AdvancedAnalyticsService {
  /**
   * Get market trends and insights
   */
  static async getMarketTrends(db, period = '30 days') {
    try {
      const query = `
        WITH time_series AS (
          SELECT 
            DATE_TRUNC('day', created_at) as date,
            COUNT(*) as tender_count,
            AVG(budget_max) as avg_budget,
            category
          FROM tenders
          WHERE created_at >= NOW() - INTERVAL '${period}'
            AND deleted_at IS NULL
          GROUP BY DATE_TRUNC('day', created_at), category
        ),
        offer_trends AS (
          SELECT 
            DATE_TRUNC('day', o.created_at) as date,
            COUNT(*) as offer_count,
            AVG(o.total_price) as avg_price,
            t.category
          FROM offers o
          JOIN tenders t ON o.tender_id = t.id
          WHERE o.created_at >= NOW() - INTERVAL '${period}'
          GROUP BY DATE_TRUNC('day', o.created_at), t.category
        ),
        competition_metrics AS (
          SELECT 
            t.category,
            AVG(offer_counts.count) as avg_offers_per_tender,
            STDDEV(offer_counts.count) as stddev_offers
          FROM tenders t
          LEFT JOIN (
            SELECT tender_id, COUNT(*) as count
            FROM offers
            GROUP BY tender_id
          ) offer_counts ON t.id = offer_counts.tender_id
          WHERE t.created_at >= NOW() - INTERVAL '${period}'
          GROUP BY t.category
        )
        SELECT 
          ts.category,
          COUNT(DISTINCT ts.date) as active_days,
          SUM(ts.tender_count) as total_tenders,
          AVG(ts.avg_budget) as avg_budget,
          SUM(ot.offer_count) as total_offers,
          AVG(ot.avg_price) as avg_offer_price,
          cm.avg_offers_per_tender,
          cm.stddev_offers,
          -- Calculate trend direction
          CASE 
            WHEN AVG(ts.tender_count) OVER (
              PARTITION BY ts.category 
              ORDER BY ts.date 
              ROWS BETWEEN 7 PRECEDING AND CURRENT ROW
            ) > AVG(ts.tender_count) OVER (
              PARTITION BY ts.category 
              ORDER BY ts.date 
              ROWS BETWEEN 14 PRECEDING AND 7 PRECEDING
            ) THEN 'increasing'
            ELSE 'decreasing'
          END as trend
        FROM time_series ts
        LEFT JOIN offer_trends ot ON ts.date = ot.date AND ts.category = ot.category
        LEFT JOIN competition_metrics cm ON ts.category = cm.category
        GROUP BY ts.category, cm.avg_offers_per_tender, cm.stddev_offers
        ORDER BY total_tenders DESC
      `;

      const result = await db.query(query);

      return {
        success: true,
        period,
        trends: result.rows.map(row => ({
          category: row.category,
          metrics: {
            totalTenders: parseInt(row.total_tenders),
            totalOffers: parseInt(row.total_offers || 0),
            avgBudget: parseFloat(row.avg_budget || 0).toFixed(2),
            avgOfferPrice: parseFloat(row.avg_offer_price || 0).toFixed(2),
            avgOffersPerTender: parseFloat(row.avg_offers_per_tender || 0).toFixed(1),
            competitionLevel: this._getCompetitionLevel(row.avg_offers_per_tender)
          },
          trend: row.trend,
          activeDays: parseInt(row.active_days)
        })),
        generatedAt: new Date().toISOString()
      };
    } catch (error) {
      console.error('Market Trends Error:', error);
      throw error;
    }
  }

  /**
   * Predict optimal bidding strategy
   */
  static async predictOptimalBid(db, tenderId, supplierId) {
    try {
      const query = `
        WITH tender_info AS (
          SELECT 
            t.id,
            t.budget_max,
            t.category,
            COUNT(o.id) as current_offers,
            MIN(o.total_price) as lowest_offer,
            AVG(o.total_price) as avg_offer
          FROM tenders t
          LEFT JOIN offers o ON t.id = o.tender_id
          WHERE t.id = $1
          GROUP BY t.id, t.budget_max, t.category
        ),
        historical_wins AS (
          SELECT 
            AVG(o.total_price) as avg_winning_price,
            AVG(o.total_price / t.budget_max) as avg_discount_rate
          FROM offers o
          JOIN tenders t ON o.tender_id = t.id
          WHERE o.status = 'awarded'
            AND t.category = (SELECT category FROM tender_info)
            AND o.created_at >= NOW() - INTERVAL '6 months'
        ),
        supplier_history AS (
          SELECT 
            AVG(total_price) as avg_past_offers,
            COUNT(*) as total_offers,
            COUNT(CASE WHEN status = 'awarded' THEN 1 END) as wins
          FROM offers
          WHERE supplier_id = $2
        )
        SELECT 
          ti.*,
          hw.avg_winning_price,
          hw.avg_discount_rate,
          sh.avg_past_offers,
          sh.total_offers,
          sh.wins,
          -- Calculate recommended price range
          ti.budget_max * hw.avg_discount_rate as recommended_price,
          ti.budget_max * (hw.avg_discount_rate - 0.05) as competitive_price,
          ti.budget_max * (hw.avg_discount_rate + 0.05) as safe_price
        FROM tender_info ti
        CROSS JOIN historical_wins hw
        CROSS JOIN supplier_history sh
      `;

      const result = await db.query(query, [tenderId, supplierId]);
      
      if (result.rows.length === 0) {
        throw new Error('Tender not found');
      }

      const data = result.rows[0];
      const winProbability = this._calculateWinProbability(data);

      return {
        success: true,
        tenderId,
        analysis: {
          currentCompetition: {
            totalOffers: parseInt(data.current_offers),
            lowestOffer: parseFloat(data.lowest_offer || 0).toFixed(2),
            avgOffer: parseFloat(data.avg_offer || 0).toFixed(2)
          },
          recommendations: {
            recommended: parseFloat(data.recommended_price).toFixed(2),
            competitive: parseFloat(data.competitive_price).toFixed(2),
            safe: parseFloat(data.safe_price).toFixed(2),
            winProbability: `${winProbability}%`
          },
          historicalContext: {
            avgWinningPrice: parseFloat(data.avg_winning_price || 0).toFixed(2),
            typicalDiscount: `${((1 - data.avg_discount_rate) * 100).toFixed(1)}%`
          },
          supplierProfile: {
            pastOffers: parseInt(data.total_offers),
            wins: parseInt(data.wins),
            winRate: data.total_offers > 0 
              ? `${((data.wins / data.total_offers) * 100).toFixed(1)}%`
              : '0%'
          }
        },
        strategy: this._getStrategyRecommendation(data, winProbability)
      };
    } catch (error) {
      console.error('Bid Prediction Error:', error);
      throw error;
    }
  }

  static _getCompetitionLevel(avgOffers) {
    if (avgOffers >= 10) return 'Très élevé';
    if (avgOffers >= 6) return 'Élevé';
    if (avgOffers >= 3) return 'Modéré';
    return 'Faible';
  }

  static _calculateWinProbability(data) {
    let probability = 50; // Base probability

    // Adjust based on competition
    if (data.current_offers < 3) probability += 20;
    else if (data.current_offers > 8) probability -= 20;

    // Adjust based on supplier history
    const winRate = data.total_offers > 0 ? data.wins / data.total_offers : 0;
    probability += winRate * 20;

    return Math.max(10, Math.min(90, Math.round(probability)));
  }

  static _getStrategyRecommendation(data, winProbability) {
    if (winProbability >= 70) {
      return 'Soumettez une offre à prix compétitif pour maximiser vos chances';
    } else if (winProbability >= 50) {
      return 'Privilégiez un prix légèrement inférieur à la moyenne pour vous démarquer';
    } else {
      return 'La concurrence est forte - considérez une offre agressive ou attendez une meilleure opportunité';
    }
  }
}

module.exports = AdvancedAnalyticsService;
