"use client";

import { useState } from "react";
import { MaintenanceCalendarV2 } from "@/features/maintenance/components/MaintenanceCalendarV2";
import { ActivePlansList } from "@/features/maintenance/components/ActivePlansList";
import { ScheduleMaintenanceModal } from "@/features/maintenance/components/ScheduleMaintenanceModal";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { useModal } from "@/hooks/useModal";
import { Plus, Settings, Calendar as CalendarIcon, List, Filter } from "lucide-react";
import Link from "next/link";
import { useScheduledMaintenance, useActiveMaintenancePlans } from "@/features/maintenance/hooks/useMaintenanceDashboard";

import { startOfMonth, endOfMonth, formatISO } from "date-fns";

export default function MaintenanceDashboardPage() {
  const { isOpen, open, close } = useModal();
  
  // Manage calendar date state
  const [currentDate, setCurrentDate] = useState(new Date());

  // Calculate start and end of the current month for fetching
  const startDate = formatISO(startOfMonth(currentDate));
  const endDate = formatISO(endOfMonth(currentDate));
  
  // Fetch data using new optimized hooks with date range
  const { data: scheduledEvents = [], isLoading: isLoadingCalendar } = useScheduledMaintenance({
    start_date: startDate,
    end_date: endDate,
  });
  const { data: activePlans = [], isLoading: isLoadingPlans } = useActiveMaintenancePlans();

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-gray-950">
      <div className="space-y-6 p-8 max-w-[1600px] mx-auto">
        {/* Header Section */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
              Maintenance
            </h1>
            <p className="mt-1 text-gray-500 dark:text-gray-400">
              Manage preventive maintenance schedules and active plans
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/dashboard/maintenance/templates">
              <Button variant="outline" className="h-10 rounded-xl border-gray-200 bg-white shadow-sm hover:bg-gray-50 hover:text-gray-900 dark:border-gray-800 dark:bg-gray-900 dark:hover:bg-gray-800 dark:hover:text-white">
                <Settings className="mr-2 h-4 w-4" />
                Templates
              </Button>
            </Link>
            <Button onClick={open} className="h-10 rounded-xl bg-blue-600 shadow-md hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700">
              <Plus className="mr-2 h-4 w-4" />
              Schedule Maintenance
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="calendar" className="w-full space-y-6">
          <div className="flex items-center justify-between border-b border-gray-200 pb-4 dark:border-gray-800">
            <TabsList className="h-10 gap-1 bg-transparent p-0">
              <TabsTrigger
                value="calendar"
                className="h-9 rounded-lg px-4 text-sm font-medium text-gray-500 data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm dark:text-gray-400 dark:data-[state=active]:bg-gray-800 dark:data-[state=active]:text-blue-400"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                Calendar
              </TabsTrigger>
              <TabsTrigger
                value="plans"
                className="h-9 rounded-lg px-4 text-sm font-medium text-gray-500 data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm dark:text-gray-400 dark:data-[state=active]:bg-gray-800 dark:data-[state=active]:text-blue-400"
              >
                <List className="mr-2 h-4 w-4" />
                Active Plans
              </TabsTrigger>
            </TabsList>
            
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" className="h-8 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
                <Filter className="mr-2 h-3.5 w-3.5" />
                Filter
              </Button>
            </div>
          </div>

          <TabsContent value="calendar" className="mt-0 focus-visible:outline-none">
            <MaintenanceCalendarV2 
              events={scheduledEvents} 
              isLoading={isLoadingCalendar}
              currentDate={currentDate}
              onDateChange={setCurrentDate}
            />
          </TabsContent>

          <TabsContent value="plans" className="mt-0 focus-visible:outline-none">
            <ActivePlansList 
              plans={activePlans} 
              isLoading={isLoadingPlans} 
            />
          </TabsContent>
        </Tabs>

        <Modal
          isOpen={isOpen}
          onClose={close}
          title="Schedule Maintenance"
        >
          <ScheduleMaintenanceModal onClose={close} />
        </Modal>
      </div>
    </div>
  );
}
