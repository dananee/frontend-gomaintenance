"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import {
  CreateMaintenancePlanRequest,
  VehicleMaintenancePlan,
} from "@/features/vehicles/api/vehiclePlans";

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
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateMaintenancePlanRequest>({
    defaultValues: plan
      ? {
          template_id: plan.template_id,
          interval_km: plan.interval_km,
          interval_months: plan.interval_months,
          last_service_km: plan.last_service_km,
          last_service_date: plan.last_service_date,
        }
      : undefined,
  });

  useEffect(() => {
    reset(
      plan
        ? {
            template_id: plan.template_id,
            interval_km: plan.interval_km,
            interval_months: plan.interval_months,
            last_service_km: plan.last_service_km,
            last_service_date: plan.last_service_date,
          }
        : {
            template_id: "",
            interval_km: 0,
            interval_months: 0,
            last_service_km: undefined,
            last_service_date: undefined,
          }
    );
  }, [plan, reset]);

  const handleFormSubmit = (payload: CreateMaintenancePlanRequest) => {
    onSubmit(payload);
    reset(payload);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={plan ? "Edit Maintenance Plan" : "Create Maintenance Plan"}
      description="Set up recurring service intervals to keep this vehicle on schedule."
    >
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        <Input
          label="Template ID"
          placeholder="Select or enter template ID"
          {...register("template_id", { required: "Template is required" })}
          error={errors.template_id?.message}
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            label="Interval (KM)"
            type="number"
            min={0}
            {...register("interval_km", {
              valueAsNumber: true,
              required: "KM interval is required",
            })}
            error={errors.interval_km?.message}
          />
          <Input
            label="Interval (Months)"
            type="number"
            min={0}
            {...register("interval_months", {
              valueAsNumber: true,
              required: "Monthly interval is required",
            })}
            error={errors.interval_months?.message}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            label="Last Service KM"
            type="number"
            min={0}
            {...register("last_service_km", { valueAsNumber: true })}
            error={errors.last_service_km?.message}
          />
          <Input
            label="Last Service Date"
            type="date"
            {...register("last_service_date")}
            error={errors.last_service_date?.message}
          />
        </div>

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isSubmitting}>
            {plan ? "Save Changes" : "Create Plan"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
