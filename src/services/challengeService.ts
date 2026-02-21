// ============================================================
// Challenge Service - Community Challenges & Submissions
// ============================================================
import firestore from '@react-native-firebase/firestore';
import { Challenge } from '../types';

export const getChallenges = async (status?: string): Promise<Challenge[]> => {
    let query = firestore().collection('challenges');
    if (status) {
        query = query.where('status', '==', status) as any;
    }
    const snapshot = await query.get();
    return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        startDate: doc.data().startDate?.toDate?.()?.toISOString() || doc.data().startDate,
        endDate: doc.data().endDate?.toDate?.()?.toISOString() || doc.data().endDate,
        votingEndDate: doc.data().votingEndDate?.toDate?.()?.toISOString() || doc.data().votingEndDate,
    })) as Challenge[];
};

export const getChallengeById = async (id: string): Promise<Challenge | null> => {
    const doc = await firestore().collection('challenges').doc(id).get();
    if (!doc.exists) return null;
    const data = doc.data()!;
    return {
        id: doc.id,
        ...data,
        startDate: data.startDate?.toDate?.()?.toISOString() || data.startDate,
        endDate: data.endDate?.toDate?.()?.toISOString() || data.endDate,
        votingEndDate: data.votingEndDate?.toDate?.()?.toISOString() || data.votingEndDate,
    } as Challenge;
};
export const subscribeToChallenges = (
    callback: (challenges: Challenge[]) => void,
    status?: string
): (() => void) => {
    let query = firestore().collection('challenges');
    if (status) {
        query = query.where('status', '==', status) as any;
    }
    return query.onSnapshot(snapshot => {
        const challenges = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            startDate: doc.data().startDate?.toDate?.()?.toISOString() || doc.data().startDate,
            endDate: doc.data().endDate?.toDate?.()?.toISOString() || doc.data().endDate,
            votingEndDate: doc.data().votingEndDate?.toDate?.()?.toISOString() || doc.data().votingEndDate,
        })) as Challenge[];
        callback(challenges);
    });
};
