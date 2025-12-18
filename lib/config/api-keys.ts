import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { z } from 'zod';

// API Keys Schema
const ApiKeysSchema = z.object({
  supabaseUrl: z.string().url('Invalid Supabase URL'),
  supabaseAnonKey: z.string().min(1, 'Supabase anon key is required'),
  geminiApiKey: z.string().optional(),
  stripePublishableKey: z.string().optional(),
  firebaseConfig: z.object({
    apiKey: z.string(),
    authDomain: z.string(),
    projectId: z.string(),
    storageBucket: z.string(),
    messagingSenderId: z.string(),
    appId: z.string(),
  }).optional(),
});

export type ApiKeys = z.infer<typeof ApiKeysSchema>;

const STORAGE_KEY = 'app_api_keys';
const SECURE_KEYS = ['supabaseAnonKey', 'geminiApiKey', 'stripePublishableKey'];

class ApiKeyManager {
  private keys: ApiKeys | null = null;
  private initialized = false;

  async initialize(): Promise<void> {
    if (this.initialized) return;
    
    try {
      await this.loadKeys();
      this.initialized = true;
    } catch (error) {
      console.error('Failed to initialize API key manager:', error);
      throw new Error('API configuration required');
    }
  }

  private async loadKeys(): Promise<void> {
    try {
      // Load non-sensitive keys from AsyncStorage
      const nonSecureData = await AsyncStorage.getItem(STORAGE_KEY);
      const parsedData = nonSecureData ? JSON.parse(nonSecureData) : {};

      // Load sensitive keys from SecureStore
      const secureKeys: Partial<ApiKeys> = {};
      for (const key of SECURE_KEYS) {
        const value = await SecureStore.getItemAsync(`${STORAGE_KEY}_${key}`);
        if (value) {
          secureKeys[key as keyof ApiKeys] = value as any;
        }
      }

      // Merge all keys
      const allKeys = { ...parsedData, ...secureKeys };
      
      // Validate schema
      this.keys = ApiKeysSchema.parse(allKeys);
    } catch (error) {
      throw new Error('Invalid or missing API configuration');
    }
  }

  async saveKeys(keys: Partial<ApiKeys>): Promise<void> {
    try {
      // Validate before saving
      const validatedKeys = ApiKeysSchema.parse({ ...this.keys, ...keys });
      
      // Separate secure and non-secure keys
      const secureData: Partial<ApiKeys> = {};
      const nonSecureData: Partial<ApiKeys> = {};

      Object.entries(validatedKeys).forEach(([key, value]) => {
        if (SECURE_KEYS.includes(key)) {
          secureData[key as keyof ApiKeys] = value as any;
        } else {
          nonSecureData[key as keyof ApiKeys] = value as any;
        }
      });

      // Save to respective storages
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(nonSecureData));
      
      for (const [key, value] of Object.entries(secureData)) {
        if (value) {
          await SecureStore.setItemAsync(`${STORAGE_KEY}_${key}`, value as string);
        }
      }

      this.keys = validatedKeys;
    } catch (error) {
      throw new Error('Failed to save API keys: ' + (error as Error).message);
    }
  }

  getKeys(): ApiKeys {
    if (!this.keys) {
      throw new Error('API keys not initialized. Call initialize() first.');
    }
    return this.keys;
  }

  getConfig() {
    return this.getKeys();
  }

  getSupabaseConfig() {
    const keys = this.getKeys();
    return {
      url: keys.supabaseUrl,
      anonKey: keys.supabaseAnonKey,
    };
  }

  async isConfigured(): Promise<boolean> {
    try {
      await this.initialize();
      return true;
    } catch {
      return false;
    }
  }

  async clearKeys(): Promise<void> {
    await AsyncStorage.removeItem(STORAGE_KEY);
    for (const key of SECURE_KEYS) {
      await SecureStore.deleteItemAsync(`${STORAGE_KEY}_${key}`);
    }
    this.keys = null;
    this.initialized = false;
  }

  // Convenience methods
  getGeminiApiKey(): string | undefined {
    return this.getKeys().geminiApiKey;
  }

  getStripeKey(): string | undefined {
    return this.getKeys().stripePublishableKey;
  }

  getFirebaseConfig() {
    return this.getKeys().firebaseConfig;
  }
}

export const apiKeyManager = new ApiKeyManager();

// Hook for React components
import { useEffect, useState } from 'react';

export function useApiKeys() {
  const [isConfigured, setIsConfigured] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkConfiguration();
  }, []);

  const checkConfiguration = async () => {
    try {
      const configured = await apiKeyManager.isConfigured();
      setIsConfigured(configured);
    } catch (error) {
      setIsConfigured(false);
    } finally {
      setLoading(false);
    }
  };

  return {
    isConfigured,
    loading,
    checkConfiguration,
  };
}