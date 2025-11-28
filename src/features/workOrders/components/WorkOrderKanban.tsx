"use client";

import { WorkOrderStatus } from "../types/workOrder.types";
import { WorkOrderCard } from "./WorkOrderCard";
import { useWorkOrders } from "../hooks/useWorkOrders";

const columns: { id: WorkOrderStatus; title: string }[] = [
  { id: "pending", title: "To Do" },
  { id: "in_progress", title: "In Progress" },
  { id: "completed", title: "Completed" },
];

export interface WorkOrderFilters {
  search?: string;
  status?: WorkOrderStatus | "all";
  priority?: string;
  assignee?: string;
}

export function WorkOrderKanban({ filters }: { filters?: WorkOrderFilters }) {
  const { data: workOrders, isLoading } = useWorkOrders();

  if (isLoading) {
    return <div>Loading work orders...</div>;
  }

  if (!workOrders) {
    return <div>No work orders found</div>;
  }

  return (
    <div className="flex h-full gap-6 overflow-x-auto pb-4">
      {columns.map((column) => {
        const columnOrders = workOrders.data.filter((order) => {
          const matchesStatus =
            (filters?.status ?? "all") === "all" || order.status === filters?.status;
          const matchesPriority = !filters?.priority || order.priority === filters.priority;
          const matchesAssignee = !filters?.assignee || order.assignedTo === filters.assignee;
          const matchesSearch =
            !filters?.search ||
            order.title.toLowerCase().includes(filters.search.toLowerCase()) ||
            order.id.toLowerCase().includes(filters.search.toLowerCase());

          return order.status === column.id && matchesStatus && matchesPriority && matchesAssignee && matchesSearch;
        });

        return (
          <div key={column.id} className="flex h-full min-w-[300px] flex-col rounded-lg bg-gray-50 p-4 dark:bg-gray-800/50">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                {column.title}
              </h3>
              <span className="rounded-full bg-gray-200 px-2 py-0.5 text-xs font-medium text-gray-600 dark:bg-gray-700 dark:text-gray-300">
                {columnOrders.length}
              </span>
            </div>

            <div className="flex flex-1 flex-col gap-3 overflow-y-auto">
              {columnOrders.map((order) => (
                <WorkOrderCard key={order.id} workOrder={order} />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
