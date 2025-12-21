"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useDashboard } from "../layout";
import { createApiClient, type Media, type Creator } from "@/lib/media-api";
import { getSupabaseBrowserClient } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
  MessageSquare,
  Copy,
  Check,
  Heart,
  Crown,
  Flame,
  Star,
  Gift,
  Sparkles,
  Footprints,
  Camera,
  Shirt,
  ChevronRight,
  Search,
  Grid3X3,
  LayoutGrid,
  Users,
  Play,
  ExternalLink,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogBody,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog-centered";

// ============================================
// TYPES
// ============================================

interface Scenario {
  id: string;
  creator_id: string;
  name: string;
  description: string | null;
  emoji: string;
  color: string;
  cover_image_url: string | null;
  is_favorite: boolean;
  created_at: string;
  updated_at: string;
  media_items?: ScenarioMedia[];
}

interface ScenarioMedia {
  id: string;
  scenario_id: string;
  media_id: string;
  sort_order: number;
  media?: Media;
}

// Scenario templates/presets
const SCENARIO_PRESETS = [
  { name: "Hot & Spicy", emoji: "🔥", color: "from-orange-500 to-red-500", icon: Flame },
  { name: "Lingerie", emoji: "💋", color: "from-pink-500 to-rose-500", icon: Heart },
  { name: "Premium Content", emoji: "👑", color: "from-amber-400 to-yellow-500", icon: Crown },
  { name: "Daily Tease", emoji: "✨", color: "from-purple-500 to-violet-500", icon: Sparkles },
  { name: "Feet Content", emoji: "👣", color: "from-cyan-500 to-teal-500", icon: Footprints },
  { name: "Behind Scenes", emoji: "📸", color: "from-blue-500 to-indigo-500", icon: Camera },
  { name: "Cosplay", emoji: "👘", color: "from-fuchsia-500 to-pink-500", icon: Shirt },
  { name: "Fan Request", emoji: "🎁", color: "from-green-500 to-emerald-500", icon: Gift },
  { name: "Featured", emoji: "⭐", color: "from-yellow-500 to-orange-500", icon: Star },
];

// ============================================
// SCENARIO CARD
// ============================================

function ScenarioCard({
  scenario,
  mediaCount,
  onView,
  onEdit,
  onDelete,
  onCopyAll,
}: {
  scenario: Scenario;
  mediaCount: number;
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onCopyAll: () => void;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    onCopyAll();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className="group relative bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl transition-all cursor-pointer"
      onClick={onView}
    >
      {/* Cover / Gradient Header */}
      <div className={`h-28 bg-gradient-to-br ${scenario.color} relative overflow-hidden`}>
        {scenario.cover_image_url ? (
          <img
            src={scenario.cover_image_url}
            alt={scenario.name}
            className="w-full h-full object-cover opacity-80"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-5xl">{scenario.emoji}</span>
          </div>
        )}

        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

        {/* Favorite badge */}
        {scenario.is_favorite && (
          <div className="absolute top-3 right-3">
            <Star className="w-5 h-5 text-yellow-400 fill-yellow-400 drop-shadow" />
          </div>
        )}

        {/* Quick actions */}
        <div className="absolute top-3 left-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
            className="p-1.5 bg-white/90 backdrop-blur rounded-lg hover:bg-white"
          >
            <Edit2 className="w-3.5 h-3.5 text-slate-700" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="p-1.5 bg-white/90 backdrop-blur rounded-lg hover:bg-red-50"
          >
            <Trash2 className="w-3.5 h-3.5 text-red-500" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="font-bold text-slate-900 truncate flex items-center gap-2">
              {scenario.name}
            </h3>
            {scenario.description && (
              <p className="text-sm text-slate-500 truncate mt-0.5">{scenario.description}</p>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100">
          <div className="flex items-center gap-3 text-sm text-slate-500">
            <span className="flex items-center gap-1">
              <Grid3X3 className="w-4 h-4" />
              {mediaCount}
            </span>
          </div>
          <button
            onClick={handleCopy}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
              copied
                ? "bg-green-100 text-green-700"
                : "bg-slate-100 text-slate-600 hover:bg-brand-100 hover:text-brand-700"
            }`}
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                Copy All
              </>
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
}

// ============================================
// SCENARIO EDITOR MODAL
// ============================================

function ScenarioEditor({
  scenario,
  creatorId,
  onSave,
  onClose,
}: {
  scenario: Scenario | null;
  creatorId: string;
  onSave: () => void;
  onClose: () => void;
}) {
  const [formData, setFormData] = useState({
    name: scenario?.name || "",
    description: scenario?.description || "",
    emoji: scenario?.emoji || "🔥",
    color: scenario?.color || "from-orange-500 to-red-500",
    cover_image_url: scenario?.cover_image_url || "",
    is_favorite: scenario?.is_favorite || false,
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!formData.name) {
      toast.error("Scenario name is required");
      return;
    }

    setIsSaving(true);
    try {
      const supabase = getSupabaseBrowserClient();

      if (scenario) {
        // Update existing
        const { error } = await supabase
          .from("media_scenarios")
          .update({
            name: formData.name,
            description: formData.description || null,
            emoji: formData.emoji,
            color: formData.color,
            cover_image_url: formData.cover_image_url || null,
            is_favorite: formData.is_favorite,
            updated_at: new Date().toISOString(),
          })
          .eq("id", scenario.id);

        if (error) throw error;
        toast.success("Scenario updated!");
      } else {
        // Create new
        const { error } = await supabase.from("media_scenarios").insert({
          creator_id: creatorId,
          name: formData.name,
          description: formData.description || null,
          emoji: formData.emoji,
          color: formData.color,
          cover_image_url: formData.cover_image_url || null,
          is_favorite: formData.is_favorite,
        });

        if (error) throw error;
        toast.success("Scenario created!");
      }

      onSave();
    } catch (err) {
      console.error("Error saving scenario:", err);
      toast.error("Failed to save scenario");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent size="md">
        <DialogHeader>
          <DialogTitle>{scenario ? "Edit Scenario" : "Create Scenario"}</DialogTitle>
          <DialogDescription>
            Group your media for quick access during conversations
          </DialogDescription>
        </DialogHeader>

        <DialogBody>
          <div className="space-y-5">
            {/* Preset Selection */}
            {!scenario && (
              <div className="space-y-2">
                <Label>Quick Templates</Label>
                <div className="grid grid-cols-3 gap-2">
                  {SCENARIO_PRESETS.map((preset) => (
                    <button
                      key={preset.name}
                      type="button"
                      onClick={() =>
                        setFormData({
                          ...formData,
                          name: preset.name,
                          emoji: preset.emoji,
                          color: preset.color,
                        })
                      }
                      className={`p-3 rounded-xl border-2 text-left transition-all ${
                        formData.color === preset.color
                          ? "border-brand-500 bg-brand-50"
                          : "border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      <span className="text-xl">{preset.emoji}</span>
                      <p className="text-xs font-medium text-slate-700 mt-1 truncate">
                        {preset.name}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Scenario Name *</Label>
              <div className="flex gap-2">
                <Input
                  value={formData.emoji}
                  onChange={(e) => setFormData({ ...formData, emoji: e.target.value })}
                  className="w-16 text-center text-lg"
                  maxLength={4}
                />
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Hot & Spicy"
                  className="flex-1"
                />
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Brief description for this scenario..."
                rows={2}
              />
            </div>

            {/* Color */}
            <div className="space-y-2">
              <Label>Theme Color</Label>
              <div className="flex flex-wrap gap-2">
                {[
                  "from-orange-500 to-red-500",
                  "from-pink-500 to-rose-500",
                  "from-amber-400 to-yellow-500",
                  "from-purple-500 to-violet-500",
                  "from-cyan-500 to-teal-500",
                  "from-blue-500 to-indigo-500",
                  "from-fuchsia-500 to-pink-500",
                  "from-green-500 to-emerald-500",
                ].map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setFormData({ ...formData, color })}
                    className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} ${
                      formData.color === color
                        ? "ring-2 ring-offset-2 ring-slate-500"
                        : ""
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Cover URL */}
            <div className="space-y-2">
              <Label htmlFor="cover">Cover Image URL (optional)</Label>
              <Input
                id="cover"
                value={formData.cover_image_url}
                onChange={(e) => setFormData({ ...formData, cover_image_url: e.target.value })}
                placeholder="https://..."
              />
            </div>

            {/* Favorite toggle */}
            <label className="flex items-center gap-3 cursor-pointer p-3 bg-slate-50 rounded-xl">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, is_favorite: !formData.is_favorite })}
                className={`w-10 h-6 rounded-full transition-colors ${
                  formData.is_favorite ? "bg-yellow-400" : "bg-slate-300"
                } relative`}
              >
                <span
                  className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                    formData.is_favorite ? "left-5" : "left-1"
                  }`}
                />
              </button>
              <div>
                <span className="text-sm font-medium text-slate-700">Mark as Favorite</span>
                <p className="text-xs text-slate-500">Pin this scenario at the top</p>
              </div>
            </label>
          </div>
        </DialogBody>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isSaving} className="bg-brand-600 hover:bg-brand-700">
            {isSaving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {scenario ? "Save Changes" : "Create Scenario"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ============================================
// SCENARIO VIEWER MODAL
// ============================================

function ScenarioViewer({
  scenario,
  media,
  onClose,
  onAddMedia,
  onRemoveMedia,
  onCopyUrl,
}: {
  scenario: Scenario;
  media: Media[];
  onClose: () => void;
  onAddMedia: () => void;
  onRemoveMedia: (mediaId: string) => void;
  onCopyUrl: (url: string) => void;
}) {
  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent size="xl">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${scenario.color} flex items-center justify-center`}>
              <span className="text-2xl">{scenario.emoji}</span>
            </div>
            <div>
              <DialogTitle>{scenario.name}</DialogTitle>
              <DialogDescription>
                {media.length} items • Click to copy URL
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <DialogBody>
          {media.length === 0 ? (
            <div className="text-center py-12">
              <Grid3X3 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500 mb-4">No media in this scenario yet</p>
              <Button onClick={onAddMedia}>
                <Plus className="w-4 h-4 mr-2" />
                Add Media
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Add more button */}
              <Button variant="outline" onClick={onAddMedia} className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                Add More Media
              </Button>

              {/* Media Grid */}
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                {media.map((item) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="group relative aspect-square bg-slate-100 rounded-xl overflow-hidden"
                  >
                    {item.media_type === "video" ? (
                      <div className="w-full h-full bg-slate-800 flex items-center justify-center">
                        <Play className="w-8 h-8 text-white/70" />
                      </div>
                    ) : item.media_type === "audio" ? (
                      <div className="w-full h-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                        <Music className="w-8 h-8 text-white" />
                      </div>
                    ) : (
                      <img
                        src={item.storage_url}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    )}

                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <button
                        onClick={() => onCopyUrl(item.storage_url)}
                        className="p-2 bg-white rounded-lg hover:bg-slate-100"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onRemoveMedia(item.id)}
                        className="p-2 bg-white rounded-lg hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </button>
                    </div>

                    {/* Type indicator */}
                    <div className="absolute bottom-1 right-1">
                      {item.media_type === "video" && (
                        <div className="bg-black/70 text-white text-xs px-1.5 py-0.5 rounded flex items-center gap-1">
                          <Video className="w-3 h-3" />
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Copy all URLs */}
              <div className="flex justify-center pt-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    const urls = media.map((m) => m.storage_url).join("\n");
                    navigator.clipboard.writeText(urls);
                    toast.success("All URLs copied to clipboard!");
                  }}
                  className="gap-2"
                >
                  <Copy className="w-4 h-4" />
                  Copy All URLs ({media.length})
                </Button>
              </div>
            </div>
          )}
        </DialogBody>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ============================================
// MEDIA SELECTOR MODAL
// ============================================

function MediaSelector({
  creatorId,
  apiKey,
  selectedIds,
  onSelect,
  onClose,
}: {
  creatorId: string;
  apiKey: string;
  selectedIds: Set<string>;
  onSelect: (ids: string[]) => void;
  onClose: () => void;
}) {
  const [media, setMedia] = useState<Media[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selected, setSelected] = useState<Set<string>>(new Set(selectedIds));
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string>("all");

  useEffect(() => {
    const fetchMedia = async () => {
      try {
        const api = createApiClient(apiKey);
        const response = await api.listMedia({
          creator_id: creatorId,
          limit: 100,
        });
        if (response.success && response.data) {
          setMedia(response.data);
        }
      } catch (err) {
        console.error("Error fetching media:", err);
        toast.error("Failed to load media");
      } finally {
        setIsLoading(false);
      }
    };
    fetchMedia();
  }, [apiKey, creatorId]);

  const toggleSelect = (id: string) => {
    const newSelected = new Set(selected);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelected(newSelected);
  };

  const filteredMedia = media.filter((m) => {
    if (category !== "all" && m.category !== category) return false;
    if (search && !m.file_name?.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const categories = Array.from(new Set(media.map((m) => m.category).filter(Boolean)));

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent size="xl">
        <DialogHeader>
          <DialogTitle>Select Media</DialogTitle>
          <DialogDescription>
            Choose media to add to this scenario ({selected.size} selected)
          </DialogDescription>
        </DialogHeader>

        <DialogBody>
          {/* Filters */}
          <div className="flex gap-3 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Search media..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="px-3 py-2 border border-slate-200 rounded-lg text-sm"
            >
              <option value="all">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat!}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-6 h-6 text-brand-600 animate-spin" />
            </div>
          ) : filteredMedia.length === 0 ? (
            <div className="text-center py-12">
              <ImageIcon className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500">No media found</p>
            </div>
          ) : (
            <div className="grid grid-cols-4 sm:grid-cols-5 gap-2 max-h-[400px] overflow-y-auto">
              {filteredMedia.map((item) => (
                <button
                  key={item.id}
                  onClick={() => toggleSelect(item.id)}
                  className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                    selected.has(item.id)
                      ? "border-brand-500 ring-2 ring-brand-200"
                      : "border-transparent hover:border-slate-300"
                  }`}
                >
                  {item.media_type === "image" ? (
                    <img src={item.storage_url} alt="" className="w-full h-full object-cover" />
                  ) : item.media_type === "video" ? (
                    <div className="w-full h-full bg-slate-800 flex items-center justify-center">
                      <Play className="w-6 h-6 text-white/70" />
                    </div>
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                      <Music className="w-6 h-6 text-white" />
                    </div>
                  )}
                  {selected.has(item.id) && (
                    <div className="absolute top-1 right-1 w-5 h-5 bg-brand-500 rounded-full flex items-center justify-center">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}
        </DialogBody>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={() => {
              onSelect(Array.from(selected));
              onClose();
            }}
            className="bg-brand-600 hover:bg-brand-700"
          >
            Add Selected ({selected.size})
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ============================================
// MAIN PAGE
// ============================================

export default function ScenariosPage() {
  const { user, apiKey } = useDashboard();
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [scenarioMedia, setScenarioMedia] = useState<Record<string, Media[]>>({});
  const [creators, setCreators] = useState<Creator[]>([]);
  const [selectedCreatorId, setSelectedCreatorId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Modal states
  const [showEditor, setShowEditor] = useState(false);
  const [editingScenario, setEditingScenario] = useState<Scenario | null>(null);
  const [viewingScenario, setViewingScenario] = useState<Scenario | null>(null);
  const [showMediaSelector, setShowMediaSelector] = useState(false);

  const isAdminOrBusiness = user?.role === "admin" || user?.role === "business";
  const activeCreatorId = isAdminOrStudio ? selectedCreatorId : user?.creator_id;

  // Fetch creators for admin/studio
  useEffect(() => {
    const fetchCreators = async () => {
      if (!isAdminOrStudio || !apiKey) return;
      
      try {
        const api = createApiClient(apiKey);
        let response;
        
        if (user?.role === "business" && user?.studio_id) {
          response = await api.listCreators({ studio_id: user.studio_id, limit: 100 });
        } else {
          response = await api.listCreators({ limit: 200 });
        }
        
        if (response.success && response.data) {
          setCreators(response.data);
          if (response.data.length > 0 && !selectedCreatorId) {
            setSelectedCreatorId(response.data[0].id);
          }
        }
      } catch (err) {
        console.error("Error fetching creators:", err);
      }
    };
    fetchCreators();
  }, [isAdminOrStudio, apiKey, user]);

  // Auto-select self for models
  useEffect(() => {
    if (!isAdminOrStudio && user?.creator_id) {
      setSelectedCreatorId(user.creator_id);
    }
  }, [isAdminOrStudio, user?.creator_id]);

  // Fetch scenarios
  const fetchScenarios = useCallback(async () => {
    if (!activeCreatorId) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const supabase = getSupabaseBrowserClient();
      
      // Fetch scenarios
      const { data: scenariosData, error: scenariosError } = await supabase
        .from("media_scenarios")
        .select("*")
        .eq("creator_id", activeCreatorId)
        .order("is_favorite", { ascending: false })
        .order("name");

      if (scenariosError) throw scenariosError;
      setScenarios((scenariosData as Scenario[]) || []);

      // Fetch media for each scenario
      if (scenariosData && scenariosData.length > 0 && apiKey) {
        const api = createApiClient(apiKey);
        const mediaByScenario: Record<string, Media[]> = {};
        
        for (const scenario of scenariosData) {
          const { data: items } = await supabase
            .from("scenario_media")
            .select("media_id")
            .eq("scenario_id", scenario.id)
            .order("sort_order");

          if (items && items.length > 0) {
            const mediaIds = items.map((i: any) => i.media_id);
            const mediaResponse = await api.listMedia({
              creator_id: activeCreatorId,
              limit: 100,
            });
            
            if (mediaResponse.success && mediaResponse.data) {
              mediaByScenario[scenario.id] = mediaResponse.data.filter((m) =>
                mediaIds.includes(m.id)
              );
            }
          } else {
            mediaByScenario[scenario.id] = [];
          }
        }
        setScenarioMedia(mediaByScenario);
      }
    } catch (err) {
      console.error("Error fetching scenarios:", err);
      toast.error("Failed to load scenarios");
    } finally {
      setIsLoading(false);
    }
  }, [activeCreatorId, apiKey]);

  useEffect(() => {
    fetchScenarios();
  }, [fetchScenarios]);

  const handleDelete = async (scenario: Scenario) => {
    if (!confirm(`Delete "${scenario.name}"? This cannot be undone.`)) return;

    try {
      const supabase = getSupabaseBrowserClient();
      await supabase.from("scenario_media").delete().eq("scenario_id", scenario.id);
      await supabase.from("media_scenarios").delete().eq("id", scenario.id);
      toast.success("Scenario deleted");
      fetchScenarios();
    } catch (err) {
      console.error("Error deleting scenario:", err);
      toast.error("Failed to delete scenario");
    }
  };

  const handleAddMedia = async (mediaIds: string[]) => {
    if (!viewingScenario) return;

    try {
      const supabase = getSupabaseBrowserClient();
      
      // Get existing media for this scenario
      const { data: existing } = await supabase
        .from("scenario_media")
        .select("media_id")
        .eq("scenario_id", viewingScenario.id);

      const existingIds = new Set((existing || []).map((e: any) => e.media_id));
      const newIds = mediaIds.filter((id) => !existingIds.has(id));

      if (newIds.length === 0) {
        toast.info("Selected media already in scenario");
        return;
      }

      // Add new media
      const inserts = newIds.map((media_id, index) => ({
        scenario_id: viewingScenario.id,
        media_id,
        sort_order: (existing?.length || 0) + index,
      }));

      const { error } = await supabase.from("scenario_media").insert(inserts);
      if (error) throw error;

      toast.success(`Added ${newIds.length} media`);
      fetchScenarios();
    } catch (err) {
      console.error("Error adding media:", err);
      toast.error("Failed to add media");
    }
  };

  const handleRemoveMedia = async (mediaId: string) => {
    if (!viewingScenario) return;

    try {
      const supabase = getSupabaseBrowserClient();
      const { error } = await supabase
        .from("scenario_media")
        .delete()
        .eq("scenario_id", viewingScenario.id)
        .eq("media_id", mediaId);

      if (error) throw error;
      toast.success("Media removed");
      fetchScenarios();
    } catch (err) {
      console.error("Error removing media:", err);
      toast.error("Failed to remove media");
    }
  };

  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    toast.success("URL copied!");
  };

  const handleCopyAll = (scenario: Scenario) => {
    const media = scenarioMedia[scenario.id] || [];
    if (media.length === 0) {
      toast.info("No media in this scenario");
      return;
    }
    const urls = media.map((m) => m.storage_url).join("\n");
    navigator.clipboard.writeText(urls);
    toast.success(`Copied ${media.length} URLs!`);
  };

  const filteredScenarios = scenarios.filter((s) =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedCreator = creators.find((c) => c.id === activeCreatorId);

  if (!activeCreatorId && !isAdminOrStudio) {
    return (
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 flex items-center gap-3">
        <AlertCircle className="w-5 h-5 text-amber-500" />
        <p className="text-amber-700">
          You need to be linked to a creator profile to manage scenarios.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <MessageSquare className="w-6 h-6 text-brand-600" />
            Media Scenarios
          </h1>
          <p className="text-slate-500">
            Organize media for OnlyFans conversations and quick access
          </p>
        </div>
        <Button
          onClick={() => {
            setEditingScenario(null);
            setShowEditor(true);
          }}
          className="bg-brand-600 hover:bg-brand-700"
          disabled={!activeCreatorId}
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Scenario
        </Button>
      </div>

      {/* Creator selector for admin/studio */}
      {isAdminOrStudio && (
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-brand-100 flex items-center justify-center">
                <Users className="w-5 h-5 text-brand-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Managing scenarios for</p>
                <p className="font-semibold text-slate-900">
                  {selectedCreator ? `@${selectedCreator.username}` : "Select a creator"}
                </p>
              </div>
            </div>
            <div className="flex-1 max-w-xs">
              <select
                value={selectedCreatorId || ""}
                onChange={(e) => setSelectedCreatorId(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
              >
                <option value="">Select a creator...</option>
                {creators.map((creator) => (
                  <option key={creator.id} value={creator.id}>
                    @{creator.username}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Search */}
      {scenarios.length > 0 && (
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Search scenarios..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      )}

      {/* Content */}
      {!activeCreatorId ? (
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-8 text-center">
          <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-600 font-medium">Select a creator to manage their scenarios</p>
        </div>
      ) : isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-brand-600 animate-spin" />
        </div>
      ) : filteredScenarios.length === 0 ? (
        <div className="bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200 rounded-2xl p-12 text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-brand-100 to-brand-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <FolderOpen className="w-8 h-8 text-brand-600" />
          </div>
          <h3 className="font-semibold text-slate-900 mb-2">No scenarios yet</h3>
          <p className="text-slate-500 text-sm mb-6 max-w-md mx-auto">
            Create scenarios to organize your media for quick access during OnlyFans conversations. 
            Group by themes like "Hot & Spicy", "Lingerie", "Premium", etc.
          </p>
          <Button
            onClick={() => {
              setEditingScenario(null);
              setShowEditor(true);
            }}
            className="bg-brand-600 hover:bg-brand-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Your First Scenario
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredScenarios.map((scenario) => (
            <ScenarioCard
              key={scenario.id}
              scenario={scenario}
              mediaCount={scenarioMedia[scenario.id]?.length || 0}
              onView={() => setViewingScenario(scenario)}
              onEdit={() => {
                setEditingScenario(scenario);
                setShowEditor(true);
              }}
              onDelete={() => handleDelete(scenario)}
              onCopyAll={() => handleCopyAll(scenario)}
            />
          ))}
        </div>
      )}

      {/* Editor Modal */}
      {showEditor && activeCreatorId && (
        <ScenarioEditor
          scenario={editingScenario}
          creatorId={activeCreatorId}
          onSave={() => {
            setShowEditor(false);
            setEditingScenario(null);
            fetchScenarios();
          }}
          onClose={() => {
            setShowEditor(false);
            setEditingScenario(null);
          }}
        />
      )}

      {/* Viewer Modal */}
      {viewingScenario && (
        <ScenarioViewer
          scenario={viewingScenario}
          media={scenarioMedia[viewingScenario.id] || []}
          onClose={() => setViewingScenario(null)}
          onAddMedia={() => setShowMediaSelector(true)}
          onRemoveMedia={handleRemoveMedia}
          onCopyUrl={handleCopyUrl}
        />
      )}

      {/* Media Selector */}
      {showMediaSelector && viewingScenario && activeCreatorId && apiKey && (
        <MediaSelector
          creatorId={activeCreatorId}
          apiKey={apiKey}
          selectedIds={new Set((scenarioMedia[viewingScenario.id] || []).map((m) => m.id))}
          onSelect={handleAddMedia}
          onClose={() => setShowMediaSelector(false)}
        />
      )}
    </div>
  );
}
