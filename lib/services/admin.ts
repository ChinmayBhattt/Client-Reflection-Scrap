import { createClient } from "@/lib/supabase/server";
import {
  Pickup,
  PickupStatus,
  ScrapCategory,
  ScrapItem,
  RateHistory,
  ServiceArea,
  Enquiry,
  Profile,
} from "@/lib/types/database";
import { FALLBACK_CATEGORIES, FALLBACK_ITEMS } from "./rates";
import { DEFAULT_SERVICE_PINCODES } from "./pickups";

export interface AdminOverviewStats {
  pendingToday: number;
  scheduledActive: number;
  completedThisMonth: number;
  totalWeightMonthKg: number;
  totalPayoutMonthINR: number;
  recentPickups: Pickup[];
}

export async function getAdminOverviewStats(): Promise<AdminOverviewStats> {
  try {
    const supabase = await createClient();
    if (!supabase) {
      // Mock stats for offline / dev preview
      return {
        pendingToday: 2,
        scheduledActive: 5,
        completedThisMonth: 18,
        totalWeightMonthKg: 1420,
        totalPayoutMonthINR: 48500,
        recentPickups: [],
      };
    }

    const todayStr = new Date().toISOString().split("T")[0];
    const firstDayOfMonth = new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      1
    ).toISOString();

    // 1. Pending today
    const { count: pendingCount } = await supabase
      .from("pickups")
      .select("*", { count: "exact", head: true })
      .eq("status", "pending")
      .eq("slot_date", todayStr);

    // 2. Scheduled active (confirmed or scheduled)
    const { count: scheduledCount } = await supabase
      .from("pickups")
      .select("*", { count: "exact", head: true })
      .in("status", ["confirmed", "scheduled"]);

    // 3. Completed this month
    const { data: completedMonthData } = await supabase
      .from("pickups")
      .select("final_amount, items:pickup_items(actual_weight, approx_weight)")
      .eq("status", "completed")
      .gte("updated_at", firstDayOfMonth);

    let totalWeight = 0;
    let totalPayout = 0;

    if (completedMonthData) {
      completedMonthData.forEach((p) => {
        totalPayout += Number(p.final_amount) || 0;
        if (p.items && Array.isArray(p.items)) {
          p.items.forEach((it: any) => {
            totalWeight += Number(it.actual_weight || it.approx_weight) || 0;
          });
        }
      });
    }

    // 4. Recent pickups
    const { data: recent } = await supabase
      .from("pickups")
      .select(`
        *,
        user:profiles(full_name, phone),
        items:pickup_items(*, item:scrap_items(*))
      `)
      .order("created_at", { ascending: false })
      .limit(6);

    return {
      pendingToday: pendingCount || 0,
      scheduledActive: scheduledCount || 0,
      completedThisMonth: completedMonthData?.length || 0,
      totalWeightMonthKg: Math.round(totalWeight),
      totalPayoutMonthINR: Math.round(totalPayout),
      recentPickups: (recent as Pickup[]) || [],
    };
  } catch {
    return {
      pendingToday: 0,
      scheduledActive: 0,
      completedThisMonth: 0,
      totalWeightMonthKg: 0,
      totalPayoutMonthINR: 0,
      recentPickups: [],
    };
  }
}

export async function getAllPickupsAdmin(): Promise<Pickup[]> {
  try {
    const supabase = await createClient();
    if (!supabase) return [];

    const { data, error } = await supabase
      .from("pickups")
      .select(`
        *,
        user:profiles(*),
        items:pickup_items(*, item:scrap_items(*)),
        photos:pickup_photos(*)
      `)
      .order("created_at", { ascending: false });

    if (error || !data) return [];
    return data as Pickup[];
  } catch {
    return [];
  }
}

export async function getAllEnquiriesAdmin(): Promise<Enquiry[]> {
  try {
    const supabase = await createClient();
    if (!supabase) return [];

    const { data, error } = await supabase
      .from("enquiries")
      .select("*")
      .order("created_at", { ascending: false });

    if (error || !data) return [];
    return data as Enquiry[];
  } catch {
    return [];
  }
}

export async function getAllServiceAreasAdmin(): Promise<ServiceArea[]> {
  try {
    const supabase = await createClient();
    if (!supabase) {
      return Object.entries(DEFAULT_SERVICE_PINCODES).map(([pin, name], i) => ({
        id: `area-${i}`,
        pincode: pin,
        area_name: name,
        is_active: true,
        created_at: new Date().toISOString(),
      }));
    }

    const { data, error } = await supabase
      .from("service_areas")
      .select("*")
      .order("pincode", { ascending: true });

    if (error || !data) return [];
    return data as ServiceArea[];
  } catch {
    return [];
  }
}

export async function getCustomersAdmin(): Promise<(Profile & { pickups_count: number })[]> {
  try {
    const supabase = await createClient();
    if (!supabase) return [];

    const { data: profiles, error } = await supabase
      .from("profiles")
      .select("*, pickups(count)")
      .order("created_at", { ascending: false });

    if (error || !profiles) return [];

    return profiles.map((p: any) => ({
      id: p.id,
      full_name: p.full_name,
      phone: p.phone,
      role: p.role,
      created_at: p.created_at,
      updated_at: p.updated_at,
      pickups_count: p.pickups ? p.pickups[0]?.count || 0 : 0,
    }));
  } catch {
    return [];
  }
}

