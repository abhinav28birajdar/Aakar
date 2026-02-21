// ============================================================
// Firebase Auth Service - Aakar Platform
// ============================================================
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
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
    hasCompletedOnboarding: false,
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

  const followerIds = snapshot.docs.map(doc => doc.id);
  if (followerIds.length === 0) return [];

  // Fetch all profiles in chunks of 30 (Firestore limit)
  const profiles: UserProfile[] = [];
  for (let i = 0; i < followerIds.length; i += 30) {
    const chunk = followerIds.slice(i, i + 30);
    const profilesSnapshot = await firestore()
      .collection('users')
      .where(firestore.FieldPath.documentId(), 'in', chunk)
      .get();

    profiles.push(...profilesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as UserProfile)));
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

  const followingIds = snapshot.docs.map(doc => doc.id);
  if (followingIds.length === 0) return [];

  const profiles: UserProfile[] = [];
  for (let i = 0; i < followingIds.length; i += 30) {
    const chunk = followingIds.slice(i, i + 30);
    const profilesSnapshot = await firestore()
      .collection('users')
      .where(firestore.FieldPath.documentId(), 'in', chunk)
      .get();

    profiles.push(...profilesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as UserProfile)));
  }
  return profiles;
};

// ---- Phone Auth Functions ----

export const signInWithPhoneNumber = async (phoneNumber: string) => {
  const confirmation = await auth().signInWithPhoneNumber(phoneNumber);
  return confirmation;
};

export const verifyOtp = async (
  confirmation: FirebaseAuthTypes.ConfirmationResult,
  code: string
): Promise<{ user: FirebaseAuthTypes.User; profile: UserProfile }> => {
  const credential = await confirmation.confirm(code);
  if (!credential) throw new Error('Invalid OTP code');

  const user = credential.user;
  const profileDoc = await firestore().collection('users').doc(user.uid).get();

  let profile: UserProfile;
  if (!profileDoc.exists) {
    // Create new user profile for phone sign-in
    const now = new Date().toISOString();
    const profileData: Omit<UserProfile, 'id'> = {
      email: user.email || '',
      displayName: user.displayName || 'User',
      username: `user_${user.uid.slice(0, 5)}_${Date.now().toString().slice(-4)}`,
      avatar: user.photoURL || '',
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
      hasCompletedOnboarding: false,
    };
    await firestore().collection('users').doc(user.uid).set(profileData);
    profile = { id: user.uid, ...profileData };
  } else {
    profile = { id: user.uid, ...profileDoc.data() } as UserProfile;
    await firestore().collection('users').doc(user.uid).update({
      isOnline: true,
      updatedAt: firestore.FieldValue.serverTimestamp(),
    });
  }

  return { user, profile };
};

// ---- Security & Account ----

export const reauthenticate = async (password?: string, phoneCredential?: FirebaseAuthTypes.AuthCredential): Promise<void> => {
  const user = auth().currentUser;
  if (!user) throw new Error('No user logged in');

  if (password) {
    if (!user.email) throw new Error('User has no email');
    const credential = auth.EmailAuthProvider.credential(user.email, password);
    await user.reauthenticateWithCredential(credential);
  } else if (phoneCredential) {
    await user.reauthenticateWithCredential(phoneCredential);
  } else {
    throw new Error('No re-authentication method provided');
  }
};

export const firebaseUpdatePassword = async (newPassword: string): Promise<void> => {
  const user = auth().currentUser;
  if (!user) throw new Error('No user logged in');
  await user.updatePassword(newPassword);
};

export const deleteUserAccount = async (): Promise<void> => {
  const user = auth().currentUser;
  if (!user) throw new Error('No user logged in');

  const uid = user.uid;

  // 1. Fetch user posts to delete their images from storage
  try {
    const postsSnapshot = await firestore()
      .collection('posts')
      .where('userId', '==', uid)
      .get();

    for (const doc of postsSnapshot.docs) {
      const data = doc.data();
      if (data.images && Array.isArray(data.images)) {
        for (const imageUrl of data.images) {
          try {
            const ref = storage().refFromURL(imageUrl);
            await ref.delete();
          } catch (e) {
            console.warn('Failed to delete post image:', imageUrl, e);
          }
        }
      }
      // Delete the post document
      await doc.ref.delete();
    }
  } catch (e) {
    console.error('Error cleaning up user posts:', e);
  }

  // 2. Delete user profile and subcollections
  // Note: Firestore doesn't delete subcollections automatically when a parent doc is deleted.
  // In a full production app, you'd use a recursive delete or Cloud Function.
  // Here we do a basic best-effort cleanup.

  const batch = firestore().batch();
  batch.delete(firestore().collection('users').doc(uid));

  // Also remove user from others' following/followers lists if needed
  // This is usually handled by a Cloud Function for performance.

  await batch.commit();

  // 3. Delete from Auth
  await user.delete();
};

// ---- Auth State Listener ----

export const onAuthStateChanged = (
  callback: (user: FirebaseAuthTypes.User | null) => void
) => {
  return auth().onAuthStateChanged(callback);
};
