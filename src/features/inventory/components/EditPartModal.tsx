"use client";

import { useEffect, useState } from "react";
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
import { Loader2 } from "lucide-react";
import { usePartCategories } from "../hooks/usePartCategories";
import { useSuppliers } from "../hooks/useSuppliers";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface EditPartModalProps {
  isOpen: boolean;
  onClose: () => void;
  part?: Part;
  onSave: (data: Partial<Part>) => void;
  isSaving?: boolean;
}

import { useTranslations } from "next-intl";

export function EditPartModal({ isOpen, onClose, part, onSave, isSaving = false }: EditPartModalProps) {
  const t = useTranslations("inventory.details.editModal");
  const [formData, setFormData] = useState<Partial<UpdatePartRequest>>({
    name: "",
    part_number: "",
    sku: "",
    unit_price: 0,
    min_quantity: 0,
    description: "",
    brand: "",
    category_id: "",
    supplier_id: "",
    unit: "piece",
    location: "",
  });

  const { data: categories } = usePartCategories();
  const { data: suppliersData } = useSuppliers({ page_size: 100 });
  const suppliers = suppliersData?.data || [];

  useEffect(() => {
    if (isOpen) {
      if (part) {
        setFormData({
          name: part.name || "",
          part_number: part.part_number || "",
          sku: part.sku || "",
          unit_price: part.unit_price || 0,
          min_quantity: part.min_quantity || 0,
          description: part.description || "",
          brand: part.brand || "",
          category_id: part.category_id || "",
          supplier_id: part.supplier_id || "",
          unit: part.unit || "piece",
          location: part.location || "",
        });
      } else {
        setFormData({
            name: "",
            part_number: "",
            sku: "",
            unit_price: 0,
            min_quantity: 0,
            description: "",
            brand: "",
            category_id: "",
            supplier_id: "",
            unit: "piece",
            location: "",
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
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{part ? t("title.edit") : t("title.create")}</DialogTitle>
          <DialogDescription>
            {part 
              ? t("description.edit", { name: part.name }) 
              : t("description.create")}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="part_number">{t("fields.part_number")}</Label>
              <Input
                id="part_number"
                value={formData.part_number}
                onChange={(e) => handleChange("part_number", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">{t("fields.name")}</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sku">{t("fields.sku")}</Label>
              <Input
                id="sku"
                value={formData.sku || ""}
                onChange={(e) => handleChange("sku", e.target.value)}
                placeholder={t("placeholders.sku")}
              />
            </div>
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
            <div className="space-y-2">
              <Label htmlFor="unit_price">{t("fields.price")}</Label>
              <Input
                id="unit_price"
                type="number"
                step="0.01"
                min="0"
                value={formData.unit_price}
                onChange={(e) => handleChange("unit_price", parseFloat(e.target.value) || 0)}
                required
              />
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
              <Label htmlFor="brand">{t("fields.brand")}</Label>
              <Input
                id="brand"
                value={formData.brand || ""}
                onChange={(e) => handleChange("brand", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">{t("fields.location")}</Label>
               <Input
                id="location"
                value={formData.location || ""}
                onChange={(e) => handleChange("location", e.target.value)}
                placeholder={t("placeholders.location")}
              />
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

          <DialogFooter>
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
