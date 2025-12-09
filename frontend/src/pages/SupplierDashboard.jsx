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

  // Define fetchDashboardData before using it in useEffect
  const fetchDashboardData = useCallback(async (retryCount = 0) => {
    if (!userId) {
      console.warn('⚠️ No userId available, skipping dashboard fetch');
      setLoading(false);
      setError('معرف المستخدم غير متوفر. الرجاء تسجيل الدخول مرة أخرى.');
      return;
    }

    // Prevent multiple simultaneous fetches
    if (loading && retryCount === 0) {
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
      setLoading(false);
      return;
    }

    if (import.meta.env.DEV) {
      console.log('📊 Fetching dashboard data for supplier:', id);
    }

    fetchDashboardData();
  }, [user, fetchDashboardData]);

  const handleRefresh = () => {
    fetchDashboardData();
  };

  const menuItems = [
    { icon: <DashboardIcon />, text: 'Tableau de Bord', path: '/supplier-dashboard' },
    { icon: <LocalOfferIcon />, text: 'Mes Offres', path: '/my-offers' },
    { icon: <GavelIcon />, text: 'Appels d\'Offres', path: '/tenders' },
    { icon: <InventoryIcon />, text: 'Catalogue', path: '/supplier-catalog' },
    { icon: <AssessmentIcon />, text: 'Analytiques', path: '/supplier-analytics' },
    { icon: <SettingsIcon />, text: 'Paramètres', path: '/account-settings' },
  ];

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      <Drawer
        variant="temporary"
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        sx={{
          width: DRAWER_WIDTH,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: DRAWER_WIDTH,
            boxSizing: 'border-box',
            backgroundColor: institutionalTheme.palette.primary.main,
            color: 'white',
          },
        }}
      >
        <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
          <Avatar sx={{ bgcolor: 'white', color: institutionalTheme.palette.primary.main }}>
            <PersonIcon />
          </Avatar>
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              {user?.companyName || user?.username || 'Fournisseur'}
            </Typography>
            <Typography variant="caption">Fournisseur</Typography>
          </Box>
        </Box>
        <List>
          {menuItems.map((item, index) => (
            <ListItemButton
              key={index}
              onClick={() => {
                navigate(item.path);
                setMenuOpen(false);
              }}
            >
              <ListItemIcon sx={{ color: 'white' }}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          ))}
        </List>
      </Drawer>

      <Box sx={{ flexGrow: 1 }}>
        <Paper
          elevation={0}
          sx={{
            p: 2,
            mb: 3,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: 'white',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton onClick={() => setMenuOpen(true)}>
              <MenuIcon />
            </IconButton>
            <Typography variant="h5" sx={{ fontWeight: 600 }}>
              Tableau de Bord Fournisseur
            </Typography>
          </Box>
          <Button
            variant="outlined"
            startIcon={<AssessmentIcon />}
            onClick={handleRefresh}
            disabled={loading}
          >
            Actualiser
          </Button>
        </Paper>

        <Container maxWidth="xl">
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box>
                      <Typography variant="h4" sx={{ fontWeight: 700, color: institutionalTheme.palette.primary.main }}>
                        {stats.totalOffers}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Total Offres
                      </Typography>
                    </Box>
                    <AssignmentIcon sx={{ fontSize: 40, color: institutionalTheme.palette.primary.main, opacity: 0.3 }} />
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box>
                      <Typography variant="h4" sx={{ fontWeight: 700, color: '#2e7d32' }}>
                        {stats.acceptedOffers}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Offres Acceptées
                      </Typography>
                    </Box>
                    <TrendingUpIcon sx={{ fontSize: 40, color: '#2e7d32', opacity: 0.3 }} />
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box>
                      <Typography variant="h4" sx={{ fontWeight: 700, color: '#f57c00' }}>
                        {stats.avgOfferValue.toLocaleString()} DT
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Valeur Moyenne
                      </Typography>
                    </Box>
                    <StarIcon sx={{ fontSize: 40, color: '#f57c00', opacity: 0.3 }} />
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box>
                      <Typography variant="h4" sx={{ fontWeight: 700, color: '#1976d2' }}>
                        {stats.activeOrders}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Commandes Actives
                      </Typography>
                    </Box>
                    <LocalShippingIcon sx={{ fontSize: 40, color: '#1976d2', opacity: 0.3 }} />
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={8}>
              <Card>
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                    Appels d'Offres Récents
                  </Typography>
                  {recentTenders.length > 0 ? (
                    <Stack spacing={2}>
                      {recentTenders.map((tender) => (
                        <Paper
                          key={tender.id}
                          sx={{
                            p: 2,
                            cursor: 'pointer',
                            '&:hover': { backgroundColor: '#f5f5f5' },
                          }}
                          onClick={() => navigate(`/tenders/${tender.id}`)}
                        >
                          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                            {tender.title}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {tender.description}
                          </Typography>
                          <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
                            <Typography variant="caption">
                              Budget: {tender.budget?.toLocaleString()} DT
                            </Typography>
                            <Typography variant="caption">
                              Échéance: {new Date(tender.deadline).toLocaleDateString('fr-FR')}
                            </Typography>
                          </Box>
                        </Paper>
                      ))}
                    </Stack>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      Aucun appel d'offres récent
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                    Analytiques
                  </Typography>
                  <Stack spacing={2}>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Total Avis
                      </Typography>
                      <Typography variant="h6">{analytics.totalReviews}</Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Note Moyenne
                      </Typography>
                      <Typography variant="h6">{analytics.avgRating} / 5.0</Typography>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
}