import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import React from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Alert,
  CircularProgress,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  Avatar,
  Stack,
  Paper,
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  Star as StarIcon,
  Assignment as AssignmentIcon,
  LocalShipping as LocalShippingIcon,
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  LocalOffer as LocalOfferIcon,
  Assessment as AssessmentIcon,
  Settings as SettingsIcon,
  Person as PersonIcon,
  Inventory as InventoryIcon,
  Gavel as GavelIcon,
} from '@mui/icons-material';
import { procurementAPI } from '../api/procurementApi';
import { useAuth } from '../contexts/AppContext';
import institutionalTheme from '../theme/theme';
import { setPageTitle } from '../utils/pageTitle';

const DRAWER_WIDTH = 240;

export default function SupplierDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [stats, setStats] = useState({
    totalOffers: 0,
    acceptedOffers: 0,
    avgOfferValue: 0,
    activeOrders: 0,
  });

  const [analytics, setAnalytics] = useState({
    totalReviews: 0,
    avgRating: '0.0',
    recentOrders: [],
  });

  const [recentTenders, setRecentTenders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  // Extract user ID safely
  const userId = React.useMemo(() => {
    if (!user) return null;
    return user.userId || user.id || user.user_id;
  }, [user]);

  const fetchDashboardData = useCallback(async (retryCount = 0) => {
    if (!userId) {
      console.warn('⚠️ No userId available, skipping dashboard fetch');
      setLoading(false);
      setError('معرف المستخدم غير متوفر. الرجاء تسجيل الدخول مرة أخرى.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log('📊 Fetching dashboard data for supplier:', userId);

      const [statsRes, analyticsRes, tendersRes] = await Promise.allSettled([
        procurementAPI.supplier.getDashboardStats(),
        procurementAPI.supplier.getAnalytics(),
        procurementAPI.getTenders({
          page: 1,
          limit: 5,
          is_public: true
        })
      ]);

      // Handle stats response
      if (statsRes.status === 'fulfilled' && statsRes.value?.data) {
        setStats({
          totalOffers: parseInt(statsRes.value.data.totalOffers) || 0,
          acceptedOffers: parseInt(statsRes.value.data.acceptedOffers) || 0,
          avgOfferValue: parseInt(statsRes.value.data.avgOfferValue) || 0,
          activeOrders: parseInt(statsRes.value.data.activeOrders) || 0,
        });
      } else if (statsRes.status === 'rejected') {
        console.warn('فشل تحميل الإحصائيات:', statsRes.reason);
        setStats({
          totalOffers: 0,
          acceptedOffers: 0,
          avgOfferValue: 0,
          activeOrders: 0,
        });
      }

      // Handle analytics response
      if (analyticsRes.status === 'fulfilled' && analyticsRes.value?.data?.analytics) {
        console.log('Analytics loaded successfully:', analyticsRes.value.data.analytics);
        setAnalytics({
          totalReviews: analyticsRes.value.data.analytics.totalReviews || 0,
          avgRating: String(analyticsRes.value.data.analytics.avgRating || '0.0'),
          recentOrders: analyticsRes.value.data.analytics.recentOrders || [],
        });
      } else if (analyticsRes.status === 'rejected') {
        console.warn('فشل تحميل التحليلات:', analyticsRes.reason);
        setAnalytics({
          totalReviews: 0,
          avgRating: '0.0',
          recentOrders: [],
        });
      }

      // Handle tenders response
      if (tendersRes.status === 'fulfilled' && tendersRes.value?.data?.tenders) {
        setRecentTenders(tendersRes.value.data.tenders);
      } else if (tendersRes.status === 'rejected') {
        console.warn('فشل تحميل المناقصات:', tendersRes.reason);
        setRecentTenders([]);
      }

      // Only show error if ALL requests failed
      if (statsRes.status === 'rejected' && analyticsRes.status === 'rejected' && tendersRes.status === 'rejected') {
        const errorMsg = statsRes.reason?.response?.data?.error ||
                        statsRes.reason?.message ||
                        'Impossible de charger les données du tableau de bord';
        setError(errorMsg);
      }

    } catch (err) {
      console.error('❌ Dashboard data fetch error:', err);

      // Retry logic for network errors - improved
      const isRetryable = err.code === 'ECONNABORTED' ||
                          err.code === 'ERR_NETWORK' ||
                          err.message.includes('Network Error') ||
                          !err.response;

      if (retryCount < 2 && isRetryable) {
        console.log(`⚠️ Retrying... (${retryCount + 1}/2)`);
        setTimeout(() => fetchDashboardData(retryCount + 1), 1000 * (retryCount + 1));
        return;
      }

      // Set user-friendly error messages
      let errorMsg = 'Erreur de chargement des données';
      if (err.response?.status === 401) {
        errorMsg = 'Session expirée. Veuillez vous reconnecter.';
        // Optionally redirect to login
        setTimeout(() => navigate('/login'), 2000);
      } else if (err.response?.status === 403) {
        errorMsg = 'Accès refusé. Permissions insuffisantes.';
      } else if (err.response?.status === 503) {
        errorMsg = 'Service temporairement indisponible.';
      } else if (err.code === 'ECONNABORTED') {
        errorMsg = 'Délai d\'attente dépassé. Vérifiez votre connexion.';
      } else if (err.code === 'ERR_NETWORK') {
        errorMsg = 'Erreur réseau. Vérifiez votre connexion internet.';
      } else if (err.response?.data?.error) {
        errorMsg = err.response.data.error;
      }

      setError(errorMsg);

      // Set default values
      setStats({
        totalOffers: 0,
        acceptedOffers: 0,
        avgOfferValue: 0,
        activeOrders: 0,
      });
      setAnalytics({
        totalReviews: 0,
        avgRating: '0.0',
        recentOrders: [],
      });
      setRecentTenders([]);
    } finally {
      setLoading(false);
    }
  }, [userId, navigate]); // Added navigate dependency

  useEffect(() => {
    setPageTitle('Tableau de Bord Fournisseur');

    // Only fetch if user is authenticated and has an ID
    if (!user) {
      setLoading(false);
      return;
    }

    const id = user.id || user.userId;
    if (!id) {
      console.warn('⚠️ User object exists but no ID found');
      setError('Identifiant utilisateur manquant. Veuillez vous reconnecter.');
      setLoading(false); // Ensure loading is set to false if no ID
      return;
    }

    if (import.meta.env.DEV) {
      console.log('📊 Fetching dashboard data for supplier:', id);
    }

    fetchDashboardData();
  }, [user, fetchDashboardData]);

  const handleRefresh = () => {