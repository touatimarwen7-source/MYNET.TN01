import { useEffect } from 'react';
import { Container, Box, Table, TableHead, TableBody, TableRow, TableCell, Paper, Button, Chip, Typography, Grid } from '@mui/material';
import TrackChangesIcon from '@mui/icons-material/TrackChanges';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import { setPageTitle } from '../utils/pageTitle';

export default function DeliveryManagement() {
  const deliveries = [
    { id: 1, order: 'ORD-001', status: 'قيد التسليم', location: 'تونس', date: '2024-11-22', eta: '2024-11-23' },
    { id: 2, order: 'ORD-002', status: 'تم التسليم', location: 'سوسة', date: '2024-11-20', eta: '2024-11-20' },
    { id: 3, order: 'ORD-003', status: 'قيد الانتظار', location: 'صفاقس', date: '2024-11-21', eta: '2024-11-24' }
  ];

  useEffect(() => {
    setPageTitle('إدارة التوصيل');
  }, []);

  const getStatusColor = (status) => {
    const colors = { 'تم التسليم': '#4caf50', 'قيد التسليم': '#2196f3', 'قيد الانتظار': '#ff9800' };
    return colors[status] || '#757575';
  };

  return (
    <Box sx={{ backgroundColor: '#F9F9F9', paddingY: '40px', minHeight: '80vh' }}>
      <Container maxWidth="lg">
        <Typography variant="h2" sx={{ fontSize: '32px', fontWeight: 600, color: '#0056B3', mb: 3 }}>
          إدارة التوصيل
        </Typography>
        <Paper sx={{ border: '1px solid #E0E0E0', borderRadius: '8px', overflow: 'hidden' }}>
          <Table>
            <TableHead sx={{ backgroundColor: '#F5F5F5' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 600, color: '#0056B3' }}>الطلب</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#0056B3' }}>الحالة</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#0056B3' }}>الموقع</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#0056B3' }}>التاريخ</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#0056B3' }}>التسليم المتوقع</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#0056B3' }} align="center">الإجراءات</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {deliveries.map((del) => (
                <TableRow key={del.id} sx={{ '&:hover': { backgroundColor: '#F9F9F9' } }}>
                  <TableCell>{del.order}</TableCell>
                  <TableCell>
                    <Chip label={del.status} size="small" sx={{ backgroundColor: getStatusColor(del.status) + '30', color: getStatusColor(del.status) }} />
                  </TableCell>
                  <TableCell>{del.location}</TableCell>
                  <TableCell>{del.date}</TableCell>
                  <TableCell>{del.eta}</TableCell>
                  <TableCell align="center">
                    <Button size="small" startIcon={<TrackChangesIcon />} sx={{ color: '#0056B3' }}>تتبع</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      </Container>
    </Box>
  );
}
