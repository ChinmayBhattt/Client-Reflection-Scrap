import type { Metadata } from "next";
import Link from "next/link";
import { Newspaper, TrendingUp, CalendarCheck } from "lucide-react";
import { getPublishedBlogPosts } from "@/lib/services/blog";
import { getCurrentUser } from "@/lib/services/user";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BlogListClient } from "./blog-list-client";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Scrap Market Trends & Recycling Blog",
  description:
    "Stay updated on Mumbai scrap metal rates, copper & brass market drivers, corporate demolition insights, and e-waste recycling trends.",
};

export default async function BlogPage() {
  const [posts, user] = await Promise.all([
    getPublishedBlogPosts(),
    getCurrentUser(),
  ]);

  const canWriteBlog = Boolean(user?.canWriteBlog || user?.role === "admin");

  return (
    <div className="py-12 md:py-20 bg-brand-bg">
      <div className="container space-y-12">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <Badge variant="blue" className="px-3.5 py-1 text-xs font-bold uppercase tracking-wider gap-1.5">
            <Newspaper className="h-3.5 w-3.5" />
            <span>Market Insights & Trends</span>
          </Badge>
          <h1 className="text-4xl md:text-5xl font-extrabold text-brand-dark tracking-tight">
            Scrap Market & Recycling Blog
          </h1>
          <p className="text-base md:text-lg text-brand-muted leading-relaxed">
            Market updates, metal pricing trends in Mumbai, industrial demolition
            best practices, and sustainable recycling insights from our MIDC yard team.
          </p>
        </div>

        {/* Interactive Blog Grid */}
        <BlogListClient
          posts={posts}
          canWriteBlog={canWriteBlog}
          userEmail={user?.email}
          authorName={user?.full_name}
        />

        {/* Bottom CTA */}
        <div className="rounded-3xl bg-brand-surface border border-brand-border p-6 sm:p-10 shadow-subtle flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-brand-green">
              <TrendingUp className="h-4 w-4" />
              <span>Ready to Sell at Today&apos;s Rates?</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-brand-dark">
              Turn market insights into instant scrap value
            </h2>
            <p className="text-sm text-brand-muted max-w-xl">
              Check live Mumbai rates or schedule a doorstep pickup / corporate
              demolition survey with Reflection Scrap Solutions LLP.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto shrink-0">
            <Button asChild variant="outline">
              <Link href="/rates">Check Live Rates</Link>
            </Button>
            <Button asChild variant="secondary">
              <Link href="/book">
                <CalendarCheck className="h-4 w-4 mr-1.5" />
                <span>Book Pickup</span>
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

