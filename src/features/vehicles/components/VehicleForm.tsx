"use client";

import { useForm } from "react-hook-form";
import { CreateVehicleDTO, Vehicle } from "@/features/vehicles/types/vehicle.types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCreateVehicle } from "../hooks/useCreateVehicle";
import { useUpdateVehicle } from "../hooks/useUpdateVehicle";
import { useTranslations } from "next-intl";

interface VehicleFormProps {
  initialData?: Vehicle;
  onSuccess: () => void;
  onCancel: () => void;
}

export function VehicleForm({ initialData, onSuccess, onCancel }: VehicleFormProps) {
  const t = useTranslations("features.vehicles.form");
  const { register, handleSubmit, formState: { errors } } = useForm<CreateVehicleDTO>({
    defaultValues: initialData ? {
      plate_number: initialData.plate_number,
      vin: initialData.vin,
      type: initialData.type,
      brand: initialData.brand,
      model: initialData.model,
      year: initialData.year,
      status: initialData.status,
    } : undefined,
  });

  const { mutate: createVehicle, isPending: isCreating } = useCreateVehicle();
  const { mutate: updateVehicle, isPending: isUpdating } = useUpdateVehicle();

  const isPending = isCreating || isUpdating;

  const onSubmit = (data: CreateVehicleDTO) => {
    if (initialData) {
      updateVehicle({ id: initialData.id, ...data }, { onSuccess });
    } else {
      createVehicle(data, { onSuccess });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Input
          label={t("brand")}
          {...register("brand", { required: "Brand is required" })}
          error={errors.brand?.message}
        />
        <Input
          label={t("model")}
          {...register("model", { required: "Model is required" })}
          error={errors.model?.message}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input
          label={t("year")}
          type="number"
          {...register("year", { required: "Year is required", valueAsNumber: true })}
          error={errors.year?.message}
        />
        <Input
          label={t("type")}
          {...register("type", { required: "Type is required" })}
          error={errors.type?.message}
        />
      </div>

      <Input
        label={t("licensePlate")}
        {...register("plate_number", { required: "License Plate is required" })}
        error={errors.plate_number?.message}
      />

      <Input
        label={t("vin")}
        {...register("vin", { required: "VIN is required" })}
        error={errors.vin?.message}
      />

      <div>
        <label className="mb-2 block text-sm font-medium">{t("status")}</label>
        <select
          {...register("status")}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <option value="active">{t("active")}</option>
          <option value="maintenance">{t("maintenance")}</option>
          <option value="inactive">{t("inactive")}</option>
        </select>
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          {t("cancel")}
        </Button>
        <Button type="submit" isLoading={isPending}>
          {initialData ? t("update") : t("create")}
        </Button>
      </div>
    </form>
  );
}
