<<<<<<< HEAD
import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth, db } from '../services/firebaseConfig';
import { doc, onSnapshot } from 'firebase/firestore';

interface AuthContextType {
  user: User | null;
  userData: any | null;
  loading: boolean;
  setUserData: (data: any) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribeFirestore: () => void;

    const unsubscribeAuth = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      
      if (firebaseUser) {
        // Real-time listener for user data
        unsubscribeFirestore = onSnapshot(doc(db, 'users', firebaseUser.uid), (snapshot) => {
          if (snapshot.exists()) {
            setUserData(snapshot.data());
          } else {
            setUserData(null);
          }
          setLoading(false);
        }, (error) => {
          console.error("Firestore error:", error);
          setLoading(false);
        });
      } else {
        setUserData(null);
        setLoading(false);
      }
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeFirestore) unsubscribeFirestore();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, userData, loading, setUserData }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
=======
import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';

type User = {
    id: string;
    email: string;
    name: string;
    username: string;
    avatar_url: string;
};

type AuthContextType = {
    user: User | null;
    isLoading: boolean;
    signIn: (email: string, password: string) => Promise<void>;
    signUp: (email: string, password: string, name: string) => Promise<void>;
    signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        checkUser();
    }, []);

    const checkUser = async () => {
        try {
            const userJson = await AsyncStorage.getItem('user');
            if (userJson) {
                setUser(JSON.parse(userJson));
            }
        } catch (e) {
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    };

    const signIn = async (email: string, password: string) => {
        setIsLoading(true);
        // Hardcoded check as requested
        if (email === 'abhinavbirajdar28@gmail.com' && password === '12345678') {
            const mockUser = {
                id: '1',
                email: email,
                name: 'Abhinav Birajdar',
                username: 'abhinav',
                avatar_url: 'https://i.pravatar.cc/150?u=1',
            };
            setUser(mockUser);
            await AsyncStorage.setItem('user', JSON.stringify(mockUser));
            router.replace('/(tabs)');
        } else {
            setIsLoading(false);
            throw new Error('Invalid credentials');
        }
        setIsLoading(false);
    };

    const signUp = async (email: string, password: string, name: string) => {
        setIsLoading(true);
        // Mock signup
        const mockUser = {
            id: Math.random().toString(),
            email: email,
            name: name,
            username: name.toLowerCase().replace(' ', ''),
            avatar_url: `https://i.pravatar.cc/150?u=${Math.random()}`,
        };
        setUser(mockUser);
        await AsyncStorage.setItem('user', JSON.stringify(mockUser));
        router.replace('/(tabs)');
        setIsLoading(false);
    };

    const signOut = async () => {
        setIsLoading(true);
        setUser(null);
        await AsyncStorage.removeItem('user');
        router.replace('/(auth)/login');
        setIsLoading(false);
    };

    return (
        <AuthContext.Provider value={{ user, isLoading, signIn, signUp, signOut }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
>>>>>>> 9657734ae222ffc780f8eb91e036f49be6974fbd
