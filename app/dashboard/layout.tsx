import * as React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  Package,
  MapPin,
  User,
  CalendarCheck,
  ShieldCheck,
  LogOut,
  Clock,
  Sparkles,
} from "lucide-react";
import { getCurrentUser } from "@/lib/services/user";
import { SITE_CONFIG } from "@/lib/site-config";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user && process.env.NEXT_PUBLIC_SUPABASE_URL) {
    redirect("/login?next=/dashboard");
  }

  const navItems = [
    { href: "/dashboard", label: "My Pickups", icon: Package },
    { href: "/dashboard/addresses", label: "Saved Addresses", icon: MapPin },
    { href: "/dashboard/profile", label: "Profile Settings", icon: User },
  ];

  return (
    <div className="py-8 md:py-12 bg-brand-bg min-h-screen">
      <div className="container space-y-8">
        {/* User Summary Header */}
        <div className="rounded-3xl border border-brand-border bg-white p-6 sm:p-8 shadow-subtle flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-2xl bg-brand-blue text-white flex items-center justify-center font-black text-2xl uppercase shadow-sm">
              {user?.full_name ? user.full_name[0] : user?.email ? user.email[0] : "U"}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-extrabold text-brand-dark">
                  {user?.full_name || "Customer Account"}
                </h1>
                <Badge variant={user?.role === "admin" ? "warning" : "blue"} className="capitalize text-xs">
                  {user?.role || "Customer"}
                </Badge>
              </div>
              <p className="text-xs sm:text-sm text-brand-muted mt-0.5">
                {user?.email || "customer@reflectionscrap.com"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button asChild size="default" className="gap-2 font-bold shadow-sm">
              <Link href="/book">
                <CalendarCheck className="h-4 w-4" />
                <span>Book New Pickup</span>
              </Link>
            </Button>
            {user?.role === "admin" && (
              <Button asChild variant="outline" className="border-amber-400 text-amber-800 bg-amber-50 font-bold">
                <Link href="/admin">Admin Panel</Link>
              </Button>
            )}
          </div>
        </div>

        {/* Dashboard Navigation Tabs */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <aside className="lg:col-span-3 space-y-4">
            <div className="rounded-2xl border border-brand-border bg-white p-2 shadow-subtle space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-brand-dark hover:bg-brand-blue-light hover:text-brand-blue transition-colors"
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>

            {/* Quick Yard Info Card */}
            <div className="rounded-2xl border border-brand-border bg-white p-5 shadow-subtle space-y-3 text-xs">
              <div className="flex items-center gap-2 font-bold text-brand-dark">
                <Clock className="h-4 w-4 text-brand-green" />
                <span>Need Yard Drop-off?</span>
              </div>
              <p className="text-brand-muted leading-relaxed">
                Visit our MIDC Andheri East yard Monday to Sunday between 8:00 AM
                and 10:00 PM for instant weighing and cash settlement.
              </p>
              <a
                href={`tel:${SITE_CONFIG.contact.phoneRaw}`}
                className="text-brand-blue font-bold hover:underline block"
              >
                Call: {SITE_CONFIG.contact.phone}
              </a>
            </div>
          </aside>

          {/* Main Dashboard Content Area */}
          <main className="lg:col-span-9">{children}</main>
        </div>
      </div>
    </div>
  );
}
