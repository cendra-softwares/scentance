"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/lib/auth-context";
import { Eye, EyeOff, Mail, Lock, ArrowLeft, User } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const { signIn, signUp, continueAsGuest } = useAuth();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    const { error: signInError } = await signIn(email, password);

    if (signInError) {
      setError("Invalid email or password. Please try again.");
    } else {
      setMessage("Signed in successfully! Redirecting...");
      window.location.href = "/dashboard";
    }

    setLoading(false);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    const { error: signUpError } = await signUp(email, password);

    if (signUpError) {
      setError("Unable to create account. Please try again.");
    } else {
      setMessage("Check your email for the confirmation link!");
    }

    setLoading(false);
  };

  const handleGuestContinue = async () => {
    setLoading(true);
    await continueAsGuest();
    window.location.href = "/shop";
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <Link
          href="/"
          className="inline-flex items-center text-white/70 hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to home
        </Link>

        <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
          <h1 className="text-3xl font-light text-white mb-2 font-[family-name:var(--font-cormorant-garamond)]">
            Welcome
          </h1>
          <p className="text-white/50 mb-8">Sign in to your account</p>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg mb-6 text-sm">
              {error}
            </div>
          )}

          {message && (
            <div className="bg-green-500/10 border border-green-500/30 text-green-400 px-4 py-3 rounded-lg mb-6 text-sm">
              {message}
            </div>
          )}

          <form onSubmit={handleSignIn} className="space-y-5">
            <div>
              <label className="block text-white/70 text-sm mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-white/30 transition-colors"
                  placeholder="you@example.com"
                  required
                  autoComplete="off"
                  data-temp-mail-org="0"
                />
              </div>
            </div>

            <div>
              <label className="block text-white/70 text-sm mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-12 py-3 text-white placeholder-white/30 focus:outline-none focus:border-white/30 transition-colors"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/70 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-white text-black font-medium py-3 rounded-lg hover:bg-white/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <div className="mt-6 space-y-3">
            <button
              type="button"
              onClick={handleSignUp}
              disabled={loading}
              className="w-full bg-transparent border border-white/20 text-white py-3 rounded-lg hover:bg-white/5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Processing..." : "Create Account"}
            </button>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-white/10"></span>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-neutral-900 px-2 text-white/30">Or</span>
              </div>
            </div>
            <button
              type="button"
              onClick={handleGuestContinue}
              disabled={loading}
              className="w-full bg-white/5 border border-white/10 text-white/70 py-3 rounded-lg hover:bg-white/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <User className="w-4 h-4" />
              Continue as Guest
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
