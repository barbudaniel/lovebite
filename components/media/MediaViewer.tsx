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
  RotateCw,
  Save,
  Trash2,
  ZoomIn,
  ZoomOut,
  X,
  Edit3,
  Tag,
  Eye,
  EyeOff,
  Sparkles,
  RefreshCw,
  Check,
  AlertTriangle,
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
      <Label className="text-xs text-slate-400">{label}</Label>
      <div className="flex flex-wrap gap-1.5 p-2 bg-slate-700/50 rounded-lg min-h-[38px]">
        {tags.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-500/20 text-blue-300 rounded text-xs"
          >
            {tag}
            <button
              onClick={() => removeTag(tag)}
              className="hover:text-blue-100"
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
          className="flex-1 min-w-[100px] bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
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
                className="px-2 py-0.5 text-xs bg-slate-700 text-slate-300 rounded hover:bg-slate-600 transition-colors"
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
      <Label className="text-xs text-slate-400">{label}</Label>
      <div className="flex flex-wrap gap-1.5">
        {options.map((option) => (
          <button
            key={option}
            onClick={() => toggle(option)}
            className={`px-2.5 py-1 text-xs rounded-full transition-colors ${
              selected.includes(option)
                ? "bg-blue-500 text-white"
                : "bg-slate-700 text-slate-300 hover:bg-slate-600"
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
}: MediaViewerProps) {
  const [showInfo, setShowInfo] = useState(true);
  const [zoom, setZoom] = useState(100);
  const [rotation, setRotation] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Pan/drag state
  const [isPanning, setIsPanning] = useState(false);
  const [panPosition, setPanPosition] = useState({ x: 0, y: 0 });
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const imageContainerRef = useRef<HTMLDivElement>(null);

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
        setRotation(0);
        setPanPosition({ x: 0, y: 0 });
      } else if (e.key === "r" || e.key === "R") {
        setRotation((r) => (r + 90) % 360);
      } else if (e.key === "i" || e.key === "I") {
        setShowInfo((s) => !s);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose, canNavigatePrev, canNavigateNext, currentIndex, mediaList, onNavigate, isEditing]);

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
      <DialogContent size="full" className="bg-slate-900 border-none p-0 max-h-screen">
        <VisuallyHidden>
          <DialogTitle>Media Preview - {media.file_name}</DialogTitle>
        </VisuallyHidden>

        <div ref={containerRef} className="flex flex-col h-screen">
          {/* Top Toolbar */}
          <div className="flex items-center justify-between px-4 py-3 bg-slate-800/90 backdrop-blur-sm border-b border-slate-700/50 shrink-0">
            {/* Left: Back and filename */}
            <div className="flex items-center gap-3 min-w-0">
              <button
                onClick={onClose}
                className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-slate-300" />
              </button>
              <div className="min-w-0">
                <h3 className="font-medium text-white truncate max-w-[200px] sm:max-w-[300px]">
                  {media.file_name}
                </h3>
                <p className="text-xs text-slate-400">@{media.creator?.username || "unknown"}</p>
              </div>
            </div>

            {/* Center: Zoom controls */}
            {media.media_type === "image" && (
              <div className="hidden md:flex items-center gap-1 bg-slate-700/50 rounded-lg px-2 py-1">
                <button
                  onClick={() => setZoom((z) => Math.max(z - 25, 25))}
                  className="p-1.5 hover:bg-slate-600 rounded transition-colors"
                >
                  <ZoomOut className="w-4 h-4 text-slate-300" />
                </button>
                <span className="text-xs text-slate-300 w-12 text-center font-mono">{zoom}%</span>
                <button
                  onClick={() => setZoom((z) => Math.min(z + 25, 300))}
                  className="p-1.5 hover:bg-slate-600 rounded transition-colors"
                >
                  <ZoomIn className="w-4 h-4 text-slate-300" />
                </button>
                <div className="w-px h-4 bg-slate-600 mx-1" />
                <button
                  onClick={() => setRotation((r) => (r + 90) % 360)}
                  className="p-1.5 hover:bg-slate-600 rounded transition-colors"
                >
                  <RotateCw className="w-4 h-4 text-slate-300" />
                </button>
                <button
                  onClick={() => { setZoom(100); setRotation(0); setPanPosition({ x: 0, y: 0 }); }}
                  className="px-2 py-1 text-xs text-slate-300 hover:bg-slate-600 rounded transition-colors"
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
                  className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
                  title="Copy image"
                >
                  <Copy className="w-5 h-5 text-slate-300" />
                </button>
              )}
              {(onCopyPermalink || permalink) && (
                <button
                  onClick={handleCopyPermalink}
                  className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
                  title="Copy dashboard permalink"
                >
                  <ExternalLink className="w-5 h-5 text-slate-300" />
                </button>
              )}
              <button
                onClick={handleCopyLink}
                className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
                title="Copy direct file link"
              >
                <Link className="w-5 h-5 text-slate-300" />
              </button>
              <button
                onClick={() => window.open(media.storage_url, "_blank")}
                className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
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
                className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
                title="Download"
              >
                <Download className="w-5 h-5 text-slate-300" />
              </button>
              <button
                onClick={toggleFullscreen}
                className="p-2 hover:bg-slate-700 rounded-lg transition-colors hidden sm:block"
                title="Fullscreen"
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
                className={`p-2 rounded-lg transition-colors ${
                  showInfo ? "bg-blue-600 text-white" : "hover:bg-slate-700 text-slate-300"
                }`}
                title="Info panel"
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
                className="p-2 hover:bg-red-600/20 rounded-lg transition-colors"
                title="Delete"
              >
                <Trash2 className="w-5 h-5 text-red-400" />
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 flex overflow-hidden">
            {/* Media Preview */}
            <div 
              ref={imageContainerRef}
              className={`flex-1 relative flex items-center justify-center bg-slate-950 overflow-hidden ${
                zoom > 100 ? (isPanning ? "cursor-grabbing" : "cursor-grab") : "cursor-default"
              }`}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onWheel={handleWheel}
            >
              {/* Navigation arrows */}
              {canNavigatePrev && mediaList && onNavigate && (
                <button
                  onClick={() => onNavigate(mediaList[currentIndex - 1])}
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-slate-800/80 hover:bg-slate-700 rounded-full z-10 transition-colors"
                >
                  <ChevronLeft className="w-6 h-6 text-white" />
                </button>
              )}
              {canNavigateNext && mediaList && onNavigate && (
                <button
                  onClick={() => onNavigate(mediaList[currentIndex + 1])}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-slate-800/80 hover:bg-slate-700 rounded-full z-10 transition-colors"
                >
                  <ChevronRight className="w-6 h-6 text-white" />
                </button>
              )}

              {/* Loading spinner */}
              {isImageLoading && media.media_type === "image" && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
                </div>
              )}

              {/* Media */}
              {media.media_type === "image" ? (
                <img
                  src={media.storage_url}
                  alt={media.file_name}
                  className="max-w-full max-h-full object-contain select-none"
                  style={{
                    transform: `translate(${panPosition.x}px, ${panPosition.y}px) scale(${zoom / 100}) rotate(${rotation}deg)`,
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
                  <div className="w-32 h-32 bg-slate-800 rounded-2xl flex items-center justify-center">
                    <Music className="w-16 h-16 text-orange-400" />
                  </div>
                  <audio src={media.storage_url} controls autoPlay className="w-full max-w-lg" />
                </div>
              )}

              {/* Counter */}
              {mediaList && mediaList.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-slate-800/80 rounded-full text-sm text-slate-300 font-mono">
                  {currentIndex + 1} / {mediaList.length}
                </div>
              )}
              
              {/* Pan hint */}
              {zoom > 100 && !isPanning && (
                <div className="absolute top-4 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-slate-800/80 rounded-full text-xs text-slate-400">
                  Drag to pan • Ctrl+Scroll to zoom
                </div>
              )}
            </div>

            {/* Info Panel */}
            <AnimatePresence>
              {showInfo && (
                <motion.div
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: 360, opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="border-l border-slate-700/50 bg-slate-800/50 backdrop-blur-sm overflow-hidden shrink-0"
                >
                  <div className="w-[360px] h-full overflow-y-auto">
                    {/* Panel Header */}
                    <div className="sticky top-0 bg-slate-800/90 backdrop-blur-sm border-b border-slate-700/50 p-4 flex items-center justify-between">
                      <h4 className="font-semibold text-white">Details</h4>
                      <div className="flex items-center gap-2">
                        {!isEditing ? (
                          <>
                            <button
                              onClick={syncFromPinecone}
                              disabled={isSyncing}
                              className="p-1.5 hover:bg-slate-700 rounded transition-colors text-slate-400 hover:text-slate-200"
                              title="Sync from AI"
                            >
                              {isSyncing ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <Sparkles className="w-4 h-4" />
                              )}
                            </button>
                            <button
                              onClick={() => setIsEditing(true)}
                              className="p-1.5 hover:bg-slate-700 rounded transition-colors text-slate-400 hover:text-slate-200"
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
                              className="p-1.5 hover:bg-slate-700 rounded transition-colors text-slate-400"
                            >
                              <X className="w-4 h-4" />
                            </button>
                            <button
                              onClick={saveMetadata}
                              disabled={isSaving}
                              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 rounded text-sm text-white flex items-center gap-1.5"
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
                          <div className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                            <div className="flex items-center gap-2">
                              {editedMetadata.is_nsfw ? (
                                <AlertTriangle className="w-4 h-4 text-amber-400" />
                              ) : (
                                <Eye className="w-4 h-4 text-green-400" />
                              )}
                              <span className="text-sm text-white">NSFW Content</span>
                            </div>
                            <button
                              onClick={() =>
                                setEditedMetadata((m) => ({ ...m, is_nsfw: !m.is_nsfw }))
                              }
                              className={`w-11 h-6 rounded-full transition-colors relative ${
                                editedMetadata.is_nsfw ? "bg-amber-500" : "bg-slate-600"
                              }`}
                            >
                              <div
                                className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                                  editedMetadata.is_nsfw ? "translate-x-6" : "translate-x-1"
                                }`}
                              />
                            </button>
                          </div>

                          {/* Style */}
                          <div className="space-y-2">
                            <Label className="text-xs text-slate-400">Style</Label>
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
                                      ? "bg-blue-500 text-white"
                                      : "bg-slate-700 text-slate-300 hover:bg-slate-600"
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
                            <Label className="text-xs text-slate-400">AI Description</Label>
                            <textarea
                              value={editedMetadata.photo_description || ""}
                              onChange={(e) =>
                                setEditedMetadata((m) => ({
                                  ...m,
                                  photo_description: e.target.value,
                                }))
                              }
                              className="w-full h-32 p-3 bg-slate-700/50 rounded-lg text-sm text-white placeholder:text-slate-500 resize-none"
                              placeholder="Enter description..."
                            />
                          </div>
                        </>
                      ) : (
                        /* View Mode */
                        <>
                          {/* Sync Status */}
                          {metadata?.pinecone_synced_at && (
                            <div className="flex items-center gap-2 p-2 bg-green-500/10 rounded-lg text-xs text-green-400">
                              <Check className="w-3 h-3" />
                              <span>
                                AI synced {format(new Date(metadata.pinecone_synced_at), "MMM d, yyyy")}
                              </span>
                            </div>
                          )}

                          {/* File Details */}
                          <div className="space-y-3">
                            <h5 className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                              File Info
                            </h5>
                            <dl className="space-y-2.5">
                              <div className="flex justify-between">
                                <dt className="text-sm text-slate-400">Type</dt>
                                <dd className="text-sm text-white capitalize">{media.media_type}</dd>
                              </div>
                              <div className="flex justify-between">
                                <dt className="text-sm text-slate-400">Size</dt>
                                <dd className="text-sm text-white">{formatFileSize(media.file_size_bytes)}</dd>
                              </div>
                              <div className="flex justify-between">
                                <dt className="text-sm text-slate-400">Category</dt>
                                <dd className="text-sm text-white">{media.category || "—"}</dd>
                              </div>
                              <div className="flex justify-between">
                                <dt className="text-sm text-slate-400">Created</dt>
                                <dd className="text-sm text-white">
                                  {format(new Date(media.created_at), "MMM d, yyyy")}
                                </dd>
                              </div>
                            </dl>
                          </div>

                          {/* AI Metadata */}
                          {metadata && (
                            <>
                              <div className="h-px bg-slate-700/50" />

                              <div className="space-y-3">
                                <h5 className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                                  AI Analysis
                                </h5>

                                {/* NSFW Badge */}
                                <div className="flex items-center gap-2">
                                  {metadata.is_nsfw ? (
                                    <span className="px-2 py-0.5 bg-amber-500/20 text-amber-400 rounded text-xs font-medium">
                                      NSFW
                                    </span>
                                  ) : (
                                    <span className="px-2 py-0.5 bg-green-500/20 text-green-400 rounded text-xs font-medium">
                                      SFW
                                    </span>
                                  )}
                                  {metadata.style && (
                                    <span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 rounded text-xs font-medium capitalize">
                                      {metadata.style}
                                    </span>
                                  )}
                                </div>

                                {/* Categories */}
                                {metadata.categories && metadata.categories.length > 0 && (
                                  <div className="space-y-1.5">
                                    <span className="text-xs text-slate-400">Categories</span>
                                    <div className="flex flex-wrap gap-1.5">
                                      {metadata.categories.map((cat) => (
                                        <span
                                          key={cat}
                                          className="px-2 py-0.5 bg-violet-500/20 text-violet-300 rounded text-xs"
                                        >
                                          {cat}
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {/* Body Focus */}
                                {metadata.body_focus && metadata.body_focus.length > 0 && (
                                  <div className="space-y-1.5">
                                    <span className="text-xs text-slate-400">Body Focus</span>
                                    <div className="flex flex-wrap gap-1.5">
                                      {metadata.body_focus.map((focus) => (
                                        <span
                                          key={focus}
                                          className="px-2 py-0.5 bg-cyan-500/20 text-cyan-300 rounded text-xs"
                                        >
                                          {focus.replace("_", " ")}
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {/* Tags */}
                                {metadata.content_tags && metadata.content_tags.length > 0 && (
                                  <div className="space-y-1.5">
                                    <span className="text-xs text-slate-400">Tags</span>
                                    <div className="flex flex-wrap gap-1.5">
                                      {metadata.content_tags.slice(0, 10).map((tag) => (
                                        <span
                                          key={tag}
                                          className="px-2 py-0.5 bg-slate-600 text-slate-300 rounded text-xs"
                                        >
                                          {tag}
                                        </span>
                                      ))}
                                      {metadata.content_tags.length > 10 && (
                                        <span className="text-xs text-slate-500">
                                          +{metadata.content_tags.length - 10} more
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                )}

                                {/* Description */}
                                {metadata.photo_description && (
                                  <div className="space-y-1.5">
                                    <span className="text-xs text-slate-400">Description</span>
                                    <p className="text-xs text-slate-300 leading-relaxed line-clamp-6">
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
                              <Sparkles className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                              <p className="text-sm text-slate-400 mb-3">No AI analysis yet</p>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={syncFromPinecone}
                                disabled={isSyncing}
                                className="border-slate-600 text-slate-300 hover:bg-slate-700"
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
                      {!isEditing && (
                        <>
                          <div className="h-px bg-slate-700/50" />
                          <div className="space-y-2">
                            <h5 className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                              Shortcuts
                            </h5>
                            <div className="grid grid-cols-2 gap-2 text-xs">
                              <div className="flex justify-between text-slate-400">
                                <span>Close</span>
                                <kbd className="px-1.5 py-0.5 bg-slate-700 rounded">Esc</kbd>
                              </div>
                              <div className="flex justify-between text-slate-400">
                                <span>Navigate</span>
                                <span>
                                  <kbd className="px-1.5 py-0.5 bg-slate-700 rounded">←</kbd>{" "}
                                  <kbd className="px-1.5 py-0.5 bg-slate-700 rounded">→</kbd>
                                </span>
                              </div>
                              <div className="flex justify-between text-slate-400">
                                <span>Zoom</span>
                                <span>
                                  <kbd className="px-1.5 py-0.5 bg-slate-700 rounded">+</kbd>{" "}
                                  <kbd className="px-1.5 py-0.5 bg-slate-700 rounded">-</kbd>
                                </span>
                              </div>
                              <div className="flex justify-between text-slate-400">
                                <span>Info</span>
                                <kbd className="px-1.5 py-0.5 bg-slate-700 rounded">I</kbd>
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

