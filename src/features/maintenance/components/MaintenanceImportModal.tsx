"use client";

import { useState } from "react";
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
import * as XLSX from "xlsx";
import { toast } from "sonner";
import apiClient from "@/lib/api/axiosClient";
import { useQueryClient } from "@tanstack/react-query";
import { useMaintenanceTemplates } from "@/features/maintenance/hooks/useMaintenanceTemplates";

interface MaintenanceImportModalProps {
    onClose: () => void;
    onSuccess?: () => void;
}

const REQUIRED_FIELDS = [
    { id: "vehicle_identity", label: "Vehicle Identity (Plate/VIN)", required: true },
    { id: "template_name", label: "Template Name", required: false }, // Optional if default selected
    { id: "interval_distance", label: "Interval Distance (KM)", required: false },
    { id: "interval_time", label: "Interval Time (Months)", required: false },
    { id: "last_date", label: "Last Service Date", required: false },
    { id: "last_km", label: "Last Service KM", required: false },
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

const normalizeString = (str: string | undefined | null) => {
    if (!str) return "";
    return String(str).toLowerCase().replace(/[^a-z0-9]/g, "");
};

const getBestMatch = (target: string, headers: string[]) => {
    let bestMatch = "";
    let minDistance = Infinity;

    // Common aliases map
    const aliases: Record<string, string[]> = {
        vehicle_identity: ["plate", "vin", "matricule", "registration", "chassis", "serial", "isn", "immatriculation"],
        template_name: ["template", "name", "service", "operation", "designation", "type"],
        interval_distance: ["frequency_km", "interval_km", "km", "distance", "periodicite_km"],
        interval_time: ["frequency_months", "interval_months", "months", "time", "periodicite_temps", "frequency"],
        last_date: ["last_service_date", "date", "last_date", "last_performed", "derniere_intervention"],
        last_km: ["last_service_km", "last_km", "km_counter", "dernier_km"],
    };

    const targetAliases = aliases[target] || [];
    targetAliases.push(target);

    for (const header of headers) {
        const normalizedHeader = normalizeString(header);

        // Exact match check on aliases
        if (targetAliases.some(alias => normalizeString(alias) === normalizedHeader)) {
            return header;
        }

        // Fuzzy match
        for (const alias of targetAliases) {
            const dist = levenshtein(normalizeString(alias), normalizedHeader);
            if (dist < minDistance && dist < 3) {
                minDistance = dist;
                bestMatch = header;
            }
        }
    }

    return bestMatch || "none_unmapped";
};

export function MaintenanceImportModal({ onClose, onSuccess }: MaintenanceImportModalProps) {
    const queryClient = useQueryClient();
    const { data: templatesResponse } = useMaintenanceTemplates();
    const templates = templatesResponse?.data || [];

    const [step, setStep] = useState<1 | 2 | 3>(1);
    const [file, setFile] = useState<File | null>(null);
    const [headers, setHeaders] = useState<string[]>([]);
    const [previewData, setPreviewData] = useState<any[]>([]);
    const [mapping, setMapping] = useState<Record<string, string>>({});
    const [defaultTemplateId, setDefaultTemplateId] = useState<string>("undefined");
    const [isProcessing, setIsProcessing] = useState(false);

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
                setPreviewData(rows.slice(0, 5));

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
        if (!file) return;

        setIsProcessing(true);
        try {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("mapping", JSON.stringify(mapping));
            if (defaultTemplateId && defaultTemplateId !== "undefined") {
                formData.append("default_template_id", defaultTemplateId);
            }

            const res = await apiClient.post("/vehicles/maintenance/import", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            const { success_count, failed_count, errors } = res.data;

            if (success_count > 0) {
                toast.success(`Imported ${success_count} maintenance plans successfully`);
            }

            if (failed_count > 0) {
                toast.warning(`${failed_count} rows failed. Check console for details.`);
                console.error("Import Errors:", errors);
            }

            queryClient.invalidateQueries({ queryKey: ["active-maintenance-plans"] });
            queryClient.invalidateQueries({ queryKey: ["scheduled-maintenance"] });

            if (onSuccess) onSuccess();
            onClose();
        } catch (error) {
            console.error("Import failed", error);
            toast.error("Failed to import maintenance plans");
        } finally {
            setIsProcessing(false);
        }
    };

    const isMappingValid = () => {
        // Vehicle Identity is mandatory
        if (!mapping["vehicle_identity"] || mapping["vehicle_identity"] === "none_unmapped") return false;

        // Template Name is mandatory ONLY if no default template is selected
        if ((!defaultTemplateId || defaultTemplateId === "undefined") &&
            (!mapping["template_name"] || mapping["template_name"] === "none_unmapped")) {
            return false;
        }

        return true;
    };

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
                        <h3 className="text-xl font-bold">Upload Maintenance File</h3>
                        <p className="text-muted-foreground text-center max-w-sm">
                            Select an Excel (.xlsx) file containing maintenance schedule data.
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
                            <h3 className="text-lg font-bold">Configuration</h3>
                        </div>

                        {/* Default Template Configuration */}
                        <div className="p-4 border rounded-lg bg-muted/10 space-y-3">
                            <Label className="font-semibold">Default Maintenance Template (Optional)</Label>
                            <p className="text-xs text-muted-foreground">
                                If selected, all rows will be assigned to this template.
                                "Template Name" column will be ignored.
                            </p>
                            <Select
                                value={defaultTemplateId}
                                onValueChange={setDefaultTemplateId}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a template..." />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="undefined">None (Use Excel "Template Name" column)</SelectItem>
                                    {templates.map((t: any) => (
                                        <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="grid grid-cols-1 gap-4">
                            {REQUIRED_FIELDS.map((field) => (
                                <div key={field.id} className="grid grid-cols-2 gap-4 items-center p-3 border rounded-lg hover:border-primary/50 transition-colors">
                                    <Label className="font-semibold flex items-center gap-1">
                                        {field.label}
                                        {field.required && field.id !== "template_name" && <span className="text-destructive">*</span>}
                                        {field.id === "template_name" && !defaultTemplateId && <span className="text-destructive">*</span>}
                                    </Label>
                                    <Select
                                        value={mapping[field.id]}
                                        onValueChange={(val) => setMapping(prev => ({ ...prev, [field.id]: val }))}
                                        disabled={field.id === "template_name" && !!defaultTemplateId && defaultTemplateId !== "undefined"}
                                    >
                                        <SelectTrigger className={
                                            mapping[field.id] === "none_unmapped" &&
                                                (field.required && (field.id !== "template_name" || !defaultTemplateId))
                                                ? "border-amber-500" : ""
                                        }>
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
                        <h3 className="text-lg font-bold">Preview Data</h3>
                        <div className="rounded-md border overflow-x-auto">
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
                        <Button onClick={() => setStep(3)} disabled={!isMappingValid()}>
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
