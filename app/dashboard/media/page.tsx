"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { useDashboard } from "../layout";
import { createApiClient, type Media, type MediaCategory, type Creator } from "@/lib/media-api";
import MediaViewer from "@/components/media/MediaViewer";
import { LabelManager, LabelBadge } from "@/components/media/LabelManager";
import {
  Image as ImageIcon,
  Video,
  Music,
  Search,
  Filter,
  Grid,
  List,
  Trash2,
  Download,
  Eye,
  X,
  Loader2,
  AlertCircle,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  Calendar,
  FileType,
  FolderOpen,
  FolderClosed,
  RefreshCw,
  CheckSquare,
  Square,
  MoreVertical,
  Copy,
  Users,
  LayoutGrid,
  Layers,
  ArrowLeft,
  Home,
  Upload,
  Plus,
  CloudUpload,
  CheckCircle,
  XCircle,
  File,
  Info,
  Check,
  SlidersHorizontal,
  Sparkles,
  Link2,
  ExternalLink,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogBody,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  VisuallyHidden,
} from "@/components/ui/dialog-centered";

// ============================================
// TYPES
// ============================================

type ViewMode = "grid" | "list" | "folders";
type MediaTypeFilter = "all" | "image" | "video" | "audio";

interface FilterState {
  types: Set<MediaTypeFilter>;
  categories: Set<string>;
  dateFrom: string;
  dateTo: string;
}

interface MediaCounts {
  image: number;
  video: number;
  audio: number;
  total: number;
}

interface CreatorMediaCounts {
  [creatorId: string]: MediaCounts;
}

interface FolderItem {
  id: string;
  name: string;
  type: "creator" | "category" | "month";
  count: number;
  photoCount: number;
  videoCount: number;
  audioCount: number;
  thumbnail?: string;
  creator?: Creator;
}

// Category icons mapping
const CATEGORY_ICONS: Record<string, { icon: React.ComponentType<{ className?: string }>; color: string; bg: string }> = {
  "Lingerie": { icon: () => <span className="text-lg">👙</span>, color: "text-pink-600", bg: "bg-pink-100" },
  "Bikini": { icon: () => <span className="text-lg">👙</span>, color: "text-cyan-600", bg: "bg-cyan-100" },
  "Nude": { icon: () => <span className="text-lg">🔥</span>, color: "text-red-600", bg: "bg-red-100" },
  "Feet": { icon: () => <span className="text-lg">🦶</span>, color: "text-amber-600", bg: "bg-amber-100" },
  "Casual": { icon: () => <span className="text-lg">👕</span>, color: "text-blue-600", bg: "bg-blue-100" },
  "Cosplay": { icon: () => <span className="text-lg">🎭</span>, color: "text-purple-600", bg: "bg-purple-100" },
  "Fitness": { icon: () => <span className="text-lg">💪</span>, color: "text-green-600", bg: "bg-green-100" },
  "Outdoor": { icon: () => <span className="text-lg">🌳</span>, color: "text-emerald-600", bg: "bg-emerald-100" },
  "Indoor": { icon: () => <span className="text-lg">🏠</span>, color: "text-slate-600", bg: "bg-slate-100" },
  "Professional": { icon: () => <span className="text-lg">📸</span>, color: "text-indigo-600", bg: "bg-indigo-100" },
  "Selfie": { icon: () => <span className="text-lg">🤳</span>, color: "text-rose-600", bg: "bg-rose-100" },
  "PPV": { icon: () => <span className="text-lg">💎</span>, color: "text-violet-600", bg: "bg-violet-100" },
  "default": { icon: FolderClosed, color: "text-slate-600", bg: "bg-slate-100" },
};

// ============================================
// SKELETON COMPONENTS
// ============================================

function MediaSkeleton({ viewMode }: { viewMode: "grid" | "list" | "folders" }) {
  if (viewMode === "list") {
    return (
      <div className="space-y-3">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl border border-slate-200 p-4 flex items-center gap-4 animate-pulse">
            <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-slate-200 to-slate-100" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-slate-200 rounded w-1/3" />
              <div className="h-3 bg-slate-100 rounded w-1/2" />
            </div>
            <div className="h-3 bg-slate-100 rounded w-20" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
      {[...Array(18)].map((_, i) => (
        <div key={i} className="aspect-square bg-white rounded-xl border border-slate-200 overflow-hidden animate-pulse">
          <div className="w-full h-full bg-gradient-to-br from-slate-200 via-slate-100 to-slate-200 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent skeleton-shimmer" />
          </div>
        </div>
      ))}
    </div>
  );
}

function FolderSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {[...Array(8)].map((_, i) => (
        <div key={i} className="bg-white rounded-xl border border-slate-200 p-5 animate-pulse">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-violet-100 to-purple-100" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-slate-200 rounded w-2/3" />
              <div className="flex gap-4">
                <div className="h-3 bg-slate-100 rounded w-16" />
                <div className="h-3 bg-slate-100 rounded w-16" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ============================================
// INFINITE SCROLL TRIGGER
// ============================================

function InfiniteScrollTrigger({
  onTrigger,
  isLoading,
  hasMore,
}: {
  onTrigger: () => void;
  isLoading: boolean;
  hasMore: boolean;
}) {
  const triggerRef = useRef<HTMLDivElement>(null);
  const hasTriggeredRef = useRef(false);

  useEffect(() => {
    // Reset trigger flag when loading completes
    if (!isLoading) {
      hasTriggeredRef.current = false;
    }
  }, [isLoading]);

  useEffect(() => {
    if (!triggerRef.current || isLoading || !hasMore) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasTriggeredRef.current && !isLoading) {
          hasTriggeredRef.current = true;
          onTrigger();
        }
      },
      { rootMargin: "400px", threshold: 0 }
    );

    observer.observe(triggerRef.current);
    return () => observer.disconnect();
  }, [onTrigger, isLoading, hasMore]);

  if (!hasMore) return null;

  return (
    <div ref={triggerRef} className="flex justify-center py-8">
      {isLoading ? (
        <div className="flex items-center gap-2 text-slate-500">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>Loading more...</span>
        </div>
      ) : (
        <div className="h-1" />
      )}
    </div>
  );
}

// ============================================
// LAZY IMAGE COMPONENT
// ============================================

function LazyImage({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const imgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!imgRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: "100px" }
    );

    observer.observe(imgRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={imgRef} className={className}>
      {isInView ? (
        <>
          {!isLoaded && (
            <div className="absolute inset-0 bg-slate-200 animate-pulse" />
          )}
          <img
            src={src}
            alt={alt}
            className={`w-full h-full object-cover transition-opacity duration-300 ${
              isLoaded ? "opacity-100" : "opacity-0"
            }`}
            onLoad={() => setIsLoaded(true)}
          />
        </>
      ) : (
        <div className="w-full h-full bg-slate-200 animate-pulse" />
      )}
    </div>
  );
}

// ============================================
// FOLDER CARD COMPONENT
// ============================================

function FolderCard({
  folder,
  onClick,
}: {
  folder: FolderItem;
  onClick: () => void;
}) {
  const totalCount = folder.photoCount + folder.videoCount + folder.audioCount;
  const hasContent = totalCount > 0;

  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      onClick={onClick}
      className="group bg-white rounded-xl border border-slate-200 p-4 hover:shadow-lg hover:border-brand-300 transition-all text-left w-full"
    >
      <div className="flex items-start gap-4">
        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-amber-100 to-amber-50 flex items-center justify-center shrink-0 group-hover:from-brand-100 group-hover:to-brand-50 transition-all overflow-hidden">
          {folder.thumbnail ? (
            <img
              src={folder.thumbnail}
              alt={folder.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <FolderClosed className="w-7 h-7 text-amber-500 group-hover:text-brand-500 transition-colors" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-slate-900 truncate group-hover:text-brand-600 transition-colors">
            {folder.name}
          </p>
          
          {/* Media type counts */}
          <div className="flex items-center gap-3 mt-1.5">
            {folder.photoCount > 0 && (
              <span className="inline-flex items-center gap-1 text-xs text-blue-600">
                <ImageIcon className="w-3.5 h-3.5" />
                {folder.photoCount}
              </span>
            )}
            {folder.videoCount > 0 && (
              <span className="inline-flex items-center gap-1 text-xs text-purple-600">
                <Video className="w-3.5 h-3.5" />
                {folder.videoCount}
              </span>
            )}
            {folder.audioCount > 0 && (
              <span className="inline-flex items-center gap-1 text-xs text-orange-600">
                <Music className="w-3.5 h-3.5" />
                {folder.audioCount}
              </span>
            )}
            {!hasContent && (
              <span className="text-xs text-slate-400">No media</span>
            )}
          </div>

          {folder.type === "creator" && (
            <span className="inline-flex items-center gap-1 mt-2 px-2 py-0.5 bg-slate-100 rounded-full text-xs text-slate-600">
              <Users className="w-3 h-3" />
              Model
            </span>
          )}
        </div>
        <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-slate-500 group-hover:translate-x-1 transition-all shrink-0" />
      </div>
    </motion.button>
  );
}

// ============================================
// LABEL SIDEBAR COMPONENT (Vertical scrollable with sorting)
// ============================================

function LabelSidebar({
  categories,
  selectedCategories,
  onToggle,
}: {
  categories: MediaCategory[];
  selectedCategories: Set<string>;
  onToggle: (category: string) => void;
}) {
  if (categories.length === 0) return null;

  // Sort by count descending
  const sortedCategories = [...categories].sort((a, b) => b.count - a.count);

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      <div className="p-3 border-b border-slate-100 bg-slate-50">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-slate-500" />
          <span className="text-sm font-semibold text-slate-700">Labels</span>
          {selectedCategories.size > 0 && (
            <span className="text-xs bg-brand-100 text-brand-700 px-2 py-0.5 rounded-full ml-auto">
              {selectedCategories.size}
            </span>
          )}
        </div>
      </div>
      <div className="max-h-[400px] overflow-y-auto">
        {sortedCategories.map((cat) => {
          const isSelected = selectedCategories.has(cat.name);
          const iconConfig = CATEGORY_ICONS[cat.name] || CATEGORY_ICONS["default"];
          const IconComponent = iconConfig.icon;

          return (
            <button
              key={cat.name}
              onClick={() => onToggle(cat.name)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 text-left transition-all border-l-2 ${
                isSelected
                  ? "bg-brand-50 border-l-brand-500 text-brand-700"
                  : "border-l-transparent hover:bg-slate-50 text-slate-700"
              }`}
            >
              <span className={`w-8 h-8 rounded-lg flex items-center justify-center ${isSelected ? "bg-brand-100" : iconConfig.bg}`}>
                <IconComponent className="w-4 h-4" />
              </span>
              <span className="flex-1 text-sm font-medium truncate">{cat.name}</span>
              <span className={`text-xs px-2 py-1 rounded-full ${
                isSelected ? "bg-brand-200 text-brand-800" : "bg-slate-100 text-slate-600"
              }`}>
                {cat.count}
              </span>
              {isSelected && (
                <Check className="w-4 h-4 text-brand-500 shrink-0" />
              )}
            </button>
          );
        })}
      </div>
      {selectedCategories.size > 0 && (
        <div className="p-2 border-t border-slate-100">
          <button
            onClick={() => {
              // Clear all selected categories
              selectedCategories.forEach(cat => onToggle(cat));
            }}
            className="w-full text-xs text-slate-500 hover:text-slate-700 py-1.5 rounded hover:bg-slate-50 transition-colors"
          >
            Clear all labels
          </button>
        </div>
      )}
    </div>
  );
}

// ============================================
// CATEGORY BADGE COMPONENT (with Label Manager)
// ============================================

function CategoryBadge({
  category,
  mediaId,
  storageUrl,
  onUpdate,
}: {
  category: string | null;
  mediaId: string;
  storageUrl?: string;
  onUpdate?: (newCategory: string) => void;
}) {
  const [showLabelManager, setShowLabelManager] = useState(false);
  
  const iconConfig = CATEGORY_ICONS[category || ""] || CATEGORY_ICONS["default"];
  const IconComponent = iconConfig.icon;

  const currentLabels = category ? [category] : [];

  const handleLabelsChange = (labels: string[]) => {
    const primaryLabel = labels[0] || "";
    if (onUpdate && primaryLabel !== category) {
      onUpdate(primaryLabel);
    }
  };

  return (
    <>
      <button
        onClick={() => setShowLabelManager(true)}
        className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs font-medium transition-all hover:scale-105 hover:shadow-sm cursor-pointer ${iconConfig.bg} ${iconConfig.color}`}
        title="Click to manage labels"
      >
        <IconComponent className="w-3 h-3" />
        <span>{category || "Add label"}</span>
      </button>

      <LabelManager
        open={showLabelManager}
        onOpenChange={setShowLabelManager}
        mediaId={mediaId}
        currentLabels={currentLabels}
        storageUrl={storageUrl}
        onLabelsChange={handleLabelsChange}
      />
    </>
  );
}

// ============================================
// MEDIA TYPE FILTER (Icon buttons)
// ============================================

type ActualMediaType = "image" | "video" | "audio";

function MediaTypeFilter({
  selectedTypes,
  onToggle,
  counts,
}: {
  selectedTypes: Set<MediaTypeFilter>;
  onToggle: (type: MediaTypeFilter) => void;
  counts: { image: number; video: number; audio: number };
}) {
  const types: { type: ActualMediaType; icon: typeof ImageIcon; label: string; color: string; activeColor: string }[] = [
    { type: "image", icon: ImageIcon, label: "Photos", color: "text-blue-500 bg-blue-50 hover:bg-blue-100", activeColor: "bg-blue-500 text-white" },
    { type: "video", icon: Video, label: "Videos", color: "text-purple-500 bg-purple-50 hover:bg-purple-100", activeColor: "bg-purple-500 text-white" },
    { type: "audio", icon: Music, label: "Audio", color: "text-orange-500 bg-orange-50 hover:bg-orange-100", activeColor: "bg-orange-500 text-white" },
  ];

  return (
    <div className="flex items-center gap-2">
      {types.map(({ type, icon: Icon, label, color, activeColor }) => {
        const isSelected = selectedTypes.has(type) || selectedTypes.size === 0;
        const count = counts[type];

        return (
          <button
            key={type}
            onClick={() => onToggle(type)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all ${
              isSelected ? activeColor + " shadow-md" : color
            }`}
          >
            <Icon className="w-5 h-5" />
            <span className="hidden sm:inline">{label}</span>
            <span className={`text-xs px-1.5 py-0.5 rounded-full ${
              isSelected ? "bg-white/20" : "bg-black/10"
            }`}>
              {count}
            </span>
          </button>
        );
      })}
    </div>
  );
}

// ============================================
// BREADCRUMB COMPONENT
// ============================================

function Breadcrumb({
  path,
  onNavigate,
}: {
  path: { id: string; name: string }[];
  onNavigate: (index: number) => void;
}) {
  return (
    <div className="flex items-center gap-1 text-sm overflow-x-auto pb-2">
      <button
        onClick={() => onNavigate(-1)}
        className="flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-colors shrink-0"
      >
        <Home className="w-4 h-4" />
        <span>All</span>
      </button>
      {path.map((item, index) => (
        <div key={item.id} className="flex items-center shrink-0">
          <ChevronRight className="w-4 h-4 text-slate-300" />
          <button
            onClick={() => onNavigate(index)}
            className={`px-2 py-1 rounded-lg transition-colors ${
              index === path.length - 1
                ? "bg-brand-100 text-brand-700 font-medium"
                : "hover:bg-slate-100 text-slate-600 hover:text-slate-900"
            }`}
          >
            {item.name}
          </button>
        </div>
      ))}
    </div>
  );
}

// ============================================
// MEDIA CARD COMPONENT
// ============================================

function MediaCard({
  media,
  isSelected,
  onSelect,
  onView,
  onDelete,
  onCopy,
  onCopyPermalink,
  onCategoryUpdate,
  viewMode,
  apiKey,
}: {
  media: Media;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onView: (media: Media) => void;
  onDelete: (id: string) => void;
  onCopy: (media: Media) => void;
  onCopyPermalink: (id: string) => void;
  onCategoryUpdate: (mediaId: string, newCategory: string) => void;
  viewMode: ViewMode;
  apiKey: string;
}) {
  const getTypeIcon = () => {
    switch (media.media_type) {
      case "image":
        return ImageIcon;
      case "video":
        return Video;
      case "audio":
        return Music;
      default:
        return FileType;
    }
  };

  const TypeIcon = getTypeIcon();

  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return "—";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  if (viewMode === "list") {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={`flex items-center gap-4 p-4 bg-white rounded-lg border ${
          isSelected ? "border-brand-500 bg-brand-50" : "border-slate-200"
        } hover:shadow-sm transition-all`}
      >
        <button onClick={() => onSelect(media.id)} className="shrink-0">
          {isSelected ? (
            <CheckSquare className="w-5 h-5 text-brand-600" />
          ) : (
            <Square className="w-5 h-5 text-slate-400" />
          )}
        </button>

        <div
          className="w-16 h-16 rounded-lg bg-slate-100 overflow-hidden shrink-0 cursor-pointer relative"
          onClick={() => onView(media)}
        >
          {media.media_type === "image" ? (
            <LazyImage
              src={media.storage_url}
              alt={media.file_name}
              className="w-full h-full relative"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <TypeIcon className="w-6 h-6 text-slate-400" />
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <p className="font-medium text-slate-900 truncate">{media.category || "Uncategorized"}</p>
          <p className="text-sm text-slate-500">
            {formatFileSize(media.file_size_bytes)} • {format(new Date(media.created_at), "MMM d")}
          </p>
          {media.creator && (
            <p className="text-xs text-slate-400">by @{media.creator.username}</p>
          )}
        </div>

        <p className="text-sm text-slate-500 hidden sm:block">
          {format(new Date(media.created_at), "MMM d, yyyy")}
        </p>

        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" onClick={() => onView(media)} title="View">
            <Eye className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => onCopyPermalink(media.id)} title="Copy permalink">
            <Link2 className="w-4 h-4" />
          </Button>
          {media.media_type === "image" && (
            <Button variant="ghost" size="sm" onClick={() => onCopy(media)} title="Copy image">
              <Copy className="w-4 h-4" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => window.open(media.storage_url, "_blank")}
            title="Download"
          >
            <Download className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(media.id)}
            className="text-red-500 hover:text-red-700 hover:bg-red-50"
            title="Delete"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`group relative bg-white rounded-xl border ${
        isSelected ? "border-brand-500 ring-2 ring-brand-200" : "border-slate-200"
      } overflow-hidden hover:shadow-lg transition-all`}
    >
      {/* Selection checkbox */}
      <button
        onClick={() => onSelect(media.id)}
        className="absolute top-2 left-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity"
      >
        {isSelected ? (
          <CheckSquare className="w-5 h-5 text-brand-600 bg-white rounded" />
        ) : (
          <Square className="w-5 h-5 text-white drop-shadow-lg" />
        )}
      </button>

      {/* Media preview */}
      <div
        className="aspect-square bg-slate-100 overflow-hidden cursor-pointer relative"
        onClick={() => onView(media)}
      >
        {media.media_type === "image" ? (
          <LazyImage
            src={media.storage_url}
            alt={media.file_name}
            className="w-full h-full relative transition-transform group-hover:scale-105"
          />
        ) : media.media_type === "video" ? (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-100 to-purple-50">
            <Video className="w-12 h-12 text-purple-400" />
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-orange-100 to-orange-50">
            <Music className="w-12 h-12 text-orange-400" />
          </div>
        )}

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
          <div className="flex items-center gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onView(media);
              }}
              className="p-2 bg-white rounded-full shadow-lg hover:bg-slate-100 transition-colors"
              title="View"
            >
              <Eye className="w-4 h-4" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onCopyPermalink(media.id);
              }}
              className="p-2 bg-white rounded-full shadow-lg hover:bg-slate-100 transition-colors"
              title="Copy permalink"
            >
              <Link2 className="w-4 h-4" />
            </button>
            {media.media_type === "image" && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onCopy(media);
                }}
                className="p-2 bg-white rounded-full shadow-lg hover:bg-slate-100 transition-colors"
                title="Copy image"
              >
                <Copy className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={(e) => {
                e.stopPropagation();
                window.open(media.storage_url, "_blank");
              }}
              className="p-2 bg-white rounded-full shadow-lg hover:bg-slate-100 transition-colors"
              title="Download"
            >
              <Download className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="p-2.5">
        <div className="flex items-center justify-between gap-2">
          <CategoryBadge
            category={media.category}
            mediaId={media.id}
            storageUrl={media.storage_url}
            onUpdate={(newCat) => onCategoryUpdate(media.id, newCat)}
          />
          <TypeIcon className="w-3.5 h-3.5 text-slate-400 shrink-0" />
        </div>
      </div>
    </motion.div>
  );
}

// ============================================
// UPLOAD MODAL
// ============================================

interface UploadFile {
  file: File;
  id: string;
  progress: number;
  status: "pending" | "uploading" | "processing" | "complete" | "error";
  media?: Media;
  error?: string;
  preview?: string; // Object URL for preview
}

function UploadModal({
  isOpen,
  onClose,
  creators,
  selectedCreatorId,
  userRole,
  apiKey,
  onUploadComplete,
}: {
  isOpen: boolean;
  onClose: () => void;
  creators: Creator[];
  selectedCreatorId: string | null;
  userRole: "admin" | "business" | "independent";
  apiKey: string;
  onUploadComplete: () => void;
}) {
  const [files, setFiles] = useState<UploadFile[]>([]);
  const [creatorId, setCreatorId] = useState<string>(selectedCreatorId || "");
  const [category, setCategory] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Reset when modal opens
  useEffect(() => {
    if (isOpen) {
      setFiles([]);
      setCreatorId(selectedCreatorId || "");
      setCategory("");
      setIsUploading(false);
    }
  }, [isOpen, selectedCreatorId]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFiles = Array.from(e.dataTransfer.files).filter(
      (file) =>
        file.type.startsWith("image/") ||
        file.type.startsWith("video/") ||
        file.type.startsWith("audio/")
    );
    addFiles(droppedFiles);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      addFiles(selectedFiles);
    }
  };

  const addFiles = (newFiles: File[]) => {
    const uploadFiles: UploadFile[] = newFiles.map((file) => {
      // Generate preview URL for images and videos
      let preview: string | undefined;
      if (file.type.startsWith("image/") || file.type.startsWith("video/")) {
        preview = URL.createObjectURL(file);
      }
      return {
        file,
        id: `${file.name}-${Date.now()}-${Math.random().toString(36).slice(2)}`,
        progress: 0,
        status: "pending",
        preview,
      };
    });
    setFiles((prev) => [...prev, ...uploadFiles]);
  };

  // Clean up preview URLs when component unmounts or files are removed
  useEffect(() => {
    return () => {
      files.forEach((f) => {
        if (f.preview) URL.revokeObjectURL(f.preview);
      });
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const removeFile = (id: string) => {
    setFiles((prev) => {
      const fileToRemove = prev.find((f) => f.id === id);
      if (fileToRemove?.preview) {
        URL.revokeObjectURL(fileToRemove.preview);
      }
      return prev.filter((f) => f.id !== id);
    });
  };

  const handleUpload = async () => {
    if (!creatorId) {
      toast.error("Please select a model to upload for");
      return;
    }

    if (files.length === 0) {
      toast.error("Please select files to upload");
      return;
    }

    setIsUploading(true);
    const api = createApiClient(apiKey);

    for (let i = 0; i < files.length; i++) {
      const uploadFile = files[i];
      if (uploadFile.status !== "pending") continue;

      setFiles((prev) =>
        prev.map((f) =>
          f.id === uploadFile.id ? { ...f, status: "uploading" } : f
        )
      );

      try {
        const response = await api.uploadMedia({
          file: uploadFile.file,
          creator_id: creatorId,
          category: category || undefined,
          onProgress: (progress) => {
            // When upload reaches 100%, show processing state
            if (progress === 100) {
              setFiles((prev) =>
                prev.map((f) =>
                  f.id === uploadFile.id ? { ...f, progress, status: "processing" } : f
                )
              );
            } else {
              setFiles((prev) =>
                prev.map((f) => (f.id === uploadFile.id ? { ...f, progress } : f))
              );
            }
          },
        });

        if (response.success && response.data) {
          setFiles((prev) =>
            prev.map((f) =>
              f.id === uploadFile.id
                ? { ...f, status: "complete", progress: 100, media: response.data }
                : f
            )
          );
        } else {
          setFiles((prev) =>
            prev.map((f) =>
              f.id === uploadFile.id
                ? { ...f, status: "error", error: response.error || "Upload failed" }
                : f
            )
          );
        }
      } catch (err) {
        setFiles((prev) =>
          prev.map((f) =>
            f.id === uploadFile.id
              ? { ...f, status: "error", error: "Upload failed" }
              : f
          )
        );
      }
    }

    setIsUploading(false);

    const successCount = files.filter((f) => f.status === "complete").length;
    const errorCount = files.filter((f) => f.status === "error").length;

    if (successCount > 0) {
      toast.success(`Uploaded ${successCount} file(s) successfully`);
      onUploadComplete();
    }
    if (errorCount > 0) {
      toast.error(`Failed to upload ${errorCount} file(s)`);
    }
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith("image/")) return ImageIcon;
    if (file.type.startsWith("video/")) return Video;
    if (file.type.startsWith("audio/")) return Music;
    return File;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const pendingCount = files.filter((f) => f.status === "pending").length;
  const uploadingCount = files.filter((f) => f.status === "uploading").length;
  const completeCount = files.filter((f) => f.status === "complete").length;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && !isUploading && onClose()}>
      <DialogContent size="lg">
        <DialogHeader>
          <DialogTitle>Upload Media</DialogTitle>
          <DialogDescription>
            Drag and drop files or click to select. Supported formats: images, videos, audio.
          </DialogDescription>
        </DialogHeader>

        <DialogBody className="space-y-4">
          {/* Model Selection for Admin/Studio */}
          {(userRole === "admin" || userRole === "business") && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">
                Upload for Model <span className="text-red-500">*</span>
              </label>
              <select
                value={creatorId}
                onChange={(e) => setCreatorId(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white"
                disabled={isUploading}
              >
                <option value="">Select a model...</option>
                {creators.map((creator) => (
                  <option key={creator.id} value={creator.id}>
                    @{creator.username}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Category Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">
              Category (optional)
            </label>
            <Input
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="e.g., photoshoot, behind-the-scenes"
              disabled={isUploading}
            />
          </div>

          {/* Drop Zone */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => !isUploading && fileInputRef.current?.click()}
            className={`relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
              isDragging
                ? "border-brand-500 bg-brand-50"
                : "border-slate-200 hover:border-slate-300 bg-slate-50"
            } ${isUploading ? "pointer-events-none opacity-50" : ""}`}
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*,video/*,audio/*"
              onChange={handleFileSelect}
              className="hidden"
            />
            <CloudUpload
              className={`w-12 h-12 mx-auto mb-4 ${
                isDragging ? "text-brand-500" : "text-slate-400"
              }`}
            />
            <p className="text-slate-600 font-medium">
              {isDragging ? "Drop files here" : "Drop files here or click to browse"}
            </p>
            <p className="text-sm text-slate-400 mt-1">
              Images, videos, and audio files are supported
            </p>
          </div>

          {/* File List with Previews */}
          {files.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm text-slate-500">
                <span>{files.length} file(s) selected</span>
                <div className="flex items-center gap-3">
                  {uploadingCount > 0 && (
                    <span className="text-brand-600 flex items-center gap-1">
                      <Loader2 className="w-3 h-3 animate-spin" />
                      {uploadingCount} uploading
                    </span>
                  )}
                  {files.filter((f) => f.status === "processing").length > 0 && (
                    <span className="text-amber-600 flex items-center gap-1">
                      <Sparkles className="w-3 h-3 animate-pulse" />
                      {files.filter((f) => f.status === "processing").length} processing
                    </span>
                  )}
                  {completeCount > 0 && (
                    <span className="text-green-600">{completeCount} done</span>
                  )}
                </div>
              </div>
              
              {/* Grid view for visual files */}
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 max-h-72 overflow-y-auto p-1">
                {files.map((uploadFile) => {
                  const FileIcon = getFileIcon(uploadFile.file);
                  const isImage = uploadFile.file.type.startsWith("image/");
                  const isVideo = uploadFile.file.type.startsWith("video/");
                  
                  return (
                    <div
                      key={uploadFile.id}
                      className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                        uploadFile.status === "complete"
                          ? "border-green-500"
                          : uploadFile.status === "error"
                          ? "border-red-500"
                          : uploadFile.status === "processing"
                          ? "border-amber-500"
                          : uploadFile.status === "uploading"
                          ? "border-brand-500"
                          : "border-slate-200"
                      }`}
                    >
                      {/* Preview thumbnail */}
                      {uploadFile.preview ? (
                        isVideo ? (
                          <video
                            src={uploadFile.preview}
                            className="w-full h-full object-cover"
                            muted
                          />
                        ) : (
                          <img
                            src={uploadFile.preview}
                            alt={uploadFile.file.name}
                            className="w-full h-full object-cover"
                          />
                        )
                      ) : (
                        <div className="w-full h-full bg-slate-100 flex items-center justify-center">
                          <FileIcon className="w-8 h-8 text-slate-400" />
                        </div>
                      )}
                      
                      {/* Processing overlay */}
                      {uploadFile.status === "processing" && (
                        <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center">
                          <div className="relative">
                            <Sparkles className="w-8 h-8 text-amber-400 animate-pulse" />
                            <div className="absolute inset-0 animate-ping">
                              <Sparkles className="w-8 h-8 text-amber-400 opacity-50" />
                            </div>
                          </div>
                          <span className="text-xs text-white mt-2 font-medium">AI Processing...</span>
                        </div>
                      )}
                      
                      {/* Uploading overlay with progress */}
                      {uploadFile.status === "uploading" && (
                        <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center">
                          <Loader2 className="w-6 h-6 text-white animate-spin" />
                          <span className="text-xs text-white mt-2">{uploadFile.progress}%</span>
                          <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-700">
                            <div
                              className="h-full bg-brand-500 transition-all duration-300"
                              style={{ width: `${uploadFile.progress}%` }}
                            />
                          </div>
                        </div>
                      )}
                      
                      {/* Complete overlay */}
                      {uploadFile.status === "complete" && (
                        <div className="absolute inset-0 bg-green-500/20 flex items-center justify-center">
                          <div className="bg-green-500 rounded-full p-1.5">
                            <CheckCircle className="w-5 h-5 text-white" />
                          </div>
                        </div>
                      )}
                      
                      {/* Error overlay */}
                      {uploadFile.status === "error" && (
                        <div className="absolute inset-0 bg-red-500/20 flex flex-col items-center justify-center p-2">
                          <div className="bg-red-500 rounded-full p-1.5">
                            <XCircle className="w-5 h-5 text-white" />
                          </div>
                          <span className="text-xs text-red-600 mt-1 text-center truncate w-full">
                            {uploadFile.error}
                          </span>
                        </div>
                      )}
                      
                      {/* Remove button (only for pending) */}
                      {uploadFile.status === "pending" && !isUploading && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            removeFile(uploadFile.id);
                          }}
                          className="absolute top-1 right-1 p-1 bg-black/50 hover:bg-black/70 rounded-full transition-colors"
                        >
                          <X className="w-3 h-3 text-white" />
                        </button>
                      )}
                      
                      {/* File info on hover */}
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2 opacity-0 hover:opacity-100 transition-opacity">
                        <p className="text-xs text-white truncate">{uploadFile.file.name}</p>
                        <p className="text-xs text-white/70">{formatFileSize(uploadFile.file.size)}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </DialogBody>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isUploading}
          >
            {completeCount > 0 ? "Done" : "Cancel"}
          </Button>
          <Button
            onClick={handleUpload}
            disabled={isUploading || pendingCount === 0 || (userRole !== "independent" && !creatorId)}
            className="bg-brand-600 hover:bg-brand-700 text-white"
          >
            {isUploading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Uploading ({uploadingCount + completeCount}/{files.length})
              </>
            ) : (
              <>
                <Upload className="w-4 h-4 mr-2" />
                Upload {pendingCount} File{pendingCount !== 1 ? "s" : ""}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ============================================
// MAIN PAGE
// ============================================

export default function MediaPage() {
  const { user, apiKey } = useDashboard();
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const [media, setMedia] = useState<Media[]>([]);
  const [creators, setCreators] = useState<Creator[]>([]);
  const [categories, setCategories] = useState<MediaCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [viewingMedia, setViewingMedia] = useState<Media | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [currentPath, setCurrentPath] = useState<{ id: string; name: string }[]>([]);
  const [selectedCreator, setSelectedCreator] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    total: 0,
    limit: 50,
    offset: 0,
    hasMore: false,
  });
  const [filters, setFilters] = useState<FilterState>({
    types: new Set<MediaTypeFilter>(),
    categories: new Set<string>(),
    dateFrom: "",
    dateTo: "",
  });
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [creatorMediaCounts, setCreatorMediaCounts] = useState<CreatorMediaCounts>({});
  const [globalCounts, setGlobalCounts] = useState<MediaCounts>({ image: 0, video: 0, audio: 0, total: 0 });
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const loadMoreOffset = useRef(0);

  const isAdminOrBusiness = user?.role === "admin" || user?.role === "business";
  const isAdmin = user?.role === "admin";
  
  // Handle URL params for permalinks and time filtering
  const mediaIdParam = searchParams.get("view");
  const dateFromParam = searchParams.get("from");
  const dateToParam = searchParams.get("to");
  const creatorParam = searchParams.get("creator");
  
  // Apply URL params to filters on mount
  useEffect(() => {
    if (dateFromParam || dateToParam) {
      setFilters(prev => ({
        ...prev,
        dateFrom: dateFromParam || "",
        dateTo: dateToParam || "",
      }));
      setShowFilters(true);
    }
    if (creatorParam) {
      setSelectedCreator(creatorParam);
    }
  }, [dateFromParam, dateToParam, creatorParam]);
  
  // Open media viewer if mediaId is in URL
  useEffect(() => {
    if (mediaIdParam && media.length > 0 && apiKey) {
      // Find media in current list or fetch it
      const foundMedia = media.find(m => m.id === mediaIdParam);
      if (foundMedia) {
        setViewingMedia(foundMedia);
      } else {
        // Fetch the specific media
        const api = createApiClient(apiKey);
        api.getMedia(mediaIdParam).then(response => {
          if (response.success && response.data) {
            setViewingMedia(response.data);
          }
        });
      }
    }
  }, [mediaIdParam, media, apiKey]);
  
  // Generate permalink for a media item
  const getMediaPermalink = useCallback((mediaId: string) => {
    const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
    return `${baseUrl}/dashboard/media?view=${mediaId}`;
  }, []);
  
  // Copy permalink to clipboard
  const copyPermalink = useCallback(async (mediaId: string) => {
    const permalink = getMediaPermalink(mediaId);
    try {
      await navigator.clipboard.writeText(permalink);
      toast.success("Permalink copied to clipboard!");
    } catch {
      toast.error("Failed to copy permalink");
    }
  }, [getMediaPermalink]);
  
  // Update URL when viewing media
  const openMediaViewer = useCallback((mediaItem: Media) => {
    setViewingMedia(mediaItem);
    // Update URL without navigation
    const url = new URL(window.location.href);
    url.searchParams.set("view", mediaItem.id);
    router.replace(url.pathname + url.search, { scroll: false });
  }, [router]);
  
  // Close media viewer and clear URL param
  const closeMediaViewer = useCallback(() => {
    setViewingMedia(null);
    const url = new URL(window.location.href);
    url.searchParams.delete("view");
    router.replace(url.pathname + url.search, { scroll: false });
  }, [router]);
  const [isGlobalDragging, setIsGlobalDragging] = useState(false);
  const dragCounter = useRef(0);

  // Global drag and drop handlers
  const handleGlobalDragEnter = useCallback((e: DragEvent) => {
    e.preventDefault();
    dragCounter.current++;
    if (e.dataTransfer?.types.includes("Files")) {
      setIsGlobalDragging(true);
    }
  }, []);

  const handleGlobalDragLeave = useCallback((e: DragEvent) => {
    e.preventDefault();
    dragCounter.current--;
    if (dragCounter.current === 0) {
      setIsGlobalDragging(false);
    }
  }, []);

  const handleGlobalDragOver = useCallback((e: DragEvent) => {
    e.preventDefault();
  }, []);

  const handleGlobalDrop = useCallback((e: DragEvent) => {
    e.preventDefault();
    dragCounter.current = 0;
    setIsGlobalDragging(false);
    if (e.dataTransfer?.files.length) {
      setShowUploadModal(true);
    }
  }, []);

  useEffect(() => {
    document.addEventListener("dragenter", handleGlobalDragEnter);
    document.addEventListener("dragleave", handleGlobalDragLeave);
    document.addEventListener("dragover", handleGlobalDragOver);
    document.addEventListener("drop", handleGlobalDrop);

    return () => {
      document.removeEventListener("dragenter", handleGlobalDragEnter);
      document.removeEventListener("dragleave", handleGlobalDragLeave);
      document.removeEventListener("dragover", handleGlobalDragOver);
      document.removeEventListener("drop", handleGlobalDrop);
    };
  }, [handleGlobalDragEnter, handleGlobalDragLeave, handleGlobalDragOver, handleGlobalDrop]);

  // Store studio creator IDs for filtering and track loading state
  // NOTE: These must be defined before fetchCreators which uses them
  const [studioCreatorIds, setStudioCreatorIds] = useState<Set<string>>(new Set());
  const [permissionsLoaded, setPermissionsLoaded] = useState(false);

  // Fetch creators and their media counts for folder view
  const fetchCreators = useCallback(async () => {
    if (!apiKey || !isAdminOrStudio || !permissionsLoaded) return;

    try {
      const api = createApiClient(apiKey);
      
      // Use studio_id filtering for studio users
      const studioIdParam = user?.role === "business" ? user?.studio_id || undefined : undefined;
      
      const response = await api.listCreators({
        studio_id: studioIdParam,
      });

      if (response.success && response.data) {
        setCreators(response.data);
        
        // Get the set of creator IDs this user can access
        const accessibleCreatorIds = new Set(response.data.map(c => c.id));

        // Only fetch counts if we don't have them yet (to avoid refetching)
        if (Object.keys(creatorMediaCounts).length === 0) {
          // Fetch media counts for each creator
          const counts: CreatorMediaCounts = {};
          let totalImage = 0, totalVideo = 0, totalAudio = 0;

          // Use server-side studio_id filtering for studios
          const allMediaResponse = await api.listMedia({ 
            limit: 5000,
            studio_id: studioIdParam, 
          });
          if (allMediaResponse.success && allMediaResponse.data) {
            allMediaResponse.data.forEach((m: Media) => {
              const creatorId = m.creator_id;
              
              // Only count media from accessible creators (extra client-side check)
              if (!accessibleCreatorIds.has(creatorId)) return;
              
              if (!counts[creatorId]) {
                counts[creatorId] = { image: 0, video: 0, audio: 0, total: 0 };
              }
              if (m.media_type === "image") {
                counts[creatorId].image++;
                totalImage++;
              } else if (m.media_type === "video") {
                counts[creatorId].video++;
                totalVideo++;
              } else if (m.media_type === "audio") {
                counts[creatorId].audio++;
                totalAudio++;
              }
              counts[creatorId].total++;
            });
          }

          setCreatorMediaCounts(counts);
          setGlobalCounts({
            image: totalImage,
            video: totalVideo,
            audio: totalAudio,
            total: totalImage + totalVideo + totalAudio,
          });
        }
      }
    } catch (err) {
      console.error("Error fetching creators:", err);
    }
  }, [apiKey, isAdminOrStudio, user, creatorMediaCounts, permissionsLoaded]);

  // Fetch studio creators for permission filtering
  useEffect(() => {
    const fetchStudioCreators = async () => {
      // For admin users, permissions are always loaded (they can see everything)
      if (user?.role === "admin") {
        setPermissionsLoaded(true);
        return;
      }
      
      // For model users, permissions are loaded if they have a creator_id
      if (user?.role === "independent") {
        setPermissionsLoaded(true);
        return;
      }
      
      // For studio users, we need to fetch their accessible creators
      if (!apiKey || user?.role !== "business" || !user?.studio_id) {
        // No studio_id means no access
        setPermissionsLoaded(true);
        return;
      }
      
      try {
        const api = createApiClient(apiKey);
        const response = await api.getStudioCreators(user.studio_id);
        if (response.success && response.data) {
          setStudioCreatorIds(new Set(response.data.map(c => c.id)));
        }
      } catch (err) {
        console.error("Error fetching studio creators:", err);
      } finally {
        setPermissionsLoaded(true);
      }
    };
    
    fetchStudioCreators();
  }, [apiKey, user?.role, user?.studio_id]);

  const fetchMedia = useCallback(
    async (reset = false) => {
      if (!apiKey) return;
      
      // Wait for permissions to be loaded before fetching
      if (!permissionsLoaded) return;

      setIsLoading(true);
      setError(null);

      try {
        const api = createApiClient(apiKey);
        const offset = reset ? 0 : pagination.offset;

        // Determine creator_id and studio_id filters based on user role and permissions
        let creatorIdFilter: string | undefined;
        let studioIdFilter: string | undefined;
        
        if (user?.role === "independent") {
          // Models can ONLY see their own media - strict enforcement
          creatorIdFilter = user?.creator_id || undefined;
          if (!creatorIdFilter) {
            // No creator_id means no access to media
            setMedia([]);
            setIsLoading(false);
            return;
          }
        } else if (user?.role === "business") {
          // Studios can only see media from their linked creators
          // Use server-side studio_id filtering for security
          studioIdFilter = user?.studio_id || undefined;
          if (!studioIdFilter) {
            // No studio_id means no access
            setMedia([]);
            setIsLoading(false);
            return;
          }
          // If a specific creator is selected, also filter by that
          if (selectedCreator) {
            // Verify the selected creator belongs to this studio
            if (studioCreatorIds.size > 0 && !studioCreatorIds.has(selectedCreator)) {
              setMedia([]);
              setIsLoading(false);
              return;
            }
            creatorIdFilter = selectedCreator;
          }
        } else if (user?.role === "admin") {
          // Admins can see all media, but can filter by selected creator
          if (selectedCreator) {
            creatorIdFilter = selectedCreator;
          }
        } else {
          // Unknown role - no access
          setMedia([]);
          setIsLoading(false);
          return;
        }

        // Determine type filter (if only one type selected, use it)
        let typeFilter: "image" | "video" | "audio" | undefined;
        if (filters.types.size === 1) {
          typeFilter = Array.from(filters.types)[0] as "image" | "video" | "audio";
        }

        // Determine category filter (if only one selected, use it; if multiple, we'll filter client-side)
        let categoryFilter: string | undefined;
        if (filters.categories.size === 1) {
          categoryFilter = Array.from(filters.categories)[0];
        }

        const response = await api.listMedia({
          type: typeFilter,
          category: categoryFilter,
          creator_id: creatorIdFilter,
          studio_id: studioIdFilter, // Use server-side studio filtering
          date_from: filters.dateFrom || undefined,
          date_to: filters.dateTo || undefined,
          limit: pagination.limit,
          offset,
          sort_order: "desc",
        });

        if (response.success && response.data) {
          let newData = response.data;

          // Additional client-side filtering for studios as extra security layer
          if (user?.role === "business" && studioCreatorIds.size > 0) {
            newData = newData.filter((m: Media) => studioCreatorIds.has(m.creator_id));
          }

          // Client-side filtering for multiple types
          if (filters.types.size > 1) {
            newData = newData.filter((m: Media) => filters.types.has(m.media_type as MediaTypeFilter));
          }

          // Client-side filtering for multiple categories
          if (filters.categories.size > 1) {
            newData = newData.filter((m: Media) => filters.categories.has(m.category || ""));
          }

          // Deduplicate media by ID when appending
          if (reset) {
            setMedia(newData);
          } else {
            setMedia((prev) => {
              const existingIds = new Set(prev.map((m) => m.id));
              const newItems = newData.filter((m: Media) => !existingIds.has(m.id));
              return [...prev, ...newItems];
            });
          }
          if (response.pagination) {
            setPagination(response.pagination);
          }
        } else {
          setError(response.error || "Failed to load media");
        }

        // Fetch categories (filter by creator or studio)
        let categoryCreatorId = creatorIdFilter;
        const catResponse = await api.getMediaCategories(categoryCreatorId);
        if (catResponse.success && catResponse.data) {
          setCategories(catResponse.data);
        }
      } catch (err) {
        console.error("Error fetching media:", err);
        setError("Failed to load media");
      } finally {
        setIsLoading(false);
      }
    },
    [apiKey, filters, pagination.offset, pagination.limit, user, selectedCreator, studioCreatorIds, permissionsLoaded]
  );

  // Load more handler for infinite scroll
  const handleLoadMore = useCallback(async () => {
    if (!apiKey || isLoadingMore || !pagination.hasMore || !permissionsLoaded) return;

    setIsLoadingMore(true);
    const nextOffset = pagination.offset + pagination.limit;

    try {
      const api = createApiClient(apiKey);

      // Determine creator_id and studio_id filters based on user role
      let creatorIdFilter: string | undefined;
      let studioIdFilter: string | undefined;
      
      if (user?.role === "independent") {
        // Models can ONLY load more of their own media
        creatorIdFilter = user?.creator_id || undefined;
        if (!creatorIdFilter) return;
      } else if (user?.role === "business") {
        // Studios use server-side studio_id filtering
        studioIdFilter = user?.studio_id || undefined;
        if (!studioIdFilter) return;
        if (selectedCreator) {
          // Verify selected creator belongs to studio
          if (studioCreatorIds.size > 0 && !studioCreatorIds.has(selectedCreator)) return;
          creatorIdFilter = selectedCreator;
        }
      } else if (user?.role === "admin") {
        if (selectedCreator) {
          creatorIdFilter = selectedCreator;
        }
      } else {
        // Unknown role - no access
        return;
      }

      // Determine type filter
      let typeFilter: "image" | "video" | "audio" | undefined;
      if (filters.types.size === 1) {
        typeFilter = Array.from(filters.types)[0] as "image" | "video" | "audio";
      }

      // Determine category filter
      let categoryFilter: string | undefined;
      if (filters.categories.size === 1) {
        categoryFilter = Array.from(filters.categories)[0];
      }

      const response = await api.listMedia({
        type: typeFilter,
        category: categoryFilter,
        creator_id: creatorIdFilter,
        studio_id: studioIdFilter,
        date_from: filters.dateFrom || undefined,
        date_to: filters.dateTo || undefined,
        limit: pagination.limit,
        offset: nextOffset,
        sort_order: "desc",
      });

      if (response.success && response.data) {
        let newData = response.data;

        // Additional client-side filtering for studios as extra security layer
        if (user?.role === "business" && studioCreatorIds.size > 0) {
          newData = newData.filter((m: Media) => studioCreatorIds.has(m.creator_id));
        }

        // Client-side filtering for multiple types
        if (filters.types.size > 1) {
          newData = newData.filter((m: Media) => filters.types.has(m.media_type as MediaTypeFilter));
        }

        // Client-side filtering for multiple categories
        if (filters.categories.size > 1) {
          newData = newData.filter((m: Media) => filters.categories.has(m.category || ""));
        }

        // Deduplicate and append
        setMedia((prev) => {
          const existingIds = new Set(prev.map((m) => m.id));
          const newItems = newData.filter((m: Media) => !existingIds.has(m.id));
          return [...prev, ...newItems];
        });

        if (response.pagination) {
          setPagination(response.pagination);
        }
      }
    } catch (err) {
      console.error("Error loading more media:", err);
    } finally {
      setIsLoadingMore(false);
    }
  }, [apiKey, isLoadingMore, pagination, filters, user, selectedCreator, studioCreatorIds, permissionsLoaded]);

  // Force refresh counts
  const refreshCounts = useCallback(async () => {
    if (!apiKey || !isAdminOrStudio || !permissionsLoaded) return;

    try {
      const api = createApiClient(apiKey);
      const counts: CreatorMediaCounts = {};
      let totalImage = 0, totalVideo = 0, totalAudio = 0;

      // Use server-side studio_id filtering for studios
      const studioIdParam = user?.role === "business" ? user?.studio_id : undefined;
      
      const allMediaResponse = await api.listMedia({ 
        limit: 5000,
        studio_id: studioIdParam,
      });
      if (allMediaResponse.success && allMediaResponse.data) {
        allMediaResponse.data.forEach((m: Media) => {
          // Additional client-side filtering for studios as extra security
          if (user?.role === "business" && studioCreatorIds.size > 0) {
            if (!studioCreatorIds.has(m.creator_id)) return;
          }
          
          const creatorId = m.creator_id;
          if (!counts[creatorId]) {
            counts[creatorId] = { image: 0, video: 0, audio: 0, total: 0 };
          }
          if (m.media_type === "image") {
            counts[creatorId].image++;
            totalImage++;
          } else if (m.media_type === "video") {
            counts[creatorId].video++;
            totalVideo++;
          } else if (m.media_type === "audio") {
            counts[creatorId].audio++;
            totalAudio++;
          }
          counts[creatorId].total++;
        });
      }

      setCreatorMediaCounts(counts);
      setGlobalCounts({
        image: totalImage,
        video: totalVideo,
        audio: totalAudio,
        total: totalImage + totalVideo + totalAudio,
      });
    } catch (err) {
      console.error("Error refreshing counts:", err);
    }
  }, [apiKey, isAdminOrStudio, user, studioCreatorIds, permissionsLoaded]);

  useEffect(() => {
    // Only fetch creators once permissions are loaded
    if (permissionsLoaded) {
      fetchCreators();
    }
  }, [fetchCreators, permissionsLoaded]);

  useEffect(() => {
    // Only fetch media once permissions are loaded
    if (permissionsLoaded) {
      fetchMedia(true);
      loadMoreOffset.current = 0;
    }
  }, [apiKey, filters, selectedCreator, permissionsLoaded]); // eslint-disable-line react-hooks/exhaustive-deps

  // Generate folder items for the folder view
  const folderItems = useMemo<FolderItem[]>(() => {
    if (currentPath.length === 0 && isAdminOrStudio) {
      // Root level - show creators as folders with media counts
      return creators.map((creator) => {
        const counts = creatorMediaCounts[creator.id] || { image: 0, video: 0, audio: 0, total: 0 };
        return {
          id: creator.id,
          name: creator.username,
          type: "creator" as const,
          count: counts.total,
          photoCount: counts.image,
          videoCount: counts.video,
          audioCount: counts.audio,
          creator,
        };
      });
    }

    // Show categories as folders when inside a creator folder
    return categories.map((cat) => ({
      id: cat.name,
      name: cat.name,
      type: "category" as const,
      count: cat.count,
      photoCount: 0, // Categories don't have per-type counts from API
      videoCount: 0,
      audioCount: 0,
    }));
  }, [creators, categories, currentPath, isAdminOrStudio, creatorMediaCounts]);

  const handleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleSelectAll = () => {
    if (selectedIds.size === media.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(media.map((m) => m.id)));
    }
  };

  const handleCopyImage = async (mediaItem: Media) => {
    if (mediaItem.media_type !== "image") return;

    try {
      // Create an image element to load the image
      const img = new Image();
      img.crossOrigin = "anonymous";
      
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject(new Error("Failed to load image"));
        img.src = mediaItem.storage_url;
      });

      // Create a canvas and draw the image
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Failed to get canvas context");
      ctx.drawImage(img, 0, 0);

      // Convert canvas to PNG blob (the only image format supported by Clipboard API)
      const pngBlob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob(
          (blob) => {
            if (blob) resolve(blob);
            else reject(new Error("Failed to create PNG blob"));
          },
          "image/png"
        );
      });

      // Write to clipboard
      await navigator.clipboard.write([
        new ClipboardItem({
          "image/png": pngBlob,
        }),
      ]);

      toast.success("Image copied to clipboard!");
    } catch (err) {
      console.error("Failed to copy image:", err);
      // Fallback: copy URL instead
      try {
        await navigator.clipboard.writeText(mediaItem.storage_url);
        toast.success("Image URL copied to clipboard!");
      } catch {
        toast.error("Failed to copy to clipboard");
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (!apiKey) return;
    if (!confirm("Are you sure you want to delete this media? This cannot be undone.")) {
      return;
    }

    try {
      const api = createApiClient(apiKey);
      const response = await api.deleteMedia(id);

      if (response.success) {
        setMedia((prev) => prev.filter((m) => m.id !== id));
        setSelectedIds((prev) => {
          const next = new Set(prev);
          next.delete(id);
          return next;
        });
        toast.success("Media deleted successfully");
      } else {
        toast.error(response.error || "Failed to delete media");
      }
    } catch (err) {
      console.error("Error deleting media:", err);
      toast.error("Failed to delete media");
    }
  };

  const handleBatchDelete = async () => {
    if (!apiKey || selectedIds.size === 0) return;
    if (
      !confirm(
        `Are you sure you want to delete ${selectedIds.size} items? This cannot be undone.`
      )
    ) {
      return;
    }

    try {
      const api = createApiClient(apiKey);
      const response = await api.batchDeleteMedia(Array.from(selectedIds));

      if (response.success && response.data) {
        setMedia((prev) => prev.filter((m) => !selectedIds.has(m.id)));
        setSelectedIds(new Set());
        toast.success(`Deleted ${response.data.deleted} items`);
      } else {
        toast.error(response.error || "Failed to delete media");
      }
    } catch (err) {
      console.error("Error batch deleting:", err);
      toast.error("Failed to delete media");
    }
  };

  const handleFolderClick = (folder: FolderItem) => {
    if (folder.type === "creator") {
      // Set loading state before navigation to prevent flash
      setIsLoading(true);
      setMedia([]); // Clear media to show skeleton
      setSelectedCreator(folder.id);
      setCurrentPath([{ id: folder.id, name: folder.name }]);
      setFilters({ ...filters, categories: new Set() });
    } else if (folder.type === "category") {
      setFilters({ ...filters, categories: new Set([folder.name]) });
      setCurrentPath([...currentPath, { id: folder.id, name: folder.name }]);
    }
  };

  const handleBreadcrumbNavigate = (index: number) => {
    if (index === -1) {
      setCurrentPath([]);
      setSelectedCreator(null);
      setFilters({ ...filters, categories: new Set() });
    } else {
      const newPath = currentPath.slice(0, index + 1);
      setCurrentPath(newPath);
      if (newPath.length === 0) {
        setSelectedCreator(null);
        setFilters({ ...filters, categories: new Set() });
      } else if (newPath.length === 1) {
        setFilters({ ...filters, categories: new Set() });
      }
    }
  };

  // Toggle media type filter
  const toggleTypeFilter = (type: MediaTypeFilter) => {
    const newTypes = new Set(filters.types);
    if (newTypes.has(type)) {
      newTypes.delete(type);
    } else {
      newTypes.add(type);
    }
    setFilters({ ...filters, types: newTypes });
  };

  // Toggle category filter
  const toggleCategoryFilter = (category: string) => {
    const newCategories = new Set(filters.categories);
    if (newCategories.has(category)) {
      newCategories.delete(category);
    } else {
      newCategories.add(category);
    }
    setFilters({ ...filters, categories: newCategories });
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      types: new Set(),
      categories: new Set(),
      dateFrom: "",
      dateTo: "",
    });
  };

  // Check if any filters are active
  const hasActiveFilters = filters.types.size > 0 || filters.categories.size > 0 || filters.dateFrom || filters.dateTo;

  // Handle category update for a media item
  const handleCategoryUpdate = useCallback((mediaId: string, newCategory: string) => {
    setMedia((prev) =>
      prev.map((m) => (m.id === mediaId ? { ...m, category: newCategory } : m))
    );
    // Refresh categories list
    fetchMedia(true);
  }, [fetchMedia]);

  return (
    <div className="space-y-6 relative">
      {/* Global Drop Overlay */}
      <AnimatePresence>
        {isGlobalDragging && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-brand-600/90 flex items-center justify-center pointer-events-none"
          >
            <div className="text-center text-white">
              <CloudUpload className="w-20 h-20 mx-auto mb-4 animate-bounce" />
              <h2 className="text-2xl font-bold mb-2">Drop files to upload</h2>
              <p className="text-brand-200">Release to open the upload dialog</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Media Library</h1>
          <p className="text-slate-500">
            {pagination.total.toLocaleString()} items
            {selectedCreator && currentPath[0] && ` in ${currentPath[0].name}`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {isAdmin && (
            <Button
              variant="outline"
              size="sm"
              onClick={async () => {
                setIsSyncing(true);
                try {
                  const response = await fetch("/api/media/sync-pinecone", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ limit: 500 }),
                  });
                  const data = await response.json();
                  if (data.success) {
                    toast.success(`Synced ${data.synced} media with Pinecone`);
                  } else {
                    toast.error("Sync failed");
                  }
                } catch {
                  toast.error("Sync failed");
                } finally {
                  setIsSyncing(false);
                }
              }}
              disabled={isSyncing}
            >
              <Sparkles className={`w-4 h-4 mr-2 ${isSyncing ? "animate-pulse" : ""}`} />
              {isSyncing ? "Syncing..." : "Sync AI"}
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={() => fetchMedia(true)}
            disabled={isLoading}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Button
            size="sm"
            onClick={() => setShowUploadModal(true)}
            className="bg-brand-600 hover:bg-brand-700 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Upload
          </Button>
        </div>
      </div>

      {/* Breadcrumb */}
      {(currentPath.length > 0 || selectedCreator) && (
        <div className="bg-white rounded-xl border border-slate-200 p-3">
          <Breadcrumb path={currentPath} onNavigate={handleBreadcrumbNavigate} />
        </div>
      )}

      {/* Toolbar */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        {/* Top row: Media type filters + View toggle */}
        <div className="p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          {/* Media Type Filter */}
          <MediaTypeFilter
            selectedTypes={filters.types}
            onToggle={toggleTypeFilter}
            counts={currentPath.length > 0 && selectedCreator && creatorMediaCounts[selectedCreator]
              ? creatorMediaCounts[selectedCreator]
              : globalCounts
            }
          />

          {/* Right side controls */}
          <div className="flex items-center gap-2">
            {/* Date Filter Toggle */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className={showFilters ? "bg-slate-100" : ""}
            >
              <Calendar className="w-4 h-4 mr-2" />
              Date
              <ChevronDown
                className={`w-4 h-4 ml-1 transition-transform ${showFilters ? "rotate-180" : ""}`}
              />
            </Button>

            {/* Clear filters button (only shown when filters are active) */}
            {hasActiveFilters && (
              <Button
                variant="outline"
                size="sm"
                onClick={clearFilters}
                className="text-red-600 border-red-200 hover:bg-red-50"
              >
                <X className="w-4 h-4 mr-1" />
                Clear
              </Button>
            )}

            {/* View Toggle */}
            <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden">
              {isAdminOrStudio && (
                <button
                  onClick={() => setViewMode("folders")}
                  className={`p-2 ${
                    viewMode === "folders"
                      ? "bg-slate-100 text-slate-900"
                      : "text-slate-500 hover:bg-slate-50"
                  }`}
                  title="Folder View"
                >
                  <Layers className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 ${
                  viewMode === "grid"
                    ? "bg-slate-100 text-slate-900"
                    : "text-slate-500 hover:bg-slate-50"
                }`}
                title="Grid View"
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 ${
                  viewMode === "list"
                    ? "bg-slate-100 text-slate-900"
                    : "text-slate-500 hover:bg-slate-50"
                }`}
                title="List View"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Date Filters (collapsible) */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden border-t border-slate-200"
            >
              <div className="p-4 flex flex-wrap items-center gap-4 bg-slate-50">
                <span className="text-sm font-medium text-slate-600">Date range:</span>
                <div className="flex items-center gap-2">
                  <Input
                    type="date"
                    value={filters.dateFrom}
                    onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
                    className="w-auto bg-white"
                  />
                  <span className="text-slate-400">→</span>
                  <Input
                    type="date"
                    value={filters.dateTo}
                    onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
                    className="w-auto bg-white"
                  />
                </div>
                {(filters.dateFrom || filters.dateTo) && (
                  <button
                    onClick={() => setFilters({ ...filters, dateFrom: "", dateTo: "" })}
                    className="text-sm text-slate-500 hover:text-slate-700"
                  >
                    Clear dates
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>


        {/* Batch Actions */}
        {selectedIds.size > 0 && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            className="flex items-center gap-4 p-4 border-t border-slate-200 bg-brand-50"
          >
            <button
              onClick={handleSelectAll}
              className="text-sm text-brand-600 hover:underline font-medium"
            >
              {selectedIds.size === media.length ? "Deselect All" : "Select All"}
            </button>
            <span className="text-sm text-slate-600 bg-white px-2 py-1 rounded-full">
              {selectedIds.size} selected
            </span>
            <div className="flex-1" />
            <Button
              variant="outline"
              size="sm"
              onClick={handleBatchDelete}
              className="text-red-600 border-red-200 hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete Selected
            </Button>
          </motion.div>
        )}
      </div>

      {/* Content */}
      {isLoading && media.length === 0 && !error ? (
        viewMode === "folders" && currentPath.length === 0 && isAdminOrStudio ? (
          <FolderSkeleton />
        ) : (
          <MediaSkeleton viewMode={viewMode} />
        )
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-500" />
          <p className="text-red-700">{error}</p>
          <Button variant="outline" size="sm" onClick={() => fetchMedia(true)} className="ml-auto">
            <RefreshCw className="w-4 h-4 mr-2" />
            Retry
          </Button>
        </div>
      ) : viewMode === "folders" && currentPath.length === 0 && isAdminOrStudio ? (
        // Folder view at root
        folderItems.length === 0 ? (
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-12 text-center">
            <FolderOpen className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="font-semibold text-slate-700 mb-2">No models found</h3>
            <p className="text-slate-500 text-sm mb-4">Add models to see their media here</p>
            <Button onClick={() => setShowUploadModal(true)} className="bg-brand-600 hover:bg-brand-700">
              <Upload className="w-4 h-4 mr-2" />
              Upload Media
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {folderItems.map((folder) => (
              <FolderCard
                key={folder.id}
                folder={folder}
                onClick={() => handleFolderClick(folder)}
              />
            ))}
          </div>
        )
      ) : media.length === 0 ? (
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-12 text-center">
          <CloudUpload className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="font-semibold text-slate-700 mb-2">
            {hasActiveFilters ? "No media found" : "No media yet"}
          </h3>
          <p className="text-slate-500 text-sm mb-6">
            {hasActiveFilters
              ? "Try adjusting your filters or clear them to see all media"
              : "Upload your first images, videos, or audio files to get started"}
          </p>
          <div className="flex items-center justify-center gap-3">
            {hasActiveFilters && (
              <Button variant="outline" onClick={clearFilters}>
                Clear Filters
              </Button>
            )}
            <Button onClick={() => setShowUploadModal(true)} className="bg-brand-600 hover:bg-brand-700">
              <Upload className="w-4 h-4 mr-2" />
              Upload Media
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex gap-6">
          {/* Label Sidebar */}
          {categories.length > 0 && (
            <div className="hidden lg:block w-64 shrink-0">
              <div className="sticky top-6">
                <LabelSidebar
                  categories={categories}
                  selectedCategories={filters.categories}
                  onToggle={toggleCategoryFilter}
                />
              </div>
            </div>
          )}

          {/* Main Content */}
          <div className="flex-1 min-w-0 space-y-4">
            {/* Mobile Label Filter (horizontal scroll) */}
            {categories.length > 0 && (
              <div className="lg:hidden overflow-x-auto pb-2 -mx-4 px-4">
                <div className="flex items-center gap-2 min-w-max">
                  {[...categories]
                    .sort((a, b) => b.count - a.count)
                    .map((cat) => {
                      const isSelected = filters.categories.has(cat.name);
                      const iconConfig = CATEGORY_ICONS[cat.name] || CATEGORY_ICONS["default"];
                      const IconComponent = iconConfig.icon;
                      return (
                        <button
                          key={cat.name}
                          onClick={() => toggleCategoryFilter(cat.name)}
                          className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                            isSelected
                              ? "bg-brand-500 text-white shadow-md"
                              : `${iconConfig.bg} ${iconConfig.color}`
                          }`}
                        >
                          <IconComponent className="w-4 h-4" />
                          <span>{cat.name}</span>
                          <span className={`text-xs ${isSelected ? "opacity-70" : "opacity-60"}`}>
                            {cat.count}
                          </span>
                        </button>
                      );
                    })}
                </div>
              </div>
            )}

            {currentPath.length > 0 && (
              <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wider">
                Media Files
              </h3>
            )}
            {viewMode === "list" || (viewMode === "folders" && currentPath.length > 0) ? (
              <div className="space-y-2">
                {media.map((item) => (
                  <MediaCard
                    key={item.id}
                    media={item}
                    isSelected={selectedIds.has(item.id)}
                    onSelect={handleSelect}
                    onView={openMediaViewer}
                    onDelete={handleDelete}
                    onCopy={handleCopyImage}
                    onCopyPermalink={copyPermalink}
                    onCategoryUpdate={handleCategoryUpdate}
                    viewMode="list"
                    apiKey={apiKey || ""}
                  />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {media.map((item) => (
                  <MediaCard
                    key={item.id}
                    media={item}
                    isSelected={selectedIds.has(item.id)}
                    onSelect={handleSelect}
                    onView={openMediaViewer}
                    onDelete={handleDelete}
                    onCopy={handleCopyImage}
                    onCopyPermalink={copyPermalink}
                    onCategoryUpdate={handleCategoryUpdate}
                    viewMode="grid"
                    apiKey={apiKey || ""}
                  />
                ))}
              </div>
            )}

            {/* Infinite Scroll Trigger */}
            <InfiniteScrollTrigger
              onTrigger={handleLoadMore}
              isLoading={isLoadingMore}
              hasMore={pagination.hasMore}
            />
          </div>
        </div>
      )}

      {/* Media Viewer Modal */}
      <AnimatePresence>
        {viewingMedia && (
          <MediaViewer
            media={viewingMedia}
            mediaList={media}
            onClose={closeMediaViewer}
            onDelete={handleDelete}
            onCopy={handleCopyImage}
            onNavigate={openMediaViewer}
            onCopyPermalink={copyPermalink}
            permalink={getMediaPermalink(viewingMedia.id)}
          />
        )}
      </AnimatePresence>

      {/* Upload Modal */}
      {apiKey && user && (
        <UploadModal
          isOpen={showUploadModal}
          onClose={() => setShowUploadModal(false)}
          creators={creators}
          selectedCreatorId={user.role === "independent" ? user.creator_id : selectedCreator}
          userRole={user.role as "admin" | "business" | "independent"}
          apiKey={apiKey}
          onUploadComplete={() => {
            fetchMedia(true);
            refreshCounts(); // Refresh media counts
            setShowUploadModal(false);
          }}
        />
      )}
    </div>
  );
}

