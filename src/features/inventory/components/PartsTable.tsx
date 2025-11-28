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
import { formatCurrency } from "@/lib/utils";
import Link from "next/link";
import { AlertTriangle, Edit } from "lucide-react";

interface PartsTableProps {
  parts: Part[];
  isLoading: boolean;
  onEdit?: (part: Part) => void;
}

export function PartsTable({ parts, isLoading, onEdit }: PartsTableProps) {
  if (isLoading) {
    return <div>Loading inventory...</div>;
  }

  return (
    <div className="rounded-md border border-gray-200 dark:border-gray-700">
      <Table>
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
            const totalValue = part.quantity * part.cost;

            return (
              <TableRow 
                key={part.id}
                className="cursor-pointer transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50"
                onClick={() => window.location.href = `/dashboard/inventory/${part.id}`}
              >
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    {part.name}
                    {isLowStock && (
                      <Badge variant="warning" className="text-xs">
                        <AlertTriangle className="mr-1 h-3 w-3" />
                        Low Stock
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell>{part.part_number}</TableCell>
                <TableCell>{part.category}</TableCell>
                <TableCell>{part.location}</TableCell>
                <TableCell>{part.supplier || "-"}</TableCell>
                <TableCell className="text-right">
                  <span
                    className={
                      isLowStock
                        ? "font-bold text-red-600 dark:text-red-400"
                        : ""
                    }
                  >
                    {part.quantity}
                  </span>
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
  );
}
