"use client";

import * as React from "react";
import { toast } from "sonner";
import { User, Mail, Phone, Shield, Loader2, Save } from "lucide-react";
import { Profile } from "@/lib/types/database";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { updateProfile } from "./actions";

interface ProfileClientProps {
  user: {
    id: string;
    email: string;
    full_name?: string;
    phone?: string;
    role: "customer" | "admin";
  };
}

export function ProfileClient({ user }: ProfileClientProps) {
  const [isPending, startTransition] = React.useTransition();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      const res = await updateProfile(formData);
      if (res.success) {
        toast.success(res.message);
      } else {
        toast.error(res.error || "Failed to update profile.");
      }
    });
  };

  return (
    <Card className="rounded-3xl border border-brand-border bg-white shadow-card p-6 sm:p-8 space-y-6 max-w-xl">
      <div className="border-b border-brand-border pb-4">
        <CardTitle className="text-xl font-bold text-brand-dark">
          Personal Profile & Contact
        </CardTitle>
        <p className="text-xs text-brand-muted mt-0.5">
          Keep your contact information updated for smooth pickup coordination.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="full_name">Full Name</Label>
          <div className="relative">
            <User className="absolute left-3.5 top-3.5 h-4 w-4 text-brand-muted" />
            <Input
              id="full_name"
              name="full_name"
              defaultValue={user.full_name || ""}
              placeholder="e.g. Rahul Sharma"
              className="pl-10 font-medium"
              required
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="phone">Phone / Mobile Number</Label>
          <div className="relative">
            <Phone className="absolute left-3.5 top-3.5 h-4 w-4 text-brand-muted" />
            <Input
              id="phone"
              name="phone"
              defaultValue={user.phone || ""}
              placeholder="e.g. 98200 12345"
              className="pl-10 font-medium"
              required
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="email">Registered Email Address</Label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-brand-muted" />
            <Input
              id="email"
              value={user.email}
              disabled
              className="pl-10 bg-gray-50 text-brand-muted cursor-not-allowed"
            />
          </div>
          <span className="text-[11px] text-brand-muted">
            Email is managed via authentication security settings.
          </span>
        </div>

        <div className="p-4 rounded-xl bg-brand-bg border border-brand-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-brand-blue" />
            <span className="text-xs font-bold text-brand-dark">Account Role</span>
          </div>
          <Badge variant={user.role === "admin" ? "warning" : "blue"} className="capitalize">
            {user.role}
          </Badge>
        </div>

        <div className="pt-2">
          <Button type="submit" disabled={isPending} className="w-full gap-2 font-bold" size="lg">
            {isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Saving Changes...</span>
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                <span>Save Profile Changes</span>
              </>
            )}
          </Button>
        </div>
      </form>
    </Card>
  );
}
