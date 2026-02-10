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
import { useAuthStore } from '../src/stores/authStore';
import { useNotificationStore } from '../src/stores/notificationStore';
import { useChatStore } from '../src/stores/chatStore';
import { FirebaseAuthProvider } from '../src/context/AuthContext';

SplashScreen.preventAutoHideAsync();

function AuthGate({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading, hasCompletedOnboarding, loadPersistedAuth, initAuthListener } = useAuthStore();
  const { initializeNotifications, subscribeToRealtime: subscribeNotifications, unsubscribeAll: unsubNotifications } = useNotificationStore();
  const { subscribeToRealtime: subscribeChat, unsubscribeAll: unsubChat } = useChatStore();
  const segments = useSegments();
  const router = useRouter();

  // Initialize Firebase Auth listener
  useEffect(() => {
    loadPersistedAuth();
    const unsubscribe = initAuthListener();
    return () => unsubscribe();
  }, []);

  // Initialize notifications & real-time subscriptions when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      initializeNotifications();
      subscribeNotifications();
      subscribeChat();
    }

    return () => {
      unsubNotifications();
      unsubChat();
    };
  }, [isAuthenticated]);

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === '(auth)';
    const inOnboarding = segments[0] === 'onboarding';

    if (!isAuthenticated && !inAuthGroup && !inOnboarding) {
      router.replace('/onboarding/welcome');
    } else if (isAuthenticated && !hasCompletedOnboarding && !inOnboarding) {
      router.replace('/onboarding/role-select');
    } else if (isAuthenticated && hasCompletedOnboarding && (inAuthGroup || inOnboarding)) {
      router.replace('/(tabs)');
    }
  }, [isAuthenticated, isLoading, hasCompletedOnboarding, segments]);

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
        <FirebaseAuthProvider>
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
                <Stack.Screen name="analytics" />
                <Stack.Screen name="followers" options={{ presentation: 'modal' }} />
                <Stack.Screen name="following" options={{ presentation: 'modal' }} />
                <Stack.Screen name="report" options={{ presentation: 'modal' }} />
                <Stack.Screen name="post/[id]" />
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
          </ThemeProvider>
        </FirebaseAuthProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
