import { useEffect } from 'react';
import { Container, Box, Card, CardContent, CardHeader, Grid, Typography, Button } from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import { setPageTitle } from '../utils/pageTitle';

export default function OfferAnalysis() {
  const analysis = [
    { title: 'متوسط الأسعار', value: '15,000 دينار', trend: 'up' },
    { title: 'أقل سعر', value: '5,000 دينار', trend: 'down' },
    { title: 'أعلى سعر', value: '100,000 دينار', trend: 'up' },
    { title: 'عدد العروض', value: '42', trend: 'up' }
  ];

  useEffect(() => {
    setPageTitle('تحليل العروض');
  }, []);

  return (
    <Box sx={{ backgroundColor: '#F9F9F9', paddingY: '40px', minHeight: '80vh' }}>
      <Container maxWidth="lg">
        <Typography variant="h2" sx={{ fontSize: '32px', fontWeight: 600, color: '#0056B3', mb: 3 }}>
          تحليل العروض
        </Typography>

        <Grid container spacing={2} sx={{ mb: 3 }}>
          {analysis.map((item, idx) => (
            <Grid item xs={12} sm={6} md={3} key={idx}>
              <Card sx={{ border: '1px solid #E0E0E0' }}>
                <CardContent>
                  <Typography sx={{ color: '#616161', fontSize: '12px' }}>{item.title}</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                    <Typography sx={{ fontWeight: 600, fontSize: '20px', color: '#0056B3', mr: 1 }}>
                      {item.value}
                    </Typography>
                    <TrendingUpIcon sx={{ color: item.trend === 'up' ? '#4caf50' : '#ff9800', fontSize: 20 }} />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Card sx={{ border: '1px solid #E0E0E0' }}>
          <CardHeader title="مقارنة العروض" action={<Button size="small" sx={{ color: '#0056B3' }}>تصدير</Button>} />
          <CardContent>
            <Typography sx={{ color: '#999' }}>جاري تحميل المخطط البياني...</Typography>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}
