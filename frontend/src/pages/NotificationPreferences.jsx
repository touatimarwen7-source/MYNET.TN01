import { useEffect } from 'react';
import { Container, Box, Card, CardContent, CardHeader, List, ListItem, ListItemText, Switch, Typography } from '@mui/material';
import { setPageTitle } from '../utils/pageTitle';

export default function NotificationPreferences() {
  const prefs = [
    { name: 'إخطارات البريد الإلكتروني', enabled: true },
    { name: 'إخطارات الرسائل النصية', enabled: false },
    { name: 'إخطارات العروض الجديدة', enabled: true },
    { name: 'إخطارات التحديثات النظام', enabled: true },
    { name: 'إخطارات الإبلاغ عن الأخطاء', enabled: false },
    { name: 'الملخص اليومي', enabled: true }
  ];

  useEffect(() => {
    setPageTitle('تفضيلات الإخطارات');
  }, []);

  return (
    <Box sx={{ backgroundColor: '#F9F9F9', paddingY: '40px', minHeight: '80vh' }}>
      <Container maxWidth="md">
        <Typography variant="h2" sx={{ fontSize: '32px', fontWeight: 600, color: '#0056B3', mb: 3 }}>
          تفضيلات الإخطارات
        </Typography>
        <Card sx={{ border: '1px solid #E0E0E0' }}>
          <CardHeader title="تحكم بالإخطارات" />
          <CardContent>
            <List>
              {prefs.map((p, idx) => (
                <ListItem key={idx} secondaryAction={<Switch checked={p.enabled} />}>
                  <ListItemText primary={p.name} />
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}
