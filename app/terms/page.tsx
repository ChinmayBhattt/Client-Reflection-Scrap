import type { Metadata } from "next";
import { AlertCircle } from "lucide-react";
import { SITE_CONFIG } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Terms of Service - Reflection Scrap Solutions LLP",
  description: "Terms and conditions governing scrap trading and doorstep collection with Reflection Scrap Solutions LLP.",
};

export default function TermsPage() {
  return (
    <div className="py-12 md:py-20 bg-brand-bg">
      <div className="container max-w-4xl space-y-10">
        <div className="space-y-4">
          <h1 className="text-3xl md:text-4xl font-extrabold text-brand-dark">
            Terms of Service
          </h1>
          <p className="text-xs text-brand-muted">
            Last Updated: November 2026 • Reflection Scrap Solutions LLP ({SITE_CONFIG.llpin})
          </p>

          <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800/60 text-amber-900 dark:text-amber-200 text-xs flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400 shrink-0" />
            <span>
              <strong>Notice:</strong> This is a standard commercial terms template. Please review with legal counsel prior to formal operational enforcement.
            </span>
          </div>
        </div>

        <div className="space-y-8 bg-brand-surface p-8 md:p-12 rounded-3xl border border-brand-border text-sm leading-relaxed text-brand-dark shadow-subtle">
          <section className="space-y-3">
            <h2 className="text-lg font-bold">1. Scope of Services</h2>
            <p className="text-brand-muted">
              Reflection Scrap Solutions LLP provides waste collection, scrap
              trading, recycling facilitation, and doorstep pickup services
              throughout Mumbai, Maharashtra. By scheduling a pickup or using
              this website, you agree to these operational terms.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold">2. Material Ownership & Lawful Possession</h2>
            <p className="text-brand-muted">
              Customers represent and warrant that all scrap materials offered
              for sale and collection are their lawful property or that they are
              duly authorized representatives. We strictly refuse stolen property,
              unauthorized municipal equipment, railway fixtures, or suspected contraband.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold">3. Weighing & Payout Computation</h2>
            <p className="text-brand-muted">
              All materials are weighed in front of the customer using certified
              digital scales. Final payment is calculated based on net weight
              (excluding heavy non-recyclable foreign contaminants) multiplied by
              the prevailing scrap rate on the day of collection.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold">4. Prohibited Hazardous Materials</h2>
            <p className="text-brand-muted">
              We do not accept biohazardous medical waste, pressurized explosive
              gas cylinders, toxic liquid chemicals, or radioactive substances.
              Attempting to present such items is ground for immediate cancellation
              of service.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold">5. Cancellation & Rescheduling</h2>
            <p className="text-brand-muted">
              Customers may cancel or reschedule doorstep bookings through their
              dashboard at any time before our logistics personnel is dispatched
              (status: pending or confirmed).
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold">6. Jurisdiction & Legal Governing Law</h2>
            <p className="text-brand-muted">
              These terms are governed by the laws of the Republic of India and
              are subject to the exclusive jurisdiction of the competent courts
              in Mumbai, Maharashtra.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
