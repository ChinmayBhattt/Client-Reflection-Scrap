import type { Metadata } from "next";
import Link from "next/link";
import { HelpCircle, CalendarCheck, MessageCircle } from "lucide-react";
import { SITE_CONFIG } from "@/lib/site-config";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Frequently Asked Questions - Reflection Scrap Solutions LLP",
  description:
    "Find answers to common questions about scrap rates, doorstep weighing, instant UPI payments, and service areas in Mumbai.",
};

export default function FAQPage() {
  const extendedFaqs = [
    {
      category: "Doorstep Pickup & Booking",
      items: [
        {
          q: "How does the doorstep pickup process work?",
          a: "You select your scrap items on our website or booking page, enter your Mumbai address, and choose a date and time slot. Our verified pickup team arrives with digital scales, weighs each item in front of you, and calculates payment on the spot.",
        },
        {
          q: "Is there any charge for doorstep collection?",
          a: "No, our doorstep collection is completely free for standard household quantities above 10 kg. You are paid for the full value of the scrap we collect.",
        },
        {
          q: "Can I drop off scrap myself at your MIDC yard?",
          a: "Yes! If you prefer dropping off scrap directly, visit our yard in MIDC, Andheri East, Mumbai, open Monday to Sunday between 8:00 AM and 10:00 PM for instant weighing and cash/UPI settlement.",
        },
      ],
    },
    {
      category: "Weighing & Rates",
      items: [
        {
          q: "How accurate are your weighing scales?",
          a: "We only use certified electronic digital weighing scales that are tested and calibrated daily. The customer views the digital readout directly during the process.",
        },
        {
          q: "Why do scrap rates fluctuate?",
          a: "Scrap metal, paper, and plastic values are directly linked to global and domestic commodity indices and industrial demand. We update our rates in our database regularly to reflect fair, market-aligned pricing.",
        },
        {
          q: "Are the rates shown on the website guaranteed?",
          a: "Rates shown are indicative benchmark rates. The final payment is computed using the active rate at the time of your doorstep weighing.",
        },
      ],
    },
    {
      category: "Payments",
      items: [
        {
          q: "What payment options are available upon completion?",
          a: "We provide instant UPI transfers (Google Pay, PhonePe, Paytm, BHIM) directly to your bank account or cash payment immediately once the weights are confirmed.",
        },
        {
          q: "Do you provide a receipt or bill?",
          a: "Yes, you receive a digital booking record with the measured weights, item breakdown, and total payment amount.",
        },
      ],
    },
    {
      category: "Bulk, Commercial & E-Waste",
      items: [
        {
          q: "Do you handle industrial scrap and office dismantling?",
          a: "Yes, we handle bulk clearances, factory offcuts, machinery scrapping, and corporate IT e-waste decommissioning with proper weighbridge slips and documentation.",
        },
        {
          q: "What happens to the scrap after you collect it?",
          a: "All materials are systematically sorted, baled, and sent to authorized re-smelters and recycling units to ensure responsible environmental processing.",
        },
      ],
    },
  ];

  return (
    <div className="py-12 md:py-20 bg-brand-bg">
      <div className="container space-y-16 max-w-4xl">
        {/* Header */}
        <div className="text-center space-y-4">
          <Badge variant="blue" className="px-3.5 py-1 text-xs font-bold uppercase tracking-wider">
            Help Center & FAQs
          </Badge>
          <h1 className="text-4xl md:text-5xl font-extrabold text-brand-dark tracking-tight">
            Frequently Asked Questions
          </h1>
          <p className="text-base md:text-lg text-brand-muted leading-relaxed">
            Everything you need to know about our waste collection, scrap
            pricing, and doorstep weighing services in Mumbai.
          </p>
        </div>

        {/* Categorized FAQs */}
        <div className="space-y-12">
          {extendedFaqs.map((sec, idx) => (
            <div key={idx} className="space-y-4">
              <h2 className="text-xl font-bold text-brand-dark border-b border-brand-border pb-2">
                {sec.category}
              </h2>
              <div className="space-y-4">
                {sec.items.map((faq, fIdx) => (
                  <div
                    key={fIdx}
                    className="rounded-2xl border border-brand-border bg-white p-6 shadow-subtle space-y-2"
                  >
                    <h3 className="font-bold text-base text-brand-dark flex items-start gap-2.5">
                      <HelpCircle className="h-5 w-5 text-brand-blue shrink-0 mt-0.5" />
                      <span>{faq.q}</span>
                    </h3>
                    <p className="text-sm text-brand-muted pl-7 leading-relaxed">
                      {faq.a}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Still have questions */}
        <div className="rounded-3xl bg-white border border-brand-border p-8 text-center space-y-4 shadow-card">
          <h3 className="text-xl font-bold text-brand-dark">
            Still have questions or need a custom quote?
          </h3>
          <p className="text-sm text-brand-muted max-w-md mx-auto">
            Our team in MIDC Andheri East is available 7 days a week from 8:00 AM
            to 10:00 PM to assist you.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Button asChild size="default" variant="default">
              <Link href="/contact">Contact Us</Link>
            </Button>
            <Button asChild size="default" variant="outlineGreen">
              <a
                href={`https://wa.me/${SITE_CONFIG.contact.whatsappRaw}?text=${encodeURIComponent(
                  SITE_CONFIG.contact.whatsappMessage
                )}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle className="h-4 w-4 mr-2 text-brand-green" />
                Chat on WhatsApp
              </a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
