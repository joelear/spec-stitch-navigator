import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Building2, Bell, User, MoreHorizontal } from "lucide-react";

export function AppHeader() {
  return (
    <header className="h-16 border-b border-border bg-background flex items-center justify-between px-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <Building2 className="w-4 h-4 text-muted-foreground" />
          <span className="font-medium text-foreground">Companies</span>
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" className="w-8 h-8 p-0">
          <Bell className="w-4 h-4 text-muted-foreground" />
        </Button>
        <Button variant="ghost" size="sm" className="w-8 h-8 p-0">
          <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
        </Button>
        <Button variant="ghost" size="sm" className="w-8 h-8 p-0 rounded-full">
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
            <span className="text-xs font-medium text-blue-600">J</span>
          </div>
        </Button>
      </div>
    </header>
  );
}