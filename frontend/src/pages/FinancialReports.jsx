import { useEffect } from 'react';
import { Container, Box, Card, CardContent, CardHeader, Typography, Grid, Button, Table, TableHead, TableBody, TableRow, TableCell, Paper } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import { setPageTitle } from '../utils/pageTitle';

export default function FinancialReports() {
  const stats = [
    { label: 'إجمالي الإيرادات', value: '500,000 دينار' },
    { label: 'التكاليف الإدارية', value: '50,000 دينار' },
    { label: 'الربح الصافي', value: '450,000 دينار' },
    { label: 'المستحقات', value: '75,000 دينار' }
  ];

  const reports = [
    { name: 'تقرير الإيرادات', date: '2024-11-01', format: 'PDF' },
    { name: 'تقرير المصروفات', date: '2024-11-01', format: 'Excel' },
    { name: 'الكشف البنكي', date: '2024-11-22', format: 'PDF' }
  ];

  useEffect(() => {
    setPageTitle('التقارير المالية');
  }, []);

  return (
    <Box sx={{ backgroundColor: '#F9F9F9', paddingY: '40px', minHeight: '80vh' }}>
      <Container maxWidth="lg">
        <Typography variant="h2" sx={{ fontSize: '32px', fontWeight: 600, color: '#0056B3', mb: 3 }}>
          التقارير المالية
        </Typography>

        <Grid container spacing={2} sx={{ mb: 3 }}>
          {stats.map((stat, idx) => (
            <Grid item xs={12} sm={6} md={3} key={idx}>
              <Box sx={{ backgroundColor: '#FFF', p: 2, borderRadius: '8px', border: '1px solid #E0E0E0' }}>
                <Typography sx={{ color: '#616161', fontSize: '12px' }}>{stat.label}</Typography>
                <Typography sx={{ fontWeight: 600, fontSize: '20px', color: '#0056B3' }}>{stat.value}</Typography>
              </Box>
            </Grid>
          ))}
        </Grid>

        <Card sx={{ border: '1px solid #E0E0E0' }}>
          <CardHeader title="التقارير المتاحة" />
          <CardContent>
            <Paper sx={{ border: '1px solid #E0E0E0', overflow: 'hidden' }}>
              <Table>
                <TableHead sx={{ backgroundColor: '#F5F5F5' }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600, color: '#0056B3' }}>اسم التقرير</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#0056B3' }}>التاريخ</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#0056B3' }}>الصيغة</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#0056B3' }} align="center">تحميل</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {reports.map((r, idx) => (
                    <TableRow key={idx}>
                      <TableCell>{r.name}</TableCell>
                      <TableCell>{r.date}</TableCell>
                      <TableCell>{r.format}</TableCell>
                      <TableCell align="center">
                        <Button size="small" startIcon={<DownloadIcon />} sx={{ color: '#0056B3' }}>تحميل</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Paper>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}
