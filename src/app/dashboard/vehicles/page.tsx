"use client";

import { useMemo, useState } from "react";
import { VehicleTable } from "@/features/vehicles/components/VehicleTable";
import { VehicleForm } from "@/features/vehicles/components/VehicleForm";
import { useVehicles } from "@/features/vehicles/hooks/useVehicles";
import { Vehicle } from "@/features/vehicles/types/vehicle.types";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { useModal } from "@/hooks/useModal";
import { Plus } from "lucide-react";

export default function VehiclesPage() {
  const { data, isLoading } = useVehicles();
  const { isOpen, open, close } = useModal();
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [search, setSearch] = useState("");

  const handleEdit = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    open();
  };

  const handleCreate = () => {
    setSelectedVehicle(null);
    open();
  };

  const handleSuccess = () => {
    close();
    // Refetch handled by React Query invalidation
  };

  const filteredVehicles = useMemo(() => {
    const vehicles = data?.data || [];

    return vehicles.filter((vehicle) => {
      const matchesStatus = statusFilter === "all" || vehicle.status === statusFilter;
      const matchesType = typeFilter === "all" || vehicle.type === typeFilter;
      const matchesSearch =
        !search ||
        vehicle.name.toLowerCase().includes(search.toLowerCase()) ||
        vehicle.licensePlate?.toLowerCase().includes(search.toLowerCase());

      return matchesStatus && matchesType && matchesSearch;
    });
  }, [data?.data, search, statusFilter, typeFilter]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Vehicles</h1>
        <Button onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Add Vehicle
        </Button>
      </div>

      <div className="grid gap-3 md:grid-cols-4">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or plate"
          className="rounded-lg border border-gray-200 p-2 text-sm dark:border-gray-700 dark:bg-gray-900"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-lg border border-gray-200 p-2 text-sm dark:border-gray-700 dark:bg-gray-900"
        >
          <option value="all">All status</option>
          <option value="active">Active</option>
          <option value="maintenance">Maintenance</option>
          <option value="retired">Retired</option>
        </select>
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="rounded-lg border border-gray-200 p-2 text-sm dark:border-gray-700 dark:bg-gray-900"
        >
          <option value="all">All types</option>
          <option value="truck">Truck</option>
          <option value="van">Van</option>
          <option value="car">Car</option>
        </select>
      </div>

      <VehicleTable
        vehicles={filteredVehicles}
        isLoading={isLoading}
        onEdit={handleEdit}
        onDelete={(id) => console.log("Delete", id)}
      />

      <Modal
        isOpen={isOpen}
        onClose={close}
        title={selectedVehicle ? "Edit Vehicle" : "Add New Vehicle"}
      >
        <VehicleForm
          initialData={selectedVehicle || undefined}
          onSuccess={handleSuccess}
          onCancel={close}
        />
      </Modal>
    </div>
  );
}
