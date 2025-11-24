import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  FileUpload,
  Alert,
  CircularProgress,
  Stepper,
  Step,
  StepLabel,
  Checkbox,
  FormControlLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  Paper,
} from '@mui/material';
import axios from 'axios';
import { theme } from '../theme/theme';

export default function OfferSubmission({ tenderId }) {
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [receipt, setReceipt] = useState(null);
  const [encryption, setEncryption] = useState(false);
  const [offerData, setOfferData] = useState({
    total_amount: '',
    delivery_time: '',
    payment_terms: '',
    technical_proposal: '',
    financial_proposal: '',
    technical_file: null,
    financial_file: null,
  });

  const steps = ['البيانات الأساسية', 'الملفات', 'المراجعة', 'التأكيد'];

  const handleFileUpload = (e, field) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setError('حجم الملف يتجاوز 10 MB');
        return;
      }
      setOfferData({ ...offerData, [field]: file });
      setError(null);
    }
  };

  const handleSubmit = async () => {
    if (!offerData.total_amount || !offerData.delivery_time) {
      setError('يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append('tender_id', tenderId);
      formData.append('total_amount', offerData.total_amount);
      formData.append('delivery_time', offerData.delivery_time);
      formData.append('payment_terms', offerData.payment_terms);
      formData.append('technical_proposal', offerData.technical_proposal);
      formData.append('financial_proposal', offerData.financial_proposal);

      if (offerData.technical_file) {
        formData.append('technical_file', offerData.technical_file);
      }
      if (offerData.financial_file) {
        formData.append('financial_file', offerData.financial_file);
      }
      if (encryption) {
        formData.append('encrypt', true);
      }

      const response = await axios.post(`/api/procurement/offers`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (response.data.success) {
        setReceipt(response.data.receipt);
        setSuccess(true);
        setStep(3);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'فشل في إرسال العرض');
    } finally {
      setLoading(false);
    }
  };

  const ReceiptCertificate = () => (
    <Paper sx={{ p: 3, backgroundColor: '#f0f7ff', borderRadius: '4px', direction: 'rtl' }}>
      <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: theme.palette.primary.main }}>
        📄 شهادة استقبال العرض - Certificat d'Dépôt
      </Typography>

      <Box sx={{ mb: 2, p: 2, backgroundColor: '#fff', borderRadius: '4px' }}>
        <Typography variant="body2" sx={{ mb: 1 }}>
          <strong>رقم الشهادة:</strong> {receipt?.receipt_number}
        </Typography>
        <Typography variant="body2" sx={{ mb: 1 }}>
          <strong>تاريخ الاستقبال:</strong> {new Date(receipt?.issued_at).toLocaleDateString('ar-TN')}
        </Typography>
        <Typography variant="body2" sx={{ mb: 1 }}>
          <strong>الوقت:</strong> {new Date(receipt?.issued_at).toLocaleTimeString('ar-TN')}
        </Typography>
        <Typography variant="body2" sx={{ mb: 1 }}>
          <strong>المناقصة:</strong> {receipt?.tender_number}
        </Typography>
        <Typography variant="body2">
          <strong>المبلغ الإجمالي:</strong> {receipt?.total_amount} TND
        </Typography>
      </Box>

      <Typography variant="body2" sx={{ mb: 2, color: '#666' }}>
        هذه الشهادة تثبت استقبال عرضك بنجاح. يرجى الاحتفاظ بها للمراجعة.
      </Typography>

      <Box sx={{ display: 'flex', gap: 1 }}>
        <Button
          variant="contained"
          sx={{ backgroundColor: theme.palette.primary.main }}
          onClick={() => {
            const element = document.createElement('a');
            element.href = `data:text/plain;charset=utf-8,${encodeURIComponent(JSON.stringify(receipt))}`;
            element.download = `${receipt?.receipt_number}.txt`;
            element.click();
          }}
        >
          تحميل الشهادة
        </Button>
        <Button variant="outlined">طباعة</Button>
      </Box>
    </Paper>
  );

  return (
    <Box sx={{ p: 3, direction: 'rtl' }}>
      <Typography variant="h5" sx={{ mb: 3, color: theme.palette.primary.main, fontWeight: 'bold' }}>
        📝 إرسال عرض جديد
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>تم إرسال عرضك بنجاح!</Alert>}

      <Stepper activeStep={step} sx={{ mb: 3 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      {step === 0 && (
        <Card>
          <CardContent>
            <TextField
              fullWidth
              label="المبلغ الإجمالي (TND)"
              type="number"
              value={offerData.total_amount}
              onChange={(e) => setOfferData({ ...offerData, total_amount: e.target.value })}
              margin="normal"
              variant="outlined"
            />
            <TextField
              fullWidth
              label="مدة التسليم"
              value={offerData.delivery_time}
              onChange={(e) => setOfferData({ ...offerData, delivery_time: e.target.value })}
              margin="normal"
              variant="outlined"
            />
            <TextField
              fullWidth
              label="شروط الدفع"
              value={offerData.payment_terms}
              onChange={(e) => setOfferData({ ...offerData, payment_terms: e.target.value })}
              margin="normal"
              variant="outlined"
              multiline
              rows={3}
            />
            <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
              <Button
                variant="contained"
                onClick={() => setStep(1)}
                sx={{ backgroundColor: theme.palette.primary.main }}
              >
                التالي
              </Button>
            </Box>
          </CardContent>
        </Card>
      )}

      {step === 1 && (
        <Card>
          <CardContent>
            <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 'bold' }}>
              📄 الملفات المطلوبة
            </Typography>

            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" sx={{ mb: 1 }}>
                العرض الفني
              </Typography>
              <Button
                variant="outlined"
                component="label"
                sx={{ mb: 1, width: '100%' }}
              >
                اختر ملف PDF
                <input
                  hidden
                  accept=".pdf,.doc,.docx"
                  type="file"
                  onChange={(e) => handleFileUpload(e, 'technical_file')}
                />
              </Button>
              {offerData.technical_file && (
                <Typography variant="caption" sx={{ color: theme.palette.primary.main }}>
                  ✓ {offerData.technical_file.name}
                </Typography>
              )}
            </Box>

            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" sx={{ mb: 1 }}>
                العرض المالي
              </Typography>
              <Button
                variant="outlined"
                component="label"
                sx={{ mb: 1, width: '100%' }}
              >
                اختر ملف Excel
                <input
                  hidden
                  accept=".xlsx,.xls,.csv"
                  type="file"
                  onChange={(e) => handleFileUpload(e, 'financial_file')}
                />
              </Button>
              {offerData.financial_file && (
                <Typography variant="caption" sx={{ color: theme.palette.primary.main }}>
                  ✓ {offerData.financial_file.name}
                </Typography>
              )}
            </Box>

            <FormControlLabel
              control={
                <Checkbox
                  checked={encryption}
                  onChange={(e) => setEncryption(e.target.checked)}
                />
              }
              label="تشفير العروض (اختياري)"
            />

            <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
              <Button onClick={() => setStep(0)}>السابق</Button>
              <Button
                variant="contained"
                onClick={() => setStep(2)}
                sx={{ backgroundColor: theme.palette.primary.main }}
              >
                التالي
              </Button>
            </Box>
          </CardContent>
        </Card>
      )}

      {step === 2 && (
        <Card>
          <CardContent>
            <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 'bold' }}>
              ✓ المراجعة النهائية
            </Typography>

            <Box sx={{ mb: 2, p: 2, backgroundColor: '#f5f5f5' }}>
              <Typography variant="body2">
                <strong>المبلغ:</strong> {offerData.total_amount} TND
              </Typography>
              <Typography variant="body2">
                <strong>مدة التسليم:</strong> {offerData.delivery_time}
              </Typography>
              <Typography variant="body2">
                <strong>شروط الدفع:</strong> {offerData.payment_terms}
              </Typography>
              <Typography variant="body2">
                <strong>تشفير:</strong> {encryption ? 'نعم' : 'لا'}
              </Typography>
            </Box>

            <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
              <Button onClick={() => setStep(1)}>السابق</Button>
              <Button
                variant="contained"
                onClick={handleSubmit}
                disabled={loading}
                sx={{ backgroundColor: theme.palette.primary.main }}
              >
                {loading ? <CircularProgress size={24} /> : 'إرسال العرض بشكل نهائي'}
              </Button>
            </Box>
          </CardContent>
        </Card>
      )}

      {step === 3 && receipt && <ReceiptCertificate />}
    </Box>
  );
}
