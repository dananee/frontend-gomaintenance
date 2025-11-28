"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowDown, ArrowUp, Package } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface StockMovement {
  id: string;
  type: "in" | "out" | "transfer" | "adjustment";
  quantity: number;
  warehouse: string;
  reference?: string;
  reason?: string;
  createdBy: string;
  createdAt: string;
}

interface PartMovementHistoryProps {
  partId: string;
  movements?: StockMovement[];
}

const movementTypeConfig = {
  in: {
    label: "Stock In",
    variant: "success" as const,
    icon: ArrowDown,
    color: "text-green-600 dark:text-green-400",
  },
  out: {
    label: "Stock Out",
    variant: "destructive" as const,
    icon: ArrowUp,
    color: "text-red-600 dark:text-red-400",
  },
  transfer: {
    label: "Transfer",
    variant: "info" as const,
    icon: Package,
    color: "text-blue-600 dark:text-blue-400",
  },
  adjustment: {
    label: "Adjustment",
    variant: "warning" as const,
    icon: Package,
    color: "text-yellow-600 dark:text-yellow-400",
  },
};

export function PartMovementHistory({
  partId,
  movements = [],
}: PartMovementHistoryProps) {
  const mockMovements: StockMovement[] = movements.length > 0 ? movements : [
    {
      id: "1",
      type: "in",
      quantity: 50,
      warehouse: "Main Warehouse",
      reference: "PO-2024-1234",
      reason: "Purchase order received",
      createdBy: "Admin User",
      createdAt: "2024-11-25T10:30:00Z",
    },
    {
      id: "2",
      type: "out",
      quantity: 15,
      warehouse: "Main Warehouse",
      reference: "WO-124",
      reason: "Used in work order",
      createdBy: "John Smith",
      createdAt: "2024-11-24T14:20:00Z",
    },
    {
      id: "3",
      type: "transfer",
      quantity: 10,
      warehouse: "Main Warehouse → North Branch",
      reference: "TRF-089",
      reason: "Stock transfer",
      createdBy: "Warehouse Manager",
      createdAt: "2024-11-23T09:15:00Z",
    },
    {
      id: "4",
      type: "adjustment",
      quantity: -3,
      warehouse: "Main Warehouse",
      reason: "Inventory count correction",
      createdBy: "Admin User",
      createdAt: "2024-11-22T16:45:00Z",
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Stock Movement History</CardTitle>
      </CardHeader>
      <CardContent>
        {mockMovements.length === 0 ? (
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-6">
            No stock movements recorded
          </p>
        ) : (
          <div className="space-y-3">
            {mockMovements.map((movement) => {
              const config = movementTypeConfig[movement.type];
              const Icon = config.icon;

              return (
                <div
                  key={movement.id}
                  className="rounded-lg border border-gray-200 p-4 dark:border-gray-800"
                >
                  <div className="flex items-start gap-3">
                    <div className={`flex-shrink-0 mt-1 ${config.color}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-gray-900 dark:text-gray-100">
                              {config.label}
                            </span>
                            <Badge variant={config.variant} className="text-xs">
                              {movement.quantity > 0 ? "+" : ""}
                              {movement.quantity}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            {movement.warehouse}
                          </p>
                          {movement.reason && (
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                              {movement.reason}
                            </p>
                          )}
                          {movement.reference && (
                            <p className="text-xs text-gray-400 mt-1">
                              Ref: {movement.reference}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="mt-2 flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                        <span>{formatDate(movement.createdAt)}</span>
                        {movement.createdBy && (
                          <>
                            <span>•</span>
                            <span>{movement.createdBy}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
