"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Package,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Download,
  Filter,
  X,
} from "lucide-react";
import Link from "next/link";

interface Part {
  id: string;
  name: string;
  quantity: number;
  cost: number;
  date: string;
  workOrderId: string;
}

interface EnhancedPartsTableProps {
  parts: Part[];
}

type SortField = "name" | "quantity" | "cost" | "date";
type SortDirection = "asc" | "desc";

export function EnhancedPartsTable({ parts }: EnhancedPartsTableProps) {
  const [sortField, setSortField] = useState<SortField>("date");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [dateFilter, setDateFilter] = useState<string>("");
  const [nameFilter, setNameFilter] = useState<string>("");

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ArrowUpDown className="h-4 w-4 opacity-50" />;
    }
    return sortDirection === "asc" ? (
      <ArrowUp className="h-4 w-4" />
    ) : (
      <ArrowDown className="h-4 w-4" />
    );
  };

  const filteredAndSortedParts = useMemo(() => {
    let filtered = [...parts];

    // Apply filters
    if (nameFilter) {
      filtered = filtered.filter((part) =>
        part.name.toLowerCase().includes(nameFilter.toLowerCase())
      );
    }
    if (dateFilter) {
      filtered = filtered.filter((part) => part.date.startsWith(dateFilter));
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];

      if (sortField === "date") {
        aValue = new Date(a.date).getTime();
        bValue = new Date(b.date).getTime();
      }

      if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
      if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [parts, sortField, sortDirection, nameFilter, dateFilter]);

  const totalCost = useMemo(() => {
    return filteredAndSortedParts.reduce((sum, part) => sum + part.cost, 0);
  }, [filteredAndSortedParts]);

  const totalQuantity = useMemo(() => {
    return filteredAndSortedParts.reduce((sum, part) => sum + part.quantity, 0);
  }, [filteredAndSortedParts]);

  const handleExportCSV = () => {
    const headers = [
      "Part Name",
      "Quantity",
      "Cost",
      "Date Used",
      "Work Order",
    ];
    const rows = filteredAndSortedParts.map((part) => [
      part.name,
      part.quantity,
      part.cost,
      new Date(part.date).toLocaleDateString(),
      part.workOrderId,
    ]);

    const csv = [headers, ...rows].map((row) => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `parts-usage-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const clearFilters = () => {
    setNameFilter("");
    setDateFilter("");
  };

  const hasFilters = nameFilter || dateFilter;

  return (
    <Card className="shadow-md">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Package className="h-5 w-5 text-primary" />
            <CardTitle className="text-xl font-semibold">
              Parts Used & Costs
            </CardTitle>
          </div>
          <Button
            onClick={handleExportCSV}
            variant="outline"
            size="sm"
            className="gap-2"
          >
            <Download className="h-4 w-4" />
            Export CSV
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mt-4">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Filter by part name..."
              value={nameFilter}
              onChange={(e) => setNameFilter(e.target.value)}
              className="h-9 rounded-md border border-gray-200 px-3 text-sm dark:border-gray-700 dark:bg-gray-800"
            />
          </div>
          <input
            type="month"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="h-9 rounded-md border border-gray-200 px-3 text-sm dark:border-gray-700 dark:bg-gray-800"
          />
          {hasFilters && (
            <Button
              onClick={clearFilters}
              variant="ghost"
              size="sm"
              className="gap-1"
            >
              <X className="h-4 w-4" />
              Clear
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50 dark:bg-gray-800/50">
                <TableHead
                  className="cursor-pointer font-semibold hover:bg-gray-100 dark:hover:bg-gray-800"
                  onClick={() => handleSort("name")}
                >
                  <div className="flex items-center gap-2">
                    Part Name {getSortIcon("name")}
                  </div>
                </TableHead>
                <TableHead
                  className="cursor-pointer font-semibold hover:bg-gray-100 dark:hover:bg-gray-800"
                  onClick={() => handleSort("quantity")}
                >
                  <div className="flex items-center gap-2">
                    Quantity {getSortIcon("quantity")}
                  </div>
                </TableHead>
                <TableHead
                  className="cursor-pointer font-semibold hover:bg-gray-100 dark:hover:bg-gray-800"
                  onClick={() => handleSort("cost")}
                >
                  <div className="flex items-center gap-2">
                    Cost {getSortIcon("cost")}
                  </div>
                </TableHead>
                <TableHead
                  className="cursor-pointer font-semibold hover:bg-gray-100 dark:hover:bg-gray-800"
                  onClick={() => handleSort("date")}
                >
                  <div className="flex items-center gap-2">
                    Date Used {getSortIcon("date")}
                  </div>
                </TableHead>
                <TableHead className="font-semibold">Work Order</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAndSortedParts.map((part, index) => (
                <TableRow
                  key={part.id}
                  className={`cursor-pointer transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/30 ${
                    index % 2 === 0 ? "bg-white dark:bg-gray-900/20" : ""
                  }`}
                >
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <Package className="h-4 w-4 text-blue-600" />
                      {part.name}
                    </div>
                  </TableCell>
                  <TableCell>{part.quantity}</TableCell>
                  <TableCell className="font-medium">
                    ${part.cost.toLocaleString()}
                  </TableCell>
                  <TableCell>
                    {new Date(part.date).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Link
                      href={`/dashboard/work-orders/${part.workOrderId}`}
                      className="text-blue-600 hover:underline dark:text-blue-400"
                    >
                      {part.workOrderId}
                    </Link>
                  </TableCell>
                </TableRow>
              ))}

              {/* Summary Row */}
              <TableRow className="bg-gray-100 font-semibold dark:bg-gray-800">
                <TableCell>
                  Total ({filteredAndSortedParts.length} parts)
                </TableCell>
                <TableCell>{totalQuantity}</TableCell>
                <TableCell className="text-green-600 dark:text-green-400">
                  ${totalCost.toLocaleString()}
                </TableCell>
                <TableCell colSpan={2}></TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
