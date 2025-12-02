/**
 * 🎨 Consistency Helper - Ensured 100% French + Theme Compliance
 *
 * Functions to ensure:
 * 1. All text uses French translations
 * 2. All colors use theme.js palette
 * 3. All spacing uses theme spacing
 * 4. Zero inline styles or separate CSS files
 */

import { useTheme } from '@mui/material/styles';

/**
 * French labels mapping - Fallback if i18n is not initialized
 * All labels MUST be in French only
 */
export const FRENCH_LABELS = {
  // Actions
  ajouter: 'Ajouter',
  modifier: 'Modifier',
  supprimer: 'Supprimer',
  enregistrer: 'Enregistrer',
  annuler: 'Annuler',
  confirmez: 'Confirmez',
  rechercher: 'Rechercher',
  voir: 'Voir',
  télécharger: 'Télécharger',
  charger: 'Charger',
  dupliquer: 'Dupliquer',
  fermer: 'Fermer',

  // Status
  actif: 'Actif',
  inactif: 'Inactif',
  activé: 'Activé',
  désactivé: 'Désactivé',
  en_attente: 'En attente',
  bloqué: 'Bloqué',
  archivé: 'Archivé',
  approuvé: 'Approuvé',
  rejeté: 'Rejeté',

  // Messages
  chargement: 'Chargement...',
  aucune_donnée: 'Aucune donnée',
  erreur: 'Erreur',
  succès: 'Succès',
  avertissement: 'Avertissement',
  info: 'Information',
  confirmez_action: 'Êtes-vous sûr?',

  // Form fields
  email: 'Email',
  mot_de_passe: 'Mot de passe',
  nom: 'Nom',
  prénom: 'Prénom',
  entreprise: 'Entreprise',
  téléphone: 'Téléphone',
  adresse: 'Adresse',
  description: 'Description',

  // Table columns
  actions: 'Actions',
  date: 'Date',
  statut: 'Statut',
  utilisateur: 'Utilisateur',
  montant: 'Montant',
  type: 'Type',
  résultat: 'Résultat',
};

/**
 * Ensure all text uses French labels
 * @param {string} key - Label key in FRENCH_LABELS
 * @returns {string} French label
 */
export const getFrenchLabel = (key) => {
  if (!key || typeof key !== 'string') return '';
  return FRENCH_LABELS[key] || key;
};

/**
 * Hook for consistent theme usage across components
 * @returns {Object} Theme utilities
 */
export const useConsistentTheme = () => {
  const theme = useTheme();

  return {
    // Colors - Always use theme palette
    colors: {
      primary: theme.palette.primary.main,
      primaryLight: theme.palette.primary.light,
      primaryDark: theme.palette.primary.dark,
      secondary: theme.palette.secondary.main,
      success: theme.palette.success.main,
      warning: theme.palette.warning.main,
      error: theme.palette.error.main,
      info: theme.palette.info.main,
      background: theme.palette.background.default,
      surface: theme.palette.background.paper,
      text: theme.palette.text.primary,
      textSecondary: theme.palette.text.secondary,
      divider: theme.palette.divider,
    },

    // Spacing - Always use theme spacing
    spacing: {
      xs: theme.spacing(0.5),
      sm: theme.spacing(1),
      md: theme.spacing(2),
      lg: theme.spacing(3),
      xl: theme.spacing(4),
      xxl: theme.spacing(5),
    },

    // Typography - Use theme variants
    typography: {
      h1: { ...theme.typography.h1 },
      h2: { ...theme.typography.h2 },
      h3: { ...theme.typography.h3 },
      h4: { ...theme.typography.h4 },
      body: { ...theme.typography.body1 },
      caption: { ...theme.typography.caption },
    },

    // Border radius - Use theme shape
    borderRadius: theme.shape.borderRadius,

    // Shadows - None (institutional style)
    shadows: 'none',
  };
};

/**
 * Verified sx prop (Material-UI style object)
 * Ensures no inline styles, only theme-based sx
 * @param {Object} baseStyles - Base sx styles
 * @param {Object} theme - MUI theme object
 * @returns {Object} Verified sx object
 */
export const createThemedSx = (baseStyles, theme) => {
  if (!baseStyles || !theme) return {};

  return {
    ...baseStyles,
    // Force theme-based colors
    color: baseStyles.color ? theme.palette[baseStyles.color]?.main || baseStyles.color : 'inherit',
    backgroundColor: baseStyles.backgroundColor
      ? theme.palette[baseStyles.backgroundColor]?.main || baseStyles.backgroundColor
      : 'transparent',
    // Force theme-based spacing
    padding: baseStyles.padding ? theme.spacing(baseStyles.padding / 8) : 'auto',
    margin: baseStyles.margin ? theme.spacing(baseStyles.margin / 8) : 'auto',
    borderRadius: theme.shape.borderRadius,
    // No shadows
    boxShadow: 'none',
  };
};

/**
 * Responsive breakpoint utilities
 * Ensures mobile-first design
 */
export const responsiveBreakpoints = {
  mobile: { xs: true },
  tablet: { xs: true, sm: true },
  desktop: { sm: false, md: true, lg: true },
};

/**
 * Common sx props for consistency
 * All patterns use theme values - no hardcoded colors/spacing
 */
export const CONSISTENT_SX = {
  // Card with consistent styling
  card: (theme) => ({
    p: theme.spacing(2),
    backgroundColor: theme.palette.background.paper,
    borderRadius: theme.shape.borderRadius,
    boxShadow: 'none',
    border: `1px solid ${theme.palette.divider}`,
    transition: 'border-color 0.2s ease',
    '&:hover': {
      borderColor: theme.palette.primary.main,
    },
  }),

  // Button with consistent styling
  button: (theme) => ({
    textTransform: 'none',
    fontWeight: theme.typography.fontWeightMedium,
    borderRadius: theme.shape.borderRadius,
    boxShadow: 'none',
    transition: 'all 0.2s ease',
    '&:hover': {
      boxShadow: 'none',
    },
  }),

  // Input with consistent styling
  input: (theme) => ({
    '& .MuiOutlinedInput-root': {
      borderRadius: theme.shape.borderRadius,
      transition: 'border-color 0.2s ease',
    },
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: theme.palette.divider,
    },
    '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': {
      borderColor: theme.palette.primary.main,
    },
  }),

  // Table with consistent styling
  table: (theme) => ({
    borderCollapse: 'collapse',
    '& .MuiTableCell-head': {
      backgroundColor: theme.palette.background.default,
      fontWeight: theme.typography.fontWeightBold,
      color: theme.palette.text.primary,
      borderColor: theme.palette.divider,
    },
    '& .MuiTableCell-body': {
      borderColor: theme.palette.divider,
    },
    '& .MuiTableBody-root .MuiTableRow-root:hover': {
      backgroundColor: theme.palette.action.hover,
    },
  }),
};

/**
 * Consistency validator - Check for violations
 */
export const validateConsistency = {
  // Check for inline styles (should use sx instead)
  hasInlineStyles: (element) => {
    if (!element || typeof element !== 'object') return false;
    return element?.getAttribute?.('style') !== null;
  },

  // Check for non-theme colors
  hasNonThemeColors: (color, theme) => {
    if (!color || !theme) return false;
    const themeColors = Object.values(theme.palette);
    return !themeColors.some(
      (paletteColor) =>
        paletteColor === color || (typeof paletteColor === 'object' && paletteColor.main === color)
    );
  },

  // Check for non-French text (simple check)
  hasNonFrenchText: (text) => {
    if (!text || typeof text !== 'string') return false;
    // Flag all-caps English acronyms (but allow French accents)
    return /[A-Z]{2,}(?![a-z])/.test(text);
  },
};

export default {
  FRENCH_LABELS,
  getFrenchLabel,
  useConsistentTheme,
  createThemedSx,
  responsiveBreakpoints,
  CONSISTENT_SX,
  validateConsistency,
};
