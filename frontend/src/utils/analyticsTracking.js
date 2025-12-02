/**
 * Frontend Analytics Tracking
 * Tracks user interactions, page views, feature usage, and errors
 */

// Lazy load Sentry to handle optional dependency
let Sentry = null;
try {
  Sentry = require('@sentry/react');
} catch (e) {
  console.warn('⚠️ Sentry not available for analytics');
}

class FrontendAnalyticsTracker {
  constructor() {
    this.events = [];
    this.sessionId = this.generateSessionId();
    this.userId = null;
  }

  /**
   * Generate unique session ID
   * @returns {string}
   */
  generateSessionId() {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Initialize analytics
   * @param {string} userId - User ID
   * @returns {void}
   */
  init(userId) {
    this.userId = userId;
    this.trackPageView(window.location.pathname);
  }

  /**
   * Track page view
   * @param {string} page - Page path
   * @param {Object} metadata - Page metadata
   * @returns {void}
   */
  trackPageView(page, metadata = {}) {
    this.trackEvent('page_view', {
      page,
      ...metadata,
    });
  }

  /**
   * Track button click
   * @param {string} buttonName - Button identifier
   * @param {Object} metadata - Click metadata
   * @returns {void}
   */
  trackButtonClick(buttonName, metadata = {}) {
    this.trackEvent('button_click', {
      button: buttonName,
      ...metadata,
    });
  }

  /**
   * Track form submission
   * @param {string} formName - Form identifier
   * @param {Object} metadata - Form metadata
   * @returns {void}
   */
  trackFormSubmission(formName, metadata = {}) {
    this.trackEvent('form_submission', {
      form: formName,
      ...metadata,
    });
  }

  /**
   * Track tender interaction
   * @param {string} action - Action name (view, filter, sort)
   * @param {string} tenderId - Tender ID
   * @param {Object} metadata - Interaction metadata
   * @returns {void}
   */
  trackTenderInteraction(action, tenderId, metadata = {}) {
    this.trackEvent('tender_interaction', {
      action,
      tenderId,
      ...metadata,
    });
  }

  /**
   * Track offer action
   * @param {string} action - Action name (create, submit, view)
   * @param {string} offerId - Offer ID
   * @param {Object} metadata - Action metadata
   * @returns {void}
   */
  trackOfferAction(action, offerId, metadata = {}) {
    this.trackEvent('offer_action', {
      action,
      offerId,
      ...metadata,
    });
  }

  /**
   * Track feature usage
   * @param {string} featureName - Feature name
   * @param {Object} metadata - Usage metadata
   * @returns {void}
   */
  trackFeatureUsage(featureName, metadata = {}) {
    this.trackEvent('feature_usage', {
      feature: featureName,
      ...metadata,
    });
  }

  /**
   * Track error from UI
   * @param {string} errorType - Error type
   * @param {string} errorMessage - Error message
   * @param {Object} context - Error context
   * @returns {void}
   */
  trackError(errorType, errorMessage, context = {}) {
    this.trackEvent('ui_error', {
      errorType,
      errorMessage,
      ...context,
    });

    // Also report to Sentry if available
    if (Sentry?.captureMessage) {
      Sentry.captureMessage(`UI Error: ${errorType} - ${errorMessage}`, 'error');
    }
  }

  /**
   * Track search action
   * @param {string} query - Search query
   * @param {number} resultCount - Number of results
   * @param {Object} filters - Applied filters
   * @returns {void}
   */
  trackSearch(query, resultCount, filters = {}) {
    this.trackEvent('search', {
      query,
      resultCount,
      filters,
    });
  }

  /**
   * Track generic event
   * @param {string} eventName - Event name
   * @param {Object} metadata - Event metadata
   * @returns {void}
   */
  trackEvent(eventName, metadata = {}) {
    const event = {
      name: eventName,
      sessionId: this.sessionId,
      userId: this.userId,
      metadata,
      timestamp: new Date().toISOString(),
      url: window.location.pathname,
    };

    this.events.push(event);

    // Add breadcrumb to Sentry if available
    if (Sentry?.addBreadcrumb) {
      Sentry.addBreadcrumb({
        message: eventName,
        category: 'user-action',
        level: 'info',
        data: metadata,
      });
    }

    // Keep last 50 events
    if (this.events.length > 50) {
      this.events = this.events.slice(-50);
    }

    // Send to backend analytics
    this.sendAnalytics(event);
  }

  /**
   * Send event to backend
   * @param {Object} event - Event object
   * @returns {void}
   */
  sendAnalytics(event) {
    // Queue event for batching (send every 10 events or 30 seconds)
    try {
      fetch('/api/analytics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(event),
      }).catch((err) => {
        console.warn('Failed to send analytics:', err);
      });
    } catch (error) {
      console.warn('Analytics tracking error:', error);
    }
  }

  /**
   * Get session info
   * @returns {Object}
   */
  getSessionInfo() {
    return {
      sessionId: this.sessionId,
      userId: this.userId,
      eventsCount: this.events.length,
      startTime: new Date(),
    };
  }

  /**
   * Clear events
   * @returns {void}
   */
  clear() {
    this.events = [];
  }
}

export default new FrontendAnalyticsTracker();
