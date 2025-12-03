"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Plus, RefreshCw, Trash2 } from "lucide-react";
import { VehicleMaintenancePlan } from "@/features/vehicles/api/vehiclePlans";

interface VehicleMaintenancePlansProps {
  plans?: VehicleMaintenancePlan[];
  isLoading?: boolean;
  isDeleting?: boolean;
  onCreate: () => void;
  onEdit: (plan: VehicleMaintenancePlan) => void;
  onDelete: (planId: string) => void;
}

export function VehicleMaintenancePlans({
  plans = [],
  isLoading,
  isDeleting,
  onCreate,
  onEdit,
  onDelete,
}: VehicleMaintenancePlansProps) {
  return (
    <Card className="shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <div className="flex items-center gap-2">
          <RefreshCw className="h-5 w-5 text-primary" />
          <CardTitle className="text-xl font-semibold">
            Maintenance Plans
          </CardTitle>
        </div>
        <Button size="sm" onClick={onCreate}>
          <Plus className="mr-2 h-4 w-4" />
          New Plan
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" /> Loading plans...
          </div>
        ) : plans.length === 0 ? (
          <div className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
            No maintenance plans yet. Create your first plan to stay on schedule.
          </div>
        ) : (
          <div className="space-y-3">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className="flex flex-col gap-3 rounded-lg border p-4 transition hover:shadow-sm md:flex-row md:items-center md:justify-between"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-gray-900 dark:text-gray-100">
                      {plan.template?.name || "Custom Plan"}
                    </p>
                    {!plan.is_active && <Badge variant="outline">Inactive</Badge>}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Every {plan.interval_km} km • Every {plan.interval_months} months
                  </p>
                  <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                    <span>
                      Last service: {plan.last_service_date ? new Date(plan.last_service_date).toLocaleDateString() : "—"}
                    </span>
                    <span>Last service km: {plan.last_service_km || 0}</span>
                    <span>
                      Next due: {plan.next_service_date ? new Date(plan.next_service_date).toLocaleDateString() : "—"}
                    </span>
                    <span>Next service km: {plan.next_service_km || 0}</span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => onEdit(plan)}>
                    Edit
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive"
                    onClick={() => onDelete(plan.id)}
                    disabled={isDeleting}
                    title="Delete plan"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
