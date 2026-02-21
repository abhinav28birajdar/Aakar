// ============================================================
// User Store - Firebase Social Features (following, blocking, etc.)
// ============================================================
import { create } from 'zustand';
import auth from '@react-native-firebase/auth';
import { UserProfile } from '../../types';
import {
  getUserByUsername as fbGetUserByUsername,
  searchUsers as fbSearchUsers,
  followUser as fbFollowUser,
  unfollowUser as fbUnfollowUser,
  getFollowers as fbGetFollowers,
  getFollowing as fbGetFollowing,
  updateUserProfile,
} from '../../services/firebaseAuth';

interface UserStore {
  users: UserProfile[];
  following: Set<string>;
  followers: Set<string>;
  blocked: Set<string>;
  likedPosts: Set<string>;
  savedPosts: Set<string>;
  suggestedUsers: UserProfile[];
  isLoading: boolean;
  unsubscribeSocial: (() => void) | null;

  // Actions
  loadUsers: () => Promise<void>;
  loadSuggested: () => Promise<void>;
  followUser: (userId: string) => void;
  unfollowUser: (userId: string) => void;
  blockUser: (userId: string) => void;
  unblockUser: (userId: string) => void;
  isFollowing: (userId: string) => boolean;
  isBlocked: (userId: string) => boolean;
  getUserById: (userId: string) => UserProfile | undefined;
  getUserByUsername: (username: string) => UserProfile | undefined;
  fetchUserByUsername: (username: string) => Promise<UserProfile | null>;
  searchUsers: (query: string) => Promise<UserProfile[]>;
  getFollowers: () => UserProfile[];
  getFollowing: () => UserProfile[];
  loadFollowData: () => Promise<void>;
  subscribeToSocialData: () => void;
  unsubscribeAll: () => void;
}

export const useUserStore = create<UserStore>((set, get) => ({
  users: [],
  following: new Set<string>(),
  followers: new Set<string>(),
  blocked: new Set<string>(),
  likedPosts: new Set<string>(),
  savedPosts: new Set<string>(),
  suggestedUsers: [],
  isLoading: false,
  unsubscribeSocial: null,

  loadUsers: async () => {
    set({ isLoading: true });
    try {
      const results = await fbSearchUsers('');
      set({ users: results, isLoading: false });
    } catch (error) {
      console.error('Error loading users:', error);
      set({ users: [], isLoading: false });
    }
  },

  loadFollowData: async () => {
    const userId = auth().currentUser?.uid;
    if (!userId) return;

    try {
      const [followersList, followingList] = await Promise.all([
        fbGetFollowers(userId),
        fbGetFollowing(userId),
      ]);

      set({
        following: new Set(followingList.map(u => u.id)),
        followers: new Set(followersList.map(u => u.id)),
      });
    } catch (error) {
      console.error('Error loading follow data:', error);
    }
  },

  loadSuggested: async () => {
    try {
      const { following } = get();
      const userId = auth().currentUser?.uid;
      const allUsers = await fbSearchUsers('');
      const suggested = allUsers.filter(u => u.id !== userId && !following.has(u.id));

      set({
        suggestedUsers: suggested,
      });
    } catch (error) {
      console.error('Error loading suggested users:', error);
      set({ suggestedUsers: [] });
    }
  },

  followUser: async (userId) => {
    const currentUid = auth().currentUser?.uid;

    // Optimistic update
    set(state => {
      const newFollowing = new Set(state.following);
      newFollowing.add(userId);
      return { following: newFollowing };
    });

    if (currentUid) {
      try {
        await fbFollowUser(currentUid, userId);
      } catch (error) {
        // Revert on error
        set(state => {
          const newFollowing = new Set(state.following);
          newFollowing.delete(userId);
          return { following: newFollowing };
        });
      }
    }
  },

  unfollowUser: async (userId) => {
    const currentUid = auth().currentUser?.uid;

    set(state => {
      const newFollowing = new Set(state.following);
      newFollowing.delete(userId);
      return { following: newFollowing };
    });

    if (currentUid) {
      try {
        await fbUnfollowUser(currentUid, userId);
      } catch (error) {
        set(state => {
          const newFollowing = new Set(state.following);
          newFollowing.add(userId);
          return { following: newFollowing };
        });
      }
    }
  },

  blockUser: async (userId) => {
    const currentUid = auth().currentUser?.uid;

    set(state => {
      const newBlocked = new Set(state.blocked);
      newBlocked.add(userId);
      const newFollowing = new Set(state.following);
      newFollowing.delete(userId);
      const newFollowers = new Set(state.followers);
      newFollowers.delete(userId);
      return { blocked: newBlocked, following: newFollowing, followers: newFollowers };
    });

    if (currentUid) {
      try {
        // In a real app, you'd add this to a 'blockedUsers' collection
        await updateUserProfile(currentUid, {
          // Placeholder for real blocking logic
        });
        await fbUnfollowUser(currentUid, userId);
      } catch (error) {
        console.error('Error blocking user:', error);
      }
    }
  },

  unblockUser: (userId) => {
    set(state => {
      const newBlocked = new Set(state.blocked);
      newBlocked.delete(userId);
      return { blocked: newBlocked };
    });
  },

  isFollowing: (userId) => get().following.has(userId),
  isBlocked: (userId) => get().blocked.has(userId),

  getUserById: (userId) => {
    return get().users.find(u => u.id === userId);
  },

  getUserByUsername: (username) => {
    return get().users.find(u => u.username === username);
  },

  fetchUserByUsername: async (username) => {
    try {
      const user = await fbGetUserByUsername(username);
      if (user) {
        set(state => ({
          users: state.users.some(u => u.id === user.id)
            ? state.users.map(u => u.id === user.id ? user : u)
            : [...state.users, user]
        }));
      }
      return user;
    } catch (error) {
      console.error('Error fetching user by username:', error);
      return null;
    }
  },

  searchUsers: async (query) => {
    if (!query.trim()) return [];
    try {
      const results = await fbSearchUsers(query);
      set(state => {
        const newUsers = [...state.users];
        results.forEach(u => {
          if (!newUsers.some(existing => existing.id === u.id)) {
            newUsers.push(u);
          }
        });
        return { users: newUsers };
      });
      return results;
    } catch (error) {
      console.error('Error searching users:', error);
      return [];
    }
  },

  getFollowers: () => {
    const { followers, users } = get();
    return users.filter(u => followers.has(u.id));
  },

  getFollowing: () => {
    const { following, users } = get();
    return users.filter(u => following.has(u.id));
  },

  subscribeToSocialData: () => {
    const userId = auth().currentUser?.uid;
    if (!userId) return;

    // Unsubscribe from previous
    get().unsubscribeSocial?.();

    const firestore = require('@react-native-firebase/firestore').default;

    // Listen to following
    const unsubFollowing = firestore()
      .collection('users')
      .doc(userId)
      .collection('following')
      .onSnapshot((snap: any) => {
        set({ following: new Set(snap.docs.map((d: any) => d.id)) });
      });

    // Listen to likes
    const unsubLikes = firestore()
      .collection('users')
      .doc(userId)
      .collection('likes')
      .onSnapshot((snap: any) => {
        set({ likedPosts: new Set(snap.docs.map((d: any) => d.id)) });
      });

    // Listen to savedPosts
    const unsubSaved = firestore()
      .collection('users')
      .doc(userId)
      .collection('savedPosts')
      .onSnapshot((snap: any) => {
        set({ savedPosts: new Set(snap.docs.map((d: any) => d.id)) });
      });

    const combinedUnsub = () => {
      unsubFollowing();
      unsubLikes();
      unsubSaved();
    };

    set({ unsubscribeSocial: combinedUnsub });
  },

  unsubscribeAll: () => {
    get().unsubscribeSocial?.();
    set({ unsubscribeSocial: null });
  },
}));
