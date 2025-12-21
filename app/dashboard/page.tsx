"use client";

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { useDashboard } from "./layout";
import { createApiClient, type CreatorStats, type PlatformOverview } from "@/lib/media-api";
import {
  Image as ImageIcon,
  Video,
  Music,
  FileText,
  TrendingUp,
  Users,
  Eye,
  Calendar,
  ArrowUpRight,
  BarChart3,
  Loader2,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";

// ============================================
// STAT CARD COMPONENT
// ============================================

function StatCard({
  label,
  value,
  change,
  icon: Icon,
  color,
  delay = 0,
}: {
  label: string;
  value: string | number;
  change?: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-lg hover:border-slate-300 transition-all"
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        {change && (
          <span className="inline-flex items-center gap-1 text-sm font-medium text-green-600">
            <TrendingUp className="w-3 h-3" />
            {change}
          </span>
        )}
      </div>
      <p className="text-3xl font-bold text-slate-900 mb-1">
        {typeof value === "number" ? value.toLocaleString() : value}
      </p>
      <p className="text-sm text-slate-500">{label}</p>
    </motion.div>
  );
}

// ============================================
// QUICK ACTION CARD
// ============================================

function QuickActionCard({
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
        whileTap={{ scale: 0.98 }}
        className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md hover:border-slate-300 transition-all cursor-pointer group"
      >
        <div className="flex items-center gap-4">
          <div className={`w-10 h-10 rounded-lg ${color} flex items-center justify-center shrink-0`}>
            <Icon className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-slate-900 group-hover:text-brand-600 transition-colors">
              {title}
            </h3>
            <p className="text-sm text-slate-500">{description}</p>
          </div>
          <ArrowUpRight className="w-5 h-5 text-slate-400 group-hover:text-brand-600 transition-colors" />
        </div>
      </motion.div>
    </Link>
  );
}

// ============================================
// MAIN PAGE
// ============================================

export default function DashboardPage() {
  const { user, apiKey } = useDashboard();
  const [stats, setStats] = useState<CreatorStats | PlatformOverview | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      if (!apiKey) {
        setIsLoading(false);
        return;
      }

      try {
        const api = createApiClient(apiKey);

        if (user?.role === "admin") {
          const response = await api.getPlatformOverview();
          if (response.success && response.data) {
            setStats(response.data);
          }
        } else if (user?.creator_id) {
          const response = await api.getCreatorStats(user.creator_id, 12);
          if (response.success && response.data) {
            setStats(response.data);
          }
        }
      } catch (err) {
        console.error("Error fetching stats:", err);
        setError("Failed to load statistics");
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, [apiKey, user]);

  const isCreatorStats = (s: CreatorStats | PlatformOverview): s is CreatorStats => {
    return "creator" in s;
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl font-bold text-slate-900"
        >
          {getGreeting()}, {user?.display_name || user?.creator?.username || "Creator"} 👋
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-slate-500 mt-1"
        >
          Here&apos;s what&apos;s happening with your content
        </motion.p>
      </div>

      {/* Stats Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 text-brand-600 animate-spin" />
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-500" />
          <p className="text-red-700">{error}</p>
        </div>
      ) : stats ? (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {isCreatorStats(stats) ? (
              <>
                <StatCard
                  label="Total Photos"
                  value={stats.all_time.photos}
                  icon={ImageIcon}
                  color="bg-blue-500"
                  delay={0}
                />
                <StatCard
                  label="Total Videos"
                  value={stats.all_time.videos}
                  icon={Video}
                  color="bg-purple-500"
                  delay={0.1}
                />
                <StatCard
                  label="Total Audios"
                  value={stats.all_time.audios}
                  icon={Music}
                  color="bg-orange-500"
                  delay={0.2}
                />
                <StatCard
                  label="Custom Requests"
                  value={stats.all_time.customs}
                  icon={FileText}
                  color="bg-green-500"
                  delay={0.3}
                />
              </>
            ) : (
              <>
                <StatCard
                  label="Total Creators"
                  value={stats.counts.creators}
                  icon={Users}
                  color="bg-blue-500"
                  delay={0}
                />
                <StatCard
                  label="Total Media"
                  value={stats.counts.total_media}
                  icon={ImageIcon}
                  color="bg-purple-500"
                  delay={0.1}
                />
                <StatCard
                  label="This Month"
                  value={stats.current_month.total}
                  icon={Calendar}
                  color="bg-orange-500"
                  delay={0.2}
                />
                <StatCard
                  label="Studios"
                  value={stats.counts.studios}
                  icon={Eye}
                  color="bg-green-500"
                  delay={0.3}
                />
              </>
            )}
          </div>

          {/* This Month Stats */}
          {isCreatorStats(stats) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-gradient-to-br from-brand-600 to-brand-700 rounded-2xl p-6 text-white"
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-semibold">{stats.current_month.name}</h2>
                  <p className="text-brand-200 text-sm">Your content this month</p>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold">{stats.current_month.total}</p>
                  <p className="text-brand-200 text-sm">total uploads</p>
                </div>
              </div>
              <div className="grid grid-cols-4 gap-4">
                <div className="bg-white/10 rounded-xl p-4 text-center">
                  <ImageIcon className="w-5 h-5 mx-auto mb-2 opacity-80" />
                  <p className="text-2xl font-bold">{stats.current_month.photos}</p>
                  <p className="text-xs text-brand-200">Photos</p>
                </div>
                <div className="bg-white/10 rounded-xl p-4 text-center">
                  <Video className="w-5 h-5 mx-auto mb-2 opacity-80" />
                  <p className="text-2xl font-bold">{stats.current_month.videos}</p>
                  <p className="text-xs text-brand-200">Videos</p>
                </div>
                <div className="bg-white/10 rounded-xl p-4 text-center">
                  <Music className="w-5 h-5 mx-auto mb-2 opacity-80" />
                  <p className="text-2xl font-bold">{stats.current_month.audios}</p>
                  <p className="text-xs text-brand-200">Audios</p>
                </div>
                <div className="bg-white/10 rounded-xl p-4 text-center">
                  <FileText className="w-5 h-5 mx-auto mb-2 opacity-80" />
                  <p className="text-2xl font-bold">{stats.current_month.customs}</p>
                  <p className="text-xs text-brand-200">Customs</p>
                </div>
              </div>
            </motion.div>
          )}
        </>
      ) : (
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-8 text-center">
          <BarChart3 className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h3 className="font-semibold text-slate-700 mb-2">No statistics available</h3>
          <p className="text-slate-500 text-sm">
            Statistics will appear once you start uploading content
          </p>
        </div>
      )}

      {/* Quick Actions */}
      <div>
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-lg font-semibold text-slate-900 mb-4"
        >
          Quick Actions
        </motion.h2>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          <QuickActionCard
            title="Media Library"
            description="View and manage your content"
            href="/dashboard/media"
            icon={ImageIcon}
            color="bg-blue-500"
          />
          <QuickActionCard
            title="Create Album"
            description="Organize your media into albums"
            href="/dashboard/albums"
            icon={FileText}
            color="bg-purple-500"
          />
          <QuickActionCard
            title="Manage Accounts"
            description="Update your platform credentials"
            href="/dashboard/accounts"
            icon={Users}
            color="bg-green-500"
          />
          <QuickActionCard
            title="Edit Bio Link"
            description="Customize your bio link page"
            href="/dashboard/bio-links"
            icon={Eye}
            color="bg-orange-500"
          />
          <QuickActionCard
            title="View Statistics"
            description="Detailed analytics and insights"
            href="/dashboard/statistics"
            icon={BarChart3}
            color="bg-pink-500"
          />
          {user?.role === "admin" && (
            <QuickActionCard
              title="Onboarding"
              description="Manage creator applications"
              href="/dashboard/onboarding"
              icon={Users}
              color="bg-slate-700"
            />
          )}
        </motion.div>
      </div>
    </div>
  );
}

