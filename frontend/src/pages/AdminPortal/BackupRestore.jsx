/**
 * Backup & Restore - إدارة النسخ الاحتياطية
 * إدارة متقدمة للنسخ الاحتياطية واستعادة البيانات
 */

import { useState } from 'react';
import {
  Container, Box, Grid, Card, CardContent, CardHeader, Typography, Button, Stack,
  Chip, Table, TableHead, TableBody, TableRow, TableCell, Alert, LinearProgress,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField
} from '@mui/material';
import { CloudDownload, Restore, Schedule, CheckCircle, Warning, Info } from '@mui/icons-material';
import institutionalTheme from '../../theme/theme';

const THEME = institutionalTheme;

export default function BackupRestore() {
  const [backups] = useState([
    { id: 1, date: '2025-01-26 03:00', size: '2.4 GB', status: 'اكتمل', type: 'يومي' },
    { id: 2, date: '2025-01-25 03:00', size: '2.3 GB', status: 'اكتمل', type: 'يومي' },
    { id: 3, date: '2025-01-24 03:00', size: '2.3 GB', status: 'اكتمل', type: 'يومي' },
    { id: 4, date: '2025-01-21 00:00', size: '2.2 GB', status: 'اكتمل', type: 'أسبوعي' },
  ]);

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#F9F9F9', paddingY: 4 }}>
      <Container maxWidth="xl">
        <Stack spacing={3}>
          <Typography variant="h5" sx={{ fontWeight: 700, color: THEME.palette.primary.main }}>
            إدارة النسخ الاحتياطية واستعادة البيانات
          </Typography>

          {/* التنبيهات */}
          <Stack spacing={2}>
            <Alert severity="success" sx={{ borderRadius: '8px' }}>
              ✓ آخر نسخة احتياطية نجحت في: 26 يناير 2025 الساعة 03:00 صباحاً
            </Alert>
            <Alert severity="info" sx={{ borderRadius: '8px' }}>
              ℹ النسخ الاحتياطية التلقائية مفعلة يومياً الساعة 03:00 صباحاً
            </Alert>
          </Stack>

          {/* إجراءات سريعة */}
          <Grid xs={12} spacing={2} container>
            <Grid xs={12} sm={6} md={3}>
              <Card sx={{ backgroundColor: '#FFFFFF', border: '1px solid #e0e0e0', borderRadius: '8px' }}>
                <CardContent>
                  <Stack spacing={2}>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>إنشاء نسخة احتياطية الآن</Typography>
                    <Button fullWidth variant="contained" startIcon={<CloudDownload />}>
                      ابدأ الآن
                    </Button>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
            <Grid xs={12} sm={6} md={3}>
              <Card sx={{ backgroundColor: '#FFFFFF', border: '1px solid #e0e0e0', borderRadius: '8px' }}>
                <CardContent>
                  <Stack spacing={2}>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>استعادة من نسخة</Typography>
                    <Button fullWidth variant="outlined" startIcon={<Restore />}>
                      اختر نسخة
                    </Button>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
            <Grid xs={12} sm={6} md={3}>
              <Card sx={{ backgroundColor: '#FFFFFF', border: '1px solid #e0e0e0', borderRadius: '8px' }}>
                <CardContent>
                  <Stack spacing={2}>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>حجم البيانات</Typography>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: THEME.palette.primary.main }}>
                      125 GB
                    </Typography>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
            <Grid xs={12} sm={6} md={3}>
              <Card sx={{ backgroundColor: '#FFFFFF', border: '1px solid #e0e0e0', borderRadius: '8px' }}>
                <CardContent>
                  <Stack spacing={2}>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>التخزين المتاح</Typography>
                    <LinearProgress variant="determinate" value={68} />
                    <Typography variant="caption">68% من 500 GB</Typography>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* سجل النسخ الاحتياطية */}
          <Card sx={{ backgroundColor: '#FFFFFF', border: '1px solid #e0e0e0', borderRadius: '8px' }}>
            <CardHeader title="سجل النسخ الاحتياطية" />
            <CardContent>
              <Box sx={{ overflowX: 'auto' }}>
                <Table>
                  <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 600 }}>التاريخ والوقت</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>الحجم</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>النوع</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>الحالة</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>الإجراءات</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {backups.map((backup) => (
                      <TableRow key={backup.id} sx={{ '&:hover': { backgroundColor: '#f9f9f9' } }}>
                        <TableCell>{backup.date}</TableCell>
                        <TableCell>{backup.size}</TableCell>
                        <TableCell><Chip label={backup.type} size="small" variant="outlined" /></TableCell>
                        <TableCell>
                          <Chip
                            label={backup.status}
                            size="small"
                            color="success"
                            icon={<CheckCircle />}
                            variant="filled"
                          />
                        </TableCell>
                        <TableCell>
                          <Stack direction="row" spacing={1}>
                            <Button size="small">تحميل</Button>
                            <Button size="small" color="warning">استعادة</Button>
                          </Stack>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Box>
            </CardContent>
          </Card>

          {/* الإعدادات */}
          <Card sx={{ backgroundColor: '#FFFFFF', border: '1px solid #e0e0e0', borderRadius: '8px' }}>
            <CardHeader title="إعدادات النسخ الاحتياطية" />
            <CardContent>
              <Stack spacing={2}>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>جدول النسخ الاحتياطية</Typography>
                <Stack direction="row" spacing={1}>
                  <Chip label="يومي ✓" color="success" variant="filled" size="small" />
                  <Chip label="أسبوعي ✓" color="success" variant="filled" size="small" />
                  <Chip label="شهري ✓" color="success" variant="filled" size="small" />
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        </Stack>
      </Container>
    </Box>
  );
}
