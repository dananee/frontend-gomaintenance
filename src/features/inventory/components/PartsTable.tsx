"use client";

import { Part } from "../types/inventory.types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TableSkeleton } from "@/components/ui/skeleton";
import { formatCurrency } from "@/lib/formatters";
import { AlertTriangle, Edit, Package, Trash2 } from "lucide-react";
import { AnimatedNumber } from "@/components/ui/animated-number";
import Link from "next/link";
import { useTranslations } from "next-intl";

interface PartsTableProps {
  parts: Part[];
  isLoading: boolean;
  onEdit?: (part: Part) => void;
  onDelete?: (part: Part) => void;
  onReceiveStock?: (part: Part) => void;
}

export function PartsTable({ parts, isLoading, onEdit, onDelete, onReceiveStock }: PartsTableProps) {
  const t = useTranslations("inventory.table");

  if (isLoading) {
    return <TableSkeleton rows={5} />;
  }

  if (parts.length === 0) {
    return (
      <div className="flex items-center justify-center py-12 border border-gray-200 dark:border-gray-700 rounded-lg">
        <div className="text-center">
          <Package className="h-12 w-12 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {t("empty")}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-md border border-gray-200 dark:border-gray-700">
      <div className="overflow-x-auto">
        <Table className="min-w-[800px]">
          <TableHeader>
            <TableRow>
              <TableHead>{t("headers.name")}</TableHead>
              <TableHead>{t("headers.sku")}</TableHead>
              <TableHead>{t("headers.category")}</TableHead>
              <TableHead>{t("headers.location")}</TableHead>
              <TableHead>{t("headers.supplier")}</TableHead>
              <TableHead className="text-right">{t("headers.quantity")}</TableHead>
              <TableHead className="text-right">{t("headers.unitPrice")}</TableHead>
              <TableHead className="text-right">{t("headers.totalValue")}</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {parts.map((part) => {
              const isLowStock = part.total_quantity <= part.min_quantity;
              const isCriticalStock = part.total_quantity < part.min_quantity * 0.5;
              const totalValue = part.total_quantity * (part.unit_price_ht || 0);

              return (
                <TableRow
                  key={part.id}
                  className={`cursor-pointer transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50 ${isCriticalStock
                    ? "bg-red-50/50 dark:bg-red-900/10 border-l-4 border-l-red-500"
                    : isLowStock
                      ? "bg-yellow-50/50 dark:bg-yellow-900/10 border-l-4 border-l-yellow-500"
                      : ""
                    }`}
                >
                  <TableCell className="font-medium">
                    <Link
                      href={`/dashboard/inventory/${part.id}`}
                      className="flex items-center gap-2 hover:underline"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {part.name}
                      {isCriticalStock && (
                        <Badge variant="destructive" className="text-xs">
                          <AlertTriangle className="mr-1 h-3 w-3" />
                          {t("badges.critical")}
                        </Badge>
                      )}
                      {isLowStock && !isCriticalStock && (
                        <Badge
                          variant="outline"
                          className="text-xs bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800"
                        >
                          <AlertTriangle className="mr-1 h-3 w-3" />
                          {t("badges.lowStock")}
                        </Badge>
                      )}
                    </Link>
                  </TableCell>
                  <TableCell className="font-mono text-sm">
                    {part.sku || part.part_number}
                  </TableCell>
                  <TableCell>
                    {part.category ? (
                      <Badge variant="secondary" className="capitalize">
                        {part.category.name}
                      </Badge>
                    ) : (
                      "-"
                    )}
                  </TableCell>
                  <TableCell>{part.default_location}</TableCell>
                  <TableCell>{part.supplier?.name || "-"}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex flex-col items-end">
                      <span
                        className={`font-semibold ${isCriticalStock
                          ? "text-red-600 dark:text-red-400"
                          : isLowStock
                            ? "text-yellow-600 dark:text-yellow-400"
                            : "text-gray-900 dark:text-gray-100"
                          }`}
                      >
                        <AnimatedNumber value={part.total_quantity} decimals={0} /> <span className="text-xs font-normal text-muted-foreground">{part.unit}</span>
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {t.rich("minQty", { count: () => <AnimatedNumber value={part.min_quantity} decimals={0} /> })}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <AnimatedNumber value={part.unit_price_ht || 0} currency="MAD" />
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    <AnimatedNumber value={totalValue} currency="MAD" />
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      {onEdit && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            onEdit(part);
                          }}
                          title={t("actions.edit")}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      )}
                      {onReceiveStock && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            onReceiveStock(part);
                          }}
                          title={t("actions.receiveStock")}
                          className="text-primary hover:text-primary hover:bg-primary/10"
                        >
                          <Package className="h-4 w-4" />
                        </Button>
                      )}
                      {onDelete && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            onDelete(part);
                          }}
                          title={t("actions.delete")}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-950"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
