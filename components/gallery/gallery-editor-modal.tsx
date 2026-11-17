"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Loader2,
  Camera,
  Upload,
  Sparkles,
  MapPin,
  Calendar,
  TrendingUp,
  Image as ImageIcon,
  Check,
} from "lucide-react";
import type { GalleryItem } from "@/lib/types/database";
import { GALLERY_CATEGORIES } from "@/lib/content-constants";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import {
  saveGalleryItem,
  uploadGalleryPhotoAction,
} from "@/app/admin/gallery/actions";

interface GalleryEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  item?: GalleryItem | null;
  onSaved?: (savedItem: Partial<GalleryItem>) => void;
}

export const PRESET_GALLERY_IMAGES = [
  { label: "Demolition & Soft-Strip", url: "/gallery/corporate-demolition.svg" },
  { label: "Industrial Plant Clearance", url: "/gallery/industrial-clearance.svg" },
  { label: "Digital Weighing & Scale", url: "/gallery/digital-weighing.svg" },
  { label: "Copper & Brass Sorting", url: "/gallery/copper-brass-sorting.svg" },
  { label: "E-Waste & IT Recovery", url: "/gallery/ewaste-recovery.svg" },
  { label: "Doorstep Scrap Pickup", url: "/gallery/doorstep-pickup.svg" },
];

export function GalleryEditorModal({
  isOpen,
  onClose,
  item,
  onSaved,
}: GalleryEditorModalProps) {
  const router = useRouter();
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  const [isSaving, setIsSaving] = React.useState(false);
  const [isUploading, setIsUploading] = React.useState(false);

  const [formData, setFormData] = React.useState<{
    title: string;
    category: string;
    description: string;
    location: string;
    activity_date: string;
    image_url: string;
    highlight_stat: string;
    sort_order: number;
    is_published: boolean;
  }>({
    title: "",
    category: (GALLERY_CATEGORIES[0] || "Demolition & Dismantling") as string,
    description: "",
    location: "MIDC Andheri East, Mumbai",
    activity_date: new Date().toISOString().split("T")[0],
    image_url: "/gallery/corporate-demolition.svg",
    highlight_stat: "100% Calibrated Digital Scale",
    sort_order: 1,
    is_published: true,
  });

  React.useEffect(() => {
    if (item) {
      setFormData({
        title: item.title,
        category: item.category,
        description: item.description || "",
        location: item.location || "MIDC Andheri East, Mumbai",
        activity_date:
          item.activity_date || new Date().toISOString().split("T")[0],
        image_url: item.image_url || "/gallery/corporate-demolition.svg",
        highlight_stat: item.highlight_stat || "",
        sort_order: item.sort_order ?? 1,
        is_published: item.is_published ?? true,
      });
    } else {
      setFormData({
        title: "",
        category: GALLERY_CATEGORIES[0] || "Demolition & Dismantling",
        description: "",
        location: "MIDC Andheri East, Mumbai",
        activity_date: new Date().toISOString().split("T")[0],
        image_url: "/gallery/corporate-demolition.svg",
        highlight_stat: "Verified Weight & Instant Payout",
        sort_order: 1,
        is_published: true,
      });
    }
  }, [item, isOpen]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const toastId = toast.loading("Uploading photo from your device...");

    try {
      const uploadData = new FormData();
      uploadData.append("file", file);

      const res = await uploadGalleryPhotoAction(uploadData);
      if (res.success && res.url) {
        setFormData((prev) => ({ ...prev, image_url: res.url! }));
        toast.success("Photo uploaded successfully!", { id: toastId });
      } else {
        toast.error(res.error || "Upload failed. Please try again.", {
          id: toastId,
        });
      }
    } catch {
      toast.error("Upload error. You can also paste an image URL or choose a preset.", {
        id: toastId,
      });
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim() || formData.title.trim().length < 3) {
      toast.error("Please enter an activity title (minimum 3 characters).");
      return;
    }
    if (!formData.category.trim()) {
      toast.error("Please select an activity category.");
      return;
    }

    setIsSaving(true);
    try {
      const res = await saveGalleryItem({
        id: item?.id,
        title: formData.title.trim(),
        category: formData.category,
        description: formData.description.trim() || null,
        location: formData.location.trim() || null,
        activity_date: formData.activity_date || null,
        image_url: formData.image_url || "/gallery/corporate-demolition.svg",
        highlight_stat: formData.highlight_stat.trim() || null,
        sort_order: Number(formData.sort_order) || 0,
        is_published: formData.is_published,
      });

      if (res.success) {
        toast.success(
          item
            ? "Gallery activity updated successfully!"
            : "New photo & field activity published!"
        );
        onClose();
        router.refresh();
        if (onSaved) {
          onSaved({
            id: item?.id,
            ...formData,
          });
        }
      } else {
        toast.error(res.error || "Failed to save gallery photo");
      }
    } catch {
      toast.error("An unexpected error occurred while saving.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl max-h-[92vh] overflow-y-auto rounded-3xl p-6 sm:p-8">
        <DialogHeader className="space-y-1 pb-2 border-b border-brand-border">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-brand-green">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Owner Studio • Field Operations</span>
          </div>
          <DialogTitle className="text-xl sm:text-2xl font-bold text-brand-dark">
            {item ? "Edit Gallery Activity & Photo" : "Add New Field Photo / Activity"}
          </DialogTitle>
          <DialogDescription className="text-xs sm:text-sm text-brand-muted">
            Share recent corporate office strip-outs, industrial machinery clearances,
            calibrated weighing sessions, or recycling drives with clients.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 pt-3">
          {/* 1. Activity Title */}
          <div className="space-y-1.5">
            <Label
              htmlFor="gallery-title"
              className="text-xs font-bold uppercase tracking-wider text-brand-dark"
            >
              Activity / Project Title *
            </Label>
            <Input
              id="gallery-title"
              required
              value={formData.title}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, title: e.target.value }))
              }
              placeholder="e.g. Corporate Office Dismantling & Copper Cable Recovery"
              className="text-sm font-semibold"
            />
          </div>

          {/* 2. Category & Highlight Stat */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-bold uppercase tracking-wider text-brand-dark">
                Activity Category *
              </Label>
              <Select
                value={formData.category}
                onValueChange={(val) =>
                  setFormData((prev) => ({ ...prev, category: val }))
                }
              >
                <SelectTrigger className="text-xs font-semibold">
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent>
                  {GALLERY_CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat} className="text-xs">
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label
                htmlFor="gallery-stat"
                className="text-xs font-bold uppercase tracking-wider text-brand-dark flex items-center gap-1"
              >
                <TrendingUp className="h-3.5 w-3.5 text-brand-blue" />
                <span>Highlight Metric / Badge</span>
              </Label>
              <Input
                id="gallery-stat"
                value={formData.highlight_stat}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    highlight_stat: e.target.value,
                  }))
                }
                placeholder="e.g. 4.8 Tons Metal Cleared"
                className="text-xs font-medium"
              />
            </div>
          </div>

          {/* 3. Location & Activity Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label
                htmlFor="gallery-location"
                className="text-xs font-bold uppercase tracking-wider text-brand-dark flex items-center gap-1"
              >
                <MapPin className="h-3.5 w-3.5 text-brand-blue" />
                <span>Site Location</span>
              </Label>
              <Input
                id="gallery-location"
                value={formData.location}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, location: e.target.value }))
                }
                placeholder="e.g. MIDC Andheri East, Mumbai"
                className="text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <Label
                htmlFor="gallery-date"
                className="text-xs font-bold uppercase tracking-wider text-brand-dark flex items-center gap-1"
              >
                <Calendar className="h-3.5 w-3.5 text-brand-blue" />
                <span>Activity Date</span>
              </Label>
              <Input
                id="gallery-date"
                type="date"
                value={formData.activity_date}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    activity_date: e.target.value,
                  }))
                }
                className="text-xs"
              />
            </div>
          </div>

          {/* 4. Photo Section */}
          <div className="space-y-2.5 p-4 rounded-2xl bg-brand-surface border border-brand-border">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-bold uppercase tracking-wider text-brand-dark flex items-center gap-1.5">
                <Camera className="h-4 w-4 text-brand-green" />
                <span>Activity Photo / Vector Graphics *</span>
              </Label>
              <span className="text-[11px] text-brand-muted">
                File upload, Presets, or Direct URL
              </span>
            </div>

            {/* Current Active Preview */}
            <div className="relative aspect-[16/9] w-full rounded-xl overflow-hidden bg-muted border border-brand-border flex items-center justify-center">
              {formData.image_url ? (
                <img
                  src={formData.image_url}
                  alt="Activity Preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex flex-col items-center gap-1.5 text-brand-muted">
                  <ImageIcon className="h-8 w-8 text-muted-foreground" />
                  <span className="text-xs">No image selected</span>
                </div>
              )}
            </div>

            {/* File Upload Trigger */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
                id="gallery-file-input"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={isUploading}
                onClick={() => fileInputRef.current?.click()}
                className="text-xs gap-1.5 h-8 font-semibold cursor-pointer"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    <span>Uploading...</span>
                  </>
                ) : (
                  <>
                    <Upload className="h-3.5 w-3.5" />
                    <span>Upload from Phone / Computer</span>
                  </>
                )}
              </Button>
            </div>

            {/* Presets Grid */}
            <div className="space-y-1.5 pt-2">
              <p className="text-[11px] font-bold text-brand-muted uppercase tracking-wider">
                Or select high-contrast activity illustrations:
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {PRESET_GALLERY_IMAGES.map((preset) => {
                  const isSelected = formData.image_url === preset.url;
                  return (
                    <button
                      key={preset.url}
                      type="button"
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          image_url: preset.url,
                        }))
                      }
                      className={`relative text-left p-2 rounded-xl border text-xs transition-all ${
                        isSelected
                          ? "border-brand-green bg-brand-green-light/40 ring-2 ring-brand-green font-semibold"
                          : "border-brand-border bg-white hover:border-brand-blue"
                      }`}
                    >
                      <div className="aspect-[16/10] rounded-lg overflow-hidden bg-muted mb-1 border border-brand-border/60">
                        <img
                          src={preset.url}
                          alt={preset.label}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-[10px] font-bold text-brand-dark truncate">
                          {preset.label}
                        </p>
                        {isSelected && (
                          <Check className="h-3 w-3 text-brand-green shrink-0 ml-1" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Custom URL Input */}
            <div className="pt-2">
              <Input
                value={formData.image_url}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    image_url: e.target.value,
                  }))
                }
                placeholder="Or paste custom image link (https://...)"
                className="text-xs h-8"
              />
            </div>
          </div>

          {/* 5. Description */}
          <div className="space-y-1.5">
            <Label
              htmlFor="gallery-desc"
              className="text-xs font-bold uppercase tracking-wider text-brand-dark"
            >
              Activity Description
            </Label>
            <textarea
              id="gallery-desc"
              rows={3}
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              placeholder="Describe the scrap materials segregated, digital scale readings, corporate clients, or recycling process..."
              className="w-full p-3 rounded-xl border border-brand-border bg-brand-surface text-xs text-brand-dark focus:outline-none focus:ring-2 focus:ring-brand-blue resize-none"
            />
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-brand-border">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              disabled={isSaving}
              className="text-xs h-9 px-4"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={isSaving || isUploading}
              className="bg-brand-green hover:bg-brand-green/90 text-white font-bold text-xs h-9 px-5 gap-1.5 shadow-sm rounded-xl"
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  <span>Saving Activity...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>
                    {item ? "Update Activity" : "Publish Photo & Activity"}
                  </span>
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
