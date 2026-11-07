import { createClient } from "@/lib/supabase/server";
import {
  Pickup,
  PickupItem,
  PickupPhoto,
  Address,
  ServiceArea,
  ScrapItem,
  ScrapCategory,
} from "@/lib/types/database";
import { FALLBACK_ITEMS } from "./rates";

// Serviceable Pincodes fallback (5 sample Mumbai pincodes starting with 4000xx)
export const DEFAULT_SERVICE_PINCODES: Record<string, string> = {
  "400093": "MIDC, Andheri East (Primary Yard Area)",
  "400059": "Marol, Andheri East",
  "400069": "Andheri East Station & Gundavali",
  "400072": "Saki Naka, Andheri East",
  "400076": "Powai & Hiranandani",
};

export async function checkPincodeServiceability(pincode: string): Promise<{
  isServiceable: boolean;
  areaName?: string;
}> {
  const cleanPin = pincode.trim();
  if (cleanPin.length !== 6) {
    return { isServiceable: false };
  }

  try {
    const supabase = await createClient();
    if (supabase) {
      const { data, error } = await supabase
        .from("service_areas")
        .select("area_name, is_active")
        .eq("pincode", cleanPin)
        .eq("is_active", true)
        .single();

      if (!error && data) {
        return { isServiceable: true, areaName: data.area_name };
      }
    }
  } catch {
    // fallback check
  }

  if (DEFAULT_SERVICE_PINCODES[cleanPin]) {
    return { isServiceable: true, areaName: DEFAULT_SERVICE_PINCODES[cleanPin] };
  }

  return { isServiceable: false };
}

// Generate unique booking code e.g. RSS-000123
export function generateBookingCode(): string {
  const randomNum = Math.floor(100000 + Math.random() * 900000);
  return `RSS-${randomNum}`;
}

export async function getUserAddresses(userId: string): Promise<Address[]> {
  try {
    const supabase = await createClient();
    if (!supabase) return [];

    const { data, error } = await supabase
      .from("addresses")
      .select("*")
      .eq("user_id", userId)
      .order("is_default", { ascending: false })
      .order("created_at", { ascending: false });

    if (error || !data) return [];
    return data as Address[];
  } catch {
    return [];
  }
}

export async function getUserPickups(userId: string): Promise<Pickup[]> {
  try {
    const supabase = await createClient();
    if (!supabase) return [];

    const { data, error } = await supabase
      .from("pickups")
      .select(`
        *,
        items:pickup_items(*, item:scrap_items(*)),
        photos:pickup_photos(*)
      `)
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error || !data) return [];
    return data as Pickup[];
  } catch {
    return [];
  }
}

export async function getPickupByCode(
  bookingCode: string,
  userId?: string
): Promise<Pickup | null> {
  try {
    const supabase = await createClient();
    if (!supabase) return null;

    let query = supabase
      .from("pickups")
      .select(`
        *,
        user:profiles(*),
        items:pickup_items(*, item:scrap_items(*)),
        photos:pickup_photos(*)
      `)
      .eq("booking_code", bookingCode);

    if (userId) {
      query = query.eq("user_id", userId);
    }

    const { data, error } = await query.single();
    if (error || !data) return null;
    return data as Pickup;
  } catch {
    return null;
  }
}
