// ============================================================
// Settings Index Screen
// ============================================================
import React from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  ArrowLeft, ChevronRight, Shield, Lock, Palette, HelpCircle,
  LogOut, User, Bell, Eye, Info, FileText,
} from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../src/hooks/useTheme';
import { useAuthStore } from '../../src/stores/authStore';

const SECTIONS = [
  {
    title: 'Account',
    items: [
      { label: 'Edit Profile', icon: User, route: '/edit-profile' },
      { label: 'Privacy', icon: Shield, route: '/settings/privacy' },
      { label: 'Security', icon: Lock, route: '/settings/security' },
    ],
  },
  {
    title: 'Preferences',
    items: [
      { label: 'Appearance', icon: Palette, route: '/settings/theme' },
      { label: 'Notifications', icon: Bell, route: '/settings/privacy' },
    ],
  },
  {
    title: 'Support',
    items: [
      { label: 'Help Center', icon: HelpCircle, route: '/settings/help' },
      { label: 'About', icon: Info, route: '/settings/help' },
      { label: 'Terms of Service', icon: FileText, route: '/settings/help' },
    ],
  },
];

export default function SettingsScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { signOut } = useAuthStore();

  const handleLogout = () => {
    Alert.alert('Log Out', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Log Out', style: 'destructive',
        onPress: async () => {
          await signOut();
          router.replace('/(auth)/sign-in');
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.text }]}>Settings</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        {SECTIONS.map(section => (
          <View key={section.title} style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>{section.title}</Text>
            <View style={[styles.sectionCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              {section.items.map((item, i) => {
                const Icon = item.icon;
                return (
                  <TouchableOpacity
                    key={item.label}
                    style={[styles.row, i < section.items.length - 1 && { borderBottomWidth: 0.5, borderBottomColor: colors.border }]}
                    onPress={() => router.push(item.route as any)}
                  >
                    <Icon size={20} color={colors.primary} />
                    <Text style={[styles.rowLabel, { color: colors.text }]}>{item.label}</Text>
                    <ChevronRight size={18} color={colors.textMuted} />
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        ))}

        {/* Logout */}
        <TouchableOpacity style={[styles.logoutBtn, { borderColor: colors.error }]} onPress={handleLogout}>
          <LogOut size={20} color={colors.error} />
          <Text style={[styles.logoutText, { color: colors.error }]}>Log Out</Text>
        </TouchableOpacity>

        <Text style={[styles.version, { color: colors.textMuted }]}>Aakar v1.0.0</Text>
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 14 },
  title: { fontSize: 22, fontWeight: '900' },
  body: { paddingHorizontal: 20 },
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 13, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 },
  sectionCard: { borderRadius: 14, borderWidth: 1, overflow: 'hidden' },
  row: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 16, gap: 14 },
  rowLabel: { flex: 1, fontSize: 16, fontWeight: '600' },
  logoutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 16, borderRadius: 14, borderWidth: 1.5, marginTop: 8 },
  logoutText: { fontSize: 16, fontWeight: '700' },
  version: { textAlign: 'center', marginTop: 24, fontSize: 13 },
});
