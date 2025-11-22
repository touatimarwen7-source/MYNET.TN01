import { useEffect } from 'react';
import { Container, Box, Card, CardContent, Grid, Typography, Button, List, ListItem } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import { setPageTitle } from '../utils/pageTitle';

export default function PricingPage() {
  const plans = [
    { name: 'الأساسي', price: 'مجاني', features: ['حتى 5 طلبات', 'دعم الأساس', 'تقارير بسيطة'] },
    { name: 'الاحترافي', price: '50 دينار', features: ['طلبات غير محدودة', 'دعم الأولوية', 'تقارير متقدمة'] },
    { name: 'المؤسسي', price: 'عرض خاص', features: ['كل الميزات', 'فريق مخصص', 'API مخصص'] }
  ];

  useEffect(() => {
    setPageTitle('الأسعار');
  }, []);

  return (
    <Box sx={{ backgroundColor: '#F9F9F9', paddingY: '40px', minHeight: '80vh' }}>
      <Container maxWidth="lg">
        <Typography variant="h2" sx={{ fontSize: '32px', fontWeight: 600, color: '#0056B3', mb: 3, textAlign: 'center' }}>
          خطط الأسعار
        </Typography>
        <Grid container spacing={3}>
          {plans.map((plan, idx) => (
            <Grid item xs={12} sm={6} md={4} key={idx}>
              <Card sx={{ border: '1px solid #E0E0E0', height: '100%' }}>
                <CardContent>
                  <Typography sx={{ fontSize: '20px', fontWeight: 600, mb: 1 }}>{plan.name}</Typography>
                  <Typography sx={{ fontSize: '24px', fontWeight: 600, color: '#0056B3', mb: 2 }}>{plan.price}</Typography>
                  <List dense>
                    {plan.features.map((f, fidx) => (
                      <ListItem key={fidx} disableGutters>
                        <CheckIcon sx={{ fontSize: 16, color: '#4caf50', mr: 1 }} />
                        {f}
                      </ListItem>
                    ))}
                  </List>
                  <Button variant="contained" fullWidth sx={{ backgroundColor: '#0056B3', mt: 2 }}>
                    اختيار
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
