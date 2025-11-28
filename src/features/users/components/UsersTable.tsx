"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Role } from "@/lib/rbac/permissions";

interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  status: "active" | "inactive";
}

const users: User[] = [
  { id: "1", name: "John Doe", email: "john@example.com", role: "admin", status: "active" },
  { id: "2", name: "Jane Smith", email: "jane@example.com", role: "supervisor", status: "active" },
  { id: "3", name: "Mike Johnson", email: "mike@example.com", role: "mechanic", status: "active" },
  { id: "4", name: "Sarah Wilson", email: "sarah@example.com", role: "driver", status: "active" },
];

export function UsersTable() {
  return (
    <div className="rounded-md border border-gray-200 dark:border-gray-700">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell className="font-medium">{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell className="capitalize">{user.role}</TableCell>
              <TableCell>
                <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900/30 dark:text-green-400">
                  {user.status}
                </span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
