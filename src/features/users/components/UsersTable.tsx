"use client";

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
import { getInitials } from "@/lib/utils";
import { useUsersStore } from "../store/useUsersStore";

const roleColors: Record<string, string> = {
  admin: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  supervisor: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  mechanic: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  driver: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  viewer: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
};

export function UsersTable() {
  const users = useUsersStore((state) => state.users);

  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 shadow-sm dark:border-gray-700">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell className="space-x-3 py-4">
                <Avatar className="inline-flex h-10 w-10 align-middle">
                  {user.avatar && <AvatarImage src={user.avatar} alt={user.name} />}
                  <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                </Avatar>
                <span className="align-middle font-medium text-gray-900 dark:text-gray-100">{user.name}</span>
              </TableCell>
              <TableCell className="text-gray-600 dark:text-gray-300">{user.email}</TableCell>
              <TableCell className="capitalize">
                <Badge className={roleColors[user.role] ?? roleColors.viewer}>{user.role}</Badge>
              </TableCell>
              <TableCell>
                <Badge variant={user.status === "active" ? "success" : "secondary"} className="capitalize">
                  {user.status}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
