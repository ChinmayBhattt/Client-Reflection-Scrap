import type { Metadata } from "next";
import { getAllEnquiriesAdmin } from "@/lib/services/admin";
import { EnquiriesClient } from "./enquiries-client";

export const metadata: Metadata = {
  title: "Contact Form Enquiries - Admin",
};

export const revalidate = 0;

export default async function AdminEnquiriesPage() {
  const enquiries = await getAllEnquiriesAdmin();

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="space-y-1">
        <h1 className="text-2xl font-extrabold text-white">
          Contact Enquiries & Messages
        </h1>
        <p className="text-xs text-slate-400">
          Incoming enquiries submitted through the public contact form with read and replied status tracking.
        </p>
      </div>

      <EnquiriesClient enquiries={enquiries} />
    </div>
  );
}

