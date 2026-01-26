import { useColorScheme } from 'react-native';
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS, TYPOGRAPHY } from '../constants/theme';

export const useTheme = () => {
    const colorScheme = useColorScheme() ?? 'light';
    const colors = COLORS[colorScheme as keyof typeof COLORS];

    return {
        isDark: colorScheme === 'dark',
        colors,
        spacing: SPACING,
        borderRadius: BORDER_RADIUS,
        shadows: SHADOWS,
        typography: TYPOGRAPHY,
    };
};
