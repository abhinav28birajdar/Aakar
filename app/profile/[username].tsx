// ============================================================
// Public Profile Screen - profile/[username].tsx
// ============================================================
import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Image,
  Dimensions, ActivityIndicator,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import {
  ArrowLeft, MoreHorizontal, MapPin, Link as LinkIcon, Award,
  Grid, Heart, MessageCircle, UserPlus, UserMinus, ShieldAlert,
} from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../src/hooks/useTheme';
import { useAuthStore } from '../../src/stores/authStore';
import { useUserStore } from '../../src/stores/userStore';
import { usePostStore } from '../../src/stores/postStore';
import { MOCK_USERS, MOCK_POSTS } from '../../src/data/mockData';
import { formatNumber, screenWidth } from '../../src/utils/helpers';
import { UserProfile, Post } from '../../src/types';

const GRID_SIZE = (screenWidth - 48 - 8) / 3;

export default function PublicProfileScreen() {
  const router = useRouter();
  const { username } = useLocalSearchParams<{ username: string }>();
  const { colors } = useTheme();
  const currentUser = useAuthStore(s => s.user);
  const { isFollowing, followUser, unfollowUser } = useUserStore();

  const profile = MOCK_USERS.find(u => u.username === username);
  const userPosts = MOCK_POSTS.filter(p => p.userId === profile?.id);
  const following = profile ? isFollowing(profile.id) : false;
  const isOwnProfile = currentUser?.username === username;

  if (!profile) {
    return (
      <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
        <View style={styles.notFound}>
          <Text style={[styles.notFoundText, { color: colors.text }]}>User not found</Text>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={[styles.goBack, { color: colors.primary }]}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const handleFollow = () => {
    if (following) unfollowUser(profile.id);
    else followUser(profile.id);
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <ArrowLeft size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.text }]}>@{profile.username}</Text>
          <TouchableOpacity onPress={() => router.push({ pathname: '/report', params: { targetId: profile.id, targetType: 'user' } })}>
            <MoreHorizontal size={24} color={colors.text} />
          </TouchableOpacity>
        </View>

        {/* Cover */}
        {profile.coverPhoto && (
          <Image source={{ uri: profile.coverPhoto }} style={styles.coverPhoto} />
        )}

        {/* Profile Info */}
        <View style={[styles.profileInfo, { marginTop: profile.coverPhoto ? -40 : 0 }]}>
          <View style={[styles.avatarBorder, { borderColor: colors.primary }]}>
            <Image source={{ uri: profile.avatar }} style={styles.avatar} />
            {profile.isOnline && <View style={styles.onlineDot} />}
          </View>

          <View style={styles.nameSection}>
            <View style={styles.nameRow}>
              <Text style={[styles.displayName, { color: colors.text }]}>{profile.displayName}</Text>
              {profile.isVerified && (
                <View style={[styles.verifiedBadge, { backgroundColor: colors.primary }]}>
                  <Award size={12} color="#fff" />
                </View>
              )}
            </View>
            <Text style={[styles.role, { color: colors.primary }]}>{profile.role.charAt(0).toUpperCase() + profile.role.slice(1)}</Text>
          </View>

          {profile.bio ? <Text style={[styles.bio, { color: colors.textSecondary }]}>{profile.bio}</Text> : null}

          <View style={styles.metaRow}>
            {profile.location && (
              <View style={styles.metaItem}>
                <MapPin size={14} color={colors.textMuted} />
                <Text style={[styles.metaText, { color: colors.textMuted }]}>{profile.location}</Text>
              </View>
            )}
            {profile.website && (
              <View style={styles.metaItem}>
                <LinkIcon size={14} color={colors.primary} />
                <Text style={[styles.metaText, { color: colors.primary }]}>{profile.website.replace('https://', '')}</Text>
              </View>
            )}
          </View>

          {/* Skills */}
          {profile.skills.length > 0 && (
            <View style={styles.skillsRow}>
              {profile.skills.map(skill => (
                <View key={skill} style={[styles.skillChip, { backgroundColor: colors.primary + '15' }]}>
                  <Text style={[styles.skillText, { color: colors.primary }]}>{skill}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Stats */}
          <View style={[styles.statsRow, { borderColor: colors.border }]}>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: colors.text }]}>{formatNumber(profile.postsCount)}</Text>
              <Text style={[styles.statLabel, { color: colors.textMuted }]}>Posts</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: colors.text }]}>{formatNumber(profile.followersCount)}</Text>
              <Text style={[styles.statLabel, { color: colors.textMuted }]}>Followers</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: colors.text }]}>{formatNumber(profile.followingCount)}</Text>
              <Text style={[styles.statLabel, { color: colors.textMuted }]}>Following</Text>
            </View>
          </View>

          {/* Action Buttons */}
          {!isOwnProfile && (
            <View style={styles.actionBtns}>
              <TouchableOpacity onPress={handleFollow} style={{ flex: 1 }}>
                <LinearGradient
                  colors={following ? [colors.surface, colors.surface] : ['#667eea', '#764ba2']}
                  style={[styles.followBtn, following && { borderWidth: 1, borderColor: colors.border }]}
                  start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                >
                  {following ? <UserMinus size={18} color={colors.text} /> : <UserPlus size={18} color="#fff" />}
                  <Text style={[styles.followBtnText, { color: following ? colors.text : '#fff' }]}>
                    {following ? 'Following' : 'Follow'}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.msgBtn, { backgroundColor: colors.surface, borderColor: colors.border }]}
                onPress={() => router.push('/chat/chat-list')}
              >
                <MessageCircle size={20} color={colors.text} />
              </TouchableOpacity>
            </View>
          )}

          {/* Mentor-specific info */}
          {profile.role === 'mentor' && profile.mentorSpecialty && (
            <View style={[styles.mentorCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <Text style={[styles.mentorTitle, { color: colors.text }]}>Mentor Info</Text>
              <View style={styles.mentorRow}>
                <Text style={[styles.mentorLabel, { color: colors.textMuted }]}>Specialties:</Text>
                <Text style={[styles.mentorValue, { color: colors.text }]}>{profile.mentorSpecialty.join(', ')}</Text>
              </View>
              {profile.hourlyRate && (
                <View style={styles.mentorRow}>
                  <Text style={[styles.mentorLabel, { color: colors.textMuted }]}>Rate:</Text>
                  <Text style={[styles.mentorValue, { color: colors.text }]}>${profile.hourlyRate}/hr</Text>
                </View>
              )}
              {profile.availability && (
                <View style={styles.mentorRow}>
                  <Text style={[styles.mentorLabel, { color: colors.textMuted }]}>Status:</Text>
                  <View style={[styles.availBadge, { backgroundColor: profile.availability === 'available' ? '#4CAF50' : '#F59E0B' }]}>
                    <Text style={styles.availText}>{profile.availability}</Text>
                  </View>
                </View>
              )}
            </View>
          )}
        </View>

        {/* Posts Grid */}
        <View style={styles.grid}>
          {userPosts.map(post => (
            <TouchableOpacity
              key={post.id}
              style={styles.gridItem}
              onPress={() => router.push(`/post/${post.id}`)}
            >
              <Image source={{ uri: post.images[0] }} style={styles.gridImage} />
            </TouchableOpacity>
          ))}
          {userPosts.length === 0 && (
            <View style={styles.emptyGrid}>
              <Grid size={36} color={colors.textMuted} />
              <Text style={[styles.emptyText, { color: colors.textMuted }]}>No posts yet</Text>
            </View>
          )}
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  notFound: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 12 },
  notFoundText: { fontSize: 18, fontWeight: '700' },
  goBack: { fontSize: 15, fontWeight: '700' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 12 },
  backBtn: { width: 40, height: 40, justifyContent: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '800' },
  coverPhoto: { width: '100%', height: 160 },
  profileInfo: { paddingHorizontal: 20 },
  avatarBorder: { width: 88, height: 88, borderRadius: 44, borderWidth: 3, justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  avatar: { width: 80, height: 80, borderRadius: 40 },
  onlineDot: { position: 'absolute', bottom: 4, right: 4, width: 16, height: 16, borderRadius: 8, backgroundColor: '#4CAF50', borderWidth: 3, borderColor: '#fff' },
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
  statsRow: { flexDirection: 'row', borderTopWidth: 0.5, borderBottomWidth: 0.5, paddingVertical: 14, marginBottom: 16 },
  statItem: { flex: 1, alignItems: 'center' },
  statValue: { fontSize: 18, fontWeight: '800' },
  statLabel: { fontSize: 12, marginTop: 2 },
  actionBtns: { flexDirection: 'row', gap: 10, marginBottom: 16 },
  followBtn: { height: 46, borderRadius: 12, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8 },
  followBtnText: { fontSize: 15, fontWeight: '700' },
  msgBtn: { width: 46, height: 46, borderRadius: 12, justifyContent: 'center', alignItems: 'center', borderWidth: 1 },
  mentorCard: { padding: 16, borderRadius: 14, borderWidth: 1, marginBottom: 16 },
  mentorTitle: { fontSize: 16, fontWeight: '800', marginBottom: 12 },
  mentorRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  mentorLabel: { fontSize: 13 },
  mentorValue: { fontSize: 13, fontWeight: '600' },
  availBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6 },
  availText: { color: '#fff', fontSize: 12, fontWeight: '700', textTransform: 'capitalize' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', padding: 16, gap: 4 },
  gridItem: { width: GRID_SIZE, height: GRID_SIZE, borderRadius: 8, overflow: 'hidden' },
  gridImage: { width: '100%', height: '100%' },
  emptyGrid: { width: '100%', paddingVertical: 60, alignItems: 'center', gap: 8 },
  emptyText: { fontSize: 14 },
});
