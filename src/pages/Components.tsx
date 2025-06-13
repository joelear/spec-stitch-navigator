import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/StatusBadge";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Grid3X3, Filter } from "lucide-react";
import { useNavigate } from "react-router-dom";

const mockComponents = [
  {
    id: "AddTaskButton",
    type: "button",
    status: "synced",
    features: 3,
    lastUpdated: "2 hours ago",
    hasStorybook: true,
    hasFigma: true,
  },
  {
    id: "TodoCard", 
    type: "card",
    status: "drift",
    features: 2,
    lastUpdated: "1 day ago",
    hasStorybook: true,
    hasFigma: true,
  },
  {
    id: "UserAvatar",
    type: "image",
    status: "synced", 
    features: 5,
    lastUpdated: "3 hours ago",
    hasStorybook: false,
    hasFigma: true,
  },
  {
    id: "NavigationBar",
    type: "navigation",
    status: "new",
    features: 1,
    lastUpdated: "30 minutes ago",
    hasStorybook: false,
    hasFigma: false,
  },
];

const componentTypes = ["All", "button", "card", "image", "navigation"];
const statusTypes = ["All", "synced", "drift", "new"];

export default function Components() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const navigate = useNavigate();

  const filteredComponents = mockComponents.filter(component => {
    const matchesSearch = component.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === "All" || component.type === selectedType;
    const matchesStatus = selectedStatus === "All" || component.status === selectedStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Components</h1>
        <p className="text-muted-foreground">Catalog of reusable UI components</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search components..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        
        <div className="flex gap-2">
          <div className="flex gap-1">
            {componentTypes.map(type => (
              <Button
                key={type}
                variant={selectedType === type ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedType(type)}
              >
                {type}
              </Button>
            ))}
          </div>
          
          <div className="flex gap-1">
            {statusTypes.map(status => (
              <Button
                key={status}
                variant={selectedStatus === status ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedStatus(status)}
              >
                {status}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Components Grid */}
      {filteredComponents.length === 0 ? (
        <div className="text-center py-12">
          <Grid3X3 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">No components found</h3>
          <p className="text-muted-foreground">
            {searchTerm || selectedType !== "All" || selectedStatus !== "All" 
              ? "Try adjusting your filters" 
              : "Run a repository scan to discover components"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredComponents.map((component) => (
            <Card 
              key={component.id}
              className="cursor-pointer hover:bg-accent/50 transition-colors"
              onClick={() => navigate(`/components/${component.id}`)}
            >
              <CardContent className="p-4">
                <div className="aspect-video bg-muted rounded-lg mb-3 flex items-center justify-center">
                  <Grid3X3 className="w-8 h-8 text-muted-foreground" />
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">{component.id}</h3>
                    <StatusBadge status={component.status as any} />
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">
                      {component.type}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {component.features} features
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>Updated {component.lastUpdated}</span>
                    <div className="flex gap-1">
                      {component.hasStorybook && (
                        <div className="w-2 h-2 bg-orange-500 rounded-full" title="Has Storybook" />
                      )}
                      {component.hasFigma && (
                        <div className="w-2 h-2 bg-purple-500 rounded-full" title="Has Figma" />
                      )}
                    </div>
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