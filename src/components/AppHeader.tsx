import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Search, RefreshCw, User } from "lucide-react";

export function AppHeader() {
  return (
    <header className="h-12 border-b bg-background flex items-center px-4 gap-4">
      <SidebarTrigger />
      
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <span>my-org/react-app</span>
      </div>

      <div className="flex-1 max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Search components, features... (⌘K)"
            className="pl-10 pr-4"
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm">
          <RefreshCw className="w-4 h-4 mr-2" />
          Scan now
        </Button>
        
        <Badge variant="secondary" className="bg-status-warning/10 text-status-warning">
          3 drift
        </Badge>

        <Button variant="ghost" size="sm">
          <User className="w-4 h-4" />
        </Button>
      </div>
    </header>
  );
}