"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package } from "lucide-react";

interface StockByWarehouse {
  warehouse: string;
  location: string;
  quantity: number;
  minQuantity: number;
}

interface PartStockByWarehouseProps {
  stock?: StockByWarehouse[];
}

export function PartStockByWarehouse({ stock = [] }: PartStockByWarehouseProps) {
  const mockStock: StockByWarehouse[] = stock.length > 0 ? stock : [
    {
      warehouse: "Main Warehouse",
      location: "Aisle 3, Shelf B",
      quantity: 45,
      minQuantity: 20,
    },
    {
      warehouse: "North Branch",
      location: "Section 2A",
      quantity: 12,
      minQuantity: 15,
    },
    {
      warehouse: "South Depot",
      location: "Bay 5",
      quantity: 28,
      minQuantity: 10,
    },
  ];

  const totalQuantity = mockStock.reduce((sum, s) => sum + s.quantity, 0);
  const lowStockWarehouses = mockStock.filter((s) => s.quantity <= s.minQuantity);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Stock by Warehouse</CardTitle>
          <div className="flex items-center gap-2">
            <Package className="h-5 w-5 text-gray-500" />
            <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {totalQuantity}
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400">total</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {lowStockWarehouses.length > 0 && (
          <div className="mb-4 rounded-lg border border-yellow-200 bg-yellow-50 p-3 dark:border-yellow-900/50 dark:bg-yellow-900/20">
            <p className="text-sm font-medium text-yellow-800 dark:text-yellow-400">
              ⚠️ {lowStockWarehouses.length} warehouse(s) below minimum stock
            </p>
          </div>
        )}

        <div className="space-y-3">
          {mockStock.map((item, index) => {
            const isLowStock = item.quantity <= item.minQuantity;
            return (
              <div
                key={index}
                className={`rounded-lg border p-4 ${
                  isLowStock
                    ? "border-yellow-200 bg-yellow-50 dark:border-yellow-900/50 dark:bg-yellow-900/20"
                    : "border-gray-200 dark:border-gray-800"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                        {item.warehouse}
                      </h4>
                      {isLowStock && (
                        <Badge variant="warning" className="text-xs">
                          Low Stock
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {item.location}
                    </p>
                    <div className="mt-2 flex items-center gap-4 text-sm">
                      <div>
                        <span className="text-gray-500 dark:text-gray-400">
                          Available:
                        </span>{" "}
                        <span className={`font-semibold ${isLowStock ? "text-yellow-600 dark:text-yellow-400" : "text-gray-900 dark:text-gray-100"}`}>
                          {item.quantity}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500 dark:text-gray-400">
                          Min:
                        </span>{" "}
                        <span className="font-medium text-gray-700 dark:text-gray-300">
                          {item.minQuantity}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
