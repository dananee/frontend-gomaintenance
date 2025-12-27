"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowDown, ArrowUp, Package, AlertCircle, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { formatDateShort } from "@/lib/formatters";

import { StockMovement } from "../types/inventory.types";
import { format } from "date-fns";

interface PartMovementHistoryProps {
  movements?: StockMovement[];
}

const movementTypeConfig: Record<string, any> = {
  PURCHASE: {
    label: "Purchase",
    variant: "success",
    icon: ArrowDown,
    color: "text-green-600 dark:text-green-400",
  },
  CONSUMPTION: {
    label: "Consumption",
    variant: "destructive",
    icon: ArrowUp,
    color: "text-red-600 dark:text-red-400",
  },
  TRANSFER: {
    label: "Transfer",
    variant: "outline",
    icon: Package,
    color: "text-blue-600 dark:text-blue-400",
  },
  RETURN: {
    label: "Return",
    variant: "success",
    icon: ArrowDown,
    color: "text-green-600 dark:text-green-400",
  },
  ADJUSTMENT: {
    label: "Adjustment",
    variant: "warning",
    icon: AlertCircle,
    color: "text-yellow-600 dark:text-yellow-400",
  },
  SCRAP: {
    label: "Scrap",
    variant: "destructive",
    icon: Trash2,
    color: "text-gray-600 dark:text-gray-400",
  },
  IN: {
    label: "In",
    variant: "success",
    icon: ArrowDown,
    color: "text-green-600 dark:text-green-400",
  },
  OUT: {
    label: "Out",
    variant: "destructive",
    icon: ArrowUp,
    color: "text-red-600 dark:text-red-400",
  },
};

export function PartMovementHistory({ movements = [] }: PartMovementHistoryProps) {
  const t = useTranslations("inventory.details.movements");

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("title")}</CardTitle>
      </CardHeader>
      <CardContent>
        {movements.length === 0 ? (
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-6">
             {t("empty")}
          </p>
        ) : (
          <div className="space-y-3">
            {movements.map((movement) => {
               const config = movementTypeConfig[movement.movement_type] || movementTypeConfig["ADJUSTMENT"];
               const Icon = config.icon;
               const label = t(`types.${movement.movement_type}` as any) || config.label;

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
                               {label}
                             </span>
                             <Badge variant={config.variant} className="text-xs">
                               {movement.quantity > 0 ? "+" : ""}
                               {movement.quantity}
                             </Badge>
                             {movement.total_price_ttc > 0 && (
                                <span className="text-xs font-medium text-gray-500">
                                    {movement.total_price_ttc.toLocaleString()} MAD
                                </span>
                             )}
                           </div>
                           <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                             {movement.warehouse?.name}
                             {movement.to_warehouse && ` → ${movement.to_warehouse.name}`}
                           </p>
                           {movement.notes && (
                             <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                               {movement.notes}
                             </p>
                           )}
                           {movement.reference_no && (
                             <p className="text-xs text-gray-400 mt-1">
                               {t("ref")} {movement.reference_no}
                             </p>
                           )}
                         </div>
                       </div>
                       <div className="mt-2 flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                         <span>{format(new Date(movement.created_at), "PPP p")}</span>
                         {movement.created_user && (
                           <>
                             <span>•</span>
                             <span>{movement.created_user.first_name} {movement.created_user.last_name}</span>
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
