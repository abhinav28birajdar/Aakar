// ============================================================
// Job Store - Recruitment & Opportunities State
// ============================================================
import { create } from 'zustand';
import { Job } from '../../types';
import { getJobs, searchJobs, createJob } from '../../services/jobService';

interface JobStore {
    jobs: Job[];
    searchResults: Job[];
    isLoading: boolean;
    error: string | null;

    // Actions
    loadJobs: () => Promise<void>;
    searchJobs: (query: string) => Promise<void>;
    addJob: (job: Omit<Job, 'id' | 'createdAt' | 'applicantsCount'>) => Promise<{ success: boolean; error?: string }>;
    clearSearch: () => void;
}

export const useJobStore = create<JobStore>((set, get) => ({
    jobs: [],
    searchResults: [],
    isLoading: false,
    error: null,

    loadJobs: async () => {
        set({ isLoading: true, error: null });
        try {
            const jobs = await getJobs();
            set({ jobs, isLoading: false });
        } catch (error: any) {
            console.error('Error loading jobs:', error);
            set({ isLoading: false, error: error.message || 'Failed to load jobs' });
        }
    },

    searchJobs: async (query) => {
        if (!query) {
            set({ searchResults: [] });
            return;
        }
        set({ isLoading: true });
        try {
            const results = await searchJobs(query);
            set({ searchResults: results, isLoading: false });
        } catch (error: any) {
            console.error('Error searching jobs:', error);
            set({ isLoading: false, error: 'Search failed' });
        }
    },

    addJob: async (jobData) => {
        set({ isLoading: true });
        try {
            const id = await createJob(jobData);
            // Optimistically update or reload
            const newJob: Job = {
                id,
                ...jobData,
                applicantsCount: 0,
                createdAt: new Date().toISOString(),
            } as Job;
            set(state => ({
                jobs: [newJob, ...state.jobs],
                isLoading: false
            }));
            return { success: true };
        } catch (error: any) {
            set({ isLoading: false, error: error.message });
            return { success: false, error: error.message };
        }
    },

    clearSearch: () => set({ searchResults: [] }),
}));
