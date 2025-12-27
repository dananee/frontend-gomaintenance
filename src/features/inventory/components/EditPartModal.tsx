"use client";

import { useEffect, useState, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Part, UpdatePartRequest } from "../types/inventory.types";
import { Loader2, AlertCircle } from "lucide-react";
import { usePartCategories } from "../hooks/usePartCategories";
import { useSuppliers } from "../hooks/useSuppliers";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useTranslations } from "next-intl";

interface EditPartModalProps {
  isOpen: boolean;
  onClose: () => void;
  part?: Part;
  onSave: (data: Partial<Part>) => void;
  isSaving?: boolean;
}

const VAT_OPTIONS = [0, 7, 10, 14, 20];

export function EditPartModal({ isOpen, onClose, part, onSave, isSaving = false }: EditPartModalProps) {
  const t = useTranslations("inventory.details.editModal");
  const [formData, setFormData] = useState<Partial<UpdatePartRequest>>({
    name: "",
    part_number: "",
    sku: "",
    unit_price_ht: 0,
    vat_rate: 20,
    is_critical: false,
    min_quantity: 0,
    description: "",
    brand: "",
    category_id: "",
    supplier_id: "",
    unit: "piece",
    default_location: "",
  });

  const { data: categories } = usePartCategories();
  const { data: suppliersData } = useSuppliers({ page_size: 100 });
  const suppliers = suppliersData?.data || [];

  const priceTTC = useMemo(() => {
    const ht = formData.unit_price_ht || 0;
    const vat = formData.vat_rate || 0;
    return ht * (1 + vat / 100);
  }, [formData.unit_price_ht, formData.vat_rate]);

  useEffect(() => {
    if (isOpen) {
      if (part) {
        setFormData({
          name: part.name || "",
          part_number: part.part_number || "",
          sku: part.sku || "",
          unit_price_ht: part.unit_price_ht || 0,
          vat_rate: part.vat_rate || 20,
          is_critical: part.is_critical || false,
          min_quantity: part.min_quantity || 0,
          description: part.description || "",
          brand: part.brand || "",
          category_id: part.category_id || "",
          supplier_id: part.supplier_id || "",
          unit: part.unit || "piece",
          default_location: part.default_location || "",
        });
      } else {
        setFormData({
          name: "",
          part_number: "",
          sku: "",
          unit_price_ht: 0,
          vat_rate: 20,
          is_critical: false,
          min_quantity: 0,
          description: "",
          brand: "",
          category_id: "",
          supplier_id: "",
          unit: "piece",
          default_location: "",
        });
      }
    }
  }, [isOpen, part]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData as Partial<Part>);
  };

  const handleChange = (field: keyof UpdatePartRequest, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{part ? t("title.edit") : t("title.create")}</DialogTitle>
          <DialogDescription>
            {part 
              ? t("description.edit", { name: part.name }) 
              : t("description.create")}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Info */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">{t("fields.brand") || "General Info"}</h3>
              
              <div className="space-y-2">
                <Label htmlFor="name" className="flex items-center gap-1">
                  {t("fields.name")} <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="part_number" className="flex items-center gap-1">
                  {t("fields.part_number")} <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="part_number"
                  value={formData.part_number}
                  onChange={(e) => handleChange("part_number", e.target.value)}
                  placeholder={t("placeholders.part_number")}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="sku" className="flex items-center gap-1">
                  {t("fields.sku")} <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="sku"
                  value={formData.sku || ""}
                  onChange={(e) => handleChange("sku", e.target.value)}
                  placeholder={t("placeholders.sku")}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="brand">{t("fields.brand")}</Label>
                  <Input
                    id="brand"
                    value={formData.brand || ""}
                    onChange={(e) => handleChange("brand", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="unit">{t("fields.unit")}</Label>
                  <Select
                    value={formData.unit || "piece"}
                    onValueChange={(value) => handleChange("unit", value)}
                  >
                    <SelectTrigger id="unit">
                      <SelectValue placeholder={t("placeholders.unit")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="piece">{t("units.piece")}</SelectItem>
                      <SelectItem value="liter">{t("units.liter")}</SelectItem>
                      <SelectItem value="kg">{t("units.kg")}</SelectItem>
                      <SelectItem value="set">{t("units.set")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Accounting & Inventory */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">{t("fields.price") || "Accounting"}</h3>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="unit_price_ht">{t("fields.price")}</Label>
                  <Input
                    id="unit_price_ht"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.unit_price_ht}
                    onChange={(e) => handleChange("unit_price_ht", parseFloat(e.target.value) || 0)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="vat_rate">{t("fields.vat_rate")}</Label>
                  <Select
                    value={formData.vat_rate?.toString()}
                    onValueChange={(value) => handleChange("vat_rate", parseInt(value))}
                  >
                    <SelectTrigger id="vat_rate">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {VAT_OPTIONS.map(rate => (
                        <SelectItem key={rate} value={rate.toString()}>{rate}%</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="bg-muted/30 p-3 rounded-lg border border-dashed text-sm">
                <div className="flex justify-between items-center font-bold">
                  <span>{t("fields.price_ttc")}</span>
                  <span className="text-lg">{priceTTC.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} <span className="text-xs font-normal text-muted-foreground">MAD</span></span>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="min_quantity">{t("fields.minQuantity")}</Label>
                <Input
                  id="min_quantity"
                  type="number"
                  min="0"
                  value={formData.min_quantity}
                  onChange={(e) => handleChange("min_quantity", parseInt(e.target.value) || 0)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="default_location">{t("fields.location")}</Label>
                <Input
                  id="default_location"
                  value={formData.default_location || ""}
                  onChange={(e) => handleChange("default_location", e.target.value)}
                  placeholder={t("placeholders.location")}
                />
              </div>

              <div className="flex items-center space-x-2 pt-2">
                <Checkbox 
                  id="is_critical" 
                  checked={formData.is_critical}
                  onCheckedChange={(checked) => handleChange("is_critical", checked)}
                />
                <Label htmlFor="is_critical" className="font-medium flex items-center gap-1.5 cursor-pointer">
                  {t("fields.is_critical")}
                  {formData.is_critical && <AlertCircle className="h-4 w-4 text-amber-500 fill-amber-500/10" />}
                </Label>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t">
            <div className="space-y-2">
              <Label htmlFor="category">{t("fields.category")}</Label>
              <Select
                value={formData.category_id || "none"}
                onValueChange={(value) => handleChange("category_id", value === "none" ? "" : value)}
              >
                <SelectTrigger id="category">
                  <SelectValue placeholder={t("placeholders.category")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">{t("placeholders.none")}</SelectItem>
                  {categories?.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="supplier">{t("fields.supplier")}</Label>
              <Select
                value={formData.supplier_id || "none"}
                onValueChange={(value) => handleChange("supplier_id", value === "none" ? "" : value)}
              >
                <SelectTrigger id="supplier">
                  <SelectValue placeholder={t("placeholders.supplier")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">{t("placeholders.none")}</SelectItem>
                  {suppliers.map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      {s.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">{t("fields.description")}</Label>
            <Input
              id="description"
              value={formData.description || ""}
              onChange={(e) => handleChange("description", e.target.value)}
            />
          </div>

          <DialogFooter className="sticky bottom-0 bg-background pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose} disabled={isSaving}>
              {t("cancel")}
            </Button>
            <Button type="submit" disabled={isSaving}>
              {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {t("save")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
