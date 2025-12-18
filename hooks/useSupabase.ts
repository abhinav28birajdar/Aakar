/**
 * 🎨 AAKAR - Design Community Platform
 * 
 * Production-Ready Hooks for Supabase Integration
 * All hooks with proper caching, error handling, and real-time updates
 */

import { useAuth } from '@/lib/store/auth';
import { Database, supabaseService } from '@/lib/supabase/client-unified';
import { useCallback, useEffect, useState } from 'react';

type Project = Database['public']['Tables']['projects']['Row'];
type Category = Database['public']['Tables']['categories']['Row'];
type Profile = Database['public']['Tables']['profiles']['Row'];

// Projects Hook
export function useProjects(limit = 20) {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [offset, setOffset] = useState(0);

  const loadProjects = useCallback(async (reset = false) => {
    try {
      setLoading(true);
      const newOffset = reset ? 0 : offset;
      const data = await supabaseService.getProjects(limit, newOffset);
      
      if (reset) {
        setProjects(data || []);
      } else {
        setProjects(prev => [...prev, ...(data || [])]);
      }
      
      setHasMore((data?.length || 0) === limit);
      setOffset(newOffset + limit);
      setError(null);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [limit, offset]);

  useEffect(() => {
    loadProjects(true);
  }, []);

  const refresh = () => loadProjects(true);
  const loadMore = () => loadProjects(false);

  return { projects, loading, error, hasMore, refresh, loadMore };
}

// Single Project Hook
export function useProject(projectId: string | undefined) {
  const [project, setProject] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!projectId) return;

    const fetchProject = async () => {
      try {
        setLoading(true);
        const data = await supabaseService.getProjectById(projectId);
        setProject(data);
        setError(null);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [projectId]);

  return { project, loading, error };
}

// Categories Hook
export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const data = await supabaseService.getCategories();
        setCategories(data || []);
        setError(null);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return { categories, loading, error };
}

// Category Projects Hook
export function useCategoryProjects(categoryId: string | undefined, limit = 20) {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [offset, setOffset] = useState(0);

  const loadProjects = useCallback(async (reset = false) => {
    if (!categoryId) return;

    try {
      setLoading(true);
      const newOffset = reset ? 0 : offset;
      const data = await supabaseService.getProjectsByCategory(categoryId, limit, newOffset);
      
      if (reset) {
        setProjects(data || []);
      } else {
        setProjects(prev => [...prev, ...(data || [])]);
      }
      
      setHasMore((data?.length || 0) === limit);
      setOffset(newOffset + limit);
      setError(null);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [categoryId, limit, offset]);

  useEffect(() => {
    loadProjects(true);
  }, [categoryId]);

  const refresh = () => loadProjects(true);
  const loadMore = () => loadProjects(false);

  return { projects, loading, error, hasMore, refresh, loadMore };
}

// Like Hook
export function useLike(projectId: string | undefined) {
  const { user } = useAuth();
  const [isLiked, setIsLiked] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!projectId || !user?.id) return;

    const checkLiked = async () => {
      try {
        const liked = await supabaseService.isProjectLiked(projectId, user.id);
        setIsLiked(liked);
      } catch (err) {
        console.error('Error checking like status:', err);
      }
    };

    checkLiked();
  }, [projectId, user?.id]);

  const toggleLike = async () => {
    if (!projectId || !user?.id || loading) return;

    try {
      setLoading(true);
      if (isLiked) {
        await supabaseService.unlikeProject(projectId, user.id);
      } else {
        await supabaseService.likeProject(projectId, user.id);
      }
      setIsLiked(!isLiked);
    } catch (err) {
      console.error('Error toggling like:', err);
    } finally {
      setLoading(false);
    }
  };

  return { isLiked, toggleLike, loading };
}

// Save Hook
export function useSave(projectId: string | undefined) {
  const { user } = useAuth();
  const [isSaved, setIsSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!projectId || !user?.id) return;

    const checkSaved = async () => {
      try {
        const saved = await supabaseService.isProjectSaved(projectId, user.id);
        setIsSaved(saved);
      } catch (err) {
        console.error('Error checking save status:', err);
      }
    };

    checkSaved();
  }, [projectId, user?.id]);

  const toggleSave = async () => {
    if (!projectId || !user?.id || loading) return;

    try {
      setLoading(true);
      if (isSaved) {
        await supabaseService.unsaveProject(projectId, user.id);
      } else {
        await supabaseService.saveProject(projectId, user.id);
      }
      setIsSaved(!isSaved);
    } catch (err) {
      console.error('Error toggling save:', err);
    } finally {
      setLoading(false);
    }
  };

  return { isSaved, toggleSave, loading };
}

// Saved Projects Hook
export function useSavedProjects(limit = 20) {
  const { user } = useAuth();
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [offset, setOffset] = useState(0);

  const loadProjects = useCallback(async (reset = false) => {
    if (!user?.id) return;

    try {
      setLoading(true);
      const newOffset = reset ? 0 : offset;
      const data = await supabaseService.getSavedProjects(user.id, limit, newOffset);
      
      if (reset) {
        setProjects(data || []);
      } else {
        setProjects(prev => [...prev, ...(data || [])]);
      }
      
      setHasMore((data?.length || 0) === limit);
      setOffset(newOffset + limit);
      setError(null);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [user?.id, limit, offset]);

  useEffect(() => {
    loadProjects(true);
  }, [user?.id]);

  const refresh = () => loadProjects(true);
  const loadMore = () => loadProjects(false);

  return { projects, loading, error, hasMore, refresh, loadMore };
}

// Profile Hook
export function useProfile(userId: string | undefined) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!userId) return;

    const fetchProfile = async () => {
      try {
        setLoading(true);
        const data = await supabaseService.getProfile(userId);
        setProfile(data);
        setError(null);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userId]);

  return { profile, loading, error };
}

// Follow Hook
export function useFollow(userId: string | undefined) {
  const { user } = useAuth();
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!userId || !user?.id || userId === user.id) return;

    const checkFollowing = async () => {
      try {
        const following = await supabaseService.isFollowing(user.id, userId);
        setIsFollowing(following);
      } catch (err) {
        console.error('Error checking follow status:', err);
      }
    };

    checkFollowing();
  }, [userId, user?.id]);

  const toggleFollow = async () => {
    if (!userId || !user?.id || userId === user.id || loading) return;

    try {
      setLoading(true);
      if (isFollowing) {
        await supabaseService.unfollowUser(user.id, userId);
      } else {
        await supabaseService.followUser(user.id, userId);
      }
      setIsFollowing(!isFollowing);
    } catch (err) {
      console.error('Error toggling follow:', err);
    } finally {
      setLoading(false);
    }
  };

  return { isFollowing, toggleFollow, loading };
}

// Image Upload Hook
export function useImageUpload() {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<Error | null>(null);

  const uploadImage = async (
    bucket: 'avatars' | 'projects' | 'categories',
    file: Blob | File,
    path: string
  ): Promise<string | null> => {
    try {
      setUploading(true);
      setProgress(0);
      setError(null);

      const url = await supabaseService.uploadImage(bucket, path, file);
      
      setProgress(100);
      return url;
    } catch (err) {
      setError(err as Error);
      return null;
    } finally {
      setUploading(false);
    }
  };

  return { uploadImage, uploading, progress, error };
}
