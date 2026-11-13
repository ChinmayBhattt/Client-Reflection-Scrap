import Link from "next/link";
import Image from "next/image";
import {
  MapPin,
  Clock,
  Phone,
  Mail,
  MessageCircle,
  ShieldCheck,
  ArrowUpRight,
} from "lucide-react";
import { SITE_CONFIG } from "@/lib/site-config";
import { SocialLinks } from "@/components/social-links";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-[#161B1E] text-white pt-16 pb-24 md:pb-12 border-t border-gray-800">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 pb-12 border-b border-gray-800">
          {/* Brand & Overview */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="inline-flex items-center gap-3">
              <div className="h-12 w-12 rounded-xl bg-white p-2 flex items-center justify-center shadow-md">
                <Image
                  src="/logo-icon.png"
                  alt="Reflection Scrap Solutions LLP"
                  width={38}
                  height={38}
                  className="h-full w-full object-contain"
                />
              </div>
              <div>
                <span className="block text-lg font-extrabold tracking-tight text-white">
                  Reflection <span className="text-brand-blue">Scrap</span>
                </span>
                <span className="block text-xs font-semibold tracking-wider uppercase text-brand-green">
                  Solutions LLP
                </span>
              </div>
            </Link>

            <p className="text-sm text-gray-300 leading-relaxed max-w-sm">
              Certified waste collection and scrap trading company operating in
              MIDC, Andheri East, Mumbai. Providing fair scrap rates, calibrated
              digital weighing, and on-the-spot settlement.
            </p>

            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-800/80 border border-gray-700 text-xs text-gray-300">
              <ShieldCheck className="h-4 w-4 text-brand-green" />
              <span>Registered Entity: <strong>{SITE_CONFIG.llpin}</strong></span>
            </div>

            <div className="pt-1 space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                Connect With Us
              </p>
              <SocialLinks variant="dark" />
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white">
              Navigation
            </h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>
                <Link
                  href="/"
                  className="hover:text-brand-blue transition-colors flex items-center gap-1"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/services"
                  className="hover:text-brand-blue transition-colors flex items-center gap-1"
                >
                  Services
                </Link>
              </li>
              <li>
                <Link
                  href="/rates"
                  className="hover:text-brand-blue transition-colors flex items-center gap-1"
                >
                  Scrap Rates & Calculator
                </Link>
              </li>
              <li>
                <Link
                  href="/what-we-accept"
                  className="hover:text-brand-blue transition-colors flex items-center gap-1"
                >
                  What We Accept
                </Link>
              </li>
              <li>
                <Link
                  href="/gallery"
                  className="hover:text-brand-blue transition-colors flex items-center gap-1"
                >
                  Work Gallery
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="hover:text-brand-blue transition-colors flex items-center gap-1"
                >
                  Market Trends Blog
                </Link>
              </li>
              <li>
                <Link
                  href="/book"
                  className="text-brand-green hover:underline font-semibold flex items-center gap-1"
                >
                  Book a Pickup <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="hover:text-brand-blue transition-colors flex items-center gap-1"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="hover:text-brand-blue transition-colors flex items-center gap-1"
                >
                  Contact & Yard Map
                </Link>
              </li>
            </ul>
          </div>

          {/* Accepted Materials */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white">
              Scrap Categories
            </h4>
            <ul className="space-y-2 text-sm text-gray-300">
              {SITE_CONFIG.acceptedCategories.slice(0, 6).map((cat) => (
                <li key={cat.id}>
                  <Link
                    href={`/rates?category=${cat.id}`}
                    className="hover:text-brand-blue transition-colors"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/what-we-accept"
                  className="text-xs text-brand-blue hover:underline font-medium"
                >
                  View all 10 categories →
                </Link>
              </li>
            </ul>
          </div>

          {/* Operating Hours & Contact */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white">
              Mumbai Location & Hours
            </h4>
            <div className="space-y-3 text-sm text-gray-300">
              <div className="flex items-start gap-2.5">
                <MapPin className="h-4 w-4 text-brand-blue shrink-0 mt-0.5" />
                <span>{SITE_CONFIG.address.full}</span>
              </div>

              <div className="flex items-start gap-2.5">
                <Clock className="h-4 w-4 text-brand-green shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-white">
                    {SITE_CONFIG.operatingHours.days}
                  </p>
                  <p className="text-xs text-gray-400">
                    {SITE_CONFIG.operatingHours.hours}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Phone className="h-4 w-4 text-brand-blue shrink-0 mt-0.5" />
                <div className="flex flex-col gap-0.5">
                  <a
                    href={`tel:${SITE_CONFIG.contact.phoneRaw}`}
                    className="hover:text-brand-blue transition-colors"
                  >
                    {SITE_CONFIG.contact.phone}
                  </a>
                  <a
                    href={`tel:${SITE_CONFIG.contact.phoneSecondaryRaw}`}
                    className="hover:text-brand-blue transition-colors text-xs text-gray-400"
                  >
                    {SITE_CONFIG.contact.phoneSecondary}
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <MessageCircle className="h-4 w-4 text-brand-green shrink-0" />
                <a
                  href={`https://wa.me/${SITE_CONFIG.contact.whatsappRaw}?text=${encodeURIComponent(
                    SITE_CONFIG.contact.whatsappMessage
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-brand-green transition-colors"
                >
                  WhatsApp: {SITE_CONFIG.contact.whatsapp}
                </a>
              </div>

              <div className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 text-gray-400 shrink-0" />
                <a
                  href={`mailto:${SITE_CONFIG.contact.email}`}
                  className="hover:text-brand-blue transition-colors truncate"
                >
                  {SITE_CONFIG.contact.email}
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Legal */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-400">
          <div>
            © {currentYear} {SITE_CONFIG.name} ({SITE_CONFIG.llpin}). All rights reserved.
          </div>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-white transition-colors">
              Terms of Service
            </Link>
            <Link href="/faq" className="hover:text-white transition-colors">
              FAQs
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
