"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useDashboard } from "../layout";
import { createApiClient, type MediaAlbum, type MediaCategory } from "@/lib/media-api";
import { getSupabaseBrowserClient } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  FolderOpen,
  Plus,
  Trash2,
  Edit2,
  Eye,
  Image as ImageIcon,
  Video,
  Music,
  X,
  Loader2,
  AlertCircle,
  Calendar,
  Tag,
  Grid,
  Save,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";

// ============================================
// TYPES
// ============================================

interface LocalAlbum {
  id: string;
  creator_id: string;
  name: string;
  description: string | null;
  cover_image_url: string | null;
  is_public: boolean;
  created_at: string;
  updated_at: string;
  media_count?: number;
}

type GroupBy = "category" | "month" | "date";

// ============================================
// ALBUM CARD COMPONENT
// ============================================

function AlbumCard({
  album,
  type,
  onView,
  onEdit,
  onDelete,
}: {
  album: LocalAlbum | MediaAlbum;
  type: "local" | "auto";
  onView: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}) {
  const isLocal = type === "local";
  const localAlbum = album as LocalAlbum;
  const autoAlbum = album as MediaAlbum;

  const getCount = () => {
    if (isLocal) return localAlbum.media_count || 0;
    return autoAlbum.count;
  };

  const getTitle = () => {
    if (isLocal) return localAlbum.name;
    return autoAlbum.category || autoAlbum.month || autoAlbum.date || "Unknown";
  };

  const getCover = () => {
    if (isLocal) return localAlbum.cover_image_url;
    if (autoAlbum.items && autoAlbum.items.length > 0) {
      return autoAlbum.items[0].storage_url;
    }
    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="group relative bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-lg transition-all cursor-pointer"
      onClick={onView}
    >
      {/* Cover */}
      <div className="aspect-video bg-slate-100 relative overflow-hidden">
        {getCover() ? (
          <img
            src={getCover()!}
            alt={getTitle()}
            className="w-full h-full object-cover transition-transform group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-50">
            <FolderOpen className="w-12 h-12 text-slate-300" />
          </div>
        )}

        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
          <div className="flex items-center gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onView();
              }}
              className="p-2 bg-white rounded-full shadow-lg hover:bg-slate-100"
            >
              <Eye className="w-4 h-4" />
            </button>
            {isLocal && onEdit && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit();
                }}
                className="p-2 bg-white rounded-full shadow-lg hover:bg-slate-100"
              >
                <Edit2 className="w-4 h-4" />
              </button>
            )}
            {isLocal && onDelete && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete();
                }}
                className="p-2 bg-white rounded-full shadow-lg hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4 text-red-500" />
              </button>
            )}
          </div>
        </div>

        {/* Type badge */}
        <div className="absolute top-3 left-3">
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              isLocal
                ? "bg-brand-100 text-brand-700"
                : "bg-slate-100 text-slate-700"
            }`}
          >
            {isLocal ? "Custom" : "Auto"}
          </span>
        </div>
      </div>

      {/* Info */}
      <div className="p-4">
        <h3 className="font-semibold text-slate-900 truncate">{getTitle()}</h3>
        <div className="flex items-center gap-3 mt-2 text-sm text-slate-500">
          <span className="flex items-center gap-1">
            <ImageIcon className="w-4 h-4" />
            {getCount()}
          </span>
          {!isLocal && autoAlbum.media_types && (
            <>
              {autoAlbum.media_types.video > 0 && (
                <span className="flex items-center gap-1">
                  <Video className="w-4 h-4" />
                  {autoAlbum.media_types.video}
                </span>
              )}
              {autoAlbum.media_types.audio > 0 && (
                <span className="flex items-center gap-1">
                  <Music className="w-4 h-4" />
                  {autoAlbum.media_types.audio}
                </span>
              )}
            </>
          )}
        </div>
        {isLocal && localAlbum.description && (
          <p className="text-sm text-slate-500 mt-2 truncate">{localAlbum.description}</p>
        )}
      </div>
    </motion.div>
  );
}

// ============================================
// ALBUM EDITOR MODAL
// ============================================

function AlbumEditor({
  album,
  onSave,
  onClose,
}: {
  album: LocalAlbum | null;
  onSave: (data: Partial<LocalAlbum>) => void;
  onClose: () => void;
}) {
  const [formData, setFormData] = useState({
    name: album?.name || "",
    description: album?.description || "",
    cover_image_url: album?.cover_image_url || "",
    is_public: album?.is_public || false,
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) {
      toast.error("Album name is required");
      return;
    }
    setIsSaving(true);
    await onSave({
      name: formData.name,
      description: formData.description || null,
      cover_image_url: formData.cover_image_url || null,
      is_public: formData.is_public,
    });
    setIsSaving(false);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 z-50"
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="fixed inset-4 sm:inset-auto sm:left-1/2 sm:top-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:max-w-lg sm:w-full bg-white rounded-2xl shadow-xl z-50 overflow-hidden"
      >
        <div className="p-6 border-b border-slate-200 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-900">
            {album ? "Edit Album" : "Create Album"}
          </h3>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Album Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="My Favorite Photos"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="A collection of my best content..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cover">Cover Image URL</Label>
            <Input
              id="cover"
              value={formData.cover_image_url}
              onChange={(e) =>
                setFormData({ ...formData, cover_image_url: e.target.value })
              }
              placeholder="https://..."
            />
            <p className="text-xs text-slate-500">
              Paste a URL or select from your media library
            </p>
          </div>

          <label className="flex items-center gap-3 cursor-pointer">
            <div
              className={`w-10 h-6 rounded-full transition-colors ${
                formData.is_public ? "bg-green-500" : "bg-slate-300"
              } relative`}
              onClick={() =>
                setFormData({ ...formData, is_public: !formData.is_public })
              }
            >
              <div
                className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${
                  formData.is_public ? "left-5" : "left-1"
                }`}
              />
            </div>
            <span className="text-sm text-slate-700">Make album public</span>
          </label>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSaving}
              className="flex-1 bg-brand-600 hover:bg-brand-700"
            >
              {isSaving ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              Save
            </Button>
          </div>
        </form>
      </motion.div>
    </>
  );
}

// ============================================
// MAIN PAGE
// ============================================

export default function AlbumsPage() {
  const { user, apiKey } = useDashboard();
  const [localAlbums, setLocalAlbums] = useState<LocalAlbum[]>([]);
  const [autoAlbums, setAutoAlbums] = useState<MediaAlbum[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [groupBy, setGroupBy] = useState<GroupBy>("category");
  const [editingAlbum, setEditingAlbum] = useState<LocalAlbum | null>(null);
  const [showEditor, setShowEditor] = useState(false);

  const fetchAlbums = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Fetch local albums from Supabase
      if (user?.creator_id) {
        const supabase = getSupabaseBrowserClient();
        const { data: albums, error: albumsError } = await supabase
          .from("media_albums")
          .select("*")
          .eq("creator_id", user.creator_id)
          .order("created_at", { ascending: false });

        if (albumsError) throw albumsError;
        setLocalAlbums(albums || []);
      }

      // Fetch auto-generated albums from API
      if (apiKey) {
        const api = createApiClient(apiKey);
        const response = await api.getMediaAlbums({
          group_by: groupBy,
          creator_id: user?.role === "model" ? user?.creator_id || undefined : undefined,
        });

        if (response.success && response.data) {
          setAutoAlbums(response.data);
        }
      }
    } catch (err) {
      console.error("Error fetching albums:", err);
      setError("Failed to load albums");
    } finally {
      setIsLoading(false);
    }
  }, [user, apiKey, groupBy]);

  useEffect(() => {
    fetchAlbums();
  }, [fetchAlbums]);

  const handleSaveAlbum = async (data: Partial<LocalAlbum>) => {
    if (!user?.creator_id) return;

    try {
      const supabase = getSupabaseBrowserClient();

      if (editingAlbum) {
        const { error } = await supabase
          .from("media_albums")
          .update(data)
          .eq("id", editingAlbum.id);

        if (error) throw error;
        toast.success("Album updated");
      } else {
        const { error } = await supabase.from("media_albums").insert({
          creator_id: user.creator_id,
          ...data,
        });

        if (error) throw error;
        toast.success("Album created");
      }

      fetchAlbums();
      setShowEditor(false);
      setEditingAlbum(null);
    } catch (err) {
      console.error("Error saving album:", err);
      toast.error("Failed to save album");
    }
  };

  const handleDeleteAlbum = async (id: string) => {
    if (!confirm("Delete this album? Media files will not be deleted.")) return;

    try {
      const supabase = getSupabaseBrowserClient();
      const { error } = await supabase.from("media_albums").delete().eq("id", id);

      if (error) throw error;
      toast.success("Album deleted");
      fetchAlbums();
    } catch (err) {
      console.error("Error deleting album:", err);
      toast.error("Failed to delete album");
    }
  };

  const handleViewAlbum = (album: LocalAlbum | MediaAlbum, type: "local" | "auto") => {
    if (type === "auto") {
      const autoAlbum = album as MediaAlbum;
      // Navigate to media page with filter
      const filter = autoAlbum.category
        ? `category=${autoAlbum.category}`
        : autoAlbum.month
        ? `month=${autoAlbum.month}`
        : "";
      window.location.href = `/dashboard/media?${filter}`;
    } else {
      // TODO: Implement local album view
      toast.info("Album view coming soon");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Albums</h1>
          <p className="text-slate-500">Organize your media into collections</p>
        </div>
        <Button
          onClick={() => {
            setEditingAlbum(null);
            setShowEditor(true);
          }}
          className="bg-brand-600 hover:bg-brand-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Album
        </Button>
      </div>

      {/* Custom Albums Section */}
      <div>
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Your Albums</h2>
        {localAlbums.length === 0 ? (
          <div className="bg-slate-50 border border-dashed border-slate-200 rounded-xl p-8 text-center">
            <FolderOpen className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500 mb-4">No custom albums yet</p>
            <Button
              onClick={() => {
                setEditingAlbum(null);
                setShowEditor(true);
              }}
            >
              <Plus className="w-4 h-4 mr-2" />
              Create your first album
            </Button>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {localAlbums.map((album) => (
              <AlbumCard
                key={album.id}
                album={album}
                type="local"
                onView={() => handleViewAlbum(album, "local")}
                onEdit={() => {
                  setEditingAlbum(album);
                  setShowEditor(true);
                }}
                onDelete={() => handleDeleteAlbum(album.id)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Auto Albums Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-slate-900">Auto-Generated</h2>
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-500">Group by:</span>
            <select
              value={groupBy}
              onChange={(e) => setGroupBy(e.target.value as GroupBy)}
              className="px-3 py-1.5 border border-slate-200 rounded-lg text-sm bg-white"
            >
              <option value="category">Category</option>
              <option value="month">Month</option>
              <option value="date">Date</option>
            </select>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 text-brand-600 animate-spin" />
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-500" />
            <p className="text-red-700">{error}</p>
          </div>
        ) : autoAlbums.length === 0 ? (
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-8 text-center">
            <Grid className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500">No auto-generated albums available</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {autoAlbums.map((album, index) => (
              <AlbumCard
                key={`auto-${index}`}
                album={album}
                type="auto"
                onView={() => handleViewAlbum(album, "auto")}
              />
            ))}
          </div>
        )}
      </div>

      {/* Album Editor Modal */}
      <AnimatePresence>
        {showEditor && (
          <AlbumEditor
            album={editingAlbum}
            onSave={handleSaveAlbum}
            onClose={() => {
              setShowEditor(false);
              setEditingAlbum(null);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

