"use client";

import { useState, useEffect, createContext, useContext } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { getSupabaseBrowserClient } from "@/lib/supabase";
import type { DashboardUser } from "@/lib/auth";
import { MediaStateProvider } from "@/lib/hooks/use-media-state";
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
  Calendar,
  Zap,
  Share2,
  Bot,
  Activity,
  Globe,
  Layers,
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
  whatsapp_group_id: string | null;
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

// Home section - Primary navigation
const homeNavItems: NavItem[] = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Activity",
    href: "/dashboard/activity",
    icon: Activity,
  },
];

// Analytics section
const analyticsNavItems: NavItem[] = [
  {
    label: "Statistics",
    href: "/dashboard/statistics",
    icon: BarChart3,
  },
];

// Content section - Media Management
const contentNavItems: NavItem[] = [
  {
    label: "Media Library",
    href: "/dashboard/media",
    icon: ImageIcon,
  },
  {
    label: "Scenarios",
    href: "/dashboard/albums",
    icon: Layers,
  },
];

// Bio Links section - Grouped
const bioLinksNavItems: NavItem[] = [
  {
    label: "Manage",
    href: "/dashboard/bio-links",
    icon: Link2,
  },
  {
    label: "Domains",
    href: "/dashboard/bio-links/domains",
    icon: Globe,
  },
];

// Accounts section
const accountsNavItems: NavItem[] = [
  {
    label: "Platform Accounts",
    href: "/dashboard/accounts",
    icon: Key,
  },
  {
    label: "Contracts",
    href: "/dashboard/contracts",
    icon: FileText,
  },
];

// Social Management section (dev-only)
const isDevelopment = process.env.NODE_ENV === "development";

const socialNavItems: NavItem[] = [
  {
    label: "Calendar",
    href: "/dashboard/social/calendar",
    icon: Calendar,
  },
  {
    label: "Automations",
    href: "/dashboard/social/automations",
    icon: Zap,
  },
];

// Team Management section - For admin/studio
const teamNavItems: NavItem[] = [
  {
    label: "Models",
    href: "/dashboard/models",
    icon: Users,
    roles: ["admin", "business"],
  },
  {
    label: "Businesses",
    href: "/dashboard/studios",
    icon: Building2,
    roles: ["admin"],
  },
  {
    label: "Onboarding",
    href: "/dashboard/onboarding",
    icon: Users,
    roles: ["admin"],
  },
];

// Tools section
const toolsNavItems: NavItem[] = [
  {
    label: "WhatsApp Assistant",
    href: "/dashboard/whatsapp-assistant",
    icon: MessageCircle,
  },
  {
    label: "WhatsApp Bot",
    href: "/dashboard/whatsapp",
    icon: Bot,
    roles: ["admin"],
  },
];

// Settings section
const settingsNavItems: NavItem[] = [
  {
    label: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
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
    const colors: Record<string, string> = {
      admin: "bg-red-500/10 text-red-600 border-red-500/20",
      business: "bg-blue-500/10 text-blue-600 border-blue-500/20",
      independent: "bg-purple-500/10 text-purple-600 border-purple-500/20",
    };
    const icons: Record<string, typeof Shield> = {
      admin: Shield,
      business: Building2,
      independent: User,
    };
    const displayNames: Record<string, string> = {
      admin: "Admin",
      business: "Business",
      independent: "Independent",
    };
    const Icon = icons[user.role] || User;
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${colors[user.role] || colors.independent}`}>
        <Icon className="w-3 h-3" />
        {!isCollapsed && (displayNames[user.role] || user.role)}
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
                  <span className="font-semibold">Lovdash</span>
                  <span className="text-xs text-muted-foreground">Creator Dashboard</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        {/* Home - Primary Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel>Home</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {homeNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
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

        {/* Analytics */}
        <SidebarGroup>
          <SidebarGroupLabel>Analytics</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {analyticsNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
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

        {/* Content - Media Management */}
        <SidebarGroup>
          <SidebarGroupLabel>Content</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {contentNavItems.map((item) => {
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

        {/* Bio Links */}
        <SidebarGroup>
          <SidebarGroupLabel>Bio Links</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {bioLinksNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
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

        {/* Accounts */}
        <SidebarGroup>
          <SidebarGroupLabel>Accounts</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {accountsNavItems.map((item) => {
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

        {/* Social Management (Dev Only) */}
        {isDevelopment && (
          <SidebarGroup>
            <SidebarGroupLabel className="flex items-center gap-2">
              Social
              <span className="px-1.5 py-0.5 text-[10px] font-medium bg-amber-500/20 text-amber-600 rounded">DEV</span>
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {socialNavItems.map((item) => {
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

        {/* Team Management - Admin/Studio */}
        {filterByRole(teamNavItems).length > 0 && (
          <SidebarGroup>
            <SidebarGroupLabel>Team</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {filterByRole(teamNavItems).map((item) => {
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

        {/* Tools */}
        <SidebarGroup>
          <SidebarGroupLabel>Tools</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {filterByRole(toolsNavItems).map((item) => {
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

        {/* Settings */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {settingsNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
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
// NOTIFICATION TYPE
// ============================================

interface Notification {
  id: string;
  user_id: string;
  type: string;
  title: string;
  message: string | null;
  data: Record<string, any>;
  is_read: boolean;
  created_at: string;
}

// ============================================
// HEADER COMPONENT
// ============================================

function Header({ user, dashboardUserId }: { user: DashboardUser | null; dashboardUserId?: string }) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoadingNotifications, setIsLoadingNotifications] = useState(false);
  const [isRespondingToInvite, setIsRespondingToInvite] = useState<string | null>(null);
  const router = useRouter();

  const unreadCount = notifications.filter(n => !n.is_read).length;

  const fetchNotifications = async () => {
    if (!dashboardUserId) return;
    setIsLoadingNotifications(true);
    try {
      const response = await fetch(`/api/notifications?userId=${dashboardUserId}`);
      const { data } = await response.json();
      setNotifications(data || []);
    } catch (err) {
      console.error("Error fetching notifications:", err);
    } finally {
      setIsLoadingNotifications(false);
    }
  };

  useEffect(() => {
    if (dashboardUserId && showNotifications) {
      fetchNotifications();
    }
  }, [dashboardUserId, showNotifications]);

  const markAsRead = async (notificationIds: string[]) => {
    try {
      await fetch("/api/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notificationIds }),
      });
      setNotifications(prev => prev.map(n => 
        notificationIds.includes(n.id) ? { ...n, is_read: true } : n
      ));
    } catch (err) {
      console.error("Error marking as read:", err);
    }
  };

  const handleInviteResponse = async (inviteId: string, action: "accept" | "decline") => {
    setIsRespondingToInvite(inviteId);
    try {
      const response = await fetch(`/api/studio-invites/${inviteId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      const data = await response.json();
      if (response.ok) {
        // Mark related notification as read
        const relatedNotification = notifications.find(
          n => n.type === "studio_invite" && n.data?.invite_id === inviteId
        );
        if (relatedNotification) {
          await markAsRead([relatedNotification.id]);
        }
        // Refresh the page to reflect changes
        router.refresh();
        window.location.reload();
      } else {
        console.error("Error responding to invite:", data.error);
      }
    } catch (err) {
      console.error("Error responding to invite:", err);
    } finally {
      setIsRespondingToInvite(null);
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 sm:px-6">
      <SidebarTrigger className="-ml-1" />

      <div className="flex-1" />

      <div className="flex items-center gap-3">
        {/* Notifications */}
        <DropdownMenu open={showNotifications} onOpenChange={setShowNotifications}>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="size-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 size-5 bg-pink-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-96">
            <DropdownMenuLabel className="flex items-center justify-between">
              <span>Notifications</span>
              {unreadCount > 0 && (
                <button
                  onClick={() => markAsRead(notifications.filter(n => !n.is_read).map(n => n.id))}
                  className="text-xs text-pink-600 hover:text-pink-700"
                >
                  Mark all read
                </button>
              )}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {isLoadingNotifications ? (
              <div className="py-8 text-center">
                <Loader2 className="size-6 mx-auto animate-spin text-muted-foreground" />
              </div>
            ) : notifications.length === 0 ? (
              <div className="py-6 text-center text-sm text-muted-foreground">
                <Bell className="size-8 mx-auto mb-2 opacity-30" />
                <p>No notifications</p>
                <p className="text-xs mt-1">You&apos;re all caught up!</p>
              </div>
            ) : (
              <div className="max-h-[400px] overflow-y-auto">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-3 border-b last:border-0 ${
                      notification.is_read ? "opacity-60" : "bg-pink-50/50"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`size-8 rounded-full flex items-center justify-center shrink-0 ${
                        notification.type === "studio_invite" 
                          ? "bg-blue-100 text-blue-600"
                          : notification.type === "invite_accepted"
                          ? "bg-green-100 text-green-600"
                          : notification.type === "model_left"
                          ? "bg-amber-100 text-amber-600"
                          : "bg-slate-100 text-slate-600"
                      }`}>
                        {notification.type === "studio_invite" ? (
                          <Building2 className="size-4" />
                        ) : notification.type === "invite_accepted" ? (
                          <User className="size-4" />
                        ) : (
                          <Bell className="size-4" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-900">{notification.title}</p>
                        {notification.message && (
                          <p className="text-xs text-slate-500 mt-0.5">{notification.message}</p>
                        )}
                        <p className="text-[10px] text-slate-400 mt-1">
                          {formatTimeAgo(notification.created_at)}
                        </p>
                        
                        {/* Studio invite actions */}
                        {notification.type === "studio_invite" && notification.data?.invite_id && !notification.is_read && (
                          <div className="flex gap-2 mt-2">
                            <button
                              onClick={() => handleInviteResponse(notification.data.invite_id, "accept")}
                              disabled={isRespondingToInvite === notification.data.invite_id}
                              className="px-3 py-1 text-xs font-medium bg-pink-600 text-white rounded-full hover:bg-pink-700 disabled:opacity-50"
                            >
                              {isRespondingToInvite === notification.data.invite_id ? (
                                <Loader2 className="size-3 animate-spin" />
                              ) : (
                                "Accept"
                              )}
                            </button>
                            <button
                              onClick={() => handleInviteResponse(notification.data.invite_id, "decline")}
                              disabled={isRespondingToInvite === notification.data.invite_id}
                              className="px-3 py-1 text-xs font-medium bg-slate-200 text-slate-700 rounded-full hover:bg-slate-300 disabled:opacity-50"
                            >
                              Decline
                            </button>
                          </div>
                        )}
                      </div>
                      {!notification.is_read && (
                        <button
                          onClick={() => markAsRead([notification.id])}
                          className="size-2 bg-pink-600 rounded-full shrink-0"
                          title="Mark as read"
                        />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
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

      console.log("Layout - Auth user:", { id: session.user.id, email: session.user.email });

      // Fetch user profile via API (bypasses RLS issues)
      const response = await fetch("/api/auth/me", {
        credentials: "include",
      });

      console.log("Layout - API response status:", response.status);

      if (response.status === 401) {
        // Session invalid, redirect to login
        router.push("/dashboard/login");
        return;
      }

      if (response.status === 404) {
        // User needs to complete setup
        console.log("Layout - No user found, redirecting to setup");
        router.push("/dashboard/setup");
        return;
      }

      if (response.status === 403) {
        // Account disabled
        await supabase.auth.signOut();
        router.push("/dashboard/login?error=disabled");
        return;
      }

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Layout - API error:", errorData);
        throw new Error(errorData.error || "Failed to fetch user");
      }

      const data = await response.json();
      console.log("Layout - User data received:", { 
        user: !!data.user, 
        creator: !!data.creator, 
        apiKey: !!data.apiKey 
      });

      setUser(data.user);
      
      if (data.creator) {
        setCreator(data.creator as Creator);
      }
      
      if (data.apiKey) {
        setApiKey(data.apiKey);
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
      <MediaStateProvider
        apiKey={apiKey}
        userRole={user?.role as "admin" | "business" | "independent" | null}
        userCreatorId={user?.creator_id}
        userStudioId={user?.studio_id}
      >
        <TooltipProvider delayDuration={0}>
          <SidebarProvider>
            <div className="flex min-h-screen w-full overflow-x-hidden">
              <AppSidebar user={user} onLogout={handleLogout} />
              <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                <Header user={user} dashboardUserId={user?.id} />
                <main className="flex-1 p-3 sm:p-6 lg:p-8 overflow-x-hidden">
                  <div className="mx-auto max-w-6xl w-full">{children}</div>
                </main>
              </div>
            </div>
          </SidebarProvider>
        </TooltipProvider>
      </MediaStateProvider>
    </DashboardContext.Provider>
  );
}
