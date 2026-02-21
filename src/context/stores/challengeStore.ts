// ============================================================
// Challenge Store - Community Challenges State Management
// ============================================================
import { create } from 'zustand';
import { Challenge } from '../../types';
import { getChallenges, getChallengeById } from '../../services/challengeService';

interface ChallengeStore {
    challenges: Challenge[];
    isLoading: boolean;
    loadChallenges: (status?: string) => Promise<void>;
    getChallengeLocal: (id: string) => Challenge | undefined;
}

export const useChallengeStore = create<ChallengeStore>((set, get) => ({
    challenges: [],
    isLoading: false,

    loadChallenges: async (status) => {
        set({ isLoading: true });
        try {
            const results = await getChallenges(status);
            set({ challenges: results, isLoading: false });
        } catch (error) {
            console.error('Error loading challenges:', error);
            set({ challenges: [], isLoading: false });
        }
    },

    getChallengeLocal: (id) => get().challenges.find(c => c.id === id),
}));
