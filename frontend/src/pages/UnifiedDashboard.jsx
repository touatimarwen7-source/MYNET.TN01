
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
  Alert,
  Chip,
  Stack,
  LinearProgress,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Gavel as TenderIcon,
  LocalOffer as OfferIcon,
  People as UsersIcon,
  Assessment as ReportsIcon,
  Settings as SettingsIcon,
  TrendingUp,
  CheckCircle,
  Pending,
} from '@mui/icons-material';
import TokenManager from '../services/tokenManager';
import institutionalTheme from '../theme/theme';
import { setPageTitle } from '../utils/pageTitle';

export default function UnifiedDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setPageTitle('لوحة التحكم');
    const userData = TokenManager.getUser();
    setUser(userData);

    // محاكاة تحميل الإحصائيات
    setTimeout(() => {
      setStats(getMockStats(userData?.role));
      setLoading(false);
    }, 800);
  }, []);

  const getMockStats = (role) => {
    const statsMap = {
      buyer: {
        title: 'لوحة تحكم المشتري',
        cards: [
          { label: 'المناقصات النشطة', value: 12, icon: TenderIcon, color: '#0056B3' },
          { label: 'العروض المستلمة', value: 45, icon: OfferIcon, color: '#2e7d32' },
          { label: 'قيد المراجعة', value: 8, icon: Pending, color: '#f57c00' },
          { label: 'تم الإنجاز', value: 23, icon: CheckCircle, color: '#1976d2' },
        ],
        quickActions: [
          { label: 'إنشاء مناقصة جديدة', path: '/tenders/create', color: 'primary' },
          { label: 'عرض المناقصات', path: '/tenders', color: 'secondary' },
          { label: 'التقارير', path: '/reports', color: 'info' },
        ],
      },
      supplier: {
        title: 'لوحة تحكم المزود',
        cards: [
          { label: 'المناقصات المتاحة', value: 28, icon: TenderIcon, color: '#0056B3' },
          { label: 'عروضي', value: 15, icon: OfferIcon, color: '#2e7d32' },
          { label: 'قيد التقييم', value: 5, icon: Pending, color: '#f57c00' },
          { label: 'عروض فائزة', value: 7, icon: CheckCircle, color: '#1976d2' },
        ],
        quickActions: [
          { label: 'تصفح المناقصات', path: '/tenders', color: 'primary' },
          { label: 'عروضي', path: '/my-offers', color: 'secondary' },
          { label: 'الملف الشخصي', path: '/profile', color: 'info' },
        ],
      },
      admin: {
        title: 'لوحة تحكم المساعد الإداري',
        cards: [
          { label: 'إجمالي المستخدمين', value: 342, icon: UsersIcon, color: '#0056B3' },
          { label: 'المناقصات النشطة', value: 67, icon: TenderIcon, color: '#2e7d32' },
          { label: 'التقارير اليوم', value: 12, icon: ReportsIcon, color: '#f57c00' },
          { label: 'معدل النشاط', value: '87%', icon: TrendingUp, color: '#1976d2' },
        ],
        quickActions: [
          { label: 'إدارة المستخدمين', path: '/admin/users', color: 'primary' },
          { label: 'عرض التقارير', path: '/admin/reports', color: 'secondary' },
          { label: 'الإعدادات', path: '/admin/settings', color: 'info' },
        ],
      },
      super_admin: {
        title: 'لوحة التحكم الرئيسية',
        cards: [
          { label: 'إجمالي المستخدمين', value: 1547, icon: UsersIcon, color: '#0056B3' },
          { label: 'المناقصات الكلية', value: 234, icon: TenderIcon, color: '#2e7d32' },
          { label: 'المساعدين الإداريين', value: 8, icon: People, color: '#f57c00' },
          { label: 'معدل الأداء', value: '94%', icon: TrendingUp, color: '#1976d2' },
        ],
        quickActions: [
          { label: 'مركز التحكم الكامل', path: '/super-admin', color: 'primary' },
          { label: 'إدارة المساعدين', path: '/super-admin/assistants', color: 'secondary' },
          { label: 'التحليلات المتقدمة', path: '/super-admin/analytics', color: 'info' },
        ],
      },
    };

    return statsMap[role] || statsMap.buyer;
  };

  if (loading) {
    return (
      <Box sx={{ width: '100%', mt: 4 }}>
        <LinearProgress />
      </Box>
    );
  }

  if (!user) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="error">يرجى تسجيل الدخول للوصول إلى لوحة التحكم</Alert>
      </Container>
    );
  }

  return (
    <Box sx={{ backgroundColor: '#fafafa', minHeight: '100vh', paddingY: 4 }}>
      <Container maxWidth="xl">
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 600,
              color: institutionalTheme.palette.primary.main,
              mb: 1,
            }}
          >
            {stats.title}
          </Typography>
          <Stack direction="row" spacing={2} alignItems="center">
            <Typography variant="body1" sx={{ color: '#666' }}>
              مرحباً، {user.username || user.email}
            </Typography>
            <Chip
              label={getRoleLabel(user.role)}
              size="small"
              sx={{
                backgroundColor: getRoleColor(user.role),
                color: '#fff',
                fontWeight: 500,
              }}
            />
          </Stack>
        </Box>

        {/* Statistics Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {stats.cards.map((card, index) => {
            const IconComponent = card.icon;
            return (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Card
                  sx={{
                    border: '1px solid #e0e0e0',
                    borderRadius: '8px',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    },
                  }}
                >
                  <CardContent>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Box>
                        <Typography variant="body2" sx={{ color: '#666', mb: 1 }}>
                          {card.label}
                        </Typography>
                        <Typography
                          variant="h4"
                          sx={{ fontWeight: 700, color: card.color }}
                        >
                          {card.value}
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          backgroundColor: `${card.color}15`,
                          borderRadius: '50%',
                          width: 56,
                          height: 56,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <IconComponent sx={{ color: card.color, fontSize: 28 }} />
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>

        {/* Quick Actions */}
        <Card sx={{ border: '1px solid #e0e0e0', borderRadius: '8px', mb: 4 }}>
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
              الإجراءات السريعة
            </Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              {stats.quickActions.map((action, index) => (
                <Button
                  key={index}
                  variant="contained"
                  color={action.color}
                  onClick={() => navigate(action.path)}
                  sx={{ flex: 1 }}
                >
                  {action.label}
                </Button>
              ))}
            </Stack>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card sx={{ border: '1px solid #e0e0e0', borderRadius: '8px' }}>
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
              النشاط الأخير
            </Typography>
            <Alert severity="info" sx={{ backgroundColor: '#e3f2fd', border: '1px solid #2196f3' }}>
              سيتم عرض آخر الأنشطة والإشعارات هنا
            </Alert>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}

function getRoleLabel(role) {
  const labels = {
    buyer: 'مشتري',
    supplier: 'مزود',
    admin: 'مساعد إداري',
    super_admin: 'مدير أعلى',
  };
  return labels[role] || 'مستخدم';
}

function getRoleColor(role) {
  const colors = {
    buyer: '#0056B3',
    supplier: '#2e7d32',
    admin: '#f57c00',
    super_admin: '#d32f2f',
  };
  return colors[role] || '#666';
}
