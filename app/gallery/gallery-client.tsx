"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  MapPin,
  Calendar,
  Camera,
  Plus,
  Sparkles,
  Maximize2,
  Edit2,
  Trash2,
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
import { GalleryEditorModal } from "@/components/gallery/gallery-editor-modal";
import { deleteGalleryItem } from "@/app/admin/gallery/actions";
import { createClient } from "@/lib/supabase/client";
import { isAuthorizedGalleryAuthor } from "@/lib/auth-config";

interface GalleryClientProps {
  items: GalleryItem[];
  isOwner?: boolean;
  userEmail?: string;
  isAdmin?: boolean;
}

export function GalleryClient({
  items,
  isOwner = false,
  userEmail,
  isAdmin = false,
}: GalleryClientProps) {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = React.useState("all");
  const [activeItem, setActiveItem] = React.useState<GalleryItem | null>(null);

  // Modal editor states
  const [editorModalOpen, setEditorModalOpen] = React.useState(false);
  const [editingItem, setEditingItem] = React.useState<GalleryItem | null>(null);

  // Local live items state to reflect additions/edits/deletions instantly
  const [liveItems, setLiveItems] = React.useState<GalleryItem[]>(items);

  React.useEffect(() => {
    setLiveItems(items);
  }, [items]);

  // Client-side verification fallback using Supabase browser client
  const [clientOwnerAccess, setClientOwnerAccess] = React.useState<boolean>(
    Boolean(isOwner || isAdmin)
  );
  const [activeEmail, setActiveEmail] = React.useState<string | undefined>(
    userEmail
  );

  React.useEffect(() => {
    if (isOwner || isAdmin) {
      setClientOwnerAccess(true);
      return;
    }

    const supabase = createClient();
    if (!supabase) return;

    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user?.email) {
        setActiveEmail(user.email);
        if (isAuthorizedGalleryAuthor(user.email)) {
          setClientOwnerAccess(true);
        }
      }
    });
  }, [isOwner, isAdmin]);

  const categories = React.useMemo(() => {
    const fromItems = liveItems.map((item) => item.category);
    return Array.from(new Set([...GALLERY_CATEGORIES, ...fromItems]));
  }, [liveItems]);

  const filteredItems = React.useMemo(() => {
    if (selectedCategory === "all") return liveItems;
    return liveItems.filter((item) => item.category === selectedCategory);
  }, [liveItems, selectedCategory]);

  const handleOpenAdd = () => {
    setEditingItem(null);
    setEditorModalOpen(true);
  };

  const handleOpenEdit = (item: GalleryItem) => {
    setEditingItem(item);
    setEditorModalOpen(true);
  };

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Are you sure you want to remove "${title}" from the work gallery?`)) {
      return;
    }

    try {
      const res = await deleteGalleryItem(id);
      if (res.success) {
        toast.success(res.message || "Gallery item removed");
        setLiveItems((prev) => prev.filter((item) => item.id !== id));
        router.refresh();
      } else {
        toast.error(res.error || "Failed to delete gallery item");
      }
    } catch {
      toast.error("Error deleting gallery item");
    }
  };

  const handleSaved = (saved: Partial<GalleryItem>) => {
    if (editingItem && saved.id) {
      setLiveItems((prev) =>
        prev.map((item) =>
          item.id === saved.id ? ({ ...item, ...saved } as GalleryItem) : item
        )
      );
    } else if (saved.title) {
      const newItem: GalleryItem = {
        id: (saved.id as string) || `gal-${Date.now()}`,
        title: saved.title || "",
        category: saved.category || "Demolition & Dismantling",
        description: saved.description || null,
        location: saved.location || null,
        activity_date:
          saved.activity_date || new Date().toISOString().split("T")[0],
        image_url: saved.image_url || "/gallery/corporate-demolition.svg",
        highlight_stat: saved.highlight_stat || null,
        sort_order: saved.sort_order ?? 1,
        is_published: saved.is_published ?? true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      setLiveItems((prev) => [newItem, ...prev]);
    }
  };

  return (
    <div className="space-y-8">
      {/* 1. Owner Access Banner (Shown exclusively to verified owners) */}
      {clientOwnerAccess && (
        <div className="p-3.5 sm:p-4 rounded-2xl bg-brand-green-light/40 border border-brand-green/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-in fade-in-50 duration-200">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-xl bg-brand-green text-white flex items-center justify-center shrink-0">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-bold text-brand-dark">
                Gallery Management Active
              </p>
              <p className="text-[11px] text-brand-muted">
                Authorized as:{" "}
                <strong className="text-brand-dark">
                  {activeEmail || userEmail || "Owner"}
                </strong>{" "}
                • You can upload photos, edit activities, and manage work projects directly.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <Button
              type="button"
              size="sm"
              onClick={handleOpenAdd}
              className="bg-brand-green hover:bg-brand-green/90 text-white font-bold text-xs h-8 px-4 gap-1.5 shadow-sm rounded-xl cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>+ Add Photo / Activity</span>
            </Button>
          </div>
        </div>
      )}

      {/* 2. Category Filter Strip */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-brand-surface p-4 sm:p-5 rounded-2xl border border-brand-border shadow-subtle">
        <div className="flex flex-wrap items-center gap-2">
          <Button
            type="button"
            size="sm"
            variant={selectedCategory === "all" ? "default" : "outline"}
            onClick={() => setSelectedCategory("all")}
            className="rounded-full text-xs h-8 px-3.5"
          >
            All Work ({liveItems.length})
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

        {clientOwnerAccess && (
          <Button
            type="button"
            size="sm"
            variant="secondary"
            onClick={handleOpenAdd}
            className="rounded-full text-xs h-8 px-3.5 gap-1 font-bold cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>+ Add Photo / Activity</span>
          </Button>
        )}
      </div>

      {/* 3. Gallery Grid */}
      {filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <Card
              key={item.id}
              className="group border border-brand-border bg-brand-surface shadow-subtle hover:border-brand-blue hover:shadow-card transition-all duration-200 overflow-hidden flex flex-col justify-between"
            >
              <div>
                {/* Photo Thumbnail */}
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

              <div>
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

                {/* Owner Actions Toolbar (Exclusively visible to owners) */}
                {clientOwnerAccess && (
                  <div className="px-5 pb-4 pt-2 border-t border-brand-border/60 flex items-center justify-between gap-2 bg-slate-50/50">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-brand-muted">
                      Owner Action
                    </span>
                    <div className="flex items-center gap-1.5">
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        onClick={() => handleOpenEdit(item)}
                        className="h-7 px-2.5 text-xs text-brand-blue hover:text-brand-blue hover:bg-brand-blue-light/50 font-semibold gap-1 cursor-pointer"
                      >
                        <Edit2 className="h-3 w-3" />
                        <span>Edit</span>
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDelete(item.id, item.title)}
                        className="h-7 px-2.5 text-xs text-red-600 hover:text-red-700 hover:bg-red-50 font-semibold gap-1 cursor-pointer"
                      >
                        <Trash2 className="h-3 w-3" />
                        <span>Delete</span>
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="rounded-3xl border border-dashed border-brand-border bg-brand-surface p-12 text-center space-y-3">
          <Camera className="h-10 w-10 text-brand-muted mx-auto opacity-60" />
          <h3 className="text-lg font-bold text-brand-dark">
            No gallery entries in this category
          </h3>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setSelectedCategory("all")}
          >
            Show All Activities
          </Button>
        </div>
      )}

      {/* 4. Lightbox Modal */}
      <Dialog
        open={!!activeItem}
        onOpenChange={(open) => !open && setActiveItem(null)}
      >
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
                      <Badge variant="success">
                        {activeItem.highlight_stat}
                      </Badge>
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

      {/* 5. In-Page Owner Studio Editor Modal */}
      <GalleryEditorModal
        isOpen={editorModalOpen}
        onClose={() => setEditorModalOpen(false)}
        item={editingItem}
        onSaved={handleSaved}
      />
    </div>
  );
}
