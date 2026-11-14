"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { isAuthorizedBlogAuthor } from "@/lib/auth-config";
import { saveLocalPost, deleteLocalPost } from "@/lib/services/blog";
import type { BlogPost } from "@/lib/types/database";

const blogSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(4, "Title must be at least 4 characters"),
  slug: z
    .string()
    .min(3, "Slug is required")
    .regex(/^[a-z0-9-]+$/, "Slug must contain lowercase letters, numbers, and hyphens only"),
  category: z.string().min(2, "Category is required"),
  excerpt: z.string().min(10, "Excerpt must be at least 10 characters"),
  content: z.string().min(20, "Article content must be at least 20 characters"),
  cover_image_url: z.string().nullable().optional(),
  author_name: z.string().min(2).default("Reflection Scrap Editorial"),
  read_time_minutes: z.number().int().min(1).max(60).default(4),
  tags: z.array(z.string()).default([]),
  is_published: z.boolean().default(true),
});

async function requireAuthorClient() {
  const supabase = await createClient();

  if (!supabase) {
    return { error: null, supabase: null, user: { email: "local-owner@reflectionscrap.com", id: "local-owner" } };
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Please log in with an authorized account to write or edit blogs.", supabase: null, user: null };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  const isAuthor = isAuthorizedBlogAuthor(user.email, profile?.role);
  if (!isAuthor) {
    return {
      error: `Access Denied: '${user.email}' is not on the authorized blog authors list.`,
      supabase: null,
      user: null,
    };
  }

  // Elevate database role if needed
  if (profile?.role !== "admin") {
    try {
      await supabase.from("profiles").update({ role: "admin" }).eq("id", user.id);
    } catch {
      // Ignore if RLS prevents updating profile
    }
  }

  return { error: null, supabase, user };
}

export async function saveBlogPost(input: z.infer<typeof blogSchema>) {
  try {
    const validated = blogSchema.safeParse(input);
    if (!validated.success) {
      return { success: false, error: validated.error.errors[0]?.message };
    }

    const { error: authErr, supabase, user } = await requireAuthorClient();
    if (authErr) return { success: false, error: authErr };

    const authorName = validated.data.author_name || "Reflection Scrap Editorial";
    const publishedAt = new Date().toISOString();
    const postId = validated.data.id || `post-${Date.now()}`;

    const memoryPost: BlogPost = {
      id: postId,
      title: validated.data.title,
      slug: validated.data.slug,
      category: validated.data.category,
      excerpt: validated.data.excerpt,
      content: validated.data.content,
      cover_image_url: validated.data.cover_image_url || "/gallery/copper-brass-sorting.svg",
      author_name: authorName,
      read_time_minutes: validated.data.read_time_minutes,
      tags: validated.data.tags,
      likes_count: 0,
      rating_sum: 0,
      rating_count: 0,
      is_published: validated.data.is_published,
      published_at: publishedAt,
      created_at: publishedAt,
      updated_at: publishedAt,
    };

    // Save to local cache for instant retrieval
    saveLocalPost(memoryPost);

    if (supabase) {
      const payload = {
        title: validated.data.title,
        slug: validated.data.slug,
        category: validated.data.category,
        excerpt: validated.data.excerpt,
        content: validated.data.content,
        cover_image_url: validated.data.cover_image_url || "/gallery/copper-brass-sorting.svg",
        author_name: authorName,
        read_time_minutes: validated.data.read_time_minutes,
        tags: validated.data.tags,
        is_published: validated.data.is_published,
      };

      if (validated.data.id && !validated.data.id.startsWith("blog-")) {
        const { error } = await supabase
          .from("blog_posts")
          .update(payload)
          .eq("id", validated.data.id);
        if (error) {
          console.warn("Supabase update error, saved locally:", error.message);
        }
      } else {
        const { error } = await supabase.from("blog_posts").insert({
          ...payload,
          published_at: publishedAt,
        });
        if (error) {
          console.warn("Supabase insert error, saved locally:", error.message);
        }
      }
    }

    revalidatePath("/blog");
    revalidatePath(`/blog/${validated.data.slug}`);
    revalidatePath("/admin/blog");

    return {
      success: true,
      message: validated.data.id ? "Blog post updated successfully!" : "Blog post published successfully!",
      slug: validated.data.slug,
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error saving blog post";
    return { success: false, error: message };
  }
}

export async function deleteBlogPost(id: string) {
  try {
    const { error: authErr, supabase } = await requireAuthorClient();
    if (authErr) return { success: false, error: authErr };

    deleteLocalPost(id);

    if (supabase && !id.startsWith("blog-")) {
      const { error } = await supabase.from("blog_posts").delete().eq("id", id);
      if (error) {
        console.warn("Supabase delete error:", error.message);
      }
    }

    revalidatePath("/blog");
    revalidatePath("/admin/blog");
    return { success: true, message: "Blog post deleted successfully." };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error deleting blog post";
    return { success: false, error: message };
  }
}
