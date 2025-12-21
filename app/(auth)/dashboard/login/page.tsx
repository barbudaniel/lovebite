"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "motion/react";
import { getSupabaseBrowserClient } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  Mail,
  Phone,
  ArrowRight,
  Eye,
  EyeOff,
  Loader2,
  MessageCircle,
  Lock,
  Sparkles,
  UserPlus,
} from "lucide-react";

function LoginContent() {
  const [loginMethod, setLoginMethod] = useState<"email" | "phone">("email");
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showVerification, setShowVerification] = useState(false);
  const [generatedCode, setGeneratedCode] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const error = searchParams.get("error");
    if (error === "disabled") {
      toast.error("Your account has been disabled. Please contact support.");
    }
  }, [searchParams]);

  // Check if already logged in (middleware should handle this, but just in case)
  useEffect(() => {
    const checkAuth = async () => {
      const supabase = getSupabaseBrowserClient();
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        window.location.href = "/dashboard";
      }
    };
    checkAuth();
  }, []);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please enter email and password");
      return;
    }

    setIsLoading(true);
    try {
      const supabase = getSupabaseBrowserClient();
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        // Handle different error cases
        if (error.message.includes("Invalid login credentials")) {
          toast.error("Invalid email or password. Please try again.");
          setIsLoading(false);
          return;
        }
        throw error;
      }

      toast.success("Welcome back!");
      // Use window.location for hard redirect to avoid caching issues
      window.location.href = "/dashboard";
    } catch (err: unknown) {
      const error = err as Error;
      console.error("Login error:", error);
      toast.error(error.message || "Invalid email or password");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please enter email and password");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setIsLoading(true);
    try {
      const supabase = getSupabaseBrowserClient();
      
      // Create the auth user (email confirmation disabled in Supabase)
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/dashboard`,
        }
      });

      if (error) throw error;

      if (data.user) {
        // Send our custom verification email
        const verifyResponse = await fetch("/api/auth/send-verification", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        });

        if (!verifyResponse.ok) {
          console.error("Failed to send verification email");
        }

        // Redirect to setup regardless - they can verify later
        toast.success("Account created! Check your email for verification code.");
        window.location.href = "/dashboard/setup";
      }
    } catch (err: unknown) {
      const error = err as Error;
      console.error("Signup error:", error);
      toast.error(error.message || "Failed to create account");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePhoneLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone) {
      toast.error("Please enter your phone number");
      return;
    }

    setIsLoading(true);
    try {
      // Generate a 6-digit code
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      setGeneratedCode(code);

      // Try to send via WhatsApp API (server-side will check bot status)
      const response = await fetch("/api/send-whatsapp-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, code }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        // If bot is offline, show dev code
        if (data.error?.includes("offline") || data.error?.includes("Failed")) {
          toast.info(`WhatsApp unavailable. Dev code: ${code}`);
        } else {
          throw new Error(data.error || "Failed to send code");
        }
      } else {
        toast.success("Verification code sent via WhatsApp!");
      }

      setShowVerification(true);
    } catch (err: unknown) {
      const error = err as Error;
      console.error("Phone login error:", error);
      toast.error(error.message || "Failed to send verification code");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!verificationCode) {
      toast.error("Please enter the verification code");
      return;
    }

    setIsLoading(true);
    try {
      // Verify the code matches
      if (verificationCode !== generatedCode) {
        throw new Error("Invalid verification code");
      }

      // Use our custom phone auth API to get a session token
      const response = await fetch("/api/auth/phone-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Authentication failed");
      }

      // Verify the token to create a session
      if (data.token) {
        const supabase = getSupabaseBrowserClient();
        const { error } = await supabase.auth.verifyOtp({
          token_hash: data.token,
          type: "magiclink",
        });
        
        if (error) {
          console.error("OTP verification error:", error);
          throw new Error("Failed to create session");
        }

        toast.success("Welcome!");
        window.location.href = "/dashboard";
      } else {
        throw new Error("No authentication token received");
      }
    } catch (err: unknown) {
      const error = err as Error;
      console.error("Verification error:", error);
      toast.error(error.message || "Invalid verification code");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-600/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center shadow-lg shadow-brand-600/25">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div className="text-left">
              <h1 className="text-2xl font-bold text-white">Lovebite</h1>
              <p className="text-xs text-slate-400">Creator Dashboard</p>
            </div>
          </Link>
        </div>

        {/* Card */}
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/10 p-8 shadow-xl">
          <div className="text-center mb-6">
            <h2 className="text-xl font-bold text-white">
              {isSignUp ? "Create your account" : "Welcome back"}
            </h2>
            <p className="text-slate-400 text-sm mt-1">
              {isSignUp
                ? "Sign up to access your creator dashboard"
                : "Sign in to your creator dashboard"}
            </p>
          </div>

          {/* Login Method Tabs */}
          <div className="flex bg-slate-800/50 rounded-lg p-1 mb-6">
            <button
              onClick={() => {
                setLoginMethod("email");
                setShowVerification(false);
              }}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                loginMethod === "email"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Mail className="w-4 h-4" />
              Email
            </button>
            <button
              onClick={() => {
                setLoginMethod("phone");
                setShowVerification(false);
              }}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                loginMethod === "phone"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <MessageCircle className="w-4 h-4" />
              WhatsApp
            </button>
          </div>

          {/* Email Login/Signup Form */}
          {loginMethod === "email" && (
            <form onSubmit={isSignUp ? handleEmailSignUp : handleEmailLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-300">
                  Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="pl-10 bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-brand-500 focus:ring-brand-500"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-slate-300">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="pl-10 pr-10 bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-brand-500 focus:ring-brand-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {isSignUp && (
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-slate-300">
                    Confirm Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                      id="confirmPassword"
                      type={showPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="pl-10 bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-brand-500 focus:ring-brand-500"
                    />
                  </div>
                </div>
              )}

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-700 hover:to-brand-600 text-white shadow-lg shadow-brand-600/25"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : isSignUp ? (
                  <>
                    <UserPlus className="w-4 h-4 mr-2" />
                    Create Account
                  </>
                ) : (
                  <>
                    Sign In
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>

              {/* Forgot Password Link */}
              {!isSignUp && (
                <Link
                  href="/dashboard/login/forgot-password"
                  className="block w-full text-center text-sm text-brand-400 hover:text-brand-300 transition-colors"
                >
                  Forgot your password?
                </Link>
              )}

              {/* Toggle Sign Up / Sign In */}
              <button
                type="button"
                onClick={() => setIsSignUp(!isSignUp)}
                className="w-full text-sm text-slate-400 hover:text-white transition-colors"
              >
                {isSignUp
                  ? "Already have an account? Sign in"
                  : "Don't have an account? Sign up"}
              </button>
            </form>
          )}

          {/* Phone Login Form */}
          {loginMethod === "phone" && !showVerification && (
            <form onSubmit={handlePhoneLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-slate-300">
                  Phone Number
                </Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+40 712 345 678"
                    className="pl-10 bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-brand-500 focus:ring-brand-500"
                  />
                </div>
                <p className="text-xs text-slate-500">
                  We&apos;ll send you a verification code via WhatsApp
                </p>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white shadow-lg shadow-green-600/25"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Send Code via WhatsApp
                  </>
                )}
              </Button>
            </form>
          )}

          {/* Verification Form */}
          {loginMethod === "phone" && showVerification && (
            <form onSubmit={handleVerifyCode} className="space-y-4">
              <div className="text-center mb-4">
                <div className="w-12 h-12 bg-green-600/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <MessageCircle className="w-6 h-6 text-green-400" />
                </div>
                <p className="text-sm text-slate-400">
                  Enter the 6-digit code sent to
                </p>
                <p className="font-medium text-white">{phone}</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="code" className="text-slate-300">
                  Verification Code
                </Label>
                <Input
                  id="code"
                  type="text"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  placeholder="123456"
                  maxLength={6}
                  className="text-center text-2xl tracking-[0.5em] bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-brand-500 focus:ring-brand-500"
                />
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-700 hover:to-brand-600 text-white"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    Verify & Sign In
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>

              <button
                type="button"
                onClick={() => setShowVerification(false)}
                className="w-full text-sm text-slate-400 hover:text-white"
              >
                Use different number
              </button>
            </form>
          )}

        </div>

        {/* Footer */}
        <p className="text-center text-xs text-slate-500 mt-6">
          By signing in, you agree to our{" "}
          <a href="#" className="text-brand-400 hover:underline">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="#" className="text-brand-400 hover:underline">
            Privacy Policy
          </a>
        </p>
      </motion.div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-brand-500 animate-spin" />
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}

