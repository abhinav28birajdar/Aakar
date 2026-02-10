// ============================================================
// Chat Store - Firebase Firestore Real-time Messaging
// ============================================================
import { create } from 'zustand';
import auth from '@react-native-firebase/auth';
import { ChatRoom, ChatMessage, ChatParticipant } from '../types';
import {
  getChatRooms as fbGetChatRooms,
  createChatRoom,
  getMessages,
  sendMessage as fbSendMessage,
  deleteMessage as fbDeleteMessage,
  markChatAsRead as fbMarkAsRead,
  addReaction as fbAddReaction,
  muteChat as fbMuteChat,
  unmuteChat as fbUnmuteChat,
  pinChat as fbPinChat,
  unpinChat as fbUnpinChat,
  subscribeToChatRooms,
  subscribeToMessages,
} from '../services/chatService';
import { MOCK_CHAT_ROOMS, MOCK_MESSAGES, MOCK_USERS } from '../data/mockData';

interface ChatStore {
  chatRooms: ChatRoom[];
  activeChat: ChatRoom | null;
  messages: Record<string, ChatMessage[]>;
  isLoading: boolean;
  isTyping: Record<string, boolean>;
  totalUnread: number;
  unsubscribeRooms: (() => void) | null;
  unsubscribeMessages: (() => void) | null;

  // Actions
  loadChatRooms: () => Promise<void>;
  loadMessages: (chatId: string) => Promise<void>;
  sendMessage: (chatId: string, text: string, image?: string) => void;
  deleteMessage: (chatId: string, messageId: string) => void;
  markAsRead: (chatId: string) => void;
  setActiveChat: (chatId: string | null) => void;
  muteChat: (chatId: string) => void;
  unmuteChat: (chatId: string) => void;
  pinChat: (chatId: string) => void;
  unpinChat: (chatId: string) => void;
  createChat: (participantIds: string[]) => Promise<string>;
  searchChats: (query: string) => ChatRoom[];
  addReaction: (chatId: string, messageId: string, emoji: string) => void;
  subscribeToRealtime: () => void;
  unsubscribeAll: () => void;
}

export const useChatStore = create<ChatStore>((set, get) => ({
  chatRooms: [],
  activeChat: null,
  messages: {},
  isLoading: false,
  isTyping: {},
  totalUnread: 0,
  unsubscribeRooms: null,
  unsubscribeMessages: null,

  loadChatRooms: async () => {
    set({ isLoading: true });
    try {
      const userId = auth().currentUser?.uid;
      if (!userId) {
        // Fallback to mock data
        const rooms = [...MOCK_CHAT_ROOMS].sort((a, b) => {
          if (a.isPinned && !b.isPinned) return -1;
          if (!a.isPinned && b.isPinned) return 1;
          return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
        });
        const totalUnread = rooms.reduce((sum, r) => sum + r.unreadCount, 0);
        set({ chatRooms: rooms, isLoading: false, totalUnread });
        return;
      }

      const rooms = await fbGetChatRooms(userId);
      const totalUnread = rooms.reduce((sum, r) => sum + r.unreadCount, 0);

      set({
        chatRooms: rooms.length > 0 ? rooms : MOCK_CHAT_ROOMS,
        isLoading: false,
        totalUnread,
      });
    } catch (error) {
      console.error('Error loading chat rooms:', error);
      set({ chatRooms: MOCK_CHAT_ROOMS, isLoading: false });
    }
  },

  loadMessages: async (chatId) => {
    set({ isLoading: true });
    try {
      const result = await getMessages(chatId);
      set(state => ({
        messages: { ...state.messages, [chatId]: result.messages },
        isLoading: false,
      }));
    } catch {
      const msgs = MOCK_MESSAGES.filter(m => m.chatId === chatId)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      set(state => ({
        messages: { ...state.messages, [chatId]: msgs },
        isLoading: false,
      }));
    }
  },

  sendMessage: async (chatId, text, image) => {
    const userId = auth().currentUser?.uid;
    if (!userId) return;

    // Optimistic update
    const newMsg: ChatMessage = {
      id: 'msg_' + Date.now(),
      chatId,
      senderId: userId,
      text: text || undefined,
      image,
      isRead: false,
      isDelivered: true,
      reactions: {},
      createdAt: new Date().toISOString(),
      isDeleted: false,
    };

    set(state => {
      const chatMessages = [newMsg, ...(state.messages[chatId] || [])];
      const chatRooms = state.chatRooms.map(room =>
        room.id === chatId
          ? { ...room, lastMessage: newMsg, updatedAt: newMsg.createdAt }
          : room
      );
      return { messages: { ...state.messages, [chatId]: chatMessages }, chatRooms };
    });

    try {
      await fbSendMessage(chatId, userId, text || undefined, image);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  },

  deleteMessage: async (chatId, messageId) => {
    set(state => ({
      messages: {
        ...state.messages,
        [chatId]: (state.messages[chatId] || []).map(m =>
          m.id === messageId ? { ...m, isDeleted: true, text: undefined, image: undefined } : m
        ),
      },
    }));

    try {
      await fbDeleteMessage(chatId, messageId);
    } catch {}
  },

  markAsRead: async (chatId) => {
    const userId = auth().currentUser?.uid;

    set(state => ({
      chatRooms: state.chatRooms.map(r =>
        r.id === chatId ? { ...r, unreadCount: 0 } : r
      ),
      totalUnread: state.chatRooms.reduce((sum, r) =>
        sum + (r.id === chatId ? 0 : r.unreadCount), 0
      ),
    }));

    if (userId) {
      try {
        await fbMarkAsRead(chatId, userId);
      } catch {}
    }
  },

  setActiveChat: (chatId) => {
    if (!chatId) {
      set({ activeChat: null });
      return;
    }
    const room = get().chatRooms.find(r => r.id === chatId);
    set({ activeChat: room || null });
    if (room) get().markAsRead(chatId);
  },

  muteChat: async (chatId) => {
    const userId = auth().currentUser?.uid;
    set(state => ({
      chatRooms: state.chatRooms.map(r =>
        r.id === chatId ? { ...r, isMuted: true } : r
      ),
    }));
    if (userId) {
      try { await fbMuteChat(chatId, userId); } catch {}
    }
  },

  unmuteChat: async (chatId) => {
    const userId = auth().currentUser?.uid;
    set(state => ({
      chatRooms: state.chatRooms.map(r =>
        r.id === chatId ? { ...r, isMuted: false } : r
      ),
    }));
    if (userId) {
      try { await fbUnmuteChat(chatId, userId); } catch {}
    }
  },

  pinChat: async (chatId) => {
    const userId = auth().currentUser?.uid;
    set(state => ({
      chatRooms: state.chatRooms.map(r =>
        r.id === chatId ? { ...r, isPinned: true } : r
      ),
    }));
    if (userId) {
      try { await fbPinChat(chatId, userId); } catch {}
    }
  },

  unpinChat: async (chatId) => {
    const userId = auth().currentUser?.uid;
    set(state => ({
      chatRooms: state.chatRooms.map(r =>
        r.id === chatId ? { ...r, isPinned: false } : r
      ),
    }));
    if (userId) {
      try { await fbUnpinChat(chatId, userId); } catch {}
    }
  },

  createChat: async (participantIds) => {
    const userId = auth().currentUser?.uid;
    if (!userId) {
      // Fallback mock
      const newRoom: ChatRoom = {
        id: 'chat_' + Date.now(),
        participants: participantIds.map(id => ({
          id, displayName: 'User', username: 'user', avatar: '', isOnline: false,
        })),
        unreadCount: 0,
        isGroup: participantIds.length > 1,
        isMuted: false,
        isPinned: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      set(state => ({ chatRooms: [newRoom, ...state.chatRooms] }));
      return newRoom.id;
    }

    const { useAuthStore } = require('./authStore');
    const currentUser = useAuthStore.getState().user;

    const currentParticipant: ChatParticipant = {
      id: userId,
      displayName: currentUser?.displayName || 'User',
      username: currentUser?.username || 'user',
      avatar: currentUser?.avatar || '',
      isOnline: true,
    };

    // Get participant profiles from user store
    const { useUserStore } = require('./userStore');
    const otherParticipants: ChatParticipant[] = participantIds.map(id => {
      const u = useUserStore.getState().getUserById(id);
      return {
        id,
        displayName: u?.displayName || 'User',
        username: u?.username || 'user',
        avatar: u?.avatar || '',
        isOnline: u?.isOnline || false,
      };
    });

    try {
      const chatId = await createChatRoom(
        currentParticipant,
        otherParticipants,
        participantIds.length > 1
      );
      await get().loadChatRooms();
      return chatId;
    } catch (error: any) {
      console.error('Error creating chat:', error);
      return 'error';
    }
  },

  searchChats: (query) => {
    const q = query.toLowerCase();
    return get().chatRooms.filter(room => {
      const names = room.participants.map(p => p.displayName.toLowerCase()).join(' ');
      const groupName = room.groupName?.toLowerCase() || '';
      const lastMsg = room.lastMessage?.text?.toLowerCase() || '';
      return names.includes(q) || groupName.includes(q) || lastMsg.includes(q);
    });
  },

  addReaction: async (chatId, messageId, emoji) => {
    const userId = auth().currentUser?.uid || '1';

    // Optimistic update
    set(state => ({
      messages: {
        ...state.messages,
        [chatId]: (state.messages[chatId] || []).map(m => {
          if (m.id !== messageId) return m;
          const reactions = { ...m.reactions };
          if (reactions[emoji]?.includes(userId)) {
            reactions[emoji] = reactions[emoji].filter(id => id !== userId);
            if (reactions[emoji].length === 0) delete reactions[emoji];
          } else {
            reactions[emoji] = [...(reactions[emoji] || []), userId];
          }
          return { ...m, reactions };
        }),
      },
    }));

    try {
      await fbAddReaction(chatId, messageId, userId, emoji);
    } catch {}
  },

  subscribeToRealtime: () => {
    const userId = auth().currentUser?.uid;
    if (!userId) return;

    // Subscribe to chat rooms
    const unsubRooms = subscribeToChatRooms(userId, (rooms) => {
      const totalUnread = rooms.reduce((sum, r) => sum + r.unreadCount, 0);
      set({ chatRooms: rooms, totalUnread });
    });

    set({ unsubscribeRooms: unsubRooms });
  },

  unsubscribeAll: () => {
    const { unsubscribeRooms, unsubscribeMessages } = get();
    unsubscribeRooms?.();
    unsubscribeMessages?.();
    set({ unsubscribeRooms: null, unsubscribeMessages: null });
  },
}));
