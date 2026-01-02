"use client";

import { useState, useCallback, useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertCircle, ArrowLeft, ArrowRight, FileUp, Settings2, CheckCircle2, UploadCloud } from "lucide-react";
import { useTranslations } from "next-intl";
import * as XLSX from "xlsx";
import { toast } from "sonner";
import apiClient from "@/lib/api/axiosClient";
import { useQueryClient } from "@tanstack/react-query";

interface VehicleImportWizardProps {
    onClose: () => void;
    onSuccess: () => void;
}

interface MappedData {
    plate_number: string;
    vin: string;
    vehicle_type_id: string; // This handles "Type"
    brand: string;
    model: string;
    year: number;
    status: string;
    fuel_type: string;
    address: string;
    vehicle_condition: string;
    current_km: number;
}

const REQUIRED_FIELDS = [
    { id: "plate_number", label: "Plate Number", required: true },
    { id: "vin", label: "VIN", required: false },
    { id: "vehicle_type_id", label: "Type", required: true },
    { id: "brand", label: "Brand", required: false },
    { id: "model", label: "Model", required: false },
    { id: "year", label: "Year", required: false },
    { id: "status", label: "Status", required: false },
    { id: "fuel_type", label: "Fuel Type", required: false },
    { id: "address", label: "Address", required: false },
    { id: "vehicle_condition", label: "Condition", required: false },
    { id: "current_km", label: "Current KM", required: false },
];

// Levenshtein distance for fuzzy matching
const levenshtein = (a: string, b: string): number => {
    const matrix = [];
    for (let i = 0; i <= b.length; i++) {
        matrix[i] = [i];
    }
    for (let j = 0; j <= a.length; j++) {
        matrix[0][j] = j;
    }
    for (let i = 1; i <= b.length; i++) {
        for (let j = 1; j <= a.length; j++) {
            if (b.charAt(i - 1) === a.charAt(j - 1)) {
                matrix[i][j] = matrix[i - 1][j - 1];
            } else {
                matrix[i][j] = Math.min(
                    matrix[i - 1][j - 1] + 1,
                    matrix[i][j - 1] + 1,
                    matrix[i - 1][j] + 1
                );
            }
        }
    }
    return matrix[b.length][a.length];
};

const normalizeString = (str: string) => {
    return str.toLowerCase().replace(/[^a-z0-9]/g, "");
};

const getBestMatch = (target: string, headers: string[]) => {
    let bestMatch = "";
    let minDistance = Infinity;
    const normalizedTarget = normalizeString(target);

    // Common aliases map
    const aliases: Record<string, string[]> = {
        plate_number: ["plate", "matricule", "immatriculation", "registration", "plateno", "license"],
        vin: ["chassis", "serial", "isn", "vin"],
        vehicle_type_id: ["type", "category", "class", "genre"],
        brand: ["make", "manufacturer", "marque"],
        model: ["modele"],
        year: ["annee", "yr"],
        status: ["etat", "condition", "state"],
        fuel_type: ["fuel", "engine_type", "carburant", "energie"],
        address: ["location", "site", "adresse", "lieu"],
        vehicle_condition: ["condition", "state", "etat_vehicule"],
        current_km: ["distance", "kilometers", "mileage", "km", "compteur"],
    };

    const targetAliases = aliases[target] || [];
    targetAliases.push(target); // Add the target itself

    for (const header of headers) {
        const normalizedHeader = normalizeString(header);

        // Exact match check on aliases
        if (targetAliases.some(alias => normalizeString(alias) === normalizedHeader)) {
            return header;
        }

        // Fuzzy match
        for (const alias of targetAliases) {
            const dist = levenshtein(normalizeString(alias), normalizedHeader);
            if (dist < minDistance && dist < 3) { // Threshold of 3
                minDistance = dist;
                bestMatch = header;
            }
        }
    }

    return bestMatch || "none_unmapped";
};

export function VehicleImportWizard({ onClose, onSuccess }: VehicleImportWizardProps) {
    const t = useTranslations("vehicles.import"); // Assume translations exist or fallback
    // If translations don't exist, we fallback to English strings for now
    const queryClient = useQueryClient();

    const [step, setStep] = useState<1 | 2 | 3>(1);
    const [file, setFile] = useState<File | null>(null);
    const [headers, setHeaders] = useState<string[]>([]);
    const [previewData, setPreviewData] = useState<any[]>([]);
    const [fullData, setFullData] = useState<any[]>([]);
    const [mapping, setMapping] = useState<Record<string, string>>({});
    const [isProcessing, setIsProcessing] = useState(false);

    const [conflictStrategy, setConflictStrategy] = useState<'skip' | 'update'>('skip');

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (!selectedFile) return;

        setFile(selectedFile);
        const reader = new FileReader();
        reader.onload = (evt) => {
            const bstr = evt.target?.result;
            const wb = XLSX.read(bstr, { type: "binary" });
            const wsname = wb.SheetNames[0];
            const ws = wb.Sheets[wsname];
            const data = XLSX.utils.sheet_to_json(ws, { header: 1 });

            if (data.length > 0) {
                const headerRow = data[0] as string[];
                const rows = data.slice(1);

                setHeaders(headerRow);
                setFullData(rows);
                setPreviewData(rows.slice(0, 5)); // Optimize: store only 5 for preview, use full rows for submit

                // Auto-map
                const initialMapping: Record<string, string> = {};
                REQUIRED_FIELDS.forEach(field => {
                    initialMapping[field.id] = getBestMatch(field.id, headerRow);
                });
                setMapping(initialMapping);
                setStep(2);
            }
        };
        reader.readAsBinaryString(selectedFile);
    };

    const handleSubmit = async () => {
        setIsProcessing(true);
        try {
            // Transform data
            const payload = fullData.map(row => {
                const obj: any = {};
                Object.entries(mapping).forEach(([targetField, sourceHeader]) => {
                    const headerIndex = headers.indexOf(sourceHeader);
                    if (headerIndex !== -1) {
                        let value = row[headerIndex];
                        // Basic cleanup
                        if (typeof value === 'string') value = value.trim();
                        obj[targetField] = value;
                    }
                });

                // Strict Type Parsing
                if (obj.year) {
                    const parsedYear = parseInt(obj.year, 10);
                    obj.year = isNaN(parsedYear) ? new Date().getFullYear() : parsedYear;
                }

                // Ensure strings are safe
                obj.plate_number = obj.plate_number ? String(obj.plate_number).toUpperCase() : "";
                obj.vin = obj.vin ? String(obj.vin).toUpperCase() : "";
                obj.vehicle_type_id = obj.vehicle_type_id ? String(obj.vehicle_type_id) : "";

                // Map Distance to current_km if needed (though mapping handles keys, value might need parsing)
                if (obj.current_km) {
                    const parsedKM = parseInt(String(obj.current_km).replace(/[^0-9]/g, ""), 10);
                    obj.current_km = isNaN(parsedKM) ? 0 : parsedKM;
                }

                // Simple strings
                obj.fuel_type = obj.fuel_type ? String(obj.fuel_type) : "";
                obj.address = obj.address ? String(obj.address) : "";
                obj.vehicle_condition = obj.vehicle_condition ? String(obj.vehicle_condition) : "";

                return obj;
            }).filter(obj => obj.plate_number && obj.vehicle_type_id); // Filter empty rows based on required fields

            if (payload.length === 0) {
                toast.error("No valid data found to import");
                setIsProcessing(false);
                return;
            }

            const res = await apiClient.post(`/vehicles/batch-create?conflict_strategy=${conflictStrategy}`, payload);

            const { imported_new, updated_existing, skipped, errors } = res.data;

            if (imported_new > 0 || updated_existing > 0) {
                toast.success(`Import Complete: ${imported_new} New, ${updated_existing} Updated, ${skipped} Skipped`);
            } else if (skipped > 0) {
                toast.info(`Import Complete: ${skipped} Skipped`);
            }

            if (errors && errors.length > 0) {
                toast.warning(`encountered ${errors.length} errors. Check console for details.`);
                console.error("Import errors:", errors);
            }

            queryClient.invalidateQueries({ queryKey: ["vehicles"] });
            onSuccess();
            onClose();
        } catch (error) {
            console.error("Import failed", error);
            toast.error("Failed to import vehicles");
        } finally {
            setIsProcessing(false);
        }
    };

    const isMappingValid = REQUIRED_FIELDS
        .filter(f => f.required)
        .every(f => mapping[f.id] && mapping[f.id] !== "none_unmapped");

    return (
        <div className="flex flex-col h-[600px] w-[800px] max-w-full">
            {/* Steps Indicator */}
            <div className="flex items-center justify-between mb-8 px-8 pt-4">
                {[1, 2, 3].map((s) => (
                    <div key={s} className="flex items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${step >= s ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                            }`}>
                            {step > s ? <CheckCircle2 className="w-5 h-5" /> : s}
                        </div>
                        {s < 3 && <div className={`w-24 h-1 mx-2 ${step > s ? "bg-primary" : "bg-muted"}`} />}
                    </div>
                ))}
            </div>

            <div className="flex-1 overflow-y-auto px-8">
                {step === 1 && (
                    <div className="flex flex-col items-center justify-center h-full space-y-4 border-2 border-dashed rounded-xl bg-muted/20 p-12">
                        <div className="p-4 bg-primary/10 rounded-full">
                            <UploadCloud className="w-10 h-10 text-primary" />
                        </div>
                        <h3 className="text-xl font-bold">Upload Vehicle File</h3>
                        <p className="text-muted-foreground text-center max-w-sm">
                            Select an Excel (.xlsx) file containing your vehicle fleet data.
                            Headers will be automatically detected.
                        </p>
                        <Label htmlFor="file-upload" className="cursor-pointer">
                            <div className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md font-medium flex items-center gap-2">
                                <FileUp className="w-4 h-4" />
                                Select File
                            </div>
                            <input
                                id="file-upload"
                                type="file"
                                accept=".xlsx, .xls"
                                className="hidden"
                                onChange={handleFileUpload}
                            />
                        </Label>
                    </div>
                )}

                {step === 2 && (
                    <div className="space-y-6">
                        <div className="flex items-center gap-2">
                            <Settings2 className="w-5 h-5 text-primary" />
                            <h3 className="text-lg font-bold">Map Columns</h3>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            Match your file columns to the system fields. We've tried to auto-match them for you.
                        </p>

                        <div className="grid grid-cols-1 gap-4">
                            {REQUIRED_FIELDS.map((field) => (
                                <div key={field.id} className="grid grid-cols-2 gap-4 items-center p-3 border rounded-lg hover:border-primary/50 transition-colors">
                                    <Label className="font-semibold flex items-center gap-1">
                                        {field.label}
                                        {field.required && <span className="text-destructive">*</span>}
                                    </Label>
                                    <Select
                                        value={mapping[field.id]}
                                        onValueChange={(val) => setMapping(prev => ({ ...prev, [field.id]: val }))}
                                    >
                                        <SelectTrigger className={mapping[field.id] === "none_unmapped" && field.required ? "border-amber-500" : ""}>
                                            <SelectValue placeholder="Select column" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="none_unmapped" className="text-muted-foreground italic">Unmapped</SelectItem>
                                            {headers.map(h => (
                                                <SelectItem key={h} value={h}>{h}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div className="space-y-6">
                        <div className="p-4 border rounded-lg bg-muted/10 space-y-3">
                            <h3 className="text-sm font-semibold flex items-center gap-2">
                                <Settings2 className="w-4 h-4" />
                                Duplicate Handling
                            </h3>
                            <div className="flex flex-col gap-3">
                                <label className="flex items-center space-x-3 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="conflictStrategy"
                                        value="skip"
                                        checked={conflictStrategy === 'skip'}
                                        onChange={() => setConflictStrategy('skip')}
                                        className="h-4 w-4 text-primary focus:ring-primary"
                                    />
                                    <div>
                                        <span className="font-medium text-sm">Skip (Default)</span>
                                        <p className="text-xs text-muted-foreground">If Plate/VIN exists, ignore the row.</p>
                                    </div>
                                </label>
                                <label className="flex items-center space-x-3 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="conflictStrategy"
                                        value="update"
                                        checked={conflictStrategy === 'update'}
                                        onChange={() => setConflictStrategy('update')}
                                        className="h-4 w-4 text-primary focus:ring-primary"
                                    />
                                    <div>
                                        <span className="font-medium text-sm">Update</span>
                                        <p className="text-xs text-muted-foreground">If Plate/VIN exists, overwrite with new data.</p>
                                    </div>
                                </label>
                            </div>
                        </div>

                        <h3 className="text-lg font-bold">Preview Data</h3>
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        {REQUIRED_FIELDS.map(f => (
                                            <TableHead key={f.id}>{f.label}</TableHead>
                                        ))}
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {previewData.map((row, i) => (
                                        <TableRow key={i}>
                                            {REQUIRED_FIELDS.map(f => {
                                                const header = mapping[f.id];
                                                const headerIdx = headers.indexOf(header);
                                                const val = headerIdx !== -1 ? row[headerIdx] : "-";
                                                return <TableCell key={f.id}>{val}</TableCell>;
                                            })}
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                )}
            </div>

            <div className="p-8 border-t bg-muted/10 mt-auto flex justify-between">
                {step > 1 && (
                    <Button variant="outline" onClick={() => setStep(s => s - 1 as any)}>
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back
                    </Button>
                )}
                <div className="ml-auto">
                    {step === 2 && (
                        <Button onClick={() => setStep(3)} disabled={!isMappingValid}>
                            Next: Preview
                            <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                    )}
                    {step === 3 && (
                        <Button onClick={handleSubmit} disabled={isProcessing}>
                            {isProcessing ? "Importing..." : "Confirm Import"}
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
}
