"use client";

import { useVehicle } from "@/features/vehicles/hooks/useVehicle";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Edit, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { useState } from "react";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";

export default function VehicleDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const { data: vehicle, isLoading, error } = useVehicle(id);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
        </div>
      </div>
    );
  }

  if (error || !vehicle) {
    return (
      <div className="flex h-[50vh] flex-col items-center justify-center text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Vehicle Not Found</h2>
        <p className="mt-2 text-gray-500">The vehicle you are looking for does not exist or has been removed.</p>
        <Button onClick={() => router.back()} className="mt-4" variant="outline">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Go Back
        </Button>
      </div>
    );
  }

  const handleDelete = () => {
    // Implement delete logic here
    toast.success("Vehicle deleted successfully");
    router.push("/dashboard/vehicles");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {vehicle.brand} {vehicle.model}
            </h1>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span>{vehicle.year}</span>
              <span>•</span>
              <span className="font-mono">{vehicle.plate_number}</span>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => {}}>
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Button>
          <Button variant="destructive" onClick={() => setIsDeleteDialogOpen(true)}>
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Vehicle Information</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-sm font-medium text-gray-500">VIN</label>
              <p className="font-mono text-sm">{vehicle.vin}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Type</label>
              <p className="capitalize">{vehicle.type}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Status</label>
              <div className="mt-1">
                <Badge
                  variant={
                    vehicle.status === "active"
                      ? "success"
                      : vehicle.status === "maintenance"
                      ? "warning"
                      : "default"
                  }
                >
                  {vehicle.status}
                </Badge>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Current Mileage</label>
              <p>{vehicle.current_km.toLocaleString()} km</p>
            </div>
            {vehicle.current_engine_hours && (
              <div>
                <label className="text-sm font-medium text-gray-500">Engine Hours</label>
                <p>{vehicle.current_engine_hours} hrs</p>
              </div>
            )}
            <div>
              <label className="text-sm font-medium text-gray-500">Last Updated</label>
              <p>{vehicle.updated_at ? formatDate(vehicle.updated_at) : "N/A"}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Stats</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Total Work Orders</label>
              <p className="text-2xl font-bold">0</p> {/* Placeholder */}
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Total Cost</label>
              <p className="text-2xl font-bold">$0.00</p> {/* Placeholder */}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs for History, Docs, etc. will go here */}
      
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDelete}
        title="Delete Vehicle"
        description="Are you sure you want to delete this vehicle? This action cannot be undone."
        variant="destructive"
        confirmText="Delete"
      />
    </div>
  );
}
