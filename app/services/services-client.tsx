"use client";

import * as React from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Newspaper,
  BookOpen,
  Recycle,
  Anvil,
  Cable,
  Coins,
  Waves,
  Snowflake,
  Tv,
  Shield,
  Layers,
  Bike,
  Bed,
  Armchair,
  Cpu,
  FileCheck2,
  CircuitBoard,
  Building2,
  Factory,
  HardHat,
  Truck,
  ArrowRight,
  CalendarCheck,
  Phone,
  MessageCircle,
  Scale,
  Zap,
  CheckCircle2,
  ShieldCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { SITE_CONFIG } from "@/lib/site-config";

interface ServiceCardItem {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  bgColor: string;
  href: string;
  actionLabel?: string;
}

const RESIDENTIAL_SERVICES: ServiceCardItem[] = [
  {
    id: "old-newspaper",
    title: "Old Newspaper",
    description: "Collect old newspapers for recycling.",
    icon: Newspaper,
    bgColor: "bg-[#F59E0B]", // Amber
    href: "/rates?category=paper-cardboard",
    actionLabel: "View Rate & Book",
  },
  {
    id: "old-books",
    title: "Old Books",
    description: "Recycle used books for reprocessing.",
    icon: BookOpen,
    bgColor: "bg-[#10B981]", // Emerald
    href: "/rates?category=paper-cardboard",
    actionLabel: "View Rate & Book",
  },
  {
    id: "plastic-scrap",
    title: "Plastic Scrap",
    description: "Eco-friendly recycling of plastic waste.",
    icon: Recycle,
    bgColor: "bg-[#84CC16]", // Lime
    href: "/rates?category=plastic",
    actionLabel: "View Rate & Book",
  },
  {
    id: "iron-scrap",
    title: "Iron Scrap",
    description: "Sustainable recycling of iron materials.",
    icon: Anvil,
    bgColor: "bg-[#0284C7]", // Bright Blue
    href: "/rates?category=iron-steel",
    actionLabel: "View Rate & Book",
  },
  {
    id: "copper-scrap",
    title: "Copper Scrap",
    description: "Recover and recycle copper responsibly.",
    icon: Cable,
    bgColor: "bg-[#8B5CF6]", // Purple/Violet
    href: "/rates?category=copper",
    actionLabel: "View Rate & Book",
  },
  {
    id: "brass-scrap",
    title: "Brass Scrap",
    description: "Recycle brass parts to reduce waste.",
    icon: Coins,
    bgColor: "bg-[#16A34A]", // Green
    href: "/rates?category=brass",
    actionLabel: "View Rate & Book",
  },
  {
    id: "old-washing-machine",
    title: "Old Washing Machine",
    description: "Proper disposal of outdated appliances.",
    icon: Waves,
    bgColor: "bg-[#2563EB]", // Royal Blue
    href: "/rates?category=appliances",
    actionLabel: "View Rate & Book",
  },
  {
    id: "old-fridge",
    title: "Old Fridge",
    description: "Eco-friendly fridge recycling methods.",
    icon: Snowflake,
    bgColor: "bg-[#EF4444]", // Coral Red
    href: "/rates?category=appliances",
    actionLabel: "View Rate & Book",
  },
  {
    id: "old-tv",
    title: "Old TV",
    description: "Responsible disposal of CRT and LED televisions.",
    icon: Tv,
    bgColor: "bg-[#F43F5E]", // Rose Red
    href: "/rates?category=appliances",
    actionLabel: "View Rate & Book",
  },
  {
    id: "steel-scrap",
    title: "Steel Scrap",
    description: "Clean recycling of stainless and mild steel scrap.",
    icon: Shield,
    bgColor: "bg-[#475569]", // Slate
    href: "/rates?category=iron-steel",
    actionLabel: "View Rate & Book",
  },
  {
    id: "aluminium-scrap",
    title: "Aluminium Scrap",
    description: "Recycling aluminium cans, frames, and utensils.",
    icon: Layers,
    bgColor: "bg-[#14B8A6]", // Teal
    href: "/rates?category=aluminium",
    actionLabel: "View Rate & Book",
  },
  {
    id: "two-wheeler",
    title: "Two Wheeler",
    description: "Authorized vehicle scrapping and de-registration support.",
    icon: Bike,
    bgColor: "bg-[#9333EA]", // Purple
    href: "/rates?category=iron-steel",
    actionLabel: "Book Scrapping",
  },
  {
    id: "old-mattress",
    title: "Old Mattress",
    description: "Safe disposal and cotton/spring material recovery.",
    icon: Bed,
    bgColor: "bg-[#D97706]", // Warm Amber
    href: "/what-we-accept",
    actionLabel: "Pickup Guidelines",
  },
  {
    id: "old-furniture",
    title: "Old Furniture",
    description: "Office and residential wooden/metal furniture clearance.",
    icon: Armchair,
    bgColor: "bg-[#0891B2]", // Cyan
    href: "/book",
    actionLabel: "Book Clearance",
  },
];

const CORPORATE_SERVICES: ServiceCardItem[] = [
  {
    id: "ewaste-and-electronics",
    title: "IT And Electronics Asset Disposition",
    description:
      "Secure, responsible management and disposal of obsolete corporate IT assets like servers, routers, and commercial electronics.",
    icon: Cpu,
    bgColor: "bg-[#2563EB]", // Royal Blue
    href: "/book?type=corporate",
    actionLabel: "Request ITAD Audit",
  },
  {
    id: "recycling",
    title: "EPR Services",
    description:
      "Extended Producer Responsibility compliance, full documentation audit trail, and authorized recycling certificates.",
    icon: FileCheck2,
    bgColor: "bg-[#16A34A]", // Green
    href: "/contact",
    actionLabel: "EPR Consultation",
  },
  {
    id: "data-destruction",
    title: "Data Destruction",
    description:
      "Confidential data destruction, degaussing, and on-site hard drive shredding with verified certificate of destruction.",
    icon: ShieldCheck,
    bgColor: "bg-[#DC2626]", // Crimson Red
    href: "/book?type=corporate",
    actionLabel: "Book Data Shredding",
  },
  {
    id: "eee-recycling",
    title: "Electrical And Electronic Recycling (EEE)",
    description:
      "Certified eco-friendly recycling of corporate electronic waste, office gadgets, and telecom battery banks.",
    icon: CircuitBoard,
    bgColor: "bg-[#0891B2]", // Cyan
    href: "/rates?category=ewaste",
    actionLabel: "Check E-Waste Rates",
  },
  {
    id: "demolition-dismantling",
    title: "Office Furniture & Dismantling",
    description:
      "Corporate office soft strip, workstation dismantling, partition removal, and maximum salvage value recovery.",
    icon: Building2,
    bgColor: "bg-[#D97706]", // Warm Amber
    href: "/book?type=corporate",
    actionLabel: "Schedule Inspection",
  },
  {
    id: "industrial-clearance",
    title: "Factory & Industrial Scrap Clearance",
    description:
      "High-volume industrial scrap lifting, machinery decommissioning, fabrication offcuts, and certified weighbridge payouts.",
    icon: Factory,
    bgColor: "bg-[#475569]", // Slate Charcoal
    href: "/book?type=corporate",
    actionLabel: "Industrial Contract",
  },
  {
    id: "plant-demolition",
    title: "Structural Demolition & Stripping",
    description:
      "Safe, regulated demolition of commercial structures, HVAC/MEP plant dismantling, and heavy structural steel recovery.",
    icon: HardHat,
    bgColor: "bg-[#EA580C]", // Orange
    href: "/contact",
    actionLabel: "Site Survey",
  },
  {
    id: "bulk-waste",
    title: "Bulk Waste Management",
    description:
      "Regular scheduled scrap container placement and zero-landfill segregated collection for corporate campuses.",
    icon: Truck,
    bgColor: "bg-[#0D9488]", // Teal
    href: "/book?type=corporate",
    actionLabel: "Set Up Schedule",
  },
];

export function ServicesClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [activeTab, setActiveTab] = React.useState<"residential" | "corporate">("residential");

  // React to tab query parameter or hash
  React.useEffect(() => {
    const tabParam = searchParams.get("tab");
    if (tabParam === "corporate") {
      setActiveTab("corporate");
    } else if (tabParam === "residential") {
      setActiveTab("residential");
    } else if (typeof window !== "undefined" && window.location.hash) {
      const hash = window.location.hash.toLowerCase();
      if (
        hash.includes("ewaste") ||
        hash.includes("dismantling") ||
        hash.includes("corporate") ||
        hash.includes("bulk")
      ) {
        setActiveTab("corporate");
      }
    }
  }, [searchParams]);

  const handleTabChange = (tab: "residential" | "corporate") => {
    setActiveTab(tab);
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", tab);
    router.replace(`/services?${params.toString()}`, { scroll: false });
  };

  const currentServices = activeTab === "residential" ? RESIDENTIAL_SERVICES : CORPORATE_SERVICES;

  return (
    <div className="py-10 sm:py-16 md:py-20 bg-brand-bg">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 space-y-10 sm:space-y-14">
        {/* 1. Header (Centered like crapbin.com reference) */}
        <div className="text-center max-w-3xl mx-auto space-y-2 sm:space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-green-light/70 text-brand-green text-[11px] sm:text-xs font-bold uppercase tracking-wider">
            <span>MIDC Andheri East, Mumbai • Reflection Scrap Solutions LLP</span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-brand-green tracking-tight">
            Our Recycling Services
          </h1>

          <p className="text-sm sm:text-base md:text-lg text-brand-muted max-w-2xl mx-auto leading-relaxed">
            Comprehensive waste management solutions for all needs
          </p>
        </div>

        {/* 2. Interactive Navigation Tabs (Residential | Corporate) */}
        <div className="flex items-center justify-center gap-8 sm:gap-14 border-b border-brand-border/70 pb-0.5 max-w-md mx-auto">
          <button
            type="button"
            onClick={() => handleTabChange("residential")}
            className={cn(
              "pb-3 text-base sm:text-lg font-bold transition-all relative cursor-pointer outline-none",
              activeTab === "residential"
                ? "text-brand-green font-extrabold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-brand-green"
                : "text-brand-muted hover:text-brand-dark"
            )}
          >
            <span>Residential</span>
            <span className="ml-2 text-xs font-normal text-brand-muted/70">
              ({RESIDENTIAL_SERVICES.length})
            </span>
          </button>

          <button
            type="button"
            onClick={() => handleTabChange("corporate")}
            className={cn(
              "pb-3 text-base sm:text-lg font-bold transition-all relative cursor-pointer outline-none",
              activeTab === "corporate"
                ? "text-brand-green font-extrabold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-brand-green"
                : "text-brand-muted hover:text-brand-dark"
            )}
          >
            <span>Corporate</span>
            <span className="ml-2 text-xs font-normal text-brand-muted/70">
              ({CORPORATE_SERVICES.length})
            </span>
          </button>
        </div>

        {/* 3. Four-Column Card Grid (Matching Crapbin Reference Layout) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 animate-in fade-in-50 duration-200">
          {currentServices.map((item) => {
            const IconComponent = item.icon;
            return (
              <Link
                key={item.id}
                id={item.id}
                href={item.href}
                className="group rounded-2xl border border-brand-border/80 bg-white dark:bg-card p-5 sm:p-6 shadow-sm hover:shadow-card hover:border-brand-green/60 transition-all duration-200 flex flex-col justify-between scroll-mt-28"
              >
                <div>
                  {/* Colored circular icon container */}
                  <div
                    className={cn(
                      "h-13 w-13 sm:h-14 sm:w-14 rounded-full flex items-center justify-center text-white mb-4 shadow-sm transition-transform duration-200 group-hover:scale-105",
                      item.bgColor
                    )}
                  >
                    <IconComponent className="h-6 w-6 sm:h-7 sm:w-7" />
                  </div>

                  {/* Title */}
                  <h3 className="text-base sm:text-lg font-bold text-brand-dark group-hover:text-brand-green transition-colors leading-snug">
                    {item.title}
                  </h3>

                  {/* Caption / Description */}
                  <p className="text-xs sm:text-sm text-brand-muted mt-1.5 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                {/* Card Action Link */}
                <div className="pt-4 mt-4 border-t border-brand-border/50 flex items-center justify-between text-xs font-bold text-brand-blue group-hover:text-brand-green transition-colors">
                  <span>{item.actionLabel || "Book Service"}</span>
                  <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>

        {/* 4. Trust Pillars Strip */}
        <div className="rounded-2xl sm:rounded-3xl border border-brand-border bg-brand-surface p-6 sm:p-8 shadow-subtle">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <div className="flex items-start gap-3">
              <div className="h-9 w-9 rounded-xl bg-brand-green-light text-brand-green flex items-center justify-center shrink-0">
                <Scale className="h-4 w-4" />
              </div>
              <div>
                <h4 className="font-bold text-xs sm:text-sm text-brand-dark">Digital Scale Accuracy</h4>
                <p className="text-[11px] sm:text-xs text-brand-muted mt-0.5">
                  Calibrated weighing right at your premises.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="h-9 w-9 rounded-xl bg-brand-blue-light text-brand-blue flex items-center justify-center shrink-0">
                <Zap className="h-4 w-4" />
              </div>
              <div>
                <h4 className="font-bold text-xs sm:text-sm text-brand-dark">Instant Settlement</h4>
                <p className="text-[11px] sm:text-xs text-brand-muted mt-0.5">
                  Immediate UPI transfer or cash upon weighing.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="h-9 w-9 rounded-xl bg-brand-green-light text-brand-green flex items-center justify-center shrink-0">
                <CheckCircle2 className="h-4 w-4" />
              </div>
              <div>
                <h4 className="font-bold text-xs sm:text-sm text-brand-dark">EPR Compliance</h4>
                <p className="text-[11px] sm:text-xs text-brand-muted mt-0.5">
                  Authorized recycling certificates for corporates.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="h-9 w-9 rounded-xl bg-brand-blue-light text-brand-blue flex items-center justify-center shrink-0">
                <Truck className="h-4 w-4" />
              </div>
              <div>
                <h4 className="font-bold text-xs sm:text-sm text-brand-dark">Mumbai-Wide Coverage</h4>
                <p className="text-[11px] sm:text-xs text-brand-muted mt-0.5">
                  Same-day or scheduled doorstep pickups 7 days a week.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 5. Bottom Call-To-Action Banner */}
        <div className="rounded-2xl sm:rounded-3xl bg-brand-surface border border-brand-border p-6 sm:p-10 md:p-12 shadow-card text-center max-w-4xl mx-auto space-y-4 sm:space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-green-light text-brand-green text-xs font-bold">
            <ShieldCheck className="h-4 w-4" />
            <span>Trusted Scrap Trading & Demolition Partner in Mumbai</span>
          </div>

          <h2 className="text-xl sm:text-3xl font-extrabold text-brand-dark leading-tight">
            Ready to Clear Your Scrap or Schedule an Office Audit?
          </h2>

          <p className="text-xs sm:text-sm md:text-base text-brand-muted max-w-2xl mx-auto leading-relaxed">
            Whether you have household scrap or corporate IT equipment, our verified pickup team
            arrives with certified digital scales and prompt payouts.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 pt-2">
            <Button asChild size="default" variant="default" className="w-full sm:w-auto h-11 sm:h-12 px-6 font-bold text-xs sm:text-sm shadow-sm gap-2">
              <Link href="/book">
                <CalendarCheck className="h-4 w-4" />
                <span>Book a Doorstep Pickup</span>
              </Link>
            </Button>

            <Button
              asChild
              size="default"
              variant="outlineGreen"
              className="w-full sm:w-auto h-11 sm:h-12 px-6 font-bold text-xs sm:text-sm gap-2"
            >
              <a
                href={`https://wa.me/${SITE_CONFIG.contact.whatsappRaw}?text=${encodeURIComponent(
                  SITE_CONFIG.contact.whatsappMessage
                )}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle className="h-4 w-4 text-brand-green" />
                <span>WhatsApp Us</span>
              </a>
            </Button>

            <Button asChild size="default" variant="outline" className="w-full sm:w-auto h-11 sm:h-12 px-6 font-bold text-xs sm:text-sm gap-2">
              <a href={`tel:${SITE_CONFIG.contact.phoneRaw}`}>
                <Phone className="h-4 w-4 text-brand-blue" />
                <span>{SITE_CONFIG.contact.phone}</span>
              </a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
