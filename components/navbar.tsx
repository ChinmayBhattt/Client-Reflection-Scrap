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
} from "lucide-react";
import { SITE_CONFIG } from "@/lib/site-config";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface NavbarProps {
  user?: {
    email?: string;
    full_name?: string;
    role?: "customer" | "admin";
  } | null;
}

export function Navbar({ user: initialUser }: NavbarProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = React.useState(false);
  const pathname = usePathname();

  // Scroll detection for sticky shadow & subtle padding shift
  React.useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 15);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile drawer and dropdown on route change
  React.useEffect(() => {
    setIsOpen(false);
    setUserDropdownOpen(false);
  }, [pathname]);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/services", label: "Services" },
    { href: "/rates", label: "Scrap Rates" },
    { href: "/what-we-accept", label: "What We Accept" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full transition-all duration-200 border-b",
        scrolled
          ? "glass-nav border-brand-border/90 shadow-subtle py-2"
          : "bg-white/95 backdrop-blur-md border-brand-border py-2.5 sm:py-3"
      )}
    >
      <div className="container max-w-7xl mx-auto flex items-center justify-between gap-2 lg:gap-4">
        {/* 1. BRAND LOGO (Left side) */}
        <Link
          href="/"
          className="flex items-center gap-3 shrink-0 group focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue rounded-xl"
        >
          <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-xl border border-brand-border bg-white shadow-sm flex items-center justify-center p-1.5 transition-transform group-hover:scale-105">
            <Image
              src="/logo-icon.png"
              alt="Reflection Scrap Solutions LLP Logo"
              width={38}
              height={38}
              priority
              className="h-full w-full object-contain"
            />
          </div>
          <div className="flex flex-col text-left">
            <span className="font-extrabold text-base md:text-lg leading-none tracking-tight text-brand-dark">
              Reflection <span className="text-brand-blue">Scrap</span>
            </span>
            <span className="text-[10px] md:text-[11px] font-bold tracking-wider uppercase text-brand-green mt-1">
              Solutions LLP
            </span>
          </div>
        </Link>

        {/* 2. DESKTOP NAVIGATION LINKS (Centered) */}
        <nav className="hidden lg:flex items-center justify-center gap-1 xl:gap-1.5 flex-1 mx-2 xl:mx-6">
          {navLinks.map((link) => {
            const isActive =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "px-3 xl:px-3.5 py-2 rounded-lg text-[13px] xl:text-sm font-semibold transition-all duration-150 whitespace-nowrap",
                  isActive
                    ? "text-brand-blue bg-brand-blue-light font-bold"
                    : "text-brand-dark/80 hover:text-brand-blue hover:bg-gray-100/80"
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* 3. DESKTOP ACTIONS (Right side) */}
        <div className="hidden lg:flex items-center gap-2.5 shrink-0">
          {/* Quick Call */}
          <a
            href={`tel:${SITE_CONFIG.contact.phoneRaw}`}
            className="flex items-center gap-2 h-10 px-3 rounded-lg border border-brand-border bg-brand-bg/60 text-brand-dark hover:border-brand-blue hover:bg-brand-blue-light transition-colors"
          >
            <div className="h-6 w-6 rounded-full bg-brand-blue-light text-brand-blue flex items-center justify-center shrink-0">
              <Phone className="h-3 w-3" />
            </div>
            <div className="flex flex-col leading-none text-left">
              <span className="text-[9px] text-brand-muted uppercase font-bold tracking-wider">
                Quick Call
              </span>
              <span className="text-xs font-bold text-brand-dark mt-0.5 whitespace-nowrap">
                {SITE_CONFIG.contact.phone}
              </span>
            </div>
          </a>

          {/* Book Pickup CTA */}
          <Button
            asChild
            size="default"
            variant="secondary"
            className="h-10 px-4 gap-2 font-bold shadow-sm"
          >
            <Link href="/book">
              <CalendarCheck className="h-4 w-4" />
              <span>Book Pickup</span>
            </Link>
          </Button>

          {/* User Profile Menu or Login Button */}
          {initialUser ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 h-10 px-2.5 rounded-lg border border-brand-border bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-brand-blue transition-colors"
              >
                <div className="h-7 w-7 rounded-md bg-brand-blue text-white flex items-center justify-center font-bold text-xs uppercase shadow-sm">
                  {initialUser.full_name
                    ? initialUser.full_name[0]
                    : initialUser.email
                    ? initialUser.email[0]
                    : "U"}
                </div>
                <span className="text-xs font-bold text-brand-dark max-w-[90px] truncate">
                  {initialUser.full_name?.split(" ")[0] || initialUser.email?.split("@")[0]}
                </span>
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-52 rounded-2xl border border-brand-border bg-white p-2 shadow-elevated z-50 animate-in fade-in-0 zoom-in-95 duration-150">
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
                        className="flex w-full items-center gap-2 px-3 py-2 text-xs font-semibold text-red-600 rounded-lg hover:bg-red-50 text-left"
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
              size="default"
              variant="outline"
              className="h-10 px-4 gap-2 font-bold text-brand-dark border-brand-border hover:border-brand-blue hover:text-brand-blue"
            >
              <Link href="/login">
                <User className="h-4 w-4 text-brand-blue" />
                <span>Login</span>
              </Link>
            </Button>
          )}
        </div>

        {/* MOBILE CONTROLS (Right side on mobile) */}
        <div className="flex items-center gap-2 lg:hidden">
          <Button asChild size="sm" variant="secondary" className="h-9 px-3 gap-1.5 text-xs font-bold shadow-sm">
            <Link href="/book">
              <CalendarCheck className="h-3.5 w-3.5" />
              <span>Book</span>
            </Link>
          </Button>

          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="h-9 w-9 flex items-center justify-center rounded-lg border border-brand-border text-brand-dark hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-brand-blue"
            aria-label="Toggle navigation menu"
            aria-expanded={isOpen}
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* MOBILE DRAWER */}
      {isOpen && (
        <div className="lg:hidden fixed inset-x-0 top-full bg-white border-b border-brand-border shadow-elevated animate-in slide-in-from-top-2 duration-200">
          <div className="container py-4 flex flex-col space-y-2">
            {navLinks.map((link) => {
              const isActive =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "px-4 py-3 rounded-xl text-base font-semibold flex items-center justify-between",
                    isActive
                      ? "text-brand-blue bg-brand-blue-light font-bold"
                      : "text-brand-dark hover:bg-gray-50"
                  )}
                  onClick={() => setIsOpen(false)}
                >
                  <span>{link.label}</span>
                </Link>
              );
            })}

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
              <div className="mt-2 p-3 rounded-xl bg-gray-50 border border-brand-border flex items-center justify-between text-xs">
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
