import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import {
  LayoutDashboard,
  Truck,
  TrendingUp,
  Mail,
  MapPin,
  Users,
  ShieldAlert,
  ArrowLeft,
  ExternalLink,
} from "lucide-react";
import { getCurrentUser } from "@/lib/services/user";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  // If Supabase is connected, enforce role = 'admin'
  if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
    if (!user) {
      redirect("/login?next=/admin");
    }
    if (user.role !== "admin") {
      redirect("/dashboard?error=unauthorized_admin");
    }
  }

  const navLinks = [
    { href: "/admin", label: "Overview", icon: LayoutDashboard },
    { href: "/admin/pickups", label: "Pickups & Dispatches", icon: Truck },
    { href: "/admin/rates", label: "Scrap Rates & Items", icon: TrendingUp },
    { href: "/admin/enquiries", label: "Contact Enquiries", icon: Mail },
    { href: "/admin/service-areas", label: "Service Areas (Pincodes)", icon: MapPin },
    { href: "/admin/customers", label: "Customer Accounts", icon: Users },
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col">
      {/* Admin Top Bar */}
      <header className="h-16 border-b border-slate-800 bg-slate-950 px-4 sm:px-8 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <Link href="/admin" className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-lg bg-white p-1 flex items-center justify-center">
              <Image
                src="/logo.png"
                alt="Logo"
                width={30}
                height={30}
                className="object-contain"
              />
            </div>
            <div>
              <span className="font-bold text-sm text-white block leading-tight">
                Reflection Scrap Admin
              </span>
              <span className="text-[10px] text-amber-400 font-semibold uppercase tracking-wider block">
                MIDC Andheri East Operations
              </span>
            </div>
          </Link>
          <Badge variant="warning" className="hidden sm:inline-flex text-[10px]">
            Admin Mode
          </Badge>
        </div>

        <div className="flex items-center gap-3">
          <Button asChild size="sm" variant="outline" className="text-xs bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700">
            <Link href="/" target="_blank">
              <span>View Public Site</span>
              <ExternalLink className="h-3 w-3 ml-1.5" />
            </Link>
          </Button>
          <Button asChild size="sm" variant="default" className="text-xs">
            <Link href="/dashboard">
              <ArrowLeft className="h-3 w-3 mr-1" />
              <span>Customer Portal</span>
            </Link>
          </Button>
        </div>
      </header>

      {/* Main Admin Workspace with Sidebar */}
      <div className="flex-1 flex flex-col md:flex-row">
        {/* Sidebar */}
        <aside className="w-full md:w-64 border-r border-slate-800 bg-slate-950 p-4 space-y-1 shrink-0">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-3 py-2">
            Operations & Control
          </div>
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
              >
                <Icon className="h-4 w-4 text-brand-blue" />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </aside>

        {/* Content View */}
        <main className="flex-1 p-4 sm:p-8 bg-slate-900 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
