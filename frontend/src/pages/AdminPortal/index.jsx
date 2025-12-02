/**
 * Admin Portal - واجهة الإدارة الرسمية المتقدمة
 * منصة إدارة احترافية عالمية بمواصفات عالية الجودة
 * @component
 */

import { useState, useEffect, useMemo } from 'react';
import institutionalTheme from '../../theme/theme';
import {
  Container,
  Box,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Typography,
  Button,
  Stack,
  Chip,
  Alert,
  Tabs,
  Tab,
  Paper,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Avatar,
  Divider,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Tooltip,
  Switch,
  FormControlLabel,
  Skeleton,
  CircularProgress,
  Rating,
  Badge,
} from '@mui/material';
import {
  Dashboard,
  People,
  Settings,
  Assessment,
  Security,
  Storage,
  Edit,
  Delete,
  Block,
  Check,
  Download,
  Upload,
  Refresh,
  Add,
  Close,
  TrendingUp,
  Visibility,
  Lock,
  BarChart,
  Warning,
  CheckCircle,
  Info,
  Email,
  Phone,
  MapPin,
  Calendar,
  Percent,
} from '@mui/icons-material';
import EnhancedErrorBoundary from '../../components/EnhancedErrorBoundary';

const THEME = institutionalTheme;

// ============ مكون إحصائية متقدمة ============
function AdvancedStatCard({ title, value, change, icon: Icon, color, trend, loading }) {
  return (
    <Card
      sx={{
        backgroundColor: '#FFFFFF',
        border: '1px solid #e0e0e0',
        borderRadius: '12px',
        overflow: 'hidden',
        transition: 'all 0.3s ease',
        '&:hover': { borderColor: color, boxShadow: `0 4px 12px ${color}15` },
      }}
    >
      <CardContent>
        <Stack spacing={2}>
          <Stack direction="row" justifyContent="space-between" alignItems="start">
            <Box flex={1}>
              <Typography variant="body2" color="textSecondary" sx={{ fontWeight: 500, mb: 1 }}>
                {title}
              </Typography>
              {loading ? (
                <Skeleton width={80} height={32} />
              ) : (
                <Typography variant="h4" sx={{ fontWeight: 700, color, mb: 1 }}>
                  {value}
                </Typography>
              )}
            </Box>
            <Avatar
              sx={{
                backgroundColor: `${color}15`,
                width: 48,
                height: 48,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Icon sx={{ color, fontSize: 24 }} />
            </Avatar>
          </Stack>
          {change && (
            <Stack direction="row" alignItems="center" spacing={0.5}>
              <TrendingUp
                sx={{
                  fontSize: 14,
                  color: change > 0 ? THEME.palette.success.main : THEME.palette.error.main,
                  transform: change < 0 ? 'scaleY(-1)' : 'none',
                }}
              />
              <Typography
                variant="caption"
                sx={{
                  color: change > 0 ? THEME.palette.success.main : THEME.palette.error.main,
                  fontWeight: 600,
                }}
              >
                {Math.abs(change)}% {change > 0 ? 'نمو' : 'انخفاض'} من الفترة السابقة
              </Typography>
            </Stack>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
}

// ============ لوحة معلومات متقدمة ============
function AdvancedDashboard() {
  const [loading] = useState(false);

  const stats = [
    {
      label: 'إجمالي المستخدمين النشطين',
      value: '3,847',
      change: 18,
      icon: People,
      color: '#0056B3',
    },
    { label: 'الأجل المُنشرة', value: '245', change: 24, icon: Assessment, color: '#2e7d32' },
    { label: 'العروض المُقيّمة', value: '892', change: -3, icon: TrendingUp, color: '#f57c00' },
    {
      label: 'الإيرادات الإجمالية',
      value: 'د.ت 12.5M',
      change: 35,
      icon: TrendingUp,
      color: '#7b1fa2',
    },
  ];

  const topUsers = [
    { rank: 1, name: 'شركة النجاح التجارية', role: 'مشتري', score: 98, status: 'نشط' },
    { rank: 2, name: 'فاطمة للتوريد والتجارة', role: 'موردّ', score: 95, status: 'نشط' },
    { rank: 3, name: 'أحمد محمد للاستيراد', role: 'مشتري', score: 92, status: 'نشط' },
  ];

  return (
    <Grid xs={12} spacing={3} container>
      {/* الإحصائيات الرئيسية */}
      {stats.map((stat, idx) => (
        <Grid xs={12} lg={6} lg={3} key={idx}>
          <AdvancedStatCard {...stat} loading={loading} />
        </Grid>
      ))}

      {/* أداء النظام */}
      <Grid xs={12} md={8}>
        <Card
          sx={{ backgroundColor: '#FFFFFF', border: '1px solid #e0e0e0', borderRadius: '12px' }}
        >
          <CardHeader title="أداء النظام والخوادم" action={<Refresh fontSize="small" />} />
          <CardContent>
            <Stack spacing={3}>
              {[
                { label: 'توفر الخادم الأساسي', value: 99.95, status: 'ممتاز' },
                { label: 'سرعة استجابة API', value: 87, status: 'سريع جداً' },
                { label: 'مساحة قاعدة البيانات', value: 68, status: 'جيد' },
                { label: 'استخدام الذاكرة', value: 52, status: 'متوازن' },
              ].map((metric, idx) => (
                <Box key={idx}>
                  <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {metric.label}
                      </Typography>
                      <Chip label={metric.status} size="small" variant="outlined" />
                    </Stack>
                    <Typography
                      variant="body2"
                      sx={{ fontWeight: 600, color: THEME.palette.primary.main }}
                    >
                      {metric.value}%
                    </Typography>
                  </Stack>
                  <LinearProgress
                    variant="determinate"
                    value={metric.value}
                    sx={{
                      height: 8,
                      borderRadius: '4px',
                      backgroundColor: '#e0e0e0',
                      '& .MuiLinearProgress-bar': {
                        borderRadius: '4px',
                        backgroundColor:
                          metric.value > 80 ? '#2e7d32' : metric.value > 50 ? '#f57c00' : '#d32f2f',
                      },
                    }}
                  />
                </Box>
              ))}
            </Stack>
          </CardContent>
        </Card>
      </Grid>

      {/* التنبيهات والإشعارات */}
      <Grid xs={12} md={4}>
        <Card
          sx={{ backgroundColor: '#FFFFFF', border: '1px solid #e0e0e0', borderRadius: '12px' }}
        >
          <CardHeader title="التنبيهات الذكية" />
          <CardContent>
            <Stack spacing={2}>
              {[
                {
                  icon: Warning,
                  color: '#f57c00',
                  title: 'تنبيه أداء',
                  desc: 'زيادة طلبات API بـ 45%',
                },
                {
                  icon: Info,
                  color: '#0288d1',
                  title: 'معلومة نظام',
                  desc: 'النسخة الاحتياطية نجحت',
                },
                {
                  icon: CheckCircle,
                  color: '#2e7d32',
                  title: 'إجراء مكتمل',
                  desc: 'صيانة النظام اكتملت',
                },
              ].map((alert, idx) => (
                <Stack
                  key={idx}
                  direction="row"
                  spacing={1.5}
                  sx={{
                    p: 1.5,
                    backgroundColor: '#f9f9f9',
                    border: '1px solid #e0e0e0',
                    borderRadius: '8px',
                  }}
                >
                  <alert.icon sx={{ color: alert.color, mt: 0.5 }} />
                  <Stack flex={1}>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {alert.title}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      {alert.desc}
                    </Typography>
                  </Stack>
                </Stack>
              ))}
            </Stack>
          </CardContent>
        </Card>
      </Grid>

      {/* أفضل المستخدمين */}
      <Grid xs={12}>
        <Card
          sx={{ backgroundColor: '#FFFFFF', border: '1px solid #e0e0e0', borderRadius: '12px' }}
        >
          <CardHeader title="أفضل المستخدمين النشطين" />
          <CardContent>
            <Box sx={{ overflowX: 'auto' }}>
              <Table>
                <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600 }}>الترتيب</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>اسم الشركة</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>الدور</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>التقييم</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>الحالة</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {topUsers.map((user) => (
                    <TableRow key={user.rank} sx={{ '&:hover': { backgroundColor: '#f9f9f9' } }}>
                      <TableCell>
                        <Badge
                          badgeContent={user.rank}
                          color="primary"
                          overlap="circular"
                          sx={{
                            '& .MuiBadge-badge': {
                              backgroundColor: THEME.palette.primary.main,
                              color: 'white',
                              fontWeight: 700,
                            },
                          }}
                        >
                          <Avatar
                            sx={{
                              width: 32,
                              height: 32,
                              backgroundColor: `${THEME.palette.primary.main}20`,
                            }}
                          >
                            {user.name[0]}
                          </Avatar>
                        </Badge>
                      </TableCell>
                      <TableCell sx={{ fontWeight: 500 }}>{user.name}</TableCell>
                      <TableCell>
                        <Chip
                          label={user.role === 'buyer' ? 'مشتري' : 'موردّ'}
                          size="small"
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>
                        <Stack direction="row" alignItems="center" spacing={0.5}>
                          <Rating value={user.score / 20} readOnly size="small" precision={0.5} />
                          <Typography variant="caption" sx={{ fontWeight: 600 }}>
                            {user.score}
                          </Typography>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={user.status}
                          size="small"
                          color="success"
                          icon={<CheckCircle />}
                          variant="filled"
                        />
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

// ============ إدارة المستخدمين المتقدمة ============
function AdvancedUserManagement() {
  const [users] = useState([
    {
      id: 1,
      email: 'buyer@mynet.tn',
      name: 'أحمد المشتري',
      role: 'buyer',
      status: 'نشط',
      joinDate: '2025-01-15',
      activities: 145,
    },
    {
      id: 2,
      email: 'supplier@tech.tn',
      name: 'فاطمة الموردة',
      role: 'supplier',
      status: 'نشط',
      joinDate: '2025-01-10',
      activities: 238,
    },
    {
      id: 3,
      email: 'assistant@mynet.tn',
      name: 'محمد المساعد',
      role: 'admin_assistant',
      status: 'نشط',
      joinDate: '2025-01-05',
      activities: 89,
    },
  ]);
  const [searchText, setSearchText] = useState('');

  const filtered = useMemo(() => {
    return users.filter(
      (u) => searchText === '' || u.email.includes(searchText) || u.name.includes(searchText)
    );
  }, [searchText]);

  return (
    <Grid xs={12} spacing={3} container>
      <Grid xs={12}>
        <Card
          sx={{ backgroundColor: '#FFFFFF', border: '1px solid #e0e0e0', borderRadius: '12px' }}
        >
          <CardHeader
            title="إدارة المستخدمين المتقدمة"
            action={
              <Button startIcon={<Add />} variant="contained" size="small">
                مستخدم جديد
              </Button>
            }
          />
          <CardContent>
            <Stack spacing={2} sx={{ mb: 3 }}>
              <TextField
                placeholder="ابحث بالبريد أو الاسم..."
                size="small"
                fullWidth
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                sx={{ backgroundColor: '#f9f9f9' }}
              />
            </Stack>

            <Box sx={{ overflowX: 'auto' }}>
              <Table>
                <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600 }}>البريد الإلكتروني</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>الاسم</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>الدور</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>النشاط</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>الحالة</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>الإجراءات</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filtered.map((user) => (
                    <TableRow key={user.id} sx={{ '&:hover': { backgroundColor: '#f9f9f9' } }}>
                      <TableCell>
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <Avatar sx={{ width: 32, height: 32 }}>{user.name[0]}</Avatar>
                          <Typography variant="body2">{user.email}</Typography>
                        </Stack>
                      </TableCell>
                      <TableCell sx={{ fontWeight: 500 }}>{user.name}</TableCell>
                      <TableCell>
                        <Chip
                          label={
                            user.role === 'buyer'
                              ? 'مشتري'
                              : user.role === 'supplier'
                                ? 'موردّ'
                                : 'مساعد إداري'
                          }
                          size="small"
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>
                        <Stack direction="row" alignItems="center" spacing={0.5}>
                          <TrendingUp sx={{ fontSize: 16, color: THEME.palette.primary.main }} />
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {user.activities}
                          </Typography>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Chip label={user.status} size="small" color="success" variant="filled" />
                      </TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={1}>
                          <Tooltip title="تعديل">
                            <IconButton size="small">
                              <Edit fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="حذف">
                            <IconButton size="small" color="error">
                              <Delete fontSize="small" />
                            </IconButton>
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

// ============ التقارير المتقدمة ============
function AdvancedReports() {
  const reports = [
    { name: 'تقرير الأداء الشامل', date: '2025-01-26', size: '4.2 MB', type: 'PDF', downloads: 24 },
    {
      name: 'تحليل المستخدمين والنشاط',
      date: '2025-01-25',
      size: '2.8 MB',
      type: 'Excel',
      downloads: 18,
    },
    {
      name: 'بيان الإيرادات والمبيعات',
      date: '2025-01-24',
      size: '5.1 MB',
      type: 'PDF',
      downloads: 31,
    },
  ];

  return (
    <Grid xs={12} spacing={3} container>
      <Grid xs={12}>
        <Card
          sx={{ backgroundColor: '#FFFFFF', border: '1px solid #e0e0e0', borderRadius: '12px' }}
        >
          <CardHeader title="التقارير المتقدمة" />
          <CardContent>
            <Stack spacing={2}>
              {reports.map((report, idx) => (
                <Stack
                  key={idx}
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  sx={{
                    p: 2,
                    backgroundColor: '#f9f9f9',
                    border: '1px solid #e0e0e0',
                    borderRadius: '8px',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      backgroundColor: '#f5f5f5',
                      borderColor: THEME.palette.primary.main,
                    },
                  }}
                >
                  <Stack flex={1}>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {report.name}
                    </Typography>
                    <Stack direction="row" spacing={1} sx={{ mt: 0.5 }}>
                      <Chip label={report.type} size="small" variant="outlined" />
                      <Chip label={report.date} size="small" variant="outlined" />
                      <Typography variant="caption" color="textSecondary">
                        {report.size}
                      </Typography>
                    </Stack>
                  </Stack>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Typography variant="caption" color="textSecondary">
                      {report.downloads} تحميل
                    </Typography>
                    <Button size="small" startIcon={<Download />} variant="contained">
                      تحميل
                    </Button>
                  </Stack>
                </Stack>
              ))}
            </Stack>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}

// ============ الإعدادات والأمان ============
function AdvancedSettings() {
  const [settings, setSettings] = useState({
    maintenanceMode: false,
    emailNotifications: true,
    autoBackup: true,
    twoFactorRequired: false,
  });

  return (
    <Grid xs={12} spacing={3} container>
      <Grid xs={12} lg={6}>
        <Card
          sx={{ backgroundColor: '#FFFFFF', border: '1px solid #e0e0e0', borderRadius: '12px' }}
        >
          <CardHeader title="إعدادات النظام" />
          <CardContent>
            <Stack spacing={2}>
              {[
                { label: 'وضع الصيانة', key: 'maintenanceMode' },
                { label: 'الإخطارات البريدية', key: 'emailNotifications' },
                { label: 'النسخ الاحتياطي التلقائي', key: 'autoBackup' },
                { label: 'إجبار المصادقة الثنائية', key: 'twoFactorRequired' },
              ].map((item) => (
                <FormControlLabel
                  key={item.key}
                  control={
                    <Switch
                      checked={settings[item.key]}
                      onChange={(e) => setSettings({ ...settings, [item.key]: e.target.checked })}
                    />
                  }
                  label={item.label}
                />
              ))}
              <Button variant="contained">حفظ الإعدادات</Button>
            </Stack>
          </CardContent>
        </Card>
      </Grid>

      <Grid xs={12} lg={6}>
        <Card
          sx={{ backgroundColor: '#FFFFFF', border: '1px solid #e0e0e0', borderRadius: '12px' }}
        >
          <CardHeader title="الأمان المتقدم" />
          <CardContent>
            <Stack spacing={2}>
              <Alert severity="success" sx={{ borderRadius: '8px' }}>
                ✓ التشفير: AES-256 نشط
              </Alert>
              <Alert severity="success" sx={{ borderRadius: '8px' }}>
                ✓ الشهادات: SSL/TLS صالحة
              </Alert>
              <Alert severity="success" sx={{ borderRadius: '8px' }}>
                ✓ النسخة الاحتياطية: آخر نسخة منذ ساعة واحدة
              </Alert>
              <Button variant="outlined" fullWidth startIcon={<Lock />}>
                إدارة مفاتيح الأمان
              </Button>
            </Stack>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}

// ============ المكون الرئيسي ============
function AdminPortalContent() {
  const [tab, setTab] = useState(0);

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#F9F9F9', paddingY: 4 }}>
      <Container maxWidth="xl">
        {/* الرأس المحترف */}
        <Paper
          elevation={0}
          sx={{
            background: 'linear-gradient(135deg, #0056B3 0%, #003d82 100%)',
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
                منصة الإدارة الرسمية المحترفة
              </Typography>
              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.9)' }}>
                مركز التحكم المركزي الشامل بمواصفات عالمية احترافية
              </Typography>
            </Stack>
          </Stack>
          <Button
            variant="contained"
            sx={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
            startIcon={<Refresh />}
          >
            تحديث فوري
          </Button>
        </Paper>

        {/* التنبيهات */}
        <Stack spacing={2} sx={{ mb: 3 }}>
          <Alert severity="success" sx={{ borderRadius: '8px' }} icon={<CheckCircle />}>
            ✓ جميع الأنظمة تعمل بأداء ممتاز • آخر مزامنة: الآن • الأمان: محمي بالكامل
          </Alert>
        </Stack>

        {/* التبويبات */}
        <Paper
          elevation={0}
          sx={{
            backgroundColor: '#FFFFFF',
            border: '1px solid #e0e0e0',
            borderRadius: '12px',
            overflow: 'hidden',
          }}
        >
          <Tabs
            value={tab}
            onChange={(e, v) => setTab(v)}
            sx={{
              borderBottom: '1px solid #e0e0e0',
              '& .MuiTab-root': { textTransform: 'none', fontWeight: 500, fontSize: '14px' },
              '& .Mui-selected': { color: THEME.palette.primary.main, fontWeight: 700 },
            }}
          >
            <Tab label="📊 لوحة المعلومات المتقدمة" />
            <Tab label="👥 إدارة المستخدمين" />
            <Tab label="📈 التقارير والتحليلات" />
            <Tab label="⚙️ الإعدادات والأمان" />
          </Tabs>

          <Box sx={{ padding: '24px' }}>
            {tab === 0 && <AdvancedDashboard />}
            {tab === 1 && <AdvancedUserManagement />}
            {tab === 2 && <AdvancedReports />}
            {tab === 3 && <AdvancedSettings />}
          </Box>
        </Paper>

        {/* التذييل المحترف */}
        <Stack sx={{ mt: 4, p: 2, backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
          <Typography
            variant="body2"
            sx={{ textAlign: 'center', color: 'textSecondary', fontWeight: 500 }}
          >
            MyNet.tn © 2025 • منصة احترافية B2B • آخر تحديث: {new Date().toLocaleString('ar-TN')}
          </Typography>
          <Typography variant="caption" sx={{ textAlign: 'center', color: 'textSecondary', mt: 1 }}>
            🔒 جميع البيانات محمية بتشفير AES-256 • 🛡️ الأمان من أولويات العمل
          </Typography>
        </Stack>
      </Container>
    </Box>
  );
}

export default function AdminPortal() {
  return (
    <EnhancedErrorBoundary>
      <AdminPortalContent />
    </EnhancedErrorBoundary>
  );
}
