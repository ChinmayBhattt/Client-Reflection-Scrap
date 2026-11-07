import type { Metadata } from "next";
import { getAllServiceAreasAdmin } from "@/lib/services/admin";
import { ServiceAreasClient } from "./service-areas-client";

export const metadata: Metadata = {
  title: "Service Areas (Mumbai Pincodes) - Admin",
};

export const revalidate = 0;

export default async function AdminServiceAreasPage() {
  const areas = await getAllServiceAreasAdmin();

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="space-y-1">
        <h1 className="text-2xl font-extrabold text-white">
          Service Areas & Pincode Management
        </h1>
        <p className="text-xs text-slate-400">
          Manage postal pincodes eligible for automated doorstep scrap collection in Mumbai.
        </p>
      </div>

      <ServiceAreasClient areas={areas} />
    </div>
  );
}

