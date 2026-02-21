// ============================================================
// Tutorial Service - Learning Content & Courses
// ============================================================
import firestore from '@react-native-firebase/firestore';
import { Tutorial } from '../types';

export const getTutorials = async (category?: string): Promise<Tutorial[]> => {
    let query = firestore().collection('tutorials');
    if (category && category !== 'All') {
        query = query.where('category', '==', category) as any;
    }
    const snapshot = await query.get();
    return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || doc.data().createdAt,
    })) as Tutorial[];
};

export const getTutorialById = async (id: string): Promise<Tutorial | null> => {
    const doc = await firestore().collection('tutorials').doc(id).get();
    if (!doc.exists) return null;
    const data = doc.data()!;
    return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate?.()?.toISOString() || data.createdAt,
    } as Tutorial;
};
export const subscribeToTutorials = (
    callback: (tutorials: Tutorial[]) => void,
    category?: string
): (() => void) => {
    let query = firestore().collection('tutorials');
    if (category && category !== 'All') {
        query = query.where('category', '==', category) as any;
    }
    return query.onSnapshot(snapshot => {
        const tutorials = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || doc.data().createdAt,
        })) as Tutorial[];
        callback(tutorials);
    });
};
