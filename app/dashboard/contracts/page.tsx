"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useDashboard } from "../layout";
import { getSupabaseBrowserClient } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { format } from "date-fns";
import {
  FileText,
  Search,
  Eye,
  Download,
  X,
  Loader2,
  AlertCircle,
  Calendar,
  User,
  Building2,
  CheckCircle,
  Clock,
  Filter,
  RefreshCw,
} from "lucide-react";

// ============================================
// TYPES
// ============================================

interface Contract {
  id: string;
  creator_id: string;
  onboarding_id: string | null;
  contract_type: string;
  status: "draft" | "pending" | "signed" | "expired" | "cancelled";
  signed_at: string | null;
  expires_at: string | null;
  contract_data: Record<string, unknown>;
  created_at: string;
  updated_at: string;
  // Joined data
  creator?: {
    id: string;
    username: string;
    enabled: boolean;
    studio_id: string | null;
  };
}

const statusConfig = {
  draft: { label: "Draft", color: "bg-slate-100 text-slate-700", icon: FileText },
  pending: { label: "Pending", color: "bg-yellow-100 text-yellow-700", icon: Clock },
  signed: { label: "Signed", color: "bg-green-100 text-green-700", icon: CheckCircle },
  expired: { label: "Expired", color: "bg-red-100 text-red-700", icon: AlertCircle },
  cancelled: { label: "Cancelled", color: "bg-slate-100 text-slate-600", icon: X },
};

// ============================================
// CONTRACT CARD
// ============================================

function ContractCard({
  contract,
  onView,
  onDownload,
}: {
  contract: Contract;
  onView: () => void;
  onDownload: () => void;
}) {
  const config = statusConfig[contract.status];
  const StatusIcon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md transition-all"
    >
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-100 to-indigo-200 flex items-center justify-center shrink-0">
          <FileText className="w-6 h-6 text-indigo-600" />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-slate-900 capitalize">
              {contract.contract_type.replace(/_/g, " ")} Contract
            </h3>
            <span
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${config.color}`}
            >
              <StatusIcon className="w-3 h-3" />
              {config.label}
            </span>
          </div>

          {contract.creator && (
            <div className="flex items-center gap-2 text-sm text-slate-600 mb-2">
              {contract.creator.studio_id ? (
                <Building2 className="w-4 h-4" />
              ) : (
                <User className="w-4 h-4" />
              )}
              <span>@{contract.creator.username}</span>
            </div>
          )}

          <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              Created: {format(new Date(contract.created_at), "MMM d, yyyy")}
            </span>
            {contract.signed_at && (
              <span className="flex items-center gap-1 text-green-600">
                <CheckCircle className="w-3.5 h-3.5" />
                Signed: {format(new Date(contract.signed_at), "MMM d, yyyy")}
              </span>
            )}
            {contract.expires_at && (
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                Expires: {format(new Date(contract.expires_at), "MMM d, yyyy")}
              </span>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={onView}>
            <Eye className="w-4 h-4 mr-1" />
            View
          </Button>
          {contract.status === "signed" && (
            <Button variant="outline" size="sm" onClick={onDownload}>
              <Download className="w-4 h-4 mr-1" />
              PDF
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// ============================================
// CONTRACT DETAIL MODAL
// ============================================

function ContractDetailModal({
  contract,
  onClose,
}: {
  contract: Contract;
  onClose: () => void;
}) {
  const config = statusConfig[contract.status];
  const StatusIcon = config.icon;

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
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className="fixed inset-4 sm:inset-auto sm:left-1/2 sm:top-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:max-w-2xl sm:w-full sm:max-h-[80vh] bg-white rounded-2xl shadow-xl z-50 overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-200 flex items-center justify-between shrink-0">
          <div>
            <h3 className="text-lg font-semibold text-slate-900 capitalize">
              {contract.contract_type.replace(/_/g, " ")} Contract
            </h3>
            <p className="text-sm text-slate-500">
              ID: {contract.id.slice(0, 8)}...
            </p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            {/* Status */}
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-slate-600">Status:</span>
              <span
                className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${config.color}`}
              >
                <StatusIcon className="w-4 h-4" />
                {config.label}
              </span>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-50 rounded-lg p-4">
                <p className="text-sm text-slate-500 mb-1">Created</p>
                <p className="font-medium">
                  {format(new Date(contract.created_at), "PPP")}
                </p>
              </div>
              {contract.signed_at && (
                <div className="bg-green-50 rounded-lg p-4">
                  <p className="text-sm text-green-600 mb-1">Signed</p>
                  <p className="font-medium text-green-700">
                    {format(new Date(contract.signed_at), "PPP")}
                  </p>
                </div>
              )}
              {contract.expires_at && (
                <div className="bg-amber-50 rounded-lg p-4">
                  <p className="text-sm text-amber-600 mb-1">Expires</p>
                  <p className="font-medium text-amber-700">
                    {format(new Date(contract.expires_at), "PPP")}
                  </p>
                </div>
              )}
            </div>

            {/* Creator Info */}
            {contract.creator && (
              <div className="border border-slate-200 rounded-lg p-4">
                <h4 className="font-medium text-slate-900 mb-3 flex items-center gap-2">
                  {contract.creator.studio_id ? (
                    <Building2 className="w-4 h-4" />
                  ) : (
                    <User className="w-4 h-4" />
                  )}
                  Creator
                </h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-slate-500">Username</p>
                    <p className="font-medium">@{contract.creator.username}</p>
                  </div>
                  <div>
                    <p className="text-slate-500">Creator ID</p>
                    <p className="font-medium font-mono text-xs">
                      {contract.creator.id}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Contract Data */}
            {contract.contract_data &&
              Object.keys(contract.contract_data).length > 0 && (
                <div className="border border-slate-200 rounded-lg p-4">
                  <h4 className="font-medium text-slate-900 mb-3">Contract Details</h4>
                  <pre className="bg-slate-50 p-4 rounded-lg text-sm overflow-x-auto">
                    {JSON.stringify(contract.contract_data, null, 2)}
                  </pre>
                </div>
              )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-200 flex justify-end gap-3 shrink-0">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          {contract.status === "signed" && (
            <Button className="bg-brand-600 hover:bg-brand-700">
              <Download className="w-4 h-4 mr-2" />
              Download PDF
            </Button>
          )}
        </div>
      </motion.div>
    </>
  );
}

// ============================================
// MAIN PAGE
// ============================================

export default function ContractsPage() {
  const { user, creator } = useDashboard();
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<Contract["status"] | "all">("all");
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null);

  const fetchContracts = async () => {
    setIsLoading(true);
    try {
      const supabase = getSupabaseBrowserClient();

      let query = supabase
        .from("creator_contracts")
        .select(`
          *,
          creator:creators(id, username, enabled, studio_id)
        `)
        .order("created_at", { ascending: false });

      // Filter by creator for non-admins
      if (user?.role !== "admin" && creator) {
        query = query.eq("creator_id", creator.id);
      }

      const { data, error } = await query;

      if (error) throw error;
      setContracts((data as Contract[]) || []);
    } catch (err) {
      console.error("Error fetching contracts:", err);
      toast.error("Failed to load contracts");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchContracts();
  }, [user, creator]);

  const filteredContracts = contracts.filter((c) => {
    const matchesSearch =
      !searchQuery ||
      c.contract_type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.creator?.username?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === "all" || c.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Stats
  const stats = {
    total: contracts.length,
    signed: contracts.filter((c) => c.status === "signed").length,
    pending: contracts.filter((c) => c.status === "pending").length,
    expired: contracts.filter((c) => c.status === "expired").length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Contracts</h1>
          <p className="text-slate-500">
            {user?.role === "admin"
              ? "Manage all creator contracts"
              : "View your signed contracts"}
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={fetchContracts}
          disabled={isLoading}
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <p className="text-2xl font-bold text-slate-900">{stats.total}</p>
          <p className="text-sm text-slate-500">Total Contracts</p>
        </div>
        <div className="bg-green-50 rounded-xl border border-green-200 p-4">
          <p className="text-2xl font-bold text-green-700">{stats.signed}</p>
          <p className="text-sm text-green-600">Signed</p>
        </div>
        <div className="bg-yellow-50 rounded-xl border border-yellow-200 p-4">
          <p className="text-2xl font-bold text-yellow-700">{stats.pending}</p>
          <p className="text-sm text-yellow-600">Pending</p>
        </div>
        <div className="bg-red-50 rounded-xl border border-red-200 p-4">
          <p className="text-2xl font-bold text-red-700">{stats.expired}</p>
          <p className="text-sm text-red-600">Expired</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Search contracts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as Contract["status"] | "all")}
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
      ) : filteredContracts.length === 0 ? (
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-12 text-center">
          <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h3 className="font-semibold text-slate-700 mb-2">No contracts found</h3>
          <p className="text-slate-500 text-sm">
            {searchQuery || statusFilter !== "all"
              ? "Try adjusting your filters"
              : "Contracts will appear here once created"}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredContracts.map((contract) => (
            <ContractCard
              key={contract.id}
              contract={contract}
              onView={() => setSelectedContract(contract)}
              onDownload={() => {
                toast.info("PDF download coming soon");
              }}
            />
          ))}
        </div>
      )}

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedContract && (
          <ContractDetailModal
            contract={selectedContract}
            onClose={() => setSelectedContract(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

