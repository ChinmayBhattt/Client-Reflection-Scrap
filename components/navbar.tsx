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
import { Button } from "@/lib/../components/ui/button";
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

  // Scroll detection for sticky shadow
  React.useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile drawer on route change
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
          ? "glass-nav border-brand-border/80 shadow-subtle py-2.5"
          : "bg-white/95 backdrop-blur-md border-brand-border py-3.5"
      )}
    >
      <div className="container flex items-center justify-between">
        {/* Brand Logo */}
        <Link
          href="/"
          className="flex items-center gap-3 group focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue rounded-lg"
        >
          <div className="relative h-11 w-11 overflow-hidden rounded-xl border border-brand-border/60 bg-white shadow-sm flex items-center justify-center p-1">
            <Image
              src="/logo.png"
              alt="Reflection Scrap Solutions LLP Logo"
              width={40}
              height={40}
              priority
              className="h-full w-full object-contain"
            />
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-base md:text-lg leading-tight tracking-tight text-brand-dark">
              Reflection <span className="text-brand-blue">Scrap</span>
            </span>
            <span className="text-[10px] md:text-xs font-semibold tracking-wider uppercase text-brand-green">
              Solutions LLP
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
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
                  "px-3 py-2 rounded-lg text-sm font-semibold transition-colors duration-150",
                  isActive
                    ? "text-brand-blue bg-brand-blue-light"
                    : "text-brand-dark hover:text-brand-blue hover:bg-gray-100/70"
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden lg:flex items-center gap-3">
          {/* Quick Call */}
          <a
            href={`tel:${SITE_CONFIG.contact.phoneRaw}`}
            className="flex items-center gap-2 text-xs font-bold text-brand-dark hover:text-brand-blue px-3 py-2 rounded-lg hover:bg-brand-blue-light transition-colors"
          >
            <div className="h-7 w-7 rounded-full bg-brand-blue-light text-brand-blue flex items-center justify-center">
              <Phone className="h-3.5 w-3.5" />
            </div>
            <div className="flex flex-col leading-tight text-left">
              <span className="text-[10px] text-brand-muted uppercase font-semibold">
                Quick Call
              </span>
              <span>{SITE_CONFIG.contact.phone}</span>
            </div>
          </a>

          {/* Book Button */}
          <Button asChild size="default" variant="secondary" className="gap-2 shadow-sm">
            <Link href="/book">
              <CalendarCheck className="h-4 w-4" />
              <span>Book Pickup</span>
            </Link>
          </Button>

          {/* User Menu / Sign In */}
          {initialUser ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 p-1.5 rounded-xl border border-brand-border bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-brand-blue"
              >
                <div className="h-8 w-8 rounded-lg bg-brand-blue text-white flex items-center justify-center font-bold text-xs uppercase">
                  {initialUser.full_name
                    ? initialUser.full_name[0]
                    : initialUser.email
                    ? initialUser.email[0]
                    : "U"}
                </div>
                <span className="text-xs font-semibold text-brand-dark max-w-[100px] truncate">
                  {initialUser.full_name || initialUser.email?.split("@")[0]}
                </span>
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-52 rounded-xl border border-brand-border bg-white p-2 shadow-elevated z-50">
                  <div className="px-3 py-2 border-b border-brand-border/60">
                    <p className="text-xs font-bold text-brand-dark truncate">
                      {initialUser.full_name || "Account"}
                    </p>
                    <p className="text-[11px] text-brand-muted truncate">
                      {initialUser.email}
                    </p>
                  </div>
                  <div className="py-1">
                    <Link
                      href="/dashboard"
                      className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-brand-dark rounded-lg hover:bg-brand-blue-light hover:text-brand-blue"
                      onClick={() => setUserDropdownOpen(false)}
                    >
                      <LayoutDashboard className="h-3.5 w-3.5" />
                      My Dashboard
                    </Link>
                    {initialUser.role === "admin" && (
                      <Link
                        href="/admin"
                        className="flex items-center gap-2 px-3 py-2 text-xs font-bold text-amber-700 rounded-lg hover:bg-amber-50"
                        onClick={() => setUserDropdownOpen(false)}
                      >
                        <ShieldAlert className="h-3.5 w-3.5" />
                        Admin Panel
                      </Link>
                    )}
                  </div>
                  <div className="pt-1 border-t border-brand-border/60">
                    <form action="/auth/signout" method="post">
                      <button
                        type="submit"
                        className="flex w-full items-center gap-2 px-3 py-2 text-xs font-medium text-red-600 rounded-lg hover:bg-red-50 text-left"
                      >
                        <LogOut className="h-3.5 w-3.5" />
                        Sign Out
                      </button>
                    </form>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Button asChild size="default" variant="outline" className="gap-2">
              <Link href="/login">
                <User className="h-4 w-4 text-brand-blue" />
                <span>Login</span>
              </Link>
            </Button>
          )}
        </div>

        {/* Mobile Hamburger Toggle */}
        <div className="flex items-center gap-2 lg:hidden">
          <Button asChild size="sm" variant="secondary" className="gap-1.5 text-xs">
            <Link href="/book">
              <CalendarCheck className="h-3.5 w-3.5" />
              <span>Book</span>
            </Link>
          </Button>

          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 rounded-lg border border-brand-border text-brand-dark hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-brand-blue"
            aria-label="Toggle navigation menu"
            aria-expanded={isOpen}
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
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
                      ? "text-brand-blue bg-brand-blue-light"
                      : "text-brand-dark hover:bg-gray-50"
                  )}
                  onClick={() => setIsOpen(false)}
                >
                  <span>{link.label}</span>
                </Link>
              );
            })}

            <div className="pt-3 border-t border-brand-border/60 flex flex-col gap-2.5">
              <Button asChild size="lg" variant="secondary" className="w-full gap-2 font-bold">
                <Link href="/book" onClick={() => setIsOpen(false)}>
                  <CalendarCheck className="h-5 w-5" />
                  <span>Book a Doorstep Pickup</span>
                </Link>
              </Button>

              {initialUser ? (
                <div className="flex flex-col gap-1.5 pt-2">
                  <Button asChild variant="outline" size="lg" className="w-full justify-start gap-2">
                    <Link href="/dashboard" onClick={() => setIsOpen(false)}>
                      <LayoutDashboard className="h-4 w-4" />
                      <span>Customer Dashboard</span>
                    </Link>
                  </Button>
                  {initialUser.role === "admin" && (
                    <Button asChild variant="outline" size="lg" className="w-full justify-start gap-2 border-amber-300 text-amber-800 bg-amber-50">
                      <Link href="/admin" onClick={() => setIsOpen(false)}>
                        <ShieldAlert className="h-4 w-4" />
                        <span>Admin Panel</span>
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
                  <Button asChild variant="outline" size="lg" className="w-full">
                    <Link href="/login" onClick={() => setIsOpen(false)}>
                      Log In
                    </Link>
                  </Button>
                  <Button asChild variant="default" size="lg" className="w-full">
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
                  className="font-bold text-brand-blue flex items-center gap-1"
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
