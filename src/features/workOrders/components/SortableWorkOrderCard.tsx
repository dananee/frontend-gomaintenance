"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { WorkOrderCard } from "./WorkOrderCard";
import { WorkOrder } from "../types/workOrder.types";

interface SortableWorkOrderCardProps {
  workOrder: WorkOrder;
}

export function SortableWorkOrderCard({ workOrder }: SortableWorkOrderCardProps) {
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
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
    >
      <WorkOrderCard workOrder={workOrder} />
    </div>
  );
}
