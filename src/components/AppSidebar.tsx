import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  Sidebar, 
  SidebarContent, 
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useAuth } from "@/components/AuthProvider";
import { 
  ChevronDown,
  ChevronRight,
  Search,
  Bell,
  Users,
  Building2,
  FileText,
  Settings,
  Star,
  Heart,
  Briefcase,
  Database,
  Globe,
  Calendar,
  Mail,
  Phone,
  Target,
  Zap,
  CreditCard
} from "lucide-react";

const quickActions = [
  { title: "Quick actions", icon: Zap, shortcut: "⌘K" },
  { title: "Notifications", icon: Bell },
  { title: "Tasks", icon: Target },
  { title: "Notes", icon: FileText },
  { title: "Emails", icon: Mail },
  { title: "Calls", icon: Phone },
  { title: "Reports", icon: Database },
];

const recordsItems = [
  { title: "Companies", url: "/components", icon: Building2, isActive: true },
  { title: "People", url: "/features", icon: Users },
  { title: "Deals", url: "/changes", icon: Briefcase },
  { title: "Users", url: "/integrations", icon: Users },
  { title: "Workspaces", url: "/workspaces", icon: Globe },
];

const automationsItems = [
  { title: "Sequences", url: "/sequences", icon: Zap },
  { title: "Workflows", url: "/workflows", icon: Settings },
];

const listsItems = [
  { title: "New list", url: "/lists/new", icon: null },
];

export function AppSidebar() {
  const location = useLocation();
  const { signOut, user } = useAuth();
  const [recordsOpen, setRecordsOpen] = useState(true);
  const [automationsOpen, setAutomationsOpen] = useState(false);
  const [listsOpen, setListsOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <Sidebar className="w-[275px] border-r border-border bg-sidebar-background">
      {/* Workspace Selector */}
      <div className="p-3 border-b border-border">
        <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-sidebar-accent cursor-pointer transition-colors">
          <div className="w-8 h-8 bg-gray-200 rounded-lg flex items-center justify-center">
            <span className="text-sm font-semibold text-gray-600">S</span>
          </div>
          <span className="font-medium text-sm text-sidebar-foreground flex-1">Stacks Music</span>
          <ChevronDown className="w-4 h-4 text-muted-foreground" />
        </div>
      </div>

      {/* Search */}
      <div className="p-3 border-b border-border">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="/" 
            className="pl-10 h-8 bg-sidebar-accent border-none focus-visible:ring-1 focus-visible:ring-sidebar-ring text-sm"
          />
        </div>
      </div>

      <SidebarContent className="px-3">
        {/* Quick Actions */}
        <div className="py-2">
          {quickActions.map((item, index) => (
            <div key={item.title} className="attio-nav-item">
              <item.icon className="w-4 h-4 text-muted-foreground" />
              <span className="flex-1">{item.title}</span>
              {item.shortcut && (
                <span className="text-xs text-muted-foreground">{item.shortcut}</span>
              )}
            </div>
          ))}
        </div>

        {/* Favorites */}
        <Collapsible open={true}>
          <CollapsibleTrigger className="flex items-center gap-2 px-3 py-2 w-full text-left hover:bg-sidebar-accent rounded-md">
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Favorites
            </span>
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-1">
            <div className="px-3 py-2 text-sm text-muted-foreground">
              No favorites
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Records */}
        <Collapsible open={recordsOpen} onOpenChange={setRecordsOpen}>
          <CollapsibleTrigger className="flex items-center gap-2 px-3 py-2 w-full text-left hover:bg-sidebar-accent rounded-md">
            <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${recordsOpen ? 'rotate-0' : '-rotate-90'}`} />
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Records
            </span>
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-1">
            <div className="space-y-1">
              {recordsItems.map((item) => (
                <Link
                  key={item.title}
                  to={item.url}
                  className={`attio-nav-item ${item.isActive ? 'active bg-blue-50 text-blue-600' : ''}`}
                >
                  <item.icon className="w-4 h-4" />
                  <span className="flex-1">{item.title}</span>
                </Link>
              ))}
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Automations */}
        <Collapsible open={automationsOpen} onOpenChange={setAutomationsOpen}>
          <CollapsibleTrigger className="flex items-center gap-2 px-3 py-2 w-full text-left hover:bg-sidebar-accent rounded-md">
            <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${automationsOpen ? 'rotate-0' : '-rotate-90'}`} />
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Automations
            </span>
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-1">
            <div className="space-y-1">
              {automationsItems.map((item) => (
                <Link
                  key={item.title}
                  to={item.url}
                  className="attio-nav-item"
                >
                  <item.icon className="w-4 h-4" />
                  <span className="flex-1">{item.title}</span>
                </Link>
              ))}
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Lists */}
        <Collapsible open={listsOpen} onOpenChange={setListsOpen}>
          <CollapsibleTrigger className="flex items-center gap-2 px-3 py-2 w-full text-left hover:bg-sidebar-accent rounded-md">
            <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${listsOpen ? 'rotate-0' : '-rotate-90'}`} />
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Lists
            </span>
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-1">
            <div className="space-y-1">
              <div className="flex items-center gap-3 px-3 py-2 text-sm text-muted-foreground hover:bg-sidebar-accent rounded-md cursor-pointer">
                <span className="text-lg">+</span>
                <span className="flex-1">New list</span>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </SidebarContent>

      {/* Getting Started Card */}
      <div className="mt-auto p-3">
        <div className="bg-sidebar-accent rounded-lg p-4 border border-border">
          <div className="flex items-center gap-2 mb-3">
            <Heart className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium">Getting started</span>
          </div>
          <Progress value={0} className="h-1 mb-3" />
          <div className="text-xs text-muted-foreground">0%</div>
        </div>
      </div>

      {/* Trial Banner */}
      <div className="p-3 bg-yellow-50 border-t border-border">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-yellow-800">14 days left on trial!</span>
          <Button size="sm" variant="outline" className="h-7 text-xs">
            Add billing
          </Button>
        </div>
      </div>
    </Sidebar>
  );
}