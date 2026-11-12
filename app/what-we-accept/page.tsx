import type { Metadata } from "next";
import Link from "next/link";
import {
  Hammer,
  Zap,
  Coins,
  Layers,
  Shield,
  Package,
  FileText,
  Cpu,
  BatteryCharging,
  Tv,
  AlertTriangle,
  ArrowRight,
  CalendarCheck,
  TrendingUp,
} from "lucide-react";
import { SITE_CONFIG } from "@/lib/site-config";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "What We Accept - Recyclable Scrap Materials Guide",
  description:
    "Explore the scrap items and materials Reflection Scrap Solutions LLP accepts in Mumbai: iron, steel, copper, brass, aluminium, e-waste, plastics, cardboard, and appliances.",
};

export default function WhatWeAcceptPage() {
  const categoryIcons: Record<string, React.ReactNode> = {
    "iron-steel": <Hammer className="h-5 w-5 text-brand-blue" />,
    copper: <Zap className="h-5 w-5 text-amber-500" />,
    brass: <Coins className="h-5 w-5 text-yellow-600" />,
    aluminium: <Layers className="h-5 w-5 text-slate-500 dark:text-slate-300" />,
    "stainless-steel": <Shield className="h-5 w-5 text-sky-600 dark:text-sky-400" />,
    plastic: <Package className="h-5 w-5 text-indigo-500 dark:text-indigo-400" />,
    "paper-cardboard": <FileText className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />,
    ewaste: <Cpu className="h-5 w-5 text-cyan-600 dark:text-cyan-400" />,
    batteries: <BatteryCharging className="h-5 w-5 text-rose-500" />,
    appliances: <Tv className="h-5 w-5 text-violet-600 dark:text-violet-400" />,
  };

  const nonAccepted = [
    "Bio-medical waste, medical syringes, or contaminated hospital refuse",
    "Hazardous chemicals, explosive canisters, or pressurized gas cylinders",
    "Radioactive substances or asbestos-containing construction boards",
    "Wet food garbage, sanitary waste, or unseparated municipal rubbish",
  ];

  return (
    <div className="py-12 md:py-20 bg-brand-bg">
      <div className="container space-y-16">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <Badge variant="blue" className="px-3.5 py-1 text-xs font-bold uppercase tracking-wider">
            Material Acceptance Guidelines
          </Badge>
          <h1 className="text-4xl md:text-5xl font-extrabold text-brand-dark tracking-tight">
            What Scrap Materials We Accept
          </h1>
          <p className="text-base md:text-lg text-brand-muted leading-relaxed">
            We purchase and collect 10 distinct categories of recyclable scrap
            from residences, workshops, offices, and industries across Mumbai.
          </p>
        </div>

        {/* Accepted Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SITE_CONFIG.acceptedCategories.map((cat) => (
            <Card
              key={cat.id}
              id={cat.id}
              className="scroll-mt-28 border border-brand-border bg-brand-surface shadow-subtle hover:border-brand-blue hover:shadow-card transition-all duration-200 flex flex-col justify-between"
            >
              <CardHeader className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="h-10 w-10 rounded-xl bg-muted/70 border border-brand-border flex items-center justify-center">
                    {categoryIcons[cat.id]}
                  </div>
                  <Badge variant="success" className="text-[11px]">
                    Accepted
                  </Badge>
                </div>
                <div>
                  <CardTitle className="text-xl font-bold text-brand-dark">
                    {cat.name}
                  </CardTitle>
                </div>
                <p className="text-sm text-brand-muted leading-relaxed">
                  {cat.description}
                </p>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="border-t border-brand-border pt-4 flex items-center justify-between">
                  <Link
                    href={`/rates?category=${cat.id}`}
                    className="text-xs font-bold text-brand-blue hover:underline flex items-center gap-1"
                  >
                    <TrendingUp className="h-3.5 w-3.5" />
                    <span>View Rates</span>
                  </Link>

                  <Button asChild size="sm" variant="ghost" className="text-xs">
                    <Link href="/book">
                      <span>Book Pickup</span>
                      <ArrowRight className="h-3 w-3 ml-1" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* What We Do NOT Accept */}
        <div className="rounded-3xl border border-red-200 bg-red-50/60 dark:border-red-900/60 dark:bg-red-950/30 p-8 md:p-10 shadow-subtle space-y-4">
          <div className="flex items-center gap-3 text-red-700 dark:text-red-400">
            <AlertTriangle className="h-6 w-6 shrink-0" />
            <h2 className="text-xl font-bold">Materials We Do NOT Accept</h2>
          </div>
          <p className="text-sm text-red-900/80 dark:text-red-200/80">
            For safety, environmental compliance, and legal regulations in Maharashtra,
            we strictly decline the following items:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
            {nonAccepted.map((item, idx) => (
              <div
                key={idx}
                className="flex items-start gap-2.5 text-xs md:text-sm text-red-800 dark:text-red-200 bg-brand-surface/80 p-3 rounded-xl border border-red-100 dark:border-red-900/50"
              >
                <span className="font-bold text-red-600">•</span>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Call to action */}
        <div className="text-center space-y-3 sm:space-y-4 max-w-md mx-auto">
          <h3 className="text-xl sm:text-2xl font-bold text-brand-dark">
            Have materials ready to weigh and sell?
          </h3>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-2.5 sm:gap-3 w-full">
            <Button asChild size="default" variant="default" className="w-full sm:w-auto h-11 sm:h-12 font-bold text-xs sm:text-sm shadow-sm">
              <Link href="/book">
                <CalendarCheck className="h-4 w-4 mr-2" />
                <span>Book a Doorstep Pickup</span>
              </Link>
            </Button>
            <Button asChild size="default" variant="outline" className="w-full sm:w-auto h-11 sm:h-12 font-bold text-xs sm:text-sm">
              <Link href="/rates">
                <span>Check Rates & Estimate Value</span>
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
