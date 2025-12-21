"use client";

import { useState, useEffect, createContext, useContext } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { getSupabaseBrowserClient } from "@/lib/supabase";
import type { DashboardUser } from "@/lib/auth";
import {
  LayoutDashboard,
  Image as ImageIcon,
  Link2,
  Users,
  Settings,
  LogOut,
  ChevronDown,
  Shield,
  Building2,
  User,
  BarChart3,
  FolderOpen,
  Key,
  Bell,
  Loader2,
  FileText,
  MessageCircle,
  MessageSquare,
  PanelLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// ============================================
// CONTEXT
// ============================================

interface Creator {
  id: string;
  username: string;
  group_id: string | null;
  storage_folder: string | null;
  bio_link: string | null;
  studio_id: string | null;
  enabled: boolean;
}

interface DashboardContextType {
  user: DashboardUser | null;
  creator: Creator | null;
  isLoading: boolean;
  apiKey: string | null;
  refreshUser: () => Promise<void>;
}

const DashboardContext = createContext<DashboardContextType>({
  user: null,
  creator: null,
  isLoading: true,
  apiKey: null,
  refreshUser: async () => {},
});

export const useDashboard = () => useContext(DashboardContext);

// ============================================
// NAVIGATION CONFIG
// ============================================

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  roles?: string[];
}

const mainNavItems: NavItem[] = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Media Library",
    href: "/dashboard/media",
    icon: ImageIcon,
  },
  {
    label: "Scenarios",
    href: "/dashboard/albums",
    icon: MessageSquare,
  },
  {
    label: "Bio Links",
    href: "/dashboard/bio-links",
    icon: Link2,
  },
  {
    label: "Accounts",
    href: "/dashboard/accounts",
    icon: Key,
  },
  {
    label: "Statistics",
    href: "/dashboard/statistics",
    icon: BarChart3,
  },
];

const managementNavItems: NavItem[] = [
  {
    label: "Models",
    href: "/dashboard/models",
    icon: Users,
    roles: ["admin", "studio"],
  },
  {
    label: "Contracts",
    href: "/dashboard/contracts",
    icon: FileText,
  },
  {
    label: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
];

const adminNavItems: NavItem[] = [
  {
    label: "Onboarding",
    href: "/dashboard/onboarding",
    icon: Users,
    roles: ["admin"],
  },
  {
    label: "Studios",
    href: "/dashboard/studios",
    icon: Building2,
    roles: ["admin"],
  },
  {
    label: "WhatsApp Bot",
    href: "/dashboard/whatsapp",
    icon: MessageCircle,
    roles: ["admin"],
  },
];

// ============================================
// APP SIDEBAR COMPONENT
// ============================================

function AppSidebar({ user, onLogout }: { user: DashboardUser | null; onLogout: () => void }) {
  const pathname = usePathname();
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  const filterByRole = (items: NavItem[]) =>
    items.filter((item) => !item.roles || (user && item.roles.includes(user.role)));

  const getRoleBadge = () => {
    if (!user) return null;
    const colors = {
      admin: "bg-red-500/10 text-red-600 border-red-500/20",
      studio: "bg-blue-500/10 text-blue-600 border-blue-500/20",
      model: "bg-purple-500/10 text-purple-600 border-purple-500/20",
    };
    const icons = {
      admin: Shield,
      studio: Building2,
      model: User,
    };
    const Icon = icons[user.role];
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${colors[user.role]}`}>
        <Icon className="w-3 h-3" />
        {!isCollapsed && (user.role.charAt(0).toUpperCase() + user.role.slice(1))}
      </span>
    );
  };

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border">
      <SidebarHeader className="border-b border-sidebar-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/dashboard" className="flex items-center gap-3">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-gradient-to-br from-pink-500 to-rose-600 text-white">
                  <span className="text-sm font-bold">L</span>
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-semibold">Lovebite</span>
                  <span className="text-xs text-muted-foreground">Creator Dashboard</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        {/* Main Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel>Main</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton asChild isActive={isActive} tooltip={item.label}>
                      <Link href={item.href}>
                        <Icon className="size-4" />
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Management */}
        <SidebarGroup>
          <SidebarGroupLabel>Management</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {filterByRole(managementNavItems).map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton asChild isActive={isActive} tooltip={item.label}>
                      <Link href={item.href}>
                        <Icon className="size-4" />
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Admin Section */}
        {filterByRole(adminNavItems).length > 0 && (
          <SidebarGroup>
            <SidebarGroupLabel>Admin</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {filterByRole(adminNavItems).map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
                  return (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton asChild isActive={isActive} tooltip={item.label}>
                        <Link href={item.href}>
                          <Icon className="size-4" />
                          <span>{item.label}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton size="lg" className="data-[state=open]:bg-sidebar-accent">
                  <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-gradient-to-br from-slate-600 to-slate-700 text-white">
                    {user?.avatar_url ? (
                      <img src={user.avatar_url} alt="" className="size-8 rounded-lg object-cover" />
                    ) : (
                      <User className="size-4" />
                    )}
                  </div>
                  <div className="flex flex-col gap-0.5 leading-none min-w-0">
                    <span className="font-medium truncate">{user?.display_name || "User"}</span>
                    <span className="text-xs text-muted-foreground truncate">{user?.email}</span>
                  </div>
                  <ChevronDown className="ml-auto size-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="top" align="start" className="w-56">
                <DropdownMenuLabel className="flex items-center gap-2">
                  <span>My Account</span>
                  {getRoleBadge()}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/settings">
                    <Settings className="mr-2 size-4" />
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={onLogout} className="text-red-600">
                  <LogOut className="mr-2 size-4" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}

// ============================================
// HEADER COMPONENT
// ============================================

function Header({ user }: { user: DashboardUser | null }) {
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 sm:px-6">
      <SidebarTrigger className="-ml-1" />

      <div className="flex-1" />

      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="size-4" />
          <span className="absolute -top-0.5 -right-0.5 size-2 bg-pink-500 rounded-full" />
        </Button>

        <div className="hidden sm:flex items-center gap-3 pl-3 border-l">
          <div className="text-right">
            <p className="text-sm font-medium">
              {user?.display_name || user?.email || "User"}
            </p>
            <p className="text-xs text-muted-foreground">{user?.role}</p>
          </div>
        </div>
      </div>
    </header>
  );
}

// ============================================
// LAYOUT COMPONENT
// ============================================

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<DashboardUser | null>(null);
  const [creator, setCreator] = useState<Creator | null>(null);
  const [apiKey, setApiKey] = useState<string | null>(null);
  const router = useRouter();

  const fetchUser = async () => {
    try {
      const supabase = getSupabaseBrowserClient();

      // Get session from cookies
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();

      console.log("Layout - Session check:", { session: !!session, sessionError });

      if (!session) {
        router.push("/dashboard/login");
        return;
      }

      const authUser = session.user;
      console.log("Layout - Auth user:", { id: authUser.id, email: authUser.email });

      // Get dashboard user profile
      const { data: dashboardUser, error } = await supabase
        .from("dashboard_users")
        .select("*")
        .or(`auth_user_id.eq.${authUser.id},email.eq.${authUser.email}`)
        .maybeSingle();

      console.log("Layout - Dashboard user:", { dashboardUser, error });

      // Update auth_user_id if found by email but not auth_user_id
      if (dashboardUser && dashboardUser.auth_user_id !== authUser.id) {
        console.log("Layout - Updating auth_user_id for user");
        await supabase
          .from("dashboard_users")
          .update({ auth_user_id: authUser.id })
          .eq("id", dashboardUser.id);
      }

      if (error || !dashboardUser) {
        console.log("Layout - No user found, redirecting to setup");
        router.push("/dashboard/setup");
        return;
      }

      if (!dashboardUser.enabled) {
        await supabase.auth.signOut();
        router.push("/dashboard/login?error=disabled");
        return;
      }

      setUser(dashboardUser);

      // Get creator data if available
      if (dashboardUser.creator_id) {
        try {
          const { data: creatorData } = await supabase
            .from("creators")
            .select("*")
            .eq("id", dashboardUser.creator_id)
            .single();

          if (creatorData) {
            setCreator(creatorData as Creator);
          }
        } catch (e) {
          console.log("Error fetching creator:", e);
        }
      }

      // Get API key based on role
      try {
        let apiKeyQuery;
        
        if (dashboardUser.role === "admin") {
          // Admin gets the admin API key
          apiKeyQuery = supabase
            .from("api_users")
            .select("api_key")
            .eq("role", "admin")
            .eq("enabled", true)
            .single();
        } else if (dashboardUser.creator_id || dashboardUser.studio_id) {
          // Models/Studios get their specific API key
          const filters = [];
          if (dashboardUser.creator_id) {
            filters.push(`creator_id.eq.${dashboardUser.creator_id}`);
          }
          if (dashboardUser.studio_id) {
            filters.push(`studio_id.eq.${dashboardUser.studio_id}`);
          }
          
          apiKeyQuery = supabase
            .from("api_users")
            .select("api_key")
            .or(filters.join(","))
            .eq("enabled", true)
            .single();
        }

        if (apiKeyQuery) {
          const { data: apiUser } = await apiKeyQuery;
          if (apiUser?.api_key) {
            console.log("Layout - API key found");
            setApiKey(apiUser.api_key);
          }
        }
      } catch (e) {
        console.log("API key not found:", e);
      }

      setIsLoading(false);
    } catch (err) {
      console.error("Error in fetchUser:", err);
      setIsLoading(false);
      router.push("/dashboard/login?error=unknown");
    }
  };

  useEffect(() => {
    fetchUser();

    // Listen for auth changes
    const supabase = getSupabaseBrowserClient();
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event: string) => {
      if (event === "SIGNED_OUT") {
        router.push("/dashboard/login");
      } else if (event === "SIGNED_IN") {
        fetchUser();
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLogout = async () => {
    const supabase = getSupabaseBrowserClient();
    await supabase.auth.signOut();
    router.push("/dashboard/login");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="size-8 text-pink-600 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <DashboardContext.Provider
      value={{
        user,
        creator,
        isLoading,
        apiKey,
        refreshUser: fetchUser,
      }}
    >
      <TooltipProvider delayDuration={0}>
        <SidebarProvider>
          <div className="flex min-h-screen w-full">
            <AppSidebar user={user} onLogout={handleLogout} />
            <div className="flex-1 flex flex-col">
              <Header user={user} />
              <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
            </div>
          </div>
        </SidebarProvider>
      </TooltipProvider>
    </DashboardContext.Provider>
  );
}
