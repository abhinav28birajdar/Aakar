import { db } from '@/lib/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { useCallback, useEffect, useState } from 'react';
import { useAuth } from './useAuth';

export interface UserProfile {
  id: string;
  username: string;
  email: string;
  fullName: string;
  designation?: string;
  bio?: string;
  location?: string;
  avatarUrl?: string;
  role: 'designer' | 'client';
  followers: number;
  following: number;
  skills?: string[];
  createdAt: any; // Firestore timestamp
}

export const useUser = (userId?: string) => {
  const { user: authUser } = useAuth();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUser = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const targetUserId = userId || authUser?.uid;

      if (!targetUserId) {
        // User is not logged in and no userId is provided
        setIsLoading(false);
        return;
      }

      const userDoc = await getDoc(doc(db, 'users', targetUserId));

      if (!userDoc.exists) {
        throw new Error('User not found');
      }

      setUser({ id: userDoc.id, ...userDoc.data() } as UserProfile);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch user');
    } finally {
      setIsLoading(false);
    }
  }, [userId, authUser?.uid]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const updateProfile = useCallback(
    async (updates: Partial<UserProfile>) => {
      if (!authUser?.uid) return false;

      try {
        setIsLoading(true);
        setError(null);

        await updateDoc(doc(db, 'users', authUser.uid), updates);

        // Optimistically update local state
        if (user) {
          setUser({ ...user, ...updates });
        }

        return true;
      } catch (err: any) {
        setError(err.message || 'Failed to update profile');
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [user, authUser?.uid]
  );

  const getUserById = useCallback(async (id: string) => {
    try {
      const userDoc = await getDoc(doc(db, 'users', id));
      if (userDoc.exists()) {
        return { id: userDoc.id, ...userDoc.data() } as UserProfile;
      }
      return null;
    } catch (error) {
      console.error("Error fetching user by ID:", error);
      return null;
    }
  }, []);

  return {
    user,
    isLoading,
    error,
    refreshUser: fetchUser,
    updateProfile,
    getUserById,
  };
};