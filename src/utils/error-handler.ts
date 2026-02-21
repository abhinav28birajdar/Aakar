import { Alert } from 'react-native';

export class AppError extends Error {
    code?: string;
    constructor(message: string, code?: string) {
        super(message);
        this.name = 'AppError';
        this.code = code;
    }
}

/**
 * Production-safe error logger
 * Only logs to console in development mode
 */
const logError = (title: string, error: any) => {
    if (__DEV__) {
        console.error(`[${title}]:`, error);
    }
    // In production, send to crash reporting service (Sentry, Crashlytics, etc.)
};

/**
 * Get user-friendly error message from Firebase error codes
 */
const getFirebaseErrorMessage = (code: string): string | null => {
    const errorMessages: Record<string, string> = {
        // Auth errors
        'auth/wrong-password': 'Invalid password.',
        'auth/user-not-found': 'No account found with this email.',
        'auth/email-already-in-use': 'An account with this email already exists.',
        'auth/weak-password': 'Password should be at least 6 characters.',
        'auth/invalid-email': 'Please enter a valid email address.',
        'auth/user-disabled': 'This account has been disabled.',
        'auth/too-many-requests': 'Too many attempts. Please try again later.',
        'auth/network-request-failed': 'Network error. Please check your connection.',
        'auth/requires-recent-login': 'Please sign in again to continue.',
        'auth/invalid-credential': 'Invalid credentials. Please try again.',

        // Firestore errors
        'permission-denied': 'You don\'t have permission to perform this action.',
        'not-found': 'The requested resource was not found.',
        'already-exists': 'This resource already exists.',
        'resource-exhausted': 'Quota exceeded. Please try again later.',
        'unauthenticated': 'Please sign in to continue.',

        // Storage errors
        'storage/unauthorized': 'You don\'t have permission to access this file.',
        'storage/canceled': 'Upload was canceled.',
        'storage/unknown': 'An unknown error occurred during upload.',
        'storage/object-not-found': 'File not found.',
        'storage/quota-exceeded': 'Storage quota exceeded.',
        'storage/unauthenticated': 'Please sign in to upload files.',
    };

    return errorMessages[code] || null;
};

/**
 * Global error handler with production-safe logging and user-friendly messages
 */
export const handleError = (error: any, title = 'Error') => {
    // Log error in development only
    logError(title, error);

    let message = 'An unexpected error occurred. Please try again.';

    // Handle custom AppError
    if (error instanceof AppError) {
        message = error.message;
    }
    // Handle string errors
    else if (typeof error === 'string') {
        message = error;
    }
    // Handle Firebase errors
    else if (error?.code) {
        const firebaseMessage = getFirebaseErrorMessage(error.code);
        if (firebaseMessage) {
            message = firebaseMessage;
        } else if (error.message) {
            message = error.message;
        }
    }
    // Handle generic errors with message
    else if (error?.message) {
        message = error.message;
    }

    Alert.alert(title, message);
};

/**
 * Silent error handler for non-critical errors
 * Logs but doesn't show alert to user
 */
export const handleSilentError = (error: any, context: string) => {
    logError(context, error);
    // In production, send to crash reporting
};
