
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Avatar,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  LinearProgress,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  Star as StarIcon,
  Assignment as AssignmentIcon,
  LocalShipping as LocalShippingIcon,
} from '@mui/icons-material';
import { procurementAPI } from '../api/procurementApi';
import { useApp } from '../contexts/AppContext';
import institutionalTheme from '../theme/theme';
import { setPageTitle } from '../utils/pageTitle';

const SupplierDashboard = () => {
  const navigate = useNavigate();
  const { user } = useApp();

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

  useEffect(() => {
    setPageTitle('Tableau de Bord Fournisseur');
    if (user?.role === 'supplier') {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [statsRes, analyticsRes, tendersRes] = await Promise.all([
        procurementAPI.supplier.getStats(),
        procurementAPI.supplier.getAnalytics(),
        procurementAPI.getTenders({ page: 1, limit: 5 }),
      ]);

      if (statsRes?.data) {
        setStats({
          totalOffers: statsRes.data.totalOffers || 0,
          acceptedOffers: statsRes.data.acceptedOffers || 0,
          avgOfferValue: statsRes.data.avgOfferValue || 0,
          activeOrders: statsRes.data.activeOrders || 0,
        });
      }

      if (analyticsRes?.data?.analytics) {
        setAnalytics({
          totalReviews: analyticsRes.data.analytics.totalReviews || 0,
          avgRating: String(analyticsRes.data.analytics.avgRating || '0.0'),
          recentOrders: analyticsRes.data.analytics.recentOrders || [],
        });
      }

      if (tendersRes?.data?.tenders) {
        setRecentTenders(tendersRes.data.tenders || []);
      }
    } catch (err) {
      console.error('❌ Dashboard Error:', err);
      const errorMessage = err.response?.data?.error || err.message || 'Échec du chargement des données du tableau de bord';
      setError(errorMessage);

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
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ backgroundColor: '#fafafa', minHeight: '100vh', paddingY: 4 }}>
      <Container maxWidth="lg">
        <Typography variant="h4" sx={{ fontWeight: 600, marginBottom: 3, color: institutionalTheme.palette.primary.main }}>
          Tableau de Bord Fournisseur
        </Typography>

        {error && (
          <Alert severity="error" sx={{ marginBottom: 3 }}>
            {error}
          </Alert>
        )}

        {/* Statistiques principales */}
        <Grid container spacing={3} sx={{ marginBottom: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ border: '1px solid #e0e0e0' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar sx={{ bgcolor: '#1976d2' }}>
                    <AssignmentIcon />
                  </Avatar>
                  <Box>
                    <Typography variant="h4" sx={{ fontWeight: 700 }}>
                      {stats.totalOffers}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Offres Totales
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ border: '1px solid #e0e0e0' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar sx={{ bgcolor: '#2e7d32' }}>
                    <TrendingUpIcon />
                  </Avatar>
                  <Box>
                    <Typography variant="h4" sx={{ fontWeight: 700 }}>
                      {stats.acceptedOffers}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Offres Acceptées
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ border: '1px solid #e0e0e0' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar sx={{ bgcolor: '#f57c00' }}>
                    <LocalShippingIcon />
                  </Avatar>
                  <Box>
                    <Typography variant="h4" sx={{ fontWeight: 700 }}>
                      {stats.activeOrders}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Commandes Actives
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ border: '1px solid #e0e0e0' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar sx={{ bgcolor: '#ed6c02' }}>
                    <StarIcon />
                  </Avatar>
                  <Box>
                    <Typography variant="h4" sx={{ fontWeight: 700 }}>
                      {typeof analytics.avgRating === 'string' ? analytics.avgRating : (analytics.avgRating || 0).toFixed(1)}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      sur {analytics.totalReviews || 0} avis
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Appels d'offres récents */}
        <Card sx={{ border: '1px solid #e0e0e0', marginBottom: 4 }}>
          <CardContent>
            <Typography variant="h6" sx={{ fontWeight: 600, marginBottom: 2 }}>
              Appels d'Offres Récents
            </Typography>
            {recentTenders.length > 0 ? (
              <TableContainer component={Paper} elevation={0}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 600 }}>Titre</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Statut</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Date Limite</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {recentTenders.map((tender) => (
                      <TableRow key={tender.id} hover>
                        <TableCell>{tender.title}</TableCell>
                        <TableCell>
                          <Chip
                            label={tender.status}
                            size="small"
                            color={tender.status === 'open' ? 'success' : 'default'}
                          />
                        </TableCell>
                        <TableCell>
                          {tender.deadline ? new Date(tender.deadline).toLocaleDateString('fr-FR') : 'N/A'}
                        </TableCell>
                        <TableCell>
                          <Typography
                            variant="body2"
                            sx={{ color: institutionalTheme.palette.primary.main, cursor: 'pointer' }}
                            onClick={() => navigate(`/tender/${tender.id}`)}
                          >
                            Voir Détails
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Typography variant="body2" color="textSecondary">
                Aucun appel d'offres récent
              </Typography>
            )}
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default SupplierDashboard;
