// ============================================================
// Notification Store - Firebase FCM + Firestore Notifications
// ============================================================
import { create } from 'zustand';
import auth from '@react-native-firebase/auth';
import { AppNotification, NotificationType } from '../types';
import {
  getNotifications as fbGetNotifications,
  markNotificationAsRead as fbMarkAsRead,
  markAllNotificationsAsRead as fbMarkAllRead,
  deleteNotification as fbDeleteNotification,
  clearAllNotifications as fbClearAll,
  subscribeToNotifications,
  requestNotificationPermission,
  createNotificationChannels,
  setupFCMListeners,
  saveFCMToken,
} from '../services/notificationService';
import { MOCK_NOTIFICATIONS } from '../data/mockData';

interface NotificationStore {
  notifications: AppNotification[];
  unreadCount: number;
  isLoading: boolean;
  filter: NotificationType | 'all';
  unsubscribeNotifications: (() => void) | null;
  unsubscribeFCM: (() => void) | null;

  // Actions
  loadNotifications: () => Promise<void>;
  markAsRead: (notificationId: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (notificationId: string) => void;
  clearAll: () => void;
  setFilter: (filter: NotificationType | 'all') => void;
  getFilteredNotifications: () => AppNotification[];
  addNotification: (notification: AppNotification) => void;
  initializeNotifications: () => Promise<void>;
  subscribeToRealtime: () => void;
  unsubscribeAll: () => void;
}

export const useNotificationStore = create<NotificationStore>((set, get) => ({
  notifications: [],
  unreadCount: 0,
  isLoading: false,
  filter: 'all',
  unsubscribeNotifications: null,
  unsubscribeFCM: null,

  loadNotifications: async () => {
    set({ isLoading: true });
    try {
      const userId = auth().currentUser?.uid;
      if (!userId) {
        // Fallback to mock data
        const notifications = [...MOCK_NOTIFICATIONS].sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        const unreadCount = notifications.filter(n => !n.isRead).length;
        set({ notifications, unreadCount, isLoading: false });
        return;
      }

      const notifications = await fbGetNotifications(userId);

      if (notifications.length > 0) {
        const unreadCount = notifications.filter(n => !n.isRead).length;
        set({ notifications, unreadCount, isLoading: false });
      } else {
        // Fallback to mock data when no notifications exist yet
        const mockNotifications = [...MOCK_NOTIFICATIONS].sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        const unreadCount = mockNotifications.filter(n => !n.isRead).length;
        set({ notifications: mockNotifications, unreadCount, isLoading: false });
      }
    } catch (error) {
      console.error('Error loading notifications:', error);
      const notifications = [...MOCK_NOTIFICATIONS].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      const unreadCount = notifications.filter(n => !n.isRead).length;
      set({ notifications, unreadCount, isLoading: false });
    }
  },

  markAsRead: async (notificationId) => {
    set(state => {
      const notifications = state.notifications.map(n =>
        n.id === notificationId ? { ...n, isRead: true } : n
      );
      return {
        notifications,
        unreadCount: notifications.filter(n => !n.isRead).length,
      };
    });

    try {
      await fbMarkAsRead(notificationId);
    } catch {}
  },

  markAllAsRead: async () => {
    set(state => ({
      notifications: state.notifications.map(n => ({ ...n, isRead: true })),
      unreadCount: 0,
    }));

    const userId = auth().currentUser?.uid;
    if (userId) {
      try {
        await fbMarkAllRead(userId);
      } catch {}
    }
  },

  deleteNotification: async (notificationId) => {
    set(state => {
      const notifications = state.notifications.filter(n => n.id !== notificationId);
      return {
        notifications,
        unreadCount: notifications.filter(n => !n.isRead).length,
      };
    });

    try {
      await fbDeleteNotification(notificationId);
    } catch {}
  },

  clearAll: async () => {
    set({ notifications: [], unreadCount: 0 });

    const userId = auth().currentUser?.uid;
    if (userId) {
      try {
        await fbClearAll(userId);
      } catch {}
    }
  },

  setFilter: (filter) => set({ filter }),

  getFilteredNotifications: () => {
    const { notifications, filter } = get();
    if (filter === 'all') return notifications;
    return notifications.filter(n => n.type === filter);
  },

  addNotification: (notification) => {
    set(state => ({
      notifications: [notification, ...state.notifications],
      unreadCount: state.unreadCount + (notification.isRead ? 0 : 1),
    }));
  },

  initializeNotifications: async () => {
    // Request permission
    const hasPermission = await requestNotificationPermission();
    if (!hasPermission) {
      console.warn('Notification permission not granted');
      return;
    }

    // Create Android notification channels
    await createNotificationChannels();

    // Save FCM token
    const userId = auth().currentUser?.uid;
    if (userId) {
      await saveFCMToken(userId);
    }

    // Setup FCM listeners
    const unsubFCM = setupFCMListeners(
      // On notification received in foreground
      (notification) => {
        get().addNotification(notification);
      },
      // On notification pressed
      (data) => {
        // Handle navigation based on notification data
        console.log('Notification pressed, data:', data);
        // Navigation is handled in the root layout
      }
    );

    set({ unsubscribeFCM: unsubFCM });
  },

  subscribeToRealtime: () => {
    const userId = auth().currentUser?.uid;
    if (!userId) return;

    const unsub = subscribeToNotifications(userId, (notifications) => {
      const unreadCount = notifications.filter(n => !n.isRead).length;
      set({ notifications, unreadCount });
    });

    set({ unsubscribeNotifications: unsub });
  },

  unsubscribeAll: () => {
    const { unsubscribeNotifications, unsubscribeFCM } = get();
    unsubscribeNotifications?.();
    unsubscribeFCM?.();
    set({ unsubscribeNotifications: null, unsubscribeFCM: null });
  },
}));
