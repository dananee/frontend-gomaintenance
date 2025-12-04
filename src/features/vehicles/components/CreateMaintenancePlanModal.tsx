"use client";

import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Modal } from "@/components/ui/modal";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Calendar } from "lucide-react";
import { Check, ChevronsUpDown, Loader2, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  CreateMaintenancePlanRequest,
  VehicleMaintenancePlan,
} from "@/features/vehicles/api/vehiclePlans";
import { getMaintenanceTemplates } from "@/features/maintenance/api/maintenanceTemplates";
import { MaintenanceTemplate } from "@/features/maintenance/types/maintenanceTemplate.types";

interface CreateMaintenancePlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (payload: CreateMaintenancePlanRequest) => void;
  isSubmitting?: boolean;
  plan?: VehicleMaintenancePlan;
}

export function CreateMaintenancePlanModal({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting,
  plan,
}: CreateMaintenancePlanModalProps) {
  const [open, setOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<MaintenanceTemplate | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    control,
    formState: { errors },
  } = useForm<CreateMaintenancePlanRequest>({
    defaultValues: {
      template_id: "",
      interval_km: 0,
      interval_months: 0,
      last_service_km: 0,
      last_service_date: "",
    },
  });

  // Fetch templates
  const { data: templatesResponse, isLoading: isLoadingTemplates } = useQuery({
    queryKey: ["maintenance-templates"],
    queryFn: () => getMaintenanceTemplates({}),
    enabled: isOpen,
  });

  const templates = templatesResponse?.data || [];

  // Watch form values for validation
  const watchIntervalKm = watch("interval_km");
  const watchIntervalMonths = watch("interval_months");

  // Reset form when modal opens/closes or plan changes
  useEffect(() => {
    if (isOpen) {
      if (plan) {
        reset({
          template_id: plan.template_id,
          interval_km: plan.interval_km || 0,
          interval_months: plan.interval_months || 0,
          last_service_km: plan.last_service_km || 0,
          last_service_date: plan.last_service_date
            ? new Date(plan.last_service_date).toISOString().split("T")[0]
            : "",
        });
        // Find and set the template
        const template = templates.find((t) => t.id === plan.template_id);
        if (template) {
          setSelectedTemplate(template);
        }
      } else {
        reset({
          template_id: "",
          interval_km: 0,
          interval_months: 0,
          last_service_km: 0,
          last_service_date: "",
        });
        setSelectedTemplate(null);
      }
    }
  }, [plan, reset, isOpen, templates]);

  // Handle template selection
  const handleTemplateSelect = (template: MaintenanceTemplate) => {
    setSelectedTemplate(template);
    setValue("template_id", template.id);

    // Auto-fill intervals from template
    if (template.interval_km) {
      setValue("interval_km", template.interval_km);
    }
    if (template.interval_days) {
      // Convert days to months (approximate)
      const months = Math.round(template.interval_days / 30);
      setValue("interval_months", months);
    }

    setOpen(false);
  };

  const handleFormSubmit = (payload: CreateMaintenancePlanRequest) => {
    // Validate that at least one interval is set
    if (!payload.interval_km && !payload.interval_months) {
      return;
    }

    onSubmit(payload);
  };

  const hasIntervalError = watchIntervalKm === 0 && watchIntervalMonths === 0;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={plan ? "Edit Maintenance Plan" : "Create Maintenance Plan"}
      description="Set up recurring service intervals to keep this vehicle on schedule."
    >
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
        {/* Template Selection */}
        <div className="space-y-2">
          <Label htmlFor="template" className="text-sm font-medium text-gray-900 dark:text-gray-100">
            Maintenance Template <span className="text-red-500">*</span>
          </Label>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                type="button"
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className={cn(
                  "w-full justify-between h-auto min-h-[44px] px-4 py-3 text-left font-normal cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800",
                  !selectedTemplate && "text-gray-500"
                )}
              >
                {selectedTemplate ? (
                  <div className="flex flex-col gap-1 flex-1">
                    <span className="font-medium text-gray-900 dark:text-gray-100">
                      {selectedTemplate.name}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {selectedTemplate.interval_km && `${selectedTemplate.interval_km.toLocaleString()} km`}
                      {selectedTemplate.interval_km && selectedTemplate.interval_days && " • "}
                      {selectedTemplate.interval_days && `${selectedTemplate.interval_days} days`}
                      {(selectedTemplate.interval_km || selectedTemplate.interval_days) && " • "}
                      {selectedTemplate.tasks.length} {selectedTemplate.tasks.length === 1 ? "task" : "tasks"}
                    </span>
                  </div>
                ) : (
                  <span>Select a maintenance template...</span>
                )}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
              <Command>
                <CommandInput placeholder="Search templates..." />
                <CommandList>
                  {isLoadingTemplates ? (
                    <div className="flex items-center justify-center py-6">
                      <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
                    </div>
                  ) : (
                    <>
                      <CommandEmpty>No templates found.</CommandEmpty>
                      <CommandGroup>
                        {templates.map((template) => (
                          <CommandItem
                            key={template.id}
                            value={template.name}
                            onSelect={() => handleTemplateSelect(template)}
                            disabled={false}
                            className="flex items-start gap-3 py-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 aria-selected:bg-gray-100 dark:aria-selected:bg-gray-800"
                          >
                            <Check
                              className={cn(
                                "mt-0.5 h-4 w-4 shrink-0",
                                selectedTemplate?.id === template.id
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                            <div className="flex flex-col gap-1 flex-1 min-w-0">
                              <span className="font-medium text-sm text-gray-900 dark:text-gray-100">
                                {template.name}
                              </span>
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                {template.interval_km && `${template.interval_km.toLocaleString()} km`}
                                {template.interval_km && template.interval_days && " • "}
                                {template.interval_days && `${template.interval_days} days`}
                                {(template.interval_km || template.interval_days) && " • "}
                                {template.tasks.length} {template.tasks.length === 1 ? "task" : "tasks"}
                              </span>
                            </div>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </>
                  )}
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          {!selectedTemplate && (
            <p className="text-xs text-red-600 dark:text-red-400">Template is required</p>
          )}
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Template intervals will auto-fill the fields below.
          </p>
        </div>

        {/* Interval Fields */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-900 dark:text-gray-100">
            Service Intervals
          </Label>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="interval_km" className="text-sm text-gray-700 dark:text-gray-300">
                Interval (KM)
              </Label>
              <Input
                id="interval_km"
                type="number"
                min={0}
                placeholder="e.g. 5000"
                {...register("interval_km", {
                  valueAsNumber: true,
                })}
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="interval_months" className="text-sm text-gray-700 dark:text-gray-300">
                Interval (Months)
              </Label>
              <Input
                id="interval_months"
                type="number"
                min={0}
                placeholder="e.g. 3"
                {...register("interval_months", {
                  valueAsNumber: true,
                })}
                className="h-11"
              />
            </div>
          </div>
          {hasIntervalError && (
            <p className="text-xs text-red-600 dark:text-red-400">
              At least one interval (KM or Months) must be greater than 0
            </p>
          )}
        </div>

        {/* Last Service Fields */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-900 dark:text-gray-100">
            Last Service Information
          </Label>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="last_service_km" className="text-sm text-gray-700 dark:text-gray-300">
                Last Service KM
              </Label>
              <Input
                id="last_service_km"
                type="number"
                min={0}
                placeholder="Enter last recorded mileage"
                {...register("last_service_km", { valueAsNumber: true })}
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="last_service_date" className="text-sm text-gray-700 dark:text-gray-300">
                Last Service Date
              </Label>
              <div className="relative">
                <Input
                  id="last_service_date"
                  type="date"
                  {...register("last_service_date")}
                  className="h-11 pr-10"
                />
                <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-800">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="px-6"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting || !selectedTemplate || hasIntervalError}
            className="px-6 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white"
          >
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {plan ? "Save Changes" : "Create Plan"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
