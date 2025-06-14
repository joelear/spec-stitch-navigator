import { Button } from "@/components/ui/button";
import { ArrowUp, ArrowDown, Filter } from "lucide-react";

export function FilterBar() {
  return (
    <div className="flex items-center gap-3 px-6 py-3 bg-muted/30 border-b border-border">
      <Button variant="outline" size="sm" className="gap-2 h-8">
        <ArrowUp className="w-3 h-3" />
        <span>Sort</span>
      </Button>
      
      <Button variant="outline" size="sm" className="gap-2 h-8">
        <Filter className="w-3 h-3" />
        <span>Filter</span>
      </Button>
    </div>
  );
}