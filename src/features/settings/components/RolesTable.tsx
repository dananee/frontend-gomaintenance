"use client";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Role } from "@/services/settings/rolesService";
import { Edit2, Shield, Users, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";

interface RolesTableProps {
    roles: Role[] | undefined;
    isLoading: boolean;
    onEditRole: (roleName: string) => void;
    onDeleteRole: (roleName: string) => void;
}

export function RolesTable({ roles, isLoading, onEditRole, onDeleteRole }: RolesTableProps) {
    const t = useTranslations("settings.roles.table");

    if (isLoading) {
        return (
            <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="space-y-2">
                            <Skeleton className="h-5 w-32" />
                            <Skeleton className="h-4 w-48" />
                        </div>
                        <Skeleton className="h-8 w-20" />
                    </div>
                ))}
            </div>
        );
    }

    if (!roles || roles.length === 0) {
        return <div className="text-center py-10 text-muted-foreground">{t("noRoles")}</div>;
    }

    return (
        <div className="rounded-md border bg-card">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>{t("roleName")}</TableHead>
                        <TableHead>{t("description")}</TableHead>
                        <TableHead>{t("activeUsers")}</TableHead>
                        <TableHead>{t("permissions")}</TableHead>
                        <TableHead className="text-right">{t("actions")}</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {roles.map((role) => (
                        <TableRow key={role.role}>
                            <TableCell className="font-medium">
                                <div className="flex items-center gap-2">
                                    <Shield className="h-4 w-4 text-primary" />
                                    <span className="capitalize">{role.role}</span>
                                </div>
                            </TableCell>
                            <TableCell className="text-muted-foreground">{role.description}</TableCell>
                            <TableCell>
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <Users className="h-3 w-3" />
                                    <span>-</span> {/* Backend doesn't return user count yet, placeholder */}
                                </div>
                            </TableCell>
                            <TableCell>
                                <Badge variant="secondary" className="font-normal">
                                    {role.permissions_count} modules
                                </Badge>
                            </TableCell>
                            <TableCell className="text-right space-x-2">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => onEditRole(role.role)}
                                >
                                    <Edit2 className="h-4 w-4 mr-2" />
                                    Manage
                                </Button>
                                {/* Prevent deleting system roles */}
                                {!["admin", "manager", "technician", "viewer"].includes(role.role) && (
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                        onClick={() => onDeleteRole(role.role)}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                )}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
