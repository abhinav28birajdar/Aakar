// ============================================================
// Sign In Screen
// ============================================================
import React, { useState } from 'react';
import {
  View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView,
  KeyboardAvoidingView, Platform, Alert, ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Mail, Lock, Eye, EyeOff, Chrome, Apple } from 'lucide-react-native';
import { useTheme } from '../../src/hooks/useTheme';
import { useAuthStore } from '../../src/stores/authStore';
import { isValidEmail } from '../../src/utils/helpers';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SignInScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { signIn, signInWithGoogle, signInWithApple, isLoading } = useAuthStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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

          {/* Email */}
          <View style={styles.field}>
            <Text style={[styles.label, { color: colors.text }]}>Email</Text>
            <View style={[styles.inputBox, { backgroundColor: colors.surface, borderColor: errors.email ? colors.error : colors.border }]}>
              <Mail size={20} color={colors.textMuted} />
              <TextInput style={[styles.input, { color: colors.text }]} value={email} onChangeText={t => { setEmail(t); setErrors(e => ({ ...e, email: undefined })); }} placeholder="your@email.com" placeholderTextColor={colors.textMuted} keyboardType="email-address" autoCapitalize="none" />
            </View>
            {errors.email ? <Text style={[styles.err, { color: colors.error }]}>{errors.email}</Text> : null}
          </View>

          {/* Password */}
          <View style={styles.field}>
            <Text style={[styles.label, { color: colors.text }]}>Password</Text>
            <View style={[styles.inputBox, { backgroundColor: colors.surface, borderColor: errors.password ? colors.error : colors.border }]}>
              <Lock size={20} color={colors.textMuted} />
              <TextInput style={[styles.input, { color: colors.text }]} value={password} onChangeText={t => { setPassword(t); setErrors(e => ({ ...e, password: undefined })); }} placeholder="Enter your password" placeholderTextColor={colors.textMuted} secureTextEntry={!showPassword} />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                {showPassword ? <EyeOff size={20} color={colors.textMuted} /> : <Eye size={20} color={colors.textMuted} />}
              </TouchableOpacity>
            </View>
            {errors.password ? <Text style={[styles.err, { color: colors.error }]}>{errors.password}</Text> : null}
          </View>

          <TouchableOpacity onPress={() => router.push('/(auth)/forgot-password')} style={{ alignSelf: 'flex-end', marginBottom: 16 }}>
            <Text style={{ color: colors.primary, fontWeight: '600', fontSize: 14 }}>Forgot Password?</Text>
          </TouchableOpacity>

          {/* Sign In */}
          <TouchableOpacity onPress={handleSignIn} disabled={isLoading} activeOpacity={0.8}>
            <LinearGradient colors={['#667eea', '#764ba2']} style={[styles.btn, isLoading && { opacity: 0.7 }]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
              {isLoading ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnText}>Sign In</Text>}
            </LinearGradient>
          </TouchableOpacity>

          {/* Divider */}
          <View style={styles.divider}>
            <View style={[styles.line, { backgroundColor: colors.border }]} />
            <Text style={[styles.or, { color: colors.textMuted }]}>OR</Text>
            <View style={[styles.line, { backgroundColor: colors.border }]} />
          </View>

          {/* Social */}
          <TouchableOpacity
            style={[styles.social, { backgroundColor: colors.surface, borderColor: colors.border }]}
            onPress={handleGoogleSignIn}
            disabled={isLoading}
          >
            <Chrome size={20} color={colors.text} />
            <Text style={[styles.socialText, { color: colors.text }]}>Continue with Google</Text>
          </TouchableOpacity>

          {Platform.OS === 'ios' && (
            <TouchableOpacity
              style={[styles.social, { backgroundColor: colors.text, borderColor: colors.text }]}
              onPress={handleAppleSignIn}
              disabled={isLoading}
            >
              <Apple size={20} color={colors.background} />
              <Text style={[styles.socialText, { color: colors.background }]}>Continue with Apple</Text>
            </TouchableOpacity>
          )}

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
  field: { marginBottom: 16 },
  label: { fontSize: 14, fontWeight: '600', marginBottom: 6 },
  inputBox: { flexDirection: 'row', alignItems: 'center', borderRadius: 14, paddingHorizontal: 16, height: 56, borderWidth: 1, gap: 12 },
  input: { flex: 1, fontSize: 16, height: '100%' },
  err: { fontSize: 12, marginTop: 4, marginLeft: 4 },
  btn: { height: 56, borderRadius: 14, justifyContent: 'center', alignItems: 'center' },
  btnText: { color: '#fff', fontSize: 17, fontWeight: '700' },
  divider: { flexDirection: 'row', alignItems: 'center', marginVertical: 20 },
  line: { flex: 1, height: 1 },
  or: { marginHorizontal: 16, fontSize: 13, fontWeight: '600' },
  social: { height: 56, borderRadius: 14, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 12, borderWidth: 1, marginBottom: 12 },
  socialText: { fontSize: 16, fontWeight: '600' },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 24 },
});
