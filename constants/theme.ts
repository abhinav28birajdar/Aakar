import { COLORS } from './colors';
import { SPACING, SIZES } from './spacing';

export const THEME = {
    colors: COLORS,
    spacing: SPACING,
    sizes: SIZES,
    typography: {
        h1: { fontSize: 32, fontWeight: '800' as const },
        h2: { fontSize: 24, fontWeight: '700' as const },
        h3: { fontSize: 20, fontWeight: '700' as const },
        body: { fontSize: 16, fontWeight: '400' as const },
        bodyMedium: { fontSize: 16, fontWeight: '500' as const },
        small: { fontSize: 14, fontWeight: '400' as const },
        caption: { fontSize: 12, fontWeight: '600' as const },
    },
    shadows: {
        light: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 2,
        },
        medium: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.15,
            shadowRadius: 12,
            elevation: 4,
        },
    }
};

export type ThemeType = typeof THEME;
