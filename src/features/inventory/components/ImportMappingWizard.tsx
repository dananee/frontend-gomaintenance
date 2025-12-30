"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
    AnalyzeResult,
    ImportMapping,
    ImportOptions
} from "../api/inventoryExcel";
import { useWarehouses } from "../hooks/useWarehouses";
import { AlertCircle, ArrowLeft, ArrowRight, Settings2, Table as TableIcon } from "lucide-react";
import { useTranslations } from "next-intl";

interface ImportMappingWizardProps {
    analyzeResult: AnalyzeResult;
    onConfirm: (mapping: ImportMapping, options: ImportOptions) => void;
    onBack: () => void;
    isProcessing: boolean;
}

export function ImportMappingWizard({
    analyzeResult,
    onConfirm,
    onBack,
    isProcessing
}: ImportMappingWizardProps) {
    const t = useTranslations("inventory.excel.mappingWizard");
    const { data: warehouses } = useWarehouses(true);
    const [mapping, setMapping] = useState<ImportMapping>({
        sku: "",
        part_number: "",
        quantity: "",
        unit_cost_ht: "",
        vat_rate: "",
        warehouse_code: "",
        movement_type: "",
        reference: "",
        comment: "",
        name: "",
        category: "",
        brand: "",
        description: "",
    });

    const [options, setOptions] = useState<ImportOptions>({
        source_is_ttc: false,
        default_warehouse_id: "",
        default_vat: 20,
    });

    // Smart auto-mapping from backend
    useEffect(() => {
        if (analyzeResult.suggested_mapping) {
            const newMapping = { ...mapping };
            Object.entries(analyzeResult.suggested_mapping).forEach(([target, source]) => {
                if (target in newMapping) {
                    (newMapping as any)[target] = source;
                }
            });
            setMapping(newMapping);
        }
    }, [analyzeResult.suggested_mapping]);

    const handleConfirm = () => {
        onConfirm(mapping, options);
    };

    const TARGET_FIELDS = [
        { id: "sku", label: t("sku"), required: false },
        { id: "part_number", label: t("partNumber"), required: false },
        { id: "quantity", label: t("quantity"), required: true },
        { id: "unit_cost_ht", label: t("unitCostHT"), required: true },
        { id: "vat_rate", label: t("vatRate"), required: false },
        { id: "warehouse_code", label: t("warehouseCode"), required: false },
        { id: "movement_type", label: t("movementType"), required: false },
        { id: "reference", label: t("reference"), required: false },
        { id: "comment", label: t("comment"), required: false },
        { id: "name", label: t("partName"), required: false },
        { id: "category", label: t("category"), required: false },
        { id: "brand", label: t("brand"), required: false },
        { id: "description", label: t("description"), required: false },
    ];

    const isFormValid = mapping.quantity && mapping.unit_cost_ht && (mapping.sku || mapping.part_number);

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Mapping Section */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-2">
                        <Settings2 className="h-5 w-5 text-primary" />
                        <h3 className="font-bold text-lg">{t("columnMapping")}</h3>
                    </div>

                    <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar border-y py-4">
                        {TARGET_FIELDS.map((field) => (
                            <div key={field.id} className="flex flex-col gap-1.5 p-3 rounded-lg border bg-card hover:border-primary/50 transition-colors shadow-sm">
                                <div className="flex justify-between items-center">
                                    <Label className="font-semibold text-sm">
                                        {field.label} {field.required && <span className="text-destructive">*</span>}
                                    </Label>
                                </div>
                                <Select
                                    value={mapping[field.id as keyof ImportMapping]}
                                    onValueChange={(val) => setMapping({ ...mapping, [field.id]: val })}
                                >
                                    <SelectTrigger className="w-full bg-background border-muted">
                                        <SelectValue placeholder={t("unmapped")} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="none_unmapped">{t("unmapped")}</SelectItem>
                                        {analyzeResult.headers.map((h) => (
                                            <SelectItem key={h} value={h}>{h}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Global Options & Preview Section */}
                <div className="space-y-6">
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 mb-2">
                            <Settings2 className="h-5 w-5 text-primary" />
                            <h3 className="font-bold text-lg">{t("importOptions")}</h3>
                        </div>

                        <div className="p-4 rounded-xl border bg-muted/20 space-y-6 shadow-sm">
                            <div className="space-y-3">
                                <Label className="text-sm font-bold">{t("priceFormat")}</Label>
                                <div className="grid grid-cols-2 gap-2">
                                    <Button
                                        type="button"
                                        variant={!options.source_is_ttc ? "primary" : "outline"}
                                        className="h-10 text-xs font-semibold"
                                        onClick={() => setOptions({ ...options, source_is_ttc: false })}
                                    >
                                        {t("preTax")}
                                    </Button>
                                    <Button
                                        type="button"
                                        variant={options.source_is_ttc ? "primary" : "outline"}
                                        className="h-10 text-xs font-semibold"
                                        onClick={() => setOptions({ ...options, source_is_ttc: true })}
                                    >
                                        {t("taxIncluded")}
                                    </Button>
                                </div>
                                <p className="text-[10px] text-muted-foreground mt-1 px-1">
                                    {options.source_is_ttc
                                        ? t("priceTTCDesc")
                                        : t("priceHTDesc")
                                    }
                                </p>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="default-vat" className="text-sm font-bold">{t("defaultVat")}</Label>
                                <input
                                    id="default-vat"
                                    type="number"
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    value={options.default_vat}
                                    onChange={(e) => setOptions({ ...options, default_vat: parseFloat(e.target.value) || 0 })}
                                    placeholder="e.g. 20"
                                />
                                <p className="text-[10px] text-muted-foreground px-1">
                                    {t("vatDesc")}
                                </p>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-sm font-bold">{t("defaultWarehouse")}</Label>
                                <Select
                                    value={options.default_warehouse_id}
                                    onValueChange={(val) => setOptions({ ...options, default_warehouse_id: val })}
                                >
                                    <SelectTrigger className="bg-background">
                                        <SelectValue placeholder={t("defaultWarehouse")} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {warehouses?.map((w) => (
                                            <SelectItem key={w.id} value={w.id}>{w.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <p className="text-[10px] text-muted-foreground px-1">
                                    {t("warehouseDesc")}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <div className="flex items-center gap-2 mb-1">
                            <TableIcon className="h-5 w-5 text-primary" />
                            <h3 className="font-bold text-lg">{t("preview")}</h3>
                        </div>
                        <div className="rounded-lg border overflow-hidden shadow-sm">
                            <Table>
                                <TableHeader className="bg-muted/50">
                                    <TableRow>
                                        {analyzeResult.headers.slice(0, 3).map((h) => (
                                            <TableHead key={h} className="text-[10px] uppercase font-bold py-2 h-auto text-muted-foreground">{h}</TableHead>
                                        ))}
                                        {analyzeResult.headers.length > 3 && <TableHead className="text-[10px] py-2 h-auto">...</TableHead>}
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {analyzeResult.preview.map((row, i) => (
                                        <TableRow key={i} className="hover:bg-muted/30">
                                            {row.slice(0, 3).map((cell, j) => (
                                                <TableCell key={j} className="text-[11px] py-2 whitespace-nowrap overflow-hidden max-w-[120px] truncate">{cell}</TableCell>
                                            ))}
                                            {row.length > 3 && <TableCell className="text-[11px] py-2">...</TableCell>}
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                </div>
            </div>

            {!isFormValid && (
                <div className="flex items-center gap-2 text-amber-600 bg-amber-50 dark:bg-amber-950/20 p-3 rounded-lg border border-amber-200 dark:border-amber-900 text-sm">
                    <AlertCircle className="h-4 w-4" />
                    {t("requiredFieldsWarning")}
                </div>
            )}

            <div className="flex justify-between items-center pt-4 border-t">
                <Button variant="ghost" type="button" onClick={onBack} className="gap-2">
                    <ArrowLeft className="h-4 w-4" />
                    {t("back")}
                </Button>
                <Button
                    onClick={handleConfirm}
                    disabled={!isFormValid || isProcessing}
                    className="min-w-[150px] font-bold"
                >
                    {isProcessing ? "Processing..." : (
                        <>
                            Confirm & Import
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </>
                    )}
                </Button>
            </div>
        </div>
    );
}
