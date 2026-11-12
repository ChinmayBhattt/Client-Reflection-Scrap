import Link from "next/link";
import { Phone, CalendarCheck, MessageCircle } from "lucide-react";
import { SITE_CONFIG } from "@/lib/site-config";

export function MobileCallBar() {
  const whatsappUrl = `https://wa.me/${SITE_CONFIG.contact.whatsappRaw}?text=${encodeURIComponent(
    SITE_CONFIG.contact.whatsappMessage
  )}`;

  return (
    <div className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-brand-surface/95 backdrop-blur-md border-t border-brand-border px-3 py-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] shadow-elevated flex items-center gap-2">
      <a
        href={`tel:${SITE_CONFIG.contact.phoneRaw}`}
        className="flex-1 flex items-center justify-center gap-1.5 h-10 rounded-xl border border-brand-blue/30 bg-brand-blue-light text-brand-blue font-bold text-xs active:scale-95 transition-transform"
        aria-label="Call Reflection Scrap Solutions"
      >
        <Phone className="h-3.5 w-3.5 text-brand-blue" />
        <span>Call</span>
      </a>

      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex-1 flex items-center justify-center gap-1.5 h-10 rounded-xl border border-brand-green/30 bg-brand-green-light text-brand-green font-bold text-xs active:scale-95 transition-transform"
        aria-label="Chat on WhatsApp"
      >
        <MessageCircle className="h-3.5 w-3.5 text-brand-green" />
        <span>WhatsApp</span>
      </a>

      <Link
        href="/book"
        className="flex-[1.4] flex items-center justify-center gap-1.5 h-10 rounded-xl bg-brand-green text-white font-bold text-xs uppercase tracking-wider shadow-sm active:scale-95 transition-transform"
      >
        <CalendarCheck className="h-3.5 w-3.5" />
        <span>Book Pickup</span>
      </Link>
    </div>
  );
}
