"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  MapPin,
  Plus,
  Edit2,
  Trash2,
  Star,
  CheckCircle2,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { Address } from "@/lib/types/database";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  addAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
} from "./actions";

interface AddressesClientProps {
  addresses: Address[];
}

export function AddressesClient({ addresses }: AddressesClientProps) {
  const router = useRouter();
  const [modalOpen, setModalOpen] = React.useState(false);
  const [editingAddress, setEditingAddress] = React.useState<Address | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);

  const [formData, setFormData] = React.useState({
    label: "Home",
    name: "",
    phone: "",
    line1: "",
    area: "",
    landmark: "",
    pincode: "",
    is_default: false,
  });

  const openAddModal = () => {
    setEditingAddress(null);
    setFormData({
      label: "Home",
      name: "",
      phone: "",
      line1: "",
      area: "",
      landmark: "",
      pincode: "",
      is_default: addresses.length === 0,
    });
    setModalOpen(true);
  };

  const openEditModal = (addr: Address) => {
    setEditingAddress(addr);
    setFormData({
      label: addr.label || "Home",
      name: addr.name,
      phone: addr.phone,
      line1: addr.line1,
      area: addr.area,
      landmark: addr.landmark || "",
      pincode: addr.pincode,
      is_default: addr.is_default,
    });
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    let res;
    if (editingAddress) {
      res = await updateAddress(editingAddress.id, formData);
    } else {
      res = await addAddress(formData);
    }

    setIsLoading(false);
    if (res.success) {
      toast.success(res.message);
      setModalOpen(false);
      router.refresh();
    } else {
      toast.error(res.error || "Failed to save address.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this address?")) return;
    const res = await deleteAddress(id);
    if (res.success) {
      toast.success(res.message);
      router.refresh();
    } else {
      toast.error(res.error || "Failed to delete address.");
    }
  };

  const handleSetDefault = async (id: string) => {
    const res = await setDefaultAddress(id);
    if (res.success) {
      toast.success(res.message);
      router.refresh();
    } else {
      toast.error(res.error || "Failed to update default address.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-extrabold text-brand-dark">
            Saved Addresses
          </h2>
          <p className="text-xs text-brand-muted mt-0.5">
            Manage your doorstep pickup addresses in Mumbai.
          </p>
        </div>
        <Button size="sm" onClick={openAddModal} className="gap-1.5 font-bold">
          <Plus className="h-4 w-4" />
          <span>Add Address</span>
        </Button>
      </div>

      {addresses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {addresses.map((addr) => (
            <Card
              key={addr.id}
              className={`rounded-2xl border transition-all duration-150 ${
                addr.is_default
                  ? "border-brand-blue bg-brand-blue-light/10 shadow-card"
                  : "border-brand-border bg-white shadow-subtle"
              }`}
            >
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-brand-dark">
                      {addr.label}
                    </span>
                    {addr.is_default && (
                      <Badge variant="blue" className="text-[10px]">
                        Default
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => openEditModal(addr)}
                      className="p-1.5 text-brand-muted hover:text-brand-blue transition-colors rounded-lg hover:bg-gray-100"
                      aria-label="Edit address"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(addr.id)}
                      className="p-1.5 text-brand-muted hover:text-red-600 transition-colors rounded-lg hover:bg-gray-100"
                      aria-label="Delete address"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="text-xs space-y-1 text-brand-dark">
                  <p className="font-semibold">
                    {addr.name} • {addr.phone}
                  </p>
                  <p className="text-brand-muted leading-relaxed">
                    {addr.line1}, {addr.area}
                    {addr.landmark ? `, Near ${addr.landmark}` : ""}
                  </p>
                  <p className="font-mono text-brand-blue font-bold">
                    Mumbai - {addr.pincode}
                  </p>
                </div>

                {!addr.is_default && (
                  <div className="pt-2 border-t border-brand-border/60">
                    <button
                      type="button"
                      onClick={() => handleSetDefault(addr.id)}
                      className="text-xs font-semibold text-brand-blue hover:underline flex items-center gap-1"
                    >
                      <Star className="h-3.5 w-3.5" />
                      <span>Set as default address</span>
                    </button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="rounded-3xl border border-dashed border-brand-border bg-white p-10 text-center space-y-4">
          <div className="h-14 w-14 rounded-2xl bg-brand-blue-light text-brand-blue flex items-center justify-center mx-auto">
            <MapPin className="h-7 w-7" />
          </div>
          <div className="space-y-1">
            <h3 className="font-bold text-base text-brand-dark">
              No saved addresses yet
            </h3>
            <p className="text-xs text-brand-muted max-w-sm mx-auto">
              Save your residence, workshop, or office address once to book pickups in 1 click.
            </p>
          </div>
          <Button size="sm" onClick={openAddModal} className="gap-1.5">
            <Plus className="h-4 w-4" />
            <span>Add Your First Address</span>
          </Button>
        </Card>
      )}

      {/* Add / Edit Dialog */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingAddress ? "Edit Saved Address" : "Add New Pickup Address"}
            </DialogTitle>
            <DialogDescription>
              Enter accurate location details to ensure prompt doorstep collection.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSave} className="space-y-4 pt-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="m_label" className="text-xs">
                  Address Label *
                </Label>
                <Input
                  id="m_label"
                  value={formData.label}
                  onChange={(e) =>
                    setFormData({ ...formData, label: e.target.value })
                  }
                  placeholder="e.g. Home, Office, Yard"
                  required
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="m_pin" className="text-xs">
                  Pincode *
                </Label>
                <Input
                  id="m_pin"
                  maxLength={6}
                  value={formData.pincode}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      pincode: e.target.value.replace(/\D/g, ""),
                    })
                  }
                  placeholder="e.g. 400093"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="m_name" className="text-xs">
                  Contact Person *
                </Label>
                <Input
                  id="m_name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Full name"
                  required
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="m_phone" className="text-xs">
                  Contact Phone *
                </Label>
                <Input
                  id="m_phone"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  placeholder="10-digit mobile"
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label htmlFor="m_line1" className="text-xs">
                Flat / Floor / Building / Street *
              </Label>
              <Input
                id="m_line1"
                value={formData.line1}
                onChange={(e) =>
                  setFormData({ ...formData, line1: e.target.value })
                }
                placeholder="e.g. Flat 301, Silver Arch, Road 5"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="m_area" className="text-xs">
                  Area / Suburb *
                </Label>
                <Input
                  id="m_area"
                  value={formData.area}
                  onChange={(e) =>
                    setFormData({ ...formData, area: e.target.value })
                  }
                  placeholder="e.g. MIDC Andheri East"
                  required
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="m_landmark" className="text-xs">
                  Landmark
                </Label>
                <Input
                  id="m_landmark"
                  value={formData.landmark}
                  onChange={(e) =>
                    setFormData({ ...formData, landmark: e.target.value })
                  }
                  placeholder="e.g. Near Seepz"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <input
                id="m_default"
                type="checkbox"
                checked={formData.is_default}
                onChange={(e) =>
                  setFormData({ ...formData, is_default: e.target.checked })
                }
                className="h-4 w-4 rounded text-brand-blue"
              />
              <Label htmlFor="m_default" className="text-xs font-normal">
                Set as default pickup address
              </Label>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setModalOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" size="sm" disabled={isLoading} className="font-bold">
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-1" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <span>Save Address</span>
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

