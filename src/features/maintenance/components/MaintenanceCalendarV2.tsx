"use client";

import { useTranslations } from "next-intl";

import { useState, useMemo } from "react";
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  isToday,
  startOfWeek,
  endOfWeek,
  isWeekend,
} from "date-fns";
import { cn } from "@/lib/utils";
import { ScheduledMaintenanceEvent } from "../types/maintenanceDashboard.types";
import { CalendarHeader } from "./CalendarHeader";
import { CompactDayEvents } from "./CompactDayEvents";
import { EventDrawer } from "./EventDrawer";

interface MaintenanceCalendarV2Props {
  events: ScheduledMaintenanceEvent[];
  isLoading?: boolean;
  currentDate: Date;
  onDateChange: (date: Date) => void;
}

export function MaintenanceCalendarV2({
  events = [],
  isLoading,
  currentDate,
  onDateChange
}: MaintenanceCalendarV2Props) {
  const t = useTranslations("maintenance.calendar.weekdays");
  const [selectedEvent, setSelectedEvent] = useState<ScheduledMaintenanceEvent | null>(null);

  const nextMonth = () => onDateChange(addMonths(currentDate, 1));
  const prevMonth = () => onDateChange(subMonths(currentDate, 1));
  const goToToday = () => onDateChange(new Date());

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);

  const calendarDays = useMemo(
    () =>
      eachDayOfInterval({
        start: calendarStart,
        end: calendarEnd,
      }),
    [calendarStart, calendarEnd]
  );

  const getEventsForDay = (date: Date) => {
    return (events || []).filter((event) =>
      isSameDay(new Date(event.scheduled_date), date)
    );
  };

  const handleEventClick = (event: ScheduledMaintenanceEvent) => {
    setSelectedEvent(event);
  };

  if (isLoading) {
    return (
      <div className="h-[600px] w-full animate-pulse rounded-xl border border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900" />
    );
  }

  return (
    <>
      <div className="flex h-full flex-col rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
        {/* Header */}
        <CalendarHeader
          currentDate={currentDate}
          onPrevMonth={prevMonth}
          onNextMonth={nextMonth}
          onToday={goToToday}
          eventCount={events?.length || 0}
        />

        {/* Calendar Grid */}
        <div className="flex-1">
          {/* Weekday Headers */}
          <div className="grid grid-cols-7 border-b border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900/50">
            {[t("sun"), t("mon"), t("tue"), t("wed"), t("thu"), t("fri"), t("sat")].map((day) => (
              <div
                key={day}
                className="py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Days */}
          <div className="grid h-[600px] grid-cols-7 grid-rows-5">
            {calendarDays.map((day) => {
              const dayEvents = getEventsForDay(day);
              const isCurrentMonth = isSameMonth(day, currentDate);
              const isTodayDate = isToday(day);
              const isWeekendDay = isWeekend(day);
              const hasHighPriority = dayEvents.some(e => e.priority === "high" || e.priority === "critical");

              return (
                <div
                  key={day.toString()}
                  className={cn(
                    "relative border-b border-r border-gray-100 p-2 transition-all duration-200 cursor-pointer",
                    "hover:bg-gradient-to-br hover:from-blue-50/50 hover:to-transparent dark:hover:from-blue-900/10 dark:hover:to-transparent",
                    "hover:shadow-sm hover:z-10",
                    "dark:border-gray-800",
                    !isCurrentMonth && "bg-gray-50/30 dark:bg-gray-900/30",
                    isTodayDate && "bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-900/30 dark:to-blue-800/20 ring-2 ring-inset ring-blue-500/30 shadow-lg shadow-blue-500/10",
                    isWeekendDay && isCurrentMonth && "opacity-70",
                    hasHighPriority && "ring-1 ring-red-200 dark:ring-red-900/30"
                  )}
                >
                  <div className="mb-1 flex items-center justify-between">
                    <span
                      className={cn(
                        "flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium transition-all duration-200",
                        isTodayDate
                          ? "bg-gradient-to-br from-blue-600 to-blue-700 text-white ring-2 ring-blue-500/30 shadow-md shadow-blue-500/30"
                          : isCurrentMonth
                            ? "text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800"
                            : "text-gray-400 dark:text-gray-600"
                      )}
                    >
                      {format(day, "d")}
                    </span>
                    {dayEvents.length > 0 && (
                      <span className={cn(
                        "text-[10px] font-medium px-1.5 py-0.5 rounded-full transition-all",
                        hasHighPriority
                          ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                          : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
                      )}>
                        {dayEvents.length}
                      </span>
                    )}
                  </div>

                  <CompactDayEvents
                    events={dayEvents}
                    date={day}
                    onEventClick={handleEventClick}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Event Drawer */}
      <EventDrawer
        event={selectedEvent}
        isOpen={!!selectedEvent}
        onClose={() => setSelectedEvent(null)}
      />
    </>
  );
}
