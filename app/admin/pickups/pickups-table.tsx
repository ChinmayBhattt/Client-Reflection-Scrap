"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import {
  Search,
  Download,
  Filter,
  Truck,
  Building,
  CheckCircle2,
  AlertCircle,
  Ban,
  Clock,
  Eye,
  Edit3,
  Loader2,
  Calendar,
  MapPin,
  Scale,
  Wallet,
  X,
  FileSpreadsheet,
} from "lucide-react";
import { Pickup, PickupStatus, PickupItem } from "@/lib/types/database";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { updatePickupByAdmin } from "./actions";

interface PickupsTableProps {
  pickups: Pickup[];
}

export function PickupsTable({ pickups }: PickupsTableProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryCode = searchParams.get("code");

  // Filters
  const [searchTerm, setSearchTerm] = React.useState(queryCode || "");
  const [statusFilter, setStatusFilter] = React.useState<string>("all");
  const [typeFilter, setTypeFilter] = React.useState<string>("all");
  const [dateFilter, setDateFilter] = React.useState<string>("");

  // Pagination
  const [currentPage, setCurrentPage] = React.useState(1);
  const pageSize = 10;

  // Selected Pickup for Detail/Edit Modal
  const [selectedPickup, setSelectedPickup] = React.useState<Pickup | null>(null);
  const [editStatus, setEditStatus] = React.useState<PickupStatus>("pending");
  const [assignedTo, setAssignedTo] = React.useState<string>("");
  const [adminNotes, setAdminNotes] = React.useState<string>("");
  const [itemWeights, setItemWeights] = React.useState<Record<string, number>>({});
  const [finalAmount, setFinalAmount] = React.useState<number | "">("");
  const [isSaving, setIsSaving] = React.useState(false);

  // Auto-open modal if queryCode matches
  React.useEffect(() => {
    if (queryCode) {
      const match = pickups.find((p) => p.booking_code === queryCode);
      if (match) openDetailModal(match);
    }
  }, [queryCode, pickups]);

  // Filtered Pickups
  const filteredPickups = React.useMemo(() => {
    return pickups.filter((p) => {
      const q = searchTerm.toLowerCase();
      const matchesSearch =
        p.booking_code.toLowerCase().includes(q) ||
        (p.user?.full_name && p.user.full_name.toLowerCase().includes(q)) ||
        (p.user?.phone && p.user.phone.toLowerCase().includes(q)) ||
        (p.address_snapshot?.pincode && p.address_snapshot.pincode.includes(q)) ||
        (p.address_snapshot?.area && p.address_snapshot.area.toLowerCase().includes(q));

      const matchesStatus = statusFilter === "all" || p.status === statusFilter;
      const matchesType = typeFilter === "all" || p.pickup_type === typeFilter;
      const matchesDate = !dateFilter || p.slot_date === dateFilter;

      return matchesSearch && matchesStatus && matchesType && matchesDate;
    });
  }, [pickups, searchTerm, statusFilter, typeFilter, dateFilter]);

  // Paginated items
  const totalPages = Math.ceil(filteredPickups.length / pageSize) || 1;
  const paginatedPickups = React.useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredPickups.slice(start, start + pageSize);
  }, [filteredPickups, currentPage]);

  const openDetailModal = (pickup: Pickup) => {
    setSelectedPickup(pickup);
    setEditStatus(pickup.status);
    setAssignedTo(pickup.assigned_to || "");
    setAdminNotes(pickup.admin_notes || "");
    setFinalAmount(pickup.final_amount ?? "");

    // Populate item weights
    const weights: Record<string, number> = {};
    if (pickup.items) {
      pickup.items.forEach((it) => {
        weights[it.id] = it.actual_weight ?? it.approx_weight;
      });
    }
    setItemWeights(weights);
  };

  // Recalculate estimated final amount based on actual weights
  const calculateTotalFromWeights = () => {
    if (!selectedPickup?.items) return;
    let sum = 0;
    selectedPickup.items.forEach((it) => {
      const w = itemWeights[it.id] || 0;
      const rate = Number(it.item?.rate_per_unit) || 0;
      sum += w * rate;
    });
    setFinalAmount(Math.round(sum));
    toast.info(`Calculated final amount: ${formatCurrency(sum)}`);
  };

  const handleSaveModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPickup) return;
    setIsSaving(true);

    const itemsPayload = selectedPickup.items?.map((it) => {
      const actWeight = itemWeights[it.id] ?? null;
      const rate = Number(it.item?.rate_per_unit) || 0;
      const amt = actWeight !== null ? Math.round(actWeight * rate) : null;
      return {
        id: it.id,
        actual_weight: actWeight,
        amount: amt,
      };
    });

    const res = await updatePickupByAdmin({
      pickupId: selectedPickup.id,
      status: editStatus,
      assigned_to: assignedTo,
      admin_notes: adminNotes,
      final_amount: finalAmount === "" ? null : Number(finalAmount),
      items: itemsPayload,
    });

    setIsSaving(false);
    if (res.success) {
      toast.success(res.message);
      setSelectedPickup(null);
      router.refresh();
    } else {
      toast.error(res.error || "Failed to update pickup.");
    }
  };

  // CSV Export Handler
  const handleExportCSV = () => {
    if (filteredPickups.length === 0) {
      toast.error("No pickups to export");
      return;
    }

    const headers = [
      "Booking Code",
      "Type",
      "Status",
      "Slot Date",
      "Slot Time",
      "Customer Name",
      "Customer Phone",
      "Area",
      "Pincode",
      "Assigned To",
      "Final Amount",
      "Created At",
    ];

    const rows = filteredPickups.map((p) => [
      `"${p.booking_code}"`,
      `"${p.pickup_type}"`,
      `"${p.status}"`,
      `"${p.slot_date}"`,
      `"${p.slot_time}"`,
      `"${p.user?.full_name || p.address_snapshot?.name || ""}"`,
      `"${p.user?.phone || p.address_snapshot?.phone || ""}"`,
      `"${p.address_snapshot?.area || ""}"`,
      `"${p.address_snapshot?.pincode || ""}"`,
      `"${p.assigned_to || ""}"`,
      `"${p.final_amount ?? ""}"`,
      `"${p.created_at}"`,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `reflection_pickups_${new Date().toISOString().split("T")[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("CSV export downloaded successfully!");
  };

  return (
    <div className="space-y-6">
      {/* Search & Filter Bar */}
      <div className="p-4 sm:p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
            <Input
              type="text"
              placeholder="Search code, customer name, phone, area, pincode..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-10 bg-slate-900 border-slate-700 text-white placeholder:text-slate-500 text-xs"
            />
          </div>

          {/* Export Button */}
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleExportCSV}
              className="h-10 gap-1.5 text-xs bg-slate-900 text-slate-200 border-slate-700 hover:bg-slate-800 font-bold"
            >
              <FileSpreadsheet className="h-4 w-4 text-emerald-400" />
              <span>Export CSV ({filteredPickups.length})</span>
            </Button>
          </div>
        </div>

        {/* Filter Chips */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1 border-t border-slate-800 text-xs">
          <div>
            <Label className="text-[10px] uppercase font-bold text-slate-400 mb-1 block">
              Status Filter
            </Label>
            <Select value={statusFilter} onValueChange={(val) => setStatusFilter(val)}>
              <SelectTrigger className="h-9 bg-slate-900 border-slate-700 text-white text-xs">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent className="bg-slate-900 border-slate-700 text-white text-xs">
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="picked_up">Picked Up</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-[10px] uppercase font-bold text-slate-400 mb-1 block">
              Pickup Type
            </Label>
            <Select value={typeFilter} onValueChange={(val) => setTypeFilter(val)}>
              <SelectTrigger className="h-9 bg-slate-900 border-slate-700 text-white text-xs">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent className="bg-slate-900 border-slate-700 text-white text-xs">
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="doorstep">Doorstep Pickup</SelectItem>
                <SelectItem value="dropoff">Yard Drop-off</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-[10px] uppercase font-bold text-slate-400 mb-1 block">
              Slot Date
            </Label>
            <Input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="h-9 bg-slate-900 border-slate-700 text-white text-xs"
            />
          </div>
        </div>
      </div>

      {/* Pickups Table */}
      <div className="rounded-2xl border border-slate-800 bg-slate-950 overflow-hidden shadow-subtle">
        <Table>
          <TableHeader className="bg-slate-900/80">
            <TableRow className="border-slate-800 hover:bg-slate-900">
              <TableHead className="text-slate-400 font-bold text-xs">Booking Code</TableHead>
              <TableHead className="text-slate-400 font-bold text-xs">Customer</TableHead>
              <TableHead className="text-slate-400 font-bold text-xs">Date & Slot</TableHead>
              <TableHead className="text-slate-400 font-bold text-xs">Area / Type</TableHead>
              <TableHead className="text-slate-400 font-bold text-xs">Status</TableHead>
              <TableHead className="text-slate-400 font-bold text-xs">Staff Assigned</TableHead>
              <TableHead className="text-slate-400 font-bold text-xs text-right">Payout</TableHead>
              <TableHead className="text-slate-400 font-bold text-xs text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedPickups.length > 0 ? (
              paginatedPickups.map((pickup) => (
                <TableRow
                  key={pickup.id}
                  className="border-slate-800/80 hover:bg-slate-900/60 transition-colors"
                >
                  <TableCell className="font-mono font-bold text-xs text-sky-400">
                    {pickup.booking_code}
                  </TableCell>
                  <TableCell className="text-xs">
                    <span className="font-semibold text-white block">
                      {pickup.user?.full_name || pickup.address_snapshot?.name || "Customer"}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      {pickup.user?.phone || pickup.address_snapshot?.phone || "—"}
                    </span>
                  </TableCell>
                  <TableCell className="text-xs text-slate-300">
                    <span className="block font-medium">{pickup.slot_date}</span>
                    <span className="text-[11px] text-slate-500">{pickup.slot_time}</span>
                  </TableCell>
                  <TableCell className="text-xs">
                    <span className="font-medium text-slate-200 block">
                      {pickup.address_snapshot?.area || "MIDC Yard"}
                    </span>
                    <span className="text-[10px] text-slate-400 uppercase font-bold">
                      {pickup.pickup_type}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        pickup.status === "completed"
                          ? "success"
                          : pickup.status === "cancelled"
                          ? "destructive"
                          : pickup.status === "pending"
                          ? "warning"
                          : "blue"
                      }
                      className="text-[10px] capitalize"
                    >
                      {pickup.status.replace("_", " ")}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs text-slate-300">
                    {pickup.assigned_to || <span className="text-slate-600">—</span>}
                  </TableCell>
                  <TableCell className="text-xs font-bold text-right text-emerald-400">
                    {pickup.final_amount !== null ? formatCurrency(pickup.final_amount) : "—"}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => openDetailModal(pickup)}
                      className="h-8 text-xs border-slate-700 bg-slate-900 text-slate-200 hover:bg-slate-800"
                    >
                      <Edit3 className="h-3.5 w-3.5 mr-1" />
                      <span>Manage</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-10 text-slate-500 text-xs">
                  No pickups match current search & filter criteria.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {/* Pagination Bar */}
        <div className="p-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>
            Showing {(currentPage - 1) * pageSize + 1} to{" "}
            {Math.min(currentPage * pageSize, filteredPickups.length)} of{" "}
            {filteredPickups.length} entries
          </span>
          <div className="flex items-center gap-1">
            <Button
              size="sm"
              variant="outline"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => p - 1)}
              className="h-7 text-xs border-slate-700 bg-slate-900 text-slate-300"
            >
              Prev
            </Button>
            <span className="px-2 text-xs">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              size="sm"
              variant="outline"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
              className="h-7 text-xs border-slate-700 bg-slate-900 text-slate-300"
            >
              Next
            </Button>
          </div>
        </div>
      </div>

      {/* DETAIL & STATUS MANAGEMENT DIALOG */}
      {selectedPickup && (
        <Dialog open={!!selectedPickup} onOpenChange={() => setSelectedPickup(null)}>
          <DialogContent className="max-w-2xl bg-slate-950 border-slate-800 text-white">
            <DialogHeader>
              <div className="flex items-center justify-between pr-4">
                <DialogTitle className="text-xl font-bold font-mono text-sky-400">
                  {selectedPickup.booking_code}
                </DialogTitle>
                <Badge variant="blue" className="capitalize text-xs">
                  {selectedPickup.status.replace("_", " ")}
                </Badge>
              </div>
              <DialogDescription className="text-slate-400 text-xs">
                Update collection progress, assign staff, enter verified scale weights, and issue final settlement.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSaveModal} className="space-y-5 pt-3">
              {/* Status Transition & Staff Assignment */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs">
                <div className="space-y-1.5">
                  <Label htmlFor="status_select" className="text-slate-300 text-xs font-bold">
                    Update Status Flow *
                  </Label>
                  <Select
                    value={editStatus}
                    onValueChange={(val: PickupStatus) => setEditStatus(val)}
                  >
                    <SelectTrigger id="status_select" className="bg-slate-950 border-slate-700 text-white h-10">
                      <SelectValue placeholder="Change status" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 border-slate-700 text-white">
                      <SelectItem value="pending">pending (new request)</SelectItem>
                      <SelectItem value="confirmed">confirmed (time locked)</SelectItem>
                      <SelectItem value="scheduled">scheduled (staff dispatched)</SelectItem>
                      <SelectItem value="picked_up">picked_up (weighed on spot)</SelectItem>
                      <SelectItem value="completed">completed (payment settled)</SelectItem>
                      <SelectItem value="cancelled">cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="assigned_staff" className="text-slate-300 text-xs font-bold">
                    Assign Staff Name
                  </Label>
                  <Input
                    id="assigned_staff"
                    value={assignedTo}
                    onChange={(e) => setAssignedTo(e.target.value)}
                    placeholder="e.g. Ramesh Naik (Driver/Weigher)"
                    className="bg-slate-950 border-slate-700 text-white h-10 text-xs"
                  />
                </div>
              </div>

              {/* Items & Actual Weight Measurement */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-slate-300 text-xs font-bold uppercase tracking-wider">
                    Actual Weights & Scale Measurements
                  </Label>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={calculateTotalFromWeights}
                    className="text-[11px] h-7 border-slate-700 bg-slate-900 text-slate-300"
                  >
                    Auto-Calculate Amount
                  </Button>
                </div>

                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {selectedPickup.items?.map((it) => (
                    <div
                      key={it.id}
                      className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="flex-1">
                        <span className="font-bold text-white block">
                          {it.item?.name || it.notes || "Scrap Item"}
                        </span>
                        <span className="text-[11px] text-slate-400">
                          Approx: {it.approx_weight} {it.item?.unit || "kg"} @{" "}
                          {it.item?.rate_per_unit
                            ? `${formatCurrency(it.item.rate_per_unit)}/${it.item.unit}`
                            : "Market rate"}
                        </span>
                      </div>

                      <div className="w-36 flex items-center gap-1.5">
                        <Label className="text-[10px] text-slate-400">Actual:</Label>
                        <Input
                          type="number"
                          step="0.1"
                          value={itemWeights[it.id] ?? ""}
                          onChange={(e) =>
                            setItemWeights({
                              ...itemWeights,
                              [it.id]: parseFloat(e.target.value) || 0,
                            })
                          }
                          className="h-8 bg-slate-950 border-slate-700 text-white text-xs font-bold"
                          placeholder="kg"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Final Amount & Notes */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="final_amt" className="text-slate-300 text-xs font-bold">
                    Final Settled Amount (₹ INR)
                  </Label>
                  <Input
                    id="final_amt"
                    type="number"
                    value={finalAmount}
                    onChange={(e) =>
                      setFinalAmount(e.target.value === "" ? "" : parseFloat(e.target.value) || 0)
                    }
                    placeholder="e.g. 2450"
                    className="bg-slate-950 border-slate-700 text-emerald-400 font-bold h-10 text-base"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="admin_note" className="text-slate-300 text-xs font-bold">
                    Internal Admin Notes
                  </Label>
                  <Input
                    id="admin_note"
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    placeholder="e.g. Paid via UPI, transaction ID: 12345"
                    className="bg-slate-950 border-slate-700 text-white text-xs h-10"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-800">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedPickup(null)}
                  className="border-slate-700 bg-slate-900 text-slate-300"
                >
                  Cancel
                </Button>
                <Button type="submit" size="sm" disabled={isSaving} className="font-bold bg-brand-blue">
                  {isSaving ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-1.5" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <span>Save Pickup Updates</span>
                  )}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
