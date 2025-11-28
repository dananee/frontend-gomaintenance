"use client";

import { useParams } from "next/navigation";
import { useWorkOrder } from "@/features/workOrders/hooks/useWorkOrder";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { UploadCloud } from "lucide-react";

const sampleTasks = [
  { title: "Inspect brake lines", assignee: "Alex", status: "In Progress" },
  { title: "Replace pads", assignee: "Jamie", status: "Pending" },
];

const sampleParts = [
  { name: "Brake pads", qty: 2, cost: 120 },
  { name: "Brake cleaner", qty: 1, cost: 20 },
];

export default function WorkOrderDetailPage() {
  const params = useParams<{ id: string }>();
  const { data, isLoading } = useWorkOrder(params?.id ?? "");

  if (isLoading) return <Skeleton className="h-[50vh] w-full" />;
  if (!data) return <div className="text-sm text-gray-500">Work order not found.</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <p className="text-sm text-gray-500">Work Order</p>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{data.title}</h1>
          <div className="mt-2 flex flex-wrap gap-2">
            <Badge variant="info">{data.priority}</Badge>
            <Badge variant="warning">Due {data.dueDate || "TBD"}</Badge>
            <Badge variant="success">{data.status}</Badge>
          </div>
        </div>
        <Button>Complete</Button>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Tasks</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {sampleTasks.map((task) => (
              <div key={task.title} className="flex items-center justify-between rounded-lg border border-gray-200 p-3 dark:border-gray-800">
                <div>
                  <p className="font-semibold text-gray-900 dark:text-gray-100">{task.title}</p>
                  <p className="text-xs text-gray-500">Assignee: {task.assignee}</p>
                </div>
                <Badge variant={task.status === "Pending" ? "warning" : "success"}>{task.status}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Parts & Costs</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {sampleParts.map((part) => (
              <div key={part.name} className="flex items-center justify-between text-sm">
                <span className="text-gray-800 dark:text-gray-100">{part.name}</span>
                <span className="text-gray-500 dark:text-gray-400">{part.qty} x ${part.cost}</span>
              </div>
            ))}
            <div className="mt-3 flex items-center justify-between border-t pt-3 text-sm font-semibold dark:border-gray-800">
              <span>Total</span>
              <span>$140</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Attachments</CardTitle>
          <Button size="sm" variant="secondary">
            <UploadCloud className="mr-2 h-4 w-4" /> Upload
          </Button>
        </CardHeader>
        <CardContent className="text-sm text-gray-500">
          Drag and drop job photos, invoices, or logs to keep this work order auditable.
        </CardContent>
      </Card>
    </div>
  );
}
