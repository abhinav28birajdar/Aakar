// ============================================================
// Chat List Screen
// ============================================================
import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity, Image, TextInput,
} from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Search, Plus, Pin, BellOff, X } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../src/hooks/useTheme';
import { useChatStore } from '../../src/stores/chatStore';
import { ChatRoom } from '../../src/types';
import { timeAgo, truncateText } from '../../src/utils/helpers';
import { ChatCard } from '../../src/components/molecules';

export default function ChatListScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { chatRooms, loadChatRooms, searchChats } = useChatStore();
  const [query, setQuery] = useState('');

  useEffect(() => { loadChatRooms(); }, []);

  const displayRooms = query.length > 1 ? searchChats(query) : chatRooms;

  const getChatName = (room: ChatRoom) => {
    if (room.isGroup) return room.groupName || 'Group Chat';
    return room.participants[0]?.displayName || 'Unknown';
  };

  const getChatAvatar = (room: ChatRoom) => {
    if (room.isGroup) return room.groupAvatar || room.participants[0]?.avatar;
    return room.participants[0]?.avatar;
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.text }]}>Messages</Text>
        <TouchableOpacity onPress={() => router.push('/chat/create-chat')}>
          <Plus size={24} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <View style={[styles.searchBar, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <Search size={18} color={colors.textMuted} />
        <TextInput
          style={[styles.searchInput, { color: colors.text }]}
          placeholder="Search messages..." placeholderTextColor={colors.textMuted}
          value={query} onChangeText={setQuery}
        />
        {query.length > 0 && (
          <TouchableOpacity onPress={() => setQuery('')}><X size={18} color={colors.textMuted} /></TouchableOpacity>
        )}
      </View>

      <FlatList
        data={displayRooms}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <ChatCard
            name={getChatName(item)}
            avatar={getChatAvatar(item)}
            lastMessage={item.lastMessage?.text || 'No messages yet'}
            time={item.lastMessage ? timeAgo(item.lastMessage.createdAt) : ''}
            unreadCount={item.unreadCount}
            online={!item.isGroup && item.participants[0]?.isOnline}
            onPress={() => router.push({ pathname: '/messages/[id]', params: { id: item.id } })}
          />
        )}
        contentContainerStyle={{ paddingBottom: 40 }}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={[styles.emptyTitle, { color: colors.text }]}>No conversations</Text>
            <Text style={[styles.emptyDesc, { color: colors.textMuted }]}>Start chatting with other creators</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 14 },
  title: { fontSize: 22, fontWeight: '900' },
  searchBar: { flexDirection: 'row', alignItems: 'center', marginHorizontal: 20, borderRadius: 12, paddingHorizontal: 14, height: 44, borderWidth: 1, gap: 8, marginBottom: 8 },
  searchInput: { flex: 1, fontSize: 15, height: '100%' },
  chatRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 14, gap: 14 },
  avatar: { width: 52, height: 52, borderRadius: 26 },
  onlineDot: { position: 'absolute', bottom: 2, right: 2, width: 14, height: 14, borderRadius: 7, backgroundColor: '#4CAF50', borderWidth: 2, borderColor: '#fff' },
  chatTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  chatNameRow: { flexDirection: 'row', alignItems: 'center', gap: 4, flex: 1 },
  chatName: { fontSize: 16, fontWeight: '700' },
  chatTime: { fontSize: 12 },
  chatBottom: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  lastMsg: { flex: 1, fontSize: 14 },
  unreadBadge: { minWidth: 20, height: 20, borderRadius: 10, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 6 },
  unreadCount: { color: '#fff', fontSize: 11, fontWeight: '800' },
  empty: { paddingTop: 80, alignItems: 'center', gap: 8 },
  emptyTitle: { fontSize: 18, fontWeight: '700' },
  emptyDesc: { fontSize: 14 },
});
