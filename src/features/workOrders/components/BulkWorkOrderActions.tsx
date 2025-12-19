"use client";

import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Trash2, CheckCircle, PlayCircle } from "lucide-react";

interface BulkWorkOrderActionsProps {
  selectedCount: number;
  onClearSelection: () => void;
  onDelete: () => void;
  onStatusChange: (status: string) => void;
}

export function BulkWorkOrderActions({
  selectedCount,
  onClearSelection,
  onDelete,
  onStatusChange,
}: BulkWorkOrderActionsProps) {
  const t = useTranslations("workOrders");
  if (selectedCount === 0) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 rounded-lg bg-gray-900 p-2 text-white shadow-lg animate-in slide-in-from-bottom-4 dark:bg-gray-100 dark:text-gray-900">
      <div className="flex items-center gap-2 px-2 border-r border-gray-700 dark:border-gray-300">
        <div className="flex h-5 w-5 items-center justify-center rounded bg-blue-600 text-xs font-bold">
          {selectedCount}
        </div>
        <span className="text-sm font-medium">{t("bulk.selected")}</span>
      </div>

      <div className="flex items-center gap-1">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 text-white hover:bg-gray-800 hover:text-white dark:text-gray-900 dark:hover:bg-gray-200">
              {t("bulk.changeStatus")}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuLabel>{t("bulk.setStatusTo")}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onStatusChange("pending")}>
              {t("status.pending")}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onStatusChange("in_progress")}>
              <PlayCircle className="mr-2 h-4 w-4" />
              {t("status.in_progress")}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onStatusChange("completed")}>
              <CheckCircle className="mr-2 h-4 w-4" />
              {t("status.completed")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button 
          variant="ghost" 
          size="sm" 
          className="h-8 text-red-400 hover:bg-gray-800 hover:text-red-300 dark:text-red-600 dark:hover:bg-gray-200"
          onClick={onDelete}
        >
          <Trash2 className="mr-2 h-4 w-4" />
          {t("card.actions.delete")}
        </Button>

        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8 text-gray-400 hover:bg-gray-800 hover:text-white dark:text-gray-500 dark:hover:bg-gray-200"
          onClick={onClearSelection}
        >
          <span className="sr-only">{t("form.actions.cancel")}</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4"
          >
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
          </svg>
        </Button>
      </div>
    </div>
  );
}
