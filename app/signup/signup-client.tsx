"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { UserPlus, Loader2, Mail, Lock, User, Phone, CheckCircle2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { signupWithEmail } from "@/app/auth/actions";

export function SignupClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/dashboard";

  const [isLoading, setIsLoading] = React.useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = React.useState(false);
  const [verificationSent, setVerificationSent] = React.useState(false);

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      formData.set("next", next);
      const res = await signupWithEmail(formData);

      if (res && !res.success) {
        toast.error(res.error || "Signup failed");
        setIsLoading(false);
      } else if (res && res.requiresEmailVerification) {
        setVerificationSent(true);
        setIsLoading(false);
      }
    } catch {
      // Handled by Next.js redirect
    }
  };

  const handleGoogleSignup = async () => {
    try {
      setIsGoogleLoading(true);
      const supabase = createClient();
      if (!supabase) {
        toast.error("Supabase credentials not configured.");
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
      const message = err instanceof Error ? err.message : "Google signup error";
      toast.error(message);
      setIsGoogleLoading(false);
    }
  };

  if (verificationSent) {
    return (
      <Card className="w-full max-w-md mx-auto rounded-3xl border border-brand-border bg-white shadow-elevated p-8 text-center space-y-6">
        <div className="h-16 w-16 rounded-2xl bg-brand-green-light text-brand-green flex items-center justify-center mx-auto">
          <CheckCircle2 className="h-8 w-8" />
        </div>
        <div className="space-y-2">
          <CardTitle className="text-2xl font-extrabold text-brand-dark">
            Check Your Email
          </CardTitle>
          <p className="text-sm text-brand-muted leading-relaxed">
            We have sent an activation link to your email address. Please click
            the link to confirm your account and log in.
          </p>
        </div>
        <Button asChild className="w-full" variant="outline">
          <Link href="/login">Return to Log In</Link>
        </Button>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto rounded-3xl border border-brand-border bg-white shadow-elevated overflow-hidden">
      <CardHeader className="text-center space-y-2 pb-6 border-b border-brand-border/60">
        <div className="h-12 w-12 rounded-2xl bg-brand-green-light text-brand-green flex items-center justify-center mx-auto">
          <UserPlus className="h-6 w-6" />
        </div>
        <CardTitle className="text-2xl font-extrabold text-brand-dark">
          Create Customer Account
        </CardTitle>
        <CardDescription className="text-sm text-brand-muted">
          Register to book doorstep scrap collection and receive verified payouts.
        </CardDescription>
      </CardHeader>

      <CardContent className="p-6 md:p-8 space-y-6">
        {/* Google OAuth Button */}
        <Button
          type="button"
          variant="outline"
          onClick={handleGoogleSignup}
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
          <span>Sign up with Google</span>
        </Button>

        <div className="relative flex items-center justify-center">
          <div className="border-t border-brand-border w-full" />
          <span className="bg-white px-3 text-xs uppercase font-bold text-brand-muted shrink-0">
            Or register with email
          </span>
          <div className="border-t border-brand-border w-full" />
        </div>

        <form onSubmit={handleSignup} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="full_name">Full Name *</Label>
            <div className="relative">
              <User className="absolute left-3.5 top-3.5 h-4 w-4 text-brand-muted" />
              <Input
                id="full_name"
                name="full_name"
                required
                placeholder="e.g. Ramesh Patel"
                className="pl-10"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="phone">Mobile / WhatsApp Number *</Label>
            <div className="relative">
              <Phone className="absolute left-3.5 top-3.5 h-4 w-4 text-brand-muted" />
              <Input
                id="phone"
                name="phone"
                type="tel"
                required
                placeholder="e.g. 98200 12345"
                className="pl-10"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="email">Email Address *</Label>
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="password">Password *</Label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-brand-muted" />
                <Input
                  id="password"
                  name="password"
                  type="password"
                  required
                  placeholder="Min 6 chars"
                  className="pl-10 text-xs"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="confirmPassword">Confirm Password *</Label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-brand-muted" />
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  placeholder="Repeat password"
                  className="pl-10 text-xs"
                />
              </div>
            </div>
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            variant="secondary"
            className="w-full h-12 font-bold gap-2"
            size="lg"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Creating Account...</span>
              </>
            ) : (
              <span>Create Account</span>
            )}
          </Button>
        </form>

        <div className="text-center text-xs text-brand-muted pt-2 border-t border-brand-border/60">
          Already have an account?{" "}
          <Link
            href={`/login${next ? `?next=${encodeURIComponent(next)}` : ""}`}
            className="font-bold text-brand-blue hover:underline"
          >
            Log In Here
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
