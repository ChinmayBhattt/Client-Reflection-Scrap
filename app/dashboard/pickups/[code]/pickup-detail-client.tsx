"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  Truck,
  Building,
  CheckCircle2,
  AlertCircle,
  Ban,
  Scale,
  Wallet,
  Phone,
  MessageCircle,
  Loader2,
} from "lucide-react";
import { Pickup, PickupStatus } from "@/lib/types/database";
import { formatCurrency, formatDate } from "@/lib/utils";
import { SITE_CONFIG } from "@/lib/site-config";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { cancelPickup } from "@/app/book/actions";

interface PickupDetailClientProps {
  pickup: Pickup;
}

export function PickupDetailClient({ pickup }: PickupDetailClientProps) {
  const router = useRouter();
  const [isCancelling, setIsCancelling] = React.useState(false);
  const [showCancelDialog, setShowCancelDialog] = React.useState(false);

  const canCancel = ["pending", "confirmed"].includes(pickup.status);

  const handleCancel = async () => {
    setIsCancelling(true);
    const res = await cancelPickup(pickup.id);
    setIsCancelling(false);
    setShowCancelDialog(false);

    if (res.success) {
      toast.success(res.message);
      router.refresh();
    } else {
      toast.error(res.error || "Failed to cancel pickup.");
    }
  };

  // Status timeline steps
  const steps: { key: PickupStatus; label: string; desc: string }[] = [
    { key: "pending", label: "Request Placed", desc: "Awaiting review" },
    { key: "confirmed", label: "Confirmed", desc: "Slot locked" },
    { key: "scheduled", label: "Team Dispatched", desc: "Vehicle routed" },
    { key: "picked_up", label: "Weighed", desc: "Scales verified" },
    { key: "completed", label: "Settled & Paid", desc: "Payment transferred" },
  ];

  const getStepIndex = (status: PickupStatus) => {
    switch (status) {
      case "pending":
        return 0;
      case "confirmed":
        return 1;
      case "scheduled":
        return 2;
      case "picked_up":
        return 3;
      case "completed":
        return 4;
      default:
        return -1;
    }
  };

  const currentStepIdx = getStepIndex(pickup.status);

  const address = pickup.address_snapshot;

  return (
    <div className="space-y-8">
      {/* Back Link & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-muted hover:text-brand-dark"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to All Pickups</span>
        </Link>

        {canCancel && (
          <Button
            type="button"
            variant="destructive"
            size="sm"
            onClick={() => setShowCancelDialog(true)}
            className="gap-1.5 text-xs"
          >
            <Ban className="h-3.5 w-3.5" />
            <span>Cancel Pickup</span>
          </Button>
        )}
      </div>

      {/* Main Overview Card */}
      <Card className="rounded-3xl border border-brand-border bg-white shadow-card p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-brand-border">
          <div>
            <div className="flex items-center gap-3">
              <span className="text-2xl font-black font-mono text-brand-blue tracking-wider">
                {pickup.booking_code}
              </span>
              <Badge
                variant={
                  pickup.status === "completed"
                    ? "success"
                    : pickup.status === "cancelled"
                    ? "destructive"
                    : "blue"
                }
                className="capitalize text-xs font-bold"
              >
                {pickup.status.replace("_", " ")}
              </Badge>
            </div>
            <p className="text-xs text-brand-muted mt-1">
              Created on {formatDate(pickup.created_at)}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg bg-brand-bg border border-brand-border flex items-center gap-1.5 text-brand-dark">
              {pickup.pickup_type === "doorstep" ? (
                <>
                  <Truck className="h-4 w-4 text-brand-blue" />
                  <span>Doorstep Pickup</span>
                </>
              ) : (
                <>
                  <Building className="h-4 w-4 text-brand-green" />
                  <span>Drop-off at MIDC Yard</span>
                </>
              )}
            </span>
          </div>
        </div>

        {/* Status Timeline */}
        {pickup.status === "cancelled" ? (
          <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-xs text-red-800 flex items-center gap-3">
            <Ban className="h-5 w-5 text-red-600 shrink-0" />
            <div>
              <p className="font-bold">This booking has been cancelled.</p>
              <p className="text-red-700/80">
                If you still need scrap collected, you are welcome to book a new pickup.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-muted block">
              Pickup Status Progress
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {steps.map((s, idx) => {
                const isPassed = currentStepIdx >= idx;
                const isCurrent = currentStepIdx === idx;

                return (
                  <div
                    key={s.key}
                    className={`p-3 rounded-xl border text-center transition-colors ${
                      isCurrent
                        ? "border-brand-blue bg-brand-blue-light/50 ring-2 ring-brand-blue"
                        : isPassed
                        ? "border-brand-green/30 bg-brand-green-light/40"
                        : "border-brand-border bg-gray-50 opacity-60"
                    }`}
                  >
                    <div
                      className={`h-6 w-6 rounded-full mx-auto mb-1.5 flex items-center justify-center text-[10px] font-bold ${
                        isPassed ? "bg-brand-green text-white" : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {isPassed ? "✓" : idx + 1}
                    </div>
                    <span className="block text-xs font-bold text-brand-dark">
                      {s.label}
                    </span>
                    <span className="block text-[10px] text-brand-muted mt-0.5">
                      {s.desc}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Schedule & Logistics Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-brand-border text-xs">
          <div className="space-y-2 p-4 rounded-2xl bg-brand-bg border border-brand-border">
            <span className="font-bold uppercase tracking-wider text-brand-blue block">
              Scheduled Date & Slot
            </span>
            <div className="flex items-center gap-2 text-brand-dark">
              <Calendar className="h-4 w-4 text-brand-muted" />
              <span>{pickup.slot_date}</span>
            </div>
            <div className="flex items-center gap-2 text-brand-dark">
              <Clock className="h-4 w-4 text-brand-muted" />
              <span>{pickup.slot_time}</span>
            </div>
          </div>

          <div className="space-y-2 p-4 rounded-2xl bg-brand-bg border border-brand-border">
            <span className="font-bold uppercase tracking-wider text-brand-green block">
              {pickup.pickup_type === "doorstep" ? "Pickup Location" : "Yard Address"}
            </span>
            <div className="flex items-start gap-2 text-brand-dark">
              <MapPin className="h-4 w-4 text-brand-muted shrink-0 mt-0.5" />
              <span>
                {address
                  ? `${address.name ? `${address.name} • ` : ""}${address.line1 || ""}, ${
                      address.area || ""
                    }, Mumbai - ${address.pincode || ""}`
                  : SITE_CONFIG.address.full}
              </span>
            </div>
          </div>
        </div>

        {/* Scrap Items Breakdown */}
        <div className="space-y-3 pt-2">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-muted block">
            Items & Measured Weights
          </span>

          <div className="rounded-2xl border border-brand-border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Scrap Material</TableHead>
                  <TableHead className="text-right">Approx Weight</TableHead>
                  <TableHead className="text-right">Actual Weight</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pickup.items && pickup.items.length > 0 ? (
                  pickup.items.map((it) => (
                    <TableRow key={it.id}>
                      <TableCell className="font-bold text-brand-dark">
                        {it.item?.name || it.notes || "Scrap Item"}
                      </TableCell>
                      <TableCell className="text-right text-brand-muted">
                        {it.approx_weight} {it.item?.unit || "kg"}
                      </TableCell>
                      <TableCell className="text-right font-semibold text-brand-dark">
                        {it.actual_weight !== null ? `${it.actual_weight} ${it.item?.unit || "kg"}` : "Pending Weighing"}
                      </TableCell>
                      <TableCell className="text-right font-extrabold text-brand-dark">
                        {it.amount !== null ? formatCurrency(it.amount) : "—"}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-6 text-brand-muted text-xs">
                      No items recorded.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Completed Final Settlement Banner */}
        {pickup.status === "completed" && pickup.final_amount !== null && (
          <div className="p-6 rounded-2xl bg-brand-green-light border border-brand-green/30 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-8 w-8 text-brand-green" />
              <div>
                <h3 className="font-extrabold text-base text-brand-dark">
                  Payment Settled
                </h3>
                <p className="text-xs text-brand-muted">
                  Transferred directly via on-the-spot UPI / Cash.
                </p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs uppercase font-bold text-brand-muted block">
                Total Payout
              </span>
              <span className="text-2xl font-black text-brand-green">
                {formatCurrency(pickup.final_amount)}
              </span>
            </div>
          </div>
        )}
      </Card>

      {/* Cancel Confirmation Modal */}
      {showCancelDialog && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in-0 duration-200">
          <Card className="w-full max-w-md bg-white rounded-3xl p-6 space-y-4 shadow-elevated">
            <div className="flex items-center gap-3 text-red-600">
              <AlertCircle className="h-6 w-6" />
              <h3 className="font-bold text-lg text-brand-dark">
                Cancel Pickup Booking?
              </h3>
            </div>
            <p className="text-xs text-brand-muted leading-relaxed">
              Are you sure you want to cancel booking <strong>{pickup.booking_code}</strong>?
              This action cannot be undone. You can book a new pickup anytime.
            </p>
            <div className="pt-2 flex items-center justify-end gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowCancelDialog(false)}
                disabled={isCancelling}
              >
                Keep Booking
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={handleCancel}
                disabled={isCancelling}
                className="gap-1.5"
              >
                {isCancelling ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Cancelling...</span>
                  </>
                ) : (
                  <span>Yes, Cancel</span>
                )}
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}

