"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Plus,
  Edit2,
  Trash2,
  Loader2,
  ExternalLink,
  Upload,
  MapPin,
  Camera,
} from "lucide-react";
import type { GalleryItem } from "@/lib/types/database";
import { GALLERY_CATEGORIES } from "@/lib/content-constants";
import { createClient as createBrowserClient } from "@/lib/supabase/client";
import { formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { saveGalleryItem, deleteGalleryItem } from "./actions";

interface GalleryManagerProps {
  items: GalleryItem[];
}

export function GalleryManager({ items }: GalleryManagerProps) {
  const router = useRouter();
  const [modalOpen, setModalOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<GalleryItem | null>(null);
  const [isSaving, setIsSaving] = React.useState(false);
  const [isUploading, setIsUploading] = React.useState(false);

  const [formData, setFormData] = React.useState({
    title: "",
    category: GALLERY_CATEGORIES[0] as string,
    description: "",
    location: "MIDC Andheri East, Mumbai",
    activity_date: new Date().toISOString().split("T")[0],
    image_url: "",
    highlight_stat: "",
    sort_order: items.length + 1,
    is_published: true,
  });

  const openCreate = () => {
    setEditing(null);
    setFormData({
      title: "",
      category: GALLERY_CATEGORIES[0],
      description: "",
      location: "Andheri East, Mumbai",
      activity_date: new Date().toISOString().split("T")[0],
      image_url: "",
      highlight_stat: "",
      sort_order: items.length + 1,
      is_published: true,
    });
    setModalOpen(true);
  };

  const openEdit = (item: GalleryItem) => {
    setEditing(item);
    setFormData({
      title: item.title,
      category: item.category,
      description: item.description || "",
      location: item.location || "",
      activity_date: item.activity_date || "",
      image_url: item.image_url || "",
      highlight_stat: item.highlight_stat || "",
      sort_order: item.sort_order,
      is_published: item.is_published,
    });
    setModalOpen(true);
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const supabase = createBrowserClient();
    if (!supabase) {
      toast.error("Supabase storage is not configured");
      return;
    }

    setIsUploading(true);
    try {
      const ext = file.name.split(".").pop() || "jpg";
      const filePath = `activities/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { error } = await supabase.storage
        .from("gallery-photos")
        .upload(filePath, file, { upsert: false });

      if (error) {
        toast.error(error.message);
        return;
      }

      const { data: urlData } = supabase.storage
        .from("gallery-photos")
        .getPublicUrl(filePath);
      setFormData((prev) => ({ ...prev, image_url: urlData.publicUrl }));
      toast.success("Photo uploaded to storage!");
    } catch {
      toast.error("Upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await saveGalleryItem({
        id: editing?.id,
        title: formData.title,
        category: formData.category,
        description: formData.description || null,
        location: formData.location || null,
        activity_date: formData.activity_date || null,
        image_url: formData.image_url || null,
        highlight_stat: formData.highlight_stat || null,
        sort_order: Number(formData.sort_order) || 0,
        is_published: formData.is_published,
      });

      if (!res.success) {
        toast.error(res.error || "Failed to save gallery item");
        return;
      }

      toast.success(res.message);
      setModalOpen(false);
      router.refresh();
    } catch {
      toast.error("Error saving gallery item");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    const res = await deleteGalleryItem(id);
    if (!res.success) {
      toast.error(res.error);
      return;
    }
    toast.success(res.message);
    router.refresh();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white">
            Work Gallery & Field Activities
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Upload project photos, demolition clearances, and yard activity highlights.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button asChild variant="outline" size="sm" className="bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700">
            <Link href="/gallery" target="_blank">
              <span>View Gallery</span>
              <ExternalLink className="h-3.5 w-3.5 ml-1.5" />
            </Link>
          </Button>
          <Button onClick={openCreate} size="sm" variant="secondary" className="gap-1.5">
            <Plus className="h-4 w-4" />
            <span>Add Activity / Photo</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="rounded-2xl border border-slate-800 bg-slate-950 overflow-hidden flex flex-col justify-between"
          >
            <div>
              <div className="aspect-[16/10] bg-slate-900 overflow-hidden border-b border-slate-800">
                {item.image_url ? (
                  <img
                    src={item.image_url}
                    alt={item.title}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center text-slate-600">
                    <Camera className="h-8 w-8" />
                  </div>
                )}
              </div>

              <div className="p-4 space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <Badge variant="blue" className="text-[10px]">
                    {item.category}
                  </Badge>
                  <Badge variant={item.is_published ? "success" : "warning"} className="text-[10px]">
                    {item.is_published ? "Visible" : "Hidden"}
                  </Badge>
                </div>
                <h2 className="text-sm font-bold text-white leading-snug">
                  {item.title}
                </h2>
                {item.description && (
                  <p className="text-xs text-slate-400 line-clamp-2">{item.description}</p>
                )}
              </div>
            </div>

            <div className="px-4 py-3 border-t border-slate-800 flex items-center justify-between gap-2 text-xs text-slate-400">
              <div className="truncate">
                {item.location ? (
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="h-3 w-3 text-brand-blue" />
                    <span className="truncate">{item.location}</span>
                  </span>
                ) : item.activity_date ? (
                  <span>{formatDate(item.activity_date)}</span>
                ) : null}
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => openEdit(item)}
                  className="h-7 px-2 text-xs bg-slate-900 border-slate-700 text-slate-200 hover:bg-slate-800"
                >
                  <Edit2 className="h-3 w-3 mr-1" />
                  <span>Edit</span>
                </Button>
                {!item.id.startsWith("gal-") && (
                  <Button
                    type="button"
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(item.id)}
                    className="h-7 px-2 text-xs"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-xl bg-slate-950 border-slate-800 text-slate-100">
          <DialogHeader>
            <DialogTitle className="text-white">
              {editing && !editing.id.startsWith("gal-") ? "Edit Gallery Activity" : "Add Work Gallery Activity"}
            </DialogTitle>
            <DialogDescription className="text-slate-400">
              Upload a project photo or add details of a recent demolition, pickup, or yard activity.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-slate-200">Activity Title *</Label>
              <Input
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. Corporate Office Strip-Out – Lower Parel"
                className="bg-slate-900 border-slate-700 text-white"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-slate-200">Category *</Label>
                <Select
                  value={formData.category}
                  onValueChange={(val) => setFormData({ ...formData, category: val })}
                >
                  <SelectTrigger className="bg-slate-900 border-slate-700 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border-slate-700 text-white">
                    {GALLERY_CATEGORIES.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-slate-200">Activity Date</Label>
                <Input
                  type="date"
                  value={formData.activity_date}
                  onChange={(e) => setFormData({ ...formData, activity_date: e.target.value })}
                  className="bg-slate-900 border-slate-700 text-white"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-slate-200">Photo Upload or Image URL</Label>
              <div className="flex gap-2">
                <Input
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  placeholder="https://... or upload an image file"
                  className="bg-slate-900 border-slate-700 text-white"
                />
                <label className="inline-flex items-center justify-center gap-1.5 h-11 px-3.5 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 text-xs font-semibold cursor-pointer shrink-0">
                  {isUploading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Upload className="h-4 w-4" />
                  )}
                  <span>Upload</span>
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    onChange={handlePhotoUpload}
                    className="sr-only"
                  />
                </label>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-slate-200">Work Description</Label>
              <textarea
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe materials recovered, dismantling scope, or pickup details..."
                className="w-full rounded-lg border border-slate-700 bg-slate-900 p-3 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-blue"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-slate-200">Location</Label>
                <Input
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="MIDC Andheri East, Mumbai"
                  className="bg-slate-900 border-slate-700 text-white"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-slate-200">Highlight Stat Badge</Label>
                <Input
                  value={formData.highlight_stat}
                  onChange={(e) => setFormData({ ...formData, highlight_stat: e.target.value })}
                  placeholder="e.g. 4.5 Tons Steel & Copper"
                  className="bg-slate-900 border-slate-700 text-white"
                />
              </div>
            </div>

            <label className="flex items-center gap-2 text-xs font-semibold text-slate-300">
              <input
                type="checkbox"
                checked={formData.is_published}
                onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
                className="rounded border-slate-700"
              />
              <span>Show on public gallery page</span>
            </label>

            <div className="flex justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setModalOpen(false)}
                className="bg-slate-900 border-slate-700 text-slate-200"
              >
                Cancel
              </Button>
              <Button type="submit" variant="secondary" disabled={isSaving}>
                {isSaving && <Loader2 className="h-4 w-4 mr-1.5 animate-spin" />}
                <span>Save Activity</span>
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
