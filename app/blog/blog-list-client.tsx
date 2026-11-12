"use client";

import * as React from "react";
import Link from "next/link";
import {
  Search,
  Clock,
  Calendar,
  ArrowRight,
  Plus,
  Newspaper,
  Tag,
} from "lucide-react";
import type { BlogPost } from "@/lib/types/database";
import { BLOG_CATEGORIES } from "@/lib/content-constants";
import { formatDate } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { BlogEngagement } from "@/components/blog-engagement";

interface BlogListClientProps {
  posts: BlogPost[];
  isAdmin?: boolean;
}

export function BlogListClient({ posts, isAdmin = false }: BlogListClientProps) {
  const [search, setSearch] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState("all");

  const categories = React.useMemo(() => {
    const fromPosts = posts.map((p) => p.category);
    return Array.from(new Set([...BLOG_CATEGORIES, ...fromPosts]));
  }, [posts]);

  const filteredPosts = React.useMemo(() => {
    const q = search.trim().toLowerCase();
    return posts.filter((post) => {
      const matchesCat =
        selectedCategory === "all" || post.category === selectedCategory;
      const matchesSearch =
        !q ||
        post.title.toLowerCase().includes(q) ||
        post.excerpt.toLowerCase().includes(q) ||
        post.tags.some((t) => t.toLowerCase().includes(q));
      return matchesCat && matchesSearch;
    });
  }, [posts, search, selectedCategory]);

  return (
    <div className="space-y-8">
      {/* Controls Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-brand-surface p-4 sm:p-5 rounded-2xl border border-brand-border shadow-subtle">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-3.5 h-4 w-4 text-brand-muted" />
          <Input
            type="text"
            placeholder="Search market trends, copper, demolition, e-waste..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            type="button"
            size="sm"
            variant={selectedCategory === "all" ? "default" : "outline"}
            onClick={() => setSelectedCategory("all")}
            className="rounded-full text-xs h-8 px-3"
          >
            All ({posts.length})
          </Button>
          {categories.map((cat) => (
            <Button
              key={cat}
              type="button"
              size="sm"
              variant={selectedCategory === cat ? "default" : "outline"}
              onClick={() => setSelectedCategory(cat)}
              className="rounded-full text-xs h-8 px-3"
            >
              {cat}
            </Button>
          ))}
          {isAdmin && (
            <Button asChild size="sm" variant="secondary" className="rounded-full text-xs h-8 px-3.5 gap-1">
              <Link href="/admin/blog">
                <Plus className="h-3.5 w-3.5" />
                <span>Add / Manage Blogs</span>
              </Link>
            </Button>
          )}
        </div>
      </div>

      {/* Blog Grid */}
      {filteredPosts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {filteredPosts.map((post) => (
            <Card
              key={post.id}
              className="border border-brand-border bg-brand-surface shadow-subtle hover:border-brand-blue hover:shadow-card transition-all duration-200 overflow-hidden flex flex-col justify-between"
            >
              <div>
                {post.cover_image_url && (
                  <Link href={`/blog/${post.slug}`} className="block overflow-hidden bg-muted aspect-[16/9]">
                    <img
                      src={post.cover_image_url}
                      alt={post.title}
                      className="h-full w-full object-cover transition-transform duration-300 hover:scale-[1.03]"
                    />
                  </Link>
                )}

                <CardHeader className="space-y-3 pb-3">
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                    <Badge variant="blue" className="text-[11px] font-bold">
                      {post.category}
                    </Badge>
                    <div className="flex items-center gap-3 text-brand-muted">
                      <span className="inline-flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" />
                        <span>{formatDate(post.published_at)}</span>
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        <span>{post.read_time_minutes} min read</span>
                      </span>
                    </div>
                  </div>

                  <Link href={`/blog/${post.slug}`} className="group block space-y-2">
                    <h2 className="text-xl font-bold text-brand-dark group-hover:text-brand-blue transition-colors leading-snug">
                      {post.title}
                    </h2>
                    <p className="text-sm text-brand-muted leading-relaxed line-clamp-3">
                      {post.excerpt}
                    </p>
                  </Link>
                </CardHeader>
              </div>

              <CardContent className="space-y-4 pt-0">
                {post.tags.length > 0 && (
                  <div className="flex flex-wrap items-center gap-1.5">
                    <Tag className="h-3 w-3 text-brand-muted mr-0.5" aria-hidden="true" />
                    {post.tags.slice(0, 4).map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 rounded-md bg-muted text-brand-muted text-[11px] font-medium"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <span className="text-xs text-brand-muted font-medium">
                    By {post.author_name}
                  </span>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="inline-flex items-center gap-1 text-xs font-bold text-brand-blue hover:underline"
                  >
                    <span>Read Full Article</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>

                <BlogEngagement
                  postId={post.id}
                  slug={post.slug}
                  title={post.title}
                  initialLikes={post.likes_count}
                  initialRatingSum={post.rating_sum}
                  initialRatingCount={post.rating_count}
                  compact
                />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="rounded-3xl border border-dashed border-brand-border bg-brand-surface p-12 text-center space-y-3">
          <Newspaper className="h-10 w-10 text-brand-muted mx-auto opacity-60" />
          <h3 className="text-lg font-bold text-brand-dark">No matching articles found</h3>
          <p className="text-sm text-brand-muted">
            Try clearing your search filter or picking another market category.
          </p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              setSearch("");
              setSelectedCategory("all");
            }}
          >
            Reset Filters
          </Button>
        </div>
      )}
    </div>
  );
}
