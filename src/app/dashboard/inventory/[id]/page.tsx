"use client";

import { useParams } from "next/navigation";
import { usePart } from "@/features/inventory/hooks/usePart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

const warehouses = [
  { name: "Central", stock: 18 },
  { name: "East", stock: 4 },
  { name: "Mobile Van", stock: 2 },
];

const compatible = ["Ford F-150", "Sprinter Van", "RAM 1500"];

export default function InventoryDetailPage() {
  const params = useParams<{ id: string }>();
  const { data, isLoading } = usePart(params?.id ?? "");

  if (isLoading) return <Skeleton className="h-[40vh] w-full" />;
  if (!data) return <div className="text-sm text-gray-500">Part not found.</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <p className="text-sm text-gray-500">Inventory Part</p>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{data.name}</h1>
          <div className="mt-2 flex flex-wrap gap-2">
            <Badge variant="info">{data.category}</Badge>
            <Badge variant={data.quantity < 5 ? "destructive" : "success"}>On hand: {data.quantity}</Badge>
            <Badge variant="outline">SKU: {data.sku}</Badge>
          </div>
        </div>
        <Button>Add to Work Order</Button>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Warehouse Stock</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2">
            {warehouses.map((item) => (
              <div key={item.name} className="rounded-lg border border-gray-200 p-3 dark:border-gray-800">
                <p className="font-semibold text-gray-900 dark:text-gray-100">{item.name}</p>
                <p className="text-sm text-gray-500">{item.stock} units</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Compatibility</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {compatible.map((vehicle) => (
              <div key={vehicle} className="flex items-center justify-between text-sm">
                <span className="text-gray-800 dark:text-gray-100">{vehicle}</span>
                <Badge variant="success">Ready</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
