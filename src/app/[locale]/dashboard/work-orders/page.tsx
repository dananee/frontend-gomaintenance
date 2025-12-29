"use client";

import { useState, useMemo } from "react";
import {
  WorkOrderKanban,
  WorkOrderFilters,
} from "@/features/workOrders/components/WorkOrderKanban";
import { WorkOrderForm } from "@/features/workOrders/components/WorkOrderForm";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { useModal } from "@/hooks/useModal";
import { useFormGuard } from "@/hooks/useFormGuard";
import { Plus } from "lucide-react";
import { WorkOrderStatus } from "@/features/workOrders/types/workOrder.types";
import { toast } from "sonner";
import { useTranslations, useLocale } from "next-intl";
import { useVehicles } from "@/features/vehicles/hooks/useVehicles";
import { Vehicle } from "@/features/vehicles/types/vehicle.types";
import { useWorkOrders } from "@/features/workOrders/hooks/useWorkOrders";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { ChevronsUpDown, Car } from "lucide-react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

export default function WorkOrdersPage() {
  const t = useTranslations("workOrders");
  const vt = useTranslations("vehicles");
  const { isOpen, open, close } = useModal();
  const [filters, setFilters] = useState<WorkOrderFilters>({});
  const { data: vehiclesData, isLoading: isLoadingVehicles, isError: isErrorVehicles } = useVehicles({ page: 1, page_size: 100, include_kpis: false });
  const { data: workOrdersData } = useWorkOrders({ page_size: 100 });
  const [isVehiclePopoverOpen, setIsVehiclePopoverOpen] = useState(false);
  const [isFormDirty, setIsFormDirty] = useState(false);

  const { preventClose, handleAttemptClose } = useFormGuard({
    isDirty: isFormDirty,
    onClose: close,
  });

  const vehiclesWithWorkOrders = useMemo(() => {
    if (!workOrdersData?.data || !vehiclesData?.data) return [];

    const vehicleIdsWithWorkOrders = new Set(
      workOrdersData.data.map((wo) => wo.vehicle_id)
    );

    return vehiclesData.data.filter((v: Vehicle) => vehicleIdsWithWorkOrders.has(v.id));
  }, [workOrdersData?.data, vehiclesData?.data]);

  const selectedVehicleIds = filters.vehicleIds || [];

  const handleSuccess = () => {
    toast.success(t("toasts.created.title"), {
      description: t("toasts.created.description"),
    });
    close();
  };

  return (
    <div className="flex h-full flex-col space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          {t("title")}
        </h1>
        <Button onClick={open}>
          <Plus className="mr-2 h-4 w-4" />
          {t("actions.new")}
        </Button>
      </div>

      <div className="grid gap-3 md:grid-cols-4">
        <input
          placeholder={t("filters.searchPlaceholder")}
          className="rounded-lg border border-gray-200 p-2 text-sm dark:border-gray-700 dark:bg-gray-900"
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, search: e.target.value }))
          }
        />
        <select
          className="rounded-lg border border-gray-200 p-2 text-sm dark:border-gray-700 dark:bg-gray-900"
          onChange={(e) =>
            setFilters((prev) => ({
              ...prev,
              priority: e.target.value || undefined,
            }))
          }
        >
          <option value="">{t("filters.priority.all")}</option>
          <option value="high">{t("filters.priority.high")}</option>
          <option value="medium">{t("filters.priority.medium")}</option>
          <option value="low">{t("filters.priority.low")}</option>
          <option value="urgent">{t("filters.priority.urgent")}</option>
        </select>
        <select
          className="rounded-lg border border-gray-200 p-2 text-sm dark:border-gray-700 dark:bg-gray-900"
          onChange={(e) => {
            const value = e.target.value as WorkOrderStatus | "";
            setFilters((prev) => ({
              ...prev,
              status: value === "" ? "all" : value,
            }));
          }}
        >
          <option value="">{t("filters.status.all")}</option>
          <option value="pending">{t("filters.status.pending")}</option>
          <option value="in_progress">{t("filters.status.inProgress")}</option>
          <option value="completed">{t("filters.status.completed")}</option>
          <option value="cancelled">{t("filters.status.cancelled")}</option>
        </select>

        <Popover open={isVehiclePopoverOpen} onOpenChange={setIsVehiclePopoverOpen} modal={false}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              className="justify-between h-auto min-h-[40px] border-gray-200 dark:border-gray-700 dark:bg-gray-900 font-normal text-sm"
            >
              <div className="flex flex-wrap gap-1 items-center">
                <Car className="h-4 w-4 mr-1 text-muted-foreground" />
                {selectedVehicleIds.length > 0 ? (
                  <div className="flex flex-wrap gap-1">
                    {selectedVehicleIds.length <= 2 ? (
                      selectedVehicleIds.map((id) => {
                        const vehicle = vehiclesData?.data.find((v) => v.id === id);
                        return (
                          <Badge key={id} variant="secondary" className="text-[10px] px-1 h-5">
                            {vehicle ? vehicle.plate_number : id}
                          </Badge>
                        );
                      })
                    ) : (
                      <Badge variant="secondary" className="text-[10px] px-1 h-5">
                        {selectedVehicleIds.length} {vt("title")}
                      </Badge>
                    )}
                  </div>
                ) : (
                  <span className="text-muted-foreground">{vt("filters.type.all")}</span>
                )}
              </div>
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[300px] p-0 " >
            <Command>
              <CommandInput placeholder={t("filters.searchPlaceholder")} />
              <CommandList>
                <CommandEmpty>
                  {isLoadingVehicles ? (
                    <div className="p-4 text-center">
                      <LoadingSpinner size="sm" />
                      <p className="text-[10px] text-muted-foreground mt-1 text-center">Loading vehicles...</p>
                    </div>
                  ) : isErrorVehicles ? (
                    <div className="p-4 text-center text-sm text-red-500">
                      Failed to load vehicles
                    </div>
                  ) : (
                    vt("empty.title")
                  )}
                </CommandEmpty>
                {!isLoadingVehicles && !isErrorVehicles && (
                  <CommandGroup>
                    {vehiclesWithWorkOrders.map((vehicle) => (
                      <CommandItem
                        key={vehicle.id}
                        value={vehicle.id}
                        keywords={[vehicle.plate_number, vehicle.brand, vehicle.model]}
                        className="cursor-pointer data-[disabled]:pointer-events-auto data-[disabled]:opacity-100"
                        onSelect={() => {
                          const current = filters.vehicleIds || [];
                          const isSelected = current.includes(vehicle.id);
                          const next = isSelected
                            ? current.filter((id) => id !== vehicle.id)
                            : [...current, vehicle.id];

                          setFilters((prev) => ({
                            ...prev,
                            vehicleIds: next,
                          }));
                        }}
                      >
                        <Checkbox
                          checked={selectedVehicleIds.includes(vehicle.id)}
                          className="mr-2 pointer-events-none"
                        />
                        <div className="flex flex-col">
                          <span className="font-medium">{vehicle.plate_number}</span>
                          <span className="text-xs text-muted-foreground font-normal">
                            {vehicle.brand} {vehicle.model}
                          </span>
                        </div>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                )}
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>

      <div className="flex-1 overflow-hidden">
        <WorkOrderKanban filters={filters} />
      </div>

      <Modal
        isOpen={isOpen}
        onClose={close}
        title={t("actions.new")}
        preventClose={preventClose}
        onAttemptClose={handleAttemptClose}
      >
        <WorkOrderForm
          onSuccess={handleSuccess}
          onCancel={handleAttemptClose}
          onDirtyChange={setIsFormDirty}
        />
      </Modal>
    </div>
  );
}
