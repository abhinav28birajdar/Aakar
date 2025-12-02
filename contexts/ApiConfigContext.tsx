import * as SecureStore from 'expo-secure-store';
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { Alert } from 'react-native';

export interface ApiConfig {
  supabaseUrl?: string | undefined;
  supabaseAnonKey?: string | undefined;
  stripePublishableKey?: string | undefined;
  nextjsApiBaseUrl?: string | undefined;
  firebaseApiKey?: string | undefined;
  firebaseAuthDomain?: string | undefined;
  firebaseProjectId?: string | undefined;
}

interface ApiConfigContextType {
  config: ApiConfig;
  isConfigured: boolean;
  isLoading: boolean;
  updateConfig: (newConfig: Partial<ApiConfig>) => Promise<void>;
  clearConfig: () => Promise<void>;
  validateConfig: () => boolean;
  getSupabaseUrl: () => string | null;
  getSupabaseAnonKey: () => string | null;
}

const ApiConfigContext = createContext<ApiConfigContextType | null>(null);

const CONFIG_STORAGE_KEY = 'app_api_config';

// Default values from environment (if available)
const DEFAULT_CONFIG: ApiConfig = {
  supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL || undefined,
  supabaseAnonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || undefined,
  stripePublishableKey: process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY || undefined,
  nextjsApiBaseUrl: process.env.EXPO_PUBLIC_NEXTJS_API_BASE_URL || undefined,
};

interface ApiConfigProviderProps {
  children: ReactNode;
}

export function ApiConfigProvider({ children }: ApiConfigProviderProps) {
  const [config, setConfig] = useState<ApiConfig>(DEFAULT_CONFIG);
  const [isLoading, setIsLoading] = useState(true);

  // Load configuration on mount
  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    try {
      setIsLoading(true);
      const stored = await SecureStore.getItemAsync(CONFIG_STORAGE_KEY);
      
      if (stored) {
        const parsedConfig = JSON.parse(stored);
        // Merge with defaults, giving priority to stored config
        setConfig({ ...DEFAULT_CONFIG, ...parsedConfig });
      }
    } catch (error) {
      console.warn('Failed to load API configuration:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateConfig = async (newConfig: Partial<ApiConfig>) => {
    try {
      const updatedConfig = { ...config, ...newConfig };
      setConfig(updatedConfig);
      
      // Only store non-default values to keep sensitive data secure
      const configToStore = Object.keys(updatedConfig).reduce((acc, key) => {
        const configKey = key as keyof ApiConfig;
        if (updatedConfig[configKey] && updatedConfig[configKey] !== DEFAULT_CONFIG[configKey]) {
          acc[configKey] = updatedConfig[configKey];
        }
        return acc;
      }, {} as ApiConfig);
      
      if (Object.keys(configToStore).length > 0) {
        await SecureStore.setItemAsync(CONFIG_STORAGE_KEY, JSON.stringify(configToStore));
      }
    } catch (error) {
      console.error('Failed to update API configuration:', error);
      Alert.alert('Error', 'Failed to save configuration. Please try again.');
    }
  };

  const clearConfig = async () => {
    try {
      await SecureStore.deleteItemAsync(CONFIG_STORAGE_KEY);
      setConfig(DEFAULT_CONFIG);
    } catch (error) {
      console.error('Failed to clear API configuration:', error);
    }
  };

  const validateConfig = (): boolean => {
    // Basic validation - check if essential configs are present
    return !!(config.supabaseUrl && config.supabaseAnonKey);
  };

  const getSupabaseUrl = (): string | null => {
    return config.supabaseUrl || null;
  };

  const getSupabaseAnonKey = (): string | null => {
    return config.supabaseAnonKey || null;
  };

  const isConfigured = validateConfig();

  const contextValue: ApiConfigContextType = {
    config,
    isConfigured,
    isLoading,
    updateConfig,
    clearConfig,
    validateConfig,
    getSupabaseUrl,
    getSupabaseAnonKey,
  };

  return (
    <ApiConfigContext.Provider value={contextValue}>
      {children}
    </ApiConfigContext.Provider>
  );
}

export function useApiConfig(): ApiConfigContextType {
  const context = useContext(ApiConfigContext);
  if (!context) {
    throw new Error('useApiConfig must be used within an ApiConfigProvider');
  }
  return context;
}

// Hook for checking if the app is ready to use external services
export function useAppReadiness() {
  const { isConfigured, isLoading } = useApiConfig();
  
  return {
    isReady: isConfigured && !isLoading,
    isLoading,
    needsConfiguration: !isConfigured && !isLoading,
  };
}