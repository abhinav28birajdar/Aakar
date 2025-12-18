// Unified Supabase Client - Production Ready
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import 'react-native-url-polyfill/auto';
import { apiKeyManager } from '@/lib/config/api-keys';

// Database types interface
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
        Insert: Omit<Database['public']['Tables']['profiles']['Row'], 'created_at' | 'updated_at'>;
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
        Insert: Omit<Database['public']['Tables']['categories']['Row'], 'id' | 'created_at' | 'updated_at'>;
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
        Insert: Omit<Database['public']['Tables']['projects']['Row'], 'id' | 'created_at' | 'updated_at'>;
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
        Insert: Omit<Database['public']['Tables']['comments']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Pick<Database['public']['Tables']['comments']['Row'], 'content' | 'is_edited'>>;
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
        Insert: Omit<Database['public']['Tables']['notifications']['Row'], 'id' | 'created_at'>;
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
  };
}

let supabaseInstance: SupabaseClient<Database> | null = null;

export const createSupabaseClient = async (): Promise<SupabaseClient<Database>> => {
  const config = await apiKeyManager.getConfig();
  
  if (!config?.supabaseUrl || !config?.supabaseAnonKey) {
    throw new Error('Supabase configuration is missing. Please configure API keys.');
  }

  return createClient<Database>(config.supabaseUrl, config.supabaseAnonKey, {
    auth: {
      storage: AsyncStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
    global: {
      headers: { 'X-Client-Info': 'aakar-mobile' },
    },
    realtime: {
      params: {
        eventsPerSecond: 10,
      },
    },
  });
};

export const getSupabase = (): SupabaseClient<Database> => {
  if (!supabaseInstance) {
    throw new Error('Supabase client not initialized. Call createSupabaseClient first.');
  }
  return supabaseInstance;
};

export const initializeSupabase = async (): Promise<void> => {
  if (!supabaseInstance) {
    supabaseInstance = await createSupabaseClient();
  }
};

// Supabase service methods
export const supabaseService = {
  // Projects
  async getProjects(limit = 20, offset = 0) {
    const { data, error } = await getSupabase()
      .from('projects')
      .select(`
        *,
        profiles:user_id (
          id,
          display_name,
          avatar_url,
          is_verified
        ),
        categories:category_id (
          id,
          name,
          slug,
          color_code
        )
      `)
      .eq('is_published', true)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;
    return data;
  },

  async getProjectById(id: string) {
    const { data, error } = await getSupabase()
      .from('projects')
      .select(`
        *,
        profiles:user_id (
          id,
          display_name,
          avatar_url,
          is_verified,
          bio
        ),
        categories:category_id (
          id,
          name,
          slug,
          color_code
        )
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  async createProject(project: Database['public']['Tables']['projects']['Insert']) {
    const { data, error } = await getSupabase()
      .from('projects')
      .insert(project)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateProject(id: string, updates: Database['public']['Tables']['projects']['Update']) {
    const { data, error } = await getSupabase()
      .from('projects')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteProject(id: string) {
    const { error } = await getSupabase()
      .from('projects')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  // Likes
  async likeProject(projectId: string, userId: string) {
    const { error } = await getSupabase()
      .from('likes')
      .insert({ project_id: projectId, user_id: userId });

    if (error) throw error;
  },

  async unlikeProject(projectId: string, userId: string) {
    const { error } = await getSupabase()
      .from('likes')
      .delete()
      .eq('project_id', projectId)
      .eq('user_id', userId);

    if (error) throw error;
  },

  async isProjectLiked(projectId: string, userId: string): Promise<boolean> {
    const { data, error } = await getSupabase()
      .from('likes')
      .select('id')
      .eq('project_id', projectId)
      .eq('user_id', userId)
      .maybeSingle();

    if (error) throw error;
    return !!data;
  },

  // Saved Projects
  async saveProject(projectId: string, userId: string) {
    const { error } = await getSupabase()
      .from('saved_projects')
      .insert({ project_id: projectId, user_id: userId });

    if (error) throw error;
  },

  async unsaveProject(projectId: string, userId: string) {
    const { error } = await getSupabase()
      .from('saved_projects')
      .delete()
      .eq('project_id', projectId)
      .eq('user_id', userId);

    if (error) throw error;
  },

  async isProjectSaved(projectId: string, userId: string): Promise<boolean> {
    const { data, error } = await getSupabase()
      .from('saved_projects')
      .select('id')
      .eq('project_id', projectId)
      .eq('user_id', userId)
      .maybeSingle();

    if (error) throw error;
    return !!data;
  },

  async getSavedProjects(userId: string, limit = 20, offset = 0) {
    const { data, error } = await getSupabase()
      .from('saved_projects')
      .select(`
        created_at,
        projects (
          *,
          profiles:user_id (
            id,
            display_name,
            avatar_url,
            is_verified
          ),
          categories:category_id (
            id,
            name,
            slug,
            color_code
          )
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;
    return data?.map(item => item.projects).filter(Boolean);
  },

  // Categories
  async getCategories() {
    const { data, error } = await getSupabase()
      .from('categories')
      .select('*')
      .order('projects_count', { ascending: false });

    if (error) throw error;
    return data;
  },

  async getCategoryById(id: string) {
    const { data, error } = await getSupabase()
      .from('categories')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  async getProjectsByCategory(categoryId: string, limit = 20, offset = 0) {
    const { data, error } = await getSupabase()
      .from('projects')
      .select(`
        *,
        profiles:user_id (
          id,
          display_name,
          avatar_url,
          is_verified
        )
      `)
      .eq('category_id', categoryId)
      .eq('is_published', true)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;
    return data;
  },

  // Profile
  async getProfile(userId: string) {
    const { data, error } = await getSupabase()
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) throw error;
    return data;
  },

  async updateProfile(userId: string, updates: Database['public']['Tables']['profiles']['Update']) {
    const { data, error } = await getSupabase()
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Follow
  async followUser(followerId: string, followingId: string) {
    const { error } = await getSupabase()
      .from('follows')
      .insert({ follower_id: followerId, following_id: followingId });

    if (error) throw error;
  },

  async unfollowUser(followerId: string, followingId: string) {
    const { error } = await getSupabase()
      .from('follows')
      .delete()
      .eq('follower_id', followerId)
      .eq('following_id', followingId);

    if (error) throw error;
  },

  async isFollowing(followerId: string, followingId: string): Promise<boolean> {
    const { data, error } = await getSupabase()
      .from('follows')
      .select('id')
      .eq('follower_id', followerId)
      .eq('following_id', followingId)
      .maybeSingle();

    if (error) throw error;
    return !!data;
  },

  // Storage
  async uploadImage(bucket: 'avatars' | 'projects' | 'categories', path: string, file: Blob | File) {
    const { data, error } = await getSupabase()
      .storage
      .from(bucket)
      .upload(path, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) throw error;
    
    const { data: { publicUrl } } = getSupabase()
      .storage
      .from(bucket)
      .getPublicUrl(data.path);

    return publicUrl;
  },

  async deleteImage(bucket: 'avatars' | 'projects' | 'categories', path: string) {
    const { error } = await getSupabase()
      .storage
      .from(bucket)
      .remove([path]);

    if (error) throw error;
  },
};

// Export everything
export { supabase: getSupabase } from './supabase';
export const supabase = getSupabase;
