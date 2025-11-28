"use client";

import { useWorkOrder } from "@/features/workOrders/hooks/useWorkOrder";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, User, Clock, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function WorkOrderDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const { data: workOrder, isLoading, error } = useWorkOrder(id);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid gap-6 md:grid-cols-3">
          <Skeleton className="col-span-2 h-96" />
          <Skeleton className="h-96" />
        </div>
      </div>
    );
  }

  if (error || !workOrder) {
    return (
      <div className="flex h-[50vh] flex-col items-center justify-center text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Work Order Not Found</h2>
        <Button onClick={() => router.back()} className="mt-4" variant="outline">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Go Back
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              WO #{workOrder.id.slice(0, 8)}
            </h1>
            <p className="text-sm text-gray-500">{workOrder.title}</p>
          </div>
        </div>
        <Badge
          variant={
            workOrder.status === "completed"
              ? "success"
              : workOrder.status === "in_progress"
              ? "info"
              : workOrder.status === "cancelled"
              ? "destructive"
              : "default"
          }
          className="capitalize"
        >
          {workOrder.status.replace("_", " ")}
        </Badge>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                {workOrder.description}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Tasks</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Tasks list placeholder - will implement real tasks later */}
              <div className="text-sm text-gray-500 italic">No tasks added yet.</div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Vehicle</label>
                <p className="font-medium">{workOrder.vehicle_name || "Unknown"}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Assigned To</label>
                <div className="flex items-center gap-2 mt-1">
                  <User className="h-4 w-4 text-gray-400" />
                  <span>{workOrder.assigned_to_name || "Unassigned"}</span>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Priority</label>
                <div className="mt-1">
                  <Badge variant={workOrder.priority === "urgent" ? "destructive" : "outline"}>
                    {workOrder.priority}
                  </Badge>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Scheduled Date</label>
                <div className="flex items-center gap-2 mt-1">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span>{workOrder.scheduled_date ? formatDate(workOrder.scheduled_date) : "Not scheduled"}</span>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Created At</label>
                <div className="flex items-center gap-2 mt-1">
                  <Clock className="h-4 w-4 text-gray-400" />
                  <span>{formatDate(workOrder.created_at)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
