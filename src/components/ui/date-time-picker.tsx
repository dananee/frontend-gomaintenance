"use client";

import { useEffect, useState } from "react";
import { format, parse, isValid } from "date-fns";
import { enUS, fr, arSA } from "date-fns/locale";
import { Calendar as CalendarIcon, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { useLocale, useTranslations } from "next-intl";
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
import { Input } from "@/components/ui/input";

const locales = {
  en: enUS,
  fr: fr,
  ar: arSA,
};

interface DateTimePickerProps {
  date?: Date;
  setDate: (date: Date | undefined) => void;
  label?: string;
  error?: string;
}

export function DateTimePicker({
  date,
  setDate,
  label,
  error,
}: DateTimePickerProps) {
  const t = useTranslations("common");
  const locale = useLocale() as keyof typeof locales;
  const dateLocale = locales[locale] || enUS;
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(date);

  // Sync internal state with external prop
  useEffect(() => {
    setSelectedDate(date);
  }, [date]);

  const handleDateSelect = (newDate: Date | undefined) => {
    if (!newDate) {
      setSelectedDate(undefined);
      setDate(undefined);
      return;
    }

    // Preserve existing time if available
    const updatedDate = new Date(newDate);
    if (selectedDate) {
      updatedDate.setHours(selectedDate.getHours());
      updatedDate.setMinutes(selectedDate.getMinutes());
    } else {
      // Default to 12:00 if no time set previously
      updatedDate.setHours(12);
      updatedDate.setMinutes(0);
    }

    setSelectedDate(updatedDate);
    setDate(updatedDate);
  };

  const handleTimeChange = (type: "hour" | "minute", value: string) => {
    if (!selectedDate) return;

    const updatedDate = new Date(selectedDate);
    if (type === "hour") {
      updatedDate.setHours(parseInt(value, 10));
    } else {
      updatedDate.setMinutes(parseInt(value, 10));
    }

    setSelectedDate(updatedDate);
    setDate(updatedDate);
  };

  const hours = Array.from({ length: 24 }, (_, i) => i);
  const minutes = Array.from({ length: 60 }, (_, i) => i);

  return (
    <div className="space-y-2">
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="flex-1">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-left font-normal h-10",
                  !selectedDate && "text-muted-foreground",
                  error && "border-red-500"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {selectedDate ? (
                  format(selectedDate, "PPP", { locale: dateLocale })
                ) : (
                  <span>{t("pickDate")}</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={handleDateSelect}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="flex space-x-2">
           <Select
            disabled={!selectedDate}
            value={selectedDate ? selectedDate.getHours().toString() : undefined}
            onValueChange={(val) => handleTimeChange("hour", val)}
          >
            <SelectTrigger className="w-[70px]">
              <SelectValue placeholder="HH" />
            </SelectTrigger>
            <SelectContent className="h-48">
              {hours.map((hour) => (
                <SelectItem key={hour} value={hour.toString()}>
                  {hour.toString().padStart(2, "0")}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <span className="flex items-center text-muted-foreground">:</span>

          <Select
            disabled={!selectedDate}
            value={selectedDate ? selectedDate.getMinutes().toString() : undefined}
            onValueChange={(val) => handleTimeChange("minute", val)}
          >
            <SelectTrigger className="w-[70px]">
              <SelectValue placeholder="MM" />
            </SelectTrigger>
            <SelectContent className="h-48">
              {minutes.map((minute) => (
                <SelectItem key={minute} value={minute.toString()}>
                  {minute.toString().padStart(2, "0")}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}
