import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import './i18n';
import App from './App.jsx';
import CSRFProtection from './utils/csrfProtection';
import TokenManager from './services/tokenManager';
import { initializeSentry } from './config/sentry';
import analyticsTracking from './utils/analyticsTracking';

// Initialize error tracking
initializeSentry();
console.log('✅ Frontend error tracking initialized');

// Initialize security features
CSRFProtection.initialize();

// Clean up expired tokens on app start
if (!TokenManager.isTokenValid()) {
  TokenManager.clearTokens();
}

// Initialize analytics
window.analytics = analyticsTracking;

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);
