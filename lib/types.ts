// src/types.ts
import { User as SupabaseUser } from '@supabase/supabase-js';

export interface ExtendedUser extends SupabaseUser {
  avatar_url?: string;
  display_name?: string;
  bio?: string;
  website?: string;
  location?: string;
  followers?: number;
  following?: number;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  user: ExtendedUser;
  likes: number;
  isLiked: boolean;
  isSaved: boolean;
  category: string;
}

export interface User {
  id: string;
  email: string;
  display_name: string;
  avatar_url: string;
  bio: string;
  website: string;
  location: string;
  followers: number;
  following: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  imageUrl: string;
}

export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface NotificationBehavior {
  shouldShowAlert: boolean;
  shouldPlaySound: boolean;
  shouldSetBadge: boolean;
  shouldShowBanner: boolean;
  shouldShowList: boolean;
}

export interface ThemeContextType {
  theme: 'light' | 'dark';
  isDark: boolean;
  toggleTheme: () => void;
}
