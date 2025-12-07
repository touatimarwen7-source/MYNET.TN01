/**
 * لوحة تحكم الإدارة - Admin Dashboard
 * واجهة احترافية عالمية للمسؤولين
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Button,
  Typography,
  Stack,
  Paper,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Drawer,
  Grid,
  Alert,
  Chip,
  Avatar,
  Card,
  CardContent,
} from '@mui/material';
import {
  Dashboard,
  People,
  BarChart,
  Person,
  Settings,
  HealthAndSafety,
  Security,
  Assessment,
  CheckCircle,
  TrendingUp,
  ArrowUpward,
  ArrowDownward,
  Database,
  Cloud,
  Lock,
} from '@mui/icons-material';
import { logger } from '../utils/logger';
import EnhancedErrorBoundary from '../components/EnhancedErrorBoundary';
import institutionalTheme from '../theme/theme';

const DRAWER_WIDTH = 280;

function AdminDashboardContent() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('dashboard');
  const [stats, setStats] = useState({
    totalUsers: 150,
    totalTenders: 45,
    totalOffers: 320,
    systemHealth: 'good',
  });

  useEffect(() => {
    setStats({
      totalUsers: 150,
      totalTenders: 45,
      totalOffers: 320,
      systemHealth: 'good',
    });
  }, []);

  const menuItems = [
    { id: 'dashboard', label: 'لوحة التحكم', icon: Dashboard },
    { id: 'users', label: 'إدارة المستخدمين', icon: People },
    { id: 'analytics', label: 'الإحصائيات والتحليلات', icon: BarChart },
    { id: 'health', label: 'صحة النظام', icon: HealthAndSafety },
    { id: 'security', label: 'الأمان والتدقيق', icon: Security },
    { id: 'settings', label: 'الإعدادات', icon: Settings },
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
          من الشهر الماضي
        </Typography>
      </Box>
    </Card>
  );

  const SystemStatusItem = ({ title, status }) => (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        p: 2,
        borderBottom: '1px solid #f0f0f0',
        '&:last-child': { borderBottom: 'none' },
      }}
    >
      <Typography variant="body2" sx={{ fontWeight: 500 }}>
        {title}
      </Typography>
      <Chip
        label={status === 'good' ? 'عاملة' : status === 'warning' ? 'تحذير' : 'مشكلة'}
        size="small"
        color={status === 'good' ? 'success' : status === 'warning' ? 'warning' : 'error'}
        variant="outlined"
      />
    </Box>
  );

  const renderContent = () => {
    if (activeSection === 'dashboard') {
      return (
        <Box>
          {/* Header */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h4" sx={{ fontWeight: 700, color: '#000', mb: 1 }}>
              لوحة تحكم الإدارة
            </Typography>
            <Typography variant="body2" sx={{ color: '#666' }}>
              مراقبة وإدارة النظام والمستخدمين
            </Typography>
          </Box>

          {/* Stats Grid */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="إجمالي المستخدمين"
                value={stats.totalUsers}
                change={12}
                icon={People}
                color="#0056B3"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="إجمالي المناقصات"
                value={stats.totalTenders}
                change={8}
                icon={Assessment}
                color="#2e7d32"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="إجمالي العروض"
                value={stats.totalOffers}
                change={24}
                icon={TrendingUp}
                color="#f57c00"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="حالة النظام"
                value={stats.systemHealth === 'good' ? 'جيدة' : 'تحذير'}
                change={0}
                icon={HealthAndSafety}
                color="#0288d1"
              />
            </Grid>
          </Grid>

          {/* Enhanced System Status & Analytics */}
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3, borderRadius: '12px', border: '1px solid #e0e0e0' }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                  حالة النظام المتقدمة
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <SystemStatusItem title="قاعدة البيانات" status="good" />
                <SystemStatusItem title="خادم الويب" status="good" />
                <SystemStatusItem title="البريد الإلكتروني" status="good" />
                <SystemStatusItem title="خدمات الأمان" status="good" />
                <Box sx={{ mt: 2, p: 2, backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
                  <Typography variant="caption" sx={{ color: '#666', display: 'block', mb: 1 }}>
                    Temps de réponse moyen
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 600, color: '#2e7d32' }}>
                    127ms
                  </Typography>
                </Box>
              </Paper>
            </Grid>

            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3, borderRadius: '12px', border: '1px solid #e0e0e0' }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                  النشاط والتحليلات
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Stack spacing={2}>
                  <Alert severity="info" sx={{ mb: 0, borderRadius: '8px' }}>
                    📊 10 مستخدمين جدد اليوم (+15%)
                  </Alert>
                  <Alert severity="success" sx={{ mb: 0, borderRadius: '8px' }}>
                    ✅ 5 مناقصات نشطة جديدة
                  </Alert>
                  <Alert severity="warning" sx={{ mb: 0, borderRadius: '8px' }}>
                    ⏳ 20 عرض قيد المراجعة
                  </Alert>
                  <Alert severity="info" sx={{ mb: 0, borderRadius: '8px' }}>
                    💰 Revenu total: TND 45,780
                  </Alert>
                </Stack>
              </Paper>
            </Grid>

            {/* Advanced Analytics Dashboard */}
            <Grid item xs={12}>
              <Paper sx={{ p: 3, borderRadius: '12px', border: '1px solid #e0e0e0' }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                  Tableau de bord analytique
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6} md={3}>
                    <Box sx={{ p: 2, backgroundColor: '#e3f2fd', borderRadius: '8px' }}>
                      <Typography variant="caption" sx={{ color: '#1976d2' }}>Taux d'activité</Typography>
                      <Typography variant="h5" sx={{ fontWeight: 700, color: '#1976d2' }}>87%</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Box sx={{ p: 2, backgroundColor: '#e8f5e9', borderRadius: '8px' }}>
                      <Typography variant="caption" sx={{ color: '#2e7d32' }}>Satisfaction</Typography>
                      <Typography variant="h5" sx={{ fontWeight: 700, color: '#2e7d32' }}>4.6/5</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Box sx={{ p: 2, backgroundColor: '#fff3e0', borderRadius: '8px' }}>
                      <Typography variant="caption" sx={{ color: '#f57c00' }}>Délai moyen</Typography>
                      <Typography variant="h5" sx={{ fontWeight: 700, color: '#f57c00' }}>3.2j</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Box sx={{ p: 2, backgroundColor: '#f3e5f5', borderRadius: '8px' }}>
                      <Typography variant="caption" sx={{ color: '#7b1fa2' }}>ROI</Typography>
                      <Typography variant="h5" sx={{ fontWeight: 700, color: '#7b1fa2' }}>+24%</Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          </Grid>

          {/* Quick Actions */}
          <Paper sx={{ p: 3, borderRadius: '12px', border: '1px solid #e0e0e0', mt: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              إجراءات سريعة
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={3}>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<People />}
                  onClick={() => navigate('/admin/users')}
                >
                  إدارة المستخدمين
                </Button>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Button fullWidth variant="outlined" startIcon={<BarChart />}>
                  الإحصائيات
                </Button>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Button fullWidth variant="outlined" startIcon={<HealthAndSafety />}>
                  صحة النظام
                </Button>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Button fullWidth variant="outlined" startIcon={<Lock />}>
                  الأمان
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Box>
      );
    }

    return (
      <Paper
        sx={{ p: 3, borderRadius: '12px', border: '1px solid #e0e0e0', textAlign: 'center', py: 6 }}
      >
        <Typography variant="body1" sx={{ color: '#999' }}>
          اختر قسماً من القائمة الجانبية
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
          background: 'linear-gradient(135deg, #D32F2F 0%, #B71C1C 100%)',
          color: 'white',
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          ⚙️ الإدارة
        </Typography>
      </Box>
      <List sx={{ flex: 1, pt: 0 }}>
        {menuItems.map((item) => (
          <ListItemButton
            key={item.id}
            selected={activeSection === item.id}
            onClick={() => setActiveSection(item.id)}
            sx={{
              borderRight: activeSection === item.id ? '4px solid #D32F2F' : 'none',
              backgroundColor: activeSection === item.id ? '#ffebee' : 'transparent',
              color: activeSection === item.id ? '#D32F2F' : 'inherit',
              fontWeight: activeSection === item.id ? 600 : 400,
              '&:hover': { backgroundColor: '#ffebee', color: '#D32F2F' },
            }}
          >
            <ListItemIcon
              sx={{ minWidth: 40, color: activeSection === item.id ? '#D32F2F' : 'inherit' }}
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

export default function AdminDashboard() {
  return (
    <EnhancedErrorBoundary>
      <AdminDashboardContent />
    </EnhancedErrorBoundary>
  );
}
