"use client";

import { UsersTable } from "@/features/users/components/UsersTable";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Pagination } from "@/components/ui/pagination";
import { Plus, Users as UsersIcon } from "lucide-react";
import { useState, useMemo } from "react";
import { AddUserDialog } from "@/features/users/components/AddUserDialog";
import { useUsersStore } from "@/features/users/store/useUsersStore";

export default function UsersPage() {
  const [open, setOpen] = useState(false);
  const users = useUsersStore((state) => state.users);
  const hasUsers = users.length > 0;
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const totalPages = Math.ceil(users.length / pageSize);
  const paginatedUsers = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return users.slice(startIndex, startIndex + pageSize);
  }, [users, currentPage, pageSize]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Users
        </h1>
        <Button onClick={() => setOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add User
        </Button>
      </div>

      {!hasUsers ? (
        <div className="rounded-lg border border-gray-200 dark:border-gray-700">
          <EmptyState
            icon={UsersIcon}
            title="No users yet"
            description="Add team members to manage your fleet. Assign roles, track activities, and collaborate effectively."
            action={{
              label: "Add Your First User",
              onClick: () => setOpen(true),
            }}
          />
        </div>
      ) : (
        <>
          <UsersTable users={paginatedUsers} />
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            pageSize={pageSize}
            totalItems={users.length}
            onPageChange={(page) => setCurrentPage(page)}
            onPageSizeChange={(size) => {
              setPageSize(size);
              setCurrentPage(1);
            }}
          />
        </>
      )}

      <AddUserDialog open={open} onOpenChange={setOpen} />
    </div>
  );
}
