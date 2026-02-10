// ============================================================
// Report Screen – Reports posts, users, or comments
// ============================================================
import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, TextInput, Alert, ScrollView,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Flag, CheckCircle } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../src/hooks/useTheme';

type Reason = { id: string; label: string };
const REASONS: Reason[] = [
  { id: 'spam', label: 'Spam or scam' },
  { id: 'harassment', label: 'Harassment or bullying' },
  { id: 'hate', label: 'Hate speech' },
  { id: 'violence', label: 'Violence or threats' },
  { id: 'nudity', label: 'Nudity or sexual content' },
  { id: 'ip', label: 'Intellectual property violation' },
  { id: 'misinformation', label: 'Misinformation' },
  { id: 'other', label: 'Something else' },
];

export default function ReportScreen() {
  const router = useRouter();
  const { targetId, targetType } = useLocalSearchParams<{ targetId: string; targetType: string }>();
  const { colors } = useTheme();

  const [selected, setSelected] = useState<string | null>(null);
  const [details, setDetails] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (!selected) { Alert.alert('Please select a reason'); return; }
    // In production, send to backend
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
        <View style={styles.successContainer}>
          <CheckCircle size={64} color={colors.primary} />
          <Text style={[styles.successTitle, { color: colors.text }]}>Report Submitted</Text>
          <Text style={[styles.successSub, { color: colors.textSecondary }]}>
            Thank you for helping keep Aakar safe. We'll review your report and take appropriate action.
          </Text>
          <TouchableOpacity style={[styles.doneBtn, { backgroundColor: colors.primary }]} onPress={() => router.back()}>
            <Text style={styles.doneBtnText}>Done</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.text }]}>Report {targetType || 'Content'}</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Why are you reporting this {targetType || 'content'}? Your report is anonymous.
        </Text>

        {REASONS.map(reason => (
          <TouchableOpacity
            key={reason.id}
            style={[
              styles.reasonRow,
              { borderColor: selected === reason.id ? colors.primary : colors.border, backgroundColor: selected === reason.id ? colors.primary + '10' : colors.surface },
            ]}
            onPress={() => setSelected(reason.id)}
          >
            <View style={[styles.radio, { borderColor: selected === reason.id ? colors.primary : colors.textSecondary }]}>
              {selected === reason.id && <View style={[styles.radioDot, { backgroundColor: colors.primary }]} />}
            </View>
            <Text style={[styles.reasonLabel, { color: colors.text }]}>{reason.label}</Text>
          </TouchableOpacity>
        ))}

        <Text style={[styles.detailsLabel, { color: colors.text }]}>Additional details (optional)</Text>
        <TextInput
          style={[styles.textArea, { backgroundColor: colors.surface, color: colors.text, borderColor: colors.border }]}
          placeholder="Provide more context..."
          placeholderTextColor={colors.textSecondary}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
          value={details}
          onChangeText={setDetails}
        />

        <TouchableOpacity onPress={handleSubmit} activeOpacity={0.85}>
          <LinearGradient colors={['#667eea', '#764ba2']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.submitBtn}>
            <Flag size={18} color="#fff" />
            <Text style={styles.submitBtnText}>Submit Report</Text>
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 14 },
  title: { fontSize: 18, fontWeight: '800' },
  body: { paddingHorizontal: 20, paddingBottom: 40 },
  subtitle: { fontSize: 14, lineHeight: 20, marginBottom: 20 },
  reasonRow: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 14, paddingHorizontal: 16, borderRadius: 12, borderWidth: 1, marginBottom: 10 },
  radio: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, justifyContent: 'center', alignItems: 'center' },
  radioDot: { width: 12, height: 12, borderRadius: 6 },
  reasonLabel: { fontSize: 15, fontWeight: '500', flex: 1 },
  detailsLabel: { fontSize: 14, fontWeight: '600', marginTop: 20, marginBottom: 8 },
  textArea: { borderWidth: 1, borderRadius: 12, padding: 14, fontSize: 14, minHeight: 100 },
  submitBtn: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8, paddingVertical: 16, borderRadius: 14, marginTop: 24 },
  submitBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  successContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 40 },
  successTitle: { fontSize: 22, fontWeight: '800', marginTop: 20 },
  successSub: { fontSize: 14, textAlign: 'center', marginTop: 8, lineHeight: 20 },
  doneBtn: { marginTop: 30, paddingVertical: 14, paddingHorizontal: 40, borderRadius: 12 },
  doneBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
