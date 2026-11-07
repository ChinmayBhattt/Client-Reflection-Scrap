import type { Metadata } from "next";
import { getScrapCategories, getScrapItems } from "@/lib/services/rates";
import { RatesManager } from "./rates-manager";

export const metadata: Metadata = {
  title: "Scrap Rates & Categories CRUD - Admin",
};

export const revalidate = 0; // Dynamic admin view

export default async function AdminRatesPage() {
  const [categories, items] = await Promise.all([
    getScrapCategories(),
    getScrapItems(),
  ]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="space-y-1">
        <h1 className="text-2xl font-extrabold text-white">
          Scrap Rates & Categories Management
        </h1>
        <p className="text-xs text-slate-400">
          Update prices for ferrous, non-ferrous metals, paper, plastics, and e-waste. Price modifications are automatically audited.
        </p>
      </div>

      <RatesManager categories={categories} items={items} />
    </div>
  );
}
