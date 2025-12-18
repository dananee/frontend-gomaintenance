"use client";

import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { WorkOrder, WorkOrderPriority, WorkOrderStatus } from "../types/workOrder.types";
import { useTranslations } from "next-intl";

interface EditWorkOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  workOrder?: WorkOrder;
  onSave: (data: Partial<WorkOrder>) => void;
}

export function EditWorkOrderModal({
  isOpen,
  onClose,
  workOrder,
  onSave,
}: EditWorkOrderModalProps) {
  const t = useTranslations("workOrders");
  const tc = useTranslations("common");

  const { register, handleSubmit, setValue } = useForm<Partial<WorkOrder>>({
    defaultValues: {
      title: workOrder?.title || "",
      description: workOrder?.description || "",
      priority: workOrder?.priority || "medium",
      status: workOrder?.status || "pending",
      assigned_to: workOrder?.assigned_to || "",
      type: workOrder?.type || "preventive",
      estimated_duration: workOrder?.estimated_duration || undefined,
      category: workOrder?.category || "",
      estimated_cost: workOrder?.estimated_cost || undefined,
      notes: workOrder?.notes || "",
    },
    values: workOrder ? {
      title: workOrder.title,
      description: workOrder.description,
      priority: workOrder.priority,
      status: workOrder.status,
      assigned_to: workOrder.assigned_to,
      type: workOrder.type,
      estimated_duration: workOrder.estimated_duration,
      category: workOrder.category,
      estimated_cost: workOrder.estimated_cost,
      notes: workOrder.notes,
    } : undefined
  });

  const onSubmit = (data: Partial<WorkOrder>) => {
    onSave(data);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700">
        <DialogHeader>
          <DialogTitle>{workOrder ? t("form.editTitle") : t("form.createTitle")}</DialogTitle>
          <DialogDescription>
            {workOrder ? t("form.editDescription") : t("form.createDescription")}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">{t("form.fields.title")} *</Label>
              <Input
                id="title"
                {...register("title", { required: true })}
                placeholder={t("form.fields.titlePlaceholder")}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">{t("form.fields.type")}</Label>
              <Select
                onValueChange={(value) => setValue("type", value as any)}
                defaultValue={workOrder?.type || "preventive"}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t("form.fields.selectType")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="preventive">{t("form.types.preventive")}</SelectItem>
                  <SelectItem value="corrective">{t("form.types.corrective")}</SelectItem>
                  <SelectItem value="inspection">{t("form.types.inspection")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">{t("form.fields.description")}</Label>
            <Textarea
              id="description"
              {...register("description")}
              placeholder={t("form.fields.descriptionPlaceholder")}
              className="h-20"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="priority">{t("form.fields.priority")}</Label>
              <Select
                onValueChange={(value) => setValue("priority", value as WorkOrderPriority)}
                defaultValue={workOrder?.priority || "medium"}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t("form.fields.selectPriority")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">{t("priorities.low")}</SelectItem>
                  <SelectItem value="medium">{t("priorities.medium")}</SelectItem>
                  <SelectItem value="high">{t("priorities.high")}</SelectItem>
                  <SelectItem value="urgent">{t("priorities.urgent")}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">{t("form.fields.status")}</Label>
              <Select
                onValueChange={(value) => setValue("status", value as WorkOrderStatus)}
                defaultValue={workOrder?.status || "pending"}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t("form.fields.selectStatus")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">{t("status.pending")}</SelectItem>
                  <SelectItem value="in_progress">{t("status.in_progress")}</SelectItem>
                  <SelectItem value="completed">{t("status.completed")}</SelectItem>
                  <SelectItem value="cancelled">{t("status.cancelled")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="assigned_to">{t("form.fields.assignee")}</Label>
              <Select
                onValueChange={(value) => setValue("assigned_to", value)}
                defaultValue={workOrder?.assigned_to || ""}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t("form.fields.selectTechnician")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="unassigned">{tc("noData")}</SelectItem>
                  <SelectItem value="tech-1">John Doe</SelectItem>
                  <SelectItem value="tech-2">Sarah Smith</SelectItem>
                  <SelectItem value="tech-3">Mike Johnson</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">{t("form.fields.category")}</Label>
              <Select
                onValueChange={(value) => setValue("category", value)}
                defaultValue={workOrder?.category || ""}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t("form.fields.selectCategory")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mechanical">{t("form.categories.mechanical")}</SelectItem>
                  <SelectItem value="electrical">{t("form.categories.electrical")}</SelectItem>
                  <SelectItem value="body">{t("form.categories.body")}</SelectItem>
                  <SelectItem value="tires">{t("form.categories.tires")}</SelectItem>
                  <SelectItem value="other">{t("form.categories.other")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="estimated_duration">{t("form.fields.estimatedDuration")}</Label>
              <Input
                id="estimated_duration"
                type="number"
                step="0.5"
                {...register("estimated_duration", { valueAsNumber: true })}
                placeholder={t("form.fields.durationPlaceholder")}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="estimated_cost">{t("form.fields.estimatedCost", { currency: "MAD" })}</Label>
              <Input
                id="estimated_cost"
                type="number"
                step="0.01"
                {...register("estimated_cost", { valueAsNumber: true })}
                placeholder={t("form.fields.costPlaceholder")}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">{t("form.fields.notes")}</Label>
            <Textarea
              id="notes"
              {...register("notes")}
              placeholder={t("form.fields.notesPlaceholder")}
              className="h-20"
            />
          </div>

          <div className="space-y-2">
            <Label>{t("form.fields.attachments")}</Label>
            <div className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-lg p-4 text-center hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer">
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {t("form.fields.uploadText")}
              </p>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                {t("form.fields.uploadHint")}
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              {tc("cancel")}
            </Button>
            <Button type="submit">
              {workOrder ? t("form.actions.save") : t("form.actions.create")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
