import { useEffect } from 'react';
import { Container, Box, Table, TableHead, TableBody, TableRow, TableCell, Paper, Button, Chip, Typography } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { setPageTitle } from '../utils/pageTitle';

export default function MonitoringSubmissions() {
  const submissions = [
    { id: 1, user: 'supplier1@test.tn', offer: 'عرض #1', status: 'مقبول', date: '2024-11-20' },
    { id: 2, user: 'supplier2@test.tn', offer: 'عرض #2', status: 'قيد المراجعة', date: '2024-11-21' },
    { id: 3, user: 'supplier3@test.tn', offer: 'عرض #3', status: 'مرفوض', date: '2024-11-19' }
  ];

  useEffect(() => {
    setPageTitle('مراقبة التقديمات');
  }, []);

  const getStatusColor = (status) => {
    const colors = { 'مقبول': '#4caf50', 'قيد المراجعة': '#2196f3', 'مرفوض': '#f44336' };
    return colors[status] || '#999';
  };

  return (
    <Box sx={{ backgroundColor: '#F9F9F9', paddingY: '40px', minHeight: '80vh' }}>
      <Container maxWidth="lg">
        <Typography variant="h2" sx={{ fontSize: '32px', fontWeight: 600, color: '#0056B3', mb: 3 }}>
          مراقبة التقديمات
        </Typography>
        <Paper sx={{ border: '1px solid #E0E0E0', overflow: 'hidden' }}>
          <Table>
            <TableHead sx={{ backgroundColor: '#F5F5F5' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 600, color: '#0056B3' }}>المستخدم</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#0056B3' }}>العرض</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#0056B3' }}>الحالة</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#0056B3' }}>التاريخ</TableCell>
                <TableCell align="center" sx={{ fontWeight: 600, color: '#0056B3' }}>الإجراء</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {submissions.map((sub) => (
                <TableRow key={sub.id}>
                  <TableCell>{sub.user}</TableCell>
                  <TableCell>{sub.offer}</TableCell>
                  <TableCell>
                    <Chip label={sub.status} size="small" sx={{ backgroundColor: getStatusColor(sub.status) + '30', color: getStatusColor(sub.status) }} />
                  </TableCell>
                  <TableCell>{sub.date}</TableCell>
                  <TableCell align="center">
                    <Button size="small" startIcon={<VisibilityIcon />} sx={{ color: '#0056B3' }}>عرض</Button>
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
