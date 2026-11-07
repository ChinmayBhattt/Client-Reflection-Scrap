"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import {
  generateBookingCode,
  checkPincodeServiceability,
} from "@/lib/services/pickups";
import { SITE_CONFIG } from "@/lib/site-config";

const bookingItemSchema = z.object({
  item_id: z.string().min(1, "Item selection is required"),
  name: z.string(),
  unit: z.string(),
  rate_per_unit: z.number().default(0),
  approx_weight: z.number().min(0.5, "Weight must be at least 0.5 kg"),
  notes: z.string().optional().default(""),
});

const bookingSchema = z.object({
  pickup_type: z.enum(["doorstep", "dropoff"]),
  address: z
    .object({
      name: z.string().min(2, "Contact name is required"),
      phone: z.string().min(10, "Valid 10-digit phone required"),
      line1: z.string().min(3, "Address / Building is required"),
      area: z.string().min(2, "Area is required"),
      landmark: z.string().optional(),
      pincode: z.string().length(6, "Mumbai pincode must be exactly 6 digits"),
      save_address: z.boolean().optional(),
    })
    .optional(),
  slot_date: z.string().min(1, "Pickup date is required"),
  slot_time: z.string().min(1, "Time slot is required"),
  items: z.array(bookingItemSchema).min(1, "At least one scrap item is required"),
  photos: z.array(z.string()).max(5).optional().default([]),
});

export type BookingInput = z.infer<typeof bookingSchema>;

export async function checkPincode(pincode: string) {
  return await checkPincodeServiceability(pincode);
}

export async function submitBooking(input: BookingInput) {
  try {
    const validated = bookingSchema.safeParse(input);
    if (!validated.success) {
      return {
        success: false,
        error: validated.error.errors[0]?.message || "Invalid booking data",
      };
    }

    const { pickup_type, address, slot_date, slot_time, items, photos } =
      validated.data;

    // Verify service area if doorstep
    if (pickup_type === "doorstep") {
      if (!address) {
        return { success: false, error: "Address is required for doorstep pickup" };
      }
      const check = await checkPincodeServiceability(address.pincode);
      if (!check.isServiceable) {
        return {
          success: false,
          error: `Pincode ${address.pincode} is currently not in our direct service area. Please choose yard drop-off or contact us on WhatsApp.`,
        };
      }
    }

    const supabase = await createClient();
    let userId = "00000000-0000-0000-0000-000000000000";

    if (supabase) {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        return {
          success: false,
          error: "You must be logged in to book a pickup.",
        };
      }
      userId = user.id;
    }

    const bookingCode = generateBookingCode();

    // In local standalone mode without Supabase connection, generate successful booking receipt
    if (!supabase) {
      return {
        success: true,
        bookingCode,
        message: "Booking confirmed successfully!",
      };
    }

    // Save address if user opted in
    let savedAddressId = null;
    if (pickup_type === "doorstep" && address?.save_address && userId) {
      const { data: addressRow } = await supabase
        .from("addresses")
        .insert({
          user_id: userId,
          label: "Pickup Location",
          name: address.name,
          phone: address.phone,
          line1: address.line1,
          area: address.area,
          landmark: address.landmark || null,
          pincode: address.pincode,
          is_default: false,
        })
        .select("id")
        .single();

      if (addressRow) {
        savedAddressId = addressRow.id;
      }
    }

    // Insert into pickups table
    const { data: pickupRow, error: pickupError } = await supabase
      .from("pickups")
      .insert({
        booking_code: bookingCode,
        user_id: userId,
        address_id: savedAddressId,
        address_snapshot:
          pickup_type === "doorstep"
            ? address
            : {
                name: "Yard Drop-Off",
                line1: SITE_CONFIG.address.street,
                area: SITE_CONFIG.address.city,
                pincode: SITE_CONFIG.address.pincode,
              },
        pickup_type,
        slot_date,
        slot_time,
        status: "pending",
      })
      .select("id")
      .single();

    if (pickupError || !pickupRow) {
      return {
        success: false,
        error: pickupError?.message || "Failed to create pickup record",
      };
    }

    // Insert items
    const pickupItemsData = items.map((it) => ({
      pickup_id: pickupRow.id,
      item_id: it.item_id.startsWith("item-") ? null : it.item_id, // handle UUID vs fallback
      approx_weight: it.approx_weight,
      notes: it.notes || `${it.name} (${it.approx_weight} ${it.unit})`,
    }));

    await supabase.from("pickup_items").insert(pickupItemsData);

    // Insert photos if any
    if (photos && photos.length > 0) {
      const photoRecords = photos.map((path) => ({
        pickup_id: pickupRow.id,
        storage_path: path,
      }));
      await supabase.from("pickup_photos").insert(photoRecords);
    }

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/pickups");

    return {
      success: true,
      bookingCode,
      message: "Booking confirmed successfully!",
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Booking submission error";
    return {
      success: false,
      error: message,
    };
  }
}

export async function cancelPickup(pickupId: string) {
  try {
    const supabase = await createClient();
    if (!supabase) {
      return { success: false, error: "Database not connected" };
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "Unauthorized" };
    }

    // Customer can only cancel if pending or confirmed
    const { data: pickup } = await supabase
      .from("pickups")
      .select("status, user_id")
      .eq("id", pickupId)
      .single();

    if (!pickup || pickup.user_id !== user.id) {
      return { success: false, error: "Pickup not found" };
    }

    if (!["pending", "confirmed"].includes(pickup.status)) {
      return {
        success: false,
        error: "This pickup cannot be cancelled as it is already scheduled or completed.",
      };
    }

    const { error: updateError } = await supabase
      .from("pickups")
      .update({ status: "cancelled" })
      .eq("id", pickupId);

    if (updateError) {
      return { success: false, error: updateError.message };
    }

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/pickups");

    return { success: true, message: "Pickup cancelled successfully." };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error cancelling pickup";
    return { success: false, error: message };
  }
}
