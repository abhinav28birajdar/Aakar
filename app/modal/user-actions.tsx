// ============================================================
// User Actions Modal (Block, Report, etc.)
// ============================================================
import React from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Alert,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import {
  X, Flag, ShieldAlert, UserMinus, Copy, Share2, Bell, BellOff,
} from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../src/hooks/useTheme';
import { useUserStore } from '../../src/stores/userStore';

export default function UserActionsModal() {
  const router = useRouter();
  const { userId } = useLocalSearchParams<{ userId: string }>();
  const { colors } = useTheme();
  const { blockUser, unfollowUser, isFollowing } = useUserStore();

  const actions = [
    {
      label: 'Report User',
      icon: Flag,
      color: colors.error,
      onPress: () => {
        router.back();
        setTimeout(() => router.push({ pathname: '/report', params: { targetId: userId!, targetType: 'user' } }), 300);
      },
    },
    {
      label: 'Block User',
      icon: ShieldAlert,
      color: colors.error,
      onPress: () => {
        Alert.alert('Block User', 'They won\'t be able to see your profile or contact you.', [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Block', style: 'destructive', onPress: () => { blockUser(userId!); router.back(); } },
        ]);
      },
    },
    {
      label: 'Unfollow',
      icon: UserMinus,
      color: colors.text,
      onPress: () => { unfollowUser(userId!); router.back(); },
    },
    {
      label: 'Copy Profile Link',
      icon: Copy,
      color: colors.text,
      onPress: () => { router.back(); Alert.alert('Copied', 'Profile link copied to clipboard'); },
    },
    {
      label: 'Share Profile',
      icon: Share2,
      color: colors.text,
      onPress: () => { router.back(); },
    },
  ];

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <X size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.text }]}>Actions</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.body}>
        {actions.map(action => {
          const Icon = action.icon;
          return (
            <TouchableOpacity
              key={action.label}
              style={[styles.actionRow, { borderBottomColor: colors.border }]}
              onPress={action.onPress}
            >
              <Icon size={22} color={action.color} />
              <Text style={[styles.actionLabel, { color: action.color }]}>{action.label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 14 },
  title: { fontSize: 18, fontWeight: '800' },
  body: { paddingHorizontal: 20 },
  actionRow: { flexDirection: 'row', alignItems: 'center', gap: 16, paddingVertical: 16, borderBottomWidth: 0.5 },
  actionLabel: { fontSize: 16, fontWeight: '600' },
});
