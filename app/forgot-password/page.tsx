"use client";

import * as React from "react";
import Link from "next/link";
import { toast } from "sonner";
import { KeyRound, Loader2, Mail, ArrowLeft, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { sendPasswordReset } from "@/app/auth/actions";

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = React.useState(false);
  const [isSuccess, setIsSuccess] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const res = await sendPasswordReset(formData);

    setIsLoading(false);
    if (res.success) {
      setIsSuccess(true);
      toast.success(res.message);
    } else {
      toast.error(res.error || "Failed to send reset link.");
    }
  };

  return (
    <div className="py-12 md:py-20 bg-brand-bg min-h-[75vh] flex items-center justify-center px-4">
      <Card className="w-full max-w-md mx-auto rounded-3xl border border-brand-border bg-white shadow-elevated overflow-hidden">
        <CardHeader className="text-center space-y-2 pb-6 border-b border-brand-border/60">
          <div className="h-12 w-12 rounded-2xl bg-brand-blue-light text-brand-blue flex items-center justify-center mx-auto">
            <KeyRound className="h-6 w-6" />
          </div>
          <CardTitle className="text-2xl font-extrabold text-brand-dark">
            Reset Password
          </CardTitle>
          <CardDescription className="text-sm text-brand-muted">
            Enter your account email to receive a password recovery link.
          </CardDescription>
        </CardHeader>

        <CardContent className="p-6 md:p-8 space-y-6">
          {isSuccess ? (
            <div className="text-center space-y-4">
              <div className="h-14 w-14 rounded-full bg-brand-green-light text-brand-green flex items-center justify-center mx-auto">
                <CheckCircle2 className="h-8 w-8" />
              </div>
              <p className="text-sm text-brand-dark font-medium leading-relaxed">
                Password recovery instructions have been sent to your email.
                Please check your inbox and spam folder.
              </p>
              <Button asChild variant="outline" className="w-full">
                <Link href="/login">Back to Log In</Link>
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="email">Registered Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-brand-muted" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    required
                    placeholder="name@example.com"
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
                    <span>Sending Reset Link...</span>
                  </>
                ) : (
                  <span>Send Reset Link</span>
                )}
              </Button>

              <div className="text-center pt-2">
                <Link
                  href="/login"
                  className="text-xs font-bold text-brand-muted hover:text-brand-dark inline-flex items-center gap-1.5"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  <span>Back to Log In</span>
                </Link>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
