"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Plus, Search, LayoutDashboard, ChevronRight } from "lucide-react";
import { SupplierModal } from "@/features/inventory/components/SupplierModal";
import { SupplierStats } from "@/features/inventory/components/SupplierStats";
import { SuppliersTable } from "@/features/inventory/components/SuppliersTable";
import { Supplier } from "@/features/inventory/types/inventory.types";
import {
  useSuppliers,
  useCreateSupplier,
  useUpdateSupplier,
  useDeleteSupplier,
} from "@/features/inventory/hooks/useSupplierMutations";
import Link from "next/link";

interface SuppliersPageProps {
  params: {
    locale: string;
  };
}

export default function SuppliersPage({ params }: SuppliersPageProps) {
  const { locale } = params;
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | undefined>(
    undefined
  );

  // API Hooks
  const { data: suppliersData, isLoading } = useSuppliers({ search });
  const createSupplierMutation = useCreateSupplier();
  const updateSupplierMutation = useUpdateSupplier();
  const deleteSupplierMutation = useDeleteSupplier();

  const suppliers = suppliersData?.data || [];

  const handleCreate = () => {
    setEditingSupplier(undefined);
    setIsModalOpen(true);
  };

  const handleEdit = (supplier: Supplier) => {
    setEditingSupplier(supplier);
    setIsModalOpen(true);
  };

  const handleSave = (supplierData: Partial<Supplier>) => {
    if (editingSupplier) {
      // Update existing supplier
      updateSupplierMutation.mutate(
        {
          id: editingSupplier.id,
          data: {
            name: supplierData.name,
            contact_name: supplierData.contact_name,
            email: supplierData.email,
            phone: supplierData.phone,
            address: supplierData.address,
            notes: supplierData.notes,
          },
        },
        {
          onSuccess: () => {
            setIsModalOpen(false);
          },
        }
      );
    } else {
      // Create new supplier
      createSupplierMutation.mutate(
        {
          name: supplierData.name!,
          contact_name: supplierData.contact_name,
          email: supplierData.email,
          phone: supplierData.phone,
          address: supplierData.address,
          notes: supplierData.notes,
        },
        {
          onSuccess: () => {
            setIsModalOpen(false);
          },
        }
      );
    }
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this supplier?")) {
      deleteSupplierMutation.mutate(id);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Header Section */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              Suppliers
            </h1>
            <p className="text-muted-foreground/80">
              Manage your parts suppliers and contacts
            </p>
          </div>
          <Button onClick={handleCreate} className="rounded-xl shadow-sm">
            <Plus className="mr-2 h-4 w-4" />
            Add Supplier
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <SupplierStats suppliers={suppliers} />

      {/* Search & Filter */}
      <div className="flex items-center">
        <div className="relative flex-1 max-w-md">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            <Search className="h-4 w-4" />
          </div>
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search suppliers by name, contact, or email..."
            className="pl-9 rounded-xl bg-background/50 backdrop-blur-sm border-muted-foreground/20 focus:bg-background transition-all"
          />
        </div>
      </div>

      {/* Suppliers Table */}
      <SuppliersTable
        suppliers={suppliers}
        isLoading={isLoading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onAdd={handleCreate}
      />

      <SupplierModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        supplier={editingSupplier}
        onSave={handleSave}
      />
    </div>
  );
}