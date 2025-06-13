import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/StatusBadge";
import { GitBranch, Plus, Search, MoreVertical } from "lucide-react";
import { useNavigate } from "react-router-dom";

const mockRepos = [
  {
    id: "1",
    name: "my-org/react-app",
    status: "synced" as const,
    lastScan: "2 hours ago",
    components: 24,
    features: 8,
  },
  {
    id: "2", 
    name: "my-org/design-system",
    status: "drift" as const,
    lastScan: "1 day ago",
    components: 42,
    features: 3,
  },
  {
    id: "3",
    name: "my-org/mobile-app",
    status: "scanning" as const,
    lastScan: "Just now",
    components: 16,
    features: 12,
  },
];

export default function Repos() {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const filteredRepos = mockRepos.filter(repo =>
    repo.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Your Repositories</h1>
          <p className="text-muted-foreground">Connect and manage your GitHub repositories</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Connect repo
        </Button>
      </div>

      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search repositories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {filteredRepos.length === 0 ? (
        <div className="text-center py-12">
          <GitBranch className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">No repositories found</h3>
          <p className="text-muted-foreground mb-4">
            {searchTerm ? "Try adjusting your search" : "Connect your first repository to get started"}
          </p>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Connect repo
          </Button>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredRepos.map((repo) => (
            <Card 
              key={repo.id} 
              className="cursor-pointer hover:bg-accent/50 transition-colors"
              onClick={() => navigate(`/repos/${repo.id}`)}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <GitBranch className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <CardTitle className="text-lg">{repo.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">Last scan: {repo.lastScan}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusBadge status={repo.status} />
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex gap-6 text-sm">
                  <div>
                    <span className="font-medium">{repo.components}</span>
                    <span className="text-muted-foreground ml-1">components</span>
                  </div>
                  <div>
                    <span className="font-medium">{repo.features}</span>
                    <span className="text-muted-foreground ml-1">features</span>
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