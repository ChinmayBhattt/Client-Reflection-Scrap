import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, Clock, User, Tag, CalendarCheck } from "lucide-react";
import { getBlogPostBySlug } from "@/lib/services/blog";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BlogEngagement } from "@/components/blog-engagement";

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const post = await getBlogPostBySlug(params.slug);
  if (!post) {
    return { title: "Article Not Found" };
  }
  return {
    title: post.title,
    description: post.excerpt,
  };
}

function renderFormattedParagraphs(content: string) {
  return content.split(/\n\n+/).map((block, idx) => {
    const trimmed = block.trim();
    if (!trimmed) return null;

    if (trimmed.startsWith("### ")) {
      return (
        <h2 key={idx} className="text-xl sm:text-2xl font-bold text-brand-dark pt-4">
          {trimmed.replace(/^###\s+/, "")}
        </h2>
      );
    }

    if (trimmed.split("\n").every((line) => line.trim().startsWith("- ") || /^\d+\.\s/.test(line.trim()))) {
      const items = trimmed.split("\n");
      return (
        <ul key={idx} className="list-disc pl-5 space-y-2 text-brand-muted">
          {items.map((line, lIdx) => {
            const clean = line.trim().replace(/^-\s+|^\d+\.\s+/, "");
            const boldMatch = clean.match(/^\*\*(.+?)\*\*\s*(.*)$/);
            if (boldMatch) {
              return (
                <li key={lIdx} className="leading-relaxed">
                  <strong className="text-brand-dark">{boldMatch[1]}</strong> {boldMatch[2]}
                </li>
              );
            }
            return (
              <li key={lIdx} className="leading-relaxed">
                {clean}
              </li>
            );
          })}
        </ul>
      );
    }

    return (
      <p key={idx} className="text-base text-brand-muted leading-relaxed">
        {trimmed}
      </p>
    );
  });
}

export default async function BlogDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const post = await getBlogPostBySlug(params.slug);
  if (!post) {
    notFound();
  }

  return (
    <div className="py-10 md:py-16 bg-brand-bg">
      <article className="container max-w-4xl space-y-8">
        <div>
          <Button asChild variant="ghost" size="sm" className="gap-1.5 -ml-2">
            <Link href="/blog">
              <ArrowLeft className="h-4 w-4" />
              <span>Back to All Market Blogs</span>
            </Link>
          </Button>
        </div>

        <div className="rounded-3xl border border-brand-border bg-brand-surface overflow-hidden shadow-card">
          {post.cover_image_url && (
            <div className="aspect-[16/8] w-full bg-muted overflow-hidden border-b border-brand-border">
              <img
                src={post.cover_image_url}
                alt={post.title}
                className="h-full w-full object-cover"
              />
            </div>
          )}

          <div className="p-6 sm:p-10 space-y-6">
            <div className="flex flex-wrap items-center gap-3 text-xs text-brand-muted">
              <Badge variant="blue" className="font-bold">
                {post.category}
              </Badge>
              <span className="inline-flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                <span>{formatDate(post.published_at)}</span>
              </span>
              <span className="inline-flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                <span>{post.read_time_minutes} min read</span>
              </span>
              <span className="inline-flex items-center gap-1">
                <User className="h-3.5 w-3.5" />
                <span>{post.author_name}</span>
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold text-brand-dark leading-tight tracking-tight">
              {post.title}
            </h1>

            <p className="text-base sm:text-lg font-medium text-brand-blue leading-relaxed border-l-4 border-brand-blue pl-4">
              {post.excerpt}
            </p>

            <BlogEngagement
              postId={post.id}
              slug={post.slug}
              title={post.title}
              initialLikes={post.likes_count}
              initialRatingSum={post.rating_sum}
              initialRatingCount={post.rating_count}
            />

            <div className="space-y-4 pt-2 border-t border-brand-border">
              {renderFormattedParagraphs(post.content)}
            </div>

            {post.tags.length > 0 && (
              <div className="pt-4 border-t border-brand-border flex flex-wrap items-center gap-2">
                <Tag className="h-3.5 w-3.5 text-brand-muted" />
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2.5 py-1 rounded-lg bg-muted text-brand-muted text-xs font-semibold"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            <div className="pt-4">
              <BlogEngagement
                postId={post.id}
                slug={post.slug}
                title={post.title}
                initialLikes={post.likes_count}
                initialRatingSum={post.rating_sum}
                initialRatingCount={post.rating_count}
              />
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-brand-surface border border-brand-border p-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-subtle">
          <div>
            <h3 className="font-bold text-brand-dark">
              Need a custom scrap valuation or demolition quote?
            </h3>
            <p className="text-xs sm:text-sm text-brand-muted">
              Schedule a free site visit or doorstep pickup in Mumbai.
            </p>
          </div>
          <Button asChild variant="secondary" className="w-full sm:w-auto">
            <Link href="/book">
              <CalendarCheck className="h-4 w-4 mr-1.5" />
              <span>Book Pickup</span>
            </Link>
          </Button>
        </div>
      </article>
    </div>
  );
}

