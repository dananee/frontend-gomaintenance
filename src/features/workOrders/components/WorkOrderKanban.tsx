import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useDeleteWorkOrder, useUpdateWorkOrder } from "../hooks/useWorkOrders";
import { useWorkOrdersBoard } from "../hooks/useWorkOrdersBoard";
import { useWorkOrdersBoardStore } from "../store/useWorkOrdersBoardStore";
import { updateWorkOrderStatus } from "../api/updateWorkOrderStatus";
import {
  DndContext,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  DragOverEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import { useState, useMemo } from "react";
import { SortableWorkOrderCard } from "./SortableWorkOrderCard";
import { WorkOrderCard } from "./WorkOrderCard";
import { DroppableColumn } from "./DroppableColumn";
import { EditWorkOrderModal } from "./EditWorkOrderModal";
import { BulkWorkOrderActions } from "./BulkWorkOrderActions";
import { WorkOrder, WorkOrderStatus } from "../types/workOrder.types";
import { EmptyState } from "@/components/ui/empty-state";
import { ClipboardList } from "lucide-react";
import { toast } from "sonner";


export interface WorkOrderFilters {
  search?: string;
  status?: WorkOrderStatus | "all";
  priority?: string;
  assignee?: string;
}

export function WorkOrderKanban({ filters }: { filters?: WorkOrderFilters }) {
  const t = useTranslations("workOrders");
  const router = useRouter();

  const columnDefinitions = useMemo(() => [
    { id: "pending" as WorkOrderStatus, title: t("status.pending"), color: "orange" },
    { id: "in_progress" as WorkOrderStatus, title: t("status.in_progress"), color: "blue" },
    { id: "completed" as WorkOrderStatus, title: t("status.completed"), color: "green" },
    { id: "cancelled" as WorkOrderStatus, title: t("status.cancelled"), color: "red" },
  ], [t]);
  const { isLoading } = useWorkOrdersBoard("default");

  // Get state from Zustand store
  const workOrdersById = useWorkOrdersBoardStore((state) => state.workOrdersById);
  const boardColumns = useWorkOrdersBoardStore((state) => state.columns);
  const optimisticMove = useWorkOrdersBoardStore((state) => state.optimisticMove);
  const rollbackMove = useWorkOrdersBoardStore((state) => state.rollbackMove);
  const calculatePosition = useWorkOrdersBoardStore((state) => state.calculatePosition);

  const updateWorkOrder = useUpdateWorkOrder();
  const deleteWorkOrderMutation = useDeleteWorkOrder();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState<WorkOrder | undefined>(
    undefined
  );
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [overId, setOverId] = useState<string | null>(null);

  const allWorkOrders = useMemo(() => Object.values(workOrdersById), [workOrdersById]);

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

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { over } = event;
    setOverId(over ? (over.id as string) : null);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) {
      setActiveId(null);
      setOverId(null);
      return;
    }

    const activeId = active.id as string;
    const overId = over.id as string;

    // Find the order that was dragged
    const draggedOrder = workOrdersById[activeId];
    if (!draggedOrder) {
      setActiveId(null);
      setOverId(null);
      return;
    }

    // Determine the new status based on the container it was dropped in
    let newStatus: WorkOrderStatus;
    let dropIndex = 0;

    if (overId.startsWith("column-")) {
      newStatus = overId.replace("column-", "") as WorkOrderStatus;
      dropIndex = boardColumns[newStatus].length;
    } else {
      const overOrder = workOrdersById[overId];
      if (!overOrder) {
        setActiveId(null);
        setOverId(null);
        return;
      }
      newStatus = overOrder.status;
      dropIndex = boardColumns[newStatus].indexOf(overId);
    }

    if (draggedOrder.status === newStatus) {
      setActiveId(null);
      setOverId(null);
      return;
    }

    // Calculate position for the new location
    const position = calculatePosition(boardColumns[newStatus], dropIndex);
    const clientRequestId = crypto.randomUUID();

    // Optimistic update
    optimisticMove({
      id: activeId,
      toStatus: newStatus,
      position,
      clientRequestId,
    });

    // Reset drag state
    setActiveId(null);
    setOverId(null);

    // Perform API call in background
    try {
      await updateWorkOrderStatus(activeId, {
        status: newStatus,
        position,
        boardId: "default",
        clientRequestId,
      });
      toast.success(t("toasts.statusUpdated.title"), {
        description: t("toasts.statusUpdated.description", {
          status: t(`status.${newStatus}`),
        }),
      });
    } catch (error: any) {
      // Rollback on error
      rollbackMove(activeId);

      if (error?.response?.status === 409) {
        toast.error(t("toasts.conflict.title"), {
          description: t("toasts.conflict.description"),
        });
      } else {
        toast.error(t("toasts.updateError.title"), {
          description: t("toasts.updateError.description"),
        });
      }
      console.error("Failed to update work order status:", error);
    }
  };

  const handleDragCancel = () => {
    setActiveId(null);
    setOverId(null);
  };

  const handleEdit = (order: WorkOrder) => {
    setEditingOrder(order);
    setIsEditModalOpen(true);
  };

  const handleSave = (data: Partial<WorkOrder>) => {
    if (editingOrder) {
      // Update existing using mutation
      updateWorkOrder.mutate(
        {
          id: editingOrder.id,
          ...data,
        },
        {
          onSuccess: () => {
            toast.success(t("toasts.saveSuccess.title"), {
              description: t("toasts.saveSuccess.description"),
            });
            setIsEditModalOpen(false);
          },
          onError: () => {
            toast.error(t("toasts.saveError.title"), {
              description: t("toasts.saveError.description"),
            });
          },
        }
      );
    } else {
      // Create new - would need a create mutation
      toast.info("Create functionality not yet implemented");
      setIsEditModalOpen(false);
    }
  };

  const handleCardClick = (id: string) => {
    router.push(`/dashboard/work-orders/${id}`);
  };

  const toggleSelection = (id: string) => {
    setSelectedOrders((prev) =>
      prev.includes(id) ? prev.filter((oId) => oId !== id) : [...prev, id]
    );
  };

  const handleBulkDelete = () => {
    if (confirm(`Delete ${selectedOrders.length} orders?`)) {
      // TODO: Implement bulk delete mutation
      toast.info("Bulk delete not yet implemented");
      setSelectedOrders([]);
    }
  };

  const handleBulkStatusChange = (status: string) => {
    // TODO: Implement bulk status change mutation
    toast.info("Bulk status change not yet implemented");
    setSelectedOrders([]);
  };

  const handleDelete = (order: WorkOrder) => {
    if (confirm(t("toasts.deleteConfirm"))) {
      deleteWorkOrderMutation.mutate(order.id, {
        onSuccess: () => {
          toast.success(t("toasts.deleteSuccess.title"), {
            description: t("toasts.deleteSuccess.description"),
          });
        },
        onError: (error) => {
          toast.error(t("toasts.deleteError.title"), {
            description: t("toasts.deleteError.description"),
          });
          console.error("Failed to delete work order:", error);
        },
      });
    }
  };

  const activeWorkOrder = activeId
    ? allWorkOrders.find((order) => order.id === activeId)
    : null;

  if (isLoading) {
    return <div>Loading work orders...</div>;
  }

  if (!allWorkOrders || allWorkOrders.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 dark:border-gray-700">
        <EmptyState
          icon={ClipboardList}
          title={t("kanban.empty.title")}
          description={t("kanban.empty.description")}
        />
      </div>
    );
  }

  return (
    <>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
      >
        <div className="flex h-full gap-6 overflow-x-auto pb-4 px-2">
          {columnDefinitions.map((column) => {
            const columnOrderIds = boardColumns[column.id] || [];
            const columnOrders = columnOrderIds
              .map((id: string) => workOrdersById[id])
              .filter(Boolean)
              .filter((order: WorkOrder) => {
                const matchesStatus =
                  (filters?.status ?? "all") === "all" ||
                  order.status === filters?.status;
                const matchesPriority =
                  !filters?.priority || order.priority === filters.priority;
                const matchesAssignee =
                  !filters?.assignee || order.assigned_to === filters.assignee;
                const matchesSearch =
                  !filters?.search ||
                  order.title
                    .toLowerCase()
                    .includes(filters.search.toLowerCase()) ||
                  order.id.toLowerCase().includes(filters.search.toLowerCase());

                return (
                  matchesStatus &&
                  matchesPriority &&
                  matchesAssignee &&
                  matchesSearch
                );
              });

            const orderIds = columnOrders.map((order: WorkOrder) => order.id);
            const isOver =
              overId === `column-${column.id}` ||
              columnOrders.some((order: WorkOrder) => order.id === overId);

            return (
              <DroppableColumn
                key={column.id}
                id={`column-${column.id}`}
                status={column.id}
                title={column.title}
                count={columnOrders.length}
                isOver={isOver}
                color={column.color}
              >

                <SortableContext
                  items={orderIds}
                  strategy={verticalListSortingStrategy}
                >
                  <div
                    id={`column-${column.id}`}
                    className={`flex flex-1 flex-col gap-3 overflow-y-auto rounded-lg p-2 transition-all duration-300 ${isOver && columnOrders.length === 0
                      ? "border-2 border-dashed border-blue-400 bg-blue-50/50 dark:bg-blue-900/10 animate-pulse"
                      : ""
                      }`}
                    style={{ minHeight: "200px" }}
                  >
                    {columnOrders.length === 0 && isOver ? (
                      <div className="flex flex-col items-center justify-center py-12 px-4 rounded-lg border-2 border-dashed border-blue-400 bg-blue-50/50 dark:border-blue-600 dark:bg-blue-900/20 animate-in fade-in-50 duration-200">
                        <ClipboardList className="h-10 w-10 text-blue-500 dark:text-blue-400 mb-2" />
                        <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
                          {t("kanban.column.dropHere")}
                        </p>
                      </div>
                    ) : columnOrders.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-12 px-4">
                        <ClipboardList className="h-12 w-12 text-slate-400 dark:text-slate-600 mb-3" />
                        <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                          {t("kanban.column.noTasks")}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">
                          {t("kanban.column.dragHere")}
                        </p>
                      </div>
                    ) : (
                      columnOrders.map((order: WorkOrder, index: number) => {
                        const isActiveCard = order.id === activeId;
                        const isOverCard = order.id === overId;

                        return (
                          <div key={order.id} className="relative">
                            {isOverCard && !isActiveCard && (
                              <div className="absolute -top-1 left-0 right-0 h-1 rounded-full bg-gradient-to-r from-blue-400 via-blue-500 to-blue-400 shadow-lg shadow-blue-500/50 animate-in slide-in-from-top-2 duration-200" />
                            )}
                            <SortableWorkOrderCard
                              workOrder={order}
                              onEdit={handleEdit}
                              onDelete={handleDelete}
                              onClick={() => handleCardClick(order.id)}
                            />
                            {isOverCard &&
                              !isActiveCard &&
                              index === columnOrders.length - 1 && (
                                <div className="absolute -bottom-1 left-0 right-0 h-1 rounded-full bg-gradient-to-r from-blue-400 via-blue-500 to-blue-400 shadow-lg shadow-blue-500/50 animate-in slide-in-from-bottom-2 duration-200" />
                              )}
                          </div>
                        );
                      })
                    )}
                  </div>
                </SortableContext>
              </DroppableColumn>
            );
          })}
        </div>

        <DragOverlay dropAnimation={{
          duration: 200,
          easing: 'cubic-bezier(0.18, 0.67, 0.6, 1.22)',
        }}>
          {activeWorkOrder ? (
            <div className="rotate-6 scale-105 cursor-grabbing shadow-2xl shadow-black/40 dark:shadow-black/60 animate-in zoom-in-95 duration-200">
              <WorkOrderCard workOrder={activeWorkOrder} />
            </div>
          ) : null}
        </DragOverlay>
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
