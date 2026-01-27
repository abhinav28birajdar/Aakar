import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, Platform, KeyboardAvoidingView } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../../src/hooks/useTheme';
import { Button } from '../../src/components/atoms/Button';
import { Input } from '../../src/components/atoms/Input';
import { Mail, Lock, Github, Chrome, Apple } from 'lucide-react-native';
import { MotiView } from 'moti';

export default function SignInScreen() {
    const router = useRouter();
    const { colors, typography, spacing } = useTheme();
    const [email, setEmail] = useState('abhinavbirajdar28@gmail.com');
    const [password, setPassword] = useState('12345678');
    const [loading, setLoading] = useState(false);

    const handleSignIn = () => {
        setLoading(true);
        // Simulate sign in
        setTimeout(() => {
            setLoading(false);
            router.replace('/(tabs)');
        }, 1500);
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                    <MotiView
                        from={{ opacity: 0, translateY: -20 }}
                        animate={{ opacity: 1, translateY: 0 }}
                        style={styles.header}
                    >
                        <Text style={[styles.title, { color: colors.text }]}>Welcome Back</Text>
                        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                            Enter your credentials to access your account
                        </Text>
                    </MotiView>

                    <View style={styles.form}>
                        <Input
                            label="Email Address"
                            placeholder="name@example.com"
                            value={email}
                            onChangeText={setEmail}
                            leftIcon={<Mail size={20} color={colors.textSecondary} />}
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />
                        <Input
                            label="Password"
                            placeholder="********"
                            value={password}
                            onChangeText={setPassword}
                            isPassword
                            leftIcon={<Lock size={20} color={colors.textSecondary} />}
                        />

                        <TouchableOpacity
                            onPress={() => router.push('/(auth)/forgot-password')}
                            style={styles.forgotPassword}
                        >
                            <Text style={[styles.forgotPasswordText, { color: colors.primary }]}>
                                Forgot Password?
                            </Text>
                        </TouchableOpacity>

                        <Button
                            title="Sign In"
                            onPress={handleSignIn}
                            loading={loading}
                            style={styles.signInButton}
                        />
                    </View>

                    <View style={styles.dividerContainer}>
                        <View style={[styles.divider, { backgroundColor: colors.border }]} />
                        <Text style={[styles.dividerText, { color: colors.textSecondary }]}>Or continue with</Text>
                        <View style={[styles.divider, { backgroundColor: colors.border }]} />
                    </View>

                    <View style={styles.socialContainer}>
                        <TouchableOpacity style={[styles.socialButton, { borderColor: colors.border }]}>
                            <Chrome size={24} color={colors.text} />
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.socialButton, { borderColor: colors.border }]}>
                            <Apple size={24} color={colors.text} />
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.socialButton, { borderColor: colors.border }]}>
                            <Github size={24} color={colors.text} />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.footer}>
                        <Text style={[styles.footerText, { color: colors.textSecondary }]}>
                            Don't have an account?{' '}
                        </Text>
                        <TouchableOpacity onPress={() => router.push('/(auth)/sign-up')}>
                            <Text style={[styles.signUpText, { color: colors.primary }]}>Sign Up</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContent: {
        padding: 24,
        flexGrow: 1,
    },
    header: {
        marginTop: 40,
        marginBottom: 40,
    },
    title: {
        fontSize: 32,
        fontWeight: '800',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        lineHeight: 24,
    },
    form: {
        marginBottom: 32,
    },
    forgotPassword: {
        alignSelf: 'flex-end',
        marginBottom: 24,
    },
    forgotPasswordText: {
        fontSize: 14,
        fontWeight: '600',
    },
    signInButton: {
        width: '100%',
    },
    dividerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 32,
    },
    divider: {
        flex: 1,
        height: 1,
    },
    dividerText: {
        paddingHorizontal: 16,
        fontSize: 14,
    },
    socialContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 16,
        marginBottom: 40,
    },
    socialButton: {
        width: 60,
        height: 60,
        borderRadius: 30,
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 'auto',
        paddingBottom: 20,
    },
    footerText: {
        fontSize: 14,
    },
    signUpText: {
        fontSize: 14,
        fontWeight: '700',
    },
});
