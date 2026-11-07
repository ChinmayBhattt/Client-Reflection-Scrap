import type { Metadata } from "next";
import { getAllPickupsAdmin } from "@/lib/services/admin";
import { PickupsTable } from "./pickups-table";

export const metadata: Metadata = {
  title: "Pickups & Dispatches - Admin Reflection Scrap",
};

export default async function AdminPickupsPage() {
  const pickups = await getAllPickupsAdmin();

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="space-y-1">
        <h1 className="text-2xl font-extrabold text-white">
          Pickups & Doorstep Collections
        </h1>
        <p className="text-xs text-slate-400">
          Track customer booking requests, assign personnel, enter digital scale measurements, and settle payouts.
        </p>
      </div>

      <PickupsTable pickups={pickups} />
    </div>
  );
}
