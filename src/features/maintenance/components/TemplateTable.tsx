import { MaintenanceTemplate } from "../types/maintenanceTemplate.types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit2, Trash2, Clock, Calendar, Gauge, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { useTranslations } from "next-intl";

interface TemplateTableProps {
  templates: MaintenanceTemplate[];
  isLoading: boolean;
  onEdit: (template: MaintenanceTemplate) => void;
  onDelete: (id: string) => void;
}

export function TemplateTable({
  templates,
  isLoading,
  onEdit,
  onDelete,
}: TemplateTableProps) {
  const t = useTranslations("features.maintenance.templatesList");

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-16 w-full animate-pulse rounded-xl bg-gray-100 dark:bg-gray-800"
          />
        ))}
      </div>
    );
  }

  if (templates.length === 0) {
    return (
      <EmptyState
        icon={FileText}
        title={t("emptyState.title")}
        description={t("emptyState.description")}
      />
    );
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900 overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50/50 hover:bg-gray-50/50 dark:bg-gray-900/50 dark:hover:bg-gray-900/50">
            <TableHead className="font-semibold text-gray-900 dark:text-white">{t("table.name")}</TableHead>
            <TableHead className="font-semibold text-gray-900 dark:text-white">{t("table.description")}</TableHead>
            <TableHead className="font-semibold text-gray-900 dark:text-white">{t("table.intervals")}</TableHead>
            <TableHead className="font-semibold text-gray-900 dark:text-white">{t("table.tasks")}</TableHead>
            <TableHead className="text-right font-semibold text-gray-900 dark:text-white">{t("table.actions")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {templates.map((template) => (
            <TableRow key={template.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors">
              <TableCell className="font-medium text-gray-900 dark:text-white">
                {template.name}
              </TableCell>
              <TableCell className="text-gray-500 max-w-[300px] truncate">
                {template.description || "-"}
              </TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-2">
                  {template.interval_km && (
                    <Badge variant="secondary" className="gap-1 bg-blue-50 text-blue-700 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300">
                      <Gauge className="h-3 w-3" />
                      {template.interval_km.toLocaleString()} {t("table.units.km")}
                    </Badge>
                  )}
                  {template.interval_days && (
                    <Badge variant="secondary" className="gap-1 bg-purple-50 text-purple-700 hover:bg-purple-100 dark:bg-purple-900/30 dark:text-purple-300">
                      <Calendar className="h-3 w-3" />
                      {template.interval_days} {t("table.units.days")}
                    </Badge>
                  )}
                  {template.interval_hours && (
                    <Badge variant="secondary" className="gap-1 bg-orange-50 text-orange-700 hover:bg-orange-100 dark:bg-orange-900/30 dark:text-orange-300">
                      <Clock className="h-3 w-3" />
                      {template.interval_hours} {t("table.units.hours")}
                    </Badge>
                  )}
                  {!template.interval_km && !template.interval_days && !template.interval_hours && (
                    <span className="text-sm text-gray-400 italic">{t("table.noIntervals")}</span>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="outline" className="font-mono">
                  {t("table.tasksCount", { count: template.tasks?.length })}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30"
                    onClick={() => onEdit(template)}
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30"
                    onClick={() => onDelete(template.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
