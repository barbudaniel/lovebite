"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "motion/react";
import { useDashboard } from "../layout";
import { getSupabaseBrowserClient } from "@/lib/supabase";
import {
  createApiClient,
  type CreatorStats,
  type PlatformOverview,
} from "@/lib/media-api";
import {
  Image as ImageIcon,
  Video,
  Music,
  FileText,
  TrendingUp,
  TrendingDown,
  Calendar,
  BarChart3,
  Loader2,
  Eye,
  Users,
  MousePointerClick,
  Globe,
  Smartphone,
  Monitor,
  Tablet,
  ArrowUpRight,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import {
  Bar,
  BarChart,
  XAxis,
  YAxis,
  Area,
  AreaChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
} from "recharts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";

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
  viewsByCountry: Record<string, number>;
  viewsByDevice: Record<string, number>;
  topLinks: Array<{ label: string; count: number }>;
  topReferrers: Array<{ referrer: string; count: number }>;
}

interface ModelBioStats {
  creatorId: string;
  username: string;
  views: number;
  clicks: number;
  uniqueVisitors: number;
}

interface AggregatedBioStats {
  totalViews: number;
  totalClicks: number;
  totalUniqueVisitors: number;
  modelStats: ModelBioStats[];
}

// ============================================
// CHART CONFIGS
// ============================================

const chartConfig = {
  views: { label: "Views", color: "#3b82f6" },
  clicks: { label: "Clicks", color: "#10b981" },
  photos: { label: "Photos", color: "#8b5cf6" },
  videos: { label: "Videos", color: "#f59e0b" },
  audios: { label: "Audio", color: "#ef4444" },
  customs: { label: "Customs", color: "#06b6d4" },
} satisfies ChartConfig;

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4"];

// ============================================
// STAT CARD
// ============================================

function StatCard({
  label,
  value,
  change,
  changeType = "neutral",
  icon: Icon,
  iconBg,
}: {
  label: string;
  value: string | number;
  change?: string;
  changeType?: "up" | "down" | "neutral";
  icon: React.ComponentType<{ className?: string }>;
  iconBg: string;
}) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-slate-500 mb-1">{label}</p>
          <p className="text-2xl font-bold text-slate-900">
            {typeof value === "number" ? value.toLocaleString() : value}
          </p>
          {change && (
            <div className={`flex items-center gap-1 mt-2 text-sm ${
              changeType === "up" ? "text-green-600" :
              changeType === "down" ? "text-red-600" : "text-slate-500"
            }`}>
              {changeType === "up" && <TrendingUp className="w-3 h-3" />}
              {changeType === "down" && <TrendingDown className="w-3 h-3" />}
              <span>{change}</span>
            </div>
          )}
        </div>
        <div className={`w-10 h-10 rounded-lg ${iconBg} flex items-center justify-center`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
      </div>
    </div>
  );
}

// ============================================
// SECTION HEADER
// ============================================

function SectionHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between mb-4">
      <div>
        <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
        {subtitle && <p className="text-sm text-slate-500">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

// ============================================
// TOP ITEM ROW
// ============================================

function TopItemRow({
  label,
  value,
  percentage,
  color,
  icon,
}: {
  label: string;
  value: number;
  percentage: number;
  color: string;
  icon?: string;
}) {
  return (
    <div className="flex items-center gap-3 py-2">
      {icon && <span className="text-lg">{icon}</span>}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <span className="text-sm font-medium text-slate-700 truncate">{label}</span>
          <span className="text-sm text-slate-900 font-semibold">{value.toLocaleString()}</span>
        </div>
        <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${percentage}%`, backgroundColor: color }}
          />
        </div>
      </div>
    </div>
  );
}

// ============================================
// MODEL SELECTOR
// ============================================

interface ModelOption {
  id: string;
  username: string;
}

function ModelSelector({
  models,
  selectedId,
  onSelect,
}: {
  models: ModelOption[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
}) {
  return (
    <Select value={selectedId || "all"} onValueChange={(v) => onSelect(v === "all" ? null : v)}>
      <SelectTrigger className="w-[200px]">
        <Users className="w-4 h-4 mr-2" />
        <SelectValue placeholder="Select model" />
      </SelectTrigger>
      <SelectContent>
          <SelectItem value="all">All Models (Overview)</SelectItem>
          {models.map((model) => (
            <SelectItem key={model.id} value={model.id}>
              {model.username}
            </SelectItem>
          ))}
      </SelectContent>
    </Select>
  );
}

// ============================================
// MAIN PAGE
// ============================================

export default function StatisticsPage() {
  const { user, apiKey, creator } = useDashboard();
  const searchParams = useSearchParams();
  const creatorParam = searchParams.get("creator");
  
  const [mediaStats, setMediaStats] = useState<CreatorStats | PlatformOverview | null>(null);
  const [bioAnalytics, setBioAnalytics] = useState<BioAnalytics | null>(null);
  const [aggregatedBioStats, setAggregatedBioStats] = useState<AggregatedBioStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [period, setPeriod] = useState<"7d" | "30d" | "90d">("30d");
  const [models, setModels] = useState<ModelOption[]>([]);
  const [selectedModelId, setSelectedModelId] = useState<string | null>(creatorParam);
  const [initialized, setInitialized] = useState(false);

  const isAdminOrStudio = user?.role === "admin" || user?.role === "studio";
  
  // Initialize selectedModelId from URL param
  useEffect(() => {
    if (!initialized && creatorParam) {
      setSelectedModelId(creatorParam);
      setInitialized(true);
    }
  }, [creatorParam, initialized]);

  // Fetch available models for admin/studio
  useEffect(() => {
    if (!isAdminOrStudio) return;

    const fetchModels = async () => {
      const supabase = getSupabaseBrowserClient();
      let query = supabase.from("creators").select("id, username").eq("enabled", true);
      
      // Studio can only see their own models
      if (user?.role === "studio" && user?.studio_id) {
        query = query.eq("studio_id", user.studio_id);
      }
      
      const { data } = await query.order("username");
      if (data && data.length > 0) {
        setModels(data);
      }
    };

    fetchModels();
  }, [isAdminOrStudio, user]);

  useEffect(() => {
    fetchAllData();
  }, [apiKey, user, period, selectedModelId]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchAllData = async () => {
    setIsLoading(true);
    try {
      const api = apiKey ? createApiClient(apiKey) : null;
      const supabase = getSupabaseBrowserClient();

      // Determine which creator to fetch stats for
      let targetCreatorId: string | null = null;
      
      if (user?.role === "model") {
        targetCreatorId = user?.creator_id || null;
      } else if (isAdminOrStudio && selectedModelId) {
        targetCreatorId = selectedModelId;
      }

      // Fetch media stats
      if (api) {
        if (targetCreatorId) {
          // Fetch specific creator stats
          const response = await api.getCreatorStats(targetCreatorId, 12);
          if (response.success && response.data) {
            setMediaStats(response.data);
          }
        } else if (isAdminOrStudio) {
          // Fetch platform overview
          const response = await api.getPlatformOverview();
          if (response.success && response.data) {
            setMediaStats(response.data);
          }
        }
      }

      // Fetch bio analytics
      if (targetCreatorId) {
        // Clear aggregated stats when viewing specific model
        setAggregatedBioStats(null);
        
        const { data: bioLink } = await supabase
          .from("bio_links")
          .select("id")
          .eq("creator_id", targetCreatorId)
          .maybeSingle();

        if (bioLink?.id) {
          const response = await fetch(`/api/analytics/bio/${bioLink.id}?period=${period}`);
          if (response.ok) {
            const data = await response.json();
            setBioAnalytics(data);
          } else {
            setBioAnalytics(null);
          }
        } else {
          setBioAnalytics(null);
        }
      } else if (isAdminOrStudio) {
        // Fetch aggregated bio analytics for all models
        setBioAnalytics(null);
        const aggResponse = await fetch(`/api/analytics/bio/models?period=${period}`);
        if (aggResponse.ok) {
          const aggData = await aggResponse.json();
          setAggregatedBioStats(aggData);
        } else {
          setAggregatedBioStats(null);
        }
      }
    } catch (err) {
      console.error("Error fetching stats:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const isCreatorStats = (s: CreatorStats | PlatformOverview): s is CreatorStats => {
    return "creator" in s;
  };

  // Prepare chart data
  const viewsChartData = bioAnalytics?.viewsByDay
    ? Object.entries(bioAnalytics.viewsByDay)
        .map(([date, views]) => ({
          date: new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
          views,
        }))
        .slice(-14)
    : [];

  const countryData = bioAnalytics?.viewsByCountry
    ? Object.entries(bioAnalytics.viewsByCountry)
        .map(([country, count]) => ({ country, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5)
    : [];

  const deviceData = bioAnalytics?.viewsByDevice
    ? Object.entries(bioAnalytics.viewsByDevice)
        .map(([device, count]) => ({ device: device.charAt(0).toUpperCase() + device.slice(1), count }))
    : [];

  const mediaChartData = mediaStats && isCreatorStats(mediaStats)
    ? mediaStats.monthly_stats?.slice(-6).map((m) => ({
        month: m.month.slice(0, 3),
        photos: m.photos,
        videos: m.videos,
        audios: m.audios,
      })) || []
    : [];

  const totalViews = bioAnalytics?.summary.totalViews || aggregatedBioStats?.totalViews || 0;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-brand-600 animate-spin" />
      </div>
    );
  }

  // Get selected model name
  const selectedModel = models.find(m => m.id === selectedModelId);
  const displayName = selectedModel?.username || null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Analytics</h1>
          <p className="text-slate-500">
            {selectedModelId && displayName
              ? `Stats for ${displayName}`
              : isAdminOrStudio
              ? "Platform overview & model statistics"
              : "Track your content performance"}
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Model Selector for Admin/Studio */}
          {isAdminOrStudio && models.length > 0 && (
            <ModelSelector
              models={models}
              selectedId={selectedModelId}
              onSelect={setSelectedModelId}
            />
          )}
          
          {/* Period Selector */}
          <Select value={period} onValueChange={(v) => setPeriod(v as any)}>
            <SelectTrigger className="w-[140px]">
              <Calendar className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      

      {/* Overview Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Page Views"
          value={
            bioAnalytics?.summary.totalViews ||
            aggregatedBioStats?.totalViews ||
            0
          }
          change={"+12% from last period"}
          changeType="up"
          icon={Eye}
          iconBg="bg-blue-500"
        />
        <StatCard
          label="Unique Visitors"
          value={
            bioAnalytics?.summary.uniqueVisitors ||
            aggregatedBioStats?.totalUniqueVisitors ||
            0
          }
          change={"+8% from last period"}
          changeType="up"
          icon={Users}
          iconBg="bg-purple-500"
        />
        <StatCard
          label="Link Clicks"
          value={
            bioAnalytics?.summary.totalClicks ||
            aggregatedBioStats?.totalClicks ||
            0
          }
          change={"+15% from last period"}
          changeType="up"
          icon={MousePointerClick}
          iconBg="bg-green-500"
        />
        <StatCard
          label="Click Rate"
          value={`${
            bioAnalytics?.summary.clickThroughRate ||
            (aggregatedBioStats && aggregatedBioStats.totalViews > 0
              ? ((aggregatedBioStats.totalClicks / aggregatedBioStats.totalViews) * 100).toFixed(1)
              : 0)
          }%`}
          icon={TrendingUp}
          iconBg="bg-orange-500"
        />
      </div>

      {/* Model Bio Stats - Horizontal Bar Chart for Admin/Studio */}
      {isAdminOrStudio && !selectedModelId && aggregatedBioStats && aggregatedBioStats.modelStats.length > 0 && (
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <SectionHeader 
            title="Bio Link Performance by Model" 
            subtitle="Views and clicks per model"
          />
          
          <div className="space-y-3 mt-4">
            {aggregatedBioStats.modelStats.slice(0, 10).map((model, idx) => {
              const maxViews = Math.max(...aggregatedBioStats.modelStats.map(m => m.views));
              const viewsPercentage = maxViews > 0 ? (model.views / maxViews) * 100 : 0;
              const clicksPercentage = maxViews > 0 ? (model.clicks / maxViews) * 100 : 0;
              
              return (
                <button
                  key={model.creatorId}
                  onClick={() => setSelectedModelId(model.creatorId)}
                  className="w-full text-left group hover:bg-slate-50 rounded-lg p-3 -mx-3 transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-400 to-purple-500 flex items-center justify-center text-white text-sm font-semibold">
                        {model.username.charAt(0).toUpperCase()}
                      </div>
                      <span className="font-medium text-slate-900 group-hover:text-violet-600 transition-colors">
                        {model.username}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-slate-500">
                        <Eye className="w-3.5 h-3.5 inline mr-1" />
                        {model.views.toLocaleString()}
                      </span>
                      <span className="text-slate-500">
                        <MousePointerClick className="w-3.5 h-3.5 inline mr-1" />
                        {model.clicks.toLocaleString()}
                      </span>
                      <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-violet-500 transition-colors" />
                    </div>
                  </div>
                  <div className="flex gap-1 h-2">
                    <div 
                      className="bg-blue-500 rounded-l transition-all duration-300"
                      style={{ width: `${viewsPercentage}%` }}
                      title={`${model.views} views`}
                    />
                    <div 
                      className="bg-green-500 rounded-r transition-all duration-300"
                      style={{ width: `${clicksPercentage}%` }}
                      title={`${model.clicks} clicks`}
                    />
                  </div>
                </button>
              );
            })}
          </div>
          
          {/* Legend */}
          <div className="flex items-center justify-center gap-6 mt-6 pt-4 border-t border-slate-100">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-blue-500" />
              <span className="text-sm text-slate-600">Views</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-green-500" />
              <span className="text-sm text-slate-600">Clicks</span>
            </div>
          </div>
        </div>
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Traffic Chart - Takes 2 columns */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-6">
          <SectionHeader 
            title="Traffic Overview" 
            subtitle="Daily page views"
            action={
              <Link href="/dashboard/bio-links" className="text-sm text-brand-600 hover:text-brand-700 flex items-center gap-1">
                View details <ArrowUpRight className="w-3 h-3" />
              </Link>
            }
          />
          
          {viewsChartData.length > 0 ? (
            <ChartContainer config={chartConfig} className="h-[280px] w-full">
              <BarChart data={viewsChartData} margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 12, fill: "#64748b" }}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 12, fill: "#64748b" }}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="views" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ChartContainer>
          ) : (
            <div className="h-[280px] flex items-center justify-center text-slate-400">
              <div className="text-center">
                <BarChart3 className="w-12 h-12 mx-auto mb-2 opacity-30" />
                <p>No traffic data yet</p>
              </div>
            </div>
          )}
        </div>

        {/* Top Countries */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <SectionHeader title="Top Countries" subtitle="By page views" />
          
          {countryData.length > 0 ? (
            <div className="space-y-1">
              {countryData.map((item, idx) => (
                <TopItemRow
                  key={item.country}
                  label={item.country}
                  value={item.count}
                  percentage={totalViews > 0 ? (item.count / totalViews) * 100 : 0}
                  color={COLORS[idx % COLORS.length]}
                  icon={getCountryFlag(item.country)}
                />
              ))}
            </div>
          ) : (
            <div className="h-[200px] flex items-center justify-center text-slate-400 text-sm">
              No country data yet
            </div>
          )}
        </div>
      </div>

      {/* Second Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Device Breakdown */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <SectionHeader title="Devices" subtitle="Visitor breakdown" />
          
          {deviceData.length > 0 ? (
            <div className="space-y-4">
              {deviceData.map((item, idx) => {
                const Icon = item.device === "Mobile" ? Smartphone : item.device === "Desktop" ? Monitor : Tablet;
                const total = deviceData.reduce((sum, d) => sum + d.count, 0);
                return (
                  <div key={item.device} className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center`} style={{ backgroundColor: `${COLORS[idx]}20` }}>
                      <Icon className="w-5 h-5" style={{ color: COLORS[idx] }} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-slate-700">{item.device}</span>
                        <span className="text-sm text-slate-500">{total > 0 ? Math.round((item.count / total) * 100) : 0}%</span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${total > 0 ? (item.count / total) * 100 : 0}%`,
                            backgroundColor: COLORS[idx],
                          }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="h-[150px] flex items-center justify-center text-slate-400 text-sm">
              No device data yet
            </div>
          )}
        </div>

        {/* Top Links */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <SectionHeader title="Top Links" subtitle="Most clicked" />
          
          {bioAnalytics?.topLinks && bioAnalytics.topLinks.length > 0 ? (
            <div className="space-y-3">
              {bioAnalytics.topLinks.slice(0, 5).map((link, idx) => (
                <div key={link.label} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-xs font-medium text-slate-600">
                      {idx + 1}
                    </span>
                    <span className="text-sm text-slate-700 truncate max-w-[150px]">{link.label}</span>
                  </div>
                  <span className="text-sm font-semibold text-slate-900">{link.count}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="h-[150px] flex items-center justify-center text-slate-400 text-sm">
              No link clicks yet
            </div>
          )}
        </div>

        {/* Content Stats */}
        {mediaStats && isCreatorStats(mediaStats) ? (
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <SectionHeader title="Content Library" subtitle="Total media" />
            
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-blue-50 rounded-lg p-4 text-center">
                <ImageIcon className="w-5 h-5 text-blue-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-blue-900">{mediaStats.all_time.photos}</p>
                <p className="text-xs text-blue-600">Photos</p>
              </div>
              <div className="bg-purple-50 rounded-lg p-4 text-center">
                <Video className="w-5 h-5 text-purple-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-purple-900">{mediaStats.all_time.videos}</p>
                <p className="text-xs text-purple-600">Videos</p>
              </div>
              <div className="bg-orange-50 rounded-lg p-4 text-center">
                <Music className="w-5 h-5 text-orange-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-orange-900">{mediaStats.all_time.audios}</p>
                <p className="text-xs text-orange-600">Audio</p>
              </div>
              <div className="bg-green-50 rounded-lg p-4 text-center">
                <FileText className="w-5 h-5 text-green-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-green-900">{mediaStats.all_time.customs}</p>
                <p className="text-xs text-green-600">Customs</p>
              </div>
            </div>
          </div>
        ) : mediaStats && !isCreatorStats(mediaStats) && isAdminOrStudio && !selectedModelId ? (
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <SectionHeader title="Platform Overview" subtitle="Total content" />
            
            <div className="space-y-4">
              {/* Total Media - Highlighted */}
              <div className="bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl p-4 text-center text-white">
                <BarChart3 className="w-6 h-6 mx-auto mb-2 opacity-80" />
                <p className="text-3xl font-bold">{((mediaStats as PlatformOverview).counts?.total_media || (mediaStats as PlatformOverview).all_time?.total || 0).toLocaleString()}</p>
                <p className="text-sm opacity-80">Total Media Files</p>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-blue-50 rounded-lg p-4 text-center">
                  <ImageIcon className="w-5 h-5 text-blue-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-blue-900">{(mediaStats as PlatformOverview).all_time?.photos || 0}</p>
                  <p className="text-xs text-blue-600">Photos</p>
                </div>
                <div className="bg-purple-50 rounded-lg p-4 text-center">
                  <Video className="w-5 h-5 text-purple-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-purple-900">{(mediaStats as PlatformOverview).all_time?.videos || 0}</p>
                  <p className="text-xs text-purple-600">Videos</p>
                </div>
                <div className="bg-orange-50 rounded-lg p-4 text-center">
                  <Music className="w-5 h-5 text-orange-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-orange-900">{(mediaStats as PlatformOverview).all_time?.audios || 0}</p>
                  <p className="text-xs text-orange-600">Audio</p>
                </div>
                <div className="bg-slate-50 rounded-lg p-4 text-center">
                  <Users className="w-5 h-5 text-slate-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-slate-900">{(mediaStats as PlatformOverview).counts?.creators || 0}</p>
                  <p className="text-xs text-slate-600">Active Models</p>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>

      {/* Monthly Content Chart */}
      {mediaChartData.length > 0 && (
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <SectionHeader title="Content Uploads" subtitle="Monthly breakdown" />
          
          <ChartContainer config={chartConfig} className="h-[250px] w-full">
            <BarChart data={mediaChartData} margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 12, fill: "#64748b" }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 12, fill: "#64748b" }}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="photos" fill="#3b82f6" radius={[4, 4, 0, 0]} stackId="a" />
              <Bar dataKey="videos" fill="#8b5cf6" radius={[4, 4, 0, 0]} stackId="a" />
              <Bar dataKey="audios" fill="#f59e0b" radius={[4, 4, 0, 0]} stackId="a" />
            </BarChart>
          </ChartContainer>

          {/* Legend */}
          <div className="flex items-center justify-center gap-6 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-blue-500" />
              <span className="text-sm text-slate-600">Photos</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-purple-500" />
              <span className="text-sm text-slate-600">Videos</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-orange-500" />
              <span className="text-sm text-slate-600">Audio</span>
            </div>
          </div>
        </div>
      )}

      {/* Top Referrers */}
      {bioAnalytics?.topReferrers && bioAnalytics.topReferrers.length > 0 && (
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <SectionHeader title="Top Referrers" subtitle="Where your traffic comes from" />
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {bioAnalytics.topReferrers.slice(0, 4).map((ref, idx) => (
              <div key={ref.referrer} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm">
                  <Globe className="w-4 h-4 text-slate-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900 truncate">{ref.referrer || "Direct"}</p>
                  <p className="text-xs text-slate-500">{ref.count} visits</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Helper function
function getCountryFlag(country: string): string {
  const flags: Record<string, string> = {
    "United States": "🇺🇸", "United Kingdom": "🇬🇧", "Germany": "🇩🇪",
    "France": "🇫🇷", "Canada": "🇨🇦", "Australia": "🇦🇺",
    "Netherlands": "🇳🇱", "Spain": "🇪🇸", "Italy": "🇮🇹",
    "Brazil": "🇧🇷", "Mexico": "🇲🇽", "Japan": "🇯🇵",
    "India": "🇮🇳", "Romania": "🇷🇴", "Unknown": "🌍",
  };
  return flags[country] || "🌍";
}
