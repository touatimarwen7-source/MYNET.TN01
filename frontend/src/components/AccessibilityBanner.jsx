import { Box, Alert, CloseIcon, IconButton } from '@mui/material';
import { THEME_COLORS } from './themeHelpers';
import { useState } from 'react';
import institutionalTheme from '../theme/theme';

export default function AccessibilityBanner() {
  const theme = institutionalTheme;
  const [open, setOpen] = useState(true);

  if (!open) return null;

  return (
    <Alert
      severity="info"
      sx={{
        backgroundColor: 'THEME_COLORS.bgDefault',
        color: theme.palette.primary.main,
        border: '1px solid #0056B3',
        marginBottom: '16px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}
    >
      <Box>
        ♿ <strong>Accessibilité:</strong> Cette plateforme respecte les normes WCAG 2.1. Utilisez la touche Tab pour naviguer et Esc pour fermer les dialogues.
      </Box>
      <IconButton
        size="small"
        onClick={() => setOpen(false)}
        aria-label="Fermer le message d'accessibilité"
      >
        ✕
      </IconButton>
    </Alert>
  );
}
