import React from 'react';
import { Box, Typography, Button, Grid } from '@mui/material';
import { styled } from '@mui/material/styles';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import AppRegistrationIcon from '@mui/icons-material/AppRegistration';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import GppGoodIcon from '@mui/icons-material/GppGood';
import PaidIcon from '@mui/icons-material/Paid';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import AddCardIcon from '@mui/icons-material/AddCard';
importiendo from '../assets/images/Hand holding phone with money.png';
import { THEME } from '../theme/theme';

const StyledBox = styled(Box)(({ theme }) => ({
  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
  borderRadius: '12px',
  padding: '32px 24px',
  marginBottom: '24px',
  color: 'white',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
    textAlign: 'center',
    gap: '16px',
  },
}));

const FeatureBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '8px',
  padding: '16px',
  borderRadius: '8px',
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[1],
  height: '100%',
}));

const IconWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: theme.palette.primary.light,
  borderRadius: '50%',
  padding: '12px',
  color: theme.palette.primary.main,
  marginBottom: '8px',
}));

const Homepage = () => {
  const features = [
    { icon: <AppRegistrationIcon />, title: 'إنشاء حساب', description: 'قم بإنشاء حسابك الخاص الآن' },
    { icon: <AccountBalanceIcon />, title: 'إدارة الحسابات', description: 'إدارة جميع حساباتك المصرفية بسهولة' },
    { icon: <CreditCardIcon />, title: 'بطاقات ائتمان', description: 'احصل على بطاقات ائتمان تلبي احتياجاتك' },
    { icon: <GppGoodIcon />, title: 'أمان عالي', description: 'نحن نضمن أمان بياناتك وأموالك' },
    { icon: <PaidIcon />, title: 'استثمارات', description: 'استثمر أموالك بذكاء مع خياراتنا المتنوعة' },
    { icon: <MonetizationOnIcon />, title: 'مدفوعات سريعة', description: 'قم بإجراء المدفوعات الخاصة بك بسرعة وأمان' },
    { icon: <AddCardIcon />, title: 'قروض', description: 'احصل على قروض لتلبية احتياجاتك المالية' },
  ];

  return (
    <Box sx={{ padding: '24px', backgroundColor: THEME.palette.background.default }}>
      <StyledBox>
        <Box>
          <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
            مرحباً بك في بوابتك المالية الشاملة
          </Typography>
          <Typography variant="h6" component="p" gutterBottom>
            نقدم لك حلولاً مالية متكاملة لإدارة أموالك بسهولة وأمان.
          </Typography>
          <Button
            variant="contained"
            color="secondary"
            endIcon={<ArrowForwardIcon />}
            sx={{
              borderRadius: '8px',
              padding: '12px 24px',
              fontWeight: 'bold',
              fontSize: '16px',
              textTransform: 'none',
            }}
          >
            ابدأ الآن
          </Button>
        </Box>
        <Box
          component="img"
          src={iendo}
          alt="Hand holding phone with money"
          sx={{
            width: '300px',
            height: 'auto',
            [THEME.breakpoints.down('sm')]: {
              width: '200px',
            },
          }}
        />
      </StyledBox>

      <Typography variant="h5" component="h2" gutterBottom align="center" sx={{ fontWeight: 'bold', mb: 4 }}>
        لماذا تختارنا؟
      </Typography>
      <Grid container spacing={4}>
        {features.map((feature, index) => (
          <Grid item key={index} xs={12} sm={6} md={4}>
            <FeatureBox>
              <IconWrapper>{feature.icon}</IconWrapper>
              <Typography variant="h6" component="h3" sx={{ fontWeight: 'bold' }}>
                {feature.title}
              </Typography>
              <Typography variant="body2" color="text.secondary" align="center">
                {feature.description}
              </Typography>
            </FeatureBox>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Homepage;