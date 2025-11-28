"use client";

import { MaintenanceCalendar } from "@/features/maintenance/components/MaintenanceCalendar";
import { MaintenancePlanCard } from "@/features/maintenance/components/MaintenancePlanCard";
import { MaintenanceScheduleEvent, MaintenancePlan, MaintenanceTemplate } from "@/features/maintenance/types/maintenance.types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus, Settings, Calendar as CalendarIcon, List } from "lucide-react";
import Link from "next/link";

// Mock Data
const mockEvents: MaintenanceScheduleEvent[] = [
  {
    id: "1",
    vehicle_id: "v1",
    vehicle_name: "Ford F-150",
    plan_id: "p1",
    template_name: "Oil Change",
    due_date: new Date().toISOString(),
    status: "overdue",
    priority: "high",
  },
  {
    id: "2",
    vehicle_id: "v2",
    vehicle_name: "Toyota Camry",
    plan_id: "p2",
    template_name: "Tire Rotation",
    due_date: new Date(Date.now() + 86400000 * 5).toISOString(), // 5 days later
    status: "scheduled",
    priority: "medium",
  },
];

const mockPlans: MaintenancePlan[] = [
  {
    id: "p1",
    vehicle_id: "v1",
    template_id: "t1",
    last_performed_mileage: 45000,
    status: "overdue",
    created_at: "2024-01-01",
  },
  {
    id: "p2",
    vehicle_id: "v2",
    template_id: "t2",
    last_performed_date: "2024-01-15",
    next_due_date: "2024-07-15",
    status: "active",
    created_at: "2024-01-01",
  },
];

const mockTemplates: Record<string, MaintenanceTemplate> = {
  t1: {
    id: "t1",
    name: "Oil Change Service",
    description: "Standard oil change and filter replacement",
    vehicle_types: ["truck"],
    intervals: [{ type: "distance", value: 5000, unit: "km" }],
    tasks: [],
    created_at: "",
    updated_at: "",
  },
  t2: {
    id: "t2",
    name: "Tire Rotation",
    description: "Rotate tires and check pressure",
    vehicle_types: ["car"],
    intervals: [{ type: "time", value: 6, unit: "months" }],
    tasks: [],
    created_at: "",
    updated_at: "",
  },
};

export default function MaintenanceDashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Maintenance</h1>
          <p className="text-gray-500 dark:text-gray-400">Manage preventive maintenance schedules and plans</p>
        </div>
        <div className="flex gap-2">
          <Link href="/dashboard/maintenance/templates">
            <Button variant="outline">
              <Settings className="mr-2 h-4 w-4" />
              Manage Templates
            </Button>
          </Link>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Schedule Maintenance
          </Button>
        </div>
      </div>

      <Tabs defaultValue="calendar" className="w-full">
        <TabsList>
          <TabsTrigger value="calendar">
            <CalendarIcon className="mr-2 h-4 w-4" />
            Calendar
          </TabsTrigger>
          <TabsTrigger value="plans">
            <List className="mr-2 h-4 w-4" />
            Active Plans
          </TabsTrigger>
        </TabsList>

        <TabsContent value="calendar" className="mt-6">
          <MaintenanceCalendar events={mockEvents} />
        </TabsContent>

        <TabsContent value="plans" className="mt-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {mockPlans.map((plan) => (
              <MaintenancePlanCard
                key={plan.id}
                plan={plan}
                template={mockTemplates[plan.template_id]}
                currentMileage={51000} // Mock current mileage
                onComplete={(id) => console.log("Complete plan", id)}
              />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
