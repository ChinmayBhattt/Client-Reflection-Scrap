import type { Metadata } from "next";
import { getCurrentUser } from "@/lib/services/user";
import { getUserPickups } from "@/lib/services/pickups";
import { PickupsClient } from "./pickups-client";

export const metadata: Metadata = {
  title: "My Pickups Dashboard - Reflection Scrap Solutions LLP",
  description: "Track your scrap collection bookings, digital scale weights, and payment receipts.",
};

export default async function DashboardPage() {
  const user = await getCurrentUser();
  const pickups = user ? await getUserPickups(user.id) : [];

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h2 className="text-2xl font-extrabold text-brand-dark">
          My Scrap Pickups
        </h2>
        <p className="text-xs text-brand-muted">
          Review your scheduled collections, progress timeline, and verified digital weighing settlements.
        </p>
      </div>

      <PickupsClient pickups={pickups} />
    </div>
  );
}

