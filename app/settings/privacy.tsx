// ============================================================
// Privacy Settings Screen
// ============================================================
import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch,
} from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../src/hooks/useTheme';
import { useAuthStore } from '../../src/stores/authStore';

export default function PrivacyScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { user, updateProfile } = useAuthStore();

  const [isPrivate, setIsPrivate] = useState(user?.isPrivate || false);
  const [showOnline, setShowOnline] = useState(user?.showOnlineStatus ?? true);
  const [showLastSeen, setShowLastSeen] = useState(user?.showLastSeen ?? true);
  const [allowMessages, setAllowMessages] = useState(user?.allowMessages || 'everyone');

  const togglePrivate = (val: boolean) => {
    setIsPrivate(val);
    updateProfile({ isPrivate: val });
  };

  const toggleOnline = (val: boolean) => {
    setShowOnline(val);
    updateProfile({ showOnlineStatus: val });
  };

  const toggleLastSeen = (val: boolean) => {
    setShowLastSeen(val);
    updateProfile({ showLastSeen: val });
  };

  const msgOptions: { value: 'everyone' | 'followers' | 'none'; label: string }[] = [
    { value: 'everyone', label: 'Everyone' },
    { value: 'followers', label: 'Followers Only' },
    { value: 'none', label: 'No One' },
  ];

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.text }]}>Privacy</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.body}>
        {/* Private Account */}
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={styles.row}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.label, { color: colors.text }]}>Private Account</Text>
              <Text style={[styles.desc, { color: colors.textMuted }]}>Only followers can see your posts</Text>
            </View>
            <Switch value={isPrivate} onValueChange={togglePrivate} trackColor={{ true: colors.primary }} />
          </View>
        </View>

        {/* Visibility */}
        <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>VISIBILITY</Text>
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={[styles.row, { borderBottomWidth: 0.5, borderBottomColor: colors.border }]}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.label, { color: colors.text }]}>Online Status</Text>
              <Text style={[styles.desc, { color: colors.textMuted }]}>Show when you're active</Text>
            </View>
            <Switch value={showOnline} onValueChange={toggleOnline} trackColor={{ true: colors.primary }} />
          </View>
          <View style={styles.row}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.label, { color: colors.text }]}>Last Seen</Text>
              <Text style={[styles.desc, { color: colors.textMuted }]}>Show when you were last active</Text>
            </View>
            <Switch value={showLastSeen} onValueChange={toggleLastSeen} trackColor={{ true: colors.primary }} />
          </View>
        </View>

        {/* Messages */}
        <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>MESSAGES</Text>
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          {msgOptions.map((opt, i) => (
            <TouchableOpacity
              key={opt.value}
              style={[styles.row, i < msgOptions.length - 1 && { borderBottomWidth: 0.5, borderBottomColor: colors.border }]}
              onPress={() => { setAllowMessages(opt.value); updateProfile({ allowMessages: opt.value }); }}
            >
              <Text style={[styles.label, { color: colors.text }]}>{opt.label}</Text>
              <View style={[styles.radio, { borderColor: allowMessages === opt.value ? colors.primary : colors.border }]}>
                {allowMessages === opt.value && <View style={[styles.radioInner, { backgroundColor: colors.primary }]} />}
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 14 },
  title: { fontSize: 22, fontWeight: '900' },
  body: { paddingHorizontal: 20, paddingBottom: 40 },
  sectionTitle: { fontSize: 13, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1, marginTop: 24, marginBottom: 8 },
  card: { borderRadius: 14, borderWidth: 1, overflow: 'hidden' },
  row: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14, gap: 12 },
  label: { fontSize: 16, fontWeight: '600' },
  desc: { fontSize: 13, marginTop: 2 },
  radio: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, justifyContent: 'center', alignItems: 'center' },
  radioInner: { width: 12, height: 12, borderRadius: 6 },
});
