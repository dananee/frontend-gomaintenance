"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { UpdateVehicleUsageRequest } from "@/features/vehicles/api/updateVehicleUsage";

interface UpdateUsageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (payload: UpdateVehicleUsageRequest) => void;
  isSubmitting?: boolean;
  currentKm?: number;
}

export function UpdateUsageModal({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting,
  currentKm,
}: UpdateUsageModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UpdateVehicleUsageRequest>({
    defaultValues: {
      current_km: currentKm,
    },
  });

  useEffect(() => {
    reset({ current_km: currentKm });
  }, [currentKm, reset]);

  const handleFormSubmit = (payload: UpdateVehicleUsageRequest) => {
    onSubmit(payload);
    reset(payload);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Update Usage"
      description="Record new mileage or engine hours to keep vehicle utilization accurate."
    >
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        <Input
          label="Current Mileage (km)"
          type="number"
          min={0}
          {...register("current_km", { valueAsNumber: true, min: 0 })}
          error={errors.current_km?.message}
        />
        <Input
          label="Engine Hours"
          type="number"
          min={0}
          {...register("current_engine_hours", { valueAsNumber: true, min: 0 })}
          error={errors.current_engine_hours?.message}
        />

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isSubmitting}>
            Save Usage
          </Button>
        </div>
      </form>
    </Modal>
  );
}
