"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Lock, Loader2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { updatePassword } from "@/app/auth/actions";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(false);
  const [isSuccess, setIsSuccess] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const res = await updatePassword(formData);

    setIsLoading(false);
    if (res.success) {
      setIsSuccess(true);
      toast.success(res.message);
      setTimeout(() => {
        router.push("/login");
      }, 2500);
    } else {
      toast.error(res.error || "Failed to update password.");
    }
  };

  return (
    <div className="py-12 md:py-20 bg-brand-bg min-h-[75vh] flex items-center justify-center px-4">
      <Card className="w-full max-w-md mx-auto rounded-3xl border border-brand-border bg-white shadow-elevated overflow-hidden">
        <CardHeader className="text-center space-y-2 pb-6 border-b border-brand-border/60">
          <div className="h-12 w-12 rounded-2xl bg-brand-blue-light text-brand-blue flex items-center justify-center mx-auto">
            <Lock className="h-6 w-6" />
          </div>
          <CardTitle className="text-2xl font-extrabold text-brand-dark">
            Set New Password
          </CardTitle>
          <CardDescription className="text-sm text-brand-muted">
            Enter a strong password of at least 6 characters.
          </CardDescription>
        </CardHeader>

        <CardContent className="p-6 md:p-8 space-y-6">
          {isSuccess ? (
            <div className="text-center space-y-4">
              <div className="h-14 w-14 rounded-full bg-brand-green-light text-brand-green flex items-center justify-center mx-auto">
                <CheckCircle2 className="h-8 w-8" />
              </div>
              <p className="text-sm text-brand-dark font-medium leading-relaxed">
                Your password has been reset successfully. Redirecting you to login...
              </p>
              <Button asChild className="w-full">
                <Link href="/login">Go to Log In</Link>
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="password">New Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-brand-muted" />
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    required
                    placeholder="Min 6 characters"
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-brand-muted" />
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    required
                    placeholder="Repeat new password"
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
                    <span>Updating Password...</span>
                  </>
                ) : (
                  <span>Update Password</span>
                )}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
