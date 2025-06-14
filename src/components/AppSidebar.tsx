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
  SidebarGroupLabel,
  useSidebar
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/components/AuthProvider";
import { 
  GitBranch, 
  Settings, 
  Grid3X3, 
  FileText, 
  Bell,
  ChevronDown,
  ChevronRight,
  User,
  Github,
  LogOut,
  Search,
  PanelLeftClose,
  Database,
  Palette,
  Layers,
  Activity
} from "lucide-react";

const navigationSections = [
  {
    title: "Configuration",
    items: [
      { title: "Database", url: "/components", icon: Database },
      { title: "Settings", url: "/integrations", icon: Settings },
    ]
  },
  {
    title: "UI",
    items: [
      { title: "Components", url: "/components", icon: Grid3X3 },
      { title: "Themes", url: "/themes", icon: Palette },
    ]
  },
  {
    title: "Features", 
    items: [
      { title: "Features", url: "/features", icon: FileText },
      { title: "Layers", url: "/layers", icon: Layers },
    ]
  },
  {
    title: "Changes",
    items: [
      { title: "Changes", url: "/changes", icon: Bell, badge: 3 },
      { title: "Activity", url: "/activity", icon: Activity },
    ]
  }
];

export function AppSidebar() {
  const location = useLocation();
  const { signOut, user } = useAuth();
  const { toggleSidebar } = useSidebar();
  const [expandedSections, setExpandedSections] = useState<string[]>(["Configuration", "UI", "Features", "Changes"]);

  const handleSignOut = async () => {
    await signOut();
  };

  const toggleSection = (sectionTitle: string) => {
    setExpandedSections(prev => 
      prev.includes(sectionTitle) 
        ? prev.filter(title => title !== sectionTitle)
        : [...prev, sectionTitle]
    );
  };

  return (
    <Sidebar className="transition-all duration-300 bg-sidebar border-sidebar-border">
      <SidebarHeader className="p-4 border-b border-sidebar-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Grid3X3 className="w-4 h-4 text-primary-foreground" />
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm text-sidebar-foreground">Spec Graph</span>
              <ChevronDown className="w-4 h-4 text-sidebar-foreground/60" />
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="h-6 w-6 text-sidebar-foreground/60 hover:text-sidebar-foreground"
          >
            <PanelLeftClose className="h-4 w-4" />
          </Button>
        </div>
      </SidebarHeader>

      <div className="p-4 border-b border-sidebar-border">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-sidebar-foreground/40" />
          <Input 
            placeholder="Search..."
            className="pl-10 bg-sidebar-accent border-sidebar-border text-sidebar-foreground placeholder:text-sidebar-foreground/40"
          />
        </div>
      </div>
      
      <SidebarContent className="px-2">
        {navigationSections.map((section) => (
          <SidebarGroup key={section.title} className="py-2">
            <div 
              className="flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-sidebar-accent rounded-md"
              onClick={() => toggleSection(section.title)}
            >
              {expandedSections.includes(section.title) ? (
                <ChevronDown className="w-3 h-3 text-sidebar-foreground/60" />
              ) : (
                <ChevronRight className="w-3 h-3 text-sidebar-foreground/60" />
              )}
              <SidebarGroupLabel className="text-xs font-medium text-sidebar-foreground/70 uppercase tracking-wider cursor-pointer p-0 h-auto">
                {section.title}
              </SidebarGroupLabel>
            </div>
            
            {expandedSections.includes(section.title) && (
              <SidebarGroupContent className="mt-1">
                <SidebarMenu>
                  {section.items.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton 
                        asChild
                        isActive={location.pathname.startsWith(item.url)}
                        className="w-full ml-5"
                      >
                        <Link to={item.url} className="flex items-center gap-3 p-2">
                          <item.icon className="w-4 h-4 flex-shrink-0" />
                          <span className="flex-1 text-sm">{item.title}</span>
                          {item.badge && (
                            <Badge variant="secondary" className="text-xs h-5">
                              {item.badge}
                            </Badge>
                          )}
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            )}
            <div className="h-px bg-sidebar-border mt-2" />
          </SidebarGroup>
        ))}
      </SidebarContent>

      <div className="mt-auto p-4 border-t border-sidebar-border space-y-2">
        <div className="text-xs text-sidebar-foreground/60 px-2">
          {user?.email}
        </div>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={handleSignOut} className="w-full text-destructive hover:text-destructive">
              <div className="flex items-center gap-3">
                <LogOut className="w-4 h-4" />
                <span className="flex-1 text-sm">Sign Out</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </div>
    </Sidebar>
  );
}