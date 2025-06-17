-- Revert to original GitHub integration structure
DROP TABLE IF EXISTS public.github_repos CASCADE;

-- Restore GitHub columns to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS github_access_token TEXT,
ADD COLUMN IF NOT EXISTS github_connected_at TIMESTAMP WITH TIME ZONE;