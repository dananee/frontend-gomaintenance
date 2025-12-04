"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { MaintenancePlan, MaintenanceTemplate } from "@/features/maintenance/types/maintenance.types";
import { AlertTriangle, CheckCircle, Clock } from "lucide-react";
import { formatDateShort } from "@/lib/formatters";

interface MaintenancePlanCardProps {
  plan: MaintenancePlan;
  template: MaintenanceTemplate;
  currentMileage: number;
  onComplete: (planId: string) => void;
}

export function MaintenancePlanCard({ plan, template, currentMileage, onComplete }: MaintenancePlanCardProps) {
  const interval = template.intervals[0];

  // Calculate progress
  let progress = 0;
  let remaining = 0;
  let isOverdue = false;

  if (interval.type === "distance") {
    const lastMileage = plan.last_performed_mileage || 0;
    const nextMileage = lastMileage + interval.value;
    const covered = currentMileage - lastMileage;
    progress = Math.min((covered / interval.value) * 100, 100);
    remaining = nextMileage - currentMileage;
    isOverdue = remaining < 0;
  } else if (interval.type === "time") {
    // Simplified time calculation for demo
    progress = 75;
    isOverdue = plan.status === "overdue";
  }

  return (
    <Card className={`border-l-4 ${isOverdue ? "border-l-red-500" : "border-l-green-500"}`}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg font-semibold">{template.name}</CardTitle>
            <p className="text-sm text-gray-500 dark:text-gray-400">{template.description}</p>
          </div>
          <Badge variant={isOverdue ? "destructive" : "success"}>
            {isOverdue ? "Overdue" : "Active"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Progress</span>
              <span className={`font-medium ${isOverdue ? "text-red-600" : "text-gray-900"}`}>
                {Math.round(progress)}%
              </span>
            </div>
            <Progress value={progress} className={isOverdue ? "bg-red-100 dark:bg-red-900/20" : ""} />
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-gray-400" />
              <div>
                <p className="text-xs text-gray-500">Last Performed</p>
                <p className="font-medium">
                  {plan.last_performed_date ? formatDateShort(plan.last_performed_date) : "Never"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <AlertTriangle className={`h-4 w-4 ${isOverdue ? "text-red-500" : "text-gray-400"}`} />
              <div>
                <p className="text-xs text-gray-500">Next Due</p>
                <p className={`font-medium ${isOverdue ? "text-red-600" : ""}`}>
                  {interval.type === "distance"
                    ? `${(plan.last_performed_mileage || 0) + interval.value} km`
                    : formatDateShort(plan.next_due_date || "")}
                </p>
              </div>
            </div>
          </div>

          <Button className="w-full" onClick={() => onComplete(plan.id)}>
            <CheckCircle className="mr-2 h-4 w-4" />
            Mark as Completed
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
