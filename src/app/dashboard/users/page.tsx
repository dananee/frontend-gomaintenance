"use client";

import { UsersTable } from "@/features/users/components/UsersTable";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";
import { AddUserDialog } from "@/features/users/components/AddUserDialog";

export default function UsersPage() {
  const [open, setOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Users</h1>
        <Button onClick={() => setOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add User
        </Button>
      </div>

      <UsersTable />

      <AddUserDialog open={open} onOpenChange={setOpen} />
    </div>
  );
}
