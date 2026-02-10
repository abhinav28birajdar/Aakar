// ============================================================
// Post Store - Firebase Firestore Feed & Content Management
// ============================================================
import { create } from 'zustand';
import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { Post, Comment, PostCategory } from '../types';
import {
  createPost as fbCreatePost,
  getPost,
  getFeedPosts,
  getUserPosts as fbGetUserPosts,
  deletePost as fbDeletePost,
  likePost as fbLikePost,
  unlikePost as fbUnlikePost,
  savePost as fbSavePost,
  unsavePost as fbUnsavePost,
  searchPosts as fbSearchPosts,
  getComments,
  addComment as fbAddComment,
  likeComment as fbLikeComment,
} from '../services/firestoreService';
import { MOCK_POSTS, MOCK_COMMENTS } from '../data/mockData';

interface PostStore {
  posts: Post[];
  trendingPosts: Post[];
  userPosts: Post[];
  savedPosts: Post[];
  comments: Record<string, Comment[]>;
  selectedCategory: string;
  feedType: 'forYou' | 'following' | 'trending' | 'fresh';
  isLoading: boolean;
  isRefreshing: boolean;
  lastDoc: FirebaseFirestoreTypes.DocumentSnapshot | null;

  // Actions
  loadFeed: (type?: string) => Promise<void>;
  refreshFeed: () => Promise<void>;
  loadMore: () => Promise<void>;
  setCategory: (category: string) => void;
  setFeedType: (type: 'forYou' | 'following' | 'trending' | 'fresh') => void;
  likePost: (postId: string) => void;
  unlikePost: (postId: string) => void;
  savePost: (postId: string) => void;
  unsavePost: (postId: string) => void;
  loadComments: (postId: string) => Promise<void>;
  addComment: (postId: string, text: string) => void;
  likeComment: (commentId: string) => void;
  createPost: (post: Partial<Post>) => Promise<{ success: boolean; error?: string }>;
  deletePost: (postId: string) => void;
  getPostById: (postId: string) => Post | undefined;
  getPostsByUser: (userId: string) => Post[];
  searchPosts: (query: string) => Post[];
}

export const usePostStore = create<PostStore>((set, get) => ({
  posts: [],
  trendingPosts: [],
  userPosts: [],
  savedPosts: [],
  comments: {},
  selectedCategory: 'All',
  feedType: 'forYou',
  isLoading: false,
  isRefreshing: false,
  lastDoc: null,

  loadFeed: async (type) => {
    set({ isLoading: true });
    try {
      const userId = auth().currentUser?.uid;
      if (!userId) {
        // Fallback to mock data when not authenticated
        let posts = [...MOCK_POSTS];
        const category = get().selectedCategory;
        if (category !== 'All') {
          posts = posts.filter(p => p.category === category || p.tags.includes(category));
        }
        set({
          posts,
          trendingPosts: [...MOCK_POSTS].sort((a, b) => b.likesCount - a.likesCount).slice(0, 5),
          savedPosts: MOCK_POSTS.filter(p => p.isSaved),
          isLoading: false,
        });
        return;
      }

      const feedType = (type || get().feedType) as 'forYou' | 'following' | 'trending' | 'fresh';
      const category = get().selectedCategory;

      const result = await getFeedPosts(
        feedType,
        userId,
        category !== 'All' ? category : undefined
      );

      // Also fetch trending posts
      const trendingResult = await getFeedPosts('trending', userId, undefined, undefined, 5);

      set({
        posts: result.posts.length > 0 ? result.posts : MOCK_POSTS,
        trendingPosts: trendingResult.posts.length > 0
          ? trendingResult.posts
          : [...MOCK_POSTS].sort((a, b) => b.likesCount - a.likesCount).slice(0, 5),
        lastDoc: result.lastDoc,
        isLoading: false,
      });
    } catch (error) {
      console.error('Error loading feed:', error);
      // Fallback to mock data on error
      set({
        posts: MOCK_POSTS,
        trendingPosts: [...MOCK_POSTS].sort((a, b) => b.likesCount - a.likesCount).slice(0, 5),
        isLoading: false,
      });
    }
  },

  refreshFeed: async () => {
    set({ isRefreshing: true, lastDoc: null });
    await get().loadFeed();
    set({ isRefreshing: false });
  },

  loadMore: async () => {
    const { lastDoc } = get();
    if (!lastDoc) return;

    const userId = auth().currentUser?.uid;
    if (!userId) return;

    try {
      const result = await getFeedPosts(
        get().feedType,
        userId,
        get().selectedCategory !== 'All' ? get().selectedCategory : undefined,
        lastDoc
      );

      set(state => ({
        posts: [...state.posts, ...result.posts],
        lastDoc: result.lastDoc,
      }));
    } catch (error) {
      console.error('Error loading more posts:', error);
    }
  },

  setCategory: (category) => {
    set({ selectedCategory: category, lastDoc: null });
    get().loadFeed();
  },

  setFeedType: (feedType) => {
    set({ feedType, lastDoc: null });
    get().loadFeed(feedType);
  },

  likePost: async (postId) => {
    const userId = auth().currentUser?.uid;

    // Optimistic update
    set(state => ({
      posts: state.posts.map(p =>
        p.id === postId ? { ...p, isLiked: true, likesCount: p.likesCount + 1 } : p
      ),
    }));

    if (userId) {
      try {
        await fbLikePost(postId, userId);
      } catch (error) {
        // Revert on error
        set(state => ({
          posts: state.posts.map(p =>
            p.id === postId ? { ...p, isLiked: false, likesCount: p.likesCount - 1 } : p
          ),
        }));
      }
    }
  },

  unlikePost: async (postId) => {
    const userId = auth().currentUser?.uid;

    set(state => ({
      posts: state.posts.map(p =>
        p.id === postId ? { ...p, isLiked: false, likesCount: Math.max(0, p.likesCount - 1) } : p
      ),
    }));

    if (userId) {
      try {
        await fbUnlikePost(postId, userId);
      } catch (error) {
        set(state => ({
          posts: state.posts.map(p =>
            p.id === postId ? { ...p, isLiked: true, likesCount: p.likesCount + 1 } : p
          ),
        }));
      }
    }
  },

  savePost: async (postId) => {
    const userId = auth().currentUser?.uid;

    set(state => {
      const updatedPosts = state.posts.map(p =>
        p.id === postId ? { ...p, isSaved: true, savesCount: p.savesCount + 1 } : p
      );
      return {
        posts: updatedPosts,
        savedPosts: [...state.savedPosts, ...updatedPosts.filter(p => p.id === postId)],
      };
    });

    if (userId) {
      try {
        await fbSavePost(postId, userId);
      } catch {}
    }
  },

  unsavePost: async (postId) => {
    const userId = auth().currentUser?.uid;

    set(state => ({
      posts: state.posts.map(p =>
        p.id === postId ? { ...p, isSaved: false, savesCount: Math.max(0, p.savesCount - 1) } : p
      ),
      savedPosts: state.savedPosts.filter(p => p.id !== postId),
    }));

    if (userId) {
      try {
        await fbUnsavePost(postId, userId);
      } catch {}
    }
  },

  loadComments: async (postId) => {
    try {
      const userId = auth().currentUser?.uid;
      const comments = await getComments(postId, userId);

      if (comments.length > 0) {
        set(state => ({ comments: { ...state.comments, [postId]: comments } }));
      } else {
        // Fallback
        const mockComments = MOCK_COMMENTS.filter(c => c.postId === postId);
        set(state => ({ comments: { ...state.comments, [postId]: mockComments } }));
      }
    } catch {
      const mockComments = MOCK_COMMENTS.filter(c => c.postId === postId);
      set(state => ({ comments: { ...state.comments, [postId]: mockComments } }));
    }
  },

  addComment: async (postId, text) => {
    const userId = auth().currentUser?.uid;
    const user = get().posts.find(p => p.userId === userId)?.user;
    const userInfo = user || {
      id: userId || '1',
      displayName: 'You',
      username: 'user',
      avatar: '',
      isVerified: false,
    };

    const newComment: Comment = {
      id: 'c_' + Date.now(),
      postId,
      userId: userId || '1',
      user: userInfo,
      text,
      likesCount: 0,
      isLiked: false,
      createdAt: new Date().toISOString(),
    };

    // Optimistic update
    set(state => ({
      comments: {
        ...state.comments,
        [postId]: [newComment, ...(state.comments[postId] || [])],
      },
      posts: state.posts.map(p =>
        p.id === postId ? { ...p, commentsCount: p.commentsCount + 1 } : p
      ),
    }));

    if (userId) {
      try {
        await fbAddComment(postId, userId, userInfo, text);
      } catch (error) {
        console.error('Error adding comment:', error);
      }
    }
  },

  likeComment: async (commentId) => {
    const userId = auth().currentUser?.uid;

    set(state => {
      const updatedComments: Record<string, Comment[]> = {};
      let postId = '';
      let isCurrentlyLiked = false;

      for (const [pid, comments] of Object.entries(state.comments)) {
        updatedComments[pid] = comments.map(c => {
          if (c.id === commentId) {
            postId = pid;
            isCurrentlyLiked = c.isLiked;
            return { ...c, isLiked: !c.isLiked, likesCount: c.isLiked ? c.likesCount - 1 : c.likesCount + 1 };
          }
          return c;
        });
      }

      if (userId && postId) {
        fbLikeComment(postId, commentId, userId, isCurrentlyLiked).catch(() => {});
      }

      return { comments: updatedComments };
    });
  },

  createPost: async (postData) => {
    try {
      const userId = auth().currentUser?.uid;
      if (!userId) return { success: false, error: 'Not authenticated' };

      const { useAuthStore } = require('./authStore');
      const currentUser = useAuthStore.getState().user;

      const userInfo = {
        id: userId,
        displayName: currentUser?.displayName || 'User',
        username: currentUser?.username || 'user',
        avatar: currentUser?.avatar || '',
        isVerified: currentUser?.isVerified || false,
      };

      const newPostId = await fbCreatePost(
        userId,
        {
          title: postData.title || '',
          description: postData.description || '',
          images: postData.images || [],
          tags: postData.tags || [],
          category: postData.category || 'Other',
          software: postData.software || [],
          visibility: postData.visibility || 'public',
        },
        userInfo
      );

      const newPost: Post = {
        id: newPostId,
        userId,
        user: userInfo,
        title: postData.title || '',
        description: postData.description || '',
        images: postData.images || [],
        tags: postData.tags || [],
        category: postData.category || 'Other',
        software: postData.software || [],
        visibility: postData.visibility || 'public',
        likesCount: 0,
        commentsCount: 0,
        savesCount: 0,
        sharesCount: 0,
        viewsCount: 0,
        isLiked: false,
        isSaved: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      set(state => ({ posts: [newPost, ...state.posts] }));
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message || 'Failed to create post' };
    }
  },

  deletePost: async (postId) => {
    const userId = auth().currentUser?.uid;

    set(state => ({ posts: state.posts.filter(p => p.id !== postId) }));

    if (userId) {
      try {
        await fbDeletePost(postId, userId);
      } catch (error) {
        console.error('Error deleting post:', error);
      }
    }
  },

  getPostById: (postId) => {
    return get().posts.find(p => p.id === postId) || MOCK_POSTS.find(p => p.id === postId);
  },

  getPostsByUser: (userId) => get().posts.filter(p => p.userId === userId),

  searchPosts: (query) => {
    const q = query.toLowerCase();
    // Local search first, then can optionally call fbSearchPosts
    const localResults = get().posts.filter(p =>
      p.title.toLowerCase().includes(q) ||
      p.tags.some(t => t.toLowerCase().includes(q)) ||
      p.user.displayName.toLowerCase().includes(q)
    );
    if (localResults.length > 0) return localResults;

    // Fallback to mock
    return MOCK_POSTS.filter(p =>
      p.title.toLowerCase().includes(q) ||
      p.tags.some(t => t.toLowerCase().includes(q)) ||
      p.user.displayName.toLowerCase().includes(q)
    );
  },
}));
