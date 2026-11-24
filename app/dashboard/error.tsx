"use client";

import * as React from "react";
import Link from "next/link";
import { AlertCircle, RefreshCw, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  React.useEffect(() => {
    console.error("Dashboard error:", error);
  }, [error]);

  return (
    <div className="rounded-3xl border border-brand-border bg-brand-surface p-8 sm:p-12 text-center space-y-5 shadow-subtle max-w-xl mx-auto my-8">
      <div className="h-16 w-16 rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto">
        <AlertCircle className="h-8 w-8" />
      </div>
      <div className="space-y-2">
        <h2 className="text-xl font-extrabold text-brand-dark">
          Unable to Load Dashboard
        </h2>
        <p className="text-xs sm:text-sm text-brand-muted leading-relaxed">
          There was a temporary issue loading your dashboard data. Please try refreshing or return to the homepage.
        </p>
      </div>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
        <Button onClick={() => reset()} className="gap-2 font-bold w-full sm:w-auto">
          <RefreshCw className="h-4 w-4" />
          <span>Try Again</span>
        </Button>
        <Button asChild variant="outline" className="gap-2 font-bold w-full sm:w-auto">
          <Link href="/">
            <Home className="h-4 w-4" />
            <span>Go to Homepage</span>
          </Link>
        </Button>
      </div>
    </div>
  );
}
