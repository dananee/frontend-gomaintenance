"use client";

import { useState } from "react";
import { toast } from "sonner";
import { CostChart } from "@/features/reports/components/CostChart";
import { AvailabilityChart } from "@/features/reports/components/AvailabilityChart";
import { MaintenanceCostBreakdownChart } from "@/features/reports/components/MaintenanceCostBreakdownChart";
import { FuelUsageTrendChart } from "@/features/reports/components/FuelUsageTrendChart";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  FileDown,
  FileText,
  FileSpreadsheet,
  Calendar,
  BarChart3,
} from "lucide-react";
import { useTranslations } from "next-intl";

export default function ReportsPage() {
  const t = useTranslations("reports");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [hasData, setHasData] = useState(true); // Set to false to show empty state

  const dateRangeText =
    startDate && endDate
      ? `${new Date(startDate).toLocaleDateString()} - ${new Date(
          endDate
        ).toLocaleDateString()}`
      : "All Time";

  const handleExportPDF = () => {
    toast.info(t("toasts.exportPDF.title"), {
      description: t("toasts.exportPDF.description"),
    });
    // TODO: Implement PDF export logic
    setTimeout(() => {
      toast.success(t("toasts.exportPDF.successTitle"), {
        description: t("toasts.exportPDF.successDescription"),
      });
    }, 1500);
  };

  const handleExportCSV = () => {
    toast.info(t("toasts.exportCSV.title"), {
      description: t("toasts.exportCSV.description"),
    });
    // TODO: Implement CSV export logic
    const csvData = generateCSVData();
    downloadCSV(csvData, `fleet-report-${Date.now()}.csv`);
    toast.success(t("toasts.exportCSV.successTitle"), {
      description: t("toasts.exportCSV.successDescription"),
    });
  };

  const generateCSVData = () => {
    // Sample CSV generation
    const headers = "Category,Labor,Parts,Other\n";
    const rows = [
      "Engine,4000,2400,500",
      "Brakes,3000,1800,300",
      "Tires,1500,3200,200",
      "Electrical,2500,1600,400",
      "Suspension,2200,1400,350",
      "Fluids,800,600,150",
    ].join("\n");
    return headers + rows;
  };

  const downloadCSV = (data: string, filename: string) => {
    const blob = new Blob([data], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {t("title")}
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {t("subtitle")}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExportCSV}>
            <FileSpreadsheet className="mr-2 h-4 w-4" />
            {t("actions.exportCSV")}
          </Button>
          <Button onClick={handleExportPDF}>
            <FileText className="mr-2 h-4 w-4" />
            {t("actions.exportPDF")}
          </Button>
        </div>
      </div>

      {/* Date Range Selector */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-end gap-4">
            <div className="flex-1">
              <Label
                htmlFor="start-date"
                className="mb-2 flex items-center gap-2"
              >
                <Calendar className="h-4 w-4" />
                {t("filters.startDate")}
              </Label>
              <Input
                id="start-date"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                max={endDate || undefined}
              />
            </div>
            <div className="flex-1">
              <Label htmlFor="end-date" className="mb-2">
                {t("filters.endDate")}
              </Label>
              <Input
                id="end-date"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                min={startDate || undefined}
              />
            </div>
            <Button
              variant="outline"
              onClick={() => {
                setStartDate("");
                setEndDate("");
              }}
              disabled={!startDate && !endDate}
            >
              {t("actions.clear")}
            </Button>
          </div>
          {(startDate || endDate) && (
            <div className="mt-3 text-sm text-gray-600 dark:text-gray-400">
              {t("filters.showingDataFor")}{" "}
              <span className="font-semibold">{dateRangeText}</span>
            </div>
          )}
        </CardContent>
      </Card>
      {/* Charts Grid */}
      <div className="grid gap-6">
        {/* Maintenance Cost Breakdown */}
        <MaintenanceCostBreakdownChart dateRange={dateRangeText} />

        {/* Fuel Usage Trend */}
        <FuelUsageTrendChart dateRange={dateRangeText} />

        {/* Original Charts */}
        <div className="grid gap-6 md:grid-cols-2">
          <CostChart />
          <AvailabilityChart />
        </div>
      </div>
    </div>
  );
}
