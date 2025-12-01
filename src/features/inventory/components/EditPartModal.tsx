"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Part } from "../types/inventory.types";
import { useSuppliers } from "@/features/inventory/hooks/useSupplierMutations";

interface EditPartModalProps {
  isOpen: boolean;
  onClose: () => void;
  part?: Part;
  onSave: (part: Partial<Part>) => void;
}

export function EditPartModal({ isOpen, onClose, part, onSave }: EditPartModalProps) {
  const { register, handleSubmit, setValue, watch, reset } = useForm<Partial<Part>>({
    defaultValues: part || {
      name: "",
      part_number: "",
      category: "",
      location: "",
      quantity: 0,
      min_quantity: 5,
      cost: 0,
      supplier: "",
      description: "",
    },
  });

  // Reset form when part prop changes
  useEffect(() => {
    if (part) {
      reset(part);
    } else {
      reset({
        name: "",
        part_number: "",
        category: "",
        location: "",
        quantity: 0,
        min_quantity: 5,
        cost: 0,
        supplier: "",
        description: "",
      });
    }
  }, [part, reset]);

  // Fetch suppliers for the dropdown
  const { data: suppliersData, isLoading: isLoadingSuppliers } = useSuppliers();
  const suppliers = suppliersData?.data || [];
  const currentSupplier = watch("supplier");

  const onSubmit = (data: Partial<Part>) => {
    onSave(data);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700">
        <DialogHeader>
          <DialogTitle>{part ? "Edit Part" : "Add New Part"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Part Name</label>
              <Input {...register("name", { required: true })} placeholder="e.g. Brake Pads" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Part Number (SKU)</label>
              <Input {...register("part_number", { required: true })} placeholder="e.g. BP-123" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Category</label>
              <Select 
                defaultValue={part?.category} 
                onValueChange={(val) => setValue("category", val)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Engine">Engine</SelectItem>
                  <SelectItem value="Brakes">Brakes</SelectItem>
                  <SelectItem value="Suspension">Suspension</SelectItem>
                  <SelectItem value="Electrical">Electrical</SelectItem>
                  <SelectItem value="Filters">Filters</SelectItem>
                  <SelectItem value="Fluids">Fluids</SelectItem>
                  <SelectItem value="Tires">Tires</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Location</label>
              <Input {...register("location")} placeholder="e.g. Shelf A-1" />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Quantity</label>
              <Input 
                type="number" 
                {...register("quantity", { valueAsNumber: true })} 
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Min. Quantity</label>
              <Input 
                type="number" 
                {...register("min_quantity", { valueAsNumber: true })} 
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Unit Cost</label>
              <Input 
                type="number" 
                step="0.01"
                {...register("cost", { valueAsNumber: true })} 
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Supplier</label>
            <Select 
              value={currentSupplier} 
              onValueChange={(val) => setValue("supplier", val)}
              disabled={isLoadingSuppliers}
            >
              <SelectTrigger>
                <SelectValue placeholder={isLoadingSuppliers ? "Loading suppliers..." : "Select supplier"} />
              </SelectTrigger>
              <SelectContent>
                {suppliers.length > 0 ? (
                  suppliers.map((supplier) => (
                    <SelectItem key={supplier.id} value={supplier.name}>
                      {supplier.name}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="none" disabled>No suppliers found</SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Description</label>
            <Textarea {...register("description")} placeholder="Part details..." />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {part ? "Save Changes" : "Create Part"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
