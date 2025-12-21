"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useDashboard } from "../../layout";
import {
  Zap,
  MessageSquare,
  Heart,
  UserPlus,
  Clock,
  Play,
  Pause,
  Settings,
  ChevronRight,
  AlertCircle,
  Check,
  X,
  Loader2,
  RefreshCw,
  BarChart3,
  Users,
  TrendingUp,
  ArrowUpRight,
  Power,
  Edit2,
  Trash2,
  Plus,
  Bot,
  Eye,
  Target,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

// ============================================
// TYPES
// ============================================

interface Automation {
  id: string;
  name: string;
  description: string;
  platform: "reddit" | "twitter" | "instagram" | "onlyfans";
  type: "comment" | "follow" | "like" | "join" | "dm";
  enabled: boolean;
  settings: Record<string, any>;
  stats: {
    totalActions: number;
    successRate: number;
    lastRun: string | null;
  };
}

interface PlatformStats {
  platform: string;
  followers: number;
  growth: number;
  engagement: number;
  posts: number;
}

// ============================================
// MOCK DATA
// ============================================

const MOCK_AUTOMATIONS: Automation[] = [
  {
    id: "1",
    name: "Auto-Comment on New Posts",
    description: "Automatically comment on new posts in selected subreddits",
    platform: "reddit",
    type: "comment",
    enabled: true,
    settings: {
      subreddits: ["r/onlyfanspromo", "r/selfie", "r/amihot"],
      commentTemplates: [
        "Great post! 🔥",
        "Love this! Check out my profile 💋",
        "You look amazing!",
      ],
      maxPerHour: 10,
      minDelay: 60,
      maxDelay: 300,
    },
    stats: {
      totalActions: 1247,
      successRate: 94.5,
      lastRun: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    },
  },
  {
    id: "2",
    name: "Join Relevant Subreddits",
    description: "Automatically join subreddits related to your content",
    platform: "reddit",
    type: "join",
    enabled: false,
    settings: {
      keywords: ["onlyfans", "selfie", "promo", "nsfw"],
      minMembers: 1000,
      maxJoinPerDay: 5,
    },
    stats: {
      totalActions: 89,
      successRate: 100,
      lastRun: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    },
  },
  {
    id: "3",
    name: "Auto-Like Comments",
    description: "Like comments on your posts to boost engagement",
    platform: "twitter",
    type: "like",
    enabled: true,
    settings: {
      onOwnPosts: true,
      keywords: ["link", "onlyfans", "subscribe"],
      maxPerHour: 20,
    },
    stats: {
      totalActions: 3456,
      successRate: 98.2,
      lastRun: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    },
  },
  {
    id: "4",
    name: "Welcome DM",
    description: "Send welcome message to new followers",
    platform: "onlyfans",
    type: "dm",
    enabled: true,
    settings: {
      message: "Hey! Thanks for subscribing 💕 Let me know if you'd like any custom content!",
      delay: 60,
      includeMedia: false,
    },
    stats: {
      totalActions: 567,
      successRate: 99.1,
      lastRun: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    },
  },
];

const MOCK_PLATFORM_STATS: PlatformStats[] = [
  { platform: "reddit", followers: 12500, growth: 8.5, engagement: 4.2, posts: 234 },
  { platform: "twitter", followers: 8900, growth: 12.3, engagement: 3.8, posts: 567 },
  { platform: "instagram", followers: 45600, growth: 5.1, engagement: 6.7, posts: 890 },
  { platform: "onlyfans", followers: 2340, growth: 15.2, engagement: 12.4, posts: 156 },
];

// ============================================
// PLATFORM CONFIG
// ============================================

const PLATFORMS: Record<string, { name: string; color: string; icon: string; bg: string; textColor: string }> = {
  reddit: { name: "Reddit", color: "#FF4500", icon: "🔴", bg: "bg-orange-500/10", textColor: "text-orange-500" },
  twitter: { name: "X / Twitter", color: "#1DA1F2", icon: "𝕏", bg: "bg-sky-500/10", textColor: "text-sky-500" },
  instagram: { name: "Instagram", color: "#E4405F", icon: "📷", bg: "bg-pink-500/10", textColor: "text-pink-500" },
  onlyfans: { name: "OnlyFans", color: "#00AFF0", icon: "💙", bg: "bg-blue-500/10", textColor: "text-blue-500" },
};

const AUTOMATION_TYPES: Record<string, { name: string; icon: typeof MessageSquare }> = {
  comment: { name: "Comment", icon: MessageSquare },
  follow: { name: "Follow", icon: UserPlus },
  like: { name: "Like", icon: Heart },
  join: { name: "Join", icon: Users },
  dm: { name: "DM", icon: MessageSquare },
};

// ============================================
// STAT CARD
// ============================================

function StatCard({ stat }: { stat: PlatformStats }) {
  const platform = PLATFORMS[stat.platform];
  return (
    <div className={`${platform.bg} rounded-xl p-4`}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-2xl">{platform.icon}</span>
        <span className={`text-xs font-medium ${platform.textColor} flex items-center gap-1`}>
          <TrendingUp className="w-3 h-3" />
          +{stat.growth}%
        </span>
      </div>
      <p className={`text-xl font-bold ${platform.textColor}`}>
        {stat.followers.toLocaleString()}
      </p>
      <p className="text-xs text-slate-500">{platform.name} followers</p>
      <div className="mt-3 pt-3 border-t border-slate-200/50 flex items-center justify-between text-xs text-slate-500">
        <span>{stat.engagement}% engagement</span>
        <span>{stat.posts} posts</span>
      </div>
    </div>
  );
}

// ============================================
// AUTOMATION CARD
// ============================================

function AutomationCard({
  automation,
  onToggle,
  onEdit,
  onDelete,
}: {
  automation: Automation;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const platform = PLATFORMS[automation.platform];
  const typeConfig = AUTOMATION_TYPES[automation.type];
  const TypeIcon = typeConfig.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white rounded-xl border border-slate-200 p-5 ${!automation.enabled && "opacity-60"}`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4 flex-1">
          <div className={`w-12 h-12 rounded-xl ${platform.bg} flex items-center justify-center`}>
            <TypeIcon className={`w-6 h-6 ${platform.textColor}`} />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-slate-900">{automation.name}</h3>
              <span className={`text-xs px-2 py-0.5 rounded-full ${platform.bg} ${platform.textColor}`}>
                {platform.name}
              </span>
            </div>
            <p className="text-sm text-slate-500 mb-3">{automation.description}</p>
            
            {/* Stats */}
            <div className="flex items-center gap-4 text-xs text-slate-500">
              <span className="flex items-center gap-1">
                <BarChart3 className="w-3 h-3" />
                {automation.stats.totalActions.toLocaleString()} actions
              </span>
              <span className="flex items-center gap-1">
                <Check className="w-3 h-3 text-green-500" />
                {automation.stats.successRate}% success
              </span>
              {automation.stats.lastRun && (
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {getTimeAgo(automation.stats.lastRun)}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={onEdit}>
            <Settings className="w-4 h-4" />
          </Button>
          <button
            onClick={onToggle}
            className={`w-12 h-6 rounded-full transition-colors relative ${
              automation.enabled ? "bg-green-500" : "bg-slate-300"
            }`}
          >
            <div
              className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                automation.enabled ? "translate-x-7" : "translate-x-1"
              }`}
            />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

// ============================================
// AUTOMATION SETTINGS SHEET
// ============================================

function AutomationSettingsSheet({
  automation,
  onClose,
  onSave,
}: {
  automation: Automation | null;
  onClose: () => void;
  onSave: (settings: Record<string, any>) => void;
}) {
  const [settings, setSettings] = useState(automation?.settings || {});

  if (!automation) return null;

  const platform = PLATFORMS[automation.platform];

  return (
    <Sheet open={!!automation} onOpenChange={onClose}>
      <SheetContent className="w-[400px] sm:w-[500px]">
        <SheetHeader>
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg ${platform.bg} flex items-center justify-center`}>
              <span className="text-lg">{platform.icon}</span>
            </div>
            <div>
              <SheetTitle>{automation.name}</SheetTitle>
              <SheetDescription>{automation.description}</SheetDescription>
            </div>
          </div>
        </SheetHeader>

        <div className="py-6 space-y-6">
          {/* Reddit-specific settings */}
          {automation.platform === "reddit" && automation.type === "comment" && (
            <>
              <div className="space-y-2">
                <Label>Target Subreddits</Label>
                <div className="space-y-2">
                  {(settings.subreddits || []).map((sub: string, idx: number) => (
                    <div key={idx} className="flex items-center gap-2">
                      <Input value={sub} className="flex-1" readOnly />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          const newSubs = [...settings.subreddits];
                          newSubs.splice(idx, 1);
                          setSettings({ ...settings, subreddits: newSubs });
                        }}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const sub = prompt("Enter subreddit (e.g., r/onlyfanspromo)");
                      if (sub) {
                        setSettings({
                          ...settings,
                          subreddits: [...(settings.subreddits || []), sub],
                        });
                      }
                    }}
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add Subreddit
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Comment Templates</Label>
                <div className="space-y-2">
                  {(settings.commentTemplates || []).map((template: string, idx: number) => (
                    <div key={idx} className="flex items-center gap-2">
                      <Input
                        value={template}
                        onChange={(e) => {
                          const newTemplates = [...settings.commentTemplates];
                          newTemplates[idx] = e.target.value;
                          setSettings({ ...settings, commentTemplates: newTemplates });
                        }}
                        className="flex-1"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          const newTemplates = [...settings.commentTemplates];
                          newTemplates.splice(idx, 1);
                          setSettings({ ...settings, commentTemplates: newTemplates });
                        }}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSettings({
                        ...settings,
                        commentTemplates: [...(settings.commentTemplates || []), ""],
                      });
                    }}
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add Template
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Max per hour</Label>
                  <Input
                    type="number"
                    value={settings.maxPerHour || 10}
                    onChange={(e) => setSettings({ ...settings, maxPerHour: parseInt(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Min delay (sec)</Label>
                  <Input
                    type="number"
                    value={settings.minDelay || 60}
                    onChange={(e) => setSettings({ ...settings, minDelay: parseInt(e.target.value) })}
                  />
                </div>
              </div>
            </>
          )}

          {/* OnlyFans DM settings */}
          {automation.platform === "onlyfans" && automation.type === "dm" && (
            <>
              <div className="space-y-2">
                <Label>Welcome Message</Label>
                <textarea
                  value={settings.message || ""}
                  onChange={(e) => setSettings({ ...settings, message: e.target.value })}
                  className="w-full h-32 p-3 border border-slate-200 rounded-lg text-sm resize-none"
                  placeholder="Your welcome message..."
                />
              </div>
              <div className="space-y-2">
                <Label>Delay after subscribe (seconds)</Label>
                <Input
                  type="number"
                  value={settings.delay || 60}
                  onChange={(e) => setSettings({ ...settings, delay: parseInt(e.target.value) })}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label>Include media</Label>
                <button
                  onClick={() => setSettings({ ...settings, includeMedia: !settings.includeMedia })}
                  className={`w-10 h-5 rounded-full transition-colors relative ${
                    settings.includeMedia ? "bg-green-500" : "bg-slate-300"
                  }`}
                >
                  <div
                    className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                      settings.includeMedia ? "translate-x-5" : "translate-x-0.5"
                    }`}
                  />
                </button>
              </div>
            </>
          )}

          {/* Generic settings */}
          {automation.type === "like" && (
            <>
              <div className="space-y-2">
                <Label>Keywords to match</Label>
                <Input
                  value={(settings.keywords || []).join(", ")}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      keywords: e.target.value.split(",").map((k) => k.trim()),
                    })
                  }
                  placeholder="link, onlyfans, subscribe"
                />
              </div>
              <div className="space-y-2">
                <Label>Max per hour</Label>
                <Input
                  type="number"
                  value={settings.maxPerHour || 20}
                  onChange={(e) => setSettings({ ...settings, maxPerHour: parseInt(e.target.value) })}
                />
              </div>
            </>
          )}
        </div>

        <div className="flex items-center gap-3 pt-4 border-t">
          <Button variant="outline" className="flex-1" onClick={onClose}>
            Cancel
          </Button>
          <Button
            className="flex-1"
            onClick={() => {
              onSave(settings);
              toast.success("Settings saved");
              onClose();
            }}
          >
            Save Settings
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

// ============================================
// HELPER
// ============================================

function getTimeAgo(dateString: string): string {
  const diff = Date.now() - new Date(dateString).getTime();
  const minutes = Math.floor(diff / 1000 / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

// ============================================
// MAIN PAGE
// ============================================

export default function AutomationsPage() {
  const { user } = useDashboard();
  const [automations, setAutomations] = useState<Automation[]>(MOCK_AUTOMATIONS);
  const [editingAutomation, setEditingAutomation] = useState<Automation | null>(null);
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);

  const filteredAutomations = selectedPlatform
    ? automations.filter((a) => a.platform === selectedPlatform)
    : automations;

  const toggleAutomation = (id: string) => {
    setAutomations(
      automations.map((a) =>
        a.id === id ? { ...a, enabled: !a.enabled } : a
      )
    );
    const automation = automations.find((a) => a.id === id);
    toast.success(`${automation?.name} ${automation?.enabled ? "paused" : "started"}`);
  };

  const saveAutomationSettings = (settings: Record<string, any>) => {
    if (!editingAutomation) return;
    setAutomations(
      automations.map((a) =>
        a.id === editingAutomation.id ? { ...a, settings } : a
      )
    );
  };

  const activeCount = automations.filter((a) => a.enabled).length;
  const totalActions = automations.reduce((sum, a) => sum + a.stats.totalActions, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-bold text-slate-900">Automations</h1>
            <span className="px-2 py-0.5 text-xs font-medium bg-amber-100 text-amber-700 rounded-full">
              Development
            </span>
          </div>
          <p className="text-slate-500">Manage your social media automation workflows</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          New Automation
        </Button>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
              <Power className="w-4 h-4 text-green-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900">{activeCount}</p>
          <p className="text-xs text-slate-500">Active automations</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
              <Zap className="w-4 h-4 text-blue-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900">{totalActions.toLocaleString()}</p>
          <p className="text-xs text-slate-500">Total actions</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
              <Check className="w-4 h-4 text-purple-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900">96.4%</p>
          <p className="text-xs text-slate-500">Avg success rate</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-orange-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900">+23%</p>
          <p className="text-xs text-slate-500">Engagement boost</p>
        </div>
      </div>

      {/* Platform Stats */}
      <div>
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Platform Overview</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {MOCK_PLATFORM_STATS.map((stat) => (
            <StatCard key={stat.platform} stat={stat} />
          ))}
        </div>
      </div>

      {/* Platform Filter */}
      <div className="flex items-center gap-2">
        <Button
          variant={selectedPlatform === null ? "default" : "outline"}
          size="sm"
          onClick={() => setSelectedPlatform(null)}
        >
          All
        </Button>
        {Object.entries(PLATFORMS).map(([key, platform]) => (
          <Button
            key={key}
            variant={selectedPlatform === key ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedPlatform(key)}
            className="gap-1"
          >
            {platform.icon} {platform.name}
          </Button>
        ))}
      </div>

      {/* Automations List */}
      <div className="space-y-4">
        {filteredAutomations.map((automation) => (
          <AutomationCard
            key={automation.id}
            automation={automation}
            onToggle={() => toggleAutomation(automation.id)}
            onEdit={() => setEditingAutomation(automation)}
            onDelete={() => {
              if (confirm("Delete this automation?")) {
                setAutomations(automations.filter((a) => a.id !== automation.id));
                toast.success("Automation deleted");
              }
            }}
          />
        ))}
      </div>

      {/* Settings Sheet */}
      <AutomationSettingsSheet
        automation={editingAutomation}
        onClose={() => setEditingAutomation(null)}
        onSave={saveAutomationSettings}
      />
    </div>
  );
}



