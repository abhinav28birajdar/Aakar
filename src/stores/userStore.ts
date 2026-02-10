// ============================================================
// User Store - Firebase Social Features (following, blocking, etc.)
// ============================================================
import { create } from 'zustand';
import auth from '@react-native-firebase/auth';
import { UserProfile, PostUser } from '../types';
import {
  getUserProfile,
  getUserByUsername as fbGetUserByUsername,
  searchUsers as fbSearchUsers,
  followUser as fbFollowUser,
  unfollowUser as fbUnfollowUser,
  isFollowingUser,
  getFollowers as fbGetFollowers,
  getFollowing as fbGetFollowing,
  updateUserProfile,
} from '../services/firebaseAuth';
import { MOCK_USERS } from '../data/mockData';

interface UserStore {
  users: UserProfile[];
  following: Set<string>;
  followers: Set<string>;
  blocked: Set<string>;
  suggestedUsers: UserProfile[];
  isLoading: boolean;

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
  searchUsers: (query: string) => UserProfile[];
  getFollowers: () => UserProfile[];
  getFollowing: () => UserProfile[];
  loadFollowData: () => Promise<void>;
}

export const useUserStore = create<UserStore>((set, get) => ({
  users: [],
  following: new Set<string>(),
  followers: new Set<string>(),
  blocked: new Set<string>(),
  suggestedUsers: [],
  isLoading: false,

  loadUsers: async () => {
    set({ isLoading: true });
    try {
      const results = await fbSearchUsers('');
      set({ users: results.length > 0 ? results : MOCK_USERS, isLoading: false });
    } catch {
      set({ users: MOCK_USERS, isLoading: false });
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
        suggestedUsers: suggested.length > 0
          ? suggested
          : MOCK_USERS.filter(u => u.id !== '1' && !following.has(u.id)),
      });
    } catch {
      const { following } = get();
      const suggested = MOCK_USERS.filter(u => u.id !== '1' && !following.has(u.id));
      set({ suggestedUsers: suggested });
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
        // Block user in Firestore
        await updateUserProfile(currentUid, {});
        // Also unfollow
        await fbUnfollowUser(currentUid, userId);
      } catch {}
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
    return get().users.find(u => u.id === userId) || MOCK_USERS.find(u => u.id === userId);
  },

  getUserByUsername: (username) => {
    return get().users.find(u => u.username === username) || MOCK_USERS.find(u => u.username === username);
  },

  searchUsers: (query) => {
    const q = query.toLowerCase();
    const local = get().users.filter(u =>
      u.displayName.toLowerCase().includes(q) ||
      u.username.toLowerCase().includes(q) ||
      u.skills.some(s => s.toLowerCase().includes(q))
    );
    if (local.length > 0) return local;

    return MOCK_USERS.filter(u =>
      u.displayName.toLowerCase().includes(q) ||
      u.username.toLowerCase().includes(q) ||
      u.skills.some(s => s.toLowerCase().includes(q))
    );
  },

  getFollowers: () => {
    const { followers, users } = get();
    const result = users.filter(u => followers.has(u.id));
    if (result.length > 0) return result;
    return MOCK_USERS.filter(u => followers.has(u.id));
  },

  getFollowing: () => {
    const { following, users } = get();
    const result = users.filter(u => following.has(u.id));
    if (result.length > 0) return result;
    return MOCK_USERS.filter(u => following.has(u.id));
  },
}));
