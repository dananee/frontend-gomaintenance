"use client";

import { useState } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { StockAdjustment } from "../types/inventory.types";
import { Plus, Minus, RotateCcw } from "lucide-react";
import { toast } from "sonner";

interface StockAdjustmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  partName: string;
  currentStock: number;
  onSave: (
    adjustment: Omit<StockAdjustment, "id" | "created_at" | "adjusted_by">
  ) => void;
}

export function StockAdjustmentModal({
  isOpen,
  onClose,
  partName,
  currentStock,
  onSave,
}: StockAdjustmentModalProps) {
  const [adjustmentType, setAdjustmentType] = useState<
    "add" | "remove" | "set"
  >("add");
  const [quantity, setQuantity] = useState<number>(0);
  const [reason, setReason] = useState("");
  const [notes, setNotes] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!reason.trim()) {
      toast.error("Reason required", {
        description: "Please select a reason for this stock adjustment.",
      });
      return;
    }

    if (quantity <= 0) {
      toast.error("Invalid quantity", {
        description: "Quantity must be greater than zero.",
      });
      return;
    }

    if (adjustmentType === "remove" && quantity > currentStock) {
      toast.warning("Insufficient stock", {
        description: `Cannot remove ${quantity} units. Only ${currentStock} units available.`,
      });
      return;
    }

    onSave({
      part_id: "", // This will be set by parent
      adjustment_type: adjustmentType,
      quantity,
      reason,
      notes: notes.trim() || undefined,
    });

    // Reset form
    setAdjustmentType("add");
    setQuantity(0);
    setReason("");
    setNotes("");
    onClose();
  };

  const getNewStock = () => {
    switch (adjustmentType) {
      case "add":
        return currentStock + quantity;
      case "remove":
        return Math.max(0, currentStock - quantity);
      case "set":
        return quantity;
      default:
        return currentStock;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Adjust Stock - {partName}</DialogTitle>
          <DialogDescription>
            Current stock:{" "}
            <span className="font-semibold">{currentStock} units</span>
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Adjustment Type */}
          <div className="space-y-2">
            <Label>Adjustment Type</Label>
            <div className="grid grid-cols-3 gap-2">
              <Button
                type="button"
                variant={adjustmentType === "add" ? "primary" : "outline"}
                onClick={() => setAdjustmentType("add")}
                className="justify-start"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Stock
              </Button>
              <Button
                type="button"
                variant={adjustmentType === "remove" ? "primary" : "outline"}
                onClick={() => setAdjustmentType("remove")}
                className="justify-start"
              >
                <Minus className="mr-2 h-4 w-4" />
                Remove
              </Button>
              <Button
                type="button"
                variant={adjustmentType === "set" ? "primary" : "outline"}
                onClick={() => setAdjustmentType("set")}
                className="justify-start"
              >
                <RotateCcw className="mr-2 h-4 w-4" />
                Set To
              </Button>
            </div>
          </div>

          {/* Quantity */}
          <div className="space-y-2">
            <Label htmlFor="quantity">
              {adjustmentType === "set" ? "New Stock Level" : "Quantity"}
            </Label>
            <Input
              id="quantity"
              type="number"
              min="0"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              placeholder={
                adjustmentType === "set"
                  ? "Enter new stock level"
                  : "Enter quantity"
              }
              required
            />
            {quantity > 0 && (
              <p className="text-sm text-gray-600 dark:text-gray-400">
                New stock level:{" "}
                <span className="font-semibold">{getNewStock()} units</span>
                <span className="ml-2 text-xs">
                  (
                  {adjustmentType === "add"
                    ? "+"
                    : adjustmentType === "remove"
                    ? "-"
                    : "="}
                  {quantity})
                </span>
              </p>
            )}
          </div>

          {/* Reason */}
          <div className="space-y-2">
            <Label htmlFor="reason">Reason *</Label>
            <Select value={reason} onValueChange={setReason} required>
              <SelectTrigger>
                <SelectValue placeholder="Select a reason" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="received_shipment">
                  Received Shipment
                </SelectItem>
                <SelectItem value="used_in_work_order">
                  Used in Work Order
                </SelectItem>
                <SelectItem value="damaged">Damaged/Defective</SelectItem>
                <SelectItem value="lost">Lost/Missing</SelectItem>
                <SelectItem value="inventory_count">
                  Inventory Count Adjustment
                </SelectItem>
                <SelectItem value="returned">Returned to Supplier</SelectItem>
                <SelectItem value="transfer">
                  Transfer Between Locations
                </SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Additional Notes</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any additional details..."
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Confirm Adjustment</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
