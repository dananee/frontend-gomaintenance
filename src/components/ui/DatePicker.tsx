"use client";

import * as React from "react";
import { format, isValid, parseISO, addDays, nextMonday, startOfToday } from "date-fns";
import { fr } from "date-fns/locale";
import { Calendar as CalendarIcon, Clock, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar"; // Ensure step 1 is done!
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
            newDate.setHours(12, 0, 0, 0);
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

    const presets = [
        { label: "Aujourd'hui", value: startOfToday() },
        { label: "Demain", value: addDays(startOfToday(), 1) },
        { label: "Lundi prochain", value: nextMonday(startOfToday()) },
    ];

    const hours = Array.from({ length: 24 }, (_, i) => i);
    const minutes = Array.from({ length: 60 }, (_, i) => i);

    const formattedValue = dateValue
        ? format(dateValue, withTime ? "d MMM yyyy, HH:mm" : "d MMM yyyy", { locale: fr })
        : "";

    return (
        <div className={cn("grid w-full items-center gap-2", className)}>
            {label && (
                <label className="text-[13px] font-semibold tracking-tight text-slate-700 dark:text-slate-300">
                    {label} {required && <span className="text-red-500/80">*</span>}
                </label>
            )}
            <Popover open={isOpen} onOpenChange={setIsOpen}>
                <div className="relative group">
                    <PopoverTrigger asChild>
                        <Button
                            variant={"outline"}
                            disabled={disabled}
                            className={cn(
                                "w-full justify-start text-left font-medium h-11 px-4 rounded-xl border-slate-200 bg-white shadow-sm ring-offset-background transition-all hover:border-slate-300 hover:bg-slate-50/50 dark:border-slate-800 dark:bg-slate-950 dark:hover:border-slate-700 dark:hover:bg-slate-900/50",
                                !dateValue && "text-slate-400 dark:text-slate-500",
                                error && "border-red-200 ring-red-50 focus-visible:ring-red-500/20",
                                isOpen && "ring-4 ring-primary/10 border-primary/50"
                            )}
                        >
                            <CalendarIcon className="mr-3 h-4 w-4 text-slate-400 shrink-0 group-hover:text-primary transition-colors" />
                            <span className="truncate text-sm">
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
                            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-600 transition-all opacity-0 group-hover:opacity-100"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    )}
                </div>
                <PopoverContent 
                    className="w-auto p-0 rounded-2xl border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-950 overflow-hidden ring-1 ring-slate-950/5 dark:ring-white/10" 
                    align="start" 
                    sideOffset={8}
                >
                    <div className="flex flex-col sm:flex-row h-full">
                        {/* Sidebar */}
                        <div className="flex flex-col border-r border-slate-100 dark:border-slate-800 p-3 w-full sm:w-[150px] bg-slate-50/80 dark:bg-slate-900/50">
                            <span className="px-2 pb-2 mb-2 border-b border-slate-200/60 dark:border-slate-700/60 text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
                                {t("shortcuts")}
                            </span>
                            <div className="flex flex-col gap-1">
                                {presets.map((preset) => {
                                    const isSelected = dateValue && preset.value.toDateString() === dateValue.toDateString();
                                    return (
                                        <button
                                            key={preset.label}
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleSelect(preset.value);
                                                if (!withTime) setIsOpen(false);
                                            }}
                                            className={cn(
                                                "flex items-center rounded-md px-3 py-2 text-xs font-medium transition-all text-left w-full",
                                                isSelected
                                                    ? "bg-primary text-primary-foreground shadow-sm"
                                                    : "text-slate-600 hover:bg-white hover:text-primary hover:shadow-sm dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200"
                                            )}
                                        >
                                            {preset.label}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Calendar Area */}
                        <div className="flex flex-col flex-1 min-w-[300px]">
                            <div className="p-2">
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
                                    className="p-2 pointer-events-auto"
                                />
                            </div>
                            
                            {/* Time Picker Footer */}
                            {withTime && (
                                <div className="border-t border-slate-100 dark:border-slate-800 p-3 bg-slate-50/30 dark:bg-slate-900/30">
                                    <div className="flex items-center justify-between gap-4">
                                        <div className="flex items-center gap-2">
                                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                                                <Clock className="h-4 w-4" />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-[11px] font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wide">{t("time")}</span>
                                                <span className="text-[9px] text-slate-400 dark:text-slate-500">24h format</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Select
                                                value={dateValue?.getHours().toString() || "0"}
                                                onValueChange={(v) => handleTimeChange("hour", v)}
                                            >
                                                <SelectTrigger className="h-8 w-[60px] rounded-md border-slate-200 bg-white dark:bg-slate-950 text-xs font-medium focus:ring-0">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent className="max-h-[200px]">
                                                    {hours.map((h) => (
                                                        <SelectItem key={h} value={h.toString()} className="text-xs">
                                                            {h.toString().padStart(2, "0")}h
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <span className="text-slate-400 font-bold text-xs">:</span>
                                            <Select
                                                value={dateValue?.getMinutes().toString() || "0"}
                                                onValueChange={(v) => handleTimeChange("minute", v)}
                                            >
                                                <SelectTrigger className="h-8 w-[60px] rounded-md border-slate-200 bg-white dark:bg-slate-950 text-xs font-medium focus:ring-0">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent className="max-h-[200px]">
                                                    {minutes.map((m) => (
                                                        <SelectItem key={m} value={m.toString()} className="text-xs">
                                                            {m.toString().padStart(2, "0")}m
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </PopoverContent>
            </Popover>
            {error && <p className="text-xs font-semibold text-red-500/90 mt-0.5 ml-1">{error}</p>}
        </div>
    );
}