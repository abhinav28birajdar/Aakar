import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, Platform, KeyboardAvoidingView } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../../src/hooks/useTheme';
import { Button } from '../../src/components/atoms/Button';
import { Input } from '../../src/components/atoms/Input';
import { Lock, ArrowLeft, ShieldCheck } from 'lucide-react-native';
import { MotiView } from 'moti';

export default function ResetPasswordScreen() {
    const router = useRouter();
    const { colors, typography, spacing } = useTheme();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleReset = () => {
        if (!password || password !== confirmPassword) return;
        setLoading(true);
        // Simulate password reset
        setTimeout(() => {
            setLoading(false);
            setIsSuccess(true);
        }, 1500);
    };

    if (isSuccess) {
        return (
            <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
                <View style={styles.content}>
                    <MotiView
                        from={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        style={[styles.successIcon, { backgroundColor: colors.success + '15' }]}
                    >
                        <ShieldCheck size={60} color={colors.success} />
                    </MotiView>

                    <Text style={[styles.title, { color: colors.text, textAlign: 'center' }]}>Password Reset!</Text>
                    <Text style={[styles.subtitle, { color: colors.textSecondary, textAlign: 'center' }]}>
                        Your password has been successfully reset. You can now sign in with your new password.
                    </Text>

                    <Button
                        title="Proceed to Sign In"
                        onPress={() => router.replace('/(auth)/sign-in')}
                        style={styles.button}
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
                        <Text style={[styles.title, { color: colors.text }]}>New Password</Text>
                        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                            Create a strong and unique password to secure your account.
                        </Text>
                    </MotiView>

                    <View style={styles.form}>
                        <Input
                            label="New Password"
                            placeholder="********"
                            value={password}
                            onChangeText={setPassword}
                            isPassword
                            leftIcon={<Lock size={20} color={colors.textSecondary} />}
                        />
                        <Input
                            label="Confirm Password"
                            placeholder="********"
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                            isPassword
                            leftIcon={<Lock size={20} color={colors.textSecondary} />}
                        />

                        <Button
                            title="Reset Password"
                            onPress={handleReset}
                            loading={loading}
                            style={styles.button}
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
        padding: 24,
    },
    successIcon: {
        width: 120,
        height: 120,
        borderRadius: 60,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 32,
    },
    header: {
        marginTop: 20,
        marginBottom: 40,
    },
    title: {
        fontSize: 32,
        fontWeight: '800',
        marginBottom: 12,
    },
    subtitle: {
        fontSize: 16,
        lineHeight: 24,
    },
    form: {
        flex: 1,
    },
    button: {
        marginTop: 16,
        width: '100%',
    },
});
