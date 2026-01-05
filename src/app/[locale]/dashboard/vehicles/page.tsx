"use client";

import { useMemo, useState } from "react";
import { VehicleTable } from "@/features/vehicles/components/VehicleTable";
import { VehicleForm } from "@/features/vehicles/components/VehicleForm";
import { useVehicles } from "@/features/vehicles/hooks/useVehicles";
import { useVehicleTypes } from "@/features/vehicles/hooks/useVehicleTypes";
import { Vehicle } from "@/features/vehicles/types/vehicle.types";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { EmptyState } from "@/components/ui/empty-state";
import { Pagination } from "@/components/ui/pagination";
import { useModal } from "@/hooks/useModal";
import { Plus, Truck, FileUp, FileDown } from "lucide-react";
import { toast } from "sonner";
import { useTranslations, useLocale } from "next-intl";
import { useDeleteVehicle } from "@/features/vehicles/hooks/useDeleteVehicle";
import { WorkOrderForm } from "@/features/workOrders/components/WorkOrderForm";
import { CreateMaintenancePlanModal } from "@/features/vehicles/components/CreateMaintenancePlanModal";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { useCreateVehicleMaintenancePlan } from "@/features/vehicles/hooks/useVehiclePlans";
import { CreateMaintenancePlanRequest } from "@/features/vehicles/api/vehiclePlans";
import { VehicleImportWizard } from "@/features/vehicles/components/VehicleImportWizard";
import {
  exportVehicles,
  downloadTemplate,
  downloadFile,
} from "@/features/vehicles/api/import-export";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function VehiclesPage() {
  const t = useTranslations("vehicles");
  const tVehicleTypes = useTranslations("vehicleTypes");
  const { data: vehicleTypes = [] } = useVehicleTypes();
  const locale = useLocale();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [search, setSearch] = useState("");

  const hasFilters = search !== "" || statusFilter !== "all" || typeFilter !== "all";
  const effectivePage = hasFilters ? 1 : currentPage;
  const effectivePageSize = hasFilters ? 1000 : pageSize;

  const { data, isLoading, isFetching } = useVehicles({
    page: effectivePage,
    page_size: effectivePageSize,
    search: search || undefined,
    status: statusFilter === "all" ? undefined : statusFilter,
    type_id: typeFilter === "all" ? undefined : typeFilter,
  });
  const { isOpen, open, close } = useModal();
  const queryClient = useQueryClient();
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);

  // States for new modals
  const [vehicleToDelete, setVehicleToDelete] = useState<string | null>(null);
  const [woVehicle, setWoVehicle] = useState<Vehicle | null>(null);
  const [planVehicle, setPlanVehicle] = useState<Vehicle | null>(null);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  const deleteMutation = useDeleteVehicle();
  const createPlanMutation = useCreateVehicleMaintenancePlan(planVehicle?.id || "");


  const handleEdit = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    open();
  };

  const handleCreate = () => {
    setSelectedVehicle(null);
    open();
  };

  const handleSuccess = () => {
    toast.success(selectedVehicle ? t("toasts.updated.title") : t("toasts.created.title"), {
      description: selectedVehicle
        ? t("toasts.updated.description")
        : t("toasts.created.description"),
    });
    close();
  };

  const handleDelete = (id: string) => {
    setVehicleToDelete(id);
  };

  const confirmDelete = () => {
    if (vehicleToDelete) {
      deleteMutation.mutate(vehicleToDelete, {
        onSuccess: () => {
          toast.success(t("toasts.deleted.title"), {
            description: t("toasts.deleted.description"),
          });
          setVehicleToDelete(null);
        },
        onError: () => {
          toast.error(t("toasts.deleted.errorTitle"), {
            description: t("toasts.deleted.errorDescription"),
          });
        },
      });
    }
  };

  const handleCreateWorkOrder = (vehicle: Vehicle) => {
    setWoVehicle(vehicle);
  };

  const handleCreatePlan = (vehicle: Vehicle) => {
    setPlanVehicle(vehicle);
  };

  const handleExport = async () => {
    try {
      toast.promise(exportVehicles(locale), {
        loading: t("export.downloading"),
        success: (blob) => {
          downloadFile(blob, `vehicles_export_${new Date().toISOString().split("T")[0]}.xlsx`);
          return "Vehicles exported successfully";
        },
        error: "Failed to export vehicles",
      });
    } catch (error) {
      // Error handled by toast promise
    }
  };

  const handleDownloadTemplate = async () => {
    try {
      const blob = await downloadTemplate(locale);
      downloadFile(blob, `vehicle_import_template_${locale}.xlsx`);
    } catch (error) {
      toast.error("Failed to download template");
    }
  };

  const vehicles = data?.data || [];
  const totalPages = data?.total_pages || 1;
  const totalItems = data?.total_items || 0;

  const hasVehicles = totalItems > 0;
  // hasFilters is now defined above

  const uniqueVehicleTypes = useMemo(() => {
    const map = new Map<string, typeof vehicleTypes[0]>();

    vehicleTypes.forEach((type) => {
      const label = tVehicleTypes.has(type.code) ? tVehicleTypes(type.code) : type.name;
      const normalized = label.toLowerCase().trim();

      const existing = map.get(normalized);
      if (!existing) {
        map.set(normalized, type);
      } else {
        // If existing is not Title Case and current is Title Case, prefer current
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

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          {t("title")}
        </h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => setIsImportModalOpen(true)}>
            <FileUp className="mr-2 h-4 w-4" />
            {t("import.import")}
          </Button>
          <Button variant="outline" onClick={handleExport}>
            <FileDown className="mr-2 h-4 w-4" />
            {t("export.button")}
          </Button>
          <Button onClick={handleCreate}>
            <Plus className="mr-2 h-4 w-4" />
            {t("actions.add")}
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <input
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
          placeholder={t("filters.searchPlaceholder")}
          className="rounded-lg border border-gray-200 p-2 text-sm dark:border-gray-700 dark:bg-gray-900"
        />
        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setCurrentPage(1);
          }}
          className="rounded-lg border border-gray-200 p-2 text-sm dark:border-gray-700 dark:bg-gray-900"
        >
          <option value="all">{t("filters.status.all")}</option>
          <option value="active">{t("filters.status.active")}</option>
          <option value="inactive">{t("filters.status.inactive")}</option>
          <option value="maintenance">{t("filters.status.maintenance")}</option>
          <option value="retired">{t("filters.status.retired")}</option>
        </select>
        <select
          value={typeFilter}
          onChange={(e) => {
            setTypeFilter(e.target.value);
            setCurrentPage(1);
          }}
          className="rounded-lg border border-gray-200 p-2 text-sm dark:border-gray-700 dark:bg-gray-900"
        >
          <option value="all">{t("filters.type.all")}</option>
          {uniqueVehicleTypes.map((type) => (
            <option key={type.id} value={type.id}>
              {tVehicleTypes.has(type.code) ? tVehicleTypes(type.code) : type.name}
            </option>
          ))}
        </select>
      </div>

      {!isLoading && !hasVehicles ? (
        <div className="rounded-lg border border-gray-200 dark:border-gray-700">
          <EmptyState
            icon={Truck}
            title={t("empty.title")}
            description={t("empty.description")}
            action={{
              label: t("actions.addFirst"),
              onClick: handleCreate,
            }}
          />
        </div>
      ) : !isLoading && vehicles.length === 0 && hasFilters ? (
        <div className="rounded-lg border border-gray-200 dark:border-gray-700">
          <EmptyState
            icon={Truck}
            title={t("empty.notFoundTitle")}
            description={t("empty.notFoundDescription")}
            action={{
              label: t("actions.clearFilters"),
              onClick: () => {
                setSearch("");
                setStatusFilter("all");
                setTypeFilter("all");
              },
            }}
            secondaryAction={{
              label: t("actions.add"),
              onClick: handleCreate,
            }}
          />
        </div>
      ) : (
        <>
          <VehicleTable
            vehicles={vehicles}
            isLoading={isLoading}
            isRefetching={isFetching}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onCreateWorkOrder={handleCreateWorkOrder}
            onCreatePlan={handleCreatePlan}
          />
          {vehicles.length > 0 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              pageSize={pageSize}
              totalItems={totalItems}
              onPageChange={(page) => setCurrentPage(page)}
              onPageSizeChange={(size) => {
                setPageSize(size);
                setCurrentPage(1);
              }}
            />
          )}
        </>
      )}

      <Modal
        isOpen={isOpen}
        onClose={close}
        title={selectedVehicle ? t("actions.edit") : t("actions.add")}
      >
        <VehicleForm
          initialData={selectedVehicle || undefined}
          onSuccess={handleSuccess}
          onCancel={close}
        />
      </Modal>

      {/* Create Work Order Modal */}
      <Modal
        isOpen={!!woVehicle}
        onClose={() => setWoVehicle(null)}
        title={t("actions.createWorkOrder")}
      >
        <WorkOrderForm
          vehicleId={woVehicle?.id}
          vehicle={woVehicle || undefined}
          onSuccess={() => {
            toast.success(t("toasts.workOrderCreated.title"));
            setWoVehicle(null);
          }}
          onCancel={() => setWoVehicle(null)}
        />
      </Modal>

      {/* Create Plan Modal */}
      {planVehicle && (
        <CreateMaintenancePlanModal
          isOpen={!!planVehicle}
          meterUnit={planVehicle?.meter_unit || "km"}
          onClose={() => setPlanVehicle(null)}
          onSubmit={(data: CreateMaintenancePlanRequest) => {
            createPlanMutation.mutate(data, {
              onSuccess: () => {
                toast.success(t("toasts.planCreated.title"));
                setPlanVehicle(null);
              },
            });
          }}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!vehicleToDelete}
        onClose={() => setVehicleToDelete(null)}
        onConfirm={confirmDelete}
        title={t("confirmDelete.title")}
        description={t("confirmDelete.description")}
        variant="destructive"
      />

      <Modal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        title={t("import.import")}
        size="xl"
      >
        <VehicleImportWizard
          onClose={() => setIsImportModalOpen(false)}
          onSuccess={() => {
            setIsImportModalOpen(false);
            // Query invalidation handles the refresh
          }}
        />
      </Modal>
    </div>
  );
}
