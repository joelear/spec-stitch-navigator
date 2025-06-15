import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Github, Plus, ExternalLink, Trash2 } from 'lucide-react';

interface GitHubRepo {
  id: string;
  repo_name: string;
  repo_url: string;
  description?: string;
  language?: string;
  stars: number;
}

export default function GitHubIntegration() {
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newRepo, setNewRepo] = useState({
    repo_name: '',
    repo_url: '',
    description: '',
    language: '',
    stars: 0
  });
  const { toast } = useToast();

  useEffect(() => {
    loadRepos();
  }, []);

  const loadRepos = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('github_repos')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRepos(data || []);
    } catch (error) {
      console.error('Error loading repos:', error);
      toast({
        title: "Error loading repositories",
        description: "Failed to load GitHub repositories",
        variant: "destructive",
      });
    }
    setIsLoading(false);
  };

  const addRepo = async () => {
    if (!newRepo.repo_name || !newRepo.repo_url) {
      toast({
        title: "Missing information",
        description: "Please provide repository name and URL",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('github_repos')
        .insert([{
          user_id: user.id,
          repo_name: newRepo.repo_name,
          repo_url: newRepo.repo_url,
          description: newRepo.description || null,
          language: newRepo.language || null,
          stars: newRepo.stars || 0
        }]);

      if (error) throw error;

      toast({
        title: "Repository added!",
        description: "GitHub repository has been added successfully",
      });

      setNewRepo({
        repo_name: '',
        repo_url: '',
        description: '',
        language: '',
        stars: 0
      });
      setShowAddForm(false);
      loadRepos();
    } catch (error) {
      console.error('Error adding repo:', error);
      toast({
        title: "Error adding repository",
        description: "Failed to add GitHub repository",
        variant: "destructive",
      });
    }
  };

  const deleteRepo = async (id: string) => {
    try {
      const { error } = await supabase
        .from('github_repos')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Repository removed",
        description: "GitHub repository has been removed",
      });

      loadRepos();
    } catch (error) {
      console.error('Error deleting repo:', error);
      toast({
        title: "Error removing repository",
        description: "Failed to remove GitHub repository",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">GitHub Integration</h1>
        <p className="text-muted-foreground">
          Manage your GitHub repositories for component tracking
        </p>
      </div>

      {/* Add Repository Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Github className="w-5 h-5" />
            GitHub Repositories
          </CardTitle>
          <CardDescription>
            Add and manage your GitHub repositories
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Button 
              onClick={() => setShowAddForm(!showAddForm)}
              className="w-full"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Repository
            </Button>

            {showAddForm && (
              <div className="space-y-4 p-4 border rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="repo_name">Repository Name</Label>
                    <Input
                      id="repo_name"
                      placeholder="my-awesome-repo"
                      value={newRepo.repo_name}
                      onChange={(e) => setNewRepo({ ...newRepo, repo_name: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="repo_url">Repository URL</Label>
                    <Input
                      id="repo_url"
                      placeholder="https://github.com/username/repo"
                      value={newRepo.repo_url}
                      onChange={(e) => setNewRepo({ ...newRepo, repo_url: e.target.value })}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="description">Description (optional)</Label>
                  <Input
                    id="description"
                    placeholder="A brief description of the repository"
                    value={newRepo.description}
                    onChange={(e) => setNewRepo({ ...newRepo, description: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="language">Language (optional)</Label>
                    <Input
                      id="language"
                      placeholder="TypeScript"
                      value={newRepo.language}
                      onChange={(e) => setNewRepo({ ...newRepo, language: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="stars">Stars (optional)</Label>
                    <Input
                      id="stars"
                      type="number"
                      placeholder="0"
                      value={newRepo.stars}
                      onChange={(e) => setNewRepo({ ...newRepo, stars: parseInt(e.target.value) || 0 })}
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button onClick={addRepo}>Add Repository</Button>
                  <Button variant="outline" onClick={() => setShowAddForm(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Repository List */}
      <Card>
        <CardHeader>
          <CardTitle>Your Repositories</CardTitle>
          <CardDescription>
            Manage your tracked GitHub repositories
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : repos.length === 0 ? (
            <div className="text-center p-8">
              <Github className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No repositories added</h3>
              <p className="text-muted-foreground mb-4">
                Add your first GitHub repository to get started
              </p>
              <Button onClick={() => setShowAddForm(true)}>
                Add Repository
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {repos.map((repo) => (
                <div key={repo.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">{repo.repo_name}</h4>
                      {repo.language && (
                        <Badge variant="outline" className="text-xs">
                          {repo.language}
                        </Badge>
                      )}
                      {repo.stars > 0 && (
                        <Badge variant="secondary" className="text-xs">
                          ⭐ {repo.stars}
                        </Badge>
                      )}
                    </div>
                    {repo.description && (
                      <p className="text-sm text-muted-foreground mt-1">
                        {repo.description}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(repo.repo_url, '_blank')}
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      View
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deleteRepo(repo.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}