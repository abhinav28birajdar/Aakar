// ============================================================
// Skills & Interests Selection Screen
// ============================================================
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Search, Check, ArrowRight } from 'lucide-react-native';
import { useTheme } from '../../src/hooks/useTheme';
import { useAuthStore } from '../../src/stores/authStore';
import { SKILL_TAGS, SOFTWARE_LIST, CATEGORIES } from '../../src/data/mockData';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SkillsScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { updateProfile, completeOnboarding } = useAuthStore();

  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [selectedSoftware, setSelectedSoftware] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [tab, setTab] = useState<'skills' | 'interests' | 'software'>('skills');
  const [loading, setLoading] = useState(false);

  const toggleItem = (item: string, list: string[], setList: (v: string[]) => void) => {
    if (list.includes(item)) {
      setList(list.filter(i => i !== item));
    } else {
      setList([...list, item]);
    }
  };

  const allInterests = CATEGORIES.filter(c => c !== 'All');

  const getFilteredItems = () => {
    const q = searchQuery.toLowerCase();
    switch (tab) {
      case 'skills': return SKILL_TAGS.filter(s => s.toLowerCase().includes(q));
      case 'interests': return allInterests.filter(s => s.toLowerCase().includes(q));
      case 'software': return SOFTWARE_LIST.filter(s => s.toLowerCase().includes(q));
    }
  };

  const getCurrentSelection = () => {
    switch (tab) {
      case 'skills': return selectedSkills;
      case 'interests': return selectedInterests;
      case 'software': return selectedSoftware;
    }
  };

  const getCurrentToggle = () => {
    switch (tab) {
      case 'skills': return (item: string) => toggleItem(item, selectedSkills, setSelectedSkills);
      case 'interests': return (item: string) => toggleItem(item, selectedInterests, setSelectedInterests);
      case 'software': return (item: string) => toggleItem(item, selectedSoftware, setSelectedSoftware);
    }
  };

  const handleFinish = async () => {
    setLoading(true);
    await updateProfile({
      skills: selectedSkills,
      interests: selectedInterests,
      software: selectedSoftware.reduce((acc, s) => ({ ...acc, [s]: 3 }), {}),
    });
    await completeOnboarding();
    setLoading(false);
    router.replace('/(tabs)');
  };

  const items = getFilteredItems();
  const selection = getCurrentSelection();
  const toggle = getCurrentToggle();

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.step, { color: colors.primary }]}>Step 3 of 3</Text>
        <Text style={[styles.title, { color: colors.text }]}>Your Expertise</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Select your skills, interests, and tools</Text>
      </View>

      {/* Tab Selector */}
      <View style={[styles.tabRow, { backgroundColor: colors.surface }]}>
        {(['skills', 'interests', 'software'] as const).map(t => (
          <TouchableOpacity
            key={t}
            style={[styles.tab, tab === t && { backgroundColor: colors.primary }]}
            onPress={() => { setTab(t); setSearchQuery(''); }}
          >
            <Text style={[styles.tabText, { color: tab === t ? '#fff' : colors.textSecondary }]}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
              {tab === t && getCurrentSelection().length > 0 ? ` (${getCurrentSelection().length})` : ''}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Search */}
      <View style={[styles.searchBox, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <Search size={18} color={colors.textMuted} />
        <TextInput
          style={[styles.searchInput, { color: colors.text }]}
          value={searchQuery} onChangeText={setSearchQuery}
          placeholder={`Search ${tab}...`} placeholderTextColor={colors.textMuted}
        />
      </View>

      {/* Tags */}
      <ScrollView contentContainerStyle={styles.tagsContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.tagsWrap}>
          {items.map(item => {
            const isSelected = selection.includes(item);
            return (
              <TouchableOpacity
                key={item}
                style={[
                  styles.tag,
                  {
                    backgroundColor: isSelected ? colors.primary + '20' : colors.surface,
                    borderColor: isSelected ? colors.primary : colors.border,
                  },
                ]}
                onPress={() => toggle(item)}
              >
                {isSelected && <Check size={14} color={colors.primary} />}
                <Text style={[styles.tagText, { color: isSelected ? colors.primary : colors.text }]}>{item}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      {/* Summary & Finish */}
      <View style={styles.bottom}>
        <View style={styles.summaryRow}>
          <Text style={[styles.summaryText, { color: colors.textSecondary }]}>
            {selectedSkills.length} skills · {selectedInterests.length} interests · {selectedSoftware.length} tools
          </Text>
        </View>
        <View style={styles.buttonRow}>
          <TouchableOpacity onPress={handleFinish} style={{ flex: 1 }} disabled={loading} activeOpacity={0.8}>
            <LinearGradient colors={['#667eea', '#764ba2']} style={styles.finishBtn} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
              {loading ? <ActivityIndicator color="#fff" /> : (
                <>
                  <Text style={styles.finishBtnText}>Finish Setup</Text>
                  <ArrowRight size={20} color="#fff" />
                </>
              )}
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: { paddingHorizontal: 24, marginTop: 16, marginBottom: 16 },
  step: { fontSize: 13, fontWeight: '700', marginBottom: 8 },
  title: { fontSize: 26, fontWeight: '800', marginBottom: 4 },
  subtitle: { fontSize: 15 },
  tabRow: { flexDirection: 'row', marginHorizontal: 24, borderRadius: 12, padding: 4, marginBottom: 12 },
  tab: { flex: 1, paddingVertical: 10, borderRadius: 10, alignItems: 'center' },
  tabText: { fontSize: 13, fontWeight: '700' },
  searchBox: { flexDirection: 'row', alignItems: 'center', marginHorizontal: 24, borderRadius: 12, paddingHorizontal: 14, height: 44, borderWidth: 1, gap: 8, marginBottom: 12 },
  searchInput: { flex: 1, fontSize: 15, height: '100%' },
  tagsContainer: { paddingHorizontal: 24, paddingBottom: 16 },
  tagsWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  tag: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 10, borderRadius: 10, borderWidth: 1, gap: 6 },
  tagText: { fontSize: 14, fontWeight: '500' },
  bottom: { paddingHorizontal: 24, paddingBottom: 20, borderTopWidth: 1, borderTopColor: '#eee', paddingTop: 12 },
  summaryRow: { alignItems: 'center', marginBottom: 12 },
  summaryText: { fontSize: 13, fontWeight: '600' },
  buttonRow: { flexDirection: 'row', gap: 12 },
  finishBtn: { height: 56, borderRadius: 14, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8 },
  finishBtnText: { color: '#fff', fontSize: 17, fontWeight: '700' },
});
