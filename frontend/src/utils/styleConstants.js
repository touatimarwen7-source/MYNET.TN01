/**
 * ============ STYLE CONSTANTS ============
 * Centralized styling configuration
 */

// ============ Spacing ============
export const SPACING = {
  XS: '4px',
  SM: '8px',
  MD: '16px',
  LG: '24px',
  XL: '32px',
};

// ============ Border Radius ============
export const BORDER_RADIUS = {
  NONE: '0px',
  SM: '2px',
  MD: '4px',
  LG: '8px',
  FULL: '50%',
};

// ============ Font Sizes ============
export const FONT_SIZES = {
  XS: '12px',
  SM: '13px',
  MD: '14px',
  LG: '16px',
  XL: '28px',
  XXL: '32px',
};

// ============ Font Weights ============
export const FONT_WEIGHTS = {
  NORMAL: 400,
  MEDIUM: 500,
  SEMI_BOLD: 600,
  BOLD: 700,
};

// ============ Colors ============
export const COLORS = {
  PRIMARY: '#0056B3',
  PRIMARY_LIGHT: '#E3F2FD',
  TEXT_PRIMARY: '#212121',
  TEXT_SECONDARY: '#666666',
  TEXT_TERTIARY: '#999999',
  BACKGROUND: '#FAFAFA',
  BORDER: '#E0E0E0',
  SUCCESS: '#4caf50',
  WARNING: '#ff9800',
  ERROR: '#d32f2f',
  INFO: '#2196f3',
};

// ============ Component Styles ============
export const COMPONENT_STYLES = {
  TEXTFIELD_INPUT: {
    '& .MuiOutlinedInput-root': {
      borderRadius: BORDER_RADIUS.MD,
      backgroundColor: COLORS.BACKGROUND,
    },
  },
  BUTTON_BASE: {
    textTransform: 'none',
    fontWeight: FONT_WEIGHTS.SEMI_BOLD,
  },
  CARD_BASE: {
    borderRadius: BORDER_RADIUS.MD,
    boxShadow: 'none',
    border: `1px solid ${COLORS.BORDER}`,
  },
  ALERT_INFO: {
    backgroundColor: COLORS.PRIMARY_LIGHT,
    color: COLORS.PRIMARY,
  },
  CHIP_BASE: {
    fontWeight: FONT_WEIGHTS.SEMI_BOLD,
  },
};

export default {
  SPACING,
  BORDER_RADIUS,
  FONT_SIZES,
  FONT_WEIGHTS,
  COLORS,
  COMPONENT_STYLES,
};
