import { useEffect } from 'react';
import {
  Container,
  Box,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  Button,
  Chip,
  Typography,
  Grid
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { setPageTitle } from '../utils/pageTitle';

export default function InvoiceManagement() {
  const invoices = [
    { id: 'INV-001', amount: 50000, status: 'مدفوع', date: '2024-11-15', dueDate: '2024-11-20' },
    { id: 'INV-002', amount: 75000, status: 'معلق', date: '2024-11-18', dueDate: '2024-11-25' },
    { id: 'INV-003', amount: 35000, status: 'منتهي الصلاحية', date: '2024-11-10', dueDate: '2024-11-17' }
  ];

  useEffect(() => {
    setPageTitle('إدارة الفواتير');
  }, []);

  const getStatusColor = (status) => {
    const colors = { 'مدفوع': '#4caf50', 'معلق': '#ff9800', 'منتهي الصلاحية': '#f44336' };
    return colors[status] || '#757575';
  };

  return (
    <Box sx={{ backgroundColor: '#F9F9F9', paddingY: '40px', minHeight: '80vh' }}>
      <Container maxWidth="lg">
        <Typography variant="h2" sx={{ fontSize: '32px', fontWeight: 600, color: '#0056B3', mb: 3 }}>
          إدارة الفواتير
        </Typography>

        <Grid container spacing={2} sx={{ mb: 3 }}>
          {[
            { label: 'إجمالي الفواتير', value: '3' },
            { label: 'مدفوع', value: '160,000 دينار' },
            { label: 'معلق', value: '75,000 دينار' }
          ].map((stat, idx) => (
            <Grid item xs={12} sm={6} md={3} key={idx}>
              <Box sx={{ backgroundColor: '#FFF', p: 2, borderRadius: '8px', border: '1px solid #E0E0E0' }}>
                <Typography sx={{ color: '#616161', fontSize: '12px' }}>{stat.label}</Typography>
                <Typography sx={{ fontWeight: 600, fontSize: '20px', color: '#0056B3' }}>{stat.value}</Typography>
              </Box>
            </Grid>
          ))}
        </Grid>

        <Paper sx={{ border: '1px solid #E0E0E0', borderRadius: '8px', overflow: 'hidden' }}>
          <Table>
            <TableHead sx={{ backgroundColor: '#F5F5F5' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 600, color: '#0056B3' }}>رقم الفاتورة</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#0056B3' }}>المبلغ</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#0056B3' }}>الحالة</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#0056B3' }}>التاريخ</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#0056B3' }}>تاريخ الاستحقاق</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#0056B3' }} align="center">الإجراءات</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {invoices.map((inv) => (
                <TableRow key={inv.id} sx={{ '&:hover': { backgroundColor: '#F9F9F9' } }}>
                  <TableCell>{inv.id}</TableCell>
                  <TableCell>{inv.amount.toLocaleString()} دينار</TableCell>
                  <TableCell>
                    <Chip label={inv.status} size="small" sx={{ backgroundColor: getStatusColor(inv.status) + '30', color: getStatusColor(inv.status) }} />
                  </TableCell>
                  <TableCell>{inv.date}</TableCell>
                  <TableCell>{inv.dueDate}</TableCell>
                  <TableCell align="center">
                    <Button size="small" startIcon={<VisibilityIcon />} sx={{ color: '#0056B3', mr: 1 }}>عرض</Button>
                    <Button size="small" startIcon={<DownloadIcon />} sx={{ color: '#0056B3' }}>تحميل</Button>
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
