import type { ReactNode } from "react";
import { SITE_CONFIG } from "@/lib/site-config";
import { cn } from "@/lib/utils";

type SocialId = (typeof SITE_CONFIG.socials)[number]["id"];

const SOCIAL_ICONS: Record<SocialId, ReactNode> = {
  facebook: (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className="h-4 w-4 shrink-0"
      aria-hidden="true"
    >
      <path d="M13.5 22v-8h2.7l.4-3h-3.1V9.1c0-.9.2-1.5 1.5-1.5h1.7V4.9c-.3 0-1.3-.1-2.5-.1-2.5 0-4.1 1.5-4.1 4.3V11H7.5v3h2.6v8h3.4Z" />
    </svg>
  ),
  instagram: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4 shrink-0"
      aria-hidden="true"
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  ),
  linkedin: (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className="h-4 w-4 shrink-0"
      aria-hidden="true"
    >
      <path d="M6.94 8.5H3.56V19.5H6.94V8.5ZM5.25 3.5C4.14 3.5 3.25 4.39 3.25 5.5C3.25 6.6 4.14 7.5 5.25 7.5C6.35 7.5 7.25 6.6 7.25 5.5C7.25 4.39 6.35 3.5 5.25 3.5ZM20.44 13.02C20.44 9.88 18.76 8.22 16.16 8.22C14.37 8.22 13.48 9.21 13.02 9.93V8.5H9.65C9.7 9.48 9.65 19.5 9.65 19.5H13.02V13.36C13.02 13.02 13.05 12.69 13.15 12.45C13.42 11.78 14.03 11.09 15.07 11.09C16.41 11.09 17.06 12.11 17.06 13.6V19.5H20.44V13.02Z" />
    </svg>
  ),
  twitter: (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className="h-4 w-4 shrink-0"
      aria-hidden="true"
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  ),
};

interface SocialLinksProps {
  variant?: "dark" | "light";
  showLabels?: boolean;
  className?: string;
}

/**
 * Renders accessible links to Reflection Scrap Solutions LLP's social media profiles.
 */
export function SocialLinks({
  variant = "dark",
  showLabels = false,
  className,
}: SocialLinksProps) {
  return (
    <div className={cn("flex flex-wrap items-center gap-2.5", className)}>
      {SITE_CONFIG.socials.map((social) => (
        <a
          key={social.id}
          href={social.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Follow Reflection Scrap Solutions LLP on ${social.name}`}
          title={social.name}
          className={cn(
            "inline-flex items-center justify-center gap-2 rounded-xl border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue",
            showLabels ? "h-10 px-3.5 text-xs font-semibold" : "h-9 w-9",
            variant === "dark"
              ? "bg-gray-800/80 border-gray-700 text-gray-300 hover:text-white hover:border-brand-blue hover:bg-gray-800"
              : "bg-muted/60 border-brand-border text-brand-dark hover:text-brand-blue hover:border-brand-blue hover:bg-brand-blue-light/50"
          )}
        >
          {SOCIAL_ICONS[social.id]}
          {showLabels && <span>{social.name}</span>}
        </a>
      ))}
    </div>
  );
}

