
/**
 * AI Recommendation Service
 * Provides intelligent recommendations for buyers and suppliers
 */

class AIRecommendationService {
  /**
   * Recommend suppliers based on tender requirements
   */
  static async recommendSuppliersForTender(db, tenderId) {
    try {
      const query = `
        WITH tender_requirements AS (
          SELECT 
            t.id,
            t.category,
            t.budget_max,
            t.location,
            t.required_certifications
          FROM tenders t
          WHERE t.id = $1
        ),
        supplier_scores AS (
          SELECT 
            u.id as supplier_id,
            u.company_name,
            COUNT(DISTINCT o.id) as total_offers,
            AVG(o.total_price) as avg_price,
            AVG(r.rating) as avg_rating,
            COUNT(DISTINCT CASE WHEN o.status = 'awarded' THEN o.id END) as awards_won,
            -- Category match score
            CASE WHEN cp.industry = tr.category THEN 20 ELSE 0 END as category_score,
            -- Price competitiveness score
            CASE 
              WHEN AVG(o.total_price) <= tr.budget_max * 0.8 THEN 25
              WHEN AVG(o.total_price) <= tr.budget_max THEN 15
              ELSE 5
            END as price_score,
            -- Experience score
            CASE 
              WHEN COUNT(DISTINCT o.id) >= 50 THEN 20
              WHEN COUNT(DISTINCT o.id) >= 20 THEN 15
              WHEN COUNT(DISTINCT o.id) >= 10 THEN 10
              ELSE 5
            END as experience_score,
            -- Rating score
            COALESCE(AVG(r.rating), 3) * 7 as rating_score,
            -- Win rate score
            CASE 
              WHEN COUNT(DISTINCT o.id) > 0 THEN
                (COUNT(DISTINCT CASE WHEN o.status = 'awarded' THEN o.id END)::float / 
                 COUNT(DISTINCT o.id)::float * 20)
              ELSE 0
            END as win_rate_score
          FROM users u
          LEFT JOIN company_profiles cp ON u.id = cp.user_id
          LEFT JOIN offers o ON u.id = o.supplier_id
          LEFT JOIN reviews r ON u.id = r.supplier_id
          CROSS JOIN tender_requirements tr
          WHERE u.role = 'supplier' 
            AND u.is_verified = true
            AND u.deleted_at IS NULL
          GROUP BY u.id, u.company_name, cp.industry, tr.category, tr.budget_max
        )
        SELECT 
          supplier_id,
          company_name,
          total_offers,
          avg_price,
          avg_rating,
          awards_won,
          (category_score + price_score + experience_score + rating_score + win_rate_score) as total_score,
          category_score,
          price_score,
          experience_score,
          rating_score,
          win_rate_score
        FROM supplier_scores
        WHERE (category_score + price_score + experience_score + rating_score + win_rate_score) >= 40
        ORDER BY total_score DESC
        LIMIT 10
      `;

      const result = await db.query(query, [tenderId]);

      return {
        success: true,
        recommendations: result.rows.map(row => ({
          supplierId: row.supplier_id,
          companyName: row.company_name,
          score: Math.round(row.total_score),
          breakdown: {
            categoryMatch: row.category_score,
            priceCompetitiveness: row.price_score,
            experience: row.experience_score,
            rating: Math.round(row.rating_score),
            winRate: Math.round(row.win_rate_score)
          },
          stats: {
            totalOffers: row.total_offers,
            avgPrice: parseFloat(row.avg_price || 0).toFixed(2),
            avgRating: parseFloat(row.avg_rating || 0).toFixed(1),
            awardsWon: row.awards_won
          }
        })),
        algorithm: 'Multi-factor scoring: Category(20) + Price(25) + Experience(20) + Rating(35) + WinRate(20)'
      };
    } catch (error) {
      console.error('AI Recommendation Error:', error);
      throw error;
    }
  }

  /**
   * Recommend tenders to suppliers based on their profile
   */
  static async recommendTendersForSupplier(db, supplierId) {
    try {
      const query = `
        WITH supplier_profile AS (
          SELECT 
            u.id,
            cp.industry,
            cp.specializations,
            AVG(o.total_price) as avg_offer_price,
            COUNT(DISTINCT o.id) as total_offers
          FROM users u
          LEFT JOIN company_profiles cp ON u.id = cp.user_id
          LEFT JOIN offers o ON u.id = o.supplier_id
          WHERE u.id = $1
          GROUP BY u.id, cp.industry, cp.specializations
        ),
        tender_scores AS (
          SELECT 
            t.id as tender_id,
            t.title,
            t.category,
            t.budget_max,
            t.deadline,
            t.status,
            COUNT(DISTINCT o.id) as current_offers,
            -- Category match
            CASE WHEN t.category = sp.industry THEN 30 ELSE 0 END as category_score,
            -- Budget match
            CASE 
              WHEN t.budget_max >= sp.avg_offer_price * 0.8 
                AND t.budget_max <= sp.avg_offer_price * 1.5 THEN 25
              WHEN t.budget_max >= sp.avg_offer_price * 0.5 THEN 15
              ELSE 5
            END as budget_score,
            -- Competition level (fewer offers = higher score)
            CASE 
              WHEN COUNT(DISTINCT o.id) < 3 THEN 20
              WHEN COUNT(DISTINCT o.id) < 6 THEN 15
              WHEN COUNT(DISTINCT o.id) < 10 THEN 10
              ELSE 5
            END as competition_score,
            -- Time urgency (closer deadline = higher score)
            CASE 
              WHEN t.deadline > NOW() + INTERVAL '30 days' THEN 10
              WHEN t.deadline > NOW() + INTERVAL '14 days' THEN 15
              WHEN t.deadline > NOW() + INTERVAL '7 days' THEN 20
              ELSE 5
            END as urgency_score
          FROM tenders t
          LEFT JOIN offers o ON t.id = o.tender_id
          CROSS JOIN supplier_profile sp
          WHERE t.status = 'open'
            AND t.deadline > NOW()
            AND t.deleted_at IS NULL
            AND NOT EXISTS (
              SELECT 1 FROM offers o2 
              WHERE o2.tender_id = t.id AND o2.supplier_id = $1
            )
          GROUP BY t.id, t.title, t.category, t.budget_max, t.deadline, t.status,
                   sp.industry, sp.avg_offer_price
        )
        SELECT 
          tender_id,
          title,
          category,
          budget_max,
          deadline,
          current_offers,
          (category_score + budget_score + competition_score + urgency_score) as total_score,
          category_score,
          budget_score,
          competition_score,
          urgency_score
        FROM tender_scores
        WHERE (category_score + budget_score + competition_score + urgency_score) >= 35
        ORDER BY total_score DESC, deadline ASC
        LIMIT 15
      `;

      const result = await db.query(query, [supplierId]);

      return {
        success: true,
        recommendations: result.rows.map(row => ({
          tenderId: row.tender_id,
          title: row.title,
          category: row.category,
          budget: row.budget_max,
          deadline: row.deadline,
          currentOffers: row.current_offers,
          score: Math.round(row.total_score),
          breakdown: {
            categoryMatch: row.category_score,
            budgetFit: row.budget_score,
            competitionLevel: row.competition_score,
            urgency: row.urgency_score
          },
          recommendation: this._getRecommendationText(row.total_score)
        })),
        algorithm: 'Multi-factor scoring: Category(30) + Budget(25) + Competition(20) + Urgency(20)'
      };
    } catch (error) {
      console.error('Tender Recommendation Error:', error);
      throw error;
    }
  }

  static _getRecommendationText(score) {
    if (score >= 75) return 'Excellente opportunité - Correspondance parfaite';
    if (score >= 60) return 'Très bonne opportunité - Forte correspondance';
    if (score >= 45) return 'Bonne opportunité - Correspondance modérée';
    return 'Opportunité intéressante';
  }
}

module.exports = AIRecommendationService;
