"use client";

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { useDashboard } from "../layout";
import { getSupabaseBrowserClient } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  User,
  Mail,
  Phone,
  Shield,
  Save,
  Loader2,
  AlertCircle,
  Key,
  Bell,
  Eye,
  Moon,
  LogOut,
  Trash2,
  Lock,
  CheckCircle,
} from "lucide-react";

// ============================================
// SECTION COMPONENT
// ============================================

function SettingsSection({
  title,
  description,
  icon: Icon,
  children,
}: {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl border border-slate-200 overflow-hidden"
    >
      <div className="p-6 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center">
            <Icon className="w-5 h-5 text-slate-600" />
          </div>
          <div>
            <h2 className="font-semibold text-slate-900">{title}</h2>
            <p className="text-sm text-slate-500">{description}</p>
          </div>
        </div>
      </div>
      <div className="p-6">{children}</div>
    </motion.div>
  );
}

// ============================================
// MAIN PAGE
// ============================================

export default function SettingsPage() {
  const { user, refreshUser } = useDashboard();
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Profile form
  const [displayName, setDisplayName] = useState(user?.display_name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState(user?.phone || "");

  // Password form
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    if (user) {
      setDisplayName(user.display_name || "");
      setEmail(user.email || "");
      setPhone(user.phone || "");
    }
  }, [user]);

  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      const supabase = getSupabaseBrowserClient();
      const { error } = await supabase
        .from("dashboard_users")
        .update({
          display_name: displayName || null,
          phone: phone || null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user?.id);

      if (error) throw error;

      toast.success("Profile updated successfully");
      refreshUser();
    } catch (err) {
      console.error("Error saving profile:", err);
      toast.error("Failed to save profile");
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (!newPassword) {
      toast.error("Please enter a new password");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    setIsSaving(true);
    try {
      const supabase = getSupabaseBrowserClient();
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) throw error;

      toast.success("Password updated successfully");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      console.error("Error changing password:", err);
      toast.error("Failed to change password");
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = async () => {
    const supabase = getSupabaseBrowserClient();
    await supabase.auth.signOut();
    window.location.href = "/dashboard/login";
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-brand-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
        <p className="text-slate-500">Manage your account preferences</p>
      </div>

      {/* Profile Section */}
      <SettingsSection
        title="Profile"
        description="Your personal information"
        icon={User}
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="displayName">Display Name</Label>
            <Input
              id="displayName"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Your name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              disabled
              className="bg-slate-50"
            />
            <p className="text-xs text-slate-500">
              Email cannot be changed. Contact support if needed.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+40 712 345 678"
            />
          </div>

          <Button
            onClick={handleSaveProfile}
            disabled={isSaving}
            className="bg-brand-600 hover:bg-brand-700"
          >
            {isSaving ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            Save Changes
          </Button>
        </div>
      </SettingsSection>

      {/* Account Info */}
      <SettingsSection
        title="Account"
        description="Your account details and role"
        icon={Shield}
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
            <div>
              <p className="font-medium text-slate-900">Account Role</p>
              <p className="text-sm text-slate-500 capitalize">{user.role}</p>
            </div>
            <div
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                user.role === "admin"
                  ? "bg-red-100 text-red-700"
                  : user.role === "studio"
                  ? "bg-blue-100 text-blue-700"
                  : "bg-purple-100 text-purple-700"
              }`}
            >
              {user.role}
            </div>
          </div>

          {user.creator?.username && (
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
              <div>
                <p className="font-medium text-slate-900">Linked Creator</p>
                <p className="text-sm text-slate-500">@{user.creator.username}</p>
              </div>
              <CheckCircle className="w-5 h-5 text-green-500" />
            </div>
          )}

          {user.studio?.name && (
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
              <div>
                <p className="font-medium text-slate-900">Studio</p>
                <p className="text-sm text-slate-500">{user.studio.name}</p>
              </div>
              <CheckCircle className="w-5 h-5 text-green-500" />
            </div>
          )}

          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
            <div>
              <p className="font-medium text-slate-900">Account Status</p>
              <p className="text-sm text-slate-500">
                {user.enabled ? "Active" : "Disabled"}
              </p>
            </div>
            {user.enabled ? (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
                <CheckCircle className="w-3 h-3" />
                Active
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700">
                Disabled
              </span>
            )}
          </div>

          <div className="text-sm text-slate-500">
            <p>Account created: {new Date(user.created_at).toLocaleDateString()}</p>
            {user.last_login_at && (
              <p>
                Last login: {new Date(user.last_login_at).toLocaleDateString()}
              </p>
            )}
          </div>
        </div>
      </SettingsSection>

      {/* Password Section */}
      <SettingsSection
        title="Password"
        description="Change your account password"
        icon={Lock}
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="newPassword">New Password</Label>
            <Input
              id="newPassword"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm New Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>

          <Button
            onClick={handleChangePassword}
            disabled={isSaving || !newPassword}
            variant="outline"
          >
            {isSaving ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : (
              <Key className="w-4 h-4 mr-2" />
            )}
            Change Password
          </Button>
        </div>
      </SettingsSection>

      {/* Notifications Section */}
      <SettingsSection
        title="Notifications"
        description="Manage notification preferences"
        icon={Bell}
      >
        <div className="space-y-4">
          <label className="flex items-center justify-between cursor-pointer">
            <div>
              <p className="font-medium text-slate-900">Email Notifications</p>
              <p className="text-sm text-slate-500">
                Receive updates via email
              </p>
            </div>
            <div className="w-10 h-6 rounded-full bg-green-500 relative">
              <div className="absolute top-1 left-5 w-4 h-4 bg-white rounded-full shadow" />
            </div>
          </label>

          <label className="flex items-center justify-between cursor-pointer">
            <div>
              <p className="font-medium text-slate-900">WhatsApp Notifications</p>
              <p className="text-sm text-slate-500">
                Receive updates via WhatsApp
              </p>
            </div>
            <div className="w-10 h-6 rounded-full bg-green-500 relative">
              <div className="absolute top-1 left-5 w-4 h-4 bg-white rounded-full shadow" />
            </div>
          </label>
        </div>
      </SettingsSection>

      {/* Danger Zone */}
      <SettingsSection
        title="Session"
        description="Sign out of your account"
        icon={LogOut}
      >
        <div className="space-y-4">
          <Button
            variant="outline"
            onClick={handleLogout}
            className="w-full border-red-200 text-red-600 hover:bg-red-50"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </SettingsSection>
    </div>
  );
}

