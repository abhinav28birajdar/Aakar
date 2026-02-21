// ============================================================
// Firebase Chat Service - Real-time messaging with Firestore
// ============================================================
import firestore, { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import { ChatRoom, ChatMessage, ChatParticipant } from '../types';

// ============================
// CHAT ROOM FUNCTIONS
// ============================

export const getChatRooms = async (userId: string): Promise<ChatRoom[]> => {
  const snapshot = await firestore()
    .collection('chatRooms')
    .where('participantIds', 'array-contains', userId)
    .orderBy('updatedAt', 'desc')
    .get();

  // Create a batch of promises for unread counts to avoid N+1 issues
  const unreadPromises = snapshot.docs.map(doc =>
    firestore()
      .collection('chatRooms')
      .doc(doc.id)
      .collection('unreadCounts')
      .doc(userId)
      .get()
  );

  const unreadDocs = await Promise.all(unreadPromises);
  const unreadMap = new Map();
  unreadDocs.forEach((doc, index) => {
    unreadMap.set(snapshot.docs[index].id, doc.exists ? doc.data()?.count || 0 : 0);
  });

  const rooms: ChatRoom[] = snapshot.docs.map((doc, index) => {
    const data = doc.data();
    return {
      id: doc.id,
      participants: data.participants || [],
      lastMessage: data.lastMessage
        ? {
          ...data.lastMessage,
          createdAt: data.lastMessage.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
        }
        : undefined,
      unreadCount: unreadMap.get(doc.id),
      isGroup: data.isGroup || false,
      groupName: data.groupName,
      groupAvatar: data.groupAvatar,
      isMuted: data.mutedBy?.includes(userId) || false,
      isPinned: data.pinnedBy?.includes(userId) || false,
      createdAt: data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
      updatedAt: data.updatedAt?.toDate?.()?.toISOString() || new Date().toISOString(),
    };
  });

  // Sort: pinned first, then by updatedAt
  rooms.sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
  });

  return rooms;
};

export const createChatRoom = async (
  currentUser: ChatParticipant,
  otherParticipants: ChatParticipant[],
  isGroup: boolean = false,
  groupName?: string
): Promise<string> => {
  const participants = [currentUser, ...otherParticipants];
  const participantIds = participants.map(p => p.id);

  // Check if 1-on-1 chat already exists
  if (!isGroup && participantIds.length === 2) {
    const existing = await firestore()
      .collection('chatRooms')
      .where('participantIds', '==', participantIds.sort())
      .where('isGroup', '==', false)
      .limit(1)
      .get();

    if (!existing.empty) {
      return existing.docs[0].id;
    }
  }

  const now = firestore.FieldValue.serverTimestamp();
  const docRef = await firestore().collection('chatRooms').add({
    participants,
    participantIds: participantIds.sort(),
    isGroup,
    groupName: groupName || null,
    groupAvatar: null,
    mutedBy: [],
    pinnedBy: [],
    lastMessage: null,
    createdAt: now,
    updatedAt: now,
  });

  return docRef.id;
};

// ============================
// MESSAGE FUNCTIONS
// ============================

export const getMessages = async (
  chatId: string,
  lastDoc?: FirebaseFirestoreTypes.DocumentSnapshot,
  limit = 50
): Promise<{ messages: ChatMessage[]; lastDoc: FirebaseFirestoreTypes.DocumentSnapshot | null }> => {
  let query = firestore()
    .collection('chatRooms')
    .doc(chatId)
    .collection('messages')
    .orderBy('createdAt', 'desc')
    .limit(limit);

  if (lastDoc) {
    query = query.startAfter(lastDoc);
  }

  const snapshot = await query.get();
  const messages: ChatMessage[] = snapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      chatId,
      ...data,
      createdAt: data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
    } as ChatMessage;
  });

  return {
    messages,
    lastDoc: snapshot.docs[snapshot.docs.length - 1] || null,
  };
};

import { uploadFile } from './storageService';

export const sendMessage = async (
  chatId: string,
  senderId: string,
  text?: string,
  imageUri?: string,
  replyTo?: { id: string; text: string; senderName: string }
): Promise<string> => {
  try {
    let imageUrl: string | undefined;

    if (imageUri && !imageUri.startsWith('http')) {
      const path = `chat/${chatId}/${Date.now()}.jpg`;
      imageUrl = await uploadFile(imageUri, path);
    } else {
      imageUrl = imageUri;
    }

    const now = firestore.FieldValue.serverTimestamp();
    const messageData: any = {
      chatId,
      senderId,
      text: text || null,
      image: imageUrl || null,
      audio: null,
      file: null,
      replyTo: replyTo || null,
      isRead: false,
      isDelivered: true,
      reactions: {},
      createdAt: now,
      isDeleted: false,
    };

    const docRef = await firestore()
      .collection('chatRooms')
      .doc(chatId)
      .collection('messages')
      .add(messageData);

    // Update lastMessage and updatedAt in the chat room atomically
    await firestore().collection('chatRooms').doc(chatId).update({
      lastMessage: {
        id: docRef.id,
        senderId,
        text: text || null,
        image: imageUrl || null,
        isRead: false,
        isDelivered: true,
        reactions: {},
        createdAt: now,
        isDeleted: false,
      },
      updatedAt: now,
    });

    // Increment unread count for other participants
    const roomDoc = await firestore().collection('chatRooms').doc(chatId).get();
    const participantIds: string[] = roomDoc.data()?.participantIds || [];

    // Batch updates for unread counts
    const batch = firestore().batch();
    for (const pid of participantIds) {
      if (pid !== senderId) {
        const unreadRef = firestore()
          .collection('chatRooms')
          .doc(chatId)
          .collection('unreadCounts')
          .doc(pid);
        batch.set(unreadRef, { count: firestore.FieldValue.increment(1) }, { merge: true });
      }
    }
    await batch.commit();

    return docRef.id;
  } catch (error: any) {
    console.error('Send Message Error:', error);
    throw new Error(error.message || 'Failed to send message');
  }
};

export const deleteMessage = async (chatId: string, messageId: string): Promise<void> => {
  await firestore()
    .collection('chatRooms')
    .doc(chatId)
    .collection('messages')
    .doc(messageId)
    .update({
      isDeleted: true,
      text: null,
      image: null,
      audio: null,
      file: null,
    });
};

export const markChatAsRead = async (chatId: string, userId: string): Promise<void> => {
  // Reset unread count
  await firestore()
    .collection('chatRooms')
    .doc(chatId)
    .collection('unreadCounts')
    .doc(userId)
    .set({ count: 0 });

  // Mark messages as read
  const unreadMessages = await firestore()
    .collection('chatRooms')
    .doc(chatId)
    .collection('messages')
    .where('isRead', '==', false)
    .where('senderId', '!=', userId)
    .get();

  const batch = firestore().batch();
  unreadMessages.docs.forEach(doc => {
    batch.update(doc.ref, { isRead: true });
  });
  await batch.commit();
};

export const addReaction = async (
  chatId: string,
  messageId: string,
  userId: string,
  emoji: string
): Promise<void> => {
  const msgRef = firestore()
    .collection('chatRooms')
    .doc(chatId)
    .collection('messages')
    .doc(messageId);

  const doc = await msgRef.get();
  if (!doc.exists) return;

  const reactions = doc.data()?.reactions || {};
  const usersForEmoji: string[] = reactions[emoji] || [];

  if (usersForEmoji.includes(userId)) {
    // Remove reaction
    const updatedUsers = usersForEmoji.filter(id => id !== userId);
    if (updatedUsers.length === 0) {
      delete reactions[emoji];
    } else {
      reactions[emoji] = updatedUsers;
    }
  } else {
    reactions[emoji] = [...usersForEmoji, userId];
  }

  await msgRef.update({ reactions });
};

export const muteChat = async (chatId: string, userId: string): Promise<void> => {
  await firestore().collection('chatRooms').doc(chatId).update({
    mutedBy: firestore.FieldValue.arrayUnion(userId),
  });
};

export const unmuteChat = async (chatId: string, userId: string): Promise<void> => {
  await firestore().collection('chatRooms').doc(chatId).update({
    mutedBy: firestore.FieldValue.arrayRemove(userId),
  });
};

export const pinChat = async (chatId: string, userId: string): Promise<void> => {
  await firestore().collection('chatRooms').doc(chatId).update({
    pinnedBy: firestore.FieldValue.arrayUnion(userId),
  });
};

export const unpinChat = async (chatId: string, userId: string): Promise<void> => {
  await firestore().collection('chatRooms').doc(chatId).update({
    pinnedBy: firestore.FieldValue.arrayRemove(userId),
  });
};

// ============================
// REAL-TIME LISTENERS
// ============================

export const subscribeToChatRooms = (
  userId: string,
  callback: (rooms: ChatRoom[]) => void
): (() => void) => {
  return firestore()
    .collection('chatRooms')
    .where('participantIds', 'array-contains', userId)
    .orderBy('updatedAt', 'desc')
    .onSnapshot(async snapshot => {
      // Use the snapshot data immediately for a fast UI update
      // Then fetch unread counts in the background
      const roomIds = snapshot.docs.map(doc => doc.id);

      // Batch fetch unread counts
      const unreadPromises = roomIds.map(id =>
        firestore()
          .collection('chatRooms')
          .doc(id)
          .collection('unreadCounts')
          .doc(userId)
          .get()
      );

      const unreadDocs = await Promise.all(unreadPromises);
      const unreadMap = new Map();
      unreadDocs.forEach((doc, index) => {
        unreadMap.set(roomIds[index], doc.exists ? doc.data()?.count || 0 : 0);
      });

      const rooms: ChatRoom[] = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          participants: data.participants || [],
          lastMessage: data.lastMessage
            ? {
              ...data.lastMessage,
              createdAt: data.lastMessage.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
            }
            : undefined,
          unreadCount: unreadMap.get(doc.id) || 0,
          isGroup: data.isGroup || false,
          groupName: data.groupName,
          groupAvatar: data.groupAvatar,
          isMuted: data.mutedBy?.includes(userId) || false,
          isPinned: data.pinnedBy?.includes(userId) || false,
          createdAt: data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
          updatedAt: data.updatedAt?.toDate?.()?.toISOString() || new Date().toISOString(),
        };
      });
      callback(rooms);
    }, (error) => {
      console.error("Error subscribing to chat rooms:", error);
    });
};

export const subscribeToMessages = (
  chatId: string,
  callback: (messages: ChatMessage[]) => void
): (() => void) => {
  return firestore()
    .collection('chatRooms')
    .doc(chatId)
    .collection('messages')
    .orderBy('createdAt', 'desc')
    .limit(100)
    .onSnapshot(snapshot => {
      const messages: ChatMessage[] = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          chatId,
          ...data,
          createdAt: data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
        } as ChatMessage;
      });
      callback(messages);
    });
};
