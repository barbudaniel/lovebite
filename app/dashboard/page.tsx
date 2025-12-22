"use client";

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { useDashboard } from "./layout";
import { createApiClient, type CreatorStats, type PlatformOverview } from "@/lib/media-api";
import { getSupabaseBrowserClient } from "@/lib/supabase";
import {
  Image as ImageIcon,
  Video,
  Music,
  FileText,
  TrendingUp,
  Users,
  Eye,
  ArrowUpRight,
  ArrowDownRight,
  BarChart3,
  Loader2,
  Globe,
  MousePointerClick,
  Link2,
  Upload,
  Calendar,
  Sparkles,
  Key,
  Settings,
  ChevronRight,
  FolderOpen,
  Zap,
  Heart,
  Activity,
  LogIn,
  MessageCircle,
  Bot,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { Area, AreaChart, XAxis, YAxis, Line, LineChart } from "recharts";

// ============================================
// TYPES
// ============================================

interface BioAnalytics {
  summary: {
    totalViews: number;
    uniqueVisitors: number;
    totalClicks: number;
    clickThroughRate: string;
  };
  viewsByDay: Record<string, number>;
  topCountries: Array<{ country: string; count: number }>;
}

interface ActivityLog {
  id: string;
  action: string;
  description: string;
  source: string;
  created_at: string;
  user?: { display_name: string } | null;
  creator?: { username: string } | null;
}

// ============================================
// CHART CONFIG
// ============================================

const chartConfig = {
  views: { label: "Views", color: "#8b5cf6" },
  clicks: { label: "Clicks", color: "#06b6d4" },
} satisfies ChartConfig;

// ============================================
// GRADIENT STAT CARD
// ============================================

function GradientStatCard({
  label,
  value,
  icon: Icon,
  trend,
  trendUp = true,
  gradient,
}: {
  label: string;
  value: string | number;
  icon: React.ComponentType<{ className?: string }>;
  trend?: string;
  trendUp?: boolean;
  gradient: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-2xl p-5 ${gradient} relative overflow-hidden`}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
      <div className="relative">
        <div className="flex items-center justify-between mb-3">
          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
            <Icon className="w-5 h-5 text-white" />
          </div>
          {trend && (
            <span className={`text-xs font-semibold flex items-center gap-0.5 ${
              trendUp ? "text-green-300" : "text-red-300"
            }`}>
              {trendUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
              {trend}
            </span>
          )}
        </div>
        <p className="text-3xl font-bold text-white">
          {typeof value === "number" ? value.toLocaleString() : value}
        </p>
        <p className="text-sm text-white/70 mt-1">{label}</p>
      </div>
    </motion.div>
  );
}

// ============================================
// QUICK ACTION
// ============================================

function QuickAction({
  title,
  description,
  href,
  icon: Icon,
  color,
}: {
  title: string;
  description: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}) {
  return (
    <Link href={href}>
      <motion.div
        whileHover={{ scale: 1.02 }}
        className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-all group cursor-pointer border border-transparent hover:border-slate-200"
      >
        <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center shrink-0`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-slate-900">{title}</p>
          <p className="text-xs text-slate-500">{description}</p>
        </div>
        <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
      </motion.div>
    </Link>
  );
}

// ============================================
// CONTENT STAT
// ============================================

function ContentStat({
  icon: Icon,
  label,
  value,
  bg,
  iconColor,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: number;
  bg: string;
  iconColor: string;
}) {
  return (
    <div className={`${bg} rounded-xl p-4 text-center`}>
      <Icon className={`w-6 h-6 ${iconColor} mx-auto mb-2`} />
      <p className="text-2xl font-bold text-slate-900">{value}</p>
      <p className="text-xs text-slate-600">{label}</p>
    </div>
  );
}

// ============================================
// EMPTY STATE
// ============================================

function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-gradient-to-br from-violet-50 via-white to-pink-50 rounded-2xl border border-violet-100 p-12 text-center"
    >
      <div className="w-20 h-20 bg-gradient-to-br from-violet-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-violet-500/30">
        <Sparkles className="w-10 h-10 text-white" />
      </div>
      <h3 className="text-2xl font-bold text-slate-900 mb-3">Welcome to Lovebite</h3>
      <p className="text-slate-600 mb-8 max-w-md mx-auto">
        Start building your presence by uploading content or creating your bio link page.
      </p>
      <div className="flex items-center justify-center gap-4">
        <Link href="/dashboard/media">
          <Button className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700">
            <Upload className="w-4 h-4 mr-2" />
            Upload Media
          </Button>
        </Link>
        <Link href="/dashboard/bio-links">
          <Button variant="outline">
            <Link2 className="w-4 h-4 mr-2" />
            Create Bio Link
          </Button>
        </Link>
      </div>
    </motion.div>
  );
}

// ============================================
// SKELETON COMPONENTS
// ============================================

function SkeletonPulse({ className }: { className?: string }) {
  return (
    <div className={`animate-pulse bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 bg-[length:200%_100%] rounded ${className}`} />
  );
}

function GradientStatCardSkeleton({ gradient }: { gradient: string }) {
  return (
    <div className={`rounded-2xl p-5 ${gradient} relative overflow-hidden`}>
      <div className="absolute inset-0 opacity-10">
        <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-white/20" />
      </div>
      <div className="relative">
        <div className="h-4 w-16 bg-white/30 rounded animate-pulse mb-3" />
        <div className="h-9 w-20 bg-white/40 rounded animate-pulse mb-2" />
        <div className="h-3 w-24 bg-white/20 rounded animate-pulse" />
      </div>
      <div className="absolute top-5 right-5 w-10 h-10 rounded-xl bg-white/20 animate-pulse" />
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between">
        <div>
          <SkeletonPulse className="h-8 w-64 mb-2" />
          <SkeletonPulse className="h-4 w-48" />
        </div>
        <SkeletonPulse className="h-9 w-32 rounded-md" />
      </div>

      {/* Stats Grid Skeleton */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <GradientStatCardSkeleton gradient="bg-gradient-to-br from-violet-500 to-purple-600" />
        <GradientStatCardSkeleton gradient="bg-gradient-to-br from-cyan-500 to-blue-600" />
        <GradientStatCardSkeleton gradient="bg-gradient-to-br from-amber-500 to-orange-600" />
        <GradientStatCardSkeleton gradient="bg-gradient-to-br from-emerald-500 to-teal-600" />
      </div>

      {/* Main Content Grid Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart Skeleton */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <SkeletonPulse className="h-5 w-32 mb-1" />
              <SkeletonPulse className="h-4 w-24" />
            </div>
            <SkeletonPulse className="h-8 w-24 rounded-md" />
          </div>
          <div className="h-[200px] flex items-end gap-1">
            {[...Array(7)].map((_, i) => (
              <div
                key={i}
                className="flex-1 bg-gradient-to-t from-violet-100 to-violet-50 rounded-t animate-pulse"
                style={{ 
                  height: `${40 + Math.sin(i) * 30 + Math.random() * 20}%`,
                  animationDelay: `${i * 100}ms`
                }}
              />
            ))}
          </div>
        </div>

        {/* Activity Feed Skeleton */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <SkeletonPulse className="h-5 w-32" />
            <SkeletonPulse className="h-8 w-20 rounded-md" />
          </div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-start gap-3 py-2">
                <SkeletonPulse className="w-8 h-8 rounded-full flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <SkeletonPulse className="h-4 w-full mb-1" />
                  <SkeletonPulse className="h-3 w-20" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions Skeleton */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6">
        <SkeletonPulse className="h-5 w-28 mb-4" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="p-4 rounded-xl bg-slate-50 flex items-center gap-3">
              <SkeletonPulse className="w-10 h-10 rounded-lg" />
              <div className="flex-1">
                <SkeletonPulse className="h-4 w-20 mb-1" />
                <SkeletonPulse className="h-3 w-16" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================================
// MAIN PAGE
// ============================================

export default function DashboardPage() {
  const { user, apiKey, creator } = useDashboard();
  const [mediaStats, setMediaStats] = useState<CreatorStats | PlatformOverview | null>(null);
  const [bioAnalytics, setBioAnalytics] = useState<BioAnalytics | null>(null);
  const [recentActivity, setRecentActivity] = useState<ActivityLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAllData();
  }, [apiKey, user]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchAllData = async () => {
    setIsLoading(true);
    
    const supabase = getSupabaseBrowserClient();
    
    // Create all promises for parallel fetching
    const promises: Promise<void>[] = [];
    
    // 1. Fetch activity logs (always)
    const activityPromise = supabase
      .from("activity_logs")
      .select(`
        id, action, description, source, created_at,
        user:dashboard_users(display_name),
        creator:creators(username)
      `)
      .order("created_at", { ascending: false })
      .limit(5)
      .then(({ data }) => {
        setRecentActivity(data || []);
      })
      .catch((err) => console.error("Error fetching activity:", err));
    
    promises.push(activityPromise);
    
    // 2. Fetch media stats (if API key)
    if (apiKey) {
      const api = createApiClient(apiKey);
      const mediaPromise = (async () => {
        try {
          if (user?.role === "admin") {
            const response = await api.getPlatformOverview();
            if (response.success && response.data) {
              setMediaStats(response.data);
            }
          } else if (user?.creator_id) {
            const response = await api.getCreatorStats(user.creator_id, 12);
            if (response.success && response.data) {
              setMediaStats(response.data);
            }
          }
        } catch (err) {
          console.error("Error fetching media stats:", err);
        }
      })();
      promises.push(mediaPromise);
    }

    // 3. Fetch bio analytics (if creator)
    if (user?.creator_id) {
      const bioPromise = (async () => {
        try {
          const { data: bioLink } = await supabase
            .from("bio_links")
            .select("id")
            .eq("creator_id", user.creator_id)
            .maybeSingle();

          if (bioLink?.id) {
            const response = await fetch(`/api/analytics/bio/${bioLink.id}?period=7d`);
            if (response.ok) {
              const data = await response.json();
              setBioAnalytics(data);
            }
          }
        } catch (err) {
          console.error("Error fetching bio analytics:", err);
        }
      })();
      promises.push(bioPromise);
    }
    
    // Wait for all promises to complete
    await Promise.all(promises);
    setIsLoading(false);
  };

  const isCreatorStats = (s: CreatorStats | PlatformOverview): s is CreatorStats => {
    return "creator" in s;
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  // Line chart data
  const chartData = bioAnalytics?.viewsByDay
    ? Object.entries(bioAnalytics.viewsByDay)
        .map(([date, views]) => ({
          date: new Date(date).toLocaleDateString("en-US", { weekday: "short" }),
          views,
          clicks: Math.floor(views * 0.15), // Simulated click data
        }))
        .slice(-7)
    : [];

  const hasData = mediaStats || (bioAnalytics && bioAnalytics.summary.totalViews > 0);

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            {getGreeting()}, {user?.display_name || creator?.username || "there"}
          </h1>
          <p className="text-slate-500 mt-1">Here&apos;s an overview of your performance</p>
        </div>
        <Link href="/dashboard/statistics">
          <Button variant="outline" size="sm">
            <BarChart3 className="w-4 h-4 mr-2" />
            Full Analytics
          </Button>
        </Link>
      </div>

      {!hasData ? (
        <EmptyState />
      ) : (
        <>
          {/* Bio Link Stats */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Link2 className="w-5 h-5 text-violet-600" />
              <h2 className="text-lg font-semibold text-slate-900">Bio Link Performance</h2>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <GradientStatCard
                label="Page Views"
                value={bioAnalytics?.summary.totalViews || 0}
                icon={Eye}
                trend="12%"
                trendUp={true}
                gradient="bg-gradient-to-br from-violet-500 to-purple-600"
              />
              <GradientStatCard
                label="Unique Visitors"
                value={bioAnalytics?.summary.uniqueVisitors || 0}
                icon={Users}
                trend="8%"
                trendUp={true}
                gradient="bg-gradient-to-br from-cyan-500 to-blue-600"
              />
              <GradientStatCard
                label="Link Clicks"
                value={bioAnalytics?.summary.totalClicks || 0}
                icon={MousePointerClick}
                trend="15%"
                trendUp={true}
                gradient="bg-gradient-to-br from-emerald-500 to-green-600"
              />
              <GradientStatCard
                label="Click Rate"
                value={`${bioAnalytics?.summary.clickThroughRate || 0}%`}
                icon={TrendingUp}
                gradient="bg-gradient-to-br from-orange-500 to-amber-500"
              />
            </div>
          </div>

          {/* Traffic Chart */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Traffic Overview</h2>
                <p className="text-sm text-slate-500">Views and clicks over the last 7 days</p>
              </div>
              <Link href="/dashboard/statistics" className="text-sm text-violet-600 hover:text-violet-700 font-medium">
                View details →
              </Link>
            </div>

            {chartData.length > 0 ? (
              <ChartContainer config={chartConfig} className="h-[280px] w-full">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, bottom: 10, left: 0 }}>
                  <defs>
                    <linearGradient id="viewsGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="clicksGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="date"
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 12, fill: "#94a3b8" }}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 12, fill: "#94a3b8" }}
                    width={40}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Area
                    type="monotone"
                    dataKey="views"
                    stroke="#8b5cf6"
                    strokeWidth={2}
                    fill="url(#viewsGradient)"
                  />
                  <Area
                    type="monotone"
                    dataKey="clicks"
                    stroke="#06b6d4"
                    strokeWidth={2}
                    fill="url(#clicksGradient)"
                  />
                </AreaChart>
              </ChartContainer>
            ) : (
              <div className="h-[280px] flex items-center justify-center bg-gradient-to-br from-slate-50 to-violet-50 rounded-xl">
                <div className="text-center">
                  <BarChart3 className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                  <p className="text-slate-500 font-medium">No traffic data yet</p>
                  <p className="text-sm text-slate-400">Share your bio link to start tracking</p>
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Media Library Stats */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <FolderOpen className="w-5 h-5 text-blue-600" />
                  <h2 className="text-lg font-semibold text-slate-900">Media Library</h2>
                </div>
                <Link href="/dashboard/media" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                  View all →
                </Link>
              </div>

              {mediaStats && isCreatorStats(mediaStats) ? (
                <>
                  <div className="grid grid-cols-4 gap-3 mb-4">
                    <ContentStat
                      icon={ImageIcon}
                      label="Photos"
                      value={mediaStats.all_time.photos}
                      bg="bg-blue-50"
                      iconColor="text-blue-500"
                    />
                    <ContentStat
                      icon={Video}
                      label="Videos"
                      value={mediaStats.all_time.videos}
                      bg="bg-purple-50"
                      iconColor="text-purple-500"
                    />
                    <ContentStat
                      icon={Music}
                      label="Audio"
                      value={mediaStats.all_time.audios}
                      bg="bg-orange-50"
                      iconColor="text-orange-500"
                    />
                    <ContentStat
                      icon={FileText}
                      label="Custom"
                      value={mediaStats.all_time.customs}
                      bg="bg-green-50"
                      iconColor="text-green-500"
                    />
                  </div>
                  <div className="pt-4 border-t border-slate-100">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600">This month</span>
                      <span className="text-sm font-semibold text-slate-900">
                        +{mediaStats.current_month.total} uploads
                      </span>
                    </div>
                  </div>
                </>
              ) : (
                <div className="h-[140px] flex items-center justify-center bg-slate-50 rounded-xl">
                  <div className="text-center">
                    <FolderOpen className="w-10 h-10 mx-auto mb-2 text-slate-300" />
                    <p className="text-slate-500 text-sm">No media uploaded yet</p>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Quick Actions</h2>
              <div className="space-y-2">
                <QuickAction
                  title="Upload Media"
                  description="Add photos, videos & more"
                  href="/dashboard/media"
                  icon={Upload}
                  color="bg-gradient-to-br from-blue-500 to-blue-600"
                />
                <QuickAction
                  title="Edit Bio Link"
                  description="Customize your link page"
                  href="/dashboard/bio-links"
                  icon={Link2}
                  color="bg-gradient-to-br from-violet-500 to-purple-600"
                />
                <QuickAction
                  title="View Analytics"
                  description="Check your performance"
                  href="/dashboard/statistics"
                  icon={BarChart3}
                  color="bg-gradient-to-br from-emerald-500 to-green-600"
                />
                <QuickAction
                  title="Manage Accounts"
                  description="Platform credentials"
                  href="/dashboard/accounts"
                  icon={Key}
                  color="bg-gradient-to-br from-orange-500 to-amber-500"
                />
              </div>
            </div>
          </div>

          {/* Top Countries */}
          {bioAnalytics?.topCountries && bioAnalytics.topCountries.length > 0 && (
            <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl p-6 text-white">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Globe className="w-5 h-5 text-violet-400" />
                  <h2 className="text-lg font-semibold">Top Visitors by Country</h2>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {bioAnalytics.topCountries.slice(0, 5).map((item, idx) => (
                  <div key={item.country} className="bg-white/10 rounded-xl p-4 backdrop-blur">
                    <div className="text-3xl mb-2">{getCountryFlag(item.country)}</div>
                    <p className="text-xl font-bold">{item.count}</p>
                    <p className="text-sm text-white/60">{item.country}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Recent Activity */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-slate-600" />
                <h2 className="text-lg font-semibold text-slate-900">Recent Activity</h2>
              </div>
              <Link href="/dashboard/activity">
                <Button variant="ghost" size="sm" className="text-slate-600 hover:text-slate-900">
                  View All
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </div>
            
            {recentActivity.length > 0 ? (
              <div className="space-y-3">
                {recentActivity.map((log) => {
                  const actionIcons: Record<string, typeof Activity> = {
                    media_upload: Upload,
                    login: LogIn,
                    bio_update: Link2,
                    settings_update: Settings,
                    whatsapp_message: MessageCircle,
                    bot_action: Bot,
                    default: Activity,
                  };
                  const Icon = actionIcons[log.action] || actionIcons.default;
                  
                  return (
                    <div
                      key={log.id}
                      className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors"
                    >
                      <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center">
                        <Icon className="w-4 h-4 text-slate-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-900 truncate">
                          {log.description}
                        </p>
                        <p className="text-xs text-slate-500">
                          {log.source === "whatsapp_bot" ? "WhatsApp Bot" : "Dashboard"}
                          {" • "}
                          {formatDistanceToNow(new Date(log.created_at), { addSuffix: true })}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <Activity className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                <p className="text-sm text-slate-500">No recent activity</p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

// Helper
function getCountryFlag(country: string): string {
  const flags: Record<string, string> = {
    "United States": "🇺🇸", "United Kingdom": "🇬🇧", "Germany": "🇩🇪",
    "France": "🇫🇷", "Canada": "🇨🇦", "Australia": "🇦🇺",
    "Netherlands": "🇳🇱", "Spain": "🇪🇸", "Italy": "🇮🇹",
    "Brazil": "🇧🇷", "Romania": "🇷🇴", "Unknown": "🌍",
  };
  return flags[country] || "🌍";
}

