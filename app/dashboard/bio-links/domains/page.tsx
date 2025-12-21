"use client";

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { useDashboard } from "../../layout";
import { getSupabaseBrowserClient } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import Link from "next/link";
import {
  Globe,
  ArrowLeft,
  Check,
  X,
  Loader2,
  AlertCircle,
  Copy,
  ExternalLink,
  ShoppingCart,
  Search,
  Sparkles,
  Shield,
  Zap,
  RefreshCw,
  ChevronRight,
  Info,
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

interface BioLink {
  id: string;
  creator_id: string;
  slug: string;
  custom_domain: string | null;
}

interface DomainStatus {
  domain: string;
  status: "pending" | "active" | "failed" | "not_configured";
  ssl: boolean;
  dns_configured: boolean;
  last_checked: string;
}

// Domain suggestions
const DOMAIN_EXTENSIONS = [".com", ".me", ".link", ".bio", ".co", ".io"];

// ============================================
// DNS INSTRUCTIONS COMPONENT
// ============================================

function DNSInstructions({ domain }: { domain: string }) {
  const copyValue = (value: string) => {
    navigator.clipboard.writeText(value);
    toast.success("Copied to clipboard!");
  };

  return (
    <div className="space-y-4">
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-amber-800">DNS Configuration Required</p>
            <p className="text-sm text-amber-700 mt-1">
              Add the following DNS records to your domain provider (GoDaddy, Namecheap, Cloudflare, etc.)
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="px-4 py-3 bg-slate-50 border-b border-slate-200">
          <p className="font-medium text-slate-700">DNS Records</p>
        </div>
        <div className="divide-y divide-slate-100">
          {/* CNAME Record */}
          <div className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-slate-500 uppercase">CNAME Record</span>
              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">Required</span>
            </div>
            <div className="grid grid-cols-3 gap-3 text-sm">
              <div>
                <p className="text-xs text-slate-400 mb-1">Type</p>
                <div className="flex items-center gap-2">
                  <code className="bg-slate-100 px-2 py-1 rounded text-slate-700">CNAME</code>
                </div>
              </div>
              <div>
                <p className="text-xs text-slate-400 mb-1">Name/Host</p>
                <div className="flex items-center gap-2">
                  <code className="bg-slate-100 px-2 py-1 rounded text-slate-700">@</code>
                  <button onClick={() => copyValue("@")} className="p-1 hover:bg-slate-100 rounded">
                    <Copy className="w-3 h-3 text-slate-400" />
                  </button>
                </div>
              </div>
              <div>
                <p className="text-xs text-slate-400 mb-1">Value/Target</p>
                <div className="flex items-center gap-2">
                  <code className="bg-slate-100 px-2 py-1 rounded text-slate-700">cname.bites.bio</code>
                  <button onClick={() => copyValue("cname.bites.bio")} className="p-1 hover:bg-slate-100 rounded">
                    <Copy className="w-3 h-3 text-slate-400" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* A Record (Alternative) */}
          <div className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-slate-500 uppercase">A Record (Alternative)</span>
              <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded">If CNAME not supported</span>
            </div>
            <div className="grid grid-cols-3 gap-3 text-sm">
              <div>
                <p className="text-xs text-slate-400 mb-1">Type</p>
                <code className="bg-slate-100 px-2 py-1 rounded text-slate-700">A</code>
              </div>
              <div>
                <p className="text-xs text-slate-400 mb-1">Name/Host</p>
                <div className="flex items-center gap-2">
                  <code className="bg-slate-100 px-2 py-1 rounded text-slate-700">@</code>
                </div>
              </div>
              <div>
                <p className="text-xs text-slate-400 mb-1">Value/IP</p>
                <div className="flex items-center gap-2">
                  <code className="bg-slate-100 px-2 py-1 rounded text-slate-700">76.76.21.21</code>
                  <button onClick={() => copyValue("76.76.21.21")} className="p-1 hover:bg-slate-100 rounded">
                    <Copy className="w-3 h-3 text-slate-400" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <p className="text-xs text-slate-500 text-center">
        DNS changes can take up to 24-48 hours to propagate worldwide
      </p>
    </div>
  );
}

// ============================================
// DOMAIN SEARCH COMPONENT
// ============================================

function DomainSearch({
  onSelectDomain,
}: {
  onSelectDomain: (domain: string) => void;
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<Array<{
    domain: string;
    available: boolean;
    price: number;
  }>>([]);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    
    // Simulate domain availability check
    await new Promise((r) => setTimeout(r, 1500));
    
    const baseName = searchQuery.toLowerCase().replace(/[^a-z0-9-]/g, "");
    const mockResults = DOMAIN_EXTENSIONS.map((ext) => ({
      domain: `${baseName}${ext}`,
      available: Math.random() > 0.4,
      price: Math.floor(Math.random() * 20) + 10,
    }));
    
    setResults(mockResults);
    setIsSearching(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Search for a domain..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="pl-9"
          />
        </div>
        <Button onClick={handleSearch} disabled={isSearching}>
          {isSearching ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            "Search"
          )}
        </Button>
      </div>

      {results.length > 0 && (
        <div className="space-y-2">
          {results.map((result) => (
            <div
              key={result.domain}
              className={`flex items-center justify-between p-4 rounded-xl border ${
                result.available
                  ? "bg-green-50 border-green-200 hover:border-green-300"
                  : "bg-slate-50 border-slate-200 opacity-60"
              } transition-colors`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    result.available ? "bg-green-100" : "bg-slate-100"
                  }`}
                >
                  {result.available ? (
                    <Check className="w-4 h-4 text-green-600" />
                  ) : (
                    <X className="w-4 h-4 text-slate-400" />
                  )}
                </div>
                <div>
                  <p className="font-medium text-slate-900">{result.domain}</p>
                  <p className="text-xs text-slate-500">
                    {result.available ? "Available" : "Taken"}
                  </p>
                </div>
              </div>
              {result.available && (
                <div className="flex items-center gap-3">
                  <span className="font-bold text-slate-900">${result.price}/yr</span>
                  <Button
                    size="sm"
                    onClick={() => onSelectDomain(result.domain)}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <ShoppingCart className="w-4 h-4 mr-1" />
                    Buy
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ============================================
// MAIN PAGE
// ============================================

export default function DomainsPage() {
  const { user } = useDashboard();
  const [bioLink, setBioLink] = useState<BioLink | null>(null);
  const [domainStatus, setDomainStatus] = useState<DomainStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [customDomain, setCustomDomain] = useState("");
  const [showDNS, setShowDNS] = useState(false);
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [selectedDomain, setSelectedDomain] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isChecking, setIsChecking] = useState(false);

  useEffect(() => {
    fetchBioLink();
  }, [user]);

  const fetchBioLink = async () => {
    if (!user?.creator_id) {
      setIsLoading(false);
      return;
    }

    try {
      const supabase = getSupabaseBrowserClient();
      const { data: bio, error } = await supabase
        .from("bio_links")
        .select("id, creator_id, slug, custom_domain")
        .eq("creator_id", user.creator_id)
        .single();

      if (error) throw error;
      setBioLink(bio);
      setCustomDomain(bio.custom_domain || "");
      
      if (bio.custom_domain) {
        // Simulate domain status check
        setDomainStatus({
          domain: bio.custom_domain,
          status: "active",
          ssl: true,
          dns_configured: true,
          last_checked: new Date().toISOString(),
        });
      }
    } catch (err: any) {
      console.error("Error fetching bio link:", err?.message || err);
      toast.error("Failed to load domain settings");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveDomain = async () => {
    if (!bioLink) return;

    const domain = customDomain.trim().toLowerCase().replace(/^https?:\/\//, "").replace(/\/$/, "");
    
    if (!domain) {
      // Remove custom domain
      setIsSaving(true);
      try {
        const supabase = getSupabaseBrowserClient();
        await supabase
          .from("bio_links")
          .update({ custom_domain: null })
          .eq("id", bioLink.id);
        
        setBioLink({ ...bioLink, custom_domain: null });
        setDomainStatus(null);
        toast.success("Custom domain removed");
      } catch (err) {
        toast.error("Failed to remove domain");
      } finally {
        setIsSaving(false);
      }
      return;
    }

    // Validate domain format
    const domainRegex = /^([a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/;
    if (!domainRegex.test(domain)) {
      toast.error("Invalid domain format");
      return;
    }

    setIsSaving(true);
    try {
      const supabase = getSupabaseBrowserClient();
      await supabase
        .from("bio_links")
        .update({ custom_domain: domain })
        .eq("id", bioLink.id);

      setBioLink({ ...bioLink, custom_domain: domain });
      setDomainStatus({
        domain,
        status: "pending",
        ssl: false,
        dns_configured: false,
        last_checked: new Date().toISOString(),
      });
      setShowDNS(true);
      toast.success("Domain saved! Now configure your DNS.");
    } catch (err) {
      toast.error("Failed to save domain");
    } finally {
      setIsSaving(false);
    }
  };

  const checkDNSStatus = async () => {
    if (!domainStatus) return;
    
    setIsChecking(true);
    
    // Simulate DNS check
    await new Promise((r) => setTimeout(r, 2000));
    
    // Randomly set as configured for demo
    const configured = Math.random() > 0.3;
    
    setDomainStatus({
      ...domainStatus,
      dns_configured: configured,
      ssl: configured,
      status: configured ? "active" : "pending",
      last_checked: new Date().toISOString(),
    });
    
    if (configured) {
      toast.success("DNS configured successfully! Your domain is now active.");
    } else {
      toast.info("DNS not configured yet. This can take up to 48 hours.");
    }
    
    setIsChecking(false);
  };

  const handleBuyDomain = (domain: string) => {
    setSelectedDomain(domain);
    setShowBuyModal(true);
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
          You need to be linked to a creator profile to manage domains.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/dashboard/bio-links"
          className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-slate-600" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Domain Management</h1>
          <p className="text-slate-500">Configure custom domains for your bio link</p>
        </div>
      </div>

      {/* Current Domain Status */}
      {domainStatus && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`rounded-2xl p-6 ${
            domainStatus.status === "active"
              ? "bg-green-50 border border-green-200"
              : "bg-amber-50 border border-amber-200"
          }`}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  domainStatus.status === "active" ? "bg-green-100" : "bg-amber-100"
                }`}
              >
                <Globe
                  className={`w-6 h-6 ${
                    domainStatus.status === "active" ? "text-green-600" : "text-amber-600"
                  }`}
                />
              </div>
              <div>
                <p className="font-semibold text-lg text-slate-900">{domainStatus.domain}</p>
                <div className="flex items-center gap-3 mt-1">
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full ${
                      domainStatus.status === "active"
                        ? "bg-green-100 text-green-700"
                        : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {domainStatus.status === "active" ? "Active" : "Pending DNS"}
                  </span>
                  {domainStatus.ssl && (
                    <span className="flex items-center gap-1 text-xs text-green-600">
                      <Shield className="w-3 h-3" />
                      SSL Active
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={checkDNSStatus}
                disabled={isChecking}
              >
                {isChecking ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <RefreshCw className="w-4 h-4" />
                )}
              </Button>
              {domainStatus.status === "active" && (
                <a
                  href={`https://${domainStatus.domain}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button size="sm" variant="outline">
                    <ExternalLink className="w-4 h-4 mr-1" />
                    Visit
                  </Button>
                </a>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={async () => {
                  if (confirm("Are you sure you want to remove this custom domain?")) {
                    setIsSaving(true);
                    try {
                      const supabase = getSupabaseBrowserClient();
                      await supabase
                        .from("bio_links")
                        .update({ custom_domain: null })
                        .eq("id", bioLink?.id);
                      setBioLink(bioLink ? { ...bioLink, custom_domain: null } : null);
                      setDomainStatus(null);
                      setCustomDomain("");
                      toast.success("Custom domain removed");
                    } catch (err) {
                      toast.error("Failed to remove domain");
                    } finally {
                      setIsSaving(false);
                    }
                  }
                }}
                className="text-red-500 hover:text-red-600 hover:bg-red-50"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {domainStatus.status !== "active" && (
            <div className="mt-4 pt-4 border-t border-amber-200">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowDNS(true)}
                className="w-full"
              >
                <Info className="w-4 h-4 mr-2" />
                View DNS Setup Instructions
              </Button>
            </div>
          )}
        </motion.div>
      )}

      {/* Add/Change Domain */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6">
        <h2 className="font-semibold text-slate-900 mb-4">
          {bioLink?.custom_domain ? "Change Custom Domain" : "Add Custom Domain"}
        </h2>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Your Domain</Label>
            <div className="flex gap-2">
              <Input
                placeholder="yourdomain.com"
                value={customDomain}
                onChange={(e) => setCustomDomain(e.target.value)}
              />
              <Button onClick={handleSaveDomain} disabled={isSaving}>
                {isSaving ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  "Save"
                )}
              </Button>
            </div>
            <p className="text-xs text-slate-500">
              Enter a domain you already own, or purchase one below
            </p>
          </div>
        </div>
      </div>

      {/* Buy New Domain */}
      <div className="bg-gradient-to-r from-violet-50 to-pink-50 rounded-2xl border border-violet-200 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="font-semibold text-slate-900">Need a Domain?</h2>
            <p className="text-sm text-slate-500">Search and purchase your perfect domain</p>
          </div>
        </div>

        <DomainSearch onSelectDomain={handleBuyDomain} />
      </div>

      {/* Features */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-4 text-center">
          <Shield className="w-8 h-8 text-green-500 mx-auto mb-2" />
          <p className="font-medium text-slate-900">Free SSL</p>
          <p className="text-xs text-slate-500">Automatic HTTPS</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4 text-center">
          <Zap className="w-8 h-8 text-amber-500 mx-auto mb-2" />
          <p className="font-medium text-slate-900">Fast Setup</p>
          <p className="text-xs text-slate-500">Minutes to configure</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4 text-center">
          <Globe className="w-8 h-8 text-blue-500 mx-auto mb-2" />
          <p className="font-medium text-slate-900">Global CDN</p>
          <p className="text-xs text-slate-500">Fast worldwide</p>
        </div>
      </div>

      {/* DNS Instructions Modal */}
      {showDNS && domainStatus && (
        <Dialog open={showDNS} onOpenChange={setShowDNS}>
          <DialogContent size="lg">
            <DialogHeader>
              <DialogTitle>DNS Configuration</DialogTitle>
              <DialogDescription>
                Configure DNS for {domainStatus.domain}
              </DialogDescription>
            </DialogHeader>
            <DialogBody>
              <DNSInstructions domain={domainStatus.domain} />
            </DialogBody>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowDNS(false)}>
                Close
              </Button>
              <Button onClick={checkDNSStatus} disabled={isChecking}>
                {isChecking && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Verify DNS
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Buy Domain Modal */}
      {showBuyModal && selectedDomain && (
        <Dialog open={showBuyModal} onOpenChange={setShowBuyModal}>
          <DialogContent size="md">
            <DialogHeader>
              <DialogTitle>Purchase Domain</DialogTitle>
              <DialogDescription>
                You're about to purchase {selectedDomain}
              </DialogDescription>
            </DialogHeader>
            <DialogBody>
              <div className="space-y-4">
                <div className="bg-slate-50 rounded-xl p-4 text-center">
                  <p className="text-2xl font-bold text-slate-900">{selectedDomain}</p>
                  <p className="text-slate-500 mt-1">Annual registration</p>
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <Info className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm text-amber-800">
                        Domain purchases are handled by our partner registrar. 
                        You'll be redirected to complete the purchase.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                  <span className="text-slate-600">Total (1 year)</span>
                  <span className="text-xl font-bold text-slate-900">$14.99</span>
                </div>
              </div>
            </DialogBody>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowBuyModal(false)}>
                Cancel
              </Button>
              <Button
                className="bg-green-600 hover:bg-green-700"
                onClick={() => {
                  toast.info("Redirecting to payment...");
                  setShowBuyModal(false);
                  // In production, redirect to payment provider
                }}
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                Continue to Payment
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

