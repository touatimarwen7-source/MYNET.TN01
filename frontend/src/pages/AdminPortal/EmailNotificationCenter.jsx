/**
 * Email Notification Center - مركز الإخطارات البريدية
 * إدارة متقدمة للإخطارات والرسائل البريدية
 */

import { useState } from 'react';
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
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TextField,
  Switch,
  FormControlLabel,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { Send, Check, Warning, Settings } from '@mui/icons-material';
import institutionalTheme from '../../theme/theme';

const THEME = institutionalTheme;

export default function EmailNotificationCenter() {
  const [notifications] = useState([
    {
      id: 1,
      recipient: 'buyers@example.com',
      subject: 'أجل جديد متاح',
      status: 'نجح',
      date: '2025-01-26 10:00',
    },
    {
      id: 2,
      recipient: 'suppliers@test.com',
      subject: 'طلب عرض جديد',
      status: 'نجح',
      date: '2025-01-26 09:30',
    },
    {
      id: 3,
      recipient: 'admin@mynet.tn',
      subject: 'تقرير يومي',
      status: 'قيد الانتظار',
      date: '2025-01-26 08:00',
    },
  ]);

  const [templates] = useState([
    { id: 1, name: 'الأجل الجديد', recipients: 1250, lastSent: '2025-01-25' },
    { id: 2, name: 'تنبيه العرض', recipients: 840, lastSent: '2025-01-24' },
    { id: 3, name: 'التذكير بالدفع', recipients: 320, lastSent: '2025-01-23' },
  ]);

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#F9F9F9', paddingY: 4 }}>
      <Container maxWidth="xl">
        <Stack spacing={3}>
          <Typography variant="h5" sx={{ fontWeight: 700, color: THEME.palette.primary.main }}>
            مركز الإخطارات البريدية
          </Typography>

          {/* الإحصائيات */}
          <Grid xs={12} spacing={2} container>
            <Grid xs={12} lg={6} lg={3}>
              <Card
                sx={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #e0e0e0',
                  borderRadius: '8px',
                }}
              >
                <CardContent>
                  <Typography color="textSecondary" variant="body2">
                    الإخطارات المرسلة
                  </Typography>
                  <Typography
                    variant="h4"
                    sx={{ fontWeight: 700, color: THEME.palette.primary.main, mt: 1 }}
                  >
                    12,547
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid xs={12} lg={6} lg={3}>
              <Card
                sx={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #e0e0e0',
                  borderRadius: '8px',
                }}
              >
                <CardContent>
                  <Typography color="textSecondary" variant="body2">
                    معدل الفتح
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: '#2e7d32', mt: 1 }}>
                    68%
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid xs={12} lg={6} lg={3}>
              <Card
                sx={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #e0e0e0',
                  borderRadius: '8px',
                }}
              >
                <CardContent>
                  <Typography color="textSecondary" variant="body2">
                    معدل النقر
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: '#f57c00', mt: 1 }}>
                    24%
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid xs={12} lg={6} lg={3}>
              <Card
                sx={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #e0e0e0',
                  borderRadius: '8px',
                }}
              >
                <CardContent>
                  <Typography color="textSecondary" variant="body2">
                    عدد الارتدادات
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: '#d32f2f', mt: 1 }}>
                    125
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* القوالب */}
          <Card
            sx={{ backgroundColor: '#FFFFFF', border: '1px solid #e0e0e0', borderRadius: '8px' }}
          >
            <CardHeader title="قوالب البريد الإلكتروني" />
            <CardContent>
              <Stack spacing={2}>
                {templates.map((template) => (
                  <Stack
                    key={template.id}
                    direction="row"
                    justifyContent="space-between"
                    sx={{ p: 2, border: '1px solid #e0e0e0', borderRadius: '4px' }}
                  >
                    <Stack>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {template.name}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        آخر إرسال: {template.lastSent}
                      </Typography>
                    </Stack>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Chip label={`${template.recipients} متلقي`} size="small" />
                      <Button size="small">تحرير</Button>
                      <Button size="small" color="success" startIcon={<Send />}>
                        إرسال الآن
                      </Button>
                    </Stack>
                  </Stack>
                ))}
              </Stack>
            </CardContent>
          </Card>

          {/* السجل */}
          <Card
            sx={{ backgroundColor: '#FFFFFF', border: '1px solid #e0e0e0', borderRadius: '8px' }}
          >
            <CardHeader title="سجل الإخطارات المرسلة" />
            <CardContent>
              <Box sx={{ overflowX: 'auto' }}>
                <Table>
                  <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 600 }}>المتلقي</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>الموضوع</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>التاريخ</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>الحالة</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {notifications.map((notif) => (
                      <TableRow key={notif.id}>
                        <TableCell>{notif.recipient}</TableCell>
                        <TableCell>{notif.subject}</TableCell>
                        <TableCell>{notif.date}</TableCell>
                        <TableCell>
                          <Chip
                            label={notif.status}
                            size="small"
                            color={notif.status === 'نجح' ? 'success' : 'warning'}
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
        </Stack>
      </Container>
    </Box>
  );
}
