"use client";

import { useState, useEffect } from "react";
import { useDashboard } from "../../layout";
import { getSupabaseBrowserClient } from "@/lib/supabase";
import {
  Eye,
  Users,
  MousePointerClick,
  TrendingUp,
  Globe,
  Smartphone,
  Monitor,
  Tablet,
  Loader2,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { Line, LineChart, XAxis, YAxis, Area, AreaChart, ResponsiveContainer } from "recharts";
import { format, subDays, parseISO } from "date-fns";
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

// ============================================
// CHART CONFIG
// ============================================

const chartConfig = {
  views: { label: "Views", color: "#8b5cf6" },
  clicks: { label: "Clicks", color: "#06b6d4" },
  visitors: { label: "Visitors", color: "#f59e0b" },
} satisfies ChartConfig;

// ============================================
// STAT CARD
// ============================================

function StatCard({
  label,
  value,
  change,
  changeType,
  icon: Icon,
  gradient,
}: {
  label: string;
  value: string | number;
  change?: string;
  changeType?: "up" | "down";
  icon: React.ComponentType<{ className?: string }>;
  gradient: string;
}) {
  return (
    <div className={`rounded-2xl p-5 ${gradient}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-white/70 mb-1">{label}</p>
          <p className="text-3xl font-bold text-white">
            {typeof value === "number" ? value.toLocaleString() : value}
          </p>
          {change && (
            <div className={`flex items-center gap-1 mt-2 text-sm ${
              changeType === "up" ? "text-green-300" : "text-red-300"
            }`}>
              {changeType === "up" ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
              <span>{change} vs last period</span>
            </div>
          )}
        </div>
        <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );
}

// ============================================
// MAIN PAGE
// ============================================

export default function BioAnalyticsPage() {
  const { user } = useDashboard();
  const [analytics, setAnalytics] = useState<BioAnalytics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [period, setPeriod] = useState<"7d" | "30d" | "90d" | "all">("30d");
  const [bioLinkId, setBioLinkId] = useState<string | null>(null);

  useEffect(() => {
    fetchBioLink();
  }, [user]);

  useEffect(() => {
    if (bioLinkId) {
      fetchAnalytics();
    }
  }, [bioLinkId, period]);

  const fetchBioLink = async () => {
    if (!user?.creator_id) {
      setIsLoading(false);
      return;
    }

    try {
      const supabase = getSupabaseBrowserClient();
      const { data: bioLink } = await supabase
        .from("bio_links")
        .select("id")
        .eq("creator_id", user.creator_id)
        .maybeSingle();

      if (bioLink?.id) {
        setBioLinkId(bioLink.id);
      }
    } catch (err) {
      console.error("Error fetching bio link:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAnalytics = async () => {
    if (!bioLinkId) return;
    
    try {
      const response = await fetch(`/api/analytics/bio/${bioLinkId}?period=${period}`);
      if (response.ok) {
        const data = await response.json();
        setAnalytics(data);
      }
    } catch (err) {
      console.error("Error fetching analytics:", err);
    }
  };

  // Prepare chart data
  const chartData = analytics?.viewsByDay
    ? Object.entries(analytics.viewsByDay)
        .map(([date, views]) => ({
          date: format(parseISO(date), "MMM d"),
          views,
        }))
        .slice(-30)
    : [];

  const deviceData = analytics?.viewsByDevice
    ? Object.entries(analytics.viewsByDevice).map(([device, count]) => ({
        device: device.charAt(0).toUpperCase() + device.slice(1),
        count,
        percentage: analytics.summary.totalViews > 0
          ? Math.round((count / analytics.summary.totalViews) * 100)
          : 0,
      }))
    : [];

  const countryData = analytics?.viewsByCountry
    ? Object.entries(analytics.viewsByCountry)
        .map(([country, count]) => ({ country, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 8)
    : [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-violet-600 animate-spin" />
      </div>
    );
  }

  if (!user?.creator_id || !bioLinkId) {
    return (
      <div className="bg-gradient-to-br from-violet-50 to-pink-50 rounded-2xl p-12 text-center">
        <Eye className="w-16 h-16 text-violet-300 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-slate-900 mb-2">No Bio Link Found</h2>
        <p className="text-slate-500 mb-6">Create a bio link to start tracking analytics</p>
        <Link href="/dashboard/bio-links">
          <Button className="bg-violet-600 hover:bg-violet-700">Create Bio Link</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Bio Link Analytics</h1>
          <p className="text-slate-500">Track your bio link performance</p>
        </div>
        
        <Select value={period} onValueChange={(v) => setPeriod(v as any)}>
          <SelectTrigger className="w-[160px]">
            <Calendar className="w-4 h-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
            <SelectItem value="90d">Last 90 days</SelectItem>
            <SelectItem value="all">All time</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Page Views"
          value={analytics?.summary.totalViews || 0}
          change="+12%"
          changeType="up"
          icon={Eye}
          gradient="bg-gradient-to-br from-violet-500 to-purple-600"
        />
        <StatCard
          label="Unique Visitors"
          value={analytics?.summary.uniqueVisitors || 0}
          change="+8%"
          changeType="up"
          icon={Users}
          gradient="bg-gradient-to-br from-cyan-500 to-blue-600"
        />
        <StatCard
          label="Link Clicks"
          value={analytics?.summary.totalClicks || 0}
          change="+15%"
          changeType="up"
          icon={MousePointerClick}
          gradient="bg-gradient-to-br from-emerald-500 to-green-600"
        />
        <StatCard
          label="Click Rate"
          value={`${analytics?.summary.clickThroughRate || 0}%`}
          icon={TrendingUp}
          gradient="bg-gradient-to-br from-orange-500 to-amber-600"
        />
      </div>

      {/* Main Chart */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-6">Traffic Over Time</h2>
        
        {chartData.length > 0 ? (
          <ChartContainer config={chartConfig} className="h-[300px] w-full">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, bottom: 10, left: 0 }}>
              <defs>
                <linearGradient id="viewsGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
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
            </AreaChart>
          </ChartContainer>
        ) : (
          <div className="h-[300px] flex items-center justify-center text-slate-400">
            <p>No data yet. Share your bio link to start tracking!</p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Countries */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <h3 className="font-semibold text-slate-900 mb-4">Top Countries</h3>
          <div className="space-y-3">
            {countryData.length > 0 ? (
              countryData.map((item, idx) => (
                <div key={item.country} className="flex items-center gap-3">
                  <span className="text-lg">{getCountryFlag(item.country)}</span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-slate-700">{item.country}</span>
                      <span className="text-sm text-slate-600">{item.count}</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-violet-500 rounded-full"
                        style={{ width: `${(item.count / (countryData[0]?.count || 1)) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-400 text-center py-4">No country data yet</p>
            )}
          </div>
        </div>

        {/* Devices */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <h3 className="font-semibold text-slate-900 mb-4">Devices</h3>
          <div className="space-y-4">
            {deviceData.length > 0 ? (
              deviceData.map((item) => {
                const Icon = item.device === "Mobile" ? Smartphone : item.device === "Desktop" ? Monitor : Tablet;
                return (
                  <div key={item.device} className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-violet-50 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-violet-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-slate-700">{item.device}</span>
                        <span className="text-sm text-slate-600">{item.percentage}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-violet-500 rounded-full"
                          style={{ width: `${item.percentage}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-sm text-slate-400 text-center py-4">No device data yet</p>
            )}
          </div>
        </div>

        {/* Top Links */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <h3 className="font-semibold text-slate-900 mb-4">Top Links</h3>
          <div className="space-y-3">
            {analytics?.topLinks && analytics.topLinks.length > 0 ? (
              analytics.topLinks.slice(0, 6).map((link, idx) => (
                <div key={link.label} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-violet-100 flex items-center justify-center text-xs font-medium text-violet-600">
                      {idx + 1}
                    </span>
                    <span className="text-sm text-slate-700 truncate max-w-[150px]">{link.label}</span>
                  </div>
                  <span className="text-sm font-semibold text-slate-900">{link.count}</span>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-400 text-center py-4">No link clicks yet</p>
            )}
          </div>
        </div>
      </div>

      {/* Top Referrers */}
      {analytics?.topReferrers && analytics.topReferrers.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <h3 className="font-semibold text-slate-900 mb-4">Top Referrers</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {analytics.topReferrers.slice(0, 4).map((ref) => (
              <div key={ref.referrer} className="bg-slate-50 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Globe className="w-4 h-4 text-slate-400" />
                  <span className="text-sm font-medium text-slate-700 truncate">
                    {ref.referrer || "Direct"}
                  </span>
                </div>
                <p className="text-2xl font-bold text-slate-900">{ref.count}</p>
                <p className="text-xs text-slate-500">visits</p>
              </div>
            ))}
          </div>
        </div>
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


