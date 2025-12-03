"use client";

import { useState } from "react";
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
} from "date-fns";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, User, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ScheduledMaintenanceEvent } from "../types/maintenanceDashboard.types";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

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
  // Removed internal state
  
  const nextMonth = () => onDateChange(addMonths(currentDate, 1));
  const prevMonth = () => onDateChange(subMonths(currentDate, 1));
  const goToToday = () => onDateChange(new Date());

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);

  const calendarDays = eachDayOfInterval({
    start: calendarStart,
    end: calendarEnd,
  });

  const getEventsForDay = (date: Date) => {
    return (events || []).filter((event) =>
      isSameDay(new Date(event.scheduled_date), date)
    );
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical":
      case "high":
        return "bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800";
      case "medium":
        return "bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-900/30 dark:text-orange-300 dark:border-orange-800";
      case "low":
        return "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700";
    }
  };

  if (isLoading) {
    return (
      <div className="h-[600px] w-full animate-pulse rounded-xl border border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900" />
    );
  }

  return (
    <div className="flex h-full flex-col rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-200 p-4 dark:border-gray-800">
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            {format(currentDate, "MMMM yyyy")}
          </h2>
          <div className="flex items-center rounded-lg border border-gray-200 bg-gray-50 p-1 dark:border-gray-800 dark:bg-gray-800">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={prevMonth}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 px-2 text-xs font-medium"
              onClick={goToToday}
            >
              Today
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={nextMonth}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <CalendarIcon className="h-4 w-4" />
          <span>{events?.length || 0} scheduled events</span>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="flex-1">
        {/* Weekday Headers */}
        <div className="grid grid-cols-7 border-b border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900/50">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
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
          {calendarDays.map((day, dayIdx) => {
            const dayEvents = getEventsForDay(day);
            const isCurrentMonth = isSameMonth(day, currentDate);
            
            return (
              <div
                key={day.toString()}
                className={cn(
                  "relative border-b border-r border-gray-100 p-2 transition-colors hover:bg-gray-50/50 dark:border-gray-800 dark:hover:bg-gray-800/50",
                  !isCurrentMonth && "bg-gray-50/30 dark:bg-gray-900/30",
                  isToday(day) && "bg-blue-50/30 dark:bg-blue-900/10"
                )}
              >
                <div className="mb-1 flex items-center justify-between">
                  <span
                    className={cn(
                      "flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium",
                      isToday(day)
                        ? "bg-blue-600 text-white"
                        : isCurrentMonth
                        ? "text-gray-900 dark:text-gray-100"
                        : "text-gray-400 dark:text-gray-600"
                    )}
                  >
                    {format(day, "d")}
                  </span>
                  {dayEvents.length > 0 && (
                    <span className="text-[10px] font-medium text-gray-400">
                      {dayEvents.length}
                    </span>
                  )}
                </div>

                <div className="space-y-1 overflow-y-auto max-h-[100px] scrollbar-hide">
                  {dayEvents.map((event) => (
                    <div
                      key={event.id}
                      className={cn(
                        "group relative flex flex-col gap-0.5 rounded border px-1.5 py-1 text-[10px] shadow-sm transition-all hover:shadow-md cursor-pointer",
                        getPriorityColor(event.priority)
                      )}
                    >
                      <div className="font-semibold truncate">{event.vehicle_name}</div>
                      <div className="truncate opacity-75">{event.title}</div>
                      
                      {/* Hover Details */}
                      <div className="hidden group-hover:flex items-center gap-2 mt-1 pt-1 border-t border-black/5 dark:border-white/5">
                        {event.assigned_to && (
                          <div className="flex items-center gap-1" title={event.assigned_to}>
                            <User className="h-3 w-3" />
                            <span className="truncate max-w-[60px]">{event.assigned_to.split(' ')[0]}</span>
                          </div>
                        )}
                        {event.estimated_cost && (
                          <div className="flex items-center gap-0.5">
                            <DollarSign className="h-3 w-3" />
                            <span>{event.estimated_cost}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
