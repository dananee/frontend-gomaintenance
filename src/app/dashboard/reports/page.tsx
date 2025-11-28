"use client";

import { CostChart } from "@/features/reports/components/CostChart";
import { AvailabilityChart } from "@/features/reports/components/AvailabilityChart";

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Reports</h1>
      
      <div className="grid gap-6 md:grid-cols-2">
        <CostChart />
        <AvailabilityChart />
      </div>
    </div>
  );
}
