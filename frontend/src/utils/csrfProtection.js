/**
 * CSRF Protection Utilities
 * Manages CSRF tokens and validation
 */

const CSRF_TOKEN_KEY = 'csrf-token';
const CSRF_HEADER_NAME = 'X-CSRF-Token';

class CSRFProtection {
  /**
   * Generate a CSRF token
   * Creates a random token that gets sent with requests
   * @returns {string} Generated CSRF token
   */
  static generateToken() {
    // Create random token (UUID v4 format)
    const token = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
    sessionStorage.setItem(CSRF_TOKEN_KEY, token);
    this.updateMetaTag(token);
    return token;
  }

  /**
   * Get CSRF token from storage or generate new one
   * @returns {string} CSRF token
   */
  static getToken() {
    let token = sessionStorage.getItem(CSRF_TOKEN_KEY);

    if (!token) {
      token = this.generateToken();
    }

    return token;
  }

  /**
   * Update meta tag with CSRF token
   * Allows backend to read token from HTML
   * @param {string} token - CSRF token
   */
  static updateMetaTag(token) {
    let metaTag = document.querySelector('meta[name="csrf-token"]');

    if (!metaTag) {
      metaTag = document.createElement('meta');
      metaTag.setAttribute('name', 'csrf-token');
      document.head.appendChild(metaTag);
    }

    metaTag.setAttribute('content', token);
  }

  /**
   * Initialize CSRF protection
   * Call this on app startup
   */
  static initialize() {
    const token = this.getToken();
    this.updateMetaTag(token);
  }

  /**
   * Verify CSRF token
   * Check if token is valid (frontend-side validation)
   * Backend should do server-side validation
   * @param {string} responseToken - Token from server response
   * @returns {boolean} True if tokens match
   */
  static verifyToken(responseToken) {
    const localToken = this.getToken();
    return localToken === responseToken;
  }

  /**
   * Clear CSRF token (on logout)
   */
  static clearToken() {
    sessionStorage.removeItem(CSRF_TOKEN_KEY);
    const metaTag = document.querySelector('meta[name="csrf-token"]');
    if (metaTag) {
      metaTag.setAttribute('content', '');
    }
  }
}

export default CSRFProtection;
