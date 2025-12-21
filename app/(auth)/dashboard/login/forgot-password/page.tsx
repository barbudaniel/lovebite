"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  Mail,
  ArrowLeft,
  Loader2,
  Sparkles,
  CheckCircle,
  KeyRound,
} from "lucide-react";

export default function ForgotPasswordPage() {
  const [step, setStep] = useState<"email" | "code" | "success">("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [retryAfter, setRetryAfter] = useState(0);

  // Countdown timer for retry
  useState(() => {
    if (retryAfter > 0) {
      const timer = setInterval(() => {
        setRetryAfter((prev) => Math.max(0, prev - 1));
      }, 1000);
      return () => clearInterval(timer);
    }
  });

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email address");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/auth/send-password-reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.status === 429) {
        setRetryAfter(data.retryAfter || 60);
        toast.error(`Please wait ${data.retryAfter || 60} seconds before trying again`);
        return;
      }

      if (!response.ok) {
        throw new Error(data.error || "Failed to send reset code");
      }

      setStep("code");
      toast.success("If an account exists, you'll receive a reset code!");
    } catch (err: unknown) {
      const error = err as Error;
      console.error("Reset password error:", error);
      // Still show success to prevent email enumeration
      setStep("code");
      toast.success("If an account exists, you'll receive a reset code!");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code || code.length !== 6) {
      toast.error("Please enter the 6-digit code");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`/api/auth/reset-password?email=${encodeURIComponent(email)}&code=${code}`);
      const data = await response.json();

      if (data.valid) {
        // Redirect to reset password page with code
        window.location.href = `/dashboard/login/reset-password?email=${encodeURIComponent(email)}&code=${code}`;
      } else {
        toast.error("Invalid or expired code. Please try again.");
      }
    } catch (err) {
      console.error("Verify code error:", err);
      toast.error("Failed to verify code");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (retryAfter > 0) return;
    
    setIsLoading(true);
    try {
      const response = await fetch("/api/auth/send-password-reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.status === 429) {
        setRetryAfter(data.retryAfter || 60);
        toast.error(`Please wait ${data.retryAfter || 60} seconds`);
        return;
      }

      toast.success("New code sent!");
      setRetryAfter(60);
    } catch (err) {
      console.error("Resend error:", err);
      toast.error("Failed to resend code");
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
          {step === "email" && (
            <>
              <div className="text-center mb-6">
                <div className="w-14 h-14 bg-brand-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <KeyRound className="w-7 h-7 text-brand-400" />
                </div>
                <h2 className="text-xl font-bold text-white">Reset your password</h2>
                <p className="text-slate-400 text-sm mt-1">
                  Enter your email and we&apos;ll send you a reset code
                </p>
              </div>

              <form onSubmit={handleSendCode} className="space-y-4">
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

                <Button
                  type="submit"
                  disabled={isLoading || retryAfter > 0}
                  className="w-full bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-700 hover:to-brand-600 text-white shadow-lg shadow-brand-600/25"
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : retryAfter > 0 ? (
                    `Wait ${retryAfter}s`
                  ) : (
                    "Send Reset Code"
                  )}
                </Button>

                <Link
                  href="/dashboard/login"
                  className="flex items-center justify-center gap-2 w-full text-sm text-slate-400 hover:text-white transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to login
                </Link>
              </form>
            </>
          )}

          {step === "code" && (
            <>
              <div className="text-center mb-6">
                <div className="w-14 h-14 bg-green-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-7 h-7 text-green-400" />
                </div>
                <h2 className="text-xl font-bold text-white">Check your email</h2>
                <p className="text-slate-400 text-sm mt-1">
                  Enter the 6-digit code sent to<br />
                  <span className="text-white font-medium">{email}</span>
                </p>
              </div>

              <form onSubmit={handleVerifyCode} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="code" className="text-slate-300">
                    Verification Code
                  </Label>
                  <Input
                    id="code"
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    placeholder="000000"
                    maxLength={6}
                    className="text-center text-2xl tracking-[0.5em] bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-brand-500 focus:ring-brand-500 font-mono"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isLoading || code.length !== 6}
                  className="w-full bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-700 hover:to-brand-600 text-white shadow-lg shadow-brand-600/25"
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    "Verify Code"
                  )}
                </Button>

                <div className="flex items-center justify-between text-sm">
                  <button
                    type="button"
                    onClick={() => setStep("email")}
                    className="text-slate-400 hover:text-white transition-colors"
                  >
                    Change email
                  </button>
                  <button
                    type="button"
                    onClick={handleResendCode}
                    disabled={retryAfter > 0 || isLoading}
                    className={`transition-colors ${
                      retryAfter > 0
                        ? "text-slate-500 cursor-not-allowed"
                        : "text-brand-400 hover:text-brand-300"
                    }`}
                  >
                    {retryAfter > 0 ? `Resend in ${retryAfter}s` : "Resend code"}
                  </button>
                </div>
              </form>
            </>
          )}

          {step === "success" && (
            <div className="text-center py-4">
              <div className="w-16 h-16 bg-green-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-400" />
              </div>
              <h2 className="text-xl font-bold text-white mb-2">Code Verified!</h2>
              <p className="text-slate-400 text-sm mb-6">
                Redirecting you to reset your password...
              </p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
