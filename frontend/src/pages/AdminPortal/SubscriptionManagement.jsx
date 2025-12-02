/**
 * Subscription Management - إدارة خطط الاشتراك
 * إدارة متقدمة للخطط والاشتراكات
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Switch,
  FormControlLabel,
  Alert,
  IconButton,
  Tooltip,
} from '@mui/material';
import { Add, Edit, Delete, Check } from '@mui/icons-material';
import institutionalTheme from '../../theme/theme';

const THEME = institutionalTheme;

export default function SubscriptionManagement() {
  const [plans] = useState([
    { id: 1, name: 'الخطة الأساسية', price: 99, users: 10, offers: 50, features: 15 },
    { id: 2, name: 'الخطة المتوسطة', price: 299, users: 50, offers: 500, features: 30 },
    {
      id: 3,
      name: 'الخطة الاحترافية',
      price: 999,
      users: 'غير محدود',
      offers: 'غير محدود',
      features: 'الكل',
    },
  ]);

  const [subscriptions] = useState([
    {
      id: 1,
      company: 'شركة الأمل',
      plan: 'الخطة المتوسطة',
      active_users: 35,
      renewal_date: '2025-04-26',
    },
    {
      id: 2,
      company: 'شركة النجاح',
      plan: 'الخطة الأساسية',
      active_users: 8,
      renewal_date: '2025-02-15',
    },
  ]);

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#F9F9F9', paddingY: 4 }}>
      <Container maxWidth="xl">
        <Stack spacing={3}>
          {/* الرأس */}
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="h5" sx={{ fontWeight: 700, color: THEME.palette.primary.main }}>
              إدارة خطط الاشتراك
            </Typography>
            <Button variant="contained" startIcon={<Add />}>
              خطة جديدة
            </Button>
          </Stack>

          {/* الخطط المتاحة */}
          <Grid xs={12} spacing={3} container>
            {plans.map((plan) => (
              <Grid xs={12} md={4} key={plan.id}>
                <Card
                  sx={{
                    backgroundColor: '#FFFFFF',
                    border: '2px solid #0056B3',
                    borderRadius: '12px',
                  }}
                >
                  <CardContent>
                    <Stack spacing={2}>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {plan.name}
                      </Typography>
                      <Typography
                        variant="h4"
                        sx={{ color: THEME.palette.primary.main, fontWeight: 700 }}
                      >
                        د.ت {plan.price}
                        <Typography component="span" variant="body2" sx={{ fontWeight: 400 }}>
                          {' '}
                          / شهر
                        </Typography>
                      </Typography>
                      <Stack spacing={1}>
                        <Typography variant="body2">👥 {plan.users} مستخدم</Typography>
                        <Typography variant="body2">📋 {plan.offers} أجل</Typography>
                        <Typography variant="body2">✨ {plan.features} ميزة</Typography>
                      </Stack>
                      <Stack direction="row" spacing={1}>
                        <Button size="small" variant="outlined" startIcon={<Edit />}>
                          تعديل
                        </Button>
                        <Button
                          size="small"
                          variant="outlined"
                          color="error"
                          startIcon={<Delete />}
                        >
                          حذف
                        </Button>
                      </Stack>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* الاشتراكات النشطة */}
          <Card
            sx={{ backgroundColor: '#FFFFFF', border: '1px solid #e0e0e0', borderRadius: '8px' }}
          >
            <CardHeader title="الاشتراكات النشطة" />
            <CardContent>
              <Box sx={{ overflowX: 'auto' }}>
                <Table>
                  <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 600 }}>الشركة</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>الخطة</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>المستخدمون النشطون</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>تاريخ التجديد</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>الإجراءات</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {subscriptions.map((sub) => (
                      <TableRow key={sub.id}>
                        <TableCell>{sub.company}</TableCell>
                        <TableCell>
                          <Chip label={sub.plan} size="small" variant="outlined" />
                        </TableCell>
                        <TableCell>{sub.active_users}</TableCell>
                        <TableCell>{sub.renewal_date}</TableCell>
                        <TableCell>
                          <Button size="small">تفاصيل</Button>
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
