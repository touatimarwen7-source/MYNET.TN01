import { Box, Container, Typography } from '@mui/material';
import institutionalTheme from '../theme/theme';

export default function BuyerAnalytics() {
  const theme = institutionalTheme;

  return (
    <Container maxWidth="lg">
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 600, mb: 3, color: theme.palette.primary.main }}>
          تحليلات المشتري
        </Typography>
        <Typography color="textSecondary">
          سيتم تطوير هذه الميزة قريباً.
        </Typography>
      </Box>
    </Container>
  );
}
