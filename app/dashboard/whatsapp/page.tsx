"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useDashboard } from "../layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  MessageCircle,
  Settings,
  RefreshCw,
  Send,
  Users,
  AlertCircle,
  CheckCircle,
  XCircle,
  Clock,
  Loader2,
  Phone,
  QrCode,
  X,
  Smartphone,
  Activity,
  MessageSquare,
  Bot,
  Zap,
  Shield,
  BarChart3,
  Wifi,
  WifiOff,
  ScanLine,
  Image as ImageIcon,
  Video,
  Music,
  FileText,
  TrendingUp,
  Database,
  Hash,
  ChevronRight,
  LayoutTemplate,
  Plus,
  Trash2,
  Edit,
  Copy,
  Save,
  Megaphone,
  Bell,
  Star,
  Tag,
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

interface BotStatus {
  connected: boolean;
  rabbitmq?: {
    connected: boolean;
    duplicateCheck?: { waiting: number };
    analyze?: { waiting: number };
  };
}

interface QRCodeData {
  success: boolean;
  qrCode?: string;
  ageSeconds?: number;
  connected?: boolean;
  state?: 'disconnected' | 'connecting' | 'qr_ready' | 'connected';
  message?: string;
}

interface BotCommand {
  command: string;
  description: string;
  enabled: boolean;
}

interface Group {
  id: string;
  name: string;
  participants: number;
}

interface WhatsAppGroup {
  id: string;
  whatsapp_id: string;
  name: string;
  type: 'creator' | 'studio' | 'admin';
  participant_count: number;
}

interface MessageTemplate {
  id: string;
  name: string;
  content: string;
  category: 'general' | 'announcement' | 'reminder' | 'promotion' | 'urgent';
  variables: string[];
  is_active: boolean;
  use_count: number;
  created_at: string;
  creator?: { display_name: string; email: string };
}

interface AnalyticsData {
  totalMessages: number;
  totalMedia: number;
  photos: number;
  videos: number;
  audios: number;
  customs: number;
  activeCreators: number;
}

const CATEGORY_CONFIG: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  general: { label: 'General', color: 'bg-slate-100 text-slate-700', icon: MessageSquare },
  announcement: { label: 'Announcement', color: 'bg-blue-100 text-blue-700', icon: Megaphone },
  reminder: { label: 'Reminder', color: 'bg-amber-100 text-amber-700', icon: Bell },
  promotion: { label: 'Promotion', color: 'bg-green-100 text-green-700', icon: Star },
  urgent: { label: 'Urgent', color: 'bg-red-100 text-red-700', icon: AlertCircle },
};

// WhatsApp Bot API URL - use local proxy to avoid mixed content (HTTPS -> HTTP) issues
// The proxy forwards requests to the actual bot API on port 3001
const BOT_API_URL = "/api/whatsapp-bot";

// ============================================
// STATUS CARD
// ============================================

function StatusCard({
  title,
  value,
  icon: Icon,
  color,
  subtitle,
  pulse,
}: {
  title: string;
  value: string | number;
  icon: React.ElementType;
  color: string;
  subtitle?: string;
  pulse?: boolean;
}) {
  return (
    <div className={`rounded-xl p-4 ${color} relative overflow-hidden`}>
      {pulse && (
        <div className="absolute inset-0 bg-white/10 animate-pulse" />
      )}
      <div className="flex items-center gap-3 relative z-10">
        <div className="p-2 bg-white/20 rounded-lg">
          <Icon className="w-5 h-5" />
        </div>
        <div>
          <p className="text-2xl font-bold">{value}</p>
          <p className="text-sm opacity-80">{title}</p>
          {subtitle && <p className="text-xs opacity-60 mt-1">{subtitle}</p>}
        </div>
      </div>
    </div>
  );
}

// ============================================
// QR CODE DISPLAY (INLINE)
// ============================================

function QRCodeDisplay({
  apiUrl,
  onConnected,
  connectionNotifiedRef,
}: {
  apiUrl: string;
  onConnected: () => void;
  connectionNotifiedRef: React.MutableRefObject<boolean>;
}) {
  const [qrData, setQrData] = useState<QRCodeData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(0);
  const refreshIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const fetchQRCode = useCallback(async () => {
    try {
      const response = await fetch(`${apiUrl}/qr-json`, {
        cache: "no-store",
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      const data: QRCodeData = await response.json();
      setQrData(data);
      setError(null);
      
      // If connected, notify parent (only once)
      if (data.connected && !connectionNotifiedRef.current) {
        connectionNotifiedRef.current = true;
        onConnected();
      }
      
      // Reset countdown
      if (data.success && data.qrCode) {
        setCountdown(20);
      }
    } catch (err) {
      setError("Cannot connect to WhatsApp bot API");
      setQrData(null);
    } finally {
      setIsLoading(false);
    }
  }, [apiUrl, onConnected, connectionNotifiedRef]);

  useEffect(() => {
    fetchQRCode();
    refreshIntervalRef.current = setInterval(fetchQRCode, 5000);
    countdownIntervalRef.current = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => {
      if (refreshIntervalRef.current) clearInterval(refreshIntervalRef.current);
      if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
    };
  }, [fetchQRCode]);

  if (isLoading) {
    return (
      <div className="bg-slate-100 rounded-2xl p-8 flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="w-10 h-10 text-slate-400 animate-spin mb-4" />
        <p className="text-slate-500">Connecting to WhatsApp bot...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-8 flex flex-col items-center justify-center min-h-[400px]">
        <WifiOff className="w-12 h-12 text-red-400 mb-4" />
        <h3 className="text-lg font-semibold text-red-700 mb-2">Connection Error</h3>
        <p className="text-red-600 text-center mb-4">{error}</p>
        <p className="text-sm text-red-500 mb-4">
          Make sure the bot is running at: <code className="bg-red-100 px-2 py-1 rounded">{apiUrl}</code>
        </p>
        <Button
          onClick={() => {
            setIsLoading(true);
            fetchQRCode();
          }}
          variant="outline"
          className="border-red-300 text-red-600 hover:bg-red-50"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Retry Connection
        </Button>
      </div>
    );
  }

  // Already connected
  if (qrData?.connected || (!qrData?.success && qrData?.message?.includes("connected"))) {
    return (
      <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-8 flex flex-col items-center justify-center min-h-[400px]">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
          <CheckCircle className="w-10 h-10 text-green-600" />
        </div>
        <h3 className="text-xl font-semibold text-green-800 mb-2">WhatsApp Connected!</h3>
        <p className="text-green-600">The bot is authenticated and ready to use.</p>
      </div>
    );
  }

  // Show QR code
  if (qrData?.success && qrData.qrCode) {
    return (
      <div className="bg-white border-2 border-slate-200 rounded-2xl p-6 flex flex-col items-center">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-green-100 rounded-lg">
            <QrCode className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-900">Scan to Connect</h3>
            <p className="text-sm text-slate-500">Use WhatsApp on your phone</p>
          </div>
        </div>

        <div className="relative">
          <div className="w-72 h-72 bg-white rounded-xl border-4 border-green-500 p-2 shadow-lg">
            <img
              src={qrData.qrCode}
              alt="WhatsApp QR Code"
              className="w-full h-full"
            />
          </div>
          
          <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-xl">
            <motion.div
              className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-green-400 to-transparent"
              animate={{ top: ["0%", "100%", "0%"] }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            />
          </div>
        </div>

        <div className="mt-4 flex items-center gap-4 text-sm text-slate-500">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>Refreshing in {countdown}s</span>
          </div>
          <div className="flex items-center gap-1">
            <Activity className="w-4 h-4 text-green-500 animate-pulse" />
            <span className="text-green-600">Live</span>
          </div>
        </div>

        <div className="mt-6 bg-slate-50 rounded-xl p-4 w-full max-w-sm">
          <h4 className="font-medium text-slate-900 mb-2">How to connect:</h4>
          <ol className="text-sm text-slate-600 space-y-1.5">
            <li className="flex items-start gap-2">
              <span className="w-5 h-5 rounded-full bg-green-100 text-green-700 flex items-center justify-center shrink-0 text-xs font-bold">1</span>
              Open WhatsApp on your phone
            </li>
            <li className="flex items-start gap-2">
              <span className="w-5 h-5 rounded-full bg-green-100 text-green-700 flex items-center justify-center shrink-0 text-xs font-bold">2</span>
              Go to <strong>Settings → Linked Devices</strong>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-5 h-5 rounded-full bg-green-100 text-green-700 flex items-center justify-center shrink-0 text-xs font-bold">3</span>
              Tap <strong>"Link a Device"</strong>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-5 h-5 rounded-full bg-green-100 text-green-700 flex items-center justify-center shrink-0 text-xs font-bold">4</span>
              Point your phone at this QR code
            </li>
          </ol>
        </div>
      </div>
    );
  }

  // No QR available
  const stateMessages: Record<string, { title: string; message: string }> = {
    disconnected: {
      title: "Bot Disconnected",
      message: "The bot is not connected. It may be restarting.",
    },
    connecting: {
      title: "Bot Starting Up",
      message: "The bot is initializing. QR code will appear shortly.",
    },
    qr_ready: {
      title: "QR Code Loading",
      message: "QR code is being generated...",
    },
    connected: {
      title: "Connected",
      message: "WhatsApp is already connected!",
    },
  };

  const stateInfo = stateMessages[qrData?.state || 'connecting'] || stateMessages.connecting;

  return (
    <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-8 flex flex-col items-center justify-center min-h-[400px]">
      <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mb-4">
        <ScanLine className="w-8 h-8 text-amber-600" />
      </div>
      <h3 className="text-lg font-semibold text-amber-800 mb-2">{stateInfo.title}</h3>
      <p className="text-amber-600 text-center mb-4">
        {qrData?.message || stateInfo.message}
      </p>
      <div className="flex items-center gap-2 text-sm text-amber-500">
        <Loader2 className="w-4 h-4 animate-spin" />
        <span>Checking every 5 seconds...</span>
      </div>
    </div>
  );
}

// ============================================
// GROUPS MODAL
// ============================================

function GroupsModal({
  onClose,
  apiUrl,
}: {
  onClose: () => void;
  apiUrl: string;
}) {
  const [groups, setGroups] = useState<Group[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await fetch(`${apiUrl}/groups`);
        if (!response.ok) throw new Error("Failed to fetch groups");
        const data = await response.json();
        setGroups(data || []);
      } catch (err) {
        setError("Failed to load groups");
      } finally {
        setIsLoading(false);
      }
    };
    fetchGroups();
  }, [apiUrl]);

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent size="md">
        <DialogHeader>
          <DialogTitle>WhatsApp Groups</DialogTitle>
          <DialogDescription>
            Groups the bot is a member of
          </DialogDescription>
        </DialogHeader>

        <DialogBody>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-6 h-6 text-green-600 animate-spin" />
            </div>
          ) : error ? (
            <div className="bg-red-50 rounded-xl p-4 text-center">
              <AlertCircle className="w-8 h-8 text-red-400 mx-auto mb-2" />
              <p className="text-red-600">{error}</p>
            </div>
          ) : groups.length === 0 ? (
            <div className="bg-slate-50 rounded-xl p-8 text-center">
              <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500">No groups found</p>
            </div>
          ) : (
            <div className="space-y-2">
              {groups.map((group) => (
                <div
                  key={group.id}
                  className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl"
                >
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <Users className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-slate-900 truncate">{group.name}</p>
                    <p className="text-xs text-slate-500">{group.participants} members</p>
                  </div>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(group.id);
                      toast.success("Group ID copied");
                    }}
                    className="p-2 hover:bg-slate-200 rounded-lg"
                  >
                    <Hash className="w-4 h-4 text-slate-400" />
                  </button>
                </div>
              ))}
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
// ANALYTICS MODAL
// ============================================

function AnalyticsModal({
  onClose,
  queueStats,
}: {
  onClose: () => void;
  queueStats: any;
}) {
  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent size="lg">
        <DialogHeader>
          <DialogTitle>Bot Analytics</DialogTitle>
          <DialogDescription>
            Real-time statistics and queue status
          </DialogDescription>
        </DialogHeader>

        <DialogBody>
          <div className="space-y-6">
            {/* WhatsApp Status */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200">
              <div className="flex items-center gap-3 mb-3">
                <MessageCircle className="w-5 h-5 text-green-600" />
                <h4 className="font-semibold text-green-800">WhatsApp Status</h4>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-green-600">Connection</p>
                  <p className="text-lg font-bold text-green-800">
                    {queueStats?.whatsapp?.connected ? "Connected" : "Disconnected"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-green-600">State</p>
                  <p className="text-lg font-bold text-green-800 capitalize">
                    {queueStats?.whatsapp?.state || "Unknown"}
                  </p>
                </div>
              </div>
            </div>

            {/* RabbitMQ Stats */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-200">
              <div className="flex items-center gap-3 mb-3">
                <Database className="w-5 h-5 text-blue-600" />
                <h4 className="font-semibold text-blue-800">RabbitMQ Queues</h4>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/50 rounded-lg p-3">
                  <p className="text-xs text-blue-600">Duplicate Check</p>
                  <p className="text-2xl font-bold text-blue-800">
                    {queueStats?.rabbitmq?.duplicateCheck?.waiting ?? 0}
                  </p>
                  <p className="text-xs text-blue-500">waiting</p>
                </div>
                <div className="bg-white/50 rounded-lg p-3">
                  <p className="text-xs text-blue-600">Analysis Queue</p>
                  <p className="text-2xl font-bold text-blue-800">
                    {queueStats?.rabbitmq?.analyze?.waiting ?? 0}
                  </p>
                  <p className="text-xs text-blue-500">waiting</p>
                </div>
              </div>
            </div>

            {/* Services Status */}
            <div className="bg-gradient-to-r from-purple-50 to-violet-50 rounded-xl p-4 border border-purple-200">
              <div className="flex items-center gap-3 mb-3">
                <Zap className="w-5 h-5 text-purple-600" />
                <h4 className="font-semibold text-purple-800">Services</h4>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${
                    queueStats?.rabbitmq?.connected ? "bg-green-500" : "bg-red-500"
                  }`} />
                  <span className="text-sm text-purple-700">RabbitMQ</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${
                    queueStats?.supabase?.connected ? "bg-green-500" : "bg-red-500"
                  }`} />
                  <span className="text-sm text-purple-700">Supabase</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${
                    queueStats?.spaces?.connected ? "bg-green-500" : "bg-red-500"
                  }`} />
                  <span className="text-sm text-purple-700">DO Spaces</span>
                </div>
              </div>
            </div>

            {/* API Info */}
            <div className="text-center pt-4 border-t border-slate-200">
              <p className="text-xs text-slate-400">API Endpoint</p>
              <code className="text-sm bg-slate-100 px-2 py-1 rounded text-slate-600">
                {BOT_API_URL}
              </code>
            </div>
          </div>
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
// SEND MESSAGE MODAL
// ============================================

function SendMessageModal({
  onClose,
  groups,
  templates,
  onRefreshGroups,
}: {
  onClose: () => void;
  groups: WhatsAppGroup[];
  templates: MessageTemplate[];
  onRefreshGroups: () => void;
}) {
  const [selectedGroup, setSelectedGroup] = useState<string>("");
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isLoadingGroups, setIsLoadingGroups] = useState(false);

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId);
    const template = templates.find((t) => t.id === templateId);
    if (template) {
      setMessage(template.content);
    }
  };

  const handleRefreshGroups = async () => {
    setIsLoadingGroups(true);
    await onRefreshGroups();
    setIsLoadingGroups(false);
  };

  const handleSend = async () => {
    if (!selectedGroup || !message.trim()) {
      toast.error("Please select a group and enter a message");
      return;
    }

    setIsSending(true);
    try {
      const response = await fetch("/api/whatsapp/send-message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          groupId: selectedGroup,
          message: message.trim(),
          templateId: selectedTemplate || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to send message");
      }

      toast.success(`Message sent to ${data.groupName}`);
      onClose();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to send message");
    } finally {
      setIsSending(false);
    }
  };

  const selectedGroupInfo = groups.find((g) => g.id === selectedGroup);

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent size="lg">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Send className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <DialogTitle>Send Message to Group</DialogTitle>
              <DialogDescription>
                Choose a group and compose your message
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <DialogBody>
          <div className="space-y-6">
            {/* Group Selection */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Select Group</Label>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleRefreshGroups}
                  disabled={isLoadingGroups}
                >
                  <RefreshCw className={`w-4 h-4 mr-1 ${isLoadingGroups ? "animate-spin" : ""}`} />
                  Refresh
                </Button>
              </div>
              {groups.length === 0 ? (
                <div className="bg-slate-50 rounded-lg p-4 text-center">
                  <Users className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                  <p className="text-slate-500 text-sm">No groups available</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto">
                  {groups.map((group) => (
                    <button
                      key={group.id}
                      onClick={() => setSelectedGroup(group.id)}
                      className={`flex items-center gap-3 p-3 rounded-lg border-2 transition-all text-left ${
                        selectedGroup === group.id
                          ? "border-green-500 bg-green-50"
                          : "border-slate-200 hover:border-slate-300 bg-white"
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        group.type === 'admin' ? 'bg-purple-100' :
                        group.type === 'studio' ? 'bg-blue-100' : 'bg-green-100'
                      }`}>
                        <Users className={`w-5 h-5 ${
                          group.type === 'admin' ? 'text-purple-600' :
                          group.type === 'studio' ? 'text-blue-600' : 'text-green-600'
                        }`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-slate-900 truncate">{group.name || 'Unnamed Group'}</p>
                        <div className="flex items-center gap-2">
                          <span className={`text-xs px-2 py-0.5 rounded-full ${
                            group.type === 'admin' ? 'bg-purple-100 text-purple-700' :
                            group.type === 'studio' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                          }`}>
                            {group.type}
                          </span>
                          <span className="text-xs text-slate-500">
                            {group.participant_count || 0} members
                          </span>
                        </div>
                      </div>
                      {selectedGroup === group.id && (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Template Selection */}
            {templates.length > 0 && (
              <div className="space-y-2">
                <Label>Use Template (Optional)</Label>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => {
                      setSelectedTemplate("");
                      setMessage("");
                    }}
                    className={`px-3 py-1.5 rounded-full text-sm transition-all ${
                      !selectedTemplate
                        ? "bg-slate-900 text-white"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }`}
                  >
                    Custom Message
                  </button>
                  {templates.map((template) => {
                    const config = CATEGORY_CONFIG[template.category] || CATEGORY_CONFIG.general;
                    return (
                      <button
                        key={template.id}
                        onClick={() => handleTemplateSelect(template.id)}
                        className={`px-3 py-1.5 rounded-full text-sm transition-all flex items-center gap-1 ${
                          selectedTemplate === template.id
                            ? "bg-green-600 text-white"
                            : `${config.color} hover:opacity-80`
                        }`}
                      >
                        <config.icon className="w-3 h-3" />
                        {template.name}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Message Input */}
            <div className="space-y-2">
              <Label>Message</Label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={5}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-green-500 text-slate-900"
                placeholder="Type your message here..."
              />
              <p className="text-xs text-slate-500">
                {message.length} characters • Emojis and formatting supported
              </p>
            </div>

            {/* Preview */}
            {selectedGroupInfo && message && (
              <div className="bg-slate-50 rounded-lg p-4">
                <p className="text-xs text-slate-500 mb-2">Preview</p>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shrink-0">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <div className="bg-white rounded-lg rounded-tl-none p-3 shadow-sm max-w-sm">
                    <p className="text-sm text-slate-900 whitespace-pre-wrap">{message}</p>
                    <p className="text-xs text-slate-400 mt-1">To: {selectedGroupInfo.name}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </DialogBody>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleSend}
            disabled={isSending || !selectedGroup || !message.trim()}
            className="bg-green-600 hover:bg-green-700"
          >
            {isSending ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : (
              <Send className="w-4 h-4 mr-2" />
            )}
            Send Message
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ============================================
// TEMPLATES MODAL
// ============================================

function TemplatesModal({
  onClose,
  templates,
  onRefresh,
  isAdmin,
}: {
  onClose: () => void;
  templates: MessageTemplate[];
  onRefresh: () => void;
  isAdmin: boolean;
}) {
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    content: "",
    category: "general" as MessageTemplate['category'],
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleCreate = async () => {
    if (!formData.name || !formData.content) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsSaving(true);
    try {
      const response = await fetch("/api/whatsapp/templates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to create template");
      }

      toast.success("Template created!");
      setIsCreating(false);
      setFormData({ name: "", content: "", category: "general" });
      onRefresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to create template");
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdate = async () => {
    if (!editingId || !formData.name || !formData.content) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsSaving(true);
    try {
      const response = await fetch("/api/whatsapp/templates", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: editingId, ...formData }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to update template");
      }

      toast.success("Template updated!");
      setEditingId(null);
      setFormData({ name: "", content: "", category: "general" });
      onRefresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update template");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this template?")) return;

    try {
      const response = await fetch(`/api/whatsapp/templates?id=${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to delete template");
      }

      toast.success("Template deleted!");
      onRefresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to delete template");
    }
  };

  const handleToggleActive = async (template: MessageTemplate) => {
    try {
      const response = await fetch("/api/whatsapp/templates", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: template.id, is_active: !template.is_active }),
      });

      if (!response.ok) {
        throw new Error("Failed to update template");
      }

      toast.success(template.is_active ? "Template disabled" : "Template enabled");
      onRefresh();
    } catch (error) {
      toast.error("Failed to update template");
    }
  };

  const startEditing = (template: MessageTemplate) => {
    setEditingId(template.id);
    setFormData({
      name: template.name,
      content: template.content,
      category: template.category,
    });
    setIsCreating(false);
  };

  const copyToClipboard = (content: string) => {
    navigator.clipboard.writeText(content);
    toast.success("Copied to clipboard!");
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent size="xl">
        <DialogHeader>
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-violet-100 rounded-lg">
                <LayoutTemplate className="w-5 h-5 text-violet-600" />
              </div>
              <div>
                <DialogTitle>Message Templates</DialogTitle>
                <DialogDescription>
                  Create and manage reusable message templates
                </DialogDescription>
              </div>
            </div>
            {isAdmin && !isCreating && !editingId && (
              <Button
                onClick={() => {
                  setIsCreating(true);
                  setFormData({ name: "", content: "", category: "general" });
                }}
                size="sm"
                className="bg-violet-600 hover:bg-violet-700"
              >
                <Plus className="w-4 h-4 mr-1" />
                New Template
              </Button>
            )}
          </div>
        </DialogHeader>

        <DialogBody>
          {/* Create/Edit Form */}
          {(isCreating || editingId) && isAdmin && (
            <div className="bg-slate-50 rounded-xl p-4 mb-4 space-y-4">
              <h4 className="font-medium text-slate-900">
                {isCreating ? "Create New Template" : "Edit Template"}
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Template Name</Label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., Weekly Reminder"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Category</Label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as MessageTemplate['category'] })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
                  >
                    {Object.entries(CATEGORY_CONFIG).map(([key, config]) => (
                      <option key={key} value={key}>{config.label}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Message Content</Label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  rows={4}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-violet-500 text-slate-900"
                  placeholder="Enter your message template..."
                />
                <p className="text-xs text-slate-500">
                  Tip: Use variables like {"{{name}}"} or {"{{date}}"} for dynamic content
                </p>
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsCreating(false);
                    setEditingId(null);
                    setFormData({ name: "", content: "", category: "general" });
                  }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={editingId ? handleUpdate : handleCreate}
                  disabled={isSaving}
                  className="bg-violet-600 hover:bg-violet-700"
                >
                  {isSaving ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  ) : (
                    <Save className="w-4 h-4 mr-2" />
                  )}
                  {editingId ? "Update" : "Create"}
                </Button>
              </div>
            </div>
          )}

          {/* Templates List */}
          {templates.length === 0 ? (
            <div className="bg-slate-50 rounded-xl p-8 text-center">
              <LayoutTemplate className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500 mb-2">No templates yet</p>
              {isAdmin && (
                <Button
                  onClick={() => setIsCreating(true)}
                  size="sm"
                  variant="outline"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Create your first template
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-3 max-h-[400px] overflow-y-auto">
              {templates.map((template) => {
                const config = CATEGORY_CONFIG[template.category] || CATEGORY_CONFIG.general;
                return (
                  <div
                    key={template.id}
                    className={`border rounded-xl p-4 transition-all ${
                      template.is_active
                        ? "border-slate-200 bg-white"
                        : "border-slate-100 bg-slate-50 opacity-60"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-medium text-slate-900">{template.name}</h4>
                          <span className={`px-2 py-0.5 rounded-full text-xs ${config.color}`}>
                            {config.label}
                          </span>
                          {!template.is_active && (
                            <span className="px-2 py-0.5 rounded-full text-xs bg-slate-200 text-slate-600">
                              Disabled
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-slate-600 whitespace-pre-wrap line-clamp-3">
                          {template.content}
                        </p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-slate-400">
                          <span>Used {template.use_count} times</span>
                          <span>Created {new Date(template.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => copyToClipboard(template.content)}
                          className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                          title="Copy content"
                        >
                          <Copy className="w-4 h-4 text-slate-400" />
                        </button>
                        {isAdmin && (
                          <>
                            <button
                              onClick={() => startEditing(template)}
                              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                              title="Edit"
                            >
                              <Edit className="w-4 h-4 text-slate-400" />
                            </button>
                            <button
                              onClick={() => handleToggleActive(template)}
                              className={`p-2 rounded-lg transition-colors ${
                                template.is_active
                                  ? "hover:bg-amber-50"
                                  : "hover:bg-green-50"
                              }`}
                              title={template.is_active ? "Disable" : "Enable"}
                            >
                              {template.is_active ? (
                                <XCircle className="w-4 h-4 text-amber-500" />
                              ) : (
                                <CheckCircle className="w-4 h-4 text-green-500" />
                              )}
                            </button>
                            <button
                              onClick={() => handleDelete(template.id)}
                              className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4 text-red-400" />
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
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
// SETTINGS MODAL
// ============================================

function SettingsModal({
  onClose,
  commands,
  onSave,
}: {
  onClose: () => void;
  commands: BotCommand[];
  onSave: (commands: BotCommand[]) => void;
}) {
  const [localCommands, setLocalCommands] = useState(commands);
  const [isSaving, setIsSaving] = useState(false);
  const [welcomeMessage, setWelcomeMessage] = useState(
    "👋 Welcome to Lovdash! How can I help you today?"
  );

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    onSave(localCommands);
    toast.success("Settings saved!");
    onClose();
    setIsSaving(false);
  };

  const toggleCommand = (index: number) => {
    const updated = [...localCommands];
    updated[index].enabled = !updated[index].enabled;
    setLocalCommands(updated);
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent size="md">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-slate-100 rounded-lg">
              <Settings className="w-5 h-5 text-slate-600" />
            </div>
            <div>
              <DialogTitle>Bot Settings</DialogTitle>
              <DialogDescription>Configure bot behavior</DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <DialogBody>
          <div className="space-y-6">
            <div className="space-y-2">
              <Label>Welcome Message</Label>
              <textarea
                value={welcomeMessage}
                onChange={(e) => setWelcomeMessage(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-brand-500 text-slate-900"
                placeholder="Message sent to new users..."
              />
            </div>

            <div className="space-y-3">
              <Label>Bot Commands</Label>
              {localCommands.map((cmd, index) => (
                <div
                  key={cmd.command}
                  className="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
                >
                  <div>
                    <p className="font-mono text-sm text-slate-900">{cmd.command}</p>
                    <p className="text-xs text-slate-500">{cmd.description}</p>
                  </div>
                  <button
                    onClick={() => toggleCommand(index)}
                    className={`relative w-12 h-6 rounded-full transition-colors ${
                      cmd.enabled ? "bg-green-500" : "bg-slate-300"
                    }`}
                  >
                    <span
                      className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                        cmd.enabled ? "left-7" : "left-1"
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
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
            {isSaving ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : (
              <CheckCircle className="w-4 h-4 mr-2" />
            )}
            Save Settings
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ============================================
// OFFLINE BANNER
// ============================================

function OfflineBanner({ message }: { message: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6"
    >
      <div className="flex items-center gap-3">
        <div className="p-2 bg-amber-100 rounded-lg">
          <WifiOff className="w-5 h-5 text-amber-600" />
        </div>
        <div>
          <h3 className="font-semibold text-amber-800">Limited Functionality</h3>
          <p className="text-sm text-amber-600">{message}</p>
        </div>
      </div>
      <div className="mt-3 text-xs text-amber-500">
        Some features like sending messages, creating groups, and viewing real-time data are unavailable. 
        Database information is still accessible.
      </div>
    </motion.div>
  );
}

// ============================================
// MAIN PAGE
// ============================================

export default function WhatsAppBotPage() {
  const { user } = useDashboard();
  const [isLoading, setIsLoading] = useState(true);
  const [botStatus, setBotStatus] = useState<BotStatus | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isMaintenanceMode, setIsMaintenanceMode] = useState(false);
  const [queueStats, setQueueStats] = useState<any>(null);
  const [commands, setCommands] = useState<BotCommand[]>([
    { command: "/stats", description: "Show model statistics", enabled: true },
    { command: "/bio", description: "Get bio link", enabled: true },
    { command: "/cereri", description: "View pending requests", enabled: true },
    { command: "/models", description: "List all models", enabled: true },
    { command: "/help", description: "Show help menu", enabled: true },
  ]);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showGroupsModal, setShowGroupsModal] = useState(false);
  const [showAnalyticsModal, setShowAnalyticsModal] = useState(false);
  const [showSendMessageModal, setShowSendMessageModal] = useState(false);
  const [showTemplatesModal, setShowTemplatesModal] = useState(false);
  const [isReloadingCreators, setIsReloadingCreators] = useState(false);
  
  // Groups and templates from database
  const [dbGroups, setDbGroups] = useState<WhatsAppGroup[]>([]);
  const [templates, setTemplates] = useState<MessageTemplate[]>([]);
  const [isLoadingDbData, setIsLoadingDbData] = useState(false);

  // Track if connection toast has been shown to prevent duplicates
  const connectionNotifiedRef = useRef(false);

  // Fetch groups from database/bot
  const fetchDbGroups = useCallback(async () => {
    try {
      const response = await fetch("/api/whatsapp/groups");
      if (response.ok) {
        const data = await response.json();
        // Transform the response to match our WhatsAppGroup type
        const groups: WhatsAppGroup[] = (data.groups || []).map((g: any) => ({
          id: g.id || g.whatsapp_id,
          whatsapp_id: g.whatsapp_id || g.id,
          name: g.name || 'Unnamed Group',
          type: g.type || 'creator',
          participant_count: g.participant_count || g.participants || g.participantCount || 0,
        }));
        setDbGroups(groups);
      }
    } catch (error) {
      console.error("Failed to fetch groups:", error);
    }
  }, []);

  // Fetch templates
  const fetchTemplates = useCallback(async () => {
    try {
      const response = await fetch("/api/whatsapp/templates");
      if (response.ok) {
        const data = await response.json();
        setTemplates(data.templates || []);
      }
    } catch (error) {
      console.error("Failed to fetch templates:", error);
    }
  }, []);

  // Load DB data on mount
  useEffect(() => {
    const loadDbData = async () => {
      setIsLoadingDbData(true);
      await Promise.all([fetchDbGroups(), fetchTemplates()]);
      setIsLoadingDbData(false);
    };
    loadDbData();
  }, [fetchDbGroups, fetchTemplates]);

  // Fetch bot status
  const fetchStatus = useCallback(async () => {
    try {
      const response = await fetch(`${BOT_API_URL}/status`, {
        cache: "no-store",
      });
      
      if (response.ok) {
        const data = await response.json();
        setQueueStats(data);
        setBotStatus({
          connected: data.whatsapp?.connected || false,
          rabbitmq: data.rabbitmq || null,
        });
        setIsConnected(data.whatsapp?.connected || false);
        setIsMaintenanceMode(data.maintenanceMode || false);
        setIsLoading(false);
        return;
      }
    } catch (err) {
      try {
        const healthResponse = await fetch(`${BOT_API_URL}/health`, {
          cache: "no-store",
        });
        if (healthResponse.ok) {
          const healthData = await healthResponse.json();
          setBotStatus({
            connected: healthData.whatsapp?.connected || false,
            rabbitmq: healthData.rabbitmq || null,
          });
          setIsConnected(healthData.whatsapp?.connected || false);
          setIsLoading(false);
          return;
        }
      } catch {
        // Both endpoints failed
      }
    }
    setBotStatus(null);
    setIsConnected(false);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchStatus();
    const statusInterval = setInterval(fetchStatus, 10000);
    return () => clearInterval(statusInterval);
  }, [fetchStatus]);

  const handleReloadCreators = async () => {
    setIsReloadingCreators(true);
    try {
      const response = await fetch(`${BOT_API_URL}/refresh-config`, { method: "POST" });
      if (response.ok) {
        toast.success("Creators reloaded successfully!");
      } else {
        throw new Error("Failed to reload");
      }
    } catch {
      toast.error("Failed to reload creators");
    } finally {
      setIsReloadingCreators(false);
    }
  };

  if (user?.role !== "admin") {
    return (
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 flex items-center gap-3">
        <AlertCircle className="w-5 h-5 text-amber-500" />
        <p className="text-amber-700">
          Only administrators can manage the WhatsApp bot.
        </p>
      </div>
    );
  }

  // Determine offline message
  const offlineMessage = !botStatus 
    ? "WhatsApp bot is offline. The server may be down or unreachable."
    : isMaintenanceMode 
      ? "WhatsApp bot is in maintenance mode. Message processing is paused."
      : !isConnected 
        ? "WhatsApp is not connected. Please scan the QR code to authenticate."
        : null;

  return (
    <div className="space-y-6">
      {/* Offline Banner */}
      {offlineMessage && <OfflineBanner message={offlineMessage} />}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <div
            className={`p-3 rounded-xl ${
              isConnected
                ? "bg-green-100"
                : botStatus
                ? "bg-yellow-100"
                : "bg-slate-100"
            }`}
          >
            <MessageCircle
              className={`w-6 h-6 ${
                isConnected
                  ? "text-green-600"
                  : botStatus
                  ? "text-yellow-600"
                  : "text-slate-400"
              }`}
            />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">WhatsApp Bot</h1>
            <div className="flex items-center gap-2 mt-1">
              <span
                className={`w-2 h-2 rounded-full ${
                  isConnected ? "bg-green-500" : botStatus ? "bg-yellow-500" : "bg-slate-400"
                }`}
              />
              <p className="text-slate-500">
                {isConnected
                  ? "Connected and ready"
                  : botStatus
                  ? "Bot running, waiting for authentication"
                  : "Bot offline"}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            onClick={() => setShowSendMessageModal(true)}
            disabled={!isConnected}
            className="bg-green-600 hover:bg-green-700"
          >
            <Send className="w-4 h-4 mr-2" />
            Send Message
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setIsLoading(true);
              fetchStatus();
            }}
            disabled={isLoading}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowSettingsModal(true)}
          >
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatusCard
          title="Bot Status"
          value={isConnected ? "Connected" : botStatus ? "Running" : "Offline"}
          icon={isConnected ? Wifi : botStatus ? Activity : WifiOff}
          color={
            isConnected
              ? "bg-green-500 text-white"
              : botStatus
              ? "bg-yellow-500 text-white"
              : "bg-slate-200 text-slate-700"
          }
          pulse={!!botStatus && !isConnected}
        />
        <StatusCard
          title="RabbitMQ"
          value={botStatus?.rabbitmq?.connected ? "Connected" : "Offline"}
          icon={Activity}
          color={botStatus?.rabbitmq?.connected ? "bg-blue-500 text-white" : "bg-slate-200 text-slate-700"}
        />
        <StatusCard
          title="Pending Duplicates"
          value={botStatus?.rabbitmq?.duplicateCheck?.waiting ?? 0}
          icon={Clock}
          color="bg-purple-500 text-white"
        />
        <StatusCard
          title="Pending Analysis"
          value={botStatus?.rabbitmq?.analyze?.waiting ?? 0}
          icon={Zap}
          color="bg-amber-500 text-white"
        />
      </div>

      {/* Main Content */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* QR Code Section */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-slate-900">
                {isConnected ? "Connection Status" : "WhatsApp Authentication"}
              </h2>
              {!isConnected && (
                <span className="flex items-center gap-1 text-sm text-amber-600">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Auto-refreshing
                </span>
              )}
            </div>

            <QRCodeDisplay
              apiUrl={BOT_API_URL}
              connectionNotifiedRef={connectionNotifiedRef}
              onConnected={() => {
                setIsConnected(true);
                toast.success("WhatsApp connected successfully!");
              }}
            />
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-4">
          {/* Bot Commands */}
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <h3 className="font-semibold text-slate-900 mb-3">Bot Commands</h3>
            <div className="space-y-2">
              {commands.map((cmd) => (
                <div
                  key={cmd.command}
                  className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0"
                >
                  <div>
                    <p className="font-mono text-sm text-slate-900">{cmd.command}</p>
                    <p className="text-xs text-slate-500">{cmd.description}</p>
                  </div>
                  <span
                    className={`w-2 h-2 rounded-full ${
                      cmd.enabled ? "bg-green-500" : "bg-slate-300"
                    }`}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <h3 className="font-semibold text-slate-900 mb-3">Quick Actions</h3>
            <div className="space-y-2">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => setShowSendMessageModal(true)}
                disabled={!isConnected}
              >
                <Send className="w-4 h-4 mr-2" />
                Send Message
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => setShowTemplatesModal(true)}
              >
                <LayoutTemplate className="w-4 h-4 mr-2" />
                Message Templates
                {templates.length > 0 && (
                  <span className="ml-auto text-xs bg-violet-100 text-violet-700 px-2 py-0.5 rounded-full">
                    {templates.length}
                  </span>
                )}
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={handleReloadCreators}
                disabled={isReloadingCreators}
              >
                {isReloadingCreators ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <RefreshCw className="w-4 h-4 mr-2" />
                )}
                Reload Creators
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => setShowGroupsModal(true)}
              >
                <Users className="w-4 h-4 mr-2" />
                View Groups
                {dbGroups.length > 0 && (
                  <span className="ml-auto text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                    {dbGroups.length}
                  </span>
                )}
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => setShowAnalyticsModal(true)}
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                View Analytics
              </Button>
            </div>
          </div>

          {/* Bot Info */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200 p-4">
            <div className="flex items-center gap-3 mb-3">
              <Bot className="w-5 h-5 text-green-600" />
              <h3 className="font-semibold text-green-800">About the Bot</h3>
            </div>
            <p className="text-sm text-green-700">
              The WhatsApp bot automatically processes media uploads from creators, 
              tracks statistics, and manages custom requests.
            </p>
            <div className="mt-3 pt-3 border-t border-green-200">
              <p className="text-xs text-green-600">
                API: <code className="bg-green-100 px-1 rounded">{BOT_API_URL}</code>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showSettingsModal && (
        <SettingsModal
          onClose={() => setShowSettingsModal(false)}
          commands={commands}
          onSave={setCommands}
        />
      )}

      {showGroupsModal && (
        <GroupsModal
          onClose={() => setShowGroupsModal(false)}
          apiUrl={BOT_API_URL}
        />
      )}

      {showAnalyticsModal && (
        <AnalyticsModal
          onClose={() => setShowAnalyticsModal(false)}
          queueStats={queueStats}
        />
      )}

      {showSendMessageModal && (
        <SendMessageModal
          onClose={() => setShowSendMessageModal(false)}
          groups={dbGroups}
          templates={templates.filter(t => t.is_active)}
          onRefreshGroups={fetchDbGroups}
        />
      )}

      {showTemplatesModal && (
        <TemplatesModal
          onClose={() => setShowTemplatesModal(false)}
          templates={templates}
          onRefresh={fetchTemplates}
          isAdmin={user?.role === 'admin'}
        />
      )}
    </div>
  );
}
