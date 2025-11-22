import { useEffect } from 'react';
import {
  Container,
  Box,
  Card,
  CardContent,
  CardHeader,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Button,
  Divider
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningIcon from '@mui/icons-material/Warning';
import InfoIcon from '@mui/icons-material/Info';
import { setPageTitle } from '../utils/pageTitle';

export default function NotificationCenter() {
  const notifications = [
    { id: 1, type: 'success', icon: <CheckCircleIcon sx={{ color: '#4caf50' }} />, title: 'عرض مقبول', message: 'تم قبول عرضك على الطلب #1', time: 'قبل ساعة' },
    { id: 2, type: 'warning', icon: <WarningIcon sx={{ color: '#ff9800' }} />, title: 'انتظار الموافقة', message: 'عرضك قيد المراجعة', time: 'قبل ساعتين' },
    { id: 3, type: 'info', icon: <InfoIcon sx={{ color: '#2196f3' }} />, title: 'طلب جديد', message: 'طلب عرض جديد متاح', time: 'قبل يوم' }
  ];

  useEffect(() => {
    setPageTitle('مركز الإخطارات');
  }, []);

  return (
    <Box sx={{ backgroundColor: '#F9F9F9', paddingY: '40px', minHeight: '80vh' }}>
      <Container maxWidth="md">
        <Typography variant="h2" sx={{ fontSize: '32px', fontWeight: 600, color: '#0056B3', mb: 3 }}>
          مركز الإخطارات
        </Typography>
        <Card sx={{ border: '1px solid #E0E0E0' }}>
          <CardContent>
            <List>
              {notifications.map((notif, idx) => (
                <Box key={notif.id}>
                  <ListItem>
                    <ListItemIcon>{notif.icon}</ListItemIcon>
                    <ListItemText
                      primary={notif.title}
                      secondary={
                        <Box>
                          <Typography variant="body2" sx={{ color: '#616161' }}>{notif.message}</Typography>
                          <Typography variant="caption" sx={{ color: '#999' }}>{notif.time}</Typography>
                        </Box>
                      }
                    />
                    <Button size="small" sx={{ color: '#0056B3' }}>حذف</Button>
                  </ListItem>
                  {idx < notifications.length - 1 && <Divider />}
                </Box>
              ))}
            </List>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}
