"use client";

import { useState } from "react";
import { WorkOrderKanban, WorkOrderFilters } from "@/features/workOrders/components/WorkOrderKanban";
import { WorkOrderForm } from "@/features/workOrders/components/WorkOrderForm";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { useModal } from "@/hooks/useModal";
import { Plus } from "lucide-react";
import { WorkOrderStatus } from "@/features/workOrders/types/workOrder.types";

export default function WorkOrdersPage() {
  const { isOpen, open, close } = useModal();
  const [filters, setFilters] = useState<WorkOrderFilters>({});

  return (
    <div className="flex h-full flex-col space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Work Orders</h1>
        <Button onClick={open}>
          <Plus className="mr-2 h-4 w-4" />
          New Work Order
        </Button>
      </div>

      <div className="grid gap-3 md:grid-cols-4">
        <input
          placeholder="Search by ID or title"
          className="rounded-lg border border-gray-200 p-2 text-sm dark:border-gray-700 dark:bg-gray-900"
          onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))}
        />
        <select
          className="rounded-lg border border-gray-200 p-2 text-sm dark:border-gray-700 dark:bg-gray-900"
          onChange={(e) => setFilters((prev) => ({ ...prev, priority: e.target.value || undefined }))}
        >
          <option value="">All priorities</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
        <select
          className="rounded-lg border border-gray-200 p-2 text-sm dark:border-gray-700 dark:bg-gray-900"
          onChange={(e) => {
            const value = e.target.value as WorkOrderStatus | "";
            setFilters((prev) => ({ ...prev, status: value === "" ? "all" : value }));
          }}
        >
          <option value="">All status</option>
          <option value="pending">Pending</option>
          <option value="in_progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      <div className="flex-1 overflow-hidden">
        <WorkOrderKanban filters={filters} />
      </div>

      <Modal
        isOpen={isOpen}
        onClose={close}
        title="Create Work Order"
      >
        <WorkOrderForm
          onSuccess={close}
          onCancel={close}
        />
      </Modal>
    </div>
  );
}
