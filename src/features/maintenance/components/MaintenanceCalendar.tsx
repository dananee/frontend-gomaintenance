"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from "lucide-react";
import { MaintenanceScheduleEvent } from "@/features/maintenance/types/maintenance.types";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface MaintenanceCalendarProps {
  events: MaintenanceScheduleEvent[];
}

export function MaintenanceCalendar({ events }: MaintenanceCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const daysInMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  ).getDate();

  const firstDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  ).getDay();

  const monthName = currentDate.toLocaleString('default', { month: 'long' });
  const year = currentDate.getFullYear();

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const getEventsForDay = (day: number) => {
    return events.filter(event => {
      const eventDate = new Date(event.due_date);
      return (
        eventDate.getDate() === day &&
        eventDate.getMonth() === currentDate.getMonth() &&
        eventDate.getFullYear() === currentDate.getFullYear()
      );
    });
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-xl font-bold flex items-center gap-2">
          <CalendarIcon className="h-5 w-5" />
          {monthName} {year}
        </CardTitle>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={prevMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={() => setCurrentDate(new Date())}>
            Today
          </Button>
          <Button variant="outline" size="icon" onClick={nextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="flex-1">
        <div className="grid grid-cols-7 gap-px bg-gray-200 dark:bg-gray-800 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-800">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div key={day} className="bg-gray-50 dark:bg-gray-900 p-2 text-center text-sm font-medium text-gray-500">
              {day}
            </div>
          ))}
          
          {Array.from({ length: firstDayOfMonth }).map((_, index) => (
            <div key={`empty-${index}`} className="bg-white dark:bg-gray-950 min-h-[100px]" />
          ))}

          {Array.from({ length: daysInMonth }).map((_, index) => {
            const day = index + 1;
            const dayEvents = getEventsForDay(day);
            const isToday = 
              day === new Date().getDate() && 
              currentDate.getMonth() === new Date().getMonth() && 
              currentDate.getFullYear() === new Date().getFullYear();

            return (
              <div 
                key={day} 
                className={`bg-white dark:bg-gray-950 p-2 min-h-[100px] border-t border-gray-100 dark:border-gray-900 ${isToday ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''}`}
              >
                <div className={`text-sm font-medium mb-1 ${isToday ? 'text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'}`}>
                  {day}
                </div>
                <div className="space-y-1">
                  {dayEvents.map(event => (
                    <div 
                      key={event.id}
                      className={`text-xs p-1 rounded border truncate cursor-pointer hover:opacity-80
                        ${event.status === 'overdue' 
                          ? 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800' 
                          : 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800'
                        }`}
                    >
                      {event.vehicle_name} - {event.template_name}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
