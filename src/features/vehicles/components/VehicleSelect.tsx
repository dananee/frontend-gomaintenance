"use client";

import * as React from "react";
import { Check, ChevronsUpDown, Car } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { useVehicles } from "../hooks/useVehicles";
import { Vehicle } from "../types/vehicle.types";
import { useTranslations } from "next-intl";

interface VehicleSelectProps {
    value?: string;
    onChange: (value: string) => void;
    placeholder?: string;
    error?: string;
    disabled?: boolean;
}

export function VehicleSelect({
    value,
    onChange,
    placeholder,
    error,
    disabled,
}: VehicleSelectProps) {
    const [open, setOpen] = React.useState(false);
    const t = useTranslations("workOrders.form.fields");
    const vt = useTranslations("vehicles.filters");
    const { data: vehiclesData, isLoading } = useVehicles();

    const vehicles = vehiclesData?.data || [];
    const selectedVehicle = vehicles.find((v) => v.id === value);

    // Helper to get informational label
    const getVehicleLabel = (v: Vehicle) => {
        return `[${v.plate_number}] - ${v.brand} ${v.model} (VIN: ${v.vin || "N/A"})`;
    };

    return (
        <div className="space-y-2">
            <Popover open={open} onOpenChange={setOpen} modal={false}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className={cn(
                            "w-full justify-between font-normal",
                            !value && "text-muted-foreground",
                            error && "border-red-500 ring-red-500"
                        )}
                        disabled={disabled || isLoading}
                    >
                        {selectedVehicle ? (
                            <span className="truncate">{getVehicleLabel(selectedVehicle)}</span>
                        ) : (
                            placeholder || t("selectVehicle")
                        )}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
                    <Command>
                        <CommandInput placeholder={vt("searchPlaceholder")} />
                        <CommandList>
                            <CommandEmpty>{vt("noResults") || "No vehicle found."}</CommandEmpty>
                            <CommandGroup>
                                {vehicles.map((vehicle) => (
                                    <CommandItem
                                        key={vehicle.id}
                                        value={`${vehicle.plate_number} ${vehicle.brand} ${vehicle.model} ${vehicle.vin}`}
                                        className="cursor-pointer data-[disabled]:pointer-events-auto data-[disabled]:opacity-100"
                                        onSelect={() => {
                                            onChange(vehicle.id);
                                            setOpen(false);
                                        }}
                                    >
                                        <Check
                                            className={cn(
                                                "mr-2 h-4 w-4",
                                                value === vehicle.id ? "opacity-100" : "opacity-0"
                                            )}
                                        />
                                        <div className="flex flex-col">
                                            <div className="font-medium">
                                                [{vehicle.plate_number}] - {vehicle.brand} {vehicle.model}
                                            </div>
                                            <div className="text-[10px] text-muted-foreground">
                                                VIN: {vehicle.vin || "N/A"}
                                            </div>
                                        </div>
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
            {error && <p className="text-xs text-red-500">{error}</p>}
        </div>
    );
}
