"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ClipboardCheck } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";

interface WorkOrder {
  id: string;
  title: string;
  status: "pending" | "in_progress" | "completed" | "cancelled";
  priority: "low" | "medium" | "high" | "critical";
  scheduledDate?: string;
}

interface VehicleWorkOrdersProps {
  workOrders?: WorkOrder[];
}

const statusVariant = {
  pending: "warning" as const,
  in_progress: "info" as const,
  completed: "success" as const,
  cancelled: "outline" as const,
};

const priorityVariant = {
  low: "info" as const,
  medium: "warning" as const,
  high: "warning" as const,
  critical: "destructive" as const,
};

export function VehicleWorkOrders({
  workOrders = [],
}: VehicleWorkOrdersProps) {
  const t = useTranslations("features.vehicles.workOrders");

  const mockWorkOrders: WorkOrder[] = workOrders.length > 0 ? workOrders : [
    {
      id: "WO-124",
      title: "Brake pads replacement",
      status: "in_progress",
      priority: "high",
      scheduledDate: "2024-11-30",
    },
    {
      id: "WO-101",
      title: "Annual inspection",
      status: "completed",
      priority: "medium",
      scheduledDate: "2024-11-15",
    },
    {
      id: "WO-098",
      title: "Oil change service",
      status: "completed",
      priority: "low",
      scheduledDate: "2024-10-20",
    },
  ];

  if (mockWorkOrders.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <ClipboardCheck className="h-12 w-12 text-gray-400 dark:text-gray-600" />
          <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
            {t("noWorkOrders")}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-500 dark:text-gray-400">
        {t("subtitle")}
      </p>

      <div className="grid gap-3">
        {mockWorkOrders.map((wo) => (
          <Link key={wo.id} href={`/dashboard/work-orders/${wo.id}`}>
            <Card className="transition-shadow hover:shadow-md cursor-pointer">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                        {wo.title}
                      </h4>
                      <Badge variant={priorityVariant[wo.priority]}>
                        {wo.priority}
                      </Badge>
                    </div>
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      {wo.id}
                      {wo.scheduledDate && ` • ${t("scheduled")}: ${wo.scheduledDate}`}
                    </p>
                  </div>
                  <Badge variant={statusVariant[wo.status]}>
                    {wo.status.replace("_", " ")}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
