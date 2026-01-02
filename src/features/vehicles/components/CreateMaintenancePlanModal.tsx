"use client";

import { useForm } from "react-hook-form";
import { useTranslations } from "next-intl";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Search, Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { CreateMaintenancePlanRequest, VehicleMaintenancePlan } from "../api/vehiclePlans";
import { useMaintenanceTemplates } from "@/features/maintenance/hooks/useMaintenanceTemplates";

interface CreateMaintenancePlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan?: VehicleMaintenancePlan; // If provided, we are editing
  meterUnit: "km" | "hours";
  onSubmit: (payload: CreateMaintenancePlanRequest) => void;
}

interface FormData {
  template_id: string;
  interval_km?: number;
  interval_hours?: number;
  interval_months?: number;
  last_service_km?: number;
  last_service_hours?: number;
  last_service_date?: string;
}

export function CreateMaintenancePlanModal({
  isOpen,
  onClose,
  plan,
  meterUnit,
  onSubmit,
}: CreateMaintenancePlanModalProps) {
  const t = useTranslations("vehicles.details.form");
  const { data: templatesData, isLoading: isLoadingTemplates, error: templatesError } = useMaintenanceTemplates();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { isSubmitting },
  } = useForm<FormData>({
    defaultValues: {
      template_id: plan?.template?.id || "",
      interval_km: plan?.interval_km || undefined,
      interval_hours: plan?.interval_hours || undefined,
      interval_months: plan?.interval_months || undefined,
      last_service_km: plan?.last_service_km || undefined,
      last_service_hours: plan?.last_service_hours || undefined,
      last_service_date: plan?.last_service_date?.split("T")[0] || undefined,
    },
  });

  const [searchQuery, setSearchQuery] = useState("");

  const selectedTemplate = watch("template_id");
  const intervalKm = watch("interval_km");
  const intervalHours = watch("interval_hours");
  const intervalMonths = watch("interval_months");

  // Get templates from API
  const templates = templatesData?.data || [];

  const filteredTemplates = templates.filter((t) =>
    t.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleFormSubmit = async (data: FormData) => {
    // Validate that at least one interval is set
    if (!data.interval_km && !data.interval_hours && !data.interval_months) {
      return; // Or show error
    }

    console.log("Submitting:", data);
    onSubmit({
      ...data,
      interval_km: data.interval_km || 0,
      interval_hours: data.interval_hours || 0,
      interval_months: data.interval_months || 0,
      last_service_km: data.last_service_km || 0,
      last_service_hours: data.last_service_hours || 0,
    });
    onClose();
  };

  const handleTemplateSelect = (templateId: string) => {
    const template = templates.find((t) => t.id === templateId);
    if (template) {
      setValue("template_id", templateId);
      if (meterUnit === "km") {
        setValue("interval_km", template.interval_km ?? undefined);
      } else {
        setValue("interval_hours", template.interval_hours ?? undefined);
      }
      setValue("interval_months", template.interval_days ? Math.floor(template.interval_days / 30) : undefined);
    }
  };

  const hasIntervalError = !intervalKm && !intervalHours && !intervalMonths;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {plan ? t("editTitle") : t("createTitle")}
          </DialogTitle>
          <DialogDescription>
            {t("description")}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6 py-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="template" className="text-sm font-medium text-gray-900 dark:text-gray-100">
                {t("template")} <span className="text-red-500">*</span>
              </Label>
              <Select
                value={selectedTemplate}
                onValueChange={handleTemplateSelect}
                disabled={isLoadingTemplates}
              >
                <SelectTrigger className="h-11">
                  <SelectValue placeholder={isLoadingTemplates ? t("searchTemplates") : t("selectTemplate")} />
                </SelectTrigger>
                <SelectContent>
                  <div className="flex items-center px-2 pb-2 pt-0 sticky top-0 bg-white dark:bg-gray-950 z-10 border-b border-gray-100 dark:border-gray-800">
                    <Search className="h-4 w-4 mr-2 text-gray-400" />
                    <Input
                      placeholder={t("searchTemplates")}
                      className="border-0 focus-visible:ring-0 h-8 px-0"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      disabled={isLoadingTemplates}
                    />
                  </div>
                  <div className="max-h-[200px] overflow-y-auto pt-1">
                    {isLoadingTemplates ? (
                      <div className="py-4 px-2 flex items-center justify-center gap-2 text-sm text-gray-500">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Loading templates...</span>
                      </div>
                    ) : templatesError ? (
                      <div className="py-2 px-2 text-sm text-red-500 text-center">
                        Failed to load templates
                      </div>
                    ) : filteredTemplates.length > 0 ? (
                      filteredTemplates.map((template) => (
                        <SelectItem key={template.id} value={template.id}>
                          {template.name}
                        </SelectItem>
                      ))
                    ) : (
                      <div className="py-2 px-2 text-sm text-gray-500 text-center">
                        {t("noTemplates")}
                      </div>
                    )}
                  </div>
                </SelectContent>
              </Select>
              {hasIntervalError && selectedTemplate && (
                <p className="text-sm text-gray-500">
                  {t("templateDesc")}
                </p>
              )}
            </div>

            <div className="space-y-3">
              <Label className="text-sm font-medium text-gray-900 dark:text-gray-100">
                {t("serviceIntervals")}
              </Label>
              <div className="grid grid-cols-2 gap-4">
                {meterUnit === "km" ? (
                  <div className="space-y-2">
                    <Label htmlFor="interval_km" className="text-sm text-gray-700 dark:text-gray-300">
                      {t("intervalKm")}
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
                ) : (
                  <div className="space-y-2">
                    <Label htmlFor="interval_hours" className="text-sm text-gray-700 dark:text-gray-300">
                      Interval (Hours)
                    </Label>
                    <Input
                      id="interval_hours"
                      type="number"
                      min={0}
                      placeholder="e.g. 250"
                      {...register("interval_hours", {
                        valueAsNumber: true,
                      })}
                      className="h-11"
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="interval_months" className="text-sm text-gray-700 dark:text-gray-300">
                    {t("intervalMonths")}
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
                <p className="text-xs text-red-500 mt-1">
                  {t("intervalError")}
                </p>
              )}
            </div>

            <div className="space-y-3 pt-2">
              <Label className="text-sm font-medium text-gray-900 dark:text-gray-100">
                {t("lastServiceInfo")}
              </Label>
              <div className="grid grid-cols-2 gap-4">
                {meterUnit === "km" ? (
                  <div className="space-y-2">
                    <Label htmlFor="last_service_km" className="text-sm text-gray-700 dark:text-gray-300">
                      {t("lastServiceKm")}
                    </Label>
                    <Input
                      id="last_service_km"
                      type="number"
                      min={0}
                      placeholder={t("lastServiceKm")}
                      {...register("last_service_km", { valueAsNumber: true })}
                      className="h-11"
                    />
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Label htmlFor="last_service_hours" className="text-sm text-gray-700 dark:text-gray-300">
                      Last Service (Hours)
                    </Label>
                    <Input
                      id="last_service_hours"
                      type="number"
                      min={0}
                      placeholder="e.g. 1000"
                      {...register("last_service_hours", { valueAsNumber: true })}
                      className="h-11"
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="last_service_date" className="text-sm text-gray-700 dark:text-gray-300">
                    {t("lastServiceDate")}
                  </Label>
                  <Input
                    id="last_service_date"
                    type="date"
                    {...register("last_service_date")}
                    className="h-11"
                  />
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} className="px-6">
              {t("cancel")}
            </Button>
            <Button type="submit" disabled={isSubmitting || !selectedTemplate || hasIntervalError} className="px-6 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white">
              {isSubmitting ? "..." : plan ? t("save") : t("create")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
