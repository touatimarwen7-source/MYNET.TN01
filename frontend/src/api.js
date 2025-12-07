/**
 * API Central Export
 * Re-exports all API functions from api/index.js
 */
export * from './api/index.js';

// For backward compatibility
import apiClient from './services/axiosConfig';
export default apiClient;