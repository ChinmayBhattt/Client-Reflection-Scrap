"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const categorySchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, "Name required"),
  slug: z.string().min(2, "Slug required"),
  icon: z.string().optional().default("Hammer"),
  sort_order: z.number().default(0),
  is_active: z.boolean().default(true),
});

const itemSchema = z.object({
  id: z.string().optional(),
  category_id: z.string().min(1, "Category is required"),
  name: z.string().min(2, "Item name required"),
  unit: z.string().min(1, "Unit required").default("kg"),
  rate_per_unit: z.number().min(0, "Rate must be non-negative"),
  is_active: z.boolean().default(true),
});

export async function saveCategory(input: z.infer<typeof categorySchema>) {
  try {
    const validated = categorySchema.safeParse(input);
    if (!validated.success) {
      return { success: false, error: validated.error.errors[0]?.message };
    }

    const supabase = await createClient();
    if (!supabase) return { success: false, error: "Database not connected" };

    const { data: profile } = await supabase.from("profiles").select("role").single();
    if (profile?.role !== "admin") return { success: false, error: "Admin only" };

    if (validated.data.id && !validated.data.id.startsWith("cat-")) {
      const { error } = await supabase
        .from("scrap_categories")
        .update(validated.data)
        .eq("id", validated.data.id);
      if (error) return { success: false, error: error.message };
    } else {
      const { id, ...createData } = validated.data;
      const { error } = await supabase.from("scrap_categories").insert(createData);
      if (error) return { success: false, error: error.message };
    }

    revalidatePath("/admin/rates");
    revalidatePath("/rates");
    revalidatePath("/");
    return { success: true, message: "Category saved successfully!" };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error saving category";
    return { success: false, error: message };
  }
}

export async function saveItem(input: z.infer<typeof itemSchema>) {
  try {
    const validated = itemSchema.safeParse(input);
    if (!validated.success) {
      return { success: false, error: validated.error.errors[0]?.message };
    }

    const supabase = await createClient();
    if (!supabase) return { success: false, error: "Database not connected" };

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { success: false, error: "Unauthorized" };

    const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
    if (profile?.role !== "admin") return { success: false, error: "Admin only" };

    if (validated.data.id && !validated.data.id.startsWith("item-")) {
      // Fetch old rate to record history
      const { data: oldItem } = await supabase
        .from("scrap_items")
        .select("rate_per_unit")
        .eq("id", validated.data.id)
        .single();

      const oldRate = Number(oldItem?.rate_per_unit) || 0;
      const newRate = Number(validated.data.rate_per_unit);

      const { error } = await supabase
        .from("scrap_items")
        .update(validated.data)
        .eq("id", validated.data.id);

      if (error) return { success: false, error: error.message };

      // If rate changed, log history
      if (oldRate !== newRate) {
        await supabase.from("rate_history").insert({
          item_id: validated.data.id,
          old_rate: oldRate,
          new_rate: newRate,
          changed_by: user.id,
        });
      }
    } else {
      const { id, ...createData } = validated.data;
      const { data: newItem, error } = await supabase
        .from("scrap_items")
        .insert(createData)
        .select("id")
        .single();

      if (error) return { success: false, error: error.message };

      if (newItem && validated.data.rate_per_unit > 0) {
        await supabase.from("rate_history").insert({
          item_id: newItem.id,
          old_rate: 0,
          new_rate: validated.data.rate_per_unit,
          changed_by: user.id,
        });
      }
    }

    revalidatePath("/admin/rates");
    revalidatePath("/rates");
    revalidatePath("/");
    return { success: true, message: "Scrap item saved successfully!" };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error saving item";
    return { success: false, error: message };
  }
}

