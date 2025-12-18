"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Package } from "lucide-react";
import { useTranslations } from "next-intl";

interface Part {
  id: string;
  name: string;
  sku?: string;
  quantity: number;
  unitPrice: number;
}

interface WorkOrderPartsProps {
  parts?: Part[];
}

export function WorkOrderParts({
  parts = [],
}: WorkOrderPartsProps) {
  const t = useTranslations("workOrders");
  const tc = useTranslations("common");

  const mockParts: Part[] = parts.length > 0 ? parts : [
    {
      id: "1",
      name: "Brake Pads (Ceramic)",
      sku: "BRK-PAD-001",
      quantity: 2,
      unitPrice: 120.00,
    },
    {
      id: "2",
      name: "Brake Cleaner Spray",
      sku: "BRK-CLN-001",
      quantity: 1,
      unitPrice: 15.99,
    },
    {
      id: "3",
      name: "Labor",
      quantity: 3,
      unitPrice: 85.00,
    },
  ];

  const totalCost = mockParts.reduce(
    (sum, part) => sum + part.quantity * part.unitPrice,
    0
  );

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
        <Button size="sm" variant="outline">
          <Plus className="mr-2 h-4 w-4" />
          {tc("create")}
        </Button>
      </div>

      {mockParts.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Package className="h-12 w-12 text-gray-400 dark:text-gray-600" />
            <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
              {tc("noData")}
            </p>
            <Button variant="outline" className="mt-4" size="sm">
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
                  {mockParts.map((part) => (
                    <tr key={part.id} className="text-sm">
                      <td className="px-4 py-3 font-medium text-gray-900 dark:text-gray-100">
                        {part.name}
                      </td>
                      <td className="px-4 py-3 text-gray-500 dark:text-gray-400">
                        {part.sku || "—"}
                      </td>
                      <td className="px-4 py-3 text-right text-gray-900 dark:text-gray-100">
                        {part.quantity}
                      </td>
                      <td className="px-4 py-3 text-right text-gray-900 dark:text-gray-100">
                        ${part.unitPrice.toFixed(2)}
                      </td>
                      <td className="px-4 py-3 text-right font-medium text-gray-900 dark:text-gray-100">
                        ${(part.quantity * part.unitPrice).toFixed(2)}
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
                      ${totalCost.toFixed(2)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
