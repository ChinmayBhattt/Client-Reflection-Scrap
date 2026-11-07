"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { LogIn, Loader2, Mail, Lock, Phone } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { loginWithEmail } from "@/app/auth/actions";

export function LoginClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/dashboard";
  const errorParam = searchParams.get("error");

  const [isLoading, setIsLoading] = React.useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = React.useState(false);
  const [authMode, setAuthMode] = React.useState<"email" | "phone">("email");

  // Phone OTP states (behind feature flag)
  const enablePhoneOtp = process.env.NEXT_PUBLIC_ENABLE_PHONE_OTP === "true";
  const [phoneNumber, setPhoneNumber] = React.useState("");
  const [otpSent, setOtpSent] = React.useState(false);
  const [otpCode, setOtpCode] = React.useState("");

  React.useEffect(() => {
    if (errorParam === "unauthorized_admin") {
      toast.error("You must have admin privileges to access that section.");
    } else if (errorParam === "auth_exchange_failed") {
      toast.error("Authentication session exchange failed. Please try again.");
    }
  }, [errorParam]);

  const handleEmailLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      formData.set("next", next);
      const res = await loginWithEmail(formData);

      if (res && !res.success) {
        toast.error(res.error || "Login failed");
        setIsLoading(false);
      }
      // If successful, loginWithEmail redirects via server action
    } catch {
      // Handled by Next.js redirect
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setIsGoogleLoading(true);
      const supabase = createClient();
      if (!supabase) {
        toast.error("Supabase credentials not configured yet.");
        setIsGoogleLoading(false);
        return;
      }

      const redirectTo = `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`;
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo,
        },
      });

      if (error) {
        toast.error(error.message);
        setIsGoogleLoading(false);
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Google sign-in error";
      toast.error(message);
      setIsGoogleLoading(false);
    }
  };

  const handleSendPhoneOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber || phoneNumber.length < 10) {
      toast.error("Please enter a valid 10-digit mobile number");
      return;
    }
    toast.info("Phone OTP is behind a feature flag and requires an SMS provider configured in Supabase.");
    setOtpSent(true);
  };

  const handleVerifyPhoneOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    toast.error("SMS provider not configured on this environment. Please log in with email & password.");
  };

  return (
    <Card className="w-full max-w-md mx-auto rounded-3xl border border-brand-border bg-white shadow-elevated overflow-hidden">
      <CardHeader className="text-center space-y-2 pb-6 border-b border-brand-border/60">
        <div className="h-12 w-12 rounded-2xl bg-brand-blue-light text-brand-blue flex items-center justify-center mx-auto">
          <LogIn className="h-6 w-6" />
        </div>
        <CardTitle className="text-2xl font-extrabold text-brand-dark">
          Welcome Back
        </CardTitle>
        <CardDescription className="text-sm text-brand-muted">
          Log in to manage your scrap pickups, addresses, and payouts.
        </CardDescription>
      </CardHeader>

      <CardContent className="p-6 md:p-8 space-y-6">
        {/* Google OAuth Button */}
        <Button
          type="button"
          variant="outline"
          onClick={handleGoogleLogin}
          disabled={isGoogleLoading || isLoading}
          className="w-full h-12 gap-3 text-sm font-semibold border-brand-border hover:bg-gray-50"
        >
          {isGoogleLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <svg className="h-4 w-4" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                fill="#EA4335"
              />
            </svg>
          )}
          <span>Continue with Google</span>
        </Button>

        <div className="relative flex items-center justify-center">
          <div className="border-t border-brand-border w-full" />
          <span className="bg-white px-3 text-xs uppercase font-bold text-brand-muted shrink-0">
            Or with email
          </span>
          <div className="border-t border-brand-border w-full" />
        </div>

        {/* Feature Flag Toggle for Phone OTP */}
        {enablePhoneOtp && (
          <div className="flex rounded-xl bg-gray-100 p-1 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setAuthMode("email")}
              className={`flex-1 py-1.5 rounded-lg transition-colors ${
                authMode === "email" ? "bg-white text-brand-dark shadow-sm" : "text-brand-muted"
              }`}
            >
              Email & Password
            </button>
            <button
              type="button"
              onClick={() => setAuthMode("phone")}
              className={`flex-1 py-1.5 rounded-lg transition-colors ${
                authMode === "phone" ? "bg-white text-brand-dark shadow-sm" : "text-brand-muted"
              }`}
            >
              Phone OTP
            </button>
          </div>
        )}

        {authMode === "email" ? (
          <form onSubmit={handleEmailLogin} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-brand-muted" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="name@example.com"
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link
                  href="/forgot-password"
                  className="text-xs font-bold text-brand-blue hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-brand-muted" />
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  placeholder="••••••••"
                  className="pl-10"
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 font-bold gap-2"
              size="lg"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Logging In...</span>
                </>
              ) : (
                <span>Log In to Account</span>
              )}
            </Button>
          </form>
        ) : (
          /* Phone OTP Flow */
          <div className="space-y-4">
            {!otpSent ? (
              <form onSubmit={handleSendPhoneOtp} className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="phone">Mobile Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-3.5 h-4 w-4 text-brand-muted" />
                    <Input
                      id="phone"
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="98200 12345"
                      className="pl-10"
                    />
                  </div>
                </div>
                <Button type="submit" className="w-full h-12 font-bold">
                  Send OTP Code
                </Button>
              </form>
            ) : (
              <form onSubmit={handleVerifyPhoneOtp} className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="otp">Enter 6-digit OTP</Label>
                  <Input
                    id="otp"
                    type="text"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    placeholder="123456"
                    className="text-center font-mono tracking-widest text-lg"
                  />
                </div>
                <Button type="submit" className="w-full h-12 font-bold">
                  Verify & Log In
                </Button>
              </form>
            )}
          </div>
        )}

        <div className="text-center text-xs text-brand-muted pt-2 border-t border-brand-border/60">
          Don&apos;t have an account yet?{" "}
          <Link
            href={`/signup${next ? `?next=${encodeURIComponent(next)}` : ""}`}
            className="font-bold text-brand-blue hover:underline"
          >
            Create Customer Account
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
