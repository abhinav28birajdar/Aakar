import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

export interface Notification {
  id: string;
  title: string;
  body: string;
  data?: Record<string, any>;
  timestamp: number;
  read: boolean;
  type: 'info' | 'success' | 'warning' | 'error';
}

interface NotificationState {
  // State
  notifications: Notification[];
  unreadCount: number;
  pushToken: string | null;
  permissionsGranted: boolean;
  
  // Actions
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  removeNotification: (id: string) => void;
  clearAll: () => void;
  setPushToken: (token: string | null) => void;
  setPermissions: (granted: boolean) => void;
  requestPermissions: () => Promise<boolean>;
  registerForPushNotifications: () => Promise<string | null>;
}

export const useNotificationStore = create<NotificationState>()(
  persist(
    immer((set, get) => ({
      notifications: [],
      unreadCount: 0,
      pushToken: null,
      permissionsGranted: false,

      addNotification: (notificationData) => {
        const notification: Notification = {
          ...notificationData,
          id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
          timestamp: Date.now(),
          read: false,
        };

        set((state) => {
          state.notifications.unshift(notification);
          state.unreadCount += 1;
          
          // Keep only last 100 notifications
          if (state.notifications.length > 100) {
            state.notifications = state.notifications.slice(0, 100);
          }
        });
      },

      markAsRead: (id) => set((state) => {
        const notification = state.notifications.find(n => n.id === id);
        if (notification && !notification.read) {
          notification.read = true;
          state.unreadCount = Math.max(0, state.unreadCount - 1);
        }
      }),

      markAllAsRead: () => set((state) => {
        state.notifications.forEach(notification => {
          notification.read = true;
        });
        state.unreadCount = 0;
      }),

      removeNotification: (id) => set((state) => {
        const notificationIndex = state.notifications.findIndex(n => n.id === id);
        if (notificationIndex !== -1) {
          const notification = state.notifications[notificationIndex];
          if (notification && !notification.read) {
            state.unreadCount = Math.max(0, state.unreadCount - 1);
          }
          state.notifications.splice(notificationIndex, 1);
        }
      }),

      clearAll: () => set((state) => {
        state.notifications = [];
        state.unreadCount = 0;
      }),

      setPushToken: (token) => set((state) => {
        state.pushToken = token;
      }),

      setPermissions: (granted) => set((state) => {
        state.permissionsGranted = granted;
      }),

      requestPermissions: async () => {
        try {
          const { status: existingStatus } = await Notifications.getPermissionsAsync();
          let finalStatus = existingStatus;
          
          if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
          }
          
          const granted = finalStatus === 'granted';
          
          set((state) => {
            state.permissionsGranted = granted;
          });
          
          return granted;
        } catch (error) {
          console.error('Error requesting notification permissions:', error);
          return false;
        }
      },

      registerForPushNotifications: async () => {
        try {
          if (Platform.OS === 'android') {
            await Notifications.setNotificationChannelAsync('default', {
              name: 'default',
              importance: Notifications.AndroidImportance.MAX,
              vibrationPattern: [0, 250, 250, 250],
              lightColor: '#ee4d2d',
            });
          }

          const permissionsGranted = await get().requestPermissions();
          if (!permissionsGranted) {
            throw new Error('Notification permissions not granted');
          }

          const token = (await Notifications.getExpoPushTokenAsync({
            projectId: 'your-expo-project-id', // Replace with your project ID
          })).data;

          set((state) => {
            state.pushToken = token;
          });

          return token;
        } catch (error) {
          console.error('Error registering for push notifications:', error);
          return null;
        }
      },
    })),
    {
      name: 'notification-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        notifications: state.notifications,
        unreadCount: state.unreadCount,
        permissionsGranted: state.permissionsGranted,
      }),
    }
  )
);

// Convenience hooks
export const useNotifications = () => {
  const store = useNotificationStore();
  
  return {
    // State
    notifications: store.notifications,
    unreadCount: store.unreadCount,
    pushToken: store.pushToken,
    permissionsGranted: store.permissionsGranted,
    
    // Actions
    addNotification: store.addNotification,
    markAsRead: store.markAsRead,
    markAllAsRead: store.markAllAsRead,
    removeNotification: store.removeNotification,
    clearAll: store.clearAll,
    requestPermissions: store.requestPermissions,
    registerForPushNotifications: store.registerForPushNotifications,
    
    // Utilities
    getUnreadNotifications: () => store.notifications.filter(n => !n.read),
    getNotificationsByType: (type: string) => store.notifications.filter(n => n.type === type),
  };
};