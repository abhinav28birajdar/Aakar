import AsyncStorage from '@react-native-async-storage/async-storage';
import { Appearance } from 'react-native';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export type ColorScheme = 'light' | 'dark' | 'system';
export type ThemeMode = 'light' | 'dark';

interface ThemeState {
  // Theme settings
  colorScheme: ColorScheme;
  isDark: boolean;
  
  // UI preferences
  reducedMotion: boolean;
  highContrast: boolean;
  fontSize: 'small' | 'normal' | 'large';
  
  // Actions
  setColorScheme: (scheme: ColorScheme) => void;
  setReducedMotion: (enabled: boolean) => void;
  setHighContrast: (enabled: boolean) => void;
  setFontSize: (size: 'small' | 'normal' | 'large') => void;
  toggleTheme: () => void;
}

const getSystemTheme = (): ThemeMode => {
  return Appearance.getColorScheme() === 'dark' ? 'dark' : 'light';
};

const determineIsDark = (colorScheme: ColorScheme): boolean => {
  if (colorScheme === 'system') {
    return getSystemTheme() === 'dark';
  }
  return colorScheme === 'dark';
};

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      colorScheme: 'system',
      isDark: getSystemTheme() === 'dark',
      reducedMotion: false,
      highContrast: false,
      fontSize: 'normal',

      setColorScheme: (scheme: ColorScheme) => {
        set({
          colorScheme: scheme,
          isDark: determineIsDark(scheme),
        });
      },

      setReducedMotion: (enabled: boolean) => {
        set({ reducedMotion: enabled });
      },

      setHighContrast: (enabled: boolean) => {
        set({ highContrast: enabled });
      },

      setFontSize: (size: 'small' | 'normal' | 'large') => {
        set({ fontSize: size });
      },

      toggleTheme: () => {
        const currentScheme = get().colorScheme;
        let newScheme: ColorScheme;
        
        if (currentScheme === 'system') {
          newScheme = get().isDark ? 'light' : 'dark';
        } else if (currentScheme === 'dark') {
          newScheme = 'light';
        } else {
          newScheme = 'dark';
        }
        
        get().setColorScheme(newScheme);
      },
    }),
    {
      name: 'theme-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        colorScheme: state.colorScheme,
        reducedMotion: state.reducedMotion,
        highContrast: state.highContrast,
        fontSize: state.fontSize,
      }),
    }
  )
);

// Listen for system theme changes
Appearance.addChangeListener(({ colorScheme }) => {
  const state = useThemeStore.getState();
  if (state.colorScheme === 'system') {
    useThemeStore.setState({
      isDark: colorScheme === 'dark',
    });
  }
});

// Hook for theme utilities
export const useTheme = () => {
  const {
    colorScheme,
    isDark,
    reducedMotion,
    highContrast,
    fontSize,
    setColorScheme,
    setReducedMotion,
    setHighContrast,
    setFontSize,
    toggleTheme,
  } = useThemeStore();

  return {
    // Current state
    colorScheme,
    isDark,
    themeMode: isDark ? 'dark' as const : 'light' as const,
    reducedMotion,
    highContrast,
    fontSize,
    
    // Actions
    setColorScheme,
    setReducedMotion,
    setHighContrast,
    setFontSize,
    toggleTheme,
    
    // Utilities
    colors: isDark ? {
      background: '#000000',
      surface: '#1c1c1e',
      card: '#2c2c2e',
      border: '#38383a',
      primary: '#ee4d2d',
      text: {
        primary: '#ffffff',
        secondary: '#98989d',
        tertiary: '#636366',
      }
    } : {
      background: '#ffffff',
      surface: '#f9fafb',
      card: '#ffffff',
      border: '#e5e7eb',
      primary: '#ee4d2d',
      text: {
        primary: '#111827',
        secondary: '#6b7280',
        tertiary: '#9ca3af',
      }
    },
  };
};