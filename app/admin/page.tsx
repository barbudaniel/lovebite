"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import Image from "next/image";
import { format } from "date-fns";
import jsPDF from "jspdf";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { getSupabaseBrowserClient } from "@/lib/supabase";
import type { Onboarding, OnboardingStatus } from "@/lib/database.types";
import {
  Lock,
  Eye,
  EyeOff,
  Search,
  RefreshCw,
  FileText,
  User,
  Mail,
  MapPin,
  CreditCard,
  Instagram,
  X,
  Check,
  AlertTriangle,
  Loader2,
  ExternalLink,
  Plus,
  Send,
  Copy,
  Image as ImageIcon,
  PenTool,
  Download,
} from "lucide-react";

// Hardcoded admin password - in production use env variable
const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "Lovdash2024";

const statusColors: Record<OnboardingStatus, string> = {
  pending: "bg-slate-100 text-slate-700",
  email_sent: "bg-blue-100 text-blue-700",
  in_progress: "bg-yellow-100 text-yellow-700",
  submitted: "bg-purple-100 text-purple-700",
  under_review: "bg-orange-100 text-orange-700",
  approved: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
  resubmit_requested: "bg-amber-100 text-amber-700",
};

const statusLabels: Record<OnboardingStatus, string> = {
  pending: "Pending",
  email_sent: "Email Sent",
  in_progress: "In Progress",
  submitted: "Submitted",
  under_review: "Under Review",
  approved: "Approved",
  rejected: "Rejected",
  resubmit_requested: "Resubmit Requested",
};

interface RejectionReason {
  field: string;
  reason: string;
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const [onboardings, setOnboardings] = useState<Onboarding[]>([]);
  const [selectedOnboarding, setSelectedOnboarding] = useState<Onboarding | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<OnboardingStatus | "all">("all");
  
  const [isActioning, setIsActioning] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReasons, setRejectionReasons] = useState<RejectionReason[]>([
    { field: "", reason: "" }
  ]);

  // Create onboarding modal
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [sendEmailOnCreate, setSendEmailOnCreate] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [createdOnboarding, setCreatedOnboarding] = useState<{ id: string; link: string } | null>(null);

  // Image viewer
  const [viewingImage, setViewingImage] = useState<string | null>(null);

  // Check if already authenticated (session storage)
  useEffect(() => {
    const auth = sessionStorage.getItem("admin-auth");
    if (auth === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  // Close modals with ESC key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setShowCreateModal(false);
        setShowRejectModal(false);
        setViewingImage(null);
        if (!showRejectModal && !showCreateModal && !viewingImage) {
          setSelectedOnboarding(null);
        }
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [showRejectModal, showCreateModal, viewingImage]);

  // Load onboardings when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      loadOnboardings();
    }
  }, [isAuthenticated]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      sessionStorage.setItem("admin-auth", "true");
      toast.success("Welcome, Admin!");
    } else {
      toast.error("Invalid password");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem("admin-auth");
    setOnboardings([]);
    setSelectedOnboarding(null);
  };

  const loadOnboardings = async () => {
    setIsLoading(true);
    try {
      const supabase = getSupabaseBrowserClient();
      const { data, error } = await supabase
        .from("onboardings")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setOnboardings(data || []);
    } catch (err) {
      console.error("Error loading onboardings:", err);
      toast.error("Failed to load submissions");
    } finally {
      setIsLoading(false);
    }
  };

  const getImageUrl = useCallback((path: string | null) => {
    if (!path) return null;
    const supabase = getSupabaseBrowserClient();
    const { data } = supabase.storage
      .from("onboarding-documents")
      .getPublicUrl(path);
    return data.publicUrl;
  }, []);

  const handleCreateOnboarding = async () => {
    if (!newEmail || !newEmail.includes("@")) {
      toast.error("Please enter a valid email");
      return;
    }

    setIsCreating(true);
    try {
      const response = await fetch("/api/create-onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: newEmail, sendEmail: sendEmailOnCreate }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create onboarding");
      }

      setCreatedOnboarding({ id: data.id, link: data.registrationLink });
      toast.success(sendEmailOnCreate ? "Onboarding created and email sent!" : "Onboarding created!");
      loadOnboardings();
    } catch (err: any) {
      console.error("Error creating onboarding:", err);
      toast.error(err.message || "Failed to create onboarding");
    } finally {
      setIsCreating(false);
    }
  };

  const handleResendEmail = async (onboarding: Onboarding) => {
    setIsActioning(true);
    try {
      const link = `${window.location.origin}/register/${onboarding.id}`;
      const response = await fetch("/api/send-onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ to: onboarding.email, contractLink: link }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to send email");
      }

      // Update status in DB
      const supabase = getSupabaseBrowserClient();
      await supabase
        .from("onboardings")
        .update({ status: "email_sent", email_sent_at: new Date().toISOString() })
        .eq("id", onboarding.id);

      toast.success(`Email sent to ${onboarding.email}`);
      loadOnboardings();
    } catch (err: any) {
      console.error("Error sending email:", err);
      toast.error(err.message || "Failed to send email");
    } finally {
      setIsActioning(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  const handleStatusChange = async (id: string, newStatus: OnboardingStatus) => {
    setIsActioning(true);
    try {
      const supabase = getSupabaseBrowserClient();
      
      const updateData: Record<string, unknown> = { status: newStatus };
      
      // Add relevant timestamps based on status
      if (newStatus === "approved" || newStatus === "rejected") {
        updateData.reviewed_at = new Date().toISOString();
      }
      if (newStatus === "approved") {
        updateData.rejection_reasons = null;
      }
      
      const { error } = await supabase
        .from("onboardings")
        .update(updateData)
        .eq("id", id);

      if (error) throw error;

      // Find the onboarding to get email for approval notification
      const onboarding = onboardings.find(o => o.id === id);

      // Send approval email if status changed to approved
      if (newStatus === "approved" && onboarding) {
        try {
          const contractPdfPath = onboarding.contract_pdf_path;
          let contractPdfUrl: string | undefined;
          
          if (contractPdfPath) {
            const { data: urlData } = supabase.storage
              .from("onboarding-documents")
              .getPublicUrl(contractPdfPath);
            contractPdfUrl = urlData.publicUrl;
          }
          
          if (contractPdfUrl) {
            await fetch("/api/send-contract-success", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                to: onboarding.email,
                creatorName: onboarding.full_name || "Creator",
                contractPdfUrl,
              }),
            });
          } else {
            // Fallback to generated HTML
            const contractResponse = await fetch(`/api/generate-contract?id=${id}`);
            const contractHtml = await contractResponse.text();
            
            await fetch("/api/send-contract-success", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                to: onboarding.email,
                creatorName: onboarding.full_name || "Creator",
                contractHtml,
              }),
            });
          }
          toast.success(`Status updated to ${statusLabels[newStatus]} - Email sent!`);
        } catch (emailErr) {
          console.error("Error sending approval email:", emailErr);
          toast.success(`Status updated to ${statusLabels[newStatus]} (Email failed)`);
        }
      } else {
        toast.success(`Status updated to ${statusLabels[newStatus]}`);
      }
      
      // Update local state
      setOnboardings(prev => prev.map(o => 
        o.id === id ? { ...o, status: newStatus } : o
      ));
      if (selectedOnboarding?.id === id) {
        setSelectedOnboarding(prev => prev ? { ...prev, status: newStatus } : null);
      }
    } catch (err) {
      console.error("Error updating status:", err);
      toast.error("Failed to update status");
    } finally {
      setIsActioning(false);
    }
  };

  const handleApprove = async (onboarding: Onboarding) => {
    setIsActioning(true);
    try {
      const supabase = getSupabaseBrowserClient();
      const { error } = await supabase
        .from("onboardings")
        .update({
          status: "approved",
          reviewed_at: new Date().toISOString(),
          rejection_reasons: null,
        })
        .eq("id", onboarding.id);

      if (error) throw error;

      // Send approval email with the stored PDF contract
      try {
        // Get the contract PDF URL from storage
        const contractPdfPath = onboarding.contract_pdf_path;
        let contractPdfUrl: string | undefined;
        
        if (contractPdfPath) {
          const { data: urlData } = supabase.storage
            .from("onboarding-documents")
            .getPublicUrl(contractPdfPath);
          contractPdfUrl = urlData.publicUrl;
        }
        
        if (contractPdfUrl) {
          await fetch("/api/send-contract-success", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              to: onboarding.email,
              creatorName: onboarding.full_name || "Creator",
              contractPdfUrl,
            }),
          });
          toast.success(`${onboarding.full_name || "Onboarding"} approved and email sent!`);
        } else {
          // Fallback to generated HTML if no PDF stored
          const contractResponse = await fetch(`/api/generate-contract?id=${onboarding.id}`);
          const contractHtml = await contractResponse.text();
          
          await fetch("/api/send-contract-success", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              to: onboarding.email,
              creatorName: onboarding.full_name || "Creator",
              contractHtml,
            }),
          });
          toast.success(`${onboarding.full_name || "Onboarding"} approved and email sent!`);
        }
      } catch (emailErr) {
        console.error("Error sending approval email:", emailErr);
        toast.success(`${onboarding.full_name || "Onboarding"} approved! (Email failed to send)`);
      }

      loadOnboardings();
      setSelectedOnboarding(null);
    } catch (err) {
      console.error("Error approving:", err);
      toast.error("Failed to approve");
    } finally {
      setIsActioning(false);
    }
  };

  const handleDownloadContract = async (onboarding: Onboarding) => {
    const supabase = getSupabaseBrowserClient();
    const contractPdfPath = (onboarding as any).contract_pdf_path;
    
    try {
      if (contractPdfPath) {
        // Download stored PDF
        const { data, error } = await supabase.storage
          .from("onboarding-documents")
          .download(contractPdfPath);
        
        if (error) throw error;
        
        const url = URL.createObjectURL(data);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Lovdash-contract-${onboarding.id}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      } else {
        // Generate PDF on-the-fly as fallback
        const pdfBlob = await generateContractPdfForAdmin(onboarding, supabase);
        const url = URL.createObjectURL(pdfBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Lovdash-contract-${onboarding.id}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
      
      toast.success("Contract PDF downloaded");
    } catch (err) {
      console.error("Error downloading contract:", err);
      toast.error("Failed to download contract PDF");
    }
  };

  // Generate PDF for admin download (fallback when no stored PDF)
  const generateContractPdfForAdmin = async (onboarding: Onboarding, supabase: ReturnType<typeof getSupabaseBrowserClient>): Promise<Blob> => {
    const pdf = new jsPDF("p", "mm", "a4");
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 15;
    const contentWidth = pageWidth - margin * 2;
    let yPosition = 25;
    
    const formattedAddress = [
      onboarding.address,
      onboarding.city,
      onboarding.postal_code,
      onboarding.country
    ].filter(Boolean).join(", ");
    
    const signedDate = onboarding.contract_signed_at 
      ? format(new Date(onboarding.contract_signed_at), "d MMMM yyyy")
      : format(new Date(), "d MMMM yyyy");

    // Helper functions
    const addHeader = (title: string) => {
      pdf.setFillColor(190, 24, 93);
      pdf.rect(0, 0, pageWidth, 20, "F");
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(14);
      pdf.setFont("helvetica", "bold");
      pdf.text("Lovdash", margin, 13);
      pdf.setFontSize(9);
      pdf.setFont("helvetica", "normal");
      pdf.text(title, pageWidth - margin, 13, { align: "right" });
      pdf.setTextColor(0, 0, 0);
    };

    const checkPageBreak = (neededSpace: number) => {
      if (yPosition + neededSpace > pageHeight - 20) {
        pdf.addPage();
        addHeader("Agency Agreement");
        yPosition = 30;
        return true;
      }
      return false;
    };

    const addWrappedText = (text: string, fontSize: number = 9, maxWidth: number = contentWidth) => {
      pdf.setFontSize(fontSize);
      const lines = pdf.splitTextToSize(text, maxWidth);
      for (const line of lines) {
        checkPageBreak(6);
        pdf.text(line, margin, yPosition);
        yPosition += 5;
      }
    };

    // Title
    addHeader("Agency Agreement");
    
    pdf.setFontSize(14);
    pdf.setFont("helvetica", "bold");
    pdf.setTextColor(30, 41, 59);
    pdf.text("EXCLUSIVE MANAGEMENT AND CONTENT AGENCY AGREEMENT", pageWidth / 2, yPosition, { align: "center" });
    yPosition += 10;

    // Registration info
    pdf.setFillColor(248, 250, 252);
    pdf.roundedRect(margin, yPosition, contentWidth, 10, 2, 2, "F");
    pdf.setFontSize(8);
    pdf.setFont("helvetica", "normal");
    pdf.setTextColor(107, 114, 128);
    pdf.text(`Registration ID: ${onboarding.id}`, margin + 4, yPosition + 6);
    pdf.text(`Date: ${signedDate}`, pageWidth - margin - 4, yPosition + 6, { align: "right" });
    yPosition += 18;

    // Party information
    pdf.setFontSize(9);
    pdf.setTextColor(51, 65, 85);
    pdf.setFont("helvetica", "normal");
    addWrappedText(`THIS AGREEMENT is made on ${signedDate}`);
    yPosition += 5;
    addWrappedText("BETWEEN:");
    addWrappedText("(1) TRUST CHARGE SOLUTIONS LTD, a private limited company incorporated in England and Wales, with its registered office at 20 Wenlock Road, London, England, N1 7GU, represented by Gabriel Cosoi (\"The Agency\" or \"Partner A\");");
    yPosition += 3;
    addWrappedText("AND");
    addWrappedText(`(2) ${onboarding.full_name || "N/A"}, an individual residing at ${formattedAddress || "N/A"}, (ID/Passport No: ${onboarding.id_number || "N/A"}) ("The Talent" or "Partner B").`);
    yPosition += 5;

    // Contract sections
    const sections = [
      { title: "1. BACKGROUND", content: "1.1 Partner A operates as a management and marketing agency specializing in the representation of content creators on adult subscription-based platforms.\n1.2 Partner B wishes to engage Partner A on an exclusive basis to provide management, marketing, and operational support services." },
      { title: "2. DURATION", content: "2.1 This Agreement shall commence on the date of signing and continue for an initial term of twelve (12) months.\n2.2 Following the Initial Term, this Agreement shall automatically renew for successive periods of twelve (12) months unless terminated in accordance with Clause 11." },
      { title: "3. RELATIONSHIP OF THE PARTIES", content: "3.1 Partner B acknowledges and agrees that they are an independent contractor and not an employee of Partner A.\n3.2 Partner B retains exclusive ownership and control over all content created by them." },
      { title: "4. OBLIGATIONS OF THE TALENT", content: "Partner B shall: produce original content, maintain active profiles on agreed Platforms, respond to subscriber messages, comply with all applicable laws, and cooperate with Partner A in marketing activities." },
      { title: "5. OBLIGATIONS OF THE AGENCY", content: "Partner A shall: provide account management and operational support, develop marketing strategies, handle subscriber engagement, provide analytics, and advise on content optimization." },
      { title: "6. INTELLECTUAL PROPERTY", content: "Partner B retains all intellectual property rights in their content. Partner B grants Partner A a non-exclusive license to use their content for marketing purposes." },
      { title: "7. FINANCIAL TERMS", content: "Partner A shall receive a commission of thirty percent (30%) of all gross revenue generated through the Platforms. Commission shall be calculated and paid on a monthly basis." },
      { title: "8. NON-COMPETE", content: "During the term of this Agreement, Partner B shall not engage any other agency or management service for Platform-related activities without prior written consent." },
      { title: "9-13. GENERAL PROVISIONS", content: "Additional terms regarding breach, confidentiality, termination, data protection, and governing law apply as per the full agreement." },
    ];

    for (const section of sections) {
      checkPageBreak(25);
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(10);
      pdf.setTextColor(30, 41, 59);
      pdf.text(section.title, margin, yPosition);
      yPosition += 6;
      pdf.setFont("helvetica", "normal");
      pdf.setTextColor(51, 65, 85);
      addWrappedText(section.content);
      yPosition += 5;
    }

    // Signature section
    checkPageBreak(60);
    pdf.setFillColor(254, 242, 242);
    pdf.roundedRect(margin, yPosition, contentWidth, 50, 3, 3, "F");
    pdf.setFontSize(11);
    pdf.setFont("helvetica", "bold");
    pdf.setTextColor(30, 41, 59);
    pdf.text("DIGITAL SIGNATURE", margin + 4, yPosition + 8);
    pdf.setFontSize(9);
    pdf.setFont("helvetica", "normal");
    pdf.text(`Signed by: ${onboarding.full_name || "N/A"}`, margin + 4, yPosition + 16);
    pdf.text(`Date: ${signedDate}`, margin + 4, yPosition + 22);
    pdf.text(`ID/Passport: ${onboarding.id_number || "N/A"}`, margin + 4, yPosition + 28);

    // Try to add signature image
    if (onboarding.signature_path) {
      try {
        const { data: urlData } = supabase.storage
          .from("onboarding-documents")
          .getPublicUrl(onboarding.signature_path);
        const response = await fetch(urlData.publicUrl);
        const blob = await response.blob();
        const signatureDataUrl = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(blob);
        });
        pdf.addImage(signatureDataUrl, "PNG", margin + 90, yPosition + 10, 50, 25);
      } catch {
        pdf.text("[Signature on file]", margin + 100, yPosition + 25);
      }
    } else {
      pdf.text("[No signature]", margin + 100, yPosition + 25);
    }

    // Page numbers
    const totalPages = pdf.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      pdf.setPage(i);
      pdf.setFontSize(7);
      pdf.setTextColor(156, 163, 175);
      pdf.text(`Page ${i} of ${totalPages}`, pageWidth / 2, pageHeight - 10, { align: "center" });
    }

    return pdf.output('blob');
  };

  const handleReject = async () => {
    if (!selectedOnboarding) return;
    
    const validReasons = rejectionReasons.filter(r => r.field && r.reason);
    if (validReasons.length === 0) {
      toast.error("Please add at least one rejection reason");
      return;
    }

    setIsActioning(true);
    try {
      const supabase = getSupabaseBrowserClient();
      const { error } = await supabase
        .from("onboardings")
        .update({
          status: "resubmit_requested",
          reviewed_at: new Date().toISOString(),
          rejection_reasons: validReasons,
        })
        .eq("id", selectedOnboarding.id);

      if (error) throw error;

      toast.success("Rejection sent, creator will be notified");
      setShowRejectModal(false);
      setRejectionReasons([{ field: "", reason: "" }]);
      loadOnboardings();
      setSelectedOnboarding(null);
    } catch (err) {
      console.error("Error rejecting:", err);
      toast.error("Failed to reject");
    } finally {
      setIsActioning(false);
    }
  };

  const addRejectionReason = () => {
    setRejectionReasons([...rejectionReasons, { field: "", reason: "" }]);
  };

  const updateRejectionReason = (index: number, key: keyof RejectionReason, value: string) => {
    const updated = [...rejectionReasons];
    updated[index][key] = value;
    setRejectionReasons(updated);
  };

  const removeRejectionReason = (index: number) => {
    if (rejectionReasons.length > 1) {
      setRejectionReasons(rejectionReasons.filter((_, i) => i !== index));
    }
  };

  const resetCreateModal = () => {
    setNewEmail("");
    setSendEmailOnCreate(true);
    setCreatedOnboarding(null);
    setShowCreateModal(false);
  };

  // Filter onboardings
  const filteredOnboardings = onboardings.filter((o) => {
    const matchesSearch =
      !searchQuery ||
      o.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.stage_name?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || o.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Stats
  const stats = {
    total: onboardings.length,
    pending: onboardings.filter(o => ["pending", "email_sent", "in_progress"].includes(o.status)).length,
    submitted: onboardings.filter(o => ["submitted", "under_review"].includes(o.status)).length,
    approved: onboardings.filter(o => o.status === "approved").length,
    rejected: onboardings.filter(o => ["rejected", "resubmit_requested"].includes(o.status)).length,
  };

  // Login Page
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-sm"
        >
          <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-lg">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-brand-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lock className="w-8 h-8 text-brand-600" />
              </div>
              <h1 className="text-xl font-bold text-slate-900">Admin Access</h1>
              <p className="text-sm text-slate-500 mt-1">Enter password to continue</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter admin password"
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

              <Button type="submit" className="w-full bg-brand-600 hover:bg-brand-700">
                <Lock className="w-4 h-4 mr-2" />
                Access Dashboard
              </Button>
            </form>
          </div>
        </motion.div>
      </div>
    );
  }

  // Main Dashboard
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center">
                <FileText className="w-4 h-4 text-white" />
              </div>
              <h1 className="font-bold text-lg text-slate-900">Onboarding Admin</h1>
            </div>
            <div className="flex items-center gap-3">
              <Button
                onClick={() => setShowCreateModal(true)}
                className="bg-brand-600 hover:bg-brand-700"
              >
                <Plus className="w-4 h-4 mr-1" />
                New Onboarding
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={loadOnboardings}
                disabled={isLoading}
              >
                <RefreshCw className={`w-4 h-4 mr-1 ${isLoading ? "animate-spin" : ""}`} />
                Refresh
              </Button>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mb-8">
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
            <p className="text-sm text-purple-600">Submitted</p>
          </div>
          <div className="bg-green-50 rounded-xl border border-green-200 p-4">
            <p className="text-2xl font-bold text-green-700">{stats.approved}</p>
            <p className="text-sm text-green-600">Approved</p>
          </div>
          <div className="bg-red-50 rounded-xl border border-red-200 p-4">
            <p className="text-2xl font-bold text-red-700">{stats.rejected}</p>
            <p className="text-sm text-red-600">Rejected</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Search by name, email, or stage name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as OnboardingStatus | "all")}
              className="px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white"
            >
              <option value="all">All Status</option>
              {Object.entries(statusLabels).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 text-brand-600 animate-spin" />
            </div>
          ) : filteredOnboardings.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-slate-500">No submissions found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-600 uppercase">Creator</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-600 uppercase">Stage Name</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-600 uppercase">Status</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-600 uppercase">Created</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-600 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredOnboardings.map((onboarding) => (
                    <tr key={onboarding.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3">
                        <div>
                          <p className="font-medium text-slate-900">{onboarding.full_name || "—"}</p>
                          <p className="text-sm text-slate-500">{onboarding.email}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-slate-700">
                        {onboarding.stage_name || "—"}
                      </td>
                      <td className="px-4 py-3">
                        <select
                          value={onboarding.status}
                          onChange={(e) => handleStatusChange(onboarding.id, e.target.value as OnboardingStatus)}
                          onClick={(e) => e.stopPropagation()}
                          className={`px-2 py-1 text-xs font-medium rounded-full border-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-brand-500 ${statusColors[onboarding.status]}`}
                        >
                          {Object.entries(statusLabels).map(([value, label]) => (
                            <option key={value} value={value}>{label}</option>
                          ))}
                        </select>
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-500">
                        {format(new Date(onboarding.created_at), "MMM d, yyyy")}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedOnboarding(onboarding)}
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            View
                          </Button>
                          {["pending", "email_sent"].includes(onboarding.status) && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleResendEmail(onboarding)}
                              disabled={isActioning}
                            >
                              <Send className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Detail Slideout */}
      <AnimatePresence>
        {selectedOnboarding && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50"
              onClick={() => setSelectedOnboarding(null)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-2xl bg-white shadow-xl z-50 overflow-y-auto"
            >
              <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between z-10">
                <h2 className="text-lg font-bold text-slate-900">Submission Details</h2>
                <button
                  onClick={() => setSelectedOnboarding(null)}
                  className="p-2 hover:bg-slate-100 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* Status & Actions Header */}
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <div className="flex items-center gap-3">
                    <select
                      value={selectedOnboarding.status}
                      onChange={(e) => handleStatusChange(selectedOnboarding.id, e.target.value as OnboardingStatus)}
                      disabled={isActioning}
                      className={`px-3 py-1.5 text-sm font-medium rounded-full border-2 cursor-pointer transition-colors ${statusColors[selectedOnboarding.status]} border-transparent hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500`}
                    >
                      {Object.entries(statusLabels).map(([value, label]) => (
                        <option key={value} value={value}>{label}</option>
                      ))}
                    </select>
                    {isActioning && <Loader2 className="w-4 h-4 animate-spin text-slate-400" />}
                  </div>
                  <div className="flex items-center gap-2">
                    {selectedOnboarding.status === "submitted" || selectedOnboarding.status === "approved" ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDownloadContract(selectedOnboarding)}
                      >
                        <Download className="w-4 h-4 mr-1" />
                        PDF
                      </Button>
                    ) : null}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(`${window.location.origin}/register/${selectedOnboarding.id}`)}
                    >
                      <Copy className="w-4 h-4 mr-1" />
                      Copy Link
                    </Button>
                    {["pending", "email_sent", "resubmit_requested"].includes(selectedOnboarding.status) && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleResendEmail(selectedOnboarding)}
                        disabled={isActioning}
                      >
                        <Send className="w-4 h-4 mr-1" />
                        {isActioning ? "Sending..." : "Send Email"}
                      </Button>
                    )}
                  </div>
                </div>

                {/* Personal Info */}
                <div className="bg-slate-50 rounded-xl p-4 space-y-3">
                  <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Personal Information
                  </h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-slate-500">Full Name</p>
                      <p className="font-medium">{selectedOnboarding.full_name || "—"}</p>
                    </div>
                    <div>
                      <p className="text-slate-500">Stage Name</p>
                      <p className="font-medium">{selectedOnboarding.stage_name || "—"}</p>
                    </div>
                    <div>
                      <p className="text-slate-500">Email</p>
                      <p className="font-medium">{selectedOnboarding.email}</p>
                    </div>
                    <div>
                      <p className="text-slate-500">Date of Birth</p>
                      <p className="font-medium">
                        {selectedOnboarding.date_of_birth
                          ? format(new Date(selectedOnboarding.date_of_birth), "MMM d, yyyy")
                          : "—"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Address */}
                <div className="bg-slate-50 rounded-xl p-4 space-y-3">
                  <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Address
                  </h3>
                  <p className="text-sm">
                    {[
                      selectedOnboarding.address,
                      selectedOnboarding.city,
                      selectedOnboarding.postal_code,
                      selectedOnboarding.country,
                    ].filter(Boolean).join(", ") || "—"}
                  </p>
                </div>

                {/* ID Verification with Images */}
                <div className="bg-slate-50 rounded-xl p-4 space-y-3">
                  <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                    <CreditCard className="w-4 h-4" />
                    ID Verification
                  </h3>
                  <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                    <div>
                      <p className="text-slate-500">ID Type</p>
                      <p className="font-medium capitalize">{selectedOnboarding.id_type?.replace("_", " ") || "—"}</p>
                    </div>
                    <div>
                      <p className="text-slate-500">ID Number</p>
                      <p className="font-medium">{selectedOnboarding.id_number || "—"}</p>
                    </div>
                  </div>
                  
                  {/* ID Images */}
                  <div className="grid grid-cols-3 gap-3">
                    {selectedOnboarding.id_front_path ? (
                      <button
                        onClick={() => setViewingImage(getImageUrl(selectedOnboarding.id_front_path))}
                        className="group block"
                      >
                        <div className="aspect-[4/3] relative rounded-lg overflow-hidden border border-slate-200 group-hover:border-brand-500 transition-colors">
                          <Image
                            src={getImageUrl(selectedOnboarding.id_front_path) || ""}
                            alt="ID Front"
                            fill
                            className="object-cover"
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                            <Eye className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                        </div>
                        <p className="text-xs text-center mt-1 text-slate-500">ID Front</p>
                      </button>
                    ) : (
                      <div className="aspect-[4/3] rounded-lg border border-dashed border-slate-300 flex items-center justify-center">
                        <div className="text-center text-slate-400">
                          <ImageIcon className="w-6 h-6 mx-auto mb-1" />
                          <p className="text-xs">No ID Front</p>
                        </div>
                      </div>
                    )}
                    
                    {selectedOnboarding.id_back_path ? (
                      <button
                        onClick={() => setViewingImage(getImageUrl(selectedOnboarding.id_back_path))}
                        className="group block"
                      >
                        <div className="aspect-[4/3] relative rounded-lg overflow-hidden border border-slate-200 group-hover:border-brand-500 transition-colors">
                          <Image
                            src={getImageUrl(selectedOnboarding.id_back_path) || ""}
                            alt="ID Back"
                            fill
                            className="object-cover"
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                            <Eye className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                        </div>
                        <p className="text-xs text-center mt-1 text-slate-500">ID Back</p>
                      </button>
                    ) : (
                      <div className="aspect-[4/3] rounded-lg border border-dashed border-slate-300 flex items-center justify-center">
                        <div className="text-center text-slate-400">
                          <ImageIcon className="w-6 h-6 mx-auto mb-1" />
                          <p className="text-xs">No ID Back</p>
                        </div>
                      </div>
                    )}
                    
                    {selectedOnboarding.selfie_with_id_path ? (
                      <button
                        onClick={() => setViewingImage(getImageUrl(selectedOnboarding.selfie_with_id_path))}
                        className="group block"
                      >
                        <div className="aspect-[4/3] relative rounded-lg overflow-hidden border border-slate-200 group-hover:border-brand-500 transition-colors">
                          <Image
                            src={getImageUrl(selectedOnboarding.selfie_with_id_path) || ""}
                            alt="Selfie with ID"
                            fill
                            className="object-cover"
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                            <Eye className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                        </div>
                        <p className="text-xs text-center mt-1 text-slate-500">Selfie</p>
                      </button>
                    ) : (
                      <div className="aspect-[4/3] rounded-lg border border-dashed border-slate-300 flex items-center justify-center">
                        <div className="text-center text-slate-400">
                          <ImageIcon className="w-6 h-6 mx-auto mb-1" />
                          <p className="text-xs">No Selfie</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Signature */}
                <div className="bg-slate-50 rounded-xl p-4 space-y-3">
                  <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                    <PenTool className="w-4 h-4" />
                    Signature
                  </h3>
                  {selectedOnboarding.signature_path ? (
                    <button
                      onClick={() => setViewingImage(getImageUrl(selectedOnboarding.signature_path))}
                      className="bg-white rounded-lg p-4 border border-slate-200 hover:border-brand-500 transition-colors w-full"
                    >
                      <Image
                        src={getImageUrl(selectedOnboarding.signature_path) || ""}
                        alt="Signature"
                        width={300}
                        height={100}
                        className="max-h-24 w-auto mx-auto"
                      />
                    </button>
                  ) : (
                    <div className="bg-white rounded-lg p-8 border border-dashed border-slate-300 text-center text-slate-400">
                      <PenTool className="w-8 h-8 mx-auto mb-2" />
                      <p className="text-sm">No signature uploaded</p>
                    </div>
                  )}
                </div>

                {/* Preferences */}
                <div className="bg-slate-50 rounded-xl p-4 space-y-3">
                  <h3 className="font-semibold text-slate-900">Preferences</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-slate-500">Categories</p>
                      <p className="font-medium">{selectedOnboarding.categories?.join(", ") || "—"}</p>
                    </div>
                    <div>
                      <p className="text-slate-500">Platforms</p>
                      <p className="font-medium">{selectedOnboarding.platforms?.join(", ") || "—"}</p>
                    </div>
                    <div>
                      <p className="text-slate-500">Languages</p>
                      <p className="font-medium">{selectedOnboarding.languages?.join(", ") || "—"}</p>
                    </div>
                    <div>
                      <p className="text-slate-500">Experience</p>
                      <p className="font-medium">{selectedOnboarding.experience || "—"}</p>
                    </div>
                    <div>
                      <p className="text-slate-500">Availability</p>
                      <p className="font-medium">{selectedOnboarding.availability || "—"}</p>
                    </div>
                    <div>
                      <p className="text-slate-500">Current Earnings</p>
                      <p className="font-medium">{selectedOnboarding.current_earnings || "—"}</p>
                    </div>
                  </div>
                </div>

                {/* Social */}
                <div className="bg-slate-50 rounded-xl p-4 space-y-3">
                  <h3 className="font-semibold text-slate-900">Social Media</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedOnboarding.instagram && (
                      <a
                        href={`https://instagram.com/${selectedOnboarding.instagram.replace("@", "")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-3 py-1 bg-white border border-slate-200 rounded-full text-sm hover:border-brand-500"
                      >
                        <Instagram className="w-4 h-4" />
                        {selectedOnboarding.instagram}
                      </a>
                    )}
                    {selectedOnboarding.tiktok && (
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-white border border-slate-200 rounded-full text-sm">
                        TikTok: {selectedOnboarding.tiktok}
                      </span>
                    )}
                    {selectedOnboarding.twitter && (
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-white border border-slate-200 rounded-full text-sm">
                        X: {selectedOnboarding.twitter}
                      </span>
                    )}
                    {!selectedOnboarding.instagram && !selectedOnboarding.tiktok && !selectedOnboarding.twitter && (
                      <span className="text-sm text-slate-400">No social links provided</span>
                    )}
                  </div>
                </div>

                {/* Goals */}
                {selectedOnboarding.goals && (
                  <div className="bg-slate-50 rounded-xl p-4 space-y-3">
                    <h3 className="font-semibold text-slate-900">Goals</h3>
                    <p className="text-sm">{selectedOnboarding.goals}</p>
                  </div>
                )}

                {/* Additional Notes */}
                {selectedOnboarding.additional_notes && (
                  <div className="bg-slate-50 rounded-xl p-4 space-y-3">
                    <h3 className="font-semibold text-slate-900">Additional Notes</h3>
                    <p className="text-sm">{selectedOnboarding.additional_notes}</p>
                  </div>
                )}

                {/* Rejection Reasons (if any) */}
                {selectedOnboarding.rejection_reasons && (
                  <div className="bg-red-50 rounded-xl p-4 space-y-3 border border-red-200">
                    <h3 className="font-semibold text-red-900 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4" />
                      Rejection Reasons
                    </h3>
                    <ul className="space-y-2">
                      {(selectedOnboarding.rejection_reasons as RejectionReason[]).map((reason, i) => (
                        <li key={i} className="text-sm">
                          <span className="font-medium text-red-800">{reason.field}:</span>{" "}
                          <span className="text-red-700">{reason.reason}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Actions */}
                {selectedOnboarding.status === "submitted" && (
                  <div className="flex gap-3 pt-4 border-t border-slate-200">
                    <Button
                      onClick={() => handleApprove(selectedOnboarding)}
                      disabled={isActioning}
                      className="flex-1 bg-green-600 hover:bg-green-700"
                    >
                      {isActioning ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <Check className="w-4 h-4 mr-2" />
                      )}
                      Approve
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setShowRejectModal(true)}
                      disabled={isActioning}
                      className="flex-1 border-red-300 text-red-600 hover:bg-red-50"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Reject
                    </Button>
                  </div>
                )}

                {/* Registration Link */}
                <div className="pt-4 border-t border-slate-200">
                  <a
                    href={`/register/${selectedOnboarding.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm text-brand-600 hover:text-brand-700"
                  >
                    <ExternalLink className="w-4 h-4" />
                    View Registration Page
                  </a>
                </div>

                {/* Timestamps */}
                <div className="pt-4 border-t border-slate-200 text-xs text-slate-400 space-y-1">
                  <p>Created: {format(new Date(selectedOnboarding.created_at), "PPpp")}</p>
                  {selectedOnboarding.email_sent_at && (
                    <p>Email Sent: {format(new Date(selectedOnboarding.email_sent_at), "PPpp")}</p>
                  )}
                  {selectedOnboarding.submitted_at && (
                    <p>Submitted: {format(new Date(selectedOnboarding.submitted_at), "PPpp")}</p>
                  )}
                  {selectedOnboarding.reviewed_at && (
                    <p>Reviewed: {format(new Date(selectedOnboarding.reviewed_at), "PPpp")}</p>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Create Onboarding Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-[60]"
              onClick={resetCreateModal}
            />
            <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 pointer-events-none">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6 pointer-events-auto"
              >
              {createdOnboarding ? (
                <>
                  <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Check className="w-8 h-8 text-green-600" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900">Onboarding Created!</h3>
                    <p className="text-sm text-slate-500 mt-1">Share the link with the creator</p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label className="text-xs text-slate-500">Registration Link</Label>
                      <div className="flex gap-2 mt-1">
                        <Input
                          value={createdOnboarding.link}
                          readOnly
                          className="text-sm"
                        />
                        <Button
                          variant="outline"
                          onClick={() => copyToClipboard(createdOnboarding.link)}
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    <Button onClick={resetCreateModal} className="w-full">
                      Done
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold text-slate-900">New Onboarding</h3>
                    <button
                      onClick={resetCreateModal}
                      className="p-2 hover:bg-slate-100 rounded-lg"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Creator Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={newEmail}
                        onChange={(e) => setNewEmail(e.target.value)}
                        placeholder="creator@example.com"
                      />
                    </div>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={sendEmailOnCreate}
                        onChange={(e) => setSendEmailOnCreate(e.target.checked)}
                        className="w-4 h-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                      />
                      <span className="text-sm text-slate-700">Send onboarding email automatically</span>
                    </label>

                    <div className="flex gap-3 pt-4">
                      <Button
                        variant="outline"
                        onClick={resetCreateModal}
                        className="flex-1"
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={handleCreateOnboarding}
                        disabled={isCreating || !newEmail}
                        className="flex-1 bg-brand-600 hover:bg-brand-700"
                      >
                        {isCreating ? (
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                          <Plus className="w-4 h-4 mr-2" />
                        )}
                        Create
                      </Button>
                    </div>
                  </div>
                </>
              )}
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>

      {/* Reject Modal */}
      <AnimatePresence>
        {showRejectModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-[60]"
              onClick={() => setShowRejectModal(false)}
            />
            <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 pointer-events-none">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="w-full max-w-lg bg-white rounded-2xl shadow-xl p-6 pointer-events-auto"
              >
                <h3 className="text-lg font-bold text-slate-900 mb-4">Reject Submission</h3>
              <p className="text-sm text-slate-500 mb-6">
                Specify which fields need to be updated. The creator will receive an email with these reasons.
              </p>

              <div className="space-y-4 max-h-[300px] overflow-y-auto mb-6">
                {rejectionReasons.map((reason, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      placeholder="Field (e.g., ID Photo)"
                      value={reason.field}
                      onChange={(e) => updateRejectionReason(index, "field", e.target.value)}
                      className="w-1/3"
                    />
                    <Input
                      placeholder="Reason for rejection"
                      value={reason.reason}
                      onChange={(e) => updateRejectionReason(index, "reason", e.target.value)}
                      className="flex-1"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeRejectionReason(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>

              <Button variant="outline" size="sm" onClick={addRejectionReason} className="mb-6">
                + Add Another Reason
              </Button>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setShowRejectModal(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleReject}
                  disabled={isActioning}
                  className="flex-1 bg-red-600 hover:bg-red-700"
                >
                  {isActioning ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <X className="w-4 h-4 mr-2" />
                  )}
                  Send Rejection
                </Button>
              </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>

      {/* Image Viewer Modal */}
      <AnimatePresence>
        {viewingImage && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/90 z-[70]"
              onClick={() => setViewingImage(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="fixed inset-4 z-[70] flex items-center justify-center"
              onClick={() => setViewingImage(null)}
            >
              <button
                onClick={() => setViewingImage(null)}
                className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white"
              >
                <X className="w-6 h-6" />
              </button>
              <Image
                src={viewingImage}
                alt="Full size"
                fill
                className="object-contain p-8"
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
