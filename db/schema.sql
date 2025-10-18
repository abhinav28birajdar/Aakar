-- Aakar Application Database Schema
-- Version: 1.0.0
-- Date: October 18, 2025
-- Updated for Expo SDK 54 compatibility

-- Enable UUID extension for Supabase
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table (extends Supabase auth.users)
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    username TEXT UNIQUE NOT NULL,
    display_name TEXT,
    avatar_url TEXT,
    bio TEXT,
    website TEXT,
    role TEXT NOT NULL DEFAULT 'user',
    is_designer BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create categories table for design categories
CREATE TABLE public.categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    icon TEXT,
    color TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create projects table for user projects
CREATE TABLE public.projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT,
    thumbnail_url TEXT,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    is_public BOOLEAN DEFAULT TRUE,
    view_count INTEGER DEFAULT 0,
    like_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create designs table for actual design items
CREATE TABLE public.designs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT,
    image_url TEXT NOT NULL,
    thumbnail_url TEXT,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    project_id UUID REFERENCES public.projects(id) ON DELETE SET NULL,
    category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
    is_public BOOLEAN DEFAULT TRUE,
    view_count INTEGER DEFAULT 0,
    like_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create comments table for designs
CREATE TABLE public.comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    content TEXT NOT NULL,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    design_id UUID REFERENCES public.designs(id) ON DELETE CASCADE,
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CHECK (
        (design_id IS NOT NULL AND project_id IS NULL) OR
        (project_id IS NOT NULL AND design_id IS NULL)
    )
);

-- Create likes table for designs
CREATE TABLE public.likes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    design_id UUID REFERENCES public.designs(id) ON DELETE CASCADE,
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CHECK (
        (design_id IS NOT NULL AND project_id IS NULL) OR
        (project_id IS NOT NULL AND design_id IS NULL)
    ),
    UNIQUE(user_id, design_id),
    UNIQUE(user_id, project_id)
);

-- Create saved items table for bookmarks
CREATE TABLE public.saved_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    design_id UUID REFERENCES public.designs(id) ON DELETE CASCADE,
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CHECK (
        (design_id IS NOT NULL AND project_id IS NULL) OR
        (project_id IS NOT NULL AND design_id IS NULL)
    ),
    UNIQUE(user_id, design_id),
    UNIQUE(user_id, project_id)
);

-- Create tags table
CREATE TABLE public.tags (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create design_tags junction table
CREATE TABLE public.design_tags (
    design_id UUID REFERENCES public.designs(id) ON DELETE CASCADE,
    tag_id UUID REFERENCES public.tags(id) ON DELETE CASCADE,
    PRIMARY KEY (design_id, tag_id)
);

-- Create notifications table
CREATE TABLE public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    type TEXT NOT NULL,
    content TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    related_user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    design_id UUID REFERENCES public.designs(id) ON DELETE SET NULL,
    project_id UUID REFERENCES public.projects(id) ON DELETE SET NULL,
    comment_id UUID REFERENCES public.comments(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create followers table
CREATE TABLE public.followers (
    follower_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    following_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    PRIMARY KEY (follower_id, following_id),
    CHECK (follower_id != following_id)
);

-- Add RLS (Row Level Security) policies
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.designs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.followers ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Public profiles are viewable by everyone" 
ON public.profiles FOR SELECT USING (true);

CREATE POLICY "Users can update their own profile" 
ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Projects policies
CREATE POLICY "Public projects are viewable by everyone" 
ON public.projects FOR SELECT USING (is_public = true);

CREATE POLICY "Users can view their own private projects" 
ON public.projects FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own projects" 
ON public.projects FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own projects" 
ON public.projects FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own projects" 
ON public.projects FOR DELETE USING (auth.uid() = user_id);

-- Designs policies
CREATE POLICY "Public designs are viewable by everyone" 
ON public.designs FOR SELECT USING (is_public = true);

CREATE POLICY "Users can view their own private designs" 
ON public.designs FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own designs" 
ON public.designs FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own designs" 
ON public.designs FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own designs" 
ON public.designs FOR DELETE USING (auth.uid() = user_id);

-- Add indexes for performance
CREATE INDEX idx_designs_user_id ON public.designs(user_id);
CREATE INDEX idx_designs_project_id ON public.designs(project_id);
CREATE INDEX idx_designs_category_id ON public.designs(category_id);
CREATE INDEX idx_projects_user_id ON public.projects(user_id);
CREATE INDEX idx_comments_design_id ON public.comments(design_id);
CREATE INDEX idx_comments_project_id ON public.comments(project_id);
CREATE INDEX idx_likes_design_id ON public.likes(design_id);
CREATE INDEX idx_likes_project_id ON public.likes(project_id);

-- Add trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_updated_at
BEFORE UPDATE ON public.projects
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_designs_updated_at
BEFORE UPDATE ON public.designs
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_comments_updated_at
BEFORE UPDATE ON public.comments
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Add trigger to increment/decrement like_count
CREATE OR REPLACE FUNCTION update_like_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        IF NEW.design_id IS NOT NULL THEN
            UPDATE public.designs SET like_count = like_count + 1 WHERE id = NEW.design_id;
        ELSIF NEW.project_id IS NOT NULL THEN
            UPDATE public.projects SET like_count = like_count + 1 WHERE id = NEW.project_id;
        END IF;
    ELSIF TG_OP = 'DELETE' THEN
        IF OLD.design_id IS NOT NULL THEN
            UPDATE public.designs SET like_count = like_count - 1 WHERE id = OLD.design_id;
        ELSIF OLD.project_id IS NOT NULL THEN
            UPDATE public.projects SET like_count = like_count - 1 WHERE id = OLD.project_id;
        END IF;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_design_like_count
AFTER INSERT OR DELETE ON public.likes
FOR EACH ROW
EXECUTE FUNCTION update_like_count();

-- Insert some default categories
INSERT INTO public.categories (name, description, icon, color) 
VALUES 
('UI Design', 'User interface designs for web and mobile', 'layout', '#3498db'),
('Illustrations', 'Digital and hand-drawn illustrations', 'image', '#e74c3c'),
('Typography', 'Font and typography focused designs', 'type', '#9b59b6'),
('3D', 'Three-dimensional designs and renderings', 'cube', '#2ecc71'),
('Icons', 'Icon sets and individual icons', 'aperture', '#f39c12'),
('Branding', 'Logo designs and brand identity', 'briefcase', '#1abc9c'),
('Motion', 'Animation and motion graphics', 'video', '#e67e22'),
('Photography', 'Digital photography and photo manipulation', 'camera', '#34495e')
ON CONFLICT (name) DO NOTHING;