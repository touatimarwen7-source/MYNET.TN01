
import axios from './services/axiosConfig';

// Import all API modules
import { authAPI } from './api/authApi';
import { procurementAPI } from './api/procurementApi';
import { adminAPI } from './api/adminApi';
import { searchAPI } from './api/searchApi';

// Export all APIs
export { authAPI, procurementAPI, adminAPI, searchAPI };

// Default export for backward compatibility
export default {
  auth: authAPI,
  procurement: procurementAPI,
  admin: adminAPI,
  search: searchAPI,
};
