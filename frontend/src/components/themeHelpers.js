import institutionalTheme from '../theme/theme';

const theme = institutionalTheme;

/**
 * Global theme helpers for all components
 * Ensures consistent theming across the entire frontend
 */

export const THEME_COLORS = {
  // Primary
  primary: theme.palette.primary.main,
  primaryLight: theme.palette.primary.light,
  primaryDark: theme.palette.primary.dark,

  // Secondary
  secondary: theme.palette.secondary.main,
  secondaryLight: theme.palette.secondary.light,
  secondaryDark: theme.palette.secondary.dark,

  // Success
  success: theme.palette.success.main,
  successLight: theme.palette.success.light,

  // Warning
  warning: theme.palette.warning.main,
  warningLight: theme.palette.warning.light,

  // Error
  error: theme.palette.error.main,
  errorLight: theme.palette.error.light,

  // Text
  textPrimary: theme.palette.text.primary,
  textSecondary: theme.palette.text.secondary,
  textDisabled: theme.palette.text.disabled,

  // Background
  bgDefault: theme.palette.background.default,
  bgPaper: theme.palette.background.paper,

  // Divider
  divider: theme.palette.divider,
};

export const THEME_STYLES = {
  // Inputs
  textFieldBase: {
    '& .MuiOutlinedInput-root': {
      borderRadius: '4px',
      backgroundColor: THEME_COLORS.bgDefault,
    },
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
    backgroundColor: `${THEME_COLORS.primary}15`,
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
};

export default { THEME_COLORS, THEME_STYLES };
