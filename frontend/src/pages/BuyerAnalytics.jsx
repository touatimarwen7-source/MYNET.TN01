
import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  Stack,
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  Assessment as AssessmentIcon,
  AccountBalance as AccountBalanceIcon,
  Timeline as TimelineIcon,
} from '@mui/icons-material';
import institutionalTheme from '../theme/theme';
import { procurementAPI } from '../api';
import { setPageTitle } from '../utils/pageTitle';

export default function BuyerAnalytics() {
  const theme = institutionalTheme;
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    setPageTitle('Analyses et Rapports');
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await procurementAPI.getMyTenders();
      const tenders = response.data.tenders || [];

      const totalSpent = tenders.reduce((sum, t) => sum + (t.budget_max || 0), 0);
      const avgBudget = tenders.length > 0 ? totalSpent / tenders.length : 0;
      const completedCount = tenders.filter(t => t.status === 'closed' || t.status === 'awarded').length;
      const activeCount = tenders.filter(t => t.status === 'open' || t.status === 'published').length;

      setStats({
        totalTenders: tenders.length,
        totalSpent,
        avgBudget,
        completedCount,
        activeCount,
        completionRate: tenders.length > 0 ? ((completedCount / tenders.length) * 100).toFixed(1) : 0,
      });
    } catch (err) {
      console.error('Erreur de chargement des analyses:', err);
      setError('Échec du chargement des analyses');
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

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 600, color: theme.palette.primary.main }}>
          Analyses et Rapports
        </Typography>
        <Typography variant="body1" color="textSecondary">
          Vue d'ensemble de vos activités d'approvisionnement
        </Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={2}>
                <AssessmentIcon sx={{ fontSize: 40, color: theme.palette.primary.main }} />
                <Box>
                  <Typography variant="body2" color="textSecondary">
                    Total Appels d'Offres
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 600 }}>
                    {stats?.totalTenders || 0}
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={2}>
                <AccountBalanceIcon sx={{ fontSize: 40, color: theme.palette.success.main }} />
                <Box>
                  <Typography variant="body2" color="textSecondary">
                    Budget Total
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 600 }}>
                    {stats?.totalSpent?.toLocaleString() || 0} TND
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={2}>
                <TrendingUpIcon sx={{ fontSize: 40, color: theme.palette.info.main }} />
                <Box>
                  <Typography variant="body2" color="textSecondary">
                    Budget Moyen
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 600 }}>
                    {stats?.avgBudget?.toLocaleString() || 0} TND
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={2}>
                <TimelineIcon sx={{ fontSize: 40, color: theme.palette.warning.main }} />
                <Box>
                  <Typography variant="body2" color="textSecondary">
                    Taux de Complétion
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 600 }}>
                    {stats?.completionRate || 0}%
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Statut des Appels d'Offres
              </Typography>
              <Stack spacing={2}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography>Actifs</Typography>
                  <Typography sx={{ fontWeight: 600, color: theme.palette.primary.main }}>
                    {stats?.activeCount || 0}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography>Complétés</Typography>
                  <Typography sx={{ fontWeight: 600, color: theme.palette.success.main }}>
                    {stats?.completedCount || 0}
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Recommandations
              </Typography>
              <Stack spacing={1}>
                <Typography variant="body2" color="textSecondary">
                  • Planifiez vos appels d'offres à l'avance
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  • Définissez des critères d'évaluation clairs
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  • Maintenez une communication régulière avec les fournisseurs
                </Typography>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}
