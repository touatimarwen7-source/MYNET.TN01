import { useState, useEffect } from 'react';
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
  Alert,
  CircularProgress
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { setPageTitle } from '../utils/pageTitle';

export default function MyOffers() {
  const [offers, setOffers] = useState([
    { id: 1, tender: 'شراء مستلزمات مكتبية', price: 5000, status: 'مقبول', date: '2024-11-20' },
    { id: 2, tender: 'معدات تقنية', price: 75000, status: 'معلق', date: '2024-11-21' }
  ]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setPageTitle('عروضي');
  }, []);

  const getStatusColor = (status) => {
    const colors = { 'مقبول': '#4caf50', 'مرفوض': '#f44336', 'معلق': '#ff9800' };
    return colors[status] || '#757575';
  };

  return (
    <Box sx={{ backgroundColor: '#F9F9F9', paddingY: '40px', minHeight: '80vh' }}>
      <Container maxWidth="lg">
        <Typography variant="h2" sx={{ fontSize: '32px', fontWeight: 600, color: '#0056B3', mb: 3 }}>
          عروضي
        </Typography>
        {loading ? <CircularProgress /> : (
          <Paper sx={{ border: '1px solid #E0E0E0', borderRadius: '8px', overflow: 'hidden' }}>
            <Table>
              <TableHead sx={{ backgroundColor: '#F5F5F5' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600, color: '#0056B3' }}>الطلب</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#0056B3' }}>السعر</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#0056B3' }}>الحالة</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#0056B3' }}>التاريخ</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#0056B3' }} align="center">الإجراءات</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {offers.map((offer) => (
                  <TableRow key={offer.id} sx={{ '&:hover': { backgroundColor: '#F9F9F9' } }}>
                    <TableCell>{offer.tender}</TableCell>
                    <TableCell>{offer.price.toLocaleString()} دينار</TableCell>
                    <TableCell>
                      <Chip label={offer.status} size="small" sx={{ backgroundColor: getStatusColor(offer.status) + '30', color: getStatusColor(offer.status) }} />
                    </TableCell>
                    <TableCell>{offer.date}</TableCell>
                    <TableCell align="center">
                      <Button size="small" startIcon={<EditIcon />} sx={{ color: '#0056B3', mr: 1 }}>تعديل</Button>
                      <Button size="small" startIcon={<DeleteIcon />} sx={{ color: '#C62828' }}>حذف</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
        )}
      </Container>
    </Box>
  );
}
