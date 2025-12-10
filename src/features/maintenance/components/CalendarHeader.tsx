"use client";

import { useTranslations } from "next-intl";
import { format } from "date-fns";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CalendarHeaderProps {
  currentDate: Date;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onToday: () => void;
  eventCount: number;
}

export function CalendarHeader({
  currentDate,
  onPrevMonth,
  onNextMonth,
  onToday,
  eventCount,
}: CalendarHeaderProps) {
  const t = useTranslations("maintenance.calendar");
  return (
    <div className="flex items-center justify-between border-b border-gray-200 p-4 dark:border-gray-800 bg-gradient-to-r from-gray-50/50 to-transparent dark:from-gray-900/50">
      <div className="flex items-center gap-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          {format(currentDate, "MMMM yyyy")}
        </h2>
        <div className="flex items-center rounded-lg border border-gray-200 bg-white p-1 dark:border-gray-700 dark:bg-gray-800 shadow-sm">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer"
            onClick={onPrevMonth}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 px-3 text-xs font-medium hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-900/30 dark:hover:text-blue-400 transition-all duration-200 hover:shadow-sm active:scale-95 cursor-pointer"
            onClick={onToday}
          >
            {t("today")}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer"
            onClick={onNextMonth}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800">
        <CalendarIcon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
        <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
          {eventCount} {eventCount === 1 ? t('event') : t('events')}
        </span>
      </div>
    </div>
  );
}
