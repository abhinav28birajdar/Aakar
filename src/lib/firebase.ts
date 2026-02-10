// ============================================================
// Firebase Configuration - Aakar Platform
// ============================================================
import { initializeApp, getApps, getApp } from '@react-native-firebase/app';

// Firebase config is loaded automatically from:
// - Android: google-services.json (placed in android/app/)
// - iOS: GoogleService-Info.plist (placed in ios/)
//
// For Expo managed workflow, config is provided via app.json plugins.
// No manual initialization needed — @react-native-firebase auto-initializes.

// Export a helper to check if Firebase is initialized
export const getFirebaseApp = () => {
  if (getApps().length === 0) {
    console.warn('Firebase not initialized. Ensure google-services.json / GoogleService-Info.plist is configured.');
    return null;
  }
  return getApp();
};
