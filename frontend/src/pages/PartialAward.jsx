import { useEffect } from 'react';
import { Container, Box, Card, CardContent, CardHeader, Grid, Typography, Button, TextField } from '@mui/material';
import { setPageTitle } from '../utils/pageTitle';

export default function PartialAward() {
  const offers = [
    { id: 1, supplier: 'supplier1@test.tn', amount: 5000, qty: 10, unit: 'قطعة' },
    { id: 2, supplier: 'supplier2@test.tn', amount: 4800, qty: 15, unit: 'قطعة' }
  ];

  useEffect(() => {
    setPageTitle('التخصيص الجزئي');
  }, []);

  return (
    <Box sx={{ backgroundColor: '#F9F9F9', paddingY: '40px', minHeight: '80vh' }}>
      <Container maxWidth="lg">
        <Typography variant="h2" sx={{ fontSize: '32px', fontWeight: 600, color: '#0056B3', mb: 3 }}>
          التخصيص الجزئي للطلب
        </Typography>
        <Grid container spacing={3}>
          {offers.map((offer) => (
            <Grid item xs={12} sm={6} key={offer.id}>
              <Card sx={{ border: '1px solid #E0E0E0' }}>
                <CardHeader title={offer.supplier} />
                <CardContent>
                  <Box sx={{ mb: 2 }}>
                    <Typography sx={{ color: '#616161', fontSize: '12px' }}>السعر:</Typography>
                    <Typography sx={{ fontWeight: 600, fontSize: '18px', color: '#0056B3' }}>{offer.amount} دينار</Typography>
                  </Box>
                  <TextField fullWidth label="الكمية المراد تخصيصها" type="number" defaultValue={offer.qty} size="small" />
                  <Button variant="contained" fullWidth sx={{ backgroundColor: '#0056B3', mt: 2 }}>
                    تخصيص
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
