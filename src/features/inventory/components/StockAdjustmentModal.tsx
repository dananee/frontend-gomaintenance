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
import { CreateStockMovementRequest, InventoryStock } from "../types/inventory.types";
import { Warehouse } from "@/features/inventory/api/inventory";
import { Plus, Minus, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface StockAdjustmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  partName: string;
  globalStock: number; // For reference
  warehouses?: Warehouse[];
  stocks?: InventoryStock[]; // New prop: current stock levels
  onSave: (
    adjustment: CreateStockMovementRequest
  ) => void;
}

export function StockAdjustmentModal({
  isOpen,
  onClose,
  partName,
  globalStock,
  warehouses,
  stocks,
  onSave,
}: StockAdjustmentModalProps) {
  const [adjustmentType, setAdjustmentType] = useState<
    "add" | "remove" | "set"
  >("add");
  const [quantity, setQuantity] = useState<number>(0);
  const [reason, setReason] = useState("");
  const [notes, setNotes] = useState("");
  const [warehouseId, setWarehouseId] = useState<string>("none"); // Default to none (Global)
  
  // Inline creation state
  const [isCreatingWarehouse, setIsCreatingWarehouse] = useState(false);
  const [newWarehouseName, setNewWarehouseName] = useState("");
  const [newWarehouseLocation, setNewWarehouseLocation] = useState("");

  // Get current stock for selected warehouse (or global if none)
  const selectedStockEntry = warehouseId && warehouseId !== "none" && warehouseId !== "new"
    ? stocks?.find(s => s.warehouse_id === warehouseId)
    : stocks?.find(s => !s.warehouse_id); // Find global stock (null warehouse_id)

  const currentLevel = selectedStockEntry?.quantity || 0;

  const handleWarehouseChange = (value: string) => {
      if (value === "new") {
          setIsCreatingWarehouse(true);
          setWarehouseId("new");
      } else {
          setIsCreatingWarehouse(false);
          setWarehouseId(value);
      }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 1. Handle New Warehouse Creation
    let finalWarehouseId = warehouseId;
    
    if (warehouseId === "new") {
        if (!newWarehouseName.trim()) {
            toast.error("Warehouse Name Required", { description: "Please enter a name for the new warehouse." });
            return;
        }
        
        try {
            // Need to import createWarehouse
            const { createWarehouse } = await import("@/features/inventory/api/inventory");
            const newWarehouse = await createWarehouse({
                name: newWarehouseName,
                location: newWarehouseLocation
            });
            finalWarehouseId = newWarehouse.id;
            toast.success("Warehouse Created", { description: `${newWarehouse.name} created successfully.` });
        } catch (error) {
            toast.error("Failed to create warehouse");
            return;
        }
    }

    // 2. Validation
    if (!reason.trim()) {
      toast.error("Reason required", { description: "Please select a reason for this stock adjustment." });
      return;
    }

    if (quantity <= 0) {
      toast.error("Invalid quantity", { description: "Quantity must be greater than zero." });
      return;
    }

    // Validation against specific stock context
    if (adjustmentType === "remove" && quantity > currentLevel) {
      toast.error("Insufficient stock", {
        description: `Cannot remove ${quantity} units. Only ${currentLevel} units available in this context.`,
      });
      return;
    }

    // 3. Map to backend
    const movementType = 
        adjustmentType === "add" ? "in" :
        adjustmentType === "remove" ? "out" : 
        "adjustment";
    
    // If "none", send empty string or handle as optional. Backend expects empty string for nullable if not provided? 
    // Wait, backend `warehouse_id` is now POINTER. 
    // If I send empty string "", `uuid.Parse` fails.
    // I need the parent `onSave` to handle this?
    // Parent `handleStockAdjustment` maps `CreateStockMovementRequest`.
    // Let's pass undefined or empty string, and ensure parent handles it.
    // Actually, passing `undefined` for `none` is safer if the request type allows optional.
    
    const requestWarehouseId = finalWarehouseId === "none" ? undefined : finalWarehouseId;

    onSave({
      part_id: "", 
      warehouse_id: requestWarehouseId, // undefined if global
      movement_type: movementType,
      quantity,
      reason: notes ? `${reason} - ${notes}` : reason,
    } as any); // Cast because CreateStockMovementRequest might be strict about warehouse_id string vs undefined

    // Reset
    setAdjustmentType("add");
    setQuantity(0);
    setReason("");
    setNotes("");
    setWarehouseId("none");
    setIsCreatingWarehouse(false);
    setNewWarehouseName("");
    setNewWarehouseLocation("");
    onClose();
  };

  const getNewLevel = () => {
    switch (adjustmentType) {
      case "add": return currentLevel + quantity;
      case "remove": return Math.max(0, currentLevel - quantity);
      case "set": return quantity;
      default: return currentLevel;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Adjust Stock - {partName}</DialogTitle>
          <DialogDescription>
             Manage inventory levels. Select a warehouse or adjust unassigned stock.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Warehouse Selection */}
          <div className="space-y-3 p-4 bg-muted/30 rounded-lg border">
            <div className="space-y-2">
                <Label htmlFor="warehouse">Target Location</Label>
                <Select value={warehouseId} onValueChange={handleWarehouseChange}>
                    <SelectTrigger className="bg-background">
                        <SelectValue placeholder="Select location" />
                    </SelectTrigger>
                    <SelectContent>
                         <SelectItem value="none">
                            <span className="font-medium text-blue-600 dark:text-blue-400">Global / Unassigned Stock</span>
                         </SelectItem>
                        {warehouses?.map((w) => (
                            <SelectItem key={w.id} value={w.id}>{w.name}</SelectItem>
                        ))}
                        <div className="border-t my-1" />
                        <SelectItem value="new" className="text-green-600 font-medium">
                            + Create New Warehouse
                        </SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Inline Creation Fields */}
            {isCreatingWarehouse && (
                <div className="grid grid-cols-2 gap-3 pt-2 animate-in fade-in slide-in-from-top-1">
                    <div className="space-y-1">
                        <Label className="text-xs">New Name *</Label>
                        <Input 
                            value={newWarehouseName} 
                            onChange={e => setNewWarehouseName(e.target.value)} 
                            placeholder="Main Storage" 
                            className="h-8 text-sm"
                        />
                    </div>
                    <div className="space-y-1">
                        <Label className="text-xs">Location/Address</Label>
                        <Input 
                            value={newWarehouseLocation} 
                            onChange={e => setNewWarehouseLocation(e.target.value)} 
                            placeholder="Building 5" 
                            className="h-8 text-sm"
                        />
                    </div>
                </div>
            )}
            
            <div className="flex justify-between items-center text-sm pt-2 border-t mt-3">
                 <span className="text-muted-foreground">Current Level:</span>
                 <span className="font-bold text-xl">{currentLevel}</span>
            </div>
          </div>

          {/* Adjustment Type */}
          <div className="space-y-2">
            <Label>Action</Label>
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
                variant={adjustmentType === "remove" ? "destructive" : "outline"}
                onClick={() => setAdjustmentType("remove")}
                className="justify-start"
              >
                <Minus className="mr-2 h-4 w-4" />
                Remove
              </Button>
              <Button
                type="button"
                variant={adjustmentType === "set" ? "secondary" : "outline"}
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
              {adjustmentType === "set" ? "New Total Quantity" : "Quantity to Adjust"}
            </Label>
            <Input
              id="quantity"
              type="number"
              min="0"
              value={quantity || ""}
              onChange={(e) => setQuantity(Number(e.target.value))}
              placeholder="0"
              required
              className="text-lg"
            />
          </div>

            {/* Preview & Warning */}
            {quantity > 0 && (
                 <Alert variant={adjustmentType === "remove" ? "destructive" : "default"} 
                        className={`${adjustmentType === "set" ? "border-yellow-500 bg-yellow-50 dark:bg-yellow-900/10" : ""}`}>
                    <AlertDescription className="w-full">
                        <div className="flex justify-between items-center font-medium text-lg">
                            <span>Resulting Stock:</span>
                            <span>{getNewLevel()}</span>
                        </div>
                        {adjustmentType === "set" && (
                            <div className="text-xs text-yellow-700 dark:text-yellow-400 mt-1">
                                ⚠️ This will overwrite the current stock level.
                            </div>
                        )}
                    </AlertDescription>
                 </Alert>
            )}

          {/* Reason */}
          <div className="space-y-2">
            <Label htmlFor="reason">Reason for Movement *</Label>
            <Select value={reason} onValueChange={setReason} required>
              <SelectTrigger>
                <SelectValue placeholder="Select reason" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="received_shipment">Received Shipment</SelectItem>
                <SelectItem value="used_in_work_order">Consumed (Work Order)</SelectItem>
                <SelectItem value="transfer">Stock Transfer</SelectItem>
                <SelectItem value="inventory_count">Cycle Count / Audit</SelectItem>
                <SelectItem value="damaged">Damaged / Scrapped</SelectItem>
                <SelectItem value="returned">Returned to Supplier</SelectItem>
                <SelectItem value="found">Found Item</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Batch #, PO #, visual condition..."
              rows={2}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant={adjustmentType === "remove" ? "destructive" : "primary"}>
                Confirm {adjustmentType === "set" ? "Adjustment" : adjustmentType === "add" ? "Receipt" : "Removal"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
