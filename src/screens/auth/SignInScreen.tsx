// ============================================================
// Sign In Screen
// ============================================================
import React, { useState } from 'react';
import {
    View, Text, StyleSheet, TouchableOpacity, ScrollView,
    KeyboardAvoidingView, Platform, Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Mail, Lock } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import { useAuthStore } from '@/context/stores/authStore';
import { isValidEmail } from '@/utils/helpers';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Input, Button } from '@/components/atoms';
import { SocialAuthButtons } from '@/components/auth/SocialAuthButtons';

export default function SignInScreen() {
    const router = useRouter();
    const { colors } = useTheme();
    const { signIn, signInWithGoogle, signInWithApple, isLoading } = useAuthStore();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

    const validate = (): boolean => {
        const errs: typeof errors = {};
        if (!email.trim()) errs.email = 'Email is required';
        else if (!isValidEmail(email)) errs.email = 'Invalid email format';
        if (!password) errs.password = 'Password is required';
        else if (password.length < 6) errs.password = 'Password must be at least 6 characters';
        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const handleSignIn = async () => {
        if (!validate()) return;
        const result = await signIn(email.trim(), password);
        if (result.success) {
            router.replace('/(tabs)');
        } else {
            Alert.alert('Sign In Failed', result.error || 'Please try again');
        }
    };

    const handleGoogleSignIn = async () => {
        const result = await signInWithGoogle();
        if (result.success) {
            if (result.isNewUser) {
                router.replace('/onboarding/role-select');
            } else {
                router.replace('/(tabs)');
            }
        } else {
            Alert.alert('Google Sign-In Failed', result.error || 'Please try again');
        }
    };

    const handleAppleSignIn = async () => {
        const result = await signInWithApple();
        if (result.success) {
            if (result.isNewUser) {
                router.replace('/onboarding/role-select');
            } else {
                router.replace('/(tabs)');
            }
        } else {
            Alert.alert('Apple Sign-In Failed', result.error || 'Please try again');
        }
    };

    return (
        <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
                <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
                    {/* Logo */}
                    <View style={styles.header}>
                        <LinearGradient colors={['#667eea', '#764ba2']} style={styles.logo}>
                            <Text style={styles.logoText}>A</Text>
                        </LinearGradient>
                        <Text style={[styles.title, { color: colors.text }]}>Welcome Back</Text>
                        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Sign in to continue to Aakar</Text>
                    </View>

                    {/* Form */}
                    <Input
                        label="Email"
                        value={email}
                        onChangeText={t => { setEmail(t); setErrors(e => ({ ...e, email: undefined })); }}
                        placeholder="your@email.com"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        leftIcon={<Mail size={20} color={colors.textMuted} />}
                        error={errors.email}
                    />

                    <Input
                        label="Password"
                        value={password}
                        onChangeText={t => { setPassword(t); setErrors(e => ({ ...e, password: undefined })); }}
                        placeholder="Enter your password"
                        isPassword
                        leftIcon={<Lock size={20} color={colors.textMuted} />}
                        error={errors.password}
                    />

                    <TouchableOpacity onPress={() => router.push('/(auth)/forgot-password')} style={{ alignSelf: 'flex-end', marginBottom: 24 }}>
                        <Text style={{ color: colors.primary, fontWeight: '600', fontSize: 14 }}>Forgot Password?</Text>
                    </TouchableOpacity>

                    <Button
                        title="Sign In"
                        onPress={handleSignIn}
                        loading={isLoading}
                        style={{ marginBottom: 12 }}
                    />

                    {/* Divider */}
                    <View style={styles.divider}>
                        <View style={[styles.line, { backgroundColor: colors.border }]} />
                        <Text style={[styles.or, { color: colors.textMuted }]}>OR</Text>
                        <View style={[styles.line, { backgroundColor: colors.border }]} />
                    </View>

                    {/* Social */}
                    <SocialAuthButtons
                        onGooglePress={handleGoogleSignIn}
                        onApplePress={handleAppleSignIn}
                        onPhonePress={() => router.push('/(auth)/phone-auth')}
                        isLoading={isLoading}
                    />

                    {/* Footer */}
                    <View style={styles.footer}>
                        <Text style={{ color: colors.textSecondary, fontSize: 15 }}>Don't have an account? </Text>
                        <TouchableOpacity onPress={() => router.push('/(auth)/sign-up')}>
                            <Text style={{ color: colors.primary, fontSize: 15, fontWeight: '700' }}>Sign Up</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safe: { flex: 1 },
    scroll: { flexGrow: 1, paddingHorizontal: 24, paddingBottom: 40 },
    header: { alignItems: 'center', marginTop: 40, marginBottom: 36 },
    logo: { width: 72, height: 72, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
    logoText: { fontSize: 32, fontWeight: '800', color: '#fff' },
    title: { fontSize: 28, fontWeight: '700', marginBottom: 6 },
    subtitle: { fontSize: 16 },
    divider: { flexDirection: 'row', alignItems: 'center', marginVertical: 12 },
    line: { flex: 1, height: 1 },
    or: { marginHorizontal: 16, fontSize: 13, fontWeight: '600' },
    footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 24 },
});
