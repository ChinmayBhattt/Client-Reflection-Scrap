import type { Metadata } from "next";
import Link from "next/link";
import {
  Trash2,
  TrendingUp,
  Recycle,
  Scale,
  Cpu,
  Building2,
  HardHat,
  CalendarCheck,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { SITE_CONFIG } from "@/lib/site-config";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Our Scrap & Waste Collection Services in Mumbai",
  description:
    "Explore our full suite of scrap collection, demolition, and trading services: doorstep pickup, corporate office & industrial demolition, metal trading, e-waste recycling, and on-the-spot payment in Mumbai.",
};

export default function ServicesPage() {
  const serviceIcons: Record<string, React.ReactNode> = {
    "waste-collection": <Trash2 className="h-5 w-5 text-brand-blue" />,
    "scrap-trading": <TrendingUp className="h-5 w-5 text-brand-blue" />,
    "recycling": <Recycle className="h-5 w-5 text-brand-green" />,
    "doorstep-pickup": <Scale className="h-5 w-5 text-brand-blue" />,
    "ewaste-and-electronics": <Cpu className="h-5 w-5 text-brand-green" />,
    "bulk-commercial-scrap": <Building2 className="h-5 w-5 text-brand-blue" />,
    "demolition-dismantling": <HardHat className="h-5 w-5 text-brand-green" />,
  };

  return (
    <div className="py-12 md:py-20 bg-brand-bg">
      <div className="container space-y-16">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-blue-light text-brand-blue text-xs font-bold uppercase tracking-wider">
            <span>Reflection Scrap Solutions LLP • MIDC Andheri East</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-brand-dark tracking-tight">
            Waste Collection, Demolition & Scrap Trading Services
          </h1>
          <p className="text-base md:text-lg text-brand-muted leading-relaxed">
            Professional scrap management and demolition solutions tailored for
            households, residential societies, corporate offices, and industrial
            plants throughout Mumbai.
          </p>
        </div>

        {/* Detailed Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {SITE_CONFIG.services.map((svc) => (
            <Card
              key={svc.id}
              id={svc.id}
              className="scroll-mt-28 border border-brand-border bg-brand-surface shadow-subtle hover:border-brand-blue transition-all duration-200 flex flex-col justify-between"
            >
              <CardHeader className="space-y-3.5">
                <div className="h-11 w-11 rounded-xl bg-brand-blue-light flex items-center justify-center">
                  {serviceIcons[svc.id]}
                </div>
                <div>
                  <CardTitle className="text-xl sm:text-2xl font-bold text-brand-dark">
                    {svc.title}
                  </CardTitle>
                  <CardDescription className="text-sm sm:text-base text-brand-blue font-semibold mt-1">
                    {svc.shortDescription}
                  </CardDescription>
                </div>
                <p className="text-sm text-brand-muted leading-relaxed">
                  {svc.fullDescription}
                </p>
              </CardHeader>
              <CardContent className="pt-2">
                <div className="border-t border-brand-border pt-4 flex items-center justify-between">
                  <span className="text-xs font-semibold text-brand-green flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>
                      {svc.id === "demolition-dismantling"
                        ? "Site inspection & scrap recovery"
                        : "Certified digital weighing"}
                    </span>
                  </span>
                  <Button asChild size="sm" variant="default" className="gap-1.5">
                    <Link href="/book">
                      <span>Book Service</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Bottom Banner */}
        <div className="rounded-2xl sm:rounded-3xl bg-brand-surface border border-brand-border p-5 sm:p-8 md:p-12 shadow-card text-center max-w-4xl mx-auto space-y-4 sm:space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-green-light text-brand-green text-xs font-bold">
            <ShieldCheck className="h-4 w-4" />
            <span>Industrial & Corporate Clearances</span>
          </div>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-brand-dark leading-tight">
            Need corporate demolition, high-volume scrap removal, or factory contracts?
          </h2>
          <p className="text-xs sm:text-sm md:text-base text-brand-muted max-w-2xl mx-auto leading-relaxed">
            We provide structured dismantling plans, container placements, and full
            regulatory compliance for offices, workshops, and industrial campuses across Mumbai.
          </p>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-2.5 sm:gap-4 pt-2 w-full sm:w-auto">
            <Button asChild size="default" variant="default" className="w-full sm:w-auto h-11 sm:h-12 font-bold text-xs sm:text-sm shadow-sm">
              <Link href="/book">
                <CalendarCheck className="h-4 w-4 mr-2" />
                <span>Schedule a Pickup</span>
              </Link>
            </Button>
            <Button asChild size="default" variant="outline" className="w-full sm:w-auto h-11 sm:h-12 font-bold text-xs sm:text-sm">
              <Link href="/contact">
                <span>Contact Our MIDC Office</span>
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
