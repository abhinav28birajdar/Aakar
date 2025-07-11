import { useState, useEffect } from 'react';
import { auth, db } from '@/lib/firebase';
import { onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut as firebaseSignOut, sendPasswordResetEmail, updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { User as FirebaseUser } from 'firebase/auth';

export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
}

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, user => {
      if (user) {
        setAuthState({
          user: {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
          },
          isLoading: false,
          error: null,
        });
      } else {
        setAuthState({
          user: null,
          isLoading: false,
          error: null,
        });
      }
    });

    return () => unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      setAuthState({ ...authState, isLoading: true, error: null });
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const { user } = userCredential;
      setAuthState({
        user: {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
        },
        isLoading: false,
        error: null,
      });
      return user;
    } catch (error: any) {
      setAuthState({ ...authState, isLoading: false, error: error.message });
      throw error;
    }
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      setAuthState({ ...authState, isLoading: true, error: null });
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const { user } = userCredential;
      await updateProfile(user, { displayName: fullName });
      
      // Create a user document in Firestore
      await setDoc(doc(db, 'users', user.uid), {
        fullName,
        email,
        createdAt: new Date(),
      });

      setAuthState({
        user: {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
        },
        isLoading: false,
        error: null,
      });
      return user;
    } catch (error: any) {
      setAuthState({ ...authState, isLoading: false, error: error.message });
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      setAuthState({ user: null, isLoading: false, error: null });
    } catch (error: any) {
      setAuthState({ ...authState, error: error.message });
      throw error;
    }
  };

  const resetPassword = async (email: string) => {
    try {
      setAuthState({ ...authState, isLoading: true, error: null });
      await sendPasswordResetEmail(auth, email);
      setAuthState({ ...authState, isLoading: false });
      return true;
    } catch (error: any) {
      setAuthState({ ...authState, isLoading: false, error: error.message });
      throw error;
    }
  };

  return {
    ...authState,
    signIn,
    signUp,
    signOut,
    resetPassword,
  };
};