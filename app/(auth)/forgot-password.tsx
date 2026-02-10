// ============================================================
// Forgot Password Screen
// ============================================================
import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, Mail, CheckCircle2 } from 'lucide-react-native';
import { useTheme } from '../../src/hooks/useTheme';
import { useAuthStore } from '../../src/stores/authStore';
import { isValidEmail } from '../../src/utils/helpers';
import { SafeAreaView } from 'react-native-safe-area-context';

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
          <TouchableOpacity onPress={() => router.push('/(auth)/reset-password')} activeOpacity={0.8} style={{ width: '100%' }}>
            <LinearGradient colors={['#667eea', '#764ba2']} style={styles.btn} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
              <Text style={styles.btnText}>Enter Reset Code</Text>
            </LinearGradient>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.back()} style={{ marginTop: 16 }}>
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

        <View style={[styles.inputBox, { backgroundColor: colors.surface, borderColor: error ? colors.error : colors.border }]}>
          <Mail size={20} color={colors.textMuted} />
          <TextInput
            style={[styles.input, { color: colors.text }]}
            value={email}
            onChangeText={t => { setEmail(t); setError(''); }}
            placeholder="your@email.com"
            placeholderTextColor={colors.textMuted}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>
        {error ? <Text style={[styles.err, { color: colors.error }]}>{error}</Text> : null}

        <TouchableOpacity onPress={handleSubmit} disabled={isLoading} activeOpacity={0.8} style={{ width: '100%', marginTop: 24 }}>
          <LinearGradient colors={['#667eea', '#764ba2']} style={[styles.btn, isLoading && { opacity: 0.7 }]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
            {isLoading ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnText}>Send Reset Link</Text>}
          </LinearGradient>
        </TouchableOpacity>
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
  inputBox: { flexDirection: 'row', alignItems: 'center', borderRadius: 14, paddingHorizontal: 16, height: 56, borderWidth: 1, gap: 12, width: '100%' },
  input: { flex: 1, fontSize: 16, height: '100%' },
  err: { fontSize: 12, marginTop: 4, alignSelf: 'flex-start', marginLeft: 4 },
  btn: { height: 56, borderRadius: 14, justifyContent: 'center', alignItems: 'center' },
  btnText: { color: '#fff', fontSize: 17, fontWeight: '700' },
});
