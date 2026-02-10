// ============================================================
// Firebase Auth Context - Aakar Platform
// ============================================================
import React, { createContext, useContext, useEffect, useState } from 'react';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { AppState } from 'react-native';
import { getUserProfile, setUserOnlineStatus } from '../services/firebaseAuth';
import { UserProfile } from '../types';

interface AuthContextType {
  firebaseUser: FirebaseAuthTypes.User | null;
  profile: UserProfile | null;
  loading: boolean;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  firebaseUser: null,
  profile: null,
  loading: true,
  refreshProfile: async () => {},
});

export const useFirebaseAuth = () => useContext(AuthContext);

export const FirebaseAuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseAuthTypes.User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(async (user) => {
      setFirebaseUser(user);

      if (user && user.emailVerified) {
        try {
          const userProfile = await getUserProfile(user.uid);
          setProfile(userProfile);
        } catch (error) {
          console.error('Error fetching profile:', error);
          setProfile(null);
        }
      } else {
        setProfile(null);
      }

      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // Handle online/offline status
  useEffect(() => {
    const subscription = AppState.addEventListener('change', async (state) => {
      const user = auth().currentUser;
      if (user) {
        if (state === 'active') {
          await setUserOnlineStatus(user.uid, true).catch(() => {});
        } else if (state === 'background' || state === 'inactive') {
          await setUserOnlineStatus(user.uid, false).catch(() => {});
        }
      }
    });

    return () => subscription.remove();
  }, []);

  const refreshProfile = async () => {
    const user = auth().currentUser;
    if (user) {
      try {
        const userProfile = await getUserProfile(user.uid);
        setProfile(userProfile);
      } catch (error) {
        console.error('Error refreshing profile:', error);
      }
    }
  };

  return (
    <AuthContext.Provider value={{ firebaseUser, profile, loading, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
};
