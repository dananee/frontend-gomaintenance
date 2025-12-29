"use client";

import { useEffect, useState } from "react";
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
import { WorkOrder, WorkOrderPriority, WorkOrderStatus, WorkOrderType } from "../types/workOrder.types";
import { useTranslations } from "next-intl";
import { DatePicker } from "@/components/ui/DatePicker";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";

import { useUsers } from "@/features/users/hooks/useUsers";

interface WorkOrderFormValues {
  title: string;
  description: string;
  priority: WorkOrderPriority;
  status: WorkOrderStatus;
  assigned_to?: string;
  assignee_ids: string[];
  type: WorkOrderType;
  estimated_duration?: number;
  category: string;
  estimated_cost?: number;
  labor_cost?: number;
  external_service_cost?: number;
  notes?: string;
  scheduled_date?: string | Date;
}

interface EditWorkOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  workOrder?: WorkOrder;
  onSave: (data: Partial<WorkOrder> & { assignee_ids?: string[]; labor_cost?: number; external_service_cost?: number }) => void;
}

export function EditWorkOrderModal({
  isOpen,
  onClose,
  workOrder,
  onSave,
}: EditWorkOrderModalProps) {
  const t = useTranslations("workOrders");
  const tc = useTranslations("common");

  const { data: techniciansData, isLoading: isLoadingTechnicians } = useUsers({
    role: "technician",
    page_size: 100 // Fetch enough technicians
  });

  const { register, handleSubmit, setValue, getValues, reset, watch } = useForm<WorkOrderFormValues>({
    defaultValues: {
      title: workOrder?.title || "",
      description: workOrder?.description || "",
      priority: workOrder?.priority || "medium",
      status: workOrder?.status || "pending",
      assignee_ids: workOrder?.assignees?.map(u => u.id) || (workOrder?.assigned_to ? [workOrder.assigned_to] : []),
      type: workOrder?.type || "preventive",
      estimated_duration: workOrder?.estimated_duration || undefined,
      category: workOrder?.category || "",
      estimated_cost: workOrder?.estimated_cost || undefined,
      scheduled_date: workOrder?.scheduled_date || undefined,
    },
  });

  // Watch assignee_ids for reactive updates
  const selectedAssigneeIds = watch("assignee_ids");

  useEffect(() => {
    register("assignee_ids");
  }, [register]);

  useEffect(() => {
    if (workOrder) {
      reset({
        title: workOrder.title,
        description: workOrder.description,
        priority: workOrder.priority,
        status: workOrder.status,
        assignee_ids: workOrder.assignees?.map(u => u.id) || (workOrder.assigned_to ? [workOrder.assigned_to] : []),
        type: workOrder.type,
        estimated_duration: workOrder.estimated_duration,
        category: workOrder.category,
        estimated_cost: workOrder.estimated_cost,
        labor_cost: workOrder.cost?.labor_cost,
        external_service_cost: workOrder.cost?.external_service_cost,
        scheduled_date: workOrder.scheduled_date,
      });
    } else {
      reset({
        title: "",
        description: "",
        priority: "medium",
        status: "pending",
        assignee_ids: [],
        type: "preventive",
        estimated_duration: undefined,
        category: "",
        estimated_cost: undefined,
        labor_cost: undefined,
        external_service_cost: undefined,
        scheduled_date: undefined,
      });
    }
  }, [workOrder, reset]);


  const [open, setOpen] = useState(false);


  const onSubmit = (data: WorkOrderFormValues) => {
    const submitData: Partial<WorkOrder> & { assignee_ids?: string[]; labor_cost?: number; external_service_cost?: number } = {
      ...data,
      scheduled_date: data.scheduled_date instanceof Date ? data.scheduled_date.toISOString() : data.scheduled_date,
    };
    onSave(submitData);
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
            <Label>{t("form.fields.scheduledDate")}</Label>
            <DatePicker
              value={watch("scheduled_date")}
              onChange={(date) => {
                setValue("scheduled_date", date ? date.toISOString() : undefined);
              }}
              withTime
            />
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
              <Label htmlFor="assignees">{t("form.fields.assignee")}</Label>
              <Popover open={open} onOpenChange={setOpen} modal={false}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    className="w-full justify-between h-auto min-h-[40px]"
                  >
                    <div className="flex flex-wrap gap-1">
                      {selectedAssigneeIds && selectedAssigneeIds.length > 0 ? (
                        selectedAssigneeIds.map((id) => {
                          const tech = techniciansData?.data.find((t) => t.id === id);
                          console.log("ID => ", id);
                          return (
                            <Badge key={id} variant="secondary" className="mr-1">
                              {tech ? tech.name || `${tech.first_name} ${tech.last_name}` : id}
                            </Badge>
                          );
                        })
                      ) : (
                        <span className="text-muted-foreground">{t("form.fields.selectTechnician")}</span>
                      )}
                    </div>
                    {isLoadingTechnicians ? (
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                    ) : (
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[300px] p-0">
                  <Command>
                    <CommandInput placeholder="Search technician..." />
                    <CommandList>
                      <CommandEmpty>
                        {isLoadingTechnicians ? tc("loading") : tc("noData")}
                      </CommandEmpty>
                      <CommandGroup>
                        {techniciansData?.data.map((tech) => (
                          <CommandItem
                            key={tech.id}
                            value={tech.id} // Use ID as value for uniqueness and safety
                            keywords={[tech.first_name || '', tech.last_name || '', tech.email || '', tech.name || '']}
                            className="cursor-pointer data-[disabled]:pointer-events-auto data-[disabled]:opacity-100"
                            onSelect={(currentValue) => {
                              // currentValue will be the lowercase ID (because cmdk normalizes values)
                              // But since we use the ID from the closure (tech.id), we can just use that directly.


                              const current = getValues("assignee_ids") || [];
                              const isSelected = current.includes(tech.id);

                              if (isSelected) {
                                setValue("assignee_ids", current.filter((id) => id !== tech.id), { shouldDirty: true, shouldValidate: true });
                              } else {
                                setValue("assignee_ids", [...current, tech.id], { shouldDirty: true, shouldValidate: true });
                              }
                            }}
                          >
                            <Checkbox
                              checked={(selectedAssigneeIds || []).includes(tech.id)}
                              className="mr-2 pointer-events-none"
                            />
                            {tech.name || `${tech.first_name} ${tech.last_name}`}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
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

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="labor_cost">Labor Cost (MAD)</Label>
              <Input
                id="labor_cost"
                type="number"
                step="0.01"
                {...register("labor_cost", { valueAsNumber: true })}
                placeholder="0.00"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="external_service_cost">External Part Cost (MAD)</Label>
              <Input
                id="external_service_cost"
                type="number"
                step="0.01"
                {...register("external_service_cost", { valueAsNumber: true })}
                placeholder="0.00"
              />
            </div>
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
    </Dialog >
  );
}
