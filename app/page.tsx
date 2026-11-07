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
  Hammer,
  HelpCircle,
  FileCheck,
} from "lucide-react";
import { SITE_CONFIG } from "@/lib/site-config";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function HomePage() {
  // Top 6 preview scrap items (from live rates schema, fallback to indicative preview)
  const previewRates = [
    { item: "Copper Scrap (Armature/Wire)", category: "Copper", unit: "kg", rate: "Market Linked" },
    { item: "Brass Honey & Utensils", category: "Brass", unit: "kg", rate: "Market Linked" },
    { item: "Aluminium Cans & Utensils", category: "Aluminium", unit: "kg", rate: "Market Linked" },
    { item: "Heavy Melting Steel (Iron)", category: "Iron & Steel", unit: "kg", rate: "Market Linked" },
    { item: "Corrugated Cardboard (Cartons)", category: "Paper", unit: "kg", rate: "Market Linked" },
    { item: "Computer & Server E-Waste", category: "E-Waste", unit: "kg/piece", rate: "Market Linked" },
  ];

  return (
    <div className="flex flex-col w-full">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-brand-blue-light/50 via-white to-brand-bg py-16 md:py-24 border-b border-brand-border">
        <div className="container relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Headline & Value Proposition */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-green-light border border-brand-green/30 text-xs md:text-sm font-semibold text-brand-green">
                <Recycle className="h-4 w-4 animate-spin-slow" />
                <span>MIDC Andheri East, Mumbai • Certified Waste & Scrap Trading</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-brand-dark leading-[1.15]">
                Turn Your Scrap <br className="hidden sm:inline" />
                <span className="text-brand-blue">Into Value</span>
              </h1>

              <p className="text-base sm:text-lg text-brand-muted max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                Reflection Scrap Solutions LLP delivers trusted scrap trading,
                doorstep collection, calibrated digital weighing, and instant
                on-the-spot payment across Mumbai.
              </p>

              {/* Primary Actions */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
                <Button asChild size="xl" variant="default" className="w-full sm:w-auto gap-2.5 shadow-card font-bold">
                  <Link href="/book">
                    <CalendarCheck className="h-5 w-5" />
                    <span>Book a Pickup</span>
                  </Link>
                </Button>

                <Button
                  asChild
                  size="xl"
                  variant="outlineGreen"
                  className="w-full sm:w-auto gap-2.5 font-bold"
                >
                  <a
                    href={`https://wa.me/${SITE_CONFIG.contact.whatsappRaw}?text=${encodeURIComponent(
                      SITE_CONFIG.contact.whatsappMessage
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <MessageCircle className="h-5 w-5 text-brand-green" />
                    <span>WhatsApp Us</span>
                  </a>
                </Button>
              </div>

              {/* Service Details Snippet */}
              <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-y-2 gap-x-6 text-xs text-brand-muted">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-brand-green" />
                  <span>On-the-spot weighing & payment</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4 text-brand-blue" />
                  <span>Mon - Sun: 8 AM to 10 PM</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <FileCheck className="h-4 w-4 text-brand-muted" />
                  <span>LLPIN ACY-4261</span>
                </span>
              </div>
            </div>

            {/* Right Column: Visual Card Showcase */}
            <div className="lg:col-span-5">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* Visual Glass Card */}
                <div className="relative rounded-3xl border border-brand-border bg-white p-6 md:p-8 shadow-elevated">
                  <div className="flex items-center justify-between pb-6 border-b border-brand-border">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-2xl bg-brand-blue-light p-2 flex items-center justify-center border border-brand-blue/20">
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

      {/* 2. TRUST STRIP (4 Pillars) */}
      <section className="bg-white py-8 border-b border-brand-border">
        <div className="container">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            <div className="flex items-start gap-3.5">
              <div className="h-10 w-10 shrink-0 rounded-xl bg-brand-blue-light text-brand-blue flex items-center justify-center font-bold">
                <TrendingUp className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm md:text-base text-brand-dark">
                  Fair Rates
                </h3>
                <p className="text-xs text-brand-muted mt-0.5">
                  Regularly updated, market-linked scrap rates.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="h-10 w-10 shrink-0 rounded-xl bg-brand-green-light text-brand-green flex items-center justify-center font-bold">
                <Scale className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm md:text-base text-brand-dark">
                  Accurate Weighing
                </h3>
                <p className="text-xs text-brand-muted mt-0.5">
                  Calibrated digital scales on the spot.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="h-10 w-10 shrink-0 rounded-xl bg-brand-green-light text-brand-green flex items-center justify-center font-bold">
                <Zap className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm md:text-base text-brand-dark">
                  On-the-spot Payment
                </h3>
                <p className="text-xs text-brand-muted mt-0.5">
                  Instant UPI transfer or cash upon weighing.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="h-10 w-10 shrink-0 rounded-xl bg-brand-blue-light text-brand-blue flex items-center justify-center font-bold">
                <Calendar className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm md:text-base text-brand-dark">
                  7 Days a Week
                </h3>
                <p className="text-xs text-brand-muted mt-0.5">
                  Open 8:00 AM to 10:00 PM every day.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. SERVICES PREVIEW */}
      <section className="py-16 md:py-20 bg-brand-bg">
        <div className="container space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-blue">
              What We Do
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-brand-dark">
              Our Core Services
            </h2>
            <p className="text-sm md:text-base text-brand-muted">
              From residential doorstep pickups to large-scale industrial scrap
              contracts in Mumbai, we handle the entire recycling chain.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SITE_CONFIG.services.map((svc) => (
              <Card key={svc.id} className="hover:border-brand-blue transition-all duration-200 hover:shadow-card flex flex-col justify-between">
                <CardHeader>
                  <div className="h-12 w-12 rounded-xl bg-brand-blue-light text-brand-blue flex items-center justify-center mb-4">
                    {svc.id === "waste-collection" && <Trash2 className="h-6 w-6" />}
                    {svc.id === "scrap-trading" && <TrendingUp className="h-6 w-6" />}
                    {svc.id === "recycling" && <Recycle className="h-6 w-6" />}
                    {svc.id === "doorstep-pickup" && <Scale className="h-6 w-6" />}
                    {svc.id === "ewaste-and-electronics" && <Cpu className="h-6 w-6" />}
                    {svc.id === "bulk-commercial-scrap" && <Building2 className="h-6 w-6" />}
                  </div>
                  <CardTitle className="text-xl font-bold">{svc.title}</CardTitle>
                  <CardDescription className="pt-2 text-sm text-brand-muted">
                    {svc.shortDescription}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <Link
                    href={`/services#${svc.id}`}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-blue hover:text-brand-blue-hover"
                  >
                    <span>Learn more</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center pt-2">
            <Button asChild variant="outline" size="lg">
              <Link href="/services">
                <span>View Full Service Details</span>
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* 4. TODAY'S RATES PREVIEW */}
      <section className="py-16 md:py-20 bg-white border-y border-brand-border">
        <div className="container space-y-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-blue-light text-brand-blue text-xs font-bold">
                <TrendingUp className="h-3.5 w-3.5" />
                <span>Transparent Scrap Pricing</span>
              </div>
              <h2 className="text-3xl font-extrabold text-brand-dark">
                Today&apos;s Rates Preview
              </h2>
              <p className="text-sm text-brand-muted max-w-xl">
                Rates are indicative and managed via our live rates database.
                Visit our rates page to view all categories or use our scrap
                value calculator.
              </p>
            </div>

            <Button asChild variant="default" size="default">
              <Link href="/rates">
                <span>View Full Rates Table & Calculator</span>
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {previewRates.map((rate, i) => (
              <div
                key={i}
                className="p-5 rounded-xl border border-brand-border bg-brand-bg/50 hover:bg-white hover:border-brand-blue transition-all duration-150 flex items-center justify-between"
              >
                <div>
                  <span className="text-[11px] font-bold text-brand-blue uppercase tracking-wider">
                    {rate.category}
                  </span>
                  <h3 className="font-bold text-sm text-brand-dark mt-0.5">
                    {rate.item}
                  </h3>
                  <span className="text-xs text-brand-muted">Unit: {rate.unit}</span>
                </div>
                <div className="text-right">
                  <Badge variant="blue" className="font-semibold text-xs">
                    {rate.rate}
                  </Badge>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-center gap-3">
            <HelpCircle className="h-5 w-5 text-amber-600 shrink-0" />
            <span>
              <strong>Note:</strong> Rates are indicative and may change with
              market prices. Final payment is based on live rates at the time of
              weighing.
            </span>
          </div>
        </div>
      </section>

      {/* 5. HOW IT WORKS (4 STEPS) */}
      <section className="py-16 md:py-20 bg-brand-bg">
        <div className="container space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-green">
              Simple 4-Step Process
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-brand-dark">
              How It Works
            </h2>
            <p className="text-sm md:text-base text-brand-muted">
              We have eliminated the uncertainty from scrap selling with digital
              precision, certified scales, and prompt payment.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {SITE_CONFIG.howItWorks.map((step) => (
              <div
                key={step.step}
                className="relative rounded-2xl border border-brand-border bg-white p-6 shadow-subtle flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-3xl font-black text-brand-blue/30 font-mono">
                      {step.step}
                    </span>
                    <div className="h-10 w-10 rounded-xl bg-brand-blue-light text-brand-blue flex items-center justify-center">
                      {step.step === "01" && <Calendar className="h-5 w-5" />}
                      {step.step === "02" && <Scale className="h-5 w-5" />}
                      {step.step === "03" && <Wallet className="h-5 w-5" />}
                      {step.step === "04" && <Recycle className="h-5 w-5" />}
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-brand-dark">
                    {step.title}
                  </h3>
                  <p className="text-xs md:text-sm text-brand-muted leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. WHAT WE ACCEPT PREVIEW */}
      <section className="py-16 bg-white border-b border-brand-border">
        <div className="container space-y-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-brand-blue">
                Scrap Categories
              </span>
              <h2 className="text-3xl font-extrabold text-brand-dark mt-1">
                What We Accept
              </h2>
              <p className="text-sm text-brand-muted max-w-xl">
                We accept residential, commercial, and industrial scrap items
                across all key material categories in Mumbai.
              </p>
            </div>
            <Button asChild variant="outline">
              <Link href="/what-we-accept">
                <span>View All 10 Categories</span>
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {SITE_CONFIG.acceptedCategories.map((cat) => (
              <Link
                key={cat.id}
                href={`/what-we-accept#${cat.id}`}
                className="group p-4 rounded-xl border border-brand-border bg-brand-bg/40 hover:bg-white hover:border-brand-blue hover:shadow-card transition-all duration-200 text-center flex flex-col items-center"
              >
                <div className="h-12 w-12 rounded-xl bg-brand-blue-light group-hover:bg-brand-blue group-hover:text-white text-brand-blue transition-colors flex items-center justify-center mb-3">
                  <Hammer className="h-5 w-5" />
                </div>
                <h3 className="font-bold text-sm text-brand-dark group-hover:text-brand-blue transition-colors">
                  {cat.name}
                </h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 7. CTA BANNER */}
      <section className="py-16 bg-brand-blue text-white relative overflow-hidden">
        <div className="container relative z-10 text-center space-y-6 max-w-3xl mx-auto">
          <Badge variant="secondary" className="px-4 py-1 font-bold text-xs uppercase tracking-wider">
            Ready to Clear Your Scrap?
          </Badge>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white">
            Schedule Your Free Doorstep Pickup in Mumbai
          </h2>
          <p className="text-base text-white/90 leading-relaxed max-w-xl mx-auto">
            Accurate weighing on digital scales. Instant payment via UPI or cash.
            Operating 7 days a week, 8:00 AM to 10:00 PM.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Button asChild size="xl" variant="secondary" className="w-full sm:w-auto font-bold shadow-elevated">
              <Link href="/book">
                <CalendarCheck className="h-5 w-5 mr-2" />
                <span>Book a Doorstep Pickup</span>
              </Link>
            </Button>
            <Button
              asChild
              size="xl"
              variant="outline"
              className="w-full sm:w-auto font-bold bg-white/10 hover:bg-white/20 text-white border-white/30"
            >
              <a
                href={`https://wa.me/${SITE_CONFIG.contact.whatsappRaw}?text=${encodeURIComponent(
                  SITE_CONFIG.contact.whatsappMessage
                )}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle className="h-5 w-5 mr-2 text-brand-green" />
                <span>WhatsApp Us</span>
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* 8. FAQ PREVIEW */}
      <section className="py-16 md:py-20 bg-brand-bg">
        <div className="container max-w-4xl space-y-10">
          <div className="text-center space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-blue">
              Questions & Answers
            </span>
            <h2 className="text-3xl font-extrabold text-brand-dark">
              Frequently Asked Questions
            </h2>
            <p className="text-sm text-brand-muted">
              Common questions about scrap collection, weighing, and payments in
              Mumbai.
            </p>
          </div>

          <div className="space-y-4">
            {SITE_CONFIG.faqs.slice(0, 4).map((faq, i) => (
              <div
                key={i}
                className="rounded-xl border border-brand-border bg-white p-6 shadow-subtle space-y-2"
              >
                <h3 className="font-bold text-base text-brand-dark flex items-start gap-2.5">
                  <span className="text-brand-blue font-mono font-bold">Q:</span>
                  <span>{faq.question}</span>
                </h3>
                <p className="text-sm text-brand-muted pl-6 leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>

          <div className="text-center pt-2">
            <Button asChild variant="outline">
              <Link href="/faq">
                <span>View All FAQs</span>
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
