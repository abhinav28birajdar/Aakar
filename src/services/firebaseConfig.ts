import { initializeApp } from 'firebase/app';
// @ts-ignore - Firebase types might lag behind react-native exports
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyDnG4lmjiHZ7O74k3f-QdyUjHYOxdUr4zY",
  authDomain: "aakar-app-c129a.firebaseapp.com",
  projectId: "aakar-app-c129a",
  storageBucket: "aakar-app-c129a.firebasestorage.app",
  messagingSenderId: "166620988404",
  appId: "1:166620988404:android:53d552cee9c58dfbcb6fa1"
};

const app = initializeApp(firebaseConfig);

// Initialize Auth with persistence using AsyncStorage for React Native
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };
export default app;
