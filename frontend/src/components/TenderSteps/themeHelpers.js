import institutionalTheme from '../../theme/theme';

const theme = institutionalTheme;

/**
 * Centralized color palette to replace hardcoded colors
 * All colors map to theme tokens
 */
export const THEME_COLORS = {
  // Primary
  primary: theme.palette.primary.main, // #0056B3
  primaryLight: theme.palette.primary.light, // #1976d2
  primaryDark: theme.palette.primary.dark, // #003d7a

  // Secondary
  secondary: theme.palette.secondary.main, // #616161
  secondaryLight: theme.palette.secondary.light, // #9e9e9e
  secondaryDark: theme.palette.secondary.dark, // #424242

  // Success
  success: theme.palette.success.main, // #2e7d32
  successLight: theme.palette.success.light, // #4caf50

  // Warning
  warning: theme.palette.warning.main, // #f57c00
  warningLight: theme.palette.warning.light, // #ff9800

  // Error
  error: theme.palette.error.main, // #c62828
  errorLight: theme.palette.error.light, // #ef5350 (close to #d32f2f)

  // Text
  textPrimary: theme.palette.text.primary, // #212121
  textSecondary: theme.palette.text.secondary, // #616161
  textDisabled: theme.palette.text.disabled, // #9e9e9e

  // Background
  bgDefault: theme.palette.background.default, // #F9F9F9
  bgPaper: theme.palette.background.paper, // #FFFFFF

  // Divider
  divider: theme.palette.divider, // #E0E0E0
};

/**
 * Preset sx styles to replace repeated inline styles
 */
export const THEME_STYLES = {
  // Inputs
  textFieldBase: {
    '& .MuiOutlinedInput-root': {
      borderRadius: '4px',
      backgroundColor: THEME_COLORS.bgDefault,
    },
  },

  // Cards and Backgrounds
  cardBg: {
    backgroundColor: THEME_COLORS.bgDefault,
    borderRadius: '4px',
    boxShadow: 'none',
  },

  // Borders
  primaryBorder: {
    borderLeft: `4px solid ${THEME_COLORS.primary}`,
  },

  successBorder: {
    borderLeft: `3px solid ${THEME_COLORS.successLight}`,
  },

  errorBorder: {
    borderLeft: `4px solid ${THEME_COLORS.errorLight}`,
  },

  warningBorder: {
    borderLeft: `4px solid ${THEME_COLORS.warningLight}`,
  },

  // Typography
  label: {
    fontSize: '13px',
    fontWeight: 600,
    color: THEME_COLORS.textPrimary,
    mb: '8px',
  },

  helperText: {
    fontSize: '12px',
    color: THEME_COLORS.textDisabled,
    mt: '6px',
  },

  secondaryText: {
    fontSize: '12px',
    color: THEME_COLORS.textSecondary,
  },

  // Buttons
  buttonPrimary: {
    backgroundColor: THEME_COLORS.primary,
    color: THEME_COLORS.bgPaper,
    textTransform: 'none',
    '&:hover': {
      backgroundColor: THEME_COLORS.primaryDark,
    },
    '&:disabled': {
      backgroundColor: THEME_COLORS.textDisabled,
    },
  },

  buttonError: {
    color: THEME_COLORS.errorLight,
    borderColor: THEME_COLORS.errorLight,
  },

  // Alert boxes
  alertInfo: {
    backgroundColor: `${THEME_COLORS.primary}15`, // Primary with opacity
    color: THEME_COLORS.primary,
  },

  alertSuccess: {
    backgroundColor: `${THEME_COLORS.success}15`,
    color: THEME_COLORS.success,
  },

  alertWarning: {
    backgroundColor: `${THEME_COLORS.warning}15`,
    color: THEME_COLORS.warning,
  },

  alertError: {
    backgroundColor: `${THEME_COLORS.errorLight}15`,
    color: THEME_COLORS.errorLight,
  },

  // Badge/Chip
  badge: {
    fontSize: '10px',
    color: THEME_COLORS.bgPaper,
    backgroundColor: THEME_COLORS.primary,
    px: '6px',
    py: '2px',
    borderRadius: '12px',
  },

  chipPrimary: {
    height: '24px',
    fontSize: '11px',
    backgroundColor: `${THEME_COLORS.primary}15`,
    color: THEME_COLORS.primary,
  },

  // Flex utilities
  flexCenter: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },

  flexBetween: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
};

/**
 * Map common hardcoded colors to theme colors
 */
export const COLOR_MAP = {
  '#0056B3': THEME_COLORS.primary,
  '#1976d2': THEME_COLORS.primaryLight,
  '#003d7a': THEME_COLORS.primaryDark,
  '#616161': THEME_COLORS.secondary,
  '#9e9e9e': THEME_COLORS.secondaryLight,
  '#424242': THEME_COLORS.secondaryDark,
  '#2e7d32': THEME_COLORS.success,
  '#4caf50': THEME_COLORS.successLight,
  '#f57c00': THEME_COLORS.warning,
  '#ff9800': THEME_COLORS.warningLight,
  '#c62828': THEME_COLORS.error,
  '#ef5350': THEME_COLORS.errorLight,
  '#d32f2f': THEME_COLORS.errorLight, // Alternative red
  '#212121': THEME_COLORS.textPrimary,
  '#666666': THEME_COLORS.textSecondary,
  '#999999': THEME_COLORS.textDisabled,
  '#F9F9F9': THEME_COLORS.bgDefault,
  '#FFFFFF': THEME_COLORS.bgPaper,
  '#E0E0E0': THEME_COLORS.divider,
  '#FAFAFA': THEME_COLORS.bgDefault, // Very close to #F9F9F9
};

export default { THEME_COLORS, THEME_STYLES, COLOR_MAP };
