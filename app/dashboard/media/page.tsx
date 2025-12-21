"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useDashboard } from "../layout";
import { createApiClient, type Media, type MediaCategory, type Creator } from "@/lib/media-api";
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
  ZoomIn,
  ZoomOut,
  RotateCw,
  Maximize,
  Minimize,
  Share2,
  ExternalLink,
  Link,
  Check,
  SlidersHorizontal,
  Sparkles,
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
// INFINITE SCROLL TRIGGER
// ============================================

function InfiniteScrollTrigger({
  onTrigger,
  isLoading,
}: {
  onTrigger: () => void;
  isLoading: boolean;
}) {
  const triggerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!triggerRef.current || isLoading) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          onTrigger();
        }
      },
      { rootMargin: "200px" }
    );

    observer.observe(triggerRef.current);
    return () => observer.disconnect();
  }, [onTrigger, isLoading]);

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
// CATEGORY FILTER COMPONENT (Multi-select icons)
// ============================================

function CategoryFilter({
  categories,
  selectedCategories,
  onToggle,
}: {
  categories: MediaCategory[];
  selectedCategories: Set<string>;
  onToggle: (category: string) => void;
}) {
  if (categories.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((cat) => {
        const isSelected = selectedCategories.has(cat.name);
        const iconConfig = CATEGORY_ICONS[cat.name] || CATEGORY_ICONS["default"];
        const IconComponent = iconConfig.icon;

        return (
          <button
            key={cat.name}
            onClick={() => onToggle(cat.name)}
            className={`group relative flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
              isSelected
                ? "bg-brand-500 text-white shadow-md shadow-brand-500/25 scale-105"
                : `${iconConfig.bg} ${iconConfig.color} hover:shadow-md hover:scale-105`
            }`}
          >
            <span className={isSelected ? "grayscale-0" : ""}>
              <IconComponent className="w-4 h-4" />
            </span>
            <span>{cat.name}</span>
            <span className={`text-xs ${isSelected ? "text-brand-200" : "opacity-60"}`}>
              {cat.count}
            </span>
            {isSelected && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-white rounded-full flex items-center justify-center shadow-sm">
                <Check className="w-3 h-3 text-brand-500" />
              </span>
            )}
          </button>
        );
      })}
    </div>
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
  viewMode,
}: {
  media: Media;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onView: (media: Media) => void;
  onDelete: (id: string) => void;
  onCopy: (media: Media) => void;
  viewMode: ViewMode;
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
          <p className="font-medium text-slate-900 truncate">{media.file_name}</p>
          <p className="text-sm text-slate-500">
            {media.category || "Uncategorized"} • {formatFileSize(media.file_size_bytes)}
          </p>
          {media.creator && (
            <p className="text-xs text-slate-400">by @{media.creator.username}</p>
          )}
        </div>

        <p className="text-sm text-slate-500 hidden sm:block">
          {format(new Date(media.created_at), "MMM d, yyyy")}
        </p>

        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" onClick={() => onView(media)}>
            <Eye className="w-4 h-4" />
          </Button>
          {media.media_type === "image" && (
            <Button variant="ghost" size="sm" onClick={() => onCopy(media)}>
              <Copy className="w-4 h-4" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => window.open(media.storage_url, "_blank")}
          >
            <Download className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(media.id)}
            className="text-red-500 hover:text-red-700 hover:bg-red-50"
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
            >
              <Eye className="w-4 h-4" />
            </button>
            {media.media_type === "image" && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onCopy(media);
                }}
                className="p-2 bg-white rounded-full shadow-lg hover:bg-slate-100 transition-colors"
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
            >
              <Download className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="p-3">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="text-sm font-medium text-slate-900 truncate">{media.file_name}</p>
            <p className="text-xs text-slate-500">{media.category || "Uncategorized"}</p>
          </div>
          <TypeIcon className="w-4 h-4 text-slate-400 shrink-0" />
        </div>
      </div>
    </motion.div>
  );
}

// ============================================
// MEDIA VIEWER MODAL (Google Drive Style)
// ============================================

function MediaViewer({
  media,
  mediaList,
  onClose,
  onDelete,
  onCopy,
  onNavigate,
}: {
  media: Media;
  mediaList?: Media[];
  onClose: () => void;
  onDelete: (id: string) => void;
  onCopy: (media: Media) => void;
  onNavigate?: (media: Media) => void;
}) {
  const [showInfo, setShowInfo] = useState(false);
  const [zoom, setZoom] = useState(100);
  const [rotation, setRotation] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  // Get current index and navigation
  const currentIndex = mediaList?.findIndex((m) => m.id === media.id) ?? -1;
  const canNavigatePrev = currentIndex > 0;
  const canNavigateNext = currentIndex >= 0 && currentIndex < (mediaList?.length ?? 0) - 1;

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowLeft" && canNavigatePrev && mediaList && onNavigate) {
        onNavigate(mediaList[currentIndex - 1]);
      } else if (e.key === "ArrowRight" && canNavigateNext && mediaList && onNavigate) {
        onNavigate(mediaList[currentIndex + 1]);
      } else if (e.key === "+" || e.key === "=") {
        setZoom((z) => Math.min(z + 25, 300));
      } else if (e.key === "-") {
        setZoom((z) => Math.max(z - 25, 25));
      } else if (e.key === "0") {
        setZoom(100);
        setRotation(0);
      } else if (e.key === "r" || e.key === "R") {
        setRotation((r) => (r + 90) % 360);
      } else if (e.key === "i" || e.key === "I") {
        setShowInfo((s) => !s);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose, canNavigatePrev, canNavigateNext, currentIndex, mediaList, onNavigate]);

  // Fullscreen toggle
  const toggleFullscreen = async () => {
    if (!document.fullscreenElement) {
      await containerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      await document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  // Copy link to clipboard
  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(media.storage_url);
    toast.success("Link copied to clipboard!");
  };

  // Format file size
  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return "Unknown";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
      <DialogContent size="full" className="bg-slate-900 border-none p-0 max-h-screen">
        <VisuallyHidden>
          <DialogTitle>Media Preview - {media.file_name}</DialogTitle>
        </VisuallyHidden>

        <div ref={containerRef} className="flex flex-col h-screen">
          {/* Top Toolbar - Google Drive style */}
          <div className="flex items-center justify-between px-4 py-2 bg-slate-800/80 backdrop-blur-sm border-b border-slate-700 shrink-0">
            {/* Left: Back button and filename */}
            <div className="flex items-center gap-3 min-w-0">
              <button
                onClick={onClose}
                className="p-2 hover:bg-slate-700 rounded-full transition-colors"
                title="Close (Esc)"
              >
                <ArrowLeft className="w-5 h-5 text-slate-300" />
              </button>
              <div className="min-w-0">
                <h3 className="font-medium text-white truncate max-w-[300px] sm:max-w-[400px]">
                  {media.file_name}
                </h3>
                {media.creator && (
                  <p className="text-xs text-slate-400">@{media.creator.username}</p>
                )}
              </div>
            </div>

            {/* Center: Zoom controls (for images) */}
            {media.media_type === "image" && (
              <div className="hidden sm:flex items-center gap-1 bg-slate-700/50 rounded-full px-2 py-1">
                <button
                  onClick={() => setZoom((z) => Math.max(z - 25, 25))}
                  className="p-1.5 hover:bg-slate-600 rounded-full transition-colors"
                  title="Zoom out (-)"
                >
                  <ZoomOut className="w-4 h-4 text-slate-300" />
                </button>
                <span className="text-xs text-slate-300 w-12 text-center font-medium">
                  {zoom}%
                </span>
                <button
                  onClick={() => setZoom((z) => Math.min(z + 25, 300))}
                  className="p-1.5 hover:bg-slate-600 rounded-full transition-colors"
                  title="Zoom in (+)"
                >
                  <ZoomIn className="w-4 h-4 text-slate-300" />
                </button>
                <div className="w-px h-4 bg-slate-600 mx-1" />
                <button
                  onClick={() => setRotation((r) => (r + 90) % 360)}
                  className="p-1.5 hover:bg-slate-600 rounded-full transition-colors"
                  title="Rotate (R)"
                >
                  <RotateCw className="w-4 h-4 text-slate-300" />
                </button>
                <button
                  onClick={() => {
                    setZoom(100);
                    setRotation(0);
                  }}
                  className="p-1.5 hover:bg-slate-600 rounded-full transition-colors text-xs text-slate-300"
                  title="Reset (0)"
                >
                  Reset
                </button>
              </div>
            )}

            {/* Right: Actions */}
            <div className="flex items-center gap-1">
              {media.media_type === "image" && (
                <button
                  onClick={() => onCopy(media)}
                  className="p-2 hover:bg-slate-700 rounded-full transition-colors"
                  title="Copy image"
                >
                  <Copy className="w-5 h-5 text-slate-300" />
                </button>
              )}
              <button
                onClick={handleCopyLink}
                className="p-2 hover:bg-slate-700 rounded-full transition-colors"
                title="Copy link"
              >
                <Link className="w-5 h-5 text-slate-300" />
              </button>
              <button
                onClick={() => window.open(media.storage_url, "_blank")}
                className="p-2 hover:bg-slate-700 rounded-full transition-colors"
                title="Open in new tab"
              >
                <ExternalLink className="w-5 h-5 text-slate-300" />
              </button>
              <button
                onClick={() => {
                  const a = document.createElement("a");
                  a.href = media.storage_url;
                  a.download = media.file_name;
                  a.click();
                }}
                className="p-2 hover:bg-slate-700 rounded-full transition-colors"
                title="Download"
              >
                <Download className="w-5 h-5 text-slate-300" />
              </button>
              <button
                onClick={toggleFullscreen}
                className="p-2 hover:bg-slate-700 rounded-full transition-colors hidden sm:block"
                title="Toggle fullscreen"
              >
                {isFullscreen ? (
                  <Minimize className="w-5 h-5 text-slate-300" />
                ) : (
                  <Maximize className="w-5 h-5 text-slate-300" />
                )}
              </button>
              <div className="w-px h-6 bg-slate-700 mx-1" />
              <button
                onClick={() => setShowInfo((s) => !s)}
                className={`p-2 rounded-full transition-colors ${
                  showInfo ? "bg-brand-600 text-white" : "hover:bg-slate-700 text-slate-300"
                }`}
                title="Toggle info (I)"
              >
                <Info className="w-5 h-5" />
              </button>
              <button
                onClick={() => {
                  if (confirm("Delete this media? This cannot be undone.")) {
                    onDelete(media.id);
                    onClose();
                  }
                }}
                className="p-2 hover:bg-red-500/20 rounded-full transition-colors"
                title="Delete"
              >
                <Trash2 className="w-5 h-5 text-red-400" />
              </button>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 flex overflow-hidden">
            {/* Media Preview */}
            <div className="flex-1 relative flex items-center justify-center bg-slate-900 overflow-auto">
              {/* Navigation arrows */}
              {canNavigatePrev && mediaList && onNavigate && (
                <button
                  onClick={() => onNavigate(mediaList[currentIndex - 1])}
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-slate-800/80 hover:bg-slate-700 rounded-full transition-colors z-10"
                  title="Previous (←)"
                >
                  <ChevronLeft className="w-6 h-6 text-white" />
                </button>
              )}
              {canNavigateNext && mediaList && onNavigate && (
                <button
                  onClick={() => onNavigate(mediaList[currentIndex + 1])}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-slate-800/80 hover:bg-slate-700 rounded-full transition-colors z-10"
                  title="Next (→)"
                >
                  <ChevronRight className="w-6 h-6 text-white" />
                </button>
              )}

              {/* Loading spinner */}
              {isLoading && media.media_type === "image" && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Loader2 className="w-10 h-10 text-brand-500 animate-spin" />
                </div>
              )}

              {/* Media content */}
              {media.media_type === "image" ? (
                <img
                  src={media.storage_url}
                  alt={media.file_name}
                  className="max-w-full max-h-full object-contain transition-all duration-200"
                  style={{
                    transform: `scale(${zoom / 100}) rotate(${rotation}deg)`,
                    opacity: isLoading ? 0 : 1,
                  }}
                  onLoad={() => setIsLoading(false)}
                  draggable={false}
                />
              ) : media.media_type === "video" ? (
                <video
                  src={media.storage_url}
                  controls
                  autoPlay
                  className="max-w-full max-h-full rounded-lg"
                  style={{ maxHeight: "calc(100vh - 120px)" }}
                />
              ) : (
                <div className="flex flex-col items-center gap-6">
                  <div className="w-32 h-32 bg-slate-800 rounded-2xl flex items-center justify-center">
                    <Music className="w-16 h-16 text-orange-400" />
                  </div>
                  <audio src={media.storage_url} controls autoPlay className="w-full max-w-lg" />
                </div>
              )}

              {/* Counter badge */}
              {mediaList && mediaList.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-slate-800/80 rounded-full text-sm text-slate-300">
                  {currentIndex + 1} / {mediaList.length}
                </div>
              )}
            </div>

            {/* Info Panel */}
            <AnimatePresence>
              {showInfo && (
                <motion.div
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: 320, opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="border-l border-slate-700 bg-slate-800 overflow-hidden shrink-0"
                >
                  <div className="w-80 p-4 space-y-6 overflow-y-auto h-full">
                    {/* File Details */}
                    <div>
                      <h4 className="text-sm font-semibold text-slate-300 mb-3 uppercase tracking-wider">
                        Details
                      </h4>
                      <dl className="space-y-3">
                        <div>
                          <dt className="text-xs text-slate-500">File name</dt>
                          <dd className="text-sm text-white break-all">{media.file_name}</dd>
                        </div>
                        <div>
                          <dt className="text-xs text-slate-500">Type</dt>
                          <dd className="text-sm text-white capitalize">{media.media_type}</dd>
                        </div>
                        <div>
                          <dt className="text-xs text-slate-500">Size</dt>
                          <dd className="text-sm text-white">
                            {formatFileSize(media.file_size_bytes)}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-xs text-slate-500">Category</dt>
                          <dd className="text-sm text-white">
                            {media.category || "Uncategorized"}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-xs text-slate-500">Created</dt>
                          <dd className="text-sm text-white">
                            {format(new Date(media.created_at), "PPP 'at' p")}
                          </dd>
                        </div>
                        {media.creator && (
                          <div>
                            <dt className="text-xs text-slate-500">Creator</dt>
                            <dd className="text-sm text-white">@{media.creator.username}</dd>
                          </div>
                        )}
                      </dl>
                    </div>

                    {/* Quick Actions */}
                    <div>
                      <h4 className="text-sm font-semibold text-slate-300 mb-3 uppercase tracking-wider">
                        Actions
                      </h4>
                      <div className="space-y-2">
                        <button
                          onClick={() => {
                            const a = document.createElement("a");
                            a.href = media.storage_url;
                            a.download = media.file_name;
                            a.click();
                          }}
                          className="w-full flex items-center gap-3 px-3 py-2 text-sm text-slate-300 hover:bg-slate-700 rounded-lg transition-colors"
                        >
                          <Download className="w-4 h-4" />
                          Download
                        </button>
                        {media.media_type === "image" && (
                          <button
                            onClick={() => onCopy(media)}
                            className="w-full flex items-center gap-3 px-3 py-2 text-sm text-slate-300 hover:bg-slate-700 rounded-lg transition-colors"
                          >
                            <Copy className="w-4 h-4" />
                            Copy to clipboard
                          </button>
                        )}
                        <button
                          onClick={handleCopyLink}
                          className="w-full flex items-center gap-3 px-3 py-2 text-sm text-slate-300 hover:bg-slate-700 rounded-lg transition-colors"
                        >
                          <Link className="w-4 h-4" />
                          Copy link
                        </button>
                        <button
                          onClick={() => window.open(media.storage_url, "_blank")}
                          className="w-full flex items-center gap-3 px-3 py-2 text-sm text-slate-300 hover:bg-slate-700 rounded-lg transition-colors"
                        >
                          <ExternalLink className="w-4 h-4" />
                          Open in new tab
                        </button>
                        <button
                          onClick={() => {
                            if (confirm("Delete this media? This cannot be undone.")) {
                              onDelete(media.id);
                              onClose();
                            }
                          }}
                          className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete
                        </button>
                      </div>
                    </div>

                    {/* Keyboard Shortcuts */}
                    <div>
                      <h4 className="text-sm font-semibold text-slate-300 mb-3 uppercase tracking-wider">
                        Keyboard Shortcuts
                      </h4>
                      <div className="space-y-2 text-xs text-slate-400">
                        <div className="flex justify-between">
                          <span>Close</span>
                          <kbd className="px-2 py-0.5 bg-slate-700 rounded">Esc</kbd>
                        </div>
                        <div className="flex justify-between">
                          <span>Previous/Next</span>
                          <span>
                            <kbd className="px-2 py-0.5 bg-slate-700 rounded">←</kbd>{" "}
                            <kbd className="px-2 py-0.5 bg-slate-700 rounded">→</kbd>
                          </span>
                        </div>
                        {media.media_type === "image" && (
                          <>
                            <div className="flex justify-between">
                              <span>Zoom in/out</span>
                              <span>
                                <kbd className="px-2 py-0.5 bg-slate-700 rounded">+</kbd>{" "}
                                <kbd className="px-2 py-0.5 bg-slate-700 rounded">-</kbd>
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span>Rotate</span>
                              <kbd className="px-2 py-0.5 bg-slate-700 rounded">R</kbd>
                            </div>
                            <div className="flex justify-between">
                              <span>Reset view</span>
                              <kbd className="px-2 py-0.5 bg-slate-700 rounded">0</kbd>
                            </div>
                          </>
                        )}
                        <div className="flex justify-between">
                          <span>Toggle info</span>
                          <kbd className="px-2 py-0.5 bg-slate-700 rounded">I</kbd>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ============================================
// UPLOAD MODAL
// ============================================

interface UploadFile {
  file: File;
  id: string;
  progress: number;
  status: "pending" | "uploading" | "complete" | "error";
  media?: Media;
  error?: string;
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
  userRole: "admin" | "studio" | "model";
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
    const uploadFiles: UploadFile[] = newFiles.map((file) => ({
      file,
      id: `${file.name}-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      progress: 0,
      status: "pending",
    }));
    setFiles((prev) => [...prev, ...uploadFiles]);
  };

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
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
            setFiles((prev) =>
              prev.map((f) => (f.id === uploadFile.id ? { ...f, progress } : f))
            );
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
          {(userRole === "admin" || userRole === "studio") && (
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

          {/* File List */}
          {files.length > 0 && (
            <div className="space-y-2 max-h-60 overflow-y-auto">
              <div className="flex items-center justify-between text-sm text-slate-500">
                <span>{files.length} file(s) selected</span>
                {completeCount > 0 && (
                  <span className="text-green-600">{completeCount} uploaded</span>
                )}
              </div>
              {files.map((uploadFile) => {
                const FileIcon = getFileIcon(uploadFile.file);
                return (
                  <div
                    key={uploadFile.id}
                    className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg"
                  >
                    <FileIcon className="w-5 h-5 text-slate-400 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-700 truncate">
                        {uploadFile.file.name}
                      </p>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-500">
                          {formatFileSize(uploadFile.file.size)}
                        </span>
                        {uploadFile.status === "uploading" && (
                          <div className="flex-1 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-brand-500 transition-all"
                              style={{ width: `${uploadFile.progress}%` }}
                            />
                          </div>
                        )}
                        {uploadFile.status === "error" && (
                          <span className="text-xs text-red-500">{uploadFile.error}</span>
                        )}
                      </div>
                    </div>
                    {uploadFile.status === "pending" && !isUploading && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeFile(uploadFile.id);
                        }}
                        className="p-1 hover:bg-slate-200 rounded"
                      >
                        <X className="w-4 h-4 text-slate-400" />
                      </button>
                    )}
                    {uploadFile.status === "uploading" && (
                      <Loader2 className="w-4 h-4 text-brand-500 animate-spin" />
                    )}
                    {uploadFile.status === "complete" && (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    )}
                    {uploadFile.status === "error" && (
                      <XCircle className="w-4 h-4 text-red-500" />
                    )}
                  </div>
                );
              })}
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
            disabled={isUploading || pendingCount === 0 || (userRole !== "model" && !creatorId)}
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
  const [media, setMedia] = useState<Media[]>([]);
  const [creators, setCreators] = useState<Creator[]>([]);
  const [categories, setCategories] = useState<MediaCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("folders");
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

  const isAdminOrStudio = user?.role === "admin" || user?.role === "studio";
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

  // Fetch creators and their media counts for folder view
  const fetchCreators = useCallback(async () => {
    if (!apiKey || !isAdminOrStudio) return;

    try {
      const api = createApiClient(apiKey);
      const response = await api.listCreators({
        studio_id: user?.role === "studio" ? user?.studio_id || undefined : undefined,
      });

      if (response.success && response.data) {
        setCreators(response.data);

        // Fetch media counts for each creator
        const counts: CreatorMediaCounts = {};
        let totalImage = 0, totalVideo = 0, totalAudio = 0;

        // Fetch all media to calculate counts (more efficient than per-creator API calls)
        const allMediaResponse = await api.listMedia({ limit: 5000 });
        if (allMediaResponse.success && allMediaResponse.data) {
          allMediaResponse.data.forEach((m: Media) => {
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
      }
    } catch (err) {
      console.error("Error fetching creators:", err);
    }
  }, [apiKey, isAdminOrStudio, user]);

  const fetchMedia = useCallback(
    async (reset = false) => {
      if (!apiKey) return;

      setIsLoading(true);
      setError(null);

      try {
        const api = createApiClient(apiKey);
        const offset = reset ? 0 : pagination.offset;

        // Determine creator_id filter
        let creatorIdFilter: string | undefined;
        if (user?.role === "model") {
          creatorIdFilter = user?.creator_id || undefined;
        } else if (selectedCreator) {
          creatorIdFilter = selectedCreator;
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
          date_from: filters.dateFrom || undefined,
          date_to: filters.dateTo || undefined,
          limit: pagination.limit,
          offset,
          sort_order: "desc",
        });

        if (response.success && response.data) {
          let newData = response.data;

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

        // Fetch categories
        const catResponse = await api.getMediaCategories(creatorIdFilter);
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
    [apiKey, filters, pagination.offset, pagination.limit, user, selectedCreator]
  );

  useEffect(() => {
    fetchCreators();
  }, [fetchCreators]);

  useEffect(() => {
    fetchMedia(true);
  }, [apiKey, filters, selectedCreator]); // eslint-disable-line react-hooks/exhaustive-deps

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
      const response = await fetch(mediaItem.storage_url);
      const blob = await response.blob();

      await navigator.clipboard.write([
        new ClipboardItem({
          [blob.type]: blob,
        }),
      ]);

      toast.success("Image copied to clipboard!");
    } catch (err) {
      console.error("Failed to copy image:", err);
      // Fallback: copy URL instead
      await navigator.clipboard.writeText(mediaItem.storage_url);
      toast.success("Image URL copied to clipboard!");
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

        {/* Category Filters (shown when inside a creator folder or for models) */}
        {(currentPath.length > 0 || !isAdminOrStudio) && categories.length > 0 && (
          <div className="p-4 border-t border-slate-200 bg-gradient-to-r from-slate-50 to-white">
            <div className="flex items-center gap-3 mb-3">
              <Sparkles className="w-4 h-4 text-brand-500" />
              <span className="text-sm font-medium text-slate-700">Filter by category</span>
              {filters.categories.size > 0 && (
                <span className="text-xs bg-brand-100 text-brand-700 px-2 py-0.5 rounded-full">
                  {filters.categories.size} selected
                </span>
              )}
            </div>
            <CategoryFilter
              categories={categories}
              selectedCategories={filters.categories}
              onToggle={toggleCategoryFilter}
            />
          </div>
        )}

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
      {isLoading && media.length === 0 ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-brand-600 animate-spin" />
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-500" />
          <p className="text-red-700">{error}</p>
        </div>
      ) : viewMode === "folders" && currentPath.length === 0 && isAdminOrStudio ? (
        // Folder view at root
        folderItems.length === 0 ? (
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-12 text-center">
            <FolderOpen className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="font-semibold text-slate-700 mb-2">No models found</h3>
            <p className="text-slate-500 text-sm">Add models to see their media here</p>
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
          <FolderOpen className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h3 className="font-semibold text-slate-700 mb-2">No media found</h3>
          <p className="text-slate-500 text-sm">
            {hasActiveFilters
              ? "Try adjusting your filters"
              : "Start uploading content to see it here"}
          </p>
        </div>
      ) : (
        <>

          {/* Media grid/list */}
          <div className="space-y-4">
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
                    onView={setViewingMedia}
                    onDelete={handleDelete}
                    onCopy={handleCopyImage}
                    viewMode="list"
                  />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {media.map((item) => (
                  <MediaCard
                    key={item.id}
                    media={item}
                    isSelected={selectedIds.has(item.id)}
                    onSelect={handleSelect}
                    onView={setViewingMedia}
                    onDelete={handleDelete}
                    onCopy={handleCopyImage}
                    viewMode="grid"
                  />
                ))}
              </div>
            )}
          </div>

          {/* Infinite Scroll Trigger */}
          {pagination.hasMore && (
            <InfiniteScrollTrigger
              onTrigger={() => {
                if (!isLoading) {
                  setPagination((prev) => ({
                    ...prev,
                    offset: prev.offset + prev.limit,
                  }));
                  fetchMedia(false);
                }
              }}
              isLoading={isLoading}
            />
          )}
        </>
      )}

      {/* Media Viewer Modal */}
      <AnimatePresence>
        {viewingMedia && (
          <MediaViewer
            media={viewingMedia}
            mediaList={media}
            onClose={() => setViewingMedia(null)}
            onDelete={handleDelete}
            onCopy={handleCopyImage}
            onNavigate={setViewingMedia}
          />
        )}
      </AnimatePresence>

      {/* Upload Modal */}
      {apiKey && user && (
        <UploadModal
          isOpen={showUploadModal}
          onClose={() => setShowUploadModal(false)}
          creators={creators}
          selectedCreatorId={user.role === "model" ? user.creator_id : selectedCreator}
          userRole={user.role as "admin" | "studio" | "model"}
          apiKey={apiKey}
          onUploadComplete={() => {
            fetchMedia(true);
            setShowUploadModal(false);
          }}
        />
      )}
    </div>
  );
}

