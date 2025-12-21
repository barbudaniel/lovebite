"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useDashboard } from "../layout";
import {
  createApiClient,
  type CreatorStats,
  type StudioStats,
  type PlatformOverview,
  type Creator,
  type Studio,
} from "@/lib/media-api";
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
  Users,
  Building2,
  Database,
  Activity,
  PieChart,
  Search,
  User,
  Check,
  Flame,
  Crown,
  Star,
  Sparkles,
  Medal,
  Zap,
  Heart,
  Eye,
  ChevronRight,
} from "lucide-react";
import { Input } from "@/components/ui/input";

// ============================================
// GLASSMORPHISM STAT CARD
// ============================================

function GlassStatCard({
  label,
  value,
  icon: Icon,
  gradient,
  delay = 0,
}: {
  label: string;
  value: number | string;
  icon: React.ComponentType<{ className?: string }>;
  gradient: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay, type: "spring", stiffness: 100 }}
      className={`relative overflow-hidden rounded-3xl p-6 ${gradient}`}
    >
      {/* Glow effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent" />
      <div className="absolute -top-12 -right-12 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
      
      <div className="relative">
        <div className="flex items-center justify-between mb-4">
          <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <Icon className="w-7 h-7 text-white" />
          </div>
          <Sparkles className="w-5 h-5 text-white/50 animate-pulse" />
        </div>
        <p className="text-4xl font-black text-white tracking-tight">
          {typeof value === "number" ? value.toLocaleString() : value}
        </p>
        <p className="text-white/70 text-sm font-medium mt-1">{label}</p>
      </div>
    </motion.div>
  );
}

// ============================================
// TIKTOK STYLE LEADERBOARD CARD
// ============================================

function LeaderboardCard({
  entry,
  index,
  isTop3,
}: {
  entry: {
    rank: number;
    username: string;
    photos: number;
    videos: number;
    audios: number;
    customs: number;
    total: number;
  };
  index: number;
  isTop3: boolean;
}) {
  const getRankStyle = () => {
    switch (entry.rank) {
      case 1:
        return {
          bg: "bg-gradient-to-r from-yellow-400 via-amber-400 to-orange-400",
          glow: "shadow-lg shadow-amber-400/50",
          badge: "🥇",
          textColor: "text-amber-900",
        };
      case 2:
        return {
          bg: "bg-gradient-to-r from-slate-300 via-gray-300 to-slate-400",
          glow: "shadow-lg shadow-slate-400/50",
          badge: "🥈",
          textColor: "text-slate-800",
        };
      case 3:
        return {
          bg: "bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700",
          glow: "shadow-lg shadow-orange-500/50",
          badge: "🥉",
          textColor: "text-orange-900",
        };
      default:
        return {
          bg: "bg-slate-800/50",
          glow: "",
          badge: null,
          textColor: "text-white",
        };
    }
  };

  const style = getRankStyle();

  return (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.08, type: "spring", stiffness: 100 }}
      whileHover={{ scale: 1.02, x: 10 }}
      className={`relative group cursor-pointer ${isTop3 ? "mb-4" : ""}`}
    >
      <div
        className={`flex items-center gap-4 p-4 rounded-2xl transition-all ${style.bg} ${style.glow} backdrop-blur-sm border border-white/10`}
      >
        {/* Rank Badge */}
        <div className="relative">
          {style.badge ? (
            <span className="text-3xl">{style.badge}</span>
          ) : (
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
              <span className="text-lg font-bold text-white/70">{entry.rank}</span>
            </div>
          )}
        </div>

        {/* Avatar & Username */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 to-violet-500 flex items-center justify-center text-white font-bold">
              {entry.username.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className={`font-bold truncate ${style.textColor}`}>
                @{entry.username}
              </p>
              <div className="flex items-center gap-2 text-xs opacity-70">
                <span className="flex items-center gap-0.5">
                  <ImageIcon className="w-3 h-3" />
                  {entry.photos}
                </span>
                <span className="flex items-center gap-0.5">
                  <Video className="w-3 h-3" />
                  {entry.videos}
                </span>
                <span className="flex items-center gap-0.5">
                  <Music className="w-3 h-3" />
                  {entry.audios}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="text-right">
          <div className="flex items-center gap-1 justify-end">
            <Flame className={`w-4 h-4 ${isTop3 ? "text-orange-500 animate-pulse" : "text-white/50"}`} />
            <span className={`text-2xl font-black ${style.textColor}`}>
              {entry.total.toLocaleString()}
            </span>
          </div>
          <p className="text-xs opacity-50">uploads</p>
        </div>

        {/* Hover effect */}
        <ChevronRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity text-white/50" />
      </div>
    </motion.div>
  );
}

// ============================================
// TIKTOK STYLE LEADERBOARD SECTION
// ============================================

function LeaderboardSection({
  data,
  period,
  onPeriodChange,
}: {
  data: Array<{
    rank: number;
    username: string;
    photos: number;
    videos: number;
    audios: number;
    customs: number;
    total: number;
  }>;
  period: "month" | "all_time";
  onPeriodChange: (period: "month" | "all_time") => void;
}) {
  if (data.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative rounded-3xl overflow-hidden"
    >
      {/* Background with animated gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900/50 to-slate-900" />
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
      
      {/* Animated orbs */}
      <div className="absolute top-0 left-1/4 w-64 h-64 bg-pink-500/30 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-purple-500/30 rounded-full blur-3xl animate-pulse delay-1000" />

      <div className="relative p-6 md:p-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-lg shadow-orange-500/30">
                <Trophy className="w-8 h-8 text-white" />
              </div>
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center"
              >
                <Flame className="w-3 h-3 text-white" />
              </motion.div>
            </div>
            <div>
              <h2 className="text-2xl font-black text-white tracking-tight">
                Top Creators
              </h2>
              <p className="text-white/50 text-sm">
                {period === "month" ? "This month's" : "All time"} top performers
              </p>
            </div>
          </div>

          {/* Period Toggle */}
          <div className="flex items-center p-1 bg-white/10 backdrop-blur-sm rounded-2xl">
            <button
              onClick={() => onPeriodChange("month")}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                period === "month"
                  ? "bg-white text-slate-900 shadow-lg"
                  : "text-white/70 hover:text-white"
              }`}
            >
              🔥 This Month
            </button>
            <button
              onClick={() => onPeriodChange("all_time")}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                period === "all_time"
                  ? "bg-white text-slate-900 shadow-lg"
                  : "text-white/70 hover:text-white"
              }`}
            >
              👑 All Time
            </button>
          </div>
        </div>

        {/* Top 3 Podium */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {data.slice(0, 3).map((entry, idx) => {
            const positions = [1, 0, 2]; // Reorder: 2nd, 1st, 3rd
            const reordered = [data[1], data[0], data[2]].filter(Boolean);
            const item = reordered[idx];
            if (!item) return null;
            
            const isFirst = item.rank === 1;
            
            return (
              <motion.div
                key={item.username}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + idx * 0.1 }}
                className={`relative text-center ${isFirst ? "-mt-4" : "mt-4"}`}
              >
                <div className={`relative mx-auto w-16 h-16 sm:w-20 sm:h-20 rounded-full mb-2 ${
                  item.rank === 1
                    ? "bg-gradient-to-br from-yellow-400 to-amber-500 ring-4 ring-yellow-400/50"
                    : item.rank === 2
                    ? "bg-gradient-to-br from-slate-300 to-slate-400 ring-4 ring-slate-400/50"
                    : "bg-gradient-to-br from-amber-600 to-orange-600 ring-4 ring-orange-500/50"
                } flex items-center justify-center`}
                >
                  <span className="text-2xl sm:text-3xl font-black text-white">
                    {item.username.charAt(0).toUpperCase()}
                  </span>
                  {isFirst && (
                    <motion.div
                      animate={{ y: [-2, 2, -2] }}
                      transition={{ repeat: Infinity, duration: 1.5 }}
                      className="absolute -top-3"
                    >
                      <Crown className="w-6 h-6 text-yellow-400 drop-shadow-lg" />
                    </motion.div>
                  )}
                </div>
                <p className="text-white font-bold text-sm truncate px-1">
                  @{item.username}
                </p>
                <p className="text-white/50 text-xs">
                  {item.total.toLocaleString()} uploads
                </p>
                <div className="text-2xl mt-1">
                  {item.rank === 1 ? "🥇" : item.rank === 2 ? "🥈" : "🥉"}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Rest of leaderboard */}
        <div className="space-y-2">
          {data.slice(3, 10).map((entry, index) => (
            <LeaderboardCard
              key={entry.username}
              entry={entry}
              index={index}
              isTop3={false}
            />
          ))}
        </div>

        {/* Footer decoration */}
        <div className="mt-8 text-center">
          <motion.div
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full text-white/50 text-sm"
          >
            <Star className="w-4 h-4" />
            Keep creating to climb the ranks!
            <Star className="w-4 h-4" />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

// ============================================
// MINI STAT PILL
// ============================================

function StatPill({
  icon: Icon,
  value,
  label,
  color,
}: {
  icon: React.ComponentType<{ className?: string }>;
  value: number;
  label: string;
  color: string;
}) {
  return (
    <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${color}`}>
      <Icon className="w-4 h-4" />
      <span className="font-bold">{value.toLocaleString()}</span>
      <span className="text-xs opacity-70">{label}</span>
    </div>
  );
}

// ============================================
// MONTHLY CHART (TikTok Style)
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
  const maxTotal = Math.max(...data.map((d) => d.photos + d.videos + d.audios + d.customs), 1);

  return (
    <div className="space-y-4">
      {data.slice(0, 6).map((month, index) => {
        const total = month.photos + month.videos + month.audios + month.customs;

        return (
          <motion.div
            key={month.month}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="group"
          >
            <div className="flex items-center gap-4 mb-2">
              <span className="text-sm font-medium text-slate-400 w-12 shrink-0">
                {month.month.slice(0, 3)}
              </span>
              <div className="flex-1 h-8 bg-slate-800/50 rounded-full overflow-hidden flex">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(month.photos / maxTotal) * 100}%` }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  className="bg-gradient-to-r from-blue-500 to-cyan-400 h-full"
                />
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(month.videos / maxTotal) * 100}%` }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                  className="bg-gradient-to-r from-purple-500 to-pink-400 h-full"
                />
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(month.audios / maxTotal) * 100}%` }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                  className="bg-gradient-to-r from-orange-500 to-amber-400 h-full"
                />
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(month.customs / maxTotal) * 100}%` }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                  className="bg-gradient-to-r from-green-500 to-emerald-400 h-full"
                />
              </div>
              <span className="text-sm font-bold text-white w-12 text-right">
                {total}
              </span>
            </div>
          </motion.div>
        );
      })}
      
      {/* Legend */}
      <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
        <span className="flex items-center gap-2 text-xs text-slate-400">
          <div className="w-3 h-3 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400" />
          Photos
        </span>
        <span className="flex items-center gap-2 text-xs text-slate-400">
          <div className="w-3 h-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-400" />
          Videos
        </span>
        <span className="flex items-center gap-2 text-xs text-slate-400">
          <div className="w-3 h-3 rounded-full bg-gradient-to-r from-orange-500 to-amber-400" />
          Audio
        </span>
        <span className="flex items-center gap-2 text-xs text-slate-400">
          <div className="w-3 h-3 rounded-full bg-gradient-to-r from-green-500 to-emerald-400" />
          Customs
        </span>
      </div>
    </div>
  );
}

// ============================================
// ENTITY SELECTOR (TikTok Style)
// ============================================

type EntityType = "model" | "studio";

function EntitySelector({
  creators,
  studios,
  selectedType,
  selectedId,
  onTypeChange,
  onSelect,
  isLoading,
}: {
  creators: Creator[];
  studios: Studio[];
  selectedType: EntityType;
  selectedId: string | null;
  onTypeChange: (type: EntityType) => void;
  onSelect: (id: string) => void;
  isLoading?: boolean;
}) {
  const [search, setSearch] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  const filteredCreators = creators.filter((c) =>
    c.username.toLowerCase().includes(search.toLowerCase())
  );
  const filteredStudios = studios.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase())
  );
  const items = selectedType === "model" ? filteredCreators : filteredStudios;

  return (
    <div className="bg-slate-900/50 backdrop-blur-xl rounded-3xl border border-white/10 overflow-hidden">
      {/* Type Toggle */}
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center p-1 bg-slate-800/50 rounded-2xl">
          <button
            onClick={() => onTypeChange("model")}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
              selectedType === "model"
                ? "bg-gradient-to-r from-pink-500 to-violet-500 text-white shadow-lg"
                : "text-white/50 hover:text-white"
            }`}
          >
            <User className="w-4 h-4" />
            Models ({creators.length})
          </button>
          <button
            onClick={() => onTypeChange("studio")}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
              selectedType === "studio"
                ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg"
                : "text-white/50 hover:text-white"
            }`}
          >
            <Building2 className="w-4 h-4" />
            Studios ({studios.length})
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="p-4 border-b border-white/10">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
          <input
            type="text"
            placeholder={`Search ${selectedType}s...`}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-slate-800/50 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-pink-500/50"
          />
        </div>
      </div>

      {/* List */}
      <div ref={scrollRef} className="max-h-[350px] overflow-y-auto p-2">
        {items.length === 0 ? (
          <div className="text-center py-8 text-white/30">
            <p>No {selectedType}s found</p>
          </div>
        ) : (
          <div className="space-y-1">
            {items.map((item) => {
              const isSelected = item.id === selectedId;
              const name = "username" in item ? item.username : item.name;

              return (
                <button
                  key={item.id}
                  onClick={() => onSelect(item.id)}
                  disabled={isLoading}
                  className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-left transition-all ${
                    isSelected
                      ? "bg-gradient-to-r from-pink-500/20 to-violet-500/20 border border-pink-500/50"
                      : "hover:bg-white/5 border border-transparent"
                  } ${isLoading && !isSelected ? "opacity-50" : ""}`}
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      isSelected
                        ? "bg-gradient-to-br from-pink-500 to-violet-500"
                        : "bg-slate-700"
                    }`}
                  >
                    <span className="text-white font-bold">
                      {name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`font-medium truncate ${isSelected ? "text-white" : "text-white/70"}`}>
                      {selectedType === "model" ? `@${name}` : name}
                    </p>
                    <p className="text-xs text-white/30">
                      {item.enabled ? "🟢 Active" : "⚪ Inactive"}
                    </p>
                  </div>
                  {isSelected && (
                    <Check className="w-5 h-5 text-pink-400" />
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {isLoading && (
        <div className="p-4 border-t border-white/10 flex items-center justify-center gap-2 text-white/50">
          <Loader2 className="w-4 h-4 animate-spin" />
          Loading stats...
        </div>
      )}
    </div>
  );
}

// ============================================
// MAIN PAGE
// ============================================

export default function StatisticsPage() {
  const { user, apiKey } = useDashboard();

  // Platform data
  const [platformOverview, setPlatformOverview] = useState<PlatformOverview | null>(null);
  const [leaderboard, setLeaderboard] = useState<
    Array<{
      rank: number;
      username: string;
      photos: number;
      videos: number;
      audios: number;
      customs: number;
      total: number;
    }>
  >([]);
  const [creators, setCreators] = useState<Creator[]>([]);
  const [studios, setStudios] = useState<Studio[]>([]);

  // Selection state
  const [selectedType, setSelectedType] = useState<EntityType>("model");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [period, setPeriod] = useState<"month" | "all_time">("month");

  // Stats with caching
  const [stats, setStats] = useState<CreatorStats | StudioStats | null>(null);
  const statsCache = useRef<Map<string, CreatorStats | StudioStats>>(new Map());

  // Loading states
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isStatsLoading, setIsStatsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch platform data once
  useEffect(() => {
    const fetchPlatformData = async () => {
      if (!apiKey) {
        setIsInitialLoading(false);
        return;
      }

      try {
        const api = createApiClient(apiKey);

        if (user?.role === "admin") {
          const [overviewRes, leaderboardRes, creatorsRes, studiosRes] = await Promise.all([
            api.getPlatformOverview(),
            api.getLeaderboard({ period: "month", limit: 10 }),
            api.listCreators({ limit: 200 }),
            api.listStudios({ limit: 100 }),
          ]);

          if (overviewRes.success && overviewRes.data) {
            setPlatformOverview(overviewRes.data);
          }
          if (leaderboardRes.success && leaderboardRes.data) {
            setLeaderboard(leaderboardRes.data);
          }
          if (creatorsRes.success && creatorsRes.data) {
            setCreators(creatorsRes.data);
            if (creatorsRes.data.length > 0 && !selectedId) {
              setSelectedId(creatorsRes.data[0].id);
            }
          }
          if (studiosRes.success && studiosRes.data) {
            setStudios(studiosRes.data);
          }
        }

        if (user?.role === "studio" && user?.studio_id) {
          const creatorsRes = await api.listCreators({
            studio_id: user.studio_id,
            limit: 100,
          });
          if (creatorsRes.success && creatorsRes.data) {
            setCreators(creatorsRes.data);
          }
          setSelectedId(user.studio_id);
          setSelectedType("studio");
        }

        if (user?.role === "model" && user?.creator_id) {
          setSelectedId(user.creator_id);
          setSelectedType("model");
        }
      } catch (err) {
        console.error("Error fetching platform data:", err);
        setError("Failed to load platform data");
      } finally {
        setIsInitialLoading(false);
      }
    };

    fetchPlatformData();
  }, [apiKey, user]);

  // Fetch stats for selected entity
  const fetchEntityStats = useCallback(
    async (type: EntityType, id: string) => {
      if (!apiKey || !id) return;

      const cacheKey = `${type}-${id}`;
      const cached = statsCache.current.get(cacheKey);
      if (cached) {
        setStats(cached);
        return;
      }

      setIsStatsLoading(true);
      try {
        const api = createApiClient(apiKey);

        if (type === "model") {
          const res = await api.getCreatorStats(id, 12);
          if (res.success && res.data) {
            setStats(res.data);
            statsCache.current.set(cacheKey, res.data);
          }
        } else {
          const res = await api.getStudioStats(id);
          if (res.success && res.data) {
            setStats(res.data);
            statsCache.current.set(cacheKey, res.data);
          }
        }
      } catch (err) {
        console.error("Error fetching entity stats:", err);
      } finally {
        setIsStatsLoading(false);
      }
    },
    [apiKey]
  );

  useEffect(() => {
    if (selectedId) {
      fetchEntityStats(selectedType, selectedId);
    }
  }, [selectedType, selectedId, fetchEntityStats]);

  // Refresh leaderboard when period changes
  useEffect(() => {
    const refreshLeaderboard = async () => {
      if (!apiKey || user?.role !== "admin") return;

      try {
        const api = createApiClient(apiKey);
        const res = await api.getLeaderboard({ period, limit: 10 });
        if (res.success && res.data) {
          setLeaderboard(res.data);
        }
      } catch (err) {
        console.error("Error refreshing leaderboard:", err);
      }
    };

    refreshLeaderboard();
  }, [apiKey, period, user?.role]);

  const handleTypeChange = useCallback(
    (type: EntityType) => {
      setSelectedType(type);
      if (type === "model" && creators.length > 0) {
        setSelectedId(creators[0].id);
      } else if (type === "studio" && studios.length > 0) {
        setSelectedId(studios[0].id);
      }
    },
    [creators, studios]
  );

  const isCreatorStats = (s: CreatorStats | StudioStats): s is CreatorStats => {
    return "creator" in s;
  };

  const getSelectedName = () => {
    if (selectedType === "model") {
      const creator = creators.find((c) => c.id === selectedId);
      return creator ? `@${creator.username}` : "Select Model";
    } else {
      const studio = studios.find((s) => s.id === selectedId);
      return studio ? studio.name : "Select Studio";
    }
  };

  if (isInitialLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <Loader2 className="w-10 h-10 text-pink-500 animate-spin mx-auto mb-4" />
          <p className="text-slate-500">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6 flex items-center gap-3">
        <AlertCircle className="w-5 h-5 text-red-500" />
        <p className="text-red-400">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            <Sparkles className="w-8 h-8 text-pink-500" />
            Analytics
          </h1>
          <p className="text-slate-500 mt-1">
            {user?.role === "admin"
              ? "Platform performance at a glance"
              : user?.role === "studio"
              ? "Your studio's metrics"
              : "Your content performance"}
          </p>
        </div>
      </motion.div>

      {/* Admin Platform Overview */}
      {user?.role === "admin" && platformOverview && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <GlassStatCard
            label="Total Creators"
            value={platformOverview.counts.creators}
            icon={Users}
            gradient="bg-gradient-to-br from-pink-500 to-rose-500"
            delay={0}
          />
          <GlassStatCard
            label="Total Studios"
            value={platformOverview.counts.studios}
            icon={Building2}
            gradient="bg-gradient-to-br from-violet-500 to-purple-600"
            delay={0.1}
          />
          <GlassStatCard
            label="Total Media"
            value={platformOverview.counts.total_media}
            icon={Database}
            gradient="bg-gradient-to-br from-cyan-500 to-blue-500"
            delay={0.2}
          />
          <GlassStatCard
            label="This Month"
            value={platformOverview.current_month.total}
            icon={Flame}
            gradient="bg-gradient-to-br from-orange-500 to-amber-500"
            delay={0.3}
          />
        </div>
      )}

      {/* Leaderboard - Now a separate prominent section */}
      {user?.role === "admin" && leaderboard.length > 0 && (
        <LeaderboardSection
          data={leaderboard}
          period={period}
          onPeriodChange={setPeriod}
        />
      )}

      {/* Admin: Model/Studio Selector + Stats */}
      {user?.role === "admin" && (creators.length > 0 || studios.length > 0) && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Entity Selector */}
          <div className="lg:col-span-4 xl:col-span-3">
            <EntitySelector
              creators={creators}
              studios={studios}
              selectedType={selectedType}
              selectedId={selectedId}
              onTypeChange={handleTypeChange}
              onSelect={setSelectedId}
              isLoading={isStatsLoading}
            />
          </div>

          {/* Right: Selected Entity Stats */}
          <div className="lg:col-span-8 xl:col-span-9 space-y-6">
            {/* Selected entity header */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-3xl p-6 border border-white/10"
            >
              <div className="flex items-center gap-4">
                <div
                  className={`w-16 h-16 rounded-2xl flex items-center justify-center ${
                    selectedType === "model"
                      ? "bg-gradient-to-br from-pink-500 to-violet-500"
                      : "bg-gradient-to-br from-cyan-500 to-blue-500"
                  }`}
                >
                  {selectedType === "model" ? (
                    <User className="w-8 h-8 text-white" />
                  ) : (
                    <Building2 className="w-8 h-8 text-white" />
                  )}
                </div>
                <div>
                  <p className="text-white/50 text-sm capitalize">{selectedType} Statistics</p>
                  <h2 className="text-2xl font-black text-white">{getSelectedName()}</h2>
                </div>
                {isStatsLoading && (
                  <Loader2 className="w-5 h-5 text-pink-400 animate-spin ml-auto" />
                )}
              </div>
            </motion.div>

            {/* Stats content */}
            <AnimatePresence mode="wait">
              {stats && (
                <motion.div
                  key={selectedId}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  {/* Content Stats Grid */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <GlassStatCard
                      label="Photos"
                      value={stats.current_month.photos}
                      icon={ImageIcon}
                      gradient="bg-gradient-to-br from-blue-500 to-cyan-500"
                    />
                    <GlassStatCard
                      label="Videos"
                      value={stats.current_month.videos}
                      icon={Video}
                      gradient="bg-gradient-to-br from-purple-500 to-pink-500"
                    />
                    <GlassStatCard
                      label="Audio"
                      value={stats.current_month.audios}
                      icon={Music}
                      gradient="bg-gradient-to-br from-orange-500 to-red-500"
                    />
                    <GlassStatCard
                      label="Customs"
                      value={stats.current_month.customs}
                      icon={FileText}
                      gradient="bg-gradient-to-br from-green-500 to-emerald-500"
                    />
                  </div>

                  {/* Monthly Chart */}
                  {isCreatorStats(stats) && stats.monthly_history && stats.monthly_history.length > 0 && (
                    <div className="bg-slate-900/50 backdrop-blur-xl rounded-3xl p-6 border border-white/10">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-violet-500 flex items-center justify-center">
                          <TrendingUp className="w-5 h-5 text-white" />
                        </div>
                        <h3 className="text-lg font-bold text-white">Monthly Trend</h3>
                      </div>
                      <MonthlyChart data={stats.monthly_history} />
                    </div>
                  )}

                  {/* Studio Creator Stats */}
                  {!isCreatorStats(stats) && stats.creator_stats && stats.creator_stats.length > 0 && (
                    <div className="bg-slate-900/50 backdrop-blur-xl rounded-3xl p-6 border border-white/10">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center">
                          <Users className="w-5 h-5 text-white" />
                        </div>
                        <h3 className="text-lg font-bold text-white">Model Performance</h3>
                      </div>
                      <div className="space-y-3">
                        {stats.creator_stats.map((creator, idx) => (
                          <motion.button
                            key={creator.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            onClick={() => {
                              setSelectedType("model");
                              setSelectedId(creator.id);
                            }}
                            className="w-full flex items-center gap-4 p-4 bg-white/5 hover:bg-white/10 rounded-2xl transition-all group"
                          >
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-500 to-violet-500 flex items-center justify-center">
                              <span className="text-lg font-bold text-white">
                                {creator.username.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div className="flex-1 text-left">
                              <p className="font-semibold text-white">@{creator.username}</p>
                              <p className="text-xs text-white/50">
                                {creator.enabled ? "Active" : "Inactive"}
                              </p>
                            </div>
                            <div className="flex items-center gap-4">
                              <div className="text-right">
                                <p className="text-lg font-bold text-white">{creator.monthly.total}</p>
                                <p className="text-xs text-white/50">This Month</p>
                              </div>
                              <ChevronRight className="w-5 h-5 text-white/30 group-hover:text-white/70 transition-colors" />
                            </div>
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* Non-admin stats */}
      {user?.role !== "admin" && stats && (
        <div className="space-y-6">
          {/* Content Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <GlassStatCard
              label="Photos"
              value={stats.current_month.photos}
              icon={ImageIcon}
              gradient="bg-gradient-to-br from-blue-500 to-cyan-500"
            />
            <GlassStatCard
              label="Videos"
              value={stats.current_month.videos}
              icon={Video}
              gradient="bg-gradient-to-br from-purple-500 to-pink-500"
            />
            <GlassStatCard
              label="Audio"
              value={stats.current_month.audios}
              icon={Music}
              gradient="bg-gradient-to-br from-orange-500 to-red-500"
            />
            <GlassStatCard
              label="Customs"
              value={stats.current_month.customs}
              icon={FileText}
              gradient="bg-gradient-to-br from-green-500 to-emerald-500"
            />
          </div>

          {/* This Month Highlight */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative rounded-3xl overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-pink-500 via-violet-500 to-purple-600" />
            <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20" />
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />

            <div className="relative p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                    <Calendar className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">{stats.current_month.name}</h2>
                    <p className="text-white/60 text-sm">Monthly performance</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-5xl font-black text-white">{stats.current_month.total}</p>
                  <p className="text-white/60 text-sm">total uploads</p>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-3">
                {[
                  { icon: ImageIcon, value: stats.current_month.photos, label: "Photos" },
                  { icon: Video, value: stats.current_month.videos, label: "Videos" },
                  { icon: Music, value: stats.current_month.audios, label: "Audio" },
                  { icon: FileText, value: stats.current_month.customs, label: "Customs" },
                ].map((item, idx) => (
                  <div key={item.label} className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center">
                    <item.icon className="w-6 h-6 mx-auto mb-2 text-white/80" />
                    <p className="text-2xl font-bold text-white">{item.value}</p>
                    <p className="text-xs text-white/60">{item.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Monthly Chart */}
          {isCreatorStats(stats) && stats.monthly_history && stats.monthly_history.length > 0 && (
            <div className="bg-slate-900/50 backdrop-blur-xl rounded-3xl p-6 border border-white/10">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-violet-500 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-bold text-white">Monthly Trend</h3>
              </div>
              <MonthlyChart data={stats.monthly_history} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
