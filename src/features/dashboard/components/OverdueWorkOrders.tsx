"use client";

import { memo, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle } from "lucide-react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { getWorkOrders } from "@/features/workOrders/api/getWorkOrders";

function OverdueWorkOrdersComponent() {
  const { data, isLoading } = useQuery({
    queryKey: ["work-orders", "overdue"],
    queryFn: () =>
      getWorkOrders({
        page: 1,
        page_size: 10,
      }),
  });

  // Filter for overdue work orders (scheduled_date in the past and status not completed)
  const overdueOrders = useMemo(
    () =>
      data?.data?.filter((order) => {
        if (!order.scheduled_date || order.status === "completed") return false;
        const scheduledDate = new Date(order.scheduled_date);
        const today = new Date();
        return scheduledDate < today;
      }) || [],
    [data]
  );

  const priorityVariant = {
    low: "info" as const,
    medium: "warning" as const,
    high: "warning" as const,
    urgent: "destructive" as const,
  };

  const calculateDaysOverdue = (scheduledDate: string): number => {
    const scheduled = new Date(scheduledDate);
    const today = new Date();
    const diffTime = today.getTime() - scheduled.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
              Overdue Work Orders
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-6">
            Loading...
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
            Overdue Work Orders
          </CardTitle>
          <Badge variant="destructive">{overdueOrders.length}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        {overdueOrders.length === 0 ? (
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-6">
            No overdue work orders
          </p>
        ) : (
          <div className="space-y-3">
            {overdueOrders.slice(0, 5).map((order) => (
              <Link
                key={order.id}
                href={`/dashboard/work-orders/${order.id}`}
                className="block"
              >
                <div className="rounded-lg border border-red-200 bg-red-50 p-3 transition-shadow hover:shadow-md dark:border-red-900/50 dark:bg-red-900/20">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-gray-900 dark:text-gray-100">
                          {order.title}
                        </p>
                        <Badge
                          variant={priorityVariant[order.priority]}
                          className="text-xs"
                        >
                          {order.priority}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {order.vehicle_name || `Vehicle ID: ${order.vehicle_id}`}
                      </p>
                      <p className="text-xs text-red-600 dark:text-red-400 mt-1 font-medium">
                        {calculateDaysOverdue(order.scheduled_date!)} days overdue
                      </p>
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {order.id.substring(0, 8)}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export const OverdueWorkOrders = memo(OverdueWorkOrdersComponent);
