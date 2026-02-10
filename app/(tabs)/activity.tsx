// ============================================================
// Activity / Notifications Screen
// ============================================================
import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity, Image,
  RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  Heart, MessageCircle, UserPlus, AtSign, Share2, Bell,
  Award, TrendingUp, Briefcase, Check, CheckCheck,
} from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../src/hooks/useTheme';
import { useNotificationStore } from '../../src/stores/notificationStore';
import { AppNotification, NotificationType } from '../../src/types';
import { timeAgo } from '../../src/utils/helpers';

type FilterLabel = { key: NotificationType | 'all'; label: string };
const FILTERS: FilterLabel[] = [
  { key: 'all', label: 'All' },
  { key: 'like', label: 'Likes' },
  { key: 'comment', label: 'Comments' },
  { key: 'follow', label: 'Follows' },
  { key: 'mention', label: 'Mentions' },
  { key: 'system', label: 'System' },
];

const getNotifIcon = (type: NotificationType) => {
  switch (type) {
    case 'like': return { icon: Heart, color: '#FF6B6B' };
    case 'comment': return { icon: MessageCircle, color: '#4ecdc4' };
    case 'follow': return { icon: UserPlus, color: '#667eea' };
    case 'mention': return { icon: AtSign, color: '#F59E0B' };
    case 'share': return { icon: Share2, color: '#06B6D4' };
    case 'message': return { icon: MessageCircle, color: '#8B5CF6' };
    case 'milestone': return { icon: Award, color: '#F97316' };
    case 'trending': return { icon: TrendingUp, color: '#10B981' };
    case 'gig_inquiry': return { icon: Briefcase, color: '#059669' };
    default: return { icon: Bell, color: '#94A3B8' };
  }
};

function NotificationItem({ item, onPress }: { item: AppNotification; onPress: () => void }) {
  const { colors } = useTheme();
  const { markAsRead } = useNotificationStore();
  const notifMeta = getNotifIcon(item.type);
  const Icon = notifMeta.icon;

  const handlePress = () => {
    if (!item.isRead) markAsRead(item.id);
    onPress();
  };

  return (
    <TouchableOpacity
      style={[styles.notifRow, { backgroundColor: item.isRead ? colors.background : colors.primary + '08' }]}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <View style={[styles.notifIcon, { backgroundColor: notifMeta.color + '20' }]}>
        <Icon size={18} color={notifMeta.color} />
      </View>
      <View style={styles.notifContent}>
        <Text style={[styles.notifTitle, { color: colors.text }]} numberOfLines={2}>{item.title}</Text>
        <Text style={[styles.notifBody, { color: colors.textSecondary }]} numberOfLines={2}>{item.body}</Text>
        <Text style={[styles.notifTime, { color: colors.textMuted }]}>{timeAgo(item.createdAt)}</Text>
      </View>
      {item.postImage && (
        <Image source={{ uri: item.postImage }} style={styles.notifPostImage} />
      )}
      {!item.isRead && <View style={[styles.unreadDot, { backgroundColor: colors.primary }]} />}
    </TouchableOpacity>
  );
}

export default function ActivityScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { notifications, loadNotifications, markAllAsRead, filter, setFilter } = useNotificationStore();
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => { loadNotifications(); }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadNotifications();
    setRefreshing(false);
  };

  const filteredNotifs = filter === 'all' ? notifications :
    notifications.filter(n => {
      if (filter === 'system') return n.type === 'system' || n.type === 'milestone';
      return n.type === filter;
    });

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleNotifPress = (item: AppNotification) => {
    if (item.postId) router.push(`/post/${item.postId}`);
    else if (item.chatId) router.push(`/messages/${item.chatId}`);
    else if (item.actorId) router.push(`/profile/${item.actor?.username || item.actorId}`);
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Activity</Text>
        {unreadCount > 0 && (
          <TouchableOpacity onPress={markAllAsRead} style={styles.markAllBtn}>
            <CheckCheck size={18} color={colors.primary} />
            <Text style={[styles.markAllText, { color: colors.primary }]}>Mark all read</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Filters */}
      <FlatList
        horizontal
        data={FILTERS}
        keyExtractor={item => item.key}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.filterChip, { backgroundColor: filter === item.key ? colors.primary : colors.surface, borderColor: filter === item.key ? colors.primary : colors.border }]}
            onPress={() => setFilter(item.key)}
          >
            <Text style={[styles.filterText, { color: filter === item.key ? '#fff' : colors.textSecondary }]}>{item.label}</Text>
          </TouchableOpacity>
        )}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, gap: 8, marginBottom: 8 }}
        style={{ flexGrow: 0 }}
      />

      {/* Notification List */}
      <FlatList
        data={filteredNotifs}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <NotificationItem item={item} onPress={() => handleNotifPress(item)} />
        )}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Bell size={48} color={colors.textMuted} />
            <Text style={[styles.emptyTitle, { color: colors.text }]}>No notifications</Text>
            <Text style={[styles.emptyDesc, { color: colors.textSecondary }]}>You're all caught up!</Text>
          </View>
        }
        contentContainerStyle={{ paddingBottom: 100 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor={colors.primary} />}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 14 },
  title: { fontSize: 28, fontWeight: '900' },
  markAllBtn: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  markAllText: { fontSize: 13, fontWeight: '700' },
  filterChip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, borderWidth: 1 },
  filterText: { fontSize: 13, fontWeight: '700' },
  notifRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 14, gap: 12 },
  notifIcon: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center' },
  notifContent: { flex: 1 },
  notifTitle: { fontSize: 14, fontWeight: '700', marginBottom: 2 },
  notifBody: { fontSize: 13, lineHeight: 18, marginBottom: 4 },
  notifTime: { fontSize: 11 },
  notifPostImage: { width: 48, height: 48, borderRadius: 8 },
  unreadDot: { width: 8, height: 8, borderRadius: 4 },
  emptyState: { alignItems: 'center', paddingTop: 80, gap: 12 },
  emptyTitle: { fontSize: 20, fontWeight: '700' },
  emptyDesc: { fontSize: 15 },
});
