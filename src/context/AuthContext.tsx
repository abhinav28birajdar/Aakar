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
