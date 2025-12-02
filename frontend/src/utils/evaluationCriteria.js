// ============ Unified Evaluation Criteria ============

/**
 * 🏆 Standard evaluation criteria for all scoring across the platform
 */
export const EVALUATION_CRITERIA = {
  // Score ranges
  SCORE_MIN: 0,
  SCORE_MAX: 100,

  // Quality tiers
  SCORE_EXCELLENT: 85, // ⭐⭐⭐⭐⭐
  SCORE_GOOD: 70, // ⭐⭐⭐⭐
  SCORE_FAIR: 50, // ⭐⭐⭐
  SCORE_POOR: 30, // ⭐⭐
  SCORE_FAILING: 0, // ⭐

  // Weight distribution
  WEIGHTS: {
    price: 0.4, // 40% - Price competitiveness
    quality: 0.3, // 30% - Quality/specifications
    delivery: 0.2, // 20% - Delivery time
    compliance: 0.1, // 10% - Regulatory compliance
  },

  // Categories
  CATEGORIES: [
    { key: 'price', label: 'Prix (40%)', weight: 0.4, icon: '💰' },
    { key: 'quality', label: 'Qualité (30%)', weight: 0.3, icon: '⭐' },
    { key: 'delivery', label: 'Livraison (20%)', weight: 0.2, icon: '🚚' },
    { key: 'compliance', label: 'Conformité (10%)', weight: 0.1, icon: '✅' },
  ],
};

/**
 * 📊 Calculate weighted evaluation score
 * @param {object} scores - Scores for each category {price, quality, delivery, compliance}
 * @returns {number} Weighted total score (0-100)
 */
export const calculateWeightedScore = (scores = {}) => {
  const { price = 0, quality = 0, delivery = 0, compliance = 0 } = scores;

  const weights = EVALUATION_CRITERIA.WEIGHTS;
  const total =
    (price || 0) * weights.price +
    (quality || 0) * weights.quality +
    (delivery || 0) * weights.delivery +
    (compliance || 0) * weights.compliance;

  return Math.round(total * 100) / 100; // Round to 2 decimals
};

/**
 * 🎯 Get score tier and color
 * @param {number} score - Score value (0-100)
 * @returns {object} {tier, color, label, icon}
 */
export const getScoreTier = (score = 0) => {
  const normalized = Math.min(100, Math.max(0, score));

  if (normalized >= EVALUATION_CRITERIA.SCORE_EXCELLENT) {
    return { tier: 'excellent', color: '#4caf50', label: 'Excellent', icon: '⭐⭐⭐⭐⭐' };
  }
  if (normalized >= EVALUATION_CRITERIA.SCORE_GOOD) {
    return { tier: 'good', color: '#8bc34a', label: 'Bon', icon: '⭐⭐⭐⭐' };
  }
  if (normalized >= EVALUATION_CRITERIA.SCORE_FAIR) {
    return { tier: 'fair', color: '#ff9800', label: 'Acceptable', icon: '⭐⭐⭐' };
  }
  if (normalized >= EVALUATION_CRITERIA.SCORE_POOR) {
    return { tier: 'poor', color: '#ff5722', label: 'Faible', icon: '⭐⭐' };
  }
  return { tier: 'failing', color: '#d32f2f', label: 'Rejeté', icon: '⭐' };
};

/**
 * ✅ Validate score
 * @param {number} score - Score to validate
 * @returns {boolean} Is valid (0-100)
 */
export const isValidScore = (score) => {
  const num = parseFloat(score);
  return (
    !isNaN(num) && num >= EVALUATION_CRITERIA.SCORE_MIN && num <= EVALUATION_CRITERIA.SCORE_MAX
  );
};

/**
 * 📋 Format score for display
 * @param {number} score - Score value
 * @returns {string} Formatted score (e.g., "85/100")
 */
export const formatScore = (score) => {
  if (!isValidScore(score)) return '-';
  return `${score.toFixed(1)}/100`;
};

/**
 * 🔄 Compare two scores
 * @param {number} score1 - First score
 * @param {number} score2 - Second score
 * @returns {string} 'better', 'worse', or 'equal'
 */
export const compareScores = (score1, score2) => {
  if (score1 > score2) return 'better';
  if (score1 < score2) return 'worse';
  return 'equal';
};

export default EVALUATION_CRITERIA;
