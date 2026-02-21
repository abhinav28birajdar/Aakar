// ============================================================
// Job Service - Recruitment & Opportunities
// ============================================================
import firestore from '@react-native-firebase/firestore';
import { Job } from '../types';

export const getJobs = async (limit = 20): Promise<Job[]> => {
    const snapshot = await firestore()
        .collection('jobs')
        .orderBy('createdAt', 'desc')
        .limit(limit)
        .get();

    return snapshot.docs.map(doc => {
        const data = doc.data();
        return {
            id: doc.id,
            ...data,
            createdAt: data.createdAt?.toDate?.()?.toISOString() || data.createdAt,
            expiresAt: data.expiresAt?.toDate?.()?.toISOString() || data.expiresAt,
        };
    }) as Job[];
};

export const getJobById = async (id: string): Promise<Job | null> => {
    const doc = await firestore().collection('jobs').doc(id).get();
    if (!doc.exists) return null;

    const data = doc.data()!;
    return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate?.()?.toISOString() || data.createdAt,
        expiresAt: data.expiresAt?.toDate?.()?.toISOString() || data.expiresAt,
    } as Job;
};

export const searchJobs = async (query: string): Promise<Job[]> => {
    const q = query.toLowerCase();
    // Simple client-side filtering for now as Firestore doesn't support full-text search natively well without Algolia/Typesense
    // For small datasets, this is fine. For production, consider Algolia.
    // For this demo, we'll fetch latest 50 and filter.

    // Using title prefix search as a basic optimization
    const snapshot = await firestore()
        .collection('jobs')
        .orderBy('title')
        .startAt(query)
        .endAt(query + '\uf8ff')
        .limit(20)
        .get();

    return snapshot.docs.map(doc => {
        const data = doc.data();
        return {
            id: doc.id,
            ...data,
            createdAt: data.createdAt?.toDate?.()?.toISOString() || data.createdAt,
            expiresAt: data.expiresAt?.toDate?.()?.toISOString() || data.expiresAt,
        };
    }) as Job[];
};

export const createJob = async (jobData: Omit<Job, 'id' | 'createdAt' | 'applicantsCount'>): Promise<string> => {
    const now = firestore.FieldValue.serverTimestamp();
    const docRef = await firestore().collection('jobs').add({
        ...jobData,
        applicantsCount: 0,
        createdAt: now,
    });
    return docRef.id;
};
