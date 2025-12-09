
// API Base URL - دعم بيئة Replit
const getBackendUrl = () => {
  // في بيئة Replit، استخدم نفس الـ hostname للواجهة والخادم
  if (typeof window !== 'undefined') {
    const protocol = window.location.protocol;
    const hostname = window.location.hostname;
    
    // استخدام نفس hostname مع port 3000 للـ backend
    return `${protocol}//${hostname}:3000/api`;
  }
  
  // Fallback (لن يحدث عادة في المتصفح)
  return 'http://localhost:3000/api';
};

export const API_BASE_URL = getBackendUrl();

console.log('✅ Axios configured with direct backend URL:', API_BASE_URL);
