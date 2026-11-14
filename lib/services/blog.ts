import { createClient } from "@/lib/supabase/server";
import type { BlogPost } from "@/lib/types/database";
export { BLOG_CATEGORIES } from "@/lib/content-constants";

export const FALLBACK_BLOG_POSTS: BlogPost[] = [
  {
    id: "blog-1",
    slug: "mumbai-non-ferrous-metal-market-trends-2026",
    title: "Mumbai Non-Ferrous Scrap Market Outlook: What Drives Copper & Brass Rates",
    category: "Metal Markets",
    excerpt:
      "How global LME copper movements, domestic electrical manufacturing demand, and proper wire stripping impact scrap payouts across MIDC and Mumbai.",
    content: `Non-ferrous metals—especially copper, brass, and aluminium—continue to deliver the highest per-kilogram returns for workshops, electrical contractors, and households in Mumbai.\n\n### 1. Why Grade Segregation Matters Most\nWhen copper wiring is separated cleanly from heavy PVC insulation (such as armature copper vs. mixed insulated wire), payouts can more than double. Our digital sorting standards at MIDC Andheri East ensure customers receive exact grade-level rates rather than flat blended pricing.\n\n### 2. Global Benchmark Links\nDomestic Mumbai scrap rates closely track London Metal Exchange (LME) copper and aluminium futures, adjusted for local smelter demand in Maharashtra and Gujarat. Industrial fabrication offcuts and clean plumbing brass fittings remain in high demand year-round.\n\n### 3. Maximizing Your Payout\nBefore scheduling a bulk pickup, separate iron/steel fasteners from brass valves or aluminium extrusions. Even 15 minutes of basic sorting can lift your final weighbridge settlement significantly.`,
    cover_image_url: "/gallery/copper-brass-sorting.svg",
    author_name: "Reflection Scrap Market Desk",
    read_time_minutes: 4,
    tags: ["Copper Rates", "Brass", "Mumbai Market", "Non-Ferrous"],
    likes_count: 28,
    rating_sum: 71,
    rating_count: 15,
    is_published: true,
    published_at: "2026-11-05T10:00:00.000Z",
    created_at: "2026-11-05T10:00:00.000Z",
    updated_at: "2026-11-05T10:00:00.000Z",
  },
  {
    id: "blog-2",
    slug: "corporate-office-demolition-scrap-recovery-guide",
    title: "Corporate Office Demolition & Soft-Strip: Turning Fit-Out Clearances Into Capital",
    category: "Industrial & Demolition",
    excerpt:
      "IT parks and corporate offices in BKC, Andheri, and Powai are shifting to zero-landfill soft-strip demolition to offset renovation costs through scrap recovery.",
    content: `When corporate offices relocate or renovate in Mumbai business hubs like Andheri East, BKC, Lower Parel, or Powai, dismantling old interiors often feels like a pure expense. In reality, a structured demolition and scrap recovery plan turns hidden assets into immediate capital.\n\n### What Holds Value During Office Dismantling?\n- **MEP & HVAC Copper:** Chiller piping, VRV/split AC units, and concealed copper cabling.\n- **Aluminium & Glass Partitions:** Extruded aluminium frames and modular workstation channels.\n- **False Ceiling & Structural Steel:** GI channels, cable trays, server racks, and UPS battery banks.\n\n### Safety & Compliance First\nOur demolition crew handles site isolation, dust-controlled dismantling, lift/loading bay coordination, and calibrated weighbridge documentation so facility managers get a clean handover and instant settlement.`,
    cover_image_url: "/gallery/corporate-demolition.svg",
    author_name: "Operations & Demolition Team",
    read_time_minutes: 5,
    tags: ["Demolition", "Corporate Office", "BKC", "Industrial"],
    likes_count: 34,
    rating_sum: 93,
    rating_count: 19,
    is_published: true,
    published_at: "2026-10-28T09:30:00.000Z",
    created_at: "2026-10-28T09:30:00.000Z",
    updated_at: "2026-10-28T09:30:00.000Z",
  },
  {
    id: "blog-3",
    slug: "ewaste-recycling-trends-corporate-it-assets-india",
    title: "E-Waste & IT Asset Liquidation Trends: Compliance Meets Circular Value",
    category: "E-Waste & Tech",
    excerpt:
      "With stricter EPR rules and faster hardware refresh cycles, Mumbai companies are prioritizing responsible e-waste dismantling and battery recovery.",
    content: `India's Extended Producer Responsibility (EPR) framework has transformed how enterprises retire obsolete laptops, servers, networking gear, and UPS batteries.\n\n### Recovering Value Responsibly\nModern server racks, motherboards, and telecom equipment contain recoverable copper, aluminium heatsinks, and precious-metal traces. At the same time, lead-acid and lithium backup batteries require careful handling to prevent environmental hazards.\n\n### Streamlined Bulk Clearances\nReflection Scrap Solutions LLP provides scheduled commercial e-waste pickups across Mumbai with transparent per-piece and per-kg valuation and instant UPI or bank payout.`,
    cover_image_url: "/gallery/ewaste-recovery.svg",
    author_name: "Reflection Scrap Market Desk",
    read_time_minutes: 4,
    tags: ["E-Waste", "IT Assets", "Batteries", "Sustainability"],
    likes_count: 21,
    rating_sum: 46,
    rating_count: 10,
    is_published: true,
    published_at: "2026-10-18T11:15:00.000Z",
    created_at: "2026-10-18T11:15:00.000Z",
    updated_at: "2026-10-18T11:15:00.000Z",
  },
  {
    id: "blog-4",
    slug: "protecting-steel-and-paper-scrap-value-mumbai-seasons",
    title: "Industrial Scrap Grading: Protecting Steel & Cardboard Value Year-Round",
    category: "Recycling Operations",
    excerpt:
      "Practical tips for factories, warehouses, and housing societies to keep HMS steel, SS 304, and corrugated cartons dry and contamination-free.",
    content: `Moisture, oil contamination, and mixed plastics are the biggest silent deductions in bulk scrap trading.\n\n### Smart Yard & Warehouse Storage\n1. **Keep Paper & Corrugated Cartons Dry:** Wet cardboard loses structural fiber quality and requires weight deductions.\n2. **Separate Stainless Grades (SS 304 vs SS 316):** Keeping marine/pharma-grade SS 316 separate from standard SS 304 prevents downgrading your entire lot.\n3. **Schedule Frequent Pickups:** Regular weekly or bi-weekly doorstep clearances keep shop floors clutter-free and lock in current market pricing.`,
    cover_image_url: "/gallery/digital-weighing.svg",
    author_name: "MIDC Yard Supervisors",
    read_time_minutes: 3,
    tags: ["HMS Steel", "SS 304", "Cardboard", "Factory Tips"],
    likes_count: 19,
    rating_sum: 42,
    rating_count: 9,
    is_published: true,
    published_at: "2026-10-06T08:45:00.000Z",
    created_at: "2026-10-06T08:45:00.000Z",
    updated_at: "2026-10-06T08:45:00.000Z",
  },
];

// Persistent local cache for newly authored / edited posts across dev turns
const customPostsStore = new Map<string, BlogPost>();
const deletedPostIds = new Set<string>();

export function saveLocalPost(post: BlogPost) {
  customPostsStore.set(post.id, post);
  if (post.slug) {
    customPostsStore.set(post.slug, post);
  }
}

export function deleteLocalPost(idOrSlug: string) {
  deletedPostIds.add(idOrSlug);
  customPostsStore.delete(idOrSlug);
}

export async function getPublishedBlogPosts(): Promise<BlogPost[]> {
  const localList = Array.from(new Set(Array.from(customPostsStore.values()))).filter(
    (p) => p.is_published && !deletedPostIds.has(p.id) && !deletedPostIds.has(p.slug)
  );

  try {
    const supabase = await createClient();
    if (!supabase) {
      const activeFallback = FALLBACK_BLOG_POSTS.filter(
        (p) => !deletedPostIds.has(p.id) && !deletedPostIds.has(p.slug)
      );
      return [...localList, ...activeFallback];
    }

    const { data, error } = await supabase
      .from("blog_posts")
      .select("*")
      .eq("is_published", true)
      .order("published_at", { ascending: false });

    if (error || !data || data.length === 0) {
      const activeFallback = FALLBACK_BLOG_POSTS.filter(
        (p) => !deletedPostIds.has(p.id) && !deletedPostIds.has(p.slug)
      );
      return [...localList, ...activeFallback];
    }

    const dbPosts = data as BlogPost[];
    const dbSlugs = new Set(dbPosts.map((p) => p.slug));
    const uniqueLocal = localList.filter((p) => !dbSlugs.has(p.slug));

    return [...uniqueLocal, ...dbPosts];
  } catch {
    const activeFallback = FALLBACK_BLOG_POSTS.filter(
      (p) => !deletedPostIds.has(p.id) && !deletedPostIds.has(p.slug)
    );
    return [...localList, ...activeFallback];
  }
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  if (deletedPostIds.has(slug)) return null;

  // Check local store first
  if (customPostsStore.has(slug)) {
    const post = customPostsStore.get(slug);
    if (post && post.is_published) return post;
  }

  try {
    const supabase = await createClient();
    if (supabase) {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("slug", slug)
        .eq("is_published", true)
        .maybeSingle();

      if (!error && data) {
        return data as BlogPost;
      }
    }
  } catch {
    // Fall back to seed data
  }

  const fallback = FALLBACK_BLOG_POSTS.find((post) => post.slug === slug);
  if (fallback && !deletedPostIds.has(fallback.id)) {
    return fallback;
  }
  return null;
}

export async function getAllBlogPostsAdmin(): Promise<BlogPost[]> {
  const localList = Array.from(new Set(Array.from(customPostsStore.values()))).filter(
    (p) => !deletedPostIds.has(p.id) && !deletedPostIds.has(p.slug)
  );

  try {
    const supabase = await createClient();
    if (!supabase) {
      const activeFallback = FALLBACK_BLOG_POSTS.filter(
        (p) => !deletedPostIds.has(p.id) && !deletedPostIds.has(p.slug)
      );
      return [...localList, ...activeFallback];
    }

    const { data, error } = await supabase
      .from("blog_posts")
      .select("*")
      .order("created_at", { ascending: false });

    if (error || !data || data.length === 0) {
      const activeFallback = FALLBACK_BLOG_POSTS.filter(
        (p) => !deletedPostIds.has(p.id) && !deletedPostIds.has(p.slug)
      );
      return [...localList, ...activeFallback];
    }

    const dbPosts = data as BlogPost[];
    const dbSlugs = new Set(dbPosts.map((p) => p.slug));
    const uniqueLocal = localList.filter((p) => !dbSlugs.has(p.slug));

    return [...uniqueLocal, ...dbPosts];
  } catch {
    const activeFallback = FALLBACK_BLOG_POSTS.filter(
      (p) => !deletedPostIds.has(p.id) && !deletedPostIds.has(p.slug)
    );
    return [...localList, ...activeFallback];
  }
}
