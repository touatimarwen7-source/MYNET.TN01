import { useEffect } from 'react';
import { Container, Box, Card, CardContent, CardHeader, Typography, LinearProgress, Grid } from '@mui/material';
import { setPageTitle } from '../utils/pageTitle';

export default function HealthMonitoring() {
  const systemStats = [
    { name: 'استخدام خادم قاعدة البيانات', value: 45 },
    { name: 'استخدام الذاكرة', value: 62 },
    { name: 'استخدام CPU', value: 28 },
    { name: 'سعة التخزين', value: 73 }
  ];

  useEffect(() => {
    setPageTitle('مراقبة الصحة');
  }, []);

  return (
    <Box sx={{ backgroundColor: '#F9F9F9', paddingY: '40px', minHeight: '80vh' }}>
      <Container maxWidth="lg">
        <Typography variant="h2" sx={{ fontSize: '32px', fontWeight: 600, color: '#0056B3', mb: 3 }}>
          مراقبة صحة النظام
        </Typography>

        <Grid container spacing={2}>
          {systemStats.map((stat, idx) => (
            <Grid item xs={12} key={idx}>
              <Card sx={{ border: '1px solid #E0E0E0' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography sx={{ fontWeight: 600 }}>{stat.name}</Typography>
                    <Typography sx={{ color: '#0056B3', fontWeight: 600 }}>{stat.value}%</Typography>
                  </Box>
                  <LinearProgress variant="determinate" value={stat.value} sx={{ height: '8px', borderRadius: '4px' }} />
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Card sx={{ border: '1px solid #E0E0E0', mt: 3 }}>
          <CardHeader title="معلومات النظام" />
          <CardContent>
            <Box>
              <Typography sx={{ mb: 1 }}><strong>الإصدار:</strong> v1.2.0</Typography>
              <Typography sx={{ mb: 1 }}><strong>حالة الخادم:</strong> <span style={{ color: '#4caf50', fontWeight: 600 }}>✓ متصل</span></Typography>
              <Typography sx={{ mb: 1 }}><strong>قاعدة البيانات:</strong> <span style={{ color: '#4caf50', fontWeight: 600 }}>✓ نشطة</span></Typography>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}
