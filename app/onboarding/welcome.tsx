import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../../src/hooks/useTheme';
import { Button } from '../../components/ui/Button';
import { Image } from 'expo-image';
import { MotiView } from 'moti';

const { width } = Dimensions.get('window');

export default function WelcomeScreen() {
    const { colors, typography } = useTheme();
    const router = useRouter();

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={styles.content}>
                <MotiView
                    from={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: 'spring', duration: 1000 }}
                    style={styles.logoContainer}
                >
                    <Image
                        source={require('../../src/assets/icon.png')}
                        style={styles.logo}
                    />
                </MotiView>

                <MotiView
                    from={{ opacity: 0, translateY: 20 }}
                    animate={{ opacity: 1, translateY: 0 }}
                    transition={{ delay: 300 }}
                    style={styles.textContainer}
                >
                    <Text style={[styles.title, { color: colors.text }]}>Welcome to Aakar</Text>
                    <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                        The ultimate destination for creative minds to discover and share design inspiration.
                    </Text>
                </MotiView>
            </View>

            <View style={styles.footer}>
                <Button
                    title="Get Started"
                    onPress={() => router.push('/onboarding/features')}
                    style={styles.btn}
                />
                <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
                    <Text style={[styles.loginText, { color: colors.primary }]}>Already have an account? Log In</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 40,
    },
    logoContainer: {
        width: 120,
        height: 120,
        marginBottom: 40,
    },
    logo: {
        width: '100%',
        height: '100%',
    },
    textContainer: {
        alignItems: 'center',
    },
    title: {
        fontSize: 32,
        fontWeight: '900',
        textAlign: 'center',
        marginBottom: 16,
    },
    subtitle: {
        fontSize: 16,
        textAlign: 'center',
        lineHeight: 24,
    },
    footer: {
        padding: 40,
        gap: 20,
        alignItems: 'center',
    },
    btn: {
        width: '100%',
    },
    loginText: {
        fontSize: 14,
        fontWeight: '700',
    },
});

import { TouchableOpacity } from 'react-native-gesture-handler';
