"use client";
import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useRegions, useVilles } from "@/features/vehicles/hooks/useAddress";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface AddressSelectorProps {
    selectedVilleId?: number;
    onVilleChange: (villeId: number) => void;
    initialRegionId?: number;
}

export function AddressSelector({
    selectedVilleId,
    onVilleChange,
    initialRegionId,
}: AddressSelectorProps) {
    const t = useTranslations("features.vehicles.form");
    const [selectedRegionId, setSelectedRegionId] = useState<number | undefined>(
        initialRegionId
    );

    const { data: regions } = useRegions();
    const { data: villes, isLoading: isLoadingVilles } = useVilles(selectedRegionId);

    // If initialRegionId is not provided but selectedVilleId is, we might need to find the region.
    // However, the backend should provide the region in the initial data if we want to pre-fill it correctly.
    // For now, if we selection a ville, we assume the parent component handles the region or we just show the ville if loaded.
    // If we change region, we clear ville.

    const handleRegionChange = (regionId: string) => {
        const id = parseInt(regionId);
        if (id !== selectedRegionId) {
            setSelectedRegionId(id);
            // We don't call onVilleChange here, let user select ville.
            // Or we can clear it?
            // onVilleChange(0); // 0 or undefined?
        }
    };

    // If we have selectedVilleId but no region selected, and we have villes loaded (which requires region),
    // we are in a chicken-egg if we don't know region.
    // BUT: The VehicleForm should pass the regionID if it knows it (from initialData.ville.region_id).

    useEffect(() => {
        if (initialRegionId) {
            setSelectedRegionId(initialRegionId);
        }
    }, [initialRegionId]);

    return (
        <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
                <Label>{t("region")}</Label>
                <Select
                    value={selectedRegionId?.toString()}
                    onValueChange={handleRegionChange}
                >
                    <SelectTrigger>
                        <SelectValue placeholder={t("region")} />
                    </SelectTrigger>
                    <SelectContent>
                        {regions?.map((region) => (
                            <SelectItem key={region.id} value={region.id.toString()}>
                                {region.region}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div className="space-y-2">
                <Label>{t("city")}</Label>
                <Select
                    value={selectedVilleId?.toString()}
                    onValueChange={(value) => onVilleChange(parseInt(value))}
                    disabled={!selectedRegionId}
                >
                    <SelectTrigger>
                        <SelectValue placeholder={t("city")} />
                    </SelectTrigger>
                    <SelectContent>
                        {villes?.map((ville) => (
                            <SelectItem key={ville.id} value={ville.id.toString()}>
                                {ville.ville}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
}
