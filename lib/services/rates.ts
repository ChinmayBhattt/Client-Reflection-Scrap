import { createClient } from "@/lib/supabase/server";
import { ScrapCategory, ScrapItem } from "@/lib/types/database";

// Fallback seed catalog for offline / local preview before Supabase keys are entered
const CAT_IRON: ScrapCategory = { id: "cat-1", name: "Iron & Steel", slug: "iron-steel", icon: "Anvil", sort_order: 1, is_active: true, created_at: "", updated_at: "" };
const CAT_COPPER: ScrapCategory = { id: "cat-2", name: "Copper", slug: "copper", icon: "Cable", sort_order: 2, is_active: true, created_at: "", updated_at: "" };
const CAT_EWASTE: ScrapCategory = { id: "cat-8", name: "E-Waste", slug: "ewaste", icon: "CircuitBoard", sort_order: 3, is_active: true, created_at: "", updated_at: "" };
const CAT_BRASS: ScrapCategory = { id: "cat-3", name: "Brass", slug: "brass", icon: "Coins", sort_order: 4, is_active: true, created_at: "", updated_at: "" };
const CAT_ALUMINIUM: ScrapCategory = { id: "cat-4", name: "Aluminium", slug: "aluminium", icon: "Layers", sort_order: 5, is_active: true, created_at: "", updated_at: "" };
const CAT_SS: ScrapCategory = { id: "cat-5", name: "Stainless Steel", slug: "stainless-steel", icon: "Shield", sort_order: 6, is_active: true, created_at: "", updated_at: "" };
const CAT_PLASTIC: ScrapCategory = { id: "cat-6", name: "Plastic", slug: "plastic", icon: "Recycle", sort_order: 7, is_active: true, created_at: "", updated_at: "" };
const CAT_PAPER: ScrapCategory = { id: "cat-7", name: "Paper & Cardboard", slug: "paper-cardboard", icon: "Newspaper", sort_order: 8, is_active: true, created_at: "", updated_at: "" };
const CAT_BATTERIES: ScrapCategory = { id: "cat-9", name: "Batteries", slug: "batteries", icon: "BatteryCharging", sort_order: 9, is_active: true, created_at: "", updated_at: "" };
const CAT_APPLIANCES: ScrapCategory = { id: "cat-10", name: "Appliances", slug: "appliances", icon: "Tv", sort_order: 10, is_active: true, created_at: "", updated_at: "" };

export const FALLBACK_CATEGORIES: ScrapCategory[] = [
  CAT_IRON,
  CAT_COPPER,
  CAT_EWASTE,
  CAT_BRASS,
  CAT_ALUMINIUM,
  CAT_SS,
  CAT_PLASTIC,
  CAT_PAPER,
  CAT_BATTERIES,
  CAT_APPLIANCES,
];

export const FALLBACK_ITEMS: (ScrapItem & { category: ScrapCategory })[] = [
  // Iron & Steel
  { id: "item-1", category_id: "cat-1", name: "Heavy Melting Steel (HMS)", unit: "kg", rate_per_unit: 36.00, is_active: true, created_at: "", updated_at: new Date().toISOString(), category: CAT_IRON },
  { id: "item-2", category_id: "cat-1", name: "Cast Iron Scrap", unit: "kg", rate_per_unit: 28.00, is_active: true, created_at: "", updated_at: new Date().toISOString(), category: CAT_IRON },
  { id: "item-3", category_id: "cat-1", name: "Tin Cans & Sheet Metal", unit: "kg", rate_per_unit: 22.00, is_active: true, created_at: "", updated_at: new Date().toISOString(), category: CAT_IRON },

  // Copper
  { id: "item-4", category_id: "cat-2", name: "Armature Copper Wire", unit: "kg", rate_per_unit: 680.00, is_active: true, created_at: "", updated_at: new Date().toISOString(), category: CAT_COPPER },
  { id: "item-5", category_id: "cat-2", name: "Heavy Copper Pipes & Rods", unit: "kg", rate_per_unit: 650.00, is_active: true, created_at: "", updated_at: new Date().toISOString(), category: CAT_COPPER },
  { id: "item-6", category_id: "cat-2", name: "Mixed Insulated Copper Wire", unit: "kg", rate_per_unit: 240.00, is_active: true, created_at: "", updated_at: new Date().toISOString(), category: CAT_COPPER },

  // Brass
  { id: "item-7", category_id: "cat-3", name: "Honey Brass / Utensils", unit: "kg", rate_per_unit: 460.00, is_active: true, created_at: "", updated_at: new Date().toISOString(), category: CAT_BRASS },
  { id: "item-8", category_id: "cat-3", name: "Brass Plumbing Fittings", unit: "kg", rate_per_unit: 420.00, is_active: true, created_at: "", updated_at: new Date().toISOString(), category: CAT_BRASS },

  // Aluminium
  { id: "item-9", category_id: "cat-4", name: "Aluminium Section / Window Extrusions", unit: "kg", rate_per_unit: 165.00, is_active: true, created_at: "", updated_at: new Date().toISOString(), category: CAT_ALUMINIUM },
  { id: "item-10", category_id: "cat-4", name: "Aluminium Beverage Cans", unit: "kg", rate_per_unit: 120.00, is_active: true, created_at: "", updated_at: new Date().toISOString(), category: CAT_ALUMINIUM },
  { id: "item-11", category_id: "cat-4", name: "Cast Aluminium / Engine Parts", unit: "kg", rate_per_unit: 140.00, is_active: true, created_at: "", updated_at: new Date().toISOString(), category: CAT_ALUMINIUM },

  // Stainless Steel
  { id: "item-12", category_id: "cat-5", name: "SS 304 Grade Scrap", unit: "kg", rate_per_unit: 110.00, is_active: true, created_at: "", updated_at: new Date().toISOString(), category: CAT_SS },
  { id: "item-13", category_id: "cat-5", name: "SS 316 Industrial Scrap", unit: "kg", rate_per_unit: 160.00, is_active: true, created_at: "", updated_at: new Date().toISOString(), category: CAT_SS },
  { id: "item-14", category_id: "cat-5", name: "Mixed Stainless Kitchenware", unit: "kg", rate_per_unit: 75.00, is_active: true, created_at: "", updated_at: new Date().toISOString(), category: CAT_SS },

  // Plastic
  { id: "item-15", category_id: "cat-6", name: "HDPE Crates & Drums", unit: "kg", rate_per_unit: 32.00, is_active: true, created_at: "", updated_at: new Date().toISOString(), category: CAT_PLASTIC },
  { id: "item-16", category_id: "cat-6", name: "Clear PET Plastic Bottles", unit: "kg", rate_per_unit: 18.00, is_active: true, created_at: "", updated_at: new Date().toISOString(), category: CAT_PLASTIC },
  { id: "item-17", category_id: "cat-6", name: "Rigid Hard Plastic / PVC", unit: "kg", rate_per_unit: 24.00, is_active: true, created_at: "", updated_at: new Date().toISOString(), category: CAT_PLASTIC },

  // Paper & Cardboard
  { id: "item-18", category_id: "cat-7", name: "Corrugated Cardboard (Cartons)", unit: "kg", rate_per_unit: 12.00, is_active: true, created_at: "", updated_at: new Date().toISOString(), category: CAT_PAPER },
  { id: "item-19", category_id: "cat-7", name: "Newspaper (Raddi)", unit: "kg", rate_per_unit: 15.00, is_active: true, created_at: "", updated_at: new Date().toISOString(), category: CAT_PAPER },
  { id: "item-20", category_id: "cat-7", name: "Old Books & Notebooks", unit: "kg", rate_per_unit: 14.00, is_active: true, created_at: "", updated_at: new Date().toISOString(), category: CAT_PAPER },
  { id: "item-20b", category_id: "cat-7", name: "Office White Records / Paper", unit: "kg", rate_per_unit: 16.00, is_active: true, created_at: "", updated_at: new Date().toISOString(), category: CAT_PAPER },

  // E-Waste
  { id: "item-21", category_id: "cat-8", name: "Desktop Computer CPU Tower", unit: "piece", rate_per_unit: 350.00, is_active: true, created_at: "", updated_at: new Date().toISOString(), category: CAT_EWASTE },
  { id: "item-22", category_id: "cat-8", name: "Laptop Computers (Dead/Obsolete)", unit: "piece", rate_per_unit: 450.00, is_active: true, created_at: "", updated_at: new Date().toISOString(), category: CAT_EWASTE },
  { id: "item-23", category_id: "cat-8", name: "Server Racks & Motherboards", unit: "kg", rate_per_unit: 180.00, is_active: true, created_at: "", updated_at: new Date().toISOString(), category: CAT_EWASTE },

  // Batteries
  { id: "item-24", category_id: "cat-9", name: "Lead-Acid Inverter Battery", unit: "kg", rate_per_unit: 85.00, is_active: true, created_at: "", updated_at: new Date().toISOString(), category: CAT_BATTERIES },
  { id: "item-25", category_id: "cat-9", name: "Automobile Car Battery", unit: "piece", rate_per_unit: 550.00, is_active: true, created_at: "", updated_at: new Date().toISOString(), category: CAT_BATTERIES },

  // Appliances
  { id: "item-26", category_id: "cat-10", name: "Split Air Conditioner (1.5 Ton)", unit: "piece", rate_per_unit: 2800.00, is_active: true, created_at: "", updated_at: new Date().toISOString(), category: CAT_APPLIANCES },
  { id: "item-27", category_id: "cat-10", name: "Refrigerator (Single/Double Door)", unit: "piece", rate_per_unit: 1200.00, is_active: true, created_at: "", updated_at: new Date().toISOString(), category: CAT_APPLIANCES },
  { id: "item-28", category_id: "cat-10", name: "Washing Machine", unit: "piece", rate_per_unit: 900.00, is_active: true, created_at: "", updated_at: new Date().toISOString(), category: CAT_APPLIANCES },
  { id: "item-29", category_id: "cat-10", name: "Old CRT / LED Television (TV)", unit: "piece", rate_per_unit: 350.00, is_active: true, created_at: "", updated_at: new Date().toISOString(), category: CAT_APPLIANCES },
  { id: "item-30", category_id: "cat-1", name: "Two Wheeler / Old Bike Scrap", unit: "piece", rate_per_unit: 3200.00, is_active: true, created_at: "", updated_at: new Date().toISOString(), category: CAT_IRON },
  { id: "item-31", category_id: "cat-10", name: "Old Mattress (Spring/Cotton)", unit: "piece", rate_per_unit: 200.00, is_active: true, created_at: "", updated_at: new Date().toISOString(), category: CAT_APPLIANCES },
  { id: "item-32", category_id: "cat-1", name: "Old Metal & Wood Furniture", unit: "piece", rate_per_unit: 400.00, is_active: true, created_at: "", updated_at: new Date().toISOString(), category: CAT_IRON },
];

export async function getScrapCategories(): Promise<ScrapCategory[]> {
  try {
    const supabase = await createClient();
    if (!supabase) return FALLBACK_CATEGORIES;

    const { data, error } = await supabase
      .from("scrap_categories")
      .select("*")
      .eq("is_active", true)
      .order("sort_order", { ascending: true });

    if (error || !data || data.length === 0) {
      return FALLBACK_CATEGORIES;
    }

    return data as ScrapCategory[];
  } catch {
    return FALLBACK_CATEGORIES;
  }
}

export async function getScrapItems(): Promise<(ScrapItem & { category?: ScrapCategory })[]> {
  try {
    const supabase = await createClient();
    if (!supabase) return FALLBACK_ITEMS;

    const { data, error } = await supabase
      .from("scrap_items")
      .select("*, category:scrap_categories(*)")
      .eq("is_active", true)
      .order("name", { ascending: true });

    if (error || !data || data.length === 0) {
      return FALLBACK_ITEMS;
    }

    return data as (ScrapItem & { category?: ScrapCategory })[];
  } catch {
    return FALLBACK_ITEMS;
  }
}
