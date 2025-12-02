import { Colors, designTokens, type Theme, type ThemeColors } from '@/constants/Colors';
import * as SecureStore from 'expo-secure-store';
import { StatusBar } from 'expo-status-bar';
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { useColorScheme as useDeviceColorScheme } from 'react-native';

interface ThemeContextType {
  theme: Theme;
  colors: ThemeColors;
  designTokens: typeof designTokens;
  isDark: boolean;
  setTheme: (theme: Theme | 'system') => void;
  toggleTheme: () => void;
  systemTheme: Theme;
}

const ThemeContext = createContext<ThemeContextType | null>(null);

const THEME_STORAGE_KEY = 'app_theme_preference';

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const systemColorScheme = useDeviceColorScheme();
  const systemTheme: Theme = systemColorScheme ?? 'light';
  
  const [themePreference, setThemePreference] = useState<'light' | 'dark' | 'system'>('system');
  const [isLoaded, setIsLoaded] = useState(false);

  // Determine the active theme based on preference
  const activeTheme: Theme = themePreference === 'system' ? systemTheme : themePreference;
  const isDark = activeTheme === 'dark';

  // Load theme preference on mount
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const stored = await SecureStore.getItemAsync(THEME_STORAGE_KEY);
        if (stored && ['light', 'dark', 'system'].includes(stored)) {
          setThemePreference(stored as 'light' | 'dark' | 'system');
        }
      } catch (error) {
        console.warn('Failed to load theme preference:', error);
      } finally {
        setIsLoaded(true);
      }
    };

    loadTheme();
  }, []);

  // Save theme preference when it changes
  const setTheme = async (theme: Theme | 'system') => {
    try {
      setThemePreference(theme);
      await SecureStore.setItemAsync(THEME_STORAGE_KEY, theme);
    } catch (error) {
      console.warn('Failed to save theme preference:', error);
    }
  };

  const toggleTheme = () => {
    const newTheme = activeTheme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
  };

  const contextValue: ThemeContextType = {
    theme: activeTheme,
    colors: Colors[activeTheme],
    designTokens,
    isDark,
    setTheme,
    toggleTheme,
    systemTheme,
  };

  // Don't render until theme is loaded
  if (!isLoaded) {
    return null;
  }

  return (
    <ThemeContext.Provider value={contextValue}>
      <StatusBar style={isDark ? 'light' : 'dark'} backgroundColor={Colors[activeTheme].background} />
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

// Hook for getting theme-aware colors
export function useThemeColors() {
  const { colors } = useTheme();
  return colors;
}

// Hook for getting design tokens
export function useDesignTokens() {
  const { designTokens } = useTheme();
  return designTokens;
}

// Utility function to create theme-aware styles
export function createThemedStyles<T>(
  styleCreator: (colors: ThemeColors, tokens: typeof designTokens, isDark: boolean) => T
) {
  return () => {
    const { colors, designTokens, isDark } = useTheme();
    return styleCreator(colors, designTokens, isDark);
  };
}

// Enhanced hook that combines theme colors with the useThemeColor functionality
export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName?: keyof ThemeColors
): string {
  const { theme, colors } = useTheme();
  const colorFromProps = props[theme];

  if (colorFromProps) {
    return colorFromProps;
  } else if (colorName && colors[colorName]) {
    return colors[colorName];
  } else {
    return colors.text;
  }
}
