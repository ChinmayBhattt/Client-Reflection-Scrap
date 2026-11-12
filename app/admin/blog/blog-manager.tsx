"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Plus,
  Edit2,
  Trash2,
  Loader2,
  ExternalLink,
  Heart,
  Star,
  Upload,
} from "lucide-react";
import type { BlogPost } from "@/lib/types/database";
import { BLOG_CATEGORIES } from "@/lib/content-constants";
import { createClient as createBrowserClient } from "@/lib/supabase/client";
import { formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { saveBlogPost, deleteBlogPost } from "./actions";

interface BlogManagerProps {
  posts: BlogPost[];
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export function BlogManager({ posts }: BlogManagerProps) {
  const router = useRouter();
  const [modalOpen, setModalOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<BlogPost | null>(null);
  const [isSaving, setIsSaving] = React.useState(false);
  const [isUploading, setIsUploading] = React.useState(false);

  const [formData, setFormData] = React.useState({
    title: "",
    slug: "",
    category: BLOG_CATEGORIES[0] as string,
    excerpt: "",
    content: "",
    cover_image_url: "",
    author_name: "Reflection Scrap Market Desk",
    read_time_minutes: 4,
    tagsText: "",
    is_published: true,
  });

  const openCreate = () => {
    setEditing(null);
    setFormData({
      title: "",
      slug: "",
      category: BLOG_CATEGORIES[0],
      excerpt: "",
      content: "",
      cover_image_url: "/gallery/copper-brass-sorting.svg",
      author_name: "Reflection Scrap Market Desk",
      read_time_minutes: 4,
      tagsText: "Mumbai Market, Scrap Rates",
      is_published: true,
    });
    setModalOpen(true);
  };

  const openEdit = (post: BlogPost) => {
    setEditing(post);
    setFormData({
      title: post.title,
      slug: post.slug,
      category: post.category,
      excerpt: post.excerpt,
      content: post.content,
      cover_image_url: post.cover_image_url || "",
      author_name: post.author_name,
      read_time_minutes: post.read_time_minutes,
      tagsText: post.tags.join(", "),
      is_published: post.is_published,
    });
    setModalOpen(true);
  };

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const supabase = createBrowserClient();
    if (!supabase) {
      toast.error("Supabase storage is not configured");
      return;
    }

    setIsUploading(true);
    try {
      const ext = file.name.split(".").pop() || "jpg";
      const filePath = `blog/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { error } = await supabase.storage
        .from("gallery-photos")
        .upload(filePath, file, { upsert: false });

      if (error) {
        toast.error(error.message);
        return;
      }

      const { data: urlData } = supabase.storage
        .from("gallery-photos")
        .getPublicUrl(filePath);
      setFormData((prev) => ({ ...prev, cover_image_url: urlData.publicUrl }));
      toast.success("Cover image uploaded!");
    } catch {
      toast.error("Upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const tags = formData.tagsText
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);

      const res = await saveBlogPost({
        id: editing?.id,
        title: formData.title,
        slug: formData.slug || slugify(formData.title),
        category: formData.category,
        excerpt: formData.excerpt,
        content: formData.content,
        cover_image_url: formData.cover_image_url || null,
        author_name: formData.author_name,
        read_time_minutes: Number(formData.read_time_minutes) || 4,
        tags,
        is_published: formData.is_published,
      });

      if (!res.success) {
        toast.error(res.error || "Failed to save blog post");
        return;
      }

      toast.success(res.message);
      setModalOpen(false);
      router.refresh();
    } catch {
      toast.error("Error saving post");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    const res = await deleteBlogPost(id);
    if (!res.success) {
      toast.error(res.error);
      return;
    }
    toast.success(res.message);
    router.refresh();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white">
            Market Trends & Blog Manager
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Publish scrap market updates, copper/steel rate insights, and demolition guides.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button asChild variant="outline" size="sm" className="bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700">
            <Link href="/blog" target="_blank">
              <span>View Blog</span>
              <ExternalLink className="h-3.5 w-3.5 ml-1.5" />
            </Link>
          </Button>
          <Button onClick={openCreate} size="sm" variant="secondary" className="gap-1.5">
            <Plus className="h-4 w-4" />
            <span>New Blog Post</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {posts.map((post) => {
          const avg =
            post.rating_count > 0
              ? (post.rating_sum / post.rating_count).toFixed(1)
              : "0.0";
          return (
            <div
              key={post.id}
              className="rounded-2xl border border-slate-800 bg-slate-950 p-5 flex flex-col justify-between gap-4"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between gap-2">
                  <Badge variant="blue" className="text-[11px]">
                    {post.category}
                  </Badge>
                  <Badge variant={post.is_published ? "success" : "warning"} className="text-[11px]">
                    {post.is_published ? "Published" : "Draft"}
                  </Badge>
                </div>
                <h2 className="text-base font-bold text-white leading-snug">
                  {post.title}
                </h2>
                <p className="text-xs text-slate-400 line-clamp-2">{post.excerpt}</p>
              </div>

              <div className="pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400">
                <div className="flex items-center gap-3">
                  <span>{formatDate(post.published_at)}</span>
                  <span className="inline-flex items-center gap-1 text-rose-400">
                    <Heart className="h-3.5 w-3.5" /> {post.likes_count}
                  </span>
                  <span className="inline-flex items-center gap-1 text-amber-400">
                    <Star className="h-3.5 w-3.5 fill-current" /> {avg} ({post.rating_count})
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => openEdit(post)}
                    className="h-8 px-2.5 text-xs bg-slate-900 border-slate-700 text-slate-200 hover:bg-slate-800"
                  >
                    <Edit2 className="h-3 w-3 mr-1" />
                    <span>Edit</span>
                  </Button>
                  {!post.id.startsWith("blog-") && (
                    <Button
                      type="button"
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(post.id)}
                      className="h-8 px-2.5 text-xs"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-2xl bg-slate-950 border-slate-800 text-slate-100">
          <DialogHeader>
            <DialogTitle className="text-white">
              {editing && !editing.id.startsWith("blog-") ? "Edit Blog Post" : "Publish New Market Blog"}
            </DialogTitle>
            <DialogDescription className="text-slate-400">
              Share scrap market trends, metal rate updates, or recycling guides.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5 sm:col-span-2">
                <Label className="text-slate-200">Article Title *</Label>
                <Input
                  required
                  value={formData.title}
                  onChange={(e) => {
                    const title = e.target.value;
                    setFormData((prev) => ({
                      ...prev,
                      title,
                      slug: editing ? prev.slug : slugify(title),
                    }));
                  }}
                  placeholder="e.g. Copper & Brass Price Trends in Mumbai This Quarter"
                  className="bg-slate-900 border-slate-700 text-white"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-slate-200">URL Slug *</Label>
                <Input
                  required
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: slugify(e.target.value) })}
                  placeholder="copper-brass-trends-mumbai"
                  className="bg-slate-900 border-slate-700 text-white"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-slate-200">Category *</Label>
                <Select
                  value={formData.category}
                  onValueChange={(val) => setFormData({ ...formData, category: val })}
                >
                  <SelectTrigger className="bg-slate-900 border-slate-700 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border-slate-700 text-white">
                    {BLOG_CATEGORIES.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-slate-200">Short Summary / Excerpt *</Label>
              <Input
                required
                value={formData.excerpt}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                placeholder="1-2 sentence preview shown on the blog listing page..."
                className="bg-slate-900 border-slate-700 text-white"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-slate-200">Article Body * (Use ### for headings, blank lines for paragraphs)</Label>
              <textarea
                required
                rows={7}
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="Write the full market analysis..."
                className="w-full rounded-lg border border-slate-700 bg-slate-900 p-3 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-blue"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-slate-200">Cover Image URL or Upload</Label>
                <div className="flex gap-2">
                  <Input
                    value={formData.cover_image_url}
                    onChange={(e) => setFormData({ ...formData, cover_image_url: e.target.value })}
                    placeholder="/gallery/copper-brass-sorting.svg"
                    className="bg-slate-900 border-slate-700 text-white"
                  />
                  <label className="inline-flex items-center justify-center h-11 px-3 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 text-xs font-semibold cursor-pointer shrink-0">
                    {isUploading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Upload className="h-4 w-4" />
                    )}
                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      onChange={handleCoverUpload}
                      className="sr-only"
                    />
                  </label>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-slate-200">Tags (comma separated)</Label>
                <Input
                  value={formData.tagsText}
                  onChange={(e) => setFormData({ ...formData, tagsText: e.target.value })}
                  placeholder="Copper, Mumbai, Demolition"
                  className="bg-slate-900 border-slate-700 text-white"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-slate-200">Author Name</Label>
                <Input
                  value={formData.author_name}
                  onChange={(e) => setFormData({ ...formData, author_name: e.target.value })}
                  className="bg-slate-900 border-slate-700 text-white"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-slate-200">Read Time (minutes)</Label>
                <Input
                  type="number"
                  min={1}
                  max={60}
                  value={formData.read_time_minutes}
                  onChange={(e) =>
                    setFormData({ ...formData, read_time_minutes: Number(e.target.value) || 4 })
                  }
                  className="bg-slate-900 border-slate-700 text-white"
                />
              </div>
            </div>

            <label className="flex items-center gap-2 text-xs font-semibold text-slate-300">
              <input
                type="checkbox"
                checked={formData.is_published}
                onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
                className="rounded border-slate-700"
              />
              <span>Publish immediately on public blog</span>
            </label>

            <div className="flex justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setModalOpen(false)}
                className="bg-slate-900 border-slate-700 text-slate-200"
              >
                Cancel
              </Button>
              <Button type="submit" variant="secondary" disabled={isSaving}>
                {isSaving && <Loader2 className="h-4 w-4 mr-1.5 animate-spin" />}
                <span>Save Blog Post</span>
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
