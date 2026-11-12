"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

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

async function requireAdminClient() {
  const supabase = await createClient();
  if (!supabase) return { error: "Database not connected", supabase: null };

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized", supabase: null };

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();
  if (profile?.role !== "admin") return { error: "Admin only", supabase: null };

  return { error: null, supabase };
}

export async function saveBlogPost(input: z.infer<typeof blogSchema>) {
  try {
    const validated = blogSchema.safeParse(input);
    if (!validated.success) {
      return { success: false, error: validated.error.errors[0]?.message };
    }

    const { error: authErr, supabase } = await requireAdminClient();
    if (authErr || !supabase) return { success: false, error: authErr || "Unauthorized" };

    const payload = {
      title: validated.data.title,
      slug: validated.data.slug,
      category: validated.data.category,
      excerpt: validated.data.excerpt,
      content: validated.data.content,
      cover_image_url: validated.data.cover_image_url || null,
      author_name: validated.data.author_name,
      read_time_minutes: validated.data.read_time_minutes,
      tags: validated.data.tags,
      is_published: validated.data.is_published,
    };

    if (validated.data.id && !validated.data.id.startsWith("blog-")) {
      const { error } = await supabase
        .from("blog_posts")
        .update(payload)
        .eq("id", validated.data.id);
      if (error) return { success: false, error: error.message };
    } else {
      const { error } = await supabase.from("blog_posts").insert({
        ...payload,
        published_at: new Date().toISOString(),
      });
      if (error) return { success: false, error: error.message };
    }

    revalidatePath("/blog");
    revalidatePath(`/blog/${validated.data.slug}`);
    revalidatePath("/admin/blog");
    return { success: true, message: "Blog post saved!" };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error saving blog post";
    return { success: false, error: message };
  }
}

export async function deleteBlogPost(id: string) {
  try {
    if (id.startsWith("blog-")) {
      return { success: false, error: "Seed demo posts disappear automatically once you publish your first database post." };
    }

    const { error: authErr, supabase } = await requireAdminClient();
    if (authErr || !supabase) return { success: false, error: authErr || "Unauthorized" };

    const { error } = await supabase.from("blog_posts").delete().eq("id", id);
    if (error) return { success: false, error: error.message };

    revalidatePath("/blog");
    revalidatePath("/admin/blog");
    return { success: true, message: "Blog post deleted." };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error deleting blog post";
    return { success: false, error: message };
  }
}

