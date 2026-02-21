// ============================================================
// Auth Store - Firebase Authentication State Management
// ============================================================
import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import auth from '@react-native-firebase/auth';
import { UserProfile, UserRole } from '../../types';
import {
  firebaseSignIn,
  firebaseSignUp,
  firebaseSignOut,
  firebaseSendPasswordReset,
  firebaseConfirmPasswordReset,
  firebaseReloadUser,
  firebaseResendVerification,
  getUserProfile,
  updateUserProfile,
  setUserOnlineStatus,
  reauthenticate,
  firebaseUpdatePassword,
  deleteUserAccount,
  signInWithPhoneNumber,
  verifyOtp as fbVerifyOtp,
} from '../../services/firebaseAuth';
import {
  saveFCMToken,
  removeFCMToken,
} from '../../services/notificationService';
import {
  uploadUserAvatar,
  uploadUserCover,
} from '../../services/storageService';
import {
  signInWithGoogle,
  signInWithApple,
  signOutFromGoogle,
  configureGoogleSignIn,
} from '../../services/socialAuth';

interface AuthStore {
  user: UserProfile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  hasCompletedOnboarding: boolean;
  emailForVerification: string | null;

  // Actions
  setUser: (user: UserProfile | null) => void;
  setLoading: (loading: boolean) => void;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string; needsVerification?: boolean }>;
  signInWithGoogle: () => Promise<{ success: boolean; error?: string; isNewUser?: boolean }>;
  signInWithApple: () => Promise<{ success: boolean; error?: string; isNewUser?: boolean }>;
  signUp: (email: string, password: string, name: string, username: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  verifyEmail: (code: string) => Promise<{ success: boolean; error?: string }>;
  resendVerification: () => Promise<{ success: boolean; error?: string }>;
  forgotPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
  resetPassword: (code: string, newPassword: string) => Promise<{ success: boolean; error?: string }>;
  signInWithPhone: (phoneNumber: string) => Promise<{ success: boolean; error?: string; confirmation?: any }>;
  verifyOtp: (confirmation: any, code: string) => Promise<{ success: boolean; error?: string }>;
  updateProfile: (data: Partial<UserProfile>) => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<{ success: boolean; error?: string }>;
  setRole: (role: UserRole) => void;
  completeOnboarding: () => Promise<void>;
  loadPersistedAuth: () => Promise<void>;
  deleteAccount: () => Promise<{ success: boolean; error?: string }>;
  initAuthListener: () => () => void;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  isLoading: true,
  isAuthenticated: false,
  hasCompletedOnboarding: false,
  emailForVerification: null,

  setUser: (user) => set({ user, isAuthenticated: !!user }),
  setLoading: (isLoading) => set({ isLoading }),

  signIn: async (email, password) => {
    set({ isLoading: true });
    try {
      if (!email || !password) {
        set({ isLoading: false });
        return { success: false, error: 'Please fill in all fields' };
      }

      const { user: firebaseUser, profile } = await firebaseSignIn(email, password);

      // Check email verification
      if (!firebaseUser.emailVerified) {
        set({ isLoading: false, emailForVerification: email });
        return { success: false, needsVerification: true, error: 'Please verify your email first' };
      }

      // Save FCM token for push notifications
      await saveFCMToken(firebaseUser.uid);

      // Set online status
      await setUserOnlineStatus(firebaseUser.uid, true);

      // Cache user data
      await AsyncStorage.setItem('auth_user', JSON.stringify(profile));
      await AsyncStorage.setItem('auth_token', firebaseUser.uid);

      // Use profile data for onboarding status, fallback to cache
      const onboarded = profile.hasCompletedOnboarding || (await AsyncStorage.getItem('onboarding_complete')) === 'true';
      if (profile.hasCompletedOnboarding) {
        await AsyncStorage.setItem('onboarding_complete', 'true');
      }

      set({
        user: profile,
        isAuthenticated: true,
        isLoading: false,
        hasCompletedOnboarding: onboarded,
      });
      return { success: true };
    } catch (error: any) {
      set({ isLoading: false });
      let errorMessage = 'Sign in failed';
      switch (error.code) {
        case 'auth/user-not-found':
          errorMessage = 'No account found with this email';
          break;
        case 'auth/wrong-password':
          errorMessage = 'Invalid password';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Invalid email address';
          break;
        case 'auth/too-many-requests':
          errorMessage = 'Too many attempts. Please try again later';
          break;
        case 'auth/invalid-credential':
          errorMessage = 'Invalid email or password';
          break;
        default:
          errorMessage = error.message || 'Sign in failed';
      }
      return { success: false, error: errorMessage };
    }
  },

  signInWithGoogle: async () => {
    set({ isLoading: true });
    try {
      const { user: firebaseUser, profile, isNewUser } = await signInWithGoogle();

      // Save FCM token for push notifications
      await saveFCMToken(firebaseUser.uid);

      // Set online status
      await setUserOnlineStatus(firebaseUser.uid, true);

      // Cache user data
      await AsyncStorage.setItem('auth_user', JSON.stringify(profile));
      await AsyncStorage.setItem('auth_token', firebaseUser.uid);

      // New users need to complete onboarding
      const onboarded = isNewUser ? false : await AsyncStorage.getItem('onboarding_complete') === 'true';

      set({
        user: profile,
        isAuthenticated: true,
        isLoading: false,
        hasCompletedOnboarding: onboarded,
      });

      return { success: true, isNewUser };
    } catch (error: any) {
      set({ isLoading: false });
      return { success: false, error: error.message || 'Google sign-in failed' };
    }
  },

  signInWithApple: async () => {
    set({ isLoading: true });
    try {
      const { user: firebaseUser, profile, isNewUser } = await signInWithApple();

      // Save FCM token for push notifications
      await saveFCMToken(firebaseUser.uid);

      // Set online status
      await setUserOnlineStatus(firebaseUser.uid, true);

      // Cache user data
      await AsyncStorage.setItem('auth_user', JSON.stringify(profile));
      await AsyncStorage.setItem('auth_token', firebaseUser.uid);

      // New users need to complete onboarding
      const onboarded = isNewUser ? false : await AsyncStorage.getItem('onboarding_complete') === 'true';

      set({
        user: profile,
        isAuthenticated: true,
        isLoading: false,
        hasCompletedOnboarding: onboarded,
      });

      return { success: true, isNewUser };
    } catch (error: any) {
      set({ isLoading: false });
      return { success: false, error: error.message || 'Apple sign-in failed' };
    }
  },

  signInWithPhone: async (phoneNumber) => {
    set({ isLoading: true });
    try {
      const confirmation = await signInWithPhoneNumber(phoneNumber);
      set({ isLoading: false });
      return { success: true, confirmation };
    } catch (error: any) {
      set({ isLoading: false });
      return { success: false, error: error.message || 'Failed to send OTP' };
    }
  },

  verifyOtp: async (confirmation, code) => {
    set({ isLoading: true });
    try {
      const { user: firebaseUser, profile } = await fbVerifyOtp(confirmation, code);

      await saveFCMToken(firebaseUser.uid);
      await setUserOnlineStatus(firebaseUser.uid, true);

      await AsyncStorage.setItem('auth_user', JSON.stringify(profile));
      await AsyncStorage.setItem('auth_token', firebaseUser.uid);

      const onboarded = await AsyncStorage.getItem('onboarding_complete') === 'true';

      set({
        user: profile,
        isAuthenticated: true,
        isLoading: false,
        hasCompletedOnboarding: onboarded,
      });

      return { success: true };
    } catch (error: any) {
      set({ isLoading: false });
      return { success: false, error: error.message || 'OTP verification failed' };
    }
  },

  signUp: async (email, password, name, username) => {
    set({ isLoading: true });
    try {
      if (!email || !password || !name || !username) {
        set({ isLoading: false });
        return { success: false, error: 'Please fill in all fields' };
      }
      if (password.length < 8) {
        set({ isLoading: false });
        return { success: false, error: 'Password must be at least 8 characters' };
      }
      if (username.length < 3) {
        set({ isLoading: false });
        return { success: false, error: 'Username must be at least 3 characters' };
      }

      await firebaseSignUp(email, password, name, username);

      set({ emailForVerification: email, isLoading: false });
      return { success: true };
    } catch (error: any) {
      set({ isLoading: false });
      let errorMessage = 'Sign up failed';
      switch (error.code) {
        case 'auth/email-already-in-use':
          errorMessage = 'An account with this email already exists';
          break;
        case 'auth/weak-password':
          errorMessage = 'Password is too weak';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Invalid email address';
          break;
        default:
          errorMessage = error.message || 'Sign up failed';
      }
      return { success: false, error: errorMessage };
    }
  },

  verifyEmail: async (_code) => {
    set({ isLoading: true });
    try {
      // Firebase uses email link verification.
      // Reload user to check verification status.
      const isVerified = await firebaseReloadUser();

      if (!isVerified) {
        set({ isLoading: false });
        return { success: false, error: 'Email not yet verified. Please check your inbox and click the verification link.' };
      }

      const firebaseUser = auth().currentUser;
      if (!firebaseUser) {
        set({ isLoading: false });
        return { success: false, error: 'User session expired. Please sign in again.' };
      }

      const profile = await getUserProfile(firebaseUser.uid);
      await saveFCMToken(firebaseUser.uid);

      await AsyncStorage.setItem('auth_user', JSON.stringify(profile));
      await AsyncStorage.setItem('auth_token', firebaseUser.uid);

      set({
        user: profile,
        isAuthenticated: true,
        isLoading: false,
        hasCompletedOnboarding: false,
      });
      return { success: true };
    } catch (error: any) {
      set({ isLoading: false });
      return { success: false, error: error.message || 'Verification failed' };
    }
  },

  resendVerification: async () => {
    try {
      await firebaseResendVerification();
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message || 'Failed to resend verification email' };
    }
  },

  forgotPassword: async (email) => {
    set({ isLoading: true });
    try {
      if (!email) {
        set({ isLoading: false });
        return { success: false, error: 'Please enter your email' };
      }
      await firebaseSendPasswordReset(email);
      set({ isLoading: false, emailForVerification: email });
      return { success: true };
    } catch (error: any) {
      set({ isLoading: false });
      let errorMessage = 'Failed to send reset email';
      if (error.code === 'auth/user-not-found') {
        errorMessage = 'No account found with this email';
      }
      return { success: false, error: errorMessage };
    }
  },

  resetPassword: async (code, newPassword) => {
    set({ isLoading: true });
    try {
      if (newPassword.length < 8) {
        set({ isLoading: false });
        return { success: false, error: 'Password must be at least 8 characters' };
      }
      await firebaseConfirmPasswordReset(code, newPassword);
      set({ isLoading: false });
      return { success: true };
    } catch (error: any) {
      set({ isLoading: false });
      return { success: false, error: error.message || 'Password reset failed' };
    }
  },

  updateProfile: async (data) => {
    const current = get().user;
    if (!current) throw new Error('Not authenticated');

    set({ isLoading: true });
    try {
      let finalData = { ...data };

      // Handle avatar upload if it's a local URI
      if (data.avatar && data.avatar.startsWith('file://')) {
        const avatarUrl = await uploadUserAvatar(current.id, data.avatar);
        finalData.avatar = avatarUrl;
      }

      // Handle cover upload if it's a local URI
      if (data.coverPhoto && data.coverPhoto.startsWith('file://')) {
        const coverUrl = await uploadUserCover(current.id, data.coverPhoto);
        finalData.coverPhoto = coverUrl;
      }

      await updateUserProfile(current.id, finalData);

      const updated = { ...current, ...finalData, updatedAt: new Date().toISOString() };
      await AsyncStorage.setItem('auth_user', JSON.stringify(updated));
      set({ user: updated, isLoading: false });
    } catch (error: any) {
      set({ isLoading: false });
      throw error;
    }
  },

  changePassword: async (currentPassword, newPassword) => {
    set({ isLoading: true });
    try {
      await reauthenticate(currentPassword);
      await firebaseUpdatePassword(newPassword);
      set({ isLoading: false });
      return { success: true };
    } catch (error: any) {
      set({ isLoading: false });
      let errorMessage = 'Password update failed';
      if (error.code === 'auth/wrong-password') {
        errorMessage = 'Current password is incorrect';
      }
      return { success: false, error: errorMessage };
    }
  },

  setRole: (role) => {
    const current = get().user;
    if (!current) return;
    set({ user: { ...current, role } });
  },

  signOut: async () => {
    set({ isLoading: true });
    try {
      const currentUser = get().user;
      if (currentUser) {
        await removeFCMToken(currentUser.id);
        await setUserOnlineStatus(currentUser.id, false);
      }

      try {
        await signOutFromGoogle();
      } catch (e) {
        console.warn('Google SignOut Error:', e);
      }

      await firebaseSignOut();
      await AsyncStorage.multiRemove(['auth_user', 'auth_token', 'onboarding_complete']);
    } catch (error) {
      console.error('SignOut Error:', error);
    } finally {
      set({
        user: null,
        isAuthenticated: false,
        hasCompletedOnboarding: false,
        emailForVerification: null,
        isLoading: false
      });
    }
  },

  completeOnboarding: async () => {
    set({ isLoading: true });
    try {
      const current = get().user;
      if (current) {
        await updateUserProfile(current.id, {
          displayName: current.displayName,
          username: current.username,
          bio: current.bio,
          role: current.role,
          skills: current.skills,
          interests: current.interests,
          software: current.software,
          updatedAt: new Date().toISOString()
        });
        await AsyncStorage.setItem('auth_user', JSON.stringify(current));
      }
      await AsyncStorage.setItem('onboarding_complete', 'true');
      set({ hasCompletedOnboarding: true, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  loadPersistedAuth: async () => {
    set({ isLoading: true });
    try {
      const firebaseUser = auth().currentUser;
      if (firebaseUser) {
        await firebaseUser.getIdToken(true);
        if (firebaseUser.emailVerified) {
          try {
            const profile = await getUserProfile(firebaseUser.uid);
            const onboarded = await AsyncStorage.getItem('onboarding_complete');
            await AsyncStorage.setItem('auth_user', JSON.stringify(profile));
            await AsyncStorage.setItem('auth_token', firebaseUser.uid);

            set({
              user: profile,
              isAuthenticated: true,
              isLoading: false,
              hasCompletedOnboarding: onboarded === 'true',
            });
            return;
          } catch (e) {
            console.error('Failed to fetch user profile during persistence check:', e);
          }
        }
      }

      const userJson = await AsyncStorage.getItem('auth_user');
      const token = await AsyncStorage.getItem('auth_token');
      const onboarded = await AsyncStorage.getItem('onboarding_complete');

      if (userJson && token) {
        const user = JSON.parse(userJson) as UserProfile;
        set({
          user,
          isAuthenticated: true,
          isLoading: false,
          hasCompletedOnboarding: onboarded === 'true',
        });
      } else {
        set({ isLoading: false, isAuthenticated: false });
      }
    } catch (error) {
      console.error('Persistence Load Error:', error);
      set({ isLoading: false, isAuthenticated: false });
    }
  },

  deleteAccount: async () => {
    set({ isLoading: true });
    try {
      await deleteUserAccount();
      await AsyncStorage.multiRemove(['auth_user', 'auth_token', 'onboarding_complete']);
      set({
        user: null,
        isAuthenticated: false,
        hasCompletedOnboarding: false,
        isLoading: false
      });
      return { success: true };
    } catch (error: any) {
      set({ isLoading: false });
      return { success: false, error: error.message || 'Failed to delete account' };
    }
  },

  initAuthListener: () => {
    return auth().onAuthStateChanged(async (firebaseUser) => {
      if (!firebaseUser) {
        set({ user: null, isAuthenticated: false, isLoading: false });
        return;
      }

      if (firebaseUser.emailVerified) {
        try {
          const profile = await getUserProfile(firebaseUser.uid);
          const onboarded = await AsyncStorage.getItem('onboarding_complete');
          await AsyncStorage.setItem('auth_user', JSON.stringify(profile));
          await AsyncStorage.setItem('auth_token', firebaseUser.uid);

          set({
            user: profile,
            isAuthenticated: true,
            hasCompletedOnboarding: onboarded === 'true',
            isLoading: false
          });
        } catch (error) {
          console.error('Auth Listener Profile Fetch Error:', error);
          set({ isLoading: false });
        }
      } else {
        set({ isLoading: false, isAuthenticated: false });
      }
    });
  },
}));
