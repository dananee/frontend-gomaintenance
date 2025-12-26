"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DateTimePicker } from "@/components/ui/date-time-picker";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useVehicles } from "@/features/vehicles/hooks/useVehicles";
import { useUsers } from "@/features/users/hooks/useUsers";
import { useMaintenanceTemplates } from "@/features/maintenance/hooks/useMaintenanceTemplates";
import { useCreateScheduledMaintenance, useUpdateScheduledMaintenance } from "@/features/maintenance/hooks/useScheduledMaintenance";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { ScheduledMaintenanceEvent } from "../types/maintenanceDashboard.types";

interface ScheduleMaintenanceModalProps {
  onClose: () => void;
  event?: ScheduledMaintenanceEvent;
}

interface FormData {
  vehicle_id: string;
  template_id?: string;
  title: string;
  description: string;
  scheduled_date: string;
  priority: "low" | "medium" | "high" | "critical";
  assigned_to?: string;
  estimated_cost: number;
  notes: string;
}

export function ScheduleMaintenanceModal({ onClose, event }: ScheduleMaintenanceModalProps) {
  const t = useTranslations("features.maintenance.schedule");
  const { data: vehiclesData, isLoading: vehiclesLoading } = useVehicles();
  const { data: usersData, isLoading: usersLoading } = useUsers();
  const { data: templatesData, isLoading: templatesLoading } = useMaintenanceTemplates();
  const createMutation = useCreateScheduledMaintenance();
  const updateMutation = useUpdateScheduledMaintenance();

  const isEdit = !!event;

  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      vehicle_id: event?.vehicle_id || "",
      template_id: event?.template_id || undefined,
      title: event?.title || "",
      description: event?.description || "",
      scheduled_date: event?.scheduled_date || "",
      priority: event?.priority || "medium",
      assigned_to: event?.assigned_to || undefined,
      estimated_cost: event?.estimated_cost || 0,
      notes: event?.notes || "",
    },
  });

  const selectedTemplate = watch("template_id");

  // Auto-fill from template
  const handleTemplateChange = (templateId: string) => {
    setValue("template_id", templateId);
    const template = templatesData?.data.find((t) => t.id === templateId);
    if (template) {
      setValue("title", template.name);
      setValue("description", template.description || "");
    }
  };

  const onSubmit = async (data: FormData) => {
    try {
      const payload = {
        vehicle_id: data.vehicle_id,
        template_id: data.template_id || undefined,
        title: data.title,
        description: data.description || undefined,
        scheduled_date: new Date(data.scheduled_date).toISOString(),
        priority: data.priority,
        assigned_to: data.assigned_to || undefined,
        estimated_cost: data.estimated_cost || 0,
        notes: data.notes || undefined,
      };

      if (isEdit && event?.id) {
        await updateMutation.mutateAsync({
          id: event.id,
          data: payload,
        });
        toast.success(t("saveSuccess") || "Event updated successfully");
      } else {
        await createMutation.mutateAsync(payload);
        toast.success(t("success"));
      }

      onClose();
    } catch (error) {
      toast.error(t("error"));
      console.error(error);
    }
  };

  const isLoading = vehiclesLoading || usersLoading || templatesLoading;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      ) : (
        <>
          {/* Vehicle Selection */}
          <div className="space-y-2">
            <Label htmlFor="vehicle_id">
              {t("vehicle")} <span className="text-red-500">*</span>
            </Label>
            <Select 
              onValueChange={(value) => setValue("vehicle_id", value)}
              defaultValue={event?.vehicle_id}
              disabled={isEdit}
            >
              <SelectTrigger>
                <SelectValue placeholder={t("selectVehicle")} />
              </SelectTrigger>
              <SelectContent>
                {vehiclesData?.data.map((vehicle) => (
                  <SelectItem key={vehicle.id} value={vehicle.id}>
                    {vehicle.year} {vehicle.brand} {vehicle.model} ({vehicle.plate_number})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.vehicle_id && (
              <p className="text-sm text-red-500">{errors.vehicle_id.message}</p>
            )}
          </div>

          {/* Template Selection (Optional) */}
          <div className="space-y-2">
            <Label htmlFor="template_id">{t("selectTemplate")}</Label>
            <Select 
              onValueChange={handleTemplateChange}
              defaultValue={event?.template_id}
            >
              <SelectTrigger>
                <SelectValue placeholder={t("selectTemplate")} />
              </SelectTrigger>
              <SelectContent>
                {templatesData?.data.map((template) => (
                  <SelectItem key={template.id} value={template.id}>
                    {template.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">
              {t("title")} <span className="text-red-500">*</span>
            </Label>
            <Input
              id="title"
              {...register("title", { required: t("validation.titleRequired") })}
              placeholder={t("placeholders.title")}
            />
            {errors.title && (
              <p className="text-sm text-red-500">{errors.title.message}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">{t("description")}</Label>
            <Textarea
              id="description"
              {...register("description")}
              placeholder={t("placeholders.description")}
              rows={3}
            />
          </div>

          {/* Scheduled Date */}
          <div className="space-y-2">
            <Label htmlFor="scheduled_date">
              {t("scheduledDate")} <span className="text-red-500">*</span>
            </Label>
            <Controller
              control={control}
              name="scheduled_date"
              rules={{ required: t("validation.dateRequired") }}
              render={({ field }) => (
                <DateTimePicker
                  date={field.value ? new Date(field.value) : undefined}
                  setDate={(date) => field.onChange(date ? date.toISOString() : "")}
                  error={errors.scheduled_date?.message}
                />
              )}
            />
            {errors.scheduled_date && (
              <p className="text-sm text-red-500">{errors.scheduled_date.message}</p>
            )}
          </div>

          {/* Priority */}
          <div className="space-y-2">
            <Label htmlFor="priority">{t("priority")}</Label>
            <Select
              onValueChange={(value) => setValue("priority", value as any)}
              defaultValue={event?.priority || "medium"}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">{t("priorities.low")}</SelectItem>
                <SelectItem value="medium">{t("priorities.medium")}</SelectItem>
                <SelectItem value="high">{t("priorities.high")}</SelectItem>
                <SelectItem value="critical">{t("priorities.critical")}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Assigned To */}
          <div className="space-y-2">
            <Label htmlFor="assigned_to">{t("assignTo")}</Label>
            <Select 
              onValueChange={(value) => setValue("assigned_to", value)}
              defaultValue={event?.assigned_to}
            >
              <SelectTrigger>
                <SelectValue placeholder={t("selectTechnician")} />
              </SelectTrigger>
              <SelectContent>
                {usersData?.data
                  .filter((user) => user.role === "technician" || user.role === "admin")
                  .map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.first_name} {user.last_name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          {/* Estimated Cost */}
          <div className="space-y-2">
            <Label htmlFor="estimated_cost">{t("estimatedCost")}</Label>
            <Input
              id="estimated_cost"
              type="number"
              step="0.01"
              {...register("estimated_cost", { valueAsNumber: true })}
              placeholder="0.00"
            />
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">{t("notes")}</Label>
            <Textarea
              id="notes"
              {...register("notes")}
              placeholder={t("placeholders.notes")}
              rows={2}
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={createMutation.isPending || updateMutation.isPending}
            >
              {t("cancel")}
            </Button>
            <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
              {(createMutation.isPending || updateMutation.isPending) && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {isEdit ? t("update") || "Update" : t("create")}
            </Button>
          </div>
        </>
      )}
    </form>
  );
}
