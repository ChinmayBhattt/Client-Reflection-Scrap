"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Search,
  Clock,
  Calendar,
  ArrowRight,
  Plus,
  Newspaper,
  Tag,
  Edit2,
  Trash2,
  Sparkles,
} from "lucide-react";
import type { BlogPost } from "@/lib/types/database";
import { BLOG_CATEGORIES } from "@/lib/content-constants";
import { formatDate } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { BlogEngagement } from "@/components/blog-engagement";
import { BlogEditorModal } from "@/components/blog/blog-editor-modal";
import { deleteBlogPost } from "@/app/admin/blog/actions";
import { createClient } from "@/lib/supabase/client";
import { isAuthorizedBlogAuthor } from "@/lib/auth-config";

interface BlogListClientProps {
  posts: BlogPost[];
  canWriteBlog?: boolean;
  userEmail?: string;
  authorName?: string;
  isAdmin?: boolean;
}

export function BlogListClient({
  posts,
  canWriteBlog = false,
  userEmail,
  authorName,
  isAdmin = false,
}: BlogListClientProps) {
  const router = useRouter();
  const [search, setSearch] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState("all");

  // Modal editor state
  const [editorModalOpen, setEditorModalOpen] = React.useState(false);
  const [editingPost, setEditingPost] = React.useState<BlogPost | null>(null);

  // Local live posts state to reflect additions/edits instantly
  const [livePosts, setLivePosts] = React.useState<BlogPost[]>(posts);

  React.useEffect(() => {
    setLivePosts(posts);
  }, [posts]);

  const categories = React.useMemo(() => {
    const fromPosts = livePosts.map((p) => p.category);
    return Array.from(new Set([...BLOG_CATEGORIES, ...fromPosts]));
  }, [livePosts]);

  const filteredPosts = React.useMemo(() => {
    const q = search.trim().toLowerCase();
    return livePosts.filter((post) => {
      const matchesCat =
        selectedCategory === "all" || post.category === selectedCategory;
      const matchesSearch =
        !q ||
        post.title.toLowerCase().includes(q) ||
        post.excerpt.toLowerCase().includes(q) ||
        post.tags.some((t) => t.toLowerCase().includes(q));
      return matchesCat && matchesSearch;
    });
  }, [livePosts, search, selectedCategory]);

  const [clientAuthorAccess, setClientAuthorAccess] = React.useState<boolean>(
    Boolean(canWriteBlog || isAdmin)
  );
  const [activeEmail, setActiveEmail] = React.useState<string | undefined>(userEmail);

  React.useEffect(() => {
    if (canWriteBlog || isAdmin) {
      setClientAuthorAccess(true);
      return;
    }
    const supabase = createClient();
    if (!supabase) return;

    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user?.email) {
        setActiveEmail(user.email);
        if (isAuthorizedBlogAuthor(user.email)) {
          setClientAuthorAccess(true);
        }
      }
    });
  }, [canWriteBlog, isAdmin]);

  const hasAuthorAccess = Boolean(canWriteBlog || isAdmin || clientAuthorAccess);

  const handleOpenWrite = () => {
    setEditingPost(null);
    setEditorModalOpen(true);
  };

  const handleOpenEdit = (post: BlogPost) => {
    setEditingPost(post);
    setEditorModalOpen(true);
  };

  const handleDelete = async (postId: string) => {
    if (!window.confirm("Are you sure you want to delete this blog post?")) {
      return;
    }

    try {
      const res = await deleteBlogPost(postId);
      if (res.success) {
        toast.success(res.message || "Blog post deleted");
        setLivePosts((prev) => prev.filter((p) => p.id !== postId));
        router.refresh();
      } else {
        toast.error(res.error || "Failed to delete blog post");
      }
    } catch {
      toast.error("Error deleting post");
    }
  };

  return (
    <div className="space-y-8">
      {/* Author Access Banner (Shown only to authorized email owners) */}
      {hasAuthorAccess && (
        <div className="p-3.5 sm:p-4 rounded-2xl bg-brand-green-light/40 border border-brand-green/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-in fade-in-50 duration-200">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-xl bg-brand-green text-white flex items-center justify-center shrink-0">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-bold text-brand-dark">
                Blog Author Ownership Active
              </p>
              <p className="text-[11px] text-brand-muted">
                Authorized as: <strong className="text-brand-dark">{activeEmail || userEmail || "Owner"}</strong> • You can write, edit, and publish blogs directly.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <Button
              type="button"
              size="sm"
              onClick={handleOpenWrite}
              className="bg-brand-green hover:bg-brand-green/90 text-white font-bold text-xs h-8 px-4 gap-1.5 shadow-sm rounded-xl cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Write Blog</span>
            </Button>
            <Button asChild size="sm" variant="outline" className="text-xs h-8 px-3 rounded-xl">
              <Link href="/admin/blog">
                <span>Manager</span>
              </Link>
            </Button>
          </div>
        </div>
      )}

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
            All ({livePosts.length})
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

          {/* Primary "+ Write Blog" button for authorized authors */}
          {hasAuthorAccess && (
            <Button
              type="button"
              size="sm"
              onClick={handleOpenWrite}
              className="rounded-full text-xs h-8 px-4 font-bold bg-brand-green hover:bg-brand-green/90 text-white gap-1.5 shadow-sm ml-auto sm:ml-0 cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Write Blog</span>
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
              className="border border-brand-border bg-brand-surface shadow-subtle hover:border-brand-blue hover:shadow-card transition-all duration-200 overflow-hidden flex flex-col justify-between group"
            >
              <div>
                {post.cover_image_url && (
                  <Link href={`/blog/${post.slug}`} className="block overflow-hidden bg-muted aspect-[16/9] relative">
                    <img
                      src={post.cover_image_url}
                      alt={post.title}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
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

                <div className="flex items-center justify-between pt-1 border-t border-brand-border/60">
                  <span className="text-xs text-brand-muted font-medium">
                    By {post.author_name}
                  </span>

                  <div className="flex items-center gap-2">
                    {/* Authorized Edit & Delete buttons */}
                    {hasAuthorAccess && (
                      <div className="flex items-center gap-1 mr-2">
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(post)}
                          className="h-7 px-2.5 rounded-lg border border-brand-border bg-brand-surface hover:bg-brand-blue-light text-brand-dark hover:text-brand-blue transition-colors text-xs font-bold inline-flex items-center gap-1 cursor-pointer"
                          title="Edit this blog post"
                        >
                          <Edit2 className="h-3 w-3 text-brand-blue" />
                          <span>Edit</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(post.id)}
                          className="h-7 w-7 rounded-lg border border-brand-border bg-brand-surface hover:bg-red-50 text-red-500 hover:text-red-600 transition-colors inline-flex items-center justify-center cursor-pointer"
                          title="Delete this blog post"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    )}

                    <Link
                      href={`/blog/${post.slug}`}
                      className="inline-flex items-center gap-1 text-xs font-bold text-brand-blue hover:underline"
                    >
                      <span>Read Article</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
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

      {/* Blog Editor Modal */}
      <BlogEditorModal
        isOpen={editorModalOpen}
        onClose={() => setEditorModalOpen(false)}
        post={editingPost}
        defaultAuthorName={authorName || "Reflection Scrap Editorial"}
        onSaved={() => {
          router.refresh();
        }}
      />
    </div>
  );
}
