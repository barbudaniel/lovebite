"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useDashboard } from "../layout";
import { createApiClient, type Media, type MediaCategory } from "@/lib/media-api";
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
  Calendar,
  FileType,
  FolderOpen,
  RefreshCw,
  CheckSquare,
  Square,
  MoreVertical,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { format } from "date-fns";

// ============================================
// TYPES
// ============================================

type ViewMode = "grid" | "list";
type MediaTypeFilter = "all" | "image" | "video" | "audio";

interface FilterState {
  type: MediaTypeFilter;
  category: string;
  dateFrom: string;
  dateTo: string;
  search: string;
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
  viewMode,
}: {
  media: Media;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onView: (media: Media) => void;
  onDelete: (id: string) => void;
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
        <button
          onClick={() => onSelect(media.id)}
          className="shrink-0"
        >
          {isSelected ? (
            <CheckSquare className="w-5 h-5 text-brand-600" />
          ) : (
            <Square className="w-5 h-5 text-slate-400" />
          )}
        </button>

        <div
          className="w-16 h-16 rounded-lg bg-slate-100 overflow-hidden shrink-0 cursor-pointer"
          onClick={() => onView(media)}
        >
          {media.media_type === "image" ? (
            <img
              src={media.storage_url}
              alt={media.file_name}
              className="w-full h-full object-cover"
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
        </div>

        <p className="text-sm text-slate-500 hidden sm:block">
          {format(new Date(media.created_at), "MMM d, yyyy")}
        </p>

        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onView(media)}
          >
            <Eye className="w-4 h-4" />
          </Button>
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
        className="aspect-square bg-slate-100 overflow-hidden cursor-pointer"
        onClick={() => onView(media)}
      >
        {media.media_type === "image" ? (
          <img
            src={media.storage_url}
            alt={media.file_name}
            className="w-full h-full object-cover transition-transform group-hover:scale-105"
            loading="lazy"
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
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
          <div className="flex items-center gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onView(media);
              }}
              className="p-2 bg-white rounded-full shadow-lg hover:bg-slate-100"
            >
              <Eye className="w-4 h-4" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                window.open(media.storage_url, "_blank");
              }}
              className="p-2 bg-white rounded-full shadow-lg hover:bg-slate-100"
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
            <p className="text-sm font-medium text-slate-900 truncate">
              {media.file_name}
            </p>
            <p className="text-xs text-slate-500">
              {media.category || "Uncategorized"}
            </p>
          </div>
          <TypeIcon className="w-4 h-4 text-slate-400 shrink-0" />
        </div>
      </div>
    </motion.div>
  );
}

// ============================================
// MEDIA VIEWER MODAL
// ============================================

function MediaViewer({
  media,
  onClose,
  onDelete,
}: {
  media: Media;
  onClose: () => void;
  onDelete: (id: string) => void;
}) {
  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/90 z-50"
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="fixed inset-4 z-50 flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 text-white">
          <div>
            <h3 className="font-semibold">{media.file_name}</h3>
            <p className="text-sm text-slate-400">
              {media.category || "Uncategorized"} •{" "}
              {format(new Date(media.created_at), "PPP")}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => window.open(media.storage_url, "_blank")}
              className="text-white hover:bg-white/10"
            >
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                onDelete(media.id);
                onClose();
              }}
              className="text-red-400 hover:bg-red-500/20"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </Button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 flex items-center justify-center p-4">
          {media.media_type === "image" ? (
            <img
              src={media.storage_url}
              alt={media.file_name}
              className="max-w-full max-h-full object-contain rounded-lg"
            />
          ) : media.media_type === "video" ? (
            <video
              src={media.storage_url}
              controls
              className="max-w-full max-h-full rounded-lg"
            />
          ) : (
            <audio src={media.storage_url} controls className="w-full max-w-md" />
          )}
        </div>
      </motion.div>
    </>
  );
}

// ============================================
// MAIN PAGE
// ============================================

export default function MediaPage() {
  const { user, apiKey } = useDashboard();
  const [media, setMedia] = useState<Media[]>([]);
  const [categories, setCategories] = useState<MediaCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [viewingMedia, setViewingMedia] = useState<Media | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [pagination, setPagination] = useState({
    total: 0,
    limit: 50,
    offset: 0,
    hasMore: false,
  });
  const [filters, setFilters] = useState<FilterState>({
    type: "all",
    category: "",
    dateFrom: "",
    dateTo: "",
    search: "",
  });

  const fetchMedia = useCallback(async (reset = false) => {
    if (!apiKey) return;

    setIsLoading(true);
    setError(null);

    try {
      const api = createApiClient(apiKey);
      const offset = reset ? 0 : pagination.offset;

      const response = await api.listMedia({
        type: filters.type === "all" ? undefined : filters.type,
        category: filters.category || undefined,
        creator_id: user?.role === "model" ? user?.creator_id || undefined : undefined,
        date_from: filters.dateFrom || undefined,
        date_to: filters.dateTo || undefined,
        limit: pagination.limit,
        offset,
        sort_order: "desc",
      });

      if (response.success && response.data) {
        setMedia(reset ? response.data : [...media, ...response.data]);
        if (response.pagination) {
          setPagination(response.pagination);
        }
      } else {
        setError(response.error || "Failed to load media");
      }

      // Fetch categories
      const catResponse = await api.getMediaCategories(
        user?.role === "model" ? user?.creator_id || undefined : undefined
      );
      if (catResponse.success && catResponse.data) {
        setCategories(catResponse.data);
      }
    } catch (err) {
      console.error("Error fetching media:", err);
      setError("Failed to load media");
    } finally {
      setIsLoading(false);
    }
  }, [apiKey, filters, pagination.offset, pagination.limit, user, media]);

  useEffect(() => {
    fetchMedia(true);
  }, [apiKey, filters]); // eslint-disable-line react-hooks/exhaustive-deps

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Media Library</h1>
          <p className="text-slate-500">
            {pagination.total.toLocaleString()} items
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
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Search media..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              className="pl-10"
            />
          </div>

          {/* Quick Filters */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Type Filter */}
            <select
              value={filters.type}
              onChange={(e) =>
                setFilters({ ...filters, type: e.target.value as MediaTypeFilter })
              }
              className="px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white"
            >
              <option value="all">All Types</option>
              <option value="image">Images</option>
              <option value="video">Videos</option>
              <option value="audio">Audio</option>
            </select>

            {/* Category Filter */}
            <select
              value={filters.category}
              onChange={(e) => setFilters({ ...filters, category: e.target.value })}
              className="px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white"
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat.name} value={cat.name}>
                  {cat.name} ({cat.count})
                </option>
              ))}
            </select>

            {/* More Filters Toggle */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="w-4 h-4 mr-2" />
              Filters
              <ChevronDown
                className={`w-4 h-4 ml-1 transition-transform ${
                  showFilters ? "rotate-180" : ""
                }`}
              />
            </Button>

            {/* View Toggle */}
            <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 ${
                  viewMode === "grid"
                    ? "bg-slate-100 text-slate-900"
                    : "text-slate-500 hover:bg-slate-50"
                }`}
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
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Extended Filters */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="flex flex-wrap gap-4 pt-4 mt-4 border-t border-slate-200">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  <Input
                    type="date"
                    value={filters.dateFrom}
                    onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
                    className="w-auto"
                  />
                  <span className="text-slate-400">to</span>
                  <Input
                    type="date"
                    value={filters.dateTo}
                    onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
                    className="w-auto"
                  />
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setFilters({
                      type: "all",
                      category: "",
                      dateFrom: "",
                      dateTo: "",
                      search: "",
                    })
                  }
                >
                  Clear Filters
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Batch Actions */}
        {selectedIds.size > 0 && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            className="flex items-center gap-4 pt-4 mt-4 border-t border-slate-200"
          >
            <button
              onClick={handleSelectAll}
              className="text-sm text-brand-600 hover:underline"
            >
              {selectedIds.size === media.length ? "Deselect All" : "Select All"}
            </button>
            <span className="text-sm text-slate-500">
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
      ) : media.length === 0 ? (
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-12 text-center">
          <FolderOpen className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h3 className="font-semibold text-slate-700 mb-2">No media found</h3>
          <p className="text-slate-500 text-sm">
            {filters.type !== "all" || filters.category || filters.search
              ? "Try adjusting your filters"
              : "Start uploading content to see it here"}
          </p>
        </div>
      ) : (
        <>
          {viewMode === "grid" ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {media.map((item) => (
                <MediaCard
                  key={item.id}
                  media={item}
                  isSelected={selectedIds.has(item.id)}
                  onSelect={handleSelect}
                  onView={setViewingMedia}
                  onDelete={handleDelete}
                  viewMode={viewMode}
                />
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {media.map((item) => (
                <MediaCard
                  key={item.id}
                  media={item}
                  isSelected={selectedIds.has(item.id)}
                  onSelect={handleSelect}
                  onView={setViewingMedia}
                  onDelete={handleDelete}
                  viewMode={viewMode}
                />
              ))}
            </div>
          )}

          {/* Load More */}
          {pagination.hasMore && (
            <div className="flex justify-center pt-4">
              <Button
                variant="outline"
                onClick={() => {
                  setPagination((prev) => ({
                    ...prev,
                    offset: prev.offset + prev.limit,
                  }));
                  fetchMedia(false);
                }}
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : null}
                Load More
              </Button>
            </div>
          )}
        </>
      )}

      {/* Media Viewer Modal */}
      <AnimatePresence>
        {viewingMedia && (
          <MediaViewer
            media={viewingMedia}
            onClose={() => setViewingMedia(null)}
            onDelete={handleDelete}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

