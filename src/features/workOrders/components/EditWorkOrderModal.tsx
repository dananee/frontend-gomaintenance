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
          <DialogTitle>{workOrder ? "Edit Work Order" : "Create Work Order"}</DialogTitle>
          <DialogDescription>
            {workOrder ? "Update the details of this work order." : "Create a new maintenance work order."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                {...register("title", { required: "Title is required" })}
                placeholder="e.g. Brake Inspection"
              />
              {/* Error handling would go here */}
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Type</Label>
              <Select
                onValueChange={(value) => setValue("type", value as any)}
                defaultValue={workOrder?.type || "preventive"}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="preventive">Preventive</SelectItem>
                  <SelectItem value="corrective">Corrective</SelectItem>
                  <SelectItem value="inspection">Inspection</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              {...register("description")}
              placeholder="Describe the issue or maintenance required..."
              className="h-20"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select
                onValueChange={(value) => setValue("priority", value as WorkOrderPriority)}
                defaultValue={workOrder?.priority || "medium"}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                onValueChange={(value) => setValue("status", value as WorkOrderStatus)}
                defaultValue={workOrder?.status || "pending"}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="assigned_to">Assignee</Label>
              <Select
                onValueChange={(value) => setValue("assigned_to", value)}
                defaultValue={workOrder?.assigned_to || ""}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select technician" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="unassigned">Unassigned</SelectItem>
                  <SelectItem value="tech-1">John Doe</SelectItem>
                  <SelectItem value="tech-2">Sarah Smith</SelectItem>
                  <SelectItem value="tech-3">Mike Johnson</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                onValueChange={(value) => setValue("category", value)}
                defaultValue={workOrder?.category || ""}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mechanical">Mechanical</SelectItem>
                  <SelectItem value="electrical">Electrical</SelectItem>
                  <SelectItem value="body">Body Work</SelectItem>
                  <SelectItem value="tires">Tires</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="estimated_duration">Est. Time (Hours)</Label>
              <Input
                id="estimated_duration"
                type="number"
                step="0.5"
                {...register("estimated_duration", { valueAsNumber: true })}
                placeholder="e.g. 2.5"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="estimated_cost">Est. Cost (MAD)</Label>
              <Input
                id="estimated_cost"
                type="number"
                step="0.01"
                {...register("estimated_cost", { valueAsNumber: true })}
                placeholder="0.00"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Additional Notes</Label>
            <Textarea
              id="notes"
              {...register("notes")}
              placeholder="Any additional notes or instructions..."
              className="h-20"
            />
          </div>

          <div className="space-y-2">
            <Label>Attachments</Label>
            <div className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-lg p-4 text-center hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer">
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Click to upload files or drag and drop
              </p>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                PDF, PNG, JPG up to 10MB
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {workOrder ? "Save Changes" : "Create Work Order"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
