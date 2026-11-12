import { createClient } from "@/lib/supabase/server";
import type { GalleryItem } from "@/lib/types/database";
export { GALLERY_CATEGORIES } from "@/lib/content-constants";

export const FALLBACK_GALLERY_ITEMS: GalleryItem[] = [
  {
    id: "gal-1",
    title: "Corporate Office Soft-Strip & Demolition",
    category: "Demolition & Dismantling",
    description:
      "Full interior dismantling of a 14,000 sq. ft. corporate office floor including aluminium partitions, HVAC copper lines, GI ceiling channels, and server racks with zero-hassle clearance.",
    location: "Andheri East, Mumbai",
    activity_date: "2026-11-02",
    image_url: "/gallery/corporate-demolition.svg",
    highlight_stat: "3.8 Tons Metal & MEP Recovered",
    is_published: true,
    sort_order: 1,
    created_at: "2026-11-02T10:00:00.000Z",
    updated_at: "2026-11-02T10:00:00.000Z",
  },
  {
    id: "gal-2",
    title: "MIDC Industrial Plant & Machinery Clearance",
    category: "Industrial Clearances",
    description:
      "Decommissioned workshop lathe frames, heavy melting steel beams, and fabrication offcuts loaded and weighed directly on certified digital scales.",
    location: "MIDC Marol, Mumbai",
    activity_date: "2026-10-25",
    image_url: "/gallery/industrial-clearance.svg",
    highlight_stat: "6.4 Tons HMS & Cast Iron",
    is_published: true,
    sort_order: 2,
    created_at: "2026-10-25T10:00:00.000Z",
    updated_at: "2026-10-25T10:00:00.000Z",
  },
  {
    id: "gal-3",
    title: "On-Spot Calibrated Digital Weighing",
    category: "Yard & Weighing",
    description:
      "Every pickup is weighed live in front of the client using calibrated electronic scales with instant UPI or cash payout right after inspection.",
    location: "Reflection Yard, MIDC",
    activity_date: "2026-10-19",
    image_url: "/gallery/digital-weighing.svg",
    highlight_stat: "100% Transparent Scale Verification",
    is_published: true,
    sort_order: 3,
    created_at: "2026-10-19T10:00:00.000Z",
    updated_at: "2026-10-19T10:00:00.000Z",
  },
  {
    id: "gal-4",
    title: "Copper, Brass & SS 304 Grade Segregation",
    category: "Yard & Weighing",
    description:
      "Sorting armature copper coils, honey brass plumbing valves, aluminium sections, and stainless steel grades for direct smelter dispatch.",
    location: "Andheri East Facility",
    activity_date: "2026-10-12",
    image_url: "/gallery/copper-brass-sorting.svg",
    highlight_stat: "Non-Ferrous Grade Optimization",
    is_published: true,
    sort_order: 4,
    created_at: "2026-10-12T10:00:00.000Z",
    updated_at: "2026-10-12T10:00:00.000Z",
  },
  {
    id: "gal-5",
    title: "IT Park E-Waste & UPS Battery Recovery",
    category: "E-Waste & Recycling",
    description:
      "Safe collection and recycling of obsolete office desktops, networking switches, circuit boards, and lead-acid inverter battery banks.",
    location: "Powai & Saki Naka, Mumbai",
    activity_date: "2026-10-04",
    image_url: "/gallery/ewaste-recovery.svg",
    highlight_stat: "180+ IT Units & Batteries Cleared",
    is_published: true,
    sort_order: 5,
    created_at: "2026-10-04T10:00:00.000Z",
    updated_at: "2026-10-04T10:00:00.000Z",
  },
  {
    id: "gal-6",
    title: "Housing Society & Residential Doorstep Pickup",
    category: "Doorstep Pickups",
    description:
      "Scheduled weekend clearance for housing societies—old split ACs, appliances, newspapers, plastic crates, and mixed household metal scrap.",
    location: "Andheri & Bandra, Mumbai",
    activity_date: "2026-09-28",
    image_url: "/gallery/doorstep-pickup.svg",
    highlight_stat: "Same-Day Doorstep Collection",
    is_published: true,
    sort_order: 6,
    created_at: "2026-09-28T10:00:00.000Z",
    updated_at: "2026-09-28T10:00:00.000Z",
  },
];

export async function getPublishedGalleryItems(): Promise<GalleryItem[]> {
  try {
    const supabase = await createClient();
    if (!supabase) return FALLBACK_GALLERY_ITEMS;

    const { data, error } = await supabase
      .from("gallery_items")
      .select("*")
      .eq("is_published", true)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false });

    if (error || !data || data.length === 0) {
      return FALLBACK_GALLERY_ITEMS;
    }

    return data as GalleryItem[];
  } catch {
    return FALLBACK_GALLERY_ITEMS;
  }
}

export async function getAllGalleryItemsAdmin(): Promise<GalleryItem[]> {
  try {
    const supabase = await createClient();
    if (!supabase) return FALLBACK_GALLERY_ITEMS;

    const { data, error } = await supabase
      .from("gallery_items")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false });

    if (error || !data) {
      return FALLBACK_GALLERY_ITEMS;
    }

    return data.length > 0 ? (data as GalleryItem[]) : FALLBACK_GALLERY_ITEMS;
  } catch {
    return FALLBACK_GALLERY_ITEMS;
  }
}
