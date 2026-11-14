"use client";

import * as React from "react";
import { Heart, Star, Share2, Check, Copy, MessageCircle } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface BlogEngagementProps {
  postId: string;
  slug: string;
  title: string;
  initialLikes: number;
  initialRatingSum: number;
  initialRatingCount: number;
  compact?: boolean;
}

const LIKED_KEY_PREFIX = "rss_blog_liked_";
const RATED_KEY_PREFIX = "rss_blog_rated_";

/**
 * Interactive Like, 1-5 Star Rating, and Share controls for blog posts.
 */
export function BlogEngagement({
  postId,
  slug,
  title,
  initialLikes,
  initialRatingSum,
  initialRatingCount,
  compact = false,
}: BlogEngagementProps) {
  const [likes, setLikes] = React.useState(initialLikes);
  const [liked, setLiked] = React.useState(false);

  const [ratingSum, setRatingSum] = React.useState(initialRatingSum);
  const [ratingCount, setRatingCount] = React.useState(initialRatingCount);
  const [userRating, setUserRating] = React.useState(0);
  const [hoveredStar, setHoveredStar] = React.useState(0);

  const [shareMenuOpen, setShareMenuOpen] = React.useState(false);
  const [copied, setCopied] = React.useState(false);

  React.useEffect(() => {
    try {
      setLiked(localStorage.getItem(`${LIKED_KEY_PREFIX}${postId}`) === "1");
      const savedRating = Number(localStorage.getItem(`${RATED_KEY_PREFIX}${postId}`) || "0");
      if (savedRating >= 1 && savedRating <= 5) {
        setUserRating(savedRating);
      }
    } catch {
      // Ignore storage errors
    }
  }, [postId]);

  const averageRating =
    ratingCount > 0 ? (ratingSum / ratingCount).toFixed(1) : "0.0";

  const getShareUrl = () => {
    if (typeof window !== "undefined") {
      return `${window.location.origin}/blog/${slug}`;
    }
    return `/blog/${slug}`;
  };

  const handleToggleLike = async () => {
    const nextLiked = !liked;
    const prevLikes = likes;
    setLiked(nextLiked);
    setLikes((c) => Math.max(0, c + (nextLiked ? 1 : -1)));

    try {
      if (nextLiked) {
        localStorage.setItem(`${LIKED_KEY_PREFIX}${postId}`, "1");
      } else {
        localStorage.removeItem(`${LIKED_KEY_PREFIX}${postId}`);
      }
    } catch {
      // Ignore
    }

    try {
      const res = await fetch("/api/blog/interact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          postId,
          action: nextLiked ? "like" : "unlike",
        }),
      });
      const json = await res.json();
      if (json.persisted && typeof json.likes_count === "number") {
        setLikes(json.likes_count);
      }
    } catch {
      setLikes(prevLikes);
    }
  };

  const handleRate = async (stars: number) => {
    const prevUserRating = userRating;
    if (prevUserRating === stars) return;

    setUserRating(stars);
    setRatingSum((sum) => Math.max(0, sum - prevUserRating + stars));
    if (prevUserRating === 0) {
      setRatingCount((c) => c + 1);
    }

    try {
      localStorage.setItem(`${RATED_KEY_PREFIX}${postId}`, String(stars));
    } catch {
      // Ignore
    }

    toast.success(`Rated ${stars}/5 stars!`);

    try {
      const res = await fetch("/api/blog/interact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          postId,
          action: "rate",
          rating: stars,
          previousRating: prevUserRating,
        }),
      });
      const json = await res.json();
      if (json.persisted) {
        if (typeof json.rating_sum === "number") setRatingSum(json.rating_sum);
        if (typeof json.rating_count === "number") setRatingCount(json.rating_count);
      }
    } catch {
      // Keep optimistic rating locally
    }
  };

  const handleShareClick = async () => {
    const url = getShareUrl();
    if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
      try {
        await navigator.share({ title, url });
        return;
      } catch (err) {
        if ((err as Error)?.name === "AbortError") return;
      }
    }
    setShareMenuOpen((open) => !open);
  };

  const handleCopyLink = async () => {
    const url = getShareUrl();
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success("Article link copied!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Could not copy link");
    }
  };

  const shareUrl = getShareUrl();

  return (
    <div
      className={cn(
        "relative flex flex-wrap items-center justify-between gap-2.5",
        compact ? "pt-3 border-t border-brand-border" : "p-4 rounded-2xl border border-brand-border bg-muted/40"
      )}
    >
      {/* Left: Like + Star Rating */}
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={handleToggleLike}
          aria-pressed={liked}
          aria-label={liked ? "Unlike article" : "Like article"}
          className={cn(
            "inline-flex items-center gap-1.5 h-8 px-2.5 rounded-lg border text-xs font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue",
            liked
              ? "border-rose-500/40 bg-rose-500/10 text-rose-600 dark:text-rose-400"
              : "border-brand-border bg-brand-surface text-brand-muted hover:text-rose-600 hover:border-rose-400/50"
          )}
        >
          <Heart
            className={cn("h-3.5 w-3.5", liked && "fill-current")}
            aria-hidden="true"
          />
          <span>{likes}</span>
        </button>

        {/* Interactive 5-Star Rating */}
        <div
          className="inline-flex items-center gap-1.5 h-8 px-2.5 rounded-lg border border-brand-border bg-brand-surface"
          onMouseLeave={() => setHoveredStar(0)}
        >
          <div className="flex items-center gap-0.5" role="group" aria-label="Rate this article">
            {[1, 2, 3, 4, 5].map((star) => {
              const active = hoveredStar > 0 ? star <= hoveredStar : star <= (userRating || Math.round(Number(averageRating)));
              const isUserSelected = userRating > 0 && star <= userRating;
              return (
                <button
                  key={star}
                  type="button"
                  onMouseEnter={() => setHoveredStar(star)}
                  onClick={() => handleRate(star)}
                  aria-label={`Rate ${star} out of 5 stars`}
                  className="p-0.5 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand-blue rounded"
                >
                  <Star
                    className={cn(
                      "h-3.5 w-3.5 transition-colors",
                      active
                        ? isUserSelected
                          ? "fill-amber-500 text-amber-500"
                          : "fill-amber-400 text-amber-400"
                        : "text-brand-muted/40 hover:text-amber-400"
                    )}
                    aria-hidden="true"
                  />
                </button>
              );
            })}
          </div>
          <span className="text-[11px] font-bold text-brand-dark">
            {averageRating}
          </span>
          <span className="text-[10px] text-brand-muted">
            ({ratingCount})
          </span>
        </div>
      </div>

      {/* Right: Share */}
      <div className="relative">
        <button
          type="button"
          onClick={handleShareClick}
          aria-expanded={shareMenuOpen}
          aria-label="Share article"
          className="inline-flex items-center gap-1.5 h-8 px-2.5 rounded-lg border border-brand-border bg-brand-surface text-xs font-bold text-brand-dark hover:border-brand-blue hover:text-brand-blue transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue"
        >
          <Share2 className="h-3.5 w-3.5" aria-hidden="true" />
          <span>Share</span>
        </button>

        {shareMenuOpen && (
          <div className="absolute right-0 bottom-10 z-30 w-48 rounded-xl border border-brand-border bg-brand-surface p-1.5 shadow-elevated space-y-1">
            <button
              type="button"
              onClick={handleCopyLink}
              className="flex w-full items-center gap-2 px-2.5 py-2 rounded-lg text-xs font-semibold text-brand-dark hover:bg-muted/70 text-left"
            >
              {copied ? (
                <Check className="h-3.5 w-3.5 text-brand-green" />
              ) : (
                <Copy className="h-3.5 w-3.5 text-brand-blue" />
              )}
              <span>{copied ? "Link Copied!" : "Copy Article Link"}</span>
            </button>
            <a
              href={`https://wa.me/?text=${encodeURIComponent(`${title} — ${shareUrl}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setShareMenuOpen(false)}
              className="flex w-full items-center gap-2 px-2.5 py-2 rounded-lg text-xs font-semibold text-brand-dark hover:bg-muted/70"
            >
              <MessageCircle className="h-3.5 w-3.5 text-brand-green" />
              <span>Share on WhatsApp</span>
            </a>
            <a
              href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setShareMenuOpen(false)}
              className="flex w-full items-center gap-2 px-2.5 py-2 rounded-lg text-xs font-semibold text-brand-dark hover:bg-muted/70"
            >
              <Share2 className="h-3.5 w-3.5 text-brand-blue" />
              <span>Share on LinkedIn</span>
            </a>
            <a
              href={`https://x.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(shareUrl)}&via=ReflectionScrap`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setShareMenuOpen(false)}
              className="flex w-full items-center gap-2 px-2.5 py-2 rounded-lg text-xs font-semibold text-brand-dark hover:bg-muted/70"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="h-3.5 w-3.5 shrink-0" aria-hidden="true">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
              <span>Share on X (Twitter)</span>
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

