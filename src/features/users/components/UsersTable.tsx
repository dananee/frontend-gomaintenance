"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TableSkeleton } from "@/components/ui/skeleton";
import { getInitials } from "@/lib/utils";
import { useUsersStore } from "../store/useUsersStore";
import { useUpdateUser } from "../hooks/useUpdateUser";
import { useDeleteUser } from "../hooks/useDeleteUser";
import { EditUserModal } from "./EditUserModal";
import { Edit, Ban, CheckCircle, Trash2, Eye, Mail } from "lucide-react";
import { resendInvite } from "../api/resendInvite";
import Link from "next/link";
import { useTranslations } from "next-intl";
import type { UserRecord } from "../store/useUsersStore";

const roleColors: Record<string, { bg: string; text: string; border: string }> =
{
  admin: {
    bg: "bg-red-50 dark:bg-red-900/20",
    text: "text-red-700 dark:text-red-400",
    border: "border-red-200 dark:border-red-800",
  },
  manager: {
    bg: "bg-blue-50 dark:bg-blue-900/20",
    text: "text-blue-700 dark:text-blue-400",
    border: "border-blue-200 dark:border-blue-800",
  },
  technician: {
    bg: "bg-amber-50 dark:bg-amber-900/20",
    text: "text-amber-700 dark:text-amber-400",
    border: "border-amber-200 dark:border-amber-800",
  },
  viewer: {
    bg: "bg-purple-50 dark:bg-purple-900/20",
    text: "text-purple-700 dark:text-purple-400",
    border: "border-purple-200 dark:border-purple-800",
  },
  driver: {
    bg: "bg-emerald-50 dark:bg-emerald-900/20",
    text: "text-emerald-700 dark:text-emerald-400",
    border: "border-emerald-200 dark:border-emerald-800",
  },
};

interface UsersTableProps {
  users?: UserRecord[];
}

export function UsersTable({ users: propUsers }: UsersTableProps = {}) {
  const t = useTranslations("users");
  const tc = useTranslations("common");
  const tt = useTranslations("toasts");

  const allUsers = useUsersStore((state) => state.users);
  const users = propUsers || allUsers;
  const { mutate: performUpdate } = useUpdateUser();
  const { mutate: performDelete } = useDeleteUser();
  const [editingUser, setEditingUser] = useState<UserRecord | null>(null);
  const [isLoading] = useState(false);

  const handleSuspend = (user: UserRecord) => {
    if (confirm(t("confirmSuspend", { name: user.name }))) {
      performUpdate(
        { id: user.id, updates: { status: "inactive" } },
        {
          onSuccess: () => {
            toast.success(tt("success.userSuspended"), {
              description: tt("success.userSuspendedDesc", { name: user.name }),
            });
          },
        }
      );
    }
  };

  const handleReactivate = (user: UserRecord) => {
    performUpdate(
      { id: user.id, updates: { status: "active" } },
      {
        onSuccess: () => {
          toast.success(tt("success.userReactivated"), {
            description: tt("success.userReactivatedDesc", { name: user.name }),
          });
        },
      }
    );
  };

  const handleDelete = (user: UserRecord) => {
    if (confirm(t("confirmDelete", { name: user.name }))) {
      performDelete(user.id, {
        onSuccess: () => {
          toast.success(tt("success.userDeleted"), {
            description: tt("success.userDeletedDesc", { name: user.name }),
          });
        },
        onError: (error: any) => {
          toast.error(error.response?.data?.error || "Failed to delete user");
        },
      });
    }
  };

  const handleResendInvite = async (user: UserRecord) => {
    try {
      await resendInvite(user.id);
      toast.success(t("toasts.resent"));
    } catch (error: any) {
      toast.error(error.response?.data?.error || tc("errors.generic"));
    }
  };

  return (
    <>
      {isLoading ? (
        <TableSkeleton rows={5} />
      ) : (
        <div className="overflow-hidden rounded-lg border border-gray-200 shadow-sm dark:border-gray-700">
          <div className="overflow-x-auto">
            <Table className="min-w-[600px]">
              <TableHeader>
                <TableRow>
                  <TableHead>{t("table.headers.user")}</TableHead>
                  <TableHead>{t("table.headers.email")}</TableHead>
                  <TableHead>{t("table.headers.phone")}</TableHead>
                  <TableHead>{t("table.headers.department")}</TableHead>
                  <TableHead>{t("table.headers.role")}</TableHead>
                  <TableHead>{t("table.headers.status")}</TableHead>
                  <TableHead className="text-right">{t("table.headers.actions")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => {
                  const roleColor = roleColors[user.role] || {
                    bg: "bg-gray-50 dark:bg-gray-800",
                    text: "text-gray-700 dark:text-gray-300",
                    border: "border-gray-200 dark:border-gray-700",
                  };

                  return (
                    <TableRow key={user.id} className="group">
                      <TableCell className="space-x-3 py-4">
                        <Link
                          href={`/dashboard/users/${user.id}`}
                          className="inline-flex items-center gap-3 hover:underline"
                        >
                          <Avatar className="h-10 w-10">
                            {user.avatar && (
                              <AvatarImage src={user.avatar} alt={user.name} />
                            )}
                            <AvatarFallback>
                              {getInitials(user.name)}
                            </AvatarFallback>
                          </Avatar>
                          <span className="font-medium text-gray-900 dark:text-gray-100">
                            {user.name}
                          </span>
                        </Link>
                      </TableCell>
                      <TableCell className="text-gray-600 dark:text-gray-300">
                        {user.email}
                      </TableCell>
                      <TableCell className="text-gray-600 dark:text-gray-300">
                        {user.phone || "-"}
                      </TableCell>
                      <TableCell className="text-gray-600 dark:text-gray-300">
                        {user.department || "-"}
                      </TableCell>
                      <TableCell className="capitalize">
                        <Badge
                          variant="outline"
                          className={`${roleColor.bg} ${roleColor.text} ${roleColor.border}`}
                        >
                          {["admin", "manager", "technician", "viewer", "driver"].includes(user.role.toLowerCase())
                            ? t(`roles.${user.role.toLowerCase()}`)
                            : user.role}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={
                            user.status === "active"
                              ? "bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800"
                              : user.status === "suspended"
                                ? "bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800"
                                : user.status === "pending"
                                  ? "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800"
                                  : "bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700"
                          }
                        >
                          {t(`status.${user.status}`)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-end gap-1">
                          <Link href={`/dashboard/users/${user.id}`}>
                            <Button
                              variant="ghost"
                              size="icon"
                              title={t("actions.view")}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setEditingUser(user)}
                            title={t("actions.edit")}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          {user.status === "pending" && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-amber-600 hover:text-amber-700 hover:bg-amber-50 dark:hover:bg-amber-900/20"
                              onClick={() => handleResendInvite(user)}
                              title={t("actions.invite")}
                            >
                              <Mail className="h-4 w-4" />
                            </Button>
                          )}
                          {user.status === "suspended" ? (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-green-600 hover:text-green-700 hover:bg-green-50 dark:hover:bg-green-900/20"
                              onClick={() => handleReactivate(user)}
                              title={t("actions.reactivate")}
                            >
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                          ) : (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-orange-600 hover:text-orange-700 hover:bg-orange-50 dark:hover:bg-orange-900/20"
                              onClick={() => handleSuspend(user)}
                              title={t("actions.suspend")}
                              disabled={user.status === "pending"}
                            >
                              <Ban className="h-4 w-4" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                            onClick={() => handleDelete(user)}
                            title={t("actions.delete")}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </div>
      )}

      {editingUser && (
        <EditUserModal
          open={!!editingUser}
          onOpenChange={(open) => !open && setEditingUser(null)}
          user={editingUser}
        />
      )}
    </>
  );
}
