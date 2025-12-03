"use client";

import { useForm } from "react-hook-form";
import { CreateWorkOrderDTO } from "../types/workOrder.types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCreateWorkOrder } from "../hooks/useCreateWorkOrder";
import { useVehicles } from "@/features/vehicles/hooks/useVehicles";

interface WorkOrderFormProps {
  onSuccess: () => void;
  onCancel: () => void;
  vehicleId?: string;
}

export function WorkOrderForm({ onSuccess, onCancel, vehicleId }: WorkOrderFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateWorkOrderDTO>({
    defaultValues: vehicleId ? { vehicle_id: vehicleId } : undefined,
  });
  const { mutate: createWorkOrder, isPending } = useCreateWorkOrder();
  const { data: vehiclesData } = useVehicles();

  const onSubmit = (data: CreateWorkOrderDTO) => {
    createWorkOrder(data, {
      onSuccess: () => {
        onSuccess();
      },
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="mb-2 block text-sm font-medium">Vehicle</label>
        <select
          {...register("vehicle_id", { required: "Vehicle is required" })}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <option value="">Select a vehicle</option>
          {vehiclesData?.data.map((vehicle) => (
            <option key={vehicle.id} value={vehicle.id}>
              {vehicle.plate_number} - {vehicle.brand} {vehicle.model}
            </option>
          ))}
        </select>
        {errors.vehicle_id && (
          <p className="text-sm text-red-500">{errors.vehicle_id.message}</p>
        )}
      </div>

      <Input
        label="Title"
        {...register("title", { required: "Title is required" })}
        error={errors.title?.message}
      />

      <div>
        <label className="mb-2 block text-sm font-medium">Type</label>
        <select
          {...register("type", { required: "Type is required" })}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <option value="preventive">Preventive</option>
          <option value="corrective">Corrective</option>
          <option value="inspection">Inspection</option>
        </select>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">Priority</label>
        <select
          {...register("priority")}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="urgent">Urgent</option>
        </select>
      </div>

      <Input
        label="Description"
        {...register("description")}
        error={errors.description?.message}
      />

      <Input
        label="Scheduled Date"
        type="datetime-local"
        step="60" // Enable seconds/24h format support
        {...register("scheduled_date")}
        error={errors.scheduled_date?.message}
      />

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" isLoading={isPending}>
          Create Work Order
        </Button>
      </div>
    </form>
  );
}
