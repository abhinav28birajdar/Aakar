import { apiKeyManager } from '@/lib/config/api-keys';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import 'react-native-url-polyfill/auto';

// Database types (generated from your Supabase schema)
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
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          display_name?: string | null;
          avatar_url?: string | null;
          bio?: string | null;
          website?: string | null;
          location?: string | null;
          followers_count?: number;
          following_count?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          display_name?: string | null;
          avatar_url?: string | null;
          bio?: string | null;
          website?: string | null;
          location?: string | null;
          followers_count?: number;
          following_count?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      categories: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          image_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          description?: string | null;
          image_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          description?: string | null;
          image_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      projects: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          image_url: string;
          user_id: string;
          category_id: string;
          likes_count: number;
          views_count: number;
          tags: string[] | null;
          is_featured: boolean;
          is_published: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description?: string | null;
          image_url: string;
          user_id: string;
          category_id: string;
          likes_count?: number;
          views_count?: number;
          tags?: string[] | null;
          is_featured?: boolean;
          is_published?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string | null;
          image_url?: string;
          user_id?: string;
          category_id?: string;
          likes_count?: number;
          views_count?: number;
          tags?: string[] | null;
          is_featured?: boolean;
          is_published?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      likes: {
        Row: {
          id: string;
          user_id: string;
          project_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          project_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          project_id?: string;
          created_at?: string;
        };
      };
      saved_projects: {
        Row: {
          id: string;
          user_id: string;
          project_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          project_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          project_id?: string;
          created_at?: string;
        };
      };
      follows: {
        Row: {
          id: string;
          follower_id: string;
          following_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          follower_id: string;
          following_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          follower_id?: string;
          following_id?: string;
          created_at?: string;
        };
      };
      notifications: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          body: string;
          type: string;
          data: any | null;
          read: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          body: string;
          type: string;
          data?: any | null;
          read?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          body?: string;
          type?: string;
          data?: any | null;
          read?: boolean;
          created_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}

let supabaseClient: SupabaseClient<Database> | null = null;

export const createSupabaseClient = (): SupabaseClient<Database> => {
  if (supabaseClient) return supabaseClient;

  try {
    const { url, anonKey } = apiKeyManager.getSupabaseConfig();
    
    supabaseClient = createClient<Database>(url, anonKey, {
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
    });

    return supabaseClient;
  } catch (error) {
    throw new Error('Supabase configuration not found. Please configure your API keys.');
  }
};

// Getter function that ensures client is always available
export const getSupabase = (): SupabaseClient<Database> => {
  if (!supabaseClient) {
    return createSupabaseClient();
  }
  return supabaseClient;
};

// For backward compatibility
export const supabase = getSupabase();

// Storage helpers
export class SupabaseStorage {
  private client: SupabaseClient<Database>;

  constructor() {
    this.client = getSupabase();
  }

  async uploadFile(
    bucket: string,
    path: string,
    file: File | Blob | Uint8Array,
    options?: {
      cacheControl?: string;
      contentType?: string;
      upsert?: boolean;
    }
  ) {
    const { data, error } = await this.client.storage
      .from(bucket)
      .upload(path, file, options);

    if (error) throw error;
    return data;
  }

  async uploadAvatar(userId: string, file: File | Blob | Uint8Array) {
    const fileExt = file instanceof File ? file.name.split('.').pop() : 'jpg';
    const fileName = `${userId}-${Date.now()}.${fileExt}`;
    const filePath = `avatars/${fileName}`;

    const { data, error } = await this.client.storage
      .from('avatars')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true,
      });

    if (error) throw error;

    const { data: { publicUrl } } = this.client.storage
      .from('avatars')
      .getPublicUrl(filePath);

    return { path: filePath, url: publicUrl };
  }

  async uploadProjectImage(projectId: string, file: File | Blob | Uint8Array) {
    const fileExt = file instanceof File ? file.name.split('.').pop() : 'jpg';
    const fileName = `${projectId}-${Date.now()}.${fileExt}`;
    const filePath = `projects/${fileName}`;

    const { data, error } = await this.client.storage
      .from('projects')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true,
      });

    if (error) throw error;

    const { data: { publicUrl } } = this.client.storage
      .from('projects')
      .getPublicUrl(filePath);

    return { path: filePath, url: publicUrl };
  }

  async deleteFile(bucket: string, path: string) {
    const { error } = await this.client.storage
      .from(bucket)
      .remove([path]);

    if (error) throw error;
  }

  getPublicUrl(bucket: string, path: string) {
    const { data: { publicUrl } } = this.client.storage
      .from(bucket)
      .getPublicUrl(path);

    return publicUrl;
  }
}

// Realtime helpers
export class SupabaseRealtime {
  private client: SupabaseClient<Database>;

  constructor() {
    this.client = getSupabase();
  }

  subscribeToProjects(callback: (payload: any) => void) {
    return this.client
      .channel('projects-channel')
      .on('postgres_changes', 
          { event: '*', schema: 'public', table: 'projects' }, 
          callback)
      .subscribe();
  }

  subscribeToLikes(projectId: string, callback: (payload: any) => void) {
    return this.client
      .channel(`likes-${projectId}`)
      .on('postgres_changes', 
          { 
            event: '*', 
            schema: 'public', 
            table: 'likes',
            filter: `project_id=eq.${projectId}`
          }, 
          callback)
      .subscribe();
  }

  subscribeToNotifications(userId: string, callback: (payload: any) => void) {
    return this.client
      .channel(`notifications-${userId}`)
      .on('postgres_changes', 
          { 
            event: 'INSERT', 
            schema: 'public', 
            table: 'notifications',
            filter: `user_id=eq.${userId}`
          }, 
          callback)
      .subscribe();
  }

  unsubscribe(channel: any) {
    if (channel) {
      this.client.removeChannel(channel);
    }
  }
}

// Export instances
export const storage = new SupabaseStorage();
export const realtime = new SupabaseRealtime();