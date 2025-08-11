// src/lib/utils/helpers.ts
import { ClassValue } from 'clsx';
import { Alert, Platform, ToastAndroid } from 'react-native';

export function cn(...inputs: ClassValue[]): string {
  return inputs.filter(Boolean).join(' ');
}

export function showToast(message: string, type: 'success' | 'error' | 'info' = 'info') {
  if (Platform.OS === 'android') {
    ToastAndroid.show(message, ToastAndroid.SHORT);
  } else {
    Alert.alert(type === 'error' ? 'Error' : 'Info', message);
  }
}
