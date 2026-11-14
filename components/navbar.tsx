"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  Phone,
  CalendarCheck,
  User,
  LogOut,
  LayoutDashboard,
  ShieldAlert,
  ChevronDown,
  Images,
  BookOpen,
  Info,
} from "lucide-react";
import { SITE_CONFIG } from "@/lib/site-config";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";

interface NavbarProps {
  user?: {
    email?: string;
    full_name?: string;
    role?: "customer" | "admin";
  } | null;
}

const MORE_NAV_ITEMS = [
  {
    name: "Work Gallery",
    href: "/gallery",
    description: "Photos of yard operations, scrap sorting & demolition",
    icon: Images,
  },
  {
    name: "Market Trends Blog",
    href: "/blog",
    description: "Mumbai scrap price insights & circular economy",
    icon: BookOpen,
  },
  {
    name: "About Us",
    href: "/about",
    description: "Company profile, MIDC yard facility & team",
    icon: Info,
  },
];

export function Navbar({ user: initialUser }: NavbarProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = React.useState(false);
  const [activeDropdown, setActiveDropdown] = React.useState<"residential" | "commercial" | "more" | null>(null);
  const [mobileResidentialOpen, setMobileResidentialOpen] = React.useState(false);
  const [mobileCommercialOpen, setMobileCommercialOpen] = React.useState(false);
  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null);
  const pathname = usePathname();

  // Scroll detection for sticky shadow & subtle padding shift
  React.useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 15);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile drawer and dropdowns on route change
  React.useEffect(() => {
    setIsOpen(false);
    setUserDropdownOpen(false);
    setActiveDropdown(null);
  }, [pathname]);

  // Close dropdowns on Escape key
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setActiveDropdown(null);
        setUserDropdownOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleDropdownEnter = (type: "residential" | "commercial" | "more") => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setActiveDropdown(type);
  };

  const handleDropdownLeave = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 180);
  };

  const flatResidentialItems = React.useMemo(
    () => SITE_CONFIG.residentialScrapNav.flat(),
    []
  );

  const isMoreActive = MORE_NAV_ITEMS.some((item) => pathname.startsWith(item.href));

  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full transition-all duration-200 border-b",
        scrolled
          ? "glass-nav border-brand-border/90 shadow-subtle py-2"
          : "bg-brand-surface/95 backdrop-blur-md border-brand-border py-2 sm:py-2.5"
      )}
    >
      <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-3 lg:gap-4">
        {/* LEFT GROUP: Logo + Desktop Navigation together (No awkward empty gap) */}
        <div className="flex items-center gap-3 xl:gap-5 min-w-0">
          {/* Brand Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 xl:gap-2.5 shrink-0 group focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue rounded-xl"
          >
            <div className="relative h-9 w-9 sm:h-10 sm:w-10 shrink-0 overflow-hidden rounded-xl border border-brand-border bg-white shadow-sm flex items-center justify-center p-1.5 transition-transform group-hover:scale-105">
              <Image
                src="/logo-icon.png"
                alt="Reflection Scrap Solutions LLP Logo"
                width={36}
                height={36}
                priority
                className="h-full w-full object-contain"
              />
            </div>
            <div className="flex flex-col text-left">
              <span className="font-extrabold text-sm sm:text-base leading-none tracking-tight text-brand-dark whitespace-nowrap">
                Reflection <span className="text-brand-blue">Scrap</span>
              </span>
              <span className="text-[9px] sm:text-[10px] font-bold tracking-wider uppercase text-brand-green mt-0.5 sm:mt-1 whitespace-nowrap">
                Solutions LLP
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links (Cleanly spaced and vertically aligned) */}
          <nav className="hidden lg:flex items-center gap-0.5 xl:gap-1">
            {/* Home */}
            <Link
              href="/"
              className={cn(
                "h-9 px-2 xl:px-2.5 rounded-lg text-xs xl:text-[13px] font-semibold transition-all duration-150 inline-flex items-center whitespace-nowrap",
                pathname === "/"
                  ? "text-brand-blue bg-brand-blue-light font-bold"
                  : "text-brand-dark/80 hover:text-brand-blue hover:bg-muted/80"
              )}
            >
              Home
            </Link>

            {/* Residential Scrap Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => handleDropdownEnter("residential")}
              onMouseLeave={handleDropdownLeave}
            >
              <button
                type="button"
                onClick={() =>
                  setActiveDropdown(activeDropdown === "residential" ? null : "residential")
                }
                aria-expanded={activeDropdown === "residential"}
                aria-haspopup="true"
                className={cn(
                  "h-9 px-2 xl:px-2.5 rounded-lg text-xs xl:text-[13px] font-semibold transition-all duration-150 inline-flex items-center gap-1 whitespace-nowrap cursor-pointer",
                  activeDropdown === "residential"
                    ? "text-brand-green font-bold bg-brand-green-light/40"
                    : "text-brand-dark/85 hover:text-brand-green hover:bg-muted/80"
                )}
              >
                <span>Residential Scrap</span>
                <ChevronDown
                  className={cn(
                    "h-3 w-3 xl:h-3.5 xl:w-3.5 transition-transform duration-200",
                    activeDropdown === "residential"
                      ? "rotate-180 text-brand-green"
                      : "text-brand-muted"
                  )}
                />
              </button>

              {/* Residential Dropdown Card */}
              {activeDropdown === "residential" && (
                <div
                  className="absolute top-full left-0 mt-1.5 w-[560px] xl:w-[600px] rounded-2xl border border-brand-border bg-white dark:bg-[#181F24] p-5 xl:p-6 shadow-2xl z-50 animate-in fade-in-0 zoom-in-95 duration-150"
                  onMouseEnter={() => handleDropdownEnter("residential")}
                  onMouseLeave={handleDropdownLeave}
                >
                  <div className="grid grid-cols-3 gap-x-6 gap-y-3">
                    {SITE_CONFIG.residentialScrapNav.map((col, colIdx) => (
                      <div key={colIdx} className="flex flex-col space-y-2">
                        {col.map((item) => (
                          <Link
                            key={item.name}
                            href={item.href}
                            onClick={() => setActiveDropdown(null)}
                            className="flex items-center gap-2 text-xs xl:text-[13px] font-medium text-gray-700 dark:text-gray-200 hover:text-brand-green transition-all py-1 group hover:translate-x-0.5"
                          >
                            <svg
                              className="h-2 w-2 text-brand-green shrink-0 fill-current group-hover:scale-125 transition-transform"
                              viewBox="0 0 24 24"
                            >
                              <path d="M8 5v14l11-7z" />
                            </svg>
                            <span className="truncate">{item.name}</span>
                          </Link>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Commercial E-Waste Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => handleDropdownEnter("commercial")}
              onMouseLeave={handleDropdownLeave}
            >
              <button
                type="button"
                onClick={() =>
                  setActiveDropdown(activeDropdown === "commercial" ? null : "commercial")
                }
                aria-expanded={activeDropdown === "commercial"}
                aria-haspopup="true"
                className={cn(
                  "h-9 px-2 xl:px-2.5 rounded-lg text-xs xl:text-[13px] font-semibold transition-all duration-150 inline-flex items-center gap-1 whitespace-nowrap cursor-pointer",
                  activeDropdown === "commercial"
                    ? "text-brand-green font-bold bg-brand-green-light/40"
                    : "text-brand-dark/85 hover:text-brand-green hover:bg-muted/80"
                )}
              >
                <span>Commercial E-Waste</span>
                <ChevronDown
                  className={cn(
                    "h-3 w-3 xl:h-3.5 xl:w-3.5 transition-transform duration-200",
                    activeDropdown === "commercial"
                      ? "rotate-180 text-brand-green"
                      : "text-brand-muted"
                  )}
                />
              </button>

              {/* Commercial Dropdown Card */}
              {activeDropdown === "commercial" && (
                <div
                  className="absolute top-full left-0 mt-1.5 w-[360px] xl:w-[380px] rounded-2xl border border-brand-border bg-white dark:bg-[#181F24] p-4 xl:p-5 shadow-2xl z-50 animate-in fade-in-0 zoom-in-95 duration-150"
                  onMouseEnter={() => handleDropdownEnter("commercial")}
                  onMouseLeave={handleDropdownLeave}
                >
                  <div className="flex flex-col space-y-1.5">
                    {SITE_CONFIG.commercialEwasteNav.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        onClick={() => setActiveDropdown(null)}
                        className="flex items-center gap-2.5 text-xs xl:text-[13px] font-medium text-gray-700 dark:text-gray-200 hover:text-brand-green transition-all py-2 px-2.5 rounded-xl hover:bg-brand-green-light/40 group hover:translate-x-0.5"
                      >
                        <svg
                          className="h-2.5 w-2.5 text-brand-green shrink-0 fill-current group-hover:scale-125 transition-transform"
                          viewBox="0 0 24 24"
                        >
                          <path d="M8 5v14l11-7z" />
                        </svg>
                        <span className="leading-snug">{item.name}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Services */}
            <Link
              href="/services"
              className={cn(
                "h-9 px-2 xl:px-2.5 rounded-lg text-xs xl:text-[13px] font-semibold transition-all duration-150 inline-flex items-center whitespace-nowrap",
                pathname.startsWith("/services")
                  ? "text-brand-blue bg-brand-blue-light font-bold"
                  : "text-brand-dark/80 hover:text-brand-blue hover:bg-muted/80"
              )}
            >
              Services
            </Link>

            {/* Rates */}
            <Link
              href="/rates"
              className={cn(
                "h-9 px-2 xl:px-2.5 rounded-lg text-xs xl:text-[13px] font-semibold transition-all duration-150 inline-flex items-center whitespace-nowrap",
                pathname.startsWith("/rates")
                  ? "text-brand-blue bg-brand-blue-light font-bold"
                  : "text-brand-dark/80 hover:text-brand-blue hover:bg-muted/80"
              )}
            >
              Rates
            </Link>

            {/* Accept */}
            <Link
              href="/what-we-accept"
              className={cn(
                "h-9 px-2 xl:px-2.5 rounded-lg text-xs xl:text-[13px] font-semibold transition-all duration-150 inline-flex items-center whitespace-nowrap",
                pathname.startsWith("/what-we-accept")
                  ? "text-brand-blue bg-brand-blue-light font-bold"
                  : "text-brand-dark/80 hover:text-brand-blue hover:bg-muted/80"
              )}
            >
              Accept
            </Link>

            {/* More Dropdown (Gallery, Blog, About) */}
            <div
              className="relative"
              onMouseEnter={() => handleDropdownEnter("more")}
              onMouseLeave={handleDropdownLeave}
            >
              <button
                type="button"
                onClick={() =>
                  setActiveDropdown(activeDropdown === "more" ? null : "more")
                }
                aria-expanded={activeDropdown === "more"}
                aria-haspopup="true"
                className={cn(
                  "h-9 px-2 xl:px-2.5 rounded-lg text-xs xl:text-[13px] font-semibold transition-all duration-150 inline-flex items-center gap-1 whitespace-nowrap cursor-pointer",
                  activeDropdown === "more" || isMoreActive
                    ? "text-brand-blue bg-brand-blue-light font-bold"
                    : "text-brand-dark/80 hover:text-brand-blue hover:bg-muted/80"
                )}
              >
                <span>More</span>
                <ChevronDown
                  className={cn(
                    "h-3 w-3 xl:h-3.5 xl:w-3.5 transition-transform duration-200",
                    activeDropdown === "more"
                      ? "rotate-180 text-brand-blue"
                      : "text-brand-muted"
                  )}
                />
              </button>

              {/* More Dropdown Card */}
              {activeDropdown === "more" && (
                <div
                  className="absolute top-full left-0 mt-1.5 w-64 xl:w-72 rounded-2xl border border-brand-border bg-white dark:bg-[#181F24] p-2.5 shadow-2xl z-50 animate-in fade-in-0 zoom-in-95 duration-150"
                  onMouseEnter={() => handleDropdownEnter("more")}
                  onMouseLeave={handleDropdownLeave}
                >
                  <div className="flex flex-col space-y-1">
                    {MORE_NAV_ITEMS.map((item) => {
                      const Icon = item.icon;
                      const isActive = pathname.startsWith(item.href);
                      return (
                        <Link
                          key={item.name}
                          href={item.href}
                          onClick={() => setActiveDropdown(null)}
                          className={cn(
                            "flex items-start gap-2.5 p-2 rounded-xl transition-colors group",
                            isActive
                              ? "bg-brand-blue-light text-brand-blue"
                              : "hover:bg-muted/70 text-brand-dark"
                          )}
                        >
                          <div className="h-7 w-7 rounded-lg bg-brand-blue-light text-brand-blue flex items-center justify-center shrink-0 mt-0.5 group-hover:scale-105 transition-transform">
                            <Icon className="h-3.5 w-3.5" />
                          </div>
                          <div>
                            <p className="text-xs font-bold leading-tight group-hover:text-brand-blue transition-colors">
                              {item.name}
                            </p>
                            <p className="text-[11px] text-brand-muted leading-tight mt-0.5 line-clamp-1">
                              {item.description}
                            </p>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Contact */}
            <Link
              href="/contact"
              className={cn(
                "h-9 px-2 xl:px-2.5 rounded-lg text-xs xl:text-[13px] font-semibold transition-all duration-150 inline-flex items-center whitespace-nowrap",
                pathname.startsWith("/contact")
                  ? "text-brand-blue bg-brand-blue-light font-bold"
                  : "text-brand-dark/80 hover:text-brand-blue hover:bg-muted/80"
              )}
            >
              Contact
            </Link>
          </nav>
        </div>

        {/* RIGHT GROUP: Actions (Theme, Call, Book Pickup, User) - Firmly aligned without cut-off */}
        <div className="hidden lg:flex items-center gap-2 xl:gap-2.5 shrink-0">
          <ThemeToggle />

          {/* Quick Call */}
          <a
            href={`tel:${SITE_CONFIG.contact.phoneRaw}`}
            className="h-9 px-2.5 rounded-lg border border-brand-border bg-brand-bg/60 text-brand-dark hover:border-brand-blue hover:bg-brand-blue-light transition-colors text-xs font-bold inline-flex items-center gap-1.5"
            title={`Quick Call: ${SITE_CONFIG.contact.phone} / ${SITE_CONFIG.contact.phoneSecondary} / ${SITE_CONFIG.contact.phoneTertiary}`}
          >
            <div className="h-5 w-5 rounded-full bg-brand-blue-light text-brand-blue flex items-center justify-center shrink-0">
              <Phone className="h-3 w-3" />
            </div>
            <span className="hidden 2xl:inline text-xs font-bold whitespace-nowrap">
              {SITE_CONFIG.contact.phone}
            </span>
          </a>

          {/* Book Pickup CTA */}
          <Button
            asChild
            size="sm"
            variant="secondary"
            className="h-9 px-3.5 gap-1.5 font-bold shadow-sm text-xs shrink-0"
          >
            <Link href="/book">
              <CalendarCheck className="h-3.5 w-3.5" />
              <span>Book Pickup</span>
            </Link>
          </Button>

          {/* User Profile Menu or Login Button */}
          {initialUser ? (
            <div className="relative shrink-0">
              <button
                type="button"
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="h-9 px-2.5 rounded-lg border border-brand-border bg-brand-surface hover:bg-muted/70 focus:outline-none focus:ring-2 focus:ring-brand-blue transition-colors cursor-pointer inline-flex items-center gap-2"
              >
                <div className="h-6 w-6 rounded-md bg-brand-blue text-white flex items-center justify-center font-bold text-[11px] uppercase shadow-sm shrink-0">
                  {initialUser.full_name
                    ? initialUser.full_name[0]
                    : initialUser.email
                    ? initialUser.email[0]
                    : "U"}
                </div>
                <span className="text-xs font-bold text-brand-dark max-w-[80px] xl:max-w-[100px] truncate">
                  {initialUser.full_name?.split(" ")[0] || initialUser.email?.split("@")[0]}
                </span>
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-52 rounded-2xl border border-brand-border bg-brand-surface p-2 shadow-elevated z-50 animate-in fade-in-0 zoom-in-95 duration-150">
                  <div className="px-3 py-2 border-b border-brand-border/60">
                    <p className="text-xs font-bold text-brand-dark truncate">
                      {initialUser.full_name || "My Account"}
                    </p>
                    <p className="text-[11px] text-brand-muted truncate">
                      {initialUser.email}
                    </p>
                  </div>
                  <div className="py-1">
                    <Link
                      href="/dashboard"
                      className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-brand-dark rounded-lg hover:bg-brand-blue-light hover:text-brand-blue"
                      onClick={() => setUserDropdownOpen(false)}
                    >
                      <LayoutDashboard className="h-3.5 w-3.5" />
                      <span>My Dashboard</span>
                    </Link>
                    {initialUser.role === "admin" && (
                      <Link
                        href="/admin"
                        className="flex items-center gap-2 px-3 py-2 text-xs font-bold text-amber-700 rounded-lg hover:bg-amber-50"
                        onClick={() => setUserDropdownOpen(false)}
                      >
                        <ShieldAlert className="h-3.5 w-3.5" />
                        <span>Admin Panel</span>
                      </Link>
                    )}
                  </div>
                  <div className="pt-1 border-t border-brand-border/60">
                    <form action="/auth/signout" method="post">
                      <button
                        type="submit"
                        className="flex w-full items-center gap-2 px-3 py-2 text-xs font-semibold text-red-600 rounded-lg hover:bg-red-50 text-left cursor-pointer"
                      >
                        <LogOut className="h-3.5 w-3.5" />
                        <span>Sign Out</span>
                      </button>
                    </form>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Button
              asChild
              size="sm"
              variant="outline"
              className="h-9 px-3 xl:px-3.5 gap-1.5 font-bold text-brand-dark border-brand-border hover:border-brand-blue hover:text-brand-blue text-xs shrink-0"
            >
              <Link href="/login">
                <User className="h-3.5 w-3.5 text-brand-blue" />
                <span>Login</span>
              </Link>
            </Button>
          )}
        </div>

        {/* MOBILE CONTROLS (Right side on mobile) */}
        <div className="flex items-center gap-1.5 sm:gap-2 lg:hidden shrink-0">
          <ThemeToggle />

          <Button asChild size="sm" variant="secondary" className="h-8 sm:h-9 px-2.5 sm:px-3 gap-1 text-[11px] sm:text-xs font-bold shadow-sm">
            <Link href="/book">
              <CalendarCheck className="h-3.5 w-3.5" />
              <span>Book</span>
            </Link>
          </Button>

          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="h-8 w-8 sm:h-9 sm:w-9 flex items-center justify-center rounded-lg border border-brand-border bg-brand-surface text-brand-dark hover:bg-muted/80 focus:outline-none focus:ring-2 focus:ring-brand-blue cursor-pointer"
            aria-label="Toggle navigation menu"
            aria-expanded={isOpen}
          >
            {isOpen ? <X className="h-4 w-4 sm:h-5 sm:w-5" /> : <Menu className="h-4 w-4 sm:h-5 sm:w-5" />}
          </button>
        </div>
      </div>

      {/* MOBILE DRAWER */}
      {isOpen && (
        <div className="lg:hidden fixed inset-x-0 top-full bg-brand-surface border-b border-brand-border shadow-elevated animate-in slide-in-from-top-2 duration-200 max-h-[82vh] overflow-y-auto">
          <div className="container py-4 flex flex-col space-y-2">
            {/* Home */}
            <Link
              href="/"
              className={cn(
                "px-4 py-2.5 rounded-xl text-sm font-semibold flex items-center justify-between",
                pathname === "/"
                  ? "text-brand-blue bg-brand-blue-light font-bold"
                  : "text-brand-dark hover:bg-muted/70"
              )}
              onClick={() => setIsOpen(false)}
            >
              <span>Home</span>
            </Link>

            {/* Mobile Accordion: Residential Scrap */}
            <div className="rounded-xl border border-brand-border/80 overflow-hidden bg-brand-bg/40">
              <button
                type="button"
                onClick={() => setMobileResidentialOpen(!mobileResidentialOpen)}
                className="w-full px-4 py-2.5 text-sm font-bold text-brand-dark flex items-center justify-between hover:bg-muted/60 transition-colors cursor-pointer"
              >
                <span className={mobileResidentialOpen ? "text-brand-green" : ""}>
                  Residential Scrap
                </span>
                <ChevronDown
                  className={cn(
                    "h-4 w-4 text-brand-muted transition-transform duration-200",
                    mobileResidentialOpen && "rotate-180 text-brand-green"
                  )}
                />
              </button>

              {mobileResidentialOpen && (
                <div className="px-4 pb-3 pt-1 border-t border-brand-border/60 grid grid-cols-2 gap-x-2 gap-y-2 bg-brand-surface animate-in fade-in-0 duration-150">
                  {flatResidentialItems.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-1.5 text-xs text-brand-dark/85 hover:text-brand-green py-1 font-medium group"
                    >
                      <svg
                        className="h-2 w-2 text-brand-green shrink-0 fill-current"
                        viewBox="0 0 24 24"
                      >
                        <path d="M8 5v14l11-7z" />
                      </svg>
                      <span className="truncate">{item.name}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Mobile Accordion: Commercial E-Waste */}
            <div className="rounded-xl border border-brand-border/80 overflow-hidden bg-brand-bg/40">
              <button
                type="button"
                onClick={() => setMobileCommercialOpen(!mobileCommercialOpen)}
                className="w-full px-4 py-2.5 text-sm font-bold text-brand-dark flex items-center justify-between hover:bg-muted/60 transition-colors cursor-pointer"
              >
                <span className={mobileCommercialOpen ? "text-brand-green" : ""}>
                  Commercial E-Waste
                </span>
                <ChevronDown
                  className={cn(
                    "h-4 w-4 text-brand-muted transition-transform duration-200",
                    mobileCommercialOpen && "rotate-180 text-brand-green"
                  )}
                />
              </button>

              {mobileCommercialOpen && (
                <div className="px-3 pb-2 pt-1 border-t border-brand-border/60 flex flex-col space-y-1 bg-brand-surface animate-in fade-in-0 duration-150">
                  {SITE_CONFIG.commercialEwasteNav.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-2 text-xs text-brand-dark/85 hover:text-brand-green py-1.5 px-2 rounded-lg hover:bg-brand-green-light/30 font-medium"
                    >
                      <svg
                        className="h-2 w-2 text-brand-green shrink-0 fill-current"
                        viewBox="0 0 24 24"
                      >
                        <path d="M8 5v14l11-7z" />
                      </svg>
                      <span>{item.name}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Mobile Direct Links */}
            <Link
              href="/services"
              className={cn(
                "px-4 py-2.5 rounded-xl text-sm font-semibold flex items-center justify-between",
                pathname.startsWith("/services")
                  ? "text-brand-blue bg-brand-blue-light font-bold"
                  : "text-brand-dark hover:bg-muted/70"
              )}
              onClick={() => setIsOpen(false)}
            >
              <span>Services</span>
            </Link>

            <Link
              href="/rates"
              className={cn(
                "px-4 py-2.5 rounded-xl text-sm font-semibold flex items-center justify-between",
                pathname.startsWith("/rates")
                  ? "text-brand-blue bg-brand-blue-light font-bold"
                  : "text-brand-dark hover:bg-muted/70"
              )}
              onClick={() => setIsOpen(false)}
            >
              <span>Scrap Rates</span>
            </Link>

            <Link
              href="/what-we-accept"
              className={cn(
                "px-4 py-2.5 rounded-xl text-sm font-semibold flex items-center justify-between",
                pathname.startsWith("/what-we-accept")
                  ? "text-brand-blue bg-brand-blue-light font-bold"
                  : "text-brand-dark hover:bg-muted/70"
              )}
              onClick={() => setIsOpen(false)}
            >
              <span>What We Accept</span>
            </Link>

            <Link
              href="/gallery"
              className={cn(
                "px-4 py-2.5 rounded-xl text-sm font-semibold flex items-center justify-between",
                pathname.startsWith("/gallery")
                  ? "text-brand-blue bg-brand-blue-light font-bold"
                  : "text-brand-dark hover:bg-muted/70"
              )}
              onClick={() => setIsOpen(false)}
            >
              <span>Work Gallery</span>
            </Link>

            <Link
              href="/blog"
              className={cn(
                "px-4 py-2.5 rounded-xl text-sm font-semibold flex items-center justify-between",
                pathname.startsWith("/blog")
                  ? "text-brand-blue bg-brand-blue-light font-bold"
                  : "text-brand-dark hover:bg-muted/70"
              )}
              onClick={() => setIsOpen(false)}
            >
              <span>Market Blog</span>
            </Link>

            <Link
              href="/about"
              className={cn(
                "px-4 py-2.5 rounded-xl text-sm font-semibold flex items-center justify-between",
                pathname.startsWith("/about")
                  ? "text-brand-blue bg-brand-blue-light font-bold"
                  : "text-brand-dark hover:bg-muted/70"
              )}
              onClick={() => setIsOpen(false)}
            >
              <span>About Us</span>
            </Link>

            <Link
              href="/contact"
              className={cn(
                "px-4 py-2.5 rounded-xl text-sm font-semibold flex items-center justify-between",
                pathname.startsWith("/contact")
                  ? "text-brand-blue bg-brand-blue-light font-bold"
                  : "text-brand-dark hover:bg-muted/70"
              )}
              onClick={() => setIsOpen(false)}
            >
              <span>Contact & Yard Map</span>
            </Link>

            {/* Mobile Actions CTA */}
            <div className="pt-3 border-t border-brand-border/60 flex flex-col gap-2.5">
              <Button asChild size="lg" variant="secondary" className="w-full gap-2 font-bold shadow-sm">
                <Link href="/book" onClick={() => setIsOpen(false)}>
                  <CalendarCheck className="h-5 w-5" />
                  <span>Book a Doorstep Pickup</span>
                </Link>
              </Button>

              {initialUser ? (
                <div className="flex flex-col gap-1.5 pt-2">
                  <Button asChild variant="outline" size="lg" className="w-full justify-start gap-2 font-semibold">
                    <Link href="/dashboard" onClick={() => setIsOpen(false)}>
                      <LayoutDashboard className="h-4 w-4" />
                      <span>Customer Dashboard</span>
                    </Link>
                  </Button>
                  {initialUser.role === "admin" && (
                    <Button asChild variant="outline" size="lg" className="w-full justify-start gap-2 border-amber-300 text-amber-800 bg-amber-50 font-bold">
                      <Link href="/admin" onClick={() => setIsOpen(false)}>
                        <ShieldAlert className="h-4 w-4" />
                        <span>Admin Operations Panel</span>
                      </Link>
                    </Button>
                  )}
                  <form action="/auth/signout" method="post">
                    <Button variant="ghost" size="lg" type="submit" className="w-full justify-start gap-2 text-red-600 hover:bg-red-50">
                      <LogOut className="h-4 w-4" />
                      <span>Sign Out</span>
                    </Button>
                  </form>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <Button asChild variant="outline" size="lg" className="w-full font-bold">
                    <Link href="/login" onClick={() => setIsOpen(false)}>
                      Log In
                    </Link>
                  </Button>
                  <Button asChild variant="default" size="lg" className="w-full font-bold">
                    <Link href="/signup" onClick={() => setIsOpen(false)}>
                      Sign Up
                    </Link>
                  </Button>
                </div>
              )}

              {/* Mobile Direct Call & Info */}
              <div className="mt-2 p-3 rounded-xl bg-muted/60 border border-brand-border flex items-center justify-between text-xs">
                <div>
                  <p className="font-bold text-brand-dark">MIDC Andheri East, Mumbai</p>
                  <p className="text-brand-muted">8:00 AM – 10:00 PM (Daily)</p>
                </div>
                <a
                  href={`tel:${SITE_CONFIG.contact.phoneRaw}`}
                  className="font-bold text-brand-blue flex items-center gap-1 bg-brand-blue-light px-2.5 py-1.5 rounded-lg"
                >
                  <Phone className="h-3 w-3" /> Call
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
