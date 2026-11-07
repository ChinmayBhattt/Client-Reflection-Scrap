"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  CalendarCheck,
  Plus,
  Trash2,
  MapPin,
  Clock,
  Camera,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ArrowRight,
  ArrowLeft,
  Loader2,
  Building,
  Truck,
  MessageCircle,
  Share2,
  ShieldCheck,
  UploadCloud,
  X,
} from "lucide-react";
import { ScrapCategory, ScrapItem, Address } from "@/lib/types/database";
import { SITE_CONFIG } from "@/lib/site-config";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { checkPincode, submitBooking, BookingInput } from "./actions";

interface BookingWizardProps {
  categories: ScrapCategory[];
  items: (ScrapItem & { category?: ScrapCategory })[];
  savedAddresses: Address[];
  preselectedItemId?: string;
  preselectedQty?: number;
}

interface ItemRow {
  rowId: string;
  itemId: string;
  approxWeight: number;
  notes: string;
}

export function BookingWizard({
  categories,
  items,
  savedAddresses,
  preselectedItemId,
  preselectedQty,
}: BookingWizardProps) {
  const router = useRouter();

  // Mode: doorstep vs dropoff
  const [pickupType, setPickupType] = React.useState<"doorstep" | "dropoff">("doorstep");

  // Step: 1 (Items) -> 2 (Address/Yard) -> 3 (Schedule) -> 4 (Photos) -> 5 (Review) -> 6 (Success)
  const [step, setStep] = React.useState<number>(1);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [successBookingCode, setSuccessBookingCode] = React.useState<string | null>(null);

  // 1. Scrap Items State
  const [itemRows, setItemRows] = React.useState<ItemRow[]>([
    {
      rowId: "row-1",
      itemId: preselectedItemId || items[0]?.id || "",
      approxWeight: preselectedQty || 10,
      notes: "",
    },
  ]);

  // 2. Address State
  const [selectedAddressId, setSelectedAddressId] = React.useState<string>(
    savedAddresses.find((a) => a.is_default)?.id || savedAddresses[0]?.id || "new"
  );
  const [newAddress, setNewAddress] = React.useState({
    name: "",
    phone: "",
    line1: "",
    area: "",
    landmark: "",
    pincode: "",
    save_address: true,
  });
  const [pincodeStatus, setPincodeStatus] = React.useState<{
    checked: boolean;
    serviceable: boolean;
    areaName?: string;
  }>({ checked: false, serviceable: false });
  const [checkingPincode, setCheckingPincode] = React.useState(false);

  // 3. Schedule State (Today to 14 days ahead)
  const minDate = new Date().toISOString().split("T")[0];
  const maxDate = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split("T")[0];
  const [slotDate, setSlotDate] = React.useState<string>(minDate);
  const [slotTime, setSlotTime] = React.useState<string>(SITE_CONFIG.timeSlots[0].label);

  // 4. Photos State (Max 5 photos, max 5MB each)
  const [selectedPhotos, setSelectedPhotos] = React.useState<{ file: File; preview: string }[]>([]);

  // Item helpers
  const addItemRow = () => {
    setItemRows((prev) => [
      ...prev,
      {
        rowId: `row-${Date.now()}`,
        itemId: items[0]?.id || "",
        approxWeight: 5,
        notes: "",
      },
    ]);
  };

  const removeItemRow = (rowId: string) => {
    if (itemRows.length <= 1) {
      toast.error("You must include at least one scrap item.");
      return;
    }
    setItemRows((prev) => prev.filter((r) => r.rowId !== rowId));
  };

  const updateItemRow = (rowId: string, field: keyof ItemRow, value: unknown) => {
    setItemRows((prev) =>
      prev.map((r) => (r.rowId === rowId ? { ...r, [field]: value } : r))
    );
  };

  // Calculate total estimated payout
  const totalEstimatedValue = React.useMemo(() => {
    return itemRows.reduce((sum, row) => {
      const it = items.find((i) => i.id === row.itemId);
      const rate = Number(it?.rate_per_unit) || 0;
      return sum + rate * (row.approxWeight || 0);
    }, 0);
  }, [itemRows, items]);

  const totalEstimatedWeight = React.useMemo(() => {
    return itemRows.reduce((sum, row) => sum + (row.approxWeight || 0), 0);
  }, [itemRows]);

  // Pincode Verification Handler
  const verifyPincode = async (pin: string) => {
    if (pin.length !== 6) return;
    setCheckingPincode(true);
    const res = await checkPincode(pin);
    setPincodeStatus({
      checked: true,
      serviceable: res.isServiceable,
      areaName: res.areaName,
    });
    setCheckingPincode(false);
  };

  // Photo Upload Handler
  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newPhotos: { file: File; preview: string }[] = [];
    const maxFiles = 5 - selectedPhotos.length;

    for (let i = 0; i < Math.min(files.length, maxFiles); i++) {
      const file = files[i];
      if (!file.type.startsWith("image/")) {
        toast.error(`${file.name} is not an image file.`);
        continue;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`${file.name} exceeds 5 MB size limit.`);
        continue;
      }
      newPhotos.push({
        file,
        preview: URL.createObjectURL(file),
      });
    }

    setSelectedPhotos((prev) => [...prev, ...newPhotos]);
    e.target.value = "";
  };

  const removePhoto = (index: number) => {
    setSelectedPhotos((prev) => {
      URL.revokeObjectURL(prev[index].preview);
      return prev.filter((_, i) => i !== index);
    });
  };

  // Step Progression Validation
  const handleNextStep = async () => {
    if (step === 1) {
      if (itemRows.length === 0) {
        toast.error("Please add at least one scrap item.");
        return;
      }
      const invalid = itemRows.find((r) => !r.itemId || r.approxWeight <= 0);
      if (invalid) {
        toast.error("Please verify weight for all selected scrap items.");
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (pickupType === "doorstep") {
        if (selectedAddressId === "new") {
          if (!newAddress.name || !newAddress.phone || !newAddress.line1 || !newAddress.area || !newAddress.pincode) {
            toast.error("Please fill in all required address fields.");
            return;
          }
          if (newAddress.pincode.length !== 6) {
            toast.error("Please enter a valid 6-digit Mumbai pincode.");
            return;
          }
          if (!pincodeStatus.checked) {
            await verifyPincode(newAddress.pincode);
          }
          if (!pincodeStatus.serviceable) {
            toast.error("The entered pincode is currently outside our direct service area.");
            return;
          }
        }
      }
      setStep(3);
    } else if (step === 3) {
      if (!slotDate || !slotTime) {
        toast.error("Please choose a pickup date and time slot.");
        return;
      }
      setStep(4);
    } else if (step === 4) {
      setStep(5);
    }
  };

  // Final Submit Handler
  const handleFinalSubmit = async () => {
    setIsSubmitting(true);

    try {
      // Determine chosen address
      let chosenAddress = null;
      if (pickupType === "doorstep") {
        if (selectedAddressId === "new") {
          chosenAddress = newAddress;
        } else {
          const saved = savedAddresses.find((a) => a.id === selectedAddressId);
          if (saved) {
            chosenAddress = {
              name: saved.name,
              phone: saved.phone,
              line1: saved.line1,
              area: saved.area,
              landmark: saved.landmark || undefined,
              pincode: saved.pincode,
              save_address: false,
            };
          }
        }
      }

      // Format items
      const payloadItems = itemRows.map((r) => {
        const itemInfo = items.find((i) => i.id === r.itemId);
        return {
          item_id: r.itemId,
          name: itemInfo?.name || "Scrap Item",
          unit: itemInfo?.unit || "kg",
          rate_per_unit: Number(itemInfo?.rate_per_unit) || 0,
          approx_weight: Number(rowWeight(r)),
          notes: r.notes || "",
        };
      });

      const payload: BookingInput = {
        pickup_type: pickupType,
        address: chosenAddress || undefined,
        slot_date: slotDate,
        slot_time: slotTime,
        items: payloadItems,
        photos: selectedPhotos.map((p) => p.file.name),
      };

      const res = await submitBooking(payload);

      if (res.success && res.bookingCode) {
        setSuccessBookingCode(res.bookingCode);
        setStep(6);
        toast.success(res.message || "Booking successfully created!");
      } else {
        toast.error(res.error || "Failed to confirm booking.");
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Error confirming booking";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  function rowWeight(row: ItemRow): number {
    return Number(row.approxWeight) || 0;
  }

  // -------------------------------------------------------------
  // SUCCESS SCREEN (Step 6)
  // -------------------------------------------------------------
  if (step === 6 && successBookingCode) {
    const whatsappShareMsg = `Hello Reflection Scrap Solutions LLP, I have booked a scrap pickup.\n\nBooking ID: ${successBookingCode}\nType: ${
      pickupType === "doorstep" ? "Doorstep Pickup" : "Drop-off at MIDC Yard"
    }\nDate: ${slotDate}\nTime: ${slotTime}\nEstimated Weight: ~${totalEstimatedWeight} kg\n\nPlease confirm my schedule.`;

    const whatsappUrl = `https://wa.me/${SITE_CONFIG.contact.whatsappRaw}?text=${encodeURIComponent(
      whatsappShareMsg
    )}`;

    return (
      <Card className="rounded-3xl border border-brand-border bg-white shadow-elevated p-8 md:p-12 max-w-2xl mx-auto text-center space-y-8 animate-in zoom-in-95 duration-200">
        <div className="h-20 w-20 rounded-full bg-brand-green-light text-brand-green flex items-center justify-center mx-auto shadow-subtle">
          <CheckCircle2 className="h-10 w-10" />
        </div>

        <div className="space-y-3">
          <Badge variant="success" className="px-3.5 py-1 text-xs font-bold uppercase tracking-wider">
            Booking Confirmed
          </Badge>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-brand-dark">
            Pickup Request Received!
          </h1>
          <p className="text-sm text-brand-muted max-w-md mx-auto leading-relaxed">
            Your booking reference has been registered in our system. Our MIDC
            team will review your slot and contact you shortly.
          </p>
        </div>

        {/* Booking ID Banner */}
        <div className="rounded-2xl bg-brand-bg border border-brand-border p-6 space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-muted block">
            Your Booking Reference ID
          </span>
          <span className="text-3xl font-black text-brand-blue tracking-wider font-mono">
            {successBookingCode}
          </span>
          <div className="pt-2 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs text-brand-dark">
            <span>
              <strong>Date:</strong> {slotDate}
            </span>
            <span>•</span>
            <span>
              <strong>Slot:</strong> {slotTime}
            </span>
            <span>•</span>
            <span>
              <strong>Type:</strong>{" "}
              {pickupType === "doorstep" ? "Doorstep Pickup" : "Yard Drop-off"}
            </span>
          </div>
        </div>

        {/* WhatsApp Share Button */}
        <div className="space-y-3">
          <Button asChild size="xl" className="w-full bg-[#25D366] hover:bg-[#20ba59] text-white font-bold gap-2.5 shadow-card">
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
              <MessageCircle className="h-5 w-5" />
              <span>Share & Confirm on WhatsApp</span>
            </a>
          </Button>

          <Button asChild variant="outline" size="lg" className="w-full">
            <Link href="/dashboard">
              <span>View in My Pickups Dashboard</span>
              <ArrowRight className="h-4 w-4 ml-2" />
            </Link>
          </Button>
        </div>
      </Card>
    );
  }

  // -------------------------------------------------------------
  // MULTI-STEP WIZARD (Steps 1 to 5)
  // -------------------------------------------------------------
  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Pickup Type Toggle (Doorstep vs Yard Drop-off) */}
      <div className="grid grid-cols-2 gap-3 p-1.5 rounded-2xl bg-gray-100 border border-brand-border">
        <button
          type="button"
          onClick={() => setPickupType("doorstep")}
          className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-sm transition-all duration-150 ${
            pickupType === "doorstep"
              ? "bg-white text-brand-dark shadow-sm border border-brand-border"
              : "text-brand-muted hover:text-brand-dark"
          }`}
        >
          <Truck className="h-4 w-4 text-brand-blue" />
          <span>Doorstep Pickup (Mumbai)</span>
        </button>

        <button
          type="button"
          onClick={() => setPickupType("dropoff")}
          className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-sm transition-all duration-150 ${
            pickupType === "dropoff"
              ? "bg-white text-brand-dark shadow-sm border border-brand-border"
              : "text-brand-muted hover:text-brand-dark"
          }`}
        >
          <Building className="h-4 w-4 text-brand-green" />
          <span>Drop-off at MIDC Yard</span>
        </button>
      </div>

      {/* Step Indicator */}
      <div className="flex items-center justify-between px-2">
        {[
          { num: 1, label: "Items" },
          { num: 2, label: pickupType === "doorstep" ? "Address" : "Yard Info" },
          { num: 3, label: "Schedule" },
          { num: 4, label: "Photos" },
          { num: 5, label: "Review" },
        ].map((s) => (
          <div key={s.num} className="flex items-center gap-2">
            <div
              className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                step === s.num
                  ? "bg-brand-blue text-white ring-4 ring-brand-blue-light"
                  : step > s.num
                  ? "bg-brand-green text-white"
                  : "bg-gray-200 text-brand-muted"
              }`}
            >
              {step > s.num ? "✓" : s.num}
            </div>
            <span
              className={`hidden sm:inline text-xs font-bold ${
                step === s.num ? "text-brand-dark" : "text-brand-muted"
              }`}
            >
              {s.label}
            </span>
          </div>
        ))}
      </div>

      {/* --------------------------------------------------------- */}
      {/* STEP 1: SCRAP ITEMS */}
      {/* --------------------------------------------------------- */}
      {step === 1 && (
        <Card className="rounded-3xl border border-brand-border bg-white shadow-card p-6 md:p-8 space-y-6">
          <div className="flex items-center justify-between border-b border-brand-border pb-4">
            <div>
              <CardTitle className="text-xl font-bold text-brand-dark">
                Step 1: What scrap materials do you have?
              </CardTitle>
              <p className="text-xs text-brand-muted mt-0.5">
                Add one or more items. You can refine weights with our team at weighing time.
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addItemRow}
              className="gap-1.5 text-xs font-bold"
            >
              <Plus className="h-3.5 w-3.5 text-brand-blue" />
              <span>Add Item</span>
            </Button>
          </div>

          <div className="space-y-4">
            {itemRows.map((row, index) => {
              const selectedItem = items.find((i) => i.id === row.itemId);
              const rowTotal =
                (Number(selectedItem?.rate_per_unit) || 0) * (row.approxWeight || 0);

              return (
                <div
                  key={row.rowId}
                  className="p-4 rounded-2xl border border-brand-border bg-brand-bg/40 space-y-3 relative group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-brand-blue uppercase tracking-wider">
                      Item #{index + 1}
                    </span>
                    {itemRows.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeItemRow(row.rowId)}
                        className="text-gray-400 hover:text-red-600 transition-colors p-1"
                        aria-label="Remove item"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
                    {/* Item Select */}
                    <div className="md:col-span-6 space-y-1">
                      <Label className="text-xs">Material / Item *</Label>
                      <Select
                        value={row.itemId}
                        onValueChange={(val) => updateItemRow(row.rowId, "itemId", val)}
                      >
                        <SelectTrigger className="bg-white">
                          <SelectValue placeholder="Select scrap item" />
                        </SelectTrigger>
                        <SelectContent>
                          {items.map((it) => (
                            <SelectItem key={it.id} value={it.id}>
                              {it.name} ({it.category?.name})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Approx Weight */}
                    <div className="md:col-span-3 space-y-1">
                      <Label className="text-xs">
                        Approx Weight ({selectedItem?.unit || "kg"}) *
                      </Label>
                      <div className="relative">
                        <Input
                          type="number"
                          min="0.5"
                          step="0.5"
                          value={row.approxWeight || ""}
                          onChange={(e) =>
                            updateItemRow(
                              row.rowId,
                              "approxWeight",
                              parseFloat(e.target.value) || 0
                            )
                          }
                          placeholder="e.g. 10"
                          className="bg-white pr-10 font-bold"
                        />
                        <span className="absolute right-3 top-3 text-xs text-brand-muted font-bold uppercase">
                          {selectedItem?.unit || "kg"}
                        </span>
                      </div>
                    </div>

                    {/* Rate preview & Row Total */}
                    <div className="md:col-span-3 space-y-1">
                      <Label className="text-xs">Estimated Value</Label>
                      <div className="h-11 px-3.5 rounded-lg bg-white border border-brand-border flex items-center justify-between text-xs font-bold text-brand-dark">
                        <span className="text-brand-muted text-[11px]">
                          {selectedItem?.rate_per_unit
                            ? `${formatCurrency(selectedItem.rate_per_unit)}/${selectedItem.unit}`
                            : "Market Linked"}
                        </span>
                        <span>
                          {rowTotal > 0 ? formatCurrency(rowTotal) : "—"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Optional Notes */}
                  <div className="pt-1">
                    <Input
                      type="text"
                      placeholder="Optional notes (e.g. in 2 cardboard boxes, 3rd floor, copper armature only)..."
                      value={row.notes}
                      onChange={(e) => updateItemRow(row.rowId, "notes", e.target.value)}
                      className="bg-white text-xs h-9"
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Running Totals Strip */}
          <div className="p-4 rounded-2xl bg-brand-blue-light/50 border border-brand-blue/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-brand-muted">
                Estimated Summary
              </span>
              <p className="text-sm font-bold text-brand-dark">
                {itemRows.length} item categories • ~{totalEstimatedWeight} kg total
              </p>
            </div>
            <div className="text-right">
              <span className="text-xs uppercase font-bold text-brand-muted">
                Est. Total Payout
              </span>
              <div className="text-2xl font-black text-brand-blue">
                {totalEstimatedValue > 0 ? formatCurrency(totalEstimatedValue) : "Market Linked"}
              </div>
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <Button size="lg" onClick={handleNextStep} className="gap-2 font-bold">
              <span>Continue to Step 2</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </Card>
      )}

      {/* --------------------------------------------------------- */}
      {/* STEP 2: ADDRESS (Doorstep) or YARD INFO (Dropoff) */}
      {/* --------------------------------------------------------- */}
      {step === 2 && (
        <Card className="rounded-3xl border border-brand-border bg-white shadow-card p-6 md:p-8 space-y-6">
          <div className="border-b border-brand-border pb-4">
            <CardTitle className="text-xl font-bold text-brand-dark">
              {pickupType === "doorstep"
                ? "Step 2: Where should we collect your scrap?"
                : "Step 2: Drop-off Location & Hours"}
            </CardTitle>
            <p className="text-xs text-brand-muted mt-0.5">
              {pickupType === "doorstep"
                ? "Provide your Mumbai address and postal pincode for direct doorstep collection."
                : "Bring your scrap directly to our MIDC facility during operational hours."}
            </p>
          </div>

          {pickupType === "doorstep" ? (
            <div className="space-y-6">
              {/* Saved Addresses Selector (if user has saved addresses) */}
              {savedAddresses.length > 0 && (
                <div className="space-y-3">
                  <Label className="text-xs font-bold uppercase tracking-wider">
                    Select a Saved Address
                  </Label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {savedAddresses.map((addr) => (
                      <div
                        key={addr.id}
                        onClick={() => setSelectedAddressId(addr.id)}
                        className={`p-4 rounded-xl border cursor-pointer transition-all ${
                          selectedAddressId === addr.id
                            ? "border-brand-blue bg-brand-blue-light/30 ring-2 ring-brand-blue"
                            : "border-brand-border bg-white hover:border-gray-300"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-xs text-brand-dark">
                            {addr.label || "Address"}
                          </span>
                          {addr.is_default && (
                            <Badge variant="blue" className="text-[10px]">
                              Default
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs font-semibold text-brand-dark mt-1">
                          {addr.name} ({addr.phone})
                        </p>
                        <p className="text-xs text-brand-muted mt-0.5">
                          {addr.line1}, {addr.area}, {addr.pincode}
                        </p>
                      </div>
                    ))}

                    <div
                      onClick={() => setSelectedAddressId("new")}
                      className={`p-4 rounded-xl border border-dashed cursor-pointer flex items-center justify-center text-xs font-bold gap-2 ${
                        selectedAddressId === "new"
                          ? "border-brand-blue bg-brand-blue-light text-brand-blue"
                          : "border-gray-300 text-brand-muted hover:border-brand-blue"
                      }`}
                    >
                      <Plus className="h-4 w-4" />
                      <span>Use a Different Address</span>
                    </div>
                  </div>
                </div>
              )}

              {/* New Address Form */}
              {(selectedAddressId === "new" || savedAddresses.length === 0) && (
                <div className="space-y-4 pt-2">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="contact_name">Contact Person *</Label>
                      <Input
                        id="contact_name"
                        value={newAddress.name}
                        onChange={(e) =>
                          setNewAddress({ ...newAddress, name: e.target.value })
                        }
                        placeholder="e.g. Amit Verma"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="contact_phone">Contact Phone *</Label>
                      <Input
                        id="contact_phone"
                        type="tel"
                        value={newAddress.phone}
                        onChange={(e) =>
                          setNewAddress({ ...newAddress, phone: e.target.value })
                        }
                        placeholder="e.g. 98200 12345"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="line1">Flat / Building / Street *</Label>
                    <Input
                      id="line1"
                      value={newAddress.line1}
                      onChange={(e) =>
                        setNewAddress({ ...newAddress, line1: e.target.value })
                      }
                      placeholder="e.g. Flat 402, Lotus Grand, Road No. 8"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-1.5 sm:col-span-1">
                      <Label htmlFor="area">Area / Locality *</Label>
                      <Input
                        id="area"
                        value={newAddress.area}
                        onChange={(e) =>
                          setNewAddress({ ...newAddress, area: e.target.value })
                        }
                        placeholder="e.g. MIDC Andheri East"
                      />
                    </div>

                    <div className="space-y-1.5 sm:col-span-1">
                      <Label htmlFor="landmark">Landmark (Optional)</Label>
                      <Input
                        id="landmark"
                        value={newAddress.landmark}
                        onChange={(e) =>
                          setNewAddress({ ...newAddress, landmark: e.target.value })
                        }
                        placeholder="e.g. Near Seepz Gate"
                      />
                    </div>

                    <div className="space-y-1.5 sm:col-span-1">
                      <Label htmlFor="pincode">Mumbai Pincode *</Label>
                      <div className="relative">
                        <Input
                          id="pincode"
                          value={newAddress.pincode}
                          maxLength={6}
                          onChange={(e) => {
                            const val = e.target.value.replace(/\D/g, "");
                            setNewAddress({ ...newAddress, pincode: val });
                            if (val.length === 6) {
                              verifyPincode(val);
                            } else {
                              setPincodeStatus({ checked: false, serviceable: false });
                            }
                          }}
                          placeholder="e.g. 400093"
                          className="font-bold"
                        />
                        {checkingPincode && (
                          <Loader2 className="absolute right-3 top-3 h-4 w-4 animate-spin text-brand-blue" />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Pincode Serviceability Feedback */}
                  {pincodeStatus.checked && (
                    <div>
                      {pincodeStatus.serviceable ? (
                        <div className="p-3.5 rounded-xl bg-brand-green-light border border-brand-green/30 text-xs text-brand-green font-semibold flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 shrink-0" />
                          <span>
                            Great! Pincode {newAddress.pincode} is in our direct service area (
                            {pincodeStatus.areaName || "Mumbai"}).
                          </span>
                        </div>
                      ) : (
                        <div className="p-4 rounded-xl bg-amber-50 border border-amber-300 text-xs text-amber-900 space-y-2">
                          <div className="flex items-center gap-2 font-bold">
                            <AlertCircle className="h-4 w-4 text-amber-600 shrink-0" />
                            <span>Pincode currently outside automated scheduling</span>
                          </div>
                          <p>
                            We currently cover central and western suburbs like MIDC,
                            Andheri East, Marol, Saki Naka, and Powai. You can coordinate
                            custom bulk collections or drop off scrap at our yard.
                          </p>
                          <a
                            href={`https://wa.me/${SITE_CONFIG.contact.whatsappRaw}?text=${encodeURIComponent(
                              `Hello, I would like to check scrap collection for pincode ${newAddress.pincode}.`
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 font-bold text-brand-green hover:underline pt-1"
                          >
                            <MessageCircle className="h-3.5 w-3.5" />
                            <span>Ask on WhatsApp for custom route</span>
                          </a>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            /* Drop-off at MIDC Yard Info */
            <div className="rounded-2xl bg-brand-bg border border-brand-border p-6 space-y-4">
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-xl bg-brand-green-light text-brand-green flex items-center justify-center shrink-0">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-brand-dark">
                    Our Yard Facility Address
                  </h3>
                  <p className="text-sm text-brand-muted mt-0.5">
                    {SITE_CONFIG.address.full}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-brand-border text-xs">
                <div>
                  <span className="font-bold text-brand-dark block">Open Days</span>
                  <span className="text-brand-muted">{SITE_CONFIG.operatingHours.days}</span>
                </div>
                <div>
                  <span className="font-bold text-brand-dark block">Operating Hours</span>
                  <span className="text-brand-muted">{SITE_CONFIG.operatingHours.hours}</span>
                </div>
              </div>

              <div className="p-3 bg-white rounded-xl border border-brand-border text-xs text-brand-muted">
                <strong>No address input needed!</strong> Simply select your drop-off
                day in the next step so our yard weighing operators know to expect you.
              </div>
            </div>
          )}

          <div className="pt-4 flex items-center justify-between">
            <Button variant="outline" onClick={() => setStep(1)} className="gap-1.5">
              <ArrowLeft className="h-4 w-4" />
              <span>Back</span>
            </Button>
            <Button size="lg" onClick={handleNextStep} className="gap-2 font-bold">
              <span>Continue to Schedule</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </Card>
      )}

      {/* --------------------------------------------------------- */}
      {/* STEP 3: SCHEDULE */}
      {/* --------------------------------------------------------- */}
      {step === 3 && (
        <Card className="rounded-3xl border border-brand-border bg-white shadow-card p-6 md:p-8 space-y-6">
          <div className="border-b border-brand-border pb-4">
            <CardTitle className="text-xl font-bold text-brand-dark">
              Step 3: Choose Date & Time Slot
            </CardTitle>
            <p className="text-xs text-brand-muted mt-0.5">
              We operate 7 days a week from 8:00 AM to 10:00 PM. Book up to 14 days in advance.
            </p>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="slot_date" className="text-xs font-bold uppercase tracking-wider">
                Select Date *
              </Label>
              <Input
                id="slot_date"
                type="date"
                min={minDate}
                max={maxDate}
                value={slotDate}
                onChange={(e) => setSlotDate(e.target.value)}
                className="h-12 bg-white text-base font-semibold"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-wider">
                Select Time Window *
              </Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {SITE_CONFIG.timeSlots.map((slot) => (
                  <button
                    key={slot.id}
                    type="button"
                    onClick={() => setSlotTime(slot.label)}
                    className={`p-4 rounded-xl border text-left transition-all ${
                      slotTime === slot.label
                        ? "border-brand-blue bg-brand-blue-light/40 ring-2 ring-brand-blue"
                        : "border-brand-border bg-white hover:border-gray-300"
                    }`}
                  >
                    <span className="text-[11px] font-bold text-brand-blue uppercase tracking-wider block">
                      {slot.window}
                    </span>
                    <span className="text-sm font-bold text-brand-dark mt-0.5 block">
                      {slot.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-4 flex items-center justify-between">
            <Button variant="outline" onClick={() => setStep(2)} className="gap-1.5">
              <ArrowLeft className="h-4 w-4" />
              <span>Back</span>
            </Button>
            <Button size="lg" onClick={handleNextStep} className="gap-2 font-bold">
              <span>Continue to Photos</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </Card>
      )}

      {/* --------------------------------------------------------- */}
      {/* STEP 4: PHOTOS (OPTIONAL) */}
      {/* --------------------------------------------------------- */}
      {step === 4 && (
        <Card className="rounded-3xl border border-brand-border bg-white shadow-card p-6 md:p-8 space-y-6">
          <div className="border-b border-brand-border pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl font-bold text-brand-dark">
                  Step 4: Upload Material Photos (Optional)
                </CardTitle>
                <p className="text-xs text-brand-muted mt-0.5">
                  Helps our logistics team dispatch the right vehicle and calibrated scales.
                </p>
              </div>
              <Badge variant="blue">Up to 5 Photos</Badge>
            </div>
          </div>

          <div className="space-y-4">
            {/* Upload Dropzone */}
            {selectedPhotos.length < 5 && (
              <label className="border-2 border-dashed border-brand-border hover:border-brand-blue bg-brand-bg/50 hover:bg-brand-blue-light/10 rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer transition-colors text-center">
                <UploadCloud className="h-10 w-10 text-brand-blue mb-2" />
                <span className="text-sm font-bold text-brand-dark">
                  Click to browse photos
                </span>
                <span className="text-xs text-brand-muted mt-1">
                  JPG, PNG, WebP up to 5 MB each ({5 - selectedPhotos.length} slots remaining)
                </span>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handlePhotoSelect}
                  className="hidden"
                />
              </label>
            )}

            {/* Preview Grid */}
            {selectedPhotos.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2">
                {selectedPhotos.map((p, idx) => (
                  <div
                    key={idx}
                    className="relative aspect-square rounded-xl overflow-hidden border border-brand-border bg-gray-100 group"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={p.preview}
                      alt="Scrap preview"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removePhoto(idx)}
                      className="absolute top-1.5 right-1.5 h-6 w-6 rounded-full bg-black/70 text-white flex items-center justify-center hover:bg-red-600 transition-colors"
                      aria-label="Remove photo"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="pt-4 flex items-center justify-between">
            <Button variant="outline" onClick={() => setStep(3)} className="gap-1.5">
              <ArrowLeft className="h-4 w-4" />
              <span>Back</span>
            </Button>
            <Button size="lg" onClick={handleNextStep} className="gap-2 font-bold">
              <span>Review Booking Details</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </Card>
      )}

      {/* --------------------------------------------------------- */}
      {/* STEP 5: REVIEW & CONFIRM */}
      {/* --------------------------------------------------------- */}
      {step === 5 && (
        <Card className="rounded-3xl border border-brand-border bg-white shadow-elevated p-6 md:p-8 space-y-6">
          <div className="border-b border-brand-border pb-4">
            <CardTitle className="text-2xl font-extrabold text-brand-dark">
              Step 5: Review & Confirm Your Booking
            </CardTitle>
            <p className="text-xs text-brand-muted mt-0.5">
              Please double check your pickup details before submitting.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Scrap Items Summary */}
            <div className="space-y-3 p-5 rounded-2xl bg-brand-bg border border-brand-border">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-blue block">
                Selected Scrap Materials
              </span>
              <div className="space-y-2 text-xs">
                {itemRows.map((r, i) => {
                  const it = items.find((x) => x.id === r.itemId);
                  return (
                    <div
                      key={i}
                      className="flex items-center justify-between pb-1.5 border-b border-brand-border/60"
                    >
                      <div>
                        <span className="font-bold text-brand-dark">
                          {it?.name || "Scrap"}
                        </span>
                        {r.notes && (
                          <span className="block text-brand-muted text-[11px]">
                            {r.notes}
                          </span>
                        )}
                      </div>
                      <span className="font-semibold text-brand-dark">
                        {r.approxWeight} {it?.unit || "kg"}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="pt-2 flex items-center justify-between font-bold text-sm">
                <span>Estimated Value:</span>
                <span className="text-brand-blue text-base">
                  {totalEstimatedValue > 0
                    ? formatCurrency(totalEstimatedValue)
                    : "Market Linked"}
                </span>
              </div>
            </div>

            {/* Logistics & Address Summary */}
            <div className="space-y-3 p-5 rounded-2xl bg-brand-bg border border-brand-border">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-green block">
                Logistics & Schedule
              </span>
              <div className="space-y-2 text-xs">
                <div>
                  <span className="text-brand-muted block">Mode:</span>
                  <span className="font-bold text-brand-dark">
                    {pickupType === "doorstep" ? "Doorstep Pickup" : "Drop-off at Yard"}
                  </span>
                </div>

                <div>
                  <span className="text-brand-muted block">Scheduled Slot:</span>
                  <span className="font-bold text-brand-dark">
                    {slotDate} ({slotTime})
                  </span>
                </div>

                {pickupType === "doorstep" && (
                  <div>
                    <span className="text-brand-muted block">Pickup Address:</span>
                    <span className="font-bold text-brand-dark">
                      {selectedAddressId === "new"
                        ? `${newAddress.line1}, ${newAddress.area}, Mumbai - ${newAddress.pincode}`
                        : "Selected from your saved addresses"}
                    </span>
                  </div>
                )}

                {selectedPhotos.length > 0 && (
                  <div>
                    <span className="text-brand-muted block">Attached Photos:</span>
                    <span className="font-bold text-brand-dark">
                      {selectedPhotos.length} photo(s)
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-3">
            <ShieldCheck className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
            <p>
              <strong>Payment Guarantee:</strong> All scrap is weighed accurately
              using calibrated digital scales in your presence. Payout is issued
              immediately via instant UPI or cash before departure.
            </p>
          </div>

          <div className="pt-4 flex items-center justify-between">
            <Button variant="outline" onClick={() => setStep(4)} className="gap-1.5">
              <ArrowLeft className="h-4 w-4" />
              <span>Back</span>
            </Button>
            <Button
              size="xl"
              disabled={isSubmitting}
              onClick={handleFinalSubmit}
              className="gap-2.5 font-bold shadow-elevated"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Submitting Request...</span>
                </>
              ) : (
                <>
                  <CalendarCheck className="h-5 w-5" />
                  <span>Confirm & Book Pickup</span>
                </>
              )}
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}
