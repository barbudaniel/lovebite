"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, Reorder } from "motion/react";
import { useDashboard } from "../layout";
import { getSupabaseBrowserClient } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
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

const ICON_TYPES = [
  { id: "crown", icon: Crown, label: "Crown" },
  { id: "heart", icon: Heart, label: "Heart" },
  { id: "video", icon: Video, label: "Video" },
  { id: "footprints", icon: Footprints, label: "Footprints" },
  { id: "link", icon: Link2, label: "Link" },
  { id: "globe", icon: Globe, label: "Globe" },
];

const SOCIAL_PLATFORMS = ["x", "instagram", "reddit", "tiktok", "youtube"];

// ============================================
// LINK ITEM COMPONENT
// ============================================

function LinkItem({
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
  const iconDef = ICON_TYPES.find((i) => i.id === item.icon_type) || ICON_TYPES[4];
  const Icon = iconDef.icon;

  return (
    <Reorder.Item
      value={item}
      className={`bg-white rounded-xl border ${
        item.enabled ? "border-slate-200" : "border-slate-100 opacity-60"
      } p-4 cursor-grab active:cursor-grabbing hover:shadow-md transition-all`}
    >
      <div className="flex items-center gap-4">
        <GripVertical className="w-5 h-5 text-slate-300 shrink-0" />
        <div
          className={`w-10 h-10 rounded-lg ${item.icon_color || "bg-slate-100"} flex items-center justify-center shrink-0`}
        >
          <Icon className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-medium text-slate-900 truncate">{item.label}</p>
          {item.sub_text && (
            <p className="text-sm text-slate-500 truncate">{item.sub_text}</p>
          )}
        </div>
        {item.pill_text && (
          <span
            className={`px-2 py-0.5 rounded-full text-xs font-medium ${
              item.pill_color || "bg-slate-100 text-slate-600"
            }`}
          >
            {item.pill_text}
          </span>
        )}
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={onToggle}
            className={`p-2 rounded-lg ${
              item.enabled
                ? "text-green-500 hover:bg-green-50"
                : "text-slate-400 hover:bg-slate-50"
            }`}
          >
            {item.enabled ? (
              <Eye className="w-4 h-4" />
            ) : (
              <Eye className="w-4 h-4 opacity-50" />
            )}
          </button>
          <button
            onClick={onEdit}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={onDelete}
            className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
          >
            <Trash2 className="w-4 h-4" />
          </button>
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
  onSave,
  onClose,
}: {
  item: BioLinkItem | null;
  onSave: (data: Partial<BioLinkItem>) => void;
  onClose: () => void;
}) {
  const [formData, setFormData] = useState({
    label: item?.label || "",
    sub_text: item?.sub_text || "",
    href: item?.href || "",
    icon_type: item?.icon_type || "link",
    icon_color: item?.icon_color || "bg-slate-500",
    pill_text: item?.pill_text || "",
    pill_color: item?.pill_color || "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.label || !formData.href) {
      toast.error("Label and URL are required");
      return;
    }
    onSave({
      label: formData.label,
      sub_text: formData.sub_text || null,
      href: formData.href,
      icon_type: formData.icon_type,
      icon_color: formData.icon_color || null,
      pill_text: formData.pill_text || null,
      pill_color: formData.pill_color || null,
    });
  };

  const colorOptions = [
    "bg-slate-500",
    "bg-red-500",
    "bg-orange-500",
    "bg-amber-500",
    "bg-green-500",
    "bg-blue-500",
    "bg-purple-500",
    "bg-pink-500",
    "bg-rose-500",
    "bg-sky-500",
  ];

  return (
    <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
      <DialogContent size="md">
        <DialogHeader>
          <DialogTitle>{item ? "Edit Link" : "Add Link"}</DialogTitle>
          <DialogDescription>
            {item ? "Update your link settings" : "Add a new link to your bio page"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <DialogBody className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="label">Label *</Label>
              <Input
                id="label"
                value={formData.label}
                onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                placeholder="OnlyFans VIP"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="sub_text">Subtitle</Label>
              <Input
                id="sub_text"
                value={formData.sub_text}
                onChange={(e) => setFormData({ ...formData, sub_text: e.target.value })}
                placeholder="Exclusive content just for you"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="href">URL *</Label>
              <Input
                id="href"
                type="url"
                value={formData.href}
                onChange={(e) => setFormData({ ...formData, href: e.target.value })}
                placeholder="https://onlyfans.com/username"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Icon</Label>
                <div className="flex flex-wrap gap-2">
                  {ICON_TYPES.map((iconDef) => {
                    const Icon = iconDef.icon;
                    return (
                      <button
                        key={iconDef.id}
                        type="button"
                        onClick={() => setFormData({ ...formData, icon_type: iconDef.id })}
                        className={`p-2 rounded-lg border transition-all ${
                          formData.icon_type === iconDef.id
                            ? "border-brand-500 bg-brand-50"
                            : "border-slate-200 hover:border-slate-300"
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Icon Color</Label>
                <div className="flex flex-wrap gap-2">
                  {colorOptions.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setFormData({ ...formData, icon_color: color })}
                      className={`w-8 h-8 rounded-lg ${color} transition-all ${
                        formData.icon_color === color
                          ? "ring-2 ring-offset-2 ring-brand-500"
                          : ""
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="pill_text">Badge Text</Label>
                <Input
                  id="pill_text"
                  value={formData.pill_text}
                  onChange={(e) => setFormData({ ...formData, pill_text: e.target.value })}
                  placeholder="FREE"
                />
              </div>

              <div className="space-y-2">
                <Label>Badge Color</Label>
                <select
                  value={formData.pill_color}
                  onChange={(e) => setFormData({ ...formData, pill_color: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900"
                >
                  <option value="">Default</option>
                  <option value="bg-green-100 text-green-700">Green</option>
                  <option value="bg-blue-100 text-blue-700">Blue</option>
                  <option value="bg-purple-100 text-purple-700">Purple</option>
                  <option value="bg-amber-100 text-amber-700">Amber</option>
                  <option value="bg-rose-100 text-rose-700">Rose</option>
                </select>
              </div>
            </div>
          </DialogBody>

          <DialogFooter className="gap-3">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1 bg-brand-600 hover:bg-brand-700">
              <Save className="w-4 h-4 mr-2" />
              Save
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ============================================
// MAIN PAGE
// ============================================

export default function BioLinksPage() {
  const { user } = useDashboard();
  const [bioLink, setBioLink] = useState<BioLink | null>(null);
  const [linkItems, setLinkItems] = useState<BioLinkItem[]>([]);
  const [socialLinks, setSocialLinks] = useState<BioSocialLink[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<BioLinkItem | null>(null);
  const [showEditor, setShowEditor] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Bio link settings form
  const [bioSettings, setBioSettings] = useState({
    name: "",
    slug: "",
    tagline: "",
    subtitle: "",
    welcome_title: "",
    welcome_text: "",
    profile_image_url: "",
    is_published: false,
  });

  useEffect(() => {
    fetchBioLink();
  }, [user]);

  const fetchBioLink = async () => {
    if (!user?.creator_id) {
      setIsLoading(false);
      return;
    }

    try {
      const supabase = getSupabaseBrowserClient();

      // Get or create bio link
      let { data: bio, error: bioError } = await supabase
        .from("bio_links")
        .select("*")
        .eq("creator_id", user.creator_id)
        .single();

      if (bioError && bioError.code === "PGRST116") {
        // No bio link exists, create one
        const { data: creator } = await supabase
          .from("creators")
          .select("username")
          .eq("id", user.creator_id)
          .single();

        const { data: newBio, error: createError } = await supabase
          .from("bio_links")
          .insert({
            creator_id: user.creator_id,
            slug: creator?.username || `creator-${user.creator_id.slice(0, 8)}`,
            name: user.display_name || creator?.username || "My Bio",
          })
          .select()
          .single();

        if (createError) throw createError;
        bio = newBio;
      } else if (bioError) {
        throw bioError;
      }

      setBioLink(bio);
      setBioSettings({
        name: bio.name || "",
        slug: bio.slug || "",
        tagline: bio.tagline || "",
        subtitle: bio.subtitle || "",
        welcome_title: bio.welcome_title || "",
        welcome_text: bio.welcome_text || "",
        profile_image_url: bio.profile_image_url || "",
        is_published: bio.is_published || false,
      });

      // Get link items
      const { data: items, error: itemsError } = await supabase
        .from("bio_link_items")
        .select("*")
        .eq("bio_link_id", bio.id)
        .order("sort_order");

      if (itemsError) throw itemsError;
      setLinkItems(items || []);

      // Get social links
      const { data: socials, error: socialsError } = await supabase
        .from("bio_social_links")
        .select("*")
        .eq("bio_link_id", bio.id)
        .order("sort_order");

      if (socialsError) throw socialsError;
      setSocialLinks(socials || []);
    } catch (err: any) {
      console.error("Error fetching bio link:", err?.message || err?.code || JSON.stringify(err));
      setError(err?.message || "Failed to load bio link");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReorder = async (newItems: BioLinkItem[]) => {
    setLinkItems(newItems);

    try {
      const supabase = getSupabaseBrowserClient();

      // Update sort orders
      for (let i = 0; i < newItems.length; i++) {
        await supabase
          .from("bio_link_items")
          .update({ sort_order: i })
          .eq("id", newItems[i].id);
      }
    } catch (err) {
      console.error("Error reordering:", err);
      toast.error("Failed to save order");
    }
  };

  const handleSaveItem = async (data: Partial<BioLinkItem>) => {
    if (!bioLink) return;

    setIsSaving(true);
    try {
      const supabase = getSupabaseBrowserClient();

      if (editingItem) {
        // Update existing
        const { error: updateError } = await supabase
          .from("bio_link_items")
          .update(data)
          .eq("id", editingItem.id);

        if (updateError) throw updateError;
        toast.success("Link updated");
      } else {
        // Create new
        const { error: insertError } = await supabase.from("bio_link_items").insert({
          bio_link_id: bioLink.id,
          ...data,
          sort_order: linkItems.length,
        });

        if (insertError) throw insertError;
        toast.success("Link added");
      }

      fetchBioLink();
      setShowEditor(false);
      setEditingItem(null);
    } catch (err) {
      console.error("Error saving item:", err);
      toast.error("Failed to save link");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteItem = async (id: string) => {
    if (!confirm("Delete this link?")) return;

    try {
      const supabase = getSupabaseBrowserClient();
      const { error } = await supabase.from("bio_link_items").delete().eq("id", id);

      if (error) throw error;
      setLinkItems((prev) => prev.filter((item) => item.id !== id));
      toast.success("Link deleted");
    } catch (err) {
      console.error("Error deleting:", err);
      toast.error("Failed to delete link");
    }
  };

  const handleToggleItem = async (id: string) => {
    const item = linkItems.find((i) => i.id === id);
    if (!item) return;

    try {
      const supabase = getSupabaseBrowserClient();
      const { error } = await supabase
        .from("bio_link_items")
        .update({ enabled: !item.enabled })
        .eq("id", id);

      if (error) throw error;
      setLinkItems((prev) =>
        prev.map((i) => (i.id === id ? { ...i, enabled: !i.enabled } : i))
      );
    } catch (err) {
      console.error("Error toggling:", err);
      toast.error("Failed to update link");
    }
  };

  const handleSaveSettings = async () => {
    if (!bioLink) return;

    setIsSaving(true);
    try {
      const supabase = getSupabaseBrowserClient();
      const { error } = await supabase
        .from("bio_links")
        .update({
          name: bioSettings.name,
          slug: bioSettings.slug,
          tagline: bioSettings.tagline || null,
          subtitle: bioSettings.subtitle || null,
          welcome_title: bioSettings.welcome_title || null,
          welcome_text: bioSettings.welcome_text || null,
          profile_image_url: bioSettings.profile_image_url || null,
          is_published: bioSettings.is_published,
        })
        .eq("id", bioLink.id);

      if (error) throw error;
      toast.success("Settings saved");
      setShowSettings(false);
      fetchBioLink();
    } catch (err) {
      console.error("Error saving settings:", err);
      toast.error("Failed to save settings");
    } finally {
      setIsSaving(false);
    }
  };

  const copyLink = () => {
    const url = `${window.location.origin}/creator/${bioLink?.slug}`;
    navigator.clipboard.writeText(url);
    toast.success("Link copied!");
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-brand-600 animate-spin" />
      </div>
    );
  }

  if (!user?.creator_id) {
    return (
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 flex items-center gap-3">
        <AlertCircle className="w-5 h-5 text-amber-500" />
        <p className="text-amber-700">
          You need to be linked to a creator profile to manage bio links.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Bio Links</h1>
          <p className="text-slate-500">Customize your bio link page</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={copyLink}>
            <Copy className="w-4 h-4 mr-2" />
            Copy Link
          </Button>
          <a
            href={`/creator/${bioLink?.slug}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="outline" size="sm">
              <ExternalLink className="w-4 h-4 mr-2" />
              Preview
            </Button>
          </a>
          <Button
            size="sm"
            onClick={() => setShowSettings(true)}
            className="bg-brand-600 hover:bg-brand-700"
          >
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>

      {/* Status */}
      <div
        className={`rounded-xl p-4 flex items-center justify-between ${
          bioLink?.is_published
            ? "bg-green-50 border border-green-200"
            : "bg-amber-50 border border-amber-200"
        }`}
      >
        <div className="flex items-center gap-3">
          {bioLink?.is_published ? (
            <Check className="w-5 h-5 text-green-600" />
          ) : (
            <AlertCircle className="w-5 h-5 text-amber-600" />
          )}
          <div>
            <p
              className={`font-medium ${
                bioLink?.is_published ? "text-green-800" : "text-amber-800"
              }`}
            >
              {bioLink?.is_published ? "Published" : "Draft"}
            </p>
            <p
              className={`text-sm ${
                bioLink?.is_published ? "text-green-600" : "text-amber-600"
              }`}
            >
              {bioLink?.is_published
                ? "Your bio link is live and visible"
                : "Publish to make your bio link visible"}
            </p>
          </div>
        </div>
        {!bioLink?.is_published && (
          <Button
            size="sm"
            onClick={async () => {
              const supabase = getSupabaseBrowserClient();
              await supabase
                .from("bio_links")
                .update({ is_published: true })
                .eq("id", bioLink?.id);
              fetchBioLink();
              toast.success("Bio link published!");
            }}
            className="bg-green-600 hover:bg-green-700"
          >
            Publish
          </Button>
        )}
      </div>

      {/* Domain Management Section */}
      <div className="bg-gradient-to-r from-violet-50 to-pink-50 rounded-2xl border border-violet-200 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center">
            <Globe className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="font-semibold text-slate-900">Your Bio Links</h2>
            <p className="text-sm text-slate-500">Share your profile anywhere</p>
          </div>
        </div>
        
        <div className="space-y-3">
          {/* Main bites.bio link */}
          <div className="bg-white rounded-xl p-4 flex items-center justify-between border border-violet-100">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-violet-100 flex items-center justify-center">
                <Link2 className="w-4 h-4 text-violet-600" />
              </div>
              <div>
                <p className="text-xs text-slate-500">Primary Link</p>
                <a
                  href={`https://bites.bio/${bioLink?.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-violet-600 font-medium hover:text-violet-800 flex items-center gap-1"
                >
                  bites.bio/{bioLink?.slug}
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                navigator.clipboard.writeText(`https://bites.bio/${bioLink?.slug}`);
                toast.success("Link copied!");
              }}
            >
              <Copy className="w-4 h-4" />
            </Button>
          </div>

          {/* Custom Domain */}
          {bioLink?.custom_domain ? (
            <div className="bg-white rounded-xl p-4 flex items-center justify-between border border-pink-100">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-pink-100 flex items-center justify-center">
                  <Globe className="w-4 h-4 text-pink-600" />
                </div>
                <div>
                  <p className="text-xs text-slate-500">Custom Domain</p>
                  <a
                    href={`https://${bioLink.custom_domain}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-pink-600 font-medium hover:text-pink-800 flex items-center gap-1"
                  >
                    {bioLink.custom_domain}
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Active</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    navigator.clipboard.writeText(`https://${bioLink.custom_domain}`);
                    toast.success("Link copied!");
                  }}
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ) : (
            <a
              href="/dashboard/bio-links/domains"
              className="block bg-white/50 rounded-xl p-4 border-2 border-dashed border-pink-200 hover:border-pink-300 hover:bg-white transition-all group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-pink-50 flex items-center justify-center group-hover:bg-pink-100">
                    <Plus className="w-4 h-4 text-pink-400 group-hover:text-pink-600" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-700 group-hover:text-pink-700">Add Custom Domain</p>
                    <p className="text-xs text-slate-500">Use your own domain like yourname.com</p>
                  </div>
                </div>
                <span className="text-pink-500 group-hover:text-pink-600">→</span>
              </div>
            </a>
          )}
        </div>
      </div>

      {/* Links Section */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-slate-900">Links</h2>
          <Button
            size="sm"
            onClick={() => {
              setEditingItem(null);
              setShowEditor(true);
            }}
            className="bg-brand-600 hover:bg-brand-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Link
          </Button>
        </div>

        {linkItems.length === 0 ? (
          <div className="text-center py-12 bg-slate-50 rounded-xl border border-dashed border-slate-200">
            <Link2 className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500 mb-4">No links yet</p>
            <Button
              onClick={() => {
                setEditingItem(null);
                setShowEditor(true);
              }}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add your first link
            </Button>
          </div>
        ) : (
          <Reorder.Group
            values={linkItems}
            onReorder={handleReorder}
            className="space-y-3"
          >
            {linkItems.map((item) => (
              <LinkItem
                key={item.id}
                item={item}
                onEdit={() => {
                  setEditingItem(item);
                  setShowEditor(true);
                }}
                onDelete={() => handleDeleteItem(item.id)}
                onToggle={() => handleToggleItem(item.id)}
              />
            ))}
          </Reorder.Group>
        )}
      </div>

      {/* Link Editor Modal */}
      <AnimatePresence>
        {showEditor && (
          <LinkEditor
            item={editingItem}
            onSave={handleSaveItem}
            onClose={() => {
              setShowEditor(false);
              setEditingItem(null);
            }}
          />
        )}
      </AnimatePresence>

      {/* Settings Modal */}
      <AnimatePresence>
        {showSettings && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50"
              onClick={() => setShowSettings(false)}
            />
            <motion.div
              initial={{ opacity: 0, x: "100%" }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: "100%" }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white shadow-xl z-50 overflow-y-auto"
            >
              <div className="p-6 border-b border-slate-200 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-slate-900">Bio Settings</h3>
                <button
                  onClick={() => setShowSettings(false)}
                  className="p-2 hover:bg-slate-100 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Display Name</Label>
                  <Input
                    id="name"
                    value={bioSettings.name}
                    onChange={(e) =>
                      setBioSettings({ ...bioSettings, name: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="slug">URL Slug</Label>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-slate-400">
                      {window.location.origin}/creator/
                    </span>
                    <Input
                      id="slug"
                      value={bioSettings.slug}
                      onChange={(e) =>
                        setBioSettings({ ...bioSettings, slug: e.target.value })
                      }
                      className="flex-1"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tagline">Tagline</Label>
                  <Input
                    id="tagline"
                    value={bioSettings.tagline}
                    onChange={(e) =>
                      setBioSettings({ ...bioSettings, tagline: e.target.value })
                    }
                    placeholder="Model • Creator • Dreamer"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subtitle">Subtitle</Label>
                  <Input
                    id="subtitle"
                    value={bioSettings.subtitle}
                    onChange={(e) =>
                      setBioSettings({ ...bioSettings, subtitle: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="welcome_title">Welcome Title</Label>
                  <Input
                    id="welcome_title"
                    value={bioSettings.welcome_title}
                    onChange={(e) =>
                      setBioSettings({ ...bioSettings, welcome_title: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="welcome_text">Welcome Text</Label>
                  <Textarea
                    id="welcome_text"
                    value={bioSettings.welcome_text}
                    onChange={(e) =>
                      setBioSettings({ ...bioSettings, welcome_text: e.target.value })
                    }
                    rows={4}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="profile_image_url">Profile Image URL</Label>
                  <Input
                    id="profile_image_url"
                    value={bioSettings.profile_image_url}
                    onChange={(e) =>
                      setBioSettings({ ...bioSettings, profile_image_url: e.target.value })
                    }
                    placeholder="https://..."
                  />
                </div>

                <label className="flex items-center gap-3 cursor-pointer pt-4 border-t">
                  <div
                    className={`w-10 h-6 rounded-full transition-colors ${
                      bioSettings.is_published ? "bg-green-500" : "bg-slate-300"
                    } relative`}
                    onClick={() =>
                      setBioSettings({
                        ...bioSettings,
                        is_published: !bioSettings.is_published,
                      })
                    }
                  >
                    <div
                      className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${
                        bioSettings.is_published ? "left-5" : "left-1"
                      }`}
                    />
                  </div>
                  <span className="text-sm text-slate-700">Published</span>
                </label>

                <Button
                  onClick={handleSaveSettings}
                  disabled={isSaving}
                  className="w-full bg-brand-600 hover:bg-brand-700 mt-6"
                >
                  {isSaving ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  ) : (
                    <Save className="w-4 h-4 mr-2" />
                  )}
                  Save Settings
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

