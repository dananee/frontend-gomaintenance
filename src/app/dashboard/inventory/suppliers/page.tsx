"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Plus, Edit, Trash2, Building2, Mail, Phone } from "lucide-react";
import { SupplierModal } from "@/features/inventory/components/SupplierModal";
import { Supplier } from "@/features/inventory/types/inventory.types";
import { toast } from "sonner";

// Mock data
const mockSuppliers: Supplier[] = [
  {
    id: "1",
    name: "AutoParts Warehouse",
    contact_name: "John Smith",
    email: "john@autoparts.com",
    phone: "(555) 123-4567",
    address: "123 Industrial Blvd, City, ST 12345",
    notes: "Net 30 payment terms, 5% discount on orders over $1000",
    created_at: "2024-01-15T00:00:00Z",
    updated_at: "2024-01-15T00:00:00Z",
  },
  {
    id: "2",
    name: "Brake & Suspension Co.",
    contact_name: "Sarah Johnson",
    email: "sarah@brakesupply.com",
    phone: "(555) 234-5678",
    address: "456 Commerce Dr, City, ST 12346",
    notes: "Specializes in brake systems and suspension parts",
    created_at: "2024-02-10T00:00:00Z",
    updated_at: "2024-02-10T00:00:00Z",
  },
  {
    id: "3",
    name: "Engine Parts Direct",
    contact_name: "Mike Davis",
    email: "mike@engineparts.com",
    phone: "(555) 345-6789",
    address: "789 Motor Way, City, ST 12347",
    notes: "Fast shipping, same-day delivery available",
    created_at: "2024-03-05T00:00:00Z",
    updated_at: "2024-03-05T00:00:00Z",
  },
];

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState<Supplier[]>(mockSuppliers);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | undefined>(
    undefined
  );
  const [search, setSearch] = useState("");

  const filteredSuppliers = useMemo(() => {
    if (!search) return suppliers;
    const searchLower = search.toLowerCase();
    return suppliers.filter(
      (supplier) =>
        supplier.name.toLowerCase().includes(searchLower) ||
        supplier.contact_name?.toLowerCase().includes(searchLower) ||
        supplier.email?.toLowerCase().includes(searchLower)
    );
  }, [suppliers, search]);

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
      setSuppliers((prev) =>
        prev.map((s) =>
          s.id === editingSupplier.id
            ? { ...s, ...supplierData, updated_at: new Date().toISOString() }
            : s
        )
      );
      toast.success("Supplier updated", {
        description: "Supplier information has been updated successfully.",
      });
    } else {
      // Create new supplier
      const newSupplier: Supplier = {
        id: String(Date.now()),
        name: supplierData.name || "",
        contact_name: supplierData.contact_name,
        email: supplierData.email,
        phone: supplierData.phone,
        address: supplierData.address,
        notes: supplierData.notes,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      setSuppliers((prev) => [...prev, newSupplier]);
      toast.success("Supplier created", {
        description: "New supplier has been added to your directory.",
      });
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this supplier?")) {
      setSuppliers((prev) => prev.filter((s) => s.id !== id));
      toast.success("Supplier deleted", {
        description: "Supplier has been removed from your directory.",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Suppliers
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Manage your parts suppliers and contacts
          </p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Add Supplier
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Suppliers
            </CardTitle>
            <Building2 className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{suppliers.length}</div>
            <p className="text-xs text-gray-500">Active suppliers</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">With Email</CardTitle>
            <Mail className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {suppliers.filter((s) => s.email).length}
            </div>
            <p className="text-xs text-gray-500">Email contacts</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">With Phone</CardTitle>
            <Phone className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {suppliers.filter((s) => s.phone).length}
            </div>
            <p className="text-xs text-gray-500">Phone contacts</p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div>
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search suppliers by name, contact, or email..."
          className="max-w-md"
        />
      </div>

      {/* Suppliers Table */}
      <Card>
        <CardHeader>
          <CardTitle>Supplier Directory</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border border-gray-200 dark:border-gray-700">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Supplier Name</TableHead>
                  <TableHead>Contact Person</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Address</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSuppliers.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="text-center py-8 text-gray-500"
                    >
                      No suppliers found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredSuppliers.map((supplier) => (
                    <TableRow key={supplier.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <Building2 className="h-4 w-4 text-gray-400" />
                          {supplier.name}
                        </div>
                      </TableCell>
                      <TableCell>{supplier.contact_name || "-"}</TableCell>
                      <TableCell>
                        {supplier.email ? (
                          <a
                            href={`mailto:${supplier.email}`}
                            className="text-blue-600 hover:underline dark:text-blue-400"
                          >
                            {supplier.email}
                          </a>
                        ) : (
                          "-"
                        )}
                      </TableCell>
                      <TableCell>
                        {supplier.phone ? (
                          <a
                            href={`tel:${supplier.phone}`}
                            className="text-blue-600 hover:underline dark:text-blue-400"
                          >
                            {supplier.phone}
                          </a>
                        ) : (
                          "-"
                        )}
                      </TableCell>
                      <TableCell className="max-w-[200px] truncate">
                        {supplier.address || "-"}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(supplier)}
                            title="Edit supplier"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                            onClick={() => handleDelete(supplier.id)}
                            title="Delete supplier"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <SupplierModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        supplier={editingSupplier}
        onSave={handleSave}
      />
    </div>
  );
}
