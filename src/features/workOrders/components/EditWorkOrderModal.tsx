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
  const { register, handleSubmit, setValue, watch } = useForm({
    defaultValues: {
      title: workOrder?.title || "",
      description: workOrder?.description || "",
      priority: workOrder?.priority || "medium",
      status: workOrder?.status || "pending",
      assigned_to: workOrder?.assigned_to || "",
    },
    values: workOrder ? {
      title: workOrder.title,
      description: workOrder.description,
      priority: workOrder.priority,
      status: workOrder.status,
      assigned_to: workOrder.assigned_to,
    } : undefined
  });

  const onSubmit = (data: any) => {
    onSave(data);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{workOrder ? "Edit Work Order" : "Create Work Order"}</DialogTitle>
          <DialogDescription>
            {workOrder ? "Update the details of this work order." : "Create a new maintenance work order."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" {...register("title")} placeholder="e.g. Brake Inspection" />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea 
              id="description" 
              {...register("description")} 
              placeholder="Describe the issue or maintenance required..." 
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
