"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useDashboard } from "../layout";
import { getSupabaseBrowserClient } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
  Users,
  Key,
  Clock,
  RefreshCw,
  MoreVertical,
  Tag,
  Settings,
  ChevronRight,
  ArrowLeft,
  QrCode,
  Smartphone,
  Shield,
  Lock,
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// ============================================
// TOTP IMPLEMENTATION
// ============================================

// Simple TOTP implementation using Web Crypto API
async function generateTOTP(secret: string): Promise<string> {
  const counter = Math.floor(Date.now() / 30000); // 30 second periods
  const counterBuffer = new ArrayBuffer(8);
  const view = new DataView(counterBuffer);
  view.setBigUint64(0, BigInt(counter), false);

  // Decode base32 secret
  const base32Chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
  let bits = "";
  const cleanSecret = secret.toUpperCase().replace(/\s/g, "");
  for (const char of cleanSecret) {
    const val = base32Chars.indexOf(char);
    if (val === -1) continue;
    bits += val.toString(2).padStart(5, "0");
  }
  const secretBytes = new Uint8Array(bits.length / 8);
  for (let i = 0; i < secretBytes.length; i++) {
    secretBytes[i] = parseInt(bits.slice(i * 8, (i + 1) * 8), 2);
  }

  // HMAC-SHA1
  const key = await crypto.subtle.importKey(
    "raw",
    secretBytes,
    { name: "HMAC", hash: "SHA-1" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign("HMAC", key, counterBuffer);
  const hash = new Uint8Array(signature);

  // Dynamic truncation
  const offset = hash[hash.length - 1] & 0x0f;
  const code =
    ((hash[offset] & 0x7f) << 24) |
    ((hash[offset + 1] & 0xff) << 16) |
    ((hash[offset + 2] & 0xff) << 8) |
    (hash[offset + 3] & 0xff);

  return (code % 1000000).toString().padStart(6, "0");
}

function getTimeRemaining(): number {
  return 30 - (Math.floor(Date.now() / 1000) % 30);
}

// ============================================
// PLATFORM DEFINITIONS WITH FAVICON ICONS
// ============================================

const PLATFORMS = [
  { 
    id: "onlyfans", 
    name: "OnlyFans", 
    color: "bg-[#00AFF0]", 
    favicon: "https://www.google.com/s2/favicons?domain=onlyfans.com&sz=64",
    url: "https://onlyfans.com" 
  },
  { 
    id: "fansly", 
    name: "Fansly", 
    color: "bg-[#0088FA]", 
    favicon: "https://www.google.com/s2/favicons?domain=fansly.com&sz=64",
    url: "https://fansly.com" 
  },
  { 
    id: "loyalfans", 
    name: "LoyalFans", 
    color: "bg-[#FF385C]", 
    favicon: "https://www.google.com/s2/favicons?domain=loyalfans.com&sz=64",
    url: "https://loyalfans.com" 
  },
  { 
    id: "feetfinder", 
    name: "FeetFinder", 
    color: "bg-[#E91E63]", 
    favicon: "https://www.google.com/s2/favicons?domain=feetfinder.com&sz=64",
    url: "https://feetfinder.com" 
  },
  { 
    id: "reddit", 
    name: "Reddit", 
    color: "bg-[#FF4500]", 
    favicon: "https://www.google.com/s2/favicons?domain=reddit.com&sz=64",
    url: "https://reddit.com" 
  },
  { 
    id: "instagram", 
    name: "Instagram", 
    color: "bg-gradient-to-br from-[#833AB4] via-[#FD1D1D] to-[#F77737]", 
    favicon: "https://www.google.com/s2/favicons?domain=instagram.com&sz=64",
    url: "https://instagram.com" 
  },
  { 
    id: "x", 
    name: "X (Twitter)", 
    color: "bg-black", 
    favicon: "https://www.google.com/s2/favicons?domain=x.com&sz=64",
    url: "https://x.com" 
  },
  { 
    id: "tiktok", 
    name: "TikTok", 
    color: "bg-black", 
    favicon: "https://www.google.com/s2/favicons?domain=tiktok.com&sz=64",
    url: "https://tiktok.com" 
  },
  { 
    id: "redgifs", 
    name: "RedGifs", 
    color: "bg-[#CC1100]", 
    favicon: "https://www.google.com/s2/favicons?domain=redgifs.com&sz=64",
    url: "https://redgifs.com" 
  },
  { 
    id: "chaturbate", 
    name: "Chaturbate", 
    color: "bg-[#F6921E]", 
    favicon: "https://www.google.com/s2/favicons?domain=chaturbate.com&sz=64",
    url: "https://chaturbate.com" 
  },
  { 
    id: "stripchat", 
    name: "Stripchat", 
    color: "bg-[#9B59B6]", 
    favicon: "https://www.google.com/s2/favicons?domain=stripchat.com&sz=64",
    url: "https://stripchat.com" 
  },
  { 
    id: "pornhub", 
    name: "Pornhub", 
    color: "bg-[#FFA31A]", 
    favicon: "https://www.google.com/s2/favicons?domain=pornhub.com&sz=64",
    url: "https://pornhub.com" 
  },
  { 
    id: "manyvids", 
    name: "ManyVids", 
    color: "bg-[#FF1493]", 
    favicon: "https://www.google.com/s2/favicons?domain=manyvids.com&sz=64",
    url: "https://manyvids.com" 
  },
  { 
    id: "patreon", 
    name: "Patreon", 
    color: "bg-[#FF424D]", 
    favicon: "https://www.google.com/s2/favicons?domain=patreon.com&sz=64",
    url: "https://patreon.com" 
  },
  { 
    id: "twitch", 
    name: "Twitch", 
    color: "bg-[#9146FF]", 
    favicon: "https://www.google.com/s2/favicons?domain=twitch.tv&sz=64",
    url: "https://twitch.tv" 
  },
  { 
    id: "snapchat", 
    name: "Snapchat", 
    color: "bg-[#FFFC00]", 
    favicon: "https://www.google.com/s2/favicons?domain=snapchat.com&sz=64",
    url: "https://snapchat.com" 
  },
  { 
    id: "telegram", 
    name: "Telegram", 
    color: "bg-[#0088CC]", 
    favicon: "https://www.google.com/s2/favicons?domain=telegram.org&sz=64",
    url: "https://telegram.org" 
  },
  { 
    id: "discord", 
    name: "Discord", 
    color: "bg-[#5865F2]", 
    favicon: "https://www.google.com/s2/favicons?domain=discord.com&sz=64",
    url: "https://discord.com" 
  },
  { 
    id: "other", 
    name: "Other", 
    color: "bg-slate-500", 
    favicon: null,
    url: null 
  },
] as const;

type PlatformId = (typeof PLATFORMS)[number]["id"];

// ============================================
// PLATFORM ICON COMPONENT
// ============================================

function PlatformIcon({ 
  platform, 
  size = "md" 
}: { 
  platform: (typeof PLATFORMS)[number]; 
  size?: "sm" | "md" | "lg";
}) {
  const sizeClasses = {
    sm: "w-6 h-6",
    md: "w-10 h-10",
    lg: "w-12 h-12",
  };
  
  const imgSizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-7 h-7",
  };

  return (
    <div className={`${sizeClasses[size]} ${platform.color} rounded-xl flex items-center justify-center shrink-0`}>
      {platform.favicon ? (
        <img 
          src={platform.favicon} 
          alt={platform.name}
          className={`${imgSizeClasses[size]} rounded-sm`}
          onError={(e) => {
            // Fallback to first letter if favicon fails
            (e.target as HTMLImageElement).style.display = 'none';
            (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
          }}
        />
      ) : null}
      <span className={`text-white font-bold ${platform.favicon ? 'hidden' : ''}`}>
        {platform.name.charAt(0)}
      </span>
    </div>
  );
}

// ============================================
// TYPES
// ============================================

interface SocialAccount {
  id: string;
  creator_id: string;
  platform: PlatformId;
  label: string | null;
  email: string | null;
  password: string | null;
  username: string | null;
  two_factor_enabled: boolean;
  two_factor_secret: string | null;
  notes: string | null;
  enabled: boolean;
  last_login: string | null;
  created_at: string;
  updated_at: string;
}

interface Creator {
  id: string;
  username: string;
  display_name: string | null;
}

// ============================================
// TOTP DISPLAY COMPONENT
// ============================================

function TOTPDisplay({ secret, onClose }: { secret: string; onClose: () => void }) {
  const [code, setCode] = useState<string>("------");
  const [timeRemaining, setTimeRemaining] = useState(30);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const updateCode = async () => {
      try {
        const newCode = await generateTOTP(secret);
        setCode(newCode);
      } catch (err) {
        console.error("TOTP generation error:", err);
        setCode("ERROR");
      }
    };

    updateCode();
    const interval = setInterval(() => {
      const remaining = getTimeRemaining();
      setTimeRemaining(remaining);
      if (remaining === 30) {
        updateCode();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [secret]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    toast.success("Code copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent size="sm">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-green-600" />
            Two-Factor Code
          </DialogTitle>
          <DialogDescription>
            Use this code to complete your sign-in
          </DialogDescription>
        </DialogHeader>
        <DialogBody>
          <div className="space-y-6">
            {/* Code Display */}
            <div className="bg-slate-900 rounded-2xl p-6 text-center">
              <p className="text-4xl font-mono font-bold text-white tracking-[0.3em]">
                {code.slice(0, 3)} {code.slice(3)}
              </p>
              <div className="mt-4 flex items-center justify-center gap-2">
                <Clock className="w-4 h-4 text-slate-400" />
                <div className="w-24 h-2 bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-500 transition-all duration-1000 ease-linear"
                    style={{ width: `${(timeRemaining / 30) * 100}%` }}
                  />
                </div>
                <span className="text-sm text-slate-400 w-8">{timeRemaining}s</span>
              </div>
            </div>

            {/* Copy Button */}
            <Button onClick={handleCopy} className="w-full" variant="outline">
              {copied ? (
                <>
                  <Check className="w-4 h-4 mr-2 text-green-600" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 mr-2" />
                  Copy Code
                </>
              )}
            </Button>
          </div>
        </DialogBody>
      </DialogContent>
    </Dialog>
  );
}

// ============================================
// ACCOUNT CARD COMPONENT
// ============================================

function AccountCard({
  account,
  platform,
  onEdit,
  onDelete,
  onShowTOTP,
}: {
  account: SocialAccount;
  platform: (typeof PLATFORMS)[number];
  onEdit: () => void;
  onDelete: () => void;
  onShowTOTP: () => void;
}) {
  const [showPassword, setShowPassword] = useState(false);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied!`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl border border-slate-200 p-4 hover:shadow-md transition-all group"
    >
      <div className="flex items-start gap-4">
        <PlatformIcon platform={platform} size="lg" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-slate-900">{platform.name}</h3>
            {account.label && (
              <span className="px-2 py-0.5 rounded-full text-xs bg-slate-100 text-slate-600">
                {account.label}
              </span>
            )}
          </div>
          
          {account.username && (
            <button
              onClick={() => copyToClipboard(account.username!, "Username")}
              className="text-sm text-brand-600 hover:underline"
            >
              @{account.username}
            </button>
          )}

          <div className="flex items-center gap-3 mt-2">
            {account.two_factor_enabled && account.two_factor_secret && (
              <Button
                size="sm"
                variant="outline"
                onClick={onShowTOTP}
                className="h-7 text-xs bg-green-50 border-green-200 text-green-700 hover:bg-green-100"
              >
                <ShieldCheck className="w-3 h-3 mr-1" />
                Get 2FA Code
              </Button>
            )}
            {account.two_factor_enabled && !account.two_factor_secret && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs bg-amber-50 text-amber-600">
                <ShieldCheck className="w-3 h-3" />
                2FA (External)
              </span>
            )}
            {!account.two_factor_enabled && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs bg-red-50 text-red-600">
                <ShieldOff className="w-3 h-3" />
                No 2FA
              </span>
            )}
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {account.password && (
              <DropdownMenuItem onClick={() => copyToClipboard(account.password!, "Password")}>
                <Key className="w-4 h-4 mr-2" />
                Copy Password
              </DropdownMenuItem>
            )}
            {account.email && (
              <DropdownMenuItem onClick={() => copyToClipboard(account.email!, "Email")}>
                <Copy className="w-4 h-4 mr-2" />
                Copy Email
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onEdit}>
              <Edit2 className="w-4 h-4 mr-2" />
              Edit Account
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <a href={platform.url} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="w-4 h-4 mr-2" />
                Open {platform.name}
              </a>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onDelete} className="text-red-600">
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </motion.div>
  );
}

// ============================================
// ACCOUNT EDITOR MODAL
// ============================================

function AccountEditor({
  account,
  platform,
  creatorId,
  onSave,
  onClose,
}: {
  account: SocialAccount | null;
  platform: (typeof PLATFORMS)[number] | null;
  creatorId: string;
  onSave: () => void;
  onClose: () => void;
}) {
  const [selectedPlatform, setSelectedPlatform] = useState<string>(account?.platform || platform?.id || "");
  const [showPassword, setShowPassword] = useState(false);
  const [show2FASecret, setShow2FASecret] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [testingTOTP, setTestingTOTP] = useState(false);
  const [testTOTPResult, setTestTOTPResult] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    label: account?.label || "",
    email: account?.email || "",
    password: account?.password || "",
    username: account?.username || "",
    two_factor_enabled: account?.two_factor_enabled || false,
    two_factor_secret: account?.two_factor_secret || "",
    notes: account?.notes || "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlatform) {
      toast.error("Please select a platform");
      return;
    }

    setIsSaving(true);
    try {
      const supabase = getSupabaseBrowserClient();
      
      const data = {
        creator_id: creatorId,
        platform: selectedPlatform,
        label: formData.label || null,
        email: formData.email || null,
        password: formData.password || null,
        username: formData.username || null,
        two_factor_enabled: formData.two_factor_enabled,
        two_factor_secret: formData.two_factor_secret || null,
        notes: formData.notes || null,
        enabled: true,
      };

      if (account) {
        const { error } = await supabase
          .from("creator_social_accounts")
          .update(data)
          .eq("id", account.id);
        if (error) throw error;
        toast.success("Account updated");
      } else {
        const { error } = await supabase
          .from("creator_social_accounts")
          .insert(data);
        if (error) throw error;
        toast.success("Account added");
      }

      onSave();
      onClose();
    } catch (err: any) {
      console.error("Save error:", err);
      toast.error(err.message || "Failed to save account");
    } finally {
      setIsSaving(false);
    }
  };

  const handleTestTOTP = async () => {
    if (!formData.two_factor_secret) {
      toast.error("Please enter a TOTP secret first");
      return;
    }
    
    setTestingTOTP(true);
    try {
      const code = await generateTOTP(formData.two_factor_secret);
      setTestTOTPResult(code);
      toast.success("TOTP secret is valid!");
    } catch (err) {
      console.error("TOTP test error:", err);
      toast.error("Invalid TOTP secret. Please check the format.");
      setTestTOTPResult(null);
    } finally {
      setTestingTOTP(false);
    }
  };

  const currentPlatform = PLATFORMS.find((p) => p.id === selectedPlatform);

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent size="lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            {currentPlatform && <PlatformIcon platform={currentPlatform} size="md" />}
            {account ? "Edit Account" : "Add Account"}
          </DialogTitle>
          <DialogDescription>
            {account ? "Update your account credentials" : "Add a new platform account"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col min-h-0 flex-1">
          <DialogBody className="space-y-4 overflow-y-auto">
            {/* Platform Selection */}
            {!account && (
              <div className="space-y-2">
                <Label>Platform</Label>
                <Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a platform..." />
                  </SelectTrigger>
                  <SelectContent className="max-h-[300px]">
                    {PLATFORMS.map((p) => (
                      <SelectItem key={p.id} value={p.id}>
                        <span className="flex items-center gap-2">
                          <span className={`w-5 h-5 ${p.color} rounded flex items-center justify-center`}>
                            {p.favicon ? (
                              <img src={p.favicon} alt="" className="w-4 h-4 rounded-sm" />
                            ) : (
                              <span className="text-white text-xs font-bold">{p.name.charAt(0)}</span>
                            )}
                          </span>
                          <span>{p.name}</span>
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Label */}
            <div className="space-y-2">
              <Label htmlFor="label">Label (optional)</Label>
              <Input
                id="label"
                value={formData.label}
                onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                placeholder="e.g., Main Account, Business, Personal"
              />
              <p className="text-xs text-slate-500">Use labels to organize multiple accounts for the same platform</p>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="account@email.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  placeholder="username"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
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

            {/* 2FA Section */}
            <div className="bg-slate-50 rounded-xl p-4 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-slate-600" />
                  <span className="font-medium text-slate-900">Two-Factor Authentication</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.two_factor_enabled}
                    onChange={(e) => setFormData({ ...formData, two_factor_enabled: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-200 rounded-full peer peer-checked:bg-green-500 transition-colors">
                    <div className={`w-4 h-4 bg-white rounded-full shadow absolute top-1 transition-all ${formData.two_factor_enabled ? "left-6" : "left-1"}`} />
                  </div>
                </label>
              </div>

              {formData.two_factor_enabled && (
                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label htmlFor="two_factor_secret">TOTP Secret Key</Label>
                    <div className="relative">
                      <Input
                        id="two_factor_secret"
                        type={show2FASecret ? "text" : "password"}
                        value={formData.two_factor_secret}
                        onChange={(e) => {
                          setFormData({ ...formData, two_factor_secret: e.target.value.toUpperCase().replace(/\s/g, "") });
                          setTestTOTPResult(null);
                        }}
                        placeholder="JBSWY3DPEHPK3PXP"
                        className="pr-10 font-mono"
                      />
                      <button
                        type="button"
                        onClick={() => setShow2FASecret(!show2FASecret)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      >
                        {show2FASecret ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    <p className="text-xs text-slate-500">
                      Enter the Base32 secret key from your authenticator app setup. This is usually shown 
                      as "Manual entry key" or when you click "Can't scan QR code?".
                    </p>
                  </div>
                  
                  {/* Test TOTP Button */}
                  <div className="flex items-center gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleTestTOTP}
                      disabled={testingTOTP || !formData.two_factor_secret}
                      className="text-xs"
                    >
                      {testingTOTP ? (
                        <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                      ) : (
                        <ShieldCheck className="w-3 h-3 mr-1" />
                      )}
                      Test Secret
                    </Button>
                    {testTOTPResult && (
                      <div className="flex items-center gap-2 px-3 py-1.5 bg-green-100 rounded-lg">
                        <Check className="w-4 h-4 text-green-600" />
                        <span className="font-mono text-green-700 font-medium">{testTOTPResult}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-700">
                    <strong className="font-medium">How to get the secret:</strong>
                    <ol className="mt-1 ml-4 list-decimal space-y-0.5">
                      <li>Go to the platform's 2FA setup page</li>
                      <li>Look for "Can't scan?" or "Manual entry" option</li>
                      <li>Copy the secret key (letters and numbers)</li>
                      <li>Paste it here - we'll generate codes for you</li>
                    </ol>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Additional notes about this account..."
                rows={2}
              />
            </div>
          </DialogBody>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSaving} className="bg-brand-600 hover:bg-brand-700">
              {isSaving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {account ? "Save Changes" : "Add Account"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ============================================
// CREATOR SELECTOR
// ============================================

function CreatorSelector({
  creators,
  selectedId,
  onSelect,
}: {
  creators: Creator[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 mb-6">
      <Label className="text-sm text-slate-500 mb-2 block">Select Creator</Label>
      <Select value={selectedId || ""} onValueChange={onSelect}>
        <SelectTrigger>
          <SelectValue placeholder="Select a creator..." />
        </SelectTrigger>
        <SelectContent>
          {creators.map((creator) => (
            <SelectItem key={creator.id} value={creator.id}>
              {creator.display_name || creator.username}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

// ============================================
// MAIN PAGE
// ============================================

export default function AccountsPage() {
  const { user } = useDashboard();
  const isAdminOrBusiness = user?.role === "admin" || user?.role === "business";
  
  const [accounts, setAccounts] = useState<SocialAccount[]>([]);
  const [creators, setCreators] = useState<Creator[]>([]);
  const [selectedCreatorId, setSelectedCreatorId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showEditor, setShowEditor] = useState(false);
  const [editingAccount, setEditingAccount] = useState<SocialAccount | null>(null);
  const [selectedPlatform, setSelectedPlatform] = useState<(typeof PLATFORMS)[number] | null>(null);
  const [showTOTP, setShowTOTP] = useState<SocialAccount | null>(null);
  const [filter, setFilter] = useState<string>("all");

  const activeCreatorId = isAdminOrBusiness ? selectedCreatorId : user?.creator_id;

  useEffect(() => {
    if (isAdminOrBusiness) {
      fetchCreators();
    } else if (user?.creator_id) {
      setSelectedCreatorId(user.creator_id);
      fetchAccounts(user.creator_id);
    } else {
      setIsLoading(false);
    }
  }, [user, isAdminOrBusiness]);

  useEffect(() => {
    if (selectedCreatorId) {
      fetchAccounts(selectedCreatorId);
    }
  }, [selectedCreatorId]);

  const fetchCreators = async () => {
    try {
      const supabase = getSupabaseBrowserClient();
      let query = supabase.from("creators").select("id, username").eq("enabled", true);
      
      if (user?.role === "business" && user.studio_id) {
        query = query.eq("studio_id", user.studio_id);
      }

      const { data, error } = await query.order("username");
      if (error) throw error;
      setCreators(data || []);
      
      if (data && data.length > 0 && !selectedCreatorId) {
        setSelectedCreatorId(data[0].id);
      }
    } catch (err) {
      console.error("Error fetching creators:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAccounts = async (creatorId: string) => {
    setIsLoading(true);
    try {
      const supabase = getSupabaseBrowserClient();
      const { data, error } = await supabase
        .from("creator_social_accounts")
        .select("*")
        .eq("creator_id", creatorId)
        .order("platform");

      if (error) throw error;
      setAccounts(data || []);
    } catch (err) {
      console.error("Error fetching accounts:", err);
      toast.error("Failed to load accounts");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (accountId: string) => {
    if (!confirm("Are you sure you want to delete this account?")) return;

    try {
      const supabase = getSupabaseBrowserClient();
      const { error } = await supabase
        .from("creator_social_accounts")
        .delete()
        .eq("id", accountId);

      if (error) throw error;
      setAccounts((prev) => prev.filter((a) => a.id !== accountId));
      toast.success("Account deleted");
    } catch (err) {
      toast.error("Failed to delete account");
    }
  };

  const filteredAccounts = filter === "all" 
    ? accounts 
    : accounts.filter((a) => a.platform === filter);

  const groupedAccounts = PLATFORMS.reduce((acc, platform) => {
    const platformAccounts = filteredAccounts.filter((a) => a.platform === platform.id);
    if (platformAccounts.length > 0) {
      acc[platform.id] = platformAccounts;
    }
    return acc;
  }, {} as Record<string, SocialAccount[]>);

  if (isLoading && !activeCreatorId) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-brand-600 animate-spin" />
      </div>
    );
  }

  if (!isAdminOrBusiness && !user?.creator_id) {
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Platform Accounts</h1>
          <p className="text-slate-500">Manage your social media and content platform accounts</p>
        </div>
        <Button 
          onClick={() => {
            setEditingAccount(null);
            setSelectedPlatform(null);
            setShowEditor(true);
          }}
          className="bg-brand-600 hover:bg-brand-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Account
        </Button>
      </div>

      {/* Creator Selector for Admin/Studio */}
      {isAdminOrBusiness && (
        <CreatorSelector
          creators={creators}
          selectedId={selectedCreatorId}
          onSelect={setSelectedCreatorId}
        />
      )}

      {/* Platform Filter */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
        <button
          onClick={() => setFilter("all")}
          className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
            filter === "all" 
              ? "bg-slate-900 text-white" 
              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
          }`}
        >
          All ({accounts.length})
        </button>
        {PLATFORMS.map((platform) => {
          const count = accounts.filter((a) => a.platform === platform.id).length;
          if (count === 0) return null;
          return (
            <button
              key={platform.id}
              onClick={() => setFilter(platform.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors flex items-center gap-2 ${
                filter === platform.id 
                  ? "bg-slate-900 text-white" 
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              <span className={`w-5 h-5 ${platform.color} rounded flex items-center justify-center`}>
                {platform.favicon ? (
                  <img src={platform.favicon} alt="" className="w-4 h-4 rounded-sm" />
                ) : (
                  <span className="text-white text-xs font-bold">{platform.name.charAt(0)}</span>
                )}
              </span>
              {platform.name} ({count})
            </button>
          );
        })}
      </div>

      {/* Loading State */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-brand-600 animate-spin" />
        </div>
      ) : filteredAccounts.length === 0 ? (
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-12 text-center">
          <Key className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="font-semibold text-slate-700 mb-2">
            {accounts.length === 0 ? "No accounts yet" : "No accounts match filter"}
          </h3>
          <p className="text-slate-500 text-sm mb-6">
            {accounts.length === 0 
              ? "Add your first platform account to get started"
              : "Try changing the filter to see more accounts"}
          </p>
          {accounts.length === 0 && (
            <Button 
              onClick={() => {
                setEditingAccount(null);
                setSelectedPlatform(null);
                setShowEditor(true);
              }}
              className="bg-brand-600 hover:bg-brand-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Account
            </Button>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedAccounts).map(([platformId, platformAccounts]) => {
            const platform = PLATFORMS.find((p) => p.id === platformId)!;
            return (
              <div key={platformId}>
                <div className="flex items-center gap-3 mb-3">
                  <PlatformIcon platform={platform} size="md" />
                  <h2 className="font-semibold text-slate-900">{platform.name}</h2>
                  <span className="text-sm text-slate-400">({platformAccounts.length})</span>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      setEditingAccount(null);
                      setSelectedPlatform(platform);
                      setShowEditor(true);
                    }}
                    className="ml-auto"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <div className="grid gap-3">
                  {platformAccounts.map((account) => (
                    <AccountCard
                      key={account.id}
                      account={account}
                      platform={platform}
                      onEdit={() => {
                        setEditingAccount(account);
                        setSelectedPlatform(platform);
                        setShowEditor(true);
                      }}
                      onDelete={() => handleDelete(account.id)}
                      onShowTOTP={() => setShowTOTP(account)}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Account Editor Modal */}
      <AnimatePresence>
        {showEditor && activeCreatorId && (
          <AccountEditor
            account={editingAccount}
            platform={selectedPlatform}
            creatorId={activeCreatorId}
            onSave={() => fetchAccounts(activeCreatorId)}
            onClose={() => {
              setShowEditor(false);
              setEditingAccount(null);
              setSelectedPlatform(null);
            }}
          />
        )}
      </AnimatePresence>

      {/* TOTP Display Modal */}
      <AnimatePresence>
        {showTOTP && showTOTP.two_factor_secret && (
          <TOTPDisplay
            secret={showTOTP.two_factor_secret}
            onClose={() => setShowTOTP(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}






