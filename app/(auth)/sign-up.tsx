// ============================================================
// Sign Up Screen with Email Verification Popup
// ============================================================
import React, { useState } from 'react';
import {
  View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView,
  KeyboardAvoidingView, Platform, Alert, ActivityIndicator, Modal,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { User, Mail, Lock, Eye, EyeOff, AtSign, CheckCircle, X } from 'lucide-react-native';
import { useTheme } from '../../src/hooks/useTheme';
import { useAuthStore } from '../../src/stores/authStore';
import { isValidEmail, getPasswordStrength } from '../../src/utils/helpers';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SocialAuthButtons } from '../../src/components/auth/SocialAuthButtons';

export default function SignUpScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { signUp, signInWithGoogle, signInWithApple, isLoading } = useAuthStore();

  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showEmailPopup, setShowEmailPopup] = useState(false);

  const passwordStrength = getPasswordStrength(password);
  const strengthColors: Record<string, string> = { weak: '#F44336', fair: '#FF9800', good: '#2196F3', strong: '#4CAF50' };

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = 'Name is required';
    if (!username.trim()) errs.username = 'Username is required';
    else if (username.length < 3) errs.username = 'Username must be at least 3 characters';
    else if (!/^[a-zA-Z0-9_]+$/.test(username)) errs.username = 'Only letters, numbers, and underscores';
    if (!email.trim()) errs.email = 'Email is required';
    else if (!isValidEmail(email)) errs.email = 'Invalid email format';
    if (!password) errs.password = 'Password is required';
    else if (password.length < 8) errs.password = 'Password must be at least 8 characters';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSignUp = async () => {
    if (!validate()) return;
    const result = await signUp(email.trim(), password, name.trim(), username.trim());
    if (result.success) {
      setShowEmailPopup(true);
    } else {
      Alert.alert('Sign Up Failed', result.error || 'Please try again');
    }
  };

  const handleVerifyLater = () => {
    setShowEmailPopup(false);
    router.push('/(auth)/email-verification');
  };

  const handleCheckEmail = () => {
    setShowEmailPopup(false);
    router.push('/(auth)/email-verification');
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
          <View style={styles.header}>
            <LinearGradient colors={['#667eea', '#764ba2']} style={styles.logo}>
              <Text style={styles.logoText}>A</Text>
            </LinearGradient>
            <Text style={[styles.title, { color: colors.text }]}>Create Account</Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Join the designer community</Text>
          </View>

          {/* Name */}
          <View style={styles.field}>
            <Text style={[styles.label, { color: colors.text }]}>Full Name</Text>
            <View style={[styles.inputBox, { backgroundColor: colors.surface, borderColor: errors.name ? colors.error : colors.border }]}>
              <User size={20} color={colors.textMuted} />
              <TextInput style={[styles.input, { color: colors.text }]} value={name} onChangeText={t => { setName(t); setErrors(e => ({ ...e, name: '' })); }} placeholder="John Doe" placeholderTextColor={colors.textMuted} />
            </View>
            {errors.name ? <Text style={[styles.err, { color: colors.error }]}>{errors.name}</Text> : null}
          </View>

          {/* Username */}
          <View style={styles.field}>
            <Text style={[styles.label, { color: colors.text }]}>Username</Text>
            <View style={[styles.inputBox, { backgroundColor: colors.surface, borderColor: errors.username ? colors.error : colors.border }]}>
              <AtSign size={20} color={colors.textMuted} />
              <TextInput style={[styles.input, { color: colors.text }]} value={username} onChangeText={t => { setUsername(t.toLowerCase()); setErrors(e => ({ ...e, username: '' })); }} placeholder="johndoe" placeholderTextColor={colors.textMuted} autoCapitalize="none" />
            </View>
            {errors.username ? <Text style={[styles.err, { color: colors.error }]}>{errors.username}</Text> : null}
          </View>

          {/* Email */}
          <View style={styles.field}>
            <Text style={[styles.label, { color: colors.text }]}>Email</Text>
            <View style={[styles.inputBox, { backgroundColor: colors.surface, borderColor: errors.email ? colors.error : colors.border }]}>
              <Mail size={20} color={colors.textMuted} />
              <TextInput style={[styles.input, { color: colors.text }]} value={email} onChangeText={t => { setEmail(t); setErrors(e => ({ ...e, email: '' })); }} placeholder="your@email.com" placeholderTextColor={colors.textMuted} keyboardType="email-address" autoCapitalize="none" />
            </View>
            {errors.email ? <Text style={[styles.err, { color: colors.error }]}>{errors.email}</Text> : null}
          </View>

          {/* Password */}
          <View style={styles.field}>
            <Text style={[styles.label, { color: colors.text }]}>Password</Text>
            <View style={[styles.inputBox, { backgroundColor: colors.surface, borderColor: errors.password ? colors.error : colors.border }]}>
              <Lock size={20} color={colors.textMuted} />
              <TextInput style={[styles.input, { color: colors.text }]} value={password} onChangeText={t => { setPassword(t); setErrors(e => ({ ...e, password: '' })); }} placeholder="Min 8 characters" placeholderTextColor={colors.textMuted} secureTextEntry={!showPassword} />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                {showPassword ? <EyeOff size={20} color={colors.textMuted} /> : <Eye size={20} color={colors.textMuted} />}
              </TouchableOpacity>
            </View>
            {errors.password ? <Text style={[styles.err, { color: colors.error }]}>{errors.password}</Text> : null}
            {password.length > 0 && (
              <View style={styles.strengthRow}>
                <View style={styles.strengthBarBg}>
                  <View style={[styles.strengthBar, { width: `${passwordStrength.score}%`, backgroundColor: strengthColors[passwordStrength.strength] }]} />
                </View>
                <Text style={[styles.strengthText, { color: strengthColors[passwordStrength.strength] }]}>
                  {passwordStrength.strength.charAt(0).toUpperCase() + passwordStrength.strength.slice(1)}
                </Text>
              </View>
            )}
          </View>

          {/* Terms */}
          <Text style={[styles.terms, { color: colors.textMuted }]}>
            By signing up, you agree to our{' '}
            <Text style={{ color: colors.primary }}>Terms of Service</Text> and{' '}
            <Text style={{ color: colors.primary }}>Privacy Policy</Text>
          </Text>

          {/* Sign Up Button */}
          <TouchableOpacity onPress={handleSignUp} disabled={isLoading} activeOpacity={0.8}>
            <LinearGradient colors={['#667eea', '#764ba2']} style={[styles.btn, isLoading && { opacity: 0.7 }]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
              {isLoading ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnText}>Create Account</Text>}
            </LinearGradient>
          </TouchableOpacity>

          {/* Divider */}
          <View style={styles.divider}>
            <View style={[styles.line, { backgroundColor: colors.border }]} />
            <Text style={[styles.or, { color: colors.textMuted }]}>OR</Text>
            <View style={[styles.line, { backgroundColor: colors.border }]} />
          </View>

          {/* Social Auth */}
          <SocialAuthButtons
            onGooglePress={handleGoogleSignIn}
            onApplePress={handleAppleSignIn}
            isLoading={isLoading}
          />

          <View style={styles.footer}>
            <Text style={{ color: colors.textSecondary, fontSize: 15 }}>Already have an account? </Text>
            <TouchableOpacity onPress={() => router.push('/(auth)/sign-in')}>
              <Text style={{ color: colors.primary, fontSize: 15, fontWeight: '700' }}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* ====== Email Verification Popup Modal ====== */}
      <Modal visible={showEmailPopup} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.background }]}>
            <TouchableOpacity style={styles.modalClose} onPress={() => setShowEmailPopup(false)}>
              <X size={24} color={colors.textMuted} />
            </TouchableOpacity>

            <View style={styles.modalIconWrap}>
              <LinearGradient colors={['#667eea', '#764ba2']} style={styles.modalIcon}>
                <Mail size={32} color="#fff" />
              </LinearGradient>
            </View>

            <Text style={[styles.modalTitle, { color: colors.text }]}>Check Your Email</Text>
            <Text style={[styles.modalSubtitle, { color: colors.textSecondary }]}>
              We've sent a verification code to{'\n'}
              <Text style={{ fontWeight: '700', color: colors.text }}>{email}</Text>
            </Text>
            <Text style={[styles.modalHint, { color: colors.textMuted }]}>
              Please check your inbox and enter the 6-digit code to verify your account.
            </Text>

            <TouchableOpacity onPress={handleCheckEmail} activeOpacity={0.8} style={{ width: '100%' }}>
              <LinearGradient colors={['#667eea', '#764ba2']} style={styles.modalBtn} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
                <Text style={styles.modalBtnText}>Enter Verification Code</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity onPress={handleVerifyLater} style={styles.modalSecondary}>
              <Text style={{ color: colors.textSecondary, fontSize: 14 }}>Open Email App</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scroll: { flexGrow: 1, paddingHorizontal: 24, paddingBottom: 40 },
  header: { alignItems: 'center', marginTop: 32, marginBottom: 28 },
  logo: { width: 64, height: 64, borderRadius: 18, justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  logoText: { fontSize: 28, fontWeight: '800', color: '#fff' },
  title: { fontSize: 26, fontWeight: '700', marginBottom: 6 },
  subtitle: { fontSize: 16 },
  field: { marginBottom: 14 },
  label: { fontSize: 14, fontWeight: '600', marginBottom: 6 },
  inputBox: { flexDirection: 'row', alignItems: 'center', borderRadius: 14, paddingHorizontal: 16, height: 56, borderWidth: 1, gap: 12 },
  input: { flex: 1, fontSize: 16, height: '100%' },
  err: { fontSize: 12, marginTop: 4, marginLeft: 4 },
  strengthRow: { flexDirection: 'row', alignItems: 'center', marginTop: 8, gap: 8 },
  strengthBarBg: { flex: 1, height: 4, backgroundColor: '#E0E0E0', borderRadius: 2, overflow: 'hidden' },
  strengthBar: { height: '100%', borderRadius: 2 },
  strengthText: { fontSize: 12, fontWeight: '600', minWidth: 50 },
  terms: { fontSize: 13, textAlign: 'center', marginBottom: 20, lineHeight: 18 },
  btn: { height: 56, borderRadius: 14, justifyContent: 'center', alignItems: 'center' },
  btnText: { color: '#fff', fontSize: 17, fontWeight: '700' },
  divider: { flexDirection: 'row', alignItems: 'center', marginVertical: 20 },
  line: { flex: 1, height: 1 },
  or: { marginHorizontal: 16, fontSize: 13, fontWeight: '600' },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 24 },
  // Modal styles
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 24 },
  modalContent: { width: '100%', borderRadius: 24, padding: 28, alignItems: 'center', maxWidth: 400 },
  modalClose: { position: 'absolute', top: 16, right: 16, zIndex: 1 },
  modalIconWrap: { marginBottom: 20, marginTop: 8 },
  modalIcon: { width: 72, height: 72, borderRadius: 36, justifyContent: 'center', alignItems: 'center' },
  modalTitle: { fontSize: 22, fontWeight: '700', marginBottom: 8 },
  modalSubtitle: { fontSize: 15, textAlign: 'center', lineHeight: 22, marginBottom: 8 },
  modalHint: { fontSize: 13, textAlign: 'center', marginBottom: 24, lineHeight: 18 },
  modalBtn: { height: 52, borderRadius: 14, justifyContent: 'center', alignItems: 'center' },
  modalBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  modalSecondary: { marginTop: 16 },
});
