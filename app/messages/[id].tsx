// ============================================================
// Chat Room / Messages Screen - messages/[id].tsx
// ============================================================
import React, { useEffect, useState, useRef } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity, Image,
  TextInput, KeyboardAvoidingView, Platform,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import {
  ArrowLeft, Send, ImageIcon, Smile, MoreVertical, Phone, Video,
} from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../src/hooks/useTheme';
import { useChatStore } from '../../src/stores/chatStore';
import { useAuthStore } from '../../src/stores/authStore';
import { ChatMessage } from '../../src/types';
import { timeAgo, formatTime } from '../../src/utils/helpers';

function MessageBubble({ msg, isOwn, colors }: { msg: ChatMessage; isOwn: boolean; colors: any }) {
  if (msg.isDeleted) {
    return (
      <View style={[styles.bubble, isOwn ? styles.ownBubble : styles.otherBubble, { backgroundColor: colors.surface }]}>
        <Text style={[styles.deletedText, { color: colors.textMuted }]}>Message deleted</Text>
      </View>
    );
  }

  return (
    <View style={[styles.msgRow, isOwn && styles.ownRow]}>
      <View style={[
        styles.bubble,
        isOwn ? [styles.ownBubble, { backgroundColor: '#667eea' }] : [styles.otherBubble, { backgroundColor: colors.surface }],
      ]}>
        {msg.replyTo && (
          <View style={[styles.replyBar, { borderLeftColor: isOwn ? 'rgba(255,255,255,0.5)' : colors.primary }]}>
            <Text style={[styles.replyName, { color: isOwn ? 'rgba(255,255,255,0.7)' : colors.primary }]}>{msg.replyTo.senderName}</Text>
            <Text style={[styles.replyText, { color: isOwn ? 'rgba(255,255,255,0.6)' : colors.textMuted }]} numberOfLines={1}>{msg.replyTo.text}</Text>
          </View>
        )}
        {msg.image && (
          <Image source={{ uri: msg.image }} style={styles.msgImage} resizeMode="cover" />
        )}
        {msg.text && (
          <Text style={[styles.msgText, { color: isOwn ? '#fff' : colors.text }]}>{msg.text}</Text>
        )}
        <View style={styles.msgMeta}>
          <Text style={[styles.msgTime, { color: isOwn ? 'rgba(255,255,255,0.6)' : colors.textMuted }]}>
            {formatTime(msg.createdAt)}
          </Text>
          {isOwn && (
            <Text style={{ color: msg.isRead ? '#4CAF50' : 'rgba(255,255,255,0.5)', fontSize: 10 }}>
              {msg.isRead ? '✓✓' : '✓'}
            </Text>
          )}
        </View>

        {/* Reactions */}
        {Object.keys(msg.reactions).length > 0 && (
          <View style={styles.reactionsRow}>
            {Object.entries(msg.reactions).map(([emoji, users]) => (
              <View key={emoji} style={[styles.reactionChip, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                <Text style={{ fontSize: 12 }}>{emoji}</Text>
                <Text style={[{ fontSize: 10, color: colors.textMuted }]}>{users.length}</Text>
              </View>
            ))}
          </View>
        )}
      </View>
    </View>
  );
}

export default function ChatRoomScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { colors } = useTheme();
  const currentUser = useAuthStore(s => s.user);
  const { chatRooms, messages, loadMessages, sendMessage, markAsRead } = useChatStore();
  const [inputText, setInputText] = useState('');
  const flatListRef = useRef<FlatList>(null);

  const room = chatRooms.find(r => r.id === id);
  const chatMessages = messages[id || ''] || [];

  useEffect(() => {
    if (id) {
      loadMessages(id);
      markAsRead(id);
    }
  }, [id]);

  const handleSend = () => {
    if (!inputText.trim() || !id) return;
    sendMessage(id, inputText.trim());
    setInputText('');
  };

  const chatName = room?.isGroup ? (room.groupName || 'Group') : (room?.participants[0]?.displayName || 'Chat');
  const chatAvatar = room?.isGroup ? room.groupAvatar : room?.participants[0]?.avatar;
  const isOnline = !room?.isGroup && room?.participants[0]?.isOnline;

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]} edges={['top']}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        {/* Header */}
        <View style={[styles.header, { borderBottomColor: colors.border }]}>
          <TouchableOpacity onPress={() => router.back()}>
            <ArrowLeft size={24} color={colors.text} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerInfo} onPress={() => {
            if (!room?.isGroup && room?.participants[0]) {
              router.push(`/profile/${room.participants[0].username}`);
            }
          }}>
            <Image source={{ uri: chatAvatar }} style={styles.headerAvatar} />
            <View>
              <Text style={[styles.headerName, { color: colors.text }]}>{chatName}</Text>
              <Text style={[styles.headerStatus, { color: isOnline ? '#4CAF50' : colors.textMuted }]}>
                {isOnline ? 'Online' : room?.isGroup ? `${room.participants.length} members` : 'Offline'}
              </Text>
            </View>
          </TouchableOpacity>
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.headerBtn}>
              <Phone size={20} color={colors.text} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerBtn}>
              <Video size={20} color={colors.text} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Messages */}
        <FlatList
          ref={flatListRef}
          data={chatMessages}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <MessageBubble
              msg={item}
              isOwn={item.senderId === (currentUser?.id || '1')}
              colors={colors}
            />
          )}
          contentContainerStyle={styles.messagesList}
          inverted={false}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: false })}
        />

        {/* Input */}
        <View style={[styles.inputRow, { backgroundColor: colors.card, borderTopColor: colors.border }]}>
          <TouchableOpacity style={styles.inputIcon}>
            <ImageIcon size={22} color={colors.textMuted} />
          </TouchableOpacity>
          <TextInput
            style={[styles.textInput, { color: colors.text, backgroundColor: colors.surface }]}
            placeholder="Type a message..."
            placeholderTextColor={colors.textMuted}
            value={inputText}
            onChangeText={setInputText}
            multiline
          />
          <TouchableOpacity onPress={handleSend} disabled={!inputText.trim()}
            style={[styles.sendBtn, { backgroundColor: inputText.trim() ? '#667eea' : colors.surface }]}
          >
            <Send size={18} color={inputText.trim() ? '#fff' : colors.textMuted} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 10, borderBottomWidth: 0.5, gap: 10 },
  headerInfo: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 10 },
  headerAvatar: { width: 40, height: 40, borderRadius: 20 },
  headerName: { fontSize: 16, fontWeight: '700' },
  headerStatus: { fontSize: 12 },
  headerActions: { flexDirection: 'row', gap: 8 },
  headerBtn: { width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center' },
  messagesList: { paddingHorizontal: 16, paddingVertical: 12 },
  msgRow: { marginBottom: 8 },
  ownRow: { alignItems: 'flex-end' },
  bubble: { maxWidth: '80%', paddingHorizontal: 14, paddingVertical: 10, borderRadius: 18 },
  ownBubble: { borderBottomRightRadius: 4, alignSelf: 'flex-end' },
  otherBubble: { borderBottomLeftRadius: 4, alignSelf: 'flex-start' },
  replyBar: { borderLeftWidth: 3, paddingLeft: 8, marginBottom: 6 },
  replyName: { fontSize: 11, fontWeight: '700' },
  replyText: { fontSize: 12 },
  msgImage: { width: 200, height: 150, borderRadius: 12, marginBottom: 6 },
  msgText: { fontSize: 15, lineHeight: 21 },
  msgMeta: { flexDirection: 'row', justifyContent: 'flex-end', gap: 4, marginTop: 4 },
  msgTime: { fontSize: 10 },
  deletedText: { fontSize: 13, fontStyle: 'italic' },
  reactionsRow: { flexDirection: 'row', gap: 4, marginTop: 6 },
  reactionChip: { flexDirection: 'row', alignItems: 'center', gap: 2, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 10, borderWidth: 1 },
  inputRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 8, gap: 8, borderTopWidth: 0.5 },
  inputIcon: { padding: 4 },
  textInput: { flex: 1, borderRadius: 20, paddingHorizontal: 16, paddingVertical: 10, fontSize: 15, maxHeight: 100 },
  sendBtn: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
});
