import { useParams, useNavigate } from "react-router-dom";
import { StatCard } from "@/components/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/StatusBadge";
import { 
  GitBranch, 
  Grid3X3, 
  FileText, 
  Bell,
  Clock,
  Settings,
  ExternalLink
} from "lucide-react";

const mockData = {
  lastScan: "2 hours ago",
  components: 24,
  screens: 12,
  features: 8,
  driftIssues: 3,
  activity: [
    {
      id: "1",
      type: "scan",
      message: "Repository scan completed",
      timestamp: "2 hours ago",
    },
    {
      id: "2", 
      type: "drift",
      message: "AddTaskButton design changed in Figma",
      timestamp: "1 day ago",
    },
    {
      id: "3",
      type: "feature",
      message: "New feature 'User Onboarding' created",
      timestamp: "2 days ago",
    },
  ],
  integrations: {
    figma: { connected: true, files: 2, status: "synced" },
    storybook: { connected: true, url: "https://storybook.example.com", status: "synced" },
  }
};

export default function RepoDashboard() {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
          <span>Repos</span>
          <span>/</span>
          <span>my-org/react-app</span>
        </div>
        <h1 className="text-3xl font-bold">Repository Dashboard</h1>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <StatCard
          title="Last Scan"
          value={mockData.lastScan}
          icon={Clock}
        />
        <StatCard
          title="Components"
          value={mockData.components}
          icon={Grid3X3}
          onClick={() => navigate('/components')}
        />
        <StatCard
          title="Screens"
          value={mockData.screens}
          icon={FileText}
        />
        <StatCard
          title="Features"
          value={mockData.features}
          icon={FileText}
          onClick={() => navigate('/features')}
        />
        <StatCard
          title="Drift Issues"
          value={mockData.driftIssues}
          icon={Bell}
          onClick={() => navigate('/changes')}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Activity Feed */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockData.activity.map((item) => (
                <div key={item.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-accent/50 transition-colors">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm">{item.message}</p>
                    <p className="text-xs text-muted-foreground">{item.timestamp}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Integrations */}
        <Card>
          <CardHeader>
            <CardTitle>Integrations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                    <span className="text-sm font-bold text-purple-700">F</span>
                  </div>
                  <div>
                    <p className="font-medium">Figma</p>
                    <p className="text-sm text-muted-foreground">{mockData.integrations.figma.files} files connected</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <StatusBadge status={mockData.integrations.figma.status as any} />
                  <Button variant="ghost" size="sm">
                    <Settings className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                    <span className="text-sm font-bold text-orange-700">S</span>
                  </div>
                  <div>
                    <p className="font-medium">Storybook</p>
                    <p className="text-sm text-muted-foreground">Connected to live instance</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <StatusBadge status={mockData.integrations.storybook.status as any} />
                  <Button variant="ghost" size="sm">
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}