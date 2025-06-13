import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/StatusBadge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useDummyData } from "@/contexts/DummyDataContext";
import { Settings, ExternalLink, Plus, GitBranch, Github } from "lucide-react";
import { Link } from "react-router-dom";

const coreIntegrations = [
  {
    id: "repos",
    name: "Repositories",
    description: "Manage connected repositories",
    icon: GitBranch,
    iconColor: "bg-blue-100 text-blue-700",
    url: "/integrations/repos",
    details: "View and manage your connected repositories",
  },
  {
    id: "github",
    name: "GitHub",
    description: "Connect GitHub account and scan repositories",
    icon: Github,
    iconColor: "bg-gray-100 text-gray-700",
    url: "/integrations/github",
    details: "Connect to automatically scan and catalog components",
  },
];

const externalIntegrations = [
  {
    id: "figma",
    name: "Figma",
    description: "Design file synchronization",
    icon: "F",
    iconColor: "bg-purple-100 text-purple-700",
    connected: true,
    status: "synced",
    details: "2 files connected",
  },
  {
    id: "storybook", 
    name: "Storybook",
    description: "Component story synchronization",
    icon: "S",
    iconColor: "bg-orange-100 text-orange-700", 
    connected: true,
    status: "synced",
    details: "https://storybook.example.com",
  },
];

export default function Integrations() {
  const { isDummyDataEnabled, toggleDummyData, loading } = useDummyData();

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Integrations</h1>
        <p className="text-muted-foreground">Connect and manage your external tools and services</p>
      </div>

      {/* Developer Settings */}
      <Card className="mb-6 border-orange-200 bg-orange-50/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-orange-700">
            <Settings className="w-5 h-5" />
            Developer Settings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="dummy-data" className="text-sm font-medium">
                Enable Dummy Data
              </Label>
              <p className="text-xs text-muted-foreground">
                Show sample data while building and testing the UI
              </p>
            </div>
            <Switch
              id="dummy-data"
              checked={isDummyDataEnabled}
              onCheckedChange={toggleDummyData}
              disabled={loading}
            />
          </div>
        </CardContent>
      </Card>

      {/* Core Integrations */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Core Integrations</h2>
        <div className="grid gap-4">
          {coreIntegrations.map((integration) => {
            const IconComponent = integration.icon;
            return (
              <Card key={integration.id} className="hover:bg-accent/50 transition-colors">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${integration.iconColor}`}>
                        <IconComponent className="w-6 h-6" />
                      </div>
                      <div>
                        <CardTitle>{integration.name}</CardTitle>
                        <p className="text-sm text-muted-foreground">{integration.description}</p>
                      </div>
                    </div>
                    <Button asChild variant="outline" size="sm">
                      <Link to={integration.url}>
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Open
                      </Link>
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{integration.details}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* External Integrations */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">External Integrations</h2>
        <div className="grid gap-4">
          {externalIntegrations.map((integration) => (
            <Card key={integration.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${integration.iconColor}`}>
                      <span className="text-lg font-bold">{integration.icon}</span>
                    </div>
                    <div>
                      <CardTitle>{integration.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">{integration.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusBadge status={integration.status as any} />
                    <Button variant="outline" size="sm">
                      <Settings className="w-4 h-4 mr-2" />
                      Manage
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">{integration.details}</p>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Open
                    </Button>
                    <Button variant="outline" size="sm">
                      Sync Now
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Add New Integration */}
          <Card className="border-dashed">
            <CardContent className="flex items-center justify-center p-8">
              <div className="text-center">
                <Plus className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                <h3 className="font-medium mb-1">Add Integration</h3>
                <p className="text-sm text-muted-foreground mb-4">Connect additional tools and services</p>
                <Button variant="outline">
                  <Plus className="w-4 h-4 mr-2" />
                  Browse Integrations
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}