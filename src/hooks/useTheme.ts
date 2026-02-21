import { useColorScheme } from 'react-native';
import { COLORS, SIZES, TYPOGRAPHY, SHADOWS } from '../theme';

export const useTheme = () => {
    const colorScheme = useColorScheme() ?? 'light';
    const colors = COLORS[colorScheme as keyof typeof COLORS];
    const shadows = SHADOWS[colorScheme as keyof typeof SHADOWS];

    return {
        isDark: colorScheme === 'dark',
        colors,
        spacing: SIZES,
        borderRadius: SIZES,
        typography: TYPOGRAPHY,
        shadows,
        mode: colorScheme,
    };
};
