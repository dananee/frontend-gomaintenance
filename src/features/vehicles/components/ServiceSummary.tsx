"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, DollarSign, User, Wrench } from "lucide-react";

interface ServiceSummaryProps {
  lastMaintenanceDate: string;
  lastMaintenanceCost: number;
  nextServiceDue: string;
  lastTechnician: string;
  serviceInterval: string;
}

export function ServiceSummary({
  lastMaintenanceDate,
  lastMaintenanceCost,
  nextServiceDue,
  lastTechnician,
  serviceInterval,
}: ServiceSummaryProps) {
  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-2">
          <Wrench className="h-5 w-5 text-primary" />
          <CardTitle className="text-xl font-semibold">
            Service Summary
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-4">
            <div>
              <p className="text-xs text-muted-foreground uppercase mb-1">
                Last Maintenance
              </p>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-blue-600" />
                <p className="font-medium">{lastMaintenanceDate}</p>
              </div>
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase mb-1">
                Last Cost
              </p>
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-green-600" />
                <p className="font-medium">
                  ${lastMaintenanceCost.toLocaleString()}
                </p>
              </div>
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase mb-1">
                Last Technician
              </p>
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-purple-600" />
                <p className="font-medium">{lastTechnician}</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-lg bg-gradient-to-br from-blue-50 to-blue-100/50 p-4 border border-blue-200">
              <p className="text-xs text-muted-foreground uppercase mb-2">
                Next Service Due
              </p>
              <p className="text-2xl font-bold text-blue-600">
                {nextServiceDue}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase mb-1">
                Service Interval
              </p>
              <p className="font-medium">{serviceInterval}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
