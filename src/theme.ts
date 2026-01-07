export const theme = {
  colors: {
    primary: {
      main: '#1F7A3D',     // Brazil Green
      light: '#3FA66A',
      dark: '#14532D',
    },

    secondary: {
      main: '#F2C94C',     // Emblem Yellow
      light: '#F6D776',
      dark: '#C9A227',
    },

    navy: {
      main: '#1C2A5A',     // Official Navy
      light: '#334A8C',
      dark: '#0F1A3A',
    },

    neutral: {
      50: '#FFFFFF',
      100: '#F8FAFC',
      200: '#E5E7EB',
      300: '#D1D5DB',
      400: '#9CA3AF',
      500: '#6B7280',
      600: '#4B5563',
      700: '#374151',
      800: '#1F2937',
      900: '#0B0B0B',
    },

    success: '#1F7A3D',
    warning: '#F2C94C',
    error: '#C62828',
  },

  gradients: {
    /** 🌟 MAIN LOGO MIX — Green + Yellow + Navy */
    primary:
      'linear-gradient(135deg, #1F7A3D 0%, #F2C94C 50%, #1C2A5A 100%)',

    /** 🪪 DOCUMENT / VISA HEADER */
    secondary:
      'linear-gradient(90deg, #0F1A3A 0%, #1F7A3D 45%, #F2C94C 100%)',

    /** 🏛 AUTHORITY / FOOTER */
    authority:
      'linear-gradient(135deg, #1C2A5A 0%, #1F7A3D 60%, #14532D 100%)',

    /** ✨ SOFT ACCENT (backgrounds, cards) */
    soft:
      'linear-gradient(180deg, #F2C94C 0%, #1F7A3D 100%)',
   dark:
      'linear-gradient(180deg, #F2C94C 0%, #1F7A3D 100%)',
  },
};

export type Theme = typeof theme;
