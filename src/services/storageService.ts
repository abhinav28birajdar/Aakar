// ============================================================
// Firebase Storage Service - Aakar Platform
// ============================================================
import storage from '@react-native-firebase/storage';

/**
 * Uploads a file to Firebase Storage
 * @param uri Local file URI
 * @param path Storage path (e.g. 'avatars/uid/avatar.jpg')
 * @returns Download URL
 */
export const uploadFile = async (uri: string, path: string): Promise<string> => {
    try {
        const ref = storage().ref(path);
        await ref.putFile(uri);
        return await ref.getDownloadURL();
    } catch (error: any) {
        console.error('Storage Upload Error:', error);
        throw new Error(error.message || 'Failed to upload file');
    }
};

/**
 * Deletes a file from Firebase Storage
 * @param url Full download URL or storage path
 */
export const deleteFile = async (url: string): Promise<void> => {
    try {
        const ref = url.startsWith('http') ? storage().refFromURL(url) : storage().ref(url);
        await ref.delete();
    } catch (error) {
        console.warn('Storage Delete Error (often safe to ignore if file missing):', error);
    }
};

/**
 * Helper to upload user avatar
 */
export const uploadUserAvatar = async (uid: string, uri: string): Promise<string> => {
    const extension = uri.split('.').pop() || 'jpg';
    const path = `avatars/${uid}/avatar_${Date.now()}.${extension}`;
    return uploadFile(uri, path);
};

/**
 * Helper to upload user cover photo
 */
export const uploadUserCover = async (uid: string, uri: string): Promise<string> => {
    const extension = uri.split('.').pop() || 'jpg';
    const path = `covers/${uid}/cover_${Date.now()}.${extension}`;
    return uploadFile(uri, path);
};

/**
 * Helper to upload post image
 */
export const uploadPostImage = async (uid: string, uri: string, index: number): Promise<string> => {
    const extension = uri.split('.').pop() || 'jpg';
    const path = `posts/${uid}/${Date.now()}_${index}.${extension}`;
    return uploadFile(uri, path);
};
