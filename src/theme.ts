export const theme = {
  colors: {
    primary: {
      main: '#000000',
      light: '#666666',
      dark: '#000000',
    },
    secondary: {
      main: '#333333',
      light: '#999999',
      dark: '#000000',
    },
    navy: {
      main: '#222222',
      light: '#555555',
      dark: '#000000',
    },
    purple: {
      main: '#444444',
      light: '#777777',
      dark: '#111111',
    },
    neutral: {
      50: '#FFFFFF',
      100: '#F5F5F5',
      200: '#E5E5E5',
      300: '#D4D4D4',
      400: '#A3A3A3',
      500: '#737373',
      600: '#525252',
      700: '#404040',
      800: '#262626',
      900: '#171717',
    },
    success: '#666666',
    warning: '#888888',
    error: '#333333',
  },
  gradients: {
    primary: 'linear-gradient(135deg, #000000 0%, #666666 100%)',
    secondary: 'linear-gradient(135deg, #333333 0%, #000000 100%)',
    dark: 'linear-gradient(135deg, #000000 0%, #444444 100%)',
  },
};

export type Theme = typeof theme;
