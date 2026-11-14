import type { Metadata } from "next";
import { AlertCircle } from "lucide-react";
import { SITE_CONFIG } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Privacy Policy - Reflection Scrap Solutions LLP",
  description: "Privacy policy for Reflection Scrap Solutions LLP customers and website visitors.",
};

export default function PrivacyPage() {
  return (
    <div className="py-12 md:py-20 bg-brand-bg">
      <div className="container max-w-4xl space-y-10">
        <div className="space-y-4">
          <h1 className="text-3xl md:text-4xl font-extrabold text-brand-dark">
            Privacy Policy
          </h1>
          <p className="text-xs text-brand-muted">
            Last Updated: November 2026 • Reflection Scrap Solutions LLP ({SITE_CONFIG.llpin})
          </p>

          <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800/60 text-amber-900 dark:text-amber-200 text-xs flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400 shrink-0" />
            <span>
              <strong>Notice:</strong> This is a standard template policy. Please review with legal counsel prior to formal commercial enforcement.
            </span>
          </div>
        </div>

        <div className="space-y-8 bg-brand-surface p-8 md:p-12 rounded-3xl border border-brand-border text-sm leading-relaxed text-brand-dark shadow-subtle">
          <section className="space-y-3">
            <h2 className="text-lg font-bold">1. Information We Collect</h2>
            <p className="text-brand-muted">
              Reflection Scrap Solutions LLP collects customer information
              strictly necessary to coordinate scrap collection, verify service
              areas, and execute payment settlements. This includes:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-brand-muted">
              <li>Full name, telephone / WhatsApp contact numbers, and email address.</li>
              <li>Pickup address details including building name, landmark, and postal pincode.</li>
              <li>Estimated scrap categories and uploaded verification photos of materials.</li>
              <li>UPI VPA identifiers or bank account details solely when chosen for digital payout.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold">2. Use of Information</h2>
            <p className="text-brand-muted">
              Your information is utilized solely to fulfill scheduled doorstep
              pickups, verify location feasibility in Mumbai, send automated
              booking status updates via SMS/WhatsApp, and process transactions. We
              do not sell or rent customer data to third-party telemarketers.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold">3. Data Security & Storage</h2>
            <p className="text-brand-muted">
              We implement industry-standard database encryption, secure authentication
              protocols, and Row Level Security (RLS) to ensure customer records
              and uploaded scrap photos are isolated and protected against
              unauthorized access.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold">4. Contact & Inquiries</h2>
            <p className="text-brand-muted">
              For any questions regarding your personal information, reach out to
              our compliance desk at:
            </p>
            <div className="p-4 rounded-xl bg-brand-bg border border-brand-border text-xs space-y-1">
              <p className="font-bold text-brand-dark">{SITE_CONFIG.name}</p>
              <p className="text-brand-muted">{SITE_CONFIG.address.full}</p>
              <p className="text-brand-muted">Email: {SITE_CONFIG.contact.email}</p>
              <p className="text-brand-muted">Phone: {SITE_CONFIG.contact.phone} / {SITE_CONFIG.contact.phoneSecondary} / {SITE_CONFIG.contact.phoneTertiary}</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
