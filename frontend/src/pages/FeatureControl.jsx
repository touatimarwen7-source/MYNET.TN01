import { useEffect } from 'react';
import { Container, Box, Card, CardContent, CardHeader, List, ListItem, ListItemText, Switch, Typography } from '@mui/material';
import { setPageTitle } from '../utils/pageTitle';

export default function FeatureControl() {
  const features = [
    { name: 'الطلبات العامة', enabled: true },
    { name: 'العروض المباشرة', enabled: true },
    { name: 'نظام المزادات', enabled: false },
    { name: 'التقارير المتقدمة', enabled: true },
    { name: 'المنتدى', enabled: false },
    { name: 'API الخارجي', enabled: false }
  ];

  useEffect(() => {
    setPageTitle('التحكم بالميزات');
  }, []);

  return (
    <Box sx={{ backgroundColor: '#F9F9F9', paddingY: '40px', minHeight: '80vh' }}>
      <Container maxWidth="md">
        <Typography variant="h2" sx={{ fontSize: '32px', fontWeight: 600, color: '#0056B3', mb: 3 }}>
          التحكم بالميزات
        </Typography>
        <Card sx={{ border: '1px solid #E0E0E0' }}>
          <CardHeader title="الميزات المتاحة" />
          <CardContent>
            <List>
              {features.map((f, idx) => (
                <ListItem key={idx} secondaryAction={<Switch checked={f.enabled} />}>
                  <ListItemText primary={f.name} />
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}
