-- Add GitHub integration columns to profiles table
ALTER TABLE public.profiles 
ADD COLUMN github_access_token TEXT,
ADD COLUMN github_connected_at TIMESTAMP WITH TIME ZONE;

-- Create github_repositories table for storing connected repos
CREATE TABLE public.github_repositories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  github_id INTEGER NOT NULL,
  name TEXT NOT NULL,
  full_name TEXT NOT NULL,
  description TEXT,
  html_url TEXT NOT NULL,
  clone_url TEXT NOT NULL,
  default_branch TEXT DEFAULT 'main',
  private BOOLEAN DEFAULT false,
  language TEXT,
  stars_count INTEGER DEFAULT 0,
  forks_count INTEGER DEFAULT 0,
  is_connected BOOLEAN DEFAULT false,
  connected_at TIMESTAMP WITH TIME ZONE,
  last_scan_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, github_id)
);

-- Enable RLS for github_repositories
ALTER TABLE public.github_repositories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own GitHub repositories" 
ON public.github_repositories 
FOR ALL 
USING (auth.uid() = user_id);

-- Add trigger for timestamps
CREATE TRIGGER update_github_repositories_updated_at
  BEFORE UPDATE ON public.github_repositories
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create app_settings table for global settings like dummy data toggle
CREATE TABLE public.app_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  dummy_data_enabled BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Enable RLS for app_settings
ALTER TABLE public.app_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own app settings" 
ON public.app_settings 
FOR ALL 
USING (auth.uid() = user_id);

-- Add trigger for timestamps
CREATE TRIGGER update_app_settings_updated_at
  BEFORE UPDATE ON public.app_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();