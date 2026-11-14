"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Loader2,
  X,
  Sparkles,
  Image as ImageIcon,
  CheckCircle2,
  Tag,
  Clock,
  BookOpen,
} from "lucide-react";
import type { BlogPost } from "@/lib/types/database";
import { BLOG_CATEGORIES } from "@/lib/content-constants";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { saveBlogPost } from "@/app/admin/blog/actions";

interface BlogEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  post?: BlogPost | null;
  defaultAuthorName?: string;
  onSaved?: (savedSlug: string) => void;
}

const PRESET_COVERS = [
  { label: "Copper & Non-Ferrous", url: "/gallery/copper-brass-sorting.svg" },
  { label: "Corporate Demolition", url: "/gallery/corporate-demolition.svg" },
  { label: "E-Waste & IT Assets", url: "/gallery/ewaste-recovery.svg" },
  { label: "Digital Weighing & Yard", url: "/gallery/digital-weighing.svg" },
];

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export function BlogEditorModal({
  isOpen,
  onClose,
  post,
  defaultAuthorName = "Reflection Scrap Editorial",
  onSaved,
}: BlogEditorModalProps) {
  const router = useRouter();
  const [isSaving, setIsSaving] = React.useState(false);

  const [formData, setFormData] = React.useState({
    title: "",
    slug: "",
    category: BLOG_CATEGORIES[0] as string,
    excerpt: "",
    content: "",
    cover_image_url: "/gallery/copper-brass-sorting.svg",
    author_name: defaultAuthorName,
    read_time_minutes: 4,
    tagsText: "Mumbai Market, Scrap Rates",
    is_published: true,
  });

  // Populate form whenever dialog opens or `post` changes
  React.useEffect(() => {
    if (post) {
      setFormData({
        title: post.title,
        slug: post.slug,
        category: post.category,
        excerpt: post.excerpt,
        content: post.content,
        cover_image_url: post.cover_image_url || "/gallery/copper-brass-sorting.svg",
        author_name: post.author_name || defaultAuthorName,
        read_time_minutes: post.read_time_minutes || 4,
        tagsText: post.tags?.join(", ") || "",
        is_published: post.is_published ?? true,
      });
    } else {
      setFormData({
        title: "",
        slug: "",
        category: BLOG_CATEGORIES[0] || "Metal Markets",
        excerpt: "",
        content: "",
        cover_image_url: "/gallery/copper-brass-sorting.svg",
        author_name: defaultAuthorName,
        read_time_minutes: 4,
        tagsText: "Mumbai Market, Scrap Rates",
        is_published: true,
      });
    }
  }, [post, defaultAuthorName, isOpen]);

  const handleTitleChange = (val: string) => {
    // If creating new post, auto-generate slug unless manually touched
    if (!post) {
      setFormData((prev) => ({
        ...prev,
        title: val,
        slug: slugify(val),
      }));
    } else {
      setFormData((prev) => ({ ...prev, title: val }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      toast.error("Please enter a blog title.");
      return;
    }
    if (!formData.slug.trim()) {
      toast.error("Please enter a valid URL slug.");
      return;
    }
    if (!formData.excerpt.trim()) {
      toast.error("Please enter a short excerpt for preview.");
      return;
    }
    if (!formData.content.trim()) {
      toast.error("Please write the blog content.");
      return;
    }

    setIsSaving(true);
    try {
      const tags = formData.tagsText
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);

      const res = await saveBlogPost({
        id: post?.id,
        title: formData.title.trim(),
        slug: formData.slug.trim(),
        category: formData.category,
        excerpt: formData.excerpt.trim(),
        content: formData.content.trim(),
        cover_image_url: formData.cover_image_url,
        author_name: formData.author_name.trim() || defaultAuthorName,
        read_time_minutes: Number(formData.read_time_minutes) || 4,
        tags,
        is_published: formData.is_published,
      });

      if (res.success) {
        toast.success(post ? "Blog post updated successfully!" : "Blog post published successfully!");
        onClose();
        router.refresh();
        if (onSaved && res.slug) {
          onSaved(res.slug);
        }
      } else {
        toast.error(res.error || "Failed to save blog post");
      }
    } catch {
      toast.error("An unexpected error occurred while saving.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl max-h-[92vh] overflow-y-auto rounded-3xl p-6 sm:p-8">
        <DialogHeader className="space-y-1 pb-2 border-b border-brand-border">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-brand-green">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Author Studio</span>
          </div>
          <DialogTitle className="text-xl sm:text-2xl font-bold text-brand-dark">
            {post ? "Edit Blog Post" : "Write & Publish New Blog"}
          </DialogTitle>
          <DialogDescription className="text-xs sm:text-sm text-brand-muted">
            {post
              ? "Update the article title, content, market tips, or cover graphics."
              : "Share scrap market insights, copper/brass trends, or corporate demolition tips on the live blog."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 pt-3">
          {/* 1. Title */}
          <div className="space-y-1.5">
            <Label htmlFor="blog-title" className="text-xs font-bold uppercase tracking-wider text-brand-dark">
              Article Title *
            </Label>
            <Input
              id="blog-title"
              required
              value={formData.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="e.g. Copper Scrap Price Surge in Mumbai: Causes & Forecast"
              className="text-sm font-semibold"
            />
          </div>

          {/* 2. URL Slug & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="blog-slug" className="text-xs font-bold uppercase tracking-wider text-brand-dark">
                URL Slug (web-address) *
              </Label>
              <Input
                id="blog-slug"
                required
                value={formData.slug}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, slug: slugify(e.target.value) }))
                }
                placeholder="copper-scrap-price-surge-mumbai"
                className="font-mono text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-bold uppercase tracking-wider text-brand-dark">
                Market Category *
              </Label>
              <Select
                value={formData.category}
                onValueChange={(val) => setFormData((prev) => ({ ...prev, category: val }))}
              >
                <SelectTrigger className="text-xs font-semibold">
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent>
                  {BLOG_CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat} className="text-xs">
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* 3. Cover Image Selection */}
          <div className="space-y-2">
            <Label className="text-xs font-bold uppercase tracking-wider text-brand-dark flex items-center justify-between">
              <span>Cover Graphic / Illustration</span>
              <span className="text-[11px] font-normal text-brand-muted">Pick a preset or enter URL</span>
            </Label>

            {/* Presets */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {PRESET_COVERS.map((preset) => {
                const isSelected = formData.cover_image_url === preset.url;
                return (
                  <button
                    key={preset.url}
                    type="button"
                    onClick={() => setFormData((prev) => ({ ...prev, cover_image_url: preset.url }))}
                    className={`p-2 rounded-xl border text-left transition-all ${
                      isSelected
                        ? "border-brand-green bg-brand-green-light/30 shadow-sm"
                        : "border-brand-border bg-muted/40 hover:bg-muted"
                    }`}
                  >
                    <div className="aspect-[16/9] rounded-lg overflow-hidden bg-white mb-1.5 border border-brand-border/60">
                      <img src={preset.url} alt={preset.label} className="w-full h-full object-cover" />
                    </div>
                    <p className="text-[11px] font-bold text-brand-dark truncate">{preset.label}</p>
                  </button>
                );
              })}
            </div>

            <Input
              value={formData.cover_image_url}
              onChange={(e) => setFormData((prev) => ({ ...prev, cover_image_url: e.target.value }))}
              placeholder="Or paste custom image URL: https://..."
              className="text-xs mt-1"
            />
          </div>

          {/* 4. Excerpt / Short Summary */}
          <div className="space-y-1.5">
            <Label htmlFor="blog-excerpt" className="text-xs font-bold uppercase tracking-wider text-brand-dark">
              Short Summary / Excerpt *
            </Label>
            <textarea
              id="blog-excerpt"
              required
              rows={2}
              value={formData.excerpt}
              onChange={(e) => setFormData((prev) => ({ ...prev, excerpt: e.target.value }))}
              placeholder="1-2 sentences summarizing the article on the blog card..."
              className="w-full p-3 rounded-xl border border-brand-border bg-brand-surface text-xs text-brand-dark focus:outline-none focus:ring-2 focus:ring-brand-blue resize-none"
            />
          </div>

          {/* 5. Full Article Content */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="blog-content" className="text-xs font-bold uppercase tracking-wider text-brand-dark">
                Full Article Content *
              </Label>
              <span className="text-[10px] text-brand-muted">
                Tip: Use <strong>### Heading</strong> for sections, <strong>- list</strong> for bullet points.
              </span>
            </div>
            <textarea
              id="blog-content"
              required
              rows={8}
              value={formData.content}
              onChange={(e) => setFormData((prev) => ({ ...prev, content: e.target.value }))}
              placeholder="Write your article paragraphs here...&#10;&#10;### 1. Market Overview&#10;Explain the scrap market details...&#10;&#10;- Bullet point one&#10;- Bullet point two"
              className="w-full p-3.5 rounded-xl border border-brand-border bg-brand-surface text-xs leading-relaxed text-brand-dark focus:outline-none focus:ring-2 focus:ring-brand-blue font-sans"
            />
          </div>

          {/* 6. Author Name, Read Time, Tags */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1">
              <Label htmlFor="blog-author" className="text-[11px] font-bold text-brand-dark">
                Author Name
              </Label>
              <Input
                id="blog-author"
                value={formData.author_name}
                onChange={(e) => setFormData((prev) => ({ ...prev, author_name: e.target.value }))}
                className="text-xs h-9"
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="blog-read-time" className="text-[11px] font-bold text-brand-dark">
                Read Time (Minutes)
              </Label>
              <Input
                id="blog-read-time"
                type="number"
                min={1}
                max={60}
                value={formData.read_time_minutes}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, read_time_minutes: parseInt(e.target.value) || 4 }))
                }
                className="text-xs h-9"
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="blog-tags" className="text-[11px] font-bold text-brand-dark">
                Tags (comma separated)
              </Label>
              <Input
                id="blog-tags"
                value={formData.tagsText}
                onChange={(e) => setFormData((prev) => ({ ...prev, tagsText: e.target.value }))}
                placeholder="Copper, Rates, Mumbai"
                className="text-xs h-9"
              />
            </div>
          </div>

          {/* 7. Publish Immediately Toggle */}
          <div className="p-3 rounded-xl bg-brand-bg border border-brand-border flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-brand-dark">Publish Immediately</p>
              <p className="text-[11px] text-brand-muted">Make article publicly visible right now on /blog</p>
            </div>
            <input
              type="checkbox"
              id="is_published"
              checked={formData.is_published}
              onChange={(e) => setFormData((prev) => ({ ...prev, is_published: e.target.checked }))}
              className="h-4 w-4 rounded accent-brand-green cursor-pointer"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-2 border-t border-brand-border">
            <Button type="button" variant="outline" size="sm" onClick={onClose} disabled={isSaving}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="default"
              size="sm"
              disabled={isSaving}
              className="bg-brand-green hover:bg-brand-green/90 text-white font-bold gap-1.5 shadow-sm px-5"
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>{post ? "Update Blog Post" : "Publish Blog Post"}</span>
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
