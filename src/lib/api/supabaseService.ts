import { formatSupabaseError, supabase } from '../supabase';
import { APIResponse, Design, Notification, Profile } from '../types';

class SupabaseService {
  // Profile Management
  async fetchUserProfiles(searchTerm?: string, limit = 10, offset = 0): Promise<APIResponse<Profile[]>> {
    try {
      let query = supabase.from('profiles').select('*');
      
      if (searchTerm) {
        query = query.or(`username.ilike.%${searchTerm}%,display_name.ilike.%${searchTerm}%`);
      }
      
      const { data, error } = await query
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);
      
      if (error) throw error;
      return { data };
    } catch (error) {
      console.error('Error fetching profiles:', error);
      return { error: { message: formatSupabaseError(error) } };
    }
  }

  async fetchUserByUsername(username: string): Promise<APIResponse<Profile>> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('username', username)
        .single();
      
      if (error) throw error;
      return { data };
    } catch (error) {
      return { error: { message: formatSupabaseError(error) } };
    }
  }

  async updateProfile(userId: string, updates: Partial<Profile>): Promise<APIResponse<Profile>> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', userId)
        .select()
        .single();
      
      if (error) throw error;
      return { data };
    } catch (error) {
      return { error: { message: formatSupabaseError(error) } };
    }
  }

  async checkUsernameAvailability(username: string): Promise<APIResponse<{ available: boolean }>> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id')
        .eq('username', username);
      
      if (error) throw error;
      return { data: { available: !data || data.length === 0 } };
    } catch (error) {
      return { error: { message: formatSupabaseError(error) } };
    }
  }

  // Design Management
  async fetchDesigns(filters: any = {}, pagination = { limit: 10, offset: 0 }): Promise<APIResponse<Design[]>> {
    try {
      let query = supabase.from('designs').select('*');
      
      // Apply filters
      if (filters.userId) query = query.eq('user_id', filters.userId);
      if (filters.category) query = query.eq('category', filters.category);
      if (filters.isPrivate !== undefined) query = query.eq('is_private', filters.isPrivate);
      if (filters.search) {
        query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
      }
      
      const { data, error } = await query
        .order('created_at', { ascending: false })
        .range(pagination.offset, pagination.offset + pagination.limit - 1);
      
      if (error) throw error;
      return { data };
    } catch (error) {
      return { error: { message: formatSupabaseError(error) } };
    }
  }

  async fetchDesignById(designId: string): Promise<APIResponse<Design>> {
    try {
      const { data, error } = await supabase
        .from('designs')
        .select('*')
        .eq('id', designId)
        .single();
      
      if (error) throw error;
      return { data };
    } catch (error) {
      return { error: { message: formatSupabaseError(error) } };
    }
  }

  async toggleLike(designId: string, userId: string): Promise<APIResponse<{ liked: boolean; newLikesCount: number }>> {
    try {
      // First, check if like exists
      const { data: existingLike } = await supabase
        .from('likes')
        .select('*')
        .eq('design_id', designId)
        .eq('user_id', userId)
        .single();

      if (existingLike) {
        // Unlike
        await supabase
          .from('likes')
          .delete()
          .eq('design_id', designId)
          .eq('user_id', userId);
      } else {
        // Like
        await supabase
          .from('likes')
          .insert({ design_id: designId, user_id: userId });
      }

      // Get updated likes count
      const { data: design } = await supabase
        .from('designs')
        .select('likes_count')
        .eq('id', designId)
        .single();

      return {
        data: {
          liked: !existingLike,
          newLikesCount: design?.likes_count || 0
        }
      };
    } catch (error) {
      return { error: { message: formatSupabaseError(error) } };
    }
  }

  // Notifications
  async fetchNotifications(userId: string, limit = 20, offset = 0): Promise<APIResponse<Notification[]>> {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('recipient_id', userId)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);
      
      if (error) throw error;
      return { data };
    } catch (error) {
      return { error: { message: formatSupabaseError(error) } };
    }
  }

  async markNotificationAsRead(notificationId: string): Promise<APIResponse<null>> {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', notificationId);
      
      if (error) throw error;
      return { data: null };
    } catch (error) {
      return { error: { message: formatSupabaseError(error) } };
    }
  }

  async fetchAICredits(userId: string): Promise<APIResponse<{ remainingCredits: number; isProMember: boolean }>> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('ai_credits, is_pro_member')
        .eq('id', userId)
        .single();
      
      if (error) throw error;
      return {
        data: {
          remainingCredits: data.ai_credits,
          isProMember: data.is_pro_member
        }
      };
    } catch (error) {
      return { error: { message: formatSupabaseError(error) } };
    }
  }
}

export const supabaseService = new SupabaseService();
