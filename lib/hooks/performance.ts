import debounce from 'lodash.debounce';
import { useCallback, useRef } from 'react';

export function useDebounce<T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): T {
  const debouncedRef = useRef(debounce(callback, delay));
  
  // Update the callback if it changes
  debouncedRef.current = debounce(callback, delay);
  
  return useCallback((...args: Parameters<T>) => {
    return debouncedRef.current(...args);
  }, []) as T;
}

export function useThrottle<T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): T {
  const lastRun = useRef(Date.now());
  
  return useCallback((...args: Parameters<T>) => {
    if (Date.now() - lastRun.current >= delay) {
      callback(...args);
      lastRun.current = Date.now();
    }
  }, [callback, delay]) as T;
}

// Cache hook for expensive operations
export function useCache<T>(
  key: string,
  computeValue: () => T,
  deps: any[] = []
): T {
  const cache = useRef<Map<string, { value: T; deps: any[] }>>(new Map());
  
  const cachedItem = cache.current.get(key);
  
  // Check if we have a cached value with the same dependencies
  if (cachedItem && JSON.stringify(cachedItem.deps) === JSON.stringify(deps)) {
    return cachedItem.value;
  }
  
  // Compute new value
  const newValue = computeValue();
  cache.current.set(key, { value: newValue, deps });
  
  return newValue;
}