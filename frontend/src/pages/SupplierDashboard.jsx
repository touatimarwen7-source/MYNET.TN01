/**
 * لوحة تحكم المزود - Supplier Dashboard
 * واجهة شاملة للموردين مع جميع الميزات والوظائف
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
  Dashboard, Assignment, Inventory2, Money, Send, TrendingUp, Notifications,
  Person, Settings, Security, FileDownload, Visibility, Edit, Delete, Star
} from '@mui/icons-material';
import { procurementAPI } from '../api';
import { logger } from '../utils/logger';
import EnhancedErrorBoundary from '../components/EnhancedErrorBoundary';
import { InfoCard } from '../components/ProfessionalComponents';
import institutionalTheme from '../theme/theme';

const THEME = institutionalTheme;
const DRAWER_WIDTH = 280;

function SupplierDashboardContent() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  const [tenders, setTenders] = useState([]);
  const [myOffers, setMyOffers] = useState([]);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    fetchSupplierData();
  }, []);

  const fetchSupplierData = async () => {
    try {
      setLoading(true);
      const [tendersRes, offersRes] = await Promise.all([
        procurementAPI.getTenders({ limit: 50 }),
        procurementAPI.getMyOffers()
      ]);
      setTenders(tendersRes?.data?.tenders || []);
      setMyOffers(offersRes?.data?.offers || []);
    } catch (err) {
      logger.error('Failed to load supplier data:', err);
    } finally {
      setLoading(false);
    }
  };

  const menuItems = [
    { id: 'dashboard', label: 'لوحة التحكم', icon: Dashboard },
    { id: 'browse-tenders', label: 'استعراض الأجل', icon: Assignment },
    { id: 'my-offers', label: 'عروضي', icon: Send },
    { id: 'catalog', label: 'إدارة المنتجات والخدمات', icon: Inventory2 },
    { id: 'finances', label: 'الفواتير والمدفوعات', icon: Money },
    { id: 'reviews', label: 'التقييمات والآراء', icon: Star },
    { id: 'notifications', label: 'الإخطارات', icon: Notifications },
    { id: 'profile', label: 'الملف الشخصي', icon: Person },
    { id: 'security', label: 'الأمان والخصوصية', icon: Security },
  ];

  const stats = [
    { label: 'الأجل المتاحة', value: String(tenders.length), change: 24, icon: Assignment, color: '#2e7d32' },
    { label: 'العروض المرسلة', value: String(myOffers.length), change: 18, icon: Send, color: '#0056B3' },
    { label: 'معدل الفوز', value: String(myOffers.filter(o => o.status === 'accepted').length || 0), change: 12, icon: TrendingUp, color: '#f57c00' },
    { label: 'التقييم', value: '4.8 / 5', change: 5, icon: Star, color: '#0288d1' },
  ];

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return (
          <Box>
            <Paper elevation={0} sx={{
              background: 'linear-gradient(135deg, #2e7d32 0%, #1b5e20 100%)',
              borderRadius: '12px', padding: '32px', marginBottom: '24px',
              color: 'white'
            }}>
              <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
                منصة التوريد الاحترافية
              </Typography>
              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.9)' }}>
                ابحث عن الفرص المربحة وقدم عروضك الفائزة
              </Typography>
            </Paper>

            <Grid container spacing={3} sx={{ mb: 3 }}>
              {stats.map((stat, idx) => (
                <Grid item xs={12} md={6} lg={3} key={idx}>
                  <InfoCard {...stat} loading={loading} />
                </Grid>
              ))}
            </Grid>

            {/* Recent Tenders */}
            <Paper elevation={0} sx={{ backgroundColor: '#FFFFFF', border: '1px solid #e0e0e0', borderRadius: '8px', overflow: 'hidden' }}>
              <Box sx={{ p: 2, backgroundColor: '#f5f5f5', borderBottom: '1px solid #e0e0e0' }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>الأجل المتاحة الحديثة</Typography>
              </Box>
              <Box sx={{ overflowX: 'auto' }}>
                <Table>
                  <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 600 }}>المشروع</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>الميزانية</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>الموعد</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>الحالة</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>الإجراء</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {loading ? (
                      <TableRow><TableCell colSpan={5} sx={{ textAlign: 'center', py: 3 }}><CircularProgress size={30} /></TableCell></TableRow>
                    ) : tenders.length === 0 ? (
                      <TableRow><TableCell colSpan={5} sx={{ textAlign: 'center', py: 3 }}>لا توجد أجل متاحة</TableCell></TableRow>
                    ) : (
                      tenders.slice(0, 5).map((tender) => (
                        <TableRow key={tender.id} sx={{ '&:hover': { backgroundColor: '#f9f9f9' } }}>
                          <TableCell sx={{ fontWeight: 500 }}>{tender.title || 'مناقصة'}</TableCell>
                          <TableCell>د.ت {tender.budget_max || 0}</TableCell>
                          <TableCell>{new Date(tender.created_at).toLocaleDateString('ar-TN')}</TableCell>
                          <TableCell>
                            <Chip
                              label={tender.status === 'open' ? 'متاحة' : 'مغلقة'}
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

      case 'browse-tenders':
        return (
          <Paper elevation={0} sx={{ backgroundColor: '#FFFFFF', border: '1px solid #e0e0e0', borderRadius: '8px', p: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>استعراض الأجل</Typography>
            <Divider sx={{ mb: 2 }} />
            <Button variant="contained" fullWidth onClick={() => navigate('/tenders')}>
              عرض جميع الأجل
            </Button>
          </Paper>
        );

      case 'my-offers':
        return (
          <Paper elevation={0} sx={{ backgroundColor: '#FFFFFF', border: '1px solid #e0e0e0', borderRadius: '8px', p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>عروضي</Typography>
              <Button variant="contained" startIcon={<Send />} onClick={() => navigate('/my-offers')}>
                عرض الكل
              </Button>
            </Box>
            <Divider sx={{ mb: 2 }} />
            {myOffers.length === 0 ? (
              <Alert severity="info">لم تقدم أي عروض حتى الآن</Alert>
            ) : (
              <Box sx={{ overflowX: 'auto' }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>السعر</TableCell>
                      <TableCell>الحالة</TableCell>
                      <TableCell>الإجراء</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {myOffers.map(offer => (
                      <TableRow key={offer.id}>
                        <TableCell>د.ت {offer.price || 0}</TableCell>
                        <TableCell>
                          <Chip
                            label={offer.status || 'تحت الدراسة'}
                            size="small"
                            color={offer.status === 'accepted' ? 'success' : 'default'}
                          />
                        </TableCell>
                        <TableCell>
                          <Button size="small" onClick={() => navigate(`/my-offers`)}>عرض</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Box>
            )}
          </Paper>
        );

      case 'catalog':
        return (
          <Paper elevation={0} sx={{ backgroundColor: '#FFFFFF', border: '1px solid #e0e0e0', borderRadius: '8px', p: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>إدارة المنتجات والخدمات</Typography>
            <Divider sx={{ mb: 2 }} />
            <Stack spacing={2}>
              <Button variant="outlined" fullWidth onClick={() => navigate('/supplier-products')}>
                <Inventory2 sx={{ mr: 1 }} /> إدارة المنتجات
              </Button>
              <Button variant="outlined" fullWidth onClick={() => navigate('/supplier-services')}>
                إدارة الخدمات
              </Button>
              <Button variant="outlined" fullWidth onClick={() => navigate('/supplier-catalog')}>
                عرض الكتالوج
              </Button>
            </Stack>
          </Paper>
        );

      case 'finances':
        return (
          <Paper elevation={0} sx={{ backgroundColor: '#FFFFFF', border: '1px solid #e0e0e0', borderRadius: '8px', p: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>الفواتير والمدفوعات</Typography>
            <Divider sx={{ mb: 2 }} />
            <Stack spacing={2}>
              <Button variant="outlined" fullWidth onClick={() => navigate('/supplier-invoices')}>
                <FileDownload sx={{ mr: 1 }} /> الفواتير
              </Button>
              <Button variant="outlined" fullWidth onClick={() => navigate('/supplier-payments')}>
                <Money sx={{ mr: 1 }} /> المدفوعات
              </Button>
            </Stack>
          </Paper>
        );

      case 'reviews':
        return (
          <Paper elevation={0} sx={{ backgroundColor: '#FFFFFF', border: '1px solid #e0e0e0', borderRadius: '8px', p: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>التقييمات والآراء</Typography>
            <Divider sx={{ mb: 2 }} />
            <Button variant="contained" fullWidth onClick={() => navigate('/reviews')}>
              <Star sx={{ mr: 1 }} /> عرض التقييمات
            </Button>
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
        <Typography variant="h6" sx={{ fontWeight: 700, color: '#2e7d32' }}>لوحة التحكم</Typography>
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
              borderRight: activeSection === item.id ? '3px solid #2e7d32' : 'none',
              backgroundColor: activeSection === item.id ? '#f0fff0' : 'transparent',
              '&:hover': { backgroundColor: '#f0fff0' }
            }}
          >
            <ListItemIcon sx={{ minWidth: 40, color: activeSection === item.id ? '#2e7d32' : 'inherit' }}>
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

export default function SupplierDashboard() {
  return (
    <EnhancedErrorBoundary>
      <SupplierDashboardContent />
    </EnhancedErrorBoundary>
  );
}
