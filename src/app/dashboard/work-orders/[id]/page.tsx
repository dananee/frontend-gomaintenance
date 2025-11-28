"use client";

import { useParams } from "next/navigation";
import { useWorkOrder } from "@/features/workOrders/hooks/useWorkOrder";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WorkOrderTasks } from "@/features/workOrders/components/WorkOrderTasks";
import { WorkOrderParts } from "@/features/workOrders/components/WorkOrderParts";
import { WorkOrderAttachments } from "@/features/workOrders/components/WorkOrderAttachments";
import { WorkOrderComments } from "@/features/workOrders/components/WorkOrderComments";
import { WorkOrderTimeline } from "@/features/workOrders/components/WorkOrderTimeline";
import { 
  CheckCircle, 
  ClipboardList, 
  Package, 
  Paperclip, 
  MessageSquare, 
  Clock,
  Edit
} from "lucide-react";

const priorityVariant = {
  low: "info" as const,
  medium: "warning" as const,
  high: "warning" as const,
  urgent: "destructive" as const,
};

const statusVariant = {
  pending: "warning" as const,
  in_progress: "info" as const,
  completed: "success" as const,
  cancelled: "outline" as const,
};

export default function WorkOrderDetailPage() {
  const params = useParams<{ id: string }>();
  const { data, isLoading } = useWorkOrder(params?.id ?? "");

  if (isLoading) return <Skeleton className="h-[50vh] w-full" />;
  if (!data) return <div className="text-sm text-gray-500">Work order not found.</div>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <p className="text-sm text-gray-500">Work Order #{data.id.slice(0, 8)}</p>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{data.title}</h1>
          <div className="mt-2 flex flex-wrap gap-2">
            <Badge variant={priorityVariant[data.priority]}>
              {data.priority} priority
            </Badge>
            <Badge variant={statusVariant[data.status]}>
              {data.status.replace("_", " ")}
            </Badge>
            {data.scheduled_date && (
              <Badge variant="outline">
                Due: {new Date(data.scheduled_date).toLocaleDateString()}
              </Badge>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Button>
          <Button>
            <CheckCircle className="mr-2 h-4 w-4" />
            Complete
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-6 lg:w-auto">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="tasks">
            <ClipboardList className="mr-2 h-4 w-4" />
            Tasks
          </TabsTrigger>
          <TabsTrigger value="parts">
            <Package className="mr-2 h-4 w-4" />
            Parts
          </TabsTrigger>
          <TabsTrigger value="attachments">
            <Paperclip className="mr-2 h-4 w-4" />
            Attachments
          </TabsTrigger>
          <TabsTrigger value="comments">
            <MessageSquare className="mr-2 h-4 w-4" />
            Comments
          </TabsTrigger>
          <TabsTrigger value="timeline">
            <Clock className="mr-2 h-4 w-4" />
            Timeline
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 lg:grid-cols-3">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Work Order Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-xs uppercase text-gray-500">Description</p>
                  <p className="text-sm text-gray-900 dark:text-gray-100">
                    {data.description || "No description provided"}
                  </p>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Detail label="Vehicle" value={data.vehicle_name || "—"} />
                  <Detail label="Type" value={data.type} />
                  <Detail label="Assigned To" value={data.assigned_to_name || "Unassigned"} />
                  <Detail label="Due Date" value={data.scheduled_date ? new Date(data.scheduled_date).toLocaleDateString() : "—"} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="rounded-lg border border-gray-200 p-3 dark:border-gray-800">
                  <p className="text-xs text-gray-500 dark:text-gray-400">Status</p>
                  <p className="font-semibold text-gray-900 dark:text-gray-100 capitalize">
                    {data.status.replace("_", " ")}
                  </p>
                </div>
                <div className="rounded-lg border border-gray-200 p-3 dark:border-gray-800">
                  <p className="text-xs text-gray-500 dark:text-gray-400">Priority</p>
                  <p className="font-semibold text-gray-900 dark:text-gray-100 capitalize">
                    {data.priority}
                  </p>
                </div>
                <div className="rounded-lg border border-gray-200 p-3 dark:border-gray-800">
                  <p className="text-xs text-gray-500 dark:text-gray-400">Created</p>
                  <p className="font-semibold text-gray-900 dark:text-gray-100">
                    {data.created_at ? new Date(data.created_at).toLocaleDateString() : "—"}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tasks Tab */}
        <TabsContent value="tasks">
          <WorkOrderTasks workOrderId={params?.id ?? ""} />
        </TabsContent>

        {/* Parts Tab */}
        <TabsContent value="parts">
          <WorkOrderParts workOrderId={params?.id ?? ""} />
        </TabsContent>

        {/* Attachments Tab */}
        <TabsContent value="attachments">
          <WorkOrderAttachments workOrderId={params?.id ?? ""} />
        </TabsContent>

        {/* Comments Tab */}
        <TabsContent value="comments">
          <WorkOrderComments workOrderId={params?.id ?? ""} />
        </TabsContent>

        {/* Timeline Tab */}
        <TabsContent value="timeline">
          <WorkOrderTimeline workOrderId={params?.id ?? ""} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function Detail({ label, value }: { label: string; value?: string | number | null }) {
  return (
    <div>
      <p className="text-xs uppercase text-gray-500">{label}</p>
      <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{value || "—"}</p>
    </div>
  );
}
