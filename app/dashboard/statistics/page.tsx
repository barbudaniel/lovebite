"use client";

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { useDashboard } from "../layout";
import { createApiClient, type CreatorStats, type StudioStats } from "@/lib/media-api";
import {
  Image as ImageIcon,
  Video,
  Music,
  FileText,
  TrendingUp,
  Calendar,
  BarChart3,
  Loader2,
  AlertCircle,
  Trophy,
  ArrowUp,
  ArrowDown,
} from "lucide-react";

// ============================================
// STAT CARD COMPONENT
// ============================================

function StatCard({
  label,
  value,
  change,
  changeLabel,
  icon: Icon,
  color,
}: {
  label: string;
  value: number;
  change?: number;
  changeLabel?: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}) {
  const isPositive = change && change > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl border border-slate-200 p-6"
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        {change !== undefined && (
          <span
            className={`inline-flex items-center gap-1 text-sm font-medium ${
              isPositive ? "text-green-600" : "text-red-600"
            }`}
          >
            {isPositive ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
            {Math.abs(change)}%
          </span>
        )}
      </div>
      <p className="text-3xl font-bold text-slate-900 mb-1">{value.toLocaleString()}</p>
      <p className="text-sm text-slate-500">{label}</p>
      {changeLabel && <p className="text-xs text-slate-400 mt-1">{changeLabel}</p>}
    </motion.div>
  );
}

// ============================================
// CHART BAR
// ============================================

function ChartBar({
  label,
  value,
  max,
  color,
}: {
  label: string;
  value: number;
  max: number;
  color: string;
}) {
  const percentage = max > 0 ? (value / max) * 100 : 0;

  return (
    <div className="flex items-center gap-4">
      <span className="text-sm text-slate-500 w-20 truncate">{label}</span>
      <div className="flex-1 h-8 bg-slate-100 rounded-lg overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className={`h-full ${color} flex items-center justify-end pr-2`}
        >
          {percentage > 15 && (
            <span className="text-xs font-medium text-white">{value}</span>
          )}
        </motion.div>
      </div>
      {percentage <= 15 && (
        <span className="text-sm font-medium text-slate-600 w-12">{value}</span>
      )}
    </div>
  );
}

// ============================================
// MONTHLY CHART
// ============================================

function MonthlyChart({
  data,
}: {
  data: Array<{
    month: string;
    photos: number;
    videos: number;
    audios: number;
    customs: number;
  }>;
}) {
  const maxTotal = Math.max(
    ...data.map((d) => d.photos + d.videos + d.audios + d.customs)
  );

  return (
    <div className="space-y-3">
      {data.slice(0, 6).map((month) => {
        const total = month.photos + month.videos + month.audios + month.customs;
        const photoWidth = maxTotal > 0 ? (month.photos / maxTotal) * 100 : 0;
        const videoWidth = maxTotal > 0 ? (month.videos / maxTotal) * 100 : 0;
        const audioWidth = maxTotal > 0 ? (month.audios / maxTotal) * 100 : 0;
        const customWidth = maxTotal > 0 ? (month.customs / maxTotal) * 100 : 0;

        return (
          <div key={month.month} className="flex items-center gap-4">
            <span className="text-sm text-slate-500 w-24 truncate">{month.month}</span>
            <div className="flex-1 h-6 bg-slate-100 rounded-lg overflow-hidden flex">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${photoWidth}%` }}
                className="bg-blue-500 h-full"
                title={`Photos: ${month.photos}`}
              />
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${videoWidth}%` }}
                className="bg-purple-500 h-full"
                title={`Videos: ${month.videos}`}
              />
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${audioWidth}%` }}
                className="bg-orange-500 h-full"
                title={`Audio: ${month.audios}`}
              />
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${customWidth}%` }}
                className="bg-green-500 h-full"
                title={`Customs: ${month.customs}`}
              />
            </div>
            <span className="text-sm font-medium text-slate-600 w-12 text-right">
              {total}
            </span>
          </div>
        );
      })}
    </div>
  );
}

// ============================================
// LEADERBOARD
// ============================================

function Leaderboard({
  data,
}: {
  data: Array<{
    rank: number;
    username: string;
    total: number;
  }>;
}) {
  return (
    <div className="space-y-2">
      {data.slice(0, 5).map((entry) => (
        <div
          key={entry.username}
          className="flex items-center gap-4 p-3 bg-slate-50 rounded-lg"
        >
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
              entry.rank === 1
                ? "bg-yellow-400 text-yellow-900"
                : entry.rank === 2
                ? "bg-slate-300 text-slate-700"
                : entry.rank === 3
                ? "bg-amber-600 text-white"
                : "bg-slate-200 text-slate-600"
            }`}
          >
            {entry.rank}
          </div>
          <span className="flex-1 font-medium text-slate-900">{entry.username}</span>
          <span className="font-semibold text-slate-700">{entry.total.toLocaleString()}</span>
        </div>
      ))}
    </div>
  );
}

// ============================================
// MAIN PAGE
// ============================================

export default function StatisticsPage() {
  const { user, apiKey } = useDashboard();
  const [stats, setStats] = useState<CreatorStats | StudioStats | null>(null);
  const [leaderboard, setLeaderboard] = useState<Array<{
    rank: number;
    username: string;
    photos: number;
    videos: number;
    audios: number;
    customs: number;
    total: number;
  }>>([]);
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

        if (user?.role === "model" && user?.creator_id) {
          const response = await api.getCreatorStats(user.creator_id, 12);
          if (response.success && response.data) {
            setStats(response.data);
          }
        } else if (user?.role === "studio" && user?.studio_id) {
          const response = await api.getStudioStats(user.studio_id);
          if (response.success && response.data) {
            setStats(response.data);
          }
        } else if (user?.role === "admin") {
          // For admin, get leaderboard
          const leaderboardResponse = await api.getLeaderboard({
            period: "month",
            limit: 10,
          });
          if (leaderboardResponse.success && leaderboardResponse.data) {
            setLeaderboard(leaderboardResponse.data);
          }

          // Get first creator's stats as sample
          const creatorsResponse = await api.listCreators({ limit: 1 });
          if (creatorsResponse.success && creatorsResponse.data?.[0]) {
            const creatorStatsResponse = await api.getCreatorStats(
              creatorsResponse.data[0].id,
              12
            );
            if (creatorStatsResponse.success && creatorStatsResponse.data) {
              setStats(creatorStatsResponse.data);
            }
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

  const isCreatorStats = (s: CreatorStats | StudioStats): s is CreatorStats => {
    return "creator" in s;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-brand-600 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 flex items-center gap-3">
        <AlertCircle className="w-5 h-5 text-red-500" />
        <p className="text-red-700">{error}</p>
      </div>
    );
  }

  if (!stats && leaderboard.length === 0) {
    return (
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-12 text-center">
        <BarChart3 className="w-12 h-12 text-slate-300 mx-auto mb-4" />
        <h3 className="font-semibold text-slate-700 mb-2">No statistics available</h3>
        <p className="text-slate-500 text-sm">
          Statistics will appear once you start uploading content
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Statistics</h1>
        <p className="text-slate-500">Your content performance analytics</p>
      </div>

      {stats && (
        <>
          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              label="Total Photos"
              value={stats.all_time.photos}
              icon={ImageIcon}
              color="bg-blue-500"
            />
            <StatCard
              label="Total Videos"
              value={stats.all_time.videos}
              icon={Video}
              color="bg-purple-500"
            />
            <StatCard
              label="Total Audio"
              value={stats.all_time.audios}
              icon={Music}
              color="bg-orange-500"
            />
            <StatCard
              label="Custom Requests"
              value={stats.all_time.customs}
              icon={FileText}
              color="bg-green-500"
            />
          </div>

          {/* This Month */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-brand-600 to-brand-700 rounded-2xl p-6 text-white"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 opacity-80" />
                <div>
                  <h2 className="text-lg font-semibold">{stats.current_month.name}</h2>
                  <p className="text-brand-200 text-sm">This month&apos;s performance</p>
                </div>
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

          {/* Monthly History */}
          {isCreatorStats(stats) && stats.monthly_history && stats.monthly_history.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl border border-slate-200 p-6"
            >
              <div className="flex items-center gap-3 mb-6">
                <TrendingUp className="w-5 h-5 text-slate-400" />
                <h2 className="text-lg font-semibold text-slate-900">Monthly Trend</h2>
              </div>
              <MonthlyChart data={stats.monthly_history} />
              <div className="flex items-center justify-center gap-6 mt-6 text-sm">
                <span className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500" />
                  Photos
                </span>
                <span className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-purple-500" />
                  Videos
                </span>
                <span className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-orange-500" />
                  Audio
                </span>
                <span className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                  Customs
                </span>
              </div>
            </motion.div>
          )}

          {/* Category Breakdown */}
          {isCreatorStats(stats) && stats.category_breakdown && stats.category_breakdown.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl border border-slate-200 p-6"
            >
              <h2 className="text-lg font-semibold text-slate-900 mb-6">Content by Category</h2>
              <div className="space-y-3">
                {stats.category_breakdown.slice(0, 8).map((cat) => (
                  <ChartBar
                    key={cat.name}
                    label={cat.name}
                    value={cat.count}
                    max={stats.category_breakdown![0].count}
                    color="bg-brand-500"
                  />
                ))}
              </div>
            </motion.div>
          )}
        </>
      )}

      {/* Leaderboard (Admin only) */}
      {user?.role === "admin" && leaderboard.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl border border-slate-200 p-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <Trophy className="w-5 h-5 text-yellow-500" />
            <h2 className="text-lg font-semibold text-slate-900">This Month&apos;s Leaderboard</h2>
          </div>
          <Leaderboard data={leaderboard} />
        </motion.div>
      )}
    </div>
  );
}

