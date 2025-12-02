import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Grid,
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
} from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import GavelIcon from '@mui/icons-material/Gavel';
import StoreIcon from '@mui/icons-material/Store';
import DnsIcon from '@mui/icons-material/Dns';
import StorageIcon from '@mui/icons-material/Storage';
import { procurementAPI } from '../../api/procurementAPI';
import { setPageTitle } from '../../utils/pageTitle';
import PageWrapper from '../../components/ui/PageWrapper';
import AsyncViewWrapper from '../../components/AsyncViewWrapper';

/**
 * Admin's main dashboard page.
 * Displays platform-wide statistics, system health, and quick navigation links.
 */
const AdminDashboardPage = () => {
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState({
    stats: { totalUsers: 0, totalTenders: 0, totalSuppliers: 0 },
    systemHealth: { backend: 'Operational', database: 'Operational' },
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setPageTitle('Tableau de Bord Administrateur');
    const fetchDashboardData = async () => {
      try {
        const response = await procurementAPI.getAdminDashboardData();
        setDashboardData(response.data);
      } catch (err) {
        setError('Erreur lors du chargement des données du tableau de bord.');
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const StatCard = ({ title, value, icon }) => (
    <Card sx={{ display: 'flex', alignItems: 'center', p: 2, height: '100%' }}>
      {icon}
      <Box sx={{ ml: 2 }}>
        <Typography variant="h4" color="text.primary">{value}</Typography>
        <Typography color="text.secondary">{title}</Typography>
      </Box>
    </Card>
  );

  return (
    <AsyncViewWrapper loading={loading} error={error}>
      <PageWrapper title="Tableau de Bord Administrateur">
        <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={4}>
              <StatCard title="Utilisateurs Totaux" value={dashboardData.stats.totalUsers} icon={<PeopleIcon color="primary" sx={{ fontSize: 40 }} />} />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <StatCard title="Appels d'Offres Totaux" value={dashboardData.stats.totalTenders} icon={<GavelIcon color="primary" sx={{ fontSize: 40 }} />} />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <StatCard title="Fournisseurs Totaux" value={dashboardData.stats.totalSuppliers} icon={<StoreIcon color="primary" sx={{ fontSize: 40 }} />} />
            </Grid>
          </Grid>

        <Typography variant="h5" sx={{ mb: 2 }}>
            Accès Rapide
          </Typography>
        <Grid container spacing={2} sx={{ mb: 4 }}>
            <Grid item xs={12} md={4}>
              <Button variant="contained" fullWidth onClick={() => navigate('/admin/users')}>Gestion des Utilisateurs</Button>
            </Grid>
            <Grid item xs={12} md={4}>
              <Button variant="outlined" fullWidth>Gestion du Contenu</Button>
            </Grid>
            <Grid item xs={12} md={4}>
              <Button variant="outlined" fullWidth>Configuration du Système</Button>
            </Grid>
          </Grid>

        <Typography variant="h5" sx={{ mb: 2 }}>
            Santé du Système
          </Typography>
        <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Card variant="outlined">
                <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}><DnsIcon sx={{ mr: 1 }} /> <Typography>Service Backend</Typography></Box>
                  <Chip label={dashboardData.systemHealth.backend} color={dashboardData.systemHealth.backend === 'Operational' ? 'success' : 'error'} />
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card variant="outlined">
                <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}><StorageIcon sx={{ mr: 1 }} /> <Typography>Base de Données</Typography></Box>
                  <Chip label={dashboardData.systemHealth.database} color={dashboardData.systemHealth.database === 'Operational' ? 'success' : 'error'} />
                </CardContent>
              </Card>
            </Grid>
          </Grid>
      </PageWrapper>
    </AsyncViewWrapper>
  );
};

export default AdminDashboardPage;