import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/StatusBadge";
import { Settings, ExternalLink, Plus } from "lucide-react";

const integrations = [
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
  {
    id: "github",
    name: "GitHub",
    description: "Repository and webhook management",
    icon: "G",
    iconColor: "bg-gray-100 text-gray-700",
    connected: true,
    status: "synced", 
    details: "3 repositories connected",
  },
];

export default function Integrations() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Integrations</h1>
        <p className="text-muted-foreground">Connect external tools and services</p>
      </div>

      <div className="grid gap-6">
        {integrations.map((integration) => (
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
  );
}