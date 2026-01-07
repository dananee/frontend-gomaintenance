"use client";

import { useMemo, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { CreateVehicleDTO, Vehicle } from "@/features/vehicles/types/vehicle.types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AddressSelector } from "@/components/form/AddressSelector";
import { useCreateVehicle } from "../hooks/useCreateVehicle";
import { useUpdateVehicle } from "../hooks/useUpdateVehicle";
import { useTranslations } from "next-intl";
import { useVehicleTypes } from "../hooks/useVehicleTypes";
import { useUsers } from "@/features/users/hooks/useUsers";
import { Badge } from "@/components/ui/badge";
import { X, Users, ChevronDown, Search } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface VehicleFormProps {
  initialData?: Vehicle;
  onSuccess: () => void;
  onCancel: () => void;
}

export function VehicleForm({ initialData, onSuccess, onCancel }: VehicleFormProps) {
  const t = useTranslations("features.vehicles.form");
  const tVehicleTypes = useTranslations("vehicleTypes");
  const { data: vehicleTypes = [] } = useVehicleTypes();
  const { data: usersData } = useUsers({ page_size: 100 });

  // Driver selection state
  const [selectedDriverIds, setSelectedDriverIds] = useState<string[]>(
    initialData?.drivers?.map(d => d.id) || []
  );
  const [driverSearch, setDriverSearch] = useState("");

  const { register, handleSubmit, control, formState: { errors } } = useForm<CreateVehicleDTO>({
    defaultValues: initialData ? {
      plate_number: initialData.plate_number,
      vin: initialData.vin,
      vehicle_type_id: initialData.vehicle_type_id,
      brand: initialData.brand,
      model: initialData.model,
      year: initialData.year,
      status: initialData.status,
      meter_unit: initialData.meter_unit || "km",
      ville_id: initialData.ville_id,
      address: initialData.address,
    } : {
      meter_unit: "km",
      status: "active" as const
    },
  });

  const { mutate: createVehicle, isPending: isCreating } = useCreateVehicle();
  const { mutate: updateVehicle, isPending: isUpdating } = useUpdateVehicle();

  const isPending = isCreating || isUpdating;

  const uniqueVehicleTypes = useMemo(() => {
    const map = new Map<string, typeof vehicleTypes[0]>();

    vehicleTypes.forEach((type: any) => {
      const label = tVehicleTypes.has(type.code) ? tVehicleTypes(type.code) : type.name;
      const normalized = label.toLowerCase().trim();

      const existing = map.get(normalized);
      if (!existing) {
        map.set(normalized, type);
      } else {
        const existingLabel = tVehicleTypes.has(existing.code) ? tVehicleTypes(existing.code) : existing.name;
        const isTitleCase = (str: string) => /^[A-Z][a-z]/.test(str);

        if (!isTitleCase(existingLabel) && isTitleCase(label)) {
          map.set(normalized, type);
        }
      }
    });

    return Array.from(map.values()).sort((a, b) => {
      const labelA = tVehicleTypes.has(a.code) ? tVehicleTypes(a.code) : a.name;
      const labelB = tVehicleTypes.has(b.code) ? tVehicleTypes(b.code) : b.name;
      return labelA.localeCompare(labelB);
    });
  }, [vehicleTypes, tVehicleTypes]);

  // Prepare available users for driver selection
  const availableUsers = useMemo(() => {
    if (!usersData?.data) return [];
    return usersData.data.map(u => ({
      id: u.id,
      name: u.name || `${u.first_name || ''} ${u.last_name || ''}`.trim() || u.email,
      role: u.role || 'N/A',
      department: u.department || 'N/A',
    }));
  }, [usersData]);

  // Filter users based on search
  const filteredUsers = useMemo(() => {
    if (!driverSearch) return availableUsers;
    const search = driverSearch.toLowerCase();
    return availableUsers.filter(u =>
      u.name.toLowerCase().includes(search) ||
      u.role.toLowerCase().includes(search) ||
      u.department.toLowerCase().includes(search)
    );
  }, [availableUsers, driverSearch]);

  // Get selected driver details
  const selectedDrivers = useMemo(() => {
    return selectedDriverIds
      .map(id => availableUsers.find(u => u.id === id))
      .filter((driver): driver is { id: string; name: string; role: string; department: string } => driver !== undefined);
  }, [selectedDriverIds, availableUsers]);

  const onSubmit = (data: CreateVehicleDTO) => {
    const payload = {
      ...data,
      drivers: selectedDriverIds.length > 0 ? selectedDriverIds : undefined,
    };

    if (initialData) {
      updateVehicle({ id: initialData.id, ...payload }, { onSuccess });
    } else {
      createVehicle(payload, { onSuccess });
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

        <div>
          <label className="mb-2 block text-sm font-medium">{t("type")}</label>
          <select
            {...register("vehicle_type_id", { required: "Type is required" })}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="">{t("selectType")}</option>
            {uniqueVehicleTypes.map((type) => (
              <option key={type.id} value={type.id}>
                {tVehicleTypes.has(type.code) ? tVehicleTypes(type.code) : type.name}
              </option>
            ))}
          </select>
          {errors.vehicle_type_id && <p className="text-sm text-red-500">{errors.vehicle_type_id.message}</p>}
        </div>
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

      <div className="grid grid-cols-2 gap-4">
        <Input
          label={t("address")}
          {...register("address")}
          error={errors.address?.message}
        />
        <Controller
          control={control}
          name="ville_id"
          render={({ field }) => (
            <AddressSelector
              selectedVilleId={field.value}
              onVilleChange={(val) => field.onChange(val)}
              initialRegionId={initialData?.ville?.region_id}
            />
          )}
        />
      </div>

      {/* Driver Selection */}
      <div className="space-y-2">
        <label className="mb-2 block text-sm font-medium">
          <Users className="inline h-4 w-4 mr-1" />
          {t("drivers") || "Drivers"}
        </label>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              type="button"
              variant="outline"
              className="w-full justify-between"
            >
              <span className="text-muted-foreground">
                {selectedDrivers.length > 0
                  ? `${selectedDrivers.length} driver(s) selected`
                  : t("selectDrivers") || "Select drivers..."}
              </span>
              <ChevronDown className="h-4 w-4 opacity-50" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-[400px] p-0" align="start">
            <div className="flex items-center border-b px-3 py-2">
              <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
              <input
                type="text"
                placeholder={t("searchDrivers") || "Search drivers..."}
                value={driverSearch}
                onChange={(e) => setDriverSearch(e.target.value)}
                className="flex h-8 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              />
            </div>
            <div className="max-h-[300px] overflow-y-auto p-1">
              {filteredUsers.length === 0 ? (
                <div className="py-6 text-center text-sm text-muted-foreground">
                  No users found
                </div>
              ) : (
                filteredUsers.map((user) => {
                  const isSelected = selectedDriverIds.includes(user.id);
                  return (
                    <button
                      key={user.id}
                      type="button"
                      onClick={() => {
                        if (isSelected) {
                          setSelectedDriverIds(selectedDriverIds.filter(id => id !== user.id));
                        } else {
                          setSelectedDriverIds([...selectedDriverIds, user.id]);
                        }
                      }}
                      className={`w-full px-2 py-2 text-left text-sm rounded-sm hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors ${isSelected ? "bg-blue-100 dark:bg-blue-900/30" : ""
                        }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="font-medium truncate">{user.name}</div>
                          <div className="text-xs text-muted-foreground truncate">
                            {user.role} • {user.department}
                          </div>
                        </div>
                        {isSelected && (
                          <div className="ml-2 h-4 w-4 flex items-center justify-center">
                            <div className="h-2 w-2 rounded-full bg-primary" />
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Selected Drivers */}
        {selectedDrivers.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {selectedDrivers.map((driver) => (
              <Badge
                key={driver.id}
                variant="secondary"
                className="gap-1 px-2 py-1"
              >
                <span>{driver.name}</span>
                <button
                  type="button"
                  onClick={() => setSelectedDriverIds(selectedDriverIds.filter(id => id !== driver.id))}
                  className="ml-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
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

        <div>
          <label className="mb-2 block text-sm font-medium">{t("meterUnit")}</label>
          <select
            {...register("meter_unit")}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="km">Kilometers (km)</option>
            <option value="hours">Engine Hours (h)</option>
          </select>
        </div>
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
