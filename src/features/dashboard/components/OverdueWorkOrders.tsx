"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle } from "lucide-react";
import Link from "next/link";

interface OverdueWorkOrder {
  id: string;
  title: string;
  vehicle: string;
  dueDate: string;
  daysOverdue: number;
  priority: "low" | "medium" | "high" | "urgent";
}

const priorityVariant = {
  low: "info" as const,
  medium: "warning" as const,
  high: "warning" as const,
  urgent: "destructive" as const,
};

export function OverdueWorkOrders() {
  // Mock data - replace with API call
  const overdueOrders: OverdueWorkOrder[] = [
    {
      id: "WO-087",
      title: "Transmission service",
      vehicle: "2020 Ford F-150",
      dueDate: "2024-11-20",
      daysOverdue: 8,
      priority: "urgent",
    },
    {
      id: "WO-092",
      title: "Coolant flush",
      vehicle: "2019 Honda Civic",
      dueDate: "2024-11-23",
      daysOverdue: 5,
      priority: "high",
    },
    {
      id: "WO-095",
      title: "Battery replacement",
      vehicle: "2021 Toyota Camry",
      dueDate: "2024-11-25",
      daysOverdue: 3,
      priority: "medium",
    },
  ];

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
            {overdueOrders.map((order) => (
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
                        <Badge variant={priorityVariant[order.priority]} className="text-xs">
                          {order.priority}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {order.vehicle}
                      </p>
                      <p className="text-xs text-red-600 dark:text-red-400 mt-1 font-medium">
                        {order.daysOverdue} days overdue
                      </p>
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {order.id}
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
