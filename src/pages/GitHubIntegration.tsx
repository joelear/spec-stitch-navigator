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
      <div className="p-6 max-w-4xl mx-auto space-y-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">GitHub Integration</h1>
          <p className="text-muted-foreground">
            Connect your GitHub account to browse and manage repositories
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Github className="w-5 h-5" />
              Connect to GitHub
            </CardTitle>
            <CardDescription>
              Connect your GitHub account to access your repositories
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center p-8">
              <Github className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">GitHub Not Connected</h3>
              <p className="text-muted-foreground mb-6">
                Connect your GitHub account to browse and track your repositories
              </p>
              <Button onClick={connectToGitHub} size="lg">
                <Github className="w-4 h-4 mr-2" />
                Connect GitHub
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">GitHub Integration</h1>
        <p className="text-muted-foreground">
          Browse and manage your GitHub repositories
        </p>
        {profile?.github_username && (
          <p className="text-sm text-muted-foreground mt-1">
            Connected as {profile.github_username}
          </p>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Github className="w-5 h-5" />
            Your Repositories
          </CardTitle>
          <CardDescription>
            Browse your GitHub repositories
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Button onClick={loadRepositories} disabled={isLoading}>
              {isLoading ? 'Loading...' : 'Refresh Repositories'}
            </Button>

            {isLoading ? (
              <div className="flex items-center justify-center p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : repos.length === 0 ? (
              <div className="text-center p-8">
                <GitBranch className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No repositories found</h3>
                <p className="text-muted-foreground mb-4">
                  Click "Refresh Repositories" to load your GitHub repositories
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {repos.map((repo) => (
                  <div key={repo.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium">{repo.name}</h4>
                        {repo.private && (
                          <Badge variant="secondary" className="text-xs">
                            Private
                          </Badge>
                        )}
                        {repo.language && (
                          <Badge variant="outline" className="text-xs">
                            {repo.language}
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-1">
                        {repo.full_name}
                      </p>
                      {repo.description && (
                        <p className="text-sm text-muted-foreground">
                          {repo.description}
                        </p>
                      )}
                      <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
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
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(repo.html_url, '_blank')}
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        View
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}