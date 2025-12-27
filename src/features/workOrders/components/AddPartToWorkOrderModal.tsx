"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useParts } from "@/features/inventory/hooks/useParts";
import { useWarehouses } from "@/features/inventory/hooks/useWarehouses";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Package, Plus } from "lucide-react";
import { useWorkOrderParts } from "../hooks/useWorkOrderParts";
import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";

import { useTranslations } from "next-intl";

interface AddPartToWorkOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (data: { part_id: string; quantity: number; unit_price: number; warehouse_id: string }) => void;
  isLoading?: boolean;
}

export function AddPartToWorkOrderModal({ isOpen, onClose, onAdd, isLoading }: AddPartToWorkOrderModalProps) {
  const t = useTranslations("workOrders.addPartModal");
  const { user } = useAuth();
  const [selectedPartId, setSelectedPartId] = useState("");
  const [selectedWarehouseId, setSelectedWarehouseId] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [unitPrice, setUnitPrice] = useState(0);

  const { data: parts } = useParts({ page_size: 100 });
  const { data: warehouses } = useWarehouses(true);

  const selectedPart = parts?.data?.find(p => p.id === selectedPartId);
  
  useEffect(() => {
    if (selectedPart) {
        setUnitPrice(selectedPart.unit_price_ht || 0);
    }
  }, [selectedPart]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({
        part_id: selectedPartId,
        warehouse_id: selectedWarehouseId,
        quantity,
        unit_price: unitPrice
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{t("title")}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>{t("fields.part")}</Label>
            <Select value={selectedPartId} onValueChange={setSelectedPartId}>
              <SelectTrigger>
                <SelectValue placeholder={t("placeholders.part")} />
              </SelectTrigger>
              <SelectContent>
                {parts?.data?.map(part => (
                   <SelectItem key={part.id} value={part.id}>
                    {part.name} ({part.sku || part.part_number})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>{t("fields.warehouse")}</Label>
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider">{t("managedInSettings")}</span>
            </div>
            <Select value={selectedWarehouseId} onValueChange={setSelectedWarehouseId}>
              <SelectTrigger>
                <SelectValue placeholder={t("placeholders.warehouse")} />
              </SelectTrigger>
              <SelectContent>
                {warehouses?.map(w => (
                  <SelectItem key={w.id} value={w.id}>
                    {w.name}
                  </SelectItem>
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

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
                <Label>{t("fields.quantity")}</Label>
                <Input 
                    type="number" 
                    min={1} 
                    value={quantity} 
                    onChange={(e) => setQuantity(parseFloat(e.target.value) || 0)} 
                />
            </div>
            <div className="space-y-2">
                <Label>{t("fields.unitPrice")}</Label>
                <Input 
                    type="number" 
                    step="0.01"
                    value={unitPrice} 
                    onChange={(e) => setUnitPrice(parseFloat(e.target.value) || 0)} 
                />
            </div>
          </div>

          {selectedPart && (
            <div className="rounded-lg bg-slate-50 p-3 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground flex items-center">
                        <Package className="mr-2 h-4 w-4" />
                        {t("availableStock")}
                    </span>
                    <span className="font-bold">{selectedPart.total_quantity} {selectedPart.unit}</span>
                </div>
            </div>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>{t("actions.cancel")}</Button>
            <Button type="submit" disabled={!selectedPartId || !selectedWarehouseId || quantity <= 0 || isLoading}>
              {isLoading ? t("actions.adding") : t("actions.add")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
