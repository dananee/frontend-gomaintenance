"use client";

import { useDroppable } from "@dnd-kit/core";
import { WorkOrderStatus } from "../types/workOrder.types";

interface DroppableColumnProps {
  id: string;
  status: WorkOrderStatus;
  title: string;
  count: number;
  isOver: boolean;
  color?: string;
  children: React.ReactNode;
}

const columnColorSchemes: Record<string, {
  bg: string;
  border: string;
  hoverBorder: string;
  header: string;
  badge: string;
  highlight: string;
  badgeHighlight: string;
}> = {
  orange: {
    bg: "bg-gradient-to-b from-orange-50 to-orange-100/80 dark:from-orange-950/20 dark:to-orange-900/30",
    border: "border-orange-200 dark:border-orange-800/50",
    hoverBorder: "hover:border-orange-300 dark:hover:border-orange-700",
    header: "border-orange-200 dark:border-orange-800/50",
    badge: "bg-orange-200 text-orange-800 dark:bg-orange-800 dark:text-orange-200",
    highlight: "border-orange-500 bg-gradient-to-b from-orange-50 to-orange-100/80 shadow-xl shadow-orange-500/20 dark:from-orange-900/30 dark:to-orange-900/10 dark:shadow-orange-500/10",
    badgeHighlight: "bg-orange-500 text-white shadow-lg shadow-orange-500/50",
  },
  blue: {
    bg: "bg-gradient-to-b from-blue-50 to-blue-100/80 dark:from-blue-950/20 dark:to-blue-900/30",
    border: "border-blue-200 dark:border-blue-800/50",
    hoverBorder: "hover:border-blue-300 dark:hover:border-blue-700",
    header: "border-blue-200 dark:border-blue-800/50",
    badge: "bg-blue-200 text-blue-800 dark:bg-blue-800 dark:text-blue-200",
    highlight: "border-blue-500 bg-gradient-to-b from-blue-50 to-blue-100/80 shadow-xl shadow-blue-500/20 dark:from-blue-900/30 dark:to-blue-900/10 dark:shadow-blue-500/10",
    badgeHighlight: "bg-blue-500 text-white shadow-lg shadow-blue-500/50",
  },
  yellow: {
    bg: "bg-gradient-to-b from-yellow-50 to-yellow-100/80 dark:from-yellow-950/20 dark:to-yellow-900/30",
    border: "border-yellow-200 dark:border-yellow-800/50",
    hoverBorder: "hover:border-yellow-300 dark:hover:border-yellow-700",
    header: "border-yellow-200 dark:border-yellow-800/50",
    badge: "bg-yellow-200 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-200",
    highlight: "border-yellow-500 bg-gradient-to-b from-yellow-50 to-yellow-100/80 shadow-xl shadow-yellow-500/20 dark:from-yellow-900/30 dark:to-yellow-900/10 dark:shadow-yellow-500/10",
    badgeHighlight: "bg-yellow-500 text-white shadow-lg shadow-yellow-500/50",
  },
  green: {
    bg: "bg-gradient-to-b from-green-50 to-green-100/80 dark:from-green-950/20 dark:to-green-900/30",
    border: "border-green-200 dark:border-green-800/50",
    hoverBorder: "hover:border-green-300 dark:hover:border-green-700",
    header: "border-green-200 dark:border-green-800/50",
    badge: "bg-green-200 text-green-800 dark:bg-green-800 dark:text-green-200",
    highlight: "border-green-500 bg-gradient-to-b from-green-50 to-green-100/80 shadow-xl shadow-green-500/20 dark:from-green-900/30 dark:to-green-900/10 dark:shadow-green-500/10",
    badgeHighlight: "bg-green-500 text-white shadow-lg shadow-green-500/50",
  },
  gray: {
    bg: "bg-gradient-to-b from-slate-50 to-slate-100/80 dark:from-slate-800/40 dark:to-slate-900/60",
    border: "border-slate-200 dark:border-slate-700",
    hoverBorder: "hover:border-slate-300 dark:hover:border-slate-600",
    header: "border-slate-200 dark:border-slate-700",
    badge: "bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300",
    highlight: "border-slate-500 bg-gradient-to-b from-slate-50 to-slate-100/80 shadow-xl shadow-slate-500/20 dark:from-slate-900/30 dark:to-slate-900/10 dark:shadow-slate-500/10",
    badgeHighlight: "bg-slate-500 text-white shadow-lg shadow-slate-500/50",
  },
  red: {
    bg: "bg-gradient-to-b from-red-50 to-red-100/80 dark:from-red-950/20 dark:to-red-900/30",
    border: "border-red-200 dark:border-red-800/50",
    hoverBorder: "hover:border-red-300 dark:hover:border-red-700",
    header: "border-red-200 dark:border-red-800/50",
    badge: "bg-red-200 text-red-800 dark:bg-red-800 dark:text-red-200",
    highlight: "border-red-500 bg-gradient-to-b from-red-50 to-red-100/80 shadow-xl shadow-red-500/20 dark:from-red-900/30 dark:to-red-900/10 dark:shadow-red-500/10",
    badgeHighlight: "bg-red-500 text-white shadow-lg shadow-red-500/50",
  },
};

export function DroppableColumn({
  id,
  status,
  title,
  count,
  isOver,
  color = "gray",
  children,
}: DroppableColumnProps) {
  const { setNodeRef } = useDroppable({
    id: `column-${status}`,
  });

  // Use the color scheme or fallback to gray
  const colorScheme = columnColorSchemes[color] || columnColorSchemes.gray;

  return (
    <div
      ref={setNodeRef}
      className={`flex h-full min-w-[340px] flex-col rounded-xl p-4 transition-all duration-300 ease-out shadow-lg ${
        isOver
          ? `border-2 ${colorScheme.highlight} scale-[1.02]`
          : `border-2 ${colorScheme.border} ${colorScheme.bg} shadow-black/5 dark:shadow-black/20 ${colorScheme.hoverBorder}`
      }`}
    >
      {/* Column Header */}
      <div className={`mb-4 pb-3 border-b ${colorScheme.header}`}>
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200 uppercase tracking-wide">
            {title}
          </h3>
          <span
            className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold transition-all duration-200 ${
              isOver
                ? `${colorScheme.badgeHighlight} scale-110`
                : colorScheme.badge
            }`}
          >
            {count}
          </span>
        </div>
      </div>

      {/* Column Content */}
      {children}
    </div>
  );
}
