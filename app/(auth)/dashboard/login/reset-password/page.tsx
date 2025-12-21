"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Loader2,
  Sparkles,
  CheckCircle,
  XCircle,
  KeyRound,
} from "lucide-react";

function ResetPasswordContent() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();

  const email = searchParams.get("email");
  const code = searchParams.get("code");

  // Validate the code on mount
  useEffect(() => {
    const validateCode = async () => {
      if (!email || !code) {
        setIsError(true);
        setErrorMessage("Invalid password reset link. Please request a new one.");
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `/api/auth/reset-password?email=${encodeURIComponent(email)}&code=${code}`
        );
        const data = await response.json();

        if (!data.valid) {
          setIsError(true);
          setErrorMessage("This reset code has expired or is invalid. Please request a new one.");
        }
      } catch (err) {
        console.error("Validation error:", err);
        setIsError(true);
        setErrorMessage("Failed to validate reset code. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    validateCode();
  }, [email, code]);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!password) {
      toast.error("Please enter a new password");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          code,
          newPassword: password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to reset password");
      }

      setIsSuccess(true);
      toast.success("Password updated successfully!");

      // Redirect to login after a delay
      setTimeout(() => {
        router.push("/dashboard/login");
      }, 2000);
    } catch (err: unknown) {
      const error = err as Error;
      console.error("Reset password error:", error);
      toast.error(error.message || "Failed to update password");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <Loader2 className="w-8 h-8 text-brand-500 animate-spin mx-auto mb-4" />
          <p className="text-slate-400">Validating reset code...</p>
        </motion.div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-4">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-600/20 rounded-full blur-3xl" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative w-full max-w-md"
        >
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/10 p-8 shadow-xl text-center">
            <div className="w-16 h-16 bg-red-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <XCircle className="w-8 h-8 text-red-400" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">Invalid or Expired Code</h2>
            <p className="text-slate-400 text-sm mb-6">{errorMessage}</p>
            <Link
              href="/dashboard/login/forgot-password"
              className="inline-flex items-center gap-2 text-brand-400 hover:text-brand-300 transition-colors"
            >
              Request a new reset code
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-4">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-green-600/20 rounded-full blur-3xl" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative w-full max-w-md"
        >
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/10 p-8 shadow-xl text-center">
            <div className="w-16 h-16 bg-green-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-400" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">Password Updated!</h2>
            <p className="text-slate-400 text-sm mb-6">
              Your password has been reset successfully.<br />
              Redirecting to login...
            </p>
            <Loader2 className="w-6 h-6 animate-spin mx-auto text-brand-400" />
          </div>
        </motion.div>
      </div>
    );
  }

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
            <div className="w-14 h-14 bg-brand-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <KeyRound className="w-7 h-7 text-brand-400" />
            </div>
            <h2 className="text-xl font-bold text-white">Create new password</h2>
            <p className="text-slate-400 text-sm mt-1">
              Enter your new password below
            </p>
          </div>

          <form onSubmit={handleResetPassword} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password" className="text-slate-300">
                New Password
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
              <p className="text-xs text-slate-500">
                At least 6 characters
              </p>
            </div>

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

            {password && confirmPassword && password !== confirmPassword && (
              <p className="text-sm text-red-400">
                Passwords do not match
              </p>
            )}

            <Button
              type="submit"
              disabled={isSubmitting || !password || password !== confirmPassword}
              className="w-full bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-700 hover:to-brand-600 text-white shadow-lg shadow-brand-600/25"
            >
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  Update Password
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>

            <Link
              href="/dashboard/login"
              className="block w-full text-center text-sm text-slate-400 hover:text-white transition-colors"
            >
              Back to login
            </Link>
          </form>
        </div>
      </motion.div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-brand-500 animate-spin" />
        </div>
      }
    >
      <ResetPasswordContent />
    </Suspense>
  );
}
