"use client";

import * as React from "react";
import { format, isValid, parseISO } from "date-fns";
import { fr } from "date-fns/locale";
import { Calendar as CalendarIcon, Clock, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useTranslations } from "next-intl";

export interface DatePickerProps {
    value: Date | string | null | undefined;
    onChange: (date: Date | null) => void;
    minDate?: Date;
    maxDate?: Date;
    disabled?: boolean;
    withTime?: boolean;
    label?: string;
    required?: boolean;
    placeholder?: string;
    className?: string;
    error?: string;
}

export function DatePicker({
    value,
    onChange,
    minDate,
    maxDate,
    disabled,
    withTime = false,
    label,
    required,
    placeholder,
    className,
    error,
}: DatePickerProps) {
    const t = useTranslations("common");
    const [isOpen, setIsOpen] = React.useState(false);

    // Parse value to Date object safely
    const dateValue = React.useMemo(() => {
        if (!value) return null;
        if (value instanceof Date) return isValid(value) ? value : null;
        try {
            const parsed = parseISO(value);
            return isValid(parsed) ? parsed : null;
        } catch {
            return null;
        }
    }, [value]);

    const handleSelect = (date: Date | undefined) => {
        if (!date) {
            onChange(null);
            return;
        }

        const newDate = new Date(date);
        if (withTime && dateValue) {
            newDate.setHours(dateValue.getHours());
            newDate.setMinutes(dateValue.getMinutes());
            newDate.setSeconds(0);
            newDate.setMilliseconds(0);
        } else if (!withTime) {
            newDate.setHours(12, 0, 0, 0); // Standardize to noon if no time for UTC safety
        }

        onChange(newDate);
        if (!withTime) setIsOpen(false);
    };

    const handleTimeChange = (type: "hour" | "minute", val: string) => {
        const newDate = dateValue ? new Date(dateValue) : new Date();
        if (type === "hour") {
            newDate.setHours(parseInt(val, 10));
        } else {
            newDate.setMinutes(parseInt(val, 10));
        }
        newDate.setSeconds(0);
        newDate.setMilliseconds(0);
        onChange(newDate);
    };

    const hours = Array.from({ length: 24 }, (_, i) => i);
    const minutes = Array.from({ length: 60 }, (_, i) => i);

    const formattedValue = dateValue
        ? format(dateValue, withTime ? "dd MMM yyyy, HH:mm" : "dd MMM yyyy", { locale: fr })
        : "";

    return (
        <div className={cn("grid w-full items-center gap-1.5", className)}>
            {label && (
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    {label} {required && <span className="text-red-500">*</span>}
                </label>
            )}
            <Popover open={isOpen} onOpenChange={setIsOpen}>
                <div className="relative">
                    <PopoverTrigger asChild>
                        <Button
                            variant={"outline"}
                            disabled={disabled}
                            className={cn(
                                "w-full justify-start text-left font-normal h-10 px-3",
                                !dateValue && "text-muted-foreground",
                                error && "border-red-500 focus-visible:ring-red-500",
                                "hover:bg-accent hover:text-accent-foreground transition-colors"
                            )}
                        >
                            <CalendarIcon className="mr-2 h-4 w-4 opacity-70" />
                            <span className="truncate">
                                {formattedValue || placeholder || t("pickDate") || "Sélectionner une date"}
                            </span>
                        </Button>
                    </PopoverTrigger>
                    {dateValue && !disabled && !required && (
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                onChange(null);
                            }}
                            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-0.5 hover:bg-muted transition-colors"
                        >
                            <X className="h-3 w-3 opacity-50" />
                        </button>
                    )}
                </div>
                <PopoverContent className="w-auto p-0" align="start">
                    <div className="flex flex-col">
                        <Calendar
                            mode="single"
                            selected={dateValue || undefined}
                            onSelect={handleSelect}
                            disabled={(date) =>
                                (minDate ? date < minDate : false) ||
                                (maxDate ? date > maxDate : false)
                            }
                            initialFocus
                            locale={fr}
                            weekStartsOn={1}
                            className="rounded-md border-none"
                        />
                        {withTime && dateValue && (
                            <div className="border-t p-3 flex items-center justify-center gap-2 bg-muted/20">
                                <Clock className="h-4 w-4 opacity-50" />
                                <Select
                                    value={dateValue.getHours().toString()}
                                    onValueChange={(v) => handleTimeChange("hour", v)}
                                >
                                    <SelectTrigger className="h-8 w-[64px] text-xs">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="max-h-[200px]">
                                        {hours.map((h) => (
                                            <SelectItem key={h} value={h.toString()} className="text-xs">
                                                {h.toString().padStart(2, "0")}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <span className="text-xs font-medium">:</span>
                                <Select
                                    value={dateValue.getMinutes().toString()}
                                    onValueChange={(v) => handleTimeChange("minute", v)}
                                >
                                    <SelectTrigger className="h-8 w-[64px] text-xs">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="max-h-[200px]">
                                        {minutes.map((m) => (
                                            <SelectItem key={m} value={m.toString()} className="text-xs">
                                                {m.toString().padStart(2, "0")}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        )}
                    </div>
                </PopoverContent>
            </Popover>
            {error && <p className="text-[0.8rem] font-medium text-red-500">{error}</p>}
        </div>
    );
}
