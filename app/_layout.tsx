import { AuthProvider } from "@/contexts/AuthContext";
import { NotificationProvider } from "@/contexts/NotificationContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { useTheme } from "@/hooks/useTheme";
import { Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold } from "@expo-google-fonts/inter";
import Constants from "expo-constants";
import { useFonts } from "expo-font";
import * as Notifications from "expo-notifications";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
// Import StyleSheet for styling with SDK 54
import { StatusBar } from "expo-status-bar";
import { useCallback, useEffect, useState } from "react";
import { View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

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
  initialRouteName: "index",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  const [expoPushToken, setExpoPushToken] = useState<string | undefined>();
  const [notification, setNotification] = useState<Notifications.Notification | undefined>();

  useEffect(() => {
    // Register for push notifications
    const registerForPushNotificationsAsync = async () => {
      let token;
      try {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
          const { status } = await Notifications.requestPermissionsAsync();
          finalStatus = status;
        }
        if (finalStatus !== 'granted') {
          console.warn('Failed to get push token for push notification!');
          return;
        }
        
        // Updated for Expo SDK 54
        const tokenData = await Notifications.getExpoPushTokenAsync({
          projectId: Constants.expoConfig.extra.projectId || 'unknown',
        });
        
        token = tokenData.data;
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
    <View style={{ flex: 1, backgroundColor: isDark ? '#1C1C1E' : '#F0F0F0' }}>
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