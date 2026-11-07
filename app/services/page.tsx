import type { Metadata } from "next";
import Link from "next/link";
import {
  Trash2,
  TrendingUp,
  Recycle,
  Scale,
  Cpu,
  Building2,
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
    "Explore our full suite of scrap collection and trading services: doorstep pickup, industrial scrap, metal trading, e-waste recycling, and on-the-spot payment in Mumbai.",
};

export default function ServicesPage() {
  const serviceIcons: Record<string, React.ReactNode> = {
    "waste-collection": <Trash2 className="h-8 w-8 text-brand-blue" />,
    "scrap-trading": <TrendingUp className="h-8 w-8 text-brand-blue" />,
    "recycling": <Recycle className="h-8 w-8 text-brand-green" />,
    "doorstep-pickup": <Scale className="h-8 w-8 text-brand-blue" />,
    "ewaste-and-electronics": <Cpu className="h-8 w-8 text-brand-green" />,
    "bulk-commercial-scrap": <Building2 className="h-8 w-8 text-brand-blue" />,
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
            Waste Collection & Scrap Trading Services
          </h1>
          <p className="text-base md:text-lg text-brand-muted leading-relaxed">
            Professional scrap management solutions tailored for households,
            residential societies, commercial enterprises, and industrial plants
            throughout Mumbai.
          </p>
        </div>

        {/* Detailed Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {SITE_CONFIG.services.map((svc) => (
            <Card
              key={svc.id}
              id={svc.id}
              className="scroll-mt-28 border border-brand-border bg-white shadow-subtle hover:border-brand-blue transition-all duration-200 flex flex-col justify-between"
            >
              <CardHeader className="space-y-4">
                <div className="h-16 w-16 rounded-2xl bg-brand-blue-light flex items-center justify-center">
                  {serviceIcons[svc.id]}
                </div>
                <div>
                  <CardTitle className="text-2xl font-bold text-brand-dark">
                    {svc.title}
                  </CardTitle>
                  <CardDescription className="text-base text-brand-blue font-semibold mt-1">
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
                    <span>Certified digital weighing</span>
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
        <div className="rounded-3xl bg-white border border-brand-border p-8 md:p-12 shadow-card text-center max-w-4xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-green-light text-brand-green text-xs font-bold">
            <ShieldCheck className="h-4 w-4" />
            <span>Industrial & Corporate Clearances</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-brand-dark">
            Need high-volume scrap removal or periodic factory contracts?
          </h2>
          <p className="text-sm md:text-base text-brand-muted max-w-2xl mx-auto">
            We provide structured contracts, container placements, and full
            regulatory compliance for workshops and corporate campuses across Mumbai.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Button asChild size="lg" variant="default">
              <Link href="/book">
                <CalendarCheck className="h-4 w-4 mr-2" />
                <span>Schedule a Pickup</span>
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
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
