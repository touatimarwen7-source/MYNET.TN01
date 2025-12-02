import { THEME_COLORS } from './themeHelpers';
import { Container, Box, Grid, Card, Typography } from '@mui/material';
import SecurityIcon from '@mui/icons-material/Security';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import GroupIcon from '@mui/icons-material/Group';
import InventoryIcon from '@mui/icons-material/Inventory';
import LanguageIcon from '@mui/icons-material/Language';
import PhoneAndroidIcon from '@mui/icons-material/PhoneAndroid';
import institutionalTheme from '../theme/theme';

export default function HomePageFeatures() {
  const theme = institutionalTheme;
  const features = [
    {
      icon: <SecurityIcon sx={{ fontSize: '40px', color: theme.palette.primary.main }} />,
      title: 'Sécurité Classe Entreprise',
      description:
        'Chiffrement AES-256, authentification 2FA/MFA, audit complet et conformité ISO 27001 certifiée',
    },
    {
      icon: <TrendingUpIcon sx={{ fontSize: '40px', color: theme.palette.primary.main }} />,
      title: 'Performance & Scalabilité',
      description:
        'Infrastructure cloud distribuée avec temps de réponse < 200ms et 99.9% de disponibilité garantie',
    },
    {
      icon: <GroupIcon sx={{ fontSize: '40px', color: theme.palette.primary.main }} />,
      title: 'Support Dédié 24/7',
      description: "Équipe d'experts tunisiens parlant arabe et français pour assistance immédiate",
    },
    {
      icon: <InventoryIcon sx={{ fontSize: '40px', color: theme.palette.primary.main }} />,
      title: 'Intelligence Analytique',
      description:
        "Tableaux de bord détaillés, rapports en temps réel et prédictions basées sur l'IA",
    },
    {
      icon: <LanguageIcon sx={{ fontSize: '40px', color: theme.palette.primary.main }} />,
      title: 'Multi-Devises & Localisé',
      description: 'Support dinars tunisiens, euros, dollars + interface 100% en français tunisien',
    },
    {
      icon: <PhoneAndroidIcon sx={{ fontSize: '40px', color: theme.palette.primary.main }} />,
      title: 'Accessible Partout',
      description: 'Application web responsive, compatible iOS/Android, sans installation requise',
    },
  ];

  return (
    <Box>
      <Typography
        variant="h2"
        sx={{
          fontSize: '32px',
          fontWeight: 500,
          color: theme.palette.text.primary,
          textAlign: 'center',
          marginBottom: '48px',
        }}
      >
        Pourquoi Choisir MyNet.tn?
      </Typography>
      <Grid container spacing={2}>
        {features.map((feature, idx) => (
          <Grid size={{ xs: 12, md: 4 }} key={idx}>
            <Card
              sx={{
                backgroundColor: THEME_COLORS.bgPaper,
                border: '1px solid #e0e0e0',
                borderRadius: '8px',
                padding: '32px 24px',
                textAlign: 'center',
                transition: 'all 200ms ease-in-out',
                '&:hover': {
                  borderColor: theme.palette.primary.main,
                  boxShadow: 'none',
                  transform: 'translateY(-4px)',
                },
              }}
            >
              <Box sx={{ marginBottom: '16px' }}>{feature.icon}</Box>
              <Typography
                variant="h4"
                sx={{
                  fontSize: '18px',
                  fontWeight: 600,
                  color: theme.palette.text.primary,
                  marginBottom: '12px',
                }}
              >
                {feature.title}
              </Typography>
              <Typography
                sx={{ fontSize: '14px', color: THEME_COLORS.textSecondary, lineHeight: 1.6 }}
              >
                {feature.description}
              </Typography>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
