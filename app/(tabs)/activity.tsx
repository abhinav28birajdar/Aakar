// ============================================================
// Activity / Notifications Screen
// ============================================================
import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Bell, CheckCheck } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../src/hooks/useTheme';
import { useNotificationStore } from '../../src/context/stores/notificationStore';
import { AppNotification, NotificationType } from '../../src/types';
import { timeAgo } from '../../src/utils/helpers';
import { NotificationCard } from '../../src/components/molecules';
import { ResponsiveContainer } from '../../src/components/atoms';

type FilterLabel = { key: NotificationType | 'all'; label: string };
const FILTERS: FilterLabel[] = [
  { key: 'all', label: 'All' },
  { key: 'like', label: 'Likes' },
  { key: 'comment', label: 'Comments' },
  { key: 'follow', label: 'Follows' },
  { key: 'mention', label: 'Mentions' },
  { key: 'system', label: 'System' },
];

export default function ActivityScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { notifications, loadNotifications, markAllAsRead, filter, setFilter, markAsRead } = useNotificationStore();
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
    if (!item.isRead) markAsRead(item.id);

    if (item.postId) router.push(`/post/${item.postId}`);
    else if (item.chatId) router.push(`/messages/${item.chatId}`);
    else if (item.actorId && item.actor) router.push(`/profile/${item.actor.username}`);
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]} edges={['top']}>
      <ResponsiveContainer>
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>Activity</Text>
          {unreadCount > 0 && (
            <TouchableOpacity onPress={markAllAsRead} style={styles.markAllBtn}>
              <CheckCheck size={18} color={colors.primary} />
              <Text style={[styles.markAllText, { color: colors.primary }]}>Mark all read</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.filterSection}>
          <FlatList
            horizontal
            data={FILTERS}
            keyExtractor={item => item.key}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.filterChip,
                  {
                    backgroundColor: filter === item.key ? colors.primary : colors.surface,
                    borderColor: filter === item.key ? colors.primary : colors.border
                  }
                ]}
                onPress={() => setFilter(item.key)}
              >
                <Text style={[styles.filterText, { color: filter === item.key ? '#fff' : colors.textSecondary }]}>
                  {item.label}
                </Text>
              </TouchableOpacity>
            )}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 16, gap: 8 }}
          />
        </View>

        <FlatList
          data={filteredNotifs}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <NotificationCard
              type={item.type}
              user={item.actor ? { name: item.actor.displayName, avatar: item.actor.avatar } : undefined}
              title={item.title}
              content={item.body}
              timestamp={timeAgo(item.createdAt)}
              postImage={item.postImage}
              isRead={item.isRead}
              onPress={() => handleNotifPress(item)}
            />
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
      </ResponsiveContainer>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 14 },
  title: { fontSize: 28, fontWeight: '900' },
  markAllBtn: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  markAllText: { fontSize: 13, fontWeight: '700' },
  filterSection: { marginBottom: 12 },
  filterChip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, borderWidth: 1 },
  filterText: { fontSize: 13, fontWeight: '700' },
  emptyState: { alignItems: 'center', paddingTop: 80, gap: 12 },
  emptyTitle: { fontSize: 20, fontWeight: '700' },
  emptyDesc: { fontSize: 15 },
});
