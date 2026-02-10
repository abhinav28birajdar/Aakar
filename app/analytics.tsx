// ============================================================
// Analytics Screen – Creator analytics dashboard
// ============================================================
import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  ArrowLeft, Eye, Heart, Bookmark, Users, TrendingUp, TrendingDown, Clock,
  BarChart3, Award,
} from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../src/hooks/useTheme';
import { usePostStore } from '../src/stores/postStore';
import { useAuthStore } from '../src/stores/authStore';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Mock analytics data
const ANALYTICS = {
  profileViews: { value: 1284, change: 12.5 },
  totalLikes: { value: 8432, change: 8.3 },
  totalSaves: { value: 2156, change: -2.1 },
  totalComments: { value: 967, change: 15.2 },
  followers: { value: 3420, change: 5.8 },
  engagementRate: { value: 4.7, change: 0.3 },
  impressions: { value: 45600, change: 18.9 },
  reach: { value: 32100, change: 11.4 },
  bestPostingTime: 'Tues & Thurs, 10 AM – 2 PM',
  topPosts: [
    { id: '1', title: 'Modern Dashboard UI Kit', likes: 342, views: 2100, saves: 89 },
    { id: '2', title: 'E-commerce App Redesign', likes: 278, views: 1800, saves: 67 },
    { id: '3', title: 'Brand Identity System', likes: 215, views: 1450, saves: 54 },
    { id: '4', title: 'Mobile Banking Concept', likes: 189, views: 1200, saves: 43 },
  ],
  weeklyGrowth: [120, 145, 132, 178, 165, 198, 210],
};

function formatNum(n: number): string {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
  if (n >= 1000) return (n / 1000).toFixed(1) + 'K';
  return n.toString();
}

export default function AnalyticsScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const [period, setPeriod] = useState<'7d' | '30d' | '90d'>('30d');

  const PERIODS = [
    { key: '7d' as const, label: '7 Days' },
    { key: '30d' as const, label: '30 Days' },
    { key: '90d' as const, label: '90 Days' },
  ];

  const StatCard = ({ label, value, change, icon: Icon }: { label: string; value: number | string; change: number; icon: any }) => {
    const isPositive = change >= 0;
    return (
      <View style={[styles.statCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <View style={styles.statCardHeader}>
          <View style={[styles.statIcon, { backgroundColor: colors.primary + '15' }]}>
            <Icon size={18} color={colors.primary} />
          </View>
          <View style={[styles.changeBadge, { backgroundColor: isPositive ? '#22c55e15' : '#ef444415' }]}>
            {isPositive ? <TrendingUp size={12} color="#22c55e" /> : <TrendingDown size={12} color="#ef4444" />}
            <Text style={{ color: isPositive ? '#22c55e' : '#ef4444', fontSize: 11, fontWeight: '700' }}>
              {isPositive ? '+' : ''}{change}%
            </Text>
          </View>
        </View>
        <Text style={[styles.statValue, { color: colors.text }]}>{typeof value === 'number' ? formatNum(value) : value}</Text>
        <Text style={[styles.statLabel, { color: colors.textSecondary }]}>{label}</Text>
      </View>
    );
  };

  // Simple bar chart
  const maxVal = Math.max(...ANALYTICS.weeklyGrowth);
  const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.text }]}>Analytics</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        {/* Period selector */}
        <View style={styles.periodRow}>
          {PERIODS.map(p => (
            <TouchableOpacity
              key={p.key}
              style={[styles.periodBtn, period === p.key && { backgroundColor: colors.primary }]}
              onPress={() => setPeriod(p.key)}
            >
              <Text style={[styles.periodText, { color: period === p.key ? '#fff' : colors.textSecondary }]}>{p.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Overview banner */}
        <LinearGradient colors={['#667eea', '#764ba2']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.overviewBanner}>
          <View>
            <Text style={styles.overviewLabel}>Engagement Rate</Text>
            <Text style={styles.overviewValue}>{ANALYTICS.engagementRate.value}%</Text>
          </View>
          <View style={styles.overviewRight}>
            <BarChart3 size={40} color="rgba(255,255,255,0.4)" />
          </View>
        </LinearGradient>

        {/* Stats grid */}
        <View style={styles.statsGrid}>
          <StatCard label="Profile Views" value={ANALYTICS.profileViews.value} change={ANALYTICS.profileViews.change} icon={Eye} />
          <StatCard label="Total Likes" value={ANALYTICS.totalLikes.value} change={ANALYTICS.totalLikes.change} icon={Heart} />
          <StatCard label="Total Saves" value={ANALYTICS.totalSaves.value} change={ANALYTICS.totalSaves.change} icon={Bookmark} />
          <StatCard label="Comments" value={ANALYTICS.totalComments.value} change={ANALYTICS.totalComments.change} icon={Users} />
          <StatCard label="Impressions" value={ANALYTICS.impressions.value} change={ANALYTICS.impressions.change} icon={Eye} />
          <StatCard label="Reach" value={ANALYTICS.reach.value} change={ANALYTICS.reach.change} icon={TrendingUp} />
        </View>

        {/* Weekly Growth Chart */}
        <View style={[styles.section, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Weekly Follower Growth</Text>
          <View style={styles.chartRow}>
            {ANALYTICS.weeklyGrowth.map((val, i) => (
              <View key={i} style={styles.barContainer}>
                <View style={[styles.bar, { height: (val / maxVal) * 100, backgroundColor: colors.primary }]} />
                <Text style={[styles.barLabel, { color: colors.textSecondary }]}>{DAYS[i]}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Best Posting Time */}
        <View style={[styles.section, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={styles.sectionHeader}>
            <Clock size={18} color={colors.primary} />
            <Text style={[styles.sectionTitle, { color: colors.text, marginBottom: 0 }]}>Best Posting Time</Text>
          </View>
          <Text style={[styles.bestTime, { color: colors.textSecondary }]}>{ANALYTICS.bestPostingTime}</Text>
        </View>

        {/* Top Posts */}
        <View style={[styles.section, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={styles.sectionHeader}>
            <Award size={18} color={colors.primary} />
            <Text style={[styles.sectionTitle, { color: colors.text, marginBottom: 0 }]}>Top Posts</Text>
          </View>
          {ANALYTICS.topPosts.map((post, i) => (
            <View key={post.id} style={[styles.topPostRow, i < ANALYTICS.topPosts.length - 1 && { borderBottomWidth: 0.5, borderBottomColor: colors.border }]}>
              <Text style={[styles.topPostRank, { color: colors.primary }]}>#{i + 1}</Text>
              <View style={{ flex: 1 }}>
                <Text style={[styles.topPostTitle, { color: colors.text }]} numberOfLines={1}>{post.title}</Text>
                <View style={styles.topPostStats}>
                  <Text style={[styles.topPostStat, { color: colors.textSecondary }]}>
                    <Heart size={11} color={colors.textSecondary} /> {post.likes}
                  </Text>
                  <Text style={[styles.topPostStat, { color: colors.textSecondary }]}>
                    <Eye size={11} color={colors.textSecondary} /> {formatNum(post.views)}
                  </Text>
                  <Text style={[styles.topPostStat, { color: colors.textSecondary }]}>
                    <Bookmark size={11} color={colors.textSecondary} /> {post.saves}
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 14 },
  title: { fontSize: 18, fontWeight: '800' },
  body: { paddingHorizontal: 20, paddingBottom: 40 },
  periodRow: { flexDirection: 'row', gap: 8, marginBottom: 20 },
  periodBtn: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20 },
  periodText: { fontSize: 13, fontWeight: '600' },
  overviewBanner: { borderRadius: 16, padding: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  overviewLabel: { color: 'rgba(255,255,255,0.8)', fontSize: 14, fontWeight: '500' },
  overviewValue: { color: '#fff', fontSize: 36, fontWeight: '900', marginTop: 4 },
  overviewRight: { opacity: 0.7 },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 20 },
  statCard: { width: (SCREEN_WIDTH - 52) / 2, borderRadius: 14, padding: 16, borderWidth: 1 },
  statCardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  statIcon: { width: 36, height: 36, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  changeBadge: { flexDirection: 'row', alignItems: 'center', gap: 3, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  statValue: { fontSize: 24, fontWeight: '900' },
  statLabel: { fontSize: 12, fontWeight: '500', marginTop: 4 },
  section: { borderRadius: 16, padding: 20, borderWidth: 1, marginBottom: 16 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 14 },
  sectionTitle: { fontSize: 16, fontWeight: '700', marginBottom: 14 },
  chartRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', height: 120 },
  barContainer: { alignItems: 'center', flex: 1 },
  bar: { width: 24, borderRadius: 6, minHeight: 8 },
  barLabel: { fontSize: 10, fontWeight: '600', marginTop: 6 },
  bestTime: { fontSize: 15, fontWeight: '600', lineHeight: 22 },
  topPostRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12 },
  topPostRank: { fontSize: 18, fontWeight: '900', width: 30 },
  topPostTitle: { fontSize: 14, fontWeight: '600' },
  topPostStats: { flexDirection: 'row', gap: 14, marginTop: 4 },
  topPostStat: { fontSize: 12, fontWeight: '500' },
});
