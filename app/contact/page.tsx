import type { Metadata } from "next";
import {
  MapPin,
  Clock,
  Phone,
  MessageCircle,
  Mail,
  ShieldCheck,
  CalendarCheck,
} from "lucide-react";
import { SITE_CONFIG } from "@/lib/site-config";
import { SocialLinks } from "@/components/social-links";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ContactForm } from "./contact-form";

export const metadata: Metadata = {
  title: "Contact Reflection Scrap Solutions LLP - MIDC Andheri East",
  description:
    "Contact Reflection Scrap Solutions LLP in MIDC, Andheri East, Mumbai. Reach us by phone, WhatsApp, or visit our scrap drop-off yard. Open 8:00 AM - 10:00 PM daily.",
};

export default function ContactPage() {
  return (
    <div className="py-12 md:py-20 bg-brand-bg">
      <div className="container space-y-16">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <Badge variant="blue" className="px-3.5 py-1 text-xs font-bold uppercase tracking-wider">
            Get in Touch
          </Badge>
          <h1 className="text-4xl md:text-5xl font-extrabold text-brand-dark tracking-tight">
            Contact Our Mumbai Office & Yard
          </h1>
          <p className="text-base md:text-lg text-brand-muted leading-relaxed">
            Have questions about today&apos;s scrap rates, need bulk commercial
            clearances, or want to drop off scrap directly at our MIDC facility?
            We are here 7 days a week.
          </p>
        </div>

        {/* Contact Grid: Form & Info */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Contact Form */}
          <div className="lg:col-span-7">
            <Card className="border border-brand-border bg-brand-surface shadow-card rounded-3xl p-6 md:p-8 space-y-6">
              <div>
                <CardTitle className="text-2xl font-bold text-brand-dark">
                  Send an Enquiry
                </CardTitle>
                <p className="text-sm text-brand-muted mt-1">
                  Fill in your details and our team will get in touch with you shortly.
                </p>
              </div>

              <ContactForm />
            </Card>
          </div>

          {/* Right Column: Direct Contact & Location */}
          <div className="lg:col-span-5 space-y-6">
            <Card className="border border-brand-border bg-brand-surface shadow-subtle rounded-3xl p-6 md:p-8 space-y-6">
              <div className="space-y-1">
                <h2 className="text-xl font-bold text-brand-dark">
                  Direct Contact & Yard Info
                </h2>
                <p className="text-xs text-brand-muted">
                  Reflection Scrap Solutions LLP ({SITE_CONFIG.llpin})
                </p>
              </div>

              <div className="space-y-4 text-sm">
                <div className="flex items-start gap-3.5">
                  <div className="h-10 w-10 shrink-0 rounded-xl bg-brand-blue-light text-brand-blue flex items-center justify-center font-bold">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="block font-bold text-brand-dark">
                      Address & Collection Yard
                    </span>
                    <span className="text-brand-muted">{SITE_CONFIG.address.full}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="h-10 w-10 shrink-0 rounded-xl bg-brand-green-light text-brand-green flex items-center justify-center font-bold">
                    <Clock className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="block font-bold text-brand-dark">
                      Operating Hours
                    </span>
                    <span className="text-brand-muted">
                      {SITE_CONFIG.operatingHours.days} <br />
                      <strong>{SITE_CONFIG.operatingHours.hours}</strong>
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="h-10 w-10 shrink-0 rounded-xl bg-brand-blue-light text-brand-blue flex items-center justify-center font-bold">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="block font-bold text-brand-dark">
                      Click to Call
                    </span>
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                      <a
                        href={`tel:${SITE_CONFIG.contact.phoneRaw}`}
                        className="text-brand-blue font-bold hover:underline"
                      >
                        {SITE_CONFIG.contact.phone}
                      </a>
                      <span className="text-brand-muted">•</span>
                      <a
                        href={`tel:${SITE_CONFIG.contact.phoneSecondaryRaw}`}
                        className="text-brand-blue font-bold hover:underline"
                      >
                        {SITE_CONFIG.contact.phoneSecondary}
                      </a>
                      <span className="text-brand-muted">•</span>
                      <a
                        href={`tel:${SITE_CONFIG.contact.phoneTertiaryRaw}`}
                        className="text-brand-blue font-bold hover:underline"
                      >
                        {SITE_CONFIG.contact.phoneTertiary}
                      </a>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="h-10 w-10 shrink-0 rounded-xl bg-[#25D366]/10 text-[#25D366] flex items-center justify-center font-bold">
                    <MessageCircle className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="block font-bold text-brand-dark">
                      WhatsApp Chat
                    </span>
                    <a
                      href={`https://wa.me/${SITE_CONFIG.contact.whatsappRaw}?text=${encodeURIComponent(
                        SITE_CONFIG.contact.whatsappMessage
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#25D366] font-bold hover:underline"
                    >
                      Chat on WhatsApp: {SITE_CONFIG.contact.whatsapp}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="h-10 w-10 shrink-0 rounded-xl bg-muted text-brand-dark flex items-center justify-center font-bold">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="block font-bold text-brand-dark">Email</span>
                    <a
                      href={`mailto:${SITE_CONFIG.contact.email}`}
                      className="text-brand-blue hover:underline break-all"
                    >
                      {SITE_CONFIG.contact.email}
                    </a>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-brand-border space-y-2.5">
                <span className="block text-xs font-bold uppercase tracking-wider text-brand-muted">
                  Follow Us
                </span>
                <SocialLinks variant="light" showLabels />
              </div>
            </Card>

            <div className="rounded-2xl bg-brand-green-light border border-brand-green/30 p-5 flex items-center justify-between">
              <div>
                <p className="font-bold text-sm text-brand-dark">Prefer Doorstep Pickup?</p>
                <p className="text-xs text-brand-muted">Book a time slot in 2 minutes.</p>
              </div>
              <Button asChild size="sm" variant="secondary">
                <a href="/book">Book Now</a>
              </Button>
            </div>
          </div>
        </div>

        {/* Embedded Google Map */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-brand-dark flex items-center gap-2">
              <MapPin className="h-5 w-5 text-brand-blue" />
              <span>Location Map: MIDC, Andheri East, Mumbai</span>
            </h2>
            <span className="text-xs text-brand-muted">
              Pincode: {SITE_CONFIG.address.pincode}
            </span>
          </div>

          <div className="relative w-full h-[400px] rounded-3xl overflow-hidden border border-brand-border shadow-card bg-muted">
            <iframe
              src={SITE_CONFIG.address.googleMapsEmbedUrl}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Reflection Scrap Solutions LLP MIDC Andheri East Location Map"
              className="w-full h-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
