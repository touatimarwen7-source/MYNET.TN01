import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Stack,
  LinearProgress,
  Chip,
  Paper,
} from '@mui/material';
import {
  LocalOffer as OfferIcon,
  Assessment as AnalyticsIcon,
  Inventory as ProductsIcon,
  Star as ReviewsIcon,
  TrendingUp,
  ShoppingCart as ShoppingCartIcon,
} from '@mui/icons-material';
import institutionalTheme from '../theme/theme';
import { setPageTitle } from '../utils/pageTitle';

export default function SupplierDashboard() {
  const navigate = useNavigate();
  const theme = institutionalTheme;

  useEffect(() => {
    setPageTitle('Tableau de Bord Fournisseur - MyNet.tn');
  }, []);

  const [stats] = useState({
    totalBids: 0,
    activeBids: 0,
    wonBids: 0,
    revenue: 0,
  });

  const [loading] = useState(false);

  const quickActions = [
    {
      title: 'Parcourir les Appels d\'Offres',
      description: 'Rechercher de nouvelles opportunités',
      icon: <ShoppingCartIcon />,
      color: theme.palette.primary.main,
      action: () => navigate('/tenders'),
    },
    {
      title: 'Mes Offres',
      description: 'Gérer mes soumissions',
      icon: <OfferIcon />,
      color: theme.palette.success.main,
      action: () => navigate('/my-offers'),
    },
    {
      title: 'Catalogue Produits',
      description: 'Gérer mes produits/services',
      icon: <ProductsIcon />,
      color: theme.palette.info.main,
      action: () => navigate('/supplier-catalog'),
    },
    {
      title: 'Statistiques',
      description: 'Voir mes performances',
      icon: <AnalyticsIcon />,
      color: theme.palette.warning.main,
      action: () => navigate('/supplier-analytics'),
    },
  ];

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <LinearProgress />
      </Container>
    );
  }

  return (
    <Box sx={{ backgroundColor: '#fafafa', minHeight: '100vh', py: 4 }}>
      <Container maxWidth="lg">
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 600, mb: 1 }}>
            Tableau de Bord Fournisseur
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Gérez vos offres et opportunités
          </Typography>
        </Box>

        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Box>
                    <Typography color="text.secondary" variant="body2">
                      Total Offres
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 600 }}>
                      {stats.totalBids}
                    </Typography>
                  </Box>
                  <OfferIcon sx={{ fontSize: 40, color: theme.palette.primary.main, opacity: 0.3 }} />
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Box>
                    <Typography color="text.secondary" variant="body2">
                      Offres Actives
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 600, color: theme.palette.info.main }}>
                      {stats.activeBids}
                    </Typography>
                  </Box>
                  <TrendingUp sx={{ fontSize: 40, color: theme.palette.info.main, opacity: 0.3 }} />
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Box>
                    <Typography color="text.secondary" variant="body2">
                      Offres Gagnées
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 600, color: theme.palette.success.main }}>
                      {stats.wonBids}
                    </Typography>
                  </Box>
                  <ReviewsIcon sx={{ fontSize: 40, color: theme.palette.success.main, opacity: 0.3 }} />
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Box>
                    <Typography color="text.secondary" variant="body2">
                      Revenu Total
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 600 }}>
                      {stats.revenue.toLocaleString()} DT
                    </Typography>
                  </Box>
                  <AnalyticsIcon sx={{ fontSize: 40, color: theme.palette.warning.main, opacity: 0.3 }} />
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Quick Actions */}
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
          Actions Rapides
        </Typography>
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {quickActions.map((action, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card
                sx={{
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 4,
                  },
                }}
                onClick={action.action}
              >
                <CardContent>
                  <Stack spacing={2} alignItems="center" textAlign="center">
                    <Box
                      sx={{
                        width: 60,
                        height: 60,
                        borderRadius: '50%',
                        backgroundColor: `${action.color}15`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: action.color,
                      }}
                    >
                      {action.icon}
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      {action.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {action.description}
                    </Typography>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Recent Activity */}
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
            Activité Récente
          </Typography>
          <Stack spacing={2}>
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography color="text.secondary">
                Aucune activité récente
              </Typography>
              <Button
                variant="contained"
                sx={{ mt: 2 }}
                onClick={() => navigate('/tenders')}
              >
                Parcourir les Appels d'Offres
              </Button>
            </Box>
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
}