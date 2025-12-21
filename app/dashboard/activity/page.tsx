"use client";

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { useDashboard } from "../layout";
import { getSupabaseBrowserClient } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import {
  Activity,
  Image as ImageIcon,
  Upload,
  User,
  Settings,
  Link2,
  FileText,
  LogIn,
  MessageCircle,
  Bot,
  Filter,
  Calendar,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";

// ============================================
// TYPES
// ============================================

interface ActivityLog {
  id: string;
  user_id: string | null;
  creator_id: string | null;
  studio_id: string | null;
  action: string;
  description: string;
  metadata: Record<string, unknown>;
  source: string;
  created_at: string;
  user?: { display_name: string; email: string } | null;
  creator?: { username: string } | null;
}

// ============================================
// ACTION ICONS
// ============================================

const actionIcons: Record<string, typeof Activity> = {
  media_upload: Upload,
  login: LogIn,
  bio_update: Link2,
  settings_update: Settings,
  contract_signed: FileText,
  model_added: User,
  whatsapp_message: MessageCircle,
  bot_action: Bot,
  default: Activity,
};

const actionColors: Record<string, string> = {
  media_upload: "bg-green-500/10 text-green-600 border-green-500/20",
  login: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  bio_update: "bg-purple-500/10 text-purple-600 border-purple-500/20",
  settings_update: "bg-slate-500/10 text-slate-600 border-slate-500/20",
  contract_signed: "bg-amber-500/10 text-amber-600 border-amber-500/20",
  model_added: "bg-pink-500/10 text-pink-600 border-pink-500/20",
  whatsapp_message: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  bot_action: "bg-cyan-500/10 text-cyan-600 border-cyan-500/20",
  default: "bg-slate-500/10 text-slate-600 border-slate-500/20",
};

const sourceLabels: Record<string, string> = {
  dashboard: "Dashboard",
  whatsapp_bot: "WhatsApp Bot",
  api: "API",
};

// ============================================
// ACTIVITY ITEM
// ============================================

function ActivityItem({ log }: { log: ActivityLog }) {
  const Icon = actionIcons[log.action] || actionIcons.default;
  const colorClass = actionColors[log.action] || actionColors.default;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-start gap-4 p-4 bg-white rounded-xl border border-slate-200 hover:shadow-sm transition-shadow"
    >
      <div className={`p-2.5 rounded-lg border ${colorClass}`}>
        <Icon className="w-4 h-4" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-slate-900">{log.description}</p>
        <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
          {log.user?.display_name && (
            <span className="font-medium text-slate-600">
              {log.user.display_name}
            </span>
          )}
          {log.creator?.username && (
            <span className="text-brand-600">@{log.creator.username}</span>
          )}
          <span>•</span>
          <span>{formatDistanceToNow(new Date(log.created_at), { addSuffix: true })}</span>
          <span>•</span>
          <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
            {sourceLabels[log.source] || log.source}
          </span>
        </div>
      </div>
      <div className="text-xs text-slate-400">
        {format(new Date(log.created_at), "HH:mm")}
      </div>
    </motion.div>
  );
}

// ============================================
// MAIN PAGE
// ============================================

export default function ActivityPage() {
  const { user } = useDashboard();
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "dashboard" | "whatsapp_bot">("all");
  const [dateRange, setDateRange] = useState<"today" | "week" | "month">("week");

  const fetchActivities = async () => {
    setIsLoading(true);
    try {
      const supabase = getSupabaseBrowserClient();
      
      // Calculate date filter
      const now = new Date();
      let startDate = new Date();
      if (dateRange === "today") {
        startDate.setHours(0, 0, 0, 0);
      } else if (dateRange === "week") {
        startDate.setDate(now.getDate() - 7);
      } else {
        startDate.setMonth(now.getMonth() - 1);
      }

      let query = supabase
        .from("activity_logs")
        .select(`
          *,
          user:dashboard_users(display_name, email),
          creator:creators(username)
        `)
        .gte("created_at", startDate.toISOString())
        .order("created_at", { ascending: false })
        .limit(100);

      if (filter !== "all") {
        query = query.eq("source", filter);
      }

      const { data, error } = await query;
      if (error) throw error;
      setActivities(data || []);
    } catch (err) {
      console.error("Error fetching activities:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, [filter, dateRange]);

  // Group activities by date
  const groupedActivities = activities.reduce((groups, activity) => {
    const date = format(new Date(activity.created_at), "yyyy-MM-dd");
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(activity);
    return groups;
  }, {} as Record<string, ActivityLog[]>);

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Activity Log</h1>
          <p className="text-slate-500">Track all actions from dashboard and WhatsApp bot</p>
        </div>
        <Button variant="outline" size="sm" onClick={fetchActivities} disabled={isLoading}>
          <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Source Filter */}
        <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-1">
          <button
            onClick={() => setFilter("all")}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              filter === "all"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter("dashboard")}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              filter === "dashboard"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setFilter("whatsapp_bot")}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              filter === "whatsapp_bot"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            WhatsApp Bot
          </button>
        </div>

        {/* Date Range Filter */}
        <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-1">
          <button
            onClick={() => setDateRange("today")}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              dateRange === "today"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Today
          </button>
          <button
            onClick={() => setDateRange("week")}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              dateRange === "week"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            This Week
          </button>
          <button
            onClick={() => setDateRange("month")}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              dateRange === "month"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            This Month
          </button>
        </div>
      </div>

      {/* Activity List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-brand-600 animate-spin" />
        </div>
      ) : activities.length === 0 ? (
        <div className="text-center py-20">
          <Activity className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-900 mb-1">No activity yet</h3>
          <p className="text-slate-500">Actions will appear here as they happen</p>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedActivities).map(([date, logs]) => (
            <div key={date}>
              <div className="flex items-center gap-3 mb-3">
                <Calendar className="w-4 h-4 text-slate-400" />
                <h3 className="text-sm font-medium text-slate-600">
                  {format(new Date(date), "EEEE, MMMM d, yyyy")}
                </h3>
                <div className="flex-1 h-px bg-slate-200" />
                <span className="text-xs text-slate-400">{logs.length} events</span>
              </div>
              <div className="space-y-2">
                {logs.map((log) => (
                  <ActivityItem key={log.id} log={log} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}


