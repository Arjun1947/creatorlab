import { Home, Sparkles, History, CreditCard, Settings, LogOut, Zap } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useAuth } from "@/contexts/AuthContext";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const mainNav = [
  { title: "Dashboard", url: "/dashboard", icon: Home },
  { title: "History", url: "/history", icon: History },
];

const settingsNav = [
  { title: "Pricing", url: "/pricing", icon: CreditCard },
  { title: "Settings", url: "/settings", icon: Settings },
];

export function AppSidebar() {
  const { signOut, profile } = useAuth();

  const remainingCredits = profile?.is_pro 
    ? "Unlimited" 
    : `${Math.max(0, 10 - (profile?.daily_generations_count || 0))}/10`;

  return (
    <Sidebar className="border-r border-sidebar-border">
      <SidebarContent className="pt-4">
        <div className="px-4 mb-6">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg gradient-primary">
              <Sparkles className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold">CreatorLab</span>
          </div>
        </div>

        <SidebarGroup>
          <SidebarGroupLabel className="text-xs uppercase tracking-wider text-muted-foreground">
            Main
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNav.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      className="flex items-center gap-3 rounded-lg px-3 py-2 text-sidebar-foreground transition-all hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                      activeClassName="bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-4">
          <SidebarGroupLabel className="text-xs uppercase tracking-wider text-muted-foreground">
            Account
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {settingsNav.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      className="flex items-center gap-3 rounded-lg px-3 py-2 text-sidebar-foreground transition-all hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                      activeClassName="bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <div className="mx-4 mt-6">
          <div className="rounded-lg bg-accent p-4">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="h-4 w-4 text-accent-foreground" />
              <span className="text-sm font-medium text-accent-foreground">Daily Credits</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold text-accent-foreground">{remainingCredits}</span>
              {!profile?.is_pro && (
                <Badge variant="outline" className="text-xs border-accent-foreground/30 text-accent-foreground">
                  Free
                </Badge>
              )}
              {profile?.is_pro && (
                <Badge className="gradient-primary text-xs border-0">
                  Pro
                </Badge>
              )}
            </div>
          </div>
        </div>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-4">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-muted-foreground hover:text-foreground"
          onClick={signOut}
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
