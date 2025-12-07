
/**
 * لوحة تحكم المورد - Supplier Dashboard
 * واجهة احترافية عالمية للموردين مع أفضل الممارسات
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Grid,
  Button,
  Typography,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  CircularProgress,
  Chip,
  Stack,
  Paper,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Drawer,
  Avatar,
  LinearProgress,
  Card,
  CardContent,
} from '@mui/material';
import {
  Dashboard,
  Assignment,
  LocalOffer,
  TrendingUp,
  AttachMoney,
  Notifications,
  Person,
  Settings,
  Security,
  Visibility,
  Star,
  CheckCircle,
  Schedule,
  ArrowUpward,
  ArrowDownward,
  Refresh,
} from '@mui/icons-material';
import { procurementAPI } from '../api';
import { logger } from '../utils/logger';
import EnhancedErrorBoundary from '../components/EnhancedErrorBoundary';
import institutionalTheme from '../theme/theme';

const DRAWER_WIDTH = 280;

function SupplierDashboardContent() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  const [tenders, setTenders] = useState([]);
  const [myOffers, setMyOffers] = useState([]);
  const [stats, setStats] = useState({
    activeBids: 0,
    wonContracts: 0,
    revenue: 0,
    rating: 4.5,
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [tendersRes, offersRes] = await Promise.all([
        procurementAPI.getTenders({ limit: 10 }),
        procurementAPI.getMyOffers(),
      ]);
      setTenders(tendersRes?.data?.tenders || []);
      setMyOffers(offersRes?.data?.offers || []);
      
      setStats({
        activeBids: offersRes?.data?.offers?.filter(o => o.status === 'submitted').length || 0,
        wonContracts: offersRes?.data?.offers?.filter(o => o.status === 'accepted').length || 0,
        revenue: 125000,
        rating: 4.5,
      });
    } catch (err) {
      logger.error('Failed to load supplier dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const menuItems = [
    { id: 'dashboard', label: 'Tableau de bord', icon: Dashboard },
    { id: 'opportunities', label: 'Opportunités Disponibles', icon: Assignment },
    { id: 'my-bids', label: 'Mes Offres', icon: LocalOffer },
    { id: 'contracts', label: 'Contrats Gagnés', icon: CheckCircle },
    { id: 'revenue', label: 'Revenus et Facturation', icon: AttachMoney },
    { id: 'performance', label: 'Performance et Évaluation', icon: Star },
    { id: 'notifications', label: 'Notifications', icon: Notifications },
    { id: 'profile', label: 'Mon Profil', icon: Person },
    { id: 'security', label: 'Sécurité', icon: Security },
  ];

  const StatCard = ({ title, value, change, icon: Icon, color }) => (
    <Card
      sx={{
        background: `linear-gradient(135deg, ${color}20 0%, ${color}10 100%)`,
        border: `1px solid ${color}30`,
        borderRadius: '12px',
        p: 3,
        height: '100%',
        position: 'relative',
        overflow: 'hidden',
        transition: 'all 0.3s ease',
        '&:hover': { transform: 'translateY(-4px)', boxShadow: `0 8px 24px ${color}20` },
      }}
    >
      <Box
        sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}
      >
        <Box>
          <Typography variant="caption" sx={{ color: '#666', fontWeight: 500 }}>
            {title}
          </Typography>
          <Typography variant="h4" sx={{ fontWeight: 700, color: '#000', mt: 1 }}>
            {value}
          </Typography>
        </Box>
        <Avatar sx={{ background: color, color: 'white', width: 50, height: 50 }}>
          <Icon />
        </Avatar>
      </Box>
      {change !== undefined && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {change > 0 ? (
            <ArrowUpward sx={{ color: '#2e7d32', fontSize: 18 }} />
          ) : (
            <ArrowDownward sx={{ color: '#D32F2F', fontSize: 18 }} />
          )}
          <Typography
            variant="caption"
            sx={{ color: change > 0 ? '#2e7d32' : '#D32F2F', fontWeight: 600 }}
          >
            {change > 0 ? '+' : ''}
            {change}%
          </Typography>
          <Typography variant="caption" sx={{ color: '#999' }}>
            depuis le mois dernier
          </Typography>
        </Box>
      )}
    </Card>
  );

  const renderContent = () => {
    if (activeSection === 'dashboard') {
      return (
        <Box>
          {/* Header */}
          <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#000', mb: 1 }}>
                Tableau de bord Fournisseur
              </Typography>
              <Typography variant="body2" sx={{ color: '#666' }}>
                Gérez vos opportunités et suivez vos performances
              </Typography>
            </Box>
            <Button
              variant="outlined"
              startIcon={<Refresh />}
              onClick={fetchDashboardData}
              sx={{ borderRadius: '8px' }}
            >
              Actualiser
            </Button>
          </Box>

          {/* Stats Grid */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Offres Actives"
                value={stats.activeBids}
                change={15}
                icon={LocalOffer}
                color="#0056B3"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Contrats Gagnés"
                value={stats.wonContracts}
                change={8}
                icon={CheckCircle}
                color="#2e7d32"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Revenu Total"
                value={`TND ${stats.revenue.toLocaleString()}`}
                change={22}
                icon={AttachMoney}
                color="#f57c00"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Note Moyenne"
                value={`${stats.rating} ⭐`}
                change={5}
                icon={Star}
                color="#7b1fa2"
              />
            </Grid>
          </Grid>

          {/* Main Content Grid */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} lg={8}>
              <Paper sx={{ p: 3, borderRadius: '12px', border: '1px solid #e0e0e0' }}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 3,
                  }}
                >
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Opportunités Récentes
                  </Typography>
                  <Button
                    size="small"
                    onClick={() => navigate('/available-tenders')}
                    sx={{ textTransform: 'none' }}
                  >
                    Voir tout →
                  </Button>
                </Box>
                <Box sx={{ overflowX: 'auto' }}>
                  <Table size="small">
                    <TableHead>
                      <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                        <TableCell sx={{ fontWeight: 600 }}>Appel d'offres</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Budget</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Date limite</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Statut</TableCell>
                        <TableCell sx={{ fontWeight: 600 }} align="right">Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {loading ? (
                        <TableRow>
                          <TableCell colSpan={5} sx={{ textAlign: 'center', py: 3 }}>
                            <CircularProgress size={30} />
                          </TableCell>
                        </TableRow>
                      ) : tenders.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} sx={{ textAlign: 'center', py: 3, color: '#999' }}>
                            Aucune opportunité disponible
                          </TableCell>
                        </TableRow>
                      ) : (
                        tenders.slice(0, 5).map((tender) => (
                          <TableRow
                            key={tender.id}
                            hover
                            sx={{ cursor: 'pointer' }}
                            onClick={() => navigate(`/tender/${tender.id}`)}
                          >
                            <TableCell sx={{ fontWeight: 500 }}>
                              {tender.title || "Appel d'offres"}
                            </TableCell>
                            <TableCell>TND {tender.budget_max || 0}</TableCell>
                            <TableCell>
                              {new Date(tender.submission_deadline).toLocaleDateString('fr-FR')}
                            </TableCell>
                            <TableCell>
                              <Chip
                                label={tender.status === 'open' ? 'Ouvert' : 'Fermé'}
                                size="small"
                                color={tender.status === 'open' ? 'success' : 'default'}
                                variant="outlined"
                              />
                            </TableCell>
                            <TableCell align="right">
                              <Button
                                size="small"
                                variant="contained"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  navigate(`/submit-bid/${tender.id}`);
                                }}
                                sx={{
                                  backgroundColor: '#0056B3',
                                  '&:hover': { backgroundColor: '#003d82' },
                                }}
                              >
                                Soumissionner
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </Box>
              </Paper>
            </Grid>

            <Grid item xs={12} lg={4}>
              <Stack spacing={2}>
                <Paper
                  sx={{
                    p: 3,
                    borderRadius: '12px',
                    border: '1px solid #e0e0e0',
                    background: 'linear-gradient(135deg, #2e7d32 0%, #1b5e20 100%)',
                    color: 'white',
                  }}
                >
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                    Performance ce mois-ci
                  </Typography>
                  <Box sx={{ my: 2 }}>
                    <Typography variant="caption" sx={{ opacity: 0.9 }}>
                      Taux de réussite
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={75}
                      sx={{
                        height: 8,
                        borderRadius: 4,
                        mt: 1,
                        backgroundColor: 'rgba(255,255,255,0.3)',
                        '& .MuiLinearProgress-bar': { backgroundColor: 'white' },
                      }}
                    />
                    <Typography variant="h4" sx={{ fontWeight: 700, mt: 1 }}>
                      75%
                    </Typography>
                  </Box>
                  <Typography variant="caption" sx={{ opacity: 0.9 }}>
                    +12% par rapport au mois dernier
                  </Typography>
                </Paper>

                <Paper sx={{ p: 3, borderRadius: '12px', border: '1px solid #e0e0e0' }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                    Actions rapides
                  </Typography>
                  <Stack spacing={1}>
                    <Button
                      fullWidth
                      variant="text"
                      sx={{ justifyContent: 'flex-start', textTransform: 'none' }}
                      onClick={() => navigate('/available-tenders')}
                    >
                      <Visibility sx={{ mr: 1 }} /> Parcourir les opportunités
                    </Button>
                    <Button
                      fullWidth
                      variant="text"
                      sx={{ justifyContent: 'flex-start', textTransform: 'none' }}
                      onClick={() => navigate('/my-offers')}
                    >
                      <LocalOffer sx={{ mr: 1 }} /> Mes offres soumises
                    </Button>
                    <Button
                      fullWidth
                      variant="text"
                      sx={{ justifyContent: 'flex-start', textTransform: 'none' }}
                      onClick={() => navigate('/supplier-analytics')}
                    >
                      <TrendingUp sx={{ mr: 1 }} /> Mes statistiques
                    </Button>
                  </Stack>
                </Paper>
              </Stack>
            </Grid>
          </Grid>
        </Box>
      );
    }

    return (
      <Paper
        sx={{ p: 3, borderRadius: '12px', border: '1px solid #e0e0e0', textAlign: 'center', py: 6 }}
      >
        <Typography variant="body1" sx={{ color: '#999' }}>
          Choisissez une section dans le menu latéral
        </Typography>
      </Paper>
    );
  };

  const drawerContent = (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Box
        sx={{
          p: 3,
          borderBottom: '1px solid #e0e0e0',
          background: 'linear-gradient(135deg, #2e7d32 0%, #1b5e20 100%)',
          color: 'white',
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          🎯 Mon Espace
        </Typography>
      </Box>
      <List sx={{ flex: 1, pt: 0 }}>
        {menuItems.map((item) => (
          <ListItemButton
            key={item.id}
            selected={activeSection === item.id}
            onClick={() => setActiveSection(item.id)}
            sx={{
              borderRight: activeSection === item.id ? '4px solid #2e7d32' : 'none',
              backgroundColor: activeSection === item.id ? '#e8f5e9' : 'transparent',
              color: activeSection === item.id ? '#2e7d32' : 'inherit',
              fontWeight: activeSection === item.id ? 600 : 400,
              '&:hover': { backgroundColor: '#e8f5e9', color: '#2e7d32' },
            }}
          >
            <ListItemIcon
              sx={{ minWidth: 40, color: activeSection === item.id ? '#2e7d32' : 'inherit' }}
            >
              <item.icon />
            </ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItemButton>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      <Drawer
        variant="permanent"
        sx={{
          width: DRAWER_WIDTH,
          display: { xs: 'none', md: 'block' },
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: DRAWER_WIDTH,
            boxSizing: 'border-box',
            mt: '64px',
            height: 'calc(100vh - 64px)',
            backgroundColor: '#FFFFFF',
            borderRight: '1px solid #e0e0e0',
          },
        }}
      >
        {drawerContent}
      </Drawer>

      <Box sx={{ flex: 1, overflowY: 'auto' }}>
        <Container maxWidth="xl" sx={{ py: 4 }}>
          {renderContent()}
        </Container>
      </Box>
    </Box>
  );
}

export default function SupplierDashboard() {
  return (
    <EnhancedErrorBoundary>
      <SupplierDashboardContent />
    </EnhancedErrorBoundary>
  );
}
