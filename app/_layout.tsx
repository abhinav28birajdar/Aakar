// ============================================================
// Root Layout - App Entry Point (Firebase)
// ============================================================
import { useEffect } from 'react';
import { useColorScheme } from 'react-native';
import { Stack, useRouter, useSegments } from 'expo-router';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as SplashScreen from 'expo-splash-screen';
import { useAuthStore } from '../src/context/stores/authStore';
import { useNotificationStore } from '../src/context/stores/notificationStore';
import { useChatStore } from '../src/context/stores/chatStore';
import Toast from 'react-native-toast-message';


SplashScreen.preventAutoHideAsync();

import { useAppInitialization } from '../src/hooks/useAppInitialization';

function AuthGate({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading, hasCompletedOnboarding } = useAuthStore();
  const segments = useSegments();
  const router = useRouter();

  // Unified application initialization
  useAppInitialization();

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === '(auth)';
    const inOnboarding = segments[0] === 'onboarding';
    const inSplash = segments[0] === 'splash';

    if (!isAuthenticated && !inAuthGroup && !inOnboarding && !inSplash) {
      router.replace('/splash');
    } else if (isAuthenticated && hasCompletedOnboarding && (inAuthGroup || inOnboarding || inSplash)) {
      router.replace('/(tabs)');
    } else if (isAuthenticated && !hasCompletedOnboarding && !inOnboarding) {
      router.replace('/onboarding/role-select');
    }
  }, [isAuthenticated, isLoading, hasCompletedOnboarding, segments]);

  if (isLoading) {
    return null; // Or a custom loading component
  }

  return <>{children}</>;
}

export default function RootLayout() {
  const colorScheme = useColorScheme();

  useEffect(() => {
    const prepare = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 800));
      } catch (e) {
        console.warn(e);
      } finally {
        await SplashScreen.hideAsync();
      }
    };
    prepare();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <AuthGate>
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="(auth)" />
              <Stack.Screen name="(tabs)" />
              <Stack.Screen name="onboarding" />
              <Stack.Screen name="index" />
              <Stack.Screen name="edit-profile" options={{ presentation: 'modal' }} />
              <Stack.Screen name="search" />
              <Stack.Screen name="settings" />
              <Stack.Screen name="dashboard" />
              <Stack.Screen name="followers" options={{ presentation: 'modal' }} />
              <Stack.Screen name="following" options={{ presentation: 'modal' }} />
              <Stack.Screen name="report" options={{ presentation: 'modal' }} />
              <Stack.Screen name="post/[id]" />
              <Stack.Screen name="post/edit/[id]" />
              <Stack.Screen name="profile/[username]" />
              <Stack.Screen name="category/[id]" />
              <Stack.Screen name="chat/chat-list" />
              <Stack.Screen name="chat/chat-room" />
              <Stack.Screen name="chat/create-chat" options={{ presentation: 'modal' }} />
              <Stack.Screen name="messages/[id]" />
              <Stack.Screen name="challenges/index" />
              <Stack.Screen name="challenges/[id]" />
              <Stack.Screen name="learning/index" />
              <Stack.Screen name="learning/[id]" />
              <Stack.Screen name="jobs/index" />
              <Stack.Screen name="modal" options={{ presentation: 'modal', headerShown: false }} />
            </Stack>
          </AuthGate>
          <Toast />
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
