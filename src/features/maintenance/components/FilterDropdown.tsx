"use client";

import { useState, useEffect } from "react";
import { Filter, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useMaintenanceFilters } from "../hooks/useMaintenanceFilters";
import { STATUS_OPTIONS } from "../types/maintenanceFilters.types";

export function FilterDropdown() {
  const {
    filters,
    setStatuses,
    resetFilters,
    getActiveFilterCount,
  } = useMaintenanceFilters();

  const [isOpen, setIsOpen] = useState(false);
  const activeCount = getActiveFilterCount();

  const handleStatusToggle = (statusId: string) => {
    const newStatuses = filters.statuses.includes(statusId)
      ? filters.statuses.filter((s) => s !== statusId)
      : [...filters.statuses, statusId];
    setStatuses(newStatuses);
  };

  const handleReset = () => {
    resetFilters();
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "h-8 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white relative",
            activeCount > 0 && "text-blue-600 dark:text-blue-400"
          )}
        >
          <Filter className="mr-2 h-3.5 w-3.5" />
          Filter
          {activeCount > 0 && (
            <Badge
              variant="default"
              className="ml-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-[10px] bg-blue-600"
            >
              {activeCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800" align="end">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h4 className="font-semibold text-sm text-gray-900 dark:text-white">
              Filters
            </h4>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleReset}
              className="h-7 text-xs"
            >
              Reset All
            </Button>
          </div>

          {/* Status Filter */}
          <div className="space-y-2">
            <Label className="text-xs font-medium text-gray-700 dark:text-gray-300">
              Status
            </Label>
            <div className="space-y-2">
              {STATUS_OPTIONS.map((status) => (
                <div key={status.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`status-${status.id}`}
                    checked={filters.statuses.includes(status.id)}
                    onCheckedChange={() => handleStatusToggle(status.id)}
                  />
                  <label
                    htmlFor={`status-${status.id}`}
                    className="text-sm text-gray-700 dark:text-gray-300 cursor-pointer"
                  >
                    {status.label}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 pt-2 border-t border-gray-200 dark:border-gray-800">
            <Button
              size="sm"
              onClick={() => setIsOpen(false)}
              className="flex-1"
            >
              Apply Filters
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
