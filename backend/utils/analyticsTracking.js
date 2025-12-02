/**
 * Analytics Tracking Utility
 * Tracks user actions, tender lifecycle, offer submissions, and system events
 */

const { getPool } = require('../config/db');
const { Sentry } = require('../config/sentry');

class AnalyticsTracker {
  constructor() {
    this.events = [];
    this.maxEventBuffer = 100;
  }

  /**
   * Track user action
   * @async
   * @param {string} userId - User ID
   * @param {string} action - Action name (login, logout, create_tender, etc)
   * @param {Object} metadata - Additional metadata
   * @returns {Promise<void>}
   */
  async trackUserAction(userId, action, metadata = {}) {
    const event = {
      type: 'user_action',
      userId,
      action,
      metadata,
      timestamp: new Date(),
    };

    this.bufferEvent(event);

    // Track in Sentry for debugging
    Sentry?.captureMessage(`User Action: ${action}`, 'info');
  }

  /**
   * Track tender event
   * @async
   * @param {string} tenderId - Tender ID
   * @param {string} event - Event name (created, published, awarded, etc)
   * @param {string} userId - User ID
   * @param {Object} metadata - Additional metadata
   * @returns {Promise<void>}
   */
  async trackTenderEvent(tenderId, event, userId, metadata = {}) {
    const trackingEvent = {
      type: 'tender_event',
      tenderId,
      event,
      userId,
      metadata,
      timestamp: new Date(),
    };

    this.bufferEvent(trackingEvent);
  }

  /**
   * Track offer submission
   * @async
   * @param {string} offerId - Offer ID
   * @param {string} tenderId - Tender ID
   * @param {string} supplierId - Supplier ID
   * @param {number} amount - Offer amount
   * @param {Object} metadata - Additional metadata
   * @returns {Promise<void>}
   */
  async trackOfferSubmission(offerId, tenderId, supplierId, amount, metadata = {}) {
    const event = {
      type: 'offer_submission',
      offerId,
      tenderId,
      supplierId,
      amount,
      metadata,
      timestamp: new Date(),
    };

    this.bufferEvent(event);

    Sentry?.captureMessage(`Offer submitted: ${offerId} for tender ${tenderId}`, 'info');
  }

  /**
   * Track API usage
   * @param {string} userId - User ID
   * @param {string} method - HTTP method
   * @param {string} endpoint - API endpoint
   * @param {number} responseTime - Response time in ms
   * @param {number} statusCode - HTTP status code
   * @returns {void}
   */
  trackApiUsage(userId, method, endpoint, responseTime, statusCode) {
    const event = {
      type: 'api_usage',
      userId,
      method,
      endpoint,
      responseTime,
      statusCode,
      timestamp: new Date(),
    };

    this.bufferEvent(event);
  }

  /**
   * Track error occurrence
   * @param {string} userId - User ID
   * @param {string} errorType - Error type
   * @param {string} errorMessage - Error message
   * @param {Object} context - Error context
   * @returns {void}
   */
  trackError(userId, errorType, errorMessage, context = {}) {
    const event = {
      type: 'error_occurrence',
      userId,
      errorType,
      errorMessage,
      context,
      timestamp: new Date(),
    };

    this.bufferEvent(event);

    Sentry?.captureMessage(`Error tracked: ${errorType} - ${errorMessage}`, 'error');
  }

  /**
   * Track feature usage
   * @param {string} userId - User ID
   * @param {string} featureName - Feature name
   * @param {Object} metadata - Usage metadata
   * @returns {void}
   */
  trackFeatureUsage(userId, featureName, metadata = {}) {
    const event = {
      type: 'feature_usage',
      userId,
      featureName,
      metadata,
      timestamp: new Date(),
    };

    this.bufferEvent(event);
  }

  /**
   * Buffer event for batch processing
   * @param {Object} event - Event object
   * @returns {void}
   */
  bufferEvent(event) {
    this.events.push(event);

    // Flush if buffer exceeds max
    if (this.events.length >= this.maxEventBuffer) {
      this.flush();
    }
  }

  /**
   * Flush buffered events to database
   * @async
   * @returns {Promise<void>}
   */
  async flush() {
    if (this.events.length === 0) return;

    try {
      const pool = getPool();

      // Insert events in batch
      const eventsToFlush = [...this.events];
      this.events = [];

      for (const event of eventsToFlush) {
        await pool.query(
          `INSERT INTO analytics_events 
           (type, user_id, event_data, created_at) 
           VALUES ($1, $2, $3, $4)`,
          [event.type, event.userId || null, JSON.stringify(event), event.timestamp]
        );
      }
    } catch (error) {
      Sentry?.captureException(error, { tags: { component: 'analytics' } });
    }
  }

  /**
   * Get event statistics
   * @returns {Object} Event stats
   */
  getStats() {
    const stats = {
      totalEvents: this.events.length,
      eventsByType: {},
    };

    this.events.forEach((event) => {
      stats.eventsByType[event.type] = (stats.eventsByType[event.type] || 0) + 1;
    });

    return stats;
  }

  /**
   * Clear buffered events
   * @returns {void}
   */
  clear() {
    this.events = [];
  }
}

module.exports = new AnalyticsTracker();
