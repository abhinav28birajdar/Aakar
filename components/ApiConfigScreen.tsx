import Icon from '@/components/ui/Icon';
import { useTheme } from '@/hooks/useTheme';
import { apiKeyManager } from '@/lib/config/api-keys';
import { cn } from '@/lib/utils/helpers';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { z } from 'zod';

const ConfigSchema = z.object({
  supabaseUrl: z.string().url('Enter a valid Supabase URL'),
  supabaseAnonKey: z.string().min(1, 'Supabase anon key is required'),
  geminiApiKey: z.string().optional(),
  stripePublishableKey: z.string().optional(),
});

type ConfigForm = z.infer<typeof ConfigSchema>;

interface ApiConfigScreenProps {
  onComplete?: () => void;
  isSetupMode?: boolean;
}

export function ApiConfigScreen({ onComplete, isSetupMode = false }: ApiConfigScreenProps) {
  const { isDark } = useTheme();
  const [loading, setLoading] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<ConfigForm>({
    resolver: zodResolver(ConfigSchema),
    defaultValues: {
      supabaseUrl: '',
      supabaseAnonKey: '',
      geminiApiKey: '',
      stripePublishableKey: '',
    },
  });

  React.useEffect(() => {
    loadExistingConfig();
  }, []);

  const loadExistingConfig = async () => {
    try {
      const keys = apiKeyManager.getKeys();
      setValue('supabaseUrl', keys.supabaseUrl);
      setValue('supabaseAnonKey', keys.supabaseAnonKey);
      setValue('geminiApiKey', keys.geminiApiKey || '');
      setValue('stripePublishableKey', keys.stripePublishableKey || '');
    } catch (error) {
      // No existing config
    }
  };

  const onSubmit = async (data: ConfigForm) => {
    setLoading(true);
    try {
      await apiKeyManager.saveKeys(data);
      Alert.alert(
        'Success',
        'API configuration saved successfully!',
        [{ text: 'OK', onPress: onComplete }]
      );
    } catch (error) {
      Alert.alert('Error', (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const testConnection = async () => {
    try {
      const config = apiKeyManager.getSupabaseConfig();
      // Simple test to verify the URL is accessible
      Alert.alert('Info', 'Connection test would be performed here');
    } catch (error) {
      Alert.alert('Test Failed', 'Please check your configuration');
    }
  };

  const clearConfig = async () => {
    Alert.alert(
      'Clear Configuration',
      'Are you sure you want to clear all API keys?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: async () => {
            await apiKeyManager.clearKeys();
            setValue('supabaseUrl', '');
            setValue('supabaseAnonKey', '');
            setValue('geminiApiKey', '');
            setValue('stripePublishableKey', '');
            Alert.alert('Cleared', 'All API keys have been cleared');
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView className={cn('flex-1', isDark ? 'bg-dark' : 'bg-background')}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView className="flex-1 px-6 py-4">
          {/* Header */}
          <View className="mb-8">
            <Text className={cn(
              'text-3xl font-bold mb-2',
              isDark ? 'text-white' : 'text-gray-900'
            )}>
              {isSetupMode ? 'Setup API Keys' : 'API Configuration'}
            </Text>
            <Text className={cn(
              'text-base',
              isDark ? 'text-gray-300' : 'text-gray-600'
            )}>
              Configure your API keys securely. Sensitive keys are encrypted and stored locally.
            </Text>
          </View>

          {/* Required Section */}
          <View className="mb-6">
            <Text className={cn(
              'text-lg font-semibold mb-4',
              isDark ? 'text-white' : 'text-gray-900'
            )}>
              Required Configuration
            </Text>

            {/* Supabase URL */}
            <View className="mb-4">
              <Text className={cn(
                'text-sm font-medium mb-2',
                isDark ? 'text-gray-300' : 'text-gray-700'
              )}>
                Supabase Project URL
              </Text>
              <Controller
                control={control}
                name="supabaseUrl"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    className={cn(
                      'border rounded-lg px-4 py-3 text-base',
                      isDark ? 'border-gray-600 bg-dark-card text-white' : 'border-gray-300 bg-white text-gray-900',
                      errors.supabaseUrl && 'border-red-500'
                    )}
                    placeholder="https://your-project.supabase.co"
                    placeholderTextColor={isDark ? '#9CA3AF' : '#6B7280'}
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                )}
              />
              {errors.supabaseUrl && (
                <Text className="text-red-500 text-sm mt-1">
                  {errors.supabaseUrl.message}
                </Text>
              )}
            </View>

            {/* Supabase Anon Key */}
            <View className="mb-4">
              <Text className={cn(
                'text-sm font-medium mb-2',
                isDark ? 'text-gray-300' : 'text-gray-700'
              )}>
                Supabase Anon Key
              </Text>
              <Controller
                control={control}
                name="supabaseAnonKey"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    className={cn(
                      'border rounded-lg px-4 py-3 text-base',
                      isDark ? 'border-gray-600 bg-dark-card text-white' : 'border-gray-300 bg-white text-gray-900',
                      errors.supabaseAnonKey && 'border-red-500'
                    )}
                    placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                    placeholderTextColor={isDark ? '#9CA3AF' : '#6B7280'}
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    secureTextEntry
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                )}
              />
              {errors.supabaseAnonKey && (
                <Text className="text-red-500 text-sm mt-1">
                  {errors.supabaseAnonKey.message}
                </Text>
              )}
            </View>
          </View>

          {/* Optional Section */}
          <TouchableOpacity
            onPress={() => setShowAdvanced(!showAdvanced)}
            className="flex-row items-center justify-between mb-4"
          >
            <Text className={cn(
              'text-lg font-semibold',
              isDark ? 'text-white' : 'text-gray-900'
            )}>
              Optional Configuration
            </Text>
            <Icon
              name={showAdvanced ? 'chevron-up' : 'chevron-down'}
              size={20}
              color={isDark ? '#9CA3AF' : '#6B7280'}
            />
          </TouchableOpacity>

          {showAdvanced && (
            <View className="mb-6">
              {/* Gemini API Key */}
              <View className="mb-4">
                <Text className={cn(
                  'text-sm font-medium mb-2',
                  isDark ? 'text-gray-300' : 'text-gray-700'
                )}>
                  Gemini API Key (for AI features)
                </Text>
                <Controller
                  control={control}
                  name="geminiApiKey"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      className={cn(
                        'border rounded-lg px-4 py-3 text-base',
                        isDark ? 'border-gray-600 bg-dark-card text-white' : 'border-gray-300 bg-white text-gray-900'
                      )}
                      placeholder="AIzaSy..."
                      placeholderTextColor={isDark ? '#9CA3AF' : '#6B7280'}
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      secureTextEntry
                      autoCapitalize="none"
                      autoCorrect={false}
                    />
                  )}
                />
              </View>

              {/* Stripe Key */}
              <View className="mb-4">
                <Text className={cn(
                  'text-sm font-medium mb-2',
                  isDark ? 'text-gray-300' : 'text-gray-700'
                )}>
                  Stripe Publishable Key (for payments)
                </Text>
                <Controller
                  control={control}
                  name="stripePublishableKey"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      className={cn(
                        'border rounded-lg px-4 py-3 text-base',
                        isDark ? 'border-gray-600 bg-dark-card text-white' : 'border-gray-300 bg-white text-gray-900'
                      )}
                      placeholder="pk_test_..."
                      placeholderTextColor={isDark ? '#9CA3AF' : '#6B7280'}
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      secureTextEntry
                      autoCapitalize="none"
                      autoCorrect={false}
                    />
                  )}
                />
              </View>
            </View>
          )}

          {/* Action Buttons */}
          <View className="space-y-4">
            <TouchableOpacity
              onPress={handleSubmit(onSubmit)}
              disabled={loading}
              className={cn(
                'bg-primary py-4 rounded-lg flex-row items-center justify-center',
                loading && 'opacity-50'
              )}
            >
              <Text className="text-white font-semibold text-lg">
                {loading ? 'Saving...' : 'Save Configuration'}
              </Text>
            </TouchableOpacity>

            {!isSetupMode && (
              <View className="flex-row space-x-3">
                <TouchableOpacity
                  onPress={testConnection}
                  className={cn(
                    'flex-1 border border-primary py-3 rounded-lg flex-row items-center justify-center'
                  )}
                >
                  <Text className="text-primary font-semibold">
                    Test Connection
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={clearConfig}
                  className={cn(
                    'flex-1 border border-red-500 py-3 rounded-lg flex-row items-center justify-center'
                  )}
                >
                  <Text className="text-red-500 font-semibold">
                    Clear All
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}