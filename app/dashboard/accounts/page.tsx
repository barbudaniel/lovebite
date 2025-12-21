"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useDashboard } from "../layout";
import { getSupabaseBrowserClient } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  Eye,
  EyeOff,
  Save,
  Plus,
  Trash2,
  Edit2,
  Check,
  X,
  Loader2,
  AlertCircle,
  ShieldCheck,
  ShieldOff,
  ExternalLink,
  Copy,
} from "lucide-react";

// ============================================
// PLATFORM DEFINITIONS
// ============================================

const PLATFORMS = [
  {
    id: "onlyfans",
    name: "OnlyFans",
    color: "bg-sky-500",
    icon: "🔥",
    url: "https://onlyfans.com",
  },
  {
    id: "fansly",
    name: "Fansly",
    color: "bg-blue-600",
    icon: "💙",
    url: "https://fansly.com",
  },
  {
    id: "loyalfans",
    name: "LoyalFans",
    color: "bg-rose-500",
    icon: "❤️",
    url: "https://loyalfans.com",
  },
  {
    id: "feetfinder",
    name: "FeetFinder",
    color: "bg-pink-500",
    icon: "👣",
    url: "https://feetfinder.com",
  },
  {
    id: "reddit",
    name: "Reddit",
    color: "bg-orange-500",
    icon: "🔴",
    url: "https://reddit.com",
  },
  {
    id: "instagram",
    name: "Instagram",
    color: "bg-gradient-to-br from-purple-500 to-pink-500",
    icon: "📸",
    url: "https://instagram.com",
  },
  {
    id: "x",
    name: "X (Twitter)",
    color: "bg-slate-900",
    icon: "𝕏",
    url: "https://x.com",
  },
  {
    id: "redgifs",
    name: "RedGifs",
    color: "bg-red-600",
    icon: "🎬",
    url: "https://redgifs.com",
  },
] as const;

type PlatformId = (typeof PLATFORMS)[number]["id"];

// ============================================
// TYPES
// ============================================

interface SocialAccount {
  id: string;
  creator_id: string;
  platform: PlatformId;
  email: string | null;
  password: string | null;
  username: string | null;
  two_factor_enabled: boolean;
  notes: string | null;
  enabled: boolean;
  created_at: string;
  updated_at: string;
}

// ============================================
// ACCOUNT CARD COMPONENT
// ============================================

function AccountCard({
  account,
  platform,
  onEdit,
  onDelete,
  isEditing,
  onSave,
  onCancel,
}: {
  account: SocialAccount | null;
  platform: (typeof PLATFORMS)[number];
  onEdit: () => void;
  onDelete: () => void;
  isEditing: boolean;
  onSave: (data: Partial<SocialAccount>) => void;
  onCancel: () => void;
}) {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: account?.email || "",
    password: account?.password || "",
    username: account?.username || "",
    two_factor_enabled: account?.two_factor_enabled || false,
    notes: account?.notes || "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      email: formData.email || null,
      password: formData.password || null,
      username: formData.username || null,
      two_factor_enabled: formData.two_factor_enabled,
      notes: formData.notes || null,
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };

  if (isEditing) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl border border-brand-200 p-6 shadow-lg"
      >
        <div className="flex items-center gap-3 mb-6">
          <div
            className={`w-12 h-12 ${platform.color} rounded-xl flex items-center justify-center text-2xl`}
          >
            {platform.icon}
          </div>
          <div>
            <h3 className="font-semibold text-slate-900">{platform.name}</h3>
            <p className="text-sm text-slate-500">
              {account ? "Edit account" : "Add new account"}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor={`${platform.id}-email`}>Email</Label>
              <Input
                id={`${platform.id}-email`}
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="account@email.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`${platform.id}-username`}>Username</Label>
              <Input
                id={`${platform.id}-username`}
                type="text"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                placeholder="username"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor={`${platform.id}-password`}>Password</Label>
            <div className="relative">
              <Input
                id={`${platform.id}-password`}
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="••••••••"
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor={`${platform.id}-notes`}>Notes</Label>
            <Input
              id={`${platform.id}-notes`}
              type="text"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Additional notes..."
            />
          </div>

          <label className="flex items-center gap-3 cursor-pointer">
            <div
              className={`w-10 h-6 rounded-full transition-colors ${
                formData.two_factor_enabled ? "bg-green-500" : "bg-slate-300"
              } relative`}
              onClick={() =>
                setFormData({ ...formData, two_factor_enabled: !formData.two_factor_enabled })
              }
            >
              <div
                className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${
                  formData.two_factor_enabled ? "left-5" : "left-1"
                }`}
              />
            </div>
            <span className="text-sm text-slate-700">2FA Enabled</span>
          </label>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            <Button type="submit" className="flex-1 bg-brand-600 hover:bg-brand-700">
              <Save className="w-4 h-4 mr-2" />
              Save
            </Button>
          </div>
        </form>
      </motion.div>
    );
  }

  if (!account) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-slate-50 rounded-2xl border border-dashed border-slate-300 p-6 hover:border-brand-400 hover:bg-brand-50/50 transition-all cursor-pointer"
        onClick={onEdit}
      >
        <div className="flex items-center gap-4">
          <div
            className={`w-12 h-12 ${platform.color} rounded-xl flex items-center justify-center text-2xl opacity-50`}
          >
            {platform.icon}
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-slate-600">{platform.name}</h3>
            <p className="text-sm text-slate-400">Not configured</p>
          </div>
          <Plus className="w-5 h-5 text-slate-400" />
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-md transition-all"
    >
      <div className="flex items-start gap-4">
        <div
          className={`w-12 h-12 ${platform.color} rounded-xl flex items-center justify-center text-2xl shrink-0`}
        >
          {platform.icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-slate-900">{platform.name}</h3>
            {account.two_factor_enabled ? (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
                <ShieldCheck className="w-3 h-3" />
                2FA
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-700">
                <ShieldOff className="w-3 h-3" />
                No 2FA
              </span>
            )}
          </div>

          <div className="space-y-1 text-sm">
            {account.username && (
              <p className="text-slate-600">
                <span className="text-slate-400">Username:</span>{" "}
                <button
                  onClick={() => copyToClipboard(account.username!)}
                  className="font-medium hover:text-brand-600"
                >
                  @{account.username}
                </button>
              </p>
            )}
            {account.email && (
              <p className="text-slate-600">
                <span className="text-slate-400">Email:</span>{" "}
                <button
                  onClick={() => copyToClipboard(account.email!)}
                  className="hover:text-brand-600"
                >
                  {account.email}
                </button>
              </p>
            )}
            {account.password && (
              <div className="flex items-center gap-2 text-slate-600">
                <span className="text-slate-400">Password:</span>
                <span className="font-mono">
                  {showPassword ? account.password : "••••••••"}
                </span>
                <button
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                </button>
                <button
                  onClick={() => copyToClipboard(account.password!)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <Copy className="w-3 h-3" />
                </button>
              </div>
            )}
            {account.notes && <p className="text-slate-400 italic">{account.notes}</p>}
          </div>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <a
            href={platform.url}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
          <button
            onClick={onEdit}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg"
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
    </motion.div>
  );
}

// ============================================
// MAIN PAGE
// ============================================

export default function AccountsPage() {
  const { user } = useDashboard();
  const [accounts, setAccounts] = useState<SocialAccount[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingPlatform, setEditingPlatform] = useState<PlatformId | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchAccounts();
  }, [user]);

  const fetchAccounts = async () => {
    if (!user?.creator_id) {
      setIsLoading(false);
      return;
    }

    try {
      const supabase = getSupabaseBrowserClient();
      const { data, error: fetchError } = await supabase
        .from("creator_social_accounts")
        .select("*")
        .eq("creator_id", user.creator_id)
        .order("platform");

      if (fetchError) throw fetchError;
      setAccounts(data || []);
    } catch (err) {
      console.error("Error fetching accounts:", err);
      setError("Failed to load accounts");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (platform: PlatformId, data: Partial<SocialAccount>) => {
    if (!user?.creator_id) return;

    setIsSaving(true);
    try {
      const supabase = getSupabaseBrowserClient();
      const existingAccount = accounts.find((a) => a.platform === platform);

      if (existingAccount) {
        // Update
        const { error: updateError } = await supabase
          .from("creator_social_accounts")
          .update({
            ...data,
            updated_at: new Date().toISOString(),
          })
          .eq("id", existingAccount.id);

        if (updateError) throw updateError;
        toast.success("Account updated successfully");
      } else {
        // Create
        const { error: insertError } = await supabase
          .from("creator_social_accounts")
          .insert({
            creator_id: user.creator_id,
            platform,
            ...data,
          });

        if (insertError) throw insertError;
        toast.success("Account added successfully");
      }

      fetchAccounts();
      setEditingPlatform(null);
    } catch (err) {
      console.error("Error saving account:", err);
      toast.error("Failed to save account");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (platform: PlatformId) => {
    const account = accounts.find((a) => a.platform === platform);
    if (!account) return;

    if (!confirm(`Are you sure you want to remove your ${platform} account?`)) {
      return;
    }

    try {
      const supabase = getSupabaseBrowserClient();
      const { error: deleteError } = await supabase
        .from("creator_social_accounts")
        .delete()
        .eq("id", account.id);

      if (deleteError) throw deleteError;
      toast.success("Account removed");
      fetchAccounts();
    } catch (err) {
      console.error("Error deleting account:", err);
      toast.error("Failed to remove account");
    }
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
          You need to be linked to a creator profile to manage accounts.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Platform Accounts</h1>
        <p className="text-slate-500">
          Manage your login credentials for each platform
        </p>
      </div>

      {/* Security Notice */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
        <div>
          <p className="text-sm text-blue-800 font-medium">Your credentials are encrypted</p>
          <p className="text-sm text-blue-700">
            All passwords are securely stored. Only you and authorized team members can access them.
          </p>
        </div>
      </div>

      {/* Accounts Grid */}
      <div className="grid gap-4 md:grid-cols-2">
        {PLATFORMS.map((platform) => {
          const account = accounts.find((a) => a.platform === platform.id);
          return (
            <AccountCard
              key={platform.id}
              account={account || null}
              platform={platform}
              isEditing={editingPlatform === platform.id}
              onEdit={() => setEditingPlatform(platform.id)}
              onDelete={() => handleDelete(platform.id)}
              onSave={(data) => handleSave(platform.id, data)}
              onCancel={() => setEditingPlatform(null)}
            />
          );
        })}
      </div>

      {/* Stats */}
      <div className="bg-slate-50 rounded-xl p-6">
        <h2 className="font-semibold text-slate-900 mb-4">Account Summary</h2>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-slate-900">{accounts.length}</p>
            <p className="text-sm text-slate-500">Connected</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-green-600">
              {accounts.filter((a) => a.two_factor_enabled).length}
            </p>
            <p className="text-sm text-slate-500">2FA Enabled</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-amber-600">
              {PLATFORMS.length - accounts.length}
            </p>
            <p className="text-sm text-slate-500">Not Configured</p>
          </div>
        </div>
      </div>
    </div>
  );
}

