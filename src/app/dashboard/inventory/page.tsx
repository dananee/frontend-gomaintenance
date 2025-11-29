"use client";

import { PartsTable } from "@/features/inventory/components/PartsTable";
import { EditPartModal } from "@/features/inventory/components/EditPartModal";
import { useParts } from "@/features/inventory/hooks/useParts";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { CardGridSkeleton } from "@/components/ui/skeleton";
import { Pagination } from "@/components/ui/pagination";
import {
  Plus,
  Users,
  Package,
  AlertTriangle,
  TrendingDown,
} from "lucide-react";
import { useMemo, useState } from "react";
import { Part } from "@/features/inventory/types/inventory.types";
import Link from "next/link";
import { toast } from "sonner";

export default function InventoryPage() {
  const { data: parts, isLoading } = useParts();
  const [search, setSearch] = useState("");
  const [warehouse, setWarehouse] = useState("all");
  const [category, setCategory] = useState("all");
  const [lowStockOnly, setLowStockOnly] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPart, setEditingPart] = useState<Part | undefined>(undefined);

  const lowStockCount = useMemo(() => {
    const rows = parts?.data || [];
    return rows.filter((part) => part.quantity <= part.min_quantity).length;
  }, [parts?.data]);

  const totalValue = useMemo(() => {
    const rows = parts?.data || [];
    return rows.reduce((sum, part) => sum + part.quantity * part.cost, 0);
  }, [parts?.data]);

  const hasParts = (parts?.data || []).length > 0;
  const hasFilters =
    search || category !== "all" || warehouse !== "all" || lowStockOnly;

  const filteredParts = useMemo(() => {
    const rows = parts?.data || [];

    return rows.filter((part) => {
      const matchesSearch =
        !search ||
        part.name.toLowerCase().includes(search.toLowerCase()) ||
        part.part_number?.toLowerCase().includes(search.toLowerCase());
      const matchesWarehouse =
        warehouse === "all" || part.location === warehouse;
      const matchesCategory = category === "all" || part.category === category;
      const matchesLowStock =
        !lowStockOnly || part.quantity <= part.min_quantity;

      return (
        matchesSearch && matchesWarehouse && matchesCategory && matchesLowStock
      );
    });
  }, [category, lowStockOnly, parts?.data, search, warehouse]);

  const totalPages = Math.ceil(filteredParts.length / pageSize);
  const paginatedParts = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredParts.slice(startIndex, startIndex + pageSize);
  }, [filteredParts, currentPage, pageSize]);

  const handleCreate = () => {
    setEditingPart(undefined);
    setIsModalOpen(true);
  };

  const handleEdit = (part: Part) => {
    setEditingPart(part);
    setIsModalOpen(true);
  };

  const handleSave = (partData: Partial<Part>) => {
    console.log("Saving part:", partData);
    // Here we would call the mutation to create or update the part
    const isEditing = !!editingPart;
    toast.success(isEditing ? "Part updated" : "Part created", {
      description: isEditing
        ? "Part information has been updated successfully."
        : "New part has been added to your inventory.",
    });
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Inventory
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Manage parts, stock levels, and suppliers
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/dashboard/inventory/suppliers">
            <Button variant="outline">
              <Users className="mr-2 h-4 w-4" />
              Suppliers
            </Button>
          </Link>
          <Button onClick={handleCreate}>
            <Plus className="mr-2 h-4 w-4" />
            Add Part
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      {isLoading ? (
        <CardGridSkeleton count={4} />
      ) : (
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Parts</CardTitle>
              <Package className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {parts?.data?.length || 0}
              </div>
              <p className="text-xs text-gray-500">In inventory</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Low Stock</CardTitle>
              <AlertTriangle className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                {lowStockCount}
              </div>
              <p className="text-xs text-gray-500">Need reorder</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Value</CardTitle>
              <TrendingDown className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                $
                {totalValue.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </div>
              <p className="text-xs text-gray-500">Inventory worth</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Categories</CardTitle>
              <Package className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">5</div>
              <p className="text-xs text-gray-500">Part categories</p>
            </CardContent>
          </Card>
        </div>
      )}

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
          <option value="Engine">Engine</option>
          <option value="Brakes">Brakes</option>
          <option value="Tires">Tires</option>
          <option value="Filters">Filters</option>
          <option value="Fluids">Fluids</option>
        </select>
        <select
          value={warehouse}
          onChange={(e) => setWarehouse(e.target.value)}
          className="rounded-lg border border-gray-200 p-2 text-sm dark:border-gray-700 dark:bg-gray-900"
        >
          <option value="all">All warehouses</option>
          <option value="Shelf A-1">Shelf A-1</option>
          <option value="Shelf B-2">Shelf B-2</option>
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

      {!isLoading && !hasParts ? (
        <div className="rounded-lg border border-gray-200 dark:border-gray-700">
          <EmptyState
            icon={Package}
            title="No parts in inventory"
            description="Get started by adding your first part to track inventory levels, costs, and supplier information."
            action={{
              label: "Add Your First Part",
              onClick: handleCreate,
            }}
            secondaryAction={{
              label: "Manage Suppliers",
              onClick: () =>
                (window.location.href = "/dashboard/inventory/suppliers"),
            }}
          />
        </div>
      ) : !isLoading && filteredParts.length === 0 && hasFilters ? (
        <div className="rounded-lg border border-gray-200 dark:border-gray-700">
          <EmptyState
            icon={Package}
            title="No parts found"
            description="No parts match your current filters. Try adjusting your search criteria or filters."
            action={{
              label: "Clear Filters",
              onClick: () => {
                setSearch("");
                setCategory("all");
                setWarehouse("all");
                setLowStockOnly(false);
              },
            }}
            secondaryAction={{
              label: "Add Part",
              onClick: handleCreate,
            }}
          />
        </div>
      ) : (
        <>
          <PartsTable
            parts={paginatedParts}
            isLoading={isLoading}
            onEdit={handleEdit}
          />
          {filteredParts.length > 0 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              pageSize={pageSize}
              totalItems={filteredParts.length}
              onPageChange={(page) => setCurrentPage(page)}
              onPageSizeChange={(size) => {
                setPageSize(size);
                setCurrentPage(1);
              }}
            />
          )}
        </>
      )}

      <EditPartModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        part={editingPart}
        onSave={handleSave}
      />
    </div>
  );
}
