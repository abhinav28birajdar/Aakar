// ============================================================
// Splash Screen - Animated App Launch
// ============================================================
import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../src/stores/authStore';

const { width, height } = Dimensions.get('window');

export default function SplashScreen() {
    const router = useRouter();
    const { user, hasCompletedOnboarding, loadPersistedAuth } = useAuthStore();

    const fadeAnim = useRef(new Animated.Value(0)).current;
    const scaleAnim = useRef(new Animated.Value(0.3)).current;
    const logoRotate = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        // Start animations
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 800,
                useNativeDriver: true,
            }),
            Animated.spring(scaleAnim, {
                toValue: 1,
                friction: 4,
                tension: 40,
                useNativeDriver: true,
            }),
            Animated.timing(logoRotate, {
                toValue: 1,
                duration: 1000,
                useNativeDriver: true,
            }),
        ]).start();

        // Load auth state and navigate
        const initializeApp = async () => {
            await loadPersistedAuth();

            setTimeout(() => {
                const currentUser = useAuthStore.getState().user;
                const onboarded = useAuthStore.getState().hasCompletedOnboarding;

                if (currentUser) {
                    if (onboarded) {
                        router.replace('/(tabs)');
                    } else {
                        router.replace('/onboarding/role-select');
                    }
                } else {
                    router.replace('/onboarding/welcome');
                }
            }, 2000);
        };

        initializeApp();
    }, []);

    const spin = logoRotate.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    });

    return (
        <LinearGradient colors={['#667eea', '#764ba2']} style={styles.container}>
            <Animated.View
                style={[
                    styles.logoContainer,
                    {
                        opacity: fadeAnim,
                        transform: [{ scale: scaleAnim }, { rotate: spin }],
                    },
                ]}
            >
                <View style={styles.logoBox}>
                    <Text style={styles.logoText}>A</Text>
                </View>
            </Animated.View>

            <Animated.View style={[styles.textContainer, { opacity: fadeAnim }]}>
                <Text style={styles.appName}>Aakar</Text>
                <Text style={styles.tagline}>Design. Create. Inspire.</Text>
            </Animated.View>

            <Animated.View style={[styles.footer, { opacity: fadeAnim }]}>
                <View style={styles.loadingDots}>
                    <View style={[styles.dot, styles.dot1]} />
                    <View style={[styles.dot, styles.dot2]} />
                    <View style={[styles.dot, styles.dot3]} />
                </View>
            </Animated.View>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logoContainer: {
        marginBottom: 40,
    },
    logoBox: {
        width: 120,
        height: 120,
        borderRadius: 32,
        backgroundColor: 'rgba(255,255,255,0.25)',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        elevation: 10,
    },
    logoText: {
        fontSize: 64,
        fontWeight: '900',
        color: '#fff',
        letterSpacing: -2,
    },
    textContainer: {
        alignItems: 'center',
    },
    appName: {
        fontSize: 48,
        fontWeight: '900',
        color: '#fff',
        letterSpacing: 2,
        marginBottom: 8,
    },
    tagline: {
        fontSize: 18,
        color: 'rgba(255,255,255,0.9)',
        fontWeight: '500',
        letterSpacing: 1,
    },
    footer: {
        position: 'absolute',
        bottom: 80,
    },
    loadingDots: {
        flexDirection: 'row',
        gap: 8,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: 'rgba(255,255,255,0.6)',
    },
    dot1: {
        opacity: 0.4,
    },
    dot2: {
        opacity: 0.7,
    },
    dot3: {
        opacity: 1,
    },
});
