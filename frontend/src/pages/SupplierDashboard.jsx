
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
  Stack,
} from '@mui/material';
import {
  LocalOffer as OfferIcon,
  Assessment as AnalyticsIcon,
  Inventory as ProductsIcon,
  Star as ReviewsIcon,
} from '@mui/icons-material';
import institutionalTheme from '../theme/theme';
import { setPageTitle } from '../utils/pageTitle';

export default function SupplierDashboard() {
  const navigate = useNavigate();

  useEffect(() => {
    setPageTitle('لوحة تحكم المورد');
  }, []);

  const stats = [
    { label: 'العروض المقدمة', value: 18, icon: OfferIcon, color: '#0056B3' },
    { label: 'المنتجات', value: 67, icon: ProductsIcon, color: '#2e7d32' },
    { label: 'التقييمات', value: 42, icon: ReviewsIcon, color: '#f57c00' },
    { label: 'معدل القبول', value: '73%', icon: AnalyticsIcon, color: '#1976d2' },
  ];

  const quickActions = [
    { label: 'تصفح المناقصات', path: '/tenders', color: 'primary' },
    { label: 'عروضي', path: '/my-offers', color: 'secondary' },
    { label: 'المنتجات', path: '/supplier-products', color: 'info' },
    { label: 'التحليلات', path: '/supplier-analytics', color: 'success' },
  ];

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, color: institutionalTheme.palette.primary.main, mb: 1 }}>
          لوحة تحكم المورد
        </Typography>
        <Typography variant="body2" color="textSecondary">
          إدارة عروضك ومنتجاتك بفعالية
        </Typography>
      </Box>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        {stats.map((stat, idx) => (
          <Grid item xs={12} sm={6} md={3} key={idx}>
            <Card sx={{ border: '1px solid #E0E0E0', boxShadow: 'none' }}>
              <CardContent>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Box>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: stat.color }}>
                      {stat.value}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {stat.label}
                    </Typography>
                  </Box>
                  <stat.icon sx={{ fontSize: 40, color: stat.color, opacity: 0.3 }} />
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Card sx={{ border: '1px solid #E0E0E0', boxShadow: 'none' }}>
        <CardContent>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
            إجراءات سريعة
          </Typography>
          <Grid container spacing={2}>
            {quickActions.map((action, idx) => (
              <Grid item xs={12} sm={6} md={3} key={idx}>
                <Button
                  fullWidth
                  variant="contained"
                  color={action.color}
                  onClick={() => navigate(action.path)}
                  sx={{ py: 1.5 }}
                >
                  {action.label}
                </Button>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>
    </Container>
  );
}
