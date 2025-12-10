"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { useCreateScheduledMaintenance } from "@/features/maintenance/hooks/useScheduledMaintenance";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface ScheduleMaintenanceModalProps {
  onClose: () => void;
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

export function ScheduleMaintenanceModal({ onClose }: ScheduleMaintenanceModalProps) {
  const t = useTranslations("maintenance.form");
  const { data: vehiclesData, isLoading: vehiclesLoading } = useVehicles();
  const { data: usersData, isLoading: usersLoading } = useUsers();
  const { data: templatesData, isLoading: templatesLoading } = useMaintenanceTemplates();
  const createMutation = useCreateScheduledMaintenance();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      priority: "medium",
      estimated_cost: 0,
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
      await createMutation.mutateAsync({
        vehicle_id: data.vehicle_id,
        template_id: data.template_id || undefined,
        title: data.title,
        description: data.description || undefined,
        scheduled_date: new Date(data.scheduled_date).toISOString(),
        priority: data.priority,
        assigned_to: data.assigned_to || undefined,
        estimated_cost: data.estimated_cost || 0,
        notes: data.notes || undefined,
      });

      toast.success(t("success"));
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
            <Select onValueChange={(value) => setValue("vehicle_id", value)}>
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
            <Select onValueChange={handleTemplateChange}>
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

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">
              {t("selectTemplate")} <span className="text-red-500">*</span>
            </Label>
            <Input
              id="title"
              {...register("title", { required: "Title is required" })}
              placeholder="e.g., Oil Change, Tire Rotation"
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
              placeholder="Describe the maintenance work..."
              rows={3}
            />
          </div>

          {/* Scheduled Date */}
          <div className="space-y-2">
            <Label htmlFor="scheduled_date">
              {t("scheduledDate")} <span className="text-red-500">*</span>
            </Label>
            <Input
              id="scheduled_date"
              type="datetime-local"
              {...register("scheduled_date", { required: "Scheduled date is required" })}
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
              defaultValue="medium"
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
            <Select onValueChange={(value) => setValue("assigned_to", value)}>
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
              placeholder="Additional notes or instructions..."
              rows={2}
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={createMutation.isPending}
            >
              {t("cancel")}
            </Button>
            <Button type="submit" disabled={createMutation.isPending}>
              {createMutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {t("create")}
            </Button>
          </div>
        </>
      )}
    </form>
  );
}
