import type { Metadata } from "next";
import Link from "next/link";
import { TrendingUp, CalendarCheck, ShieldCheck } from "lucide-react";
import { getScrapCategories, getScrapItems } from "@/lib/services/rates";
import { RatesClient } from "./rates-client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Today's Scrap Rates in Mumbai & Price Calculator",
  description:
    "Check live and indicative scrap rates in Mumbai for copper, brass, iron, aluminium, paper, cardboard, plastics, and e-waste. Use our instant value calculator.",
};

export const revalidate = 60; // Revalidate every 60 seconds

export default async function ScrapRatesPage() {
  const [categories, items] = await Promise.all([
    getScrapCategories(),
    getScrapItems(),
  ]);

  return (
    <div className="py-6 sm:py-12 md:py-20 bg-brand-bg min-h-screen">
      <div className="container px-4 sm:px-6 space-y-6 sm:space-y-12">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-2 sm:space-y-4">
          <Badge variant="blue" className="px-3 py-0.5 text-[11px] sm:text-xs font-bold uppercase tracking-wider">
            Daily Market Rates & Calculator
          </Badge>
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-brand-dark tracking-tight">
            Mumbai Scrap Rates & Payout Calculator
          </h1>
          <p className="text-xs sm:text-base md:text-lg text-brand-muted leading-relaxed">
            Transparent pricing based on verified digital scale measurements.
            Check item rates below or use our interactive calculator to estimate
            your total payout.
          </p>
        </div>

        {/* Client Component with Calculator, Search, Filter, and Table */}
        <RatesClient categories={categories} items={items} />

        {/* Bottom CTA Card */}
        <div className="rounded-2xl sm:rounded-3xl bg-brand-surface border border-brand-border p-5 sm:p-8 md:p-12 shadow-subtle flex flex-col md:flex-row items-center justify-between gap-5 sm:gap-6">
          <div className="space-y-1.5 sm:space-y-2 text-center md:text-left">
            <h3 className="text-lg sm:text-2xl font-bold text-brand-dark leading-tight">
              Have bulk metal, factory offcuts, or corporate e-waste?
            </h3>
            <p className="text-xs sm:text-sm text-brand-muted max-w-xl leading-relaxed">
              We provide commercial contracts with customized weighbridge slips
              and direct high-volume industrial payouts across Mumbai.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3 w-full sm:w-auto shrink-0">
            <Button asChild size="default" variant="default" className="w-full sm:w-auto h-11 sm:h-12 font-bold text-xs sm:text-sm shadow-sm">
              <Link href="/book">
                <CalendarCheck className="h-4 w-4 mr-2" />
                <span>Book a Pickup</span>
              </Link>
            </Button>
            <Button asChild size="default" variant="outline" className="w-full sm:w-auto h-11 sm:h-12 font-bold text-xs sm:text-sm">
              <Link href="/contact">Contact Our Office</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
