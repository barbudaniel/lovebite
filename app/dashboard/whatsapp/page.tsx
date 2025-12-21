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
} from "lucide-react";

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

// WhatsApp Bot API URL (port 3001)
const BOT_API_URL = process.env.NEXT_PUBLIC_BOT_API_URL || "http://143.110.128.83:3001";

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
}: {
  apiUrl: string;
  onConnected: () => void;
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
      
      // If connected, notify parent
      if (data.connected) {
        onConnected();
      }
      
      // Reset countdown
      if (data.success && data.qrCode) {
        setCountdown(20); // QR codes refresh every 20 seconds
      }
    } catch (err) {
      setError("Cannot connect to WhatsApp bot API");
      setQrData(null);
    } finally {
      setIsLoading(false);
    }
  }, [apiUrl, onConnected]);

  useEffect(() => {
    // Initial fetch
    fetchQRCode();

    // Refresh every 5 seconds to check for new QR or connection status
    refreshIntervalRef.current = setInterval(fetchQRCode, 5000);

    // Countdown timer
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
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-green-100 rounded-lg">
            <QrCode className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-900">Scan to Connect</h3>
            <p className="text-sm text-slate-500">Use WhatsApp on your phone</p>
          </div>
        </div>

        {/* QR Code Image */}
        <div className="relative">
          <div className="w-72 h-72 bg-white rounded-xl border-4 border-green-500 p-2 shadow-lg">
            <img
              src={qrData.qrCode}
              alt="WhatsApp QR Code"
              className="w-full h-full"
            />
          </div>
          
          {/* Scanning animation overlay */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-xl">
            <motion.div
              className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-green-400 to-transparent"
              animate={{ top: ["0%", "100%", "0%"] }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            />
          </div>
        </div>

        {/* Timer and refresh info */}
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

        {/* Instructions */}
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

  // No QR available, show state-aware waiting message
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
      {qrData?.state && (
        <div className="mt-4 px-3 py-1.5 bg-amber-100 rounded-full">
          <span className="text-xs font-medium text-amber-700">
            State: {qrData.state}
          </span>
        </div>
      )}
    </div>
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
    "👋 Welcome to Lovebite! How can I help you today?"
  );

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate save
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
        <div className="p-6 border-b border-slate-200 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-slate-100 rounded-lg">
              <Settings className="w-5 h-5 text-slate-600" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900">Bot Settings</h3>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Welcome Message */}
          <div className="space-y-2">
            <Label>Welcome Message</Label>
            <textarea
              value={welcomeMessage}
              onChange={(e) => setWelcomeMessage(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-brand-500"
              placeholder="Message sent to new users..."
            />
          </div>

          {/* Commands */}
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
              <CheckCircle className="w-4 h-4 mr-2" />
            )}
            Save Settings
          </Button>
        </div>
      </motion.div>
    </>
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
  const [queueStats, setQueueStats] = useState<any>(null);
  const [commands, setCommands] = useState<BotCommand[]>([
    { command: "/stats", description: "Show model statistics", enabled: true },
    { command: "/bio", description: "Get bio link", enabled: true },
    { command: "/cereri", description: "View pending requests", enabled: true },
    { command: "/models", description: "List all models", enabled: true },
    { command: "/help", description: "Show help menu", enabled: true },
  ]);
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  // Fetch bot status using the new /status endpoint
  const fetchStatus = useCallback(async () => {
    try {
      // Use the new comprehensive status endpoint
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
        setIsLoading(false);
        return;
      }
    } catch (err) {
      // Try fallback to health endpoint
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
    // Bot not reachable
    setBotStatus(null);
    setIsConnected(false);
    setIsLoading(false);
  }, []);

  // Check if connected (simplified - status endpoint already gives us this)
  const checkConnection = useCallback(async () => {
    // Just call fetchStatus which now includes connection info
    await fetchStatus();
  }, [fetchStatus]);

  useEffect(() => {
    fetchStatus();
    checkConnection();

    // Poll status every 10 seconds
    const statusInterval = setInterval(() => {
      fetchStatus();
      checkConnection();
    }, 10000);

    return () => clearInterval(statusInterval);
  }, [fetchStatus, checkConnection]);

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

  return (
    <div className="space-y-6">
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
            variant="outline"
            size="sm"
            onClick={() => {
              setIsLoading(true);
              fetchStatus();
              checkConnection();
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
          pulse={botStatus && !isConnected}
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
                onClick={() => {
                  fetch(`${BOT_API_URL}/refresh-config`, { method: "POST" })
                    .then(() => toast.success("Configuration reloaded!"))
                    .catch(() => toast.error("Failed to reload config"));
                }}
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Reload Creators
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Users className="w-4 h-4 mr-2" />
                View Groups
              </Button>
              <Button variant="outline" className="w-full justify-start">
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

      {/* Settings Modal */}
      <AnimatePresence>
        {showSettingsModal && (
          <SettingsModal
            onClose={() => setShowSettingsModal(false)}
            commands={commands}
            onSave={setCommands}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
