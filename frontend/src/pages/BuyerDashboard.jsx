
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
  Chip,
} from '@mui/material';
import {
  Gavel as TenderIcon,
  Assessment as ReportsIcon,
  LocalOffer as OfferIcon,
  People as SuppliersIcon,
} from '@mui/icons-material';
import institutionalTheme from '../theme/theme';
import { setPageTitle } from '../utils/pageTitle';

export default function BuyerDashboard() {
  const navigate = useNavigate();

  useEffect(() => {
    setPageTitle('لوحة تحكم المشتري');
  }, []);

  const stats = [
    { label: 'المناقصات النشطة', value: 12, icon: TenderIcon, color: '#0056B3' },
    { label: 'العروض المستلمة', value: 47, icon: OfferIcon, color: '#2e7d32' },
    { label: 'التقارير', value: 8, icon: ReportsIcon, color: '#f57c00' },
    { label: 'الموردون', value: 23, icon: SuppliersIcon, color: '#1976d2' },
  ];

  const quickActions = [
    { label: 'إنشاء مناقصة جديدة', path: '/create-tender', color: 'primary' },
    { label: 'المناقصات النشطة', path: '/buyer-active-tenders', color: 'secondary' },
    { label: 'مقارنة العروض', path: '/tenders', color: 'info' },
    { label: 'التقارير المالية', path: '/financial-reports', color: 'success' },
  ];

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, color: institutionalTheme.palette.primary.main, mb: 1 }}>
          لوحة تحكم المشتري
        </Typography>
        <Typography variant="body2" color="textSecondary">
          إدارة المناقصات والعروض بكفاءة عالية
        </Typography>
      </Box>

      {/* Statistics Cards */}
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

      {/* Quick Actions */}
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
