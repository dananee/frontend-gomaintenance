"use client";

import { usePart } from "@/features/inventory/hooks/usePart";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Package, DollarSign, BarChart3 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PartDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const { data: part, isLoading, error } = usePart(id);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid gap-6 md:grid-cols-2">
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
        </div>
      </div>
    );
  }

  if (error || !part) {
    return (
      <div className="flex h-[50vh] flex-col items-center justify-center text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Part Not Found</h2>
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
              {part.name}
            </h1>
            <p className="text-sm text-gray-500">{part.part_number}</p>
          </div>
        </div>
        <Badge variant={part.quantity > part.min_quantity ? "success" : "destructive"}>
          {part.quantity > part.min_quantity ? "In Stock" : "Low Stock"}
        </Badge>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Part Information</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-sm font-medium text-gray-500">Description</label>
              <p>{part.description || "No description provided."}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Category</label>
              <p className="capitalize">{part.category}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Location</label>
              <p>{part.location}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Supplier</label>
              <p>{part.supplier || "N/A"}</p>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Inventory Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4 text-gray-500" />
                  <span className="text-sm font-medium">Quantity On Hand</span>
                </div>
                <span className="text-lg font-bold">{part.quantity}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4 text-gray-500" />
                  <span className="text-sm font-medium">Min Quantity</span>
                </div>
                <span className="text-lg font-bold">{part.min_quantity}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-gray-500" />
                  <span className="text-sm font-medium">Unit Cost</span>
                </div>
                <span className="text-lg font-bold">${part.cost.toFixed(2)}</span>
              </div>
              <div className="pt-4 border-t">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Total Value</span>
                  <span className="text-xl font-bold text-green-600">
                    ${(part.quantity * part.cost).toFixed(2)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
