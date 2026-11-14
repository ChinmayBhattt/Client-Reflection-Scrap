import type { Metadata } from "next";
import { Suspense } from "react";
import { ServicesClient } from "./services-client";

export const metadata: Metadata = {
  title: "Our Recycling Services - Residential Scrap & Corporate E-Waste Mumbai",
  description:
    "Comprehensive waste management and scrap recycling solutions for households, housing societies, offices, and industrial plants across Mumbai. Certified weighing, instant payment, and EPR compliance.",
};

export default function ServicesPage() {
  return (
    <Suspense
      fallback={
        <div className="py-24 text-center text-brand-muted text-sm font-semibold">
          Loading recycling services...
        </div>
      }
    >
      <ServicesClient />
    </Suspense>
  );
}
