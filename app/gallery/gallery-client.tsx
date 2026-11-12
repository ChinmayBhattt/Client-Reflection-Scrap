"use client";

import * as React from "react";
import Link from "next/link";
import {
  MapPin,
  Calendar,
  Camera,
  Plus,
  Sparkles,
  Maximize2,
} from "lucide-react";
import type { GalleryItem } from "@/lib/types/database";
import { GALLERY_CATEGORIES } from "@/lib/content-constants";
import { formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface GalleryClientProps {
  items: GalleryItem[];
  isAdmin?: boolean;
}

export function GalleryClient({ items, isAdmin = false }: GalleryClientProps) {
  const [selectedCategory, setSelectedCategory] = React.useState("all");
  const [activeItem, setActiveItem] = React.useState<GalleryItem | null>(null);

  const categories = React.useMemo(() => {
    const fromItems = items.map((item) => item.category);
    return Array.from(new Set([...GALLERY_CATEGORIES, ...fromItems]));
  }, [items]);

  const filteredItems = React.useMemo(() => {
    if (selectedCategory === "all") return items;
    return items.filter((item) => item.category === selectedCategory);
  }, [items, selectedCategory]);

  return (
    <div className="space-y-8">
      {/* Category Filter Strip */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-brand-surface p-4 sm:p-5 rounded-2xl border border-brand-border shadow-subtle">
        <div className="flex flex-wrap items-center gap-2">
          <Button
            type="button"
            size="sm"
            variant={selectedCategory === "all" ? "default" : "outline"}
            onClick={() => setSelectedCategory("all")}
            className="rounded-full text-xs h-8 px-3.5"
          >
            All Work ({items.length})
          </Button>
          {categories.map((cat) => (
            <Button
              key={cat}
              type="button"
              size="sm"
              variant={selectedCategory === cat ? "default" : "outline"}
              onClick={() => setSelectedCategory(cat)}
              className="rounded-full text-xs h-8 px-3.5"
            >
              {cat}
            </Button>
          ))}
        </div>

        {isAdmin && (
          <Button asChild size="sm" variant="secondary" className="rounded-full text-xs h-8 px-3.5 gap-1">
            <Link href="/admin/gallery">
              <Plus className="h-3.5 w-3.5" />
              <span>Add Photo / Activity</span>
            </Link>
          </Button>
        )}
      </div>

      {/* Gallery Grid */}
      {filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <Card
              key={item.id}
              className="group border border-brand-border bg-brand-surface shadow-subtle hover:border-brand-blue hover:shadow-card transition-all duration-200 overflow-hidden flex flex-col justify-between"
            >
              <div>
                <button
                  type="button"
                  onClick={() => setActiveItem(item)}
                  className="relative block w-full aspect-[16/10] bg-muted overflow-hidden text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue"
                  aria-label={`View details for ${item.title}`}
                >
                  {item.image_url ? (
                    <img
                      src={item.image_url}
                      alt={item.title}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="h-full w-full flex flex-col items-center justify-center gap-2 text-brand-muted">
                      <Camera className="h-8 w-8 opacity-50" />
                      <span className="text-xs font-semibold">Field Activity</span>
                    </div>
                  )}
                  <span className="absolute top-3 right-3 h-8 w-8 rounded-lg bg-black/55 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Maximize2 className="h-4 w-4" aria-hidden="true" />
                  </span>
                </button>

                <CardHeader className="space-y-2.5 pb-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <Badge variant="blue" className="text-[11px] font-bold">
                      {item.category}
                    </Badge>
                    {item.activity_date && (
                      <span className="text-[11px] text-brand-muted inline-flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>{formatDate(item.activity_date)}</span>
                      </span>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => setActiveItem(item)}
                    className="text-left"
                  >
                    <h2 className="text-lg font-bold text-brand-dark group-hover:text-brand-blue transition-colors leading-snug">
                      {item.title}
                    </h2>
                  </button>

                  {item.description && (
                    <p className="text-xs sm:text-sm text-brand-muted leading-relaxed line-clamp-3">
                      {item.description}
                    </p>
                  )}
                </CardHeader>
              </div>

              <CardContent className="pt-0 space-y-2.5">
                {item.highlight_stat && (
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-brand-green-light text-brand-green text-xs font-bold">
                    <Sparkles className="h-3.5 w-3.5 shrink-0" />
                    <span>{item.highlight_stat}</span>
                  </div>
                )}

                {item.location && (
                  <div className="pt-2 border-t border-brand-border flex items-center gap-1.5 text-xs text-brand-muted">
                    <MapPin className="h-3.5 w-3.5 text-brand-blue shrink-0" />
                    <span>{item.location}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="rounded-3xl border border-dashed border-brand-border bg-brand-surface p-12 text-center space-y-3">
          <Camera className="h-10 w-10 text-brand-muted mx-auto opacity-60" />
          <h3 className="text-lg font-bold text-brand-dark">No gallery entries in this category</h3>
          <Button type="button" variant="outline" size="sm" onClick={() => setSelectedCategory("all")}>
            Show All Activities
          </Button>
        </div>
      )}

      {/* Lightbox Modal */}
      <Dialog open={!!activeItem} onOpenChange={(open) => !open && setActiveItem(null)}>
        <DialogContent className="max-w-2xl p-0 overflow-hidden">
          {activeItem && (
            <>
              {activeItem.image_url && (
                <div className="aspect-[16/10] w-full bg-muted overflow-hidden border-b border-brand-border">
                  <img
                    src={activeItem.image_url}
                    alt={activeItem.title}
                    className="h-full w-full object-cover"
                  />
                </div>
              )}
              <div className="p-6 space-y-4">
                <DialogHeader>
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <Badge variant="blue">{activeItem.category}</Badge>
                    {activeItem.highlight_stat && (
                      <Badge variant="success">{activeItem.highlight_stat}</Badge>
                    )}
                  </div>
                  <DialogTitle className="text-xl font-bold text-brand-dark">
                    {activeItem.title}
                  </DialogTitle>
                  {activeItem.description && (
                    <DialogDescription className="text-sm text-brand-muted leading-relaxed pt-1">
                      {activeItem.description}
                    </DialogDescription>
                  )}
                </DialogHeader>

                <div className="flex flex-wrap items-center gap-4 text-xs text-brand-muted pt-2 border-t border-brand-border">
                  {activeItem.location && (
                    <span className="inline-flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5 text-brand-blue" />
                      <span>{activeItem.location}</span>
                    </span>
                  )}
                  {activeItem.activity_date && (
                    <span className="inline-flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5 text-brand-green" />
                      <span>{formatDate(activeItem.activity_date)}</span>
                    </span>
                  )}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
