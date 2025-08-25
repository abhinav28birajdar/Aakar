import { useColorScheme } from './useColorScheme';

export function useTheme() {
  const colorScheme = useColorScheme();
  return {
    isDark: colorScheme === 'dark',
  };
}
