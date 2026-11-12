import type { Metadata } from "next";
import { getAllGalleryItemsAdmin } from "@/lib/services/gallery";
import { GalleryManager } from "./gallery-manager";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Work Gallery Manager | Admin",
};

export default async function AdminGalleryPage() {
  const items = await getAllGalleryItemsAdmin();
  return <GalleryManager items={items} />;
}

