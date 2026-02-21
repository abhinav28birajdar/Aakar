// ============================================================
// Forgot Password Screen
// ============================================================
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, Mail, CheckCircle2 } from 'lucide-react-native';
import { useTheme } from '../../src/hooks/useTheme';
import { useAuthStore } from '../../src/context/stores/authStore';
import { isValidEmail } from '../../src/utils/helpers';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Input, Button } from '../../src/components/atoms';

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { forgotPassword, isLoading } = useAuthStore();

  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = async () => {
    if (!email.trim()) { setError('Email is required'); return; }
    if (!isValidEmail(email)) { setError('Invalid email format'); return; }

    const result = await forgotPassword(email.trim());
    if (result.success) {
      setSent(true);
    } else {
      Alert.alert('Error', result.error || 'Failed to send reset link');
    }
  };

  if (sent) {
    return (
      <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
        <View style={styles.successContent}>
          <LinearGradient colors={['#4CAF50', '#66BB6A']} style={styles.successIcon}>
            <CheckCircle2 size={40} color="#fff" />
          </LinearGradient>
          <Text style={[styles.title, { color: colors.text }]}>Email Sent!</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            We've sent a password reset link to{'\n'}
            <Text style={{ fontWeight: '700', color: colors.text }}>{email}</Text>
          </Text>
          <Text style={[styles.hint, { color: colors.textMuted }]}>
            Check your inbox and follow the link to reset your password. The link expires in 15 minutes.
          </Text>

          <Button
            title="Enter Reset Code"
            onPress={() => router.push('/(auth)/reset-password')}
            style={{ width: '100%', marginBottom: 16 }}
          />

          <TouchableOpacity onPress={() => router.back()}>
            <Text style={{ color: colors.primary, fontWeight: '600' }}>Back to Sign In</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
        <ArrowLeft size={24} color={colors.text} />
      </TouchableOpacity>

      <View style={styles.content}>
        <LinearGradient colors={['#667eea', '#764ba2']} style={styles.iconWrap}>
          <Mail size={32} color="#fff" />
        </LinearGradient>
        <Text style={[styles.title, { color: colors.text }]}>Forgot Password?</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Enter your email address and we'll send you a link to reset your password.
        </Text>

        <Input
          label="Email Address"
          value={email}
          onChangeText={t => { setEmail(t); setError(''); }}
          placeholder="your@email.com"
          keyboardType="email-address"
          autoCapitalize="none"
          leftIcon={<Mail size={20} color={colors.textMuted} />}
          error={error}
        />

        <Button
          title="Send Reset Link"
          onPress={handleSubmit}
          loading={isLoading}
          style={{ width: '100%', marginTop: 8 }}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  backBtn: { paddingHorizontal: 20, paddingVertical: 12 },
  content: { flex: 1, alignItems: 'center', paddingHorizontal: 24, paddingTop: 20 },
  successContent: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 },
  iconWrap: { width: 72, height: 72, borderRadius: 36, justifyContent: 'center', alignItems: 'center', marginBottom: 24 },
  successIcon: { width: 80, height: 80, borderRadius: 40, justifyContent: 'center', alignItems: 'center', marginBottom: 24 },
  title: { fontSize: 26, fontWeight: '700', marginBottom: 8 },
  subtitle: { fontSize: 15, textAlign: 'center', lineHeight: 22, marginBottom: 24 },
  hint: { fontSize: 13, textAlign: 'center', lineHeight: 18, marginBottom: 32 },
});
