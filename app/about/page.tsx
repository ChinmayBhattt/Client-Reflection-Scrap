import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import {
  ShieldCheck,
  MapPin,
  Clock,
  Phone,
  Mail,
  Scale,
  Recycle,
  CheckCircle2,
  CalendarCheck,
} from "lucide-react";
import { SITE_CONFIG } from "@/lib/site-config";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "About Reflection Scrap Solutions LLP - MIDC Andheri East Mumbai",
  description:
    "Learn about Reflection Scrap Solutions LLP (LLPIN ACY-4261), our mission of transparent scrap trading, digital weighing, and sustainable recycling in Mumbai.",
};

export default function AboutPage() {
  return (
    <div className="py-12 md:py-20 bg-brand-bg">
      <div className="container space-y-16">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <Badge variant="blue" className="px-3.5 py-1 text-xs font-bold uppercase tracking-wider">
            About Our Company
          </Badge>
          <h1 className="text-4xl md:text-5xl font-extrabold text-brand-dark tracking-tight">
            Transparent Scrap Trading in Mumbai
          </h1>
          <p className="text-base md:text-lg text-brand-muted leading-relaxed">
            Registered as <strong>Reflection Scrap Solutions LLP</strong> ({SITE_CONFIG.llpin}),
            we are modernizing the waste and scrap recycling industry from our
            operational facility in MIDC, Andheri East.
          </p>
        </div>

        {/* Business Facts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-6 space-y-6">
            <div className="space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-green">
                Our Operational Focus
              </span>
              <h2 className="text-2xl md:text-3xl font-extrabold text-brand-dark">
                Ethical Collection, Accurate Weighing, Prompt Payouts
              </h2>
            </div>
            <p className="text-sm md:text-base text-brand-muted leading-relaxed">
              Traditional scrap selling often suffers from ambiguous weighing
              scales, delayed payments, and unorganized handling. Reflection Scrap
              Solutions LLP was established to provide an honest, tech-enabled,
              and standardized recycling service for households, commercial offices,
              and industrial manufacturing plants.
            </p>
            <p className="text-sm md:text-base text-brand-muted leading-relaxed">
              Our team operates with calibrated electronic scales, provides market-aligned
              rates, and settles payments on the spot via UPI or cash before leaving
              your premises.
            </p>

            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-brand-green shrink-0 mt-0.5" />
                <span className="text-sm text-brand-dark font-medium">
                  Direct scrap collection at your doorstep or drop-off at our MIDC yard
                </span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-brand-green shrink-0 mt-0.5" />
                <span className="text-sm text-brand-dark font-medium">
                  ISO-standard digital weighing equipment verified before each transaction
                </span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-brand-green shrink-0 mt-0.5" />
                <span className="text-sm text-brand-dark font-medium">
                  Responsible channeling of sorted materials to certified recyclers
                </span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6">
            <Card className="border border-brand-border bg-white shadow-elevated p-8 rounded-3xl space-y-6">
              <div className="flex items-center gap-4 pb-6 border-b border-brand-border">
                <div className="h-16 w-16 rounded-2xl bg-brand-blue-light p-2 flex items-center justify-center border border-brand-blue/20">
                  <Image
                    src="/logo-icon.png"
                    alt="Reflection Scrap Solutions LLP"
                    width={56}
                    height={56}
                    className="object-contain"
                  />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-brand-dark">
                    {SITE_CONFIG.name}
                  </h3>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-brand-blue-light text-brand-blue text-xs font-bold mt-1">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    <span>{SITE_CONFIG.llpin}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4 text-sm">
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-brand-blue shrink-0 mt-0.5" />
                  <div>
                    <span className="block font-bold text-brand-dark">
                      Operating Yard & Facility
                    </span>
                    <span className="text-brand-muted">{SITE_CONFIG.address.full}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-brand-green shrink-0 mt-0.5" />
                  <div>
                    <span className="block font-bold text-brand-dark">
                      Operating Hours
                    </span>
                    <span className="text-brand-muted">
                      {SITE_CONFIG.operatingHours.days}: {SITE_CONFIG.operatingHours.hours}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="h-5 w-5 text-brand-blue shrink-0 mt-0.5" />
                  <div>
                    <span className="block font-bold text-brand-dark">Phone Contact</span>
                    <a
                      href={`tel:${SITE_CONFIG.contact.phoneRaw}`}
                      className="text-brand-blue hover:underline"
                    >
                      {SITE_CONFIG.contact.phone}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="h-5 w-5 text-brand-muted shrink-0 mt-0.5" />
                  <div>
                    <span className="block font-bold text-brand-dark">Official Email</span>
                    <a
                      href={`mailto:${SITE_CONFIG.contact.email}`}
                      className="text-brand-blue hover:underline"
                    >
                      {SITE_CONFIG.contact.email}
                    </a>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <Button asChild className="w-full">
                  <Link href="/book">
                    <CalendarCheck className="h-4 w-4 mr-2" />
                    <span>Schedule a Pickup</span>
                  </Link>
                </Button>
              </div>
            </Card>
          </div>
        </div>

        {/* Core Pillars */}
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <h3 className="text-2xl font-bold text-brand-dark">
              Our Service Standards
            </h3>
            <p className="text-sm text-brand-muted">
              Built on transparency, punctuality, and civic responsibility.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-2xl border border-brand-border bg-white p-6 shadow-subtle space-y-3">
              <div className="h-10 w-10 rounded-xl bg-brand-blue-light text-brand-blue flex items-center justify-center font-bold">
                <Scale className="h-5 w-5" />
              </div>
              <h4 className="text-lg font-bold text-brand-dark">
                Verified Accuracy
              </h4>
              <p className="text-xs md:text-sm text-brand-muted leading-relaxed">
                We calibrate our weighing scales every morning so customers get
                every rupee their scrap is worth.
              </p>
            </div>

            <div className="rounded-2xl border border-brand-border bg-white p-6 shadow-subtle space-y-3">
              <div className="h-10 w-10 rounded-xl bg-brand-green-light text-brand-green flex items-center justify-center font-bold">
                <Recycle className="h-5 w-5" />
              </div>
              <h4 className="text-lg font-bold text-brand-dark">
                Circular Recycling
              </h4>
              <p className="text-xs md:text-sm text-brand-muted leading-relaxed">
                We work directly with approved re-processors and smelters to ensure
                materials are recycled ethically, reducing Mumbai&apos;s landfill volume.
              </p>
            </div>

            <div className="rounded-2xl border border-brand-border bg-white p-6 shadow-subtle space-y-3">
              <div className="h-10 w-10 rounded-xl bg-brand-blue-light text-brand-blue flex items-center justify-center font-bold">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <h4 className="text-lg font-bold text-brand-dark">
                Compliance & Trust
              </h4>
              <p className="text-xs md:text-sm text-brand-muted leading-relaxed">
                As an incorporated LLP in Maharashtra, we follow all municipal
                and state recycling guidelines for commercial and residential pickups.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
