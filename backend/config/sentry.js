/**
 * Sentry Configuration for Backend
 * Provides error tracking, performance monitoring, and session replay
 */

const Sentry = require('@sentry/node');
const { nodeProfilingIntegration } = require('@sentry/profiling-node');

/**
 * Initialize Sentry for error tracking and performance monitoring
 * @param {Express} app - Express application instance
 * @returns {void}
 */
function initializeSentry(app) {
  const environment = process.env.NODE_ENV || 'development';
  const sentryDSN = process.env.SENTRY_DSN || '';

  // Only initialize if DSN is provided
  if (!sentryDSN) {
    return;
  }

  Sentry.init({
    dsn: sentryDSN,
    environment: environment,
    tracesSampleRate: environment === 'production' ? 0.1 : 1.0, // 10% in prod, 100% in dev
    profilesSampleRate: environment === 'production' ? 0.1 : 1.0,
    maxBreadcrumbs: 50,
    integrations: [
      new Sentry.Integrations.Http({ tracing: true }),
      nodeProfilingIntegration(),
      new Sentry.Integrations.OnUncaughtException(),
      new Sentry.Integrations.OnUnhandledRejection(),
    ],
    beforeSend(event) {
      // Filter out known non-critical errors
      if (event.exception) {
        const error = event.exception.values?.[0]?.value;
        if (error?.includes('ECONNREFUSED') || error?.includes('timeout')) {
          return null; // Don't send connection errors
        }
      }
      return event;
    },
  });

  // Attach Sentry request handler (must be first middleware)
  app.use(Sentry.Handlers.requestHandler());
  app.use(Sentry.Handlers.tracingHandler());

  // Attach Sentry error handler (must be last middleware)
  app.use(Sentry.Handlers.errorHandler());
}

/**
 * Capture exception with context
 * @param {Error} error - Error object
 * @param {Object} context - Additional context
 * @returns {void}
 */
function captureException(error, context = {}) {
  Sentry.captureException(error, {
    tags: {
      component: context.component || 'unknown',
      userId: context.userId,
      tenderId: context.tenderId,
    },
    extra: context,
  });
}

/**
 * Capture message for tracking events
 * @param {string} message - Message to track
 * @param {string} level - Severity level (info, warning, error)
 * @param {Object} context - Additional context
 * @returns {void}
 */
function captureMessage(message, level = 'info', context = {}) {
  Sentry.captureMessage(message, level);
  if (Object.keys(context).length > 0) {
    Sentry.setContext('custom', context);
  }
}

/**
 * Add breadcrumb for debugging
 * @param {string} message - Breadcrumb message
 * @param {string} category - Breadcrumb category
 * @param {string} level - Severity level
 * @returns {void}
 */
function addBreadcrumb(message, category = 'info', level = 'info') {
  Sentry.addBreadcrumb({
    message,
    category,
    level,
    timestamp: Date.now() / 1000,
  });
}

/**
 * Set user context for error tracking
 * @param {string} userId - User ID
 * @param {Object} userInfo - Additional user info
 * @returns {void}
 */
function setUserContext(userId, userInfo = {}) {
  Sentry.setUser({
    id: userId,
    ...userInfo,
  });
}

/**
 * Clear user context (on logout)
 * @returns {void}
 */
function clearUserContext() {
  Sentry.setUser(null);
}

module.exports = {
  Sentry,
  initializeSentry,
  captureException,
  captureMessage,
  addBreadcrumb,
  setUserContext,
  clearUserContext,
};
