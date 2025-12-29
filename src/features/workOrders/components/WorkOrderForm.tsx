import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { CreateWorkOrderDTO } from "../types/workOrder.types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DatePicker } from "@/components/ui/DatePicker";
import { useCreateWorkOrder } from "../hooks/useCreateWorkOrder";
import { useVehicles } from "@/features/vehicles/hooks/useVehicles";
import { useTranslations } from "next-intl";
import { Vehicle } from "@/features/vehicles/types/vehicle.types";
import { Car } from "lucide-react";

interface WorkOrderFormProps {
  onSuccess: () => void;
  onCancel: () => void;
  vehicleId?: string;
  vehicle?: {
    plate_number: string;
    brand: string;
    model: string;
  };
  onDirtyChange?: (isDirty: boolean) => void;
}

export function WorkOrderForm({ onSuccess, onCancel, vehicleId, vehicle, onDirtyChange }: WorkOrderFormProps) {
  const t = useTranslations("workOrders");
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isDirty },
    watch
  } = useForm<CreateWorkOrderDTO>({
    defaultValues: vehicleId ? { vehicle_id: vehicleId } : undefined,
  });

  useEffect(() => {
    onDirtyChange?.(isDirty);
  }, [isDirty, onDirtyChange]);
  const { mutate: createWorkOrder, isPending } = useCreateWorkOrder();
  const { data: vehiclesData } = useVehicles({ page: 1, page_size: 100 });

  const contextualVehicle = vehicle || vehiclesData?.data.find(v => v.id === vehicleId);

  const onSubmit = (data: CreateWorkOrderDTO) => {
    createWorkOrder(data, {
      onSuccess: () => {
        onSuccess();
      },
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {contextualVehicle ? (
        <div className="mb-6 rounded-xl border border-blue-100 bg-blue-50/50 p-4 dark:border-blue-900/30 dark:bg-blue-900/10">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-white shadow-sm ring-4 ring-blue-600/10">
              <Car className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-semibold uppercase tracking-wider text-blue-600/80 dark:text-blue-400">
                {t("form.fields.vehicle")}
              </span>
              <span className="text-sm font-bold text-gray-900 dark:text-gray-100">
                {contextualVehicle.plate_number} — {contextualVehicle.brand} {contextualVehicle.model}
              </span>
            </div>
          </div>
          <input type="hidden" {...register("vehicle_id", { required: true })} />
        </div>
      ) : (
        <div>
          <label className="mb-2 block text-sm font-medium">{t("form.fields.vehicle")}</label>
          <select
            {...register("vehicle_id", { required: t("form.errors.vehicleRequired") })}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="">{t("form.fields.selectVehicle")}</option>
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
      )}

      <Input
        label={t("form.fields.title")}
        {...register("title", { required: t("form.errors.titleRequired") })}
        error={errors.title?.message}
      />

      <div>
        <label className="mb-2 block text-sm font-medium">{t("form.fields.type")}</label>
        <select
          {...register("type", { required: t("form.errors.typeRequired") })}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <option value="preventive">{t("form.types.preventive")}</option>
          <option value="corrective">{t("form.types.corrective")}</option>
          <option value="inspection">{t("form.types.inspection")}</option>
        </select>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">{t("form.fields.priority")}</label>
        <select
          {...register("priority")}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <option value="low">{t("priorities.low")}</option>
          <option value="medium">{t("priorities.medium")}</option>
          <option value="high">{t("priorities.high")}</option>
          <option value="urgent">{t("priorities.urgent")}</option>
        </select>
      </div>

      <Input
        label={t("form.fields.description")}
        {...register("description")}
        error={errors.description?.message}
      />

      <div className="space-y-1">
        <label className="block text-sm font-medium">{t("form.fields.scheduledDate")}</label>
        <Controller
          control={control}
          name="scheduled_date"
          render={({ field }) => (
            <DatePicker
              value={field.value}
              onChange={(date) => field.onChange(date ? date.toISOString() : "")}
              withTime
              error={errors.scheduled_date?.message}
            />
          )}
        />
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          {t("form.actions.cancel")}
        </Button>
        <Button type="submit" isLoading={isPending}>
          {t("form.actions.create")}
        </Button>
      </div>
    </form>
  );
}
