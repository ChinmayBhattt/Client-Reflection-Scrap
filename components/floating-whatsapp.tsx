"use client";

import { MessageCircle } from "lucide-react";
import { SITE_CONFIG } from "@/lib/site-config";

export function FloatingWhatsApp() {
  const whatsappUrl = `https://wa.me/${SITE_CONFIG.contact.whatsappRaw}?text=${encodeURIComponent(
    SITE_CONFIG.contact.whatsappMessage
  )}`;

  return (
    <aside aria-label="WhatsApp quick chat" className="hidden md:block fixed bottom-6 right-5 z-40">
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with Reflection Scrap Solutions on WhatsApp"
        className="group flex items-center gap-2 bg-[#25D366] text-white px-3 py-2 rounded-full shadow-md hover:bg-[#20ba59] transition-all duration-200 hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-[#25D366] focus:ring-offset-2"
      >
        <MessageCircle className="h-5 w-5 fill-white" />
        <span className="font-semibold text-xs pr-0.5">
          WhatsApp Us
        </span>
      </a>
    </aside>
  );
}
