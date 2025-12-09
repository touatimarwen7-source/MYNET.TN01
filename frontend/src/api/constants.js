
// API Base URL - Replit Environment Configuration
const API_BASE_URL = (() => {
  // في بيئة المتصفح (Replit Webview)
  if (typeof window !== 'undefined') {
    // استخدام نفس protocol و hostname للـ Frontend والـ Backend
    const protocol = window.location.protocol; // http: أو https:
    const hostname = window.location.hostname; // العنوان الفعلي من Replit
    
    // إنشاء URL للـ Backend API
    const backendUrl = `${protocol}//${hostname}:3000/api`;
    
    console.log('✅ Backend URL configured:', backendUrl);
    return backendUrl;
  }
  
  // Fallback (لن يستخدم في المتصفح)
  return 'http://localhost:3000/api';
})();

export { API_BASE_URL };
