import * as React from "react";
import type { Metadata } from "next";
import { Suspense } from "react";
import { SignupClient } from "./signup-client";
import { Loader2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Create Account - Reflection Scrap Solutions LLP",
  description: "Sign up for doorstep scrap pickups, verified digital weighing, and instant payments in Mumbai.",
};

export default function SignupPage() {
  return (
    <div className="py-12 md:py-20 bg-brand-bg min-h-[85vh] flex items-center justify-center px-4">
      <Suspense
        fallback={
          <div className="flex items-center justify-center p-12">
            <Loader2 className="h-8 w-8 animate-spin text-brand-green" />
          </div>
        }
      >
        <SignupClient />
      </Suspense>
    </div>
  );
}
