export const designTokens = {
  colors: {
    // Primary Brand Colors
    primary: {
      50: '#fff7ed',
      100: '#ffedd5',
      200: '#fed7aa',
      300: '#fdba74',
      400: '#fb923c',
      500: '#f97316', // Main brand orange
      600: '#ea580c',
      700: '#c2410c',
      800: '#9a3412',
      900: '#7c2d12',
      950: '#431407',
    },
    
    // Neutral Colors
    neutral: {
      50: '#fafafa',
      100: '#f5f5f5',
      200: '#e5e5e5',
      300: '#d4d4d4',
      400: '#a3a3a3',
      500: '#737373',
      600: '#525252',
      700: '#404040',
      800: '#262626',
      900: '#171717',
      950: '#0a0a0a',
    },
    
    // Semantic Colors
    semantic: {
      success: {
        light: '#16a34a',
        dark: '#22c55e',
      },
      warning: {
        light: '#d97706',
        dark: '#f59e0b',
      },
      error: {
        light: '#dc2626',
        dark: '#ef4444',
      },
      info: {
        light: '#2563eb',
        dark: '#3b82f6',
      },
    },
    
    // Background Colors
    background: {
      light: {
        primary: '#ffffff',
        secondary: '#fafafa',
        tertiary: '#f5f5f5',
      },
      dark: {
        primary: '#0a0a0a',
        secondary: '#171717',
        tertiary: '#262626',
      },
    },
    
    // Text Colors
    text: {
      light: {
        primary: '#0a0a0a',
        secondary: '#525252',
        tertiary: '#737373',
        inverse: '#ffffff',
      },
      dark: {
        primary: '#fafafa',
        secondary: '#d4d4d4',
        tertiary: '#a3a3a3',
        inverse: '#0a0a0a',
      },
    },
    
    // Border Colors
    border: {
      light: {
        primary: '#e5e5e5',
        secondary: '#d4d4d4',
        focus: '#f97316',
      },
      dark: {
        primary: '#404040',
        secondary: '#525252',
        focus: '#f97316',
      },
    },
  },
  
  // Typography Scale
  typography: {
    fontSizes: {
      xs: 12,
      sm: 14,
      base: 16,
      lg: 18,
      xl: 20,
      '2xl': 24,
      '3xl': 30,
      '4xl': 36,
      '5xl': 48,
      '6xl': 60,
    },
    
    lineHeights: {
      xs: 16,
      sm: 20,
      base: 24,
      lg: 28,
      xl: 28,
      '2xl': 32,
      '3xl': 36,
      '4xl': 40,
      '5xl': 1,
      '6xl': 1,
    },
    
    fontWeights: {
      thin: '100',
      extralight: '200',
      light: '300',
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
      extrabold: '800',
      black: '900',
    },
    
    letterSpacing: {
      tighter: -0.5,
      tight: -0.25,
      normal: 0,
      wide: 0.25,
      wider: 0.5,
      widest: 1,
    },
  },
  
  // Spacing Scale
  spacing: {
    0: 0,
    0.5: 2,
    1: 4,
    1.5: 6,
    2: 8,
    2.5: 10,
    3: 12,
    3.5: 14,
    4: 16,
    5: 20,
    6: 24,
    7: 28,
    8: 32,
    9: 36,
    10: 40,
    11: 44,
    12: 48,
    14: 56,
    16: 64,
    20: 80,
    24: 96,
    28: 112,
    32: 128,
    36: 144,
    40: 160,
    44: 176,
    48: 192,
    52: 208,
    56: 224,
    60: 240,
    64: 256,
    72: 288,
    80: 320,
    96: 384,
  },
  
  // Border Radius
  borderRadius: {
    none: 0,
    sm: 2,
    base: 4,
    md: 6,
    lg: 8,
    xl: 12,
    '2xl': 16,
    '3xl': 24,
    full: 999,
  },
  
  // Shadows
  shadows: {
    sm: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 1,
    },
    base: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 3,
      elevation: 2,
    },
    md: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 6,
      elevation: 3,
    },
    lg: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.1,
      shadowRadius: 15,
      elevation: 4,
    },
    xl: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 20 },
      shadowOpacity: 0.15,
      shadowRadius: 25,
      elevation: 5,
    },
  },
  
  // Animation Durations
  animation: {
    duration: {
      fastest: 150,
      fast: 200,
      normal: 300,
      slow: 500,
      slowest: 800,
    },
    
    easing: {
      linear: [0, 0, 1, 1],
      ease: [0.25, 0.1, 0.25, 1],
      easeIn: [0.4, 0, 1, 1],
      easeOut: [0, 0, 0.2, 1],
      easeInOut: [0.4, 0, 0.2, 1],
    },
  },
  
  // Z-Index Scale
  zIndex: {
    hide: -1,
    auto: 'auto',
    base: 0,
    docked: 10,
    dropdown: 1000,
    sticky: 1100,
    banner: 1200,
    overlay: 1300,
    modal: 1400,
    popover: 1500,
    skipLink: 1600,
    toast: 1700,
    tooltip: 1800,
  },
} as const;

// Legacy COLORS export for backwards compatibility
export const COLORS = {
  primary: designTokens.colors.primary[500],
  background: designTokens.colors.background.light.primary,
  white: '#FFFFFF',
  black: '#000000',
  gray: designTokens.colors.neutral[400],
  lightGray: designTokens.colors.neutral[200],
  darkGray: designTokens.colors.neutral[600],
  error: designTokens.colors.semantic.error.light,
  success: designTokens.colors.semantic.success.light,
  cardColors: {
    green: '#9CCC90',
    coral: '#E7826A',
    pink: '#F6ADCE',
    purple: '#A569BD',
    peach: '#FFCC99',
  }
};

// Theme-based colors
export const Colors = {
  light: {
    icon: designTokens.colors.text.light.secondary,
    text: designTokens.colors.text.light.primary,
    background: designTokens.colors.background.light.primary,
    tint: designTokens.colors.primary[500],
    tabIconDefault: designTokens.colors.neutral[400],
    tabIconSelected: designTokens.colors.primary[500],
    border: designTokens.colors.border.light.primary,
    card: designTokens.colors.background.light.primary,
    notification: designTokens.colors.primary[500],
  },
  dark: {
    icon: designTokens.colors.text.dark.secondary,
    text: designTokens.colors.text.dark.primary,
    background: designTokens.colors.background.dark.primary,
    tint: designTokens.colors.primary[500],
    tabIconDefault: designTokens.colors.neutral[600],
    tabIconSelected: designTokens.colors.primary[500],
    border: designTokens.colors.border.dark.primary,
    card: designTokens.colors.background.dark.secondary,
    notification: designTokens.colors.primary[500],
  },
};

export type Theme = keyof typeof Colors;
export type ThemeColors = typeof Colors.light | typeof Colors.dark;
