"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const profileSchema = z.object({
  full_name: z.string().min(2, "Full name must be at least 2 characters"),
  phone: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .regex(/^[0-9+\s-]+$/, "Invalid phone format"),
});

export async function updateProfile(formData: FormData) {
  try {
    const rawData = {
      full_name: formData.get("full_name")?.toString().trim() || "",
      phone: formData.get("phone")?.toString().trim() || "",
    };

    const validated = profileSchema.safeParse(rawData);
    if (!validated.success) {
      return { success: false, error: validated.error.errors[0]?.message };
    }

    const supabase = await createClient();
    if (!supabase) return { success: false, error: "Database not connected" };

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { success: false, error: "Unauthorized" };

    // Update only full_name and phone - role is deliberately not touched
    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: validated.data.full_name,
        phone: validated.data.phone,
      })
      .eq("id", user.id);

    if (error) return { success: false, error: error.message };

    revalidatePath("/dashboard/profile");
    revalidatePath("/dashboard");
    revalidatePath("/", "layout");

    return { success: true, message: "Profile updated successfully!" };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error updating profile";
    return { success: false, error: message };
  }
}

