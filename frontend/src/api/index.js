
/**
 * @fileoverview This file acts as a central export point for all API-related functions.
 * Instead of importing from individual api files like `../api/userApi`,
 * components can now import everything from the `../api` directory.
 *
 * @example
 * import { authAPI, procurementAPI } from '~/api';
 */

export * from './adminApi';
export * from './bidApi';
export * from './authApi';
export * from './companyProfileApi';
export * from './directSupplyApi';
export * from './notificationApi';
export * from './procurementApi';
export * from './searchApi';

// Export axios instance
import axiosInstance from '../services/axiosConfig';
export { axiosInstance as apiClient };
export default axiosInstance;
