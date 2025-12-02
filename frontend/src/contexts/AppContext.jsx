import {
  createContext,
  useState,
  useCallback,
  useContext,
  useEffect,
} from 'react';
import TokenManager from '../services/tokenManager';
import { useToastContext } from './ToastContext';
import { setupInactivityTimer } from '../utils/security';

/**
 * 🎯 APP CONTEXT
 * Centralized global state management for the entire application
 * Handles: User authentication, app loading, notifications, app settings
 */

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // ===== Authentication State =====
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  // ===== App State =====
  const [appLoading, setAppLoading] = useState(false);
  const [appError, setAppError] = useState(null);
  const { addToast } = useToastContext();

  // ===== App Settings =====
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [appSettings, setAppSettings] = useState({
    language: 'ar',
    theme: 'light',
    notifications: true,
  });

  // ===== Authentication Methods =====

  /**
   * Check authentication status on app load
   */
  const checkAuth = useCallback(async () => {
    setAuthLoading(true);
    setAuthError(null);
    try {
      // Restore tokens from storage
      TokenManager.restoreFromStorage();

      const token = TokenManager.getAccessToken();

      if (token) {
        const userData = TokenManager.getUserFromToken();

        if (userData && userData.userId) {
          setUser(userData);
          setIsAuthenticated(true);
        } else {
          TokenManager.clearTokens();
          setUser(null);
          setIsAuthenticated(false);
        }
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      setAuthError(error.message);
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setAuthLoading(false);
    }
  }, []);

  /**
   * Handle user login
   */
  const login = useCallback((userData) => {
    try {
      TokenManager.setUserData(userData);
      setUser(userData);
      setIsAuthenticated(true);
      setAuthError(null);
      addToast('تم تسجيل الدخول بنجاح', 'success');
      return true;
    } catch (error) {
      setAuthError(error.message);
      addToast('خطأ في تسجيل الدخول', 'error');
      return false;
    }
  }, []);

  /**
   * Handle user logout
   */
  const logout = useCallback(() => {
    try {
      TokenManager.clearTokens();
      setUser(null);
      setIsAuthenticated(false);
      setAuthError(null);
      addToast('تم تسجيل الخروج بنجاح', 'success');
      return true;
    } catch (error) {
      setAuthError(error.message);
      return false;
    }
  }, []);

  /**
   * Update user profile
   */
  const updateUser = useCallback(
    (updatedData) => {
      try {
        const newUserData = { ...user, ...updatedData };
        TokenManager.setUserData(newUserData);
        setUser(newUserData);
        return true;
      } catch (error) {
        setAuthError(error.message);
        return false;
      }
    },
    [user]
  );

  // ===== Settings Methods =====

  /**
   * Toggle sidebar visibility
   */
  const toggleSidebar = useCallback(() => {
    setSidebarOpen((prev) => !prev);
  }, []);

  /**
   * Update app settings
   */
  const updateSettings = useCallback((newSettings) => {
    setAppSettings((prev) => ({ ...prev, ...newSettings }));
  }, []);

  /**
   * Change language
   */
  const setLanguage = useCallback((language) => {
    updateSettings({ language });
  }, []);

  /**
   * Change theme
   */
  const setTheme = useCallback((theme) => {
    updateSettings({ theme });
  }, []);

  // ===== App State Methods =====

  /**
   * Set global loading state
   */
  const setLoading = useCallback((loading) => {
    setAppLoading(loading);
  }, []);

  /**
   * Set global error state
   */
  const setError = useCallback((error) => {
    setAppError(error);
    if (error) {
      addToast(error, 'error');
    }
  }, []);

  /**
   * Clear global error
   */
  const clearError = useCallback(() => {
    setAppError(null);
  }, []);

  // ===== Initialization Effects =====

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (!isAuthenticated || !user) return;

    // Set up inactivity timer (3 hours default)
    // The timeout is reset on user activity (mousemove, click, keypress)
    const cleanup = setupInactivityTimer();
    return cleanup;
  }, [isAuthenticated, user]);

  // ===== Listen for auth changes from other tabs =====

  useEffect(() => {
    const handleAuthChange = (event) => {
      if (event.detail) {
        login(event.detail);
      } else {
        checkAuth();
      }
    };

    window.addEventListener('authChanged', handleAuthChange);
    return () => window.removeEventListener('authChanged', handleAuthChange);
  }, [login, checkAuth]);

  // ===== Context Value =====

  const value = {
    // Authentication State
    user,
    isAuthenticated,
    authLoading,
    authError,

    // App State
    appLoading,
    appError,

    // App Settings
    sidebarOpen,
    appSettings,

    // Auth Methods
    login,
    logout,
    updateUser,
    checkAuth,

    // Settings Methods
    toggleSidebar,
    updateSettings,
    setLanguage,
    setTheme,

    // App State Methods
    setLoading,
    setError,
    clearError,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

/**
 * 🪝 useApp Hook
 * Access global app state from any component
 */
export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};

/**
 * 🪝 useAuth Hook
 * Access authentication state from any component
 */
export const useAuth = () => {
  const {
    user,
    isAuthenticated,
    authLoading,
    authError,
    login,
    logout,
    updateUser,
  } = useContext(AppContext);

  if (!AppContext) {
    throw new Error('useAuth must be used within AppProvider');
  }

  return {
    user,
    isAuthenticated,
    authLoading,
    authError,
    login,
    logout,
    updateUser,
  };
};
