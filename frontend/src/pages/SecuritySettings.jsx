import { useEffect } from 'react';
import { Container, Box, Card, CardContent, CardHeader, Typography, Button, Alert, List, ListItem, ListItemText, Divider } from '@mui/material';
import SecurityIcon from '@mui/icons-material/Security';
import { setPageTitle } from '../utils/pageTitle';

export default function SecuritySettings() {
  const settings = [
    { title: 'جدار الحماية', description: 'حماية متقدمة من الهجمات', status: 'مفعل' },
    { title: 'التشفير', description: 'تشفير بروتوكول SSL/TLS', status: 'مفعل' },
    { title: 'المصادقة الثنائية', description: 'أمان متقدم للحساب', status: 'مفعل' },
    { title: 'تسجيل الأنشطة', description: 'تتبع جميع الأنشطة المريبة', status: 'مفعل' }
  ];

  useEffect(() => {
    setPageTitle('إعدادات الأمان');
  }, []);

  return (
    <Box sx={{ backgroundColor: '#F9F9F9', paddingY: '40px', minHeight: '80vh' }}>
      <Container maxWidth="md">
        <Typography variant="h2" sx={{ fontSize: '32px', fontWeight: 600, color: '#0056B3', mb: 3 }}>
          إعدادات الأمان
        </Typography>

        <Alert severity="success" sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
          <SecurityIcon sx={{ mr: 1 }} />
          حسابك محمي بمستويات أمان عالية
        </Alert>

        <Card sx={{ border: '1px solid #E0E0E0' }}>
          <CardHeader title="خيارات الأمان" />
          <CardContent>
            <List>
              {settings.map((setting, idx) => (
                <Box key={idx}>
                  <ListItem>
                    <ListItemText
                      primary={setting.title}
                      secondary={setting.description}
                    />
                    <Typography sx={{ color: '#4caf50', fontWeight: 600, ml: 2 }}>
                      {setting.status}
                    </Typography>
                  </ListItem>
                  {idx < settings.length - 1 && <Divider />}
                </Box>
              ))}
            </List>
          </CardContent>
        </Card>

        <Card sx={{ border: '1px solid #E0E0E0', mt: 3 }}>
          <CardHeader title="الجلسات النشطة" />
          <CardContent>
            <List>
              <ListItem>
                <ListItemText primary="المتصفح الحالي" secondary="آخر نشاط: الآن" />
                <Button size="small" sx={{ color: '#0056B3' }}>محاكاة</Button>
              </ListItem>
            </List>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}
