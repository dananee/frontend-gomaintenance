"use client";

import { useState, useMemo } from "react";
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
import { useTranslations } from "next-intl";
import { useAuth } from "@/hooks/useAuth";
import { Warehouse } from "@/features/inventory/api/inventory";
import { Supplier } from "../types/inventory.types";
import { useReceiveStock } from "../hooks/useStockMutations";
import { Card, CardContent } from "@/components/ui/card";
import { Package, Calculator, History, FileText } from "lucide-react";
import { format } from "date-fns";

interface StockReceptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  partId: string;
  partName: string;
  warehouses?: Warehouse[];
  suppliers?: Supplier[];
}

export function StockReceptionModal({
  isOpen,
  onClose,
  partId,
  partName,
  warehouses,
  suppliers,
}: StockReceptionModalProps) {
  const t = useTranslations("inventory.stockReception");
  const { user } = useAuth();
  const receiveStockMutation = useReceiveStock();

  const [formData, setFormData] = useState({
    warehouse_id: "",
    quantity: 0,
    unit_cost_ht: 0,
    vat_rate: 20,
    received_at: format(new Date(), "yyyy-MM-dd"),
    supplier_id: "",
    reference_type: "delivery_note",
    reference_no: "",
    notes: "",
  });

  const totals = useMemo(() => {
    const totalHT = formData.quantity * formData.unit_cost_ht;
    const totalVAT = totalHT * (formData.vat_rate / 100);
    const totalTTC = totalHT + totalVAT;
    return { totalHT, totalVAT, totalTTC };
  }, [formData.quantity, formData.unit_cost_ht, formData.vat_rate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    await receiveStockMutation.mutateAsync({
      part_id: partId,
      warehouse_id: formData.warehouse_id,
      quantity: formData.quantity,
      unit_cost_ht: formData.unit_cost_ht,
      vat_rate: formData.vat_rate,
      received_at: new Date(formData.received_at).toISOString(),
      supplier_id: formData.supplier_id || undefined,
      reference_type: formData.reference_type,
      reference_no: formData.reference_no,
      notes: formData.notes,
    });

    onClose();
  };

  const activeWarehouses = warehouses?.filter(w => w.active) || [];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] gap-0 p-0 overflow-hidden">
        <DialogHeader className="p-6 bg-muted/50 border-b">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Package className="h-6 w-6 text-primary" />
            </div>
            <div>
              <DialogTitle className="text-2xl">{t("title")}</DialogTitle>
              <DialogDescription className="text-muted-foreground">
                {partName} — {t("description")}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-0">
            {/* Left Column: Core Info */}
            <div className="p-6 space-y-4 border-r">
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  {t("fields.warehouse")} *
                </Label>
                <Select 
                  value={formData.warehouse_id} 
                  onValueChange={(v) => setFormData({ ...formData, warehouse_id: v })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t("placeholders.warehouse")} />
                  </SelectTrigger>
                  <SelectContent>
                    {activeWarehouses.map((w) => (
                      <SelectItem key={w.id} value={w.id}>{w.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    {t("fields.quantity")} *
                  </Label>
                  <Input
                    type="number"
                    min="1"
                    value={formData.quantity || ""}
                    onChange={(e) => setFormData({ ...formData, quantity: Number(e.target.value) })}
                    placeholder="0"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    {t("fields.dateReceived")}
                  </Label>
                  <Input
                    type="date"
                    value={formData.received_at}
                    onChange={(e) => setFormData({ ...formData, received_at: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    {t("fields.unitCostHT")} *
                  </Label>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.unit_cost_ht || ""}
                    onChange={(e) => setFormData({ ...formData, unit_cost_ht: Number(e.target.value) })}
                    placeholder="0.00"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    {t("fields.vatRate")}
                  </Label>
                  <Select 
                    value={formData.vat_rate.toString()} 
                    onValueChange={(v) => setFormData({ ...formData, vat_rate: Number(v) })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">0%</SelectItem>
                      <SelectItem value="7">7%</SelectItem>
                      <SelectItem value="10">10%</SelectItem>
                      <SelectItem value="14">14%</SelectItem>
                      <SelectItem value="20">20%</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Card className="bg-primary/5 border-primary/20">
                <CardContent className="p-4 space-y-2">
                  <div className="flex items-center gap-2 mb-2 text-primary font-semibold">
                    <Calculator className="h-4 w-4" />
                    <span className="text-sm uppercase tracking-tighter">{t("fields.totalTTC")}</span>
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{t("fields.totalHT")}</span>
                    <span>{totals.totalHT.toFixed(2)} MAD</span>
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{t("fields.totalVAT")}</span>
                    <span>{totals.totalVAT.toFixed(2)} MAD</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg pt-2 border-t border-primary/10">
                    <span className="text-primary">{t("fields.totalTTC")}</span>
                    <span className="text-primary">{totals.totalTTC.toFixed(2)} MAD</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column: Reference & Notes */}
            <div className="p-6 space-y-4 bg-muted/20">
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  {t("fields.supplier")}
                </Label>
                <Select 
                  value={formData.supplier_id} 
                  onValueChange={(v) => setFormData({ ...formData, supplier_id: v })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t("placeholders.supplier") || "Select supplier"} />
                  </SelectTrigger>
                  <SelectContent>
                    {suppliers?.map((s) => (
                      <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  {t("fields.referenceType")}
                </Label>
                <Select 
                  value={formData.reference_type} 
                  onValueChange={(v) => setFormData({ ...formData, reference_type: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="supplier_invoice">{t("referenceTypes.supplier_invoice")}</SelectItem>
                    <SelectItem value="delivery_note">{t("referenceTypes.delivery_note")}</SelectItem>
                    <SelectItem value="manual">{t("referenceTypes.manual")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  {t("fields.referenceNo")}
                </Label>
                <div className="relative">
                  <FileText className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    className="pl-9"
                    value={formData.reference_no}
                    onChange={(e) => setFormData({ ...formData, reference_no: e.target.value })}
                    placeholder={t("placeholders.referenceNo")}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  {t("fields.notes")}
                </Label>
                <History className="inline-block h-3 w-3 ml-2 text-muted-foreground" />
                <Textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder={t("placeholders.notes")}
                  className="min-h-[100px] resize-none"
                />
              </div>
            </div>
          </div>

          <DialogFooter className="p-6 bg-muted/50 border-t items-center sm:justify-between">
            <p className="text-[10px] text-muted-foreground flex items-center gap-1 italic">
              * {t("managedInSettings") || "Required fields marked with asterisk"}
            </p>
            <div className="flex gap-2">
              <Button type="button" variant="ghost" onClick={onClose} disabled={receiveStockMutation.isPending}>
                {t("actions.cancel")}
              </Button>
              <Button 
                type="submit" 
                disabled={!formData.warehouse_id || formData.quantity <= 0 || receiveStockMutation.isPending}
                className="px-8"
              >
                {receiveStockMutation.isPending ? "..." : t("actions.submit")}
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
