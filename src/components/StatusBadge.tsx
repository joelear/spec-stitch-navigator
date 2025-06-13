import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type Status = "synced" | "scanning" | "drift" | "error" | "new";

interface StatusBadgeProps {
  status: Status;
  className?: string;
}

const statusConfig = {
  synced: {
    label: "Synced",
    className: "bg-status-success/10 text-status-success border-status-success/20",
  },
  scanning: {
    label: "Scanning",
    className: "bg-status-info/10 text-status-info border-status-info/20",
  },
  drift: {
    label: "Drift",
    className: "bg-status-warning/10 text-status-warning border-status-warning/20",
  },
  error: {
    label: "Error",
    className: "bg-status-error/10 text-status-error border-status-error/20",
  },
  new: {
    label: "New",
    className: "bg-primary/10 text-primary border-primary/20",
  },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status];
  
  return (
    <Badge 
      variant="outline"
      className={cn(config.className, className)}
    >
      {config.label}
    </Badge>
  );
}