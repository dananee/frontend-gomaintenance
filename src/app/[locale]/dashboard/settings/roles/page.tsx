"use client";

import { RolesTable } from "@/features/settings/components/RolesTable";
import { PermissionsDrawer } from "@/features/settings/components/PermissionsDrawer";
import { CreateRoleDialog } from "@/features/settings/components/CreateRoleDialog";
import { useRoles } from "@/hooks/useRoles";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useTranslations } from "next-intl"; // Added this import

export default function RolesSettingsPage() {
  const { roles, isLoading, createRole, deleteRole, isCreating, isDeleting } = useRoles();
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const t = useTranslations("settings.roles");

  const handleEditRole = (roleName: string) => {
    setSelectedRole(roleName);
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setSelectedRole(null);
  };

  const handleDeleteRole = async (roleName: string) => {
    if (confirm("Are you sure you want to delete this role?")) {
      await deleteRole(roleName);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">{t("title")}</h3>
          <p className="text-sm text-muted-foreground">
            {t("description")}
          </p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          {t("createRole")}
        </Button>
      </div>

      <RolesTable
        roles={roles}
        isLoading={isLoading}
        onEditRole={handleEditRole}
        onDeleteRole={handleDeleteRole}
      />

      <PermissionsDrawer
        roleName={selectedRole}
        open={isDrawerOpen}
        onClose={handleCloseDrawer}
      />

      <CreateRoleDialog
        open={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
      />
    </div>
  );
}
