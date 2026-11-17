"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { isAuthorizedBlogAuthor } from "@/lib/auth-config";
import {
  saveLocalGalleryItem,
  deleteLocalGalleryItem,
} from "@/lib/services/gallery";
import type { GalleryItem } from "@/lib/types/database";

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
  if (!supabase) {
    return {
      error: null,
      supabase: null,
      user: { email: "local-owner@reflectionscrap.com", id: "local-owner" },
    };
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return {
      error: "Unauthorized: Please log in with an authorized owner email first.",
      supabase: null,
      user: null,
    };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  const isAuthor = isAuthorizedBlogAuthor(user.email, profile?.role);
  if (!isAuthor) {
    return {
      error: `Access Denied: '${user.email}' is not on the authorized owners list.`,
      supabase: null,
      user: null,
    };
  }

  if (profile?.role !== "admin") {
    try {
      await supabase.from("profiles").update({ role: "admin" }).eq("id", user.id);
    } catch {
      // Ignore if RLS blocks role update
    }
  }

  return { error: null, supabase, user };
}

export async function saveGalleryItem(input: z.infer<typeof gallerySchema>) {
  try {
    const validated = gallerySchema.safeParse(input);
    if (!validated.success) {
      return { success: false, error: validated.error.errors[0]?.message };
    }

    const { error: authErr, supabase } = await requireAdminClient();
    if (authErr) return { success: false, error: authErr };

    const payload = {
      title: validated.data.title,
      category: validated.data.category,
      description: validated.data.description || null,
      location: validated.data.location || null,
      activity_date: validated.data.activity_date || null,
      image_url: validated.data.image_url || "/gallery/corporate-demolition.svg",
      highlight_stat: validated.data.highlight_stat || null,
      sort_order: validated.data.sort_order,
      is_published: validated.data.is_published,
    };

    const targetId = validated.data.id || `gal-${Date.now()}`;
    const nowIso = new Date().toISOString();

    const memoryItem: GalleryItem = {
      id: targetId,
      ...payload,
      created_at: nowIso,
      updated_at: nowIso,
    };

    // Save in memory store for instant fallback access
    saveLocalGalleryItem(memoryItem);

    if (supabase) {
      if (validated.data.id && !validated.data.id.startsWith("gal-")) {
        const { error } = await supabase
          .from("gallery_items")
          .update(payload)
          .eq("id", validated.data.id);
        if (error) {
          console.warn("Supabase update error (using local memory store):", error.message);
        }
      } else {
        const { data: inserted, error } = await supabase
          .from("gallery_items")
          .insert(payload)
          .select()
          .maybeSingle();

        if (error) {
          console.warn("Supabase insert error (using local memory store):", error.message);
        } else if (inserted) {
          saveLocalGalleryItem(inserted as GalleryItem);
        }
      }
    }

    revalidatePath("/gallery");
    revalidatePath("/admin/gallery");
    return { success: true, message: "Gallery activity saved & published!" };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error saving gallery item";
    return { success: false, error: message };
  }
}

export async function deleteGalleryItem(id: string) {
  try {
    const { error: authErr, supabase } = await requireAdminClient();
    if (authErr) return { success: false, error: authErr };

    // Always delete from memory store so demo items can also be deleted
    deleteLocalGalleryItem(id);

    if (supabase && !id.startsWith("gal-")) {
      const { error } = await supabase.from("gallery_items").delete().eq("id", id);
      if (error) {
        console.warn("Supabase delete error (using local memory store):", error.message);
      }
    }

    revalidatePath("/gallery");
    revalidatePath("/admin/gallery");
    return { success: true, message: "Gallery item removed." };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error deleting gallery item";
    return { success: false, error: message };
  }
}

export async function uploadGalleryPhotoAction(formData: FormData) {
  try {
    const { error: authErr, supabase } = await requireAdminClient();
    if (authErr) return { success: false, error: authErr };

    const file = formData.get("file") as File | null;
    if (!file || !(file instanceof File)) {
      return { success: false, error: "No image file provided." };
    }

    // Limit to 6MB
    if (file.size > 6 * 1024 * 1024) {
      return { success: false, error: "Image file is too large (maximum 6MB)." };
    }

    const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const filePath = `activities/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

    // Try Supabase Storage if configured
    if (supabase) {
      try {
        const { error: uploadError } = await supabase.storage
          .from("gallery-photos")
          .upload(filePath, file, {
            contentType: file.type || "image/jpeg",
            upsert: false,
          });

        if (!uploadError) {
          const { data: urlData } = supabase.storage
            .from("gallery-photos")
            .getPublicUrl(filePath);

          if (urlData?.publicUrl) {
            return { success: true, url: urlData.publicUrl };
          }
        } else {
          console.warn("Supabase storage upload failed, falling back to base64:", uploadError.message);
        }
      } catch (storageErr) {
        console.warn("Storage attempt failed:", storageErr);
      }
    }

    // High reliability fallback: Convert file buffer to Data URL
    const buffer = Buffer.from(await file.arrayBuffer());
    const mimeType = file.type || "image/jpeg";
    const base64Url = `data:${mimeType};base64,${buffer.toString("base64")}`;

    return { success: true, url: base64Url };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Upload failed";
    return { success: false, error: message };
  }
}

