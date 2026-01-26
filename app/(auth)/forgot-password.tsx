import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../../hooks/useTheme';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { Mail, ArrowLeft } from 'lucide-react-native';

export default function ForgotPasswordScreen() {
    const router = useRouter();
    const { colors, typography, spacing } = useTheme();
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleReset = () => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            setSuccess(true);
        }, 1500);
    };

    if (success) {
        return (
            <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
                <View style={styles.successContent}>
                    <Text style={styles.successIcon}>📧</Text>
                    <Text style={[styles.title, { color: colors.text }]}>Check your email</Text>
                    <Text style={[styles.subtitle, { color: colors.textSecondary, textAlign: 'center' }]}>
                        We have sent a password recovery instructions to your email.
                    </Text>
                    <Button
                        title="Open Email App"
                        onPress={() => { }}
                        style={{ width: '100%', marginTop: 32 }}
                    />
                    <TouchableOpacity onPress={() => router.push('/(auth)/sign-in')} style={{ marginTop: 24 }}>
                        <Text style={{ color: colors.primary, fontWeight: '700' }}>Back to Sign In</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <ArrowLeft size={24} color={colors.text} />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                <Text style={[styles.title, { color: colors.text }]}>Forgot Password</Text>
                <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                    Enter your email and we will send you a link to reset your password.
                </Text>

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

                    <Button
                        title="Send Reset Link"
                        onPress={handleReset}
                        loading={loading}
                        style={styles.submitButton}
                    />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        padding: 24,
    },
    backButton: {
        width: 44,
        height: 44,
        justifyContent: 'center',
    },
    scrollContent: {
        padding: 24,
    },
    title: {
        fontSize: 28,
        fontWeight: '800',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        lineHeight: 24,
        marginBottom: 32,
    },
    form: {
        marginTop: 8,
    },
    submitButton: {
        marginTop: 16,
    },
    successContent: {
        flex: 1,
        padding: 24,
        justifyContent: 'center',
        alignItems: 'center',
    },
    successIcon: {
        fontSize: 64,
        marginBottom: 24,
    },
});
