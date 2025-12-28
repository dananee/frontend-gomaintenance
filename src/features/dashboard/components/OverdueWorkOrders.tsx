"use client";

import { memo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { differenceInDays } from "date-fns";
import { useTranslations } from "next-intl";
import { AnimatedNumber } from "@/components/ui/animated-number";

interface OverdueWorkOrder {
  id: string;
  title: string;
  due_date: string;
  priority: "low" | "medium" | "high" | "urgent";
  assigned_to?: string;
}

interface OverdueWorkOrdersProps {
  data: OverdueWorkOrder[];
}

const priorityVariant: Record<
  OverdueWorkOrder["priority"],
  "default" | "secondary" | "destructive" | "outline"
> = {
  low: "secondary",
  medium: "default",
  high: "destructive",
  urgent: "destructive",
};

function OverdueWorkOrdersComponent({ data = [] }: OverdueWorkOrdersProps) {
  const t = useTranslations("features.dashboard.overdueWorkOrders");
  const tPriorities = useTranslations("features.dashboard.priorities");

  return (
    <Card className="shadow-md border-red-100 dark:border-red-900/20 icon-purple-200">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-red-600" />
          <CardTitle className="text-xl font-semibold">
            {t("title")}
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="rounded-full bg-green-100 p-3 dark:bg-green-900/20">
              <Calendar className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <p className="mt-2 text-sm text-gray-500 font-medium">
              {t("empty")}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {data.slice(0, 5).map((order) => {
              const daysOverdue = differenceInDays(
                new Date(),
                new Date(order.due_date)
              );
              return (
                <div
                  key={order.id}
                  className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0 border-gray-100 dark:border-gray-800"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-gray-900 dark:text-gray-100">
                        {order.title}
                      </p>
                      <Badge
                        variant={priorityVariant[order.priority]}
                        className="text-xs"
                      >
                        {tPriorities(order.priority)}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      ID: {order.id} • {order.assigned_to || "Unassigned"}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-red-600 dark:text-red-400">
                      {t.rich("daysOverdue", { days: () => <AnimatedNumber value={daysOverdue} decimals={0} /> })}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(order.due_date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export const OverdueWorkOrders = memo(OverdueWorkOrdersComponent);
