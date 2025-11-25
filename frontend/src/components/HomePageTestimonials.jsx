import { THEME_COLORS } from './themeHelpers';
import { Grid, Paper, Typography, Box } from '@mui/material';
import institutionalTheme from '../theme/theme';

export default function HomePageTestimonials() {
  const theme = institutionalTheme;
  const testimonials = [
    { text: 'MyNet.tn a révolutionné notre processus d\'achat. Nous avons réduit nos délais de 60% et amélioré la transparence avec nos fournisseurs. Les économies réalisées sur les coûts d\'approvisionnement dépassent déjà 20% en 6 mois.', author: '— Directeur des Achats, Groupe manufacturier tunisien' },
    { text: 'Grâce à MyNet.tn, nous accédons à 10x plus d\'opportunités commerciales. La plateforme est intuitive, sécurisée et les retours clients sont exceptionnels. Nous avons augmenté notre chiffre d\'affaires de 35% cette année.', author: '— PDG, PME technologique' },
    { text: 'La conformité légale et la sécurité des données sont garanties. Audit complet, traçabilité totale, et respect des normes ISO. MyNet.tn est devenue notre partenaire stratégique de confiance.', author: '— Directeur Financier et Risques, Banque tunisienne' },
  ];

  return (
    <Box>
      <Typography variant="h4" sx={{ fontSize: '20px', fontWeight: 600, color: theme.palette.text.primary, marginBottom: '24px' }}>
        Ce que Disent nos Utilisateurs
      </Typography>
      <Grid container spacing={2}>
        {testimonials.map((testimonial, idx) => (
          <Grid size={{ xs: 12, md: 4 }} key={idx}>
            <Paper sx={{ padding: '24px', backgroundColor: 'THEME_COLORS.bgDefault', border: '1px solid #e0e0e0', borderRadius: '8px', height: '100%', display: 'flex', flexDirection: 'column' }}>
              <Typography sx={{ fontSize: '14px', color: theme.palette.text.primary, marginBottom: '12px', flex: 1, lineHeight: 1.6 }}>
                "{testimonial.text}"
              </Typography>
              <Typography sx={{ fontSize: '12px', color: THEME_COLORS.textSecondary, fontStyle: 'italic' }}>
                {testimonial.author}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
