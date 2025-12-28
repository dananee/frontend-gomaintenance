"use client";

import { PartsTable } from "@/features/inventory/components/PartsTable";
import { EditPartModal } from "@/features/inventory/components/EditPartModal";
import { useParts } from "@/features/inventory/hooks/useParts";
import { useCreatePart, useUpdatePart, useDeletePart } from "@/features/inventory/hooks/usePartMutations";
import { StockReceptionModal } from "@/features/inventory/components/StockReceptionModal";
import { useSuppliers } from "@/features/inventory/hooks/useSuppliers";
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
import { usePartCategories } from "@/features/inventory/hooks/usePartCategories";
import { formatCurrency } from "@/lib/formatters";
import { AnimatedNumber } from "@/components/ui/animated-number";
import { useQuery } from "@tanstack/react-query";
import { getWarehouses, Warehouse } from "@/features/inventory/api/inventory";
import { useWarehouses } from "@/features/inventory/hooks/useWarehouses";
import { useProfile } from "@/hooks/useProfile";
import { Download, FileUp, FileOutput } from "lucide-react";
import { ImportInventoryModal } from "@/features/inventory/components/ImportInventoryModal";
import { getInventoryImportTemplate, exportInventoryExcel } from "@/features/inventory/api/inventoryExcel";
import { useLocale } from "next-intl";

export default function InventoryPage() {
  const t = useTranslations("inventory");
  const { data: warehouses } = useWarehouses(true);
  const [search, setSearch] = useState("");
  const [warehouse, setWarehouse] = useState("all");
  const [category, setCategory] = useState("all");
  const [lowStockOnly, setLowStockOnly] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const { data: parts, isLoading } = useParts({
    page: currentPage,
    page_size: pageSize,
    search: search,
    category_id: category === "all" ? "" : category,
  });
  const { data: categories } = usePartCategories();
  const createPartMutation = useCreatePart();
  const updatePartMutation = useUpdatePart();
  const deletePartMutation = useDeletePart();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPart, setEditingPart] = useState<Part | undefined>(undefined);
  const [receptionPart, setReceptionPart] = useState<Part | undefined>(undefined);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const { data: suppliers } = useSuppliers();
  const { profile } = useProfile();
  const locale = useLocale();

  const role = profile?.role;
  const canImport = role && ["admin", "manager", "storekeeper"].includes(role);
  const canExport = role && ["admin", "manager"].includes(role);

  const lowStockCount = useMemo(() => {
    const rows = parts?.data || [];
    return rows.filter((part) => part.total_quantity <= part.min_quantity).length;
  }, [parts?.data]);

  const totalValue = useMemo(() => {
    const rows = parts?.data || [];
    return rows.reduce((sum, part) => sum + part.total_quantity * (part.unit_price_ht || 0), 0);
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
        warehouse === "all" || part.default_location === warehouse;
      const matchesCategory = category === "all" || part.category_id === category;
      const matchesLowStock =
        !lowStockOnly || part.total_quantity <= part.min_quantity;

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

  const handleDownloadTemplate = async () => {
    try {
      await getInventoryImportTemplate();
    } catch (error) {
      toast.error("Failed to download template");
    }
  };

  const handleSave = (partData: Partial<Part>) => {
    const isEditing = !!editingPart;

    if (isEditing && editingPart?.id) {
      // Update existing part
      updatePartMutation.mutate(
        {
          id: editingPart.id,
          data: {
            part_number: partData.part_number!,
            sku: partData.sku || "",
            name: partData.name!,
            description: partData.description,
            category_id: partData.category_id,
            brand: partData.brand,
            unit_price_ht: partData.unit_price_ht || 0,
            vat_rate: partData.vat_rate || 20,
            is_critical: partData.is_critical || false,
            unit: partData.unit || "piece",
            default_location: partData.default_location,
            supplier_id: partData.supplier_id,
            min_quantity: partData.min_quantity || 0,
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
          sku: partData.sku || "",
          name: partData.name!,
          description: partData.description,
          category_id: partData.category_id,
          brand: partData.brand,
          unit_price_ht: partData.unit_price_ht || 0,
          vat_rate: partData.vat_rate || 20,
          is_critical: partData.is_critical || false,
          unit: partData.unit || "piece",
          default_location: partData.default_location,
          supplier_id: partData.supplier_id,
          min_quantity: partData.min_quantity || 0,
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
          {canExport && (
            <Button variant="outline" onClick={() => exportInventoryExcel(locale)}>
              <FileOutput className="mr-2 h-4 w-4" />
              {t("actions.exportExcel")}
            </Button>
          )}
          {canImport && (
            <>

              <Button variant="outline" onClick={() => setIsImportModalOpen(true)}>
                <FileUp className="mr-2 h-4 w-4" />
                {t("actions.importExcel")}
              </Button>
            </>
          )}
          <Link href="/dashboard/inventory/audits">
            <Button variant="outline">
              <Package className="mr-2 h-4 w-4" />
              {t("actions.audits")}
            </Button>
          </Link>
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
                <AnimatedNumber value={parts?.data?.length || 0} decimals={0} />
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
                <AnimatedNumber value={lowStockCount} decimals={0} />
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
                <AnimatedNumber value={totalValue} currency="MAD" />
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
              <div className="text-2xl font-bold">
                <AnimatedNumber value={categories?.length || 0} decimals={0} />
              </div>
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
          {categories?.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        <select
          value={warehouse}
          onChange={(e) => setWarehouse(e.target.value)}
          className="rounded-lg border border-gray-200 p-2 text-sm dark:border-gray-700 dark:bg-gray-900"
        >
          <option value="all">{t("filters.allWarehouses")}</option>
          <option value="none">{t("details.stockAdjustment.globalStock")}</option>
          {warehouses?.map((w) => (
            <option key={w.id} value={w.id}>
              {w.name}
            </option>
          ))}
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
            onReceiveStock={(part) => setReceptionPart(part)}
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

      {receptionPart && (
        <StockReceptionModal
          isOpen={!!receptionPart}
          onClose={() => setReceptionPart(undefined)}
          partId={receptionPart.id}
          partName={receptionPart.name}
          warehouses={warehouses}
          suppliers={suppliers?.data}
        />
      )}

      <ImportInventoryModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
      />
    </div>
  );
}
