import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, FileText, FolderOpen, Users, ArrowLeft } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";

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
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const currentFolder = searchParams.get('folder');

  // If we're viewing a specific folder, show only that folder's features
  const currentFolderData = currentFolder ? mockFolders.find(f => f.id === currentFolder) : null;
  
  const filteredContent = currentFolder && currentFolderData ? 
    // Show features within the selected folder
    currentFolderData.features.filter(feature => 
      feature.title.toLowerCase().includes(searchTerm.toLowerCase())
    ) :
    // Show folders on the main page
    mockFolders.filter(folder => 
      folder.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  
  const hasResults = filteredContent.length > 0;

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
        <div className="flex items-center gap-4">
          {currentFolder && (
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setSearchParams({})}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Folders
            </Button>
          )}
          <div>
            <h1 className="text-3xl font-bold mb-2">
              {currentFolder ? currentFolderData?.name : 'Features'}
            </h1>
            <p className="text-muted-foreground">
              {currentFolder ? 'Features in this folder' : 'Product specifications and requirements'}
            </p>
          </div>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          {currentFolder ? 'New Feature' : 'New Folder'}
        </Button>
      </div>

      {/* Search */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder={currentFolder ? "Search features..." : "Search folders..."}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </div>

      {/* Content List */}
      {!hasResults ? (
        <div className="text-center py-12">
          <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">
            {currentFolder ? 'No features found' : 'No folders found'}
          </h3>
          <p className="text-muted-foreground mb-4">
            {searchTerm 
              ? "Try adjusting your search" 
              : currentFolder 
                ? "Create your first feature in this folder"
                : "Create your first feature folder"}
          </p>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            {currentFolder ? 'New Feature' : 'New Folder'}
          </Button>
        </div>
      ) : currentFolder ? (
        // Show features within folder
        <div className="grid gap-3">
          {(filteredContent as any[]).map((feature) => (
            <Card 
              key={feature.id}
              className="cursor-pointer hover:bg-accent/50 transition-colors"
              onClick={() => navigate(`/features/${feature.id}`)}
            >
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FileText className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <CardTitle className="text-base">{feature.title}</CardTitle>
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
              <CardContent className="pt-0">
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center gap-3">
                    <span>{feature.userStories} user stories</span>
                    <span>{feature.scenarios} scenarios</span>
                    <span>Updated {feature.lastEdit}</span>
                  </div>
                  <div className="flex -space-x-1">
                    {feature.owners.map((owner) => (
                      <div
                        key={owner}
                        className="w-5 h-5 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-medium border border-background"
                        title={owner}
                      >
                        {owner[0]}
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        // Show folders
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {(filteredContent as any[]).map((folder) => (
            <Card 
              key={folder.id}
              className="cursor-pointer hover:bg-accent/50 transition-colors"
              onClick={() => setSearchParams({ folder: folder.id })}
            >
              <CardHeader>
                <div className="flex items-center gap-3">
                  <FolderOpen className="w-6 h-6 text-muted-foreground" />
                  <div>
                    <CardTitle className="text-lg">{folder.name}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      {folder.features.length} features
                    </p>
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}