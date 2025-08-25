// In src/lib/types.ts
// Database types matching Supabase schema

type Json = string | number | boolean | null | { [key: string]: Json } | Json[];
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          username: string | null;
          display_name: string | null;
          bio: string | null;
          avatar_url: string | null;
          header_image_url: string | null;
          social_links: Json | null;
          website_url: string | null;
          skills: Json | null;
          location: string | null;
          is_pro_member: boolean;
          stripe_customer_id: string | null;
          follower_count: number;
          following_count: number;
          total_designs_count: number;
          ai_credits: number;
          is_admin: boolean;
          created_at: string;
          updated_at: string;
          push_token: string | null;
        };
        Insert: { id?: string; username: string; /* ... */ };
        Update: Partial<Omit<Database['public']['Tables']['profiles']['Row'], 'id'>>;
      };
      designs: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          description: string | null;
          category: DesignCategory;
          tags: string[] | null;
          cover_image_url: string;
          image_urls: string[] | null;
          design_file_url: string | null;
          video_preview_url: string | null;
          is_private: boolean;
          is_editable_by_ai: boolean;
          dominant_colors: string[] | null;
          style_tags: string[] | null;
          created_at: string;
          updated_at: string;
          views_count: number;
          likes_count: number;
          comments_count: number;
        };
        Insert: Pick<Database['public']['Tables']['designs']['Row'], 'user_id' | 'title' | 'category'> & Partial<Omit<Database['public']['Tables']['designs']['Row'], 'id' | 'user_id' | 'title' | 'category'>>;
        Update: Partial<Omit<Database['public']['Tables']['designs']['Row'], 'id'>>;
      };
      notifications: {
        Row: {
          id: string;
          recipient_id: string;
          sender_id: string | null;
          type: NotificationType;
          entity_id: string | null;
          message: string | null;
          read: boolean;
          created_at: string;
          data: Json | null;
        };
        Insert: Pick<Database['public']['Tables']['notifications']['Row'], 'recipient_id' | 'type'> & Partial<Omit<Database['public']['Tables']['notifications']['Row'], 'id' | 'recipient_id' | 'type'>>;
        Update: Partial<Omit<Database['public']['Tables']['notifications']['Row'], 'id'>>;
      }
    };
    Enums: {
      design_category_enum: "UI/UX Design" | "Web Design" | "Illustration" | "Logo Design" | "3D Design" | "Icon Design" | "Brand Design" | "Product Design" | "Motion Design" | "Print Design" | "Game Design" | "Typography" | "Other";
      notification_type_enum: "like" | "comment" | "follow" | "mention" | "design_feature" | "new_follower_post" | "system_alert";
    }
  }
}

// Type Aliases
export type Profile = Database['public']['Tables']['profiles']['Row'];
export type Design = Database['public']['Tables']['designs']['Row'];
export type Notification = Database['public']['Tables']['notifications']['Row'];
export type DesignCategory = Database['public']['Enums']['design_category_enum'];
export type NotificationType = Database['public']['Enums']['notification_type_enum'];

// API Types
export interface APIResponse<T> {
  data?: T;
  error?: { message: string; code?: number };
}

export interface FormErrors { [key: string]: string; }

export interface AuthPayload {
  email: string;
  password?: string;
  displayName?: string;
  username?: string;
}

export interface DesignUploadPayload {
  title: string;
  description: string;
  category: DesignCategory;
  tags: string[];
  isPrivate: boolean;
  isEditableByAI: boolean;
  coverImageUri: string;
  otherImageUris?: string[];
  videoPreviewUri?: string;
  designFileUri?: string;
  projectId?: string;
}

export interface AIPanelParams {
  imageBase64?: string;
  prompt: string;
  maskBase64?: string;
  stylePreset?: string;
  resolution?: 'standard' | 'hd';
  objectToReplace?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

// Navigation Types
export type RootStackParamList = {
  Auth: undefined;
  App: undefined;
  AddWorkModal: undefined;
  DeepLinkDesignDetail: { id: string };
  DeepLinkUserProfile: { username: string };
};

export type AuthStackParamList = {
  SignIn: undefined;
  SignUp: undefined;
  ForgotPassword: undefined;
  ResetPassword: { token: string };
  ProfileSetup: undefined;
};

export type AppTabParamList = {
  HomeTab: undefined;
  SearchTab: undefined;
  AddTabPlaceholder: undefined;
  NotificationsTab: undefined;
  ProfileTab: undefined;
};
