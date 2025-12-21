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
  MessageCircle,
  Phone,
  Users,
  User,
  Settings,
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader2,
  Plus,
  ArrowRight,
  Smartphone,
  MessageSquare,
  Upload,
  Image as ImageIcon,
  Shield,
  Zap,
  RefreshCw,
  Copy,
  Check,
  Info,
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

interface WhatsAppSettings {
  id: string;
  creator_id: string;
  phone_number: string | null;
  channel_type: "direct" | "group";
  group_id: string | null;
  group_name: string | null;
  enabled: boolean;
  auto_upload: boolean;
  notify_on_upload: boolean;
  created_at: string;
  updated_at: string;
}

// WhatsApp Bot API URL
const BOT_API_URL = process.env.NEXT_PUBLIC_BOT_API_URL || "http://143.110.128.83:3001";

// ============================================
// PHONE INPUT COMPONENT
// ============================================

function PhoneInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const formatPhone = (input: string) => {
    // Remove all non-numeric characters except +
    let cleaned = input.replace(/[^\d+]/g, "");
    // Ensure it starts with +
    if (cleaned && !cleaned.startsWith("+")) {
      cleaned = "+" + cleaned;
    }
    return cleaned;
  };

  return (
    <div className="relative">
      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
      <Input
        value={value}
        onChange={(e) => onChange(formatPhone(e.target.value))}
        placeholder="+1234567890"
        className="pl-10"
      />
    </div>
  );
}

// ============================================
// CHANNEL TYPE SELECTOR
// ============================================

function ChannelTypeSelector({
  value,
  onChange,
}: {
  value: "direct" | "group";
  onChange: (v: "direct" | "group") => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <button
        onClick={() => onChange("direct")}
        className={`p-6 rounded-2xl border-2 transition-all text-left ${
          value === "direct"
            ? "border-green-500 bg-green-50"
            : "border-slate-200 hover:border-slate-300"
        }`}
      >
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
          value === "direct" ? "bg-green-100" : "bg-slate-100"
        }`}>
          <User className={`w-6 h-6 ${value === "direct" ? "text-green-600" : "text-slate-500"}`} />
        </div>
        <h3 className="font-semibold text-slate-900 mb-1">Direct Messages</h3>
        <p className="text-sm text-slate-500">
          Chat directly with the bot from your phone. Only you can upload media.
        </p>
        <div className="mt-4 flex items-center gap-2">
          <Smartphone className="w-4 h-4 text-slate-400" />
          <span className="text-xs text-slate-400">1:1 conversation</span>
        </div>
      </button>

      <button
        onClick={() => onChange("group")}
        className={`p-6 rounded-2xl border-2 transition-all text-left ${
          value === "group"
            ? "border-violet-500 bg-violet-50"
            : "border-slate-200 hover:border-slate-300"
        }`}
      >
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
          value === "group" ? "bg-violet-100" : "bg-slate-100"
        }`}>
          <Users className={`w-6 h-6 ${value === "group" ? "text-violet-600" : "text-slate-500"}`} />
        </div>
        <h3 className="font-semibold text-slate-900 mb-1">Group Chat</h3>
        <p className="text-sm text-slate-500">
          Create a group where you and others can upload media together.
        </p>
        <div className="mt-4 flex items-center gap-2">
          <Plus className="w-4 h-4 text-slate-400" />
          <span className="text-xs text-slate-400">Add team members</span>
        </div>
      </button>
    </div>
  );
}

// ============================================
// SETUP WIZARD
// ============================================

function SetupWizard({
  onComplete,
  creatorId,
}: {
  onComplete: () => void;
  creatorId: string;
}) {
  const [step, setStep] = useState(1);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [channelType, setChannelType] = useState<"direct" | "group">("direct");
  const [isCreating, setIsCreating] = useState(false);
  const [groupCreated, setGroupCreated] = useState(false);
  const [groupInfo, setGroupInfo] = useState<{ id: string; name: string } | null>(null);

  const handleCreateChannel = async () => {
    if (!phoneNumber || phoneNumber.length < 10) {
      toast.error("Please enter a valid phone number");
      return;
    }

    setIsCreating(true);
    try {
      // Register with the bot API
      const response = await fetch(`${BOT_API_URL}/api/whatsapp/register-model`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          creatorId,
          phoneNumber,
          channelType,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to register");
      }

      // Save settings to Supabase
      const supabase = getSupabaseBrowserClient();
      await supabase.from("creator_whatsapp_settings").upsert({
        creator_id: creatorId,
        phone_number: phoneNumber,
        channel_type: channelType,
        group_id: data.groupId || null,
        group_name: data.groupName || null,
        enabled: true,
        auto_upload: true,
        notify_on_upload: true,
      });

      if (channelType === "group" && data.groupId) {
        setGroupInfo({ id: data.groupId, name: data.groupName });
        setGroupCreated(true);
      }

      setStep(3);
      toast.success("WhatsApp channel configured successfully!");
    } catch (err: any) {
      console.error("Setup error:", err);
      toast.error(err.message || "Failed to set up WhatsApp channel");
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress Steps */}
      <div className="flex items-center justify-center gap-2 mb-8">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step >= s
                  ? "bg-green-500 text-white"
                  : "bg-slate-200 text-slate-500"
              }`}
            >
              {step > s ? <Check className="w-4 h-4" /> : s}
            </div>
            {s < 3 && (
              <div className={`w-12 h-0.5 ${step > s ? "bg-green-500" : "bg-slate-200"}`} />
            )}
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Phone className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900">Enter Your Phone Number</h2>
              <p className="text-slate-500 mt-2">
                This is the number you'll use to communicate with the assistant
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <Label className="mb-2 block">WhatsApp Phone Number</Label>
              <PhoneInput value={phoneNumber} onChange={setPhoneNumber} />
              <p className="text-xs text-slate-400 mt-2">
                Include country code (e.g., +1 for US, +44 for UK)
              </p>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-amber-800">Important</p>
                  <p className="text-sm text-amber-700 mt-1">
                    Make sure WhatsApp is installed and active on this number. 
                    You'll receive a verification message.
                  </p>
                </div>
              </div>
            </div>

            <Button
              onClick={() => setStep(2)}
              disabled={!phoneNumber || phoneNumber.length < 10}
              className="w-full h-12 bg-green-600 hover:bg-green-700"
            >
              Continue
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-violet-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="w-8 h-8 text-violet-600" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900">Choose Channel Type</h2>
              <p className="text-slate-500 mt-2">
                How would you like to interact with the assistant?
              </p>
            </div>

            <ChannelTypeSelector value={channelType} onChange={setChannelType} />

            {channelType === "group" && (
              <div className="bg-violet-50 border border-violet-200 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <Users className="w-5 h-5 text-violet-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-violet-800">Group Benefits</p>
                    <ul className="text-sm text-violet-700 mt-1 space-y-1">
                      <li>• Add assistants or team members to help upload</li>
                      <li>• All group members can send media</li>
                      <li>• Easy collaboration and content management</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
                Back
              </Button>
              <Button
                onClick={handleCreateChannel}
                disabled={isCreating}
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                {isCreating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Setting up...
                  </>
                ) : (
                  <>
                    {channelType === "group" ? "Create Group" : "Connect"}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900">You're All Set!</h2>
              <p className="text-slate-500 mt-2">
                {channelType === "group"
                  ? "Your group has been created. Check WhatsApp!"
                  : "You can now send media directly to the bot."}
              </p>
            </div>

            {groupInfo && (
              <div className="bg-white rounded-2xl border border-slate-200 p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-violet-100 rounded-xl flex items-center justify-center">
                    <Users className="w-6 h-6 text-violet-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-slate-900">{groupInfo.name}</p>
                    <p className="text-sm text-slate-500">Group created successfully</p>
                  </div>
                </div>
              </div>
            )}

            <div className="bg-green-50 border border-green-200 rounded-xl p-4">
              <h4 className="font-medium text-green-800 mb-2">What's Next?</h4>
              <ul className="text-sm text-green-700 space-y-2">
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>Send photos or videos to upload to your library</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>The bot will analyze and categorize your content</span>
                </li>
                {channelType === "group" && (
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>Add team members to help with uploads</span>
                  </li>
                )}
              </ul>
            </div>

            <Button onClick={onComplete} className="w-full h-12 bg-green-600 hover:bg-green-700">
              Go to Dashboard
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ============================================
// SETTINGS PANEL
// ============================================

function SettingsPanel({
  settings,
  onUpdate,
  onDisconnect,
}: {
  settings: WhatsAppSettings;
  onUpdate: (data: Partial<WhatsAppSettings>) => Promise<void>;
  onDisconnect: () => void;
}) {
  const [copied, setCopied] = useState(false);

  const copyPhone = () => {
    if (settings.phone_number) {
      navigator.clipboard.writeText(settings.phone_number);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Connection Status */}
      <div className="bg-green-50 border border-green-200 rounded-2xl p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="font-semibold text-green-800">Connected</p>
              <p className="text-sm text-green-600">WhatsApp assistant is active</p>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={onDisconnect} className="text-red-600 border-red-200 hover:bg-red-50">
            Disconnect
          </Button>
        </div>
      </div>

      {/* Channel Info */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6">
        <h3 className="font-semibold text-slate-900 mb-4">Channel Information</h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between py-3 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-slate-400" />
              <span className="text-slate-600">Phone Number</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium text-slate-900">{settings.phone_number}</span>
              <Button variant="ghost" size="sm" onClick={copyPhone}>
                {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-between py-3 border-b border-slate-100">
            <div className="flex items-center gap-3">
              {settings.channel_type === "group" ? (
                <Users className="w-5 h-5 text-slate-400" />
              ) : (
                <User className="w-5 h-5 text-slate-400" />
              )}
              <span className="text-slate-600">Channel Type</span>
            </div>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              settings.channel_type === "group"
                ? "bg-violet-100 text-violet-700"
                : "bg-green-100 text-green-700"
            }`}>
              {settings.channel_type === "group" ? "Group Chat" : "Direct Messages"}
            </span>
          </div>

          {settings.group_name && (
            <div className="flex items-center justify-between py-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <MessageSquare className="w-5 h-5 text-slate-400" />
                <span className="text-slate-600">Group Name</span>
              </div>
              <span className="font-medium text-slate-900">{settings.group_name}</span>
            </div>
          )}
        </div>
      </div>

      {/* Settings */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6">
        <h3 className="font-semibold text-slate-900 mb-4">Preferences</h3>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-slate-900">Auto Upload</p>
              <p className="text-sm text-slate-500">Automatically upload received media</p>
            </div>
            <button
              onClick={() => onUpdate({ auto_upload: !settings.auto_upload })}
              className={`w-12 h-6 rounded-full transition-colors relative ${
                settings.auto_upload ? "bg-green-500" : "bg-slate-300"
              }`}
            >
              <div
                className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                  settings.auto_upload ? "translate-x-7" : "translate-x-1"
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-slate-900">Upload Notifications</p>
              <p className="text-sm text-slate-500">Get notified when media is uploaded</p>
            </div>
            <button
              onClick={() => onUpdate({ notify_on_upload: !settings.notify_on_upload })}
              className={`w-12 h-6 rounded-full transition-colors relative ${
                settings.notify_on_upload ? "bg-green-500" : "bg-slate-300"
              }`}
            >
              <div
                className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                  settings.notify_on_upload ? "translate-x-7" : "translate-x-1"
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-5 text-white">
          <Upload className="w-8 h-8 mb-3 opacity-80" />
          <p className="font-semibold">Send Media</p>
          <p className="text-sm text-white/70">Upload via WhatsApp</p>
        </div>
        <div className="bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl p-5 text-white">
          <ImageIcon className="w-8 h-8 mb-3 opacity-80" />
          <p className="font-semibold">View Library</p>
          <p className="text-sm text-white/70">See uploaded content</p>
        </div>
      </div>
    </div>
  );
}

// ============================================
// MAIN PAGE
// ============================================

export default function WhatsAppAssistantPage() {
  const { user, creator } = useDashboard();
  const [settings, setSettings] = useState<WhatsAppSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showSetup, setShowSetup] = useState(false);

  useEffect(() => {
    if (user?.creator_id) {
      fetchSettings();
    } else {
      setIsLoading(false);
    }
  }, [user]);

  const fetchSettings = async () => {
    if (!user?.creator_id) return;

    try {
      const supabase = getSupabaseBrowserClient();
      const { data, error } = await supabase
        .from("creator_whatsapp_settings")
        .select("*")
        .eq("creator_id", user.creator_id)
        .maybeSingle();

      if (error && error.code !== "PGRST116") throw error;
      setSettings(data);
    } catch (err) {
      console.error("Error fetching settings:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateSettings = async (data: Partial<WhatsAppSettings>) => {
    if (!settings) return;

    try {
      const supabase = getSupabaseBrowserClient();
      await supabase
        .from("creator_whatsapp_settings")
        .update(data)
        .eq("id", settings.id);

      setSettings({ ...settings, ...data });
      toast.success("Settings updated");
    } catch (err) {
      toast.error("Failed to update settings");
    }
  };

  const handleDisconnect = async () => {
    if (!settings) return;
    if (!confirm("Are you sure you want to disconnect WhatsApp?")) return;

    try {
      const supabase = getSupabaseBrowserClient();
      await supabase
        .from("creator_whatsapp_settings")
        .delete()
        .eq("id", settings.id);

      // Also notify the bot API
      await fetch(`${BOT_API_URL}/api/whatsapp/unregister-model`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ creatorId: user?.creator_id }),
      }).catch(() => {});

      setSettings(null);
      toast.success("WhatsApp disconnected");
    } catch (err) {
      toast.error("Failed to disconnect");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-green-600 animate-spin" />
      </div>
    );
  }

  if (!user?.creator_id) {
    return (
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 flex items-center gap-3">
        <AlertCircle className="w-5 h-5 text-amber-500" />
        <p className="text-amber-700">
          You need to be linked to a creator profile to use the WhatsApp assistant.
        </p>
      </div>
    );
  }

  // Show setup wizard if not configured
  if (!settings && !showSetup) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">WhatsApp Assistant</h1>
          <p className="text-slate-500">Upload media directly from WhatsApp</p>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-8 text-white text-center">
          <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <MessageCircle className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-bold mb-3">Connect WhatsApp</h2>
          <p className="text-white/80 mb-6 max-w-md mx-auto">
            Send photos and videos directly from WhatsApp to automatically upload 
            them to your media library.
          </p>
          <Button
            onClick={() => setShowSetup(true)}
            className="bg-white text-green-600 hover:bg-green-50"
            size="lg"
          >
            <Zap className="w-5 h-5 mr-2" />
            Get Started
          </Button>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white rounded-xl border border-slate-200 p-5 text-center">
            <Smartphone className="w-8 h-8 text-green-500 mx-auto mb-3" />
            <h3 className="font-semibold text-slate-900 mb-1">Easy Upload</h3>
            <p className="text-sm text-slate-500">Send media like any message</p>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-5 text-center">
            <Shield className="w-8 h-8 text-blue-500 mx-auto mb-3" />
            <h3 className="font-semibold text-slate-900 mb-1">Secure</h3>
            <p className="text-sm text-slate-500">End-to-end encrypted</p>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-5 text-center">
            <Users className="w-8 h-8 text-violet-500 mx-auto mb-3" />
            <h3 className="font-semibold text-slate-900 mb-1">Team Access</h3>
            <p className="text-sm text-slate-500">Optional group mode</p>
          </div>
        </div>
      </div>
    );
  }

  // Show setup wizard
  if (showSetup && !settings) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">WhatsApp Assistant</h1>
          <p className="text-slate-500">Set up your media upload channel</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-8">
          <SetupWizard
            creatorId={user.creator_id}
            onComplete={() => {
              setShowSetup(false);
              fetchSettings();
            }}
          />
        </div>
      </div>
    );
  }

  // Show settings panel if configured
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">WhatsApp Assistant</h1>
          <p className="text-slate-500">Manage your WhatsApp upload channel</p>
        </div>
        <Button variant="outline" size="sm" onClick={fetchSettings}>
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      {settings && (
        <SettingsPanel
          settings={settings}
          onUpdate={handleUpdateSettings}
          onDisconnect={handleDisconnect}
        />
      )}
    </div>
  );
}



