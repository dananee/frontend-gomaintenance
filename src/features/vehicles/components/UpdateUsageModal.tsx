"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { UpdateVehicleUsageRequest } from "@/features/vehicles/api/updateVehicleUsage";
import { useTranslations } from "next-intl";

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
  const t = useTranslations("features.vehicles.form");
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
      title={t("updateTitle")}
      description={t("updateDesc")}
    >
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        <Input
          label={t("currentMileage")}
          type="number"
          min={0}
          {...register("current_km", { valueAsNumber: true, min: 0 })}
          error={errors.current_km?.message}
        />
        <Input
          label={t("engineHours")}
          type="number"
          min={0}
          {...register("current_engine_hours", { valueAsNumber: true, min: 0 })}
          error={errors.current_engine_hours?.message}
        />

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onClose}>
            {t("cancel")}
          </Button>
          <Button type="submit" isLoading={isSubmitting}>
            {t("saveUsage")}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
