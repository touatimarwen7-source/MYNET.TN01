import { useEffect, useState } from 'react';
import { Container, Box, Card, CardContent, CardHeader, TextField, Button, Grid, Alert, Typography } from '@mui/material';
import { setPageTitle } from '../utils/pageTitle';

export default function InvoiceGeneration() {
  const [invoiceData, setInvoiceData] = useState({
    clientName: '', orderNumber: '', amount: '', description: ''
  });

  useEffect(() => {
    setPageTitle('إنشاء فاتورة');
  }, []);

  const handleChange = (e) => {
    setInvoiceData({ ...invoiceData, [e.target.name]: e.target.value });
  };

  const handleGenerate = () => {
    alert('تم إنشاء الفاتورة بنجاح');
  };

  return (
    <Box sx={{ backgroundColor: '#F9F9F9', paddingY: '40px', minHeight: '80vh' }}>
      <Container maxWidth="md">
        <Typography variant="h2" sx={{ fontSize: '32px', fontWeight: 600, color: '#0056B3', mb: 3 }}>
          إنشاء فاتورة
        </Typography>
        <Card sx={{ border: '1px solid #E0E0E0' }}>
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField fullWidth label="اسم العميل" name="clientName" value={invoiceData.clientName} onChange={handleChange} />
              </Grid>
              <Grid item xs={12}>
                <TextField fullWidth label="رقم الطلب" name="orderNumber" value={invoiceData.orderNumber} onChange={handleChange} />
              </Grid>
              <Grid item xs={12}>
                <TextField fullWidth label="المبلغ (دينار)" name="amount" type="number" value={invoiceData.amount} onChange={handleChange} />
              </Grid>
              <Grid item xs={12}>
                <TextField fullWidth label="الوصف" name="description" multiline rows={4} value={invoiceData.description} onChange={handleChange} />
              </Grid>
              <Grid item xs={12}>
                <Button variant="contained" fullWidth sx={{ backgroundColor: '#0056B3' }} onClick={handleGenerate}>
                  إنشاء الفاتورة
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}
