"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  TrendingUp,
  Plus,
  Edit2,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Layers,
  History,
} from "lucide-react";
import { ScrapCategory, ScrapItem } from "@/lib/types/database";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
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
import { saveCategory, saveItem } from "./actions";

interface RatesManagerProps {
  categories: ScrapCategory[];
  items: (ScrapItem & { category?: ScrapCategory })[];
}

export function RatesManager({ categories, items }: RatesManagerProps) {
  const router = useRouter();

  // Active sub-tab: items vs categories
  const [activeTab, setActiveTab] = React.useState<"items" | "categories">("items");

  // Item Modal
  const [itemModalOpen, setItemModalOpen] = React.useState(false);
  const [editingItem, setEditingItem] = React.useState<ScrapItem | null>(null);
  const [itemFormData, setItemFormData] = React.useState({
    category_id: categories[0]?.id || "",
    name: "",
    unit: "kg",
    rate_per_unit: 0,
    is_active: true,
  });

  // Category Modal
  const [catModalOpen, setCatModalOpen] = React.useState(false);
  const [editingCat, setEditingCat] = React.useState<ScrapCategory | null>(null);
  const [catFormData, setCatFormData] = React.useState({
    name: "",
    slug: "",
    icon: "Hammer",
    sort_order: 1,
    is_active: true,
  });

  const [isLoading, setIsLoading] = React.useState(false);

  // Item Handlers
  const openAddItemModal = () => {
    setEditingItem(null);
    setItemFormData({
      category_id: categories[0]?.id || "",
      name: "",
      unit: "kg",
      rate_per_unit: 0,
      is_active: true,
    });
    setItemModalOpen(true);
  };

  const openEditItemModal = (item: ScrapItem) => {
    setEditingItem(item);
    setItemFormData({
      category_id: item.category_id,
      name: item.name,
      unit: item.unit,
      rate_per_unit: Number(item.rate_per_unit) || 0,
      is_active: item.is_active,
    });
    setItemModalOpen(true);
  };

  const handleSaveItem = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const payload = {
      id: editingItem ? editingItem.id : undefined,
      category_id: itemFormData.category_id,
      name: itemFormData.name,
      unit: itemFormData.unit,
      rate_per_unit: Number(itemFormData.rate_per_unit) || 0,
      is_active: itemFormData.is_active,
    };

    const res = await saveItem(payload);
    setIsLoading(false);

    if (res.success) {
      toast.success(res.message);
      setItemModalOpen(false);
      router.refresh();
    } else {
      toast.error(res.error || "Failed to save item.");
    }
  };

  // Category Handlers
  const openAddCatModal = () => {
    setEditingCat(null);
    setCatFormData({
      name: "",
      slug: "",
      icon: "Hammer",
      sort_order: categories.length + 1,
      is_active: true,
    });
    setCatModalOpen(true);
  };

  const openEditCatModal = (cat: ScrapCategory) => {
    setEditingCat(cat);
    setCatFormData({
      name: cat.name,
      slug: cat.slug,
      icon: cat.icon || "Hammer",
      sort_order: cat.sort_order,
      is_active: cat.is_active,
    });
    setCatModalOpen(true);
  };

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const payload = {
      id: editingCat ? editingCat.id : undefined,
      name: catFormData.name,
      slug: catFormData.slug || catFormData.name.toLowerCase().replace(/\s+/g, "-"),
      icon: catFormData.icon,
      sort_order: Number(catFormData.sort_order) || 0,
      is_active: catFormData.is_active,
    };

    const res = await saveCategory(payload);
    setIsLoading(false);

    if (res.success) {
      toast.success(res.message);
      setCatModalOpen(false);
      router.refresh();
    } else {
      toast.error(res.error || "Failed to save category.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Tab Switcher & Quick Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant={activeTab === "items" ? "default" : "outline"}
            onClick={() => setActiveTab("items")}
            className="text-xs"
          >
            Scrap Materials ({items.length})
          </Button>
          <Button
            size="sm"
            variant={activeTab === "categories" ? "default" : "outline"}
            onClick={() => setActiveTab("categories")}
            className="text-xs"
          >
            Categories ({categories.length})
          </Button>
        </div>

        {activeTab === "items" ? (
          <Button size="sm" onClick={openAddItemModal} className="gap-1.5 font-bold text-xs bg-brand-blue">
            <Plus className="h-4 w-4" />
            <span>Add Scrap Item</span>
          </Button>
        ) : (
          <Button size="sm" onClick={openAddCatModal} className="gap-1.5 font-bold text-xs bg-brand-green">
            <Plus className="h-4 w-4" />
            <span>Add Category</span>
          </Button>
        )}
      </div>

      {/* ITEMS TABLE */}
      {activeTab === "items" && (
        <div className="rounded-2xl border border-slate-800 bg-slate-950 overflow-hidden shadow-subtle">
          <Table>
            <TableHeader className="bg-slate-900/80">
              <TableRow className="border-slate-800 hover:bg-slate-900">
                <TableHead className="text-slate-400 font-bold text-xs">Material Name</TableHead>
                <TableHead className="text-slate-400 font-bold text-xs">Category</TableHead>
                <TableHead className="text-slate-400 font-bold text-xs">Unit</TableHead>
                <TableHead className="text-slate-400 font-bold text-xs text-right">Current Rate</TableHead>
                <TableHead className="text-slate-400 font-bold text-xs">Status</TableHead>
                <TableHead className="text-slate-400 font-bold text-xs text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item.id} className="border-slate-800/80 hover:bg-slate-900/50">
                  <TableCell className="font-bold text-xs text-white">
                    {item.name}
                  </TableCell>
                  <TableCell className="text-xs text-slate-400">
                    {item.category?.name || "General"}
                  </TableCell>
                  <TableCell className="text-xs text-slate-400 uppercase font-mono">
                    per {item.unit}
                  </TableCell>
                  <TableCell className="text-xs font-black text-right text-emerald-400">
                    {item.rate_per_unit > 0 ? (
                      formatCurrency(item.rate_per_unit)
                    ) : (
                      <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded font-mono">
                        PLACEHOLDER (0.00)
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant={item.is_active ? "success" : "outline"} className="text-[10px]">
                      {item.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => openEditItemModal(item)}
                      className="h-8 text-xs border-slate-700 bg-slate-900 text-slate-200 hover:bg-slate-800"
                    >
                      <Edit2 className="h-3 w-3 mr-1" />
                      <span>Edit Rate</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* CATEGORIES TABLE */}
      {activeTab === "categories" && (
        <div className="rounded-2xl border border-slate-800 bg-slate-950 overflow-hidden shadow-subtle">
          <Table>
            <TableHeader className="bg-slate-900/80">
              <TableRow className="border-slate-800 hover:bg-slate-900">
                <TableHead className="text-slate-400 font-bold text-xs">Category Name</TableHead>
                <TableHead className="text-slate-400 font-bold text-xs">Slug</TableHead>
                <TableHead className="text-slate-400 font-bold text-xs">Icon</TableHead>
                <TableHead className="text-slate-400 font-bold text-xs">Sort Order</TableHead>
                <TableHead className="text-slate-400 font-bold text-xs">Status</TableHead>
                <TableHead className="text-slate-400 font-bold text-xs text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map((cat) => (
                <TableRow key={cat.id} className="border-slate-800/80 hover:bg-slate-900/50">
                  <TableCell className="font-bold text-xs text-white">
                    {cat.name}
                  </TableCell>
                  <TableCell className="text-xs font-mono text-slate-400">
                    {cat.slug}
                  </TableCell>
                  <TableCell className="text-xs text-slate-400">
                    {cat.icon || "Hammer"}
                  </TableCell>
                  <TableCell className="text-xs text-slate-400 font-mono">
                    {cat.sort_order}
                  </TableCell>
                  <TableCell>
                    <Badge variant={cat.is_active ? "success" : "outline"} className="text-[10px]">
                      {cat.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => openEditCatModal(cat)}
                      className="h-8 text-xs border-slate-700 bg-slate-900 text-slate-200 hover:bg-slate-800"
                    >
                      <Edit2 className="h-3 w-3 mr-1" />
                      <span>Edit</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* EDIT/ADD ITEM MODAL */}
      <Dialog open={itemModalOpen} onOpenChange={setItemModalOpen}>
        <DialogContent className="max-w-md bg-slate-950 border-slate-800 text-white">
          <DialogHeader>
            <DialogTitle>
              {editingItem ? `Edit Rate: ${editingItem.name}` : "Add New Scrap Item"}
            </DialogTitle>
            <DialogDescription className="text-slate-400 text-xs">
              Updating the rate automatically generates an audit record in rate_history.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSaveItem} className="space-y-4 pt-2">
            <div className="space-y-1">
              <Label className="text-xs text-slate-300">Category *</Label>
              <Select
                value={itemFormData.category_id}
                onValueChange={(val) =>
                  setItemFormData({ ...itemFormData, category_id: val })
                }
              >
                <SelectTrigger className="bg-slate-900 border-slate-700 text-white text-xs h-10">
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent className="bg-slate-900 border-slate-700 text-white">
                  {categories.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <Label className="text-xs text-slate-300">Item Name *</Label>
              <Input
                value={itemFormData.name}
                onChange={(e) =>
                  setItemFormData({ ...itemFormData, name: e.target.value })
                }
                placeholder="e.g. Armature Copper Wire"
                className="bg-slate-900 border-slate-700 text-white text-xs h-10"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs text-slate-300">Unit *</Label>
                <Select
                  value={itemFormData.unit}
                  onValueChange={(val) =>
                    setItemFormData({ ...itemFormData, unit: val })
                  }
                >
                  <SelectTrigger className="bg-slate-900 border-slate-700 text-white text-xs h-10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border-slate-700 text-white">
                    <SelectItem value="kg">kg (Kilogram)</SelectItem>
                    <SelectItem value="piece">piece (Per Unit)</SelectItem>
                    <SelectItem value="ton">ton (Metric Ton)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <Label className="text-xs text-slate-300">Rate per Unit (₹ INR) *</Label>
                <Input
                  type="number"
                  step="0.5"
                  min="0"
                  value={itemFormData.rate_per_unit}
                  onChange={(e) =>
                    setItemFormData({
                      ...itemFormData,
                      rate_per_unit: parseFloat(e.target.value) || 0,
                    })
                  }
                  className="bg-slate-900 border-slate-700 text-emerald-400 font-bold text-xs h-10"
                  required
                />
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <input
                id="item_active"
                type="checkbox"
                checked={itemFormData.is_active}
                onChange={(e) =>
                  setItemFormData({ ...itemFormData, is_active: e.target.checked })
                }
                className="h-4 w-4 rounded text-brand-blue"
              />
              <Label htmlFor="item_active" className="text-xs font-normal text-slate-300">
                Active on public rates table & calculator
              </Label>
            </div>

            <div className="pt-2 flex justify-end gap-2 border-t border-slate-800">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setItemModalOpen(false)}
                className="border-slate-700 bg-slate-900 text-slate-300"
              >
                Cancel
              </Button>
              <Button type="submit" size="sm" disabled={isLoading} className="font-bold bg-brand-blue">
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-1.5" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <span>Save Scrap Item</span>
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* EDIT/ADD CATEGORY MODAL */}
      <Dialog open={catModalOpen} onOpenChange={setCatModalOpen}>
        <DialogContent className="max-w-md bg-slate-950 border-slate-800 text-white">
          <DialogHeader>
            <DialogTitle>
              {editingCat ? `Edit Category: ${editingCat.name}` : "Add New Category"}
            </DialogTitle>
            <DialogDescription className="text-slate-400 text-xs">
              Manage category taxonomy and display order.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSaveCategory} className="space-y-4 pt-2">
            <div className="space-y-1">
              <Label className="text-xs text-slate-300">Category Name *</Label>
              <Input
                value={catFormData.name}
                onChange={(e) =>
                  setCatFormData({ ...catFormData, name: e.target.value })
                }
                placeholder="e.g. Copper"
                className="bg-slate-900 border-slate-700 text-white text-xs h-10"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs text-slate-300">Slug</Label>
                <Input
                  value={catFormData.slug}
                  onChange={(e) =>
                    setCatFormData({ ...catFormData, slug: e.target.value })
                  }
                  placeholder="e.g. copper"
                  className="bg-slate-900 border-slate-700 text-white text-xs h-10 font-mono"
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs text-slate-300">Sort Order</Label>
                <Input
                  type="number"
                  value={catFormData.sort_order}
                  onChange={(e) =>
                    setCatFormData({
                      ...catFormData,
                      sort_order: parseInt(e.target.value) || 0,
                    })
                  }
                  className="bg-slate-900 border-slate-700 text-white text-xs h-10 font-mono"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <input
                id="cat_active"
                type="checkbox"
                checked={catFormData.is_active}
                onChange={(e) =>
                  setCatFormData({ ...catFormData, is_active: e.target.checked })
                }
                className="h-4 w-4 rounded text-brand-blue"
              />
              <Label htmlFor="cat_active" className="text-xs font-normal text-slate-300">
                Active on public site
              </Label>
            </div>

            <div className="pt-2 flex justify-end gap-2 border-t border-slate-800">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setCatModalOpen(false)}
                className="border-slate-700 bg-slate-900 text-slate-300"
              >
                Cancel
              </Button>
              <Button type="submit" size="sm" disabled={isLoading} className="font-bold bg-brand-green">
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-1.5" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <span>Save Category</span>
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

