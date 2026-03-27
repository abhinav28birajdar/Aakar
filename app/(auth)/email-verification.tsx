import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, Platform, KeyboardAvoidingView, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../../src/hooks/useTheme';
import { Button } from '../../components/ui/Button';
import { ArrowLeft, Mail } from 'lucide-react-native';
import { MotiView } from 'moti';

export default function EmailVerificationScreen() {
    const router = useRouter();
    const { colors } = useTheme();
    const [code, setCode] = useState(['', '', '', '', '', '']);
    const [loading, setLoading] = useState(false);
    const [timer, setTimer] = useState(60);

    useEffect(() => {
        const interval = setInterval(() => {
            setTimer((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    const handleChange = (text: string, index: number) => {
        const newCode = [...code];
        newCode[index] = text;
        setCode(newCode);

        // Logic to auto focus next input would go here
    };

    const handleVerify = () => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            router.replace('/(tabs)/home');
        }, 1500);
    };

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
                        <View style={[styles.iconContainer, { backgroundColor: colors.primary + '15' }]}>
                            <Mail size={32} color={colors.primary} />
                        </View>
                        <Text style={[styles.title, { color: colors.text }]}>Verify Email</Text>
                        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                            We've sent a 6-digit verification code to your email address. Please enter it below.
                        </Text>
                    </MotiView>

                    <View style={styles.otpContainer}>
                        {code.map((digit, index) => (
                            <TextInput
                                key={index}
                                style={[
                                    styles.otpInput,
                                    {
                                        color: colors.text,
                                        borderColor: digit ? colors.primary : colors.border,
                                        backgroundColor: colors.surfaceAlt
                                    }
                                ]}
                                maxLength={1}
                                keyboardType="number-pad"
                                value={digit}
                                onChangeText={(text) => handleChange(text, index)}
                            />
                        ))}
                    </View>

                    <Button
                        title="Verify Account"
                        onPress={handleVerify}
                        loading={loading}
                        style={styles.button}
                    />

                    <View style={styles.footer}>
                        <Text style={[styles.footerText, { color: colors.textSecondary }]}>
                            Didn't receive the code?{' '}
                        </Text>
                        <TouchableOpacity disabled={timer > 0}>
                            <Text style={[styles.resendText, { color: timer > 0 ? colors.textMuted : colors.primary }]}>
                                {timer > 0 ? `Resend in ${timer}s` : 'Resend Code'}
                            </Text>
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
    header: {
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 40,
    },
    iconContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
    },
    title: {
        fontSize: 28,
        fontWeight: '800',
        marginBottom: 12,
    },
    subtitle: {
        fontSize: 16,
        lineHeight: 24,
        textAlign: 'center',
    },
    otpContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 40,
    },
    otpInput: {
        width: 45,
        height: 55,
        borderRadius: 12,
        borderWidth: 1.5,
        textAlign: 'center',
        fontSize: 24,
        fontWeight: '700',
    },
    button: {
        width: '100%',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 32,
    },
    footerText: {
        fontSize: 14,
    },
    resendText: {
        fontSize: 14,
        fontWeight: '700',
    },
});
