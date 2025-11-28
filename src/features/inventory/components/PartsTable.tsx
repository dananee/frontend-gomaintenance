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
import { formatCurrency } from "@/lib/utils";

interface PartsTableProps {
  parts: Part[];
  isLoading: boolean;
}

export function PartsTable({ parts, isLoading }: PartsTableProps) {
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
            <TableHead className="text-right">Quantity</TableHead>
            <TableHead className="text-right">Unit Price</TableHead>
            <TableHead className="text-right">Total Value</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {parts.map((part) => (
            <TableRow key={part.id}>
              <TableCell className="font-medium">{part.name}</TableCell>
              <TableCell>{part.sku}</TableCell>
              <TableCell>{part.category}</TableCell>
              <TableCell>{part.location}</TableCell>
              <TableCell className="text-right">
                <span
                  className={
                    part.quantity <= part.minQuantity
                      ? "font-bold text-red-600 dark:text-red-400"
                      : ""
                  }
                >
                  {part.quantity}
                </span>
              </TableCell>
              <TableCell className="text-right">
                {formatCurrency(part.unitPrice)}
              </TableCell>
              <TableCell className="text-right">
                {formatCurrency(part.quantity * part.unitPrice)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
