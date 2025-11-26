/**
 * Admin Assistant Management - إدارة المساعدين الإداريين
 * إدارة متقدمة للمساعدين بصلاحيات محدودة يحددها super_admin
 */

import { useState } from 'react';
import {
  Container, Box, Grid, Card, CardContent, CardHeader, Typography, Button, Stack,
  Chip, Table, TableHead, TableBody, TableRow, TableCell, Dialog, DialogTitle,
  DialogContent, DialogActions, TextField, FormControlLabel, Checkbox, Alert,
  IconButton, Tooltip, Avatar, Switch, Select, MenuItem, FormControl, InputLabel
} from '@mui/material';
import { Add, Edit, Delete, MoreVert, Refresh, Settings, Visibility } from '@mui/icons-material';
import institutionalTheme from '../../theme/theme';

const THEME = institutionalTheme;

// قائمة الصلاحيات المتاحة للمساعدين الإداريين
const AVAILABLE_PERMISSIONS = [
  {
    category: '📊 المراقبة والتقارير',
    permissions: [
      { id: 'view_dashboard', label: 'عرض لوحة المعلومات' },
      { id: 'view_analytics', label: 'عرض التحليلات' },
      { id: 'view_audit_logs', label: 'عرض سجلات التدقيق' },
      { id: 'view_reports', label: 'عرض التقارير' },
      { id: 'export_data', label: 'تصدير البيانات' }
    ]
  },
  {
    category: '👥 إدارة المستخدمين',
    permissions: [
      { id: 'view_users', label: 'عرض المستخدمين' },
      { id: 'manage_users', label: 'إدارة المستخدمين' },
      { id: 'block_users', label: 'حظر المستخدمين' }
    ]
  },
  {
    category: '📋 إدارة الأجل والعروض',
    permissions: [
      { id: 'view_tender', label: 'عرض الأجل' },
      { id: 'create_tender', label: 'إنشاء أجل' },
      { id: 'edit_tender', label: 'تعديل الأجل' },
      { id: 'delete_tender', label: 'حذف الأجل' },
      { id: 'publish_tender', label: 'نشر الأجل' },
      { id: 'close_tender', label: 'إغلاق الأجل' },
      { id: 'view_offer', label: 'عرض العروض' },
      { id: 'evaluate_offer', label: 'تقييم العروض' }
    ]
  },
  {
    category: '💼 إدارة الفواتير والعقود',
    permissions: [
      { id: 'view_purchase_order', label: 'عرض أوامر الشراء' },
      { id: 'create_purchase_order', label: 'إنشاء أوامر شراء' },
      { id: 'manage_invoices', label: 'إدارة الفواتير' }
    ]
  },
  {
    category: '⚙️ إعدادات النظام',
    permissions: [
      { id: 'manage_settings', label: 'إدارة الإعدادات' },
      { id: 'manage_backup', label: 'إدارة النسخ الاحتياطية' },
      { id: 'manage_subscriptions', label: 'إدارة الاشتراكات' },
      { id: 'send_notifications', label: 'إرسال الإخطارات' },
      { id: 'manage_security', label: 'إدارة الأمان' }
    ]
  }
];

export default function AdminAssistantManagement() {
  const [assistants] = useState([
    { id: 1, email: 'assistant1@mynet.tn', name: 'علي محمد', status: 'نشط', permissions: 5, createdDate: '2025-01-20' },
    { id: 2, email: 'assistant2@mynet.tn', name: 'سارة أحمد', status: 'نشط', permissions: 8, createdDate: '2025-01-15' },
  ]);

  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState('create'); // create or edit
  const [selectedAssistant, setSelectedAssistant] = useState(null);
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    permissions: []
  });

  const handleOpenCreate = () => {
    setDialogMode('create');
    setFormData({ email: '', name: '', permissions: [] });
    setOpenDialog(true);
  };

  const handleOpenEdit = (assistant) => {
    setDialogMode('edit');
    setSelectedAssistant(assistant);
    setFormData({
      email: assistant.email,
      name: assistant.name,
      permissions: assistant.permissions || []
    });
    setOpenDialog(true);
  };

  const handlePermissionChange = (permissionId) => {
    setFormData(prev => ({
      ...prev,
      permissions: prev.permissions.includes(permissionId)
        ? prev.permissions.filter(p => p !== permissionId)
        : [...prev.permissions, permissionId]
    }));
  };

  const handleSave = () => {
    // TODO: Send to backend
    setOpenDialog(false);
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#F9F9F9', paddingY: 4 }}>
      <Container maxWidth="xl">
        <Stack spacing={3}>
          {/* الرأس */}
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Stack>
              <Typography variant="h5" sx={{ fontWeight: 700, color: THEME.palette.primary.main }}>
                إدارة المساعدين الإداريين
              </Typography>
              <Typography variant="body2" color="textSecondary" sx={{ mt: 0.5 }}>
                أضف مساعدين بصلاحيات محدودة واجعلهم يساعدونك في إدارة المنصة
              </Typography>
            </Stack>
            <Button variant="contained" startIcon={<Add />} onClick={handleOpenCreate} size="large">
              مساعد جديد
            </Button>
          </Stack>

          {/* نصائح */}
          <Alert severity="info" sx={{ borderRadius: '8px' }}>
            💡 يمكنك إنشاء مساعدين إداريين وتحديد الصلاحيات التي يمكنهم الوصول إليها بدقة
          </Alert>

          {/* إحصائيات سريعة */}
          <Grid xs={12} spacing={2} container>
            <Grid xs={12} sm={6} md={3}>
              <Card sx={{ backgroundColor: '#FFFFFF', border: '1px solid #e0e0e0', borderRadius: '8px' }}>
                <CardContent>
                  <Typography color="textSecondary" variant="body2">إجمالي المساعدين</Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: THEME.palette.primary.main, mt: 1 }}>
                    {assistants.length}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid xs={12} sm={6} md={3}>
              <Card sx={{ backgroundColor: '#FFFFFF', border: '1px solid #e0e0e0', borderRadius: '8px' }}>
                <CardContent>
                  <Typography color="textSecondary" variant="body2">المساعدون النشطون</Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: '#2e7d32', mt: 1 }}>
                    {assistants.filter(a => a.status === 'نشط').length}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid xs={12} sm={6} md={3}>
              <Card sx={{ backgroundColor: '#FFFFFF', border: '1px solid #e0e0e0', borderRadius: '8px' }}>
                <CardContent>
                  <Typography color="textSecondary" variant="body2">متوسط الصلاحيات</Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: '#f57c00', mt: 1 }}>
                    {Math.round(assistants.reduce((sum, a) => sum + a.permissions, 0) / assistants.length) || 0}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid xs={12} sm={6} md={3}>
              <Card sx={{ backgroundColor: '#FFFFFF', border: '1px solid #e0e0e0', borderRadius: '8px' }}>
                <CardContent>
                  <Typography color="textSecondary" variant="body2">إجمالي الصلاحيات المتاحة</Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: '#7b1fa2', mt: 1 }}>
                    {AVAILABLE_PERMISSIONS.reduce((sum, cat) => sum + cat.permissions.length, 0)}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* جدول المساعدين */}
          <Card sx={{ backgroundColor: '#FFFFFF', border: '1px solid #e0e0e0', borderRadius: '8px' }}>
            <CardHeader title="المساعدون الإداريون" />
            <CardContent>
              <Box sx={{ overflowX: 'auto' }}>
                <Table>
                  <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 600 }}>البريد الإلكتروني</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>الاسم</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>عدد الصلاحيات</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>تاريخ الإنشاء</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>الحالة</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>الإجراءات</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {assistants.length > 0 ? (
                      assistants.map((assistant) => (
                        <TableRow key={assistant.id} sx={{ '&:hover': { backgroundColor: '#f9f9f9' } }}>
                          <TableCell>
                            <Stack direction="row" alignItems="center" spacing={1}>
                              <Avatar sx={{ width: 32, height: 32, fontSize: '14px' }}>{assistant.name[0]}</Avatar>
                              <Typography variant="body2">{assistant.email}</Typography>
                            </Stack>
                          </TableCell>
                          <TableCell>{assistant.name}</TableCell>
                          <TableCell>
                            <Chip
                              label={`${assistant.permissions} صلاحية`}
                              size="small"
                              color="primary"
                              variant="outlined"
                            />
                          </TableCell>
                          <TableCell>{assistant.createdDate}</TableCell>
                          <TableCell>
                            <Chip
                              label={assistant.status}
                              size="small"
                              color={assistant.status === 'نشط' ? 'success' : 'default'}
                              variant="filled"
                            />
                          </TableCell>
                          <TableCell>
                            <Stack direction="row" spacing={1}>
                              <Tooltip title="عرض وتعديل الصلاحيات">
                                <IconButton size="small" color="primary" onClick={() => handleOpenEdit(assistant)}>
                                  <Settings fontSize="small" />
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
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} sx={{ textAlign: 'center', py: 4 }}>
                          <Typography variant="body2" color="textSecondary">
                            لا توجد مساعدون حالياً. أنشئ واحداً الآن!
                          </Typography>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </Box>
            </CardContent>
          </Card>
        </Stack>
      </Container>

      {/* Dialog لإنشاء/تعديل مساعد */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ backgroundColor: THEME.palette.primary.main, color: 'white', fontWeight: 700 }}>
          {dialogMode === 'create' ? '➕ إضافة مساعد إداري جديد' : '✏️ تعديل صلاحيات المساعد'}
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <Stack spacing={3}>
            {/* معلومات المساعد */}
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>📧 معلومات المساعد</Typography>
              <Grid xs={12} spacing={2} container>
                <Grid xs={12}>
                  <TextField
                    fullWidth
                    label="البريد الإلكتروني"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    disabled={dialogMode === 'edit'}
                    placeholder="assistant@mynet.tn"
                  />
                </Grid>
                <Grid xs={12}>
                  <TextField
                    fullWidth
                    label="الاسم الكامل"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="أدخل اسم المساعد"
                  />
                </Grid>
              </Grid>
            </Box>

            {/* الصلاحيات */}
            <Box>
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>🔐 الصلاحيات</Typography>
                <Chip
                  label={`${formData.permissions.length} صلاحية محددة`}
                  size="small"
                  color="primary"
                  variant="outlined"
                />
              </Stack>

              <Stack spacing={2}>
                {AVAILABLE_PERMISSIONS.map((category, idx) => (
                  <Box key={idx}>
                    <Typography variant="body2" sx={{ fontWeight: 600, mb: 1, color: THEME.palette.primary.main }}>
                      {category.category}
                    </Typography>
                    <Stack spacing={1} sx={{ ml: 2 }}>
                      {category.permissions.map((perm) => (
                        <FormControlLabel
                          key={perm.id}
                          control={
                            <Checkbox
                              checked={formData.permissions.includes(perm.id)}
                              onChange={() => handlePermissionChange(perm.id)}
                            />
                          }
                          label={perm.label}
                        />
                      ))}
                    </Stack>
                  </Box>
                ))}
              </Stack>
            </Box>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setOpenDialog(false)}>إلغاء</Button>
          <Button variant="contained" onClick={handleSave}>
            {dialogMode === 'create' ? 'إنشاء المساعد' : 'حفظ التغييرات'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
