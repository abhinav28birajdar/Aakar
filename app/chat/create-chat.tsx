// ============================================================
// Create Chat Screen
// ============================================================
import React, { useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity, Image, TextInput,
} from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Search, X, Check } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../src/hooks/useTheme';
import { useChatStore } from '../../src/stores/chatStore';
import { MOCK_USERS } from '../../src/data/mockData';

export default function CreateChatScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { createChat } = useChatStore();
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<string[]>([]);

  const users = MOCK_USERS.filter(u => u.id !== '1');
  const filtered = query
    ? users.filter(u => u.displayName.toLowerCase().includes(query.toLowerCase()) || u.username.toLowerCase().includes(query.toLowerCase()))
    : users;

  const toggleUser = (id: string) => {
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const handleCreate = async () => {
    if (selected.length === 0) return;
    const chatId = await createChat(selected);
    router.replace({ pathname: '/messages/[id]', params: { id: chatId } });
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.text }]}>New Message</Text>
        <TouchableOpacity onPress={handleCreate} disabled={selected.length === 0}>
          <Text style={[styles.createText, { color: selected.length > 0 ? colors.primary : colors.textMuted }]}>
            {selected.length > 1 ? 'Create Group' : 'Chat'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Selected users */}
      {selected.length > 0 && (
        <View style={styles.selectedRow}>
          {selected.map(id => {
            const u = MOCK_USERS.find(x => x.id === id);
            if (!u) return null;
            return (
              <TouchableOpacity key={id} style={[styles.selectedChip, { backgroundColor: colors.primary + '15' }]} onPress={() => toggleUser(id)}>
                <Image source={{ uri: u.avatar }} style={styles.selectedAvatar} />
                <Text style={[styles.selectedName, { color: colors.primary }]}>{u.displayName.split(' ')[0]}</Text>
                <X size={14} color={colors.primary} />
              </TouchableOpacity>
            );
          })}
        </View>
      )}

      <View style={[styles.searchBar, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <Search size={18} color={colors.textMuted} />
        <TextInput
          style={[styles.searchInput, { color: colors.text }]}
          placeholder="Search people..." placeholderTextColor={colors.textMuted}
          value={query} onChangeText={setQuery}
        />
      </View>

      <FlatList
        data={filtered}
        keyExtractor={item => item.id}
        renderItem={({ item }) => {
          const isSelected = selected.includes(item.id);
          return (
            <TouchableOpacity style={styles.userRow} onPress={() => toggleUser(item.id)}>
              <Image source={{ uri: item.avatar }} style={styles.avatar} />
              <View style={{ flex: 1 }}>
                <Text style={[styles.name, { color: colors.text }]}>{item.displayName}</Text>
                <Text style={[styles.handle, { color: colors.textMuted }]}>@{item.username}</Text>
              </View>
              <View style={[styles.checkbox, { borderColor: isSelected ? colors.primary : colors.border, backgroundColor: isSelected ? colors.primary : 'transparent' }]}>
                {isSelected && <Check size={14} color="#fff" />}
              </View>
            </TouchableOpacity>
          );
        }}
        contentContainerStyle={{ paddingBottom: 40 }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 14 },
  title: { fontSize: 18, fontWeight: '800' },
  createText: { fontSize: 15, fontWeight: '700' },
  selectedRow: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 20, gap: 8, marginBottom: 12 },
  selectedChip: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, paddingVertical: 6, borderRadius: 20, gap: 6 },
  selectedAvatar: { width: 24, height: 24, borderRadius: 12 },
  selectedName: { fontSize: 13, fontWeight: '600' },
  searchBar: { flexDirection: 'row', alignItems: 'center', marginHorizontal: 20, borderRadius: 12, paddingHorizontal: 14, height: 44, borderWidth: 1, gap: 8, marginBottom: 8 },
  searchInput: { flex: 1, fontSize: 15, height: '100%' },
  userRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 12, gap: 12 },
  avatar: { width: 48, height: 48, borderRadius: 24 },
  name: { fontSize: 15, fontWeight: '700' },
  handle: { fontSize: 13 },
  checkbox: { width: 24, height: 24, borderRadius: 12, borderWidth: 2, justifyContent: 'center', alignItems: 'center' },
});
