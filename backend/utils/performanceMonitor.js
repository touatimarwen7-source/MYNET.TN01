/**
 * Performance Monitoring Utility
 * Tracks request duration, memory usage, and database query performance
 *
 * @module performanceMonitor
 * @example
 * const { trackRequest, getMetrics } = require('./performanceMonitor');
 *
 * // Track a request
 * const endTracking = trackRequest('GET /api/users');
 * // ... do work ...
 * endTracking({ statusCode: 200, method: 'GET' });
 *
 * // Get metrics
 * const metrics = getMetrics();
 */

class PerformanceMonitor {
  constructor() {
    this.metrics = {
      requests: [],
      averageResponseTime: 0,
      slowQueries: [],
      memoryUsage: [],
      errorRate: 0,
    };
    this.slowQueryThreshold = 1000; // 1 second
  }

  /**
   * Track a request from start to end
   * @param {string} endpoint - API endpoint name
   * @returns {Function} Function to call when request completes
   */
  trackRequest(endpoint) {
    const startTime = Date.now();
    const startMemory = process.memoryUsage().heapUsed / 1024 / 1024;

    return (options = {}) => {
      const endTime = Date.now();
      const duration = endTime - startTime;
      const endMemory = process.memoryUsage().heapUsed / 1024 / 1024;
      const memoryDelta = endMemory - startMemory;

      const requestMetric = {
        endpoint,
        duration,
        memoryDelta,
        statusCode: options.statusCode,
        method: options.method,
        timestamp: new Date().toISOString(),
        slow: duration > 100, // Mark as slow if > 100ms
      };

      this.metrics.requests.push(requestMetric);
      this.updateAverages();

      if (duration > 100) {
        // Log slow requests
        if (this.metrics.slowQueries.length < 50) {
          this.metrics.slowQueries.push({
            endpoint,
            duration,
            timestamp: requestMetric.timestamp,
          });
        }
      }
    };
  }

  /**
   * Record database query performance
   * @param {string} query - SQL query string
   * @param {number} duration - Query duration in ms
   */
  recordQuery(query, duration) {
    if (duration > this.slowQueryThreshold) {
      this.metrics.slowQueries.push({
        type: 'database',
        query: query.substring(0, 100),
        duration,
        timestamp: new Date().toISOString(),
      });
    }
  }

  /**
   * Update calculated metrics
   */
  updateAverages() {
    if (this.metrics.requests.length === 0) return;

    const totalDuration = this.metrics.requests.reduce((sum, req) => sum + req.duration, 0);
    this.metrics.averageResponseTime = Math.round(totalDuration / this.metrics.requests.length);

    const errorCount = this.metrics.requests.filter((req) => req.statusCode >= 400).length;
    this.metrics.errorRate = Math.round((errorCount / this.metrics.requests.length) * 100);
  }

  /**
   * Get current performance metrics
   * @returns {Object} Current metrics
   */
  getMetrics() {
    return {
      ...this.metrics,
      totalRequests: this.metrics.requests.length,
      averageResponseTime: this.metrics.averageResponseTime,
      slowRequestCount: this.metrics.requests.filter((r) => r.slow).length,
      errorRate: this.metrics.errorRate,
    };
  }

  /**
   * Get performance summary
   * @returns {Object} Summary report
   */
  getSummary() {
    const metrics = this.getMetrics();
    return {
      status: 'OK',
      totalRequests: metrics.totalRequests,
      averageResponseTime: `${metrics.averageResponseTime}ms`,
      slowRequests: metrics.slowRequestCount,
      errorRate: `${metrics.errorRate}%`,
      topSlowEndpoints: this.getTopSlowEndpoints(5),
      memoryUsage: `${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)}MB`,
    };
  }

  /**
   * Get top N slowest endpoints
   * @param {number} limit - Number of endpoints to return
   * @returns {Array} Top slow endpoints
   */
  getTopSlowEndpoints(limit = 5) {
    const endpointStats = {};

    this.metrics.requests.forEach((req) => {
      if (!endpointStats[req.endpoint]) {
        endpointStats[req.endpoint] = {
          count: 0,
          totalDuration: 0,
          avgDuration: 0,
        };
      }
      endpointStats[req.endpoint].count++;
      endpointStats[req.endpoint].totalDuration += req.duration;
      endpointStats[req.endpoint].avgDuration = Math.round(
        endpointStats[req.endpoint].totalDuration / endpointStats[req.endpoint].count
      );
    });

    return Object.entries(endpointStats)
      .map(([endpoint, stats]) => ({ endpoint, ...stats }))
      .sort((a, b) => b.avgDuration - a.avgDuration)
      .slice(0, limit);
  }

  /**
   * Clear all metrics
   */
  clearMetrics() {
    this.metrics = {
      requests: [],
      averageResponseTime: 0,
      slowQueries: [],
      memoryUsage: [],
      errorRate: 0,
    };
  }
}

module.exports = new PerformanceMonitor();
