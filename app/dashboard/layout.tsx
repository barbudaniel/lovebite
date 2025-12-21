"use client";

import { useState, useEffect, createContext, useContext } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { getSupabaseBrowserClient } from "@/lib/supabase";
import type { DashboardUser } from "@/lib/auth";
import {
  LayoutDashboard,
  Image as ImageIcon,
  Link2,
  Users,
  Settings,
  LogOut,
  Menu,
  X,
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
} from "lucide-react";

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
  children?: NavItem[];
}

const navigationItems: NavItem[] = [
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
    label: "Albums",
    href: "/dashboard/albums",
    icon: FolderOpen,
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

const adminItems: NavItem[] = [
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
// SIDEBAR COMPONENT
// ============================================

function Sidebar({
  isOpen,
  onClose,
  user,
  onLogout,
}: {
  isOpen: boolean;
  onClose: () => void;
  user: DashboardUser | null;
  onLogout: () => void;
}) {
  const pathname = usePathname();

  const filteredNav = navigationItems.filter(
    (item) => !item.roles || (user && item.roles.includes(user.role))
  );

  const filteredAdmin = adminItems.filter(
    (item) => !item.roles || (user && item.roles.includes(user.role))
  );

  const getRoleBadge = () => {
    if (!user) return null;
    const colors = {
      admin: "bg-red-100 text-red-700",
      studio: "bg-blue-100 text-blue-700",
      model: "bg-purple-100 text-purple-700",
    };
    const icons = {
      admin: Shield,
      studio: Building2,
      model: User,
    };
    const Icon = icons[user.role];
    return (
      <span
        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${colors[user.role]}`}
      >
        <Icon className="w-3 h-3" />
        {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
      </span>
    );
  };

  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ x: isOpen ? 0 : "-100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="fixed left-0 top-0 bottom-0 w-72 bg-slate-900 text-white z-50 lg:translate-x-0 lg:static"
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="px-6 py-5 border-b border-slate-800">
            <Link href="/dashboard" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center">
                <span className="text-xl font-bold text-white">L</span>
              </div>
              <div>
                <h1 className="text-lg font-bold text-white">Lovebite</h1>
                <p className="text-xs text-slate-400">Creator Dashboard</p>
              </div>
            </Link>
            {/* Mobile close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 hover:bg-slate-800 rounded-lg lg:hidden"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
            {filteredNav.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all ${
                    isActive
                      ? "bg-brand-600 text-white shadow-lg shadow-brand-600/25"
                      : "text-slate-300 hover:bg-slate-800 hover:text-white"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}

            {/* Admin Section */}
            {filteredAdmin.length > 0 && (
              <>
                <div className="pt-4 pb-2">
                  <p className="px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Admin
                  </p>
                </div>
                {filteredAdmin.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={onClose}
                      className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all ${
                        isActive
                          ? "bg-brand-600 text-white shadow-lg shadow-brand-600/25"
                          : "text-slate-300 hover:bg-slate-800 hover:text-white"
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{item.label}</span>
                    </Link>
                  );
                })}
              </>
            )}
          </nav>

          {/* User Section */}
          <div className="p-4 border-t border-slate-800">
            <div className="flex items-center gap-3 px-3 py-2 mb-3">
              <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center">
                {user?.avatar_url ? (
                  <img
                    src={user.avatar_url}
                    alt=""
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <User className="w-5 h-5 text-slate-400" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">
                  {user?.display_name || user?.email || "User"}
                </p>
                {getRoleBadge()}
              </div>
            </div>
            <button
              onClick={onLogout}
              className="flex items-center gap-3 w-full px-4 py-2.5 text-slate-300 hover:bg-slate-800 hover:text-white rounded-xl transition-all"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Sign Out</span>
            </button>
          </div>
        </div>
      </motion.aside>
    </>
  );
}

// ============================================
// HEADER COMPONENT
// ============================================

function Header({
  onMenuClick,
  user,
}: {
  onMenuClick: () => void;
  user: DashboardUser | null;
}) {
  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-slate-200">
      <div className="flex items-center justify-between px-4 sm:px-6 h-16">
        <button
          onClick={onMenuClick}
          className="p-2 hover:bg-slate-100 rounded-lg lg:hidden"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex-1 lg:flex-none" />

        <div className="flex items-center gap-3">
          <button className="relative p-2 hover:bg-slate-100 rounded-lg">
            <Bell className="w-5 h-5 text-slate-600" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-brand-500 rounded-full" />
          </button>

          <div className="hidden sm:flex items-center gap-3 pl-3 border-l border-slate-200">
            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
              {user?.avatar_url ? (
                <img
                  src={user.avatar_url}
                  alt=""
                  className="w-8 h-8 rounded-full object-cover"
                />
              ) : (
                <User className="w-4 h-4 text-slate-500" />
              )}
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-slate-900">
                {user?.display_name || user?.creator?.username || "User"}
              </p>
              <p className="text-xs text-slate-500">{user?.email}</p>
            </div>
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
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<DashboardUser | null>(null);
  const [creator, setCreator] = useState<Creator | null>(null);
  const [apiKey, setApiKey] = useState<string | null>(null);
  const router = useRouter();

  const fetchUser = async () => {
    try {
      const supabase = getSupabaseBrowserClient();

      const {
        data: { user: authUser },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !authUser) {
        console.log("No authenticated user, redirecting to login");
        router.push("/dashboard/login");
        return;
      }

      // Get dashboard user profile
      const { data: dashboardUser, error } = await supabase
        .from("dashboard_users")
        .select("*")
        .eq("auth_user_id", authUser.id)
        .single();

      if (error) {
        // If table doesn't exist or user not found, redirect to setup
        console.log("Dashboard user error:", error.message);
        if (error.code === "PGRST116" || error.code === "42P01") {
          // No row found or table doesn't exist
          router.push("/dashboard/setup");
          return;
        }
        // Other error - redirect to setup anyway
        router.push("/dashboard/setup");
        return;
      }

      if (!dashboardUser) {
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

      // Get API key if available (for API calls)
      // Skip if no creator_id or studio_id to avoid invalid query
      if (dashboardUser.creator_id || dashboardUser.studio_id) {
        try {
          const filters = [];
          if (dashboardUser.creator_id) {
            filters.push(`creator_id.eq.${dashboardUser.creator_id}`);
          }
          if (dashboardUser.studio_id) {
            filters.push(`studio_id.eq.${dashboardUser.studio_id}`);
          }
          
          const { data: apiUser } = await supabase
            .from("api_users")
            .select("api_key")
            .or(filters.join(","))
            .eq("enabled", true)
            .single();

          if (apiUser?.api_key) {
            setApiKey(apiUser.api_key);
          }
        } catch (e) {
          console.log("API key not found:", e);
        }
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
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_OUT") {
        router.push("/dashboard/login");
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [router]);

  const handleLogout = async () => {
    const supabase = getSupabaseBrowserClient();
    await supabase.auth.signOut();
    router.push("/dashboard/login");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-brand-600 animate-spin mx-auto mb-4" />
          <p className="text-slate-500">Loading dashboard...</p>
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
      <div className="min-h-screen bg-slate-50 flex">
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          user={user}
          onLogout={handleLogout}
        />

        <div className="flex-1 flex flex-col min-w-0">
          <Header onMenuClick={() => setIsSidebarOpen(true)} user={user} />
          <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
        </div>
      </div>
    </DashboardContext.Provider>
  );
}

