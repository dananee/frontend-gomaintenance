"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { rolePermissions, Role } from "@/lib/rbac/permissions";

export default function RolesSettingsPage() {
  const roles: Role[] = ["admin", "supervisor", "mechanic", "driver"];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Roles & Permissions</CardTitle>
          <CardDescription>View available roles and their assigned permissions.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {roles.map((role) => (
              <div key={role} className="space-y-3 pb-6 border-b border-gray-100 dark:border-gray-800 last:border-0 last:pb-0">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium capitalize">{role}</h3>
                  <Badge variant="outline">{rolePermissions[role].length} permissions</Badge>
                </div>
                <div className="flex flex-wrap gap-2">
                  {rolePermissions[role].map((permission) => (
                    <Badge key={permission} variant="secondary" className="font-mono text-xs">
                      {permission}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
