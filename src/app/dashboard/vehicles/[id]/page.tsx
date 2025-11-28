"use client";

import { useParams } from "next/navigation";
import { useVehicle } from "@/features/vehicles/hooks/useVehicle";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { VehicleDocuments } from "@/features/vehicles/components/VehicleDocuments";
import { VehicleMaintenanceHistory } from "@/features/vehicles/components/VehicleMaintenanceHistory";
import { VehicleActivityLog } from "@/features/vehicles/components/VehicleActivityLog";
import { VehicleWorkOrders } from "@/features/vehicles/components/VehicleWorkOrders";
import { useState } from "react";
import { 
  FileText, 
  Wrench, 
  ClipboardCheck, 
  Activity as ActivityIcon,
  Edit
} from "lucide-react";

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
    { title: "Oil Change", dueIn: "1,200 mi", interval: "Every 5,000 mi", status: "upcoming" },
    { title: "Brake Inspection", dueIn: "3 weeks", interval: "Quarterly", status: "upcoming" },
    { title: "Tire Rotation", dueIn: "Overdue", interval: "Every 10,000 mi", status: "overdue" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <p className="text-sm text-gray-500">Vehicle</p>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{data.year} {data.brand} {data.model}</h1>
          <div className="mt-2 flex flex-wrap gap-2">
            <Badge variant="info">{data.type}</Badge>
            <Badge variant="success">{data.status}</Badge>
            <Badge variant="warning">Odometer: {data.current_km?.toLocaleString() || "—"} km</Badge>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Edit className="mr-2 h-4 w-4" />
            Edit Vehicle
          </Button>
          <Button onClick={() => setShowConfirm(true)} variant="outline">
            Archive Vehicle
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5 lg:w-auto">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="documents">
            <FileText className="mr-2 h-4 w-4" />
            Documents
          </TabsTrigger>
          <TabsTrigger value="maintenance">
            <Wrench className="mr-2 h-4 w-4" />
            Maintenance
          </TabsTrigger>
          <TabsTrigger value="work-orders">
            <ClipboardCheck className="mr-2 h-4 w-4" />
            Work Orders
          </TabsTrigger>
          <TabsTrigger value="activity">
            <ActivityIcon className="mr-2 h-4 w-4" />
            Activity
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 lg:grid-cols-3">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Vehicle Details</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 sm:grid-cols-2">
                <Detail label="VIN" value={data.vin} />
                <Detail label="License Plate" value={data.plate_number} />
                <Detail label="Category" value={data.type} />
                <Detail label="Brand" value={`${data.brand} ${data.model}`} />
                <Detail label="Year" value={data.year} />
                <Detail label="Current Mileage" value={`${data.current_km?.toLocaleString()} km`} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Maintenance Plans</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {maintenancePlans.map((plan) => (
                  <div 
                    key={plan.title} 
                    className={`rounded-lg border p-3 ${
                      plan.status === "overdue" 
                        ? "border-red-200 bg-red-50 dark:border-red-900/50 dark:bg-red-900/20" 
                        : "border-gray-200 dark:border-gray-800"
                    }`}
                  >
                    <p className="font-semibold text-gray-900 dark:text-gray-100">{plan.title}</p>
                    <p className={`text-sm ${
                      plan.status === "overdue" 
                        ? "text-red-600 dark:text-red-400 font-medium" 
                        : "text-gray-500 dark:text-gray-400"
                    }`}>
                      Next: {plan.dueIn}
                    </p>
                    <p className="text-xs text-gray-400">Interval: {plan.interval}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Documents Tab */}
        <TabsContent value="documents">
          <VehicleDocuments vehicleId={params?.id ?? ""} />
        </TabsContent>

        {/* Maintenance Tab */}
        <TabsContent value="maintenance">
          <VehicleMaintenanceHistory vehicleId={params?.id ?? ""} />
        </TabsContent>

        {/* Work Orders Tab */}
        <TabsContent value="work-orders">
          <VehicleWorkOrders vehicleId={params?.id ?? ""} />
        </TabsContent>

        {/* Activity Tab */}
        <TabsContent value="activity">
          <VehicleActivityLog vehicleId={params?.id ?? ""} />
        </TabsContent>
      </Tabs>

      <ConfirmDialog
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
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
