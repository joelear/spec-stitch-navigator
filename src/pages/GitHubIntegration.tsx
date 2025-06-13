import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Github, Scan, Download, CheckCircle } from 'lucide-react';

export default function GitHubIntegration() {
  const [githubToken, setGithubToken] = useState('');
  const [repoUrl, setRepoUrl] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [scanResults, setScanResults] = useState<any>(null);
  const { toast } = useToast();

  const handleScanRepository = async () => {
    if (!repoUrl) {
      toast({
        title: "Repository URL required",
        description: "Please enter a GitHub repository URL",
        variant: "destructive",
      });
      return;
    }

    setIsScanning(true);
    
    // Simulate scanning process
    setTimeout(() => {
      setScanResults({
        components: [
          { name: 'Button', type: 'button', variants: ['primary', 'secondary'] },
          { name: 'Card', type: 'card', variants: ['default', 'elevated'] },
          { name: 'Input', type: 'input', variants: ['text', 'email', 'password'] },
        ],
        features: [
          { name: 'User Authentication', type: 'feature', stories: 3 },
          { name: 'Dashboard', type: 'feature', stories: 5 },
          { name: 'Settings', type: 'feature', stories: 2 },
        ]
      });
      setIsScanning(false);
      toast({
        title: "Scan completed!",
        description: "Found components and features in your repository.",
      });
    }, 3000);
  };

  const handleSaveToSupabase = async () => {
    toast({
      title: "Saved to database!",
      description: "Components and features have been saved to your account.",
    });
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">GitHub Integration</h1>
        <p className="text-muted-foreground">
          Connect your GitHub repositories to automatically scan and catalog UI components and features
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Github className="w-5 h-5" />
              Repository Scanner
            </CardTitle>
            <CardDescription>
              Scan a GitHub repository to extract UI components and features
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="github-token">GitHub Personal Access Token (Optional)</Label>
              <Input
                id="github-token"
                type="password"
                placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                value={githubToken}
                onChange={(e) => setGithubToken(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Required for private repositories
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="repo-url">Repository URL</Label>
              <Input
                id="repo-url"
                placeholder="https://github.com/username/repository"
                value={repoUrl}
                onChange={(e) => setRepoUrl(e.target.value)}
              />
            </div>
            
            <Button 
              onClick={handleScanRepository} 
              className="w-full"
              disabled={isScanning}
            >
              {isScanning ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Scanning Repository...
                </>
              ) : (
                <>
                  <Scan className="w-4 h-4 mr-2" />
                  Scan Repository
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {scanResults && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                Scan Results
              </CardTitle>
              <CardDescription>
                Found {scanResults.components.length} components and {scanResults.features.length} features
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Components</h4>
                <div className="space-y-2">
                  {scanResults.components.map((component: any, index: number) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-muted rounded">
                      <span className="font-medium">{component.name}</span>
                      <div className="flex gap-1">
                        <Badge variant="secondary">{component.type}</Badge>
                        <Badge variant="outline">{component.variants.length} variants</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Features</h4>
                <div className="space-y-2">
                  {scanResults.features.map((feature: any, index: number) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-muted rounded">
                      <span className="font-medium">{feature.name}</span>
                      <Badge variant="outline">{feature.stories} stories</Badge>
                    </div>
                  ))}
                </div>
              </div>
              
              <Button onClick={handleSaveToSupabase} className="w-full">
                <Download className="w-4 h-4 mr-2" />
                Save to Database
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}