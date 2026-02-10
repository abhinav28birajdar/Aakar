// ============================================================
// Explore / Discovery Screen
// ============================================================
import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Image,
  TextInput, FlatList, Dimensions, ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Search, TrendingUp, Filter, X } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../src/hooks/useTheme';
import { usePostStore } from '../../src/stores/postStore';
import { useUserStore } from '../../src/stores/userStore';
import { CATEGORIES, TRENDING_TAGS, MOCK_USERS } from '../../src/data/mockData';
import { formatNumber, screenWidth } from '../../src/utils/helpers';
import { Post, UserProfile } from '../../src/types';

const IMAGE_SIZE = (screenWidth - 48 - 8) / 2;

export default function ExploreScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { posts, loadFeed, searchPosts } = usePostStore();
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<Post[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchUsers, setSearchUsers] = useState<UserProfile[]>([]);

  useEffect(() => { loadFeed(); }, []);

  useEffect(() => {
    if (query.length > 1) {
      setIsSearching(true);
      const results = searchPosts(query);
      setSearchResults(results);
      const users = MOCK_USERS.filter(u =>
        u.displayName.toLowerCase().includes(query.toLowerCase()) ||
        u.username.toLowerCase().includes(query.toLowerCase())
      );
      setSearchUsers(users);
      setIsSearching(false);
    } else {
      setSearchResults([]);
      setSearchUsers([]);
    }
  }, [query]);

  const displayPosts = query.length > 1 ? searchResults :
    selectedCategory === 'All' ? posts :
    posts.filter(p => p.category === selectedCategory || p.tags.includes(selectedCategory));

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]} edges={['top']}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={[styles.searchBar, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Search size={18} color={colors.textMuted} />
          <TextInput
            style={[styles.searchInput, { color: colors.text }]}
            placeholder="Search designs, creators, tags..."
            placeholderTextColor={colors.textMuted}
            value={query}
            onChangeText={setQuery}
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => setQuery('')}>
              <X size={18} color={colors.textMuted} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Trending Tags */}
        {query.length === 0 && (
          <View style={styles.trendingSection}>
            <View style={styles.sectionHeader}>
              <TrendingUp size={18} color={colors.primary} />
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Trending</Text>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, gap: 8 }}>
              {TRENDING_TAGS.map(tag => (
                <TouchableOpacity
                  key={tag}
                  style={[styles.trendChip, { backgroundColor: colors.primary + '15' }]}
                  onPress={() => setQuery(tag)}
                >
                  <Text style={[styles.trendText, { color: colors.primary }]}>#{tag}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {/* User Results */}
        {searchUsers.length > 0 && (
          <View style={styles.userResults}>
            <Text style={[styles.resultLabel, { color: colors.textSecondary }]}>Creators</Text>
            {searchUsers.map(u => (
              <TouchableOpacity
                key={u.id}
                style={[styles.userRow, { borderBottomColor: colors.border }]}
                onPress={() => router.push(`/profile/${u.username}`)}
              >
                <Image source={{ uri: u.avatar }} style={styles.userAvatar} />
                <View style={{ flex: 1 }}>
                  <Text style={[styles.userName, { color: colors.text }]}>{u.displayName}</Text>
                  <Text style={[styles.userHandle, { color: colors.textMuted }]}>@{u.username}</Text>
                </View>
                <Text style={[styles.followerCount, { color: colors.textSecondary }]}>{formatNumber(u.followersCount)} followers</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Categories */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.catRow} contentContainerStyle={{ paddingHorizontal: 16, gap: 8 }}>
          {CATEGORIES.map(cat => {
            const isActive = selectedCategory === cat;
            return (
              <TouchableOpacity
                key={cat}
                style={[styles.catChip, { borderColor: isActive ? colors.primary : colors.border, backgroundColor: isActive ? colors.primary + '15' : 'transparent' }]}
                onPress={() => setSelectedCategory(cat)}
              >
                <Text style={[styles.catText, { color: isActive ? colors.primary : colors.textSecondary }]}>{cat}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Grid */}
        <View style={styles.grid}>
          {displayPosts.map((post, i) => (
            <TouchableOpacity
              key={post.id}
              style={[styles.gridItem, { backgroundColor: colors.surface }]}
              onPress={() => router.push(`/post/${post.id}`)}
              activeOpacity={0.9}
            >
              <Image source={{ uri: post.images[0] }} style={styles.gridImage} resizeMode="cover" />
              <View style={styles.gridOverlay}>
                <Text style={styles.gridLikes}>♥ {formatNumber(post.likesCount)}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {displayPosts.length === 0 && !isSearching && (
          <View style={styles.emptyState}>
            <Search size={48} color={colors.textMuted} />
            <Text style={[styles.emptyTitle, { color: colors.text }]}>
              {query.length > 0 ? 'No results found' : 'No designs in this category'}
            </Text>
            <Text style={[styles.emptyDesc, { color: colors.textSecondary }]}>
              {query.length > 0 ? 'Try different keywords' : 'Check back later for new content'}
            </Text>
          </View>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  searchContainer: { paddingHorizontal: 16, paddingVertical: 12 },
  searchBar: { flexDirection: 'row', alignItems: 'center', borderRadius: 12, paddingHorizontal: 14, height: 44, borderWidth: 1, gap: 8 },
  searchInput: { flex: 1, fontSize: 15, height: '100%' },
  trendingSection: { marginBottom: 16 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 16, marginBottom: 12 },
  sectionTitle: { fontSize: 17, fontWeight: '800' },
  trendChip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20 },
  trendText: { fontSize: 13, fontWeight: '700' },
  userResults: { paddingHorizontal: 16, marginBottom: 16 },
  resultLabel: { fontSize: 13, fontWeight: '700', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 },
  userRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 0.5, gap: 12 },
  userAvatar: { width: 40, height: 40, borderRadius: 20 },
  userName: { fontSize: 15, fontWeight: '700' },
  userHandle: { fontSize: 13 },
  followerCount: { fontSize: 12 },
  catRow: { marginBottom: 16 },
  catChip: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20, borderWidth: 1 },
  catText: { fontSize: 12, fontWeight: '600' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 16, gap: 8 },
  gridItem: { width: IMAGE_SIZE, height: IMAGE_SIZE, borderRadius: 14, overflow: 'hidden' },
  gridImage: { width: '100%', height: '100%' },
  gridOverlay: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 8, backgroundColor: 'rgba(0,0,0,0.3)' },
  gridLikes: { color: '#fff', fontSize: 12, fontWeight: '700' },
  emptyState: { alignItems: 'center', paddingTop: 60, gap: 12 },
  emptyTitle: { fontSize: 18, fontWeight: '700' },
  emptyDesc: { fontSize: 14 },
});
