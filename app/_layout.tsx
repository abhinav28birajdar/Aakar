import { DarkTheme, DefaultTheme, ThemeProvider as NavThemeProvider } from '@react-navigation/native';
import { Stack, Slot, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AuthProvider, useAuth } from '../contexts/AuthContext';
import { ThemeProvider, useTheme } from '../contexts/ThemeContext';
import { View, ActivityIndicator } from 'react-native';
import { COLORS } from '../constants/theme';

SplashScreen.preventAutoHideAsync();

function RootLayoutNav() {
    const { theme } = useTheme();
    const { isLoading, user } = useAuth();
    const segments = useSegments();
    const router = useRouter();

    useEffect(() => {
        if (isLoading) return;

        const inAuthGroup = segments[0] === '(auth)';

        if (!user && !inAuthGroup) {
            // Redirect to the sign-in page.
            router.replace('/(auth)/onboarding'); // or login
        } else if (user && inAuthGroup) {
            // Redirect away from the sign-in page.
            router.replace('/(tabs)');
        }
    }, [user, segments, isLoading]);

    useEffect(() => {
        if (!isLoading) {
            SplashScreen.hideAsync();
        }
    }, [isLoading]);

    if (isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme === 'dark' ? COLORS.dark.background : COLORS.light.background }}>
                <ActivityIndicator size="large" color={theme === 'dark' ? COLORS.dark.primary : COLORS.light.primary} />
            </View>
        );
    }

    return (
        <NavThemeProvider value={theme === 'dark' ? DarkTheme : DefaultTheme}>
            <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="(auth)" options={{ headerShown: false }} />
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

                {/* Specific screens that shouldn't be in tabs but global stack */}
                <Stack.Screen name="notifications" options={{ presentation: 'card', headerShown: false }} />
                <Stack.Screen name="followers" options={{ presentation: 'card', title: 'Followers' }} />
                <Stack.Screen name="following" options={{ presentation: 'card', title: 'Following' }} />
                <Stack.Screen name="settings" options={{ presentation: 'card', title: 'Settings' }} />
                <Stack.Screen name="help" options={{ presentation: 'card', title: 'Help & Support' }} />
                <Stack.Screen name="edit-profile" options={{ presentation: 'modal', headerShown: false }} />
                <Stack.Screen name="search" options={{ headerShown: false }} />
                <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
            </Stack>
        </NavThemeProvider>
    );
}

export default function RootLayout() {
    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <ThemeProvider>
                <AuthProvider>
                    <RootLayoutNav />
                </AuthProvider>
            </ThemeProvider>
        </GestureHandlerRootView>
    );
}
