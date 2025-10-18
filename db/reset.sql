-- Aakar Application Database Reset Script
-- Version: 1.0.0
-- Date: October 18, 2025
-- Use this script to reset the database to a clean state

-- Drop existing tables in reverse order of dependencies
DROP TABLE IF EXISTS public.design_tags CASCADE;
DROP TABLE IF EXISTS public.followers CASCADE;
DROP TABLE IF EXISTS public.notifications CASCADE;
DROP TABLE IF EXISTS public.saved_items CASCADE;
DROP TABLE IF EXISTS public.likes CASCADE;
DROP TABLE IF EXISTS public.comments CASCADE;
DROP TABLE IF EXISTS public.designs CASCADE;
DROP TABLE IF EXISTS public.projects CASCADE;
DROP TABLE IF EXISTS public.tags CASCADE;
DROP TABLE IF EXISTS public.categories CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;

-- Drop triggers and functions
DROP TRIGGER IF EXISTS update_design_like_count ON public.likes;
DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
DROP TRIGGER IF EXISTS update_projects_updated_at ON public.projects;
DROP TRIGGER IF EXISTS update_designs_updated_at ON public.designs;
DROP TRIGGER IF EXISTS update_comments_updated_at ON public.comments;

DROP FUNCTION IF EXISTS update_like_count();
DROP FUNCTION IF EXISTS update_updated_at_column();

-- Now you can run the schema.sql script to recreate the database
-- Example: psql -U postgres -d aakar -f schema.sql