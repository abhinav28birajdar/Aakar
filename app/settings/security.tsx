// ============================================================
// Security Settings Screen
// ============================================================
import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Eye, EyeOff } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../src/hooks/useTheme';
import { useAuthStore } from '../../src/context/stores/authStore';

export default function SecurityScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { changePassword, isLoading } = useAuthStore();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);

  const handleChangePassword = async () => {
    if (!currentPassword) return Alert.alert('Error', 'Enter current password');
    if (newPassword.length < 8) return Alert.alert('Error', 'New password must be at least 8 characters');
    if (newPassword !== confirmPassword) return Alert.alert('Error', 'Passwords do not match');

    const result = await changePassword(currentPassword, newPassword);

    if (result.success) {
      Alert.alert('Success', 'Password updated successfully');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } else {
      Alert.alert('Update Failed', result.error || 'Please try again');
    }
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.text }]}>Security</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.body}>
        <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>CHANGE PASSWORD</Text>

        <View style={styles.fieldGroup}>
          <Text style={[styles.label, { color: colors.textSecondary }]}>Current Password</Text>
          <View style={[styles.inputRow, { borderColor: colors.border, backgroundColor: colors.surface }]}>
            <TextInput
              style={[styles.input, { color: colors.text }]}
              value={currentPassword} onChangeText={setCurrentPassword}
              secureTextEntry={!showCurrent} placeholder="Enter current password"
              placeholderTextColor={colors.textMuted}
            />
            <TouchableOpacity onPress={() => setShowCurrent(!showCurrent)}>
              {showCurrent ? <EyeOff size={20} color={colors.textMuted} /> : <Eye size={20} color={colors.textMuted} />}
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.fieldGroup}>
          <Text style={[styles.label, { color: colors.textSecondary }]}>New Password</Text>
          <View style={[styles.inputRow, { borderColor: colors.border, backgroundColor: colors.surface }]}>
            <TextInput
              style={[styles.input, { color: colors.text }]}
              value={newPassword} onChangeText={setNewPassword}
              secureTextEntry={!showNew} placeholder="Enter new password"
              placeholderTextColor={colors.textMuted}
            />
            <TouchableOpacity onPress={() => setShowNew(!showNew)}>
              {showNew ? <EyeOff size={20} color={colors.textMuted} /> : <Eye size={20} color={colors.textMuted} />}
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.fieldGroup}>
          <Text style={[styles.label, { color: colors.textSecondary }]}>Confirm New Password</Text>
          <View style={[styles.inputRow, { borderColor: colors.border, backgroundColor: colors.surface }]}>
            <TextInput
              style={[styles.input, { color: colors.text }]}
              value={confirmPassword} onChangeText={setConfirmPassword}
              secureTextEntry placeholder="Confirm new password"
              placeholderTextColor={colors.textMuted}
            />
          </View>
        </View>

        <TouchableOpacity onPress={handleChangePassword} activeOpacity={0.8} disabled={isLoading}>
          <LinearGradient colors={['#667eea', '#764ba2']} style={[styles.btn, isLoading && { opacity: 0.7 }]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
            {isLoading ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnText}>Update Password</Text>}
          </LinearGradient>
        </TouchableOpacity>

        <Text style={[styles.sectionTitle, { color: colors.textMuted, marginTop: 32 }]}>ACCOUNT ACTIONS</Text>
        <TouchableOpacity
          style={[styles.dangerBtn, { borderColor: colors.error }]}
          onPress={() => Alert.alert('Two-Factor Authentication', 'This feature will be available in the next update. Please ensure your email is verified for account recovery.')}
        >
          <Text style={[styles.dangerText, { color: colors.text }]}>Enable 2FA (Coming Soon)</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.dangerBtn, { borderColor: colors.error, marginTop: 12 }]}
          onPress={() => {
            Alert.alert(
              'Delete Account',
              'This action is permanent and cannot be undone. All your posts, profile data, and messages will be removed. Are you sure?',
              [
                { text: 'Cancel', style: 'cancel' },
                {
                  text: 'Delete',
                  style: 'destructive',
                  onPress: async () => {
                    if (!currentPassword) {
                      Alert.alert('Authentication Required', 'Please enter your current password above to confirm deletion.');
                      return;
                    }
                    try {
                      const { reauthenticate, deleteUserAccount } = require('../../src/services/firebaseAuth');
                      await reauthenticate(currentPassword);
                      await deleteUserAccount();
                      Alert.alert('Account Deleted', 'Your account has been successfully removed.');
                      router.replace('/(auth)/sign-in');
                    } catch (error: any) {
                      Alert.alert('Error', error.message || 'Failed to delete account. Ensure your current password is correct.');
                    }
                  }
                }
              ]
            );
          }}
        >
          <Text style={[styles.dangerText, { color: colors.error }]}>Delete Account Permanently</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 14 },
  title: { fontSize: 22, fontWeight: '900' },
  body: { paddingHorizontal: 20, paddingBottom: 40 },
  sectionTitle: { fontSize: 13, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 16 },
  fieldGroup: { marginBottom: 20 },
  label: { fontSize: 13, fontWeight: '700', marginBottom: 8 },
  inputRow: { flexDirection: 'row', alignItems: 'center', borderRadius: 12, borderWidth: 1, paddingHorizontal: 16, height: 50 },
  input: { flex: 1, fontSize: 15, height: '100%' },
  btn: { height: 52, borderRadius: 14, justifyContent: 'center', alignItems: 'center', marginTop: 8 },
  btnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  dangerBtn: { borderWidth: 1.5, borderRadius: 14, paddingVertical: 16, alignItems: 'center' },
  dangerText: { fontSize: 15, fontWeight: '700' },
});
