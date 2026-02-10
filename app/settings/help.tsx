// ============================================================
// Help / Support Screen
// ============================================================
import React from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  ArrowLeft, ChevronRight, MessageCircle, Mail, FileText,
  ExternalLink, HelpCircle,
} from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../src/hooks/useTheme';

const FAQ = [
  { q: 'How do I upload a design?', a: 'Go to the Create tab and add your images, title, description, and tags.' },
  { q: 'How do I change my role?', a: 'Go to Settings > Edit Profile to update your account type.' },
  { q: 'How do I report a user?', a: 'Visit their profile, tap the menu icon, and select Report.' },
  { q: 'Is Aakar free to use?', a: 'Yes! Aakar is free for all users with optional premium features.' },
];

export default function HelpScreen() {
  const router = useRouter();
  const { colors } = useTheme();

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.text }]}>Help</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        {/* Contact */}
        <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>CONTACT US</Text>
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <TouchableOpacity style={[styles.row, { borderBottomWidth: 0.5, borderBottomColor: colors.border }]}
            onPress={() => Linking.openURL('mailto:support@aakar.app')}>
            <Mail size={20} color={colors.primary} />
            <Text style={[styles.rowLabel, { color: colors.text }]}>Email Support</Text>
            <ExternalLink size={16} color={colors.textMuted} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.row}>
            <MessageCircle size={20} color={colors.primary} />
            <Text style={[styles.rowLabel, { color: colors.text }]}>Live Chat</Text>
            <ChevronRight size={16} color={colors.textMuted} />
          </TouchableOpacity>
        </View>

        {/* FAQ */}
        <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>FREQUENTLY ASKED QUESTIONS</Text>
        {FAQ.map((item, i) => (
          <View key={i} style={[styles.faqCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={styles.faqHeader}>
              <HelpCircle size={18} color={colors.primary} />
              <Text style={[styles.faqQ, { color: colors.text }]}>{item.q}</Text>
            </View>
            <Text style={[styles.faqA, { color: colors.textSecondary }]}>{item.a}</Text>
          </View>
        ))}

        {/* Legal */}
        <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>LEGAL</Text>
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <TouchableOpacity style={[styles.row, { borderBottomWidth: 0.5, borderBottomColor: colors.border }]}>
            <FileText size={20} color={colors.primary} />
            <Text style={[styles.rowLabel, { color: colors.text }]}>Terms of Service</Text>
            <ChevronRight size={16} color={colors.textMuted} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.row}>
            <FileText size={20} color={colors.primary} />
            <Text style={[styles.rowLabel, { color: colors.text }]}>Privacy Policy</Text>
            <ChevronRight size={16} color={colors.textMuted} />
          </TouchableOpacity>
        </View>

        <View style={{ height: 40 }} />
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
  card: { borderRadius: 14, borderWidth: 1, overflow: 'hidden', marginBottom: 4 },
  row: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 16, gap: 14 },
  rowLabel: { flex: 1, fontSize: 16, fontWeight: '600' },
  faqCard: { borderRadius: 14, borderWidth: 1, padding: 16, marginBottom: 8 },
  faqHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8 },
  faqQ: { fontSize: 15, fontWeight: '700', flex: 1 },
  faqA: { fontSize: 14, lineHeight: 20, paddingLeft: 28 },
});
