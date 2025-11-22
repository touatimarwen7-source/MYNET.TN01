import { useEffect } from 'react';
import { Container, Box, Card, CardContent, CardHeader, Grid, Typography } from '@mui/material';
import { setPageTitle } from '../utils/pageTitle';

export default function FeaturesPage() {
  const features = [
    { title: 'سهل الاستخدام', desc: 'واجهة سهلة وبديهية للجميع' },
    { title: 'آمن وموثوق', desc: 'أعلى مستويات الأمان والحماية' },
    { title: 'دعم عربي', desc: 'دعم كامل للغة العربية' },
    { title: 'تقارير متقدمة', desc: 'تحليلات وتقارير شاملة' },
    { title: 'تكامل تام', desc: 'تكامل سلس مع الأنظمة الأخرى' },
    { title: 'دعم فني', desc: 'دعم فني متاح 24/7' }
  ];

  useEffect(() => {
    setPageTitle('الميزات');
  }, []);

  return (
    <Box sx={{ backgroundColor: '#F9F9F9', paddingY: '40px', minHeight: '80vh' }}>
      <Container maxWidth="lg">
        <Typography variant="h2" sx={{ fontSize: '32px', fontWeight: 600, color: '#0056B3', mb: 3, textAlign: 'center' }}>
          ميزاتنا
        </Typography>
        <Grid container spacing={3}>
          {features.map((f, idx) => (
            <Grid item xs={12} sm={6} md={4} key={idx}>
              <Card sx={{ border: '1px solid #E0E0E0', height: '100%' }}>
                <CardContent>
                  <Typography sx={{ fontSize: '18px', fontWeight: 600, mb: 1, color: '#0056B3' }}>{f.title}</Typography>
                  <Typography sx={{ color: '#616161' }}>{f.desc}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
