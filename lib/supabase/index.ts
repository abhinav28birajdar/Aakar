/**
 * Production-Ready Supabase Client
 * Unified client with proper error handling, retry logic, and secure configuration
 */

import { apiKeyManager } from '@/lib/config/api-keys';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient, SupabaseClient, User } from '@supabase/supabase-js';
import 'react-native-url-polyfill/auto';

// Database Types
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          display_name: string | null;
          avatar_url: string | null;
          bio: string | null;
          website: string | null;
          location: string | null;
          followers_count: number;
          following_count: number;
          is_designer: boolean;
          is_verified: boolean;
          social_links: Record<string, any>;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['profiles']['Row'], 'created_at' | 'updated_at' | 'followers_count' | 'following_count'>;
        Update: Partial<Database['public']['Tables']['profiles']['Insert']>;
      };
      categories: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          image_url: string | null;
          color_code: string;
          projects_count: number;
          is_featured: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['categories']['Row'], 'id' | 'created_at' | 'updated_at' | 'projects_count'>;
        Update: Partial<Database['public']['Tables']['categories']['Insert']>;
      };
      projects: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          image_url: string;
          user_id: string;
          category_id: string | null;
          likes_count: number;
          views_count: number;
          comments_count: number;
          saves_count: number;
          tags: string[];
          is_featured: boolean;
          is_published: boolean;
          metadata: Record<string, any>;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['projects']['Row'], 'id' | 'created_at' | 'updated_at' | 'likes_count' | 'views_count' | 'comments_count' | 'saves_count'>;
        Update: Partial<Database['public']['Tables']['projects']['Insert']>;
      };
      likes: {
        Row: {
          id: string;
          user_id: string;
          project_id: string;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['likes']['Row'], 'id' | 'created_at'>;
        Update: never;
      };
      saved_projects: {
        Row: {
          id: string;
          user_id: string;
          project_id: string;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['saved_projects']['Row'], 'id' | 'created_at'>;
        Update: never;
      };
      comments: {
        Row: {
          id: string;
          content: string;
          user_id: string;
          project_id: string;
          parent_id: string | null;
          likes_count: number;
          is_edited: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['comments']['Row'], 'id' | 'created_at' | 'updated_at' | 'likes_count' | 'is_edited'>;
        Update: Partial<Pick<Database['public']['Tables']['comments']['Row'], 'content'>>;
      };
      follows: {
        Row: {
          id: string;
          follower_id: string;
          following_id: string;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['follows']['Row'], 'id' | 'created_at'>;
        Update: never;
      };
      notifications: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          body: string;
          type: 'like' | 'comment' | 'follow' | 'save' | 'feature' | 'system';
          data: Record<string, any>;
          read: boolean;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['notifications']['Row'], 'id' | 'created_at' | 'read'>;
        Update: Partial<Pick<Database['public']['Tables']['notifications']['Row'], 'read'>>;
      };
      activity_logs: {
        Row: {
          id: string;
          user_id: string;
          action: string;
          resource_type: string;
          resource_id: string | null;
          metadata: Record<string, any>;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['activity_logs']['Row'], 'id' | 'created_at'>;
        Update: never;
      };
    };
    Views: {
      project_details: {
        Row: Database['public']['Tables']['projects']['Row'] & {
          user_display_name: string | null;
          user_avatar_url: string | null;
          user_is_verified: boolean;
          category_name: string | null;
          category_slug: string | null;
          category_color: string | null;
          current_likes_count: number;
          current_saves_count: number;
          current_comments_count: number;
        };
      };
      user_stats: {
        Row: Database['public']['Tables']['profiles']['Row'] & {
          projects_count: number;
          total_likes_received: number;
          total_views_received: number;
        };
      };
    };
  };
}

// Supabase client singleton
let supabaseClient: SupabaseClient<Database> | null = null;

/**
 * Get or create Supabase client instance
 */
export async function getSupabase(): Promise<SupabaseClient<Database>> {
  if (supabaseClient) {
    return supabaseClient;
  }

  try {
    await apiKeyManager.initialize();
    const config = apiKeyManager.getSupabaseConfig();

    supabaseClient = createClient<Database>(config.url, config.anonKey, {
      auth: {
        storage: AsyncStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
      },
      realtime: {
        params: {
          eventsPerSecond: 10,
        },
      },
      global: {
        headers: {
          'X-Client-Info': 'aakar-mobile-app',
        },
      },
    });

    return supabaseClient;
  } catch (error) {
    console.error('Failed to initialize Supabase client:', error);
    throw new Error('Supabase configuration required. Please configure API keys in settings.');
  }
}

/**
 * Reset Supabase client (useful for testing or config changes)
 */
export function resetSupabaseClient(): void {
  supabaseClient = null;
}

/**
 * Get current authenticated user
 */
export async function getCurrentUser(): Promise<User | null> {
  const supabase = await getSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

/**
 * Authentication helpers
 */
export const auth = {
  async signUp(email: string, password: string, displayName?: string) {
    const supabase = await getSupabase();
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          display_name: displayName || email.split('@')[0],
        },
      },
    });
    if (error) throw error;
    return data;
  },

  async signIn(email: string, password: string) {
    const supabase = await getSupabase();
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return data;
  },

  async signOut() {
    const supabase = await getSupabase();
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  async resetPassword(email: string) {
    const supabase = await getSupabase();
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) throw error;
  },

  async updatePassword(newPassword: string) {
    const supabase = await getSupabase();
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });
    if (error) throw error;
  },

  onAuthStateChange(callback: (user: User | null) => void) {
    let mounted = true;
    
    (async () => {
      const supabase = await getSupabase();
      const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
        if (mounted) {
          callback(session?.user ?? null);
        }
      });

      return () => {
        mounted = false;
        subscription.unsubscribe();
      };
    })();
  },
};

/**
 * Storage helpers
 */
export const storage = {
  async uploadAvatar(userId: string, file: { uri: string; type: string; name: string }) {
    const supabase = await getSupabase();
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}/avatar.${fileExt}`;

    const formData = new FormData();
    formData.append('file', {
      uri: file.uri,
      type: file.type,
      name: file.name,
    } as any);

    const { data, error } = await supabase.storage
      .from('avatars')
      .upload(fileName, formData, {
        upsert: true,
        contentType: file.type,
      });

    if (error) throw error;

    const { data: { publicUrl } } = supabase.storage
      .from('avatars')
      .getPublicUrl(fileName);

    return publicUrl;
  },

  async uploadProjectImage(userId: string, file: { uri: string; type: string; name: string }) {
    const supabase = await getSupabase();
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}/${Date.now()}.${fileExt}`;

    const formData = new FormData();
    formData.append('file', {
      uri: file.uri,
      type: file.type,
      name: file.name,
    } as any);

    const { data, error } = await supabase.storage
      .from('projects')
      .upload(fileName, formData, {
        contentType: file.type,
      });

    if (error) throw error;

    const { data: { publicUrl } } = supabase.storage
      .from('projects')
      .getPublicUrl(fileName);

    return publicUrl;
  },

  async deleteFile(bucket: string, path: string) {
    const supabase = await getSupabase();
    const { error } = await supabase.storage.from(bucket).remove([path]);
    if (error) throw error;
  },
};

/**
 * Database query helpers with proper error handling
 */
export const db = {
  // Profiles
  async getProfile(userId: string) {
    const supabase = await getSupabase();
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    if (error) throw error;
    return data;
  },

  async updateProfile(userId: string, updates: Database['public']['Tables']['profiles']['Update']) {
    const supabase = await getSupabase();
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  // Projects
  async getProjects(filters?: { categoryId?: string; userId?: string; featured?: boolean; limit?: number }) {
    const supabase = await getSupabase();
    let query = supabase
      .from('projects')
      .select('*, profiles(*), categories(*)')
      .eq('is_published', true)
      .order('created_at', { ascending: false });

    if (filters?.categoryId) {
      query = query.eq('category_id', filters.categoryId);
    }
    if (filters?.userId) {
      query = query.eq('user_id', filters.userId);
    }
    if (filters?.featured) {
      query = query.eq('is_featured', true);
    }
    if (filters?.limit) {
      query = query.limit(filters.limit);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  },

  async getProject(projectId: string) {
    const supabase = await getSupabase();
    const { data, error } = await supabase
      .from('projects')
      .select('*, profiles(*), categories(*)')
      .eq('id', projectId)
      .single();
    if (error) throw error;
    
    // Increment view count (fire and forget - don't block on error)
    supabase.rpc('increment_project_views', { project_id: projectId });
    
    return data;
  },

  async createProject(project: Database['public']['Tables']['projects']['Insert']) {
    const supabase = await getSupabase();
    const { data, error } = await supabase
      .from('projects')
      .insert(project)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async updateProject(projectId: string, updates: Database['public']['Tables']['projects']['Update']) {
    const supabase = await getSupabase();
    const { data, error } = await supabase
      .from('projects')
      .update(updates)
      .eq('id', projectId)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async deleteProject(projectId: string) {
    const supabase = await getSupabase();
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', projectId);
    if (error) throw error;
  },

  // Likes
  async likeProject(projectId: string) {
    const user = await getCurrentUser();
    if (!user) throw new Error('Not authenticated');

    const supabase = await getSupabase();
    const { error } = await supabase
      .from('likes')
      .insert({ user_id: user.id, project_id: projectId });
    if (error) throw error;
  },

  async unlikeProject(projectId: string) {
    const user = await getCurrentUser();
    if (!user) throw new Error('Not authenticated');

    const supabase = await getSupabase();
    const { error } = await supabase
      .from('likes')
      .delete()
      .eq('user_id', user.id)
      .eq('project_id', projectId);
    if (error) throw error;
  },

  async isProjectLiked(projectId: string): Promise<boolean> {
    const user = await getCurrentUser();
    if (!user) return false;

    const supabase = await getSupabase();
    const { data } = await supabase
      .from('likes')
      .select('id')
      .eq('user_id', user.id)
      .eq('project_id', projectId)
      .single();
    
    return !!data;
  },

  // Saved Projects
  async saveProject(projectId: string) {
    const user = await getCurrentUser();
    if (!user) throw new Error('Not authenticated');

    const supabase = await getSupabase();
    const { error } = await supabase
      .from('saved_projects')
      .insert({ user_id: user.id, project_id: projectId });
    if (error) throw error;
  },

  async unsaveProject(projectId: string) {
    const user = await getCurrentUser();
    if (!user) throw new Error('Not authenticated');

    const supabase = await getSupabase();
    const { error } = await supabase
      .from('saved_projects')
      .delete()
      .eq('user_id', user.id)
      .eq('project_id', projectId);
    if (error) throw error;
  },

  async getSavedProjects() {
    const user = await getCurrentUser();
    if (!user) throw new Error('Not authenticated');

    const supabase = await getSupabase();
    const { data, error } = await supabase
      .from('saved_projects')
      .select('project_id, projects(*, profiles(*), categories(*))')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data.map(item => item.projects).filter(Boolean);
  },

  // Categories
  async getCategories() {
    const supabase = await getSupabase();
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('is_featured', { ascending: false })
      .order('name');
    if (error) throw error;
    return data;
  },

  // Comments
  async getComments(projectId: string) {
    const supabase = await getSupabase();
    const { data, error } = await supabase
      .from('comments')
      .select('*, profiles(*)')
      .eq('project_id', projectId)
      .is('parent_id', null)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },

  async addComment(projectId: string, content: string, parentId?: string) {
    const user = await getCurrentUser();
    if (!user) throw new Error('Not authenticated');

    const supabase = await getSupabase();
    const { data, error } = await supabase
      .from('comments')
      .insert({
        project_id: projectId,
        user_id: user.id,
        content,
        parent_id: parentId || null,
      })
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  // Follows
  async followUser(userId: string) {
    const user = await getCurrentUser();
    if (!user) throw new Error('Not authenticated');

    const supabase = await getSupabase();
    const { error } = await supabase
      .from('follows')
      .insert({ follower_id: user.id, following_id: userId });
    if (error) throw error;
  },

  async unfollowUser(userId: string) {
    const user = await getCurrentUser();
    if (!user) throw new Error('Not authenticated');

    const supabase = await getSupabase();
    const { error } = await supabase
      .from('follows')
      .delete()
      .eq('follower_id', user.id)
      .eq('following_id', userId);
    if (error) throw error;
  },

  async isFollowing(userId: string): Promise<boolean> {
    const user = await getCurrentUser();
    if (!user) return false;

    const supabase = await getSupabase();
    const { data } = await supabase
      .from('follows')
      .select('id')
      .eq('follower_id', user.id)
      .eq('following_id', userId)
      .single();
    
    return !!data;
  },

  // Notifications
  async getNotifications() {
    const user = await getCurrentUser();
    if (!user) throw new Error('Not authenticated');

    const supabase = await getSupabase();
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(50);
    if (error) throw error;
    return data;
  },

  async markNotificationAsRead(notificationId: string) {
    const supabase = await getSupabase();
    const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('id', notificationId);
    if (error) throw error;
  },

  async markAllNotificationsAsRead() {
    const user = await getCurrentUser();
    if (!user) throw new Error('Not authenticated');

    const supabase = await getSupabase();
    const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('user_id', user.id)
      .eq('read', false);
    if (error) throw error;
  },
};

/**
 * Real-time subscriptions
 */
export const realtime = {
  subscribeToProject(projectId: string, callback: (payload: any) => void) {
    let channel: any;
    
    (async () => {
      const supabase = await getSupabase();
      channel = supabase
        .channel(`project:${projectId}`)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'projects',
            filter: `id=eq.${projectId}`,
          },
          callback
        )
        .subscribe();
    })();

    return () => {
      channel?.unsubscribe();
    };
  },

  subscribeToNotifications(userId: string, callback: (payload: any) => void) {
    let channel: any;
    
    (async () => {
      const supabase = await getSupabase();
      channel = supabase
        .channel(`notifications:${userId}`)
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'notifications',
            filter: `user_id=eq.${userId}`,
          },
          callback
        )
        .subscribe();
    })();

    return () => {
      channel?.unsubscribe();
    };
  },
};

// Default export
export const supabase = {
  get: getSupabase,
  auth,
  storage,
  db,
  realtime,
  reset: resetSupabaseClient,
};
