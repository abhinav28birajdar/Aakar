import { Stack } from 'expo-router';
import { useTheme } from '@/contexts/ThemeContext';
import { IS_IOS } from '@/lib/utils/env';

export default function DesignLayout() {
  const { isDark } = useTheme();
  
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: isDark ? '#1C1C1E' : '#FFFFFF',
        },
        headerTintColor: isDark ? '#FFFFFF' : '#000000',
        headerShadowVisible: false,
        headerBackTitle: IS_IOS ? 'Back' : undefined,
        animation: 'slide_from_right',
        presentation: 'modal',
        gestureEnabled: true,
        gestureDirection: 'horizontal',
      }}
    >
      <Stack.Screen 
        name="edit"
        options={{
          title: 'New Design',
          headerStyle: {
            backgroundColor: isDark ? '#000000' : '#FFFFFF',
          },
          headerTintColor: isDark ? '#FFFFFF' : '#000000',
        }}
      />
      <Stack.Screen
        name="[id]"
        options={{
          title: 'Design Details',
          headerStyle: {
            backgroundColor: isDark ? '#000000' : '#FFFFFF',
          },
          headerTintColor: isDark ? '#FFFFFF' : '#000000',
        }}
      />
}
