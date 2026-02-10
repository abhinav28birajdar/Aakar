// ============================================================
// FCM Notification Service - Firebase Cloud Messaging
// ============================================================
import messaging from '@react-native-firebase/messaging';
import notifee, { AndroidImportance, EventType } from '@notifee/react-native';
import firestore from '@react-native-firebase/firestore';
import { AppNotification, NotificationType, PostUser } from '../types';
import { Platform } from 'react-native';

// ============================
// FCM SETUP & PERMISSIONS
// ============================

export const requestNotificationPermission = async (): Promise<boolean> => {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;
  return enabled;
};

export const getFCMToken = async (): Promise<string | null> => {
  try {
    const token = await messaging().getToken();
    return token;
  } catch (error) {
    console.error('Error getting FCM token:', error);
    return null;
  }
};

export const saveFCMToken = async (userId: string): Promise<void> => {
  const token = await getFCMToken();
  if (token) {
    await firestore().collection('users').doc(userId).update({
      fcmTokens: firestore.FieldValue.arrayUnion(token),
    });
  }
};

export const removeFCMToken = async (userId: string): Promise<void> => {
  const token = await getFCMToken();
  if (token) {
    await firestore().collection('users').doc(userId).update({
      fcmTokens: firestore.FieldValue.arrayRemove(token),
    });
  }
};

// ============================
// NOTIFICATION CHANNEL (Android)
// ============================

export const createNotificationChannels = async (): Promise<void> => {
  if (Platform.OS === 'android') {
    await notifee.createChannel({
      id: 'default',
      name: 'Default Notifications',
      importance: AndroidImportance.HIGH,
      vibration: true,
    });

    await notifee.createChannel({
      id: 'messages',
      name: 'Chat Messages',
      importance: AndroidImportance.HIGH,
      vibration: true,
    });

    await notifee.createChannel({
      id: 'social',
      name: 'Social Activity',
      description: 'Likes, comments, follows',
      importance: AndroidImportance.DEFAULT,
    });
  }
};

// ============================
// DISPLAY LOCAL NOTIFICATION
// ============================

export const displayLocalNotification = async (
  title: string,
  body: string,
  data?: Record<string, string>,
  channelId: string = 'default'
): Promise<void> => {
  await notifee.displayNotification({
    title,
    body,
    data,
    android: {
      channelId,
      pressAction: { id: 'default' },
      smallIcon: 'ic_notification',
    },
    ios: {
      sound: 'default',
    },
  });
};

// ============================
// FCM MESSAGE HANDLERS
// ============================

export const setupFCMListeners = (
  onNotificationReceived?: (notification: AppNotification) => void,
  onNotificationPress?: (data: Record<string, any>) => void
) => {
  // Foreground messages
  const unsubscribeForeground = messaging().onMessage(async remoteMessage => {
    console.log('FCM foreground message:', remoteMessage);

    const { notification: fcmNotification, data } = remoteMessage;

    // Display local notification while app is in foreground
    if (fcmNotification) {
      await displayLocalNotification(
        fcmNotification.title || 'Aakar',
        fcmNotification.body || '',
        data as Record<string, string>,
        (data?.channelId as string) || 'default'
      );
    }

    // Parse into AppNotification and pass to callback
    if (onNotificationReceived && data) {
      const appNotification: AppNotification = {
        id: remoteMessage.messageId || 'n_' + Date.now(),
        type: (data.type as NotificationType) || 'system',
        title: fcmNotification?.title || '',
        body: fcmNotification?.body || '',
        userId: data.userId as string || '',
        actorId: data.actorId as string,
        postId: data.postId as string,
        postImage: data.postImage as string,
        chatId: data.chatId as string,
        isRead: false,
        createdAt: new Date().toISOString(),
        data: data as Record<string, any>,
      };
      onNotificationReceived(appNotification);
    }
  });

  // Background/quit message tap handler
  messaging().onNotificationOpenedApp(remoteMessage => {
    console.log('FCM notification opened app:', remoteMessage);
    if (onNotificationPress && remoteMessage.data) {
      onNotificationPress(remoteMessage.data);
    }
  });

  // Notifee foreground event handler
  const unsubscribeNotifee = notifee.onForegroundEvent(({ type, detail }) => {
    if (type === EventType.PRESS && detail.notification?.data && onNotificationPress) {
      onNotificationPress(detail.notification.data);
    }
  });

  return () => {
    unsubscribeForeground();
    unsubscribeNotifee();
  };
};

// Check if app was opened from a quit state via notification
export const getInitialNotification = async (): Promise<Record<string, any> | null> => {
  // Check Firebase messaging
  const remoteMessage = await messaging().getInitialNotification();
  if (remoteMessage?.data) {
    return remoteMessage.data;
  }

  // Check Notifee
  const notifeeEvent = await notifee.getInitialNotification();
  if (notifeeEvent?.notification?.data) {
    return notifeeEvent.notification.data;
  }

  return null;
};

// ============================
// FIRESTORE NOTIFICATION STORAGE
// ============================

export const getNotifications = async (userId: string): Promise<AppNotification[]> => {
  const snapshot = await firestore()
    .collection('notifications')
    .where('userId', '==', userId)
    .orderBy('createdAt', 'desc')
    .limit(50)
    .get();

  return snapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      createdAt: data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
    } as AppNotification;
  });
};

export const markNotificationAsRead = async (notificationId: string): Promise<void> => {
  await firestore().collection('notifications').doc(notificationId).update({
    isRead: true,
  });
};

export const markAllNotificationsAsRead = async (userId: string): Promise<void> => {
  const snapshot = await firestore()
    .collection('notifications')
    .where('userId', '==', userId)
    .where('isRead', '==', false)
    .get();

  const batch = firestore().batch();
  snapshot.docs.forEach(doc => {
    batch.update(doc.ref, { isRead: true });
  });
  await batch.commit();
};

export const deleteNotification = async (notificationId: string): Promise<void> => {
  await firestore().collection('notifications').doc(notificationId).delete();
};

export const clearAllNotifications = async (userId: string): Promise<void> => {
  const snapshot = await firestore()
    .collection('notifications')
    .where('userId', '==', userId)
    .get();

  const batch = firestore().batch();
  snapshot.docs.forEach(doc => {
    batch.delete(doc.ref);
  });
  await batch.commit();
};

// Create a notification in Firestore (usually called from Cloud Functions)
export const createNotification = async (
  notification: Omit<AppNotification, 'id' | 'createdAt'>
): Promise<string> => {
  const docRef = await firestore().collection('notifications').add({
    ...notification,
    createdAt: firestore.FieldValue.serverTimestamp(),
  });
  return docRef.id;
};

// Real-time listener for notifications
export const subscribeToNotifications = (
  userId: string,
  callback: (notifications: AppNotification[]) => void
): (() => void) => {
  return firestore()
    .collection('notifications')
    .where('userId', '==', userId)
    .orderBy('createdAt', 'desc')
    .limit(50)
    .onSnapshot(snapshot => {
      const notifications: AppNotification[] = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
        } as AppNotification;
      });
      callback(notifications);
    });
};
