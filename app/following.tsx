// ============================================================
// Following List Screen
// ============================================================
import React, { useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput,
} from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Search, X } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../src/hooks/useTheme';
import { useUserStore } from '../src/stores/userStore';
import { MOCK_USERS } from '../src/data/mockData';
import { UserCard } from '../src/components/molecules';

export default function FollowingScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { following, isFollowing } = useUserStore();
  const [query, setQuery] = useState('');

  const followingUsers = MOCK_USERS.filter(u => following.has(u.id));
  const filtered = query
    ? followingUsers.filter(u => u.displayName.toLowerCase().includes(query.toLowerCase()) || u.username.toLowerCase().includes(query.toLowerCase()))
    : followingUsers;

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.text }]}>Following ({following.size})</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={[styles.searchBar, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <Search size={18} color={colors.textMuted} />
        <TextInput
          style={[styles.searchInput, { color: colors.text }]}
          placeholder="Search following..." placeholderTextColor={colors.textMuted}
          value={query} onChangeText={setQuery}
        />
        {query.length > 0 && (
          <TouchableOpacity onPress={() => setQuery('')}><X size={18} color={colors.textMuted} /></TouchableOpacity>
        )}
      </View>

      <FlatList
        data={filtered}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <UserCard
            name={item.displayName}
            username={item.username}
            avatar={item.avatar}
            isFollowing={isFollowing(item.id)}
            onPress={() => router.push(`/profile/${item.username}`)}
          />
        )}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={[styles.emptyText, { color: colors.textMuted }]}>Not following anyone yet</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 14 },
  title: { fontSize: 18, fontWeight: '800' },
  searchBar: { flexDirection: 'row', alignItems: 'center', marginHorizontal: 20, borderRadius: 12, paddingHorizontal: 14, height: 44, borderWidth: 1, gap: 8, marginBottom: 12 },
  searchInput: { flex: 1, fontSize: 15, height: '100%' },
  empty: { paddingTop: 60, alignItems: 'center' },
  emptyText: { fontSize: 15 },
});
