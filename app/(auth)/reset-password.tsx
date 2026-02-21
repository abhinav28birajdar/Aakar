// ============================================================
// Reset Password Screen
// ============================================================
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, Lock, CheckCircle2 } from 'lucide-react-native';
import { useTheme } from '../../src/hooks/useTheme';
import { useAuthStore } from '../../src/context/stores/authStore';
import { getPasswordStrength } from '../../src/utils/helpers';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Input, Button } from '../../src/components/atoms';

export default function ResetPasswordScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { resetPassword, isLoading } = useAuthStore();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [success, setSuccess] = useState(false);

  const strength = getPasswordStrength(password);
  const strengthColors: Record<string, string> = { weak: '#F44336', fair: '#FF9800', good: '#2196F3', strong: '#4CAF50' };

  const handleReset = async () => {
    if (password.length < 8) { Alert.alert('Error', 'Password must be at least 8 characters'); return; }
    if (password !== confirmPassword) { Alert.alert('Error', 'Passwords do not match'); return; }

    // Using a fake code for simulation or real reset logic
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

          <Button
            title="Sign In"
            onPress={() => router.replace('/(auth)/sign-in')}
            style={{ width: '100%' }}
          />
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

        <Input
          label="New Password"
          value={password}
          onChangeText={setPassword}
          placeholder="Min 8 characters"
          isPassword
          leftIcon={<Lock size={20} color={colors.textMuted} />}
        />

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

        <Input
          label="Confirm Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          placeholder="Re-enter password"
          isPassword
          leftIcon={<Lock size={20} color={colors.textMuted} />}
          error={confirmPassword && password !== confirmPassword ? 'Passwords do not match' : undefined}
        />

        <Button
          title="Reset Password"
          onPress={handleReset}
          loading={isLoading}
          style={{ width: '100%', marginTop: 24 }}
        />
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
  subtitle: { fontSize: 15, textAlign: 'center', lineHeight: 22, color: '#999', marginBottom: 28 },
  strengthRow: { flexDirection: 'row', alignItems: 'center', marginTop: -8, marginBottom: 16, gap: 8 },
  strengthBg: { flex: 1, height: 4, backgroundColor: '#E0E0E0', borderRadius: 2, overflow: 'hidden' },
  strengthFill: { height: '100%', borderRadius: 2 },
});
