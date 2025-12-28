"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Package, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { formatCurrency } from "@/lib/formatters";
import { useWorkOrderParts, useAddWorkOrderPart, useRemoveWorkOrderPart } from "../hooks/useWorkOrderParts";
import { AddPartToWorkOrderModal } from "./AddPartToWorkOrderModal";
import { useState } from "react";
import { WorkOrderPart } from "../api/workOrderParts";
import { AnimatedNumber } from "@/components/ui/animated-number";

interface WorkOrderPartsProps {
  workOrderId: string;
}

export function WorkOrderParts({
  workOrderId,
}: WorkOrderPartsProps) {
  const t = useTranslations("workOrders");
  const tc = useTranslations("common");

  const { data: parts, isLoading } = useWorkOrderParts(workOrderId);
  const addPartMutation = useAddWorkOrderPart(workOrderId);
  const removePartMutation = useRemoveWorkOrderPart(workOrderId);

  const [isModalOpen, setIsModalOpen] = useState(false);

  // Calculate total - use backend total_price or compute from qty * unit_price
  const totalCost = parts?.reduce(
    (sum, part) => sum + (part.total_price || (part.quantity * (part.unit_price || 0))),
    0
  ) || 0;

  const handleAdd = (data: any) => {
    addPartMutation.mutate(data, {
      onSuccess: () => setIsModalOpen(false)
    });
  };

  const handleRemove = (id: string) => {
    if (confirm("Are you sure you want to remove this part?")) {
      removePartMutation.mutate(id);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
            {t("parts.title")}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {/* Description can be added here if needed */}
          </p>
        </div>
        <Button size="sm" variant="outline" onClick={() => setIsModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          {tc("create")}
        </Button>
      </div>

      {(!parts || parts.length === 0) ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Package className="h-12 w-12 text-gray-400 dark:text-gray-600" />
            <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
              {tc("noData")}
            </p>
            <Button variant="outline" className="mt-4" size="sm" onClick={() => setIsModalOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              {tc("create")}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-gray-200 dark:border-gray-800">
                  <tr className="text-left text-xs text-gray-500 dark:text-gray-400">
                    <th className="px-4 py-3 font-medium">{t("parts.headers.name")}</th>
                    <th className="px-4 py-3 font-medium">{t("parts.headers.sku")}</th>
                    <th className="px-4 py-3 font-medium text-right">{t("parts.headers.qty")}</th>
                    <th className="px-4 py-3 font-medium text-right">{t("parts.headers.price")}</th>
                    <th className="px-4 py-3 font-medium text-right">{t("parts.headers.total")}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                  {parts.map((part) => (
                    <tr key={part.id} className="text-sm">
                      <td className="px-4 py-3 font-medium text-gray-900 dark:text-gray-100">
                        {part.part?.name}
                      </td>
                      <td className="px-4 py-3 text-gray-500 dark:text-gray-400">
                        {part.part?.sku || "—"}
                      </td>
                      <td className="px-4 py-3 text-right text-gray-900 dark:text-gray-100">
                        <AnimatedNumber value={part.quantity} decimals={0} />
                      </td>
                      <td className="px-4 py-3 text-right text-gray-900 dark:text-gray-100">
                        <AnimatedNumber value={part.unit_price || 0} currency="EUR" />
                      </td>
                      <td className="px-4 py-3 text-right font-medium text-gray-900 dark:text-gray-100">
                        <AnimatedNumber value={part.total_price || (part.quantity * (part.unit_price || 0))} currency="EUR" />
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Button variant="ghost" size="icon" onClick={() => handleRemove(part.id)} className="text-destructive hover:text-destructive/90">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="border-t-2 border-gray-300 bg-gray-50 dark:border-gray-700 dark:bg-gray-800/50">
                  <tr className="text-sm font-semibold">
                    <td colSpan={4} className="px-4 py-3 text-right text-gray-900 dark:text-gray-100">
                      {tc("total")}:
                    </td>
                    <td className="px-4 py-3 text-right text-gray-900 dark:text-gray-100">
                      <AnimatedNumber value={totalCost} currency="EUR" />
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
      <AddPartToWorkOrderModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={handleAdd}
        isLoading={addPartMutation.isPending}
      />
    </div>
  );
}
