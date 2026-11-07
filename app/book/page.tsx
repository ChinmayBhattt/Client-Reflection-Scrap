import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/services/user";
import { getScrapCategories, getScrapItems } from "@/lib/services/rates";
import { getUserAddresses } from "@/lib/services/pickups";
import { BookingWizard } from "./booking-wizard";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Book a Doorstep Scrap Pickup - Mumbai",
  description:
    "Schedule a doorstep scrap collection or MIDC yard drop-off with Reflection Scrap Solutions LLP. Digital weighing & instant payment.",
};

interface BookPageProps {
  searchParams?: {
    item?: string;
    qty?: string;
  };
}

export default async function BookPickupPage({ searchParams }: BookPageProps) {
  const user = await getCurrentUser();

  // Middleware redirects unauthenticated users, but as extra guard:
  if (!user && process.env.NEXT_PUBLIC_SUPABASE_URL) {
    redirect("/login?next=/book");
  }

  const [categories, items, savedAddresses] = await Promise.all([
    getScrapCategories(),
    getScrapItems(),
    user ? getUserAddresses(user.id) : [],
  ]);

  const preselectedItemId = searchParams?.item;
  const preselectedQty = searchParams?.qty ? parseFloat(searchParams.qty) : undefined;

  return (
    <div className="py-12 md:py-20 bg-brand-bg min-h-screen">
      <div className="container space-y-10">
        {/* Page Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <Badge variant="blue" className="px-3.5 py-1 text-xs font-bold uppercase tracking-wider">
            Easy Online Booking
          </Badge>
          <h1 className="text-3xl md:text-5xl font-extrabold text-brand-dark tracking-tight">
            Book a Scrap Pickup in Mumbai
          </h1>
          <p className="text-sm md:text-base text-brand-muted leading-relaxed">
            Choose doorstep collection at your Mumbai address or yard drop-off
            at MIDC Andheri East. Calibrated digital weighing and instant payout.
          </p>
        </div>

        {/* Multi-step Wizard */}
        <BookingWizard
          categories={categories}
          items={items}
          savedAddresses={savedAddresses}
          preselectedItemId={preselectedItemId}
          preselectedQty={preselectedQty}
        />
      </div>
    </div>
  );
}

