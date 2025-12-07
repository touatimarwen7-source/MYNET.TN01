import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import './index.css';
import './i18n';

import App from './App.jsx';
import { AppProvider } from './contexts/AppContext';
import { ToastProvider } from './contexts/ToastContext';

import CSRFProtection from './utils/csrfProtection';
import TokenManager from './services/tokenManager';
import { initializeSentry } from './config/sentry';
import analyticsTracking from './utils/analyticsTracking';

// Initialize error tracking (non-blocking)
try {
  initializeSentry();
} catch (error) {
  console.error('Failed to initialize Sentry:', error);
}

// Initialize security features
try {
  CSRFProtection.initialize();
} catch (error) {
  console.error('Failed to initialize CSRF protection:', error);
}

// ✅ Initialize token management on app load
try {
  const token = localStorage.getItem('auth_token');
  const userData = localStorage.getItem('user_data');

  if (token && userData) {
    TokenManager.manageTokens(token, null, JSON.parse(userData));
  } else {
    TokenManager.clearTokens();
  }
} catch (error) {
  console.error('Failed to manage tokens:', error);
  TokenManager.clearTokens();
}

// Initialize analytics
window.analytics = analyticsTracking;

// Render application
const root = createRoot(document.getElementById('root'));
root.render(
  <StrictMode>
    <AppProvider>
      <ToastProvider>
        <App />
      </ToastProvider>
    </AppProvider>
  </StrictMode>
);