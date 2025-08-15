/**
 * App color palette configuration
 */

export const colors = {
  // Primary colors
  primary: {
    main: '#8639E8', 
    light: '#A269F4',
    dark: '#6B2BC5',
    contrast: '#FFFFFF',
  },
  
  // Secondary colors
  secondary: {
    main: '#FF4F79', 
    light: '#FF7697',
    dark: '#D9304F',
    contrast: '#FFFFFF',
  },
  
  // Neutral colors
  neutral: {
    white: '#FFFFFF',
    black: '#000000',
    grey50: '#FAFAFA',
    grey100: '#F5F5F5',
    grey200: '#EEEEEE',
    grey300: '#E0E0E0',
    grey400: '#BDBDBD',
    grey500: '#9E9E9E',
    grey600: '#757575',
    grey700: '#616161',
    grey800: '#424242',
    grey900: '#212121',
  },
  
  // Semantic colors
  success: '#4CAF50',
  warning: '#FF9800',
  error: '#F44336',
  info: '#2196F3',

  // Background and text colors
  background: {
    light: '#FFFFFF',
    dark: '#121212',
  },
  text: {
    light: {
      primary: '#212121',
      secondary: '#757575',
      disabled: '#9E9E9E',
    },
    dark: {
      primary: '#FFFFFF',
      secondary: '#B0B0B0',
      disabled: '#6B6B6B',
    },
  },

  // Special elements
  rating: '#FFC107', 
  transparent: 'transparent',

  // Gradient colors for backgrounds
  gradient: {
    purple: ['#8639E8', '#6B2BC5'],
    dark: ['rgba(0,0,0,0.8)', 'rgba(0,0,0,0.4)'],
  },
};

/**
 * Theme configuration object that combines colors
 * with dark/light mode support
 */
export const theme = {
  light: {
    colors: {
      ...colors,
      background: colors.background.light,
      text: colors.text.light,
    },
  },
  dark: {
    colors: {
      ...colors,
      background: colors.background.dark,
      text: colors.text.dark,
    },
  },
};

export default colors;