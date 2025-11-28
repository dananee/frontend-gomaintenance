"use client";

import { PartsTable } from "@/features/inventory/components/PartsTable";
import { useParts } from "@/features/inventory/hooks/useParts";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useMemo, useState } from "react";

export default function InventoryPage() {
  const { data: parts, isLoading } = useParts();
  const [search, setSearch] = useState("");
  const [warehouse, setWarehouse] = useState("all");
  const [category, setCategory] = useState("all");
  const [lowStockOnly, setLowStockOnly] = useState(false);

  const filteredParts = useMemo(() => {
    const rows = parts?.data || [];

    return rows.filter((part) => {
      const matchesSearch =
        !search ||
        part.name.toLowerCase().includes(search.toLowerCase()) ||
        part.sku?.toLowerCase().includes(search.toLowerCase());
      const matchesWarehouse = warehouse === "all" || part.location === warehouse;
      const matchesCategory = category === "all" || part.category === category;
      const matchesLowStock = !lowStockOnly || part.quantity <= (part.reorderLevel || 5);

      return matchesSearch && matchesWarehouse && matchesCategory && matchesLowStock;
    });
  }, [category, lowStockOnly, parts?.data, search, warehouse]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Inventory</h1>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Part
        </Button>
      </div>

      <div className="grid gap-3 md:grid-cols-4">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search parts or SKU"
          className="rounded-lg border border-gray-200 p-2 text-sm dark:border-gray-700 dark:bg-gray-900"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="rounded-lg border border-gray-200 p-2 text-sm dark:border-gray-700 dark:bg-gray-900"
        >
          <option value="all">All categories</option>
          <option value="engine">Engine</option>
          <option value="brakes">Brakes</option>
          <option value="tires">Tires</option>
        </select>
        <select
          value={warehouse}
          onChange={(e) => setWarehouse(e.target.value)}
          className="rounded-lg border border-gray-200 p-2 text-sm dark:border-gray-700 dark:bg-gray-900"
        >
          <option value="all">All warehouses</option>
          <option value="central">Central</option>
          <option value="east">East</option>
          <option value="mobile">Mobile</option>
        </select>
        <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
          <input
            type="checkbox"
            checked={lowStockOnly}
            onChange={(e) => setLowStockOnly(e.target.checked)}
          />
          Low stock only
        </label>
      </div>

      <PartsTable parts={filteredParts} isLoading={isLoading} />
    </div>
  );
}
