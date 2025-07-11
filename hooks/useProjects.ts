import { useState, useEffect, useCallback } from 'react';
import { db } from '@/lib/firebase';
import { collection, query, where, orderBy, getDocs, doc, getDoc } from 'firebase/firestore';

export interface Project {
  id: string;
  title: string;
  designer: string;
  designerId: string;
  category: string;
  imageUrl: string;
  backgroundColor: string;
  aspectRatio: number;
  description: string;
  likes: number;
  views: number;
  isFeatured: boolean;
  createdAt: any; // Firestore timestamp
}

export const useProjects = (categoryId?: string) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProjects = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      let projectsQuery = query(collection(db, 'projects'), orderBy('createdAt', 'desc'));

      if (categoryId) {
        projectsQuery = query(collection(db, 'projects'), where('category', '==', categoryId), orderBy('createdAt', 'desc'));
      }

      const snapshot = await getDocs(projectsQuery);
      const fetchedProjects = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Project[];

      setProjects(fetchedProjects);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch projects');
    } finally {
      setIsLoading(false);
    }
  }, [categoryId]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const getProjectById = useCallback(async (id: string) => {
    try {
      const projectDoc = await getDoc(doc(db, 'projects', id));
      if (projectDoc.exists()) {
        return { id: projectDoc.id, ...projectDoc.data() } as Project;
      }
      return null;
    } catch (error) {
      console.error("Error fetching project by ID:", error);
      return null;
    }
  }, []);

  const toggleSaveProject = useCallback(async (projectId: string, userId: string) => {
    // This is a placeholder for the actual implementation
    console.log(`Toggled save for project ${projectId} by user ${userId}`);
  }, []);

  return {
    projects,
    isLoading,
    error,
    refreshProjects: fetchProjects,
    getProjectById,
    toggleSaveProject,
  };
};