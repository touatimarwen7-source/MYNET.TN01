import { useEffect, useState } from 'react';
import { Container, Box, Card, CardContent, CardHeader, Typography, Button, TextField, Alert, List, ListItem, ListItemText } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { setPageTitle } from '../utils/pageTitle';

export default function MFASetup() {
  const [mfaEnabled, setMfaEnabled] = useState(false);

  useEffect(() => {
    setPageTitle('إعداد المصادقة ثنائية');
  }, []);

  return (
    <Box sx={{ backgroundColor: '#F9F9F9', paddingY: '40px', minHeight: '80vh' }}>
      <Container maxWidth="md">
        <Typography variant="h2" sx={{ fontSize: '32px', fontWeight: 600, color: '#0056B3', mb: 3 }}>
          المصادقة ثنائية العامل
        </Typography>

        <Card sx={{ border: '1px solid #E0E0E0', mb: 3 }}>
          <CardHeader title={mfaEnabled ? 'المصادقة مفعلة' : 'تفعيل المصادقة ثنائية'} />
          <CardContent>
            {mfaEnabled ? (
              <Alert severity="success" sx={{ display: 'flex', alignItems: 'center' }}>
                <CheckCircleIcon sx={{ mr: 1, color: '#4caf50' }} />
                تم تفعيل المصادقة ثنائية العامل بنجاح
              </Alert>
            ) : (
              <Box>
                <Typography sx={{ mb: 2 }}>استخدم تطبيق المصادقة (Google Authenticator, Authy) لتفعيل المصادقة ثنائية العامل:</Typography>
                <Box sx={{ backgroundColor: '#F5F5F5', p: 2, borderRadius: '8px', mb: 2, textAlign: 'center' }}>
                  <Typography sx={{ fontWeight: 600, mb: 1 }}>رمز QR</Typography>
                  <Box sx={{ width: '200px', height: '200px', backgroundColor: '#FFF', margin: '0 auto', border: '2px solid #DDD', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Typography sx={{ color: '#999' }}>[رمز QR]</Typography>
                  </Box>
                </Box>
                <TextField fullWidth label="أدخل رمز المصادقة" variant="outlined" sx={{ mb: 2 }} />
                <Button variant="contained" fullWidth sx={{ backgroundColor: '#0056B3' }} onClick={() => setMfaEnabled(true)}>
                  تأكيد وتفعيل
                </Button>
              </Box>
            )}
          </CardContent>
        </Card>

        <Card sx={{ border: '1px solid #E0E0E0' }}>
          <CardHeader title="أرقام النسخ الاحتياطية" />
          <CardContent>
            <Alert severity="info" sx={{ mb: 2 }}>احفظ هذه الأرقام في مكان آمن لاستخدامها كنسخة احتياطية:</Alert>
            <List>
              {['XXXX-XXXX-XXXX', 'YYYY-YYYY-YYYY', 'ZZZZ-ZZZZ-ZZZZ'].map((code, idx) => (
                <ListItem key={idx}>
                  <ListItemText primary={code} />
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}
