"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { 
  Plus, 
  Search, 
  MoreVertical, 
  Edit2, 
  Trash2, 
  Warehouse as WarehouseIcon,
  ShieldCheck,
  MapPin,
  User,
  AlertTriangle
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useModal } from "@/hooks/useModal";
import { Modal } from "@/components/ui/modal";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

import { 
  getWarehouses, 
  createWarehouse, 
  updateWarehouse, 
  deleteWarehouse,
  Warehouse 
} from "@/features/inventory/api/inventory";
import { getUsers } from "@/features/users/api/getUsers";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function WarehousesSettingsPage() {
  const { user } = useAuth();
  const router = useRouter();
  
  useEffect(() => {
    if (user && user.role !== "admin" && user.role !== "manager") {
      router.push("/dashboard");
    }
  }, [user, router]);

  const t = useTranslations("settings.inventory.warehouses");
  const queryClient = useQueryClient();
  const { isOpen, open, close } = useModal();
  const [editingWarehouse, setEditingWarehouse] = useState<Warehouse | null>(null);
  const [search, setSearch] = useState("");

  const { data: warehousesData, isLoading } = useQuery({
    queryKey: ["warehouses", "all"],
    queryFn: () => getWarehouses(),
  });
  
  const warehouses = Array.isArray(warehousesData) ? warehousesData : (warehousesData as any)?.data || [];

  const { data: usersData } = useQuery({
    queryKey: ["users"],
    queryFn: () => getUsers(),
  });
  const users = Array.isArray(usersData) ? usersData : (usersData as any)?.data || [];

  const createMutation = useMutation({
    mutationFn: createWarehouse,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["warehouses"] });
      toast.success(t("toasts.created"));
      close();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => updateWarehouse(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["warehouses"] });
      toast.success(t("toasts.updated"));
      close();
    },
  });

  const deactivateMutation = useMutation({
    mutationFn: deleteWarehouse,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["warehouses"] });
      toast.success(t("toasts.deactivated"));
    },
  });

  const handleCreate = () => {
    setEditingWarehouse(null);
    open();
  };

  const handleEdit = (warehouse: Warehouse) => {
    setEditingWarehouse(warehouse);
    open();
  };

  const handleDeactivate = (id: string) => {
    if (confirm("Are you sure you want to deactivate this warehouse? It will no longer be available for stock movements.")) {
      deactivateMutation.mutate(id);
    }
  };

  const filteredWarehouses = warehouses.filter((w: Warehouse) => 
    w.name.toLowerCase().includes(search.toLowerCase()) ||
    w.address?.toLowerCase().includes(search.toLowerCase())
  );

  if (!user || (user.role !== "admin" && user.role !== "manager")) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">{t("title")}</h2>
          <p className="text-muted-foreground">{t("subtitle")}</p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" />
          {t("actions.add")}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search warehouses..."
              className="pl-8"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("table.name")}</TableHead>
                <TableHead>{t("table.type")}</TableHead>
                <TableHead>{t("table.manager")}</TableHead>
                <TableHead>{t("table.address")}</TableHead>
                <TableHead>{t("table.status")}</TableHead>
                <TableHead className="text-right">{t("table.actions")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">Loading...</TableCell>
                </TableRow>
              ) : filteredWarehouses.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">No warehouses found.</TableCell>
                </TableRow>
              ) : (
                filteredWarehouses.map((warehouse: Warehouse) => (
                  <TableRow key={warehouse.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <WarehouseIcon className="h-4 w-4 text-muted-foreground" />
                        {warehouse.name}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{t(`form.types.${warehouse.type}`)}</Badge>
                    </TableCell>
                    <TableCell>
                      {warehouse.manager ? (
                         <div className="flex items-center gap-2 text-sm">
                            <User className="h-3 w-3" />
                            {warehouse.manager.first_name} {warehouse.manager.last_name}
                         </div>
                      ) : "-"}
                    </TableCell>
                    <TableCell className="max-w-[150px] truncate text-muted-foreground">
                      {warehouse.address || "-"}
                    </TableCell>
                    <TableCell>
                      <Badge variant={warehouse.active ? "success" : "secondary"}>
                        {warehouse.active ? t("table.active") : t("table.inactive")}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEdit(warehouse)}>
                            <Edit2 className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          {warehouse.active && (
                            <DropdownMenuItem 
                              className="text-destructive"
                              onClick={() => handleDeactivate(warehouse.id)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Deactivate
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <WarehouseModal
        isOpen={isOpen}
        onClose={close}
        warehouse={editingWarehouse}
        users={users}
        onSave={(data) => {
          if (editingWarehouse) {
            updateMutation.mutate({ id: editingWarehouse.id, data });
          } else {
            createMutation.mutate(data as any);
          }
        }}
        isSaving={createMutation.isPending || updateMutation.isPending}
      />
    </div>
  );
}

interface WarehouseModalProps {
  isOpen: boolean;
  onClose: () => void;
  warehouse: Warehouse | null;
  users: any[];
  onSave: (data: Partial<Warehouse>) => void;
  isSaving: boolean;
}

function WarehouseModal({ isOpen, onClose, warehouse, users, onSave, isSaving }: WarehouseModalProps) {
  const t = useTranslations("settings.inventory.warehouses");
  const [formData, setFormData] = useState<Partial<Warehouse>>({
    name: warehouse?.name || "",
    type: warehouse?.type || "MAIN",
    address: warehouse?.address || "",
    manager_id: warehouse?.manager_id || "",
    allow_negative_stock: warehouse?.allow_negative_stock || false,
    active: warehouse?.active ?? true,
  });

  // Re-sync when warehouse changes (for edit mode)
  useState(() => {
    if (warehouse) {
      setFormData({
        name: warehouse.name,
        type: warehouse.type,
        address: warehouse.address,
        manager_id: warehouse.manager_id,
        allow_negative_stock: warehouse.allow_negative_stock,
        active: warehouse.active,
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Modal
      title={warehouse ? t("actions.edit") : t("actions.add")}
      isOpen={isOpen}
      onClose={onClose}
    >
      <form onSubmit={handleSubmit} className="space-y-4 pt-4">
        <div className="space-y-2">
          <Label htmlFor="name">{t("form.name")}</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="type">{t("form.type")}</Label>
            <Select 
              value={formData.type} 
              onValueChange={(val: any) => setFormData({ ...formData, type: val })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="MAIN">{t("form.types.MAIN")}</SelectItem>
                <SelectItem value="SITE">{t("form.types.SITE")}</SelectItem>
                <SelectItem value="VAN">{t("form.types.VAN")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="manager">{t("form.manager")}</Label>
            <Select 
              value={formData.manager_id || "none"} 
              onValueChange={(val) => setFormData({ ...formData, manager_id: val === "none" ? undefined : val })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select manager" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No Manager</SelectItem>
                {users.map((u) => (
                  <SelectItem key={u.id} value={u.id}>{u.first_name} {u.last_name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="address">{t("form.address")}</Label>
          <Input
            id="address"
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            placeholder="123 Storage Lane..."
          />
        </div>

        <div className="flex items-center space-x-2 pt-2">
          <Checkbox 
            id="negative" 
            checked={formData.allow_negative_stock}
            onCheckedChange={(checked) => setFormData({ ...formData, allow_negative_stock: !!checked })}
          />
          <Label htmlFor="negative" className="text-sm font-normal cursor-pointer">
            {t("form.allowNegativeStock")}
          </Label>
        </div>

        {warehouse && (
           <div className="flex items-center space-x-2">
            <Checkbox 
                id="active" 
                checked={formData.active}
                onCheckedChange={(checked) => setFormData({ ...formData, active: !!checked })}
            />
            <Label htmlFor="active" className="text-sm font-normal cursor-pointer">
                {t("form.active")}
            </Label>
          </div>
        )}

        <div className="pt-4 flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSaving}>
            {isSaving ? "Saving..." : "Save"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
