"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { X, Plus } from "lucide-react";
import {
  MaintenanceTemplate,
  CreateMaintenanceTemplateDTO,
} from "../types/maintenanceTemplate.types";

interface TemplateFormProps {
  initialData?: MaintenanceTemplate;
  onSubmit: (data: CreateMaintenanceTemplateDTO) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export function TemplateForm({
  initialData,
  onSubmit,
  onCancel,
  isSubmitting = false,
}: TemplateFormProps) {
  const t = useTranslations("features.maintenance.form");
  const [tasks, setTasks] = useState<string[]>(initialData?.tasks || [""]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateMaintenanceTemplateDTO>({
    defaultValues: initialData
      ? {
          name: initialData.name,
          description: initialData.description,
          interval_km: initialData.interval_km || undefined,
          interval_days: initialData.interval_days || undefined,
          interval_hours: initialData.interval_hours || undefined,
        }
      : {
          name: "",
          description: "",
        },
  });

  const handleFormSubmit = (data: Omit<CreateMaintenanceTemplateDTO, "tasks">) => {
    const filteredTasks = tasks.filter((task) => task.trim() !== "");
    onSubmit({ ...data, tasks: filteredTasks });
  };

  const addTask = () => {
    setTasks([...tasks, ""]);
  };

  const removeTask = (index: number) => {
    setTasks(tasks.filter((_, i) => i !== index));
  };

  const updateTask = (index: number, value: string) => {
    const newTasks = [...tasks];
    newTasks[index] = value;
    setTasks(newTasks);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {/* Name */}
      <div className="space-y-2">
        <Label htmlFor="name">
          {t("templateName")} <span className="text-red-500">*</span>
        </Label>
        <Input
          id="name"
          {...register("name", { required: t("validation.nameRequired") })}
          placeholder={t("placeholders.name")}
          className={errors.name ? "border-red-500" : ""}
        />
        {errors.name && (
          <p className="text-sm text-red-500">{errors.name.message}</p>
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

      {/* Intervals */}
      <div className="space-y-4">
        <Label>{t("intervalsRecommended")}</Label>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="interval_km" className="text-sm">
              {t("everyKm")}
            </Label>
            <Input
              id="interval_km"
              type="number"
              {...register("interval_km", { valueAsNumber: true })}
              placeholder="5000"
              min="0"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="interval_days" className="text-sm">
              {t("everyDays")}
            </Label>
            <Input
              id="interval_days"
              type="number"
              {...register("interval_days", { valueAsNumber: true })}
              placeholder="180"
              min="0"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="interval_hours" className="text-sm">
              {t("everyHours")}
            </Label>
            <Input
              id="interval_hours"
              type="number"
              {...register("interval_hours", { valueAsNumber: true })}
              placeholder="500"
              min="0"
            />
          </div>
        </div>
      </div>

      {/* Tasks */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label>{t("maintenanceTasks")}</Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addTask}
          >
            <Plus className="mr-1 h-3 w-3" />
            {t("addTask")}
          </Button>
        </div>
        <div className="space-y-2">
          {tasks.map((task, index) => (
            <div key={index} className="flex gap-2">
              <Input
                value={task}
                onChange={(e) => updateTask(index, e.target.value)}
                placeholder={`${t("task")} ${index + 1}`}
              />
              {tasks.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeTask(index)}
                  className="flex-shrink-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-2 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          {t("cancel")}
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting
            ? t("saving")
            : initialData
            ? t("updateTemplate")
            : t("createTemplate")}
        </Button>
      </div>
    </form>
  );
}
