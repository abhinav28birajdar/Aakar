// ============================================================
// Category / Tag Filter Screen - category/[id].tsx
// ============================================================
import React, { useMemo } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity, Image, Dimensions,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Heart } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../src/hooks/useTheme';
import { MOCK_POSTS } from '../../src/data/mockData';
import { formatNumber, screenWidth } from '../../src/utils/helpers';

const GRID_SIZE = (screenWidth - 48 - 8) / 2;

export default function CategoryScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { colors } = useTheme();

  const categoryPosts = useMemo(() =>
    MOCK_POSTS.filter(p =>
      p.category === id ||
      p.tags.some(t => t.toLowerCase() === id?.toLowerCase())
    ), [id]);

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.text }]}>#{id}</Text>
        <View style={{ width: 24 }} />
      </View>

      <Text style={[styles.count, { color: colors.textSecondary }]}>
        {categoryPosts.length} {categoryPosts.length === 1 ? 'post' : 'posts'}
      </Text>

      <FlatList
        data={categoryPosts}
        keyExtractor={item => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 40 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.gridItem, { backgroundColor: colors.surface }]}
            onPress={() => router.push(`/post/${item.id}`)}
          >
            <Image source={{ uri: item.images[0] }} style={styles.gridImage} />
            <View style={styles.itemInfo}>
              <Text style={[styles.itemTitle, { color: colors.text }]} numberOfLines={1}>{item.title}</Text>
              <View style={styles.itemStats}>
                <Heart size={12} color="#FF6B6B" />
                <Text style={[styles.itemStat, { color: colors.textMuted }]}>{formatNumber(item.likesCount)}</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={[styles.emptyText, { color: colors.textMuted }]}>No posts in this category</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 14 },
  title: { fontSize: 20, fontWeight: '800' },
  count: { paddingHorizontal: 20, marginBottom: 16, fontSize: 14 },
  row: { gap: 8, marginBottom: 8 },
  gridItem: { width: GRID_SIZE, borderRadius: 14, overflow: 'hidden' },
  gridImage: { width: '100%', height: GRID_SIZE },
  itemInfo: { padding: 10 },
  itemTitle: { fontSize: 13, fontWeight: '700', marginBottom: 4 },
  itemStats: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  itemStat: { fontSize: 12 },
  empty: { paddingTop: 60, alignItems: 'center' },
  emptyText: { fontSize: 15 },
});
