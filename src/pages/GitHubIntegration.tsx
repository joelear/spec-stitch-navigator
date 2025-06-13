import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Github, Scan, Download, CheckCircle, ExternalLink, Link as LinkIcon, Unlink } from 'lucide-react';

export default function GitHubIntegration() {
  const [isConnected, setIsConnected] = useState(false);
  const [githubUsername, setGithubUsername] = useState('');
  const [repositories, setRepositories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    checkGitHubConnection();
  }, []);

  const checkGitHubConnection = async () => {
    try {
      const { data } = await supabase
        .from('profiles')
        .select('github_username, github_connected_at')
        .single();
      
      if (data?.github_username) {
        setIsConnected(true);
        setGithubUsername(data.github_username);
        loadRepositories();
      }
    } catch (error) {
      console.error('Error checking GitHub connection:', error);
    }
  };

  const connectGitHub = () => {
    const clientId = 'Ov23liMx9QoU06bIIGt4'; // Your actual GitHub client ID (safe to expose)
    const redirectUri = `${window.location.origin}/integrations/github`;
    const scope = 'repo';
    
    const authUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}`;
    window.location.href = authUrl;
  };

  const loadRepositories = async () => {
    setIsLoading(true);
    try {
      const { data } = await supabase.functions.invoke('github-repos', {
        method: 'GET'
      });
      
      if (data?.repositories) {
        setRepositories(data.repositories);
      }
    } catch (error) {
      toast({
        title: "Error loading repositories",
        description: "Failed to fetch GitHub repositories",
        variant: "destructive",
      });
    }
    setIsLoading(false);
  };

  const connectRepository = async (repoId: number) => {
    try {
      await supabase.functions.invoke('github-repos', {
        method: 'POST',
        body: { repoId, action: 'connect' }
      });
      
      toast({
        title: "Repository connected!",
        description: "Repository has been linked to your account",
      });
      
      loadRepositories();
    } catch (error) {
      toast({
        title: "Error connecting repository",
        description: "Failed to connect repository",
        variant: "destructive",
      });
    }
  };

  const scanRepository = async (repoId: number) => {
    setIsScanning(true);
    
    // TODO: Implement actual repository scanning
    // This would analyze the repository structure and extract components/features
    setTimeout(() => {
      toast({
        title: "Scan completed!",
        description: "Repository has been scanned for components and features.",
      });
      setIsScanning(false);
    }, 3000);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">GitHub Integration</h1>
        <p className="text-muted-foreground">
          Connect your GitHub account to automatically scan and catalog UI components and features
        </p>
      </div>

      {!isConnected ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Github className="w-5 h-5" />
              Connect GitHub Account
            </CardTitle>
            <CardDescription>
              Authorize access to your GitHub repositories to automatically scan for components and features
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={connectGitHub} className="w-full">
              <Github className="w-4 h-4 mr-2" />
              Connect GitHub Account
            </Button>
            <p className="text-xs text-muted-foreground mt-2">
              This will redirect you to GitHub to authorize the application
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {/* GitHub Account Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                GitHub Connected
              </CardTitle>
              <CardDescription>
                Connected as @{githubUsername}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={loadRepositories} disabled={isLoading}>
                  Refresh Repositories
                </Button>
                <Button variant="ghost" size="sm">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  View on GitHub
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Repositories List */}
          <Card>
            <CardHeader>
              <CardTitle>Your Repositories</CardTitle>
              <CardDescription>
                Select repositories to connect and scan for UI components
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center p-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : repositories.length === 0 ? (
                <div className="text-center p-8">
                  <Github className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No repositories found</h3>
                  <p className="text-muted-foreground mb-4">
                    No repositories are available in your GitHub account
                  </p>
                  <Button onClick={loadRepositories}>
                    Refresh Repositories
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {repositories.map((repo) => (
                    <div key={repo.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium">{repo.full_name}</h4>
                          {repo.private && <Badge variant="secondary" className="text-xs">Private</Badge>}
                          {repo.language && <Badge variant="outline" className="text-xs">{repo.language}</Badge>}
                        </div>
                        {repo.description && (
                          <p className="text-sm text-muted-foreground mt-1">{repo.description}</p>
                        )}
                        <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                          <span>⭐ {repo.stargazers_count}</span>
                          <span>🍴 {repo.forks_count}</span>
                          <span>Updated: {new Date(repo.updated_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => connectRepository(repo.id)}
                        >
                          <LinkIcon className="w-4 h-4 mr-2" />
                          Connect
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => scanRepository(repo.id)}
                          disabled={isScanning}
                        >
                          {isScanning ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                          ) : (
                            <Scan className="w-4 h-4 mr-2" />
                          )}
                          Scan
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}