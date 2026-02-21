// ============================================================
// Report Content Screen
// ============================================================
import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert,
  ActivityIndicator,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, ShieldAlert } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../src/hooks/useTheme';
import { ResponsiveContainer } from '../src/components/atoms';

const REASONS = [
  'Spam or misleading',
  'Hate speech or symbols',
  'Violence or dangerous organizations',
  'Nudity or sexual activity',
  'Harassment or bullying',
  'Intellectual property violation',
  'Scam or fraud',
  'Other',
];

export default function ReportScreen() {
  const router = useRouter();
  const { targetId, targetType } = useLocalSearchParams<{ targetId: string; targetType: string }>();
  const { colors } = useTheme();
  const [selectedReason, setSelectedReason] = useState<string | null>(null);
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!selectedReason) return Alert.alert('Error', 'Please select a reason');

    setLoading(true);
    // In a real app, this would call a Cloud Function or DB service
    // For now, we simulate success
    setTimeout(() => {
      setLoading(false);
      Alert.alert('Report Submitted', 'Thank you for reporting. Our team will review this content shortly.', [
        { text: 'OK', onPress: () => router.back() }
      ]);
    }, 1500);
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]} edges={['top']}>
      <ResponsiveContainer>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <ArrowLeft size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.title, { color: colors.text }]}>Report {targetType}</Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
          <View style={[styles.infoCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <ShieldAlert size={24} color={colors.error} />
            <Text style={[styles.infoText, { color: colors.text }]}>
              Reporting help us keep the Aakar community safe and professional.
            </Text>
          </View>

          <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>WHY ARE YOU REPORTING THIS?</Text>

          <View style={[styles.optionsCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            {REASONS.map((reason, i) => (
              <TouchableOpacity
                key={reason}
                style={[styles.optionRow, i < REASONS.length - 1 && { borderBottomWidth: 0.5, borderBottomColor: colors.border }]}
                onPress={() => setSelectedReason(reason)}
              >
                <Text style={[styles.optionText, { color: colors.text }]}>{reason}</Text>
                <View style={[styles.radio, { borderColor: selectedReason === reason ? colors.primary : colors.border }]}>
                  {selectedReason === reason && <View style={[styles.radioInner, { backgroundColor: colors.primary }]} />}
                </View>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={[styles.sectionTitle, { color: colors.textMuted, marginTop: 24 }]}>ADDITIONAL DETAILS (OPTIONAL)</Text>
          <TextInput
            style={[styles.input, { color: colors.text, borderColor: colors.border, backgroundColor: colors.surface }]}
            value={description}
            onChangeText={setDescription}
            placeholder="Tell us more about the issue..."
            placeholderTextColor={colors.textMuted}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />

          <TouchableOpacity
            style={[styles.submitBtn, { backgroundColor: colors.primary }, loading && { opacity: 0.7 }]}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.submitText}>Submit Report</Text>}
          </TouchableOpacity>

          <View style={{ height: 40 }} />
        </ScrollView>
      </ResponsiveContainer>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 14 },
  title: { fontSize: 18, fontWeight: '800' },
  body: { paddingHorizontal: 20 },
  infoCard: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 16, borderRadius: 14, borderWidth: 1, marginBottom: 24 },
  infoText: { flex: 1, fontSize: 14, lineHeight: 20 },
  sectionTitle: { fontSize: 13, fontWeight: '700', letterSpacing: 1, marginBottom: 12 },
  optionsCard: { borderRadius: 14, borderWidth: 1, overflow: 'hidden' },
  optionRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 14 },
  optionText: { fontSize: 15, fontWeight: '600' },
  radio: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, justifyContent: 'center', alignItems: 'center' },
  radioInner: { width: 12, height: 12, borderRadius: 6 },
  input: { borderWidth: 1, borderRadius: 12, padding: 16, height: 100, fontSize: 15, marginBottom: 24 },
  submitBtn: { height: 52, borderRadius: 14, justifyContent: 'center', alignItems: 'center' },
  submitText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
