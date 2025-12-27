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
      <DialogContent className="sm:max-w-[800px] gap-0 p-0 overflow-hidden">
        <DialogHeader className="px-6 py-4 bg-muted/30 border-b">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Package className="h-5 w-5 text-primary" />
            </div>
            <div>
              <DialogTitle className="text-xl font-bold">{t("title")}</DialogTitle>
              <DialogDescription className="text-sm font-medium text-muted-foreground truncate max-w-[500px]">
                {partName}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-6">
            {/* Main Form Grid */}
            <div className="grid grid-cols-2 gap-x-8 gap-y-6">
              {/* LEFT COLUMN: Stock Data */}
              <div className="space-y-4">
                {/* Entrepôt */}
                <div className="space-y-2">
                  <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-tight">
                    {t("fields.warehouse")} <span className="text-destructive">*</span>
                  </Label>
                  <Select 
                    value={formData.warehouse_id} 
                    onValueChange={(v) => setFormData({ ...formData, warehouse_id: v })}
                  >
                    <SelectTrigger className="h-10">
                      <SelectValue placeholder={t("placeholders.warehouse")} />
                    </SelectTrigger>
                    <SelectContent>
                      {activeWarehouses.map((w) => (
                        <SelectItem key={w.id} value={w.id}>{w.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Quantité & Date */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-tight">
                      {t("fields.quantity")} <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      className="h-10"
                      type="number"
                      min="1"
                      value={formData.quantity || ""}
                      onChange={(e) => setFormData({ ...formData, quantity: Number(e.target.value) })}
                      placeholder="0"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-tight">
                      {t("fields.dateReceived")}
                    </Label>
                    <Input
                      className="h-10"
                      type="date"
                      value={formData.received_at}
                      onChange={(e) => setFormData({ ...formData, received_at: e.target.value })}
                    />
                  </div>
                </div>

                {/* Coût & TVA */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-tight">
                      {t("fields.unitCostHT")} <span className="text-destructive">*</span>
                    </Label>
                    <div className="relative">
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-muted-foreground font-bold opacity-60">MAD</span>
                      <Input
                        className="h-10 pr-12"
                        type="number"
                        step="0.01"
                        min="0"
                        value={formData.unit_cost_ht || ""}
                        onChange={(e) => setFormData({ ...formData, unit_cost_ht: Number(e.target.value) })}
                        placeholder="0.00"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-tight">
                      {t("fields.vatRate")}
                    </Label>
                    <Select 
                      value={formData.vat_rate.toString()} 
                      onValueChange={(v) => setFormData({ ...formData, vat_rate: Number(v) })}
                    >
                      <SelectTrigger className="h-10">
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
              </div>

              {/* RIGHT COLUMN: References & Origin */}
              <div className="space-y-4">
                {/* Fournisseur */}
                <div className="space-y-2">
                  <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-tight">
                    {t("fields.supplier")}
                  </Label>
                  <Select 
                    value={formData.supplier_id} 
                    onValueChange={(v) => setFormData({ ...formData, supplier_id: v })}
                  >
                    <SelectTrigger className="h-10">
                      <SelectValue placeholder={t("placeholders.supplier") || "Sélectionner un fournisseur"} />
                    </SelectTrigger>
                    <SelectContent>
                      {suppliers?.map((s) => (
                        <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Type & Numéro de référence */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-tight text-nowrap">
                      {t("fields.referenceType")}
                    </Label>
                    <Select 
                      value={formData.reference_type} 
                      onValueChange={(v) => setFormData({ ...formData, reference_type: v })}
                    >
                      <SelectTrigger className="h-10">
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
                    <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-tight text-nowrap">
                      {t("fields.referenceNo")}
                    </Label>
                    <div className="relative">
                      <FileText className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/40" />
                      <Input
                        className="h-10 pl-9"
                        value={formData.reference_no}
                        onChange={(e) => setFormData({ ...formData, reference_no: e.target.value })}
                        placeholder={t("placeholders.referenceNo")}
                      />
                    </div>
                  </div>
                </div>

                {/* Notes */}
                <div className="space-y-2">
                  <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-tight">
                    {t("fields.notes")}
                  </Label>
                  <Textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder={t("placeholders.notes")}
                    className="h-[95px] resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Cost Summary Card - Full Width */}
            <Card className="bg-muted/30 border-muted rounded-xl shadow-inner">
              <CardContent className="p-6">
                <div className="grid grid-cols-3 gap-8 divide-x divide-muted">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-muted-foreground mb-1">
                      <Calculator className="h-3.5 w-3.5" />
                      <span className="text-[10px] font-bold uppercase tracking-widest">{t("fields.totalHT")}</span>
                    </div>
                    <p className="text-2xl font-bold tracking-tight">
                      {totals.totalHT.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} <span className="text-sm text-muted-foreground">MAD</span>
                    </p>
                  </div>

                  <div className="space-y-2 pl-8">
                    <div className="flex items-center gap-2 text-muted-foreground mb-1">
                      <div className="h-3.5 w-3.5 rounded-full border-2 border-muted-foreground/30 flex items-center justify-center text-[8px] font-black">%</div>
                      <span className="text-[10px] font-bold uppercase tracking-widest">{t("fields.totalVAT")}</span>
                    </div>
                    <p className="text-2xl font-bold tracking-tight">
                      {totals.totalVAT.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} <span className="text-sm text-muted-foreground">MAD</span>
                    </p>
                  </div>

                  <div className="space-y-2 pl-8">
                    <div className="flex items-center gap-2 text-primary mb-1">
                      <div className="bg-primary/10 p-1 rounded">
                        <Calculator className="h-3.5 w-3.5 text-primary" />
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-widest">{t("fields.totalTTC")}</span>
                    </div>
                    <p className="text-3xl font-black tracking-tighter text-primary">
                      {totals.totalTTC.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} <span className="text-sm font-bold opacity-70">MAD</span>
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <DialogFooter className="px-6 py-4 bg-muted/30 border-t items-center sm:justify-between">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <div className="h-1 w-1 rounded-full bg-destructive" />
              <p className="text-[10px] font-medium italic">
                {t("managedInSettings") || "Champs obligatoires marqués par un astérisque"}
              </p>
            </div>
            <div className="flex gap-3">
              <Button 
                type="button" 
                variant="outline" 
                onClick={onClose} 
                disabled={receiveStockMutation.isPending}
                className="h-10 px-6 font-semibold"
              >
                {t("actions.cancel")}
              </Button>
              <Button 
                type="submit" 
                disabled={!formData.warehouse_id || formData.quantity <= 0 || receiveStockMutation.isPending}
                className="h-10 px-8 font-bold shadow-md shadow-primary/20"
              >
                {receiveStockMutation.isPending ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Chargement...
                  </span>
                ) : (
                  t("actions.submit")
                )}
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
