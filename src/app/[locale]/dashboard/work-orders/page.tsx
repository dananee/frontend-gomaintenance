"use client";

import { useState } from "react";
import {
  WorkOrderKanban,
  WorkOrderFilters,
} from "@/features/workOrders/components/WorkOrderKanban";
import { WorkOrderForm } from "@/features/workOrders/components/WorkOrderForm";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { useModal } from "@/hooks/useModal";
import { Plus } from "lucide-react";
import { WorkOrderStatus } from "@/features/workOrders/types/workOrder.types";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

export default function WorkOrdersPage() {
  const t = useTranslations("workOrders");
  const { isOpen, open, close } = useModal();
  const [filters, setFilters] = useState<WorkOrderFilters>({});

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
      </div>

      <div className="flex-1 overflow-hidden">
        <WorkOrderKanban filters={filters} />
      </div>

      <Modal isOpen={isOpen} onClose={close} title={t("actions.new")}>
        <WorkOrderForm onSuccess={handleSuccess} onCancel={close} />
      </Modal>
    </div>
  );
}
