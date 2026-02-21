// ============================================================
// Phone Authentication Screen
// ============================================================
import React, { useState, useRef, useEffect } from 'react';
import {
    View, Text, StyleSheet, TouchableOpacity, ScrollView,
    KeyboardAvoidingView, Platform, Alert, Animated
} from 'react-native';
import { useRouter } from 'expo-router';
import { Phone, ChevronLeft, ArrowRight } from 'lucide-react-native';
import { useTheme } from '../../src/hooks/useTheme';
import { useAuthStore } from '../../src/context/stores/authStore';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Input, Button } from '../../src/components/atoms';

export default function PhoneAuthScreen() {
    const router = useRouter();
    const { colors } = useTheme();
    const { signInWithPhone, verifyOtp, isLoading } = useAuthStore();

    const [phoneNumber, setPhoneNumber] = useState('');
    const [code, setCode] = useState('');
    const [confirmation, setConfirmation] = useState<any>(null);
    const [timer, setTimer] = useState(60);
    const [canResend, setCanResend] = useState(false);

    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (confirmation && timer > 0) {
            interval = setInterval(() => {
                setTimer(prev => prev - 1);
            }, 1000);
        } else if (timer === 0) {
            setCanResend(true);
        }
        return () => clearInterval(interval);
    }, [confirmation, timer]);

    const handleSendCode = async () => {
        if (!phoneNumber || phoneNumber.length < 10) {
            Alert.alert('Invalid Number', 'Please enter a valid phone number with country code (e.g., +1)');
            return;
        }

        const result = await signInWithPhone(phoneNumber);
        if (result.success) {
            setConfirmation(result.confirmation);
            setTimer(60);
            setCanResend(false);
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 500,
                useNativeDriver: true,
            }).start();
        } else {
            Alert.alert('Error', result.error || 'Failed to send verification code');
        }
    };

    const handleVerifyOtp = async () => {
        if (!code || code.length < 6) {
            Alert.alert('Invalid Code', 'Please enter the 6-digit code sent to your phone');
            return;
        }

        const result = await verifyOtp(confirmation, code);
        if (result.success) {
            router.replace('/(tabs)');
        } else {
            Alert.alert('Verification Failed', result.error || 'The code you entered is invalid');
        }
    };

    const handleResend = () => {
        if (canResend) {
            handleSendCode();
        }
    };

    return (
        <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                        <ChevronLeft size={24} color={colors.text} />
                    </TouchableOpacity>
                    <Text style={[styles.title, { color: colors.text }]}>Phone Login</Text>
                </View>

                <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
                    {!confirmation ? (
                        <View>
                            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                                Enter your phone number with country code. We'll send a 6-digit verification code.
                            </Text>
                            <Input
                                label="Phone Number"
                                value={phoneNumber}
                                onChangeText={setPhoneNumber}
                                placeholder="+1 123 456 7890"
                                keyboardType="phone-pad"
                                autoFocus
                                leftIcon={<Phone size={20} color={colors.textMuted} />}
                            />
                            <Button
                                title="Send Verification Code"
                                onPress={handleSendCode}
                                loading={isLoading}
                                icon={<ArrowRight size={18} color="#fff" />}
                                style={{ marginTop: 20 }}
                            />
                        </View>
                    ) : (
                        <Animated.View style={{ opacity: fadeAnim }}>
                            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                                We've sent a code to {phoneNumber}. Enter it below to verify.
                            </Text>
                            <Input
                                label="Verification Code"
                                value={code}
                                onChangeText={setCode}
                                placeholder="123456"
                                keyboardType="number-pad"
                                maxLength={6}
                                autoFocus
                            />
                            <Button
                                title="Verify Code"
                                onPress={handleVerifyOtp}
                                loading={isLoading}
                                style={{ marginTop: 20 }}
                            />
                            <View style={styles.resendRow}>
                                <Text style={{ color: colors.textSecondary }}>Didn't receive code? </Text>
                                <TouchableOpacity onPress={handleResend} disabled={!canResend}>
                                    <Text style={{
                                        color: canResend ? colors.primary : colors.textMuted,
                                        fontWeight: '700'
                                    }}>
                                        {canResend ? 'Resend' : `Resend in ${timer}s`}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                            <TouchableOpacity
                                onPress={() => {
                                    setConfirmation(null);
                                    setCode('');
                                }}
                                style={styles.changeNumber}
                            >
                                <Text style={{ color: colors.primary, fontWeight: '600' }}>Change Phone Number</Text>
                            </TouchableOpacity>
                        </Animated.View>
                    )}
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safe: { flex: 1 },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 15,
    },
    backBtn: {
        padding: 5,
        marginRight: 10,
    },
    title: {
        fontSize: 20,
        fontWeight: '700',
    },
    scroll: {
        paddingHorizontal: 24,
        paddingTop: 20,
    },
    subtitle: {
        fontSize: 16,
        lineHeight: 24,
        marginBottom: 32,
    },
    resendRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 24,
    },
    changeNumber: {
        alignItems: 'center',
        marginTop: 16,
    },
});
