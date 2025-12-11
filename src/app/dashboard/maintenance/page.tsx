"use client";

import { useState, useEffect } from "react";
import { MaintenanceCalendarV2 } from "@/features/maintenance/components/MaintenanceCalendarV2";
import { ActivePlansList } from "@/features/maintenance/components/ActivePlansList";
import { ActivePlansTable } from "@/features/maintenance/components/ActivePlansTable";
import { ScheduleMaintenanceModal } from "@/features/maintenance/components/ScheduleMaintenanceModal";
import { FilterDropdown } from "@/features/maintenance/components/FilterDropdown";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { useModal } from "@/hooks/useModal";
import { Plus, Settings, Calendar as CalendarIcon, List } from "lucide-react";
import Link from "next/link";
import { useScheduledMaintenance, useActiveMaintenancePlans } from "@/features/maintenance/hooks/useMaintenanceDashboard";
import { useMaintenanceFilters } from "@/features/maintenance/hooks/useMaintenanceFilters";
import { startOfMonth, endOfMonth, formatISO } from "date-fns";
import { useTranslations } from "next-intl";

export default function MaintenanceDashboardPage() {
  const t = useTranslations("features.maintenance.dashboard");
  const { isOpen, open, close } = useModal();
  const { filters } = useMaintenanceFilters();
  
  // Manage calendar date state
  const [currentDate, setCurrentDate] = useState(new Date());

  // Calculate start and end of the current month for fetching
  const startDate = formatISO(startOfMonth(currentDate));
  const endDate = formatISO(endOfMonth(currentDate));
  
  // Fetch data using optimized hooks with date range and filters
  const { data: scheduledEvents = [], isLoading: isLoadingCalendar } = useScheduledMaintenance({
    start_date: startDate,
    end_date: endDate,
    statuses: filters.statuses.length > 0 ? filters.statuses : undefined,
  });
  
  const { data: activePlans = [], isLoading: isLoadingPlans } = useActiveMaintenancePlans({
    statuses: filters.statuses.length > 0 ? filters.statuses : undefined,
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900">
      <div className="space-y-8 p-8 max-w-[1600px] mx-auto">
        {/* Header Section with Gradient */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 dark:from-blue-600/5 dark:to-purple-600/5 rounded-2xl blur-3xl" />
          <div className="relative flex flex-col gap-4 md:flex-row md:items-center md:justify-between p-6 rounded-2xl bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm border border-gray-200 dark:border-gray-800">
            <div>
              <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">
                {t("title")}
              </h1>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                {t("subtitle")}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/dashboard/maintenance/templates">
                <Button variant="outline" className="h-10 rounded-xl border-gray-200 bg-white shadow-sm hover:bg-gray-50 hover:text-gray-900 dark:border-gray-800 dark:bg-gray-900 dark:hover:bg-gray-800 dark:hover:text-white">
                  <Settings className="mr-2 h-4 w-4" />
                  {t("actions.templates")}
                </Button>
              </Link>
              <Button onClick={open} className="h-10 rounded-xl bg-blue-600 shadow-md hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700">
                <Plus className="mr-2 h-4 w-4" />
                {t("actions.schedule")}
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="calendar" className="w-full space-y-6">
          <div className="flex items-center justify-between border-b border-gray-200 pb-4 dark:border-gray-800">
            <TabsList className="h-10 gap-1 bg-transparent p-0 relative">
              <TabsTrigger
                value="calendar"
                className="relative h-9 rounded-lg px-4 text-sm font-medium text-gray-500 data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm dark:text-gray-400 dark:data-[state=active]:bg-gray-800 dark:data-[state=active]:text-blue-400 transition-all"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {t("tabs.calendar")}
              </TabsTrigger>
              <TabsTrigger
                value="plans"
                className="relative h-9 rounded-lg px-4 text-sm font-medium text-gray-500 data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm dark:text-gray-400 dark:data-[state=active]:bg-gray-800 dark:data-[state=active]:text-blue-400 transition-all"
              >
                <List className="mr-2 h-4 w-4" />
                {t("tabs.activePlans")}
              </TabsTrigger>
            </TabsList>
            
            <div className="flex items-center gap-2">
              <FilterDropdown />
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
            <ActivePlansTable 
              plans={activePlans} 
              isLoading={isLoadingPlans} 
            />
          </TabsContent>
        </Tabs>

        <Modal
          isOpen={isOpen}
          onClose={close}
          title={t("modals.schedule.title")}
        >
          <ScheduleMaintenanceModal onClose={close} />
        </Modal>
      </div>
    </div>
  );
}
