"use client";

import { PartsTable } from "@/features/inventory/components/PartsTable";
import { useParts } from "@/features/inventory/hooks/useParts";
import { usePartCategories } from "@/features/inventory/hooks/usePartCategories";
import { useWarehouses } from "@/features/inventory/hooks/useWarehouses";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { CardGridSkeleton } from "@/components/ui/skeleton";
import { Pagination } from "@/components/ui/pagination";
import { Package, AlertTriangle, TrendingDown } from "lucide-react";
import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { AnimatedNumber } from "@/components/ui/animated-number";

export default function TechnicianPartsPage() {
    const t = useTranslations("inventory");
    const { data: warehouses } = useWarehouses(true);
    const [search, setSearch] = useState("");
    const [warehouse, setWarehouse] = useState("all");
    const [category, setCategory] = useState("all");
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    const { data: parts, isLoading } = useParts({
        page: currentPage,
        page_size: pageSize,
        search: search,
        category_id: category === "all" ? "" : category,
    });
    const { data: categories } = usePartCategories();

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

            return matchesSearch && matchesWarehouse && matchesCategory;
        });
    }, [category, parts?.data, search, warehouse]);

    const totalPages = Math.ceil(filteredParts.length / pageSize);
    const paginatedParts = useMemo(() => {
        const startIndex = (currentPage - 1) * pageSize;
        return filteredParts.slice(startIndex, startIndex + pageSize);
    }, [filteredParts, currentPage, pageSize]);

    const hasParts = (parts?.data || []).length > 0;

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
            </div>

            <div className="grid gap-3 md:grid-cols-3">
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
            </div>

            {!isLoading && !hasParts ? (
                <div className="rounded-lg border border-gray-200 dark:border-gray-700">
                    <EmptyState
                        icon={Package}
                        title={t("emptyStates.noParts.title")}
                        description={t("emptyStates.noParts.description")}
                    />
                </div>
            ) : (
                <>
                    <PartsTable
                        parts={paginatedParts}
                        isLoading={isLoading}
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
        </div>
    );
}
