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
  Building2,
  Search,
  Plus,
  Eye,
  Edit2,
  X,
  Loader2,
  AlertCircle,
  Users,
  RefreshCw,
  CheckCircle,
  XCircle,
  Mail,
  Phone,
  Globe,
  Calendar,
  Link2,
  ExternalLink,
  Copy,
  User,
  MessageCircle,
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

interface WhatsAppGroup {
  id: string;
  whatsapp_id: string;
  name: string | null;
  type: string;
  participant_count: number;
}

interface Studio {
  id: string;
  name: string;
  email?: string | null;
  phone?: string | null;
  country?: string | null;
  group_id: string | null;
  whatsapp_group_id: string | null;
  enabled: boolean;
  created_at: string;
  updated_at: string;
  _count?: {
    creators: number;
  };
  whatsapp_group?: WhatsAppGroup | null;
}

interface Creator {
  id: string;
  username: string;
  enabled: boolean;
}

// ============================================
// STUDIO CARD
// ============================================

function StudioCard({
  studio,
  creatorsCount,
  whatsappGroup,
  onView,
  onEdit,
  onToggle,
}: {
  studio: Studio;
  creatorsCount: number;
  whatsappGroup?: WhatsAppGroup;
  onView: () => void;
  onEdit: () => void;
  onToggle: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white rounded-xl border p-5 hover:shadow-md transition-all ${
        studio.enabled ? "border-slate-200" : "border-red-200 bg-red-50/30"
      }`}
    >
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
          studio.enabled 
            ? "bg-gradient-to-br from-blue-100 to-blue-200" 
            : "bg-red-100"
        }`}>
          <Building2 className={`w-6 h-6 ${
            studio.enabled ? "text-blue-600" : "text-red-600"
          }`} />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-slate-900">{studio.name}</h3>
            <span
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                studio.enabled
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {studio.enabled ? (
                <CheckCircle className="w-3 h-3" />
              ) : (
                <XCircle className="w-3 h-3" />
              )}
              {studio.enabled ? "Active" : "Disabled"}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
            {studio.email && (
              <span className="flex items-center gap-1">
                <Mail className="w-3.5 h-3.5" />
                {studio.email}
              </span>
            )}
            {studio.country && (
              <span className="flex items-center gap-1">
                <Globe className="w-3.5 h-3.5" />
                {studio.country}
              </span>
            )}
            <span className="flex items-center gap-1">
              <Users className="w-3.5 h-3.5" />
              {creatorsCount} {creatorsCount === 1 ? "model" : "models"}
            </span>
            {whatsappGroup && (
              <span className="flex items-center gap-1 text-green-600">
                <MessageCircle className="w-3.5 h-3.5" />
                <span className="truncate max-w-[120px]">{whatsappGroup.name || "WhatsApp"}</span>
              </span>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={onView}>
            <Eye className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={onEdit}>
            <Edit2 className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onToggle}
            className={studio.enabled ? "text-red-600 hover:bg-red-50" : "text-green-600 hover:bg-green-50"}
          >
            {studio.enabled ? <XCircle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
          </Button>
        </div>
      </div>
    </motion.div>
  );
}

// ============================================
// VIEW MODAL
// ============================================

function ViewStudioModal({
  studio,
  creators,
  whatsappGroup,
  onClose,
  onEdit,
}: {
  studio: Studio;
  creators: Creator[];
  whatsappGroup?: WhatsAppGroup;
  onClose: () => void;
  onEdit: () => void;
}) {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent size="lg">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
              studio.enabled 
                ? "bg-gradient-to-br from-blue-100 to-blue-200" 
                : "bg-red-100"
            }`}>
              <Building2 className={`w-6 h-6 ${
                studio.enabled ? "text-blue-600" : "text-red-600"
              }`} />
            </div>
            <div>
              <DialogTitle>{studio.name}</DialogTitle>
              <DialogDescription>
                Studio details and associated models
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <DialogBody>
          <div className="space-y-6">
            {/* Status Badge */}
            <div className="flex items-center gap-2">
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium ${
                  studio.enabled
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {studio.enabled ? (
                  <CheckCircle className="w-4 h-4" />
                ) : (
                  <XCircle className="w-4 h-4" />
                )}
                {studio.enabled ? "Active" : "Disabled"}
              </span>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-2 gap-4">
              {studio.email && (
                <div className="bg-slate-50 rounded-xl p-4">
                  <div className="flex items-center gap-2 text-slate-500 text-sm mb-1">
                    <Mail className="w-4 h-4" />
                    Email
                  </div>
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-slate-900">{studio.email}</p>
                    <button
                      onClick={() => copyToClipboard(studio.email!)}
                      className="p-1 hover:bg-slate-200 rounded"
                    >
                      <Copy className="w-3.5 h-3.5 text-slate-400" />
                    </button>
                  </div>
                </div>
              )}

              {studio.phone && (
                <div className="bg-slate-50 rounded-xl p-4">
                  <div className="flex items-center gap-2 text-slate-500 text-sm mb-1">
                    <Phone className="w-4 h-4" />
                    Phone
                  </div>
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-slate-900">{studio.phone}</p>
                    <button
                      onClick={() => copyToClipboard(studio.phone!)}
                      className="p-1 hover:bg-slate-200 rounded"
                    >
                      <Copy className="w-3.5 h-3.5 text-slate-400" />
                    </button>
                  </div>
                </div>
              )}

              {studio.country && (
                <div className="bg-slate-50 rounded-xl p-4">
                  <div className="flex items-center gap-2 text-slate-500 text-sm mb-1">
                    <Globe className="w-4 h-4" />
                    Country
                  </div>
                  <p className="font-medium text-slate-900">{studio.country}</p>
                </div>
              )}

              <div className="bg-slate-50 rounded-xl p-4">
                <div className="flex items-center gap-2 text-slate-500 text-sm mb-1">
                  <Calendar className="w-4 h-4" />
                  Created
                </div>
                <p className="font-medium text-slate-900">
                  {format(new Date(studio.created_at), "MMM d, yyyy")}
                </p>
              </div>

              {whatsappGroup && (
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 col-span-2 border border-green-200">
                  <div className="flex items-center gap-2 text-green-700 text-sm mb-2">
                    <MessageCircle className="w-4 h-4" />
                    WhatsApp Group
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-green-800">
                        {whatsappGroup.name || "Connected Group"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <code className="font-mono text-xs text-green-700 bg-green-100 px-2 py-1 rounded">
                        {whatsappGroup.whatsapp_id}
                      </code>
                      <button
                        onClick={() => copyToClipboard(whatsappGroup.whatsapp_id)}
                        className="p-1 hover:bg-green-200 rounded"
                      >
                        <Copy className="w-3.5 h-3.5 text-green-600" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
              {!whatsappGroup && (
                <div className="bg-amber-50 rounded-xl p-4 col-span-2 border border-amber-200">
                  <div className="flex items-center gap-2 text-amber-700 text-sm">
                    <MessageCircle className="w-4 h-4" />
                    No WhatsApp group linked
                  </div>
                  <p className="text-xs text-amber-600 mt-1">
                    Edit studio to link a WhatsApp group for notifications
                  </p>
                </div>
              )}
            </div>

            {/* Models */}
            <div>
              <h4 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                <Users className="w-4 h-4" />
                Associated Models ({creators.length})
              </h4>
              {creators.length === 0 ? (
                <div className="bg-slate-50 rounded-xl p-6 text-center">
                  <User className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                  <p className="text-slate-500 text-sm">No models assigned to this studio</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {creators.map((creator) => (
                    <div
                      key={creator.id}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
                        creator.enabled ? "bg-slate-50" : "bg-red-50"
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                        creator.enabled
                          ? "bg-gradient-to-br from-pink-400 to-violet-400 text-white"
                          : "bg-red-200 text-red-600"
                      }`}>
                        {creator.username.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-900 truncate">
                          @{creator.username}
                        </p>
                      </div>
                      {!creator.enabled && (
                        <XCircle className="w-3.5 h-3.5 text-red-400 shrink-0" />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Studio ID */}
            <div className="border-t border-slate-200 pt-4">
              <p className="text-xs text-slate-400 mb-1">Studio ID</p>
              <div className="flex items-center gap-2">
                <code className="font-mono text-xs text-slate-600 bg-slate-100 px-2 py-1 rounded">
                  {studio.id}
                </code>
                <button
                  onClick={() => copyToClipboard(studio.id)}
                  className="p-1 hover:bg-slate-100 rounded"
                >
                  <Copy className="w-3 h-3 text-slate-400" />
                </button>
              </div>
            </div>
          </div>
        </DialogBody>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button onClick={onEdit} className="bg-brand-600 hover:bg-brand-700">
            <Edit2 className="w-4 h-4 mr-2" />
            Edit Studio
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ============================================
// CREATE/EDIT MODAL
// ============================================

function StudioModal({
  studio,
  whatsappGroup,
  onClose,
  onSaved,
}: {
  studio: Studio | null;
  whatsappGroup?: WhatsAppGroup;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [formData, setFormData] = useState({
    name: studio?.name || "",
    email: studio?.email || "",
    phone: studio?.phone || "",
    country: studio?.country || "",
    whatsapp_id: whatsappGroup?.whatsapp_id || "",
    whatsapp_name: whatsappGroup?.name || "",
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!formData.name.trim()) {
      toast.error("Studio name is required");
      return;
    }

    setIsSaving(true);
    try {
      const supabase = getSupabaseBrowserClient();

      let whatsappGroupId = studio?.whatsapp_group_id || null;

      // Handle WhatsApp group
      if (formData.whatsapp_id.trim()) {
        if (whatsappGroup) {
          // Update existing WhatsApp group
          const { error: waError } = await supabase
            .from("whatsapp_groups")
            .update({
              whatsapp_id: formData.whatsapp_id.trim(),
              name: formData.whatsapp_name.trim() || null,
            })
            .eq("id", whatsappGroup.id);
          if (waError) throw waError;
          whatsappGroupId = whatsappGroup.id;
        } else {
          // Create new WhatsApp group
          const { data: newGroup, error: waError } = await supabase
            .from("whatsapp_groups")
            .insert({
              whatsapp_id: formData.whatsapp_id.trim(),
              name: formData.whatsapp_name.trim() || `${formData.name}'s Group`,
              type: "studio",
            })
            .select()
            .single();
          if (waError) throw waError;
          whatsappGroupId = newGroup.id;
        }
      } else if (whatsappGroup && !formData.whatsapp_id.trim()) {
        // Unlink WhatsApp group (clear the field)
        whatsappGroupId = null;
      }

      if (studio) {
        // Update
        const { error } = await supabase
          .from("studios")
          .update({
            name: formData.name,
            email: formData.email || null,
            phone: formData.phone || null,
            country: formData.country || null,
            whatsapp_group_id: whatsappGroupId,
            updated_at: new Date().toISOString(),
          })
          .eq("id", studio.id);

        if (error) throw error;
        toast.success("Studio updated successfully");
      } else {
        // Create
        const { error } = await supabase.from("studios").insert({
          name: formData.name,
          email: formData.email || null,
          phone: formData.phone || null,
          country: formData.country || null,
          whatsapp_group_id: whatsappGroupId,
          enabled: true,
        });

        if (error) throw error;
        toast.success("Studio created successfully");
      }

      onSaved();
    } catch (err: unknown) {
      const error = err as Error;
      console.error("Error saving studio:", error);
      toast.error("Failed to save studio");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent size="md">
        <DialogHeader>
          <DialogTitle>{studio ? "Edit Studio" : "Add Studio"}</DialogTitle>
          <DialogDescription>
            {studio ? "Update studio information" : "Create a new studio account"}
          </DialogDescription>
        </DialogHeader>

        <DialogBody>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Studio Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Studio Name"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="contact@studio.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+1234567890"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Input
                id="country"
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                placeholder="e.g. Romania"
              />
            </div>

            <div className="space-y-4 border-t border-slate-200 pt-4">
              <div className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-green-600" />
                <Label className="text-green-700 font-medium">WhatsApp Group (optional)</Label>
              </div>
              <div className="space-y-2">
                <Label htmlFor="whatsapp_id" className="text-sm">Group ID</Label>
                <Input
                  id="whatsapp_id"
                  value={formData.whatsapp_id}
                  onChange={(e) => setFormData({ ...formData, whatsapp_id: e.target.value })}
                  placeholder="123456789@g.us"
                  className="font-mono"
                />
                <p className="text-xs text-slate-500">The WhatsApp group JID for notifications</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="whatsapp_name" className="text-sm">Group Name</Label>
                <Input
                  id="whatsapp_name"
                  value={formData.whatsapp_name}
                  onChange={(e) => setFormData({ ...formData, whatsapp_name: e.target.value })}
                  placeholder="Studio notifications group"
                />
              </div>
            </div>

            {studio && (
              <div className="bg-slate-50 rounded-lg p-4">
                <p className="text-xs text-slate-500 mb-1">Studio ID</p>
                <code className="text-sm font-mono text-slate-700">
                  {studio.id}
                </code>
              </div>
            )}
          </div>
        </DialogBody>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="bg-brand-600 hover:bg-brand-700"
          >
            {isSaving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {studio ? "Save Changes" : "Create Studio"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ============================================
// MAIN PAGE
// ============================================

export default function StudiosPage() {
  const { user } = useDashboard();
  const [studios, setStudios] = useState<Studio[]>([]);
  const [studioCreators, setStudioCreators] = useState<Record<string, Creator[]>>({});
  const [whatsappGroups, setWhatsappGroups] = useState<WhatsAppGroup[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedStudio, setSelectedStudio] = useState<Studio | null>(null);

  const fetchStudios = async () => {
    setIsLoading(true);
    try {
      const supabase = getSupabaseBrowserClient();
      
      // Fetch studios
      const { data: studiosData, error: studiosError } = await supabase
        .from("studios")
        .select("*")
        .order("name");

      if (studiosError) throw studiosError;
      setStudios((studiosData as Studio[]) || []);

      // Fetch creators for each studio
      const { data: creatorsData, error: creatorsError } = await supabase
        .from("creators")
        .select("id, username, enabled, studio_id")
        .order("username");

      if (creatorsError) throw creatorsError;

      // Group creators by studio_id
      const creatorsByStudio: Record<string, Creator[]> = {};
      (creatorsData || []).forEach((creator: any) => {
        if (creator.studio_id) {
          if (!creatorsByStudio[creator.studio_id]) {
            creatorsByStudio[creator.studio_id] = [];
          }
          creatorsByStudio[creator.studio_id].push(creator);
        }
      });
      setStudioCreators(creatorsByStudio);

      // Fetch WhatsApp groups for studios
      const whatsappGroupIds = (studiosData || [])
        .map((s: Studio) => s.whatsapp_group_id)
        .filter((id): id is string => id !== null);

      if (whatsappGroupIds.length > 0) {
        const { data: waGroupsData } = await supabase
          .from("whatsapp_groups")
          .select("*")
          .in("id", whatsappGroupIds);
        setWhatsappGroups(waGroupsData || []);
      } else {
        setWhatsappGroups([]);
      }

    } catch (err) {
      console.error("Error fetching studios:", err);
      toast.error("Failed to load studios");
    } finally {
      setIsLoading(false);
    }
  };

  const getWhatsAppGroup = (studio: Studio) =>
    whatsappGroups.find((w) => w.id === studio.whatsapp_group_id);

  useEffect(() => {
    if (user?.role === "admin") {
      fetchStudios();
    }
  }, [user]);

  const handleToggle = async (studio: Studio) => {
    try {
      const supabase = getSupabaseBrowserClient();
      const { error } = await supabase
        .from("studios")
        .update({ enabled: !studio.enabled })
        .eq("id", studio.id);

      if (error) throw error;
      toast.success(studio.enabled ? "Studio disabled" : "Studio enabled");
      fetchStudios();
    } catch (err) {
      console.error("Error toggling studio:", err);
      toast.error("Failed to update studio");
    }
  };

  const filteredStudios = studios.filter((s) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      s.name.toLowerCase().includes(query) ||
      s.email?.toLowerCase().includes(query) ||
      s.country?.toLowerCase().includes(query)
    );
  });

  // Stats
  const stats = {
    total: studios.length,
    active: studios.filter((s) => s.enabled).length,
    disabled: studios.filter((s) => !s.enabled).length,
    totalModels: Object.values(studioCreators).reduce((acc, arr) => acc + arr.length, 0),
  };

  if (user?.role !== "admin") {
    return (
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 flex items-center gap-3">
        <AlertCircle className="w-5 h-5 text-amber-500" />
        <p className="text-amber-700">
          Only administrators can access this page.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Studios</h1>
          <p className="text-slate-500">Manage studios and their models</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchStudios}
            disabled={isLoading}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Button
            onClick={() => {
              setSelectedStudio(null);
              setShowEditModal(true);
            }}
            className="bg-brand-600 hover:bg-brand-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Studio
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <p className="text-2xl font-bold text-slate-900">{stats.total}</p>
          <p className="text-sm text-slate-500">Total Studios</p>
        </div>
        <div className="bg-green-50 rounded-xl border border-green-200 p-4">
          <p className="text-2xl font-bold text-green-700">{stats.active}</p>
          <p className="text-sm text-green-600">Active</p>
        </div>
        <div className="bg-red-50 rounded-xl border border-red-200 p-4">
          <p className="text-2xl font-bold text-red-700">{stats.disabled}</p>
          <p className="text-sm text-red-600">Disabled</p>
        </div>
        <div className="bg-violet-50 rounded-xl border border-violet-200 p-4">
          <p className="text-2xl font-bold text-violet-700">{stats.totalModels}</p>
          <p className="text-sm text-violet-600">Total Models</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <Input
          placeholder="Search studios by name, email, or country..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-brand-600 animate-spin" />
        </div>
      ) : filteredStudios.length === 0 ? (
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-12 text-center">
          <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h3 className="font-semibold text-slate-700 mb-2">No studios found</h3>
          <p className="text-slate-500 text-sm mb-4">
            {searchQuery
              ? "Try adjusting your search"
              : "Create your first studio to get started"}
          </p>
          <Button
            onClick={() => {
              setSelectedStudio(null);
              setShowEditModal(true);
            }}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Studio
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredStudios.map((studio) => (
            <StudioCard
              key={studio.id}
              studio={studio}
              creatorsCount={studioCreators[studio.id]?.length || 0}
              whatsappGroup={getWhatsAppGroup(studio)}
              onView={() => {
                setSelectedStudio(studio);
                setShowViewModal(true);
              }}
              onEdit={() => {
                setSelectedStudio(studio);
                setShowEditModal(true);
              }}
              onToggle={() => handleToggle(studio)}
            />
          ))}
        </div>
      )}

      {/* View Modal */}
      {showViewModal && selectedStudio && (
        <ViewStudioModal
          studio={selectedStudio}
          creators={studioCreators[selectedStudio.id] || []}
          whatsappGroup={getWhatsAppGroup(selectedStudio)}
          onClose={() => {
            setShowViewModal(false);
            setSelectedStudio(null);
          }}
          onEdit={() => {
            setShowViewModal(false);
            setShowEditModal(true);
          }}
        />
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <StudioModal
          studio={selectedStudio}
          whatsappGroup={selectedStudio ? getWhatsAppGroup(selectedStudio) : undefined}
          onClose={() => {
            setShowEditModal(false);
            setSelectedStudio(null);
          }}
          onSaved={() => {
            setShowEditModal(false);
            setSelectedStudio(null);
            fetchStudios();
          }}
        />
      )}
    </div>
  );
}
