"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { isAuthorizedBlogAuthor } from "@/lib/auth-config";

const gallerySchema = z.object({
  id: z.string().optional(),
  title: z.string().min(3, "Title must be at least 3 characters"),
  category: z.string().min(2, "Category is required"),
  description: z.string().nullable().optional(),
  location: z.string().nullable().optional(),
  activity_date: z.string().nullable().optional(),
  image_url: z.string().nullable().optional(),
  highlight_stat: z.string().nullable().optional(),
  sort_order: z.number().int().default(0),
  is_published: z.boolean().default(true),
});

async function requireAdminClient() {
  const supabase = await createClient();
  if (!supabase) return { error: null, supabase: null };

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized: Please log in first", supabase: null };

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  const isAuthor = isAuthorizedBlogAuthor(user.email, profile?.role);
  if (!isAuthor) return { error: "Admin only", supabase: null };

  if (profile?.role !== "admin") {
    try {
      await supabase.from("profiles").update({ role: "admin" }).eq("id", user.id);
    } catch {
      // Ignore if RLS blocks role update
    }
  }

  return { error: null, supabase };
}

export async function saveGalleryItem(input: z.infer<typeof gallerySchema>) {
  try {
    const validated = gallerySchema.safeParse(input);
    if (!validated.success) {
      return { success: false, error: validated.error.errors[0]?.message };
    }

    const { error: authErr, supabase } = await requireAdminClient();
    if (authErr || !supabase) return { success: false, error: authErr || "Unauthorized" };

    const payload = {
      title: validated.data.title,
      category: validated.data.category,
      description: validated.data.description || null,
      location: validated.data.location || null,
      activity_date: validated.data.activity_date || null,
      image_url: validated.data.image_url || null,
      highlight_stat: validated.data.highlight_stat || null,
      sort_order: validated.data.sort_order,
      is_published: validated.data.is_published,
    };

    if (validated.data.id && !validated.data.id.startsWith("gal-")) {
      const { error } = await supabase
        .from("gallery_items")
        .update(payload)
        .eq("id", validated.data.id);
      if (error) return { success: false, error: error.message };
    } else {
      const { error } = await supabase.from("gallery_items").insert(payload);
      if (error) return { success: false, error: error.message };
    }

    revalidatePath("/gallery");
    revalidatePath("/admin/gallery");
    return { success: true, message: "Gallery item saved!" };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error saving gallery item";
    return { success: false, error: message };
  }
}

export async function deleteGalleryItem(id: string) {
  try {
    if (id.startsWith("gal-")) {
      return { success: false, error: "Seed demo items disappear automatically once you publish your first database item." };
    }

    const { error: authErr, supabase } = await requireAdminClient();
    if (authErr || !supabase) return { success: false, error: authErr || "Unauthorized" };

    const { error } = await supabase.from("gallery_items").delete().eq("id", id);
    if (error) return { success: false, error: error.message };

    revalidatePath("/gallery");
    revalidatePath("/admin/gallery");
    return { success: true, message: "Gallery item deleted." };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error deleting gallery item";
    return { success: false, error: message };
  }
}

