/**
 * Performance Monitoring Utility
 * Tracks API response times, database queries, and system metrics
 */

const { performance } = require('perf_hooks');
const { Sentry } = require('../config/sentry');

class PerformanceMonitor {
  constructor() {
    this.metrics = [];
    this.slowQueryThreshold = 1000; // ms
    this.slowApiThreshold = 5000; // ms
  }

  /**
   * Start performance measurement
   * @param {string} label - Operation label
   * @returns {Function} End function
   */
  startMeasure(label) {
    const startTime = performance.now();
    const id = `${label}_${Date.now()}`;

    return () => {
      const endTime = performance.now();
      const duration = endTime - startTime;

      this.recordMetric({
        label,
        duration,
        timestamp: new Date(),
      });

      return duration;
    };
  }

  /**
   * Record API performance metric
   * @param {string} method - HTTP method
   * @param {string} route - API route
   * @param {number} duration - Duration in ms
   * @param {number} statusCode - HTTP status code
   * @returns {void}
   */
  recordApiMetric(method, route, duration, statusCode) {
    const isSlow = duration > this.slowApiThreshold;

    this.recordMetric({
      type: 'api',
      method,
      route,
      duration,
      statusCode,
      slow: isSlow,
    });

    // Report slow APIs
    if (isSlow) {
      Sentry?.captureMessage(`Slow API: ${method} ${route} took ${duration}ms`, 'warning');
    }
  }

  /**
   * Record database query performance
   * @param {string} query - SQL query
   * @param {number} duration - Duration in ms
   * @param {boolean} error - Query had an error
   * @returns {void}
   */
  recordDatabaseMetric(query, duration, error = false) {
    const isSlow = duration > this.slowQueryThreshold;

    this.recordMetric({
      type: 'database',
      query: query.substring(0, 100), // Truncate for privacy
      duration,
      slow: isSlow,
      error,
    });

    // Report slow queries
    if (isSlow) {
      Sentry?.captureMessage(
        `Slow Query: ${duration}ms for ${query.substring(0, 50)}...`,
        'warning'
      );
    }
  }

  /**
   * Record cache performance
   * @param {string} operation - 'hit' or 'miss'
   * @param {number} duration - Duration in ms
   * @param {string} key - Cache key
   * @returns {void}
   */
  recordCacheMetric(operation, duration, key) {
    this.recordMetric({
      type: 'cache',
      operation,
      duration,
      key: key.substring(0, 50),
    });
  }

  /**
   * Record generic metric
   * @param {Object} metric - Metric data
   * @returns {void}
   */
  recordMetric(metric) {
    this.metrics.push({
      ...metric,
      timestamp: Date.now(),
    });

    // Keep last 1000 metrics
    if (this.metrics.length > 1000) {
      this.metrics = this.metrics.slice(-1000);
    }
  }

  /**
   * Get performance statistics
   * @returns {Object} Performance stats
   */
  getStats() {
    const stats = {
      totalMetrics: this.metrics.length,
      averageResponseTime: 0,
      slowRequests: 0,
      errorRequests: 0,
    };

    if (this.metrics.length === 0) return stats;

    const durations = this.metrics.map((m) => m.duration).filter((d) => d > 0);
    stats.averageResponseTime = durations.reduce((a, b) => a + b, 0) / durations.length;
    stats.slowRequests = this.metrics.filter((m) => m.slow).length;
    stats.errorRequests = this.metrics.filter((m) => m.error).length;

    return stats;
  }

  /**
   * Clear metrics
   * @returns {void}
   */
  clearMetrics() {
    this.metrics = [];
  }
}

module.exports = new PerformanceMonitor();
