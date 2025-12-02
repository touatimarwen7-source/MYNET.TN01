import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Chip,
  Paper,
  TableContainer,
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { procurementAPI } from '../../api/procurementAPI';
import { setPageTitle } from '../../utils/pageTitle';
import PageWrapper from '../../components/ui/PageWrapper';
import AsyncViewWrapper from '../../components/AsyncViewWrapper';

/**
 * Buyer's main dashboard page.
 * Displays summary statistics, quick actions, and a list of recent tenders.
 */
const BuyerDashboardPage = () => {
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState({
    stats: { activeTenders: 0, offersReceived: 0, totalAwardedValue: 0 },
    recentTenders: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setPageTitle('Tableau de Bord Acheteur');
    const fetchDashboardData = async () => {
      try {
        const response = await procurementAPI.getBuyerDashboardData();
        setDashboardData(response.data);
      } catch (err) {
        setError('Erreur lors du chargement des données du tableau de bord.');
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const getStatusChip = (status) => {
    const statusMap = {
      'Published': { label: 'Publié', color: 'primary' },
      'Closed': { label: 'Fermé', color: 'default' },
      'Awarded': { label: 'Attribué', color: 'success' },
      'Cancelled': { label: 'Annulé', color: 'error' },
    };
    const { label, color } = statusMap[status] || { label: status, color: 'default' };
    return <Chip label={label} color={color} size="small" />;
  };

  const StatCard = ({ title, value, icon }) => (
    <Card sx={{ display: 'flex', alignItems: 'center', p: 2 }}>
      {icon}
      <Box sx={{ ml: 2 }}>
        <Typography variant="h6" color="text.primary">{value}</Typography>
        <Typography color="text.secondary">{title}</Typography>
      </Box>
    </Card>
  );

  return (
    <AsyncViewWrapper loading={loading} error={error}>
      <PageWrapper title="Tableau de Bord Acheteur">
        <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} md={6}>
              <Button
                variant="contained"
                size="large"
                startIcon={<AddCircleOutlineIcon />}
                onClick={() => navigate('/create-tender')}
                fullWidth
                sx={{ height: '100%' }}
              >
                Créer un Appel d'Offres
              </Button>
            </Grid>
            <Grid item xs={12} md={6}>
              <Button
                variant="outlined"
                size="large"
                startIcon={<ShoppingCartIcon />}
                onClick={() => navigate('/direct-purchase')}
                fullWidth
                sx={{ height: '100%' }}
              >
                Créer un Achat Direct
              </Button>
            </Grid>
          </Grid>

        <Typography variant="h5" sx={{ mb: 2 }}>
            Mes Appels d'Offres Récents
          </Typography>
        <Card sx={{ border: (theme) => `1px solid ${theme.palette.divider}`, boxShadow: 'none' }}>
          <CardContent>
            <TableContainer component={Paper} sx={{ boxShadow: 'none' }}>
              <Table sx={{ minWidth: 650 }} aria-label="recent tenders table">
                <TableHead>
                  <TableRow>
                    <TableCell>Titre</TableCell>
                    <TableCell>Date de Clôture</TableCell>
                    <TableCell align="center">Offres Reçues</TableCell>
                    <TableCell align="center">Statut</TableCell>
                    <TableCell align="center">Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {dashboardData.recentTenders.map((tender) => (
                    <TableRow
                      key={tender.id}
                      hover
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                      <TableCell component="th" scope="row">
                        <strong>{tender.title}</strong>
                      </TableCell>
                      <TableCell>{new Date(tender.deadline).toLocaleDateString('fr-FR')}</TableCell>
                      <TableCell align="center">{tender.offerCount}</TableCell>
                      <TableCell align="center">{getStatusChip(tender.status)}</TableCell>
                      <TableCell align="center">
                        <Button
                          variant="text"
                          size="small"
                          onClick={() => navigate(`/tenders/${tender.id}`)}
                        >
                          Voir Détails
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </PageWrapper>
    </AsyncViewWrapper>
  );
};

export default BuyerDashboardPage;