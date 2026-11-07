import Link from "next/link";
import { Phone, CalendarCheck } from "lucide-react";
import { SITE_CONFIG } from "@/lib/site-config";

export function MobileCallBar() {
  return (
    <div className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-brand-border px-3 py-2.5 shadow-elevated flex items-center gap-2">
      <a
        href={`tel:${SITE_CONFIG.contact.phoneRaw}`}
        className="flex-1 flex items-center justify-center gap-2 h-11 rounded-xl border border-brand-blue/30 bg-brand-blue-light text-brand-blue font-bold text-xs uppercase tracking-wider active:scale-[0.98] transition-transform"
      >
        <Phone className="h-4 w-4" />
        <span>Call Now</span>
      </a>

      <Link
        href="/book"
        className="flex-1 flex items-center justify-center gap-2 h-11 rounded-xl bg-brand-green text-white font-bold text-xs uppercase tracking-wider shadow-sm active:scale-[0.98] transition-transform"
      >
        <CalendarCheck className="h-4 w-4" />
        <span>Book Pickup</span>
      </Link>
    </div>
  );
}
