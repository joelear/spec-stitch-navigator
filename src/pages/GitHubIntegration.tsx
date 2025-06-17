import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Github, ExternalLink, GitBranch, Star } from 'lucide-react';

interface GitHubRepo {
  id: string;
  name: string;
  full_name: string;
  description?: string;
  html_url: string;
  language?: string;
  stargazers_count: number;
  updated_at: string;
  private: boolean;
}

interface GitHubProfile {
  github_username?: string;
  github_access_token?: string;
  github_connected_at?: string;
}

export default function GitHubIntegration() {
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [profile, setProfile] = useState<GitHubProfile | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    checkGitHubConnection();
  }, []);

  const checkGitHubConnection = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profileData, error } = await supabase
        .from('profiles')
        .select('github_username, github_access_token, github_connected_at')
        .eq('user_id', user.id)
        .single();

      console.log('Profile data from database:', profileData);
      console.log('Profile query error:', error);

      if (profileData?.github_access_token) {
        console.log('GitHub connection found, setting connected state');
        setIsConnected(true);
        setProfile(profileData);
        loadRepositories();
      }
    } catch (error) {
      console.error('Error checking GitHub connection:', error);
    }
  };

  const connectToGitHub = () => {
    const clientId = 'Ov23liwfKGw3Z9hKw9Lg';
    const redirectUri = encodeURIComponent(window.location.origin + '/integrations/github');
    const scope = 'read:user,repo';
    
    window.location.href = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}`;
  };

  const loadRepositories = async () => {
    console.log('=== FRONTEND: Loading repositories ===');
    setIsLoading(true);
    try {
      console.log('Making request to github-repos function...');
      const { data, error } = await supabase.functions.invoke('github-repos');
      
      console.log('Full response from github-repos function:', { data, error });
      console.log('Response data:', data);
      console.log('Response error:', error);
      
      if (error) {
        console.log('Supabase function error:', error);
        console.log('Error message:', error.message);
        console.log('Error context:', error.context);
        throw error;
      }

      if (data?.repositories) {
        setRepos(data.repositories);
        toast({
          title: "Repositories loaded",
          description: `Found ${data.repositories.length} repositories`,
        });
      }
    } catch (error) {
      console.error('Error in loadRepositories:', error);
      toast({
        title: "Error loading repositories",
        description: "Failed to load GitHub repositories",
        variant: "destructive",
      });
    }
    setIsLoading(false);
  };

  // Handle OAuth callback
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    
    if (code && !isConnected) {
      handleOAuthCallback(code);
    }
  }, [isConnected]);

  const handleOAuthCallback = async (code: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('github-connect', {
        body: { code }
      });

      if (error) throw error;

      if (data?.success) {
        toast({
          title: "GitHub Connected!",
          description: `Successfully connected to GitHub as ${data.username}`,
        });
        
        // Clean up URL
        window.history.replaceState({}, document.title, window.location.pathname);
        
        // Refresh connection status
        checkGitHubConnection();
      }
    } catch (error) {
      console.error('Error connecting to GitHub:', error);
      toast({
        title: "Connection failed",
        description: "Failed to connect to GitHub",
        variant: "destructive",
      });
    }
  };

  if (!isConnected) {
    return (
      <div className="flex flex-col h-full">
        {/* Top Bar */}
        <div className="top-bar">
          <h1 className="page-title">Integrations</h1>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6 bg-background-2">
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Connection Card */}
            <div className="new-card">
              <div className="flex items-center gap-3 mb-3">
                <Github className="w-5 h-5 text-foreground-2" />
                <h2 className="new-card-title">Connect to GitHub</h2>
              </div>
              <p className="new-card-text mb-6">
                Connect your GitHub account to access your repositories
              </p>
              
              <div className="text-center p-8">
                <Github className="w-16 h-16 text-foreground-3 mx-auto mb-4" />
                <h3 className="new-card-title mb-2">GitHub Not Connected</h3>
                <p className="new-card-text mb-6">
                  Connect your GitHub account to browse and track your repositories
                </p>
                <button onClick={connectToGitHub} className="toolbar-button">
                  <Github className="w-3.5 h-3.5" />
                  Connect GitHub
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Top Bar */}
      <div className="top-bar">
        <h1 className="page-title">Integrations</h1>
      </div>

      {/* Toolbar */}
      <div className="border-b border-line bg-background px-4 py-3">
        <div className="flex items-center gap-4">
          <button 
            onClick={loadRepositories} 
            disabled={isLoading}
            className="toolbar-button"
          >
            <Github className="w-3.5 h-3.5" />
            {isLoading ? 'Loading...' : 'Refresh Repositories'}
          </button>
          {profile?.github_username && (
            <span className="text-sm text-foreground-3">
              Connected as {profile.github_username}
            </span>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 bg-background-2">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* GitHub Card */}
          <div className="new-card">
            <div className="flex items-center gap-3 mb-3">
              <Github className="w-5 h-5 text-foreground-2" />
              <h2 className="new-card-title">Your Repositories</h2>
            </div>
            <p className="new-card-text mb-4">
              Browse your GitHub repositories
            </p>

            {isLoading ? (
              <div className="flex items-center justify-center p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : repos.length === 0 ? (
              <div className="text-center p-8">
                <GitBranch className="w-12 h-12 text-foreground-3 mx-auto mb-4" />
                <h3 className="new-card-title mb-2">No repositories found</h3>
                <p className="new-card-text mb-4">
                  Click "Refresh Repositories" to load your GitHub repositories
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {repos.map((repo) => (
                  <div key={repo.id} className="flex items-center justify-between p-4 bg-background rounded-xl border border-line hover:bg-background-2 transition-colors">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="new-card-title">{repo.name}</h4>
                        {repo.private && (
                          <span className="status-badge bg-gray-100 text-gray-700">
                            Private
                          </span>
                        )}
                        {repo.language && (
                          <span className="status-badge bg-blue-100 text-blue-700">
                            {repo.language}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-foreground-3 mb-1">
                        {repo.full_name}
                      </p>
                      {repo.description && (
                        <p className="new-card-text">
                          {repo.description}
                        </p>
                      )}
                      <div className="flex items-center gap-4 mt-2 text-xs text-foreground-3">
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3" />
                          {repo.stargazers_count}
                        </div>
                        <div>
                          Updated {new Date(repo.updated_at).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => window.open(repo.html_url, '_blank')}
                        className="toolbar-button"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        View
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}