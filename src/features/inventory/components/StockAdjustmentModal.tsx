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
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";

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
  const t = useTranslations("inventory.details.stockAdjustment");
  const { user } = useAuth();
  const [adjustmentType, setAdjustmentType] = useState<
    "add" | "remove" | "set"
  >("add");
  const [quantity, setQuantity] = useState<number>(0);
  const [reason, setReason] = useState("");
  const [notes, setNotes] = useState("");
  const [warehouseId, setWarehouseId] = useState<string>(""); 
  
  // Get current stock for selected warehouse
  const selectedStockEntry = warehouseId 
    ? stocks?.find(s => s.warehouse_id === warehouseId)
    : undefined;

  const currentLevel = selectedStockEntry?.quantity || 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 1. Validation
    if (!warehouseId) {
      toast.error(t("toasts.warehouseRequired") || "Warehouse required");
      return;
    }

    if (!reason.trim()) {
      toast.error(t("toasts.reasonRequired"), { description: t("toasts.reasonRequiredDesc") });
      return;
    }

    if (quantity <= 0) {
      toast.error(t("toasts.invalidQty"), { description: t("toasts.invalidQtyDesc") });
      return;
    }

    // Validation against specific stock context
    if (adjustmentType === "remove" && quantity > currentLevel) {
      toast.error(t("toasts.insufficientStock"), {
        description: t("toasts.insufficientStockDesc", { qty: quantity, current: currentLevel }),
      });
      return;
    }

    // 2. Map to backend
    let movementType: string;
    let finalQuantity: number;

    if (adjustmentType === "set") {
      const delta = quantity - currentLevel;
      if (delta === 0) {
        onClose();
        return;
      }
      movementType = delta > 0 ? "PURCHASE" : "CONSUMPTION";
      finalQuantity = Math.abs(delta);
    } else {
      movementType = adjustmentType === "add" ? "PURCHASE" : "CONSUMPTION";
      finalQuantity = quantity;
    }
    
    const requestWarehouseId = warehouseId === "none" ? undefined : warehouseId;

    onSave({
      part_id: "", 
      warehouse_id: requestWarehouseId,
      movement_type: movementType,
      quantity: finalQuantity,
      reason: notes ? `${reason} - ${notes}` : reason,
    } as any); 

    // Reset
    setAdjustmentType("add");
    setQuantity(0);
    setReason("");
    setNotes("");
    setWarehouseId("none");
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
          <DialogTitle>{t("title", { name: partName })}</DialogTitle>
          <DialogDescription>
             {t("description")}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Warehouse Selection */}
          <div className="space-y-3 p-4 bg-muted/30 rounded-lg border">
            <div className="space-y-2">
                <div className="flex justify-between items-center">
                    <Label htmlFor="warehouse">{t("targetLocation")}</Label>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{t("managedInSettings") || "Managed in Settings"}</p>
                </div>
                <Select value={warehouseId} onValueChange={setWarehouseId}>
                    <SelectTrigger className="bg-background">
                        <SelectValue placeholder={t("selectLocation")} />
                    </SelectTrigger>
                    <SelectContent>
                        {warehouses?.map((w) => (
                            <SelectItem key={w.id} value={w.id}>{w.name}</SelectItem>
                        ))}
                        {(!warehouses || warehouses.length === 0) && (user?.role === "admin" || user?.role === "manager") && (
                            <div className="p-2 border-t mt-1">
                                <Link 
                                    href="/dashboard/settings/inventory/warehouses"
                                    className="text-xs text-primary hover:underline flex items-center justify-center py-1 gap-1"
                                >
                                    <Plus className="h-3 w-3" />
                                    {t("configureWarehouses")}
                                </Link>
                            </div>
                        )}
                    </SelectContent>
                </Select>
            </div>
            
            <div className="flex justify-between items-center text-sm pt-2 border-t mt-3">
                 <span className="text-muted-foreground">{t("currentLevel")}</span>
                 <span className="font-bold text-xl">{currentLevel}</span>
            </div>
          </div>

          {/* Adjustment Type */}
          <div className="space-y-2">
            <Label>{t("action")}</Label>
            <div className="grid grid-cols-3 gap-2">
              <Button
                type="button"
                variant={adjustmentType === "add" ? "primary" : "outline"}
                onClick={() => setAdjustmentType("add")}
                className="justify-start"
              >
                <Plus className="mr-2 h-4 w-4" />
                {t("addStock")}
              </Button>
              <Button
                type="button"
                variant={adjustmentType === "remove" ? "destructive" : "outline"}
                onClick={() => setAdjustmentType("remove")}
                className="justify-start"
              >
                <Minus className="mr-2 h-4 w-4" />
                {t("removeStock")}
              </Button>
              <Button
                type="button"
                variant={adjustmentType === "set" ? "secondary" : "outline"}
                onClick={() => setAdjustmentType("set")}
                className="justify-start"
              >
                <RotateCcw className="mr-2 h-4 w-4" />
                {t("setStock")}
              </Button>
            </div>
          </div>

          {/* Quantity */}
          <div className="space-y-2">
            <Label htmlFor="quantity">
              {adjustmentType === "set" ? t("newTotalQty") : t("qtyToAdjust")}
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
                            <span>{t("resultingStock")}</span>
                            <span>{getNewLevel()}</span>
                        </div>
                        {adjustmentType === "set" && (
                            <div className="text-xs text-yellow-700 dark:text-yellow-400 mt-1">
                                ⚠️ {t("overwriteWarning")}
                            </div>
                        )}
                    </AlertDescription>
                 </Alert>
            )}

          {/* Reason */}
          <div className="space-y-2">
            <Label htmlFor="reason">{t("reasonLabel")}</Label>
            <Select value={reason} onValueChange={setReason} required>
              <SelectTrigger>
                <SelectValue placeholder={t("selectReason")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="received_shipment">{t("reasons.received_shipment")}</SelectItem>
                <SelectItem value="used_in_work_order">{t("reasons.used_in_work_order")}</SelectItem>
                <SelectItem value="transfer">{t("reasons.transfer")}</SelectItem>
                <SelectItem value="inventory_count">{t("reasons.inventory_count")}</SelectItem>
                <SelectItem value="damaged">{t("reasons.damaged")}</SelectItem>
                <SelectItem value="returned">{t("reasons.returned")}</SelectItem>
                <SelectItem value="found">{t("reasons.found")}</SelectItem>
                <SelectItem value="other">{t("reasons.other")}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">{t("notesLabel")}</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={t("notesPlaceholder")}
              rows={2}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="ghost" onClick={onClose}>
              {t("cancel")}
            </Button>
            <Button type="submit" variant={adjustmentType === "remove" ? "destructive" : "primary"}>
                {adjustmentType === "set" ? t("confirmAdjustment") : adjustmentType === "add" ? t("confirmReceipt") : t("confirmRemoval")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
