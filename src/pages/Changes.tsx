import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/StatusBadge";
import { Bell, AlertTriangle, Plus, Check, ExternalLink } from "lucide-react";

const mockChanges = [
  // Changes detected from external sources (design/code)
  {
    id: "1",
    type: "Design",
    source: "detected", // detected from external sources
    severity: "warning",
    title: "AddTaskButton design changed",
    description: "Button color and padding updated in Figma",
    timestamp: "2 hours ago",
    status: "unresolved",
    component: "AddTaskButton",
  },
  {
    id: "2", 
    type: "Code",
    source: "detected",
    severity: "info",
    title: "New component detected",
    description: "NavigationBar component found in latest scan",
    timestamp: "4 hours ago", 
    status: "unresolved",
    component: "NavigationBar",
  },
  {
    id: "3",
    type: "Spec",
    source: "detected",
    severity: "error", 
    title: "TodoCard prop removed",
    description: "isCompleted prop no longer exists in code but referenced in feature spec",
    timestamp: "1 day ago",
    status: "unresolved",
    component: "TodoCard",
  },
  {
    id: "4",
    type: "Design",
    source: "detected",
    severity: "success",
    title: "UserAvatar design synced",
    description: "Design updates successfully implemented in code",
    timestamp: "2 days ago",
    status: "resolved",
    component: "UserAvatar",
  },
  // Changes initiated from specs
  {
    id: "5",
    type: "Feature",
    source: "spec", // initiated from spec changes
    severity: "info",
    title: "New user onboarding flow",
    description: "Feature spec created - needs design and development",
    timestamp: "1 hour ago",
    status: "design",
    component: "OnboardingWizard",
    stage: "design", // design -> development -> complete
  },
  {
    id: "6",
    type: "Feature",
    source: "spec",
    severity: "warning",
    title: "Task filtering enhancement",
    description: "Spec updated with new filtering requirements",
    timestamp: "3 hours ago",
    status: "development",
    component: "TaskFilter",
    stage: "development",
  },
];

const filters = ["All", "Unresolved", "Mine"];
const categories = ["All", "Design", "Code", "Spec", "Feature"];
const sources = ["All", "Detected", "Spec-driven"];

export default function Changes() {
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedSource, setSelectedSource] = useState("All");

  const filteredChanges = mockChanges.filter(change => {
    const matchesFilter = selectedFilter === "All" || 
      (selectedFilter === "Unresolved" && change.status === "unresolved") ||
      (selectedFilter === "Mine" && change.status === "unresolved"); // Mock logic
    const matchesCategory = selectedCategory === "All" || change.type === selectedCategory;
    const matchesSource = selectedSource === "All" || 
      (selectedSource === "Detected" && change.source === "detected") ||
      (selectedSource === "Spec-driven" && change.source === "spec");
    return matchesFilter && matchesCategory && matchesSource;
  });

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "error": return <AlertTriangle className="w-4 h-4 text-status-error" />;
      case "warning": return <AlertTriangle className="w-4 h-4 text-status-warning" />;
      case "info": return <Plus className="w-4 h-4 text-status-info" />;
      case "success": return <Check className="w-4 h-4 text-status-success" />;
      default: return <Bell className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "error": return "border-l-status-error";
      case "warning": return "border-l-status-warning";
      case "info": return "border-l-status-info";
      case "success": return "border-l-status-success";
      default: return "border-l-muted";
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <h1 className="text-3xl font-bold">Changes</h1>
          <Badge variant="secondary" className="bg-status-warning/10 text-status-warning">
            {filteredChanges.filter(c => c.status === "unresolved").length} unresolved
          </Badge>
        </div>
        <p className="text-muted-foreground">Track drift and changes across your codebase</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex gap-1">
          {filters.map(filter => (
            <Button
              key={filter}
              variant={selectedFilter === filter ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedFilter(filter)}
            >
              {filter}
            </Button>
          ))}
        </div>
        
        <div className="flex gap-1">
          {categories.map(category => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Button>
          ))}
        </div>

        <div className="flex gap-1">
          {sources.map(source => (
            <Button
              key={source}
              variant={selectedSource === source ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedSource(source)}
            >
              {source}
            </Button>
          ))}
        </div>
      </div>

      {/* Changes List */}
      {filteredChanges.length === 0 ? (
        <div className="text-center py-12">
          <Bell className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">No changes found</h3>
          <p className="text-muted-foreground">
            {selectedFilter !== "All" || selectedCategory !== "All"
              ? "Try adjusting your filters"
              : "All changes have been resolved"}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredChanges.map((change) => (
            <Card 
              key={change.id}
              className={`border-l-4 ${getSeverityColor(change.severity)} cursor-pointer hover:bg-accent/50 transition-colors`}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    {getSeverityIcon(change.severity)}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium">{change.title}</h3>
                        <Badge variant="outline" className="text-xs">
                          {change.type}
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          {change.source === "detected" ? "Detected" : "Spec-driven"}
                        </Badge>
                        {change.source === "spec" && change.stage && (
                          <Badge variant="outline" className="text-xs capitalize">
                            {change.stage}
                          </Badge>
                        )}
                        {change.status === "resolved" && (
                          <StatusBadge status="synced" />
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{change.description}</p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>{change.timestamp}</span>
                        <span>Component: {change.component}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {change.source === "detected" && change.status === "unresolved" && (
                      <Button variant="outline" size="sm">
                        Resolve
                      </Button>
                    )}
                    {change.source === "spec" && (
                      <Button variant="outline" size="sm">
                        {change.stage === "design" ? "Start Design" : 
                         change.stage === "development" ? "Start Development" : 
                         "View Details"}
                      </Button>
                    )}
                    <Button variant="ghost" size="sm">
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}