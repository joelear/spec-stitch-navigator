import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/StatusBadge";
import { Copy, ExternalLink, Grid3X3 } from "lucide-react";

const mockComponentData = {
  AddTaskButton: {
    id: "AddTaskButton",
    type: "button",
    status: "synced",
    lastModified: "2 hours ago",
    hasFigma: true,
    hasStorybook: true,
    features: [
      { id: "task-management", name: "Task Management", screens: ["Home", "Task List"] },
      { id: "quick-add", name: "Quick Add", screens: ["Home"] },
    ],
    code: `export function AddTaskButton({ 
  onClick, 
  disabled = false,
  variant = "primary" 
}: AddTaskButtonProps) {
  return (
    <button
      className={cn(
        "px-4 py-2 rounded-lg font-medium transition-colors",
        variant === "primary" && "bg-primary text-primary-foreground hover:bg-primary/90",
        disabled && "opacity-50 cursor-not-allowed"
      )}
      onClick={onClick}
      disabled={disabled}
    >
      Add Task
    </button>
  );
}`,
  },
};

export default function ComponentDetail() {
  const { id } = useParams<{ id: string }>();
  const component = mockComponentData[id as keyof typeof mockComponentData];

  if (!component) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <Grid3X3 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">Component not found</h3>
          <p className="text-muted-foreground">The component "{id}" could not be found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
          <span>Components</span>
          <span>/</span>
          <span>{component.id}</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-3xl font-bold">{component.id}</h1>
            <Badge variant="outline">{component.type}</Badge>
            <StatusBadge status={component.status as any} />
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Copy className="w-4 h-4 mr-2" />
              Copy ID
            </Button>
            <Button variant="outline" size="sm">
              <ExternalLink className="w-4 h-4 mr-2" />
              View in GitHub
            </Button>
          </div>
        </div>
        <p className="text-muted-foreground mt-2">Last modified {component.lastModified}</p>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="design" className="space-y-6">
        <TabsList>
          <TabsTrigger value="design" disabled={!component.hasFigma}>
            Design
          </TabsTrigger>
          <TabsTrigger value="story" disabled={!component.hasStorybook}>
            Story
          </TabsTrigger>
          <TabsTrigger value="code">Code</TabsTrigger>
          <TabsTrigger value="features">Features</TabsTrigger>
        </TabsList>

        <TabsContent value="design" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Figma Design</CardTitle>
            </CardHeader>
            <CardContent>
              {component.hasFigma ? (
                <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                  <p className="text-muted-foreground">Figma embed would load here</p>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No Figma design linked</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="story" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Storybook Story</CardTitle>
            </CardHeader>
            <CardContent>
              {component.hasStorybook ? (
                <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                  <p className="text-muted-foreground">Storybook iframe would load here</p>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No Storybook story available</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="code" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Source Code</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                <code>{component.code}</code>
              </pre>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="features" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Used in Features</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {component.features.map((feature) => (
                  <div key={feature.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <h4 className="font-medium">{feature.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        Used in: {feature.screens.join(", ")}
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      View Feature
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}