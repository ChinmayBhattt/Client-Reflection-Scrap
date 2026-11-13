import Link from "next/link";
import Image from "next/image";
import {
  CalendarCheck,
  MessageCircle,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  MapPin,
  TrendingUp,
  Scale,
  Zap,
  Calendar,
  Wallet,
  Recycle,
  Trash2,
  Cpu,
  Building2,
  HardHat,
  Hammer,
  HelpCircle,
  FileCheck,
  Phone,
  Anvil,
  Cable,
  Coins,
  Layers,
  Shield,
  Newspaper,
  CircuitBoard,
  BatteryCharging,
  Tv,
} from "lucide-react";
import { SITE_CONFIG } from "@/lib/site-config";
import { getScrapItems } from "@/lib/services/rates";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const categoryIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  "iron-steel": Anvil,
  copper: Cable,
  brass: Coins,
  aluminium: Layers,
  "stainless-steel": Shield,
  plastic: Recycle,
  "paper-cardboard": Newspaper,
  ewaste: CircuitBoard,
  batteries: BatteryCharging,
  appliances: Tv,
};

export const revalidate = 60; // Refresh live rates every minute

export default async function HomePage() {
  // Fetch live scrap items from DB / fallback catalog
  const allItems = await getScrapItems();

  // Pick 6 prominent benchmark items (including Cast Iron, Copper, Brass, Aluminium, Steel, Paper)
  const previewItems = [
    allItems.find((it) => it.name.includes("Cast Iron")) || allItems[1],
    allItems.find((it) => it.name.includes("Armature Copper")) || allItems[3],
    allItems.find((it) => it.name.includes("Honey Brass")) || allItems[6],
    allItems.find((it) => it.name.includes("Aluminium Section")) || allItems[8],
    allItems.find((it) => it.name.includes("Heavy Melting Steel")) || allItems[0],
    allItems.find((it) => it.name.includes("Corrugated Cardboard")) || allItems[17],
  ].filter(Boolean);

  return (
    <div className="flex flex-col w-full pb-16 md:pb-0">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-brand-blue-light/50 via-brand-surface to-brand-bg py-8 sm:py-16 md:py-24 border-b border-brand-border">
        <div className="container relative z-10 px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-center">
            {/* Left Column: Headline & Value Proposition */}
            <div className="lg:col-span-7 space-y-4 sm:space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-green-light border border-brand-green/30 text-[11px] sm:text-xs md:text-sm font-semibold text-brand-green">
                <Recycle className="h-3.5 w-3.5 text-brand-green" />
                <span>MIDC Andheri East, Mumbai • Scrap Trading</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-brand-dark leading-[1.15]">
                Turn Your Scrap <br className="hidden sm:inline" />
                <span className="text-brand-blue">Into Value</span>
              </h1>

              <p className="text-sm sm:text-base lg:text-lg text-brand-muted max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                Reflection Scrap Solutions LLP delivers trusted scrap trading,
                doorstep collection, calibrated digital weighing, and instant
                on-the-spot payment across Mumbai.
              </p>

              {/* Primary Actions (Compact 2-button row on mobile) */}
              <div className="flex flex-row items-center justify-center lg:justify-start gap-2.5 sm:gap-3.5 pt-1 sm:pt-2">
                <Button asChild size="default" variant="default" className="flex-1 sm:flex-initial h-11 sm:h-12 px-4 sm:px-6 gap-2 shadow-card font-bold text-xs sm:text-sm">
                  <Link href="/book">
                    <CalendarCheck className="h-4 w-4" />
                    <span>Book Pickup</span>
                  </Link>
                </Button>

                <Button
                  asChild
                  size="default"
                  variant="outlineGreen"
                  className="flex-1 sm:flex-initial h-11 sm:h-12 px-4 sm:px-6 gap-2 font-bold text-xs sm:text-sm"
                >
                  <a
                    href={`https://wa.me/${SITE_CONFIG.contact.whatsappRaw}?text=${encodeURIComponent(
                      SITE_CONFIG.contact.whatsappMessage
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <MessageCircle className="h-4 w-4 text-brand-green" />
                    <span>WhatsApp</span>
                  </a>
                </Button>
              </div>

              {/* Mobile Quick Service Badges Strip */}
              <div className="pt-2 sm:pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-y-1.5 gap-x-3 sm:gap-x-6 text-[11px] sm:text-xs text-brand-muted">
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5 text-brand-green" />
                  <span>On-spot payout</span>
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5 text-brand-blue" />
                  <span>8 AM – 10 PM Daily</span>
                </span>
                <span className="flex items-center gap-1">
                  <FileCheck className="h-3.5 w-3.5 text-brand-muted" />
                  <span>LLPIN ACY-4261</span>
                </span>
              </div>
            </div>

            {/* Right Column: Visual Card (Desktop Only - on mobile it replaces with a slim summary) */}
            <div className="lg:col-span-5 hidden lg:block">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                <div className="relative rounded-3xl border border-brand-border bg-brand-surface p-6 md:p-8 shadow-elevated">
                  <div className="flex items-center justify-between pb-6 border-b border-brand-border">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-2xl bg-white p-2 flex items-center justify-center border border-brand-border">
                        <Image
                          src="/logo-icon.png"
                          alt="Reflection Scrap Logo"
                          width={40}
                          height={40}
                          className="object-contain"
                        />
                      </div>
                      <div>
                        <h2 className="text-base font-bold text-brand-dark">
                          Reflection Scrap Solutions LLP
                        </h2>
                        <p className="text-xs text-brand-muted">
                          MIDC, Andheri East, Mumbai
                        </p>
                      </div>
                    </div>
                    <Badge variant="success">Open Daily</Badge>
                  </div>

                  <div className="py-6 space-y-4">
                    <div className="rounded-xl bg-brand-bg p-4 border border-brand-border flex items-center justify-between">
                      <div>
                        <span className="text-xs text-brand-muted uppercase font-bold tracking-wider">
                          Operating Hours
                        </span>
                        <p className="text-sm font-bold text-brand-dark mt-0.5">
                          8:00 AM – 10:00 PM
                        </p>
                        <p className="text-xs text-brand-green font-medium">
                          7 Days a Week
                        </p>
                      </div>
                      <Clock className="h-8 w-8 text-brand-green/80" />
                    </div>

                    <div className="rounded-xl bg-brand-blue-light/50 p-4 border border-brand-blue/20 flex items-center justify-between">
                      <div>
                        <span className="text-xs text-brand-muted uppercase font-bold tracking-wider">
                          Direct Collection Yard
                        </span>
                        <p className="text-sm font-bold text-brand-dark mt-0.5">
                          Doorstep or Yard Drop-off
                        </p>
                        <p className="text-xs text-brand-blue font-medium">
                          Instant weighing & payout
                        </p>
                      </div>
                      <Scale className="h-8 w-8 text-brand-blue/80" />
                    </div>
                  </div>

                  <div className="pt-2">
                    <Button asChild variant="outline" className="w-full justify-between">
                      <Link href="/rates">
                        <span>Check Today&apos;s Scrap Rates</span>
                        <ArrowRight className="h-4 w-4 text-brand-blue" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. TRUST STRIP (4 Pillars - App-grade 2x2 grid on mobile) */}
      <section className="bg-brand-surface py-4 sm:py-8 border-b border-brand-border">
        <div className="container px-4 sm:px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-6 md:gap-8">
            <div className="flex items-center gap-2.5 p-2.5 sm:p-0 rounded-xl bg-muted/60 sm:bg-transparent border sm:border-0 border-brand-border/60">
              <div className="h-8 w-8 sm:h-10 sm:w-10 shrink-0 rounded-lg sm:rounded-xl bg-brand-blue-light text-brand-blue flex items-center justify-center font-bold">
                <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5" />
              </div>
              <div className="min-w-0">
                <h3 className="font-bold text-xs sm:text-base text-brand-dark leading-tight truncate">
                  Fair Rates
                </h3>
                <p className="text-[10px] sm:text-xs text-brand-muted hidden sm:block mt-0.5">
                  Market-linked scrap rates.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 p-2.5 sm:p-0 rounded-xl bg-muted/60 sm:bg-transparent border sm:border-0 border-brand-border/60">
              <div className="h-8 w-8 sm:h-10 sm:w-10 shrink-0 rounded-lg sm:rounded-xl bg-brand-green-light text-brand-green flex items-center justify-center font-bold">
                <Scale className="h-4 w-4 sm:h-5 sm:w-5" />
              </div>
              <div className="min-w-0">
                <h3 className="font-bold text-xs sm:text-base text-brand-dark leading-tight truncate">
                  Accurate Weighing
                </h3>
                <p className="text-[10px] sm:text-xs text-brand-muted hidden sm:block mt-0.5">
                  Calibrated digital scales on the spot.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 p-2.5 sm:p-0 rounded-xl bg-muted/60 sm:bg-transparent border sm:border-0 border-brand-border/60">
              <div className="h-8 w-8 sm:h-10 sm:w-10 shrink-0 rounded-lg sm:rounded-xl bg-brand-green-light text-brand-green flex items-center justify-center font-bold">
                <Zap className="h-4 w-4 sm:h-5 sm:w-5" />
              </div>
              <div className="min-w-0">
                <h3 className="font-bold text-xs sm:text-base text-brand-dark leading-tight truncate">
                  Instant Payment
                </h3>
                <p className="text-[10px] sm:text-xs text-brand-muted hidden sm:block mt-0.5">
                  UPI or cash upon weighing.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 p-2.5 sm:p-0 rounded-xl bg-muted/60 sm:bg-transparent border sm:border-0 border-brand-border/60">
              <div className="h-8 w-8 sm:h-10 sm:w-10 shrink-0 rounded-lg sm:rounded-xl bg-brand-blue-light text-brand-blue flex items-center justify-center font-bold">
                <Calendar className="h-4 w-4 sm:h-5 sm:w-5" />
              </div>
              <div className="min-w-0">
                <h3 className="font-bold text-xs sm:text-base text-brand-dark leading-tight truncate">
                  7 Days a Week
                </h3>
                <p className="text-[10px] sm:text-xs text-brand-muted hidden sm:block mt-0.5">
                  8:00 AM to 10:00 PM daily.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. TODAY'S LIVE RATES PREVIEW (Amazon-style 2-column cards on phone) */}
      <section className="py-8 sm:py-16 md:py-20 bg-brand-surface border-b border-brand-border">
        <div className="container px-4 sm:px-6 space-y-6 sm:space-y-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-brand-blue-light text-brand-blue text-[11px] sm:text-xs font-bold">
                <TrendingUp className="h-3 w-3" />
                <span>Live Mumbai Scrap Rates</span>
              </div>
              <h2 className="text-xl sm:text-3xl font-extrabold text-brand-dark">
                Today&apos;s Rates Preview
              </h2>
              <p className="text-xs sm:text-sm text-brand-muted max-w-xl">
                Real-time benchmark scrap rates updated by our yard managers.
              </p>
            </div>

            <Button asChild variant="outline" size="sm" className="w-full sm:w-auto text-xs font-bold">
              <Link href="/rates">
                <span>View All Rates & Calculator</span>
                <ArrowRight className="h-3.5 w-3.5 ml-1.5 text-brand-blue" />
              </Link>
            </Button>
          </div>

          {/* Amazon-style 2-column product grid on mobile, 3-column on desktop */}
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-4">
            {previewItems.map((item) => (
              <div
                key={item.id}
                className="p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-brand-border bg-brand-bg/40 hover:bg-brand-surface hover:border-brand-blue hover:shadow-subtle transition-all duration-150 flex flex-col justify-between gap-2"
              >
                <div>
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="text-[10px] font-bold text-brand-blue uppercase tracking-wider truncate">
                      {item.category?.name || "Scrap"}
                    </span>
                    <span className="text-[10px] text-brand-muted uppercase font-semibold">
                      per {item.unit}
                    </span>
                  </div>
                  <h3 className="font-bold text-xs sm:text-sm text-brand-dark line-clamp-2 leading-tight">
                    {item.name}
                  </h3>
                </div>

                <div className="pt-2 border-t border-brand-border/60 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-brand-muted block">Live Rate</span>
                    <span className="font-extrabold text-xs sm:text-base text-brand-green">
                      {item.rate_per_unit > 0 ? (
                        formatCurrency(item.rate_per_unit)
                      ) : (
                        <span className="text-brand-blue text-xs font-bold">Market Rate</span>
                      )}
                    </span>
                  </div>

                  <Link
                    href={`/book?item=${item.id}`}
                    className="h-7 px-2 rounded-lg bg-brand-blue-light hover:bg-brand-blue hover:text-white text-brand-blue text-[11px] font-bold inline-flex items-center justify-center transition-colors shrink-0"
                    title={`Sell ${item.name}`}
                  >
                    Sell
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-[11px] sm:text-xs text-amber-900 dark:bg-amber-950/40 dark:border-amber-800/60 dark:text-amber-200 flex items-start gap-2 sm:gap-3">
            <HelpCircle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
            <span>
              <strong>Market Notice:</strong> Rates are indicative based on daily
              market trades in Mumbai. Final payout is calculated on certified digital
              scales at collection.
            </span>
          </div>
        </div>
      </section>

      {/* 4. SERVICES (Compact 2-column App Launcher style on mobile) */}
      <section className="py-8 sm:py-16 md:py-20 bg-brand-bg">
        <div className="container px-4 sm:px-6 space-y-6 sm:space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-1.5 sm:space-y-3">
            <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-brand-blue">
              What We Do
            </span>
            <h2 className="text-xl sm:text-3xl md:text-4xl font-extrabold text-brand-dark">
              Our Core Services
            </h2>
            <p className="text-xs sm:text-sm md:text-base text-brand-muted">
              Doorstep scrap collection and bulk commercial recycling in Mumbai.
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-6">
            {SITE_CONFIG.services.map((svc) => (
              <Card
                key={svc.id}
                className="hover:border-brand-blue transition-all duration-200 hover:shadow-card flex flex-col justify-between p-3.5 sm:p-6 rounded-xl sm:rounded-2xl"
              >
                <div>
                  <div className="h-9 w-9 rounded-lg bg-brand-blue-light text-brand-blue flex items-center justify-center mb-2.5 sm:mb-4">
                    {svc.id === "waste-collection" && <Trash2 className="h-4 w-4" />}
                    {svc.id === "scrap-trading" && <TrendingUp className="h-4 w-4" />}
                    {svc.id === "recycling" && <Recycle className="h-4 w-4" />}
                    {svc.id === "doorstep-pickup" && <Scale className="h-4 w-4" />}
                    {svc.id === "ewaste-and-electronics" && <Cpu className="h-4 w-4" />}
                    {svc.id === "bulk-commercial-scrap" && <Building2 className="h-4 w-4" />}
                    {svc.id === "demolition-dismantling" && <HardHat className="h-4 w-4" />}
                  </div>
                  <h3 className="text-xs sm:text-lg font-bold text-brand-dark leading-snug">
                    {svc.title}
                  </h3>
                  <p className="hidden sm:block pt-1.5 text-xs text-brand-muted line-clamp-2">
                    {svc.shortDescription}
                  </p>
                </div>

                <div className="pt-2 sm:pt-4">
                  <Link
                    href={`/services#${svc.id}`}
                    className="inline-flex items-center gap-1 text-[11px] sm:text-xs font-bold text-brand-blue hover:text-brand-blue-hover"
                  >
                    <span>Details</span>
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 5. WHAT WE ACCEPT (Amazon-style 3-column category grid on mobile) */}
      <section className="py-8 sm:py-16 bg-brand-surface border-y border-brand-border">
        <div className="container px-4 sm:px-6 space-y-6 sm:space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
            <div>
              <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-brand-blue">
                Scrap Categories
              </span>
              <h2 className="text-xl sm:text-3xl font-extrabold text-brand-dark mt-0.5">
                What We Accept
              </h2>
            </div>
            <Link
              href="/what-we-accept"
              className="text-xs font-bold text-brand-blue inline-flex items-center gap-1"
            >
              <span>View All 10 Categories</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-3.5">
            {SITE_CONFIG.acceptedCategories.map((cat) => {
              const IconComponent = categoryIcons[cat.id] || Anvil;
              return (
                <Link
                  key={cat.id}
                  href={`/what-we-accept#${cat.id}`}
                  className="group p-2.5 sm:p-4 rounded-xl border border-brand-border bg-brand-bg/40 hover:bg-brand-surface hover:border-brand-blue hover:shadow-card transition-all duration-150 text-center flex flex-col items-center justify-center gap-1.5"
                >
                  <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-lg bg-brand-blue-light group-hover:bg-brand-blue group-hover:text-white text-brand-blue transition-colors flex items-center justify-center">
                    <IconComponent className="h-4 w-4" />
                  </div>
                  <h3 className="font-bold text-[11px] sm:text-xs text-brand-dark group-hover:text-brand-blue transition-colors leading-tight line-clamp-1">
                    {cat.name}
                  </h3>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* 6. HOW IT WORKS (Compact 2x2 grid on mobile) */}
      <section className="py-8 sm:py-16 md:py-20 bg-brand-bg">
        <div className="container px-4 sm:px-6 space-y-6 sm:space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-1 sm:space-y-2">
            <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-brand-green">
              Simple 4-Step Process
            </span>
            <h2 className="text-xl sm:text-3xl md:text-4xl font-extrabold text-brand-dark">
              How It Works
            </h2>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-6">
            {SITE_CONFIG.howItWorks.map((step) => (
              <div
                key={step.step}
                className="rounded-xl sm:rounded-2xl border border-brand-border bg-brand-surface p-3.5 sm:p-6 shadow-subtle flex flex-col justify-between"
              >
                <div className="space-y-2 sm:space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xl sm:text-3xl font-black text-brand-blue/30 font-mono">
                      {step.step}
                    </span>
                    <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-lg sm:rounded-xl bg-brand-blue-light text-brand-blue flex items-center justify-center">
                      {step.step === "01" && <Calendar className="h-4 w-4 sm:h-5 sm:w-5" />}
                      {step.step === "02" && <Scale className="h-4 w-4 sm:h-5 sm:w-5" />}
                      {step.step === "03" && <Wallet className="h-4 w-4 sm:h-5 sm:w-5" />}
                      {step.step === "04" && <Recycle className="h-4 w-4 sm:h-5 sm:w-5" />}
                    </div>
                  </div>
                  <h3 className="text-xs sm:text-base font-bold text-brand-dark leading-tight">
                    {step.title}
                  </h3>
                  <p className="text-[11px] sm:text-xs text-brand-muted leading-relaxed line-clamp-3 sm:line-clamp-none">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. CTA BANNER */}
      <section className="py-10 sm:py-16 bg-brand-blue text-white relative overflow-hidden">
        <div className="container px-4 sm:px-6 relative z-10 text-center space-y-4 sm:space-y-6 max-w-3xl mx-auto">
          <Badge variant="secondary" className="px-3 py-0.5 font-bold text-[10px] sm:text-xs uppercase tracking-wider">
            Clear Your Scrap Today
          </Badge>
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Schedule Free Doorstep Pickup in Mumbai
          </h2>
          <p className="text-xs sm:text-base text-white/90 leading-relaxed max-w-xl mx-auto">
            Accurate weighing on digital scales. Instant payment via UPI or cash.
            Operating 7 days a week, 8:00 AM to 10:00 PM.
          </p>
          <div className="flex flex-row items-center justify-center gap-2.5 sm:gap-4 pt-1 sm:pt-2">
            <Button asChild size="default" variant="secondary" className="flex-1 sm:flex-initial h-11 sm:h-12 font-bold shadow-elevated text-xs sm:text-sm">
              <Link href="/book">
                <CalendarCheck className="h-4 w-4 mr-1.5" />
                <span>Book Doorstep Pickup</span>
              </Link>
            </Button>
            <Button
              asChild
              size="default"
              variant="outline"
              className="flex-1 sm:flex-initial h-11 sm:h-12 font-bold bg-white/10 hover:bg-white/20 text-white border-white/30 text-xs sm:text-sm"
            >
              <a
                href={`https://wa.me/${SITE_CONFIG.contact.whatsappRaw}?text=${encodeURIComponent(
                  SITE_CONFIG.contact.whatsappMessage
                )}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle className="h-4 w-4 mr-1.5 text-brand-green" />
                <span>WhatsApp</span>
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* 8. FAQ PREVIEW */}
      <section className="py-8 sm:py-16 md:py-20 bg-brand-bg">
        <div className="container px-4 sm:px-6 max-w-4xl space-y-6 sm:space-y-10">
          <div className="text-center space-y-1.5">
            <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-brand-blue">
              Questions & Answers
            </span>
            <h2 className="text-xl sm:text-3xl font-extrabold text-brand-dark">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-2.5 sm:space-y-4">
            {SITE_CONFIG.faqs.slice(0, 4).map((faq, i) => (
              <div
                key={i}
                className="rounded-xl border border-brand-border bg-brand-surface p-3.5 sm:p-5 shadow-subtle space-y-1.5"
              >
                <h3 className="font-bold text-xs sm:text-base text-brand-dark flex items-start gap-2">
                  <span className="text-brand-blue font-mono font-bold shrink-0">Q:</span>
                  <span>{faq.question}</span>
                </h3>
                <p className="text-xs sm:text-sm text-brand-muted pl-4 sm:pl-6 leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>

          <div className="text-center pt-1">
            <Button asChild variant="outline" size="sm" className="text-xs font-bold">
              <Link href="/faq">
                <span>View All FAQs</span>
                <ArrowRight className="h-3.5 w-3.5 ml-1.5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
