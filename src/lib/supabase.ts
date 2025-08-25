import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import Constants from 'expo-constants';
import { Database } from './types';

const supabaseUrl = Constants.expoConfig?.extra?.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = Constants.expoConfig?.extra?.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase configuration. Please ensure EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY are set in your app.json extra section.'
  );
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
  global: {
    // Add retries for better reliability
    headers: { 'X-Client-Info': 'aakar-mobile' },
  },
  // Add additional features like realtime presence
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
});

// Helper for common error message formats
export const formatSupabaseError = (error: any): string => {
  if (typeof error === 'string') return error;
  if (error?.message) return error.message;
  if (error?.error_description) return error.error_description;
  return 'An unknown error occurred';
};

// Helper to check if error is a network error
export const isNetworkError = (error: any): boolean => {
  if (!error) return false;
  const message = error.message?.toLowerCase() || '';
  return message.includes('network') || message.includes('connection') || message.includes('offline');
};
