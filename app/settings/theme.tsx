// ============================================================
// Theme / Appearance Settings Screen
// ============================================================
import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, useColorScheme,
} from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Sun, Moon, Smartphone } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../src/hooks/useTheme';

const THEME_OPTIONS = [
  { value: 'light', label: 'Light', icon: Sun, desc: 'Always use light mode' },
  { value: 'dark', label: 'Dark', icon: Moon, desc: 'Always use dark mode' },
  { value: 'system', label: 'System', icon: Smartphone, desc: 'Match system appearance' },
];

export default function ThemeScreen() {
  const router = useRouter();
  const { colors, isDark } = useTheme();
  const systemScheme = useColorScheme();
  const [selected, setSelected] = useState('system');

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.text }]}>Appearance</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.body}>
        <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>THEME</Text>
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          {THEME_OPTIONS.map((opt, i) => {
            const Icon = opt.icon;
            const isActive = selected === opt.value;
            return (
              <TouchableOpacity
                key={opt.value}
                style={[styles.row, i < THEME_OPTIONS.length - 1 && { borderBottomWidth: 0.5, borderBottomColor: colors.border }]}
                onPress={() => setSelected(opt.value)}
              >
                <View style={[styles.iconWrap, { backgroundColor: isActive ? colors.primary + '15' : colors.surfaceAlt }]}>
                  <Icon size={20} color={isActive ? colors.primary : colors.textMuted} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.label, { color: colors.text }]}>{opt.label}</Text>
                  <Text style={[styles.desc, { color: colors.textMuted }]}>{opt.desc}</Text>
                </View>
                <View style={[styles.radio, { borderColor: isActive ? colors.primary : colors.border }]}>
                  {isActive && <View style={[styles.radioInner, { backgroundColor: colors.primary }]} />}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        <Text style={[styles.note, { color: colors.textMuted }]}>
          Current system theme: {systemScheme || 'light'}. Theme changes may require app restart.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 14 },
  title: { fontSize: 22, fontWeight: '900' },
  body: { paddingHorizontal: 20 },
  sectionTitle: { fontSize: 13, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 },
  card: { borderRadius: 14, borderWidth: 1, overflow: 'hidden' },
  row: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 16, gap: 14 },
  iconWrap: { width: 40, height: 40, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  label: { fontSize: 16, fontWeight: '600' },
  desc: { fontSize: 13, marginTop: 2 },
  radio: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, justifyContent: 'center', alignItems: 'center' },
  radioInner: { width: 12, height: 12, borderRadius: 6 },
  note: { fontSize: 13, marginTop: 16, textAlign: 'center', lineHeight: 18 },
});
