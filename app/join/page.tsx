"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { getSupabaseBrowserClient } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Check,
  X,
  Loader2,
  User,
  Mail,
  Lock,
  AtSign,
  Link2,
  Shield,
  Heart,
  Zap,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { Suspense } from "react";

// Debounce hook
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}

const benefits = [
  { icon: Heart, text: "Custom bio link page", color: "text-rose-500" },
  { icon: Zap, text: "Media management tools", color: "text-amber-500" },
  { icon: Shield, text: "Professional support", color: "text-emerald-500" },
  { icon: Sparkles, text: "AI-powered analytics", color: "text-violet-500" },
];

function JoinPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const refId = searchParams.get("ref");
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);
  const [usernameError, setUsernameError] = useState<string | null>(null);
  const [existingOnboarding, setExistingOnboarding] = useState<{
    id: string;
    email: string;
    stage_name?: string;
    full_name?: string;
  } | null>(null);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    displayName: "",
    stageName: "",
  });

  // Load existing onboarding data if ref is provided
  useEffect(() => {
    if (refId) {
      const loadOnboarding = async () => {
        const supabase = getSupabaseBrowserClient();
        const { data } = await supabase
          .from("creator_onboardings")
          .select("id, email, stage_name, full_name")
          .eq("id", refId)
          .single();

        if (data) {
          setExistingOnboarding(data);
          setFormData((prev) => ({
            ...prev,
            email: data.email || "",
            displayName: data.full_name || "",
            stageName: data.stage_name || "",
            username: data.stage_name?.toLowerCase().replace(/\s+/g, "") || "",
          }));
        }
      };
      loadOnboarding();
    }
  }, [refId]);

  const debouncedUsername = useDebounce(formData.username, 500);

  // Check username availability
  const checkUsername = useCallback(async (username: string) => {
    // Import and use validation from shared utility
    const { validateUsername, isReservedUsername } = await import("@/lib/reserved-usernames");
    
    if (!username || username.length < 3) {
      setUsernameAvailable(null);
      setUsernameError(username.length > 0 ? "Username must be at least 3 characters" : null);
      return;
    }

    // Validate format and reserved names
    const validationError = validateUsername(username);
    if (validationError) {
      setUsernameAvailable(false);
      setUsernameError(validationError);
      return;
    }

    setIsCheckingUsername(true);
    setUsernameError(null);

    try {
      const supabase = getSupabaseBrowserClient();

      // Check both bio_links (slugs) and creators (usernames)
      const [{ data: bioLink }, { data: creator }] = await Promise.all([
        supabase.from("bio_links").select("id").eq("slug", username).single(),
        supabase.from("creators").select("id").eq("username", username).single(),
      ]);

      // If either exists, username is taken
      const isTaken = !!bioLink || !!creator;
      setUsernameAvailable(!isTaken);
      setUsernameError(isTaken ? "This username is already taken" : null);
    } catch (error) {
      // PGRST116 means no row found, which means username is available
      setUsernameAvailable(true);
      setUsernameError(null);
    } finally {
      setIsCheckingUsername(false);
    }
  }, []);

  useEffect(() => {
    if (debouncedUsername) {
      checkUsername(debouncedUsername);
    }
  }, [debouncedUsername, checkUsername]);

  const handleNext = () => {
    if (step === 1) {
      if (!formData.username || !usernameAvailable) {
        toast.error("Please enter a valid, available username");
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (!formData.email || !formData.password) {
        toast.error("Please fill in all fields");
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        toast.error("Passwords do not match");
        return;
      }
      if (formData.password.length < 6) {
        toast.error("Password must be at least 6 characters");
        return;
      }
      setStep(3);
    }
  };

  const handleSubmit = async () => {
    if (!formData.displayName) {
      toast.error("Please enter your display name");
      return;
    }

    setIsLoading(true);

    try {
      const supabase = getSupabaseBrowserClient();

      // 1. Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          emailRedirectTo: `${window.location.origin}/dashboard`,
        },
      });

      if (authError) throw authError;

      if (!authData.user) {
        throw new Error("Failed to create account");
      }

      // 2. Create creator record
      const { data: creator, error: creatorError } = await supabase
        .from("creators")
        .insert({
          username: formData.username,
          group_id: crypto.randomUUID(),
          storage_folder: `creators/${formData.username}`,
          bio_link: formData.username,
          enabled: true,
        })
        .select()
        .single();

      if (creatorError) throw creatorError;

      // 3. Create dashboard user
      const { error: dashboardError } = await supabase.from("dashboard_users").insert({
        auth_user_id: authData.user.id,
        email: formData.email,
        display_name: formData.displayName,
        role: "independent",
        creator_id: creator.id,
        enabled: true,
      });

      if (dashboardError) throw dashboardError;

      // 4. Create bio link
      const { error: bioError } = await supabase.from("bio_links").insert({
        creator_id: creator.id,
        slug: formData.username,
        name: formData.stageName || formData.displayName,
        tagline: "Content Creator",
        is_published: false,
      });

      if (bioError) throw bioError;

      // 5. Update or create onboarding record
      if (existingOnboarding) {
        // Update existing onboarding with link to creator
        await supabase
          .from("creator_onboardings")
          .update({
            status: "in_progress",
            linked_creator_id: creator.id,
          })
          .eq("id", existingOnboarding.id);
      } else {
        // Create new onboarding entry
        await supabase.from("creator_onboardings").insert({
          email: formData.email,
          stage_name: formData.stageName || formData.displayName,
          status: "in_progress",
          linked_creator_id: creator.id,
        });
      }

      toast.success("Account created! Welcome to Lovebite!");

      // Redirect based on session
      if (authData.session) {
        router.push("/dashboard");
      } else {
        toast.info("Please check your email to verify your account");
        router.push("/dashboard/login");
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast.error(error instanceof Error ? error.message : "Failed to create account");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex">
      {/* Left side - Benefits */}
      <div className="hidden lg:flex lg:w-1/2 items-center justify-center p-12">
        <div className="max-w-md">
          <Link href="/" className="inline-flex items-center gap-3 mb-12">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Lovebite</h1>
              <p className="text-xs text-slate-400">Creator Platform</p>
            </div>
          </Link>

          <h2 className="text-4xl font-black text-white mb-6">
            Start your creator journey today
          </h2>
          <p className="text-lg text-slate-400 mb-10">
            Get your personalized bio link, manage your content, and grow your audience with our professional tools.
          </p>

          <div className="space-y-4">
            {benefits.map((benefit, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center gap-4 bg-white/5 rounded-xl p-4"
              >
                <div className={`p-2 rounded-lg bg-white/10 ${benefit.color}`}>
                  <benefit.icon className="w-5 h-5" />
                </div>
                <span className="text-white font-medium">{benefit.text}</span>
              </motion.div>
            ))}
          </div>

          <div className="mt-12 flex items-center gap-4 text-sm text-slate-500">
            <Shield className="w-4 h-4" />
            <span>Your data is secure and never shared</span>
          </div>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-8">
            <Link href="/" className="inline-flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">Lovebite</span>
            </Link>
          </div>

          {/* Progress */}
          <div className="flex items-center gap-2 mb-8">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`flex-1 h-1.5 rounded-full transition-all ${
                  s <= step ? "bg-brand-500" : "bg-slate-700"
                }`}
              />
            ))}
          </div>

          {/* Card */}
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/10 p-8">
            <AnimatePresence mode="wait">
              {/* Step 1: Choose Username */}
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="text-center">
                    <div className="w-14 h-14 bg-brand-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Link2 className="w-7 h-7 text-brand-400" />
                    </div>
                    <h2 className="text-xl font-bold text-white">
                      Claim your bio link
                    </h2>
                    <p className="text-slate-400 mt-1">
                      Choose a unique username for your profile
                    </p>
                  </div>

                  <div className="space-y-3">
                    <Label className="text-slate-300">Your bio link</Label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm">
                        lovebite.bio/
                      </span>
                      <Input
                        value={formData.username}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            username: e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ""),
                          })
                        }
                        placeholder="yourusername"
                        className="pl-[100px] pr-12 h-12 bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500"
                      />
                      <div className="absolute right-4 top-1/2 -translate-y-1/2">
                        {isCheckingUsername && (
                          <Loader2 className="w-5 h-5 text-slate-400 animate-spin" />
                        )}
                        {!isCheckingUsername && usernameAvailable === true && (
                          <Check className="w-5 h-5 text-green-500" />
                        )}
                        {!isCheckingUsername && usernameAvailable === false && (
                          <X className="w-5 h-5 text-red-500" />
                        )}
                      </div>
                    </div>
                    {usernameError && (
                      <p className="text-red-400 text-sm flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {usernameError}
                      </p>
                    )}
                    {usernameAvailable && !usernameError && (
                      <p className="text-green-400 text-sm flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4" />
                        Username is available!
                      </p>
                    )}
                  </div>

                  <Button
                    onClick={handleNext}
                    disabled={!usernameAvailable}
                    className="w-full h-12 bg-brand-600 hover:bg-brand-700 text-white"
                  >
                    Continue
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>

                  <p className="text-center text-sm text-slate-500">
                    Already have an account?{" "}
                    <Link href="/dashboard/login" className="text-brand-400 hover:text-brand-300">
                      Sign in
                    </Link>
                  </p>
                </motion.div>
              )}

              {/* Step 2: Account Details */}
              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="text-center">
                    <div className="w-14 h-14 bg-brand-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Lock className="w-7 h-7 text-brand-400" />
                    </div>
                    <h2 className="text-xl font-bold text-white">
                      Create your account
                    </h2>
                    <p className="text-slate-400 mt-1">
                      Secure your profile with login credentials
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-slate-300">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <Input
                          type="email"
                          value={formData.email}
                          onChange={(e) =>
                            setFormData({ ...formData, email: e.target.value })
                          }
                          placeholder="your@email.com"
                          className="pl-11 h-11 bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-slate-300">Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <Input
                          type="password"
                          value={formData.password}
                          onChange={(e) =>
                            setFormData({ ...formData, password: e.target.value })
                          }
                          placeholder="••••••••"
                          className="pl-11 h-11 bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-slate-300">Confirm Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <Input
                          type="password"
                          value={formData.confirmPassword}
                          onChange={(e) =>
                            setFormData({ ...formData, confirmPassword: e.target.value })
                          }
                          placeholder="••••••••"
                          className="pl-11 h-11 bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      onClick={() => setStep(1)}
                      className="flex-1 h-11 border-slate-700 text-slate-300 hover:bg-slate-800"
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Back
                    </Button>
                    <Button
                      onClick={handleNext}
                      className="flex-1 h-11 bg-brand-600 hover:bg-brand-700 text-white"
                    >
                      Continue
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Profile */}
              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="text-center">
                    <div className="w-14 h-14 bg-brand-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <User className="w-7 h-7 text-brand-400" />
                    </div>
                    <h2 className="text-xl font-bold text-white">
                      Complete your profile
                    </h2>
                    <p className="text-slate-400 mt-1">
                      Tell us a bit about yourself
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-slate-300">Display Name *</Label>
                      <Input
                        value={formData.displayName}
                        onChange={(e) =>
                          setFormData({ ...formData, displayName: e.target.value })
                        }
                        placeholder="Your real name"
                        className="h-11 bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-slate-300">Stage Name (optional)</Label>
                      <Input
                        value={formData.stageName}
                        onChange={(e) =>
                          setFormData({ ...formData, stageName: e.target.value })
                        }
                        placeholder="Your creator name"
                        className="h-11 bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500"
                      />
                      <p className="text-xs text-slate-500">
                        This will be shown on your bio link page
                      </p>
                    </div>
                  </div>

                  {/* Preview */}
                  <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
                    <p className="text-xs text-slate-500 mb-2">Your bio link preview</p>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-brand-500/20 flex items-center justify-center">
                        <User className="w-5 h-5 text-brand-400" />
                      </div>
                      <div>
                        <p className="font-medium text-white">
                          {formData.stageName || formData.displayName || "Your Name"}
                        </p>
                        <p className="text-sm text-slate-400">
                          lovebite.bio/{formData.username}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      onClick={() => setStep(2)}
                      className="flex-1 h-11 border-slate-700 text-slate-300 hover:bg-slate-800"
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Back
                    </Button>
                    <Button
                      onClick={handleSubmit}
                      disabled={isLoading || !formData.displayName}
                      className="flex-1 h-11 bg-brand-600 hover:bg-brand-700 text-white"
                    >
                      {isLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4 mr-2" />
                          Create Account
                        </>
                      )}
                    </Button>
                  </div>

                  <p className="text-center text-xs text-slate-500">
                    By creating an account, you agree to our{" "}
                    <a href="#" className="text-brand-400 hover:underline">Terms</a> and{" "}
                    <a href="#" className="text-brand-400 hover:underline">Privacy Policy</a>
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}

// Wrap in Suspense for useSearchParams
export default function JoinPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-brand-500 animate-spin" />
      </div>
    }>
      <JoinPageContent />
    </Suspense>
  );
}

