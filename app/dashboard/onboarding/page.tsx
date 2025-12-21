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
  Mail,
  Send,
  Copy,
  Check,
  X,
  Loader2,
  AlertCircle,
  Clock,
  CheckCircle,
  XCircle,
  FileText,
  RefreshCw,
  ExternalLink,
  ChevronRight,
  UserPlus,
  Building2,
  User,
  Shield,
  Download,
  Link as LinkIcon,
  Image as ImageIcon,
} from "lucide-react";

// ============================================
// TYPES
// ============================================

type OnboardingStatus =
  | "pending"
  | "email_sent"
  | "in_progress"
  | "submitted"
  | "under_review"
  | "approved"
  | "rejected"
  | "resubmit_requested";

interface Onboarding {
  id: string;
  email: string;
  full_name: string | null;
  stage_name: string | null;
  phone: string | null;
  date_of_birth: string | null;
  address: string | null;
  city: string | null;
  postal_code: string | null;
  country: string | null;
  id_type: string | null;
  id_number: string | null;
  id_front_path: string | null;
  id_back_path: string | null;
  selfie_with_id_path: string | null;
  signature_path: string | null;
  contract_pdf_path: string | null;
  signed_contract_path: string | null;
  categories: string[] | null;
  platforms: string[] | null;
  languages: string[] | null;
  experience: string | null;
  availability: string | null;
  instagram: string | null;
  tiktok: string | null;
  twitter: string | null;
  current_earnings: string | null;
  goals: string | null;
  additional_notes: string | null;
  agreed_to_terms: boolean;
  status: OnboardingStatus;
  linked_creator_id: string | null;
  dashboard_user_id: string | null;
  contract_signed_at: string | null;
  submitted_at: string | null;
  reviewed_at: string | null;
  reviewed_by: string | null;
  rejection_reasons: string | null;
  created_at: string;
  updated_at: string;
}

const statusConfig: Record<
  OnboardingStatus,
  { label: string; color: string; icon: React.ComponentType<{ className?: string }> }
> = {
  pending: { label: "Pending", color: "bg-slate-100 text-slate-700", icon: Clock },
  email_sent: { label: "Email Sent", color: "bg-blue-100 text-blue-700", icon: Mail },
  in_progress: { label: "In Progress", color: "bg-yellow-100 text-yellow-700", icon: Clock },
  submitted: { label: "Submitted", color: "bg-purple-100 text-purple-700", icon: FileText },
  under_review: { label: "Under Review", color: "bg-orange-100 text-orange-700", icon: Eye },
  approved: { label: "Approved", color: "bg-green-100 text-green-700", icon: CheckCircle },
  rejected: { label: "Rejected", color: "bg-red-100 text-red-700", icon: XCircle },
  resubmit_requested: { label: "Resubmit", color: "bg-amber-100 text-amber-700", icon: RefreshCw },
};

// Storage base URL for your old Supabase project
const OLD_STORAGE_URL = "https://rsdfmvfpopwilizrywfx.supabase.co/storage/v1/object/public/onboarding";

// ============================================
// ONBOARDING CARD
// ============================================

function OnboardingCard({
  onboarding,
  onView,
  onApprove,
  onReject,
  onResendEmail,
  onCopyLink,
}: {
  onboarding: Onboarding;
  onView: () => void;
  onApprove: () => void;
  onReject: () => void;
  onResendEmail: () => void;
  onCopyLink: () => void;
}) {
  const config = statusConfig[onboarding.status] || statusConfig.pending;
  const StatusIcon = config.icon;
  const canApprove = ["submitted", "under_review"].includes(onboarding.status);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl border border-slate-200 p-4 hover:shadow-md transition-all"
    >
      <div className="flex items-center gap-4">
        {/* Avatar */}
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-brand-100 to-brand-200 flex items-center justify-center shrink-0">
          <span className="text-lg font-bold text-brand-600">
            {(onboarding.full_name || onboarding.email).charAt(0).toUpperCase()}
          </span>
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <p className="font-medium text-slate-900 truncate">
            {onboarding.full_name || "Unnamed"}
          </p>
          <p className="text-sm text-slate-500 truncate">{onboarding.email}</p>
        </div>

        {/* Status */}
        <span
          className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${config.color}`}
        >
          <StatusIcon className="w-3 h-3" />
          {config.label}
        </span>

        {/* Actions */}
        <div className="flex items-center gap-1">
          {canApprove && (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={onApprove}
                className="text-green-600 hover:text-green-700 hover:bg-green-50"
              >
                <CheckCircle className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onReject}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <XCircle className="w-4 h-4" />
              </Button>
            </>
          )}
          {["pending", "email_sent"].includes(onboarding.status) && (
            <Button variant="ghost" size="sm" onClick={onResendEmail}>
              <Send className="w-4 h-4" />
            </Button>
          )}
          <Button variant="ghost" size="sm" onClick={onCopyLink}>
            <Copy className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={onView}>
            <Eye className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Details Row */}
      <div className="flex flex-wrap items-center gap-4 mt-3 pt-3 border-t border-slate-100 text-sm text-slate-500">
        {onboarding.stage_name && (
          <span className="text-brand-600 font-medium">@{onboarding.stage_name}</span>
        )}
        <span>Created: {format(new Date(onboarding.created_at), "MMM d, yyyy")}</span>
        {onboarding.contract_signed_at && (
          <span className="text-green-600 flex items-center gap-1">
            <CheckCircle className="w-3 h-3" />
            Contract Signed
          </span>
        )}
        {onboarding.linked_creator_id && (
          <span className="text-green-600 flex items-center gap-1">
            <CheckCircle className="w-3 h-3" />
            Linked
          </span>
        )}
        {onboarding.dashboard_user_id && (
          <span className="text-blue-600 flex items-center gap-1">
            <Shield className="w-3 h-3" />
            Has Dashboard Access
          </span>
        )}
      </div>
    </motion.div>
  );
}

// ============================================
// ONBOARDING DETAIL MODAL
// ============================================

function OnboardingDetailModal({
  onboarding,
  onClose,
  onApprove,
  onReject,
}: {
  onboarding: Onboarding;
  onClose: () => void;
  onApprove: () => void;
  onReject: () => void;
}) {
  const config = statusConfig[onboarding.status] || statusConfig.pending;
  const StatusIcon = config.icon;
  const canApprove = ["submitted", "under_review"].includes(onboarding.status);

  const getDocumentUrl = (path: string | null) => {
    if (!path) return null;
    return `${OLD_STORAGE_URL}/${path}`;
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
        className="fixed inset-4 sm:inset-auto sm:left-1/2 sm:top-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:max-w-3xl sm:w-full sm:max-h-[90vh] bg-white rounded-2xl shadow-xl z-50 overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-200 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-brand-100 to-brand-200 flex items-center justify-center">
              <span className="text-lg font-bold text-brand-600">
                {(onboarding.full_name || onboarding.email).charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-900">
                {onboarding.full_name || "Unnamed Creator"}
              </h3>
              <p className="text-sm text-slate-500">{onboarding.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${config.color}`}
            >
              <StatusIcon className="w-3 h-3" />
              {config.label}
            </span>
            <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Personal Info */}
          <div>
            <h4 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
              <User className="w-4 h-4" />
              Personal Information
            </h4>
            <div className="grid grid-cols-2 gap-4 bg-slate-50 rounded-xl p-4">
              <div>
                <p className="text-xs text-slate-500">Stage Name</p>
                <p className="font-medium text-slate-900">{onboarding.stage_name || "-"}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Date of Birth</p>
                <p className="font-medium text-slate-900">
                  {onboarding.date_of_birth
                    ? format(new Date(onboarding.date_of_birth), "MMM d, yyyy")
                    : "-"}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Phone</p>
                <p className="font-medium text-slate-900">{onboarding.phone || "-"}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Country</p>
                <p className="font-medium text-slate-900">{onboarding.country || "-"}</p>
              </div>
              <div className="col-span-2">
                <p className="text-xs text-slate-500">Address</p>
                <p className="font-medium text-slate-900">
                  {[onboarding.address, onboarding.city, onboarding.postal_code]
                    .filter(Boolean)
                    .join(", ") || "-"}
                </p>
              </div>
            </div>
          </div>

          {/* ID Verification */}
          <div>
            <h4 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
              <FileText className="w-4 h-4" />
              ID Verification
            </h4>
            <div className="grid grid-cols-2 gap-4 bg-slate-50 rounded-xl p-4">
              <div>
                <p className="text-xs text-slate-500">ID Type</p>
                <p className="font-medium text-slate-900 capitalize">
                  {onboarding.id_type?.replace("_", " ") || "-"}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-500">ID Number</p>
                <p className="font-medium text-slate-900">{onboarding.id_number || "-"}</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3 mt-3">
              {onboarding.id_front_path && (
                <a
                  href={getDocumentUrl(onboarding.id_front_path)!}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center gap-2 p-4 bg-slate-100 rounded-xl hover:bg-slate-200 transition-colors"
                >
                  <ImageIcon className="w-8 h-8 text-slate-400" />
                  <span className="text-xs text-slate-600">ID Front</span>
                </a>
              )}
              {onboarding.id_back_path && (
                <a
                  href={getDocumentUrl(onboarding.id_back_path)!}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center gap-2 p-4 bg-slate-100 rounded-xl hover:bg-slate-200 transition-colors"
                >
                  <ImageIcon className="w-8 h-8 text-slate-400" />
                  <span className="text-xs text-slate-600">ID Back</span>
                </a>
              )}
              {onboarding.selfie_with_id_path && (
                <a
                  href={getDocumentUrl(onboarding.selfie_with_id_path)!}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center gap-2 p-4 bg-slate-100 rounded-xl hover:bg-slate-200 transition-colors"
                >
                  <ImageIcon className="w-8 h-8 text-slate-400" />
                  <span className="text-xs text-slate-600">Selfie with ID</span>
                </a>
              )}
            </div>
          </div>

          {/* Contract & Signature */}
          {(onboarding.signature_path || onboarding.contract_pdf_path) && (
            <div>
              <h4 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Contract & Signature
              </h4>
              <div className="flex gap-3">
                {onboarding.signature_path && (
                  <a
                    href={getDocumentUrl(onboarding.signature_path)!}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    <span className="text-sm">Signature</span>
                  </a>
                )}
                {onboarding.contract_pdf_path && (
                  <a
                    href={getDocumentUrl(onboarding.contract_pdf_path)!}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    <span className="text-sm">Contract PDF</span>
                  </a>
                )}
              </div>
              {onboarding.contract_signed_at && (
                <p className="text-sm text-green-600 mt-2 flex items-center gap-1">
                  <CheckCircle className="w-4 h-4" />
                  Signed on {format(new Date(onboarding.contract_signed_at), "MMM d, yyyy 'at' h:mm a")}
                </p>
              )}
            </div>
          )}

          {/* Creator Profile */}
          <div>
            <h4 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
              <User className="w-4 h-4" />
              Creator Profile
            </h4>
            <div className="grid grid-cols-2 gap-4 bg-slate-50 rounded-xl p-4">
              <div>
                <p className="text-xs text-slate-500">Experience</p>
                <p className="font-medium text-slate-900 capitalize">{onboarding.experience || "-"}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Availability</p>
                <p className="font-medium text-slate-900 capitalize">{onboarding.availability || "-"}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Current Earnings</p>
                <p className="font-medium text-slate-900">{onboarding.current_earnings || "-"}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Goals</p>
                <p className="font-medium text-slate-900">{onboarding.goals || "-"}</p>
              </div>
              <div className="col-span-2">
                <p className="text-xs text-slate-500">Categories</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {(onboarding.categories || []).map((cat) => (
                    <span
                      key={cat}
                      className="px-2 py-0.5 bg-brand-100 text-brand-700 rounded-full text-xs"
                    >
                      {cat}
                    </span>
                  ))}
                  {(!onboarding.categories || onboarding.categories.length === 0) && (
                    <span className="text-slate-400">-</span>
                  )}
                </div>
              </div>
              <div className="col-span-2">
                <p className="text-xs text-slate-500">Platforms</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {(onboarding.platforms || []).map((plat) => (
                    <span
                      key={plat}
                      className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full text-xs"
                    >
                      {plat}
                    </span>
                  ))}
                  {(!onboarding.platforms || onboarding.platforms.length === 0) && (
                    <span className="text-slate-400">-</span>
                  )}
                </div>
              </div>
              <div className="col-span-2">
                <p className="text-xs text-slate-500">Languages</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {(onboarding.languages || []).map((lang) => (
                    <span
                      key={lang}
                      className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs"
                    >
                      {lang}
                    </span>
                  ))}
                  {(!onboarding.languages || onboarding.languages.length === 0) && (
                    <span className="text-slate-400">-</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Social Media */}
          {(onboarding.instagram || onboarding.tiktok || onboarding.twitter) && (
            <div>
              <h4 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                <LinkIcon className="w-4 h-4" />
                Social Media
              </h4>
              <div className="flex flex-wrap gap-3">
                {onboarding.instagram && (
                  <a
                    href={`https://instagram.com/${onboarding.instagram.replace("@", "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg text-sm"
                  >
                    Instagram: {onboarding.instagram}
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
                {onboarding.tiktok && (
                  <a
                    href={`https://tiktok.com/@${onboarding.tiktok.replace("@", "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-3 py-2 bg-black text-white rounded-lg text-sm"
                  >
                    TikTok: {onboarding.tiktok}
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
                {onboarding.twitter && (
                  <a
                    href={`https://x.com/${onboarding.twitter.replace("@", "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-3 py-2 bg-slate-900 text-white rounded-lg text-sm"
                  >
                    X: {onboarding.twitter}
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>
          )}

          {/* Notes */}
          {onboarding.additional_notes && (
            <div>
              <h4 className="font-semibold text-slate-900 mb-3">Additional Notes</h4>
              <p className="text-slate-600 bg-slate-50 rounded-xl p-4 whitespace-pre-wrap">
                {onboarding.additional_notes}
              </p>
            </div>
          )}

          {/* Rejection Reasons */}
          {onboarding.rejection_reasons && onboarding.status === "rejected" && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4">
              <h4 className="font-semibold text-red-700 mb-2">Rejection Reasons</h4>
              <p className="text-red-600">{onboarding.rejection_reasons}</p>
            </div>
          )}
        </div>

        {/* Actions */}
        {canApprove && (
          <div className="p-6 border-t border-slate-200 flex gap-3 shrink-0">
            <Button
              variant="outline"
              onClick={onReject}
              className="flex-1 border-red-200 text-red-600 hover:bg-red-50"
            >
              <XCircle className="w-4 h-4 mr-2" />
              Reject
            </Button>
            <Button
              onClick={onApprove}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Approve & Create Access
            </Button>
          </div>
        )}
      </motion.div>
    </>
  );
}

// ============================================
// APPROVE MODAL
// ============================================

function ApproveModal({
  onboarding,
  onClose,
  onApproved,
}: {
  onboarding: Onboarding;
  onClose: () => void;
  onApproved: () => void;
}) {
  const [isApproving, setIsApproving] = useState(false);
  const [createDashboardAccess, setCreateDashboardAccess] = useState(true);
  const [sendWelcomeEmail, setSendWelcomeEmail] = useState(true);
  const [tempPassword, setTempPassword] = useState("");

  useEffect(() => {
    // Generate a random temporary password
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789";
    let pwd = "";
    for (let i = 0; i < 12; i++) {
      pwd += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setTempPassword(pwd);
  }, []);

  const handleApprove = async () => {
    setIsApproving(true);
    try {
      const supabase = getSupabaseBrowserClient();

      // 1. Create creator record
      const { data: creator, error: creatorError } = await supabase
        .from("creators")
        .insert({
          username: onboarding.stage_name?.toLowerCase().replace(/\s+/g, "") || 
                    onboarding.email.split("@")[0],
          display_name: onboarding.stage_name || onboarding.full_name || "Creator",
          bio: onboarding.goals || "",
          email: onboarding.email,
          group_id: "default",
          active: true,
        })
        .select()
        .single();

      if (creatorError) {
        console.error("Creator error:", creatorError);
        throw new Error(`Failed to create creator: ${creatorError.message}`);
      }

      let dashboardUserId = null;

      // 2. Create dashboard user if requested
      if (createDashboardAccess) {
        // First, create auth user via API
        const authResponse = await fetch("/api/admin/create-user", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: onboarding.email,
            password: tempPassword,
            fullName: onboarding.full_name,
          }),
        });

        if (!authResponse.ok) {
          const authError = await authResponse.json();
          console.error("Auth error:", authError);
          // Continue anyway, user might already exist
        }

        const authData = await authResponse.json();

        // Create dashboard_users record
        const { data: dashboardUser, error: dashboardError } = await supabase
          .from("dashboard_users")
          .insert({
            auth_user_id: authData?.user?.id || null,
            email: onboarding.email,
            role: "model",
            display_name: onboarding.stage_name || onboarding.full_name || "Creator",
            creator_id: creator.id,
            enabled: true,
          })
          .select()
          .single();

        if (dashboardError) {
          console.error("Dashboard user error:", dashboardError);
          // Continue anyway
        } else {
          dashboardUserId = dashboardUser?.id;
        }
      }

      // 3. Update onboarding status
      const { error: updateError } = await supabase
        .from("creator_onboardings")
        .update({
          status: "approved",
          linked_creator_id: creator.id,
          dashboard_user_id: dashboardUserId,
          reviewed_at: new Date().toISOString(),
        })
        .eq("id", onboarding.id);

      if (updateError) throw updateError;

      // 4. Send welcome email if requested
      if (sendWelcomeEmail && createDashboardAccess) {
        await fetch("/api/send-welcome", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            to: onboarding.email,
            name: onboarding.full_name || onboarding.stage_name,
            tempPassword,
            dashboardUrl: `${window.location.origin}/dashboard`,
          }),
        });
      }

      toast.success("Creator approved and dashboard access created!");
      onApproved();
    } catch (err: unknown) {
      const error = err as Error;
      console.error("Error approving:", error);
      toast.error(error.message || "Failed to approve");
    } finally {
      setIsApproving(false);
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
          <h3 className="text-lg font-semibold text-slate-900">
            Approve Creator
          </h3>
          <p className="text-sm text-slate-500 mt-1">
            {onboarding.full_name || onboarding.email}
          </p>
        </div>

        <div className="p-6 space-y-4">
          <div className="bg-green-50 border border-green-200 rounded-xl p-4">
            <p className="text-sm text-green-700">
              This will create a creator profile and optionally grant dashboard access.
            </p>
          </div>

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
                Creates login credentials for the creator
              </p>
            </div>
          </label>

          {createDashboardAccess && (
            <>
              <div className="space-y-2">
                <Label>Temporary Password</Label>
                <div className="flex items-center gap-2">
                  <Input
                    value={tempPassword}
                    onChange={(e) => setTempPassword(e.target.value)}
                    className="font-mono"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigator.clipboard.writeText(tempPassword)}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
                <p className="text-xs text-slate-500">
                  Share this with the creator so they can log in
                </p>
              </div>

              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={sendWelcomeEmail}
                  onChange={(e) => setSendWelcomeEmail(e.target.checked)}
                  className="w-4 h-4 mt-1 rounded border-slate-300 text-brand-600"
                />
                <div>
                  <span className="text-sm font-medium text-slate-900">
                    Send welcome email
                  </span>
                  <p className="text-xs text-slate-500">
                    Sends login instructions to the creator
                  </p>
                </div>
              </label>
            </>
          )}

          <div className="flex gap-3 pt-4">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button
              onClick={handleApprove}
              disabled={isApproving}
              className="flex-1 bg-green-600 hover:bg-green-700"
            >
              {isApproving ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <CheckCircle className="w-4 h-4 mr-2" />
              )}
              Approve
            </Button>
          </div>
        </div>
      </motion.div>
    </>
  );
}

// ============================================
// REJECT MODAL
// ============================================

function RejectModal({
  onboarding,
  onClose,
  onRejected,
}: {
  onboarding: Onboarding;
  onClose: () => void;
  onRejected: () => void;
}) {
  const [isRejecting, setIsRejecting] = useState(false);
  const [reason, setReason] = useState("");
  const [sendEmail, setSendEmail] = useState(true);

  const handleReject = async () => {
    if (!reason.trim()) {
      toast.error("Please provide a rejection reason");
      return;
    }

    setIsRejecting(true);
    try {
      const supabase = getSupabaseBrowserClient();

      await supabase
        .from("creator_onboardings")
        .update({
          status: "rejected",
          rejection_reasons: reason,
          reviewed_at: new Date().toISOString(),
        })
        .eq("id", onboarding.id);

      if (sendEmail) {
        await fetch("/api/send-rejection", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            to: onboarding.email,
            name: onboarding.full_name || onboarding.stage_name,
            reason,
          }),
        });
      }

      toast.success("Onboarding rejected");
      onRejected();
    } catch (err) {
      console.error("Error rejecting:", err);
      toast.error("Failed to reject");
    } finally {
      setIsRejecting(false);
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
          <h3 className="text-lg font-semibold text-slate-900">
            Reject Onboarding
          </h3>
          <p className="text-sm text-slate-500 mt-1">
            {onboarding.full_name || onboarding.email}
          </p>
        </div>

        <div className="p-6 space-y-4">
          <div className="space-y-2">
            <Label>Rejection Reason</Label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Explain why this application is being rejected..."
              rows={4}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={sendEmail}
              onChange={(e) => setSendEmail(e.target.checked)}
              className="w-4 h-4 rounded border-slate-300 text-brand-600"
            />
            <span className="text-sm text-slate-700">
              Send rejection email to creator
            </span>
          </label>

          <div className="flex gap-3 pt-4">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button
              onClick={handleReject}
              disabled={isRejecting}
              className="flex-1 bg-red-600 hover:bg-red-700"
            >
              {isRejecting ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <XCircle className="w-4 h-4 mr-2" />
              )}
              Reject
            </Button>
          </div>
        </div>
      </motion.div>
    </>
  );
}

// ============================================
// CREATE MODAL
// ============================================

function CreateOnboardingModal({
  onClose,
  onCreated,
}: {
  onClose: () => void;
  onCreated: () => void;
}) {
  const [mode, setMode] = useState<"link" | "direct">("link");
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [stageName, setStageName] = useState("");
  const [accountType, setAccountType] = useState<"model" | "studio">("model");
  const [sendEmail, setSendEmail] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [createdData, setCreatedData] = useState<{ id: string; link: string; password?: string } | null>(null);

  const handleCreate = async () => {
    if (!email || !email.includes("@")) {
      toast.error("Please enter a valid email");
      return;
    }

    setIsCreating(true);
    try {
      const supabase = getSupabaseBrowserClient();

      if (mode === "link") {
        // Create onboarding entry and send link
        const { data, error } = await supabase
          .from("creator_onboardings")
          .insert({ email, status: "pending" })
          .select()
          .single();

        if (error) throw error;

        const link = `${window.location.origin}/join?ref=${data.id}`;
        setCreatedData({ id: data.id, link });

        if (sendEmail) {
          await fetch("/api/send-onboarding", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ to: email, contractLink: link }),
          });
        }

        toast.success(sendEmail ? "Onboarding created and email sent!" : "Onboarding created!");
      } else {
        // Direct registration - create all records immediately
        if (!fullName || !stageName) {
          toast.error("Please fill in all required fields");
          setIsCreating(false);
          return;
        }

        // Generate temporary password
        const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789";
        let tempPassword = "";
        for (let i = 0; i < 12; i++) {
          tempPassword += chars.charAt(Math.floor(Math.random() * chars.length));
        }

        // Create auth user
        const authResponse = await fetch("/api/admin/create-user", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email,
            password: tempPassword,
            fullName,
          }),
        });

        const authData = await authResponse.json();

        if (accountType === "model") {
          // Create creator
          const { data: creator, error: creatorError } = await supabase
            .from("creators")
            .insert({
              username: stageName.toLowerCase().replace(/\s+/g, ""),
              display_name: stageName,
              bio: "",
              email,
              group_id: "default",
              active: true,
            })
            .select()
            .single();

          if (creatorError) throw creatorError;

          // Create dashboard user
          await supabase
            .from("dashboard_users")
            .insert({
              auth_user_id: authData?.user?.id || null,
              email,
              role: "model",
              display_name: stageName,
              creator_id: creator.id,
              enabled: true,
            });

          setCreatedData({ id: creator.id, link: `${window.location.origin}/dashboard`, password: tempPassword });
        } else {
          // Create studio
          const { data: studio, error: studioError } = await supabase
            .from("studios")
            .insert({
              name: stageName,
              email,
              active: true,
            })
            .select()
            .single();

          if (studioError) throw studioError;

          // Create dashboard user
          await supabase
            .from("dashboard_users")
            .insert({
              auth_user_id: authData?.user?.id || null,
              email,
              role: "studio",
              display_name: stageName,
              studio_id: studio.id,
              enabled: true,
            });

          setCreatedData({ id: studio.id, link: `${window.location.origin}/dashboard`, password: tempPassword });
        }

        if (sendEmail) {
          await fetch("/api/send-welcome", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              to: email,
              name: fullName,
              tempPassword,
              dashboardUrl: `${window.location.origin}/dashboard`,
            }),
          });
        }

        toast.success("Account created successfully!");
      }

      onCreated();
    } catch (err: unknown) {
      const error = err as Error;
      console.error("Error creating:", error);
      toast.error(error.message || "Failed to create");
    } finally {
      setIsCreating(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied!");
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
        <div className="p-6 border-b border-slate-200 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-900">
            {createdData ? "Success!" : "New Registration"}
          </h3>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {createdData ? (
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <Check className="w-8 h-8 text-green-600" />
              </div>
              
              {mode === "link" ? (
                <>
                  <p className="text-slate-600">Share the link with the creator:</p>
                  <div className="flex items-center gap-2">
                    <Input value={createdData.link} readOnly className="flex-1 text-sm" />
                    <Button onClick={() => copyToClipboard(createdData.link)}>
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <p className="text-slate-600">Account created! Share these credentials:</p>
                  <div className="space-y-3 text-left bg-slate-50 rounded-xl p-4">
                    <div>
                      <p className="text-xs text-slate-500">Email</p>
                      <div className="flex items-center gap-2">
                        <p className="font-mono text-sm flex-1">{email}</p>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(email)}
                        >
                          <Copy className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Temporary Password</p>
                      <div className="flex items-center gap-2">
                        <p className="font-mono text-sm flex-1">{createdData.password}</p>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(createdData.password!)}
                        >
                          <Copy className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Dashboard URL</p>
                      <div className="flex items-center gap-2">
                        <p className="font-mono text-sm flex-1 truncate">{createdData.link}</p>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(createdData.link)}
                        >
                          <Copy className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </>
              )}
              
              <Button onClick={onClose} className="w-full">
                Done
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Mode Toggle */}
              <div className="flex rounded-lg bg-slate-100 p-1">
                <button
                  onClick={() => setMode("link")}
                  className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                    mode === "link"
                      ? "bg-white shadow text-slate-900"
                      : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  <Mail className="w-4 h-4 inline mr-2" />
                  Send Onboarding Link
                </button>
                <button
                  onClick={() => setMode("direct")}
                  className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                    mode === "direct"
                      ? "bg-white shadow text-slate-900"
                      : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  <UserPlus className="w-4 h-4 inline mr-2" />
                  Direct Registration
                </button>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="creator@example.com"
                />
              </div>

              {mode === "direct" && (
                <>
                  {/* Account Type */}
                  <div className="space-y-2">
                    <Label>Account Type</Label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() => setAccountType("model")}
                        className={`p-4 rounded-xl border-2 transition-colors ${
                          accountType === "model"
                            ? "border-brand-500 bg-brand-50"
                            : "border-slate-200 hover:border-slate-300"
                        }`}
                      >
                        <User className={`w-6 h-6 mx-auto mb-2 ${
                          accountType === "model" ? "text-brand-600" : "text-slate-400"
                        }`} />
                        <p className="text-sm font-medium">Independent</p>
                      </button>
                      <button
                        onClick={() => setAccountType("studio")}
                        className={`p-4 rounded-xl border-2 transition-colors ${
                          accountType === "studio"
                            ? "border-brand-500 bg-brand-50"
                            : "border-slate-200 hover:border-slate-300"
                        }`}
                      >
                        <Building2 className={`w-6 h-6 mx-auto mb-2 ${
                          accountType === "studio" ? "text-brand-600" : "text-slate-400"
                        }`} />
                        <p className="text-sm font-medium">Business</p>
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="John Doe"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="stageName">
                      {accountType === "model" ? "Stage Name / Username" : "Studio Name"}
                    </Label>
                    <Input
                      id="stageName"
                      value={stageName}
                      onChange={(e) => setStageName(e.target.value)}
                      placeholder={accountType === "model" ? "CreatorName" : "My Business"}
                    />
                  </div>
                </>
              )}

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={sendEmail}
                  onChange={(e) => setSendEmail(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-brand-600"
                />
                <span className="text-sm text-slate-700">
                  {mode === "link" 
                    ? "Send onboarding email automatically"
                    : "Send welcome email with login credentials"
                  }
                </span>
              </label>

              <div className="flex gap-3 pt-4">
                <Button variant="outline" onClick={onClose} className="flex-1">
                  Cancel
                </Button>
                <Button
                  onClick={handleCreate}
                  disabled={isCreating}
                  className="flex-1 bg-brand-600 hover:bg-brand-700"
                >
                  {isCreating ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  ) : (
                    <Plus className="w-4 h-4 mr-2" />
                  )}
                  {mode === "link" ? "Create & Send" : "Create Account"}
                </Button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </>
  );
}

// ============================================
// MAIN PAGE
// ============================================

export default function OnboardingPage() {
  const { user } = useDashboard();
  const [onboardings, setOnboardings] = useState<Onboarding[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<OnboardingStatus | "all">("all");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedOnboarding, setSelectedOnboarding] = useState<Onboarding | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);

  const fetchOnboardings = async () => {
    setIsLoading(true);
    try {
      const supabase = getSupabaseBrowserClient();
      const { data, error } = await supabase
        .from("creator_onboardings")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setOnboardings((data as Onboarding[]) || []);
    } catch (err) {
      console.error("Error fetching onboardings:", err);
      toast.error("Failed to load onboardings");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role === "admin") {
      fetchOnboardings();
    }
  }, [user]);

  const handleResendEmail = async (onboarding: Onboarding) => {
    try {
      const link = `${window.location.origin}/join?ref=${onboarding.id}`;
      await fetch("/api/send-onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ to: onboarding.email, contractLink: link }),
      });

      const supabase = getSupabaseBrowserClient();
      await supabase
        .from("creator_onboardings")
        .update({ status: "email_sent" })
        .eq("id", onboarding.id);

      toast.success(`Email sent to ${onboarding.email}`);
      fetchOnboardings();
    } catch (err) {
      console.error("Error sending email:", err);
      toast.error("Failed to send email");
    }
  };

  const handleCopyLink = (id: string) => {
    const link = `${window.location.origin}/join?ref=${id}`;
    navigator.clipboard.writeText(link);
    toast.success("Link copied!");
  };

  const filteredOnboardings = onboardings.filter((o) => {
    const matchesSearch =
      !searchQuery ||
      o.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.stage_name?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === "all" || o.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Stats
  const stats = {
    total: onboardings.length,
    pending: onboardings.filter((o) =>
      ["pending", "email_sent", "in_progress"].includes(o.status)
    ).length,
    submitted: onboardings.filter((o) =>
      ["submitted", "under_review"].includes(o.status)
    ).length,
    approved: onboardings.filter((o) => o.status === "approved").length,
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
          <h1 className="text-2xl font-bold text-slate-900">Onboarding</h1>
          <p className="text-slate-500">Manage creator applications and registrations</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchOnboardings}
            disabled={isLoading}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Button
            onClick={() => setShowCreateModal(true)}
            className="bg-brand-600 hover:bg-brand-700"
          >
            <UserPlus className="w-4 h-4 mr-2" />
            New Registration
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <p className="text-2xl font-bold text-slate-900">{stats.total}</p>
          <p className="text-sm text-slate-500">Total</p>
        </div>
        <div className="bg-yellow-50 rounded-xl border border-yellow-200 p-4">
          <p className="text-2xl font-bold text-yellow-700">{stats.pending}</p>
          <p className="text-sm text-yellow-600">In Progress</p>
        </div>
        <div className="bg-purple-50 rounded-xl border border-purple-200 p-4">
          <p className="text-2xl font-bold text-purple-700">{stats.submitted}</p>
          <p className="text-sm text-purple-600">Needs Review</p>
        </div>
        <div className="bg-green-50 rounded-xl border border-green-200 p-4">
          <p className="text-2xl font-bold text-green-700">{stats.approved}</p>
          <p className="text-sm text-green-600">Approved</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Search by email, name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as OnboardingStatus | "all")}
          className="px-3 py-2 border border-slate-200 rounded-lg bg-white"
        >
          <option value="all">All Status</option>
          {Object.entries(statusConfig).map(([value, config]) => (
            <option key={value} value={value}>
              {config.label}
            </option>
          ))}
        </select>
      </div>

      {/* List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-brand-600 animate-spin" />
        </div>
      ) : filteredOnboardings.length === 0 ? (
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-12 text-center">
          <Users className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h3 className="font-semibold text-slate-700 mb-2">No onboardings found</h3>
          <p className="text-slate-500 text-sm mb-4">
            {searchQuery || statusFilter !== "all"
              ? "Try adjusting your filters"
              : "Create a new registration to get started"}
          </p>
          <Button onClick={() => setShowCreateModal(true)}>
            <UserPlus className="w-4 h-4 mr-2" />
            New Registration
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredOnboardings.map((onboarding) => (
            <OnboardingCard
              key={onboarding.id}
              onboarding={onboarding}
              onView={() => {
                setSelectedOnboarding(onboarding);
                setShowDetailModal(true);
              }}
              onApprove={() => {
                setSelectedOnboarding(onboarding);
                setShowApproveModal(true);
              }}
              onReject={() => {
                setSelectedOnboarding(onboarding);
                setShowRejectModal(true);
              }}
              onResendEmail={() => handleResendEmail(onboarding)}
              onCopyLink={() => handleCopyLink(onboarding.id)}
            />
          ))}
        </div>
      )}

      {/* Modals */}
      <AnimatePresence>
        {showCreateModal && (
          <CreateOnboardingModal
            onClose={() => setShowCreateModal(false)}
            onCreated={() => {
              setShowCreateModal(false);
              fetchOnboardings();
            }}
          />
        )}

        {showDetailModal && selectedOnboarding && (
          <OnboardingDetailModal
            onboarding={selectedOnboarding}
            onClose={() => {
              setShowDetailModal(false);
              setSelectedOnboarding(null);
            }}
            onApprove={() => {
              setShowDetailModal(false);
              setShowApproveModal(true);
            }}
            onReject={() => {
              setShowDetailModal(false);
              setShowRejectModal(true);
            }}
          />
        )}

        {showApproveModal && selectedOnboarding && (
          <ApproveModal
            onboarding={selectedOnboarding}
            onClose={() => {
              setShowApproveModal(false);
              setSelectedOnboarding(null);
            }}
            onApproved={() => {
              setShowApproveModal(false);
              setSelectedOnboarding(null);
              fetchOnboardings();
            }}
          />
        )}

        {showRejectModal && selectedOnboarding && (
          <RejectModal
            onboarding={selectedOnboarding}
            onClose={() => {
              setShowRejectModal(false);
              setSelectedOnboarding(null);
            }}
            onRejected={() => {
              setShowRejectModal(false);
              setSelectedOnboarding(null);
              fetchOnboardings();
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
