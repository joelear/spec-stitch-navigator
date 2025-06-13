import { useState } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TaggedText } from "@/components/TaggedText";
import { Save, Edit, Eye, Users, FileText, Layers, Plus } from "lucide-react";

const mockFeatureData = {
  "task-management": {
    id: "task-management",
    title: "Task Management",
    version: "v1.2.1",
    status: "Live",
    folder: "Core Features",
    owners: ["Alice", "Bob"],
    lastEdit: "2 hours ago",
    userStories: [
      {
        id: "create-tasks",
        title: "As a user, I want to create tasks",
        description: "So that I can organize my work and track what needs to be done",
        scenarios: [
          {
            id: "create-basic-task",
            name: "Create a basic task",
            type: "given-when-then",
            steps: [
              { type: "given", text: "I am on the {{screen.HomeScreen}}" },
              { type: "and", text: "I am logged in" },
              { type: "when", text: "I click the {{ui.AddTaskButton}}" },
              { type: "then", text: "a new {{ui.TaskCard.Empty}} appears" },
              { type: "and", text: "I can enter task details" }
            ]
          },
          {
            id: "create-task-with-priority",
            name: "Create task with priority",
            type: "given-when-then", 
            steps: [
              { type: "given", text: "I have a new task open" },
              { type: "when", text: "I set the priority to {{ui.PrioritySelector.High}}" },
              { type: "and", text: "I save the task" },
              { type: "then", text: "the task appears with a red priority indicator" }
            ]
          }
        ]
      },
      {
        id: "view-tasks",
        title: "As a user, I want to view my tasks",
        description: "So that I can see what work I have to do",
        scenarios: [
          {
            id: "view-task-list",
            name: "View task list",
            type: "given-when-then",
            steps: [
              { type: "given", text: "I have existing tasks" },
              { type: "when", text: "I navigate to {{screen.TaskListScreen}}" },
              { type: "then", text: "I see all my tasks displayed as {{ui.TaskCard}} components" }
            ]
          },
          {
            id: "filter-tasks",
            name: "Filter tasks by status",
            type: "given-when-then",
            steps: [
              { type: "given", text: "I am viewing my task list" },
              { type: "when", text: "I click the {{ui.TaskFilter.Status}} dropdown" },
              { type: "and", text: "I select 'In Progress'" },
              { type: "then", text: "only tasks with 'In Progress' status are displayed" }
            ]
          }
        ]
      },
      {
        id: "complete-tasks",
        title: "As a user, I want to mark tasks as complete",
        description: "So that I can track my progress",
        scenarios: [
          {
            id: "mark-complete",
            name: "Mark task as complete",
            type: "given-when-then",
            steps: [
              { type: "given", text: "I have a task in progress" },
              { type: "when", text: "I click the {{ui.CheckboxButton}} on the {{ui.TaskCard}}" },
              { type: "then", text: "the task is marked as complete" },
              { type: "and", text: "it moves to the completed section" }
            ]
          }
        ]
      }
    ],
    components: [
      { id: "AddTaskButton", type: "button", variants: [] },
      { id: "TaskCard", type: "card", variants: ["Empty", "InProgress", "Complete"] },
      { id: "TaskFilter", type: "input", variants: ["Status", "Priority"] },
      { id: "TaskDialog", type: "modal", variants: [] },
      { id: "PrioritySelector", type: "select", variants: ["High", "Medium", "Low"] },
      { id: "CheckboxButton", type: "button", variants: [] },
    ],
    screens: [
      { id: "HomeScreen", name: "Home Screen" },
      { id: "TaskListScreen", name: "Task List Screen" },
    ]
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

      <Tabs defaultValue="scenarios" className="space-y-6">
        <TabsList>
          <TabsTrigger value="scenarios">User Stories</TabsTrigger>
          <TabsTrigger value="design">Design</TabsTrigger>
          <TabsTrigger value="components">Components</TabsTrigger>
          <TabsTrigger value="screens">Screens</TabsTrigger>
        </TabsList>

        <TabsContent value="scenarios" className="space-y-6">
          {/* Main Content */}
          {feature.userStories.map((userStory) => (
            <Card key={userStory.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-muted-foreground" />
                    <CardTitle className="text-lg">{userStory.title}</CardTitle>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Scenario
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">{userStory.description}</p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Scenarios */}
                  <div className="space-y-4">
                    {userStory.scenarios.map((scenario) => (
                      <div key={scenario.id} className="border rounded-lg p-4 bg-muted/20">
                        <h4 className="font-medium text-sm mb-3">{scenario.name}</h4>
                        <div className="space-y-2">
                          {scenario.steps.map((step, index) => (
                            <div key={index} className="flex gap-3 text-sm">
                              <span className="text-muted-foreground font-medium capitalize min-w-12">
                                {step.type}:
                              </span>
                              <div className="flex-1">
                                <TaggedText text={step.text} />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Design Preview */}
                  <div className="space-y-4">
                    <h4 className="font-medium text-sm">Design Preview</h4>
                    <div className="border rounded-lg p-4 bg-muted/10 text-center text-muted-foreground">
                      <Layers className="w-8 h-8 mx-auto mb-2" />
                      <p className="text-sm">Design preview will appear here</p>
                      <p className="text-xs">Connect Figma to see designs</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Add User Story Button */}
          <Card className="border-dashed">
            <CardContent className="flex items-center justify-center py-8">
              <Button variant="outline">
                <Plus className="w-4 h-4 mr-2" />
                Add User Story
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="design">
          <Card>
            <CardHeader>
              <CardTitle>Design Files</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-muted-foreground">
                <Layers className="w-12 h-12 mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No design files connected</h3>
                <p className="mb-4">Connect Figma to see design files for this feature</p>
                <Button variant="outline">Connect Figma</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="components">
          <Card>
            <CardHeader>
              <CardTitle>Components</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {feature.components.map((component) => (
                  <div key={component.id} className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">{component.id}</span>
                      <Badge variant="outline" className="text-xs">
                        {component.type}
                      </Badge>
                    </div>
                    {component.variants.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {component.variants.map((variant) => (
                          <Badge key={variant} variant="secondary" className="text-xs">
                            {variant}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="screens">
          <Card>
            <CardHeader>
              <CardTitle>Screens</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {feature.screens.map((screen) => (
                  <div key={screen.id} className="flex items-center gap-2 text-sm">
                    <Layers className="w-4 h-4 text-muted-foreground" />
                    <span>{screen.name}</span>
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