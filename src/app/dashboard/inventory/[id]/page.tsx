"use client";

import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { PartStockByWarehouse } from "@/features/inventory/components/PartStockByWarehouse";
import { PartMovementHistory } from "@/features/inventory/components/PartMovementHistory";
import { Edit, Package } from "lucide-react";

// Mock hook - replace with actual hook
function usepart(id: string) {
  return {
    data: {
      id,
      name: "Brake Pads (Ceramic)",
      sku: "BRK-PAD-001",
      category: "Brakes",
      supplier: "AutoParts Inc.",
      supplierContact: "sales@autoparts.com",
      unitPrice: 120.00,
      minQuantity: 20,
      description: "High-performance ceramic brake pads suitable for most vehicles",
    },
    isLoading: false,
  };
}

export default function InventoryPartDetailPage() {
  const params = useParams<{ id: string }>();
  const { data: part, isLoading } = usepart(params?.id ?? "");

  if (isLoading) {
    return <Skeleton className="h-[60vh] w-full" />;
  }

  if (!part) {
    return <div className="text-sm text-gray-500">Part not found.</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <p className="text-sm text-gray-500">Part #{part.sku}</p>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{part.name}</h1>
          <div className="mt-2 flex flex-wrap gap-2">
            <Badge variant="info">{part.category}</Badge>
            <Badge variant="outline">${part.unitPrice.toFixed(2)}/unit</Badge>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Edit className="mr-2 h-4 w-4" />
            Edit Part
          </Button>
          <Button>
            <Package className="mr-2 h-4 w-4" />
            Adjust Stock
          </Button>
        </div>
      </div>

      {/* Overview Grid */}
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Part Details</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <Detail label="SKU" value={part.sku} />
            <Detail label="Category" value={part.category} />
            <Detail label="Unit Price" value={`$${part.unitPrice.toFixed(2)}`} />
            <Detail label="Min Quantity" value={part.minQuantity} />
            <Detail label="Supplier" value={part.supplier} />
            <Detail label="Supplier Contact" value={part.supplierContact} />
          </CardContent>
          {part.description && (
            <>
              <CardHeader className="pt-0">
                <CardTitle className="text-base">Description</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {part.description}
                </p>
              </CardContent>
            </>
          )}
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Supplier Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="rounded-lg border border-gray-200 p-3 dark:border-gray-800">
              <p className="font-semibold text-gray-900 dark:text-gray-100">
                {part.supplier}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {part.supplierContact}
              </p>
            </div>
            <div className="rounded-lg border border-gray-200 p-3 dark:border-gray-800">
              <p className="text-xs text-gray-500 dark:text-gray-400">Lead Time</p>
              <p className="font-semibold text-gray-900 dark:text-gray-100">3-5 business days</p>
            </div>
            <div className="rounded-lg border border-gray-200 p-3 dark:border-gray-800">
              <p className="text-xs text-gray-500 dark:text-gray-400">Last Order</p>
              <p className="font-semibold text-gray-900 dark:text-gray-100">Nov 25, 2024</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Stock and Movement */}
      <div className="grid gap-4 lg:grid-cols-2">
        <PartStockByWarehouse partId={params?.id ?? ""} />
        <PartMovementHistory partId={params?.id ?? ""} />
      </div>
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
