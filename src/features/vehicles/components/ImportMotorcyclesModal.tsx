"use client";

import { useState, useRef } from "react";
import * as XLSX from "xlsx";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
    Upload,
    FileSpreadsheet,
    CheckCircle,
    XCircle,
    AlertTriangle,
    X,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { motorcycleImportSchema, type MotorcycleRow } from "../schemas/motorcycleImportSchema";
import { StepIndicator } from "./StepIndicator";
import { ColumnMappingStep, type ColumnMapping, type SystemField } from "./ColumnMappingStep";
import { importMotorcycles } from "../api/motorcycles.api";

interface ImportMotorcyclesModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

type EnergyType = "PETROL" | "ELECTRIC";

interface ParsedMotorcycle {
    immatriculation: string;
    marque: string;
    modele?: string;
    energy_type: EnergyType;
    insurance_policy?: string;
    address?: string;
    vin?: string;
    release_date?: string;
    driver_name?: string;
    age?: number;
}

export function ImportMotorcyclesModal({
    open,
    onOpenChange,
}: ImportMotorcyclesModalProps) {
    const t = useTranslations("features.vehicles.motorcycles.import");

    // Step management
    const [currentStep, setCurrentStep] = useState(1);

    // File upload state
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [dragActive, setDragActive] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Column mapping state
    const [excelHeaders, setExcelHeaders] = useState<string[]>([]);
    const [rawData, setRawData] = useState<any[]>([]);
    const [columnMapping, setColumnMapping] = useState<ColumnMapping>({});

    // Preview state
    const [parsedData, setParsedData] = useState<ParsedMotorcycle[]>([]);
    const [parseErrors, setParseErrors] = useState<string[]>([]);

    // Import state
    const [isImporting, setIsImporting] = useState(false);
    const [importResult, setImportResult] = useState<{ success: number; failed: number; errors?: Array<{ row: number; message: string }> } | null>(null);

    // Map energy type values to database enum
    const mapEnergyType = (input: string): EnergyType => {
        const normalized = input.toLowerCase().trim();

        // Map to ELECTRIC
        if (["electrique", "electric", "électrique", "batterie", "battery"].includes(normalized)) {
            return "ELECTRIC";
        }

        // Map to PETROL (covers: essence, super, petrol, gasoline, etc.)
        return "PETROL";
    };

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const file = e.dataTransfer.files[0];
            if (file.name.endsWith(".xlsx") || file.name.endsWith(".csv")) {
                processFile(file);
            }
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            processFile(e.target.files[0]);
        }
    };

    const processFile = async (file: File) => {
        setSelectedFile(file);
        setImportResult(null);
        setParseErrors([]);

        try {
            const data = await file.arrayBuffer();
            const workbook = XLSX.read(data, { type: "array" });
            const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
            const jsonData = XLSX.utils.sheet_to_json(firstSheet, { defval: "" });

            if (jsonData.length === 0) {
                setParseErrors(["File is empty"]);
                return;
            }

            // Extract headers
            const headers = Object.keys(jsonData[0] as any);
            setExcelHeaders(headers);
            setRawData(jsonData);

            // Move to step 2 (column mapping)
            setCurrentStep(2);
        } catch (error) {
            setParseErrors(["Failed to parse file. Please ensure it's a valid Excel or CSV file."]);
        }
    };

    const handleColumnMappingContinue = (mapping: ColumnMapping) => {
        setColumnMapping(mapping);

        // Transform data based on mapping
        const errors: string[] = [];
        const motorcycles: ParsedMotorcycle[] = [];

        rawData.forEach((row: any, index: number) => {
            try {
                const transformed: any = {};

                // Apply column mapping
                Object.entries(mapping).forEach(([excelHeader, systemField]) => {
                    if (systemField && systemField !== "ignore" && row[excelHeader]) {
                        transformed[systemField] = row[excelHeader];
                    }
                });

                // Validate required fields
                if (!transformed.immatriculation) {
                    errors.push(`Row ${index + 2}: Missing Immatriculation`);
                    return;
                }
                if (!transformed.marque) {
                    errors.push(`Row ${index + 2}: Missing Marque`);
                    return;
                }

                // Map energy type (optional, default to PETROL)
                const energyInput = transformed.energy_type || "petrol";

                const motorcycle: ParsedMotorcycle = {
                    immatriculation: String(transformed.immatriculation).trim(),
                    marque: String(transformed.marque).trim(),
                    modele: transformed.modele ? String(transformed.modele).trim() : undefined,
                    energy_type: mapEnergyType(String(energyInput)),
                    insurance_policy: transformed.insurance_policy ? String(transformed.insurance_policy).trim() : undefined,
                    address: transformed.address ? String(transformed.address).trim() : undefined,
                    vin: transformed.vin ? String(transformed.vin).trim() : undefined,
                    release_date: transformed.release_date ? String(transformed.release_date).trim() : undefined,
                    driver_name: transformed.driver_name ? String(transformed.driver_name).trim() : undefined,
                    age: transformed.age ? Number(transformed.age) : undefined,
                };

                motorcycles.push(motorcycle);
            } catch (err) {
                errors.push(`Row ${index + 2}: Failed to parse row`);
            }
        });

        if (errors.length > 0) {
            setParseErrors(errors);
        }

        setParsedData(motorcycles);
        setCurrentStep(3);
    };

    const handleImport = async () => {
        if (parsedData.length === 0) return;

        setIsImporting(true);
        try {
            // Convert to MotorcycleRow format with hardcoded values
            const motorcyclesToImport: MotorcycleRow[] = parsedData.map((m) => ({
                immatriculation: m.immatriculation,
                marque: m.marque,
                modele: m.modele,
                energy_type: m.energy_type,
                insurance_policy: m.insurance_policy,
                address: m.address,
                vin: m.vin,
                release_date: m.release_date,
                driver_name: m.driver_name,
                age: m.age,
                type: "MOTORCYCLE",
                maintenance_plan_id: null,
                current_mileage: 0,
            }));

            const result = await importMotorcycles(motorcyclesToImport);
            setImportResult(result);
        } catch (error) {
            console.error("Import failed:", error);
            setImportResult({
                success: 0,
                failed: parsedData.length,
                errors: [{ row: 0, message: "Import failed. Please try again." }],
            });
        } finally {
            setIsImporting(false);
        }
    };

    const handleClose = () => {
        setCurrentStep(1);
        setSelectedFile(null);
        setImportResult(null);
        setParsedData([]);
        setParseErrors([]);
        setExcelHeaders([]);
        setRawData([]);
        setColumnMapping({});
        setIsImporting(false);
        onOpenChange(false);
    };

    const handleReset = () => {
        setCurrentStep(1);
        setSelectedFile(null);
        setImportResult(null);
        setParsedData([]);
        setParseErrors([]);
        setExcelHeaders([]);
        setRawData([]);
        setColumnMapping({});
    };

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return "0 Bytes";
        const k = 1024;
        const sizes = ["Bytes", "KB", "MB", "GB"];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
    };

    const getEnergyBadgeColor = (energy: EnergyType) => {
        return energy === "ELECTRIC"
            ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
            : "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400";
    };

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="max-w-5xl max-h-[90vh] flex flex-col">
                <DialogHeader className="bg-[#274040] -mx-6 -mt-6 px-6 py-4 rounded-t-lg">
                    <DialogTitle className="text-white text-xl">{t("title")}</DialogTitle>
                    <DialogDescription className="text-gray-300">
                        {t("description")}
                    </DialogDescription>
                </DialogHeader>

                {/* Step Indicator */}
                <div className="flex items-center justify-center gap-2 py-4">
                    <StepIndicator step={1} current={currentStep} label="Upload" />
                    <StepIndicator step={2} current={currentStep} label="Map Columns" />
                    <StepIndicator step={3} current={currentStep} label="Preview" />
                </div>

                <div className="flex-1 overflow-auto px-6">
                    {/* Step 1: File Upload */}
                    {currentStep === 1 && !importResult && (
                        <div className="space-y-6">
                            {/* Upload Area */}
                            <div
                                className={cn(
                                    "relative rounded-lg border-2 border-dashed p-12 text-center transition-colors",
                                    dragActive
                                        ? "border-[#165FF2] bg-blue-50 dark:bg-blue-900/10"
                                        : "border-gray-300 dark:border-gray-700"
                                )}
                                onDragEnter={handleDrag}
                                onDragLeave={handleDrag}
                                onDragOver={handleDrag}
                                onDrop={handleDrop}
                            >
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept=".xlsx,.csv"
                                    onChange={handleFileChange}
                                    className="hidden"
                                />
                                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                                <h3 className="mt-4 text-lg font-semibold">{t("dragDrop")}</h3>
                                <p className="mt-2 text-sm text-gray-500">{t("onlyXlsxCsv")}</p>
                                <Button
                                    variant="outline"
                                    className="mt-4"
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    <FileSpreadsheet className="mr-2 h-4 w-4" />
                                    {t("browse")}
                                </Button>
                            </div>

                            {/* Selected File */}
                            {selectedFile && (
                                <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <FileSpreadsheet className="h-8 w-8 text-[#165FF2]" />
                                            <div>
                                                <p className="font-medium">{selectedFile.name}</p>
                                                <p className="text-sm text-gray-500">
                                                    {formatFileSize(selectedFile.size)}
                                                </p>
                                            </div>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => {
                                                setSelectedFile(null);
                                                setParsedData([]);
                                                setParseErrors([]);
                                            }}
                                        >
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            )}

                            {/* Parse Errors */}
                            {parseErrors.length > 0 && (
                                <Alert variant="destructive">
                                    <AlertTriangle className="h-4 w-4" />
                                    <AlertDescription>
                                        <div className="font-semibold">Parsing Errors:</div>
                                        <ul className="mt-2 space-y-1">
                                            {parseErrors.slice(0, 5).map((error, index) => (
                                                <li key={index} className="text-sm">• {error}</li>
                                            ))}
                                            {parseErrors.length > 5 && (
                                                <li className="text-sm">
                                                    ... and {parseErrors.length - 5} more errors
                                                </li>
                                            )}
                                        </ul>
                                    </AlertDescription>
                                </Alert>
                            )}
                        </div>
                    )}

                    {/* Step 2: Column Mapping */}
                    {currentStep === 2 && (
                        <ColumnMappingStep
                            excelHeaders={excelHeaders}
                            onContinue={handleColumnMappingContinue}
                            onBack={() => setCurrentStep(1)}
                        />
                    )}

                    {/* Step 3: Preview & Import */}
                    {currentStep === 3 && !importResult && (
                        <div className="space-y-6">
                            <div className="bg-[#274040] -mx-6 px-6 py-4 rounded-lg">
                                <h3 className="text-lg font-semibold text-white">Step 3 of 3: Preview</h3>
                                <p className="text-sm text-gray-300 mt-1">
                                    Review {parsedData.length} motorcycles before importing
                                </p>
                            </div>

                            {/* Preview Table */}
                            <ScrollArea className="h-[400px] rounded-md border">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="min-w-[120px]">{t("plate")}</TableHead>
                                            <TableHead className="min-w-[100px]">{t("brand")}</TableHead>
                                            <TableHead className="min-w-[100px]">{t("model")}</TableHead>
                                            <TableHead className="min-w-[100px]">{t("energy")}</TableHead>
                                            <TableHead className="min-w-[120px]">Police</TableHead>
                                            <TableHead className="min-w-[150px]">Adresse</TableHead>
                                            <TableHead className="min-w-[120px]">VIN</TableHead>
                                            <TableHead className="min-w-[120px]">Date Circulation</TableHead>
                                            <TableHead className="min-w-[120px]">Conducteur</TableHead>
                                            <TableHead className="min-w-[80px]">Age</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {parsedData.map((motorcycle, index) => (
                                            <TableRow key={index}>
                                                <TableCell className="font-medium">
                                                    {motorcycle.immatriculation}
                                                </TableCell>
                                                <TableCell>{motorcycle.marque}</TableCell>
                                                <TableCell>{motorcycle.modele || "-"}</TableCell>
                                                <TableCell>
                                                    <Badge className={getEnergyBadgeColor(motorcycle.energy_type)}>
                                                        {motorcycle.energy_type}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-sm text-gray-600">
                                                    {motorcycle.insurance_policy || "-"}
                                                </TableCell>
                                                <TableCell className="text-sm text-gray-600">
                                                    {motorcycle.address || "-"}
                                                </TableCell>
                                                <TableCell className="text-sm text-gray-600">
                                                    {motorcycle.vin || "-"}
                                                </TableCell>
                                                <TableCell className="text-sm text-gray-600">
                                                    {motorcycle.release_date || "-"}
                                                </TableCell>
                                                <TableCell className="text-sm text-gray-600">
                                                    {motorcycle.driver_name || "-"}
                                                </TableCell>
                                                <TableCell className="text-sm text-gray-600">
                                                    {motorcycle.age || "-"}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </ScrollArea>

                            {/* Parse Errors */}
                            {parseErrors.length > 0 && (
                                <Alert variant="destructive">
                                    <AlertTriangle className="h-4 w-4" />
                                    <AlertDescription>
                                        <div className="font-semibold">Validation Errors:</div>
                                        <ul className="mt-2 space-y-1">
                                            {parseErrors.slice(0, 5).map((error, index) => (
                                                <li key={index} className="text-sm">• {error}</li>
                                            ))}
                                            {parseErrors.length > 5 && (
                                                <li className="text-sm">
                                                    ... and {parseErrors.length - 5} more errors
                                                </li>
                                            )}
                                        </ul>
                                    </AlertDescription>
                                </Alert>
                            )}

                            {/* Navigation */}
                            <div className="flex justify-between pt-4">
                                <Button variant="outline" onClick={() => setCurrentStep(2)}>
                                    ← Back
                                </Button>
                                <Button
                                    onClick={handleImport}
                                    disabled={isImporting || parsedData.length === 0}
                                    className="bg-[#165FF2] hover:bg-[#1450d0] text-white"
                                >
                                    {isImporting ? t("importing") : t("import")}
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* Import Result */}
                    {importResult && (
                        <div className="space-y-6">
                            <div className="text-center">
                                {importResult.success > 0 ? (
                                    <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
                                ) : (
                                    <XCircle className="mx-auto h-16 w-16 text-red-500" />
                                )}
                                <h3 className="mt-4 text-lg font-semibold">
                                    {importResult.success > 0 ? t("successful") : t("failed")}
                                </h3>
                                <p className="mt-2 text-sm text-gray-600">
                                    {importResult.success} {t("motorcyclesImported")}
                                    {importResult.failed > 0 && ` • ${importResult.failed} ${t("motorcyclesFailed")}`}
                                </p>
                            </div>

                            {importResult.errors && importResult.errors.length > 0 && (
                                <div className="rounded-lg border border-red-200 bg-red-50 p-4">
                                    <h4 className="font-semibold text-red-900">{t("errorDetails")}</h4>
                                    <div className="mt-2 space-y-1">
                                        {importResult.errors.map((error, index) => (
                                            <div key={index} className="text-sm text-red-700">
                                                {t("row")} {error.row}: {error.message}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="flex justify-end gap-2">
                                <Button variant="outline" onClick={handleReset}>
                                    Import More
                                </Button>
                                <Button onClick={handleClose}>{t("close")}</Button>
                            </div>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
