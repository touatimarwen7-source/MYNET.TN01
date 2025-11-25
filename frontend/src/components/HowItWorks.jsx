import { THEME_COLORS } from './themeHelpers';
import { Box, Container, Typography, Grid, Card, CardContent, Stack } from '@mui/material';
import institutionalTheme from '../theme/theme';

export default function HowItWorks() {
  const theme = institutionalTheme;
  const buyerSteps = [
    { number: 1, title: 'Créer un Appel d\'Offres en 5 minutes', description: 'Définissez vos besoins précis, fixez les critères d\'évaluation, établissez votre budget et publiez auprès de milliers de fournisseurs vérifiés', icon: '📝' },
    { number: 2, title: 'Recevoir les Offres en 24h', description: 'Collectez automatiquement les propositions qualifiées avec pièces jointes, documents techniques et calendriers détaillés en temps réel', icon: '📨' },
    { number: 3, title: 'Évaluer, Comparer & Attribuer', description: 'Comparez côte à côte avec tableaux analytiques, analysez avec l\'IA, notez les fournisseurs et attribuez en toute transparence avec traçabilité complète', icon: '✓' }
  ];

  const supplierSteps = [
    { number: 1, title: 'Parcourir 100+ Opportunités Quotidiennes', description: 'Découvrez les appels d\'offres et demandes directs filtrés selon votre domaine d\'activité, localisation et capacités', icon: '🔍' },
    { number: 2, title: 'Soumettre une Offre Compétitive', description: 'Répondez en quelques minutes avec votre tarification sécurisée, dévis détaillé, conditions de paiement et documents techniques cryptés', icon: '💼' },
    { number: 3, title: 'Gagner le Contrat et Invoicer', description: 'Recevez le bon de commande, commencez la production, et générez vos factures directement via la plateforme avec paiement sécurisé', icon: '🎯' }
  ];

  const benefits = [
    { icon: '⚡', title: 'Économie de Temps', desc: 'Processus complet en 3-5 jours au lieu de 4-6 semaines avec des gains d\'efficacité de 70%' },
    { icon: '🔐', title: 'Sécurité Totale', desc: 'Chiffrement AES-256, authentification 2FA, audit blockchain, conformité RGPD et normes ISO 27001 certifiées' },
    { icon: '🤖', title: 'Intelligence Artificielle', desc: 'Algorithmes IA pour sélection automatique, prédictions de performance et détection d\'anomalies' },
    { icon: '💰', title: 'ROI Garanti', desc: 'Réduisez coûts d\'approvisionnement de 15-30% et augmentez revenus fournisseur de 25-40%' }
  ];

  return (
    <Box sx={{ backgroundColor: theme.palette.background.default, paddingY: '60px' }}>
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', marginBottom: '60px' }}>
          <Typography variant="h2" sx={{ fontSize: '36px', fontWeight: 700, color: theme.palette.text.primary, marginBottom: '16px' }}>
            Comment Fonctionne MyNet.tn?
          </Typography>
          <Typography variant="body1" sx={{ fontSize: '16px', color: THEME_COLORS.textSecondary }}>
            Trois étapes simples pour transformer vos achats
          </Typography>
        </Box>

        <Box sx={{ marginBottom: '60px' }}>
          <Typography variant="h3" sx={{ fontSize: '24px', fontWeight: 600, color: theme.palette.text.primary, marginBottom: '32px' }}>
            Pour les Acheteurs
          </Typography>
          <Grid container spacing={3}>
            {buyerSteps.map((step, idx) => (
              <Grid size={{ xs: 12, md: 4 }} key={idx}>
                <Card sx={{ backgroundColor: THEME_COLORS.bgPaper, border: '1px solid #E0E0E0', borderRadius: '4px', boxShadow: 'none', height: '100%' }}>
                  <CardContent sx={{ padding: '32px', textAlign: 'center' }}>
                    <Box sx={{ fontSize: '48px', marginBottom: '16px' }}>{step.icon}</Box>
                    <Box sx={{ fontSize: '32px', fontWeight: 700, color: theme.palette.primary.main, marginBottom: '12px' }}>{step.number}</Box>
                    <Typography variant="h5" sx={{ fontSize: '18px', fontWeight: 600, color: theme.palette.text.primary, marginBottom: '12px' }}>
                      {step.title}
                    </Typography>
                    <Typography variant="body2" sx={{ fontSize: '14px', color: THEME_COLORS.textSecondary, lineHeight: 1.6 }}>
                      {step.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        <Box sx={{ marginBottom: '60px' }}>
          <Typography variant="h3" sx={{ fontSize: '24px', fontWeight: 600, color: theme.palette.text.primary, marginBottom: '32px' }}>
            Pour les Fournisseurs
          </Typography>
          <Grid container spacing={3}>
            {supplierSteps.map((step, idx) => (
              <Grid size={{ xs: 12, md: 4 }} key={idx}>
                <Card sx={{ backgroundColor: THEME_COLORS.bgPaper, border: '1px solid #E0E0E0', borderRadius: '4px', boxShadow: 'none', height: '100%' }}>
                  <CardContent sx={{ padding: '32px', textAlign: 'center' }}>
                    <Box sx={{ fontSize: '48px', marginBottom: '16px' }}>{step.icon}</Box>
                    <Box sx={{ fontSize: '32px', fontWeight: 700, color: theme.palette.primary.main, marginBottom: '12px' }}>{step.number}</Box>
                    <Typography variant="h5" sx={{ fontSize: '18px', fontWeight: 600, color: theme.palette.text.primary, marginBottom: '12px' }}>
                      {step.title}
                    </Typography>
                    <Typography variant="body2" sx={{ fontSize: '14px', color: THEME_COLORS.textSecondary, lineHeight: 1.6 }}>
                      {step.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        <Box>
          <Typography variant="h3" sx={{ fontSize: '24px', fontWeight: 600, color: theme.palette.text.primary, marginBottom: '32px', textAlign: 'center' }}>
            Avantages Clés
          </Typography>
          <Grid container spacing={3}>
            {benefits.map((benefit, idx) => (
              <Grid size={{ xs: 12, sm: 6, md: 3 }} key={idx}>
                <Card sx={{ backgroundColor: THEME_COLORS.bgPaper, border: '1px solid #E0E0E0', borderRadius: '4px', boxShadow: 'none', textAlign: 'center' }}>
                  <CardContent sx={{ padding: '24px' }}>
                    <Box sx={{ fontSize: '40px', marginBottom: '12px' }}>{benefit.icon}</Box>
                    <Typography variant="h6" sx={{ fontSize: '16px', fontWeight: 600, color: theme.palette.text.primary, marginBottom: '8px' }}>
                      {benefit.title}
                    </Typography>
                    <Typography variant="body2" sx={{ fontSize: '13px', color: THEME_COLORS.textSecondary, lineHeight: 1.6 }}>
                      {benefit.desc}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
    </Box>
  );
}
