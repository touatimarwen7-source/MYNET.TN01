/**
 * Performance Optimizer Utility
 * Identifies and suggests optimizations for slow operations
 *
 * @module performanceOptimizer
 */

class PerformanceOptimizer {
  constructor() {
    this.slowThreshold = 100; // 100ms
    this.criticalThreshold = 500; // 500ms
    this.optimizations = [];
  }

  /**
   * Analyze performance metrics and suggest optimizations
   * @param {Array} requests - Array of request metrics
   * @returns {Array} Optimization suggestions
   */
  analyzePerformance(requests) {
    const suggestions = [];
    const endpointStats = this.groupByEndpoint(requests);

    for (const [endpoint, stats] of Object.entries(endpointStats)) {
      // Check for slow endpoints
      if (stats.avgDuration > this.criticalThreshold) {
        suggestions.push({
          severity: 'CRITICAL',
          endpoint,
          issue: 'Critical performance issue',
          avgTime: stats.avgDuration,
          suggestion: 'Add database indexing, implement caching, or optimize queries',
          impact: 'High - affects user experience',
        });
      } else if (stats.avgDuration > this.slowThreshold) {
        suggestions.push({
          severity: 'WARNING',
          endpoint,
          issue: 'Slow endpoint detected',
          avgTime: stats.avgDuration,
          suggestion: 'Consider caching, query optimization, or pagination',
          impact: 'Medium - background processing',
        });
      }

      // Check for high error rate
      if (stats.errorRate > 5) {
        suggestions.push({
          severity: 'WARNING',
          endpoint,
          issue: `High error rate: ${stats.errorRate}%`,
          suggestion: 'Review error logs and add input validation',
          impact: 'Medium - reliability concern',
        });
      }
    }

    return suggestions;
  }

  /**
   * Group requests by endpoint
   * @private
   */
  groupByEndpoint(requests) {
    const stats = {};

    requests.forEach((req) => {
      if (!stats[req.endpoint]) {
        stats[req.endpoint] = {
          count: 0,
          totalTime: 0,
          avgDuration: 0,
          errors: 0,
          errorRate: 0,
        };
      }

      stats[req.endpoint].count++;
      stats[req.endpoint].totalTime += req.duration;
      stats[req.endpoint].errors += req.statusCode >= 400 ? 1 : 0;
    });

    // Calculate averages
    for (const endpoint in stats) {
      const s = stats[endpoint];
      s.avgDuration = Math.round(s.totalTime / s.count);
      s.errorRate = ((s.errors / s.count) * 100).toFixed(2);
    }

    return stats;
  }

  /**
   * Get caching recommendations
   * @param {Array} requests - Request metrics
   * @returns {Array} Caching suggestions
   */
  getCachingRecommendations(requests) {
    const recommendations = [];
    const endpointCounts = {};

    // Count GET requests per endpoint
    requests
      .filter((r) => r.method === 'GET')
      .forEach((r) => {
        endpointCounts[r.endpoint] = (endpointCounts[r.endpoint] || 0) + 1;
      });

    // Recommend caching for frequently accessed endpoints
    for (const [endpoint, count] of Object.entries(endpointCounts)) {
      if (count > 100) {
        recommendations.push({
          endpoint,
          requestCount: count,
          recommendation: 'High-frequency GET endpoint - implement aggressive caching (5 min TTL)',
          ttl: 300,
        });
      } else if (count > 50) {
        recommendations.push({
          endpoint,
          requestCount: count,
          recommendation: 'Medium-frequency GET endpoint - implement moderate caching (10 min TTL)',
          ttl: 600,
        });
      }
    }

    return recommendations;
  }

  /**
   * Get query optimization recommendations
   * @param {Array} slowQueries - Slow query logs
   * @returns {Array} Optimization suggestions
   */
  getQueryOptimizations(slowQueries) {
    return slowQueries.map((query) => ({
      query: query.substring(0, 100),
      duration: query.duration,
      suggestions: [
        'Add database index on filtered columns',
        'Use EXPLAIN ANALYZE to identify bottleneck',
        'Consider query rewrite or normalization',
        'Implement pagination for large result sets',
      ],
    }));
  }

  /**
   * Generate optimization report
   * @param {Object} performanceMetrics - Metrics object
   * @returns {Object} Comprehensive report
   */
  generateReport(performanceMetrics) {
    const requests = performanceMetrics.requests || [];
    const analysis = this.analyzePerformance(requests);
    const cachingRecs = this.getCachingRecommendations(requests);

    return {
      timestamp: new Date().toISOString(),
      totalRequests: requests.length,
      performance: {
        avgResponseTime: performanceMetrics.averageResponseTime,
        slowRequests: requests.filter((r) => r.duration > this.slowThreshold).length,
        errorRate: performanceMetrics.errorRate,
      },
      issues: analysis.filter((s) => s.severity === 'CRITICAL'),
      warnings: analysis.filter((s) => s.severity === 'WARNING'),
      cachingOpportunities: cachingRecs,
      recommendations: {
        immediate: 'Address CRITICAL issues',
        shortTerm: 'Implement caching recommendations',
        longTerm: 'Plan database optimization',
      },
    };
  }
}

module.exports = new PerformanceOptimizer();
