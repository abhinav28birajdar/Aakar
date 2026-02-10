// ============================================================
// Search Screen
// ============================================================
import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, TextInput, FlatList, TouchableOpacity, Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Search as SearchIcon, X, TrendingUp } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../src/hooks/useTheme';
import { usePostStore } from '../src/stores/postStore';
import { MOCK_USERS, TRENDING_TAGS } from '../src/data/mockData';
import { formatNumber, timeAgo } from '../src/utils/helpers';

export default function SearchScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { searchPosts } = usePostStore();
  const [query, setQuery] = useState('');
  const [tab, setTab] = useState<'posts' | 'people'>('posts');

  const postResults = query.length > 1 ? searchPosts(query) : [];
  const userResults = query.length > 1
    ? MOCK_USERS.filter(u =>
        u.displayName.toLowerCase().includes(query.toLowerCase()) ||
        u.username.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <View style={[styles.searchBar, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <SearchIcon size={18} color={colors.textMuted} />
          <TextInput
            style={[styles.searchInput, { color: colors.text }]}
            placeholder="Search..." placeholderTextColor={colors.textMuted}
            value={query} onChangeText={setQuery} autoFocus
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => setQuery('')}><X size={18} color={colors.textMuted} /></TouchableOpacity>
          )}
        </View>
      </View>

      {query.length <= 1 ? (
        <View style={styles.trending}>
          <View style={styles.trendHeader}>
            <TrendingUp size={18} color={colors.primary} />
            <Text style={[styles.trendTitle, { color: colors.text }]}>Trending</Text>
          </View>
          {TRENDING_TAGS.map(tag => (
            <TouchableOpacity key={tag} style={styles.trendItem} onPress={() => setQuery(tag)}>
              <Text style={[styles.trendTag, { color: colors.text }]}>#{tag}</Text>
            </TouchableOpacity>
          ))}
        </View>
      ) : (
        <>
          <View style={styles.tabRow}>
            {(['posts', 'people'] as const).map(t => (
              <TouchableOpacity
                key={t}
                style={[styles.tab, tab === t && { borderBottomColor: colors.primary, borderBottomWidth: 2 }]}
                onPress={() => setTab(t)}
              >
                <Text style={[styles.tabText, { color: tab === t ? colors.primary : colors.textMuted }]}>
                  {t.charAt(0).toUpperCase() + t.slice(1)} ({t === 'posts' ? postResults.length : userResults.length})
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {tab === 'posts' ? (
            <FlatList
              data={postResults}
              keyExtractor={item => item.id}
              contentContainerStyle={{ paddingBottom: 40 }}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.postRow} onPress={() => router.push(`/post/${item.id}`)}>
                  <Image source={{ uri: item.images[0] }} style={styles.postThumb} />
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.postTitle, { color: colors.text }]} numberOfLines={1}>{item.title}</Text>
                    <Text style={[styles.postMeta, { color: colors.textMuted }]}>
                      by {item.user.displayName} · {formatNumber(item.likesCount)} likes
                    </Text>
                  </View>
                </TouchableOpacity>
              )}
              ListEmptyComponent={<View style={styles.empty}><Text style={{ color: colors.textMuted }}>No posts found</Text></View>}
            />
          ) : (
            <FlatList
              data={userResults}
              keyExtractor={item => item.id}
              contentContainerStyle={{ paddingBottom: 40 }}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.userRow} onPress={() => router.push(`/profile/${item.username}`)}>
                  <Image source={{ uri: item.avatar }} style={styles.userAvatar} />
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.userName, { color: colors.text }]}>{item.displayName}</Text>
                    <Text style={[styles.userHandle, { color: colors.textMuted }]}>@{item.username}</Text>
                  </View>
                  <Text style={[styles.followers, { color: colors.textSecondary }]}>{formatNumber(item.followersCount)}</Text>
                </TouchableOpacity>
              )}
              ListEmptyComponent={<View style={styles.empty}><Text style={{ color: colors.textMuted }}>No users found</Text></View>}
            />
          )}
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 10, gap: 10 },
  searchBar: { flex: 1, flexDirection: 'row', alignItems: 'center', borderRadius: 12, paddingHorizontal: 12, height: 42, borderWidth: 1, gap: 8 },
  searchInput: { flex: 1, fontSize: 15, height: '100%' },
  trending: { paddingHorizontal: 20, paddingTop: 20 },
  trendHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 16 },
  trendTitle: { fontSize: 18, fontWeight: '800' },
  trendItem: { paddingVertical: 12, borderBottomWidth: 0 },
  trendTag: { fontSize: 16, fontWeight: '600' },
  tabRow: { flexDirection: 'row', borderBottomWidth: 0.5, borderBottomColor: '#eee' },
  tab: { flex: 1, alignItems: 'center', paddingVertical: 14 },
  tabText: { fontSize: 14, fontWeight: '700' },
  postRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 12, gap: 12 },
  postThumb: { width: 56, height: 56, borderRadius: 10 },
  postTitle: { fontSize: 15, fontWeight: '700' },
  postMeta: { fontSize: 12, marginTop: 4 },
  userRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 12, gap: 12 },
  userAvatar: { width: 48, height: 48, borderRadius: 24 },
  userName: { fontSize: 15, fontWeight: '700' },
  userHandle: { fontSize: 13 },
  followers: { fontSize: 12 },
  empty: { paddingTop: 60, alignItems: 'center' },
});
