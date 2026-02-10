// ============================================================
// Social Authentication Service - Google & Apple Sign-In
// ============================================================
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { appleAuth } from '@invertase/react-native-apple-authentication';
import firestore from '@react-native-firebase/firestore';
import { Platform } from 'react-native';
import { UserProfile } from '../types';

// ============================================================
// Google Sign-In Configuration
// ============================================================

/**
 * Configure Google Sign-In
 * Call this on app initialization
 * @param webClientId - Your Firebase Web Client ID from google-services.json
 */
export const configureGoogleSignIn = (webClientId: string) => {
    GoogleSignin.configure({
        webClientId,
        offlineAccess: true,
    });
};

/**
 * Sign in with Google
 * @returns Firebase user and profile data
 */
export const signInWithGoogle = async (): Promise<{
    user: FirebaseAuthTypes.User;
    profile: UserProfile;
    isNewUser: boolean;
}> => {
    try {
        // Check if device supports Google Play
        await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });

        // Get user info from Google
        const signInResult = await GoogleSignin.signIn();
        const idToken = signInResult.data?.idToken;
        const googleUser = signInResult.data?.user;

        if (!idToken) {
            throw new Error('No ID token received from Google');
        }

        // Create Firebase credential
        const googleCredential = auth.GoogleAuthProvider.credential(idToken);

        // Sign in to Firebase
        const userCredential = await auth().signInWithCredential(googleCredential);
        const firebaseUser = userCredential.user;
        const isNewUser = userCredential.additionalUserInfo?.isNewUser || false;

        // Check if user profile exists in Firestore
        const profileDoc = await firestore().collection('users').doc(firebaseUser.uid).get();

        let profile: UserProfile;

        if (!profileDoc.exists || isNewUser) {
            // Create new user profile
            const now = new Date().toISOString();
            const username = generateUsernameFromEmail(firebaseUser.email || '');

            const profileData: Omit<UserProfile, 'id'> = {
                email: firebaseUser.email || '',
                displayName: firebaseUser.displayName || (googleUser?.name ?? '') || '',
                username,
                avatar: firebaseUser.photoURL || googleUser?.photo || '',
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

            await firestore().collection('users').doc(firebaseUser.uid).set(profileData);
            profile = { id: firebaseUser.uid, ...profileData };
        } else {
            // Get existing profile
            profile = { id: profileDoc.id, ...profileDoc.data() } as UserProfile;

            // Update online status
            await firestore().collection('users').doc(firebaseUser.uid).update({
                isOnline: true,
                updatedAt: firestore.FieldValue.serverTimestamp(),
            });
        }

        return { user: firebaseUser, profile, isNewUser };
    } catch (error: any) {
        console.error('Google Sign-In Error:', error);
        throw new Error(error.message || 'Google sign-in failed');
    }
};

/**
 * Sign out from Google
 */
export const signOutFromGoogle = async (): Promise<void> => {
    try {
        await GoogleSignin.signOut();
    } catch (error) {
        console.error('Google Sign-Out Error:', error);
    }
};

// ============================================================
// Apple Sign-In (iOS only)
// ============================================================

/**
 * Check if Apple Sign-In is supported
 * @returns true if supported (iOS 13+)
 */
export const isAppleSignInSupported = (): boolean => {
    return Platform.OS === 'ios' && appleAuth.isSupported;
};

/**
 * Sign in with Apple
 * @returns Firebase user and profile data
 */
export const signInWithApple = async (): Promise<{
    user: FirebaseAuthTypes.User;
    profile: UserProfile;
    isNewUser: boolean;
}> => {
    try {
        if (!isAppleSignInSupported()) {
            throw new Error('Apple Sign-In is not supported on this device');
        }

        // Start Apple Sign-In request
        const appleAuthRequestResponse = await appleAuth.performRequest({
            requestedOperation: appleAuth.Operation.LOGIN,
            requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
        });

        // Ensure we have an identity token
        if (!appleAuthRequestResponse.identityToken) {
            throw new Error('Apple Sign-In failed - no identity token returned');
        }

        // Create Firebase credential
        const { identityToken, nonce } = appleAuthRequestResponse;
        const appleCredential = auth.AppleAuthProvider.credential(identityToken, nonce);

        // Sign in to Firebase
        const userCredential = await auth().signInWithCredential(appleCredential);
        const firebaseUser = userCredential.user;
        const isNewUser = userCredential.additionalUserInfo?.isNewUser || false;

        // Check if user profile exists in Firestore
        const profileDoc = await firestore().collection('users').doc(firebaseUser.uid).get();

        let profile: UserProfile;

        if (!profileDoc.exists || isNewUser) {
            // Create new user profile
            const now = new Date().toISOString();

            // Apple may not provide email on subsequent logins
            const email = firebaseUser.email || appleAuthRequestResponse.email || '';
            const fullName = appleAuthRequestResponse.fullName;
            const displayName = fullName
                ? `${fullName.givenName || ''} ${fullName.familyName || ''}`.trim()
                : firebaseUser.displayName || 'Apple User';

            const username = generateUsernameFromEmail(email || firebaseUser.uid);

            const profileData: Omit<UserProfile, 'id'> = {
                email,
                displayName,
                username,
                avatar: firebaseUser.photoURL || '',
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

            await firestore().collection('users').doc(firebaseUser.uid).set(profileData);
            profile = { id: firebaseUser.uid, ...profileData };
        } else {
            // Get existing profile
            profile = { id: profileDoc.id, ...profileDoc.data() } as UserProfile;

            // Update online status
            await firestore().collection('users').doc(firebaseUser.uid).update({
                isOnline: true,
                updatedAt: firestore.FieldValue.serverTimestamp(),
            });
        }

        return { user: firebaseUser, profile, isNewUser };
    } catch (error: any) {
        console.error('Apple Sign-In Error:', error);
        throw new Error(error.message || 'Apple sign-in failed');
    }
};

// ============================================================
// Helper Functions
// ============================================================

/**
 * Generate a unique username from email
 * @param email - User's email address
 * @returns Generated username
 */
const generateUsernameFromEmail = (email: string): string => {
    if (!email) {
        return `user_${Date.now()}`;
    }

    const baseUsername = email.split('@')[0].toLowerCase().replace(/[^a-z0-9_]/g, '_');
    const randomSuffix = Math.floor(Math.random() * 9999);
    return `${baseUsername}_${randomSuffix}`;
};

/**
 * Check if username is already taken and generate unique one if needed
 * @param baseUsername - Base username to check
 * @returns Available username
 */
export const ensureUniqueUsername = async (baseUsername: string): Promise<string> => {
    let username = baseUsername.toLowerCase();
    let counter = 1;

    while (true) {
        const snapshot = await firestore()
            .collection('users')
            .where('username', '==', username)
            .limit(1)
            .get();

        if (snapshot.empty) {
            return username;
        }

        username = `${baseUsername}_${counter}`;
        counter++;
    }
};

/**
 * Get current Google user info (if signed in)
 */
export const getCurrentGoogleUser = async () => {
    try {
        const userInfo = await GoogleSignin.signInSilently();
        return userInfo;
    } catch (error) {
        return null;
    }
};

export const isSignedInWithGoogle = async (): Promise<boolean> => {
    return await GoogleSignin.hasPreviousSignIn();
};
