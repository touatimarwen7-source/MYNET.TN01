/**
 * لوحة تحكم المزود - Supplier Dashboard
 * واجهة احترافية عالمية للموردين
 * @component
 */

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import institutionalTheme from '../theme/theme';
import { useNavigate } from 'react-router-dom';
import {
  Container, Box, Card, CardContent, Grid, Button, Typography, Table, TableHead, TableBody,
  TableRow, TableCell, Chip, Tabs, Tab, Alert, Avatar, Stack, Badge, Tooltip, Rating,
  IconButton, Paper, LinearProgress, Divider, CircularProgress
} from '@mui/material';
import {
  Add, Visibility, Edit, Delete, TrendingUp, CheckCircle, Clock, Warning,
  Send, Download, Refresh, Share, MoreVert
} from '@mui/icons-material';
import { procurementAPI } from '../api';
import { setPageTitle } from '../utils/pageTitle';
import { logger } from '../utils/logger';
import EnhancedErrorBoundary from '../components/EnhancedErrorBoundary';
import { InfoCard } from '../components/ProfessionalComponents';

const THEME = institutionalTheme;

function SupplierDashboardContent() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [tabValue, setTabValue] = useState(0);
  const [tenders, setTenders] = useState([]);
  const [myOffers, setMyOffers] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const stats = [
    { label: 'الأجل المتاحة', value: String(tenders.length), change: 24, icon: Edit, color: '#0056B3' },
    { label: 'العروض المرسلة', value: String(myOffers.length), change: 18, icon: Send, color: '#2e7d32' },
    { label: 'معدل الفوز', value: String(myOffers.filter(o => o.status === 'accepted').length || 0), change: 12, icon: TrendingUp, color: '#f57c00' },
    { label: 'الإيرادات الشهرية', value: 'د.ت 450K', change: 31, icon: CheckCircle, color: '#0288d1' },
  ];

  const activeTenders = tenders.slice(0, 3).map(t => ({
    id: t.id,
    title: t.title || 'مناقصة',
    buyer: 'مشتري',
    budget: `د.ت ${t.budget_max || 0}`,
    deadline: new Date(t.created_at).toLocaleDateString('ar-TN'),
    status: t.status === 'open' ? 'متاحة' : 'مغلقة'
  }));

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#F9F9F9', paddingY: 4 }}>
      <Container maxWidth="xl">
        {/* الرأس */}
        <Paper elevation={0} sx={{
          background: 'linear-gradient(135deg, #2e7d32 0%, #1b5e20 100%)',
          borderRadius: '12px',
          padding: '32px',
          marginBottom: '24px',
          color: 'white',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <Stack>
            <Typography variant="h5" sx={{ fontWeight: 700 }}>
              منصة التوريد الاحترافية
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.9)', mt: 0.5 }}>
              ابحث عن الفرص المربحة وقدم عروضك الفائزة
            </Typography>
          </Stack>
          <Button variant="contained" startIcon={<Send />} sx={{ backgroundColor: 'rgba(255,255,255,0.2)' }}>
            عرض جديد
          </Button>
        </Paper>

        {/* الإحصائيات الرئيسية */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          {stats.map((stat, idx) => (
            <Grid item xs={12} md={6} lg={3} key={idx}>
              <InfoCard {...stat} />
            </Grid>
          ))}
        </Grid>

        {/* التبويبات */}
        <Paper elevation={0} sx={{
          backgroundColor: '#FFFFFF',
          border: '1px solid #e0e0e0',
          borderRadius: '12px',
          overflow: 'hidden'
        }}>
          <Tabs
            value={tabValue}
            onChange={(e, v) => setTabValue(v)}
            sx={{
              borderBottom: '1px solid #e0e0e0',
              '& .MuiTab-root': { textTransform: 'none', fontWeight: 500 },
              '& .Mui-selected': { color: '#2e7d32', fontWeight: 700 }
            }}
          >
            <Tab label="🎯 الأجل المتاحة" />
            <Tab label="📤 عروضي" />
            <Tab label="📊 الأداء" />
            <Tab label="⭐ التقييمات" />
          </Tabs>

          <Box sx={{ padding: '24px' }}>
            {tabValue === 0 && (
              <Box sx={{ overflowX: 'auto' }}>
                <Table>
                  <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 600 }}>اسم المشروع</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>المشتري</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>الميزانية</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>الموعد</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>الحالة</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>الإجراء</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {activeTenders.map((tender) => (
                      <TableRow key={tender.id} sx={{ '&:hover': { backgroundColor: '#f9f9f9' } }}>
                        <TableCell sx={{ fontWeight: 500 }}>{tender.title}</TableCell>
                        <TableCell>{tender.buyer}</TableCell>
                        <TableCell><Chip label={tender.budget} size="small" variant="outlined" /></TableCell>
                        <TableCell>{tender.deadline}</TableCell>
                        <TableCell>
                          <Chip
                            label={tender.status}
                            size="small"
                            color={tender.status === 'متاحة' ? 'success' : 'warning'}
                            variant="filled"
                          />
                        </TableCell>
                        <TableCell>
                          <Button size="small" variant="contained" startIcon={<Send />}>
                            قدم عرض
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Box>
            )}

            {tabValue === 1 && (
              <Stack spacing={2}>
                {myOffers.map((offer) => (
                  <Paper key={offer.id} sx={{
                    p: 2,
                    backgroundColor: '#f9f9f9',
                    border: '1px solid #e0e0e0',
                    borderRadius: '8px',
                    transition: 'all 0.3s ease',
                    '&:hover': { boxShadow: '0 4px 12px rgba(46,125,50,0.15)' }
                  }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Stack flex={1}>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>{offer.tender}</Typography>
                        <Stack direction="row" spacing={1} sx={{ mt: 1 }} alignItems="center">
                          <Chip label={offer.amount} size="small" color="primary" variant="filled" />
                          <Chip label={offer.date} size="small" variant="outlined" />
                        </Stack>
                      </Stack>
                      <Stack alignItems="flex-end" spacing={1}>
                        <Chip
                          label={offer.status}
                          size="small"
                          color={offer.status === 'مقبول' ? 'success' : offer.status === 'مرفوض' ? 'error' : 'warning'}
                          variant="filled"
                        />
                        <Rating value={offer.rating / 5} readOnly size="small" />
                      </Stack>
                    </Stack>
                  </Paper>
                ))}
              </Stack>
            )}

            {tabValue === 2 && (
              <Grid container spacing={3}>
                <Grid item xs={12} lg={6}>
                  <Card sx={{ backgroundColor: '#FFFFFF', border: '1px solid #e0e0e0', borderRadius: '8px' }}>
                    <CardContent>
                      <Typography variant="body2" sx={{ fontWeight: 600, mb: 2 }}>معدل النجاح</Typography>
                      <Box sx={{ textAlign: 'center', py: 2 }}>
                        <CircularProgress
                          variant="determinate"
                          value={64}
                          size={80}
                          sx={{ color: '#2e7d32' }}
                        />
                        <Typography variant="h5" sx={{ fontWeight: 700, mt: 1, color: '#2e7d32' }}>64%</Typography>
                      </Box>
                      <Typography variant="caption" color="textSecondary" sx={{ display: 'block', textAlign: 'center' }}>
                        من 89 عرض مرسل
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} lg={6}>
                  <Card sx={{ backgroundColor: '#FFFFFF', border: '1px solid #e0e0e0', borderRadius: '8px' }}>
                    <CardContent>
                      <Typography variant="body2" sx={{ fontWeight: 600, mb: 2 }}>مؤشرات الأداء</Typography>
                      <Stack spacing={2}>
                        <Box>
                          <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
                            <Typography variant="caption">سرعة الاستجابة</Typography>
                            <Typography variant="caption" sx={{ fontWeight: 600 }}>92%</Typography>
                          </Stack>
                          <LinearProgress variant="determinate" value={92} sx={{ height: 6, borderRadius: '3px' }} />
                        </Box>
                        <Box>
                          <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
                            <Typography variant="caption">جودة العروض</Typography>
                            <Typography variant="caption" sx={{ fontWeight: 600 }}>88%</Typography>
                          </Stack>
                          <LinearProgress variant="determinate" value={88} sx={{ height: 6, borderRadius: '3px' }} />
                        </Box>
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            )}

            {tabValue === 3 && (
              <Stack spacing={2}>
                <Alert severity="success" sx={{ borderRadius: '8px' }}>
                  ⭐ متوسط التقييم: 4.8 من 5 • استنادا إلى 23 تقييم من المشترين
                </Alert>
                <Paper sx={{ p: 2, backgroundColor: '#f9f9f9', borderRadius: '8px' }}>
                  <Stack spacing={2}>
                    {[
                      { label: 'الاحترافية', value: 4.9 },
                      { label: 'التزام المواعيد', value: 4.8 },
                      { label: 'جودة الخدمة', value: 4.7 },
                      { label: 'التواصل', value: 4.9 }
                    ].map((rating, idx) => (
                      <Box key={idx}>
                        <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>{rating.label}</Typography>
                          <Typography variant="caption" sx={{ fontWeight: 600 }}>{rating.value}</Typography>
                        </Stack>
                        <LinearProgress
                          variant="determinate"
                          value={(rating.value / 5) * 100}
                          sx={{ height: 8, borderRadius: '4px' }}
                        />
                      </Box>
                    ))}
                  </Stack>
                </Paper>
              </Stack>
            )}
          </Box>
        </Paper>
      </Container>
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
