"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { MapPin, Plus, Trash2, CheckCircle2, Loader2, Power } from "lucide-react";
import { ServiceArea } from "@/lib/types/database";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { addServiceArea, toggleServiceArea, deleteServiceArea } from "./actions";

interface ServiceAreasClientProps {
  areas: ServiceArea[];
}

export function ServiceAreasClient({ areas }: ServiceAreasClientProps) {
  const router = useRouter();
  const [isAdding, setIsAdding] = React.useState(false);

  const handleAdd = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsAdding(true);
    const form = e.currentTarget;
    const formData = new FormData(form);

    const res = await addServiceArea(formData);
    setIsAdding(false);

    if (res.success) {
      toast.success(res.message);
      form.reset();
      router.refresh();
    } else {
      toast.error(res.error || "Failed to add service area.");
    }
  };

  const handleToggle = async (id: string, current: boolean) => {
    const res = await toggleServiceArea(id, !current);
    if (res.success) {
      toast.success(`Service area ${!current ? "activated" : "deactivated"}`);
      router.refresh();
    } else {
      toast.error(res.error || "Failed to toggle status.");
    }
  };

  const handleDelete = async (id: string, pincode: string) => {
    if (!confirm(`Are you sure you want to remove pincode ${pincode}?`)) return;
    const res = await deleteServiceArea(id);
    if (res.success) {
      toast.success(res.message);
      router.refresh();
    } else {
      toast.error(res.error || "Failed to delete service area.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Add New Pincode Form */}
      <Card className="rounded-2xl border border-slate-800 bg-slate-950 p-5 shadow-subtle">
        <form onSubmit={handleAdd} className="flex flex-col sm:flex-row sm:items-end gap-3 text-xs">
          <div className="space-y-1 sm:w-44">
            <Label className="text-slate-300 text-xs">Mumbai Pincode *</Label>
            <Input
              name="pincode"
              maxLength={6}
              placeholder="e.g. 400093"
              className="bg-slate-900 border-slate-700 text-white font-mono h-10 text-xs"
              required
            />
          </div>

          <div className="space-y-1 flex-1">
            <Label className="text-slate-300 text-xs">Area / Locality Name *</Label>
            <Input
              name="area_name"
              placeholder="e.g. MIDC, Andheri East Industrial Belt"
              className="bg-slate-900 border-slate-700 text-white h-10 text-xs"
              required
            />
          </div>

          <Button type="submit" disabled={isAdding} className="h-10 gap-1.5 font-bold bg-brand-blue shrink-0">
            {isAdding ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Plus className="h-4 w-4" />
            )}
            <span>Add Service Area</span>
          </Button>
        </form>
      </Card>

      {/* Pincodes Table */}
      <div className="rounded-2xl border border-slate-800 bg-slate-950 overflow-hidden shadow-subtle">
        <Table>
          <TableHeader className="bg-slate-900/80">
            <TableRow className="border-slate-800 hover:bg-slate-900">
              <TableHead className="text-slate-400 font-bold text-xs">Pincode</TableHead>
              <TableHead className="text-slate-400 font-bold text-xs">Area Name</TableHead>
              <TableHead className="text-slate-400 font-bold text-xs">Eligibility Status</TableHead>
              <TableHead className="text-slate-400 font-bold text-xs text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {areas.map((area) => (
              <TableRow key={area.id} className="border-slate-800/80 hover:bg-slate-900/50">
                <TableCell className="font-mono font-bold text-xs text-sky-400">
                  {area.pincode}
                </TableCell>
                <TableCell className="text-xs text-white font-medium">
                  {area.area_name}
                </TableCell>
                <TableCell>
                  <Badge variant={area.is_active ? "success" : "outline"} className="text-[10px]">
                    {area.is_active ? "Serviceable" : "Suspended"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleToggle(area.id, area.is_active)}
                      className="h-7 text-[11px] border-slate-700 bg-slate-900 text-slate-300 hover:bg-slate-800"
                    >
                      <Power className="h-3 w-3 mr-1" />
                      <span>{area.is_active ? "Disable" : "Enable"}</span>
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDelete(area.id, area.pincode)}
                      className="h-7 text-red-400 hover:text-red-300 hover:bg-red-950/40 p-1.5"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

