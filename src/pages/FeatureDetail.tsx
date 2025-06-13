import { useState } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Save, Edit, Eye, Users, ChevronDown } from "lucide-react";

const mockFeatureData = {
  "task-management": {
    id: "task-management",
    title: "Task Management",
    version: "v1.2.1",
    status: "Live",
    folder: "Core Features",
    owners: ["Alice", "Bob"],
    lastEdit: "2 hours ago",
    content: `# Task Management Feature

## Overview
This feature enables users to create, manage, and organize their tasks efficiently.

## User Stories

### As a user, I want to create tasks
- I can click the {{ui:AddTaskButton}} to open the task creation dialog
- I can enter a task title and description
- I can assign due dates and priorities

### As a user, I want to view my tasks
- I see all my tasks displayed in {{ui:TodoCard}} components
- I can filter tasks by status, priority, or due date
- I can search through my task list

## Components Used
- {{ui:AddTaskButton}} - Primary action to create new tasks
- {{ui:TodoCard}} - Display individual task information
- {{ui:TaskFilter}} - Filter and search functionality
- {{ui:TaskDialog}} - Modal for task creation/editing

## Acceptance Criteria
- [ ] Users can create tasks with title, description, due date
- [ ] Tasks are saved and persist across sessions
- [ ] Users can mark tasks as complete
- [ ] Completed tasks are visually distinct
- [ ] Users can delete tasks
`,
    components: [
      { id: "AddTaskButton", type: "button" },
      { id: "TodoCard", type: "card" },
      { id: "TaskFilter", type: "input" },
      { id: "TaskDialog", type: "modal" },
    ],
  },
};

export default function FeatureDetail() {
  const { id } = useParams<{ id: string }>();
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState("");
  
  const feature = mockFeatureData[id as keyof typeof mockFeatureData];

  if (!feature) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <h3 className="text-lg font-medium mb-2">Feature not found</h3>
          <p className="text-muted-foreground">The feature "{id}" could not be found.</p>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Live": return "bg-status-success/10 text-status-success";
      case "Draft": return "bg-status-warning/10 text-status-warning";
      case "Deprecated": return "bg-status-error/10 text-status-error";
      default: return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
          <span>Features</span>
          <span>/</span>
          <span>{feature.folder}</span>
          <span>/</span>
          <span>{feature.title}</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-3xl font-bold">{feature.title}</h1>
            <div className="flex items-center gap-2">
              <Select value={feature.version}>
                <SelectTrigger className="w-24">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="v1.2.1">v1.2.1</SelectItem>
                  <SelectItem value="v1.2.0">v1.2.0</SelectItem>
                  <SelectItem value="v1.1.0">v1.1.0</SelectItem>
                </SelectContent>
              </Select>
              <Badge variant="outline" className={getStatusColor(feature.status)}>
                {feature.status}
              </Badge>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant={isEditing ? "default" : "outline"}
              size="sm"
              onClick={() => setIsEditing(!isEditing)}
            >
              {isEditing ? <Save className="w-4 h-4 mr-2" /> : <Edit className="w-4 h-4 mr-2" />}
              {isEditing ? "Save" : "Edit"}
            </Button>
            <Button variant="outline" size="sm">
              <Eye className="w-4 h-4 mr-2" />
              Diff
            </Button>
          </div>
        </div>
        <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
          <span>Updated {feature.lastEdit}</span>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            <div className="flex -space-x-1">
              {feature.owners.map((owner) => (
                <div
                  key={owner}
                  className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-medium border-2 border-background"
                  title={owner}
                >
                  {owner[0]}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Components</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {feature.components.map((component) => (
                  <div key={component.id} className="flex items-center justify-between text-sm">
                    <span>{component.id}</span>
                    <Badge variant="outline" className="text-xs">
                      {component.type}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle>Feature Specification</CardTitle>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <Textarea
                  value={content || feature.content}
                  onChange={(e) => setContent(e.target.value)}
                  className="min-h-[600px] font-mono text-sm"
                  placeholder="Write your feature specification in Markdown..."
                />
              ) : (
                <div className="prose prose-sm max-w-none">
                  <pre className="whitespace-pre-wrap text-sm leading-relaxed">
                    {feature.content}
                  </pre>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}