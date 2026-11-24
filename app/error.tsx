"use client";

import * as React from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  React.useEffect(() => {
    console.error("Global application error:", error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-12 bg-brand-bg">
      <div className="max-w-md w-full rounded-3xl border border-brand-border bg-brand-surface p-8 text-center space-y-6 shadow-subtle">
        <div className="h-16 w-16 rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto">
          <AlertTriangle className="h-8 w-8" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-extrabold text-brand-dark">
            Something Went Wrong
          </h1>
          <p className="text-xs sm:text-sm text-brand-muted leading-relaxed">
            We encountered a temporary connection issue. Please refresh the page or head back to the homepage.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button onClick={() => reset()} className="gap-2 font-bold w-full sm:w-auto">
            <RefreshCw className="h-4 w-4" />
            <span>Try Again</span>
          </Button>
          <Button asChild variant="outline" className="gap-2 font-bold w-full sm:w-auto">
            <Link href="/">
              <Home className="h-4 w-4" />
              <span>Homepage</span>
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
