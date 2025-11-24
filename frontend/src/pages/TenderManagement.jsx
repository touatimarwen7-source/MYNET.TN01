import React, { useState, useEffect } from 'react';
import { Box, Card, CardContent, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Checkbox, FormControlLabel, Table, TableBody, TableCell, TableHead, TableRow, Typography, Alert, CircularProgress } from '@mui/material';
import axios from 'axios';
import { theme } from '../theme/theme';

export default function TenderManagement({ tenderId }) {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [awardDialogOpen, setAwardDialogOpen] = useState(false);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [selectedWinners, setSelectedWinners] = useState([]);
  const [cancellationReason, setCancellationReason] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchOffers();
  }, [tenderId]);

  const fetchOffers = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/tender-management/award-status/${tenderId}`);
      setOffers(response.data.status || []);
      setError(null);
    } catch (err) {
      setError('فشل في تحميل العروض');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectWinner = (offerId) => {
    setSelectedWinners(prev =>
      prev.includes(offerId) ? prev.filter(id => id !== offerId) : [...prev, offerId]
    );
  };

  const handleAwardWinners = async () => {
    if (selectedWinners.length === 0) {
      setError('يرجى اختيار فائز واحد على الأقل');
      return;
    }
    try {
      setLoading(true);
      await axios.post(`/api/tender-management/award-winners/${tenderId}`, { winnersIds: selectedWinners });
      setError(null);
      setSelectedWinners([]);
      setAwardDialogOpen(false);
      fetchOffers();
    } catch (err) {
      setError('فشل في تحديد الفائزين');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelTender = async () => {
    if (!cancellationReason.trim()) {
      setError('يرجى إدخال سبب الإلغاء');
      return;
    }
    try {
      setLoading(true);
      await axios.post(`/api/tender-management/cancel/${tenderId}`, { cancellationReason });
      setError(null);
      setCancellationReason('');
      setCancelDialogOpen(false);
    } catch (err) {
      setError('فشل في إلغاء المناقصة');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 3, direction: 'rtl' }}>
      <Typography variant="h5" sx={{ mb: 3, color: theme.palette.primary.main, fontWeight: 'bold' }}>
        📋 إدارة المناقصة
      </Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2 }}>
              🏆 اختيار الفائزين
            </Typography>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                  <TableCell sx={{ fontWeight: 'bold' }}>اختيار</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>رقم العرض</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>الشركة</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>النتيجة النهائية</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>الحالة</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {offers.map(offer => (
                  <TableRow key={offer.id}>
                    <TableCell>
                      <Checkbox checked={selectedWinners.includes(offer.id)} onChange={() => handleSelectWinner(offer.id)} />
                    </TableCell>
                    <TableCell>{offer.offer_number}</TableCell>
                    <TableCell>{offer.company_name}</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>{offer.final_score}</TableCell>
                    <TableCell>
                      {offer.award_status === 'awarded' ? (
                        <span style={{ color: '#4caf50', fontWeight: 'bold' }}>✓ فائز</span>
                      ) : (
                        'قيد الانتظار'
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
              <Button variant="contained" onClick={() => setAwardDialogOpen(true)} sx={{ backgroundColor: theme.palette.primary.main }}>
                تأكيد اختيار الفائزين
              </Button>
              <Button variant="outlined" onClick={() => setCancelDialogOpen(true)} sx={{ color: '#f44336', borderColor: '#f44336' }}>
                ⚠️ إلغاء المناقصة
              </Button>
            </Box>
          </CardContent>
        </Card>
      )}
      <Dialog open={awardDialogOpen} onClose={() => setAwardDialogOpen(false)}>
        <DialogTitle>تأكيد اختيار الفائزين</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Typography>
            هل تريد تأكيد اختيار {selectedWinners.length} فائز(ين) وإرسال إشعارات رسمية؟
          </Typography>
          <Alert severity="info" sx={{ mt: 2 }}>
            سيتم إرسال إخطار الترسية للفائزين وإخطارات عدم القبول للآخرين
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAwardDialogOpen(false)}>إلغاء</Button>
          <Button onClick={handleAwardWinners} variant="contained" sx={{ backgroundColor: theme.palette.primary.main }}>
            تأكيد
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={cancelDialogOpen} onClose={() => setCancelDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>إلغاء المناقصة</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Alert severity="warning" sx={{ mb: 2 }}>
            ⚠️ هذا الإجراء سيلغي المناقصة وسيتم إرسال إخطارات الإلغاء لجميع المزودين
          </Alert>
          <TextField fullWidth label="سبب الإلغاء" value={cancellationReason} onChange={(e) => setCancellationReason(e.target.value)} multiline rows={4} placeholder="أدخل سبب الإلغاء (إلزامي)" />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCancelDialogOpen(false)}>إغلاق</Button>
          <Button onClick={handleCancelTender} variant="contained" sx={{ backgroundColor: '#f44336' }}>
            إلغاء المناقصة
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
