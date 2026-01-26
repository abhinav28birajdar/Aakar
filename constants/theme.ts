import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const COLORS = {
    light: {
        primary: '#667eea', // Start of gradient
        primaryGradient: ['#667eea', '#764ba2'],
        secondary: '#f7f7f7', // Secondary background
        background: '#FFFFFF',
        surface: '#F7F7F7',
        surfaceAlt: '#F0F0F0',
        text: '#1A1A1A', // Text Primary
        textSecondary: '#6B6B6B',
        textMuted: '#9E9E9E',
        accent: '#FF6B6B',
        success: '#4CAF50',
        error: '#F44336',
        border: '#E0E0E0',
        white: '#FFFFFF',
        black: '#000000',
        card: '#FFFFFF',
        tabBar: '#FFFFFF',
    },
    dark: {
        primary: '#7C93FF', // Start of gradient
        primaryGradient: ['#7C93FF', '#8E6FB8'],
        secondary: '#1E1E1E', // Secondary background
        background: '#0A0A0A', // True black
        surface: '#121212', // Slightly lighter
        surfaceAlt: '#1E1E1E',
        text: '#FFFFFF',
        textSecondary: '#B0B0B0',
        textMuted: '#64748b',
        accent: '#FF8A80',
        success: '#66BB6A',
        error: '#EF5350',
        border: '#2C2C2C',
        white: '#FFFFFF',
        black: '#000000',
        card: '#121212',
        tabBar: '#121212',
    },
};

export const SIZES = {
    width,
    height,
    // Spacing
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 40,

    // Border Radius
    radXs: 4,
    radSm: 8,
    radMd: 12,
    radLg: 16,
    radXl: 24,
    radFull: 9999,
};

export const TYPOGRAPHY = {
    hero: {
        fontSize: 32,
        fontWeight: '700' as const,
        lineHeight: 40,
    },
    h1: {
        fontSize: 28,
        fontWeight: '700' as const,
        lineHeight: 34,
    },
    h2: {
        fontSize: 24,
        fontWeight: '600' as const,
        lineHeight: 32,
    },
    h3: {
        fontSize: 20,
        fontWeight: '600' as const,
        lineHeight: 28,
    },
    body: {
        fontSize: 16,
        fontWeight: '400' as const,
        lineHeight: 24,
    },
    bodyMedium: {
        fontSize: 16,
        fontWeight: '500' as const,
        lineHeight: 24,
    },
    caption: {
        fontSize: 14,
        fontWeight: '400' as const,
        lineHeight: 20,
    },
    small: {
        fontSize: 12,
        fontWeight: '400' as const,
        lineHeight: 16,
    },
};

export const SHADOWS = {
    light: {
        sm: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.05,
            shadowRadius: 3,
            elevation: 2,
        },
        md: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 4,
        },
        lg: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 10 },
            shadowOpacity: 0.15,
            shadowRadius: 20,
            elevation: 10,
        },
    },
    dark: {
        sm: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.3,
            shadowRadius: 3,
            elevation: 2,
        },
        md: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 4,
        },
        lg: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 10 },
            shadowOpacity: 0.4,
            shadowRadius: 20,
            elevation: 10,
        },
    },
};
