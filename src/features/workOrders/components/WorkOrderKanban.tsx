"use client";

import { WorkOrderStatus } from "../types/workOrder.types";
import { useWorkOrders } from "../hooks/useWorkOrders";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from "@dnd-kit/sortable";
 
import { useState } from "react";
import { SortableWorkOrderCard } from "./SortableWorkOrderCard";
import { EditWorkOrderModal } from "./EditWorkOrderModal";
import { BulkWorkOrderActions } from "./BulkWorkOrderActions";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { WorkOrder } from "../types/workOrder.types";
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
  const [localWorkOrders, setLocalWorkOrders] = useState(workOrders?.data || []);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState<WorkOrder | undefined>(undefined);
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);

  // Update local state when data changes
  if (workOrders?.data && localWorkOrders.length === 0 && workOrders.data.length > 0) {
    setLocalWorkOrders(workOrders.data);
  }

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    // Find the order that was dragged
    const draggedOrder = localWorkOrders.find((order) => order.id === activeId);
    if (!draggedOrder) return;

    // Determine the new status based on the container it was dropped in
    const newStatus = overId.startsWith("column-")
      ? (overId.replace("column-", "") as WorkOrderStatus)
      : localWorkOrders.find((order) => order.id === overId)?.status;

    if (!newStatus) return;

    // Update the order's status
    if (draggedOrder.status !== newStatus) {
      setLocalWorkOrders((orders) =>
        orders.map((order) =>
          order.id === activeId ? { ...order, status: newStatus } : order
        )
      );
      
      // TODO: API call to update status
      console.log(`Updated work order ${activeId} status to ${newStatus}`);
    }
  };

  const handleEdit = (order: WorkOrder) => {
    setEditingOrder(order);
    setIsEditModalOpen(true);
  };

  const handleCreate = () => {
    setEditingOrder(undefined);
    setIsEditModalOpen(true);
  };

  const handleSave = (data: Partial<WorkOrder>) => {
    if (editingOrder) {
      // Update existing
      setLocalWorkOrders(prev => prev.map(o => o.id === editingOrder.id ? { ...o, ...data } : o));
    } else {
      // Create new
      const newOrder: WorkOrder = {
        id: Math.random().toString(36).substr(2, 9),
        title: data.title || "",
        description: data.description || "",
        status: data.status || "pending",
        priority: data.priority || "medium",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        assigned_to: data.assigned_to,
        vehicle_id: "vehicle-1", // Mock
        ...data
      } as WorkOrder;
      setLocalWorkOrders(prev => [...prev, newOrder]);
    }
    setIsEditModalOpen(false);
  };

  const toggleSelection = (id: string) => {
    setSelectedOrders(prev => 
      prev.includes(id) ? prev.filter(oId => oId !== id) : [...prev, id]
    );
  };

  const handleBulkDelete = () => {
    if (confirm(`Delete ${selectedOrders.length} orders?`)) {
      setLocalWorkOrders(prev => prev.filter(o => !selectedOrders.includes(o.id)));
      setSelectedOrders([]);
    }
  };

  const handleBulkStatusChange = (status: string) => {
    setLocalWorkOrders(prev => prev.map(o => 
      selectedOrders.includes(o.id) ? { ...o, status: status as WorkOrderStatus } : o
    ));
    setSelectedOrders([]);
  };

  if (isLoading) {
    return <div>Loading work orders...</div>;
  }

  if (!localWorkOrders || localWorkOrders.length === 0) {
    return <div>No work orders found</div>;
  }

  return (
    <>
      <div className="mb-4 flex justify-end">
        <Button onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" />
          New Work Order
        </Button>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <div className="flex h-full gap-6 overflow-x-auto pb-4">
          {columns.map((column) => {
            const columnOrders = localWorkOrders.filter((order) => {
              const matchesStatus =
                (filters?.status ?? "all") === "all" || order.status === filters?.status;
              const matchesPriority = !filters?.priority || order.priority === filters.priority;
              const matchesAssignee = !filters?.assignee || order.assigned_to === filters.assignee;
              const matchesSearch =
                !filters?.search ||
                order.title.toLowerCase().includes(filters.search.toLowerCase()) ||
                order.id.toLowerCase().includes(filters.search.toLowerCase());

              return order.status === column.id && matchesStatus && matchesPriority && matchesAssignee && matchesSearch;
            });

            const orderIds = columnOrders.map((order) => order.id);

            return (
              <div
                key={column.id}
                className="flex h-full min-w-[300px] flex-col rounded-lg bg-gray-50 p-4 dark:bg-gray-800/50"
              >
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                    {column.title}
                  </h3>
                  <span className="rounded-full bg-gray-200 px-2 py-0.5 text-xs font-medium text-gray-600 dark:bg-gray-700 dark:text-gray-300">
                    {columnOrders.length}
                  </span>
                </div>

                <SortableContext items={orderIds} strategy={verticalListSortingStrategy}>
                  <div 
                    id={`column-${column.id}`}
                    className="flex flex-1 flex-col gap-3 overflow-y-auto"
                  >
                    {columnOrders.map((order) => (
                      <div key={order.id} className="relative group">
                        <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                          <input 
                            type="checkbox"
                            checked={selectedOrders.includes(order.id)}
                            onChange={() => toggleSelection(order.id)}
                            className="h-4 w-4 rounded border-gray-300"
                          />
                        </div>
                        <div onClick={(e) => {
                          if (e.ctrlKey || e.metaKey) {
                            toggleSelection(order.id);
                            e.preventDefault();
                          } else {
                            handleEdit(order);
                          }
                        }}>
                          <SortableWorkOrderCard workOrder={order} />
                        </div>
                      </div>
                    ))}
                  </div>
                </SortableContext>
              </div>
            );
          })}
        </div>
      </DndContext>

      <EditWorkOrderModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        workOrder={editingOrder}
        onSave={handleSave}
      />

      <BulkWorkOrderActions
        selectedCount={selectedOrders.length}
        onClearSelection={() => setSelectedOrders([])}
        onDelete={handleBulkDelete}
        onStatusChange={handleBulkStatusChange}
      />
    </>
  );
}
