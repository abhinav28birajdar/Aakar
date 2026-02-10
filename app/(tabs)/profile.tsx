// ============================================================
// Profile Screen - Own profile with stats, posts, collections
// ============================================================
import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Image,
  FlatList, Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Settings, Edit3, Grid, Bookmark, Award, MapPin, Link as LinkIcon,
  MoreHorizontal, Share2, Users, Eye, Heart, ChevronRight,
} from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../src/hooks/useTheme';
import { useAuthStore } from '../../src/stores/authStore';
import { usePostStore } from '../../src/stores/postStore';
import { useUserStore } from '../../src/stores/userStore';
import { formatNumber, screenWidth } from '../../src/utils/helpers';
import { Post } from '../../src/types';

const GRID_SIZE = (screenWidth - 48 - 8) / 3;

export default function ProfileScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const user = useAuthStore(s => s.user);
  const { posts, loadFeed, savedPosts } = usePostStore();
  const { followers, following } = useUserStore();
  const [activeTab, setActiveTab] = useState<'posts' | 'saved' | 'collections'>('posts');

  useEffect(() => { loadFeed(); }, []);

  const myPosts = posts.filter(p => p.userId === user?.id);

  if (!user) return null;

  const stats = [
    { label: 'Posts', value: formatNumber(user.postsCount), onPress: () => {} },
    { label: 'Followers', value: formatNumber(user.followersCount), onPress: () => router.push('/followers') },
    { label: 'Following', value: formatNumber(user.followingCount), onPress: () => router.push('/following') },
  ];

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.username, { color: colors.text }]}>@{user.username}</Text>
          <View style={styles.headerRight}>
            <TouchableOpacity onPress={() => router.push('/analytics')} style={styles.iconBtn}>
              <Eye size={22} color={colors.text} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push('/settings')} style={styles.iconBtn}>
              <Settings size={22} color={colors.text} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Cover Photo */}
        {user.coverPhoto && (
          <Image source={{ uri: user.coverPhoto }} style={styles.coverPhoto} />
        )}

        {/* Avatar & Info */}
        <View style={[styles.profileInfo, { marginTop: user.coverPhoto ? -40 : 0 }]}>
          <View style={styles.avatarRow}>
            <View style={[styles.avatarBorder, { borderColor: colors.primary }]}>
              <Image source={{ uri: user.avatar }} style={styles.avatar} />
            </View>
            <TouchableOpacity
              style={[styles.editBtn, { backgroundColor: colors.surface, borderColor: colors.border }]}
              onPress={() => router.push('/edit-profile')}
            >
              <Edit3 size={16} color={colors.text} />
              <Text style={[styles.editBtnText, { color: colors.text }]}>Edit Profile</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.nameSection}>
            <View style={styles.nameRow}>
              <Text style={[styles.displayName, { color: colors.text }]}>{user.displayName}</Text>
              {user.isVerified && (
                <View style={[styles.verifiedBadge, { backgroundColor: colors.primary }]}>
                  <Award size={12} color="#fff" />
                </View>
              )}
            </View>
            <Text style={[styles.role, { color: colors.primary }]}>{user.role.charAt(0).toUpperCase() + user.role.slice(1)}</Text>
          </View>

          {user.bio ? <Text style={[styles.bio, { color: colors.textSecondary }]}>{user.bio}</Text> : null}

          <View style={styles.metaRow}>
            {user.location && (
              <View style={styles.metaItem}>
                <MapPin size={14} color={colors.textMuted} />
                <Text style={[styles.metaText, { color: colors.textMuted }]}>{user.location}</Text>
              </View>
            )}
            {user.website && (
              <TouchableOpacity style={styles.metaItem}>
                <LinkIcon size={14} color={colors.primary} />
                <Text style={[styles.metaText, { color: colors.primary }]}>{user.website.replace('https://', '')}</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Skills */}
          {user.skills.length > 0 && (
            <View style={styles.skillsRow}>
              {user.skills.slice(0, 4).map(skill => (
                <View key={skill} style={[styles.skillChip, { backgroundColor: colors.primary + '15' }]}>
                  <Text style={[styles.skillText, { color: colors.primary }]}>{skill}</Text>
                </View>
              ))}
              {user.skills.length > 4 && (
                <Text style={[styles.moreSkills, { color: colors.textMuted }]}>+{user.skills.length - 4}</Text>
              )}
            </View>
          )}

          {/* Stats */}
          <View style={[styles.statsRow, { borderColor: colors.border }]}>
            {stats.map((stat, i) => (
              <TouchableOpacity key={stat.label} style={styles.statItem} onPress={stat.onPress}>
                <Text style={[styles.statValue, { color: colors.text }]}>{stat.value}</Text>
                <Text style={[styles.statLabel, { color: colors.textMuted }]}>{stat.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Tabs */}
        <View style={[styles.tabRow, { borderBottomColor: colors.border }]}>
          {(['posts', 'saved', 'collections'] as const).map(tab => (
            <TouchableOpacity
              key={tab}
              style={[styles.tab, activeTab === tab && { borderBottomColor: colors.primary, borderBottomWidth: 2 }]}
              onPress={() => setActiveTab(tab)}
            >
              {tab === 'posts' && <Grid size={18} color={activeTab === tab ? colors.primary : colors.textMuted} />}
              {tab === 'saved' && <Bookmark size={18} color={activeTab === tab ? colors.primary : colors.textMuted} />}
              {tab === 'collections' && <Award size={18} color={activeTab === tab ? colors.primary : colors.textMuted} />}
              <Text style={[styles.tabText, { color: activeTab === tab ? colors.primary : colors.textMuted }]}>
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Content Grid */}
        <View style={styles.grid}>
          {(activeTab === 'posts' ? posts : activeTab === 'saved' ? savedPosts : []).map(post => (
            <TouchableOpacity
              key={post.id}
              style={styles.gridItem}
              onPress={() => router.push(`/post/${post.id}`)}
              activeOpacity={0.9}
            >
              <Image source={{ uri: post.images[0] }} style={styles.gridImage} />
              <View style={styles.gridOverlay}>
                <Heart size={12} color="#fff" />
                <Text style={styles.gridLikes}>{formatNumber(post.likesCount)}</Text>
              </View>
            </TouchableOpacity>
          ))}
          {(activeTab === 'posts' ? posts : activeTab === 'saved' ? savedPosts : []).length === 0 && (
            <View style={styles.emptyGrid}>
              <Text style={[styles.emptyText, { color: colors.textMuted }]}>
                {activeTab === 'posts' ? 'No posts yet' : activeTab === 'saved' ? 'No saved posts' : 'No collections'}
              </Text>
            </View>
          )}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 12 },
  username: { fontSize: 20, fontWeight: '800' },
  headerRight: { flexDirection: 'row', gap: 12 },
  iconBtn: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  coverPhoto: { width: '100%', height: 160, backgroundColor: '#f0f0f0' },
  profileInfo: { paddingHorizontal: 20 },
  avatarRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 12 },
  avatarBorder: { width: 88, height: 88, borderRadius: 44, borderWidth: 3, justifyContent: 'center', alignItems: 'center' },
  avatar: { width: 80, height: 80, borderRadius: 40 },
  editBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 16, paddingVertical: 10, borderRadius: 10, borderWidth: 1 },
  editBtnText: { fontSize: 14, fontWeight: '700' },
  nameSection: { marginBottom: 8 },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  displayName: { fontSize: 22, fontWeight: '800' },
  verifiedBadge: { width: 22, height: 22, borderRadius: 11, justifyContent: 'center', alignItems: 'center' },
  role: { fontSize: 14, fontWeight: '600', marginTop: 2 },
  bio: { fontSize: 14, lineHeight: 20, marginBottom: 10 },
  metaRow: { flexDirection: 'row', gap: 16, marginBottom: 12, flexWrap: 'wrap' },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  metaText: { fontSize: 13 },
  skillsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 16 },
  skillChip: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6 },
  skillText: { fontSize: 12, fontWeight: '600' },
  moreSkills: { fontSize: 12, alignSelf: 'center' },
  statsRow: { flexDirection: 'row', borderTopWidth: 0.5, borderBottomWidth: 0.5, paddingVertical: 14, marginBottom: 4 },
  statItem: { flex: 1, alignItems: 'center' },
  statValue: { fontSize: 18, fontWeight: '800' },
  statLabel: { fontSize: 12, marginTop: 2 },
  tabRow: { flexDirection: 'row', borderBottomWidth: 0.5 },
  tab: { flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 6, paddingVertical: 14 },
  tabText: { fontSize: 13, fontWeight: '700' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', padding: 16, gap: 4 },
  gridItem: { width: GRID_SIZE, height: GRID_SIZE, borderRadius: 8, overflow: 'hidden' },
  gridImage: { width: '100%', height: '100%' },
  gridOverlay: { position: 'absolute', bottom: 0, left: 0, right: 0, flexDirection: 'row', alignItems: 'center', gap: 4, padding: 6, backgroundColor: 'rgba(0,0,0,0.3)' },
  gridLikes: { color: '#fff', fontSize: 11, fontWeight: '700' },
  emptyGrid: { width: '100%', paddingVertical: 60, alignItems: 'center' },
  emptyText: { fontSize: 14 },
});
