import type { Metadata } from "next";
import Link from "next/link";
import { Camera, CalendarCheck, HardHat } from "lucide-react";
import { getPublishedGalleryItems } from "@/lib/services/gallery";
import { getCurrentUser } from "@/lib/services/user";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GalleryClient } from "./gallery-client";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Work Gallery & Field Activities - Mumbai Scrap & Demolition",
  description:
    "View Reflection Scrap Solutions LLP's recent corporate demolitions, MIDC industrial clearances, digital weighing operations, and doorstep pickups across Mumbai.",
};

export default async function GalleryPage() {
  const [items, user] = await Promise.all([
    getPublishedGalleryItems(),
    getCurrentUser(),
  ]);

  const isAdmin = user?.role === "admin";

  return (
    <div className="py-12 md:py-20 bg-brand-bg">
      <div className="container space-y-12">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <Badge variant="blue" className="px-3.5 py-1 text-xs font-bold uppercase tracking-wider gap-1.5">
            <Camera className="h-3.5 w-3.5" />
            <span>Field Operations & Projects</span>
          </Badge>
          <h1 className="text-4xl md:text-5xl font-extrabold text-brand-dark tracking-tight">
            Our Work Gallery & Activities
          </h1>
          <p className="text-base md:text-lg text-brand-muted leading-relaxed">
            A look at our corporate office demolitions, industrial plant clearances,
            calibrated weighing sessions, and e-waste recycling drives across Mumbai.
          </p>
        </div>

        {/* Interactive Gallery */}
        <GalleryClient items={items} isAdmin={isAdmin} />

        {/* Bottom CTA */}
        <div className="rounded-3xl bg-brand-surface border border-brand-border p-6 sm:p-10 shadow-subtle flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-brand-blue">
              <HardHat className="h-4 w-4" />
              <span>Corporate & Industrial Projects</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-brand-dark">
              Planning an office strip-out or factory scrap clearance?
            </h2>
            <p className="text-sm text-brand-muted max-w-xl">
              Book a site inspection with our MIDC Andheri East team for fast,
              compliant dismantling and top scrap value.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto shrink-0">
            <Button asChild variant="outline">
              <Link href="/services#demolition-dismantling">Demolition Services</Link>
            </Button>
            <Button asChild variant="secondary">
              <Link href="/book">
                <CalendarCheck className="h-4 w-4 mr-1.5" />
                <span>Book Pickup / Survey</span>
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

