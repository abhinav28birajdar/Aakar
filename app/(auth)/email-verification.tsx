import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, TextInput, Keyboard } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../../hooks/useTheme';
import { Button } from '../../components/Button';
import { ArrowLeft } from 'lucide-react-native';

export default function EmailVerificationScreen() {
    const router = useRouter();
    const { colors, typography, spacing } = useTheme();
    const [code, setCode] = useState(['', '', '', '']);
    const inputs = useRef<TextInput[]>([]);
    const [loading, setLoading] = useState(false);

    const handleInputChange = (text: string, index: number) => {
        const newCode = [...code];
        newCode[index] = text;
        setCode(newCode);

        if (text && index < 3) {
            inputs.current[index + 1].focus();
        }
    };

    const handleKeyPress = (e: any, index: number) => {
        if (e.nativeEvent.key === 'Backspace' && !code[index] && index > 0) {
            inputs.current[index - 1].focus();
        }
    };

    const handleVerify = () => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            router.replace('/(tabs)');
        }, 1500);
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <ArrowLeft size={24} color={colors.text} />
                </TouchableOpacity>
            </View>

            <View style={styles.content}>
                <Text style={[styles.title, { color: colors.text }]}>Verify Email</Text>
                <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                    Enter the 4-digit code sent to your email address john@example.com
                </Text>

                <View style={styles.codeContainer}>
                    {code.map((digit, index) => (
                        <TextInput
                            key={index}
                            ref={(ref) => { inputs.current[index] = ref as TextInput; }}
                            style={[
                                styles.codeInput,
                                {
                                    color: colors.text,
                                    backgroundColor: colors.surface,
                                    borderColor: digit ? colors.primary : colors.border,
                                },
                            ]}
                            maxLength={1}
                            keyboardType="number-pad"
                            value={digit}
                            onChangeText={(text) => handleInputChange(text, index)}
                            onKeyPress={(e) => handleKeyPress(e, index)}
                        />
                    ))}
                </View>

                <Button
                    title="Verify Now"
                    onPress={handleVerify}
                    loading={loading}
                    style={styles.verifyButton}
                />

                <View style={styles.resendContainer}>
                    <Text style={[styles.resendText, { color: colors.textSecondary }]}>
                        Didn't receive the code?{' '}
                    </Text>
                    <TouchableOpacity>
                        <Text style={{ color: colors.primary, fontWeight: '700' }}>Resend</Text>
                    </TouchableOpacity>
                </View>
            </View>
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
    content: {
        padding: 24,
        alignItems: 'center',
    },
    title: {
        fontSize: 28,
        fontWeight: '800',
        marginBottom: 8,
        alignSelf: 'flex-start',
    },
    subtitle: {
        fontSize: 16,
        lineHeight: 24,
        marginBottom: 40,
        alignSelf: 'flex-start',
    },
    codeContainer: {
        flexDirection: 'row',
        gap: 16,
        marginBottom: 40,
    },
    codeInput: {
        width: 64,
        height: 64,
        borderRadius: 16,
        borderWidth: 2,
        textAlign: 'center',
        fontSize: 24,
        fontWeight: '700',
    },
    verifyButton: {
        width: '100%',
    },
    resendContainer: {
        flexDirection: 'row',
        marginTop: 32,
    },
    resendText: {
        fontSize: 14,
    },
});
