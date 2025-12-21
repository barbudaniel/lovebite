"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence, Reorder } from "motion/react";
import { useDashboard } from "../layout";
import { getSupabaseBrowserClient } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import Link from "next/link";
import {
  Link2,
  Plus,
  Trash2,
  Edit2,
  Save,
  Eye,
  ExternalLink,
  GripVertical,
  Image as ImageIcon,
  Crown,
  Heart,
  Video,
  Footprints,
  Globe,
  X,
  Loader2,
  AlertCircle,
  Copy,
  Check,
  Settings,
  Palette,
  BarChart3,
  Upload,
  FolderOpen,
  Sparkles,
  Zap,
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

interface BioLink {
  id: string;
  creator_id: string;
  slug: string;
  name: string;
  tagline: string | null;
  subtitle: string | null;
  profile_image_url: string | null;
  gallery_image_url: string | null;
  welcome_title: string | null;
  welcome_text: string | null;
  theme: Record<string, unknown>;
  is_published: boolean;
  custom_domain: string | null;
  created_at: string;
  updated_at: string;
}

interface BioLinkItem {
  id: string;
  bio_link_id: string;
  label: string;
  sub_text: string | null;
  href: string;
  icon_type: string;
  icon_color: string | null;
  pill_text: string | null;
  pill_color: string | null;
  media_id: string | null;
  media_url: string | null;
  sort_order: number;
  enabled: boolean;
  created_at: string;
  updated_at: string;
}

interface BioSocialLink {
  id: string;
  bio_link_id: string;
  platform: string;
  url: string;
  enabled: boolean;
  sort_order: number;
}

interface MediaItem {
  id: string;
  storage_url: string;
  thumbnail_url: string | null;
  media_type: string;
  file_name: string;
}

const ICON_TYPES = [
  { id: "crown", icon: Crown, label: "Crown", color: "text-amber-500" },
  { id: "heart", icon: Heart, label: "Heart", color: "text-pink-500" },
  { id: "video", icon: Video, label: "Video", color: "text-purple-500" },
  { id: "footprints", icon: Footprints, label: "Footprints", color: "text-rose-500" },
  { id: "link", icon: Link2, label: "Link", color: "text-blue-500" },
  { id: "globe", icon: Globe, label: "Globe", color: "text-cyan-500" },
  { id: "zap", icon: Zap, label: "Zap", color: "text-yellow-500" },
  { id: "sparkles", icon: Sparkles, label: "Sparkles", color: "text-violet-500" },
];

const SOCIAL_PLATFORMS = [
  { id: "x", name: "X", icon: "𝕏" },
  { id: "instagram", name: "Instagram", icon: "📷" },
  { id: "reddit", name: "Reddit", icon: "🔴" },
  { id: "tiktok", name: "TikTok", icon: "🎵" },
  { id: "youtube", name: "YouTube", icon: "📺" },
  { id: "twitch", name: "Twitch", icon: "🎮" },
];

// ============================================
// LINK CARD COMPONENT
// ============================================

function LinkCard({
  item,
  onEdit,
  onDelete,
  onToggle,
}: {
  item: BioLinkItem;
  onEdit: () => void;
  onDelete: () => void;
  onToggle: () => void;
}) {
  const iconConfig = ICON_TYPES.find((i) => i.id === item.icon_type) || ICON_TYPES[0];
  const IconComponent = iconConfig.icon;

  return (
    <Reorder.Item
      value={item}
      className={`bg-white rounded-xl border border-slate-200 p-4 shadow-sm hover:shadow-md transition-all ${
        !item.enabled && "opacity-50"
      }`}
    >
      <div className="flex items-center gap-4">
        <GripVertical className="w-5 h-5 text-slate-300 cursor-grab shrink-0" />
        
        {item.media_url ? (
          <div className="w-12 h-12 rounded-lg overflow-hidden bg-slate-100 shrink-0">
            <img src={item.media_url} alt="" className="w-full h-full object-cover" />
          </div>
        ) : (
          <div className={`w-12 h-12 rounded-lg bg-gradient-to-br from-slate-100 to-slate-50 flex items-center justify-center shrink-0`}>
            <IconComponent className={`w-6 h-6 ${iconConfig.color}`} />
          </div>
        )}

        <div className="flex-1 min-w-0">
          <p className="font-semibold text-slate-900 truncate">{item.label}</p>
          <p className="text-sm text-slate-500 truncate">{item.href}</p>
          {item.pill_text && (
            <span className="inline-block mt-1 px-2 py-0.5 text-xs rounded-full bg-pink-100 text-pink-700">
              {item.pill_text}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onToggle}
            className={`w-10 h-5 rounded-full transition-colors relative ${
              item.enabled ? "bg-green-500" : "bg-slate-300"
            }`}
          >
            <div
              className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                item.enabled ? "translate-x-5" : "translate-x-0.5"
              }`}
            />
          </button>
          <Button variant="ghost" size="sm" onClick={onEdit}>
            <Edit2 className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={onDelete} className="text-red-500 hover:text-red-600 hover:bg-red-50">
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </Reorder.Item>
  );
}

// ============================================
// LINK EDITOR MODAL
// ============================================

function LinkEditor({
  item,
  bioLinkId,
  onSave,
  onClose,
  creatorId,
}: {
  item: BioLinkItem | null;
  bioLinkId: string;
  onSave: () => void;
  onClose: () => void;
  creatorId: string;
}) {
  const [form, setForm] = useState({
    label: item?.label || "",
    href: item?.href || "",
    sub_text: item?.sub_text || "",
    icon_type: item?.icon_type || "link",
    pill_text: item?.pill_text || "",
    media_id: item?.media_id || null as string | null,
    media_url: item?.media_url || null as string | null,
  });
  const [isSaving, setIsSaving] = useState(false);
  const [showMediaPicker, setShowMediaPicker] = useState(false);
  const [mediaLibrary, setMediaLibrary] = useState<MediaItem[]>([]);
  const [isLoadingMedia, setIsLoadingMedia] = useState(false);

  const fetchMedia = async () => {
    setIsLoadingMedia(true);
    try {
      const supabase = getSupabaseBrowserClient();
      const { data } = await supabase
        .from("media")
        .select("id, storage_url, thumbnail_url, media_type, file_name")
        .eq("creator_id", creatorId)
        .eq("media_type", "image")
        .order("created_at", { ascending: false })
        .limit(50);
      setMediaLibrary(data || []);
    } catch (err) {
      console.error("Error fetching media:", err);
    } finally {
      setIsLoadingMedia(false);
    }
  };

  const handleSave = async () => {
    if (!form.label.trim() || !form.href.trim()) {
      toast.error("Label and URL are required");
      return;
    }

    setIsSaving(true);
    try {
      const supabase = getSupabaseBrowserClient();
      
      if (item) {
        await supabase
          .from("bio_link_items")
          .update({
            label: form.label,
            href: form.href,
            sub_text: form.sub_text || null,
            icon_type: form.icon_type,
            pill_text: form.pill_text || null,
            media_id: form.media_id,
            media_url: form.media_url,
          })
          .eq("id", item.id);
      } else {
        const { data: lastItem } = await supabase
          .from("bio_link_items")
          .select("sort_order")
          .eq("bio_link_id", bioLinkId)
          .order("sort_order", { ascending: false })
          .limit(1)
          .maybeSingle();

        await supabase.from("bio_link_items").insert({
          bio_link_id: bioLinkId,
          label: form.label,
          href: form.href,
          sub_text: form.sub_text || null,
          icon_type: form.icon_type,
          pill_text: form.pill_text || null,
          media_id: form.media_id,
          media_url: form.media_url,
          sort_order: (lastItem?.sort_order || 0) + 1,
          enabled: true,
        });
      }

      toast.success(item ? "Link updated" : "Link added");
      onSave();
      onClose();
    } catch (err) {
      console.error("Error saving link:", err);
      toast.error("Failed to save link");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent size="lg">
        <DialogHeader>
          <DialogTitle>{item ? "Edit Link" : "Add New Link"}</DialogTitle>
          <DialogDescription>
            {item ? "Update your link details" : "Add a new link to your bio page"}
          </DialogDescription>
        </DialogHeader>
        <DialogBody className="space-y-5">
          {/* Media Preview/Selector */}
          <div>
            <Label className="mb-2 block">Link Image (optional)</Label>
            <div className="flex items-start gap-4">
              {form.media_url ? (
                <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-slate-100">
                  <img src={form.media_url} alt="" className="w-full h-full object-cover" />
                  <button
                    onClick={() => setForm({ ...form, media_id: null, media_url: null })}
                    className="absolute top-1 right-1 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => { fetchMedia(); setShowMediaPicker(true); }}
                  className="w-20 h-20 rounded-xl border-2 border-dashed border-slate-300 flex flex-col items-center justify-center hover:border-violet-400 hover:bg-violet-50 transition-colors"
                >
                  <ImageIcon className="w-6 h-6 text-slate-400" />
                  <span className="text-xs text-slate-500 mt-1">Add</span>
                </button>
              )}
              <div className="flex-1">
                <p className="text-sm text-slate-600">Add an image to make your link stand out</p>
                <p className="text-xs text-slate-400 mt-1">Recommended: 400x400px or square</p>
              </div>
            </div>
          </div>

          {/* Label & URL */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Link Label *</Label>
              <Input
                value={form.label}
                onChange={(e) => setForm({ ...form, label: e.target.value })}
                placeholder="My OnlyFans"
              />
            </div>
            <div className="space-y-2">
              <Label>URL *</Label>
              <Input
                value={form.href}
                onChange={(e) => setForm({ ...form, href: e.target.value })}
                placeholder="https://onlyfans.com/username"
              />
            </div>
          </div>

          {/* Subtitle */}
          <div className="space-y-2">
            <Label>Subtitle (optional)</Label>
            <Input
              value={form.sub_text}
              onChange={(e) => setForm({ ...form, sub_text: e.target.value })}
              placeholder="Free subscription available"
            />
          </div>

          {/* Icon Selection */}
          <div className="space-y-2">
            <Label>Icon Style</Label>
            <div className="flex flex-wrap gap-2">
              {ICON_TYPES.map((iconType) => {
                const Icon = iconType.icon;
                return (
                  <button
                    key={iconType.id}
                    onClick={() => setForm({ ...form, icon_type: iconType.id })}
                    className={`w-12 h-12 rounded-xl border-2 flex items-center justify-center transition-all ${
                      form.icon_type === iconType.id
                        ? "border-violet-500 bg-violet-50"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${iconType.color}`} />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Badge/Pill */}
          <div className="space-y-2">
            <Label>Badge Text (optional)</Label>
            <Input
              value={form.pill_text}
              onChange={(e) => setForm({ ...form, pill_text: e.target.value })}
              placeholder="NEW"
            />
            <p className="text-xs text-slate-400">Add a badge like "NEW", "50% OFF", or "EXCLUSIVE"</p>
          </div>
        </DialogBody>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave} disabled={isSaving} className="bg-violet-600 hover:bg-violet-700">
            {isSaving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {item ? "Update Link" : "Add Link"}
          </Button>
        </DialogFooter>
      </DialogContent>

      {/* Media Picker Modal */}
      <AnimatePresence>
        {showMediaPicker && (
          <Dialog open onOpenChange={() => setShowMediaPicker(false)}>
            <DialogContent size="xl">
              <DialogHeader>
                <DialogTitle>Select Image</DialogTitle>
                <DialogDescription>Choose an image from your media library</DialogDescription>
              </DialogHeader>
              <DialogBody>
                {isLoadingMedia ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-8 h-8 text-violet-600 animate-spin" />
                  </div>
                ) : mediaLibrary.length === 0 ? (
                  <div className="text-center py-12">
                    <FolderOpen className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                    <p className="text-slate-500">No images in your library</p>
                    <Link href="/dashboard/media">
                      <Button variant="outline" size="sm" className="mt-4">
                        <Upload className="w-4 h-4 mr-2" />
                        Upload Media
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-4 sm:grid-cols-6 gap-3 max-h-[400px] overflow-y-auto">
                    {mediaLibrary.map((media) => (
                      <button
                        key={media.id}
                        onClick={() => {
                          setForm({ ...form, media_id: media.id, media_url: media.storage_url });
                          setShowMediaPicker(false);
                        }}
                        className="aspect-square rounded-lg overflow-hidden border-2 border-transparent hover:border-violet-500 transition-colors"
                      >
                        <img
                          src={media.thumbnail_url || media.storage_url}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </DialogBody>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>
    </Dialog>
  );
}

// ============================================
// SETTINGS MODAL
// ============================================

// ============================================
// IMAGE UPLOADER COMPONENT
// ============================================

function ImageUploader({
  label,
  value,
  onChange,
  creatorId,
  apiKey,
  aspectHint,
}: {
  label: string;
  value: string;
  onChange: (url: string) => void;
  creatorId: string;
  apiKey: string | null;
  aspectHint?: string;
}) {
  const [showMediaPicker, setShowMediaPicker] = useState(false);
  const [mediaLibrary, setMediaLibrary] = useState<MediaItem[]>([]);
  const [isLoadingMedia, setIsLoadingMedia] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchMedia = async () => {
    setIsLoadingMedia(true);
    try {
      const supabase = getSupabaseBrowserClient();
      const { data } = await supabase
        .from("media")
        .select("id, storage_url, thumbnail_url, media_type, file_name")
        .eq("creator_id", creatorId)
        .eq("media_type", "image")
        .order("created_at", { ascending: false })
        .limit(50);
      setMediaLibrary(data || []);
    } catch (err) {
      console.error("Error fetching media:", err);
    } finally {
      setIsLoadingMedia(false);
    }
  };

  const handleUpload = async (file: File) => {
    if (!apiKey) {
      toast.error("API key not configured for uploads");
      return;
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error("Image must be less than 10MB");
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const { createApiClient } = await import("@/lib/media-api");
      const api = createApiClient(apiKey);
      
      const response = await api.uploadMedia({
        file,
        creator_id: creatorId,
        category: "bio-link",
        onProgress: setUploadProgress,
      });

      if (response.success && response.data) {
        onChange(response.data.storage_url);
        toast.success("Image uploaded and added to media library!");
        setShowMediaPicker(false);
      } else {
        toast.error(response.error || "Failed to upload image");
      }
    } catch (err) {
      console.error("Upload error:", err);
      toast.error("Failed to upload image");
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="flex items-start gap-4">
        {value ? (
          <div className="relative w-24 h-24 rounded-xl overflow-hidden bg-slate-100 shrink-0">
            <img src={value} alt="" className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={() => onChange("")}
              className="absolute top-1 right-1 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-colors"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => { fetchMedia(); setShowMediaPicker(true); }}
            className="w-24 h-24 rounded-xl border-2 border-dashed border-slate-300 flex flex-col items-center justify-center hover:border-violet-400 hover:bg-violet-50 transition-colors shrink-0"
          >
            <ImageIcon className="w-6 h-6 text-slate-400" />
            <span className="text-xs text-slate-500 mt-1">Add Image</span>
          </button>
        )}
        <div className="flex-1 min-w-0">
          <p className="text-sm text-slate-600">Upload a new image or select from your media library</p>
          {aspectHint && <p className="text-xs text-slate-400 mt-1">{aspectHint}</p>}
          {value && (
            <button
              type="button"
              onClick={() => { fetchMedia(); setShowMediaPicker(true); }}
              className="text-xs text-violet-600 hover:text-violet-700 mt-2"
            >
              Change image
            </button>
          )}
        </div>
      </div>

      {/* Media Picker Modal */}
      <AnimatePresence>
        {showMediaPicker && (
          <Dialog open onOpenChange={() => setShowMediaPicker(false)}>
            <DialogContent size="xl">
              <DialogHeader>
                <DialogTitle>Select or Upload Image</DialogTitle>
                <DialogDescription>Choose from your library or upload a new image</DialogDescription>
              </DialogHeader>
              <DialogBody>
                {/* Upload Section */}
                <div className="mb-6 p-4 bg-gradient-to-r from-violet-50 to-purple-50 rounded-xl border border-violet-200">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleUpload(file);
                    }}
                    className="hidden"
                  />
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-violet-100 flex items-center justify-center shrink-0">
                      <Upload className="w-6 h-6 text-violet-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-slate-900">Upload New Image</p>
                      <p className="text-sm text-slate-500">Image will be saved to your media library</p>
                    </div>
                    <Button
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isUploading}
                      className="bg-violet-600 hover:bg-violet-700"
                    >
                      {isUploading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          {uploadProgress}%
                        </>
                      ) : (
                        <>
                          <Upload className="w-4 h-4 mr-2" />
                          Upload
                        </>
                      )}
                    </Button>
                  </div>
                </div>

                {/* Divider */}
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex-1 h-px bg-slate-200" />
                  <span className="text-sm text-slate-400">or select from library</span>
                  <div className="flex-1 h-px bg-slate-200" />
                </div>

                {/* Media Library Grid */}
                {isLoadingMedia ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-8 h-8 text-violet-600 animate-spin" />
                  </div>
                ) : mediaLibrary.length === 0 ? (
                  <div className="text-center py-8">
                    <FolderOpen className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                    <p className="text-slate-500">No images in your library yet</p>
                    <p className="text-sm text-slate-400 mt-1">Upload your first image above</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-4 sm:grid-cols-6 gap-3 max-h-[350px] overflow-y-auto">
                    {mediaLibrary.map((media) => (
                      <button
                        key={media.id}
                        type="button"
                        onClick={() => {
                          onChange(media.storage_url);
                          setShowMediaPicker(false);
                        }}
                        className="aspect-square rounded-lg overflow-hidden border-2 border-transparent hover:border-violet-500 transition-colors"
                      >
                        <img
                          src={media.thumbnail_url || media.storage_url}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </DialogBody>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>
    </div>
  );
}

function SettingsModal({
  bioLink,
  onSave,
  onClose,
  creatorId,
  apiKey,
}: {
  bioLink: BioLink;
  onSave: (data: Partial<BioLink>) => Promise<void>;
  onClose: () => void;
  creatorId: string;
  apiKey: string | null;
}) {
  const [form, setForm] = useState({
    name: bioLink.name || "",
    slug: bioLink.slug || "",
    tagline: bioLink.tagline || "",
    subtitle: bioLink.subtitle || "",
    welcome_title: bioLink.welcome_title || "",
    welcome_text: bioLink.welcome_text || "",
    profile_image_url: bioLink.profile_image_url || "",
    gallery_image_url: bioLink.gallery_image_url || "",
    is_published: bioLink.is_published,
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!form.name.trim() || !form.slug.trim()) {
      toast.error("Name and slug are required");
      return;
    }

    setIsSaving(true);
    try {
      await onSave(form);
      onClose();
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent size="lg">
        <DialogHeader>
          <DialogTitle>Bio Link Settings</DialogTitle>
          <DialogDescription>Customize your bio link page appearance</DialogDescription>
        </DialogHeader>
        <DialogBody className="space-y-5 max-h-[70vh] overflow-y-auto">
          {/* Profile & Gallery Images */}
          <div className="grid sm:grid-cols-2 gap-6">
            <ImageUploader
              label="Profile Picture"
              value={form.profile_image_url}
              onChange={(url) => setForm({ ...form, profile_image_url: url })}
              creatorId={creatorId}
              apiKey={apiKey}
              aspectHint="Square image recommended (400x400px)"
            />
            <ImageUploader
              label="Gallery/Banner Image"
              value={form.gallery_image_url}
              onChange={(url) => setForm({ ...form, gallery_image_url: url })}
              creatorId={creatorId}
              apiKey={apiKey}
              aspectHint="Landscape image recommended (800x600px)"
            />
          </div>

          {/* Name & Slug */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Display Name *</Label>
              <Input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Your Name"
              />
            </div>
            <div className="space-y-2">
              <Label>URL Slug *</Label>
              <div className="flex">
                <span className="inline-flex items-center px-3 text-sm text-slate-500 bg-slate-100 border border-r-0 border-slate-200 rounded-l-lg">
                  bites.bio/
                </span>
                <Input
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "") })}
                  className="rounded-l-none"
                  placeholder="username"
                />
              </div>
            </div>
          </div>

          {/* Tagline & Subtitle */}
          <div className="space-y-2">
            <Label>Tagline</Label>
            <Input
              value={form.tagline}
              onChange={(e) => setForm({ ...form, tagline: e.target.value })}
              placeholder="Content Creator"
            />
          </div>
          <div className="space-y-2">
            <Label>Subtitle</Label>
            <Textarea
              value={form.subtitle}
              onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
              placeholder="A short description about you..."
              rows={2}
            />
          </div>

          {/* Welcome Section */}
          <div className="pt-4 border-t border-slate-200">
            <h4 className="font-medium text-slate-900 mb-4">Welcome Section</h4>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Welcome Title</Label>
                <Input
                  value={form.welcome_title}
                  onChange={(e) => setForm({ ...form, welcome_title: e.target.value })}
                  placeholder="Welcome!"
                />
              </div>
              <div className="space-y-2">
                <Label>Welcome Text</Label>
                <Textarea
                  value={form.welcome_text}
                  onChange={(e) => setForm({ ...form, welcome_text: e.target.value })}
                  placeholder="Thanks for visiting my page..."
                  rows={3}
                />
              </div>
            </div>
          </div>

          {/* Publish Toggle */}
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
            <div>
              <p className="font-medium text-slate-900">Published</p>
              <p className="text-sm text-slate-500">Make your bio link visible to everyone</p>
            </div>
            <button
              onClick={() => setForm({ ...form, is_published: !form.is_published })}
              className={`w-12 h-6 rounded-full transition-colors relative ${
                form.is_published ? "bg-green-500" : "bg-slate-300"
              }`}
            >
              <div
                className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                  form.is_published ? "translate-x-7" : "translate-x-1"
                }`}
              />
            </button>
          </div>
        </DialogBody>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave} disabled={isSaving} className="bg-violet-600 hover:bg-violet-700">
            {isSaving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Save Settings
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ============================================
// CREATOR OPTION TYPE
// ============================================

interface CreatorOption {
  id: string;
  username: string;
  display_name?: string;
}

// ============================================
// MAIN PAGE
// ============================================

export default function BioLinksPage() {
  const { user, apiKey } = useDashboard();
  const [bioLink, setBioLink] = useState<BioLink | null>(null);
  const [linkItems, setLinkItems] = useState<BioLinkItem[]>([]);
  const [socialLinks, setSocialLinks] = useState<BioSocialLink[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [editingItem, setEditingItem] = useState<BioLinkItem | null>(null);
  const [showLinkEditor, setShowLinkEditor] = useState(false);
  const [copied, setCopied] = useState(false);
  
  // Admin/Studio can select which creator to edit
  const [creators, setCreators] = useState<CreatorOption[]>([]);
  const [selectedCreatorId, setSelectedCreatorId] = useState<string | null>(null);
  
  const isAdminOrStudio = user?.role === "admin" || user?.role === "studio";
  const effectiveCreatorId = isAdminOrStudio ? selectedCreatorId : user?.creator_id;

  // Fetch creators list for admin/studio
  useEffect(() => {
    if (!isAdminOrStudio) return;
    
    const fetchCreators = async () => {
      const supabase = getSupabaseBrowserClient();
      let query = supabase
        .from("creators")
        .select("id, username")
        .eq("enabled", true)
        .order("username");
      
      if (user?.role === "studio" && user?.studio_id) {
        query = query.eq("studio_id", user.studio_id);
      }
      
      const { data } = await query;
      setCreators(data || []);
      
      // Auto-select first creator if available
      if (data && data.length > 0 && !selectedCreatorId) {
        setSelectedCreatorId(data[0].id);
      }
    };
    
    fetchCreators();
  }, [isAdminOrStudio, user?.studio_id, user?.role]);

  useEffect(() => {
    if (effectiveCreatorId) {
      fetchBioLink();
    } else if (!isAdminOrStudio && !user?.creator_id) {
      setIsLoading(false);
    }
  }, [effectiveCreatorId, user]);

  const fetchBioLink = async () => {
    if (!effectiveCreatorId) return;

    setIsLoading(true);
    try {
      const supabase = getSupabaseBrowserClient();
      
      // Fetch bio link
      let { data: bioData, error } = await supabase
        .from("bio_links")
        .select("*")
        .eq("creator_id", effectiveCreatorId)
        .maybeSingle();

      if (error && error.code !== "PGRST116") throw error;

      // Create if doesn't exist
      if (!bioData) {
        // Get creator username for slug
        const { data: creator } = await supabase
          .from("creators")
          .select("username")
          .eq("id", effectiveCreatorId)
          .single();
        
        const username = creator?.username || `creator${Date.now()}`;
        const { data: newBio, error: createError } = await supabase
          .from("bio_links")
          .insert({
            creator_id: effectiveCreatorId,
            slug: username,
            name: username,
            is_published: false,
          })
          .select()
          .single();

        if (createError) throw createError;
        bioData = newBio;
      }

      setBioLink(bioData);

      // Fetch link items
      const { data: items } = await supabase
        .from("bio_link_items")
        .select("*")
        .eq("bio_link_id", bioData.id)
        .order("sort_order");
      setLinkItems(items || []);

      // Fetch social links
      const { data: socials } = await supabase
        .from("bio_social_links")
        .select("*")
        .eq("bio_link_id", bioData.id)
        .order("sort_order");
      setSocialLinks(socials || []);
    } catch (err) {
      console.error("Error fetching bio link:", err);
      toast.error("Failed to load bio link");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReorder = async (newOrder: BioLinkItem[]) => {
    setLinkItems(newOrder);
    
    try {
      const supabase = getSupabaseBrowserClient();
      await Promise.all(
        newOrder.map((item, index) =>
          supabase
            .from("bio_link_items")
            .update({ sort_order: index })
            .eq("id", item.id)
        )
      );
    } catch (err) {
      console.error("Error reordering:", err);
    }
  };

  const handleToggleItem = async (item: BioLinkItem) => {
    try {
      const supabase = getSupabaseBrowserClient();
      await supabase
        .from("bio_link_items")
        .update({ enabled: !item.enabled })
        .eq("id", item.id);
      
      setLinkItems((prev) =>
        prev.map((i) => (i.id === item.id ? { ...i, enabled: !i.enabled } : i))
      );
    } catch (err) {
      toast.error("Failed to update");
    }
  };

  const handleDeleteItem = async (itemId: string) => {
    if (!confirm("Delete this link?")) return;

    try {
      const supabase = getSupabaseBrowserClient();
      await supabase.from("bio_link_items").delete().eq("id", itemId);
      setLinkItems((prev) => prev.filter((i) => i.id !== itemId));
      toast.success("Link deleted");
    } catch (err) {
      toast.error("Failed to delete");
    }
  };

  const handleSaveSettings = async (data: Partial<BioLink>) => {
    if (!bioLink) return;

    try {
      const supabase = getSupabaseBrowserClient();
      const { error } = await supabase
        .from("bio_links")
        .update(data)
        .eq("id", bioLink.id);

      if (error) throw error;
      toast.success("Settings saved");
      fetchBioLink();
    } catch (err) {
      console.error("Error saving settings:", err);
      toast.error("Failed to save settings");
    }
  };

  const copyLink = () => {
    const url = bioLink?.custom_domain 
      ? `https://${bioLink.custom_domain}`
      : `${window.location.origin}/creator/${bioLink?.slug}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success("Link copied!");
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-violet-600 animate-spin" />
      </div>
    );
  }

  // Show message only for non-admin/studio users without creator profile
  if (!isAdminOrStudio && !user?.creator_id) {
    return (
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 flex items-center gap-3">
        <AlertCircle className="w-5 h-5 text-amber-500" />
        <p className="text-amber-700">
          You need to be linked to a creator profile to manage bio links.
        </p>
      </div>
    );
  }
  
  // Admin/Studio with no creators
  if (isAdminOrStudio && creators.length === 0) {
    return (
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 text-center">
        <AlertCircle className="w-8 h-8 text-slate-400 mx-auto mb-3" />
        <p className="text-slate-600 font-medium">No creators found</p>
        <p className="text-slate-500 text-sm">Add creators to manage their bio links</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Admin/Studio Creator Selector */}
      {isAdminOrStudio && creators.length > 0 && (
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <Label className="text-sm font-medium text-slate-700 mb-2 block">
            Select Creator to Edit
          </Label>
          <select
            value={selectedCreatorId || ""}
            onChange={(e) => setSelectedCreatorId(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
          >
            {creators.map((c) => (
              <option key={c.id} value={c.id}>
                @{c.username}
              </option>
            ))}
          </select>
        </div>
      )}
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Bio Links</h1>
          <p className="text-slate-500">
            {isAdminOrStudio && selectedCreatorId 
              ? `Managing @${creators.find(c => c.id === selectedCreatorId)?.username}'s bio link`
              : "Manage your bio link page"
            }
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={copyLink}>
            {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
            {copied ? "Copied!" : "Copy Link"}
          </Button>
          <a href={bioLink?.custom_domain ? `https://${bioLink.custom_domain}` : `https://bites.bio/${bioLink?.slug}`} target="_blank" rel="noopener noreferrer">
            <Button variant="outline" size="sm">
              <ExternalLink className="w-4 h-4 mr-2" />
              Preview
            </Button>
          </a>
        </div>
      </div>

      {/* Status Card */}
      <div className={`rounded-2xl p-5 ${
        bioLink?.is_published
          ? "bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200"
          : "bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200"
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
              bioLink?.is_published ? "bg-green-100" : "bg-amber-100"
            }`}>
              {bioLink?.is_published ? (
                <Check className="w-6 h-6 text-green-600" />
              ) : (
                <AlertCircle className="w-6 h-6 text-amber-600" />
              )}
            </div>
            <div>
              <p className={`font-semibold text-lg ${
                bioLink?.is_published ? "text-green-800" : "text-amber-800"
              }`}>
                {bioLink?.is_published ? "Published" : "Draft"}
              </p>
              <p className={`text-sm ${
                bioLink?.is_published ? "text-green-600" : "text-amber-600"
              }`}>
                {bioLink?.is_published
                  ? "Your bio link is live and visible"
                  : "Complete setup and publish to go live"}
              </p>
            </div>
          </div>
          <Button
            size="sm"
            onClick={() => setShowSettings(true)}
            className={bioLink?.is_published 
              ? "bg-green-600 hover:bg-green-700"
              : "bg-amber-600 hover:bg-amber-700"}
          >
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-2 gap-4">
        <Link href="/dashboard/bio-links/analytics">
          <div className="bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl p-5 text-white hover:opacity-90 transition-opacity cursor-pointer">
            <BarChart3 className="w-8 h-8 mb-3 opacity-80" />
            <p className="font-semibold text-lg">Analytics</p>
            <p className="text-sm text-white/70">View performance stats</p>
          </div>
        </Link>
        <Link href="/dashboard/bio-links/domains">
          <div className="bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl p-5 text-white hover:opacity-90 transition-opacity cursor-pointer">
            <Globe className="w-8 h-8 mb-3 opacity-80" />
            <p className="font-semibold text-lg">Domains</p>
            <p className="text-sm text-white/70">Custom domain settings</p>
          </div>
        </Link>
      </div>

      {/* Links Section */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Your Links</h2>
            <p className="text-sm text-slate-500">Drag to reorder, click to edit</p>
          </div>
          <Button onClick={() => { setEditingItem(null); setShowLinkEditor(true); }} className="bg-violet-600 hover:bg-violet-700">
            <Plus className="w-4 h-4 mr-2" />
            Add Link
          </Button>
        </div>

        {linkItems.length === 0 ? (
          <div className="bg-slate-50 border border-dashed border-slate-300 rounded-xl p-8 text-center">
            <Link2 className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="font-semibold text-slate-700 mb-2">No links yet</h3>
            <p className="text-slate-500 text-sm mb-4">Add your first link to get started</p>
            <Button
              variant="outline"
              onClick={() => { setEditingItem(null); setShowLinkEditor(true); }}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Link
            </Button>
          </div>
        ) : (
          <Reorder.Group
            axis="y"
            values={linkItems}
            onReorder={handleReorder}
            className="space-y-3"
          >
            {linkItems.map((item) => (
              <LinkCard
                key={item.id}
                item={item}
                onEdit={() => { setEditingItem(item); setShowLinkEditor(true); }}
                onDelete={() => handleDeleteItem(item.id)}
                onToggle={() => handleToggleItem(item)}
              />
            ))}
          </Reorder.Group>
        )}
      </div>

      {/* Modals */}
      <AnimatePresence>
        {showSettings && bioLink && effectiveCreatorId && (
          <SettingsModal
            bioLink={bioLink}
            onSave={handleSaveSettings}
            onClose={() => setShowSettings(false)}
            creatorId={effectiveCreatorId}
            apiKey={apiKey}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showLinkEditor && bioLink && (
          <LinkEditor
            item={editingItem}
            bioLinkId={bioLink.id}
            onSave={fetchBioLink}
            onClose={() => { setShowLinkEditor(false); setEditingItem(null); }}
            creatorId={effectiveCreatorId!}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
