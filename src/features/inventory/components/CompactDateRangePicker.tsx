"use client";

import * as React from "react";
import {
    format,
    subDays,
    startOfMonth,
    endOfMonth,
    startOfToday,
    subMonths,
    isSameDay,
    addMonths
} from "date-fns";
import { enUS, fr, arMA } from "date-fns/locale";
import {
    Calendar as CalendarIcon,
    ChevronDown,
    Check,
    X
} from "lucide-react";
import { DateRange } from "react-day-picker";
import { useLocale } from "next-intl";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

const dateFnsLocales = {
    en: enUS,
    fr: fr,
    ar: arMA,
};

export interface CompactDateRangePickerProps {
    date: DateRange | undefined;
    onDateChange: (date: DateRange | undefined) => void;
    className?: string;
    align?: "start" | "center" | "end";
    t?: (key: string) => string;
}

export function CompactDateRangePicker({
    date,
    onDateChange,
    className,
    align = "end",
    t = (k) => k,
}: CompactDateRangePickerProps) {
    const locale = useLocale() as keyof typeof dateFnsLocales;
    const currentLocale = dateFnsLocales[locale] || enUS;

    const [tempRange, setTempRange] = React.useState<DateRange | undefined>(date);
    const [isOpen, setIsOpen] = React.useState(false);

    React.useEffect(() => {
        if (isOpen) {
            setTempRange(date);
        }
    }, [isOpen, date]);

    const displayDate = (d: Date | undefined) => {
        if (!d) return "";
        return format(d, "dd/MM/yyyy", { locale: currentLocale });
    };

    const presets = [
        {
            label: t("presets.today"),
            getValue: () => ({ from: startOfToday(), to: startOfToday() }),
        },
        {
            label: t("presets.last7days"),
            getValue: () => ({ from: subDays(new Date(), 6), to: new Date() }),
        },
        {
            label: t("presets.last30days"),
            getValue: () => ({ from: subDays(new Date(), 29), to: new Date() }),
        },
        {
            label: t("presets.thisMonth"),
            getValue: () => ({ from: startOfMonth(new Date()), to: endOfMonth(new Date()) }),
        },
        {
            label: t("presets.lastMonth"),
            getValue: () => {
                const lastMonth = subMonths(new Date(), 1);
                return { from: startOfMonth(lastMonth), to: endOfMonth(lastMonth) };
            },
        },
    ];

    const isPresetActive = (getValue: () => DateRange) => {
        const range = getValue();
        if (!tempRange?.from || !tempRange?.to || !range.from || !range.to) {
            return false;
        }
        return (
            isSameDay(tempRange.from, range.from) &&
            isSameDay(tempRange.to, range.to)
        );
    };

    const handlePresetClick = (getValue: () => DateRange) => {
        const range = getValue();
        setTempRange(range);
    };

    const handleApply = () => {
        // Avoid unnecessary refetch if range hasn't changed
        if (
            tempRange?.from?.getTime() === date?.from?.getTime() &&
            tempRange?.to?.getTime() === date?.to?.getTime()
        ) {
            setIsOpen(false);
            return;
        }
        onDateChange(tempRange);
        setIsOpen(false);
    };

    const handleCancel = () => {
        setTempRange(date);
        setIsOpen(false);
    };

    return (
        <div className={cn("grid gap-2", className)}>
            <Popover open={isOpen} onOpenChange={setIsOpen}>
                <PopoverTrigger asChild>
                    <Button
                        id="date"
                        variant="outline"
                        size="sm"
                        className={cn(
                            "h-9 justify-start text-left font-medium bg-background border-muted-foreground/20 hover:border-primary/50 hover:bg-primary/5 transition-all px-4 rounded-lg shadow-sm",
                            !date?.from && "text-muted-foreground"
                        )}
                    >
                        <CalendarIcon className="mr-2.5 h-4 w-4 text-primary/70" />
                        <span className="truncate">
                            {date?.from ? (
                                date.to ? (
                                    <span className="text-foreground">
                                        {displayDate(date.from)} — {displayDate(date.to)}
                                    </span>
                                ) : (
                                    <span className="text-foreground">{displayDate(date.from)}</span>
                                )
                            ) : (
                                <span>{t("selectRange")}</span>
                            )}
                        </span>
                        <ChevronDown className="ml-auto h-4 w-4 opacity-40 shrink-0" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent
                    className="w-auto p-0 bg-popover border-border shadow-2xl rounded-xl overflow-hidden"
                    align={align}
                    sideOffset={8}
                >
                    <div className="flex flex-col">
                        {/* Selected Range Display */}
                        {tempRange?.from && tempRange?.to && (
                            <div className="px-4 py-3 bg-muted/30 border-b border-border/50 flex items-center justify-between">
                                <span className="text-sm font-medium text-foreground">
                                    {displayDate(tempRange.from)} - {displayDate(tempRange.to)}
                                </span>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-6 w-6 p-0 hover:bg-background"
                                    onClick={() => setTempRange(undefined)}
                                >
                                    <X className="h-3.5 w-3.5" />
                                </Button>
                            </div>
                        )}

                        <div className="flex">
                            {/* Presets Sidebar */}
                            <div className="w-[140px] bg-muted/20 p-3 border-r border-border/50 flex flex-col gap-1">
                                {presets.map((preset) => (
                                    <Button
                                        key={preset.label}
                                        variant="ghost"
                                        size="sm"
                                        className={cn(
                                            "justify-start text-xs h-9 px-3 rounded-md transition-all font-medium",
                                            isPresetActive(preset.getValue)
                                                ? "bg-primary text-primary-foreground hover:bg-primary/90"
                                                : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                        )}
                                        onClick={() => handlePresetClick(preset.getValue)}
                                    >
                                        {preset.label}
                                        {isPresetActive(preset.getValue) && <Check className="ml-auto h-3.5 w-3.5" />}
                                    </Button>
                                ))}
                            </div>

                            {/* Dual Calendar */}
                            <div className="p-4">
                                <Calendar
                                    initialFocus
                                    mode="range"
                                    defaultMonth={tempRange?.from || new Date()}
                                    selected={tempRange}
                                    onSelect={setTempRange}
                                    numberOfMonths={2}
                                    locale={currentLocale}
                                    className="p-0"
                                    classNames={{
                                        months: "flex gap-4",
                                        month: "space-y-3",
                                        caption: "flex justify-center relative items-center mb-2",
                                        caption_label: "text-sm font-semibold",
                                        nav: "space-x-1 flex items-center",
                                        nav_button: cn(
                                            "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 hover:bg-muted rounded-md transition-all"
                                        ),
                                        nav_button_previous: "absolute left-1",
                                        nav_button_next: "absolute right-1",
                                        table: "w-full border-collapse",
                                        head_row: "grid grid-cols-7 gap-1",
                                        head_cell:
                                            "text-muted-foreground/70 font-semibold text-[11px] uppercase text-center w-9",
                                        row: "grid grid-cols-7 gap-1 mt-1",
                                        cell: "h-9 w-9 text-center text-sm p-0 relative focus-within:z-20",
                                        day: "h-9 w-9 flex items-center justify-center rounded-md font-medium transition-colors hover:bg-primary/10 hover:text-primary",
                                        day_selected:
                                            "bg-primary text-primary-foreground hover:bg-primary/90 font-semibold",
                                        day_today: "bg-accent text-accent-foreground font-semibold",
                                        day_outside: "text-muted-foreground/40 opacity-50",
                                        day_disabled: "text-muted-foreground/30 opacity-30",
                                        day_range_middle:
                                            "aria-selected:bg-primary/10 aria-selected:text-primary rounded-none",
                                        day_range_start: "rounded-l-md",
                                        day_range_end: "rounded-r-md",
                                    }}
                                />
                            </div>
                        </div>

                        {/* Footer Actions */}
                        <div className="px-4 py-3 bg-muted/20 border-t border-border/50 flex items-center justify-end gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                className="h-9 px-4 text-xs font-medium"
                                onClick={handleCancel}
                            >
                                {t("reset")}
                            </Button>
                            <Button
                                size="sm"
                                disabled={!tempRange?.from}
                                className="h-9 px-6 text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary/90"
                                onClick={handleApply}
                            >
                                {t("apply")}
                            </Button>
                        </div>
                    </div>
                </PopoverContent>
            </Popover>
        </div>
    );
}
