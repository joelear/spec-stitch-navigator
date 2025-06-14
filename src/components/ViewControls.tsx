import { Button } from "@/components/ui/button";
import { 
  ChevronDown, 
  Settings, 
  Download, 
  Upload, 
  Plus,
  Database
} from "lucide-react";

export function ViewControls() {
  return (
    <div className="flex items-center justify-between px-6 py-3 border-b border-border bg-background">
      {/* Left side - View selector */}
      <div className="flex items-center gap-3">
        <Button variant="outline" className="gap-2 h-9">
          <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
            <Database className="w-3 h-3 text-white" />
          </div>
          <span>All Companies</span>
          <ChevronDown className="w-4 h-4" />
        </Button>
        
        <Button variant="outline" className="gap-2 h-9">
          <Settings className="w-4 h-4" />
          <span>View settings</span>
        </Button>
      </div>

      {/* Right side - Actions */}
      <div className="flex items-center gap-2">
        <Button variant="outline" className="gap-2 h-9">
          <Upload className="w-4 h-4" />
          <span>Import / Export</span>
          <ChevronDown className="w-4 h-4" />
        </Button>
        
        <Button className="gap-2 h-9 attio-button-primary">
          <Plus className="w-4 h-4" />
          <span>New Company</span>
        </Button>
      </div>
    </div>
  );
}