// Font family configuration
export const FONT_FAMILY = {
  // Asap font variants
  regular: 'Asap-Regular',
  medium: 'Asap-Medium',
  mediumItalic: 'Asap-MediumItalic',
  semiBold: 'Asap-SemiBold',
  bold: 'Asap-Bold',
  extraBold: 'Asap-ExtraBold',
  light: 'Asap-Light',
  extraLight: 'Asap-ExtraLight',
};

// Font sizes for consistency
export const FONT_SIZE = {
  xs: 10,
  sm: 12,
  md: 14,
  lg: 16,
  xl: 18,
  '2xl': 20,
  '3xl': 24,
  '4xl': 30,
  '5xl': 36,
  '6xl': 48,
};

// Line heights for typography consistency
export const LINE_HEIGHT = {
  xs: 14,
  sm: 16,
  md: 20,
  lg: 24,
  xl: 28,
  '2xl': 32,
  '3xl': 36,
  '4xl': 40,
};

// Typography presets
export const TYPOGRAPHY = {
  heading1: {
    fontFamily: FONT_FAMILY.bold,
    fontSize: FONT_SIZE['4xl'],
    lineHeight: LINE_HEIGHT['4xl'],
  },
  heading2: {
    fontFamily: FONT_FAMILY.bold,
    fontSize: FONT_SIZE['3xl'],
    lineHeight: LINE_HEIGHT['3xl'],
  },
  heading3: {
    fontFamily: FONT_FAMILY.semiBold,
    fontSize: FONT_SIZE['2xl'],
    lineHeight: LINE_HEIGHT['2xl'],
  },
  subtitle1: {
    fontFamily: FONT_FAMILY.medium,
    fontSize: FONT_SIZE.xl,
    lineHeight: LINE_HEIGHT.xl,
  },
  body1: {
    fontFamily: FONT_FAMILY.regular,
    fontSize: FONT_SIZE.lg,
    lineHeight: LINE_HEIGHT.lg,
  },
  body2: {
    fontFamily: FONT_FAMILY.regular,
    fontSize: FONT_SIZE.md,
    lineHeight: LINE_HEIGHT.md,
  },
  caption: {
    fontFamily: FONT_FAMILY.regular,
    fontSize: FONT_SIZE.sm,
    lineHeight: LINE_HEIGHT.sm,
  },
  button: {
    fontFamily: FONT_FAMILY.medium,
    fontSize: FONT_SIZE.md,
    lineHeight: LINE_HEIGHT.md,
  },
};