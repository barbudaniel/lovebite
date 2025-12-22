"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Copy,
  Download,
  ExternalLink,
  Info,
  Link,
  Loader2,
  Maximize,
  Minimize,
  Music,
  Save,
  Trash2,
  ZoomIn,
  ZoomOut,
  X,
  Edit3,
  Eye,
  RefreshCw,
  Check,
  AlertTriangle,
  Sparkles,
  MoreVertical,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  VisuallyHidden,
} from "@/components/ui/dialog-centered";
import type { Media } from "@/lib/media-api";

// ============================================
// TYPES
// ============================================

interface MediaMetadata {
  id?: string;
  media_id: string;
  media_type: string;
  is_nsfw: boolean;
  style: string | null;
  source_type: string;
  body_focus: string[];
  content_tags: string[];
  photo_description: string | null;
  categories: string[];
  storage_url: string;
  pinecone_id?: string | null;
  pinecone_synced_at?: string | null;
  rerank_score?: number;
}

interface MediaViewerProps {
  media: Media;
  mediaList?: Media[];
  onClose: () => void;
  onDelete: (id: string) => void;
  onCopy: (media: Media) => void;
  onNavigate?: (media: Media) => void;
  onCopyPermalink?: (id: string) => void;
  permalink?: string;
  userRole?: "admin" | "business" | "independent";
}

// ============================================
// CONSTANTS
// ============================================

const STYLE_OPTIONS = [
  "selfie",
  "professional",
  "casual",
  "artistic",
  "candid",
  "posed",
];

const BODY_FOCUS_OPTIONS = [
  "full_body",
  "upper_body",
  "lower_body",
  "face",
  "back",
  "side",
];

const CATEGORY_OPTIONS = [
  "Lingerie",
  "Bikini",
  "Nude",
  "Feet",
  "Casual",
  "Cosplay",
  "Fitness",
  "Outdoor",
  "Indoor",
  "Professional",
  "Selfie",
  "PPV",
];

// ============================================
// DRAGGABLE SCROLL COMPONENT
// ============================================

function DraggableScroll({ 
  children, 
  className 
}: { 
  children: React.ReactNode; 
  className?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - containerRef.current.offsetLeft);
    setScrollLeft(containerRef.current.scrollLeft);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !containerRef.current) return;
    e.preventDefault();
    const x = e.pageX - containerRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    containerRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!containerRef.current) return;
    setIsDragging(true);
    setStartX(e.touches[0].pageX - containerRef.current.offsetLeft);
    setScrollLeft(containerRef.current.scrollLeft);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || !containerRef.current) return;
    const x = e.touches[0].pageX - containerRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    containerRef.current.scrollLeft = scrollLeft - walk;
  };

  return (
    <div
      ref={containerRef}
      className={className}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onMouseMove={handleMouseMove}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleMouseUp}
      onTouchMove={handleTouchMove}
      style={{ 
        userSelect: isDragging ? 'none' : 'auto',
        scrollbarWidth: 'none', // Firefox
        msOverflowStyle: 'none', // IE/Edge
      }}
    >
      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
      {children}
    </div>
  );
}

// ============================================
// TAG INPUT COMPONENT
// ============================================

function TagInput({
  label,
  tags,
  onChange,
  suggestions,
  placeholder,
}: {
  label: string;
  tags: string[];
  onChange: (tags: string[]) => void;
  suggestions?: string[];
  placeholder?: string;
}) {
  const [input, setInput] = useState("");

  const addTag = (tag: string) => {
    const trimmed = tag.trim().toLowerCase();
    if (trimmed && !tags.includes(trimmed)) {
      onChange([...tags, trimmed]);
    }
    setInput("");
  };

  const removeTag = (tag: string) => {
    onChange(tags.filter((t) => t !== tag));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag(input);
    } else if (e.key === "Backspace" && !input && tags.length > 0) {
      removeTag(tags[tags.length - 1]);
    }
  };

  return (
    <div className="space-y-2">
      <Label className="text-xs text-slate-500">{label}</Label>
      <div className="flex flex-wrap gap-1.5 p-2 bg-slate-50 border border-slate-200 rounded-lg min-h-[38px]">
        {tags.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1 px-2 py-0.5 bg-brand-100 text-brand-700 rounded text-xs"
          >
            {tag}
            <button
              onClick={() => removeTag(tag)}
              className="hover:text-brand-900"
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={tags.length === 0 ? placeholder : ""}
          className="flex-1 min-w-[100px] bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400"
        />
      </div>
      {suggestions && suggestions.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {suggestions
            .filter((s) => !tags.includes(s.toLowerCase()))
            .slice(0, 6)
            .map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => addTag(suggestion)}
                className="px-2 py-0.5 text-xs bg-slate-100 text-slate-600 rounded hover:bg-slate-200 transition-colors"
              >
                + {suggestion}
              </button>
            ))}
        </div>
      )}
    </div>
  );
}

// ============================================
// MULTI-SELECT PILLS
// ============================================

function MultiSelectPills({
  label,
  options,
  selected,
  onChange,
}: {
  label: string;
  options: string[];
  selected: string[];
  onChange: (selected: string[]) => void;
}) {
  const toggle = (option: string) => {
    if (selected.includes(option)) {
      onChange(selected.filter((s) => s !== option));
    } else {
      onChange([...selected, option]);
    }
  };

  return (
    <div className="space-y-2">
      <Label className="text-xs text-slate-500">{label}</Label>
      <div className="flex flex-wrap gap-1.5">
        {options.map((option) => (
          <button
            key={option}
            onClick={() => toggle(option)}
            className={`px-2.5 py-1 text-xs rounded-full transition-colors ${
              selected.includes(option)
                ? "bg-brand-500 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}

// ============================================
// MAIN COMPONENT
// ============================================

export default function MediaViewer({
  media,
  mediaList,
  onClose,
  onDelete,
  onCopy,
  onNavigate,
  onCopyPermalink,
  permalink,
  userRole = "independent",
}: MediaViewerProps) {
  // Detect mobile for initial info panel state
  const [isMobile, setIsMobile] = useState(false);
  const [showInfo, setShowInfo] = useState(false); // Default to false
  const [showMenu, setShowMenu] = useState(false);
  const [zoom, setZoom] = useState(100);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  
  // Pan/drag state
  const [isPanning, setIsPanning] = useState(false);
  const [panPosition, setPanPosition] = useState({ x: 0, y: 0 });
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const imageContainerRef = useRef<HTMLDivElement>(null);
  
  // Double-tap zoom state (mobile only)
  const lastTapRef = useRef<number>(0);
  
  // Show username only for admin/business
  const showUsername = userRole === "admin" || userRole === "business";
  
  // Initialize mobile detection
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);
  
  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Metadata state
  const [metadata, setMetadata] = useState<MediaMetadata | null>(null);
  const [isMetadataLoading, setIsMetadataLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editedMetadata, setEditedMetadata] = useState<Partial<MediaMetadata>>({});

  // Navigation
  const currentIndex = mediaList?.findIndex((m) => m.id === media.id) ?? -1;
  const canNavigatePrev = currentIndex > 0;
  const canNavigateNext = currentIndex >= 0 && currentIndex < (mediaList?.length ?? 0) - 1;

  // Preload adjacent images (3 left, 3 right) for smooth navigation
  useEffect(() => {
    if (!mediaList || currentIndex < 0) return;
    
    const imagesToPreload: string[] = [];
    
    // Preload 3 images before
    for (let i = 1; i <= 3; i++) {
      const prevIndex = currentIndex - i;
      if (prevIndex >= 0 && mediaList[prevIndex]?.media_type === "image") {
        imagesToPreload.push(mediaList[prevIndex].storage_url);
      }
    }
    
    // Preload 3 images after
    for (let i = 1; i <= 3; i++) {
      const nextIndex = currentIndex + i;
      if (nextIndex < mediaList.length && mediaList[nextIndex]?.media_type === "image") {
        imagesToPreload.push(mediaList[nextIndex].storage_url);
      }
    }
    
    // Preload images
    imagesToPreload.forEach((url) => {
      const img = new Image();
      img.src = url;
    });
  }, [currentIndex, mediaList]);

  // Fetch metadata on mount
  useEffect(() => {
    fetchMetadata();
  }, [media.id]);

  const fetchMetadata = async () => {
    setIsMetadataLoading(true);
    try {
      const response = await fetch(
        `/api/media/${media.id}/metadata?url=${encodeURIComponent(media.storage_url)}`
      );
      const data = await response.json();
      if (data.success && data.data) {
        setMetadata(data.data);
        setEditedMetadata(data.data);
      } else {
        // No metadata found - create initial structure
        setMetadata(null);
        setEditedMetadata({
          media_type: media.media_type,
          is_nsfw: false,
          style: null,
          body_focus: [],
          content_tags: [],
          categories: media.category ? [media.category] : [],
          photo_description: null,
        });
      }
    } catch (error) {
      console.error("Error fetching metadata:", error);
    } finally {
      setIsMetadataLoading(false);
    }
  };

  const syncFromPinecone = async () => {
    setIsSyncing(true);
    try {
      const response = await fetch(`/api/media/${media.id}/metadata`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          storageUrl: media.storage_url,
          forceSync: true,
        }),
      });
      const data = await response.json();
      if (data.success && data.data) {
        setMetadata(data.data);
        setEditedMetadata(data.data);
        toast.success("Synced metadata from AI analysis");
      } else {
        toast.info("No AI metadata found for this media");
      }
    } catch (error) {
      toast.error("Failed to sync metadata");
    } finally {
      setIsSyncing(false);
    }
  };

  const saveMetadata = async () => {
    setIsSaving(true);
    try {
      const response = await fetch(`/api/media/${media.id}/metadata`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...editedMetadata,
          storage_url: media.storage_url,
          media_type: media.media_type,
        }),
      });
      const data = await response.json();
      if (data.success) {
        setMetadata(data.data);
        setIsEditing(false);
        toast.success("Metadata saved successfully");
      } else {
        toast.error("Failed to save metadata");
      }
    } catch (error) {
      toast.error("Failed to save metadata");
    } finally {
      setIsSaving(false);
    }
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isEditing) return; // Disable shortcuts when editing

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
        setPanPosition({ x: 0, y: 0 });
      } else if (e.key === "i" || e.key === "I") {
        setShowInfo((s) => !s);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose, canNavigatePrev, canNavigateNext, currentIndex, mediaList, onNavigate, isEditing]);
  
  // Handle double-click to zoom (desktop)
  const handleDoubleClickZoom = (e: React.MouseEvent) => {
    // Only on desktop
    if (isMobile) return;
    
    // Check if the click target is the image or the container, not buttons
    const target = e.target as HTMLElement;
    if (target.tagName === "BUTTON" || target.closest("button")) return;
    
    if (zoom === 100) {
      setZoom(200);
    } else {
      setZoom(100);
      setPanPosition({ x: 0, y: 0 });
    }
  };
  
  // Touch gesture state for mobile
  const touchStartRef = useRef<{ x: number; y: number; time: number } | null>(null);
  const initialPinchDistanceRef = useRef<number | null>(null);
  const initialZoomRef = useRef<number>(100);
  
  // Handle double-tap to zoom (mobile only, images only)
  const handleTouchStart = (e: React.TouchEvent) => {
    if (!isMobile || media.media_type !== "image") return;
    
    // Handle pinch-to-zoom start
    if (e.touches.length === 2) {
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const distance = Math.hypot(
        touch2.clientX - touch1.clientX,
        touch2.clientY - touch1.clientY
      );
      initialPinchDistanceRef.current = distance;
      initialZoomRef.current = zoom;
      return;
    }
    
    const now = Date.now();
    const touch = e.touches[0];
    const DOUBLE_TAP_DELAY = 300;
    
    // Check for double-tap
    if (now - lastTapRef.current < DOUBLE_TAP_DELAY) {
      e.preventDefault();
      if (zoom === 100) {
        setZoom(200);
      } else {
        setZoom(100);
        setPanPosition({ x: 0, y: 0 });
      }
      lastTapRef.current = 0; // Reset to prevent triple-tap
      return;
    }
    
    lastTapRef.current = now;
    
    // Store touch start for panning when zoomed
    if (zoom > 100) {
      touchStartRef.current = {
        x: touch.clientX - panPosition.x,
        y: touch.clientY - panPosition.y,
        time: now,
      };
    }
  };
  
  // Handle touch move for panning and pinch zoom (mobile only, images only)
  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isMobile || media.media_type !== "image") return;
    
    // Handle pinch-to-zoom
    if (e.touches.length === 2 && initialPinchDistanceRef.current !== null) {
      e.preventDefault();
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const distance = Math.hypot(
        touch2.clientX - touch1.clientX,
        touch2.clientY - touch1.clientY
      );
      const scale = distance / initialPinchDistanceRef.current;
      const newZoom = Math.max(25, Math.min(300, initialZoomRef.current * scale));
      setZoom(Math.round(newZoom));
      return;
    }
    
    // Handle panning when zoomed
    if (zoom > 100 && touchStartRef.current && e.touches.length === 1) {
      e.preventDefault();
      const touch = e.touches[0];
      setPanPosition({
        x: touch.clientX - touchStartRef.current.x,
        y: touch.clientY - touchStartRef.current.y,
      });
    }
  };
  
  // Handle touch end
  const handleTouchEnd = () => {
    touchStartRef.current = null;
    initialPinchDistanceRef.current = null;
  };

  // Reset pan when zoom changes
  useEffect(() => {
    if (zoom <= 100) {
      setPanPosition({ x: 0, y: 0 });
    }
  }, [zoom]);

  // Pan/drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoom > 100 && e.button === 0) {
      e.preventDefault();
      setIsPanning(true);
      setDragStart({
        x: e.clientX - panPosition.x,
        y: e.clientY - panPosition.y,
      });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isPanning && zoom > 100) {
      setPanPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsPanning(false);
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -25 : 25;
      setZoom((z) => Math.max(25, Math.min(300, z + delta)));
    }
  };

  // Fullscreen
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

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(media.storage_url);
    toast.success("Direct link copied!");
  };

  const handleCopyPermalink = async () => {
    if (onCopyPermalink) {
      onCopyPermalink(media.id);
    } else if (permalink) {
      await navigator.clipboard.writeText(permalink);
      toast.success("Permalink copied!");
    }
  };

  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return "Unknown";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
      <DialogContent size="full" className="bg-white border-none p-0 max-h-screen">
        <VisuallyHidden>
          <DialogTitle>Media Preview</DialogTitle>
        </VisuallyHidden>

        <div ref={containerRef} className="flex flex-col h-screen">
          {/* Top Toolbar */}
          <div className="flex items-center justify-between px-3 py-2.5 sm:px-4 sm:py-3 bg-white border-b border-slate-200 shrink-0 relative z-50">
            {/* Left: Back and creator (only for admin/business) */}
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <button
                onClick={onClose}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-slate-600" />
              </button>
              {showUsername && (
                <p className="text-sm text-slate-600">@{media.creator?.username || "unknown"}</p>
              )}
            </div>

            {/* Center: Zoom controls (desktop only) */}
            {media.media_type === "image" && (
              <div className="hidden md:flex items-center gap-1 bg-slate-100 rounded-lg px-2 py-1">
                <button
                  onClick={() => setZoom((z) => Math.max(z - 25, 25))}
                  className="p-1.5 hover:bg-slate-200 rounded transition-colors"
                >
                  <ZoomOut className="w-4 h-4 text-slate-600" />
                </button>
                <span className="text-xs text-slate-600 w-12 text-center font-mono">{zoom}%</span>
                <button
                  onClick={() => setZoom((z) => Math.min(z + 25, 300))}
                  className="p-1.5 hover:bg-slate-200 rounded transition-colors"
                >
                  <ZoomIn className="w-4 h-4 text-slate-600" />
                </button>
                <button
                  onClick={() => { setZoom(100); setPanPosition({ x: 0, y: 0 }); }}
                  className="px-2 py-1 text-xs text-slate-600 hover:bg-slate-200 rounded transition-colors"
                >
                  Reset
                </button>
              </div>
            )}

            {/* Right: Simplified Actions */}
            <div className="flex items-center gap-1">
              {/* Download */}
              <button
                onClick={() => {
                  const a = document.createElement("a");
                  a.href = media.storage_url;
                  a.download = media.file_name;
                  a.click();
                }}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                title="Download"
              >
                <Download className="w-5 h-5 text-slate-600" />
              </button>
              
              {/* Info Toggle */}
              <button
                onClick={() => setShowInfo((s) => !s)}
                className={`p-2 rounded-lg transition-colors ${
                  showInfo ? "bg-brand-600 text-white" : "hover:bg-slate-100 text-slate-600"
                }`}
                title="Info panel"
              >
                <Info className="w-5 h-5" />
              </button>
              
              {/* More Actions Dropdown */}
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setShowMenu(!showMenu)}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                  title="More actions"
                >
                  <MoreVertical className="w-5 h-5 text-slate-600" />
                </button>
                
                {/* Dropdown Menu */}
                <AnimatePresence>
                  {showMenu && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: -10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -10 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-full mt-1 w-48 bg-white rounded-xl border border-slate-200 shadow-xl py-1 z-[100]"
                    >
                      {media.media_type === "image" && (
                        <button
                          onClick={() => { onCopy(media); setShowMenu(false); }}
                          className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                        >
                          <Copy className="w-4 h-4" />
                          Copy image
                        </button>
                      )}
                      <button
                        onClick={() => { handleCopyLink(); setShowMenu(false); }}
                        className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                      >
                        <Link className="w-4 h-4" />
                        Copy direct link
                      </button>
                      {(onCopyPermalink || permalink) && (
                        <button
                          onClick={() => { handleCopyPermalink(); setShowMenu(false); }}
                          className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                        >
                          <ExternalLink className="w-4 h-4" />
                          Copy permalink
                        </button>
                      )}
                      <button
                        onClick={() => { window.open(media.storage_url, "_blank"); setShowMenu(false); }}
                        className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                      >
                        <ExternalLink className="w-4 h-4" />
                        Open in new tab
                      </button>
                      <button
                        onClick={() => { toggleFullscreen(); setShowMenu(false); }}
                        className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                      >
                        {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
                        {isFullscreen ? "Exit fullscreen" : "Fullscreen"}
                      </button>
                      <div className="h-px bg-slate-200 my-1" />
                      <button
                        onClick={() => {
                          setShowMenu(false);
                          if (confirm("Delete this media? This cannot be undone.")) {
                            onDelete(media.id);
                            onClose();
                          }
                        }}
                        className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 flex overflow-hidden relative">
            {/* Media Preview - Full width on mobile */}
            <div 
              ref={imageContainerRef}
              className={`flex-1 relative flex items-center justify-center bg-slate-100 overflow-hidden ${
                !isMobile && zoom > 100 ? (isPanning ? "cursor-grabbing" : "cursor-grab") : ""
              }`}
              style={{
                // Prevent browser's native zoom gestures on the container for images
                touchAction: isMobile && media.media_type === "image" ? "none" : "auto",
              }}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onWheel={handleWheel}
              onDoubleClick={handleDoubleClickZoom}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              {/* Navigation arrows */}
              {canNavigatePrev && mediaList && onNavigate && (
                <button
                  onClick={(e) => { e.stopPropagation(); onNavigate(mediaList[currentIndex - 1]); }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/90 hover:bg-white shadow-lg rounded-full z-10 transition-colors"
                >
                  <ChevronLeft className="w-6 h-6 text-slate-700" />
                </button>
              )}
              {canNavigateNext && mediaList && onNavigate && (
                <button
                  onClick={(e) => { e.stopPropagation(); onNavigate(mediaList[currentIndex + 1]); }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/90 hover:bg-white shadow-lg rounded-full z-10 transition-colors"
                >
                  <ChevronRight className="w-6 h-6 text-slate-700" />
                </button>
              )}

              {/* Loading spinner */}
              {isImageLoading && media.media_type === "image" && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Loader2 className="w-10 h-10 text-brand-500 animate-spin" />
                </div>
              )}

              {/* Media */}
              {media.media_type === "image" ? (
                <img
                  src={media.storage_url}
                  alt={media.file_name}
                  className="max-w-full max-h-full object-contain select-none"
                  style={{
                    transform: `translate(${panPosition.x}px, ${panPosition.y}px) scale(${zoom / 100})`,
                    opacity: isImageLoading ? 0 : 1,
                    transition: isPanning ? "none" : "transform 0.2s ease-out",
                  }}
                  onLoad={() => setIsImageLoading(false)}
                  draggable={false}
                />
              ) : media.media_type === "video" ? (
                <video
                  src={media.storage_url}
                  controls
                  autoPlay
                  className="max-w-full max-h-full"
                  style={{ maxWidth: "100%", maxHeight: "100%" }}
                />
              ) : (
                <div className="flex flex-col items-center gap-6">
                  <div className="w-32 h-32 bg-orange-100 rounded-2xl flex items-center justify-center">
                    <Music className="w-16 h-16 text-orange-500" />
                  </div>
                  <audio src={media.storage_url} controls autoPlay className="w-full max-w-lg" />
                </div>
              )}

              {/* Counter */}
              {mediaList && mediaList.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-white/90 backdrop-blur-sm shadow-sm rounded-full text-sm text-slate-600 font-mono">
                  {currentIndex + 1} / {mediaList.length}
                </div>
              )}
              
              {/* Pan hint */}
              {zoom > 100 && !isPanning && !isMobile && (
                <div className="absolute top-4 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-white/90 backdrop-blur-sm shadow-sm rounded-full text-xs text-slate-500">
                  Drag to pan • Ctrl+Scroll to zoom
                </div>
              )}
              
              {/* Desktop zoom hint */}
              {zoom === 100 && media.media_type === "image" && !isMobile && (
                <div className="absolute bottom-20 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-white/90 backdrop-blur-sm shadow-sm rounded-full text-xs text-slate-500">
                  Double-click to zoom
                </div>
              )}
              
              {/* Mobile zoom hint */}
              {zoom === 100 && media.media_type === "image" && isMobile && (
                <div className="absolute bottom-20 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-white/90 backdrop-blur-sm shadow-sm rounded-full text-xs text-slate-500">
                  Double-tap to zoom
                </div>
              )}
            </div>

            {/* Info Panel - Glass sheet on mobile, sidebar on desktop */}
            <AnimatePresence>
              {showInfo && (
                <motion.div
                  initial={isMobile ? { y: "100%" } : { width: 0, opacity: 0 }}
                  animate={isMobile ? { y: 0 } : { width: 360, opacity: 1 }}
                  exit={isMobile ? { y: "100%" } : { width: 0, opacity: 0 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  className={`overflow-hidden shrink-0 ${
                    isMobile 
                      ? "absolute bottom-0 left-0 right-0 z-20 rounded-t-2xl max-h-[70vh] bg-white/80 backdrop-blur-xl border-t border-slate-200 shadow-2xl" 
                      : "border-l border-slate-200 bg-white"
                  }`}
                >
                  <div className={`${isMobile ? "w-full" : "w-[360px]"} h-full overflow-y-auto`}>
                    {/* Mobile Sheet Handle */}
                    {isMobile && (
                      <div className="flex justify-center py-2">
                        <div className="w-10 h-1 bg-slate-300 rounded-full" />
                      </div>
                    )}
                    {/* Panel Header */}
                    <div className={`sticky top-0 ${isMobile ? "bg-white/80 backdrop-blur-xl" : "bg-white"} border-b border-slate-200 p-4 flex items-center justify-between ${isMobile ? "pt-2" : ""}`}>
                      <h4 className="font-semibold text-slate-900">Details</h4>
                      <div className="flex items-center gap-2">
                        {isMobile && (
                          <button
                            onClick={() => setShowInfo(false)}
                            className="p-1.5 hover:bg-slate-100 rounded transition-colors text-slate-500"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        )}
                        {!isEditing ? (
                          <>
                            <button
                              onClick={() => setIsEditing(true)}
                              className="p-1.5 hover:bg-slate-100 rounded transition-colors text-slate-500 hover:text-slate-700"
                              title="Edit metadata"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => {
                                setIsEditing(false);
                                setEditedMetadata(metadata || {});
                              }}
                              className="p-1.5 hover:bg-slate-100 rounded transition-colors text-slate-500"
                            >
                              <X className="w-4 h-4" />
                            </button>
                            <button
                              onClick={saveMetadata}
                              disabled={isSaving}
                              className="px-3 py-1.5 bg-brand-600 hover:bg-brand-700 rounded text-sm text-white flex items-center gap-1.5"
                            >
                              {isSaving ? (
                                <Loader2 className="w-3 h-3 animate-spin" />
                              ) : (
                                <Save className="w-3 h-3" />
                              )}
                              Save
                            </button>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="p-4 space-y-5">
                      {isMetadataLoading ? (
                        <div className="flex items-center justify-center py-8">
                          <Loader2 className="w-6 h-6 text-slate-400 animate-spin" />
                        </div>
                      ) : isEditing ? (
                        /* Edit Mode */
                        <>
                          {/* NSFW Toggle */}
                          <div className="flex items-center justify-between p-3 bg-slate-100 rounded-lg">
                            <div className="flex items-center gap-2">
                              {editedMetadata.is_nsfw ? (
                                <AlertTriangle className="w-4 h-4 text-amber-500" />
                              ) : (
                                <Eye className="w-4 h-4 text-green-500" />
                              )}
                              <span className="text-sm text-slate-700">NSFW Content</span>
                            </div>
                            <button
                              onClick={() =>
                                setEditedMetadata((m) => ({ ...m, is_nsfw: !m.is_nsfw }))
                              }
                              className={`w-11 h-6 rounded-full transition-colors relative ${
                                editedMetadata.is_nsfw ? "bg-amber-500" : "bg-slate-300"
                              }`}
                            >
                              <div
                                className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform shadow ${
                                  editedMetadata.is_nsfw ? "translate-x-6" : "translate-x-1"
                                }`}
                              />
                            </button>
                          </div>

                          {/* Style */}
                          <div className="space-y-2">
                            <Label className="text-xs text-slate-500">Style</Label>
                            <div className="flex flex-wrap gap-1.5">
                              {STYLE_OPTIONS.map((style) => (
                                <button
                                  key={style}
                                  onClick={() =>
                                    setEditedMetadata((m) => ({
                                      ...m,
                                      style: m.style === style ? null : style,
                                    }))
                                  }
                                  className={`px-2.5 py-1 text-xs rounded-full capitalize transition-colors ${
                                    editedMetadata.style === style
                                      ? "bg-brand-500 text-white"
                                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                                  }`}
                                >
                                  {style}
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Body Focus */}
                          <MultiSelectPills
                            label="Body Focus"
                            options={BODY_FOCUS_OPTIONS}
                            selected={editedMetadata.body_focus || []}
                            onChange={(selected) =>
                              setEditedMetadata((m) => ({ ...m, body_focus: selected }))
                            }
                          />

                          {/* Categories */}
                          <MultiSelectPills
                            label="Categories"
                            options={CATEGORY_OPTIONS}
                            selected={editedMetadata.categories || []}
                            onChange={(selected) =>
                              setEditedMetadata((m) => ({ ...m, categories: selected }))
                            }
                          />

                          {/* Content Tags */}
                          <TagInput
                            label="Content Tags"
                            tags={editedMetadata.content_tags || []}
                            onChange={(tags) =>
                              setEditedMetadata((m) => ({ ...m, content_tags: tags }))
                            }
                            suggestions={["mirror", "bedroom", "natural_light", "posed"]}
                            placeholder="Add tags..."
                          />

                          {/* Description */}
                          <div className="space-y-2">
                            <Label className="text-xs text-slate-500">AI Description</Label>
                            <textarea
                              value={editedMetadata.photo_description || ""}
                              onChange={(e) =>
                                setEditedMetadata((m) => ({
                                  ...m,
                                  photo_description: e.target.value,
                                }))
                              }
                              className="w-full h-32 p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 placeholder:text-slate-400 resize-none focus:outline-none focus:ring-2 focus:ring-brand-500"
                              placeholder="Enter description..."
                            />
                          </div>
                        </>
                      ) : (
                        /* View Mode */
                        <>
                          {/* Sync Status */}
                          {metadata?.pinecone_synced_at && (
                            <div className="flex items-center gap-2 p-2.5 bg-green-500 rounded-lg text-xs text-white font-medium">
                              <Check className="w-3.5 h-3.5" />
                              <span>
                                AI synced {format(new Date(metadata.pinecone_synced_at), "MMM d, yyyy")}
                              </span>
                            </div>
                          )}

                          {/* File Details */}
                          <div className="space-y-3">
                            <h5 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                              File Info
                            </h5>
                            <dl className="space-y-2.5">
                              <div className="flex justify-between">
                                <dt className="text-sm text-slate-600">Type</dt>
                                <dd className="text-sm text-black font-medium capitalize">{media.media_type}</dd>
                              </div>
                              <div className="flex justify-between">
                                <dt className="text-sm text-slate-600">Size</dt>
                                <dd className="text-sm text-black font-medium">{formatFileSize(media.file_size_bytes)}</dd>
                              </div>
                              <div className="flex justify-between">
                                <dt className="text-sm text-slate-600">Category</dt>
                                <dd className="text-sm text-black font-medium">{media.category || "—"}</dd>
                              </div>
                              <div className="flex justify-between">
                                <dt className="text-sm text-slate-600">Created</dt>
                                <dd className="text-sm text-black font-medium">
                                  {format(new Date(media.created_at), "MMM d, yyyy")}
                                </dd>
                              </div>
                            </dl>
                          </div>

                          {/* AI Metadata */}
                          {metadata && (
                            <>
                              <div className="h-px bg-slate-200" />

                              <div className="space-y-3">
                                <h5 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                  AI Analysis
                                </h5>

                                {/* NSFW Badge */}
                                <div className="flex items-center gap-2">
                                  {metadata.is_nsfw ? (
                                    <span className="px-2.5 py-1 bg-amber-500 text-white rounded-md text-xs font-semibold">
                                      NSFW
                                    </span>
                                  ) : (
                                    <span className="px-2.5 py-1 bg-green-500 text-white rounded-md text-xs font-semibold">
                                      SFW
                                    </span>
                                  )}
                                  {metadata.style && (
                                    <span className="px-2.5 py-1 bg-blue-500 text-white rounded-md text-xs font-semibold capitalize">
                                      {metadata.style}
                                    </span>
                                  )}
                                </div>

                                {/* Categories */}
                                {metadata.categories && metadata.categories.length > 0 && (
                                  <div className="space-y-2">
                                    <span className="text-xs font-medium text-slate-600">Categories</span>
                                    <DraggableScroll className="flex gap-1.5 overflow-x-auto cursor-grab active:cursor-grabbing pb-1">
                                      {metadata.categories.map((cat) => (
                                        <span
                                          key={cat}
                                          className="px-2.5 py-1 bg-violet-500 text-white rounded-md text-xs font-medium whitespace-nowrap shrink-0"
                                        >
                                          {cat}
                                        </span>
                                      ))}
                                    </DraggableScroll>
                                  </div>
                                )}

                                {/* Body Focus */}
                                {metadata.body_focus && metadata.body_focus.length > 0 && (
                                  <div className="space-y-2">
                                    <span className="text-xs font-medium text-slate-600">Body Focus</span>
                                    <DraggableScroll className="flex gap-1.5 overflow-x-auto cursor-grab active:cursor-grabbing pb-1">
                                      {metadata.body_focus.map((focus) => (
                                        <span
                                          key={focus}
                                          className="px-2.5 py-1 bg-cyan-500 text-white rounded-md text-xs font-medium whitespace-nowrap shrink-0"
                                        >
                                          {focus.replace("_", " ")}
                                        </span>
                                      ))}
                                    </DraggableScroll>
                                  </div>
                                )}

                                {/* Tags */}
                                {metadata.content_tags && metadata.content_tags.length > 0 && (
                                  <div className="space-y-2">
                                    <span className="text-xs font-medium text-slate-600">Tags</span>
                                    <DraggableScroll className="flex gap-1.5 overflow-x-auto cursor-grab active:cursor-grabbing pb-1">
                                      {metadata.content_tags.map((tag) => (
                                        <span
                                          key={tag}
                                          className="px-2.5 py-1 bg-slate-700 text-white rounded-md text-xs font-medium whitespace-nowrap shrink-0"
                                        >
                                          {tag}
                                        </span>
                                      ))}
                                    </DraggableScroll>
                                  </div>
                                )}

                                {/* Description */}
                                {metadata.photo_description && (
                                  <div className="space-y-2">
                                    <span className="text-xs font-medium text-slate-600">Description</span>
                                    <p className="text-sm text-black leading-relaxed line-clamp-6">
                                      {metadata.photo_description}
                                    </p>
                                  </div>
                                )}
                              </div>
                            </>
                          )}

                          {/* No Metadata */}
                          {!metadata && (
                            <div className="text-center py-6">
                              <Sparkles className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                              <p className="text-sm text-slate-500 mb-3">No AI analysis yet</p>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={syncFromPinecone}
                                disabled={isSyncing}
                                className="border-slate-300 text-slate-600 hover:bg-slate-50"
                              >
                                {isSyncing ? (
                                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                ) : (
                                  <RefreshCw className="w-4 h-4 mr-2" />
                                )}
                                Sync from AI
                              </Button>
                            </div>
                          )}
                        </>
                      )}

                      {/* Keyboard Shortcuts */}
                      {!isEditing && !isMobile && (
                        <>
                          <div className="h-px bg-slate-200" />
                          <div className="space-y-2">
                            <h5 className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                              Shortcuts
                            </h5>
                            <div className="grid grid-cols-2 gap-2 text-xs">
                              <div className="flex justify-between text-slate-500">
                                <span>Close</span>
                                <kbd className="px-1.5 py-0.5 bg-slate-100 rounded text-slate-600">Esc</kbd>
                              </div>
                              <div className="flex justify-between text-slate-500">
                                <span>Navigate</span>
                                <span>
                                  <kbd className="px-1.5 py-0.5 bg-slate-100 rounded text-slate-600">←</kbd>{" "}
                                  <kbd className="px-1.5 py-0.5 bg-slate-100 rounded text-slate-600">→</kbd>
                                </span>
                              </div>
                              <div className="flex justify-between text-slate-500">
                                <span>Zoom</span>
                                <span>
                                  <kbd className="px-1.5 py-0.5 bg-slate-100 rounded text-slate-600">+</kbd>{" "}
                                  <kbd className="px-1.5 py-0.5 bg-slate-100 rounded text-slate-600">-</kbd>
                                </span>
                              </div>
                              <div className="flex justify-between text-slate-500">
                                <span>Info</span>
                                <kbd className="px-1.5 py-0.5 bg-slate-100 rounded text-slate-600">I</kbd>
                              </div>
                            </div>
                          </div>
                        </>
                      )}
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

