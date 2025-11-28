"use client";

import { PartsTable } from "@/features/inventory/components/PartsTable";
import { useParts } from "@/features/inventory/hooks/useParts";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function InventoryPage() {
  const { data: parts, isLoading } = useParts();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Inventory</h1>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Part
        </Button>
      </div>

      <PartsTable parts={parts?.data || []} isLoading={isLoading} />
    </div>
  );
}
