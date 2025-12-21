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
} from "lucide-react";

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

// ============================================
// MODEL CARD
// ============================================

function ModelCard({
  creator,
  dashboardUser,
  onEdit,
  onRemove,
  onViewProfile,
}: {
  creator: Creator;
  dashboardUser?: DashboardUser;
  onEdit: () => void;
  onRemove: () => void;
  onViewProfile: () => void;
}) {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-lg transition-all group"
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
          <span
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
              creator.active && creator.enabled
                ? "bg-green-100 text-green-700"
                : "bg-slate-100 text-slate-600"
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                creator.active && creator.enabled ? "bg-green-500" : "bg-slate-400"
              }`}
            />
            {creator.active && creator.enabled ? "Active" : "Inactive"}
          </span>
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
                <div className="absolute top-full left-0 mt-1 bg-white rounded-lg shadow-lg border border-slate-200 py-1 z-20 min-w-[140px]">
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
                    Edit
                  </button>
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
        <h3 className="font-semibold text-slate-900 truncate">
          {creator.display_name || creator.username}
        </h3>
        <p className="text-sm text-slate-500 truncate">@{creator.username}</p>

        {/* Stats row */}
        <div className="flex items-center gap-3 mt-3 pt-3 border-t border-slate-100">
          {creator.email && (
            <span className="text-xs text-slate-500 flex items-center gap-1">
              <Mail className="w-3 h-3" />
              {creator.email}
            </span>
          )}
        </div>

        {/* Dashboard access indicator */}
        {dashboardUser && (
          <div className="mt-2 flex items-center gap-1 text-xs text-green-600">
            <CheckCircle className="w-3 h-3" />
            Has dashboard access
          </div>
        )}

        {/* Quick actions */}
        <div className="flex gap-2 mt-4">
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={onViewProfile}
          >
            <LinkIcon className="w-3 h-3 mr-1" />
            Bio Link
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={onEdit}
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
    // Generate temp password for new models
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
        // Create new model
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

        // Create dashboard access if requested
        if (createDashboardAccess && formData.email) {
          // Create auth user
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

          // Create dashboard user
          await supabase.from("dashboard_users").insert({
            auth_user_id: authData?.user?.id || null,
            email: formData.email,
            role: "model",
            display_name: formData.displayName || formData.username,
            creator_id: newCreator.id,
            studio_id: studioId,
            enabled: true,
          });

          // Create bio link
          await supabase.from("bio_links").insert({
            creator_id: newCreator.id,
            slug: formData.username.toLowerCase().replace(/\s+/g, ""),
            name: formData.displayName || formData.username,
            tagline: "Content Creator",
            is_published: false,
          });

          toast.success(
            `Model added! Password: ${tempPassword}`,
            { duration: 10000 }
          );
        } else {
          toast.success("Model added successfully!");
        }
      } else if (mode === "edit" && creator) {
        // Update existing model
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
        className="fixed inset-4 sm:inset-auto sm:left-1/2 sm:top-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:max-w-lg sm:w-full sm:max-h-[90vh] bg-white rounded-2xl shadow-xl z-50 overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-200 flex items-center justify-between shrink-0">
          <h3 className="text-lg font-semibold text-slate-900">
            {mode === "add" ? "Add New Model" : "Edit Model"}
          </h3>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
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
                onChange={(e) =>
                  setFormData({ ...formData, displayName: e.target.value })
                }
                placeholder="Display Name"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Email {mode === "add" && "*"}</Label>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              placeholder="model@example.com"
            />
          </div>

          <div className="space-y-2">
            <Label>Phone</Label>
            <Input
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              placeholder="+1234567890"
            />
          </div>

          <div className="space-y-2">
            <Label>Bio</Label>
            <textarea
              value={formData.bio}
              onChange={(e) =>
                setFormData({ ...formData, bio: e.target.value })
              }
              placeholder="Short bio..."
              rows={3}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.active}
              onChange={(e) =>
                setFormData({ ...formData, active: e.target.checked })
              }
              className="w-4 h-4 rounded border-slate-300 text-brand-600"
            />
            <span className="text-sm text-slate-700">Active (can receive work)</span>
          </label>

          {mode === "add" && (
            <>
              <div className="border-t border-slate-200 pt-4">
                <label className="flex items-start gap-3 cursor-pointer">
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
                  <p className="text-sm text-slate-600">
                    A temporary password will be generated:
                  </p>
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
                    ⚠️ Save this password - you won't be able to see it again!
                  </p>
                </div>
              )}
            </>
          )}
        </div>

        {/* Actions */}
        <div className="p-6 border-t border-slate-200 flex gap-3 shrink-0">
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
        </div>
      </motion.div>
    </>
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
        // Delete dashboard user first
        await supabase.from("dashboard_users").delete().eq("creator_id", creator.id);

        // Delete bio link
        await supabase.from("bio_links").delete().eq("creator_id", creator.id);

        // Delete creator
        await supabase.from("creators").delete().eq("id", creator.id);

        toast.success("Model deleted completely");
      } else if (removeFromStudio) {
        // Just remove from studio
        await supabase
          .from("creators")
          .update({ studio_id: null })
          .eq("id", creator.id);

        toast.success("Model removed from studio");
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
        className="fixed inset-4 sm:inset-auto sm:left-1/2 sm:top-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:max-w-md sm:w-full bg-white rounded-2xl shadow-xl z-50 overflow-hidden"
      >
        <div className="p-6 border-b border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900">Remove Model</h3>
          <p className="text-sm text-slate-500 mt-1">
            {creator.display_name || creator.username}
          </p>
        </div>

        <div className="p-6 space-y-4">
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
                Remove from studio only
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
              <span className="text-sm font-medium text-red-600">
                Delete completely
              </span>
              <p className="text-xs text-slate-500">
                All profile data will be permanently deleted
              </p>
            </div>
          </label>

          <div className="flex gap-3 pt-4">
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
          </div>
        </div>
      </motion.div>
    </>
  );
}

// ============================================
// MAIN PAGE
// ============================================

export default function ModelsPage() {
  const { user } = useDashboard();
  const [models, setModels] = useState<Creator[]>([]);
  const [dashboardUsers, setDashboardUsers] = useState<DashboardUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedModel, setSelectedModel] = useState<Creator | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showRemoveModal, setShowRemoveModal] = useState(false);

  const isStudioOrAdmin = user?.role === "studio" || user?.role === "admin";
  const studioId = user?.studio_id;

  const fetchModels = async () => {
    if (!isStudioOrAdmin) return;

    setIsLoading(true);
    try {
      const supabase = getSupabaseBrowserClient();

      let query = supabase
        .from("creators")
        .select("*")
        .order("created_at", { ascending: false });

      // Studio users only see their models
      if (user?.role === "studio" && studioId) {
        query = query.eq("studio_id", studioId);
      }

      const { data: creatorsData, error } = await query;
      if (error) throw error;

      setModels(creatorsData || []);

      // Fetch dashboard users for these creators
      if (creatorsData && creatorsData.length > 0) {
        const creatorIds = creatorsData.map((c) => c.id);
        const { data: dashboardData } = await supabase
          .from("dashboard_users")
          .select("*")
          .in("creator_id", creatorIds);

        setDashboardUsers(dashboardData || []);
      }
    } catch (err) {
      console.error("Error fetching models:", err);
      toast.error("Failed to load models");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchModels();
  }, [user]);

  const filteredModels = models.filter((m) => {
    const matchesSearch =
      !searchQuery ||
      m.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.display_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.email?.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesSearch;
  });

  const getDashboardUser = (creatorId: string) =>
    dashboardUsers.find((d) => d.creator_id === creatorId);

  if (!isStudioOrAdmin) {
    return (
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 flex items-center gap-3">
        <AlertCircle className="w-5 h-5 text-amber-500" />
        <p className="text-amber-700">
          Only studios and administrators can manage models.
        </p>
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
              : "Manage your studio's models"}
          </p>
        </div>
        <Button
          onClick={() => setShowAddModal(true)}
          className="bg-brand-600 hover:bg-brand-700"
        >
          <UserPlus className="w-4 h-4 mr-2" />
          Add Model
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <Input
          placeholder="Search models..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
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
          <p className="text-2xl font-bold text-blue-700">
            {dashboardUsers.length}
          </p>
          <p className="text-sm text-blue-600">With Dashboard</p>
        </div>
        <div className="bg-slate-50 rounded-xl border border-slate-200 p-4">
          <p className="text-2xl font-bold text-slate-700">
            {models.filter((m) => !m.active || !m.enabled).length}
          </p>
          <p className="text-sm text-slate-500">Inactive</p>
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
            {searchQuery
              ? "Try adjusting your search"
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
              onEdit={() => {
                setSelectedModel(model);
                setShowEditModal(true);
              }}
              onRemove={() => {
                setSelectedModel(model);
                setShowRemoveModal(true);
              }}
              onViewProfile={() => {
                window.open(`/${model.username}`, "_blank");
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

        {showEditModal && selectedModel && studioId && (
          <ModelModal
            mode="edit"
            creator={selectedModel}
            studioId={studioId}
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
      </AnimatePresence>
    </div>
  );
}
