// ============================================================
// Firebase Auth Service - Aakar Platform
// ============================================================
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { UserProfile, UserRole } from '../types';

// ---- Auth Functions ----

export const firebaseSignIn = async (
  email: string,
  password: string
): Promise<{ user: FirebaseAuthTypes.User; profile: UserProfile }> => {
  const credential = await auth().signInWithEmailAndPassword(email, password);
  const profile = await getUserProfile(credential.user.uid);
  return { user: credential.user, profile };
};

export const firebaseSignUp = async (
  email: string,
  password: string,
  displayName: string,
  username: string
): Promise<{ user: FirebaseAuthTypes.User }> => {
  const credential = await auth().createUserWithEmailAndPassword(email, password);

  // Update Firebase Auth display name
  await credential.user.updateProfile({ displayName });

  // Send email verification
  await credential.user.sendEmailVerification();

  // Create user profile document in Firestore
  const now = new Date().toISOString();
  const profileData: Omit<UserProfile, 'id'> = {
    email,
    displayName,
    username: username.toLowerCase(),
    avatar: '',
    bio: '',
    role: 'designer',
    skills: [],
    interests: [],
    software: {},
    followersCount: 0,
    followingCount: 0,
    postsCount: 0,
    isVerified: false,
    isOnline: true,
    createdAt: now,
    updatedAt: now,
    isPrivate: false,
    allowMessages: 'everyone',
    showOnlineStatus: true,
    showLastSeen: true,
  };

  await firestore().collection('users').doc(credential.user.uid).set(profileData);

  return { user: credential.user };
};

export const firebaseSignOut = async (): Promise<void> => {
  const uid = auth().currentUser?.uid;
  if (uid) {
    await firestore().collection('users').doc(uid).update({
      isOnline: false,
      lastSeen: firestore.FieldValue.serverTimestamp(),
    });
  }
  await auth().signOut();
};

export const firebaseSendPasswordReset = async (email: string): Promise<void> => {
  await auth().sendPasswordResetEmail(email);
};

export const firebaseConfirmPasswordReset = async (
  code: string,
  newPassword: string
): Promise<void> => {
  await auth().confirmPasswordReset(code, newPassword);
};

export const firebaseResendVerification = async (): Promise<void> => {
  const user = auth().currentUser;
  if (user) {
    await user.sendEmailVerification();
  }
};

export const firebaseReloadUser = async (): Promise<boolean> => {
  const user = auth().currentUser;
  if (user) {
    await user.reload();
    return user.emailVerified;
  }
  return false;
};

// ---- User Profile Functions ----

export const getUserProfile = async (uid: string): Promise<UserProfile> => {
  const doc = await firestore().collection('users').doc(uid).get();
  if (!doc.exists) {
    throw new Error('User profile not found');
  }
  return { id: doc.id, ...doc.data() } as UserProfile;
};

export const updateUserProfile = async (
  uid: string,
  data: Partial<UserProfile>
): Promise<void> => {
  await firestore().collection('users').doc(uid).update({
    ...data,
    updatedAt: firestore.FieldValue.serverTimestamp(),
  });
};

export const setUserOnlineStatus = async (
  uid: string,
  isOnline: boolean
): Promise<void> => {
  await firestore().collection('users').doc(uid).update({
    isOnline,
    lastSeen: firestore.FieldValue.serverTimestamp(),
  });
};

export const checkUsernameAvailable = async (username: string): Promise<boolean> => {
  const snapshot = await firestore()
    .collection('users')
    .where('username', '==', username.toLowerCase())
    .limit(1)
    .get();
  return snapshot.empty;
};

export const getUserByUsername = async (username: string): Promise<UserProfile | null> => {
  const snapshot = await firestore()
    .collection('users')
    .where('username', '==', username.toLowerCase())
    .limit(1)
    .get();
  if (snapshot.empty) return null;
  const doc = snapshot.docs[0];
  return { id: doc.id, ...doc.data() } as UserProfile;
};

export const searchUsers = async (query: string): Promise<UserProfile[]> => {
  const q = query.toLowerCase();
  // Firestore doesn't support full-text search natively.
  // We search by username prefix and displayName prefix.
  const usernameSnapshot = await firestore()
    .collection('users')
    .where('username', '>=', q)
    .where('username', '<=', q + '\uf8ff')
    .limit(20)
    .get();

  const users: UserProfile[] = usernameSnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  })) as UserProfile[];

  return users;
};

// ---- Follow Functions ----

export const followUser = async (currentUid: string, targetUid: string): Promise<void> => {
  const batch = firestore().batch();

  // Add to following subcollection
  batch.set(
    firestore().collection('users').doc(currentUid).collection('following').doc(targetUid),
    { followedAt: firestore.FieldValue.serverTimestamp() }
  );

  // Add to followers subcollection
  batch.set(
    firestore().collection('users').doc(targetUid).collection('followers').doc(currentUid),
    { followedAt: firestore.FieldValue.serverTimestamp() }
  );

  // Update counts
  batch.update(firestore().collection('users').doc(currentUid), {
    followingCount: firestore.FieldValue.increment(1),
  });
  batch.update(firestore().collection('users').doc(targetUid), {
    followersCount: firestore.FieldValue.increment(1),
  });

  await batch.commit();
};

export const unfollowUser = async (currentUid: string, targetUid: string): Promise<void> => {
  const batch = firestore().batch();

  batch.delete(
    firestore().collection('users').doc(currentUid).collection('following').doc(targetUid)
  );
  batch.delete(
    firestore().collection('users').doc(targetUid).collection('followers').doc(currentUid)
  );

  batch.update(firestore().collection('users').doc(currentUid), {
    followingCount: firestore.FieldValue.increment(-1),
  });
  batch.update(firestore().collection('users').doc(targetUid), {
    followersCount: firestore.FieldValue.increment(-1),
  });

  await batch.commit();
};

export const isFollowingUser = async (currentUid: string, targetUid: string): Promise<boolean> => {
  const doc = await firestore()
    .collection('users')
    .doc(currentUid)
    .collection('following')
    .doc(targetUid)
    .get();
  return doc.exists;
};

export const getFollowers = async (uid: string): Promise<UserProfile[]> => {
  const snapshot = await firestore()
    .collection('users')
    .doc(uid)
    .collection('followers')
    .orderBy('followedAt', 'desc')
    .get();

  const profiles: UserProfile[] = [];
  for (const doc of snapshot.docs) {
    try {
      const profile = await getUserProfile(doc.id);
      profiles.push(profile);
    } catch {}
  }
  return profiles;
};

export const getFollowing = async (uid: string): Promise<UserProfile[]> => {
  const snapshot = await firestore()
    .collection('users')
    .doc(uid)
    .collection('following')
    .orderBy('followedAt', 'desc')
    .get();

  const profiles: UserProfile[] = [];
  for (const doc of snapshot.docs) {
    try {
      const profile = await getUserProfile(doc.id);
      profiles.push(profile);
    } catch {}
  }
  return profiles;
};

// ---- Auth State Listener ----

export const onAuthStateChanged = (
  callback: (user: FirebaseAuthTypes.User | null) => void
) => {
  return auth().onAuthStateChange(callback);
};
