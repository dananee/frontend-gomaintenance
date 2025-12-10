"use client";

import { PartsTable } from "@/features/inventory/components/PartsTable";
import { EditPartModal } from "@/features/inventory/components/EditPartModal";
import { useParts } from "@/features/inventory/hooks/useParts";
import { useCreatePart, useUpdatePart, useDeletePart } from "@/features/inventory/hooks/usePartMutations";
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
import { useTranslations } from "next-intl";

export default function InventoryPage() {
  const t = useTranslations("inventory");
  const { data: parts, isLoading } = useParts();
  const createPartMutation = useCreatePart();
  const updatePartMutation = useUpdatePart();
  const deletePartMutation = useDeletePart();
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
    const isEditing = !!editingPart;
    
    if (isEditing && editingPart?.id) {
      // Update existing part
      updatePartMutation.mutate(
        {
          id: editingPart.id,
          data: {
            part_number: partData.part_number,
            name: partData.name,
            description: partData.description,
            brand: partData.brand,
            unit_price: partData.unit_price || partData.cost,
          },
        },
        {
          onSuccess: () => {
            setIsModalOpen(false);
          },
        }
      );
    } else {
      // Create new part
      createPartMutation.mutate(
        {
          part_number: partData.part_number!,
          name: partData.name!,
          description: partData.description,
          brand: partData.brand,
          unit_price: partData.unit_price || partData.cost || 0,
        },
        {
          onSuccess: () => {
            setIsModalOpen(false);
          },
        }
      );
    }
  };

  const handleDelete = (part: Part) => {
    if (confirm(t("actions.deleteConfirm", { name: part.name }))) {
      deletePartMutation.mutate(part.id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {t("title")}
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {t("subtitle")}
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/dashboard/inventory/suppliers">
            <Button variant="outline">
              <Users className="mr-2 h-4 w-4" />
              {t("actions.suppliers")}
            </Button>
          </Link>
          <Button onClick={handleCreate}>
            <Plus className="mr-2 h-4 w-4" />
            {t("actions.addPart")}
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
              <CardTitle className="text-sm font-medium">{t("stats.totalParts.title")}</CardTitle>
              <Package className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {parts?.data?.length || 0}
              </div>
              <p className="text-xs text-gray-500">{t("stats.totalParts.description")}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t("stats.lowStock.title")}</CardTitle>
              <AlertTriangle className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                {lowStockCount}
              </div>
              <p className="text-xs text-gray-500">{t("stats.lowStock.description")}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t("stats.totalValue.title")}</CardTitle>
              <TrendingDown className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {totalValue.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })} MAD
              </div>
              <p className="text-xs text-gray-500">{t("stats.totalValue.description")}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t("stats.categories.title")}</CardTitle>
              <Package className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">5</div>
              <p className="text-xs text-gray-500">{t("stats.categories.description")}</p>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="grid gap-3 md:grid-cols-4">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t("filters.searchPlaceholder")}
          className="rounded-lg border border-gray-200 p-2 text-sm dark:border-gray-700 dark:bg-gray-900"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="rounded-lg border border-gray-200 p-2 text-sm dark:border-gray-700 dark:bg-gray-900"
        >
          <option value="all">{t("filters.allCategories")}</option>
          <option value="Engine">{t("filters.categories.engine")}</option>
          <option value="Brakes">{t("filters.categories.brakes")}</option>
          <option value="Tires">{t("filters.categories.tires")}</option>
          <option value="Filters">{t("filters.categories.filters")}</option>
          <option value="Fluids">{t("filters.categories.fluids")}</option>
        </select>
        <select
          value={warehouse}
          onChange={(e) => setWarehouse(e.target.value)}
          className="rounded-lg border border-gray-200 p-2 text-sm dark:border-gray-700 dark:bg-gray-900"
        >
          <option value="all">{t("filters.allWarehouses")}</option>
          <option value="Shelf A-1">{t("filters.warehouses.shelfA1")}</option>
          <option value="Shelf B-2">{t("filters.warehouses.shelfB2")}</option>
        </select>
        <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
          <input
            type="checkbox"
            checked={lowStockOnly}
            onChange={(e) => setLowStockOnly(e.target.checked)}
          />
          {t("filters.lowStockOnly")}
        </label>
      </div>

      {!isLoading && !hasParts ? (
        <div className="rounded-lg border border-gray-200 dark:border-gray-700">
          <EmptyState
            icon={Package}
            title={t("emptyStates.noParts.title")}
            description={t("emptyStates.noParts.description")}
            action={{
              label: t("actions.addFirstPart"),
              onClick: handleCreate,
            }}
            secondaryAction={{
              label: t("actions.manageSuppliers"),
              onClick: () =>
                (window.location.href = "/dashboard/inventory/suppliers"),
            }}
          />
        </div>
      ) : !isLoading && filteredParts.length === 0 && hasFilters ? (
        <div className="rounded-lg border border-gray-200 dark:border-gray-700">
          <EmptyState
            icon={Package}
            title={t("emptyStates.notFound.title")}
            description={t("emptyStates.notFound.description")}
            action={{
              label: t("actions.clearFilters"),
              onClick: () => {
                setSearch("");
                setCategory("all");
                setWarehouse("all");
                setLowStockOnly(false);
              },
            }}
            secondaryAction={{
              label: t("actions.addPart"),
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
            onDelete={handleDelete}
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
