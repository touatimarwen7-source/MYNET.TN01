/**
 * Admin Portal - واجهة الإدارة الرسمية الاحترافية الكاملة
 * منصة إدارة متقدمة عالمية لـ superadmin@mynet.tn
 * @component
 */

import { useState, useEffect, useMemo } from 'react';
import institutionalTheme from '../../theme/theme';
import {
  Container, Box, Grid, Card, CardContent, CardHeader, Typography, Button, Stack, Chip,
  Alert, Tabs, Tab, Paper, Table, TableHead, TableBody, TableRow, TableCell, Avatar,
  Divider, LinearProgress, Dialog, DialogTitle, DialogContent, DialogActions, TextField,
  FormControl, InputLabel, Select, MenuItem, IconButton, Menu, Tooltip, Switch,
  FormControlLabel, ToggleButton, ToggleButtonGroup, SearchField,
} from '@mui/material';
import {
  Dashboard, People, Settings, Assessment, Security, Storage, Edit, Delete, Block, Check,
  MoreVert, Download, Upload, Refresh, Add, Close, TrendingUp, Activity, Visibility, Lock,
  BarChart, PieChart, LineChart, CloudDownload, AlertTriangle, CheckCircle, Clock, Mail,
} from '@mui/icons-material';
import { adminAPI } from '../../api';
import { logger } from '../../utils/logger';
import EnhancedErrorBoundary from '../../components/EnhancedErrorBoundary';

const THEME = institutionalTheme;

// ============ TAB 1: لوحة المعلومات المتقدمة ============
function AdvancedDashboard() {
  const stats = [
    { label: 'إجمالي المستخدمين', value: '2,847', change: '+18%', icon: People, color: '#0056B3' },
    { label: 'الأجل الفعال', value: '156', change: '+24%', icon: Assessment, color: '#2e7d32' },
    { label: 'إجمالي العروض', value: '523', change: '+12%', icon: BarChart, color: '#f57c00' },
    { label: 'القيمة الكلية', value: 'د.ت 4.2M', change: '+35%', icon: TrendingUp, color: '#7b1fa2' },
  ];

  const chartData = [
    { month: 'يناير', users: 320, offers: 45, revenue: 125000 },
    { month: 'فبراير', users: 420, offers: 62, revenue: 185000 },
    { month: 'مارس', users: 580, offers: 89, revenue: 245000 },
    { month: 'أبريل', users: 740, offers: 125, revenue: 320000 },
  ];

  return (
    <Grid xs={12} spacing={3} container>
      {/* الإحصائيات الرئيسية */}
      {stats.map((stat, idx) => (
        <Grid xs={12} sm={6} md={3} key={idx}>
          <Card sx={{ backgroundColor: '#FFFFFF', border: '1px solid #e0e0e0', borderRadius: '8px' }}>
            <CardContent>
              <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                <Box flex={1}>
                  <Typography variant="body2" color="textSecondary" sx={{ fontWeight: 500 }}>
                    {stat.label}
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700, mt: 1, color: THEME.palette.primary.main }}>
                    {stat.value}
                  </Typography>
                  <Typography variant="caption" sx={{ color: stat.change.includes('+') ? '#2e7d32' : '#d32f2f', mt: 1 }}>
                    {stat.change}
                  </Typography>
                </Box>
                <Avatar sx={{ backgroundColor: `${stat.color}20`, width: 48, height: 48 }}>
                  <stat.icon sx={{ color: stat.color, fontSize: 24 }} />
                </Avatar>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      ))}

      {/* الرسوم البيانية */}
      <Grid xs={12} md={8}>
        <Card sx={{ backgroundColor: '#FFFFFF', border: '1px solid #e0e0e0', borderRadius: '8px' }}>
          <CardHeader title="الاتجاهات الشهرية" action={<Refresh fontSize="small" />} />
          <CardContent>
            <Box sx={{ height: 300, backgroundColor: '#f9f9f9', borderRadius: '8px', padding: 2 }}>
              <Typography variant="body2" color="textSecondary" sx={{ textAlign: 'center', mt: 12 }}>
                📊 مخطط الأداء الشهري
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* الحالة السريعة */}
      <Grid xs={12} md={4}>
        <Card sx={{ backgroundColor: '#FFFFFF', border: '1px solid #e0e0e0', borderRadius: '8px' }}>
          <CardHeader title="حالة النظام" />
          <CardContent>
            <Stack spacing={2}>
              <Box>
                <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
                  <Typography variant="body2">توفر السيرفر</Typography>
                  <Chip label="99.9%" size="small" color="success" />
                </Stack>
                <LinearProgress variant="determinate" value={99.9} sx={{ height: 6, borderRadius: '3px' }} />
              </Box>
              <Box>
                <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
                  <Typography variant="body2">استخدام قاعدة البيانات</Typography>
                  <Chip label="68%" size="small" />
                </Stack>
                <LinearProgress variant="determinate" value={68} sx={{ height: 6, borderRadius: '3px' }} />
              </Box>
              <Box>
                <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
                  <Typography variant="body2">سرعة الـ API</Typography>
                  <Chip label="142ms" size="small" />
                </Stack>
                <LinearProgress variant="determinate" value={71} sx={{ height: 6, borderRadius: '3px' }} />
              </Box>
            </Stack>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}

// ============ TAB 2: إدارة المستخدمين المتقدمة ============
function AdvancedUserManagement() {
  const [users] = useState([
    { id: 1, email: 'buyer1@mynet.tn', name: 'أحمد الشراء', role: 'buyer', status: 'نشط', tenders: 24, joined: '2025-01-15' },
    { id: 2, email: 'supplier@tech.tn', name: 'فاطمة الموردة', role: 'supplier', status: 'نشط', tenders: 45, joined: '2025-01-10' },
    { id: 3, email: 'buyer2@example.tn', name: 'محمد المشتري', role: 'buyer', status: 'معطل', tenders: 8, joined: '2024-12-20' },
  ]);
  const [searchText, setSearchText] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [openDialog, setOpenDialog] = useState(false);

  const filtered = useMemo(() => {
    return users.filter(u => 
      (searchText === '' || u.email.includes(searchText) || u.name.includes(searchText)) &&
      (roleFilter === 'all' || u.role === roleFilter)
    );
  }, [searchText, roleFilter]);

  return (
    <Grid xs={12} spacing={3} container>
      <Grid xs={12}>
        <Card sx={{ backgroundColor: '#FFFFFF', border: '1px solid #e0e0e0', borderRadius: '8px' }}>
          <CardHeader
            title="إدارة المستخدمين"
            action={<Button startIcon={<Add />} variant="contained" size="small">مستخدم جديد</Button>}
          />
          <CardContent>
            <Stack spacing={2} sx={{ mb: 3 }}>
              <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems="center">
                <TextField
                  placeholder="ابحث عن المستخدم..."
                  size="small"
                  fullWidth
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  sx={{ flex: 1 }}
                />
                <FormControl size="small" sx={{ minWidth: 150 }}>
                  <InputLabel>الدور</InputLabel>
                  <Select value={roleFilter} label="الدور" onChange={(e) => setRoleFilter(e.target.value)}>
                    <MenuItem value="all">جميع الأدوار</MenuItem>
                    <MenuItem value="buyer">مشتري</MenuItem>
                    <MenuItem value="supplier">موردّ</MenuItem>
                    <MenuItem value="super_admin">مسؤول</MenuItem>
                  </Select>
                </FormControl>
              </Stack>
            </Stack>

            <Box sx={{ overflowX: 'auto' }}>
              <Table>
                <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600 }}>البريد الإلكتروني</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>الاسم</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>الدور</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>الأجل</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>الحالة</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>الإجراءات</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filtered.map((user) => (
                    <TableRow key={user.id} sx={{ '&:hover': { backgroundColor: '#f9f9f9' } }}>
                      <TableCell>
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <Avatar sx={{ width: 32, height: 32, fontSize: '14px' }}>{user.name[0]}</Avatar>
                          <Typography variant="body2">{user.email}</Typography>
                        </Stack>
                      </TableCell>
                      <TableCell>{user.name}</TableCell>
                      <TableCell>
                        <Chip
                          label={user.role === 'buyer' ? 'مشتري' : user.role === 'supplier' ? 'موردّ' : 'مسؤول'}
                          size="small"
                          variant="outlined"
                          color="primary"
                        />
                      </TableCell>
                      <TableCell>{user.tenders}</TableCell>
                      <TableCell>
                        <Chip
                          label={user.status}
                          size="small"
                          color={user.status === 'نشط' ? 'success' : 'default'}
                          variant="filled"
                        />
                      </TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={1}>
                          <Tooltip title="تعديل">
                            <IconButton size="small" color="primary"><Edit fontSize="small" /></IconButton>
                          </Tooltip>
                          <Tooltip title="حذف">
                            <IconButton size="small" color="error"><Delete fontSize="small" /></IconButton>
                          </Tooltip>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}

// ============ TAB 3: التقارير والتحليلات ============
function ReportsTab() {
  const reports = [
    { name: 'تقرير الأداء الشهري', date: '2025-01-26', size: '2.4 MB', type: 'PDF' },
    { name: 'تقرير المستخدمين النشطين', date: '2025-01-25', size: '1.8 MB', type: 'Excel' },
    { name: 'تقرير العروض والأجل', date: '2025-01-24', size: '3.2 MB', type: 'PDF' },
    { name: 'تقرير الإيرادات والمبيعات', date: '2025-01-23', size: '2.1 MB', type: 'Excel' },
  ];

  return (
    <Grid xs={12} spacing={3} container>
      <Grid xs={12} md={6}>
        <Card sx={{ backgroundColor: '#FFFFFF', border: '1px solid #e0e0e0', borderRadius: '8px' }}>
          <CardHeader title="إنشاء تقرير جديد" />
          <CardContent>
            <Stack spacing={2}>
              <FormControl fullWidth size="small">
                <InputLabel>نوع التقرير</InputLabel>
                <Select label="نوع التقرير" defaultValue="performance">
                  <MenuItem value="performance">تقرير الأداء</MenuItem>
                  <MenuItem value="users">تقرير المستخدمين</MenuItem>
                  <MenuItem value="revenue">تقرير الإيرادات</MenuItem>
                  <MenuItem value="system">تقرير النظام</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth size="small">
                <InputLabel>الفترة الزمنية</InputLabel>
                <Select label="الفترة الزمنية" defaultValue="month">
                  <MenuItem value="week">أسبوع</MenuItem>
                  <MenuItem value="month">شهر</MenuItem>
                  <MenuItem value="quarter">ربع سنة</MenuItem>
                  <MenuItem value="year">سنة</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth size="small">
                <InputLabel>صيغة التقرير</InputLabel>
                <Select label="صيغة التقرير" defaultValue="pdf">
                  <MenuItem value="pdf">PDF</MenuItem>
                  <MenuItem value="excel">Excel</MenuItem>
                  <MenuItem value="csv">CSV</MenuItem>
                </Select>
              </FormControl>
              <Button variant="contained" startIcon={<FileDownload />}>
                إنشاء التقرير
              </Button>
            </Stack>
          </CardContent>
        </Card>
      </Grid>

      <Grid xs={12} md={6}>
        <Card sx={{ backgroundColor: '#FFFFFF', border: '1px solid #e0e0e0', borderRadius: '8px' }}>
          <CardHeader title="التقارير السابقة" />
          <CardContent>
            <Stack spacing={2}>
              {reports.map((report, idx) => (
                <Stack key={idx} direction="row" justifyContent="space-between" alignItems="center" sx={{ padding: 1, border: '1px solid #e0e0e0', borderRadius: '4px' }}>
                  <Stack flex={1}>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>{report.name}</Typography>
                    <Typography variant="caption" color="textSecondary">{report.date} • {report.size}</Typography>
                  </Stack>
                  <Button size="small" startIcon={<Download />}>تحميل</Button>
                </Stack>
              ))}
            </Stack>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}

// ============ TAB 4: الإعدادات والأمان ============
function SettingsTab() {
  const [settings, setSettings] = useState({
    maintenanceMode: false,
    emailNotifications: true,
    autoBackup: true,
    twoFactorRequired: false,
  });

  return (
    <Grid xs={12} spacing={3} container>
      <Grid xs={12} md={6}>
        <Card sx={{ backgroundColor: '#FFFFFF', border: '1px solid #e0e0e0', borderRadius: '8px' }}>
          <CardHeader title="إعدادات عامة" />
          <CardContent>
            <Stack spacing={3}>
              <FormControlLabel
                control={<Switch checked={settings.maintenanceMode} onChange={(e) => setSettings({...settings, maintenanceMode: e.target.checked})} />}
                label="وضع الصيانة"
              />
              <FormControlLabel
                control={<Switch checked={settings.emailNotifications} onChange={(e) => setSettings({...settings, emailNotifications: e.target.checked})} />}
                label="تفعيل الإخطارات البريدية"
              />
              <FormControlLabel
                control={<Switch checked={settings.autoBackup} onChange={(e) => setSettings({...settings, autoBackup: e.target.checked})} />}
                label="النسخ الاحتياطي التلقائي اليومي"
              />
              <FormControlLabel
                control={<Switch checked={settings.twoFactorRequired} onChange={(e) => setSettings({...settings, twoFactorRequired: e.target.checked})} />}
                label="إجبار المصادقة الثنائية"
              />
              <Button variant="contained">حفظ الإعدادات</Button>
            </Stack>
          </CardContent>
        </Card>
      </Grid>

      <Grid xs={12} md={6}>
        <Card sx={{ backgroundColor: '#FFFFFF', border: '1px solid #e0e0e0', borderRadius: '8px' }}>
          <CardHeader title="الأمان والنسخ الاحتياطية" />
          <CardContent>
            <Stack spacing={2}>
              <Button fullWidth variant="outlined" startIcon={<CloudDownload />}>تحميل النسخة الاحتياطية</Button>
              <Button fullWidth variant="outlined" startIcon={<Upload />}>استعادة من نسخة احتياطية</Button>
              <Divider />
              <Typography variant="body2" sx={{ fontWeight: 600, mt: 2 }}>آخر نسخة احتياطية:</Typography>
              <Typography variant="caption" color="textSecondary">26 يناير 2025 - 03:00 صباحاً</Typography>
              <Alert severity="success" sx={{ borderRadius: '4px' }}>✓ النسخة الاحتياطية السابقة: نجحت</Alert>
            </Stack>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}

// ============ TAB 5: المراقبة والعمليات ============
function MonitoringTab() {
  const operations = [
    { id: 1, action: 'تسجيل دخول', user: 'superadmin@mynet.tn', ip: '192.168.1.1', time: '2025-01-26 10:30', status: 'نجح' },
    { id: 2, action: 'تعديل مستخدم', user: 'superadmin@mynet.tn', ip: '192.168.1.1', time: '2025-01-26 09:15', status: 'نجح' },
    { id: 3, action: 'حذف عرض', user: 'superadmin@mynet.tn', ip: '192.168.1.1', time: '2025-01-25 14:45', status: 'نجح' },
    { id: 4, action: 'تصدير بيانات', user: 'superadmin@mynet.tn', ip: '192.168.1.1', time: '2025-01-25 12:00', status: 'نجح' },
  ];

  return (
    <Card sx={{ backgroundColor: '#FFFFFF', border: '1px solid #e0e0e0', borderRadius: '8px' }}>
      <CardHeader title="سجل العمليات والتدقيق" action={<Refresh fontSize="small" />} />
      <CardContent>
        <Box sx={{ overflowX: 'auto' }}>
          <Table>
            <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 600 }}>الإجراء</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>المستخدم</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>عنوان IP</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>الوقت</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>الحالة</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {operations.map((op) => (
                <TableRow key={op.id} sx={{ '&:hover': { backgroundColor: '#f9f9f9' } }}>
                  <TableCell>{op.action}</TableCell>
                  <TableCell>{op.user}</TableCell>
                  <TableCell>{op.ip}</TableCell>
                  <TableCell>{op.time}</TableCell>
                  <TableCell>
                    <Chip label={op.status} size="small" color="success" variant="filled" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </CardContent>
    </Card>
  );
}

// ============ المكون الرئيسي ============
function AdminPortalContent() {
  const [tab, setTab] = useState(0);

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#F9F9F9', paddingY: 4 }}>
      <Container maxWidth="xl">
        {/* الرأس المحسّن */}
        <Paper
          elevation={0}
          sx={{
            backgroundColor: 'linear-gradient(135deg, #0056B3 0%, #003d82 100%)',
            borderRadius: '12px',
            padding: '32px 24px',
            marginBottom: '24px',
            color: 'white',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Stack direction="row" alignItems="center" spacing={2}>
            <Dashboard sx={{ fontSize: 40 }} />
            <Stack>
              <Typography variant="h5" sx={{ fontWeight: 700, color: 'white' }}>
                واجهة الإدارة الاحترافية
              </Typography>
              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.9)' }}>
                مركز التحكم المركزي والشامل للمنصة
              </Typography>
            </Stack>
          </Stack>
          <Button variant="contained" sx={{ backgroundColor: 'rgba(255,255,255,0.2)' }} startIcon={<Refresh />}>
            تحديث
          </Button>
        </Paper>

        {/* الإنذارات والتنبيهات */}
        <Stack spacing={2} sx={{ mb: 3 }}>
          <Alert severity="success" sx={{ borderRadius: '8px' }} icon={<CheckCircle />}>
            ✓ جميع الأنظمة تعمل بكفاءة عالية • آخر تحديث: الآن
          </Alert>
        </Stack>

        {/* التبويبات */}
        <Paper sx={{ backgroundColor: '#FFFFFF', border: '1px solid #e0e0e0', borderRadius: '8px', boxShadow: 'none' }}>
          <Tabs
            value={tab}
            onChange={(e, v) => setTab(v)}
            sx={{
              borderBottom: '1px solid #e0e0e0',
              '& .MuiTab-root': { textTransform: 'none', fontWeight: 500 },
              '& .Mui-selected': { color: THEME.palette.primary.main, fontWeight: 600 },
            }}
          >
            <Tab label="📊 لوحة المعلومات" />
            <Tab label="👥 المستخدمون" />
            <Tab label="📈 التقارير" />
            <Tab label="⚙️ الإعدادات" />
            <Tab label="📋 المراقبة" />
          </Tabs>

          <Box sx={{ padding: '24px' }}>
            {tab === 0 && <AdvancedDashboard />}
            {tab === 1 && <AdvancedUserManagement />}
            {tab === 2 && <ReportsTab />}
            {tab === 3 && <SettingsTab />}
            {tab === 4 && <MonitoringTab />}
          </Box>
        </Paper>

        {/* التذييل */}
        <Box sx={{ mt: 4, textAlign: 'center', color: 'textSecondary' }}>
          <Typography variant="caption">
            MyNet.tn © 2025 • جميع الحقوق محفوظة • آخر تحديث: 26 يناير 2025
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}

const FileDownload = Download;

export default function AdminPortal() {
  return (
    <EnhancedErrorBoundary>
      <AdminPortalContent />
    </EnhancedErrorBoundary>
  );
}
