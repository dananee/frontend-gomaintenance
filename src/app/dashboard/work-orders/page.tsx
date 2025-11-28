"use client";

import { useState } from "react";
import { WorkOrderKanban } from "@/features/workOrders/components/WorkOrderKanban";
import { WorkOrderForm } from "@/features/workOrders/components/WorkOrderForm";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { useModal } from "@/hooks/useModal";
import { Plus } from "lucide-react";

export default function WorkOrdersPage() {
  const { isOpen, open, close } = useModal();

  return (
    <div className="flex h-full flex-col space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Work Orders</h1>
        <Button onClick={open}>
          <Plus className="mr-2 h-4 w-4" />
          New Work Order
        </Button>
      </div>

      <div className="flex-1 overflow-hidden">
        <WorkOrderKanban />
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
