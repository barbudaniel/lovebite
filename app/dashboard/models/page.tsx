"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useDashboard } from "../layout";
import { getSupabaseBrowserClient } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { format } from "date-fns";
import {
  Users,
  Search,
  Plus,
  Eye,
  Edit2,
  Trash2,
  Copy,
  X,
  Loader2,
  AlertCircle,
  CheckCircle,
  UserPlus,
  MoreVertical,
  ExternalLink,
  BarChart3,
  Image as ImageIcon,
  Link as LinkIcon,
  Mail,
  Phone,
  Power,
  PowerOff,
  Settings,
  ChevronRight,
  Palette,
  Globe,
  Send,
  Clock,
  XCircle,
  UserCheck,
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

interface Creator {
  id: string;
  username: string;
  display_name: string | null;
  bio: string | null;
  email: string | null;
  phone: string | null;
  avatar_url: string | null;
  group_id: string;
  studio_id: string | null;
  active: boolean;
  enabled: boolean;
  created_at: string;
  updated_at: string;
}

interface DashboardUser {
  id: string;
  auth_user_id: string | null;
  email: string;
  display_name: string | null;
  role: string;
  creator_id: string | null;
  studio_id: string | null;
  enabled: boolean;
}

interface BioLink {
  id: string;
  creator_id: string;
  slug: string;
  name: string;
  tagline: string | null;
  is_published: boolean;
  custom_domain: string | null;
}

interface StudioInvite {
  id: string;
  studio_id: string;
  creator_id: string;
  status: "pending" | "accepted" | "declined" | "cancelled";
  message: string | null;
  created_at: string;
  responded_at: string | null;
  creator?: {
    id: string;
    username: string;
  };
}

// ============================================
// MODEL CARD
// ============================================

function ModelCard({
  creator,
  dashboardUser,
  bioLink,
  onEdit,
  onRemove,
  onViewProfile,
  onToggleActive,
  onEditBioLink,
  onViewStats,
}: {
  creator: Creator;
  dashboardUser?: DashboardUser;
  bioLink?: BioLink;
  onEdit: () => void;
  onRemove: () => void;
  onViewProfile: () => void;
  onToggleActive: () => void;
  onEditBioLink: () => void;
  onViewStats: () => void;
}) {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white rounded-xl border overflow-hidden hover:shadow-lg transition-all group ${
        !creator.active || !creator.enabled ? "border-slate-200 opacity-75" : "border-slate-200"
      }`}
    >
      {/* Header / Avatar */}
      <div className="relative h-24 bg-gradient-to-br from-brand-100 to-brand-200">
        {creator.avatar_url ? (
          <img
            src={creator.avatar_url}
            alt={creator.display_name || creator.username}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-4xl font-bold text-brand-300">
              {(creator.display_name || creator.username).charAt(0).toUpperCase()}
            </span>
          </div>
        )}

        {/* Status badge */}
        <div className="absolute top-3 right-3">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleActive();
            }}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-all ${
              creator.active && creator.enabled
                ? "bg-green-100 text-green-700 hover:bg-green-200"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            {creator.active && creator.enabled ? (
              <>
                <Power className="w-3 h-3" />
                Active
              </>
            ) : (
              <>
                <PowerOff className="w-3 h-3" />
                Inactive
              </>
            )}
          </button>
        </div>

        {/* Actions menu */}
        <div className="absolute top-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-1.5 bg-white/80 backdrop-blur rounded-lg hover:bg-white transition-colors"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {showMenu && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)} />
                <div className="absolute top-full left-0 mt-1 bg-white rounded-lg shadow-lg border border-slate-200 py-1 z-20 min-w-[160px]">
                  <button
                    onClick={() => {
                      onViewProfile();
                      setShowMenu(false);
                    }}
                    className="w-full px-3 py-2 text-left text-sm hover:bg-slate-50 flex items-center gap-2"
                  >
                    <Eye className="w-4 h-4" />
                    View Profile
                  </button>
                  <button
                    onClick={() => {
                      onEdit();
                      setShowMenu(false);
                    }}
                    className="w-full px-3 py-2 text-left text-sm hover:bg-slate-50 flex items-center gap-2"
                  >
                    <Edit2 className="w-4 h-4" />
                    Edit Model
                  </button>
                  <button
                    onClick={() => {
                      onEditBioLink();
                      setShowMenu(false);
                    }}
                    className="w-full px-3 py-2 text-left text-sm hover:bg-slate-50 flex items-center gap-2"
                  >
                    <LinkIcon className="w-4 h-4" />
                    Edit Bio Link
                  </button>
                  <button
                    onClick={() => {
                      onViewStats();
                      setShowMenu(false);
                    }}
                    className="w-full px-3 py-2 text-left text-sm hover:bg-slate-50 flex items-center gap-2"
                  >
                    <BarChart3 className="w-4 h-4" />
                    View Stats
                  </button>
                  <div className="border-t border-slate-100 my-1" />
                  <button
                    onClick={() => {
                      onRemove();
                      setShowMenu(false);
                    }}
                    className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    Remove
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="font-semibold text-slate-900 truncate">
              {creator.display_name || creator.username}
            </h3>
            <p className="text-sm text-slate-500 truncate">@{creator.username}</p>
          </div>
        </div>

        {/* Contact info */}
        <div className="flex flex-col gap-1 mt-3 pt-3 border-t border-slate-100">
          {creator.email && (
            <span className="text-xs text-slate-500 flex items-center gap-1 truncate">
              <Mail className="w-3 h-3 shrink-0" />
              {creator.email}
            </span>
          )}
          {creator.phone && (
            <span className="text-xs text-slate-500 flex items-center gap-1">
              <Phone className="w-3 h-3 shrink-0" />
              {creator.phone}
            </span>
          )}
        </div>

        {/* Bio Link Info */}
        {bioLink && (
          <div className="mt-3 p-3 bg-gradient-to-r from-violet-50 to-pink-50 rounded-lg border border-violet-100">
            <div className="flex items-center gap-2 mb-2">
              <LinkIcon className="w-4 h-4 text-violet-600" />
              <span className="text-xs font-medium text-violet-700">Bio Links</span>
              <span
                className={`ml-auto text-xs px-1.5 py-0.5 rounded ${
                  bioLink.is_published
                    ? "bg-green-100 text-green-700"
                    : "bg-slate-100 text-slate-500"
                }`}
              >
                {bioLink.is_published ? "Live" : "Draft"}
              </span>
            </div>
            <div className="space-y-1">
              {/* Main bites.bio link */}
              <a
                href={`https://bites.bio/${bioLink.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs text-violet-600 hover:text-violet-800 transition-colors"
              >
                <span className="truncate">bites.bio/{bioLink.slug}</span>
                <ExternalLink className="w-3 h-3 shrink-0" />
              </a>
              {/* Custom domain if exists */}
              {bioLink.custom_domain && (
                <a
                  href={`https://${bioLink.custom_domain}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-xs text-pink-600 hover:text-pink-800 transition-colors"
                >
                  <Globe className="w-3 h-3 shrink-0" />
                  <span className="truncate">{bioLink.custom_domain}</span>
                  <ExternalLink className="w-3 h-3 shrink-0" />
                </a>
              )}
            </div>
          </div>
        )}

        {/* No Bio Link */}
        {!bioLink && (
          <button
            onClick={onEditBioLink}
            className="mt-3 w-full p-3 border-2 border-dashed border-slate-200 rounded-lg text-center hover:border-violet-300 hover:bg-violet-50/50 transition-colors group"
          >
            <LinkIcon className="w-4 h-4 text-slate-400 group-hover:text-violet-500 mx-auto mb-1" />
            <span className="text-xs text-slate-500 group-hover:text-violet-600">Create Bio Link</span>
          </button>
        )}

        {/* Status indicators */}
        <div className="flex flex-wrap gap-2 mt-3">
          {dashboardUser && (
            <span className="inline-flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
              <CheckCircle className="w-3 h-3" />
              Dashboard
            </span>
          )}
        </div>

        {/* Quick actions */}
        <div className="flex gap-2 mt-4">
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={onEditBioLink}
          >
            <LinkIcon className="w-3 h-3 mr-1" />
            Bio Link
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={onViewStats}
          >
            <BarChart3 className="w-3 h-3 mr-1" />
            Stats
          </Button>
        </div>
      </div>
    </motion.div>
  );
}

// ============================================
// ADD/EDIT MODEL MODAL
// ============================================

function ModelModal({
  mode,
  creator,
  studioId,
  onClose,
  onSaved,
}: {
  mode: "add" | "edit";
  creator?: Creator;
  studioId: string;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [isSaving, setIsSaving] = useState(false);
  const [createDashboardAccess, setCreateDashboardAccess] = useState(mode === "add");
  const [formData, setFormData] = useState({
    username: creator?.username || "",
    displayName: creator?.display_name || "",
    email: creator?.email || "",
    phone: creator?.phone || "",
    bio: creator?.bio || "",
    active: creator?.active ?? true,
  });
  const [tempPassword, setTempPassword] = useState("");

  useEffect(() => {
    if (mode === "add") {
      const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789";
      let pwd = "";
      for (let i = 0; i < 10; i++) {
        pwd += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      setTempPassword(pwd);
    }
  }, [mode]);

  const handleSave = async () => {
    if (!formData.username) {
      toast.error("Username is required");
      return;
    }
    if (mode === "add" && !formData.email) {
      toast.error("Email is required for new models");
      return;
    }

    setIsSaving(true);
    try {
      const supabase = getSupabaseBrowserClient();

      if (mode === "add") {
        const { data: newCreator, error: creatorError } = await supabase
          .from("creators")
          .insert({
            username: formData.username.toLowerCase().replace(/\s+/g, ""),
            display_name: formData.displayName || formData.username,
            email: formData.email,
            phone: formData.phone || null,
            bio: formData.bio || null,
            group_id: crypto.randomUUID(),
            studio_id: studioId,
            active: formData.active,
            enabled: true,
          })
          .select()
          .single();

        if (creatorError) throw creatorError;

        if (createDashboardAccess && formData.email) {
          const authResponse = await fetch("/api/admin/create-user", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: formData.email,
              password: tempPassword,
              fullName: formData.displayName,
            }),
          });

          const authData = await authResponse.json();

          await supabase.from("dashboard_users").insert({
            auth_user_id: authData?.user?.id || null,
            email: formData.email,
            role: "independent",
            display_name: formData.displayName || formData.username,
            creator_id: newCreator.id,
            studio_id: studioId,
            enabled: true,
          });

          await supabase.from("bio_links").insert({
            creator_id: newCreator.id,
            slug: formData.username.toLowerCase().replace(/\s+/g, ""),
            name: formData.displayName || formData.username,
            tagline: "Content Creator",
            is_published: false,
          });

          toast.success(`Model added! Password: ${tempPassword}`, { duration: 10000 });
        } else {
          toast.success("Model added successfully!");
        }
      } else if (mode === "edit" && creator) {
        const { error: updateError } = await supabase
          .from("creators")
          .update({
            username: formData.username.toLowerCase().replace(/\s+/g, ""),
            display_name: formData.displayName,
            email: formData.email,
            phone: formData.phone || null,
            bio: formData.bio || null,
            active: formData.active,
          })
          .eq("id", creator.id);

        if (updateError) throw updateError;
        toast.success("Model updated successfully!");
      }

      onSaved();
    } catch (err: unknown) {
      const error = err as Error;
      console.error("Error saving model:", error);
      toast.error(error.message || "Failed to save model");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
      <DialogContent size="md">
        <DialogHeader>
          <DialogTitle>{mode === "add" ? "Add New Model" : "Edit Model"}</DialogTitle>
          <DialogDescription>
            {mode === "add"
              ? "Create a new creator profile for your team"
              : "Update creator information"}
          </DialogDescription>
        </DialogHeader>

        <DialogBody className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Username *</Label>
              <Input
                value={formData.username}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    username: e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ""),
                  })
                }
                placeholder="username"
              />
            </div>
            <div className="space-y-2">
              <Label>Display Name</Label>
              <Input
                value={formData.displayName}
                onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                placeholder="Display Name"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Email {mode === "add" && "*"}</Label>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="model@example.com"
            />
          </div>

          <div className="space-y-2">
            <Label>Phone</Label>
            <Input
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="+1234567890"
            />
          </div>

          <div className="space-y-2">
            <Label>Bio</Label>
            <textarea
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              placeholder="Short bio..."
              rows={3}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-brand-500 text-slate-900"
            />
          </div>

          <label className="flex items-center gap-3 cursor-pointer p-3 rounded-lg hover:bg-slate-50 transition-colors">
            <input
              type="checkbox"
              checked={formData.active}
              onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
              className="w-4 h-4 rounded border-slate-300 text-brand-600"
            />
            <div>
              <span className="text-sm font-medium text-slate-700">Active</span>
              <p className="text-xs text-slate-500">Can receive work and assignments</p>
            </div>
          </label>

          {mode === "add" && (
            <>
              <div className="border-t border-slate-200 pt-4">
                <label className="flex items-start gap-3 cursor-pointer p-3 rounded-lg hover:bg-slate-50 transition-colors">
                  <input
                    type="checkbox"
                    checked={createDashboardAccess}
                    onChange={(e) => setCreateDashboardAccess(e.target.checked)}
                    className="w-4 h-4 mt-1 rounded border-slate-300 text-brand-600"
                  />
                  <div>
                    <span className="text-sm font-medium text-slate-900">
                      Create dashboard access
                    </span>
                    <p className="text-xs text-slate-500">
                      Model will be able to log in and manage their profile
                    </p>
                  </div>
                </label>
              </div>

              {createDashboardAccess && (
                <div className="bg-slate-50 rounded-xl p-4 space-y-3">
                  <p className="text-sm text-slate-600">Temporary password:</p>
                  <div className="flex items-center gap-2">
                    <Input
                      value={tempPassword}
                      onChange={(e) => setTempPassword(e.target.value)}
                      className="font-mono text-sm"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        navigator.clipboard.writeText(tempPassword);
                        toast.success("Password copied!");
                      }}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-amber-600">
                    ⚠️ Save this password - you won&apos;t be able to see it again!
                  </p>
                </div>
              )}
            </>
          )}
        </DialogBody>

        <DialogFooter className="gap-3">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="flex-1 bg-brand-600 hover:bg-brand-700"
          >
            {isSaving ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : (
              <Plus className="w-4 h-4 mr-2" />
            )}
            {mode === "add" ? "Add Model" : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ============================================
// INVITE MODEL MODAL
// ============================================

function InviteModelModal({
  studioId,
  onClose,
  onSent,
}: {
  studioId: string;
  onClose: () => void;
  onSent: () => void;
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Creator[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedCreator, setSelectedCreator] = useState<Creator | null>(null);
  const [inviteMessage, setInviteMessage] = useState("");
  const [isSending, setIsSending] = useState(false);

  const searchCreators = async () => {
    if (searchQuery.length < 2) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const supabase = getSupabaseBrowserClient();
      
      // Search for creators without a studio (independent models)
      const { data, error } = await supabase
        .from("creators")
        .select("*")
        .is("studio_id", null)
        .or(`username.ilike.%${searchQuery}%,email.ilike.%${searchQuery}%`)
        .limit(10);

      if (error) throw error;
      setSearchResults(data || []);
    } catch (err) {
      console.error("Error searching creators:", err);
      toast.error("Failed to search creators");
    } finally {
      setIsSearching(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(searchCreators, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleSendInvite = async () => {
    if (!selectedCreator) {
      toast.error("Please select a model to invite");
      return;
    }

    setIsSending(true);
    try {
      const response = await fetch("/api/studio-invites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          creatorId: selectedCreator.id,
          message: inviteMessage || null,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to send invite");
      }

      toast.success(`Invite sent to ${selectedCreator.display_name || selectedCreator.username}!`);
      onSent();
    } catch (err: unknown) {
      const error = err as Error;
      console.error("Error sending invite:", error);
      toast.error(error.message || "Failed to send invite");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
      <DialogContent size="md">
        <DialogHeader>
          <DialogTitle>Invite Existing Model</DialogTitle>
          <DialogDescription>
            Search for independent creators and invite them to join your team
          </DialogDescription>
        </DialogHeader>

        <DialogBody className="space-y-4">
          {/* Search */}
          <div className="space-y-2">
            <Label>Search by username or email</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Type to search..."
                className="pl-10"
              />
            </div>
          </div>

          {/* Search Results */}
          {isSearching ? (
            <div className="py-4 text-center">
              <Loader2 className="w-6 h-6 animate-spin mx-auto text-slate-400" />
            </div>
          ) : searchResults.length > 0 ? (
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {searchResults.map((creator) => (
                <button
                  key={creator.id}
                  onClick={() => setSelectedCreator(creator)}
                  className={`w-full p-3 rounded-lg border text-left transition-colors ${
                    selectedCreator?.id === creator.id
                      ? "border-brand-500 bg-brand-50"
                      : "border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-100 to-brand-200 flex items-center justify-center">
                      {creator.avatar_url ? (
                        <img
                          src={creator.avatar_url}
                          alt=""
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <span className="text-sm font-bold text-brand-600">
                          {(creator.display_name || creator.username).charAt(0).toUpperCase()}
                        </span>
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">
                        {creator.display_name || creator.username}
                      </p>
                      <p className="text-sm text-slate-500">@{creator.username}</p>
                    </div>
                    {selectedCreator?.id === creator.id && (
                      <CheckCircle className="w-5 h-5 text-brand-600 ml-auto" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          ) : searchQuery.length >= 2 ? (
            <div className="py-4 text-center text-sm text-slate-500">
              No independent creators found matching "{searchQuery}"
            </div>
          ) : null}

          {/* Selected Creator */}
          {selectedCreator && (
            <div className="bg-brand-50 rounded-xl p-4 border border-brand-200">
              <p className="text-sm font-medium text-brand-700 mb-2">Selected Model</p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-brand-200 to-brand-300 flex items-center justify-center">
                  {selectedCreator.avatar_url ? (
                    <img
                      src={selectedCreator.avatar_url}
                      alt=""
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-lg font-bold text-brand-700">
                      {(selectedCreator.display_name || selectedCreator.username).charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
                <div>
                  <p className="font-semibold text-slate-900">
                    {selectedCreator.display_name || selectedCreator.username}
                  </p>
                  <p className="text-sm text-slate-500">@{selectedCreator.username}</p>
                </div>
                <button
                  onClick={() => setSelectedCreator(null)}
                  className="ml-auto p-1 hover:bg-brand-100 rounded"
                >
                  <X className="w-4 h-4 text-slate-500" />
                </button>
              </div>
            </div>
          )}

          {/* Invite Message */}
          <div className="space-y-2">
            <Label>Message (optional)</Label>
            <textarea
              value={inviteMessage}
              onChange={(e) => setInviteMessage(e.target.value)}
              placeholder="Add a personal message to your invite..."
              rows={3}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-brand-500 text-slate-900"
            />
          </div>
        </DialogBody>

        <DialogFooter className="gap-3">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button
            onClick={handleSendInvite}
            disabled={isSending || !selectedCreator}
            className="flex-1 bg-brand-600 hover:bg-brand-700"
          >
            {isSending ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : (
              <Send className="w-4 h-4 mr-2" />
            )}
            Send Invite
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ============================================
// PENDING INVITES SECTION
// ============================================

function PendingInvitesSection({
  invites,
  onCancelInvite,
}: {
  invites: StudioInvite[];
  onCancelInvite: (inviteId: string) => void;
}) {
  const pendingInvites = invites.filter(i => i.status === "pending");
  
  if (pendingInvites.length === 0) return null;

  return (
    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
      <div className="flex items-center gap-2 mb-3">
        <Clock className="w-4 h-4 text-amber-600" />
        <span className="font-medium text-amber-800">Pending Invites ({pendingInvites.length})</span>
      </div>
      <div className="space-y-2">
        {pendingInvites.map((invite) => (
          <div
            key={invite.id}
            className="flex items-center justify-between bg-white rounded-lg p-3 border border-amber-100"
          >
            <div>
              <p className="font-medium text-slate-900">
                @{invite.creator?.username || "Unknown"}
              </p>
              <p className="text-xs text-slate-500">
                Sent {new Date(invite.created_at).toLocaleDateString()}
              </p>
            </div>
            <button
              onClick={() => onCancelInvite(invite.id)}
              className="text-sm text-red-600 hover:text-red-700 font-medium"
            >
              Cancel
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================
// BIO LINK EDITOR MODAL
// ============================================

function BioLinkEditor({
  creator,
  bioLink,
  onClose,
  onSaved,
}: {
  creator: Creator;
  bioLink: BioLink | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    slug: bioLink?.slug || creator.username,
    name: bioLink?.name || creator.display_name || creator.username,
    tagline: bioLink?.tagline || "",
    is_published: bioLink?.is_published ?? false,
  });

  const handleSave = async () => {
    if (!formData.slug) {
      toast.error("URL slug is required");
      return;
    }

    setIsSaving(true);
    try {
      const supabase = getSupabaseBrowserClient();

      if (bioLink) {
        // Update existing
        const { error } = await supabase
          .from("bio_links")
          .update({
            slug: formData.slug.toLowerCase().replace(/[^a-z0-9-]/g, ""),
            name: formData.name,
            tagline: formData.tagline || null,
            is_published: formData.is_published,
          })
          .eq("id", bioLink.id);

        if (error) throw error;
      } else {
        // Create new
        const { error } = await supabase.from("bio_links").insert({
          creator_id: creator.id,
          slug: formData.slug.toLowerCase().replace(/[^a-z0-9-]/g, ""),
          name: formData.name,
          tagline: formData.tagline || null,
          is_published: formData.is_published,
        });

        if (error) throw error;
      }

      toast.success("Bio link saved!");
      onSaved();
    } catch (err: unknown) {
      const error = err as Error;
      console.error("Error saving bio link:", error);
      toast.error(error.message || "Failed to save bio link");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
      <DialogContent size="md">
        <DialogHeader>
          <DialogTitle>Edit Bio Link</DialogTitle>
          <DialogDescription>
            Customize {creator.display_name || creator.username}&apos;s bio link page
          </DialogDescription>
        </DialogHeader>

        <DialogBody className="space-y-4">
          <div className="space-y-2">
            <Label>URL Slug</Label>
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-400 shrink-0">bites.bio/</span>
              <Input
                value={formData.slug}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""),
                  })
                }
                placeholder="username"
              />
            </div>
            {bioLink?.custom_domain && (
              <p className="text-xs text-brand-600">Custom domain: {bioLink.custom_domain}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Display Name</Label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Your Name"
            />
          </div>

          <div className="space-y-2">
            <Label>Tagline</Label>
            <Input
              value={formData.tagline}
              onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
              placeholder="Content Creator • Model"
            />
          </div>

          <label className="flex items-center gap-3 cursor-pointer p-3 rounded-lg hover:bg-slate-50 transition-colors">
            <div
              className={`w-10 h-6 rounded-full transition-colors relative ${
                formData.is_published ? "bg-green-500" : "bg-slate-300"
              }`}
            >
              <div
                className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${
                  formData.is_published ? "left-5" : "left-1"
                }`}
              />
            </div>
            <div>
              <span className="text-sm font-medium text-slate-700">Published</span>
              <p className="text-xs text-slate-500">Make bio link publicly visible</p>
            </div>
          </label>

          {bioLink && (
            <div className="bg-slate-50 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-700">Preview Links</p>
                  <p className="text-xs text-slate-500">bites.bio/{formData.slug}</p>
                  {bioLink.custom_domain && (
                    <p className="text-xs text-brand-600">{bioLink.custom_domain}</p>
                  )}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(bioLink.custom_domain ? `https://${bioLink.custom_domain}` : `https://bites.bio/${formData.slug}`, "_blank")}
                >
                  <ExternalLink className="w-4 h-4 mr-1" />
                  Preview
                </Button>
              </div>
            </div>
          )}
        </DialogBody>

        <DialogFooter className="gap-3">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="flex-1 bg-brand-600 hover:bg-brand-700"
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ============================================
// REMOVE CONFIRMATION MODAL
// ============================================

function RemoveModal({
  creator,
  onClose,
  onRemoved,
}: {
  creator: Creator;
  onClose: () => void;
  onRemoved: () => void;
}) {
  const [isRemoving, setIsRemoving] = useState(false);
  const [removeFromStudio, setRemoveFromStudio] = useState(true);
  const [deleteCompletely, setDeleteCompletely] = useState(false);

  const handleRemove = async () => {
    setIsRemoving(true);
    try {
      const supabase = getSupabaseBrowserClient();

      if (deleteCompletely) {
        await supabase.from("dashboard_users").delete().eq("creator_id", creator.id);
        await supabase.from("bio_links").delete().eq("creator_id", creator.id);
        await supabase.from("creators").delete().eq("id", creator.id);
        toast.success("Model deleted completely");
      } else if (removeFromStudio) {
        await supabase.from("creators").update({ studio_id: null }).eq("id", creator.id);
        toast.success("Creator removed from team");
      }

      onRemoved();
    } catch (err: unknown) {
      const error = err as Error;
      console.error("Error removing model:", error);
      toast.error(error.message || "Failed to remove model");
    } finally {
      setIsRemoving(false);
    }
  };

  return (
    <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
      <DialogContent size="sm">
        <DialogHeader>
          <DialogTitle>Remove Model</DialogTitle>
          <DialogDescription>
            {creator.display_name || creator.username}
          </DialogDescription>
        </DialogHeader>

        <DialogBody className="space-y-4">
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
            <p className="text-sm text-amber-700">
              Choose how you want to handle this model:
            </p>
          </div>

          <label className="flex items-start gap-3 cursor-pointer p-3 rounded-lg hover:bg-slate-50 transition-colors">
            <input
              type="radio"
              name="removeType"
              checked={removeFromStudio && !deleteCompletely}
              onChange={() => {
                setRemoveFromStudio(true);
                setDeleteCompletely(false);
              }}
              className="w-4 h-4 mt-1 text-brand-600"
            />
            <div>
              <span className="text-sm font-medium text-slate-900">
                Remove from team only
              </span>
              <p className="text-xs text-slate-500">
                Model profile and data will be preserved
              </p>
            </div>
          </label>

          <label className="flex items-start gap-3 cursor-pointer p-3 rounded-lg hover:bg-slate-50 transition-colors">
            <input
              type="radio"
              name="removeType"
              checked={deleteCompletely}
              onChange={() => {
                setRemoveFromStudio(false);
                setDeleteCompletely(true);
              }}
              className="w-4 h-4 mt-1 text-red-600"
            />
            <div>
              <span className="text-sm font-medium text-red-600">Delete completely</span>
              <p className="text-xs text-slate-500">
                All profile data will be permanently deleted
              </p>
            </div>
          </label>
        </DialogBody>

        <DialogFooter className="gap-3">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button
            onClick={handleRemove}
            disabled={isRemoving}
            className={`flex-1 ${
              deleteCompletely
                ? "bg-red-600 hover:bg-red-700"
                : "bg-amber-600 hover:bg-amber-700"
            }`}
          >
            {isRemoving ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : (
              <Trash2 className="w-4 h-4 mr-2" />
            )}
            {deleteCompletely ? "Delete" : "Remove"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ============================================
// MAIN PAGE
// ============================================

export default function ModelsPage() {
  const { user } = useDashboard();
  const [models, setModels] = useState<Creator[]>([]);
  const [dashboardUsers, setDashboardUsers] = useState<DashboardUser[]>([]);
  const [bioLinks, setBioLinks] = useState<BioLink[]>([]);
  const [invites, setInvites] = useState<StudioInvite[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterActive, setFilterActive] = useState<"all" | "active" | "inactive">("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [selectedModel, setSelectedModel] = useState<Creator | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [showBioLinkEditor, setShowBioLinkEditor] = useState(false);

  const isBusinessOrAdmin = user?.role === "business" || user?.role === "admin";
  const isAdmin = user?.role === "admin";
  const studioId = user?.studio_id;
  
  // For admin, get studio_id from selected model when editing
  const getEditStudioId = (model: Creator | null): string | null => {
    if (isAdmin && model?.studio_id) {
      return model.studio_id;
    }
    return studioId || null;
  };

  const fetchModels = async () => {
    if (!isStudioOrAdmin) return;

    setIsLoading(true);
    try {
      const supabase = getSupabaseBrowserClient();

      let query = supabase
        .from("creators")
        .select("*")
        .order("created_at", { ascending: false });

      if (user?.role === "business" && studioId) {
        query = query.eq("studio_id", studioId);
      }

      const { data: creatorsData, error } = await query;
      if (error) throw error;

      setModels(creatorsData || []);

      if (creatorsData && creatorsData.length > 0) {
        const creatorIds = creatorsData.map((c) => c.id);

        const { data: dashboardData } = await supabase
          .from("dashboard_users")
          .select("*")
          .in("creator_id", creatorIds);
        setDashboardUsers(dashboardData || []);

        const { data: bioLinksData } = await supabase
          .from("bio_links")
          .select("*")
          .in("creator_id", creatorIds);
        setBioLinks(bioLinksData || []);
      }

      // Fetch studio invites (for studios)
      if (user?.role === "business" && studioId) {
        try {
          const response = await fetch("/api/studio-invites");
          const { data: invitesData } = await response.json();
          setInvites(invitesData || []);
        } catch (e) {
          console.error("Error fetching invites:", e);
        }
      }
    } catch (err) {
      console.error("Error fetching models:", err);
      toast.error("Failed to load models");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelInvite = async (inviteId: string) => {
    try {
      const response = await fetch(`/api/studio-invites/${inviteId}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to cancel invite");
      }
      toast.success("Invite cancelled");
      fetchModels();
    } catch (err: unknown) {
      const error = err as Error;
      console.error("Error cancelling invite:", error);
      toast.error(error.message || "Failed to cancel invite");
    }
  };

  useEffect(() => {
    fetchModels();
  }, [user]);

  const handleToggleActive = async (creator: Creator) => {
    try {
      const supabase = getSupabaseBrowserClient();
      const newActive = !creator.active;

      const { error } = await supabase
        .from("creators")
        .update({ active: newActive })
        .eq("id", creator.id);

      if (error) throw error;

      setModels((prev) =>
        prev.map((m) => (m.id === creator.id ? { ...m, active: newActive } : m))
      );

      toast.success(`Model ${newActive ? "activated" : "deactivated"}`);
    } catch (err) {
      console.error("Error toggling active:", err);
      toast.error("Failed to update model status");
    }
  };

  const filteredModels = models.filter((m) => {
    const matchesSearch =
      !searchQuery ||
      m.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.display_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.email?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter =
      filterActive === "all" ||
      (filterActive === "active" && m.active && m.enabled) ||
      (filterActive === "inactive" && (!m.active || !m.enabled));

    return matchesSearch && matchesFilter;
  });

  const getDashboardUser = (creatorId: string) =>
    dashboardUsers.find((d) => d.creator_id === creatorId);

  const getBioLink = (creatorId: string) =>
    bioLinks.find((b) => b.creator_id === creatorId);

  if (!isStudioOrAdmin) {
    return (
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 flex items-center gap-3">
        <AlertCircle className="w-5 h-5 text-amber-500" />
        <p className="text-amber-700">Only businesses and administrators can manage creators.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Models</h1>
          <p className="text-slate-500">
            {user?.role === "admin"
              ? "Manage all models in the platform"
              : "Manage your team's creators"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {user?.role === "business" && (
            <Button
              variant="outline"
              onClick={() => setShowInviteModal(true)}
            >
              <Send className="w-4 h-4 mr-2" />
              Invite Model
            </Button>
          )}
          <Button
            onClick={() => setShowAddModal(true)}
            className="bg-brand-600 hover:bg-brand-700"
          >
            <UserPlus className="w-4 h-4 mr-2" />
            Add Model
          </Button>
        </div>
      </div>

      {/* Pending Invites */}
      {user?.role === "business" && (
        <PendingInvitesSection invites={invites} onCancelInvite={handleCancelInvite} />
      )}

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Search models..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilterActive("all")}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              filterActive === "all"
                ? "bg-brand-100 text-brand-700"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilterActive("active")}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              filterActive === "active"
                ? "bg-green-100 text-green-700"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            Active
          </button>
          <button
            onClick={() => setFilterActive("inactive")}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              filterActive === "inactive"
                ? "bg-slate-200 text-slate-700"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            Inactive
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <p className="text-2xl font-bold text-slate-900">{models.length}</p>
          <p className="text-sm text-slate-500">Total Models</p>
        </div>
        <div className="bg-green-50 rounded-xl border border-green-200 p-4">
          <p className="text-2xl font-bold text-green-700">
            {models.filter((m) => m.active && m.enabled).length}
          </p>
          <p className="text-sm text-green-600">Active</p>
        </div>
        <div className="bg-blue-50 rounded-xl border border-blue-200 p-4">
          <p className="text-2xl font-bold text-blue-700">{dashboardUsers.length}</p>
          <p className="text-sm text-blue-600">With Dashboard</p>
        </div>
        <div className="bg-purple-50 rounded-xl border border-purple-200 p-4">
          <p className="text-2xl font-bold text-purple-700">
            {bioLinks.filter((b) => b.is_published).length}
          </p>
          <p className="text-sm text-purple-600">Published Links</p>
        </div>
      </div>

      {/* Models Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-brand-600 animate-spin" />
        </div>
      ) : filteredModels.length === 0 ? (
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-12 text-center">
          <Users className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h3 className="font-semibold text-slate-700 mb-2">No models found</h3>
          <p className="text-slate-500 text-sm mb-4">
            {searchQuery || filterActive !== "all"
              ? "Try adjusting your search or filters"
              : "Add your first model to get started"}
          </p>
          <Button onClick={() => setShowAddModal(true)}>
            <UserPlus className="w-4 h-4 mr-2" />
            Add Model
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredModels.map((model) => (
            <ModelCard
              key={model.id}
              creator={model}
              dashboardUser={getDashboardUser(model.id)}
              bioLink={getBioLink(model.id)}
              onEdit={() => {
                setSelectedModel(model);
                setShowEditModal(true);
              }}
              onRemove={() => {
                setSelectedModel(model);
                setShowRemoveModal(true);
              }}
              onViewProfile={() => {
                const bio = getBioLink(model.id);
                window.open(`/${bio?.slug || model.username}`, "_blank");
              }}
              onToggleActive={() => handleToggleActive(model)}
              onEditBioLink={() => {
                setSelectedModel(model);
                setShowBioLinkEditor(true);
              }}
              onViewStats={() => {
                window.location.href = `/dashboard/statistics?creator=${model.id}`;
              }}
            />
          ))}
        </div>
      )}

      {/* Modals */}
      <AnimatePresence>
        {showAddModal && studioId && (
          <ModelModal
            mode="add"
            studioId={studioId}
            onClose={() => setShowAddModal(false)}
            onSaved={() => {
              setShowAddModal(false);
              fetchModels();
            }}
          />
        )}

        {showInviteModal && studioId && (
          <InviteModelModal
            studioId={studioId}
            onClose={() => setShowInviteModal(false)}
            onSent={() => {
              setShowInviteModal(false);
              fetchModels();
            }}
          />
        )}

        {showEditModal && selectedModel && (isAdmin || studioId) && (
          <ModelModal
            mode="edit"
            creator={selectedModel}
            studioId={getEditStudioId(selectedModel) || ""}
            onClose={() => {
              setShowEditModal(false);
              setSelectedModel(null);
            }}
            onSaved={() => {
              setShowEditModal(false);
              setSelectedModel(null);
              fetchModels();
            }}
          />
        )}

        {showRemoveModal && selectedModel && (
          <RemoveModal
            creator={selectedModel}
            onClose={() => {
              setShowRemoveModal(false);
              setSelectedModel(null);
            }}
            onRemoved={() => {
              setShowRemoveModal(false);
              setSelectedModel(null);
              fetchModels();
            }}
          />
        )}

        {showBioLinkEditor && selectedModel && (
          <BioLinkEditor
            creator={selectedModel}
            bioLink={getBioLink(selectedModel.id) || null}
            onClose={() => {
              setShowBioLinkEditor(false);
              setSelectedModel(null);
            }}
            onSaved={() => {
              setShowBioLinkEditor(false);
              setSelectedModel(null);
              fetchModels();
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
