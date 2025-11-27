/**
 * لوحة تحكم المشتري - Buyer Dashboard
 * واجهة شاملة للمشترين مع جميع الميزات والوظائف
 * @component
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container, Box, Card, CardContent, Grid, Button, Typography, Table, TableHead, TableBody,
  TableRow, TableCell, CircularProgress, Chip, Tabs, Tab, Alert, Stack, Paper, List,
  ListItemButton, ListItemIcon, ListItemText, Divider, Drawer
} from '@mui/material';
import {
  Add, Dashboard, Assignment, Money, LocalShipping, People, Notifications,
  Person, Settings, Security, FileDownload, Edit, Delete, Visibility,
  TrendingUp, TrendingDown, CheckCircle, Schedule, Warning
} from '@mui/icons-material';
import { procurementAPI } from '../api';
import { logger } from '../utils/logger';
import EnhancedErrorBoundary from '../components/EnhancedErrorBoundary';
import { InfoCard } from '../components/ProfessionalComponents';
import institutionalTheme from '../theme/theme';

const THEME = institutionalTheme;
const DRAWER_WIDTH = 280;

function BuyerDashboardContent() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  const [tenders, setTenders] = useState([]);
  const [offers, setOffers] = useState([]);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [tendersRes, offersRes] = await Promise.all([
        procurementAPI.getMyTenders({ limit: 10 }),
        procurementAPI.getMyOffers()
      ]);
      
      setTenders(tendersRes?.data?.tenders || []);
      setOffers(offersRes?.data?.offers || []);
    } catch (err) {
      logger.error('Failed to load dashboard data:', err);
      setSnackbar({ open: true, message: 'خطأ في تحميل البيانات', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const menuItems = [
    { id: 'dashboard', label: 'لوحة التحكم', icon: Dashboard, section: 'Appels d\'Offres' },
    { id: 'tenders', label: 'الأجل النشطة', icon: Assignment },
    { id: 'create-tender', label: 'إنشاء أجل جديدة', icon: Add },
    { id: 'monitoring', label: 'المراقبة والتقييم', icon: Visibility },
    { id: 'finances', label: 'الفواتير والميزانيات', icon: Money },
    { id: 'operations', label: 'العمليات والعقود', icon: LocalShipping },
    { id: 'team', label: 'إدارة الفريق', icon: People },
    { id: 'notifications', label: 'الإخطارات', icon: Notifications },
    { id: 'profile', label: 'الملف الشخصي', icon: Person },
    { id: 'security', label: 'الأمان والخصوصية', icon: Security },
  ];

  const stats = [
    { label: 'الأجل النشطة', value: String(tenders.filter(t => t.status === 'open').length), change: 12, icon: Assignment, color: '#0056B3' },
    { label: 'متوسط الادخار', value: '18.5%', change: 5, icon: TrendingDown, color: '#2e7d32' },
    { label: 'العروض المنتظرة', value: String(offers.filter(o => o.status === 'submitted').length), change: -3, icon: Schedule, color: '#f57c00' },
    { label: 'معدل الإغلاق', value: '92%', change: 8, icon: CheckCircle, color: '#0288d1' },
  ];

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return (
          <Box>
            <Paper elevation={0} sx={{
              background: 'linear-gradient(135deg, #0056B3 0%, #003d82 100%)',
              borderRadius: '12px', padding: '32px', marginBottom: '24px',
              color: 'white'
            }}>
              <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
                مرحباً بك في لوحة التحكم
              </Typography>
              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.9)' }}>
                إدارة المناقصات والعروض بكفاءة عالية
              </Typography>
            </Paper>

            <Grid container spacing={3} sx={{ mb: 3 }}>
              {stats.map((stat, idx) => (
                <Grid item xs={12} md={6} lg={3} key={idx}>
                  <InfoCard {...stat} loading={loading} />
                </Grid>
              ))}
            </Grid>

            {/* Recent Tenders Table */}
            <Paper elevation={0} sx={{ backgroundColor: '#FFFFFF', border: '1px solid #e0e0e0', borderRadius: '8px', overflow: 'hidden' }}>
              <Box sx={{ p: 2, backgroundColor: '#f5f5f5', borderBottom: '1px solid #e0e0e0' }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>أحدث المناقصات</Typography>
              </Box>
              <Box sx={{ overflowX: 'auto' }}>
                <Table>
                  <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 600 }}>اسم المناقصة</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>الميزانية</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>الموعد</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>العروض</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>الحالة</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>الإجراءات</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {loading ? (
                      <TableRow><TableCell colSpan={6} sx={{ textAlign: 'center', py: 3 }}><CircularProgress size={30} /></TableCell></TableRow>
                    ) : tenders.length === 0 ? (
                      <TableRow><TableCell colSpan={6} sx={{ textAlign: 'center', py: 3 }}>لا توجد مناقصات</TableCell></TableRow>
                    ) : (
                      tenders.slice(0, 5).map((tender) => (
                        <TableRow key={tender.id} sx={{ '&:hover': { backgroundColor: '#f9f9f9' } }}>
                          <TableCell sx={{ fontWeight: 500 }}>{tender.title || 'مناقصة'}</TableCell>
                          <TableCell>د.ت {tender.budget_max || 0}</TableCell>
                          <TableCell>{new Date(tender.created_at).toLocaleDateString('ar-TN')}</TableCell>
                          <TableCell>{offers.filter(o => o.tender_id === tender.id).length}</TableCell>
                          <TableCell>
                            <Chip
                              label={tender.status === 'open' ? 'نشطة' : 'مغلقة'}
                              size="small"
                              color={tender.status === 'open' ? 'success' : 'default'}
                            />
                          </TableCell>
                          <TableCell>
                            <Button size="small" startIcon={<Visibility />} onClick={() => navigate(`/tender/${tender.id}`)}>
                              عرض
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </Box>
            </Paper>
          </Box>
        );

      case 'tenders':
        return (
          <Paper elevation={0} sx={{ backgroundColor: '#FFFFFF', border: '1px solid #e0e0e0', borderRadius: '8px', p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>الأجل النشطة</Typography>
              <Button variant="contained" startIcon={<Add />} onClick={() => navigate('/buyer-active-tenders')}>
                عرض الكل
              </Button>
            </Box>
            <Divider sx={{ mb: 2 }} />
            {tenders.filter(t => t.status === 'open').length === 0 ? (
              <Alert severity="info">لا توجد أجل نشطة حالياً</Alert>
            ) : (
              <Box sx={{ overflowX: 'auto' }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>المناقصة</TableCell>
                      <TableCell>الحالة</TableCell>
                      <TableCell>الإجراء</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {tenders.filter(t => t.status === 'open').map(t => (
                      <TableRow key={t.id}>
                        <TableCell>{t.title}</TableCell>
                        <TableCell><Chip label="نشطة" color="success" size="small" /></TableCell>
                        <TableCell>
                          <Button size="small" onClick={() => navigate(`/tender/${t.id}`)}>عرض</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Box>
            )}
          </Paper>
        );

      case 'create-tender':
        return (
          <Paper elevation={0} sx={{ backgroundColor: '#FFFFFF', border: '1px solid #e0e0e0', borderRadius: '8px', p: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>إنشاء مناقصة جديدة</Typography>
            <Divider sx={{ mb: 2 }} />
            <Button variant="contained" size="large" onClick={() => navigate('/create-tender')}>
              <Add sx={{ mr: 1 }} /> إنشاء أجل جديدة
            </Button>
          </Paper>
        );

      case 'monitoring':
        return (
          <Paper elevation={0} sx={{ backgroundColor: '#FFFFFF', border: '1px solid #e0e0e0', borderRadius: '8px', p: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>المراقبة والتقييم</Typography>
            <Divider sx={{ mb: 2 }} />
            <Stack spacing={2}>
              <Button variant="outlined" fullWidth onClick={() => navigate('/monitoring-submissions')}>
                المراقبة والتقييم
              </Button>
              <Button variant="outlined" fullWidth onClick={() => navigate('/tender-evaluation')}>
                تقييم العروض
              </Button>
              <Button variant="outlined" fullWidth onClick={() => navigate('/tender-awarding')}>
                الإحالة والتحكيم
              </Button>
            </Stack>
          </Paper>
        );

      case 'finances':
        return (
          <Paper elevation={0} sx={{ backgroundColor: '#FFFFFF', border: '1px solid #e0e0e0', borderRadius: '8px', p: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>الفواتير والميزانيات</Typography>
            <Divider sx={{ mb: 2 }} />
            <Stack spacing={2}>
              <Button variant="outlined" fullWidth onClick={() => navigate('/invoices')}>
                <FileDownload sx={{ mr: 1 }} /> إدارة الفواتير
              </Button>
              <Button variant="outlined" fullWidth onClick={() => navigate('/budgets')}>
                <Money sx={{ mr: 1 }} /> إدارة الميزانيات
              </Button>
              <Button variant="outlined" fullWidth onClick={() => navigate('/financial-reports')}>
                الكشوفات المالية
              </Button>
            </Stack>
          </Paper>
        );

      case 'operations':
        return (
          <Paper elevation={0} sx={{ backgroundColor: '#FFFFFF', border: '1px solid #e0e0e0', borderRadius: '8px', p: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>العمليات والعقود</Typography>
            <Divider sx={{ mb: 2 }} />
            <Stack spacing={2}>
              <Button variant="outlined" fullWidth onClick={() => navigate('/contracts')}>
                <FileDownload sx={{ mr: 1 }} /> إدارة العقود
              </Button>
              <Button variant="outlined" fullWidth onClick={() => navigate('/deliveries')}>
                <LocalShipping sx={{ mr: 1 }} /> إدارة التسليمات
              </Button>
              <Button variant="outlined" fullWidth onClick={() => navigate('/performance')}>
                مراقبة الأداء
              </Button>
              <Button variant="outlined" fullWidth onClick={() => navigate('/disputes')}>
                إدارة النزاعات
              </Button>
            </Stack>
          </Paper>
        );

      case 'team':
        return (
          <Paper elevation={0} sx={{ backgroundColor: '#FFFFFF', border: '1px solid #e0e0e0', borderRadius: '8px', p: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>إدارة الفريق</Typography>
            <Divider sx={{ mb: 2 }} />
            <Stack spacing={2}>
              <Button variant="outlined" fullWidth onClick={() => navigate('/team-management')}>
                <People sx={{ mr: 1 }} /> إدارة الفريق
              </Button>
              <Button variant="outlined" fullWidth onClick={() => navigate('/team-permissions')}>
                إدارة الصلاحيات
              </Button>
            </Stack>
          </Paper>
        );

      case 'notifications':
        return (
          <Paper elevation={0} sx={{ backgroundColor: '#FFFFFF', border: '1px solid #e0e0e0', borderRadius: '8px', p: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>الإخطارات</Typography>
            <Divider sx={{ mb: 2 }} />
            <Button variant="contained" fullWidth onClick={() => navigate('/notifications')}>
              <Notifications sx={{ mr: 1 }} /> عرض الإخطارات
            </Button>
          </Paper>
        );

      case 'profile':
        return (
          <Paper elevation={0} sx={{ backgroundColor: '#FFFFFF', border: '1px solid #e0e0e0', borderRadius: '8px', p: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>الملف الشخصي</Typography>
            <Divider sx={{ mb: 2 }} />
            <Stack spacing={2}>
              <Button variant="outlined" fullWidth onClick={() => navigate('/profile')}>
                <Person sx={{ mr: 1 }} /> تعديل الملف الشخصي
              </Button>
            </Stack>
          </Paper>
        );

      case 'security':
        return (
          <Paper elevation={0} sx={{ backgroundColor: '#FFFFFF', border: '1px solid #e0e0e0', borderRadius: '8px', p: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>الأمان والخصوصية</Typography>
            <Divider sx={{ mb: 2 }} />
            <Stack spacing={2}>
              <Button variant="outlined" fullWidth onClick={() => navigate('/security')}>
                <Security sx={{ mr: 1 }} /> إعدادات الأمان
              </Button>
              <Button variant="outlined" fullWidth onClick={() => navigate('/preferences')}>
                <Settings sx={{ mr: 1 }} /> التفضيلات
              </Button>
            </Stack>
          </Paper>
        );

      default:
        return null;
    }
  };

  const drawerContent = (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Box sx={{ p: 2, borderBottom: '1px solid #e0e0e0' }}>
        <Typography variant="h6" sx={{ fontWeight: 700, color: '#0056B3' }}>لوحة التحكم</Typography>
      </Box>
      <List sx={{ flex: 1, pt: 0 }}>
        {menuItems.map((item) => (
          <ListItemButton
            key={item.id}
            selected={activeSection === item.id}
            onClick={() => {
              setActiveSection(item.id);
              setMobileOpen(false);
            }}
            sx={{
              borderRight: activeSection === item.id ? '3px solid #0056B3' : 'none',
              backgroundColor: activeSection === item.id ? '#f0f4ff' : 'transparent',
              '&:hover': { backgroundColor: '#f0f4ff' }
            }}
          >
            <ListItemIcon sx={{ minWidth: 40, color: activeSection === item.id ? '#0056B3' : 'inherit' }}>
              <item.icon />
            </ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItemButton>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: '#F9F9F9' }}>
      {/* Desktop Drawer */}
      <Drawer
        variant="permanent"
        sx={{
          width: DRAWER_WIDTH,
          display: { xs: 'none', md: 'block' },
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: DRAWER_WIDTH,
            boxSizing: 'border-box',
            mt: { xs: '60px', md: '64px' },
            height: 'calc(100vh - 64px)',
            backgroundColor: '#FFFFFF',
            borderRight: '1px solid #e0e0e0'
          }
        }}
      >
        {drawerContent}
      </Drawer>

      {/* Mobile Drawer */}
      <Drawer
        anchor="left"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        sx={{ display: { xs: 'block', md: 'none' } }}
      >
        {drawerContent}
      </Drawer>

      {/* Main Content */}
      <Box sx={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
        <Container maxWidth="xl" sx={{ py: 3, flex: 1 }}>
          {renderContent()}
        </Container>
      </Box>
    </Box>
  );
}

export default function BuyerDashboard() {
  return (
    <EnhancedErrorBoundary>
      <BuyerDashboardContent />
    </EnhancedErrorBoundary>
  );
}
