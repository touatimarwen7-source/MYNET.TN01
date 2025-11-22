import { useEffect } from 'react';
import { Container, Box, Table, TableHead, TableBody, TableRow, TableCell, Paper, Button, Chip, Typography } from '@mui/material';
import { setPageTitle } from '../utils/pageTitle';

export default function DisputeManagement() {
  const disputes = [
    { id: 1, order: 'ORD-001', type: 'جودة المنتج', status: 'قيد المراجعة', date: '2024-11-20' },
    { id: 2, order: 'ORD-002', type: 'تأخير التسليم', status: 'مستحل', date: '2024-11-18' },
    { id: 3, order: 'ORD-003', type: 'عدم الاستقبال', status: 'قيد التحقيق', date: '2024-11-21' }
  ];

  useEffect(() => {
    setPageTitle('إدارة النزاعات');
  }, []);

  const getStatusColor = (status) => {
    const colors = { 'مستحل': '#4caf50', 'قيد المراجعة': '#ff9800', 'قيد التحقيق': '#2196f3', 'معلق': '#f44336' };
    return colors[status] || '#757575';
  };

  return (
    <Box sx={{ backgroundColor: '#F9F9F9', paddingY: '40px', minHeight: '80vh' }}>
      <Container maxWidth="lg">
        <Typography variant="h2" sx={{ fontSize: '32px', fontWeight: 600, color: '#0056B3', mb: 3 }}>
          إدارة النزاعات
        </Typography>
        <Paper sx={{ border: '1px solid #E0E0E0', borderRadius: '8px', overflow: 'hidden' }}>
          <Table>
            <TableHead sx={{ backgroundColor: '#F5F5F5' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 600, color: '#0056B3' }}>الطلب</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#0056B3' }}>النوع</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#0056B3' }}>الحالة</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#0056B3' }}>التاريخ</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#0056B3' }} align="center">الإجراء</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {disputes.map((d) => (
                <TableRow key={d.id} sx={{ '&:hover': { backgroundColor: '#F9F9F9' } }}>
                  <TableCell>{d.order}</TableCell>
                  <TableCell>{d.type}</TableCell>
                  <TableCell>
                    <Chip label={d.status} size="small" sx={{ backgroundColor: getStatusColor(d.status) + '30', color: getStatusColor(d.status) }} />
                  </TableCell>
                  <TableCell>{d.date}</TableCell>
                  <TableCell align="center">
                    <Button size="small" sx={{ color: '#0056B3' }}>التفاصيل</Button>
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
