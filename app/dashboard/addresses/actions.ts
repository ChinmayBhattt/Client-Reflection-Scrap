"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const addressSchema = z.object({
  label: z.string().min(1, "Label is required").default("Home"),
  name: z.string().min(2, "Contact name is required"),
  phone: z.string().min(10, "Valid 10-digit phone required"),
  line1: z.string().min(3, "Address line 1 is required"),
  area: z.string().min(2, "Area is required"),
  landmark: z.string().optional().default(""),
  pincode: z.string().length(6, "Valid 6-digit Mumbai pincode required"),
  is_default: z.boolean().default(false),
});

export type AddressInput = z.infer<typeof addressSchema>;

export async function addAddress(input: AddressInput) {
  try {
    const validated = addressSchema.safeParse(input);
    if (!validated.success) {
      return { success: false, error: validated.error.errors[0]?.message };
    }

    const supabase = await createClient();
    if (!supabase) return { success: false, error: "Database not connected" };

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { success: false, error: "Unauthorized" };

    // If marked default, unset other defaults
    if (validated.data.is_default) {
      await supabase
        .from("addresses")
        .update({ is_default: false })
        .eq("user_id", user.id);
    }

    const { error } = await supabase.from("addresses").insert({
      user_id: user.id,
      ...validated.data,
    });

    if (error) return { success: false, error: error.message };

    revalidatePath("/dashboard/addresses");
    revalidatePath("/book");
    return { success: true, message: "Address added successfully!" };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error adding address";
    return { success: false, error: message };
  }
}

export async function updateAddress(addressId: string, input: AddressInput) {
  try {
    const validated = addressSchema.safeParse(input);
    if (!validated.success) {
      return { success: false, error: validated.error.errors[0]?.message };
    }

    const supabase = await createClient();
    if (!supabase) return { success: false, error: "Database not connected" };

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { success: false, error: "Unauthorized" };

    if (validated.data.is_default) {
      await supabase
        .from("addresses")
        .update({ is_default: false })
        .eq("user_id", user.id);
    }

    const { error } = await supabase
      .from("addresses")
      .update(validated.data)
      .eq("id", addressId)
      .eq("user_id", user.id);

    if (error) return { success: false, error: error.message };

    revalidatePath("/dashboard/addresses");
    revalidatePath("/book");
    return { success: true, message: "Address updated successfully!" };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error updating address";
    return { success: false, error: message };
  }
}

export async function deleteAddress(addressId: string) {
  try {
    const supabase = await createClient();
    if (!supabase) return { success: false, error: "Database not connected" };

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { success: false, error: "Unauthorized" };

    const { error } = await supabase
      .from("addresses")
      .delete()
      .eq("id", addressId)
      .eq("user_id", user.id);

    if (error) return { success: false, error: error.message };

    revalidatePath("/dashboard/addresses");
    revalidatePath("/book");
    return { success: true, message: "Address deleted successfully." };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error deleting address";
    return { success: false, error: message };
  }
}

export async function setDefaultAddress(addressId: string) {
  try {
    const supabase = await createClient();
    if (!supabase) return { success: false, error: "Database not connected" };

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { success: false, error: "Unauthorized" };

    // Reset all
    await supabase
      .from("addresses")
      .update({ is_default: false })
      .eq("user_id", user.id);

    // Set target
    const { error } = await supabase
      .from("addresses")
      .update({ is_default: true })
      .eq("id", addressId)
      .eq("user_id", user.id);

    if (error) return { success: false, error: error.message };

    revalidatePath("/dashboard/addresses");
    revalidatePath("/book");
    return { success: true, message: "Default address updated." };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error setting default";
    return { success: false, error: message };
  }
}
