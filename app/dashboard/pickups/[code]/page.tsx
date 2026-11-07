import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCurrentUser } from "@/lib/services/user";
import { getPickupByCode } from "@/lib/services/pickups";
import { PickupDetailClient } from "./pickup-detail-client";

interface PickupPageProps {
  params: {
    code: string;
  };
}

export async function generateMetadata({
  params,
}: PickupPageProps): Promise<Metadata> {
  return {
    title: `Pickup ${params.code} Details - Reflection Scrap Solutions`,
  };
}

export default async function PickupDetailPage({ params }: PickupPageProps) {
  const user = await getCurrentUser();
  const pickup = await getPickupByCode(params.code, user?.id);

  if (!pickup) {
    notFound();
  }

  return <PickupDetailClient pickup={pickup} />;
}

