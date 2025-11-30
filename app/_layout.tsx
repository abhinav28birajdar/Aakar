import { ErrorBoundary } from '@/components/ErrorBoundary';
import { useAuth } from '@/lib/store/auth';
import { useNotifications } from '@/lib/store/notifications';
import { useTheme } from '@/lib/store/theme';
import { useApiKeys, apiKeyManager } from '@/lib/config/api-keys';
import { ApiConfigScreen } from '@/components/ApiConfigScreen';
import { Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold } from '@expo-google-fonts/inter';
import { useFonts } from 'expo-font';
import * as Notifications from 'expo-notifications';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState, useCallback } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

// Configure notification handling
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export const unstable_settings = {
  initialRouteName: 'index',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

function AppContent() {
  const { isDark } = useTheme();
  const { initialize: initAuth, initialized: authInitialized } = useAuth();
  const { registerForPushNotifications } = useNotifications();
  const { isConfigured: apiConfigured, loading: apiLoading } = useApiKeys();
  
  const [appReady, setAppReady] = useState(false);

  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  const initializeApp = useCallback(async () => {
    try {
      // Initialize API keys first
      if (apiConfigured) {
        await apiKeyManager.initialize();
        
        // Initialize auth after API keys are set
        await initAuth();
        
        // Setup push notifications
        await registerForPushNotifications();
      }
    } catch (error) {
      console.error('App initialization error:', error);
    } finally {
      setAppReady(true);
    }
  }, [apiConfigured, initAuth, registerForPushNotifications]);

  useEffect(() => {
    if (fontsLoaded && !apiLoading) {
      initializeApp();
    }
  }, [fontsLoaded, apiLoading, initializeApp]);

  const onLayoutRootView = useCallback(async () => {
    if (appReady && fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [appReady, fontsLoaded]);

  // Show loading while fonts are loading or API is initializing
  if (!fontsLoaded || apiLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#ee4d2d" />
        <Text style={{ marginTop: 16, fontSize: 16, color: '#666' }}>
          Loading Aakar...
        </Text>
      </View>
    );
  }

  // Show API configuration screen if not configured
  if (!apiConfigured) {
    return (
      <ApiConfigScreen 
        isSetupMode={true}
        onComplete={() => {
          // The useApiKeys hook will automatically update when config is saved
        }}
      />
    );
  }

  // Show loading while app is initializing
  if (!appReady) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#ee4d2d" />
        <Text style={{ marginTop: 16, fontSize: 16, color: '#666' }}>
          Initializing...
        </Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(design)" options={{ headerShown: false }} />
        <Stack.Screen 
          name="modal" 
          options={{ 
            presentation: 'modal',
            headerTitle: '',
            headerStyle: {
              backgroundColor: isDark ? '#1C1C1E' : '#FFFFFF',
            },
          }} 
        />
        <Stack.Screen 
          name="notifications" 
          options={{
            title: 'Notifications',
            headerStyle: {
              backgroundColor: isDark ? '#1C1C1E' : '#FFFFFF',
            },
            headerTintColor: isDark ? '#FFFFFF' : '#000000',
          }} 
        />
      </Stack>
      <StatusBar style={isDark ? 'light' : 'dark'} />
    </View>
  );
}

export default function RootLayout() {
  return (
    <ErrorBoundary>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaProvider>
          <AppContent />
        </SafeAreaProvider>
      </GestureHandlerRootView>
    </ErrorBoundary>
  );
}
        let finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
          const { status } = await Notifications.requestPermissionsAsync();
          finalStatus = status;
        }
        if (finalStatus !== 'granted') {
          console.warn('Failed to get push token for push notification!');
          return;
        }
        token = (await Notifications.getExpoPushTokenAsync()).data;
        setExpoPushToken(token);
      } catch (e) {
        console.error('Error registering for push notifications:', e);
      }
    };

    registerForPushNotificationsAsync();

    // Notification listeners
    const notificationListener = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
    });

    const responseListener = Notifications.addNotificationResponseReceivedListener(response => {
      console.log('Notification tapped:', response);
      // Handle navigation based on notification data
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener);
      Notifications.removeNotificationSubscription(responseListener);
    };
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaProvider onLayout={onLayoutRootView}>
      <ThemeProvider>
        <AuthProvider>
          <NotificationProvider>
            <RootLayoutNav />
          </NotificationProvider>
        </AuthProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

function RootLayoutNav() {
  const { isDark } = useTheme();
  
  return (
    <View className={cn("flex-1", isDark ? "bg-dark-background" : "bg-background")}>
      <StatusBar style={isDark ? "light" : "dark"} />
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: isDark ? '#1C1C1E' : '#FFFFFF',
          },
          headerTintColor: isDark ? '#FFFFFF' : '#000000',
          headerTitleStyle: {
            fontFamily: 'Inter_600SemiBold',
          },
          headerShadowVisible: false,
          animation: 'slide_from_right',
        }}
      >
        {/* Authentication Group */}
        <Stack.Screen 
          name="(auth)" 
          options={{ 
            headerShown: false,
            animation: 'fade',
          }} 
        />
        
        {/* Main App Tabs */}
        <Stack.Screen 
          name="(tabs)" 
          options={{ 
            headerShown: false,
            animation: 'fade',
          }} 
        />
        
        {/* Design Screens */}
        <Stack.Screen 
          name="(design)" 
          options={{ 
            headerShown: false 
          }} 
        />

        {/* Modal Screens */}
        <Stack.Screen 
          name="design/edit" 
          options={{ 
            presentation: 'modal',
            title: 'Edit Design',
            animation: 'slide_from_bottom',
          }} 
        />
        <Stack.Screen 
          name="modal" 
          options={{ 
            presentation: 'modal',
            title: 'Information',
            animation: 'slide_from_bottom',
          }} 
        />

        {/* Detail Screens */}
        <Stack.Screen 
          name="project/[id]" 
          options={{ 
            title: 'Project Details',
          }} 
        />
        <Stack.Screen 
          name="designer/[id]" 
          options={{ 
            title: 'Designer Profile',
          }} 
        />
      </Stack>
    </View>
  );
}