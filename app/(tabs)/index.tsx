// ============================================================
// Home / Feed Screen - Role-based dashboard with feed tabs
// ============================================================
import React, { useEffect, useCallback } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  RefreshControl, ActivityIndicator, ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import {
  MessageCircle, TrendingUp, Sparkles, Users, Clock, BookOpen, Briefcase, Star,
} from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../src/hooks/useTheme';
import { useAuthStore } from '../../src/context/stores/authStore';
import { usePostStore } from '../../src/context/stores/postStore';
import { useUserStore } from '../../src/context/stores/userStore';
import { Post } from '../../src/types';
import { CATEGORIES } from '../../src/config/constants';
import { FeedPostCard } from '../../src/components/molecules';
import { ResponsiveContainer } from '../../src/components/atoms';

const FEED_TABS = [
  { key: 'forYou', label: 'For You', icon: Sparkles },
  { key: 'following', label: 'Following', icon: Users },
  { key: 'trending', label: 'Trending', icon: TrendingUp },
  { key: 'fresh', label: 'Fresh', icon: Clock },
] as const;

function RoleBanner({ role, colors }: { role: string; colors: any }) {
  const router = useRouter();
  const configs: Record<string, { title: string; desc: string; icon: any; gradient: string[]; action: string; route: string }> = {
    mentor: { title: '🎓 Mentoring Dashboard', desc: 'You have 3 pending mentee requests', icon: Star, gradient: ['#7C3AED', '#4F46E5'], action: 'View Requests', route: '/activity' },
    recruiter: { title: '🔍 Talent Discovery', desc: 'Browse top designer portfolios', icon: Briefcase, gradient: ['#059669', '#0D9488'], action: 'Find Talent', route: '/explore' },
    learner: { title: '📚 Continue Learning', desc: 'You have 2 tutorials in progress', icon: BookOpen, gradient: ['#EA580C', '#DC2626'], action: 'Resume', route: '/explore' },
    designer: { title: '✨ Creator Studio', desc: 'Share your latest work with the community', icon: Sparkles, gradient: ['#667eea', '#764ba2'], action: 'Create Post', route: '/create' },
  };
  const c = configs[role] || configs.designer;

  return (
    <TouchableOpacity onPress={() => router.push(c.route as any)} activeOpacity={0.9}>
      <LinearGradient colors={c.gradient as any} style={styles.roleBanner} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
        <View style={{ flex: 1 }}>
          <Text style={styles.roleBannerTitle}>{c.title}</Text>
          <Text style={styles.roleBannerDesc}>{c.desc}</Text>
        </View>
        <View style={styles.roleBannerAction}>
          <Text style={styles.roleBannerActionText}>{c.action}</Text>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
}

export default function HomeScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const user = useAuthStore(s => s.user);
  const {
    posts, feedType, setFeedType, loadFeed, refreshFeed,
    isLoading, isRefreshing, selectedCategory, setCategory,
    likePost, unlikePost, savePost, unsavePost
  } = usePostStore();
  const { likedPosts, savedPosts } = useUserStore();

  const enhancedPosts = posts.map(p => ({
    ...p,
    isLiked: likedPosts.has(p.id),
    isSaved: savedPosts.has(p.id)
  }));

  useEffect(() => { loadFeed(); }, []);

  const handlePostPress = (post: Post) => {
    router.push(`/post/${post.id}`);
  };

  const handleLike = (post: Post) => {
    if (post.isLiked) unlikePost(post.id);
    else likePost(post.id);
  };

  const handleSave = (post: Post) => {
    if (post.isSaved) unsavePost(post.id);
    else savePost(post.id);
  };

  const renderHeader = () => (
    <View>
      {/* Top Bar */}
      <View style={styles.topBar}>
        <Text style={[styles.logo, { color: colors.primary }]}>Aakar</Text>
        <View style={styles.topRight}>
          <TouchableOpacity onPress={() => router.push('/chat/chat-list')} style={styles.topIcon}>
            <MessageCircle size={22} color={colors.text} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Role Banner */}
      {user && <RoleBanner role={user.role} colors={colors} />}

      {/* Feed Tabs */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.feedTabs} contentContainerStyle={{ paddingHorizontal: 16, gap: 4 }}>
        {FEED_TABS.map(tab => {
          const isActive = feedType === tab.key;
          const Icon = tab.icon;
          return (
            <TouchableOpacity
              key={tab.key}
              style={[styles.feedTab, isActive && { backgroundColor: colors.primary }]}
              onPress={() => setFeedType(tab.key as any)}
            >
              <Icon size={14} color={isActive ? '#fff' : colors.textSecondary} />
              <Text style={[styles.feedTabText, { color: isActive ? '#fff' : colors.textSecondary }]}>{tab.label}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Category Filter */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.catRow} contentContainerStyle={{ paddingHorizontal: 16, gap: 8 }}>
        {CATEGORIES.map(cat => {
          const isActive = selectedCategory === cat;
          return (
            <TouchableOpacity
              key={cat}
              style={[styles.catChip, { borderColor: isActive ? colors.primary : colors.border, backgroundColor: isActive ? colors.primary + '15' : 'transparent' }]}
              onPress={() => setCategory(cat)}
            >
              <Text style={[styles.catText, { color: isActive ? colors.primary : colors.textSecondary }]}>{cat}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]} edges={['top']}>
      <ResponsiveContainer>
        <FlatList
          data={enhancedPosts}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <FeedPostCard
              post={item}
              onPress={() => handlePostPress(item)}
              onLike={() => handleLike(item)}
              onSave={() => handleSave(item)}
              onComment={() => handlePostPress(item)}
            />
          )}
          ListHeaderComponent={renderHeader}
          ListEmptyComponent={
            isLoading ? (
              <ActivityIndicator color={colors.primary} style={{ marginTop: 60 }} />
            ) : (
              <View style={styles.emptyState}>
                <Text style={[styles.emptyTitle, { color: colors.text }]}>No posts yet</Text>
                <Text style={[styles.emptyDesc, { color: colors.textSecondary }]}>Follow creators to see their work here</Text>
              </View>
            )
          }
          contentContainerStyle={{ paddingBottom: 100 }}
          refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={refreshFeed} tintColor={colors.primary} />}
          showsVerticalScrollIndicator={false}
        />
      </ResponsiveContainer>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 12 },
  logo: { fontSize: 28, fontWeight: '900', letterSpacing: -1 },
  topRight: { flexDirection: 'row', gap: 16 },
  topIcon: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  roleBanner: { marginHorizontal: 16, borderRadius: 16, padding: 20, flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  roleBannerTitle: { color: '#fff', fontSize: 17, fontWeight: '800', marginBottom: 4 },
  roleBannerDesc: { color: 'rgba(255,255,255,0.85)', fontSize: 13 },
  roleBannerAction: { backgroundColor: 'rgba(255,255,255,0.25)', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10, marginLeft: 12 },
  roleBannerActionText: { color: '#fff', fontWeight: '700', fontSize: 12 },
  feedTabs: { marginBottom: 12 },
  feedTab: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20 },
  feedTabText: { fontSize: 13, fontWeight: '700' },
  catRow: { marginBottom: 16 },
  catChip: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20, borderWidth: 1 },
  catText: { fontSize: 12, fontWeight: '600' },
  emptyState: { alignItems: 'center', paddingTop: 80, paddingHorizontal: 40 },
  emptyTitle: { fontSize: 20, fontWeight: '700', marginBottom: 8 },
  emptyDesc: { fontSize: 15, textAlign: 'center', lineHeight: 22 },
});
