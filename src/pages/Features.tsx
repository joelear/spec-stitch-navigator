import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, FileText, FolderOpen, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

const mockFolders = [
  {
    id: "core-features",
    name: "Core Features",
    features: [
      {
        id: "task-management",
        title: "Task Management",
        version: "v1.2.1",
        status: "Live",
        owners: ["Alice", "Bob"],
        lastEdit: "2 hours ago",
        userStories: 3,
        scenarios: 8,
      },
      {
        id: "settings-panel",
        title: "Settings Panel", 
        version: "v2.0.0",
        status: "Live",
        owners: ["Alice", "Dave"],
        lastEdit: "3 days ago",
        userStories: 5,
        scenarios: 12,
      },
    ]
  },
  {
    id: "user-experience",
    name: "User Experience",
    features: [
      {
        id: "user-onboarding",
        title: "User Onboarding",
        version: "v0.3.0",
        status: "Draft",
        owners: ["Charlie"],
        lastEdit: "1 day ago",
        userStories: 4,
        scenarios: 6,
      },
    ]
  },
];

const folderNames = ["All", ...mockFolders.map(f => f.name)];

export default function Features() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFolder, setSelectedFolder] = useState("All");
  const navigate = useNavigate();

  const filteredFolders = mockFolders.map(folder => ({
    ...folder,
    features: folder.features.filter(feature => {
      const matchesSearch = feature.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFolder = selectedFolder === "All" || folder.name === selectedFolder;
      return matchesSearch && matchesFolder;
    })
  })).filter(folder => folder.features.length > 0);

  const allFeatures = mockFolders.flatMap(folder => 
    folder.features.map(feature => ({ ...feature, folderName: folder.name }))
  );
  
  const hasResults = filteredFolders.length > 0;

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
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Features</h1>
          <p className="text-muted-foreground">Product specifications and requirements</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          New Feature
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search features..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        
        <div className="flex gap-1">
          {folderNames.map(folder => (
            <Button
              key={folder}
              variant={selectedFolder === folder ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedFolder(folder)}
            >
              <FolderOpen className="w-4 h-4 mr-1" />
              {folder}
            </Button>
          ))}
        </div>
      </div>

      {/* Features List */}
      {!hasResults ? (
        <div className="text-center py-12">
          <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">No features found</h3>
          <p className="text-muted-foreground mb-4">
            {searchTerm || selectedFolder !== "All"
              ? "Try adjusting your search or folder filter"
              : "Create your first feature specification"}
          </p>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            New Feature
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredFolders.map((folder) => (
            <div key={folder.id}>
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <FolderOpen className="w-5 h-5" />
                {folder.name}
              </h2>
              <div className="grid gap-4">
                {folder.features.map((feature) => (
                  <Card 
                    key={feature.id}
                    className="cursor-pointer hover:bg-accent/50 transition-colors"
                    onClick={() => navigate(`/features/${feature.id}`)}
                  >
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <FileText className="w-5 h-5 text-muted-foreground" />
                          <div>
                            <CardTitle className="text-lg">{feature.title}</CardTitle>
                            <p className="text-sm text-muted-foreground">{folder.name}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            {feature.version}
                          </Badge>
                          <Badge variant="outline" className={getStatusColor(feature.status)}>
                            {feature.status}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>{feature.userStories} user stories</span>
                          <span>{feature.scenarios} scenarios</span>
                          <span>Updated {feature.lastEdit}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-muted-foreground" />
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
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}