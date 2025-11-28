"use client";

import { useParams } from "next/navigation";
import { useVehicle } from "@/features/vehicles/hooks/useVehicle";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { useState } from "react";
import { Upload } from "lucide-react";

export default function VehicleDetailPage() {
  const params = useParams<{ id: string }>();
  const { data, isLoading } = useVehicle(params?.id ?? "");
  const [showConfirm, setShowConfirm] = useState(false);

  if (isLoading) {
    return <Skeleton className="h-[60vh] w-full" />;
  }

  if (!data) {
    return <div className="text-sm text-gray-500">Vehicle not found.</div>;
  }

  const maintenancePlans = [
    { title: "Oil Change", dueIn: "1,200 mi", interval: "Every 5,000 mi" },
    { title: "Brake Inspection", dueIn: "3 weeks", interval: "Quarterly" },
  ];

  const documents = [
    { id: "reg", name: "Registration.pdf", updated: "2024-11-01" },
    { id: "ins", name: "Insurance Card.png", updated: "2024-10-15" },
  ];

  const workOrders = [
    { id: "WO-124", title: "Brake pads replacement", status: "In Progress" },
    { id: "WO-101", title: "Annual inspection", status: "Completed" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <p className="text-sm text-gray-500">Vehicle</p>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{data.name}</h1>
          <div className="mt-2 flex flex-wrap gap-2">
            <Badge variant="info">{data.type}</Badge>
            <Badge variant="success">{data.status}</Badge>
            <Badge variant="warning">Odometer: {data.odometer || "—"}</Badge>
          </div>
        </div>
        <Button onClick={() => setShowConfirm(true)} variant="outline">
          Archive Vehicle
        </Button>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Details</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <Detail label="VIN" value={data.vin} />
            <Detail label="License Plate" value={data.licensePlate} />
            <Detail label="Category" value={data.type} />
            <Detail label="Assigned Driver" value={data.assignedTo || "Unassigned"} />
            <Detail label="Last Service" value={data.lastService || "Unknown"} />
            <Detail label="Next Service" value="Auto calculated" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Maintenance Plans</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {maintenancePlans.map((plan) => (
              <div key={plan.title} className="rounded-lg border border-gray-200 p-3 dark:border-gray-800">
                <p className="font-semibold text-gray-900 dark:text-gray-100">{plan.title}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Next: {plan.dueIn}</p>
                <p className="text-xs text-gray-400">Interval: {plan.interval}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Documents</CardTitle>
            <Button size="sm" variant="secondary">
              <Upload className="mr-2 h-4 w-4" /> Upload
            </Button>
          </CardHeader>
          <CardContent className="space-y-2">
            {documents.map((doc) => (
              <div
                key={doc.id}
                className="flex items-center justify-between rounded-lg border border-gray-200 px-3 py-2 text-sm dark:border-gray-800"
              >
                <div>
                  <p className="font-medium text-gray-900 dark:text-gray-100">{doc.name}</p>
                  <p className="text-xs text-gray-500">Updated {doc.updated}</p>
                </div>
                <Badge variant="outline">View</Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Work Orders</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {workOrders.map((wo) => (
              <div key={wo.id} className="flex items-center justify-between rounded-lg border border-gray-200 p-3 dark:border-gray-800">
                <div>
                  <p className="font-semibold text-gray-900 dark:text-gray-100">{wo.title}</p>
                  <p className="text-xs text-gray-500">{wo.id}</p>
                </div>
                <Badge variant={wo.status === "Completed" ? "success" : "warning"}>{wo.status}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <ConfirmDialog
        open={showConfirm}
        onOpenChange={setShowConfirm}
        title="Archive vehicle?"
        description="This will remove the vehicle from active dispatch and maintenance queues."
        onConfirm={() => setShowConfirm(false)}
      />
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
