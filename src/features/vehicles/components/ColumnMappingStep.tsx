"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle, ArrowRight, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

export type SystemField =
    | "immatriculation"
    | "marque"
    | "modele"
    | "energy_type"
    | "insurance_policy"
    | "address"
    | "vin"
    | "release_date"
    | "driver_name"
    | "age"
    | "ignore";

export interface ColumnMapping {
    [excelHeader: string]: SystemField | "";
}

interface ColumnMappingStepProps {
    excelHeaders: string[];
    onContinue: (mapping: ColumnMapping) => void;
    onBack: () => void;
}

const SYSTEM_FIELDS = [
    { value: "", label: "-- Select Field --" },
    { value: "immatriculation", label: "Immatriculation", required: true },
    { value: "marque", label: "Marque", required: true },
    { value: "modele", label: "Modèle", required: false },
    { value: "energy_type", label: "Type d'Énergie", required: false },
    { value: "insurance_policy", label: "Numéro de Police", required: false },
    { value: "address", label: "Adresse", required: false },
    { value: "vin", label: "VIN (Numéro de Châssis)", required: false },
    { value: "release_date", label: "Date de Mise en Circulation", required: false },
    { value: "driver_name", label: "Conducteur", required: false },
    { value: "age", label: "Age", required: false },
    { value: "ignore", label: "-- Ignore --", required: false },
];

// Auto-match rules for fuzzy matching
const AUTO_MATCH_RULES: Record<SystemField, string[]> = {
    immatriculation: ["plate", "immat", "license", "plaque", "registration", "immatriculation"],
    marque: ["brand", "make", "marque", "manufacturer", "fabricant"],
    modele: ["model", "modèle", "modele"],
    energy_type: ["energy", "energie", "fuel", "carburant", "type", "énergie"],
    insurance_policy: ["police", "assurance", "insurance", "policy", "numéro de police"],
    address: ["address", "adresse", "location", "garage", "lieu"],
    vin: ["vin", "chassis", "châssis", "numéro de châssis"],
    release_date: ["release", "date", "mise en circulation", "circulation", "registration date", "date de mise"],
    driver_name: ["driver", "conducteur", "chauffeur", "pilote"],
    age: ["age", "âge", "ancienneté"],
    ignore: [],
};

export function ColumnMappingStep({
    excelHeaders,
    onContinue,
    onBack,
}: ColumnMappingStepProps) {
    const [mapping, setMapping] = useState<ColumnMapping>({});
    const [errors, setErrors] = useState<string[]>([]);

    // Auto-match columns on mount
    useEffect(() => {
        const autoMatched = autoMatchColumns(excelHeaders);
        setMapping(autoMatched);
    }, [excelHeaders]);

    const autoMatchColumns = (headers: string[]): ColumnMapping => {
        const result: ColumnMapping = {};

        headers.forEach((header) => {
            const normalized = header.toLowerCase().trim();
            let matched = false;

            // Check each system field
            for (const [systemField, variations] of Object.entries(AUTO_MATCH_RULES)) {
                if (variations.some((variation) => normalized.includes(variation))) {
                    result[header] = systemField as SystemField;
                    matched = true;
                    break;
                }
            }

            // If no match, leave empty
            if (!matched) {
                result[header] = "";
            }
        });

        return result;
    };

    const handleMappingChange = (excelHeader: string, systemField: SystemField | "") => {
        setMapping((prev) => ({
            ...prev,
            [excelHeader]: systemField,
        }));
        setErrors([]);
    };

    const validateMapping = (): boolean => {
        const newErrors: string[] = [];
        const mappedFields = new Set(Object.values(mapping).filter((v) => v && v !== "ignore"));

        // Check required fields
        const requiredFields = SYSTEM_FIELDS.filter((f) => f.required).map((f) => f.value);
        requiredFields.forEach((field) => {
            if (!mappedFields.has(field as SystemField)) {
                const fieldLabel = SYSTEM_FIELDS.find((f) => f.value === field)?.label;
                newErrors.push(`${fieldLabel} is required and must be mapped`);
            }
        });

        // Check for duplicate mappings (excluding ignore)
        const fieldCounts = new Map<string, number>();
        Object.values(mapping).forEach((field) => {
            if (field && field !== "ignore" && field !== "") {
                fieldCounts.set(field, (fieldCounts.get(field) || 0) + 1);
            }
        });

        fieldCounts.forEach((count, field) => {
            if (count > 1) {
                const fieldLabel = SYSTEM_FIELDS.find((f) => f.value === field)?.label;
                newErrors.push(`${fieldLabel} is mapped multiple times`);
            }
        });

        setErrors(newErrors);
        return newErrors.length === 0;
    };

    const handleContinue = () => {
        if (validateMapping()) {
            onContinue(mapping);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-[#274040] -mx-6 -mt-6 px-6 py-4 rounded-t-lg">
                <h3 className="text-lg font-semibold text-white">Step 2 of 3: Map Columns</h3>
                <p className="text-sm text-gray-300 mt-1">
                    Match your Excel columns to GoFleet fields
                </p>
            </div>

            {/* Mapping Table */}
            <div className="space-y-2">
                <div className="grid grid-cols-2 gap-4 px-4 py-2 bg-gray-100 rounded-md font-medium text-sm">
                    <div>Excel Column</div>
                    <div>GoFleet Field</div>
                </div>

                <div className="space-y-1">
                    {excelHeaders.map((header, index) => (
                        <div
                            key={header}
                            className={cn(
                                "grid grid-cols-2 gap-4 px-4 py-3 rounded-md items-center",
                                index % 2 === 0 ? "bg-gray-50" : "bg-white"
                            )}
                        >
                            <div className="font-medium text-sm">{header}</div>
                            <select
                                value={mapping[header] || ""}
                                onChange={(e) => handleMappingChange(header, e.target.value as SystemField | "")}
                                className={cn(
                                    "w-full rounded-md border border-gray-300 px-3 py-2 text-sm",
                                    "focus:outline-none focus:ring-2 focus:ring-[#165FF2] focus:border-transparent",
                                    "transition-colors"
                                )}
                            >
                                {SYSTEM_FIELDS.map((field) => (
                                    <option key={field.value} value={field.value}>
                                        {field.label}
                                        {field.required ? " *" : ""}
                                    </option>
                                ))}
                            </select>
                        </div>
                    ))}
                </div>
            </div>

            {/* Errors */}
            {errors.length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-md p-4">
                    <div className="flex items-start gap-2">
                        <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
                        <div className="flex-1">
                            <h4 className="text-sm font-semibold text-red-900">Validation Errors</h4>
                            <ul className="mt-2 space-y-1">
                                {errors.map((error, index) => (
                                    <li key={index} className="text-sm text-red-700">
                                        • {error}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            )}

            {/* Info */}
            <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                <p className="text-sm text-blue-900">
                    <span className="font-semibold">* Required fields</span> must be mapped to continue.
                    Columns set to "Ignore" will not be imported.
                </p>
            </div>

            {/* Navigation */}
            <div className="flex justify-between pt-4">
                <Button variant="outline" onClick={onBack}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back
                </Button>
                <Button
                    onClick={handleContinue}
                    className="bg-[#165FF2] hover:bg-[#1450d0] text-white"
                >
                    Continue
                    <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
            </div>
        </div>
    );
}
