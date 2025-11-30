import { supabase } from '@/lib/supabase';
import { ExtendedUser } from '@/lib/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Session } from '@supabase/supabase-js';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

export interface AuthState {
  // State
  user: ExtendedUser | null;
  session: Session | null;
  loading: boolean;
  initialized: boolean;
  
  // Actions
  setUser: (user: ExtendedUser | null) => void;
  setSession: (session: Session | null) => void;
  setLoading: (loading: boolean) => void;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, metadata?: Record<string, any>) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateProfile: (updates: Partial<ExtendedUser>) => Promise<void>;
  initialize: () => Promise<void>;
  
  // OAuth
  signInWithProvider: (provider: 'google' | 'apple' | 'github') => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    immer((set, get) => ({
      user: null,
      session: null,
      loading: false,
      initialized: false,

      setUser: (user) => set((state) => {
        state.user = user;
      }),

      setSession: (session) => set((state) => {
        state.session = session;
        state.user = session?.user as ExtendedUser ?? null;
      }),

      setLoading: (loading) => set((state) => {
        state.loading = loading;
      }),

      initialize: async () => {
        if (get().initialized) return;
        
        set((state) => {
          state.loading = true;
        });

        try {
          // Get initial session
          const { data: { session }, error } = await supabase.auth.getSession();
          
          if (error) throw error;
          
          set((state) => {
            state.session = session;
            state.user = session?.user as ExtendedUser ?? null;
            state.initialized = true;
            state.loading = false;
          });

          // Listen for auth changes
          supabase.auth.onAuthStateChange(async (event, session) => {
            console.log('Auth state changed:', event);
            
            set((state) => {
              state.session = session;
              state.user = session?.user as ExtendedUser ?? null;
              state.loading = false;
            });

            // Handle specific events
            if (event === 'SIGNED_OUT') {
              // Clear any user-specific data
              console.log('User signed out, clearing data');
            }
          });

        } catch (error) {
          console.error('Auth initialization error:', error);
          set((state) => {
            state.loading = false;
            state.initialized = true;
          });
        }
      },

      signIn: async (email: string, password: string) => {
        set((state) => {
          state.loading = true;
        });

        try {
          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
          });

          if (error) throw error;

          set((state) => {
            state.session = data.session;
            state.user = data.user as ExtendedUser;
            state.loading = false;
          });
        } catch (error) {
          set((state) => {
            state.loading = false;
          });
          throw error;
        }
      },

      signUp: async (email: string, password: string, metadata = {}) => {
        set((state) => {
          state.loading = true;
        });

        try {
          const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
              data: metadata,
            },
          });

          if (error) throw error;

          set((state) => {
            state.loading = false;
          });

          // Note: User will be null until email is confirmed
          if (data.user && !data.session) {
            throw new Error('Please check your email for verification link');
          }
        } catch (error) {
          set((state) => {
            state.loading = false;
          });
          throw error;
        }
      },

      signOut: async () => {
        set((state) => {
          state.loading = true;
        });

        try {
          const { error } = await supabase.auth.signOut();
          if (error) throw error;

          set((state) => {
            state.user = null;
            state.session = null;
            state.loading = false;
          });
        } catch (error) {
          set((state) => {
            state.loading = false;
          });
          throw error;
        }
      },

      resetPassword: async (email: string) => {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: 'aakar://reset-password',
        });

        if (error) throw error;
      },

      updateProfile: async (updates: Partial<ExtendedUser>) => {
        const currentUser = get().user;
        if (!currentUser) throw new Error('No user logged in');

        try {
          const { data, error } = await supabase.auth.updateUser({
            data: updates,
          });

          if (error) throw error;

          set((state) => {
            state.user = { ...state.user, ...updates } as ExtendedUser;
          });
        } catch (error) {
          throw error;
        }
      },

      signInWithProvider: async (provider: 'google' | 'apple' | 'github') => {
        set((state) => {
          state.loading = true;
        });

        try {
          const { data, error } = await supabase.auth.signInWithOAuth({
            provider,
            options: {
              redirectTo: 'aakar://auth/callback',
            },
          });

          if (error) throw error;
          
          // OAuth flow will be handled by the redirect
          set((state) => {
            state.loading = false;
          });
        } catch (error) {
          set((state) => {
            state.loading = false;
          });
          throw error;
        }
      },
    })),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        // Only persist non-sensitive data
        initialized: state.initialized,
      }),
    }
  )
);

// Convenience hooks
export const useAuth = () => {
  const store = useAuthStore();
  
  return {
    // State
    user: store.user,
    session: store.session,
    loading: store.loading,
    initialized: store.initialized,
    isAuthenticated: !!store.user,
    
    // Actions
    signIn: store.signIn,
    signUp: store.signUp,
    signOut: store.signOut,
    resetPassword: store.resetPassword,
    updateProfile: store.updateProfile,
    initialize: store.initialize,
    signInWithProvider: store.signInWithProvider,
  };
};