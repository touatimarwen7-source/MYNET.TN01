
// API Base URL - دعم بيئات مختلفة
const getBackendUrl = () => {
  // 1. استخدام المتغير البيئي إذا كان موجوداً
  if (import.meta.env.VITE_BACKEND_URL) {
    return import.meta.env.VITE_BACKEND_URL;
  }

  // 2. في بيئة Replit، استخدم window.location
  if (typeof window !== 'undefined' && window.location.hostname.includes('replit')) {
    const protocol = window.location.protocol;
    const hostname = window.location.hostname;
    // استخدام نفس hostname للواجهة والخادم
    return `${protocol}//${hostname}:3000/api`;
  }

  // 3. في بيئة التطوير المحلية
  return 'http://localhost:3000/api';
};

const backendUrl = getBackendUrl();

console.log('✅ Axios configured with backend URL:', backendUrl);

export const API_BASE_URL = backendUrl;
