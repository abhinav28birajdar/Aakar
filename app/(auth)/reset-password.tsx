// ============================================================
// Reset Password Screen
// ============================================================
import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, Lock, Eye, EyeOff, CheckCircle2 } from 'lucide-react-native';
import { useTheme } from '../../src/hooks/useTheme';
import { useAuthStore } from '../../src/stores/authStore';
import { getPasswordStrength } from '../../src/utils/helpers';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ResetPasswordScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { resetPassword, isLoading } = useAuthStore();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [success, setSuccess] = useState(false);

  const strength = getPasswordStrength(password);
  const strengthColors: Record<string, string> = { weak: '#F44336', fair: '#FF9800', good: '#2196F3', strong: '#4CAF50' };

  const handleReset = async () => {
    if (password.length < 8) { Alert.alert('Error', 'Password must be at least 8 characters'); return; }
    if (password !== confirmPassword) { Alert.alert('Error', 'Passwords do not match'); return; }
    
    const result = await resetPassword('000000', password);
    if (result.success) {
      setSuccess(true);
    } else {
      Alert.alert('Error', result.error || 'Failed to reset password');
    }
  };

  if (success) {
    return (
      <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
        <View style={styles.centerContent}>
          <LinearGradient colors={['#4CAF50', '#66BB6A']} style={styles.successIcon}>
            <CheckCircle2 size={40} color="#fff" />
          </LinearGradient>
          <Text style={[styles.title, { color: colors.text }]}>Password Reset!</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Your password has been successfully reset. You can now sign in with your new password.
          </Text>
          <TouchableOpacity onPress={() => router.replace('/(auth)/sign-in')} activeOpacity={0.8} style={{ width: '100%' }}>
            <LinearGradient colors={['#667eea', '#764ba2']} style={styles.btn} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
              <Text style={styles.btnText}>Sign In</Text>
            </LinearGradient>
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
        <Text style={[styles.title, { color: colors.text }]}>Reset Password</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Create a new secure password</Text>

        <View style={styles.field}>
          <Text style={[styles.label, { color: colors.text }]}>New Password</Text>
          <View style={[styles.inputBox, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Lock size={20} color={colors.textMuted} />
            <TextInput style={[styles.input, { color: colors.text }]} value={password} onChangeText={setPassword} placeholder="Min 8 characters" placeholderTextColor={colors.textMuted} secureTextEntry={!showPassword} />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              {showPassword ? <EyeOff size={20} color={colors.textMuted} /> : <Eye size={20} color={colors.textMuted} />}
            </TouchableOpacity>
          </View>
          {password.length > 0 && (
            <View style={styles.strengthRow}>
              <View style={styles.strengthBg}>
                <View style={[styles.strengthFill, { width: `${strength.score}%`, backgroundColor: strengthColors[strength.strength] }]} />
              </View>
              <Text style={{ fontSize: 12, fontWeight: '600', color: strengthColors[strength.strength] }}>
                {strength.strength.charAt(0).toUpperCase() + strength.strength.slice(1)}
              </Text>
            </View>
          )}
        </View>

        <View style={styles.field}>
          <Text style={[styles.label, { color: colors.text }]}>Confirm Password</Text>
          <View style={[styles.inputBox, { backgroundColor: colors.surface, borderColor: confirmPassword && password !== confirmPassword ? colors.error : colors.border }]}>
            <Lock size={20} color={colors.textMuted} />
            <TextInput style={[styles.input, { color: colors.text }]} value={confirmPassword} onChangeText={setConfirmPassword} placeholder="Re-enter password" placeholderTextColor={colors.textMuted} secureTextEntry={!showPassword} />
          </View>
          {confirmPassword && password !== confirmPassword && (
            <Text style={{ color: colors.error, fontSize: 12, marginTop: 4 }}>Passwords do not match</Text>
          )}
        </View>

        <TouchableOpacity onPress={handleReset} disabled={isLoading} activeOpacity={0.8} style={{ width: '100%', marginTop: 16 }}>
          <LinearGradient colors={['#667eea', '#764ba2']} style={[styles.btn, isLoading && { opacity: 0.7 }]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
            {isLoading ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnText}>Reset Password</Text>}
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  backBtn: { paddingHorizontal: 20, paddingVertical: 12 },
  content: { paddingHorizontal: 24, paddingTop: 8 },
  centerContent: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 },
  successIcon: { width: 80, height: 80, borderRadius: 40, justifyContent: 'center', alignItems: 'center', marginBottom: 24 },
  title: { fontSize: 26, fontWeight: '700', marginBottom: 6 },
  subtitle: { fontSize: 15, color: '#999', marginBottom: 28, textAlign: 'center', lineHeight: 22 },
  field: { marginBottom: 16 },
  label: { fontSize: 14, fontWeight: '600', marginBottom: 6 },
  inputBox: { flexDirection: 'row', alignItems: 'center', borderRadius: 14, paddingHorizontal: 16, height: 56, borderWidth: 1, gap: 12 },
  input: { flex: 1, fontSize: 16, height: '100%' },
  strengthRow: { flexDirection: 'row', alignItems: 'center', marginTop: 8, gap: 8 },
  strengthBg: { flex: 1, height: 4, backgroundColor: '#E0E0E0', borderRadius: 2, overflow: 'hidden' },
  strengthFill: { height: '100%', borderRadius: 2 },
  btn: { height: 56, borderRadius: 14, justifyContent: 'center', alignItems: 'center' },
  btnText: { color: '#fff', fontSize: 17, fontWeight: '700' },
});
