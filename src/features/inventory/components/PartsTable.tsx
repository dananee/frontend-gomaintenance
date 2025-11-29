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
import { formatCurrency } from "@/lib/utils";
import { AlertTriangle, Edit, Package } from "lucide-react";
import Link from "next/link";

interface PartsTableProps {
  parts: Part[];
  isLoading: boolean;
  onEdit?: (part: Part) => void;
}

export function PartsTable({ parts, isLoading, onEdit }: PartsTableProps) {
  if (isLoading) {
    return <TableSkeleton rows={5} />;
  }

  if (parts.length === 0) {
    return (
      <div className="flex items-center justify-center py-12 border border-gray-200 dark:border-gray-700 rounded-lg">
        <div className="text-center">
          <Package className="h-12 w-12 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
          <p className="text-sm text-gray-500 dark:text-gray-400">
            No parts found
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
              <TableHead>Name</TableHead>
              <TableHead>SKU</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Supplier</TableHead>
              <TableHead className="text-right">Quantity</TableHead>
              <TableHead className="text-right">Unit Price</TableHead>
              <TableHead className="text-right">Total Value</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {parts.map((part) => {
              const isLowStock = part.quantity <= part.min_quantity;
              const isCriticalStock = part.quantity < part.min_quantity * 0.5;
              const totalValue = part.quantity * part.cost;

              return (
                <TableRow
                  key={part.id}
                  className={`cursor-pointer transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50 ${
                    isCriticalStock
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
                          Critical
                        </Badge>
                      )}
                      {isLowStock && !isCriticalStock && (
                        <Badge
                          variant="outline"
                          className="text-xs bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800"
                        >
                          <AlertTriangle className="mr-1 h-3 w-3" />
                          Low Stock
                        </Badge>
                      )}
                    </Link>
                  </TableCell>
                  <TableCell className="font-mono text-sm">
                    {part.part_number}
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="capitalize">
                      {part.category}
                    </Badge>
                  </TableCell>
                  <TableCell>{part.location}</TableCell>
                  <TableCell>{part.supplier || "-"}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex flex-col items-end">
                      <span
                        className={`font-semibold ${
                          isCriticalStock
                            ? "text-red-600 dark:text-red-400"
                            : isLowStock
                            ? "text-yellow-600 dark:text-yellow-400"
                            : "text-gray-900 dark:text-gray-100"
                        }`}
                      >
                        {part.quantity}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        Min: {part.min_quantity}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(part.cost)}
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {formatCurrency(totalValue)}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        onEdit?.(part);
                      }}
                      title="Edit part"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
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
