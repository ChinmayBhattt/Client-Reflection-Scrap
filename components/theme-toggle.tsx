"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "color-scheme";

function getSystemScheme(): "light" | "dark" {
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function getStoredScheme(): "light" | "dark" | null {
  try {
    const val = localStorage.getItem(STORAGE_KEY);
    return val === "light" || val === "dark" ? val : null;
  } catch {
    return null;
  }
}

function applyMetaScheme(scheme: "light" | "dark" | null) {
  const meta = document.querySelector<HTMLMetaElement>('meta[name="color-scheme"]');
  if (meta) {
    meta.content = scheme ?? "light dark";
  }
}

interface ThemeToggleProps {
  className?: string;
}

/**
 * Two-state color-scheme toggle synchronized with <meta name="color-scheme">,
 * localStorage, and cross-tab storage events.
 */
export function ThemeToggle({ className }: ThemeToggleProps) {
  React.useEffect(() => {
    const handleStorage = (event: StorageEvent) => {
      if (event.key === STORAGE_KEY) {
        const next = event.newValue === "light" || event.newValue === "dark" ? event.newValue : null;
        applyMetaScheme(next);
      }
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const handleToggle = () => {
    const system = getSystemScheme();
    const current = getStoredScheme() ?? system;
    const target: "light" | "dark" = current === "dark" ? "light" : "dark";

    if (target === system) {
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch {
        // Ignore storage restrictions
      }
      applyMetaScheme(null);
    } else {
      try {
        localStorage.setItem(STORAGE_KEY, target);
      } catch {
        // Ignore storage restrictions
      }
      applyMetaScheme(target);
    }
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      title="Toggle light / dark mode"
      className={cn(
        "h-8 w-8 sm:h-9 sm:w-9 inline-flex items-center justify-center rounded-lg border border-brand-border bg-brand-surface text-brand-dark hover:border-brand-blue hover:bg-brand-blue-light hover:text-brand-blue transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue shrink-0",
        className
      )}
    >
      <span className="theme-toggle-moon items-center justify-center">
        <Moon className="h-4 w-4" aria-hidden="true" />
        <span className="sr-only">Switch to dark mode</span>
      </span>
      <span className="theme-toggle-sun items-center justify-center">
        <Sun className="h-4 w-4 text-amber-400" aria-hidden="true" />
        <span className="sr-only">Switch to light mode</span>
      </span>
    </button>
  );
}

