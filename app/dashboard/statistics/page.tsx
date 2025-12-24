"use client";

import { useState, useEffect, useRef, useCallback, useMemo, memo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { useDashboard } from "../layout";
import { useMediaState } from "@/lib/hooks/use-media-state";
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
  ArrowDownRight,
  Activity,
  Zap,
  ExternalLink,
  Search,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Link2,
  Hash,
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
} from "recharts";
import {
  getCountryFlag,
  getCountryCoordinates,
} from "@/lib/country-utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import createGlobe from "cobe";
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
  changes?: {
    views: { value: string; type: "up" | "down" | "neutral" };
    visitors: { value: string; type: "up" | "down" | "neutral" };
    clicks: { value: string; type: "up" | "down" | "neutral" };
  };
  viewsByDay: Record<string, number>;
  clicksByDay?: Record<string, number>;
  viewsByCountry: Record<string, number>;
  viewsByDevice: Record<string, number>;
  topLinks: Array<{ label: string; count: number; modelUsername?: string }>;
  topReferrers: Array<{ referrer: string; count: number }>;
  globeMarkers?: Array<{ country: string; count: number; lat: number; lng: number }>;
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
  viewsByDay?: Record<string, number>;
  clicksByDay?: Record<string, number>;
  viewsByCountry?: Record<string, number>;
  viewsByDevice?: Record<string, number>;
  topLinks?: Array<{ label: string; count: number; modelUsername?: string; creatorId?: string }>;
  topReferrers?: Array<{ referrer: string; count: number }>;
}

interface RealtimeVisitor {
  id: string;
  lat: number;
  lng: number;
  country: string;
  timestamp: number;
}

// ============================================
// CHART CONFIGS
// ============================================

const chartConfig = {
  views: { label: "Views", color: "#8b5cf6" },
  clicks: { label: "Clicks", color: "#10b981" },
  photos: { label: "Photos", color: "#8b5cf6" },
  videos: { label: "Videos", color: "#f59e0b" },
  audios: { label: "Audio", color: "#ef4444" },
  customs: { label: "Customs", color: "#06b6d4" },
} satisfies ChartConfig;

const COLORS = ["#8b5cf6", "#10b981", "#f59e0b", "#ef4444", "#3b82f6", "#06b6d4"];

const SELF_REFERRER_DOMAINS = [
  "lustyfantasy.online",
  "www.lustyfantasy.online",
  "Lovdash.bio",
  "www.Lovdash.bio",
  "localhost",
];

// ============================================
// FAVICON HELPER
// ============================================

function getFaviconUrl(domain: string): string {
  return `https://www.google.com/s2/favicons?domain=${domain}&sz=32`;
}

// ============================================
// REALTIME GLOBE COMPONENT
// ============================================

interface GlobeProps {
  realtimeVisitors: RealtimeVisitor[];
  className?: string;
}

const RealtimeGlobe = memo(function RealtimeGlobe({
  realtimeVisitors,
  className,
}: GlobeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointerInteracting = useRef<number | null>(null);
  const phiRef = useRef(0);
  const rotationRef = useRef(0);
  const globeRef = useRef<ReturnType<typeof createGlobe> | null>(null);

  const realtimeMarkers = useMemo(() => {
    const now = Date.now();
    return realtimeVisitors
      .filter((v) => now - v.timestamp < 15000)
      .map((v) => {
        const age = (now - v.timestamp) / 15000;
        const size = Math.max(0.08, 0.2 * (1 - age));
        return {
          location: [v.lat, v.lng] as [number, number],
          size,
        };
      });
  }, [realtimeVisitors]);

  const updatePointerInteraction = useCallback((value: number | null) => {
    pointerInteracting.current = value;
    if (canvasRef.current) {
      canvasRef.current.style.cursor = value ? "grabbing" : "grab";
    }
  }, []);

  const updateMovement = useCallback((clientX: number) => {
    if (pointerInteracting.current !== null) {
      const delta = clientX - pointerInteracting.current;
      rotationRef.current += delta / 200;
      pointerInteracting.current = clientX;
    }
  }, []);

  useEffect(() => {
    let width = 0;

    const onResize = () => {
      if (canvasRef.current) {
        width = canvasRef.current.offsetWidth;
      }
    };
    window.addEventListener("resize", onResize);
    onResize();

    if (!canvasRef.current) return;

    if (globeRef.current) {
      globeRef.current.destroy();
    }

    globeRef.current = createGlobe(canvasRef.current, {
      devicePixelRatio: 2,
      width: width * 2,
      height: width * 2,
      phi: 0,
      theta: 0.3,
      dark: 0,
      diffuse: 1.2,
      mapSamples: 16000,
      mapBrightness: 1.2,
      baseColor: [1, 1, 1],
      markerColor: [0.545, 0.361, 0.965],
      glowColor: [0.95, 0.95, 0.98],
      markers: realtimeMarkers,
      onRender: (state) => {
        if (!pointerInteracting.current) {
          phiRef.current += 0.003;
        }
        state.phi = phiRef.current + rotationRef.current;
        state.width = width * 2;
        state.height = width * 2;
      },
    });

    setTimeout(() => {
      if (canvasRef.current) {
        canvasRef.current.style.opacity = "1";
      }
    }, 100);

    return () => {
      if (globeRef.current) {
        globeRef.current.destroy();
        globeRef.current = null;
      }
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <div className={`relative aspect-square ${className}`}>
      <canvas
        ref={canvasRef}
        onPointerDown={(e) => updatePointerInteraction(e.clientX)}
        onPointerUp={() => updatePointerInteraction(null)}
        onPointerOut={() => updatePointerInteraction(null)}
        onMouseMove={(e) => updateMovement(e.clientX)}
        onTouchMove={(e) => e.touches[0] && updateMovement(e.touches[0].clientX)}
        style={{
          width: "100%",
          height: "100%",
          cursor: "grab",
          contain: "layout paint size",
          opacity: 0,
          transition: "opacity 0.5s ease",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent pointer-events-none" />
      
      {realtimeVisitors.length > 0 && (
        <div className="absolute top-3 left-3 flex items-center gap-2 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-sm border border-slate-200">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
          </span>
          <span className="text-xs font-medium text-slate-700">Live</span>
        </div>
      )}
    </div>
  );
});

// ============================================
// REALTIME ACTIVITY FEED
// ============================================

function RealtimeActivityFeed({
  visitors,
}: {
  visitors: RealtimeVisitor[];
}) {
  const recentVisitors = visitors.slice(-5).reverse();
  
  return (
    <div className="space-y-2">
      <AnimatePresence mode="popLayout">
        {recentVisitors.map((visitor) => (
          <motion.div
            key={visitor.id}
            initial={{ opacity: 0, x: -20, height: 0 }}
            animate={{ opacity: 1, x: 0, height: "auto" }}
            exit={{ opacity: 0, x: 20, height: 0 }}
            className="flex items-center gap-3 p-2 bg-gradient-to-r from-violet-50 to-transparent rounded-lg"
          >
            <span className="text-lg">{getCountryFlag(visitor.country)}</span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-700 truncate">
                Visitor from {visitor.country}
              </p>
              <p className="text-xs text-slate-500">
                {formatTimeAgo(visitor.timestamp)}
              </p>
            </div>
            <Zap className="w-4 h-4 text-amber-500" />
          </motion.div>
        ))}
      </AnimatePresence>
      
      {recentVisitors.length === 0 && (
        <div className="text-center py-4 text-slate-400 text-sm">
          <Activity className="w-8 h-8 mx-auto mb-2 opacity-30" />
          <p>Waiting for visitors...</p>
        </div>
      )}
    </div>
  );
}

function formatTimeAgo(timestamp: number): string {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  if (seconds < 5) return "Just now";
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  return `${Math.floor(minutes / 60)}h ago`;
}

// ============================================
// REFERRER CARD WITH FAVICON
// ============================================

function ReferrerCard({
  referrer,
  count,
  color,
}: {
  referrer: string;
  count: number;
  color: string;
}) {
  const displayName = referrer === "Direct" ? "Direct Traffic" : referrer;
  const faviconUrl = referrer !== "Direct" ? getFaviconUrl(referrer) : null;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-3 p-4 bg-gradient-to-br from-slate-50 to-white rounded-xl border border-slate-100 hover:border-slate-200 transition-colors"
    >
      <div 
        className="w-10 h-10 rounded-full flex items-center justify-center overflow-hidden"
        style={{ backgroundColor: `${color}15` }}
      >
        {faviconUrl ? (
          <img 
            src={faviconUrl} 
            alt={referrer}
            className="w-5 h-5"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
              (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
            }}
          />
        ) : null}
        <Globe 
          className={`w-5 h-5 ${faviconUrl ? 'hidden' : ''}`} 
          style={{ color }} 
        />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1">
          <p className="text-sm font-medium text-slate-900 truncate">{displayName}</p>
          {referrer !== "Direct" && (
            <ExternalLink className="w-3 h-3 text-slate-400 flex-shrink-0" />
          )}
        </div>
        <p className="text-xs text-slate-500">{count} visits</p>
      </div>
    </motion.div>
  );
}

// ============================================
// STAT CARD WITH GRADIENT
// ============================================

function StatCard({
  label,
  value,
  change,
  changeType = "neutral",
  icon: Icon,
  gradient,
}: {
  label: string;
  value: string | number;
  change?: string;
  changeType?: "up" | "down" | "neutral";
  icon: React.ComponentType<{ className?: string }>;
  gradient: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-2xl p-5 ${gradient} relative overflow-hidden`}
    >
      <div className="absolute inset-0 opacity-10">
        <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-white/20" />
        <div className="absolute -right-4 -bottom-4 w-24 h-24 rounded-full bg-white/10" />
      </div>
      
      <div className="relative flex items-start justify-between">
        <div>
          <p className="text-sm text-white/80 mb-1 font-medium">{label}</p>
          <p className="text-3xl font-bold text-white">
            {typeof value === "number" ? value.toLocaleString() : value}
          </p>
          {change && (
            <div className={`flex items-center gap-1 mt-2 text-sm ${
              changeType === "up" ? "text-green-200" :
              changeType === "down" ? "text-red-200" : "text-white/60"
            }`}>
              {changeType === "up" && <ArrowUpRight className="w-4 h-4" />}
              {changeType === "down" && <ArrowDownRight className="w-4 h-4" />}
              <span>{change} vs last period</span>
            </div>
          )}
        </div>
        <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </motion.div>
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
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="h-full rounded-full"
            style={{ backgroundColor: color }}
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
        <SelectItem value="all">All Models</SelectItem>
        {models.map((model) => (
          <SelectItem key={model.id} value={model.id}>
            @{model.username}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

// ============================================
// PAGINATION COMPONENT
// ============================================

function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
  if (totalPages <= 1) return null;
  
  return (
    <div className="flex items-center justify-between pt-4 border-t border-slate-100">
      <p className="text-sm text-slate-500">
        Page {currentPage} of {totalPages}
      </p>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}

// ============================================
// MODEL PERFORMANCE TABLE (SCALABLE)
// ============================================

const MODELS_PER_PAGE = 15;

function ModelPerformanceTable({
  modelStats,
  onSelectModel,
}: {
  modelStats: ModelBioStats[];
  onSelectModel: (id: string) => void;
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  
  // Filter models by search
  const filteredModels = useMemo(() => {
    if (!searchQuery.trim()) return modelStats;
    const query = searchQuery.toLowerCase();
    return modelStats.filter((m) => 
      m.username.toLowerCase().includes(query)
    );
  }, [modelStats, searchQuery]);
  
  // Paginate
  const totalPages = Math.ceil(filteredModels.length / MODELS_PER_PAGE);
  const paginatedModels = filteredModels.slice(
    (currentPage - 1) * MODELS_PER_PAGE,
    currentPage * MODELS_PER_PAGE
  );
  
  // Reset page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);
  
  const maxViews = Math.max(...modelStats.map(m => m.views), 1);
  
  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <Input
          placeholder="Search models..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>
      
      {/* Table Header */}
      <div className="grid grid-cols-12 gap-4 px-4 py-2 text-xs font-medium text-slate-500 uppercase tracking-wider border-b border-slate-100">
        <div className="col-span-4">Model</div>
        <div className="col-span-2 text-right">Views</div>
        <div className="col-span-2 text-right">Clicks</div>
        <div className="col-span-3">Performance</div>
        <div className="col-span-1"></div>
      </div>
      
      {/* Table Body */}
      <div className="divide-y divide-slate-50">
        {paginatedModels.length === 0 ? (
          <div className="py-12 text-center text-slate-400">
            <Users className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p className="font-medium">No models found</p>
            <p className="text-sm mt-1">
              {searchQuery ? "Try a different search term" : "No bio link data yet"}
            </p>
          </div>
        ) : (
          paginatedModels.map((model, idx) => {
            const viewsPercentage = (model.views / maxViews) * 100;
            const clicksPercentage = maxViews > 0 ? (model.clicks / maxViews) * 100 : 0;
            const ctr = model.views > 0 
              ? ((model.clicks / model.views) * 100).toFixed(1) 
              : "0.0";
            
            return (
              <motion.div
                key={model.creatorId}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: idx * 0.02 }}
                className="grid grid-cols-12 gap-4 px-4 py-3 items-center hover:bg-slate-50/50 rounded-lg transition-colors group"
              >
                {/* Model Name */}
                <div className="col-span-4 flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-400 to-purple-500 flex items-center justify-center text-white text-sm font-semibold shadow-sm flex-shrink-0">
                    {model.username.charAt(0).toUpperCase()}
                  </div>
                  <span className="font-medium text-slate-900 truncate">
                    @{model.username}
                  </span>
                </div>
                
                {/* Views */}
                <div className="col-span-2 text-right">
                  <span className="text-sm font-semibold text-slate-900">
                    {model.views.toLocaleString()}
                  </span>
                </div>
                
                {/* Clicks */}
                <div className="col-span-2 text-right">
                  <span className="text-sm font-semibold text-slate-900">
                    {model.clicks.toLocaleString()}
                  </span>
                </div>
                
                {/* Performance Bar */}
                <div className="col-span-3">
                  <div className="flex gap-0.5 h-2 rounded-full overflow-hidden bg-slate-100">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${viewsPercentage}%` }}
                      transition={{ duration: 0.4 }}
                      className="bg-violet-500 rounded-l"
                    />
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${clicksPercentage}%` }}
                      transition={{ duration: 0.4, delay: 0.1 }}
                      className="bg-emerald-500 rounded-r"
                    />
                  </div>
                  <p className="text-xs text-slate-500 mt-1">{ctr}% CTR</p>
                </div>
                
                {/* Action */}
                <div className="col-span-1 flex justify-end">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onSelectModel(model.creatorId)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </motion.div>
            );
          })
        )}
      </div>
      
      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
      
      {/* Legend */}
      <div className="flex items-center justify-center gap-6 pt-2">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-violet-500" />
          <span className="text-xs text-slate-600">Views</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-emerald-500" />
          <span className="text-xs text-slate-600">Clicks</span>
        </div>
      </div>
    </div>
  );
}

// ============================================
// TOP LINKS TABLE (WITH MODEL INFO)
// ============================================

function TopLinksTable({
  links,
  modelStats,
  onSelectModel,
}: {
  links: Array<{ label: string; count: number; modelUsername?: string; creatorId?: string }>;
  modelStats: ModelBioStats[];
  onSelectModel: (id: string) => void;
}) {
  if (!links || links.length === 0) {
    return (
      <div className="h-[180px] flex items-center justify-center text-slate-400 text-sm">
        <div className="text-center">
          <Link2 className="w-8 h-8 mx-auto mb-2 opacity-30" />
          <p>No link clicks yet</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-2">
      {links.slice(0, 5).map((link, idx) => {
        // Try to find model by username if available
        const model = link.creatorId 
          ? modelStats.find(m => m.creatorId === link.creatorId)
          : link.modelUsername 
          ? modelStats.find(m => m.username.toLowerCase() === link.modelUsername?.toLowerCase())
          : null;
        
        return (
          <div 
            key={`${link.label}-${idx}`} 
            className="flex items-center justify-between py-2.5 px-3 rounded-lg hover:bg-slate-50 transition-colors group"
          >
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <span 
                className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                style={{ backgroundColor: COLORS[idx % COLORS.length] }}
              >
                {idx + 1}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-slate-700 truncate">{link.label}</p>
                {model && (
                  <button
                    onClick={() => onSelectModel(model.creatorId)}
                    className="text-xs text-violet-600 hover:text-violet-700 hover:underline"
                  >
                    @{model.username}
                  </button>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-slate-900">{link.count}</span>
              {model && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onSelectModel(model.creatorId)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity h-7 w-7 p-0"
                >
                  <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              )}
            </div>
          </div>
        );
      })}
    </div>
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

function StatCardSkeleton({ gradient }: { gradient: string }) {
  return (
    <div className={`rounded-2xl p-5 ${gradient} relative overflow-hidden`}>
      <div className="absolute inset-0 opacity-10">
        <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-white/20" />
      </div>
      <div className="relative flex items-start justify-between">
        <div className="space-y-2">
          <div className="h-4 w-20 bg-white/30 rounded animate-pulse" />
          <div className="h-8 w-24 bg-white/40 rounded animate-pulse" />
          <div className="h-3 w-28 bg-white/20 rounded animate-pulse mt-2" />
        </div>
        <div className="w-12 h-12 rounded-xl bg-white/20 animate-pulse" />
      </div>
    </div>
  );
}

function StatisticsPageSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <SkeletonPulse className="h-8 w-32 mb-2" />
          <SkeletonPulse className="h-4 w-56" />
        </div>
        <div className="flex items-center gap-3">
          <SkeletonPulse className="h-10 w-[200px] rounded-md" />
          <SkeletonPulse className="h-10 w-[140px] rounded-md" />
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCardSkeleton gradient="bg-gradient-to-br from-violet-500 to-purple-600" />
        <StatCardSkeleton gradient="bg-gradient-to-br from-cyan-500 to-blue-600" />
        <StatCardSkeleton gradient="bg-gradient-to-br from-emerald-500 to-green-600" />
        <StatCardSkeleton gradient="bg-gradient-to-br from-orange-500 to-amber-500" />
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-6">
        <SkeletonPulse className="h-6 w-48 mb-2" />
        <SkeletonPulse className="h-4 w-32 mb-6" />
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center gap-4 py-3">
              <SkeletonPulse className="w-8 h-8 rounded-full" />
              <SkeletonPulse className="h-4 w-24" />
              <div className="flex-1" />
              <SkeletonPulse className="h-4 w-16" />
              <SkeletonPulse className="h-4 w-16" />
              <SkeletonPulse className="h-2 w-32 rounded-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================================
// EMPTY STATE COMPONENT
// ============================================

function EmptyState({ 
  title, 
  description, 
  icon: Icon = BarChart3 
}: { 
  title: string; 
  description: string; 
  icon?: React.ComponentType<{ className?: string }>;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
        <Icon className="w-8 h-8 text-slate-400" />
      </div>
      <h3 className="text-lg font-semibold text-slate-900 mb-2">{title}</h3>
      <p className="text-slate-500 max-w-md">{description}</p>
    </div>
  );
}

// ============================================
// MAIN PAGE
// ============================================

export default function StatisticsPage() {
  const { user, apiKey, creator } = useDashboard();
  const { globalCounts, creatorMediaCounts } = useMediaState();
  const searchParams = useSearchParams();
  const router = useRouter();
  const creatorParam = searchParams.get("creator");
  
  const [mediaStats, setMediaStats] = useState<CreatorStats | PlatformOverview | null>(null);
  const [bioAnalytics, setBioAnalytics] = useState<BioAnalytics | null>(null);
  const [aggregatedBioStats, setAggregatedBioStats] = useState<AggregatedBioStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [period, setPeriod] = useState<"7d" | "30d" | "90d">("30d");
  const [models, setModels] = useState<ModelOption[]>([]);
  const [selectedModelId, setSelectedModelId] = useState<string | null>(creatorParam);
  const [initialized, setInitialized] = useState(false);
  const [realtimeVisitors, setRealtimeVisitors] = useState<RealtimeVisitor[]>([]);
  const [bioLinkIds, setBioLinkIds] = useState<string[]>([]);
  const channelRef = useRef<ReturnType<typeof getSupabaseBrowserClient>["channel"] | null>(null);
  const prevSelectedModelRef = useRef<string | null>(null);

  const isAdminOrBusiness = user?.role === "admin" || user?.role === "business";
  
  // Handle model selection - update URL for deep linking
  const handleSelectModel = useCallback((modelId: string | null) => {
    setSelectedModelId(modelId);
    if (modelId) {
      router.push(`/dashboard/statistics?creator=${modelId}`, { scroll: false });
    } else {
      router.push('/dashboard/statistics', { scroll: false });
    }
  }, [router]);
  
  useEffect(() => {
    if (!initialized && creatorParam) {
      setSelectedModelId(creatorParam);
      setInitialized(true);
    }
  }, [creatorParam, initialized]);

  useEffect(() => {
    if (!isAdminOrBusiness) return;

    const fetchModels = async () => {
      const supabase = getSupabaseBrowserClient();
      let query = supabase.from("creators").select("id, username").eq("enabled", true);
      
      if (user?.role === "business" && user?.studio_id) {
        query = query.eq("studio_id", user.studio_id);
      }
      
      const { data } = await query.order("username");
      if (data && data.length > 0) {
        setModels(data);
      }
    };

    fetchModels();
  }, [isAdminOrBusiness, user]);

  const bioLinkIdsKey = bioLinkIds.sort().join(",");
  
  useEffect(() => {
    const supabase = getSupabaseBrowserClient();
    
    const modelChanged = prevSelectedModelRef.current !== selectedModelId;
    if (modelChanged) {
      prevSelectedModelRef.current = selectedModelId;
      setRealtimeVisitors([]);
      
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    }

    if (bioLinkIds.length === 0) return;
    if (channelRef.current && !modelChanged) return;

    const channelName = `bio_views_${bioLinkIdsKey.slice(0, 50)}_${Date.now()}`;
    const isSingleBioLink = bioLinkIds.length === 1;
    
    const channel = supabase
      .channel(channelName)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "bio_page_views",
          ...(isSingleBioLink ? { filter: `bio_link_id=eq.${bioLinkIds[0]}` } : {}),
        },
        (payload: { new: { id?: string; country?: string; bio_link_id?: string } }) => {
          const newView = payload.new;
          
          if (!isSingleBioLink && newView.bio_link_id && !bioLinkIds.includes(newView.bio_link_id)) {
            return;
          }
          
          const country = newView.country || "Unknown";
          const coords = getCountryCoordinates(country);
          
          const visitor: RealtimeVisitor = {
            id: newView.id || `${Date.now()}-${Math.random()}`,
            lat: coords.lat,
            lng: coords.lng,
            country,
            timestamp: Date.now(),
          };
          
          setRealtimeVisitors((prev) => {
            const updated = [...prev, visitor].slice(-20);
            return updated;
          });
        }
      )
      .subscribe();

    channelRef.current = channel;

    return () => {};
  }, [bioLinkIdsKey, selectedModelId]);
  
  useEffect(() => {
    return () => {
      const supabase = getSupabaseBrowserClient();
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      setRealtimeVisitors((prev) => 
        prev.filter((v) => now - v.timestamp < 60000)
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const hasLoadedOnce = useRef(false);
  
  useEffect(() => {
    fetchAllData(!hasLoadedOnce.current);
    hasLoadedOnce.current = true;
  }, [apiKey, user, period, selectedModelId]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchAllData = async (isInitialLoad = false) => {
    if (isInitialLoad) {
      setIsLoading(true);
    } else {
      setIsRefreshing(true);
    }
    
    const api = apiKey ? createApiClient(apiKey) : null;
    const supabase = getSupabaseBrowserClient();
    const promises: Promise<void>[] = [];

    let targetCreatorId: string | null = null;
    
    if (user?.role === "independent") {
      targetCreatorId = user?.creator_id || null;
    } else if (isAdminOrBusiness && selectedModelId) {
      targetCreatorId = selectedModelId;
    }

    if (api) {
      const mediaPromise = (async () => {
        try {
          if (targetCreatorId) {
            const response = await api.getCreatorStats(targetCreatorId, 12);
            if (response.success && response.data) {
              setMediaStats(response.data);
            }
          } else if (isAdminOrBusiness) {
            const response = await api.getPlatformOverview();
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

    if (targetCreatorId) {
      setAggregatedBioStats(null);
      
      const bioPromise = (async () => {
        try {
          const { data: bioLink } = await supabase
            .from("bio_links")
            .select("id")
            .eq("creator_id", targetCreatorId)
            .maybeSingle();

          if (bioLink?.id) {
            setBioLinkIds([bioLink.id]);
            const response = await fetch(`/api/analytics/bio/${bioLink.id}?period=${period}`);
            if (response.ok) {
              const data = await response.json();
              setBioAnalytics(data);
            } else {
              setBioAnalytics(null);
            }
          } else {
            setBioLinkIds([]);
            setBioAnalytics(null);
          }
        } catch (err) {
          console.error("Error fetching bio analytics:", err);
        }
      })();
      promises.push(bioPromise);
    } else if (isAdminOrBusiness) {
      setBioAnalytics(null);
      
      const aggPromise = (async () => {
        try {
          let bioLinksQuery = supabase.from("bio_links").select("id, creator_id");
          
          if (user?.role === "business" && user?.studio_id) {
            const { data: studioCreators } = await supabase
              .from("creators")
              .select("id")
              .eq("studio_id", user.studio_id)
              .eq("enabled", true);
            
            if (studioCreators && studioCreators.length > 0) {
              const creatorIds = studioCreators.map((c: { id: string }) => c.id);
              bioLinksQuery = bioLinksQuery.in("creator_id", creatorIds);
            }
          }
          
          const { data: allBioLinks } = await bioLinksQuery;
          if (allBioLinks && allBioLinks.length > 0) {
            setBioLinkIds(allBioLinks.map((b: { id: string }) => b.id));
          } else {
            setBioLinkIds([]);
          }
        } catch (err) {
          console.error("Error fetching bio links:", err);
        }
      })();
      
      const modelsPromise = (async () => {
        try {
          const aggResponse = await fetch(`/api/analytics/bio/models?period=${period}`);
          if (aggResponse.ok) {
            const aggData = await aggResponse.json();
            setAggregatedBioStats(aggData);
          } else {
            setAggregatedBioStats(null);
          }
        } catch (err) {
          console.error("Error fetching aggregated stats:", err);
        }
      })();
      
      promises.push(aggPromise, modelsPromise);
    }
    
    await Promise.all(promises);
    setIsLoading(false);
    setIsRefreshing(false);
  };

  const isCreatorStats = (s: CreatorStats | PlatformOverview): s is CreatorStats => {
    return "creator" in s;
  };

  const viewsByDaySource = bioAnalytics?.viewsByDay || aggregatedBioStats?.viewsByDay;
  const clicksByDaySource = bioAnalytics?.clicksByDay || aggregatedBioStats?.clicksByDay;
  
  const trafficChartData = (() => {
    if (!viewsByDaySource) return [];
    
    const allDates = new Set([
      ...Object.keys(viewsByDaySource),
      ...Object.keys(clicksByDaySource || {}),
    ]);
    
    return Array.from(allDates)
      .sort((a, b) => new Date(a).getTime() - new Date(b).getTime())
      .map((date) => ({
        date: new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        fullDate: date,
        views: viewsByDaySource[date] || 0,
        clicks: clicksByDaySource?.[date] || 0,
      }))
      .slice(-14);
  })();

  const viewsByCountrySource = bioAnalytics?.viewsByCountry || aggregatedBioStats?.viewsByCountry;
  const countryData = viewsByCountrySource
    ? Object.entries(viewsByCountrySource)
        .map(([country, count]) => ({ country, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 6)
    : [];

  const viewsByDeviceSource = bioAnalytics?.viewsByDevice || aggregatedBioStats?.viewsByDevice;
  const deviceData = viewsByDeviceSource
    ? Object.entries(viewsByDeviceSource)
        .map(([device, count]) => ({ device: device.charAt(0).toUpperCase() + device.slice(1), count }))
    : [];

  const referrersSource = bioAnalytics?.topReferrers || aggregatedBioStats?.topReferrers;
  const filteredReferrers = useMemo(() => {
    if (!referrersSource) return [];
    
    return referrersSource
      .filter((ref) => {
        if (!ref.referrer) return true;
        const domain = ref.referrer.toLowerCase();
        return !SELF_REFERRER_DOMAINS.some((self) => domain.includes(self));
      })
      .slice(0, 4);
  }, [referrersSource]);
  
  const topLinksSource = bioAnalytics?.topLinks || aggregatedBioStats?.topLinks;

  const totalViews = bioAnalytics?.summary.totalViews || aggregatedBioStats?.totalViews || 0;

  if (isLoading) {
    return <StatisticsPageSkeleton />;
  }

  const selectedModel = models.find(m => m.id === selectedModelId);
  const displayName = selectedModel?.username || null;
  
  // Check if we have any data at all
  const hasNoData = !bioAnalytics && (!aggregatedBioStats || (aggregatedBioStats.totalViews === 0 && aggregatedBioStats.modelStats.length === 0));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            Analytics
            {isRefreshing && (
              <Loader2 className="w-4 h-4 animate-spin text-slate-400" />
            )}
          </h1>
          <p className="text-slate-500">
            {selectedModelId && displayName
              ? `Performance for @${displayName}`
              : isAdminOrBusiness
              ? "Platform overview & performance metrics"
              : "Track your bio link performance"}
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          {isAdminOrBusiness && models.length > 0 && (
            <ModelSelector
              models={models}
              selectedId={selectedModelId}
              onSelect={handleSelectModel}
            />
          )}
          
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

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Page Views"
          value={bioAnalytics?.summary.totalViews || aggregatedBioStats?.totalViews || 0}
          change={bioAnalytics?.changes?.views.value}
          changeType={bioAnalytics?.changes?.views.type}
          icon={Eye}
          gradient="bg-gradient-to-br from-violet-500 to-purple-600"
        />
        <StatCard
          label="Unique Visitors"
          value={bioAnalytics?.summary.uniqueVisitors || aggregatedBioStats?.totalUniqueVisitors || 0}
          change={bioAnalytics?.changes?.visitors.value}
          changeType={bioAnalytics?.changes?.visitors.type}
          icon={Users}
          gradient="bg-gradient-to-br from-cyan-500 to-blue-600"
        />
        <StatCard
          label="Link Clicks"
          value={bioAnalytics?.summary.totalClicks || aggregatedBioStats?.totalClicks || 0}
          change={bioAnalytics?.changes?.clicks.value}
          changeType={bioAnalytics?.changes?.clicks.type}
          icon={MousePointerClick}
          gradient="bg-gradient-to-br from-emerald-500 to-green-600"
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
          gradient="bg-gradient-to-br from-orange-500 to-amber-500"
        />
      </div>

      {/* Empty State for No Data */}
      {hasNoData && isAdminOrBusiness && !selectedModelId && (
        <div className="bg-white rounded-2xl border border-slate-200 p-8">
          <EmptyState
            title="No analytics data yet"
            description="Once your models' bio links start receiving traffic, you'll see performance metrics here. Share bio links to start tracking!"
            icon={BarChart3}
          />
        </div>
      )}

      {/* Model Bio Stats Table for Admin/Business - SCALABLE VERSION */}
      {isAdminOrBusiness && !selectedModelId && aggregatedBioStats && aggregatedBioStats.modelStats.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <SectionHeader 
            title="Model Performance" 
            subtitle={`${aggregatedBioStats.modelStats.length} models with bio links`}
          />
          
          <ModelPerformanceTable
            modelStats={aggregatedBioStats.modelStats}
            onSelectModel={handleSelectModel}
          />
        </div>
      )}

      {/* Main Grid with Globe and Chart */}
      {(trafficChartData.length > 0 || !hasNoData) && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Traffic Chart */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6">
            <SectionHeader 
              title="Traffic Over Time" 
              subtitle="Daily page views & clicks"
            />
            
            {trafficChartData.length > 0 ? (
              <ChartContainer config={chartConfig} className="h-[300px] w-full">
                <AreaChart data={trafficChartData} margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
                  <defs>
                    <linearGradient id="viewsGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="clicksGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
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
                    name="Views"
                  />
                  <Area
                    type="monotone"
                    dataKey="clicks"
                    stroke="#10b981"
                    strokeWidth={2}
                    fill="url(#clicksGradient)"
                    name="Clicks"
                  />
                </AreaChart>
              </ChartContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-slate-400">
                <div className="text-center">
                  <BarChart3 className="w-12 h-12 mx-auto mb-2 opacity-30" />
                  <p>No traffic data yet</p>
                  <p className="text-sm mt-1">Share your bio link to start tracking!</p>
                </div>
              </div>
            )}
          </div>

          {/* Realtime Globe */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 overflow-hidden">
            <SectionHeader 
              title="Live Traffic" 
              subtitle="Real-time visitor activity"
            />
            
            <RealtimeGlobe
              realtimeVisitors={realtimeVisitors}
              className="w-full max-w-[280px] mx-auto"
            />
            
            <div className="mt-4 pt-4 border-t border-slate-100">
              <h4 className="text-sm font-medium text-slate-700 mb-3 flex items-center gap-2">
                <Activity className="w-4 h-4 text-violet-500" />
                Recent Activity
              </h4>
              <RealtimeActivityFeed visitors={realtimeVisitors} />
            </div>
          </div>
        </div>
      )}

      {/* Second Row */}
      {(countryData.length > 0 || deviceData.length > 0 || (topLinksSource && topLinksSource.length > 0)) && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Top Countries Full List */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6">
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
              <div className="h-[180px] flex items-center justify-center text-slate-400 text-sm">
                No country data yet
              </div>
            )}
          </div>

          {/* Device Breakdown */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <SectionHeader title="Devices" subtitle="Visitor breakdown" />
            
            {deviceData.length > 0 ? (
              <div className="space-y-4">
                {deviceData.map((item, idx) => {
                  const Icon = item.device === "Mobile" ? Smartphone : item.device === "Desktop" ? Monitor : Tablet;
                  const total = deviceData.reduce((sum, d) => sum + d.count, 0);
                  const percentage = total > 0 ? Math.round((item.count / total) * 100) : 0;
                  
                  return (
                    <div key={item.device} className="flex items-center gap-3">
                      <div 
                        className="w-10 h-10 rounded-xl flex items-center justify-center"
                        style={{ backgroundColor: `${COLORS[idx]}15` }}
                      >
                        <Icon className="w-5 h-5" style={{ color: COLORS[idx] }} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium text-slate-700">{item.device}</span>
                          <span className="text-sm font-semibold text-slate-900">{percentage}%</span>
                        </div>
                        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${percentage}%` }}
                            transition={{ duration: 0.5 }}
                            className="h-full rounded-full"
                            style={{ backgroundColor: COLORS[idx] }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="h-[180px] flex items-center justify-center text-slate-400 text-sm">
                No device data yet
              </div>
            )}
          </div>

          {/* Top Links - WITH MODEL INFO */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <SectionHeader title="Top Links" subtitle="Most clicked" />
            
            <TopLinksTable
              links={topLinksSource || []}
              modelStats={aggregatedBioStats?.modelStats || []}
              onSelectModel={handleSelectModel}
            />
          </div>
        </div>
      )}

      {/* Top Referrers with Favicons */}
      {filteredReferrers.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <SectionHeader title="Top Referrers" subtitle="External traffic sources" />
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {filteredReferrers.map((ref, idx) => (
              <ReferrerCard
                key={ref.referrer || "direct"}
                referrer={ref.referrer || "Direct"}
                count={ref.count}
                color={COLORS[idx % COLORS.length]}
              />
            ))}
          </div>
        </div>
      )}

      {/* Content Stats - Use shared counts for real-time accuracy */}
      {(selectedModelId || user?.role === "independent") && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <SectionHeader title="Content Library" subtitle="Media counts (live)" />
          
          {(() => {
            const targetCreatorId = selectedModelId || user?.creator_id;
            const counts = targetCreatorId && creatorMediaCounts[targetCreatorId]
              ? creatorMediaCounts[targetCreatorId]
              : globalCounts;
            
            return (
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-gradient-to-br from-violet-50 to-purple-50 rounded-xl p-5 text-center border border-violet-100">
                  <ImageIcon className="w-8 h-8 text-violet-600 mx-auto mb-2" />
                  <p className="text-3xl font-bold text-violet-900">{counts.image}</p>
                  <p className="text-sm text-violet-600 font-medium">Photos</p>
                </div>
                <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-5 text-center border border-amber-100">
                  <Video className="w-8 h-8 text-amber-600 mx-auto mb-2" />
                  <p className="text-3xl font-bold text-amber-900">{counts.video}</p>
                  <p className="text-sm text-amber-600 font-medium">Videos</p>
                </div>
                <div className="bg-gradient-to-br from-rose-50 to-pink-50 rounded-xl p-5 text-center border border-rose-100">
                  <Music className="w-8 h-8 text-rose-600 mx-auto mb-2" />
                  <p className="text-3xl font-bold text-rose-900">{counts.audio}</p>
                  <p className="text-sm text-rose-600 font-medium">Audio</p>
                </div>
                <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-xl p-5 text-center border border-cyan-100">
                  <FileText className="w-8 h-8 text-cyan-600 mx-auto mb-2" />
                  <p className="text-3xl font-bold text-cyan-900">{counts.total}</p>
                  <p className="text-sm text-cyan-600 font-medium">Total</p>
                </div>
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
}
