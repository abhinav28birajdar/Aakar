import { useColorScheme } from 'react-native';
import { COLORS, SIZES, TYPOGRAPHY, SHADOWS } from '../theme';

export const useTheme = () => {
    const colorScheme = useColorScheme() ?? 'light';
    const colors = COLORS[colorScheme as keyof typeof COLORS];

    return {
        isDark: colorScheme === 'dark',
        colors,
        spacing: SIZES,
        borderRadius: SIZES,
        typography: TYPOGRAPHY,
        shadows: SHADOWS,
    };
};
