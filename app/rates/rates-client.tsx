"use client";

import * as React from "react";
import Link from "next/link";
import {
  Search,
  Calculator,
  CalendarCheck,
  TrendingUp,
  AlertCircle,
  HelpCircle,
  Clock,
  ArrowRight,
  Filter,
} from "lucide-react";
import { ScrapCategory, ScrapItem } from "@/lib/types/database";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface RatesClientProps {
  categories: ScrapCategory[];
  items: (ScrapItem & { category?: ScrapCategory })[];
}

export function RatesClient({ categories, items }: RatesClientProps) {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState<string>("all");

  // Calculator State
  const [calcItemId, setCalcItemId] = React.useState<string>(items[0]?.id || "");
  const [calcQuantity, setCalcQuantity] = React.useState<number>(10);

  // Filtered items
  const filteredItems = React.useMemo(() => {
    return items.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category?.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory =
        selectedCategory === "all" ||
        item.category_id === selectedCategory ||
        item.category?.slug === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [items, searchTerm, selectedCategory]);

  // Selected item for calculator
  const selectedCalcItem = React.useMemo(() => {
    return items.find((item) => item.id === calcItemId) || items[0];
  }, [items, calcItemId]);

  const estimatedValue = React.useMemo(() => {
    if (!selectedCalcItem) return 0;
    const rate = Number(selectedCalcItem.rate_per_unit) || 0;
    return rate * (calcQuantity || 0);
  }, [selectedCalcItem, calcQuantity]);

  return (
    <div className="space-y-12">
      {/* 1. ESTIMATE MY VALUE CALCULATOR */}
      <Card className="rounded-3xl border-2 border-brand-blue/30 bg-gradient-to-br from-white via-brand-blue-light/20 to-white shadow-elevated overflow-hidden">
        <div className="bg-brand-blue text-white p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-xs font-bold uppercase tracking-wider">
              <Calculator className="h-4 w-4" />
              <span>Instant Payout Estimator</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Estimate Your Scrap Payout
            </h2>
            <p className="text-sm text-white/90 max-w-xl">
              Select an item from our database and enter approximate weight to
              calculate your expected doorstep payment in Mumbai.
            </p>
          </div>

          <div className="text-left md:text-right bg-white/10 md:bg-transparent p-4 md:p-0 rounded-2xl border border-white/20 md:border-0">
            <span className="text-xs uppercase font-bold tracking-wider text-white/80 block">
              Estimated Total
            </span>
            <div className="text-3xl sm:text-4xl font-black text-white mt-0.5">
              {selectedCalcItem?.rate_per_unit > 0 ? (
                formatCurrency(estimatedValue)
              ) : (
                <span className="text-2xl font-bold">Market Rate Linked</span>
              )}
            </div>
            <span className="text-[11px] text-white/80 block mt-1">
              {calcQuantity || 0} {selectedCalcItem?.unit || "kg"} @{" "}
              {selectedCalcItem?.rate_per_unit > 0
                ? `${formatCurrency(selectedCalcItem.rate_per_unit)}/${selectedCalcItem.unit}`
                : "Active Daily Index"}
            </span>
          </div>
        </div>

        <CardContent className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-12 gap-6 items-end">
          {/* Step 1: Pick Item */}
          <div className="md:col-span-5 space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-brand-dark block">
              Select Scrap Material
            </label>
            <Select value={calcItemId} onValueChange={(val) => setCalcItemId(val)}>
              <SelectTrigger className="h-12 bg-white text-brand-dark font-medium border-brand-border">
                <SelectValue placeholder="Choose scrap item" />
              </SelectTrigger>
              <SelectContent>
                {items.map((it) => (
                  <SelectItem key={it.id} value={it.id}>
                    {it.name} ({it.category?.name})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Step 2: Weight Input */}
          <div className="md:col-span-4 space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-brand-dark block">
              Estimated Quantity ({selectedCalcItem?.unit || "kg"})
            </label>
            <div className="relative">
              <Input
                type="number"
                min="1"
                step="0.5"
                value={calcQuantity || ""}
                onChange={(e) => setCalcQuantity(parseFloat(e.target.value) || 0)}
                className="h-12 text-base font-bold pr-14"
                placeholder="e.g. 15"
              />
              <span className="absolute right-4 top-3 text-xs font-bold text-brand-muted uppercase">
                {selectedCalcItem?.unit || "kg"}
              </span>
            </div>
          </div>

          {/* Step 3: Action */}
          <div className="md:col-span-3">
            <Button asChild size="lg" className="w-full h-12 gap-2 font-bold shadow-sm">
              <Link href={`/book?item=${selectedCalcItem?.id}&qty=${calcQuantity}`}>
                <CalendarCheck className="h-4 w-4" />
                <span>Book This Scrap</span>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 2. SEARCH & FILTER CONTROLS */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 sm:p-6 rounded-2xl border border-brand-border shadow-subtle">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-brand-muted" />
          <Input
            type="text"
            placeholder="Search scrap item (e.g. Copper, HMS, Carton)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 h-11"
          />
        </div>

        {/* Category Filter Chips / Dropdown */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          <Button
            type="button"
            size="sm"
            variant={selectedCategory === "all" ? "default" : "outline"}
            onClick={() => setSelectedCategory("all")}
            className="rounded-full text-xs"
          >
            All Items ({items.length})
          </Button>
          {categories.map((cat) => (
            <Button
              key={cat.id}
              type="button"
              size="sm"
              variant={selectedCategory === cat.id || selectedCategory === cat.slug ? "default" : "outline"}
              onClick={() => setSelectedCategory(cat.id)}
              className="rounded-full text-xs whitespace-nowrap"
            >
              {cat.name}
            </Button>
          ))}
        </div>
      </div>

      {/* 3. RATES TABLE */}
      <div className="rounded-3xl border border-brand-border bg-white shadow-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[30%]">Scrap Item</TableHead>
              <TableHead className="w-[25%]">Category</TableHead>
              <TableHead className="w-[15%]">Unit</TableHead>
              <TableHead className="w-[15%] text-right">Rate in INR</TableHead>
              <TableHead className="w-[15%] text-right">Last Updated</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredItems.length > 0 ? (
              filteredItems.map((item) => (
                <TableRow key={item.id} className="hover:bg-brand-blue-light/20 transition-colors">
                  <TableCell className="font-bold text-brand-dark">
                    {item.name}
                  </TableCell>
                  <TableCell>
                    <Badge variant="blue" className="text-[11px] font-semibold">
                      {item.category?.name || "General"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-brand-muted uppercase text-xs font-semibold">
                    per {item.unit}
                  </TableCell>
                  <TableCell className="text-right font-extrabold text-brand-dark">
                    {item.rate_per_unit > 0 ? (
                      formatCurrency(item.rate_per_unit)
                    ) : (
                      <span className="text-xs text-brand-blue bg-brand-blue-light px-2.5 py-1 rounded-md font-bold">
                        Market Linked
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="text-right text-xs text-brand-muted">
                    {item.updated_at ? formatDate(item.updated_at) : "Today"}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-12 text-brand-muted">
                  No scrap materials match your search criteria.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {/* Mandatory Note */}
        <div className="p-4 bg-amber-50/70 border-t border-brand-border flex items-start gap-3 text-xs text-amber-900">
          <HelpCircle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong>Indicative Rates Notice:</strong> Rates are indicative and
            may change with market prices. Commercial scrap, large fabrication offcuts,
            and industrial machinery are evaluated based on quality grade and
            verified weight at the time of collection.
          </p>
        </div>
      </div>
    </div>
  );
}
