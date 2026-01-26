import React from 'react';
import { View, Text, StyleSheet, ImageBackground, SafeAreaView, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../../hooks/useTheme';
import { Button } from '../../components/Button';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView } from 'moti';

const { height } = Dimensions.get('window');

export default function WelcomeScreen() {
    const router = useRouter();
    const { colors, typography, spacing } = useTheme();

    return (
        <View style={styles.container}>
            <ImageBackground
                source={{ uri: 'https://images.unsplash.com/photo-1558655146-d09347e92766?q=80&w=1000&auto=format&fit=crop' }}
                style={styles.backgroundImage}
            >
                <LinearGradient
                    colors={['transparent', 'rgba(0,0,0,0.8)', 'black']}
                    style={styles.gradient}
                >
                    <SafeAreaView style={styles.content}>
                        <MotiView
                            from={{ opacity: 0, translateY: 20 }}
                            animate={{ opacity: 1, translateY: 0 }}
                            transition={{ type: 'timing', duration: 1000 }}
                            style={styles.textContainer}
                        >
                            <Text style={[styles.brand, { color: colors.white }]}>Aakar</Text>
                            <Text style={[styles.title, { color: colors.white }]}>
                                Design Your{'\n'}Creative World
                            </Text>
                            <Text style={[styles.subtitle, { color: 'rgba(255,255,255,0.7)' }]}>
                                Join the largest community of passionate designers and share your inspirations.
                            </Text>
                        </MotiView>

                        <MotiView
                            from={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ type: 'timing', duration: 1000, delay: 500 }}
                            style={styles.buttonContainer}
                        >
                            <Button
                                title="Get Started"
                                onPress={() => router.push('/(auth)/onboarding')}
                                style={styles.button}
                                size="lg"
                            />
                            <Button
                                title="Sign In"
                                variant="ghost"
                                onPress={() => router.push('/(auth)/sign-in')}
                                textStyle={{ color: colors.white }}
                                style={styles.signInButton}
                            />
                        </MotiView>
                    </SafeAreaView>
                </LinearGradient>
            </ImageBackground>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    backgroundImage: {
        flex: 1,
    },
    gradient: {
        flex: 1,
        paddingHorizontal: 24,
    },
    content: {
        flex: 1,
        justifyContent: 'flex-end',
        paddingBottom: 40,
    },
    textContainer: {
        marginBottom: 40,
    },
    brand: {
        fontSize: 24,
        fontWeight: '800',
        letterSpacing: 2,
        marginBottom: 16,
        textTransform: 'uppercase',
    },
    title: {
        fontSize: 42,
        fontWeight: '800',
        lineHeight: 48,
        marginBottom: 16,
    },
    subtitle: {
        fontSize: 16,
        lineHeight: 24,
    },
    buttonContainer: {
        gap: 12,
    },
    button: {
        borderRadius: 16,
    },
    signInButton: {
        height: 56,
    },
});
