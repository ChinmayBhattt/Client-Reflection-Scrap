import * as React from "react";
import type { Metadata } from "next";
import { Suspense } from "react";
import { LoginClient } from "./login-client";
import { Loader2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Log In to Your Account - Reflection Scrap Solutions LLP",
  description: "Log in to track scrap pickups, manage addresses, and view payment settlements.",
};

export default function LoginPage() {
  return (
    <div className="py-12 md:py-20 bg-brand-bg min-h-[80vh] flex items-center justify-center px-4">
      <Suspense
        fallback={
          <div className="flex items-center justify-center p-12">
            <Loader2 className="h-8 w-8 animate-spin text-brand-blue" />
          </div>
        }
      >
        <LoginClient />
      </Suspense>
    </div>
  );
}
