"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function toggleEnquiryStatus(
  enquiryId: string,
  field: "is_read" | "is_replied",
  value: boolean
) {
  try {
    const supabase = await createClient();
    if (!supabase) return { success: false, error: "Database not connected" };

    const { error } = await supabase
      .from("enquiries")
      .update({ [field]: value })
      .eq("id", enquiryId);

    if (error) return { success: false, error: error.message };

    revalidatePath("/admin/enquiries");
    return { success: true };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error toggling enquiry";
    return { success: false, error: message };
  }
}

