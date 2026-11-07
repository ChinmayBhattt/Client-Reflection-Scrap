"use client";

import * as React from "react";
import Link from "next/link";
import {
  Package,
  Calendar,
  Clock,
  ArrowRight,
  Truck,
  Building,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Ban,
  CalendarCheck,
} from "lucide-react";
import { Pickup, PickupStatus } from "@/lib/types/database";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface PickupsClientProps {
  pickups: Pickup[];
}

export function PickupsClient({ pickups }: PickupsClientProps) {
  const [filter, setFilter] = React.useState<"all" | "active" | "completed" | "cancelled">("all");

  const filteredPickups = React.useMemo(() => {
    return pickups.filter((p) => {
      if (filter === "all") return true;
      if (filter === "active") return ["pending", "confirmed", "scheduled", "picked_up"].includes(p.status);
      if (filter === "completed") return p.status === "completed";
      if (filter === "cancelled") return p.status === "cancelled";
      return true;
    });
  }, [pickups, filter]);

  const getStatusBadge = (status: PickupStatus) => {
    switch (status) {
      case "pending":
        return <Badge variant="warning">Pending Review</Badge>;
      case "confirmed":
        return <Badge variant="blue">Confirmed</Badge>;
      case "scheduled":
        return <Badge variant="blue">Scheduled</Badge>;
      case "picked_up":
        return <Badge variant="secondary">Weighed & Picked Up</Badge>;
      case "completed":
        return <Badge variant="success">Completed</Badge>;
      case "cancelled":
        return <Badge variant="destructive">Cancelled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-brand-border pb-3 overflow-x-auto">
        <Button
          size="sm"
          variant={filter === "all" ? "default" : "outline"}
          onClick={() => setFilter("all")}
          className="text-xs rounded-full"
        >
          All Bookings ({pickups.length})
        </Button>
        <Button
          size="sm"
          variant={filter === "active" ? "default" : "outline"}
          onClick={() => setFilter("active")}
          className="text-xs rounded-full"
        >
          Active
        </Button>
        <Button
          size="sm"
          variant={filter === "completed" ? "default" : "outline"}
          onClick={() => setFilter("completed")}
          className="text-xs rounded-full"
        >
          Completed
        </Button>
        <Button
          size="sm"
          variant={filter === "cancelled" ? "default" : "outline"}
          onClick={() => setFilter("cancelled")}
          className="text-xs rounded-full"
        >
          Cancelled
        </Button>
      </div>

      {/* Pickups List */}
      {filteredPickups.length > 0 ? (
        <div className="space-y-4">
          {filteredPickups.map((pickup) => {
            const isCompleted = pickup.status === "completed";
            const itemCount = pickup.items?.length || 0;

            return (
              <Card
                key={pickup.id}
                className="rounded-2xl border border-brand-border bg-white shadow-subtle hover:border-brand-blue transition-all duration-200 overflow-hidden"
              >
                <CardContent className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-5">
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono font-bold text-sm text-brand-dark">
                        {pickup.booking_code}
                      </span>
                      {getStatusBadge(pickup.status)}
                      <span className="text-xs text-brand-muted flex items-center gap-1 font-medium">
                        {pickup.pickup_type === "doorstep" ? (
                          <>
                            <Truck className="h-3.5 w-3.5 text-brand-blue" />
                            <span>Doorstep Pickup</span>
                          </>
                        ) : (
                          <>
                            <Building className="h-3.5 w-3.5 text-brand-green" />
                            <span>Yard Drop-Off</span>
                          </>
                        )}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-brand-muted">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5 text-brand-dark" />
                        <span>{pickup.slot_date}</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5 text-brand-dark" />
                        <span>{pickup.slot_time}</span>
                      </span>
                      <span>•</span>
                      <span>{itemCount} material {itemCount === 1 ? "category" : "categories"}</span>
                    </div>

                    {isCompleted && pickup.final_amount !== null && (
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-brand-green-light border border-brand-green/30 text-xs font-bold text-brand-green">
                        <CheckCircle2 className="h-4 w-4" />
                        <span>Final Paid Payout: {formatCurrency(pickup.final_amount)}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <Button asChild variant="outline" size="sm" className="gap-1.5 font-bold">
                      <Link href={`/dashboard/pickups/${pickup.booking_code}`}>
                        <span>View Details</span>
                        <ArrowRight className="h-3.5 w-3.5 text-brand-blue" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <Card className="rounded-3xl border border-dashed border-brand-border bg-white p-12 text-center space-y-4 shadow-subtle">
          <div className="h-16 w-16 rounded-2xl bg-brand-blue-light text-brand-blue flex items-center justify-center mx-auto">
            <Package className="h-8 w-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-brand-dark">No pickups found</h3>
            <p className="text-xs text-brand-muted max-w-sm mx-auto">
              You haven&apos;t scheduled any pickups matching this filter yet. Ready to turn your scrap into cash?
            </p>
          </div>
          <Button asChild size="default" className="gap-2 font-bold">
            <Link href="/book">
              <CalendarCheck className="h-4 w-4" />
              <span>Book a Pickup Now</span>
            </Link>
          </Button>
        </Card>
      )}
    </div>
  );
}
