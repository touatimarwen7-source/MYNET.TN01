import { useEffect } from 'react';
import { Container, Box, Card, CardContent, CardHeader, Grid, Typography, LinearProgress } from '@mui/material';
import { setPageTitle } from '../utils/pageTitle';

export default function PerformanceMonitoring() {
  const metrics = [
    { name: 'معدل استجابة الخادم', value: 95, target: 99 },
    { name: 'سرعة تحميل الصفحة', value: 87, target: 90 },
    { name: 'توفر النظام', value: 99.9, target: 99.9 },
    { name: 'استخدام الذاكرة', value: 62, target: 80 }
  ];

  useEffect(() => {
    setPageTitle('مراقبة الأداء');
  }, []);

  return (
    <Box sx={{ backgroundColor: '#F9F9F9', paddingY: '40px', minHeight: '80vh' }}>
      <Container maxWidth="lg">
        <Typography variant="h2" sx={{ fontSize: '32px', fontWeight: 600, color: '#0056B3', mb: 3 }}>
          مراقبة الأداء
        </Typography>

        <Grid container spacing={2}>
          {metrics.map((metric, idx) => (
            <Grid item xs={12} sm={6} key={idx}>
              <Card sx={{ border: '1px solid #E0E0E0' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography>{metric.name}</Typography>
                    <Typography sx={{ color: metric.value >= metric.target ? '#4caf50' : '#ff9800', fontWeight: 600 }}>
                      {metric.value}%
                    </Typography>
                  </Box>
                  <LinearProgress variant="determinate" value={metric.value} sx={{ height: '8px', borderRadius: '4px' }} />
                  <Typography variant="caption" sx={{ color: '#999', mt: 1, display: 'block' }}>
                    الهدف: {metric.target}%
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
