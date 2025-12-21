"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogBody,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog-centered";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  Tag,
  Plus,
  Check,
  X,
  Loader2,
  Sparkles,
  Activity,
  Footprints,
  Smile,
  Heart,
  Droplet,
  Coffee,
  Briefcase,
  Sun,
  Home,
  Camera,
  Dumbbell,
  Wand2,
  Star,
  Search,
  Palette,
} from "lucide-react";

// ============================================
// TYPES
// ============================================

export interface Label {
  id: string;
  name: string;
  color: string;
  icon: string;
  usage_count: number;
}

interface LabelManagerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mediaId: string;
  currentLabels: string[];
  storageUrl?: string;
  pineconeId?: string;
  onLabelsChange: (labels: string[]) => void;
}

// ============================================
// ICON MAPPING
// ============================================

const ICON_MAP: Record<string, typeof Tag> = {
  tag: Tag,
  activity: Activity,
  footprints: Footprints,
  smile: Smile,
  heart: Heart,
  sparkles: Sparkles,
  droplet: Droplet,
  coffee: Coffee,
  briefcase: Briefcase,
  sun: Sun,
  home: Home,
  camera: Camera,
  dumbbell: Dumbbell,
  wand: Wand2,
  star: Star,
};

const COLOR_OPTIONS = [
  "#8b5cf6", // Purple
  "#ec4899", // Pink
  "#f59e0b", // Amber
  "#10b981", // Emerald
  "#ef4444", // Red
  "#06b6d4", // Cyan
  "#84cc16", // Lime
  "#6366f1", // Indigo
  "#22c55e", // Green
  "#a855f7", // Violet
  "#f97316", // Orange
  "#14b8a6", // Teal
  "#e11d48", // Rose
  "#facc15", // Yellow
];

// ============================================
// LABEL MANAGER DIALOG
// ============================================

export function LabelManager({
  open,
  onOpenChange,
  mediaId,
  currentLabels,
  storageUrl,
  pineconeId,
  onLabelsChange,
}: LabelManagerProps) {
  const [availableLabels, setAvailableLabels] = useState<Label[]>([]);
  const [selectedLabels, setSelectedLabels] = useState<Set<string>>(new Set(currentLabels));
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showCreateNew, setShowCreateNew] = useState(false);
  const [newLabelName, setNewLabelName] = useState("");
  const [newLabelColor, setNewLabelColor] = useState("#6366f1");
  const [isCreatingLabel, setIsCreatingLabel] = useState(false);

  // Fetch available labels
  useEffect(() => {
    if (open) {
      fetchLabels();
      setSelectedLabels(new Set(currentLabels));
    }
  }, [open, currentLabels]);

  const fetchLabels = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/media/labels");
      const result = await response.json();
      if (result.success) {
        setAvailableLabels(result.data || []);
      }
    } catch (err) {
      console.error("Error fetching labels:", err);
      toast.error("Failed to load labels");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleLabel = (labelName: string) => {
    setSelectedLabels((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(labelName)) {
        newSet.delete(labelName);
      } else {
        newSet.add(labelName);
      }
      return newSet;
    });
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const labels = Array.from(selectedLabels);
      
      const response = await fetch("/api/media/labels", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mediaId,
          labels,
          storageUrl,
          pineconeId,
        }),
      });

      const result = await response.json();
      if (result.success) {
        onLabelsChange(labels);
        toast.success("Labels updated successfully");
        onOpenChange(false);
      } else {
        throw new Error(result.error);
      }
    } catch (err: any) {
      console.error("Error saving labels:", err);
      toast.error(err.message || "Failed to save labels");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCreateLabel = async () => {
    if (!newLabelName.trim()) {
      toast.error("Please enter a label name");
      return;
    }

    setIsCreatingLabel(true);
    try {
      const response = await fetch("/api/media/labels", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newLabelName.trim(),
          color: newLabelColor,
          icon: "tag",
        }),
      });

      const result = await response.json();
      if (result.success) {
        setAvailableLabels((prev) => [...prev, result.data]);
        setSelectedLabels((prev) => new Set([...prev, result.data.name]));
        setNewLabelName("");
        setShowCreateNew(false);
        toast.success("Label created!");
      } else {
        throw new Error(result.error);
      }
    } catch (err: any) {
      console.error("Error creating label:", err);
      toast.error(err.message || "Failed to create label");
    } finally {
      setIsCreatingLabel(false);
    }
  };

  // Filter labels by search
  const filteredLabels = availableLabels.filter((label) =>
    label.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const hasChanges = 
    currentLabels.length !== selectedLabels.size ||
    currentLabels.some((l) => !selectedLabels.has(l));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent size="md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Tag className="w-5 h-5 text-brand-600" />
            Manage Labels
          </DialogTitle>
          <DialogDescription>
            Select labels for this media. Labels sync to Supabase and Pinecone.
          </DialogDescription>
        </DialogHeader>

        <DialogBody className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search labels..."
              className="pl-9"
            />
          </div>

          {/* Selected Labels Preview */}
          {selectedLabels.size > 0 && (
            <div className="bg-brand-50 rounded-lg p-3">
              <p className="text-xs font-medium text-brand-700 mb-2">
                Selected ({selectedLabels.size})
              </p>
              <div className="flex flex-wrap gap-2">
                {Array.from(selectedLabels).map((labelName) => {
                  const labelData = availableLabels.find((l) => l.name === labelName);
                  return (
                    <span
                      key={labelName}
                      className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-white border border-brand-200 text-brand-700"
                      style={{ borderColor: labelData?.color || "#6366f1" }}
                    >
                      {labelName}
                      <button
                        onClick={() => toggleLabel(labelName)}
                        className="ml-0.5 hover:text-red-500"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  );
                })}
              </div>
            </div>
          )}

          {/* Labels Grid */}
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-6 h-6 animate-spin text-brand-600" />
            </div>
          ) : (
            <div className="max-h-[300px] overflow-y-auto">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {filteredLabels.map((label) => {
                  const isSelected = selectedLabels.has(label.name);
                  const IconComponent = ICON_MAP[label.icon] || Tag;
                  
                  return (
                    <motion.button
                      key={label.id}
                      onClick={() => toggleLabel(label.name)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`flex items-center gap-2 p-3 rounded-xl border-2 transition-all text-left ${
                        isSelected
                          ? "border-brand-500 bg-brand-50"
                          : "border-slate-200 hover:border-slate-300 bg-white"
                      }`}
                    >
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: `${label.color}20` }}
                      >
                        <IconComponent
                          className="w-4 h-4"
                          style={{ color: label.color }}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-900 truncate">
                          {label.name}
                        </p>
                        <p className="text-xs text-slate-500">
                          {label.usage_count} uses
                        </p>
                      </div>
                      {isSelected && (
                        <Check className="w-4 h-4 text-brand-600 shrink-0" />
                      )}
                    </motion.button>
                  );
                })}
              </div>

              {filteredLabels.length === 0 && !showCreateNew && (
                <div className="text-center py-8">
                  <Tag className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                  <p className="text-slate-500 text-sm">
                    {searchQuery ? "No labels match your search" : "No labels available"}
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-3"
                    onClick={() => {
                      setNewLabelName(searchQuery);
                      setShowCreateNew(true);
                    }}
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Create "{searchQuery || "new label"}"
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* Create New Label */}
          <AnimatePresence>
            {showCreateNew ? (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="border border-slate-200 rounded-xl p-4 bg-slate-50"
              >
                <div className="flex items-center gap-2 mb-3">
                  <Plus className="w-4 h-4 text-slate-600" />
                  <span className="text-sm font-medium text-slate-700">Create New Label</span>
                </div>
                <div className="space-y-3">
                  <Input
                    value={newLabelName}
                    onChange={(e) => setNewLabelName(e.target.value)}
                    placeholder="Label name"
                    autoFocus
                  />
                  <div>
                    <p className="text-xs font-medium text-slate-600 mb-2 flex items-center gap-1">
                      <Palette className="w-3 h-3" />
                      Color
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {COLOR_OPTIONS.map((color) => (
                        <button
                          key={color}
                          onClick={() => setNewLabelColor(color)}
                          className={`w-6 h-6 rounded-full border-2 transition-all ${
                            newLabelColor === color
                              ? "border-slate-900 scale-110"
                              : "border-transparent hover:scale-110"
                          }`}
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowCreateNew(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      size="sm"
                      onClick={handleCreateLabel}
                      disabled={isCreatingLabel || !newLabelName.trim()}
                      className="bg-brand-600 hover:bg-brand-700"
                    >
                      {isCreatingLabel ? (
                        <Loader2 className="w-4 h-4 animate-spin mr-1" />
                      ) : (
                        <Plus className="w-4 h-4 mr-1" />
                      )}
                      Create
                    </Button>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onClick={() => setShowCreateNew(true)}
                className="w-full flex items-center justify-center gap-2 p-3 border-2 border-dashed border-slate-300 rounded-xl text-slate-500 hover:border-brand-400 hover:text-brand-600 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span className="text-sm font-medium">Create New Label</span>
              </motion.button>
            )}
          </AnimatePresence>
        </DialogBody>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={isSaving || !hasChanges}
            className="bg-brand-600 hover:bg-brand-700"
          >
            {isSaving ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : (
              <Check className="w-4 h-4 mr-2" />
            )}
            Save Labels
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ============================================
// LABEL BADGE COMPONENT (for displaying)
// ============================================

export function LabelBadge({
  label,
  onClick,
  removable = false,
  onRemove,
  size = "sm",
}: {
  label: string;
  onClick?: () => void;
  removable?: boolean;
  onRemove?: () => void;
  size?: "xs" | "sm" | "md";
}) {
  const sizeClasses = {
    xs: "px-1.5 py-0.5 text-[10px]",
    sm: "px-2 py-1 text-xs",
    md: "px-3 py-1.5 text-sm",
  };

  return (
    <span
      onClick={onClick}
      className={`inline-flex items-center gap-1 rounded-lg font-medium bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors ${
        onClick ? "cursor-pointer" : ""
      } ${sizeClasses[size]}`}
    >
      <Tag className="w-3 h-3" />
      {label}
      {removable && onRemove && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="ml-0.5 hover:text-red-500"
        >
          <X className="w-3 h-3" />
        </button>
      )}
    </span>
  );
}


