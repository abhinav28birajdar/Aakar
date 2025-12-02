import { supabase } from '@/lib/supabase';
import { Category, Project, User } from '@/lib/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

interface AppState {
  // Projects
  projects: Project[];
  savedProjects: Project[];
  likedProjects: Project[];
  featuredProjects: Project[];
  
  // Categories
  categories: Category[];
  selectedCategory: string | null;
  
  // Users
  users: User[];
  followingUsers: string[];
  
  // UI State
  searchQuery: string;
  loading: boolean;
  error: string | null;
  refreshing: boolean;
  
  // Filters & Pagination
  currentPage: number;
  hasMoreData: boolean;
  sortBy: 'recent' | 'popular' | 'trending';
  filterBy: string[];
  
  // Actions - Projects
  setProjects: (projects: Project[]) => void;
  addProject: (project: Project) => void;
  updateProject: (id: string, updates: Partial<Project>) => void;
  removeProject: (id: string) => void;
  toggleLike: (projectId: string) => void;
  toggleSave: (projectId: string) => void;
  
  // Actions - Categories
  setCategories: (categories: Category[]) => void;
  setSelectedCategory: (categoryId: string | null) => void;
  
  // Actions - Search & Filters
  setSearchQuery: (query: string) => void;
  setSortBy: (sort: 'recent' | 'popular' | 'trending') => void;
  setFilterBy: (filters: string[]) => void;
  
  // Actions - UI
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setRefreshing: (refreshing: boolean) => void;
  
  // Actions - Data Fetching
  fetchProjects: (page?: number) => Promise<void>;
  fetchCategories: () => Promise<void>;
  searchProjects: (query: string) => Promise<void>;
  
  // Actions - Reset
  resetFilters: () => void;
  clearError: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    immer((set, get) => ({
      // Initial state
      projects: [],
      savedProjects: [],
      likedProjects: [],
      featuredProjects: [],
      categories: [],
      selectedCategory: null,
      users: [],
      followingUsers: [],
      searchQuery: '',
      loading: false,
      error: null,
      refreshing: false,
      currentPage: 1,
      hasMoreData: true,
      sortBy: 'recent',
      filterBy: [],

      // Project actions
      setProjects: (projects) => set((state) => {
        state.projects = projects;
      }),

      addProject: (project) => set((state) => {
        state.projects.unshift(project);
      }),

      updateProject: (id, updates) => set((state) => {
        const index = state.projects.findIndex(p => p.id === id);
        if (index !== -1 && state.projects[index]) {
          Object.assign(state.projects[index]!, updates);
        }
      }),

      removeProject: (id) => set((state) => {
        state.projects = state.projects.filter(p => p.id !== id);
        state.savedProjects = state.savedProjects.filter(p => p.id !== id);
        state.likedProjects = state.likedProjects.filter(p => p.id !== id);
      }),

      toggleLike: (projectId) => set((state) => {
        const project = state.projects.find(p => p.id === projectId);
        if (project) {
          project.isLiked = !project.isLiked;
          project.likes += project.isLiked ? 1 : -1;
          
          if (project.isLiked) {
            state.likedProjects.push(project);
          } else {
            state.likedProjects = state.likedProjects.filter(p => p.id !== projectId);
          }
        }
      }),

      toggleSave: (projectId) => set((state) => {
        const project = state.projects.find(p => p.id === projectId);
        if (project) {
          project.isSaved = !project.isSaved;
          
          if (project.isSaved) {
            state.savedProjects.push(project);
          } else {
            state.savedProjects = state.savedProjects.filter(p => p.id !== projectId);
          }
        }
      }),

      // Category actions
      setCategories: (categories) => set((state) => {
        state.categories = categories;
      }),

      setSelectedCategory: (categoryId) => set((state) => {
        state.selectedCategory = categoryId;
      }),

      // Search & filter actions
      setSearchQuery: (query) => set((state) => {
        state.searchQuery = query;
      }),

      setSortBy: (sort) => set((state) => {
        state.sortBy = sort;
      }),

      setFilterBy: (filters) => set((state) => {
        state.filterBy = filters;
      }),

      // UI actions
      setLoading: (loading) => set((state) => {
        state.loading = loading;
      }),

      setError: (error) => set((state) => {
        state.error = error;
      }),

      setRefreshing: (refreshing) => set((state) => {
        state.refreshing = refreshing;
      }),

      // Data fetching
      fetchProjects: async (page = 1) => {
        try {
          const state = get();
          
          if (page === 1) {
            state.setLoading(true);
          }
          
          // Build query
          let query = supabase()
            .from('projects')
            .select(`
              *,
              user:user_id (
                id,
                display_name,
                avatar_url
              )
            `);

          // Apply category filter
          if (state.selectedCategory) {
            query = query.eq('category_id', state.selectedCategory);
          }

          // Apply search
          if (state.searchQuery) {
            query = query.or(`title.ilike.%${state.searchQuery}%,description.ilike.%${state.searchQuery}%`);
          }

          // Apply sorting
          switch (state.sortBy) {
            case 'popular':
              query = query.order('likes', { ascending: false });
              break;
            case 'trending':
              query = query.order('created_at', { ascending: false }).order('likes', { ascending: false });
              break;
            default:
              query = query.order('created_at', { ascending: false });
          }

          // Pagination
          const limit = 20;
          const offset = (page - 1) * limit;
          query = query.range(offset, offset + limit - 1);

          const { data, error } = await query;

          if (error) throw error;

          set((state) => {
            if (page === 1) {
              state.projects = data || [];
            } else {
              state.projects.push(...(data || []));
            }
            state.currentPage = page;
            state.hasMoreData = (data?.length || 0) === limit;
            state.loading = false;
            state.error = null;
          });

        } catch (error) {
          set((state) => {
            state.error = (error as Error).message;
            state.loading = false;
          });
        }
      },

      fetchCategories: async () => {
        try {
          const { data, error } = await supabase()
            .from('categories')
            .select('*')
            .order('name');

          if (error) throw error;

          set((state) => {
            state.categories = data || [];
          });
        } catch (error) {
          console.error('Error fetching categories:', error);
        }
      },

      searchProjects: async (query) => {
        set((state) => {
          state.searchQuery = query;
          state.currentPage = 1;
        });
        
        await get().fetchProjects(1);
      },

      // Reset actions
      resetFilters: () => set((state) => {
        state.selectedCategory = null;
        state.searchQuery = '';
        state.sortBy = 'recent';
        state.filterBy = [];
        state.currentPage = 1;
      }),

      clearError: () => set((state) => {
        state.error = null;
      }),
    })),
    {
      name: 'app-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        // Persist user preferences and cached data
        savedProjects: state.savedProjects,
        likedProjects: state.likedProjects,
        followingUsers: state.followingUsers,
        sortBy: state.sortBy,
        filterBy: state.filterBy,
      }),
    }
  )
);

// Convenience hooks
export const useProjects = () => {
  const store = useAppStore();
  
  return {
    // State
    projects: store.projects,
    savedProjects: store.savedProjects,
    likedProjects: store.likedProjects,
    featuredProjects: store.featuredProjects,
    loading: store.loading,
    error: store.error,
    refreshing: store.refreshing,
    hasMoreData: store.hasMoreData,
    currentPage: store.currentPage,
    
    // Actions
    fetchProjects: store.fetchProjects,
    toggleLike: store.toggleLike,
    toggleSave: store.toggleSave,
    addProject: store.addProject,
    updateProject: store.updateProject,
    removeProject: store.removeProject,
    setRefreshing: store.setRefreshing,
    clearError: store.clearError,
  };
};

export const useCategories = () => {
  const store = useAppStore();
  
  return {
    // State
    categories: store.categories,
    selectedCategory: store.selectedCategory,
    
    // Actions
    fetchCategories: store.fetchCategories,
    setSelectedCategory: store.setSelectedCategory,
  };
};

export const useSearch = () => {
  const store = useAppStore();
  
  return {
    // State
    searchQuery: store.searchQuery,
    sortBy: store.sortBy,
    filterBy: store.filterBy,
    
    // Actions
    setSearchQuery: store.setSearchQuery,
    setSortBy: store.setSortBy,
    setFilterBy: store.setFilterBy,
    searchProjects: store.searchProjects,
    resetFilters: store.resetFilters,
  };
};