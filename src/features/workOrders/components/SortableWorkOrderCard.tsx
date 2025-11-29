"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { WorkOrderCard } from "./WorkOrderCard";
import { WorkOrder } from "../types/workOrder.types";

interface SortableWorkOrderCardProps {
  workOrder: WorkOrder;
  onEdit?: (workOrder: WorkOrder) => void;
  onDelete?: (workOrder: WorkOrder) => void;
  onClick?: () => void;
}

export function SortableWorkOrderCard({
  workOrder,
  onEdit,
  onDelete,
  onClick,
}: SortableWorkOrderCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: workOrder.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: transition || "transform 200ms cubic-bezier(0.18, 0.67, 0.6, 1.22)",
    opacity: isDragging ? 0.3 : 1,
    cursor: isDragging ? "grabbing" : "grab",
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`${
        isDragging
          ? "scale-105 shadow-2xl ring-2 ring-blue-400 ring-offset-2 dark:ring-blue-500 dark:ring-offset-gray-900 z-50"
          : "hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]"
      } transition-all duration-200 ease-out`}
    >
      <WorkOrderCard 
        workOrder={workOrder} 
        onEdit={onEdit} 
        onDelete={onDelete} 
        onClick={onClick}
      />
    </div>
  );
}
