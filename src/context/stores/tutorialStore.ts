// ============================================================
// Tutorial Store - Learning Content State Management
// ============================================================
import { create } from 'zustand';
import { Tutorial } from '../../types';
import { getTutorials, getTutorialById } from '../../services/tutorialService';

interface TutorialStore {
    tutorials: Tutorial[];
    isLoading: boolean;
    loadTutorials: (category?: string) => Promise<void>;
    getTutorialLocal: (id: string) => Tutorial | undefined;
}

export const useTutorialStore = create<TutorialStore>((set, get) => ({
    tutorials: [],
    isLoading: false,

    loadTutorials: async (category) => {
        set({ isLoading: true });
        try {
            const results = await getTutorials(category);
            set({ tutorials: results, isLoading: false });
        } catch (error) {
            console.error('Error loading tutorials:', error);
            set({ tutorials: [], isLoading: false });
        }
    },

    getTutorialLocal: (id) => get().tutorials.find(t => t.id === id),
}));
