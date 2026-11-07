import type { Metadata } from "next";
import Link from "next/link";
import {
  Calendar,
  Clock,
  CheckCircle2,
  Scale,
  Wallet,
  ArrowRight,
  TrendingUp,
  Truck,
  Plus,
} from "lucide-react";
import { getAdminOverviewStats } from "@/lib/services/admin";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Admin Overview - Reflection Scrap Solutions",
};

export default async function AdminOverviewPage() {
  const stats = await getAdminOverviewStats();

  const metricCards = [
    {
      title: "Pending Today",
      value: stats.pendingToday,
      description: "Scheduled for collection today",
      icon: Clock,
      color: "text-amber-400",
      bg: "bg-amber-400/10",
    },
    {
      title: "Scheduled Active",
      value: stats.scheduledActive,
      description: "Confirmed & in progress",
      icon: Truck,
      color: "text-sky-400",
      bg: "bg-sky-400/10",
    },
    {
      title: "Completed This Month",
      value: stats.completedThisMonth,
      description: "Finished & settled pickups",
      icon: CheckCircle2,
      color: "text-emerald-400",
      bg: "bg-emerald-400/10",
    },
    {
      title: "Scrap Weight Collected",
      value: `${stats.totalWeightMonthKg.toLocaleString("en-IN")} kg`,
      description: "Total material mass this month",
      icon: Scale,
      color: "text-indigo-400",
      bg: "bg-indigo-400/10",
    },
    {
      title: "Total Payout Issued",
      value: formatCurrency(stats.totalPayoutMonthINR),
      description: "Total on-the-spot settlements",
      icon: Wallet,
      color: "text-green-400",
      bg: "bg-green-400/10",
    },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Title & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Operations Dashboard
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time scrap collection tracking, weighing metrics, and payment records.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button asChild size="sm" className="bg-brand-blue hover:bg-brand-blue-hover text-white font-bold gap-1.5 text-xs">
            <Link href="/admin/pickups">
              <Truck className="h-3.5 w-3.5" />
              <span>Manage Pickups</span>
            </Link>
          </Button>
          <Button asChild size="sm" variant="outline" className="border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700 text-xs font-bold">
            <Link href="/admin/rates">
              <TrendingUp className="h-3.5 w-3.5 mr-1" />
              <span>Edit Scrap Rates</span>
            </Link>
          </Button>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {metricCards.map((m, idx) => {
          const Icon = m.icon;
          return (
            <Card key={idx} className="bg-slate-950 border-slate-800 text-white rounded-2xl shadow-subtle p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  {m.title}
                </span>
                <div className={`h-8 w-8 rounded-lg ${m.bg} ${m.color} flex items-center justify-center`}>
                  <Icon className="h-4 w-4" />
                </div>
              </div>
              <div>
                <span className="text-2xl font-black text-white">{m.value}</span>
                <p className="text-[11px] text-slate-500 mt-0.5">{m.description}</p>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Recent Pickups Overview */}
      <Card className="bg-slate-950 border-slate-800 text-white rounded-2xl shadow-subtle p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <h2 className="text-lg font-bold text-white">Recent Pickups</h2>
            <p className="text-xs text-slate-400">
              Latest collection bookings received from customers.
            </p>
          </div>
          <Button asChild variant="outline" size="sm" className="border-slate-700 text-xs bg-slate-900 text-slate-200">
            <Link href="/admin/pickups">
              <span>View All</span>
              <ArrowRight className="h-3.5 w-3.5 ml-1" />
            </Link>
          </Button>
        </div>

        {stats.recentPickups.length > 0 ? (
          <div className="space-y-3">
            {stats.recentPickups.map((p) => (
              <div
                key={p.id}
                className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-white text-sm">
                      {p.booking_code}
                    </span>
                    <Badge variant="blue" className="text-[10px] capitalize">
                      {p.status}
                    </Badge>
                    <span className="text-slate-400">
                      {p.user?.full_name ? `${p.user.full_name} (${p.user.phone || ""})` : "Customer"}
                    </span>
                  </div>
                  <p className="text-slate-400 text-[11px]">
                    Slot: {p.slot_date} ({p.slot_time}) • {p.pickup_type}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  {p.final_amount !== null && (
                    <span className="font-bold text-emerald-400">
                      {formatCurrency(p.final_amount)}
                    </span>
                  )}
                  <Button asChild size="sm" variant="outline" className="border-slate-700 text-xs bg-slate-800 text-white">
                    <Link href={`/admin/pickups?code=${p.booking_code}`}>
                      Inspect & Weigh
                    </Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-500 py-6 text-center">
            No recent pickups recorded.
          </p>
        )}
      </Card>
    </div>
  );
}

