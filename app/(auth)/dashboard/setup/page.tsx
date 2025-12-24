"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { getSupabaseBrowserClient } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  User,
  Building2,
  Loader2,
  ArrowRight,
  Sparkles,
  Check,
} from "lucide-react";

type AccountType = "independent" | "business";

function SetupContent() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [authUser, setAuthUser] = useState<{ id: string; email: string } | null>(null);
  
  const [formData, setFormData] = useState({
    accountType: "independent" as AccountType,
    displayName: "",
    stageName: "",
    phone: "",
  });

  // Check if user is authenticated
  useEffect(() => {
    const checkAuth = async () => {
      const supabase = getSupabaseBrowserClient();
      
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      console.log("Setup - Session check:", { session: !!session, sessionError });
      
      if (!session) {
        router.push("/dashboard/login");
        return;
      }

      const user = session.user;
      console.log("Setup - Auth user:", { id: user.id, email: user.email });

      // Check if user already has a profile via API (bypasses RLS issues)
      try {
        const response = await fetch("/api/auth/me", {
          credentials: "include",
        });

        console.log("Setup - API response status:", response.status);

        if (response.status === 200) {
          // User already exists - redirect to dashboard
          const data = await response.json();
          console.log("Setup - User exists:", data.user?.role, "- redirecting to dashboard");
          
          // Admin users should NEVER see setup, always redirect
          if (data.user?.role === "admin") {
            console.log("Setup - Admin user detected, redirecting immediately");
          }
          
          router.push("/dashboard");
          return;
        }

        if (response.status === 404) {
          // User needs setup - this is expected on this page
          console.log("Setup - No user found, showing setup form");
          setAuthUser({ id: user.id, email: user.email || "" });
          setIsLoading(false);
          return;
        }

        // Other errors - show setup form anyway (fallback)
        console.error("Setup - Unexpected API status:", response.status);
        setAuthUser({ id: user.id, email: user.email || "" });
        setIsLoading(false);
      } catch (err) {
        console.error("Setup - API error:", err);
        setAuthUser({ id: user.id, email: user.email || "" });
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  const handleComplete = async () => {
    if (!authUser) return;

    if (!formData.displayName.trim()) {
      toast.error("Please enter your display name");
      return;
    }

    setIsSaving(true);
    try {
      const supabase = getSupabaseBrowserClient();

      // Check if user already exists (might have been created in another tab)
      const { data: existingUserById } = await supabase
        .from("dashboard_users")
        .select("id")
        .eq("auth_user_id", authUser.id)
        .maybeSingle();
      
      const existingUser = existingUserById || (await supabase
        .from("dashboard_users")
        .select("id")
        .eq("email", authUser.email)
        .maybeSingle()).data;

      if (existingUser) {
        toast.success("Account already set up!");
        router.push("/dashboard");
        return;
      }

      // Create dashboard user record
      const { data: dashboardUser, error } = await supabase
        .from("dashboard_users")
        .insert({
          auth_user_id: authUser.id,
          email: authUser.email,
          display_name: formData.displayName,
          role: formData.accountType,
          enabled: true,
        })
        .select()
        .single();

      if (error) {
        console.error("Dashboard user insert error:", error.message, error.details, error.hint, error.code);
        toast.error(error.message || "Failed to create account");
        return;
      }

      // If independent, also create a creator record
      if (formData.accountType === "independent") {
        const { data: creator, error: creatorError } = await supabase
          .from("creators")
          .insert({
            username: formData.stageName || formData.displayName.toLowerCase().replace(/\s+/g, '_'),
            group_id: crypto.randomUUID(),
            storage_folder: `creators/${crypto.randomUUID()}`,
            enabled: true,
          })
          .select()
          .single();

        if (creatorError) {
          console.error("Error creating creator:", creatorError.message, creatorError.details);
        } else if (creator) {
          // Link creator to dashboard user
          await supabase
            .from("dashboard_users")
            .update({ creator_id: creator.id })
            .eq("id", dashboardUser.id);
        }
      }

      // If business, create a studio record
      if (formData.accountType === "business") {
        const { data: studio, error: studioError } = await supabase
          .from("studios")
          .insert({
            name: formData.displayName,
            enabled: true,
          })
          .select()
          .single();

        if (studioError) {
          console.error("Error creating studio:", studioError.message, studioError.details);
        } else if (studio) {
          // Link studio to dashboard user
          await supabase
            .from("dashboard_users")
            .update({ studio_id: studio.id })
            .eq("id", dashboardUser.id);
        }
      }

      toast.success("Account setup complete!");
      router.push("/dashboard");
    } catch (err) {
      console.error("Setup error:", err);
      const errorMessage = err instanceof Error ? err.message : "Unknown error occurred";
      toast.error(`Failed to complete setup: ${errorMessage}`);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-brand-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 mb-4">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">
            Welcome to Lovdash
          </h1>
          <p className="text-slate-400">
            Let&apos;s get your creator account set up
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Progress */}
          <div className="px-6 pt-6">
            <div className="flex items-center gap-2 mb-6">
              {[1, 2].map((s) => (
                <div
                  key={s}
                  className={`flex-1 h-1 rounded-full transition-all ${
                    s <= step ? "bg-brand-500" : "bg-slate-200"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Step 1: Account Type */}
          {step === 1 && (
            <div className="p-6 pt-0">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">
                What type of account do you need?
              </h2>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <button
                  onClick={() =>
                    setFormData({ ...formData, accountType: "independent" })
                  }
                  className={`p-6 rounded-xl border-2 transition-all text-left ${
                    formData.accountType === "independent"
                      ? "border-brand-500 bg-brand-50"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <User
                    className={`w-8 h-8 mb-3 ${
                      formData.accountType === "independent"
                        ? "text-brand-600"
                        : "text-slate-400"
                    }`}
                  />
                  <p className="font-semibold text-slate-900">Independent</p>
                  <p className="text-sm text-slate-500 mt-1">
                    Individual content creator
                  </p>
                </button>
                <button
                  onClick={() =>
                    setFormData({ ...formData, accountType: "business" })
                  }
                  className={`p-6 rounded-xl border-2 transition-all text-left ${
                    formData.accountType === "business"
                      ? "border-brand-500 bg-brand-50"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <Building2
                    className={`w-8 h-8 mb-3 ${
                      formData.accountType === "business"
                        ? "text-brand-600"
                        : "text-slate-400"
                    }`}
                  />
                  <p className="font-semibold text-slate-900">Business</p>
                  <p className="text-sm text-slate-500 mt-1">
                    Manage multiple creators
                  </p>
                </button>
              </div>
              <Button
                onClick={() => setStep(2)}
                className="w-full bg-brand-600 hover:bg-brand-700"
              >
                Continue
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          )}

          {/* Step 2: Profile Info */}
          {step === 2 && (
            <div className="p-6 pt-0">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">
                Tell us about yourself
              </h2>

              <div className="space-y-4 mb-6">
                <div className="space-y-2">
                  <Label htmlFor="displayName">
                    {formData.accountType === "business" ? "Business Name" : "Display Name"} *
                  </Label>
                  <Input
                    id="displayName"
                    value={formData.displayName}
                    onChange={(e) =>
                      setFormData({ ...formData, displayName: e.target.value })
                    }
                    placeholder={
                      formData.accountType === "business"
                        ? "Your Business Name"
                        : "Your Name"
                    }
                  />
                </div>

                {formData.accountType === "independent" && (
                  <div className="space-y-2">
                    <Label htmlFor="stageName">Stage Name (optional)</Label>
                    <Input
                      id="stageName"
                      value={formData.stageName}
                      onChange={(e) =>
                        setFormData({ ...formData, stageName: e.target.value })
                      }
                      placeholder="Your creator name"
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone (optional)</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    placeholder="+1 234 567 8900"
                  />
                </div>

                <div className="bg-slate-50 rounded-lg p-4">
                  <p className="text-sm text-slate-600">
                    <span className="font-medium">Email:</span> {authUser?.email}
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setStep(1)}
                  className="flex-1"
                >
                  Back
                </Button>
                <Button
                  onClick={handleComplete}
                  disabled={isSaving || !formData.displayName.trim()}
                  className="flex-1 bg-brand-600 hover:bg-brand-700"
                >
                  {isSaving ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Check className="w-4 h-4 mr-2" />
                  )}
                  Complete Setup
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <p className="text-center text-slate-500 text-sm mt-6">
          Need help?{" "}
          <a href="mailto:support@Lovdash.com" className="text-brand-400 hover:text-brand-300">
            Contact support
          </a>
        </p>
      </motion.div>
    </div>
  );
}

export default function SetupPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-brand-500 animate-spin" />
      </div>
    }>
      <SetupContent />
    </Suspense>
  );
}

