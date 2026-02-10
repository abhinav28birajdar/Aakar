// ============================================================
// Email Verification (OTP) Screen
// ============================================================
import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, MailCheck } from 'lucide-react-native';
import { useTheme } from '../../src/hooks/useTheme';
import { useAuthStore } from '../../src/stores/authStore';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function EmailVerificationScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { verifyEmail, resendVerification, emailForVerification, isLoading } = useAuthStore();

  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const inputs = useRef<(TextInput | null)[]>([]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(c => c - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [countdown]);

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) {
      // Handle paste
      const digits = value.replace(/[^0-9]/g, '').split('').slice(0, 6);
      const newCode = [...code];
      digits.forEach((d, i) => { if (index + i < 6) newCode[index + i] = d; });
      setCode(newCode);
      const nextIndex = Math.min(index + digits.length, 5);
      inputs.current[nextIndex]?.focus();
      return;
    }

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    if (value && index < 5) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (index: number, key: string) => {
    if (key === 'Backspace' && !code[index] && index > 0) {
      inputs.current[index - 1]?.focus();
      const newCode = [...code];
      newCode[index - 1] = '';
      setCode(newCode);
    }
  };

  const handleVerify = async () => {
    const codeStr = code.join('');
    if (codeStr.length !== 6) {
      Alert.alert('Invalid Code', 'Please enter a valid 6-digit code');
      return;
    }
    const result = await verifyEmail(codeStr);
    if (result.success) {
      router.replace('/onboarding/role-select');
    } else {
      Alert.alert('Verification Failed', result.error || 'Invalid code');
      setCode(['', '', '', '', '', '']);
      inputs.current[0]?.focus();
    }
  };

  const handleResend = async () => {
    const result = await resendVerification();
    if (result.success) {
      setCountdown(60);
      setCanResend(false);
      Alert.alert('Code Sent', 'A new code has been sent to your email');
    }
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
        <ArrowLeft size={24} color={colors.text} />
      </TouchableOpacity>

      <View style={styles.content}>
        <LinearGradient colors={['#667eea', '#764ba2']} style={styles.iconWrap}>
          <MailCheck size={36} color="#fff" />
        </LinearGradient>

        <Text style={[styles.title, { color: colors.text }]}>Verify Your Email</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Enter the 6-digit code sent to{'\n'}
          <Text style={{ fontWeight: '700', color: colors.text }}>{emailForVerification || 'your email'}</Text>
        </Text>

        {/* OTP Inputs */}
        <View style={styles.otpRow}>
          {code.map((digit, i) => (
            <TextInput
              key={i}
              ref={ref => { inputs.current[i] = ref; }}
              style={[
                styles.otpInput,
                {
                  backgroundColor: colors.surface,
                  borderColor: digit ? colors.primary : colors.border,
                  color: colors.text,
                },
              ]}
              value={digit}
              onChangeText={v => handleChange(i, v)}
              onKeyPress={({ nativeEvent }) => handleKeyPress(i, nativeEvent.key)}
              keyboardType="number-pad"
              maxLength={1}
              textAlign="center"
              selectTextOnFocus
            />
          ))}
        </View>

        {/* Verify Button */}
        <TouchableOpacity onPress={handleVerify} disabled={isLoading || code.join('').length !== 6} activeOpacity={0.8} style={{ width: '100%' }}>
          <LinearGradient
            colors={code.join('').length === 6 ? ['#667eea', '#764ba2'] : ['#ccc', '#aaa']}
            style={[styles.verifyBtn, isLoading && { opacity: 0.7 }]}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
          >
            {isLoading ? <ActivityIndicator color="#fff" /> : <Text style={styles.verifyBtnText}>Verify Email</Text>}
          </LinearGradient>
        </TouchableOpacity>

        {/* Resend */}
        <View style={styles.resendRow}>
          <Text style={{ color: colors.textSecondary, fontSize: 14 }}>Didn't receive the code? </Text>
          {canResend ? (
            <TouchableOpacity onPress={handleResend}>
              <Text style={{ color: colors.primary, fontSize: 14, fontWeight: '700' }}>Resend</Text>
            </TouchableOpacity>
          ) : (
            <Text style={{ color: colors.textMuted, fontSize: 14 }}>Resend in {countdown}s</Text>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  backBtn: { paddingHorizontal: 20, paddingVertical: 12 },
  content: { flex: 1, alignItems: 'center', paddingHorizontal: 24, paddingTop: 20 },
  iconWrap: { width: 80, height: 80, borderRadius: 40, justifyContent: 'center', alignItems: 'center', marginBottom: 24 },
  title: { fontSize: 26, fontWeight: '700', marginBottom: 8 },
  subtitle: { fontSize: 15, textAlign: 'center', lineHeight: 22, marginBottom: 32 },
  otpRow: { flexDirection: 'row', gap: 10, marginBottom: 32 },
  otpInput: { width: 50, height: 60, borderRadius: 14, borderWidth: 2, fontSize: 24, fontWeight: '700' },
  verifyBtn: { height: 56, borderRadius: 14, justifyContent: 'center', alignItems: 'center' },
  verifyBtnText: { color: '#fff', fontSize: 17, fontWeight: '700' },
  resendRow: { flexDirection: 'row', marginTop: 24, alignItems: 'center' },
});
