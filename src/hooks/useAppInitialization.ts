import { useEffect } from 'react';
import { useAuthStore } from '@/context/stores/authStore';
import { useNotificationStore } from '@/context/stores/notificationStore';
import { useChatStore } from '@/context/stores/chatStore';
import { usePostStore } from '@/context/stores/postStore';
import { createNotificationChannels } from '@/services/notificationService';
import { APP_CONFIG } from '@/config';
import { configureGoogleSignIn } from '@/services/socialAuth';

export const useAppInitialization = () => {
    const { initAuthListener, loadPersistedAuth, isAuthenticated } = useAuthStore();
    const { initializeNotifications } = useNotificationStore();

    useEffect(() => {
        // 1. Setup Social Auth
        configureGoogleSignIn(APP_CONFIG.FIREBASE.GOOGLE_WEB_CLIENT_ID);

        // 2. Setup Notifications (Channels, FCM)
        createNotificationChannels();

        // 3. Auth Listener
        loadPersistedAuth();
        const unsubAuth = initAuthListener();

        return () => {
            unsubAuth();
        };
    }, []);

    useEffect(() => {
        if (isAuthenticated) {
            // 3. Global Subscriptions
            const userStore = require('../context/stores/userStore').useUserStore.getState();
            initializeNotifications();
            useNotificationStore.getState().subscribeToRealtime();
            useChatStore.getState().subscribeToRealtime();
            usePostStore.getState().subscribeToRealtime();
            userStore.subscribeToSocialData();
        }

        return () => {
            if (isAuthenticated) {
                const userStore = require('../context/stores/userStore').useUserStore.getState();
                useNotificationStore.getState().unsubscribeAll();
                useChatStore.getState().unsubscribeAll();
                usePostStore.getState().unsubscribeAll();
                userStore.unsubscribeAll();
            }
        };
    }, [isAuthenticated]);
};
