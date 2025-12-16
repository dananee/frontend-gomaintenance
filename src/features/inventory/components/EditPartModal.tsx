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

interface EditPartModalProps {
  isOpen: boolean;
  onClose: () => void;
  part?: Part;
  onSave: (data: Partial<Part>) => void;
  isSaving?: boolean;
}

export function EditPartModal({ isOpen, onClose, part, onSave, isSaving = false }: EditPartModalProps) {
  const [formData, setFormData] = useState<Partial<UpdatePartRequest>>({
    name: "",
    part_number: "",
    unit_price: 0,
    min_quantity: 0,
    description: "",
    brand: "",
    category: "",
    location: "",
  });

  useEffect(() => {
    if (isOpen) {
      if (part) {
        setFormData({
          name: part.name || "",
          part_number: part.part_number || "",
          unit_price: part.unit_price || part.cost || 0,
          min_quantity: part.min_quantity || 0,
          description: part.description || "",
          brand: part.brand || "",
          category: part.category || "",
          location: part.location || "",
        });
      } else {
        setFormData({
            name: "",
            part_number: "",
            unit_price: 0,
            min_quantity: 0,
            description: "",
            brand: "",
            category: "",
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
          <DialogTitle>{part ? "Edit Part Details" : "Create New Part"}</DialogTitle>
          <DialogDescription>
            {part 
              ? `Update the information for ${part.name}.` 
              : "Enter the details for the new part."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="part_number">Part Number / SKU</Label>
              <Input
                id="part_number"
                value={formData.part_number}
                onChange={(e) => handleChange("part_number", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">Part Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="brand">Brand</Label>
              <Input
                id="brand"
                value={formData.brand || ""}
                onChange={(e) => handleChange("brand", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                value={formData.category || ""}
                onChange={(e) => handleChange("category", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="unit_price">Unit Price ($)</Label>
              <Input
                id="unit_price"
                type="number"
                step="0.01"
                min="0"
                value={formData.unit_price}
                onChange={(e) => handleChange("unit_price", parseFloat(e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="min_quantity">Min. Quantity (Reorder Point)</Label>
              <Input
                id="min_quantity"
                type="number"
                min="0"
                value={formData.min_quantity}
                onChange={(e) => handleChange("min_quantity", parseInt(e.target.value))}
              />
            </div>
            <div className="col-span-2 space-y-2">
              <Label htmlFor="location">Default Location</Label>
               <Input
                id="location"
                value={formData.location || ""}
                onChange={(e) => handleChange("location", e.target.value)}
                placeholder="e.g. Aisle 5, Shelf B"
              />
            </div>
            <div className="col-span-2 space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={formData.description || ""}
                onChange={(e) => handleChange("description", e.target.value)}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={isSaving}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSaving}>
              {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {part ? "Save Changes" : "Create Part"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
