"use client";

import { UsersTable } from "@/features/users/components/UsersTable";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Pagination } from "@/components/ui/pagination";
import { TableSkeleton } from "@/components/ui/skeleton";
import { Plus, Users as UsersIcon, AlertCircle } from "lucide-react";
import { useState, useMemo } from "react";
import { AddUserDialog } from "@/features/users/components/AddUserDialog";
import { useUsers } from "@/features/users/hooks/useUsers";
import { useUsersStore } from "@/features/users/store/useUsersStore";

interface UsersPageProps {
  params: {
    locale: string;
  };
}

export default function UsersPage({ params }: UsersPageProps) {
  const { locale } = params;
  const [open, setOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Fetch users from API
  const { isLoading, isError, error } = useUsers({ page: currentPage, page_size: pageSize });
  const users = useUsersStore((state) => state.users);
  const hasUsers = users.length > 0;

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

      {isLoading ? (
        <TableSkeleton rows={5} />
      ) : isError ? (
        <div className="rounded-lg border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 p-6">
          <div className="flex items-center gap-3 text-red-700 dark:text-red-400">
            <AlertCircle className="h-5 w-5" />
            <div>
              <h3 className="font-semibold">Failed to load users</h3>
              <p className="text-sm">{error?.message || "An error occurred while fetching users"}</p>
            </div>
          </div>
        </div>
      ) : !hasUsers ? (
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