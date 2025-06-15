-- Clean up GitHub integration tables and start fresh
DROP TABLE IF EXISTS public.github_repositories CASCADE;

-- Remove GitHub columns from profiles table
ALTER TABLE public.profiles 
DROP COLUMN IF EXISTS github_access_token,
DROP COLUMN IF EXISTS github_connected_at;

-- Create a simple github_repos table
CREATE TABLE public.github_repos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  repo_name TEXT NOT NULL,
  repo_url TEXT NOT NULL,
  description TEXT,
  language TEXT,
  stars INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.github_repos ENABLE ROW LEVEL SECURITY;

-- Create policy
CREATE POLICY "Users can manage their own GitHub repos" 
ON public.github_repos 
FOR ALL 
USING (auth.uid() = user_id);

-- Add trigger for timestamps
CREATE TRIGGER update_github_repos_updated_at
  BEFORE UPDATE ON public.github_repos
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();