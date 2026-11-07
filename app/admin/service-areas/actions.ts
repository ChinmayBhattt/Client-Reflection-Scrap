"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const serviceAreaSchema = z.object({
  pincode: z.string().length(6, "Valid 6-digit Mumbai pincode required"),
  area_name: z.string().min(2, "Area name required"),
});

export async function addServiceArea(formData: FormData) {
  try {
    const rawData = {
      pincode: formData.get("pincode")?.toString().trim() || "",
      area_name: formData.get("area_name")?.toString().trim() || "",
    };

    const validated = serviceAreaSchema.safeParse(rawData);
    if (!validated.success) {
      return { success: false, error: validated.error.errors[0]?.message };
    }

    const supabase = await createClient();
    if (!supabase) return { success: false, error: "Database not connected" };

    const { error } = await supabase.from("service_areas").insert({
      pincode: validated.data.pincode,
      area_name: validated.data.area_name,
      is_active: true,
    });

    if (error) return { success: false, error: error.message };

    revalidatePath("/admin/service-areas");
    revalidatePath("/book");
    return { success: true, message: `Pincode ${validated.data.pincode} added to service areas!` };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error adding service area";
    return { success: false, error: message };
  }
}

export async function toggleServiceArea(id: string, is_active: boolean) {
  try {
    const supabase = await createClient();
    if (!supabase) return { success: false, error: "Database not connected" };

    const { error } = await supabase
      .from("service_areas")
      .update({ is_active })
      .eq("id", id);

    if (error) return { success: false, error: error.message };

    revalidatePath("/admin/service-areas");
    revalidatePath("/book");
    return { success: true };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error updating area";
    return { success: false, error: message };
  }
}

export async function deleteServiceArea(id: string) {
  try {
    const supabase = await createClient();
    if (!supabase) return { success: false, error: "Database not connected" };

    const { error } = await supabase.from("service_areas").delete().eq("id", id);
    if (error) return { success: false, error: error.message };

    revalidatePath("/admin/service-areas");
    revalidatePath("/book");
    return { success: true, message: "Service area removed." };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error deleting area";
    return { success: false, error: message };
  }
}

