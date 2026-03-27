import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, Platform, KeyboardAvoidingView } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../../src/hooks/useTheme';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Mail, ArrowLeft, CheckCircle2 } from 'lucide-react-native';
import { MotiView } from 'moti';

export default function ForgotPasswordScreen() {
    const router = useRouter();
    const { colors } = useTheme();
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleReset = () => {
        if (!email) return;
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            setIsSubmitted(true);
        }, 1500);
    };

    if (isSubmitted) {
        return (
            <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
                <View style={styles.content}>
                    <MotiView
                        from={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ type: 'spring', duration: 1000 }}
                        style={[styles.successIcon, { backgroundColor: colors.success + '15' }]}
                    >
                        <CheckCircle2 size={60} color={colors.success} />
                    </MotiView>

                    <Text style={[styles.title, { color: colors.text }]}>Check Your Email</Text>
                    <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                        We've sent a password reset link to {email}
                    </Text>

                    <Button
                        title="Back to Login"
                        onPress={() => router.replace('/(auth)/login')}
                        style={styles.btn}
                    />
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <ArrowLeft size={24} color={colors.text} />
                </TouchableOpacity>

                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                    <MotiView
                        from={{ opacity: 0, translateY: -20 }}
                        animate={{ opacity: 1, translateY: 0 }}
                        style={styles.header}
                    >
                        <Text style={[styles.title, { color: colors.text }]}>Forgot Password?</Text>
                        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                            Don't worry, it happens. Enter your email and we'll send you a reset link.
                        </Text>
                    </MotiView>

                    <View style={styles.form}>
                        <Input
                            label="Email Address"
                            placeholder="name@example.com"
                            value={email}
                            onChangeText={setEmail}
                            icon={<Mail size={20} color={colors.textSecondary} />}
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />

                        <Button
                            title="Send Reset Link"
                            onPress={handleReset}
                            loading={loading}
                            style={styles.btn}
                        />
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
    backButton: {
        width: 44,
        height: 44,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 16,
        marginTop: 8,
    },
    scrollContent: {
        padding: 24,
        flexGrow: 1,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 40,
    },
    successIcon: {
        width: 120,
        height: 120,
        borderRadius: 60,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 32,
        marginTop: -60,
    },
    header: {
        marginTop: 20,
        marginBottom: 40,
    },
    title: {
        fontSize: 32,
        fontWeight: '900',
        marginBottom: 12,
        textAlign: 'left',
    },
    subtitle: {
        fontSize: 16,
        lineHeight: 24,
        textAlign: 'left',
    },
    form: {
        flex: 1,
    },
    btn: {
        marginTop: 16,
        width: '100%',
    },
});
