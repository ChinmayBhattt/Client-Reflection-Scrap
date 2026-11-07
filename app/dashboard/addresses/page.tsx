import type { Metadata } from "next";
import { getCurrentUser } from "@/lib/services/user";
import { getUserAddresses } from "@/lib/services/pickups";
import { AddressesClient } from "./addresses-client";

export const metadata: Metadata = {
  title: "Saved Addresses - Reflection Scrap Solutions LLP",
  description: "Manage your doorstep pickup addresses in Mumbai.",
};

export default async function SavedAddressesPage() {
  const user = await getCurrentUser();
  const addresses = user ? await getUserAddresses(user.id) : [];

  return <AddressesClient addresses={addresses} />;
}

