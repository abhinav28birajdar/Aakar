import { ClassValue, clsx } from 'clsx';
import debounce from 'lodash.debounce';
import { Alert, Dimensions, PixelRatio, Platform, ToastAndroid } from 'react-native';
import { twMerge } from 'tailwind-merge';
import { siteConfig } from '../constants';

// Tailwind class merging
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

// Platform-specific helper
export function platformSelect<T>(options: { ios?: T; android?: T; default?: T }): T | undefined {
  if (Platform.OS === 'ios' && options.ios !== undefined) return options.ios;
  if (Platform.OS === 'android' && options.android !== undefined) return options.android;
  return options.default;
}

// Toast/Alert helper
export function showToast(
  message: string,
  type: 'success' | 'error' | 'info' = 'info',
  duration: 'short' | 'long' = 'short'
): void {
  if (Platform.OS === 'android') {
    ToastAndroid.show(
      message,
      duration === 'short' ? ToastAndroid.SHORT : ToastAndroid.LONG
    );
  } else {
    Alert.alert(
      type === 'error' ? 'Error' :
      type === 'success' ? 'Success' : 'Info',
      message
    );
  }
}

// Responsive design helpers
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const widthBaseScale = SCREEN_WIDTH / 375; // iPhone X width
const heightBaseScale = SCREEN_HEIGHT / 812; // iPhone X height

export function normalize(size: number, based: 'width' | 'height' = 'width'): number {
  const newSize = based === 'height' ? size * heightBaseScale : size * widthBaseScale;
  return Math.round(PixelRatio.roundToNearestPixel(newSize));
}

// Validation helpers
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
  return emailRegex.test(email);
}

export function isValidURL(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

// Array helpers
export function chunk<T>(array: T[], size: number): T[][] {
  return Array.from({ length: Math.ceil(array.length / size) }, (_, index) =>
    array.slice(index * size, (index + 1) * size)
  );
}

export function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

// Pagination helper
export function getPaginationRange(
  currentPage: number,
  totalPages: number,
  limit = siteConfig.PAGINATION_LIMIT
): { start: number; end: number } {
  return {
    start: (currentPage - 1) * limit,
    end: currentPage * limit - 1,
  };
}

// Debounce wrapper
export const debounceFn = debounce(
  (fn: (...args: any[]) => void, ...args: any[]) => fn(...args),
  300
);

// Sleep utility for animations/transitions
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Random ID generator
export function generateId(length: number = 10): string {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

// File extension helper
export function getFileExtension(filename: string): string {
  return filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 2);
}

// Mask sensitive data
export function maskData(data: string, visibleChars: number = 4): string {
  if (data.length <= visibleChars) return data;
  return '*'.repeat(data.length - visibleChars) + data.slice(-visibleChars);
}

// Deep clone objects
export function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

// Error handler wrapper for async functions
export async function asyncTryCatch<T>(
  promise: Promise<T>
): Promise<[T | null, Error | null]> {
  try {
    const data = await promise;
    return [data, null];
  } catch (error) {
    return [null, error as Error];
  }
}
