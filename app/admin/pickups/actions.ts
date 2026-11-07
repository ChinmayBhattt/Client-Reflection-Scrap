"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { PickupStatus } from "@/lib/types/database";

const updatePickupSchema = z.object({
  pickupId: z.string().uuid(),
  status: z.enum([
    "pending",
    "confirmed",
    "scheduled",
    "picked_up",
    "completed",
    "cancelled",
  ]),
  assigned_to: z.string().optional().default(""),
  admin_notes: z.string().optional().default(""),
  final_amount: z.number().nullable().optional(),
  items: z.array(
    z.object({
      id: z.string().uuid(),
      actual_weight: z.number().nullable().optional(),
      amount: z.number().nullable().optional(),
    })
  ).optional(),
});

export type UpdatePickupAdminInput = z.infer<typeof updatePickupSchema>;

export async function updatePickupByAdmin(input: UpdatePickupAdminInput) {
  try {
    const validated = updatePickupSchema.safeParse(input);
    if (!validated.success) {
      return { success: false, error: validated.error.errors[0]?.message };
    }

    const supabase = await createClient();
    if (!supabase) return { success: false, error: "Database not connected" };

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { success: false, error: "Unauthorized" };

    // Verify admin
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (!profile || profile.role !== "admin") {
      return { success: false, error: "Admin authorization required" };
    }

    const { pickupId, status, assigned_to, admin_notes, final_amount, items } =
      validated.data;

    // Update pickup master row
    const { error: pickupError } = await supabase
      .from("pickups")
      .update({
        status,
        assigned_to: assigned_to || null,
        admin_notes: admin_notes || null,
        final_amount: final_amount ?? null,
      })
      .eq("id", pickupId);

    if (pickupError) return { success: false, error: pickupError.message };

    // Update actual weights & amounts for items if provided
    if (items && items.length > 0) {
      for (const item of items) {
        await supabase
          .from("pickup_items")
          .update({
            actual_weight: item.actual_weight ?? null,
            amount: item.amount ?? null,
          })
          .eq("id", item.id);
      }
    }

    revalidatePath("/admin/pickups");
    revalidatePath("/admin");
    revalidatePath("/dashboard");

    return { success: true, message: "Pickup updated successfully!" };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error updating pickup";
    return { success: false, error: message };
  }
}
