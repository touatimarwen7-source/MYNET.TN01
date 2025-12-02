const db = require('../config/db');

class HealthMonitoringService {
  constructor() {
    this.metrics = {
      requests: [],
      errors: [],
      latencies: [],
    };
  }

  /**
   * Record API request metrics including latency and response code
   * @param {string} method - HTTP method (GET, POST, etc)
   * @param {string} path - API endpoint path
   * @param {number} statusCode - HTTP response status code
   * @param {number} latency - Request latency in milliseconds
   * @returns {void}
   */
  recordRequest(method, path, statusCode, latency) {
    const record = {
      timestamp: new Date(),
      method,
      path,
      statusCode,
      latency,
      success: statusCode >= 200 && statusCode < 300,
    };
    this.metrics.requests.push(record);
    if (statusCode >= 400) this.metrics.errors.push(record);
    this.metrics.latencies.push(latency);

    // Keep only 1000 most recent records
    if (this.metrics.requests.length > 1000) {
      this.metrics.requests.shift();
    }
  }

  /**
   * Get health statistics for last hour
   * Calculates success rate, average latency, and overall status
   * @returns {Object} Health metrics object
   * @returns {string} result.status - Health status (healthy, degraded, critical)
   * @returns {number} result.successRate - Success rate percentage (0-100)
   * @returns {number} result.avgLatency - Average latency in milliseconds
   * @returns {number} result.totalRequests - Total requests in last hour
   * @returns {number} result.totalErrors - Total errors in last hour
   * @returns {Date} result.timestamp - Timestamp of health check
   */
  getHealthStats() {
    const now = new Date();
    const oneHourAgo = new Date(now - 60 * 60 * 1000);

    const recentRequests = this.metrics.requests.filter((r) => r.timestamp > oneHourAgo);
    const recentErrors = this.metrics.errors.filter((r) => r.timestamp > oneHourAgo);

    const successRate =
      recentRequests.length > 0
        ? (((recentRequests.length - recentErrors.length) / recentRequests.length) * 100).toFixed(2)
        : 100;

    const avgLatency =
      recentRequests.length > 0
        ? (recentRequests.reduce((sum, r) => sum + r.latency, 0) / recentRequests.length).toFixed(0)
        : 0;

    return {
      status: successRate >= 99 ? 'healthy' : successRate >= 95 ? 'degraded' : 'critical',
      successRate: parseFloat(successRate),
      avgLatency: parseInt(avgLatency),
      totalRequests: recentRequests.length,
      totalErrors: recentErrors.length,
      timestamp: now,
    };
  }

  /**
   * Get performance metrics broken down by API path
   * @returns {Array} Array of path metrics with call counts and success rates
   */
  getPathStats() {
    const pathMetrics = {};

    this.metrics.requests.forEach((req) => {
      if (!pathMetrics[req.path]) {
        pathMetrics[req.path] = {
          path: req.path,
          method: req.method,
          calls: 0,
          errors: 0,
          avgLatency: 0,
          successRate: 100,
        };
      }
      pathMetrics[req.path].calls++;
      if (!req.success) pathMetrics[req.path].errors++;
    });

    return Object.values(pathMetrics).map((metric) => ({
      ...metric,
      successRate:
        metric.calls > 0 ? (((metric.calls - metric.errors) / metric.calls) * 100).toFixed(2) : 100,
    }));
  }

  /**
   * Check critical API paths for performance issues
   * Alerts if latency > 1000ms or success rate < 95%
   * @returns {Array} Array of alerts for critical issues
   */
  checkCriticalPaths() {
    const criticalPaths = [
      '/api/auth/login',
      '/api/auth/register',
      '/api/auth/refresh',
      '/api/procurement/submit-bid',
      '/api/procurement/create-tender',
    ];

    const alerts = [];
    const pathStats = this.getPathStats();

    pathStats.forEach((stat) => {
      if (criticalPaths.includes(stat.path)) {
        if (stat.avgLatency > 1000) {
          alerts.push({
            severity: 'critical',
            path: stat.path,
            message: `Latency exceeded 1000ms: ${stat.avgLatency}ms`,
            timestamp: new Date(),
          });
        }
        if (parseFloat(stat.successRate) < 95) {
          alerts.push({
            severity: 'high',
            path: stat.path,
            message: `Success rate below 95%: ${stat.successRate}%`,
            timestamp: new Date(),
          });
        }
      }
    });

    return alerts;
  }
}

module.exports = new HealthMonitoringService();
